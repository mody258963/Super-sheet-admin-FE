'use client';

import React from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// project-imports
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import { pricingData } from 'data/membership';

// assets
import { TickCircle, Add, Trash } from '@wandersonalwes/iconsax-react';

// ==============================|| MEMBERSHIP - PRICING ||============================== //

export default function MembershipPricing() {
  const theme = useTheme();

  const colors: { [key: string]: string } = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main
  };

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'membership', to: '/admin-panel/membership/pricing' },
    { title: 'pricing' }
  ];

  // State for form fields
  const [planName, setPlanName] = React.useState('');
  const [planPrice, setPlanPrice] = React.useState('');
  const [planDuration, setPlanDuration] = React.useState('');
  const [planDescription, setPlanDescription] = React.useState('');
  const [features, setFeatures] = React.useState<{[key: string]: boolean}>({});
  const [newFeature, setNewFeature] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures(prev => ({
        ...prev,
        [newFeature]: true
      }));
      setNewFeature('');
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (featureKey: string) => {
    const updatedFeatures = { ...features };
    delete updatedFeatures[featureKey];
    setFeatures(updatedFeatures);
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureKey: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }));
  };

  // Reset form fields
  const resetForm = () => {
    setPlanName('');
    setPlanPrice('');
    setPlanDuration('');
    setPlanDescription('');
    setFeatures({});
    setNewFeature('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      // Validate inputs
      if (!planName.trim()) throw new Error('Plan name is required');
      if (!planPrice || isNaN(parseFloat(planPrice))) throw new Error('Valid price is required');
      if (!planDuration || isNaN(parseInt(planDuration))) throw new Error('Valid duration is required');
      
      const planData = {
        name: planName,
        price: parseFloat(planPrice),
        duration_days: parseInt(planDuration),
        features,
        description: planDescription
      };
      
      // Send data to API
      const response = await fetch('/api/subscription/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create plan');
      }
      
      const result = await response.json();
      console.log('Plan created:', result);
      
      // Show success message and reset form
      setSuccess(true);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the plan');
      console.error('Error creating plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs custom heading="pricing" links={breadcrumbLinks} />
      <MainCard title="Create Membership Plan">
        {error && (
          <Typography color="error" sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
            Plan created successfully!
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={GRID_COMMON_SPACING} sx={{ p: { xs: 0, sm: 3.5 } }}>
            {/* Plan Basic Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Plan Name"
                variant="outlined"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Premium Plan"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                required
                label="Price"
                variant="outlined"
                type="number"
                value={planPrice}
                onChange={(e) => setPlanPrice(e.target.value)}
                placeholder="99.99"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                required
                label="Duration (days)"
                variant="outlined"
                type="number"
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                placeholder="30"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Describe the benefits of this plan"
                sx={{ mb: 3 }}
              />
            </Grid>
            
            {/* Features Section */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 2 }}>Features</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Add new feature */}
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  variant="outlined"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter feature name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFeature}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Stack>
              
              {/* Feature list */}
              <List>
                {Object.keys(features).map((featureKey) => (
                  <ListItem
                    key={featureKey}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFeature(featureKey)}>
                        <Trash variant="Bold" color={theme.palette.error.main} />
                      </IconButton>
                    }
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={features[featureKey]}
                            onChange={() => handleFeatureToggle(featureKey)}
                            color="primary"
                          />
                        }
                        label={null}
                      />
                    </ListItemIcon>
                    <ListItemText primary={featureKey} />
                  </ListItem>
                ))}
                {Object.keys(features).length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No features added yet. Add features to highlight in your plan.
                  </Typography>
                )}
              </List>
            </Grid>
            
            {/* Submit Button */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Plan'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </>
  );
}
