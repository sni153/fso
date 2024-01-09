import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  );
};

export default Notification;