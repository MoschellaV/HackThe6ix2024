'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import CenterSpinner from '@/components/Loaders/CenterSpinner';
import { Box, Typography } from '@mui/material';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export const UserContextProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authStateChecked, setAuthStateChecked] = useState(false);

  const {
    data: userData,
    isLoading: isLoadingUserData,
    error
  } = useQuery({
    queryKey: ['fetchUser'],
    queryFn: () => fetchUser(),
    retry: false
  });

  useEffect(() => {
    if (!authStateChecked) {
      return;
    }

    if (!user || user === null) {
      return;
    } else if (!userData || userData === null || error?.response?.data?.error === 'User not found') {
      router.push('/err');
    } else if (user && userData) {
      setUser({ ...user, doc: userData });
      router.push('/dashboard');
    }
  }, [userData, error, authStateChecked]);

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
      setAuthStateChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (isLoadingUserData) {
    return <CenterSpinner />;
  }

  return !user ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="body1" component="p" sx={{ maxWidth: 300, textAlign: 'center' }}>
        Access denied, please try logging in or create an account
      </Typography>
    </Box>
  ) : (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
