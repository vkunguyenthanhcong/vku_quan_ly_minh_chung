import React, { useState } from 'react';
import './LogInForm.css';
import { Row, Col } from 'react-bootstrap';
import { login } from '../../../../services/apiServices';
import { useNavigate } from 'react-router-dom';
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";

const LogInForm = ({ isVisible, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true);
        try {
            const userData = await login(email, password);
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                localStorage.setItem('phongBan', userData.phongBan.idPhongBan);
                setOpen(false);
                if (localStorage.getItem("role") === "ADMIN") {
                    navigate('/admin');
                } else if (localStorage.getItem("role") === "USER") {
                    navigate('/quan-ly');
                }
            } else {
                alert("Đăng Nhập Thất Bại. Vui Lòng Kiểm Tra Lại Tài Khoản Hoặc Mật Khẩu!!!");
                setError(userData.message);
                setOpen(false);
            }
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setOpen(false);
                setError('');
            }, 3*60*1000);
        }
    };

    // Xử lý thay đổi email
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Xử lý thay đổi mật khẩu
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Chuyển đổi trạng thái hiển thị mật khẩu
    const handleTogglePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Không hiển thị form nếu `isVisible` là false
    if (!isVisible) return null;

    return (
        <div className="login-overlay">
            <div className="login-form">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="text-center mb-4">
                    <img
                        className="login-logo"

                        src={require("../../../../components/images/Logo-Truong-Dai-hoc-CNTT-va-Truyen-thong-Viet-Han-Dai-hoc-Da-Nang.png")} // Replace with your logo path
                        alt="VKU Logo"
                    />
                </div>

                <form onSubmit={(e) => handleSubmit(e, email, password)}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                onClick={handleTogglePassword}
                            >
                                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <input type="checkbox" id="rememberMe"/>
                            <label htmlFor="rememberMe" className="ms-2">Ghi nhớ đăng nhập</label>
                        </div>
                        <p className="mb-0">
                            Không có tài khoản?{" "}
                            <a href="/register" className="register-link">Đăng ký</a>
                        </p>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success w-100">Đăng Nhập</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default LogInForm;
