'use client';

import { useState } from 'react';
import {
  Button, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput,
  Select, Stack, TextField, Box, SelectChangeEvent
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Eye, EyeSlash } from '@wandersonalwes/iconsax-react';
import MainCard from 'components/MainCard';

export default function AddTeacher() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async () => {
    console.log('Form data before submission:', form);

    if (form.password !== form.confirmPassword) {
      console.error('Passwords do not match');
      setResponse({ success: false, message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        })
      });

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        console.error('Error during registration:', data.error || 'Registration failed');
        setResponse({ success: false, message: data.error || 'Registration failed' });
      } else {
        console.log('Admin registered successfully');
        setResponse({ success: true, message: 'Admin registered successfully!' });
        setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setResponse({ success: false, message: 'Something went wrong' });
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  return (
    <MainCard title="Register Admin" contentSX={{ p: 2.5 }}>
      <Grid container spacing={2.5}>
        <Grid xs={12} sm={6}>
          <Stack gap={1}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <TextField fullWidth id="name" value={form.name} onChange={handleChange} placeholder="Enter name" />
          </Stack>
        </Grid>
        <Grid xs={12} sm={6}>
          <Stack gap={1}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextField fullWidth id="email" value={form.email} onChange={handleChange} placeholder="Enter email" type="email" />
          </Stack>
        </Grid>
        <Grid xs={12} sm={6}>
          <Stack gap={1}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              fullWidth
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                  </Box>
                </InputAdornment>
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} sm={6}>
          <Stack gap={1}>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              fullWidth
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Enter confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                  </Box>
                </InputAdornment>
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} sm={6}>
          <Stack gap={1}>
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select id="role" value={form.role} onChange={handleRoleChange} fullWidth>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
            </Select>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack gap={1}>
            {response && (
              <Box sx={{ color: response.success ? 'green' : 'red' }}>
                {response.message}
              </Box>
            )}
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Register'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
