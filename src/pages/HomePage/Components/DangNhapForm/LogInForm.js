import React, { useState } from 'react';
import './LogInForm.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
const LogInForm = ({ isVisible, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="login-overlay">
            <div className="login-form">
                <button className="close-btn" onClick={onClose}>x</button>

                <p className='text-center'><img style={{width: '50%'}}
                                                src="https://cdn.haitrieu.com/wp-content/uploads/2022/11/Logo-Truong-Dai-hoc-CNTT-va-Truyen-thong-Viet-Han-Dai-hoc-Da-Nang.png"
                                                alt=""/></p>
                <br/>
                <label htmlFor="">Email</label><br/>
                <input type="email" className='form-control' required/><br/><br/>

                <label htmlFor="">Mật khẩu</label><br/>
                <div className="password-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        required
                    />
                    <button type="button" className="eye-icon" onClick={handleTogglePassword}>
                        {showPassword ? <i className='fas fa-eye' style={{}}></i> :
                            <i className='fas fa-eye-slash' style={{}}></i>}
                    </button>
                </div>
                <br/>

                <Row>
                    <Col sm={12} md={6}><input type="checkbox"/> <span>Ghi nhớ đăng nhập</span></Col>
                    <Col sm={12} md={6} className='d-flex justify-content-end align-items-end'><p>Không có tài khoản?
                        Đăng ký</p></Col>
                </Row>

                <br/><br/>
                <p className='text-center'>
                    <button type="submit" className='btn btn-success' onClick={handleSubmit}>Đăng Nhập</button>
                </p>

            </div>
        </div>
    );
};

export default LogInForm;
