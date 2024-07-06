// pages/api/auth.js
import { auth, signInAnonymously } from '@/firebase';

export default async function handler(req, res) {
    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        res.status(200).json({ userUid: user.uid });
    } catch (error) {
        res.status(500).json({ error: '익명 인증 실패:', error });
    }
}