import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDialog = ({ show, onClose, onConfirm, title, message, confirmLabel, cancelLabel }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    {cancelLabel || "Hủy"}
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    {confirmLabel || "Xác nhận"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDialog;
