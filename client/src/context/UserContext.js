'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import CenterSpinner from '@/components/CenterSpinner';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async data => {
      if (data) {
        // user is signed in
        const { uid, email, metadata, ...rest } = data;
        const updatedUserData = {
          uid: uid,
          email: email,
          createdAt: metadata?.createdAt || new Date().toISOString(),
          ...rest
        };

        setUser(updatedUserData);
      } else {
        // user is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
