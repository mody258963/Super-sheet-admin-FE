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
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// project-imports
import { handlePackageDialog } from 'api/admin-panel';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseCircle } from '@wandersonalwes/iconsax-react';

// ==============================|| PACKAGE ADD / EDIT ||============================== //

// Create a custom hook to get the modal state
const usePackageModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use localStorage to persist state across renders
    const storedState = localStorage.getItem('packageModalState');
    if (storedState) {
      setIsOpen(JSON.parse(storedState).modal);
    }

    // Set up event listener for modal state changes
    const handleStorageChange = () => {
      const storedState = localStorage.getItem('packageModalState');
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

export default function AddPackage() {
  const { isOpen } = usePackageModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '30',
    description: '',
    isActive: true
  });

  // Close the modal
  const closeModal = () => {
    handlePackageDialog(false);
    // Also update localStorage for immediate effect
    localStorage.setItem('packageModalState', JSON.stringify({ modal: false }));
    window.dispatchEvent(new Event('storage'));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would normally send data to an API
      console.log('Submitting package data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal after successful submission
      closeModal();
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        duration: '30',
        description: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error submitting package data:', error);
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

  // Handle switch change
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const packageForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Package Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        
        <TextField
          fullWidth
          label="Duration (days)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={handleSwitchChange}
              name="isActive"
              color="primary"
            />
          }
          label="Active"
        />
        
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
            title="Add New Package"
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
                packageForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
