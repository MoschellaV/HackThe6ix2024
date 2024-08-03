'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { logInUser } from '@/utils/auth/LogInUser';
import { signInUserWithGoogle } from '@/utils/auth/SignInUserWithGoogle';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = event => {
    const { id, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setLoading(true);
    if (!formData.email || !formData.password) {
      setErrorMessage('Missing fields!');
      setLoading(false);
      return;
    }

    const loginResponse = await logInUser(formData.email, formData.password);
    if (loginResponse.message === 'success') {
      setFormData(prevFormData => ({
        ...prevFormData,
        email: '',
        password: '',
        confirmPassword: ''
      }));

      router.push('/dashboard');
    } else {
      setErrorMessage(loginResponse.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const response = await signInUserWithGoogle();
    if (response.message === 'success') {
      router.push('/dashboard');
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <>
      <Box component="main" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '70vh',
            justifyContent: 'space-evenly'
          }}>
          <Typography component="h2" variant="h2" sx={{ textAlign: 'center' }}>
            Welcome back!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography component="p" variant="body1" sx={{ textAlign: 'center', ml: 1 }}>
              Login
            </Typography>
          </Box>
          <Button
            color="primary"
            variant="outlined"
            sx={{ width: 400, height: 46, textTransform: 'none' }}
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}>
            Continue with Google
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Divider width={100} />
            <Typography component="p" variant="subtitle1" sx={{ textAlign: 'center', fontSize: 14, mx: 1 }}>
              or
            </Typography>
            <Divider width={100} />
          </Box>

          {/* TAKE IN EMAIL */}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            sx={{ width: 400 }}
            value={formData.email}
            onChange={handleChange}
          />

          {/* TAKE IN PASSWORD */}
          <TextField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 400 }}
            value={formData.password}
            onChange={handleChange}
          />

          {errorMessage && (
            <Typography variant="p" component="p" sx={{ color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ width: 400, height: 46, textTransform: 'none', borderRadius: 8 }}
            onClick={handleSubmit}
            disabled={loading}>
            Login
            {loading && <CircularProgress size={15} sx={{ ml: 1, color: '#000', opacity: 0.5 }} />}
          </Button>

          {/* <Typography variant="subtitle1" component="p" sx={{ mt: 1, textAlign: 'center' }}>
            <Link href="/login/reset-password" style={{ textDecoration: 'underline' }}>
              Forgot your password?
            </Link>
          </Typography> */}

          <Typography variant="p" component="p" sx={{ mt: 1, textAlign: 'center' }}>
            Need an account?{' '}
            <Link href="/signup" style={{ textDecoration: 'underline' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
