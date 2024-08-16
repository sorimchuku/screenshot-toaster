import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, get, remove as removeFromDatabase, push } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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

const getUserId = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.uid);
            } else {
                signInAnonymously(auth)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log('익명 사용자 UID:', user.uid);
                        resolve(user.uid);
                    })
                    .catch((error) => {
                        console.error('익명 인증 실패:', error);
                        reject(error);
                    });
            }
        });
    });
};

const uploadFile = async (file) => {
    const userId = await getUserId();
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
    const userId = await getUserId();
    // const userFilesRef = databaseRef(database, `users/${userId}/files/${uploadTime}`);
    const userEditorRef = databaseRef(database, `users/${userId}/editor/uploadedImages`);
    // await set(userFilesRef, fileInfo);
    await push(userEditorRef, fileInfo.url);
};

const getUserFiles = async () => {
    const userId = await getUserId();
    try {
        const userFilesRef = databaseRef(database, `users/${userId}/editor/uploadedImages`);
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
    const userId = await getUserId();
    try {
        const userFolderRef = ref(storage, `images/${userId}/`);
        const { items } = await listAll(userFolderRef);
        const deletePromises = items.map(itemRef => deleteObject(itemRef));
        await Promise.all(deletePromises);

        const userFilesRef = databaseRef(database, `users/${userId}/editor/uploadedImages`);
        await removeFromDatabase(userFilesRef);
        
        console.log('폴더 정리 성공');
    } catch (error) {
        console.error('Error deleting user files:', error);
        throw error;
    }
};

const deleteFile = async (filePath) => {
    const fileRef = ref(storage, filePath);
    const userId = await getUserId();
    const uniqueFileName = filePath.split('%2F').pop().split('_')[0];
    const userFilesRef = databaseRef(database, `users/${userId}/editor/uploadedImages`);
    await deleteObject(fileRef);
    console.log('File deleted successfully:', filePath);
    await removeFromDatabase(userFilesRef);
    console.log('Database entry deleted successfully:', uniqueFileName);
    
};


const signInAnonymouslyAndRemember = async () => {
    return signInAnonymously(auth)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('익명 사용자 UID:', user.uid);
            return user;
        })
        .catch((error) => {
            console.error('익명 인증 실패:', error);
        });
};

const checkUserSignIn = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('사용자가 로그인되어 있습니다:', user.uid);
            callback(user);
        } else {
            console.log('사용자가 로그인되어 있지 않습니다.');
        }
    });
};

export { storage, database, uploadFile, deleteFile, getUserFiles, downloadFile, deleteUserFiles, auth, getUserImagesFour, signInAnonymously, signInAnonymouslyAndRemember, checkUserSignIn, getUserId };
