'use client';

import { useEffect, useState } from 'react';

// material-ui
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// project-imports
import { handleUserDialog } from 'api/admin-panel';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseCircle } from '@wandersonalwes/iconsax-react';

// ==============================|| USER ADD / EDIT ||============================== //

// Create a custom hook to get the modal state
const useUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use localStorage to persist state across renders
    const storedState = localStorage.getItem('userModalState');
    if (storedState) {
      setIsOpen(JSON.parse(storedState).modal);
    }

    // Set up event listener for modal state changes
    const handleStorageChange = () => {
      const storedState = localStorage.getItem('userModalState');
      if (storedState) {
        setIsOpen(JSON.parse(storedState).modal);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isOpen };
};

export default function AddUser() {
  const { isOpen } = useUserModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  // Close the modal
  const closeModal = () => {
    handleUserDialog(false);
    // Also update localStorage for immediate effect
    localStorage.setItem('userModalState', JSON.stringify({ modal: false }));
    window.dispatchEvent(new Event('storage'));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would normally send data to an API
      console.log('Submitting user data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal after successful submission
      closeModal();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'user'
      });
    } catch (error) {
      console.error('Error submitting user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const userForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <FormControl fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>
        
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" color="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={closeModal}>
          <MainCard
            title="Add New User"
            modal
            sx={{
              position: 'absolute',
              width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' },
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: 1000,
              minWidth: { sm: 500 },
              '& .MuiCardContent-root': {
                p: 0
              }
            }}
            secondary={<IconButton onClick={closeModal}><CloseCircle /></IconButton>}
          >
            <SimpleBar 
              sx={{
                maxHeight: 'calc(100vh - 200px)',
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'center' }}>
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                userForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
