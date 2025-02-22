"use client";


import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User, UserCredential } from 'firebase/auth';
import { auth } from './firebase';




interface AuthInfo {
    loading: boolean;
    user: User | null ;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void
    login: (email: string, password: string) => Promise<UserCredential>;
    register: (email: string, password: string) => Promise<UserCredential>;
    updateUser: (displayName: string, photoURL: string) => Promise<void>
    logout: ()=> Promise<void>
}

type Props = {
    children: React.ReactNode;
};

const AuthContext = createContext<AuthInfo | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    // Register function
    const register = async (email: string, password: string): Promise<UserCredential> => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };


    const updateUser = async (displayName: string, photoURL: string): Promise<void> => {
        if (!auth.currentUser) throw new Error("No authenticated user found");
        return await updateProfile(auth.currentUser, { displayName, photoURL });
    };

    // Login function
    const login = async (email: string, password: string): Promise<UserCredential> => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        try {
          await signOut(auth);
          setUser(null);
        } catch (error) {
          console.error("Logout failed", error);
        }
      };
      

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            console.log(currentUser)
            console.log(loading)
        });

        return () => unsubscribe(); 
    }, []);

    const authInfo: AuthInfo = {
        user,
        setUser,
        loading,
        setLoading,
        login,
        register,
        updateUser,
        logout,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};