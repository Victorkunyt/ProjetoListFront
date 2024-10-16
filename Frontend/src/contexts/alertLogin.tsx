import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface CustomAlertProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type = 'error' }) => {
  const [visible, setVisible] = useState(false);
  const [previousMessage, setPreviousMessage] = useState('');
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Determine icon and colors based on alert type
  const getAlertProperties = () => {
    switch (type) {
      case 'success':
        return { icon: faCheckCircle, bgColor: '#28a745', textColor: '#ffffff' };
      case 'warning':
        return { icon: faExclamationCircle, bgColor: '#ffc107', textColor: '#212529' };
      case 'error':
      default:
        return { icon: faExclamationCircle, bgColor: '#dc3545', textColor: '#ffffff' };
    }
  };

  const { icon, bgColor, textColor } = getAlertProperties();

  useEffect(() => {
    // Show alert when message changes
    if (message) {
      setVisible(true);
      
      // If the message is the same as the previous one, reset the timer
      if (message === previousMessage) {
        if (timerId) clearTimeout(timerId); // Clear the previous timer
      } else {
        setPreviousMessage(message); // Update previous message
      }

      // Set a new timer
      const newTimerId = setTimeout(() => {
        setVisible(false);
      }, 2000);
      setTimerId(newTimerId); // Store the timer ID

      return () => clearTimeout(newTimerId); // Cleanup function
    } else {
      setVisible(false); // Hide if message is empty
    }
  }, [message, previousMessage, timerId]);

  if (!visible) {
    return null; // Render nothing if not visible
  }

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />
      <span>{message}</span>
    </div>
  );
};

export default CustomAlert;
