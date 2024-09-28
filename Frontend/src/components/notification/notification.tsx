import { useState, useEffect } from 'react';
import './notification.css';
import { notifications } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatInTimeZone } from 'date-fns-tz'; // Importa a função correta

interface NotificationProps {
  reload: boolean;
}

interface Notification {
  id: string;
  type: string;
  timestamp: string;
}

const Notificationtsx = ({ reload }: NotificationProps) => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      const response = await notifications(userid, token);

      if (!userid || !token) {
        throw new Error("Usuário não autenticado.");
      }
      if (response && response.notification) {
        const notificationsWithTimestamp = response.notification.map((notification: Notification) => ({
          ...notification,
          // Ajusta o timestamp para o horário de Brasília
          timestamp: `Criado em: ${formatInTimeZone(new Date(), 'America/Sao_Paulo', 'dd-MM-yyyy')} às ${formatInTimeZone(new Date(), 'America/Sao_Paulo', 'HH:mm')}`,        }));
        setNotificationList(notificationsWithTimestamp);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [reload]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="notification-container">
      <div className="notification-content">
        <div className="bell-icon" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} size="2x" />
          {notificationList.length > 0 && (
            <span className="notification-count">{notificationList.length}</span>
          )}
        </div>
        {showNotifications && (
          <div className="notifications">
            <button className="close-button" onClick={closeNotifications}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {notificationList.map((notification) => (
              <div key={notification.id} className="notification">
                <p>{notification.type}</p>
                <p>{notification.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
};

export default Notificationtsx;
