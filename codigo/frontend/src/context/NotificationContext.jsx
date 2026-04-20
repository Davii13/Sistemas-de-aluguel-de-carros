import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const showNotification = (title, message, type = 'info') => {
    setNotification({ title, message, type });
  };

  const showConfirmation = (title, message, onConfirm) => {
    setConfirmation({ title, message, onConfirm });
  };

  const closeNotification = () => setNotification(null);
  
  const handleConfirm = () => {
    if (confirmation?.onConfirm) {
      confirmation.onConfirm();
    }
    setConfirmation(null);
  };

  const closeConfirmation = () => setConfirmation(null);

  return (
    <NotificationContext.Provider value={{ 
      notification, showNotification, closeNotification,
      confirmation, showConfirmation, closeConfirmation, handleConfirm
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
