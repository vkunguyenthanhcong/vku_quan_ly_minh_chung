// Notification.js
import React from "react";
import "./Notification.css"; // Định nghĩa CSS riêng cho thông báo

const Notification = ({ title, message, onClose }) => {
    const closeDialog = () => {
        onClose(false);
    }
    return (
        <div className="notification-overlay">
            <div className="notification-box">
                <h3 className="notification-title">{title}</h3>
                <p className="notification-message">{message}</p>
                <button className="notification-button" onClick={closeDialog}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default Notification;
