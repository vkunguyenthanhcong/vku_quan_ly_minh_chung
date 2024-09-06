import React from 'react';

const PdfPreview = ({ show, handleClose, link }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={handleClose}>&times;</span>
                <iframe
                    src={link}
                    height="720px"
                    allow="autoplay"
                    title="Video Preview"
                ></iframe>
            </div>
        </div>
    );
};

export default PdfPreview;
