import React, { useState } from 'react';
import './PopupForm.css';
import {saveGoiY, saveMinhChung} from "../../../../../services/apiServices"; // Optional: for styling

const PopupForm = ({ isVisible, onClose, idMocChuan , fetchGoiY }) => {
    
    const [inputValue, setInputValue] = useState('');
    const [isChecked, setIsChecked] = useState(true);

    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleCheckboxChange = (e) => setIsChecked(e.target.checked);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const goiY = new FormData();

        goiY.append('tenGoiY', inputValue);
        goiY.append('batBuoc', isChecked ? '1' : '0');
        goiY.append('idMocChuan', idMocChuan);

        try {
            const response = await saveGoiY(goiY);
            fetchGoiY();
            setInputValue('');
        }catch (e) {
            console.log(e);
        }
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-form">
                <button className="close-btn" onClick={onClose}>x</button>
                    <div>
                        <label htmlFor="inputField">Gợi ý:</label><br/><br/>
                        <input
                            className='form-control'
                            type="text"
                            id="inputField"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div><br/>
                    <div>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                             <span> Gợi ý bắt buộc</span>
                    </div><br/>
                    <button type="submit" className='btn btn-success' onClick={handleSubmit}>Thêm</button>

            </div>
        </div>
    );
};

export default PopupForm;
