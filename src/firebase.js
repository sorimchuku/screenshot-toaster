import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, get, remove as removeFromDatabase } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid";
import { setCookie, parseCookies } from 'nookies';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const database = getDatabase(app);
const cookies = parseCookies();

const uploadFile = async (file) => {
    const userId = cookies.userUid;
    if (!userId) {
        console.error('User UID is undefined. File upload aborted.');
        return reject('User UID is undefined. File upload aborted.');
    }
    const uploadTime = new Date().toISOString().replace(/[-:.TZ]/g, '');
    // const uniqueFileName = `${uuidv4()}`;
    const storageRef = ref(storage, `images/${userId}/${uploadTime}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Upload failed", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const fileInfo = { name: file.name, url: downloadURL, path: `images/${userId}/${uploadTime}_${file.name}` };
                    await saveFileInfoToDatabase(fileInfo, uploadTime);
                    resolve(fileInfo);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

const saveFileInfoToDatabase = async (fileInfo, uploadTime) => {
    const userId = cookies.userUid;
    const userFilesRef = databaseRef(database, `users/${userId}/files/${uploadTime}`);
    await set(userFilesRef, fileInfo);
};

const getUserFiles = async (userId) => {
    try {
        const userFilesRef = databaseRef(database, `users/${userId}/files`);
        const snapshot = await get(userFilesRef);
        const files = [];
        snapshot.forEach((childSnapshot) => {
            const fileData = childSnapshot.val();
            files.push(fileData);
        });
        return files;
    } catch (error) {
        console.error('Error getting user files:', error);
        throw error;
    }
};

const getUserImagesFour = async (userId, limit = 4) => {
    const imagesRef = ref(storage, `images/${userId}`);
    const res = await listAll(imagesRef);
    const imageFiles = res.items.slice(0, limit);
    const downloadURLs = await Promise.all(imageFiles.map(async fileRef => {
        const url = await getDownloadURL(fileRef);
        const name = fileRef.name;
        return { url, name };
    }));
    return downloadURLs;
};

const downloadFile = async (filePath) => {
    try {
        const fileRef = ref(storage, filePath);
        const downloadUrl = await getDownloadURL(fileRef);
        return downloadUrl;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

const deleteUserFiles = async () => {
    const userId = cookies.userUid;
    try {
        const userFolderRef = ref(storage, `images/${userId}/`);
        const { items } = await listAll(userFolderRef);
        const deletePromises = items.map(itemRef => deleteObject(itemRef));
        await Promise.all(deletePromises);

        const userFilesRef = databaseRef(database, `users/${userId}/files`);
        await removeFromDatabase(userFilesRef);
        
        console.log('폴더 정리 성공');
    } catch (error) {
        console.error('Error deleting user files:', error);
        throw error;
    }
};

const deleteFile = async (filePath) => {
    const fileRef = ref(storage, filePath);
    const userId = cookies.userUid;
    const uniqueFileName = filePath.split('%2F').pop().split('_')[0];
    const userFilesRef = databaseRef(database, `users/${userId}/files/${uniqueFileName}`);
    await deleteObject(fileRef);
    console.log('File deleted successfully:', filePath);
    await removeFromDatabase(userFilesRef);
    console.log('Database entry deleted successfully:', uniqueFileName);
    
};

const signInAndSetCookie = () => {
    return signInAnonymously(auth)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('익명 사용자 UID1:', user.uid);
            setCookie(null, 'userUid', user.uid, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
                sameSite: 'None',
                secure: true,
            });
        })
        .catch((error) => {
            console.error('익명 인증 실패:', error);
        });
};

export { storage, database, uploadFile, deleteFile, getUserFiles, downloadFile, deleteUserFiles, auth, signInAndSetCookie, getUserImagesFour };
