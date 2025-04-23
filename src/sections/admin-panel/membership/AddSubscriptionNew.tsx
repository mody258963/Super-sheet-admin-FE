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
import FormHelperText from '@mui/material/FormHelperText';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project-imports
import { handleSubscriptionDialog } from 'api/admin-panel';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseCircle, Calendar, Wallet } from '@wandersonalwes/iconsax-react';

// Types for subscription form
interface Coach {
  coach_id: number;
  name: string;
  email: string;
}

interface Plan {
  plan_id: number;
  name: string;
  price: number | string;
  duration_days: number;
}

interface SubscriptionFormData {
  coach_id: number | string;
  plan_id: number | string;
  start_date: Date | null;
  end_date: Date | null;
  payment_status: 'paid' | 'pending' | 'failed';
  payment_method: string;
  payment_reference: string;
  payment_notes: string;
}

// Form validation errors interface
interface FormErrors {
  coach_id?: string;
  plan_id?: string;
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  payment_reference?: string;
}

// Payment method options
const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' }
];

// Payment status options
const paymentStatuses = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }
];

// ==============================|| SUBSCRIPTION ADD / EDIT ||============================== //

// Create a custom hook to get the modal state
const useSubscriptionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use localStorage to persist state across renders
    const storedState = localStorage.getItem('subscriptionModalState');
    if (storedState) {
      setIsOpen(JSON.parse(storedState).modal);
    }

    // Set up event listener for modal state changes
    const handleStorageChange = () => {
      const storedState = localStorage.getItem('subscriptionModalState');
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

export default function AddSubscription() {
  const { isOpen } = useSubscriptionModal();
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    type: 'success' as 'success' | 'error' 
  });
  
  // Form state
  const [formData, setFormData] = useState<SubscriptionFormData>({
    coach_id: '',
    plan_id: '',
    start_date: new Date(),
    end_date: null,
    payment_status: 'pending',
    payment_method: '',
    payment_reference: '',
    payment_notes: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch coaches and plans data when component mounts
  useEffect(() => {
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const response = await fetch('/api/coaches');
        if (response.ok) {
          const data = await response.json();
          setCoaches(data.coaches || []);
        } else {
          // Fallback data for testing
          setCoaches([
            { coach_id: 1, name: 'John Doe', email: 'john@example.com' },
            { coach_id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { coach_id: 3, name: 'Alex Johnson', email: 'alex@example.com' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching coaches:', error);
        // Fallback data for testing
        setCoaches([
          { coach_id: 1, name: 'John Doe', email: 'john@example.com' },
          { coach_id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { coach_id: 3, name: 'Alex Johnson', email: 'alex@example.com' }
        ]);
      } finally {
        setLoadingCoaches(false);
      }
    };

    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await fetch('/api/subscription/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(Array.isArray(data) ? data : (data.plans || []));
        } else {
          // Fallback data for testing
          setPlans([
            { plan_id: 1, name: 'Basic Plan', price: 49.99, duration_days: 30 },
            { plan_id: 2, name: 'Premium Plan', price: 99.99, duration_days: 90 },
            { plan_id: 3, name: 'Pro Plan', price: 199.99, duration_days: 365 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback data for testing
        setPlans([
          { plan_id: 1, name: 'Basic Plan', price: 49.99, duration_days: 30 },
          { plan_id: 2, name: 'Premium Plan', price: 99.99, duration_days: 90 },
          { plan_id: 3, name: 'Pro Plan', price: 199.99, duration_days: 365 }
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchCoaches();
    fetchPlans();
  }, []);

  // Close the modal
  const closeModal = () => {
    handleSubscriptionDialog(false);
    // Also update localStorage for immediate effect
    localStorage.setItem('subscriptionModalState', JSON.stringify({ modal: false }));
    window.dispatchEvent(new Event('storage'));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.coach_id) {
      newErrors.coach_id = 'Coach is required';
    }
    
    if (!formData.plan_id) {
      newErrors.plan_id = 'Plan is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    if (formData.payment_status === 'paid' && !formData.payment_method) {
      newErrors.payment_method = 'Payment method is required for paid subscriptions';
    }
    
    if (formData.payment_status === 'paid' && !formData.payment_reference) {
      newErrors.payment_reference = 'Payment reference is required for paid subscriptions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update end date based on selected plan and start date
  const updateEndDate = (planId: number | string, startDate: Date | null) => {
    if (!planId || !startDate) return;
    
    const selectedPlan = plans.find(plan => plan.plan_id === Number(planId));
    if (selectedPlan && startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);
      setFormData(prev => ({ ...prev, end_date: endDate }));
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // If plan or start date changed, update end date
      if (name === 'plan_id' && prev.start_date) {
        updateEndDate(value as number | string, prev.start_date);
      }
      
      return updatedData;
    });
  };

  // Handle date changes
  const handleDateChange = (date: Date | null, fieldName: 'start_date' | 'end_date') => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: date };
      
      // If start date changed and plan is selected, update end date
      if (fieldName === 'start_date' && date && prev.plan_id) {
        updateEndDate(prev.plan_id, date);
        return { ...updatedData, end_date: updatedData.end_date };
      }
      
      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Format dates for API
      const apiData = {
        ...formData,
        start_date: formData.start_date ? formData.start_date.toISOString() : null,
        end_date: formData.end_date ? formData.end_date.toISOString() : null
      };
      
      // Send data to API
      const response = await fetch('/api/subscription/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Subscription created successfully',
        type: 'success'
      });
      
      // Close modal after successful submission
      closeModal();
      
      // Reset form
      setFormData({
        coach_id: '',
        plan_id: '',
        start_date: new Date(),
        end_date: null,
        payment_status: 'pending',
        payment_method: '',
        payment_reference: '',
        payment_notes: ''
      });
    } catch (error: any) {
      console.error('Error submitting subscription data:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to create subscription',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Modal */}
      {isOpen && (
        <Modal open={isOpen} onClose={closeModal}>
          <MainCard
            title="Assign Package to Coach"
            modal
            sx={{
              position: 'absolute',
              width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' },
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: 800,
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
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3} sx={{ p: 3 }}>
                    {/* Coach Selection */}
                    <FormControl fullWidth error={!!errors.coach_id}>
                      <InputLabel id="coach-select-label">Coach</InputLabel>
                      <Select
                        labelId="coach-select-label"
                        id="coach-select"
                        name="coach_id"
                        value={formData.coach_id}
                        onChange={handleChange}
                        label="Coach"
                        disabled={loadingCoaches}
                      >
                        {coaches.map((coach) => (
                          <MenuItem key={coach.coach_id} value={coach.coach_id}>
                            {coach.name} ({coach.email})
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.coach_id && (
                        <FormHelperText>{errors.coach_id}</FormHelperText>
                      )}
                    </FormControl>
                    
                    {/* Plan Selection */}
                    <FormControl fullWidth error={!!errors.plan_id}>
                      <InputLabel id="plan-select-label">Package</InputLabel>
                      <Select
                        labelId="plan-select-label"
                        id="plan-select"
                        name="plan_id"
                        value={formData.plan_id}
                        onChange={handleChange}
                        label="Package"
                        disabled={loadingPlans}
                      >
                        {plans.map((plan) => (
                          <MenuItem key={plan.plan_id} value={plan.plan_id}>
                            {plan.name} (${plan.price} / {plan.duration_days} days)
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.plan_id && (
                        <FormHelperText>{errors.plan_id}</FormHelperText>
                      )}
                    </FormControl>
                    
                    {/* Date Pickers */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl fullWidth error={!!errors.start_date}>
                          <DatePicker
                            label="Start Date"
                            value={formData.start_date}
                            onChange={(date) => handleDateChange(date, 'start_date')}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.start_date
                              }
                            }}
                          />
                          {errors.start_date && (
                            <FormHelperText>{errors.start_date}</FormHelperText>
                          )}
                        </FormControl>
                      </LocalizationProvider>
                      
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl fullWidth error={!!errors.end_date}>
                          <DatePicker
                            label="End Date"
                            value={formData.end_date}
                            onChange={(date) => handleDateChange(date, 'end_date')}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.end_date
                              }
                            }}
                          />
                          {errors.end_date && (
                            <FormHelperText>{errors.end_date}</FormHelperText>
                          )}
                        </FormControl>
                      </LocalizationProvider>
                    </Stack>
                    
                    <Divider />
                    
                    {/* Payment Information */}
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Information
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel id="payment-status-label">Payment Status</InputLabel>
                      <Select
                        labelId="payment-status-label"
                        id="payment-status"
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleChange}
                        label="Payment Status"
                      >
                        {paymentStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    {formData.payment_status === 'paid' && (
                      <>
                        <FormControl fullWidth error={!!errors.payment_method}>
                          <InputLabel id="payment-method-label">Payment Method</InputLabel>
                          <Select
                            labelId="payment-method-label"
                            id="payment-method"
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            label="Payment Method"
                          >
                            {paymentMethods.map((method) => (
                              <MenuItem key={method.value} value={method.value}>
                                {method.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.payment_method && (
                            <FormHelperText>{errors.payment_method}</FormHelperText>
                          )}
                        </FormControl>
                        
                        <TextField
                          fullWidth
                          label="Payment Reference"
                          name="payment_reference"
                          value={formData.payment_reference}
                          onChange={handleChange}
                          error={!!errors.payment_reference}
                          helperText={errors.payment_reference}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Wallet size={20} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}
                    
                    <TextField
                      fullWidth
                      label="Payment Notes"
                      name="payment_notes"
                      value={formData.payment_notes}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      placeholder="Add any relevant payment notes or comments here"
                    />
                    
                    <Divider />
                    
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                      <Button variant="outlined" color="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                      <Button variant="contained" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Assign Package'}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
