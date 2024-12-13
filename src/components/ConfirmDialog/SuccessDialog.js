import React from "react";
import "./SuccessDialog.css";

const SuccessDialog = ({ show, onClose, title, message}) => {
    if (!show) return null;

    return (
        <div className="success-dialog-overlay">
            <div className="success-dialog">
                <div className="success-dialog-header">
                    <div className="success-icon">
                        <i className="fas fa-check"></i>
                    </div>
                </div>
                <div className="success-dialog-body">
                    <h3 className="success-title">{title}</h3>
                    <p className="success-message">{message}</p>
                </div>
                <div className="success-dialog-footer">
                    <button className="success-button" onClick={onClose}>
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;
