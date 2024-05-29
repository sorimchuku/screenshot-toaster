import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, get, remove as removeFromDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid";

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

const uploadFile = async (file) => {
    const uniqueFileName = `${uuidv4()}`;
    const storageRef = ref(storage, `images/${uniqueFileName}_${file.name}`);
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
                    const fileInfo = { name: file.name, url: downloadURL, path: `images/${uniqueFileName}_${file.name}` };
                    await saveFileInfoToDatabase(fileInfo, uniqueFileName);
                    resolve(fileInfo);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

const saveFileInfoToDatabase = async (fileInfo, uniqueFileName) => {
    const userId = localStorage.getItem('userUid');
    const userFilesRef = databaseRef(database, `users/${userId}/files/${uniqueFileName}`);
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

const deleteFile = async (filePath) => {
    const fileRef = ref(storage, filePath);
    const userId = localStorage.getItem('userUid');
    const uniqueFileName = filePath.split('/').pop().split('_')[0];
    const userFilesRef = databaseRef(database, `users/${userId}/files/${uniqueFileName}`);
    await deleteObject(fileRef);
    await removeFromDatabase(userFilesRef);
};

signInAnonymously(auth)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('익명 사용자 UID:', user.uid);
        localStorage.setItem('userUid', user.uid);
    })
    .catch((error) => {
        console.error('익명 인증 실패:', error);
    });

export { storage, uploadFile, deleteFile, getUserFiles, auth };
