const Notification = ({ message, result }) => {
  if (!message) {
    return null;
  }
  return <div className={result}>{message}</div>;
};

export default Notification;