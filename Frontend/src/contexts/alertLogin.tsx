import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface CustomAlertProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type = 'error' }) => {
  const [closed, setClosed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  let icon;
  let bgColor;
  let textColor;

  switch (type) {
    case 'success':
      icon = faCheckCircle;
      bgColor = '#28a745';
      textColor = '#ffffff';
      break;
    case 'warning':
      icon = faExclamationCircle;
      bgColor = '#ffc107';
      textColor = '#212529';
      break;
    case 'error':
    default:
      icon = faExclamationCircle;
      bgColor = '#dc3545';
      textColor = '#ffffff';
      break;
  }

  useEffect(() => {
    if (message !== errorMessage) {
      setClosed(false);
      setErrorMessage(message);

      const timer = setTimeout(() => {
        setClosed(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, errorMessage]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!closed) {
      timer = setTimeout(() => {
        setClosed(true);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [closed]);

  if (closed) {
    return null;
  }

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />
      <span>{errorMessage}</span>
    </div>
  );
};

export default CustomAlert;
