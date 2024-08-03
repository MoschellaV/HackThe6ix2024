'use client';
import { resetPasswordEmail } from '@/utils/auth/ResetPasswordEmail';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccess(false);

    if (!email) {
      setLoading(false);
      setErrorMessage('Field cannot be empty');
      return;
    }

    const response = await resetPasswordEmail(email);

    if (response.message === 'success') {
      setSuccess(true);
    } else {
      setErrorMessage(response.message);
    }

    setLoading(false);
  };

  return (
    <Box component="main" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '40vh',
          justifyContent: 'space-evenly'
        }}>
        <Typography component="h2" variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
          Reset Your Password
        </Typography>
        <TextField
          id="email"
          label="Enter email"
          variant="outlined"
          sx={{ width: 400 }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {success && (
          <Alert severity="success" sx={{ width: '100%', my: 2, width: 400 }}>
            Password reset email sent! Check your inbox, enter your new password, and try logging in again.
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', my: 2, width: 400 }}>
            {errorMessage}
          </Alert>
        )}
        <Button
          variant="contained"
          sx={{ width: 400, height: 46, textTransform: 'none', borderRadius: 8 }}
          onClick={handleSubmit}
          disabled={loading}>
          Submit
          {loading && <CircularProgress size={15} sx={{ ml: 1, color: '#000', opacity: 0.5 }} />}
        </Button>
        <Typography variant="subtitle1" component="p" sx={{ mt: 1, textAlign: 'center' }}>
          <Link href="/login" style={{ textDecoration: 'underline', color: '#000' }}>
            Go back to login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
