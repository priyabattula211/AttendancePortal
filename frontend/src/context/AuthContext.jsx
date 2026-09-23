import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseClient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    setToken(idToken);
                    
                    // Fetch profile from Firestore
                    const docRef = doc(db, "users", firebaseUser.uid);
                    const profileRequest = getDoc(docRef);
                    const profileTimeout = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Profile request timed out')), 2500);
                    });
                    const docSnap = await Promise.race([profileRequest, profileTimeout]);
                    
                    if (docSnap.exists()) {
                        const profile = { ...firebaseUser, ...docSnap.data() };
                        localStorage.setItem(`mitra-profile-${firebaseUser.uid}`, JSON.stringify(docSnap.data()));
                        setUser(profile);
                    } else {
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error fetching profile", error);
                    try {
                        const cachedProfile = JSON.parse(localStorage.getItem(`mitra-profile-${firebaseUser.uid}`));
                        setUser({ ...firebaseUser, ...cachedProfile });
                    } catch {
                        setUser(firebaseUser);
                    }
                }
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, token, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
