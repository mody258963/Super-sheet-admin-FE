import { mutate } from 'swr';

// Define endpoints for different admin panel sections
const endpoints = {
  users: {
    key: 'api/admin/users',
    modal: '/modal'
  },
  packages: {
    key: 'api/admin/packages',
    modal: '/modal'
  },
  subscriptions: {
    key: 'api/admin/subscriptions',
    modal: '/modal'
  },
  coaches: {
    key: 'api/admin/coaches',
    modal: '/modal'
  }
};

// Handler for Users modal
export function handleUserDialog(modal: boolean) {
  // Store modal state in localStorage for persistence
  localStorage.setItem('userModalState', JSON.stringify({ modal }));
  
  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  
  // Also use mutate for SWR cache consistency
  mutate(
    endpoints.users.key + endpoints.users.modal,
    (currentState: any) => {
      return { ...currentState, modal };
    },
    false
  );
}

// Handler for Packages modal
export function handlePackageDialog(modal: boolean) {
  // Store modal state in localStorage for persistence
  localStorage.setItem('packageModalState', JSON.stringify({ modal }));
  
  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  
  // Also use mutate for SWR cache consistency
  mutate(
    endpoints.packages.key + endpoints.packages.modal,
    (currentState: any) => {
      return { ...currentState, modal };
    },
    false
  );
}

// Handler for Subscriptions modal
export function handleSubscriptionDialog(modal: boolean) {
  // Store modal state in localStorage for persistence
  localStorage.setItem('subscriptionModalState', JSON.stringify({ modal }));
  
  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  
  // Also use mutate for SWR cache consistency
  mutate(
    endpoints.subscriptions.key + endpoints.subscriptions.modal,
    (currentState: any) => {
      return { ...currentState, modal };
    },
    false
  );
}

// Handler for Coaches modal
export function handleCoachDialog(modal: boolean) {
  // Store modal state in localStorage for persistence
  localStorage.setItem('coachModalState', JSON.stringify({ modal }));
  
  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  
  // Also use mutate for SWR cache consistency
  mutate(
    endpoints.coaches.key + endpoints.coaches.modal,
    (currentState: any) => {
      return { ...currentState, modal };
    },
    false
  );
}
