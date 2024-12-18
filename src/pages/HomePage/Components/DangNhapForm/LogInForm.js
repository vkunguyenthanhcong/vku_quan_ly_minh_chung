import React, { useState } from 'react';
import './LogInForm.css';
import { useNavigate } from 'react-router-dom';
import {getThongTinDangNhap, login} from '../../../../services/apiServices';
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import Notification from "../../../../components/ConfirmDialog/Notification";

const LogInForm = ({ isVisible, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [denied, setDenied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true);
        try {
            const userData = await login(email, password);
          
            if(!userData.isAccept){
                setDenied(true);
            }else{
                if (userData.token) {
                    // Save user data in localStorage
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('role', userData.role);
                    localStorage.setItem('phongBan', userData.phongBan.idPhongBan);

                    const user = await getThongTinDangNhap(userData.token);
                    
                    localStorage.setItem("fullName", user.user.fullName);
                    localStorage.setItem("avatar", user.user.avatar);
                    setOpen(false);
                    // Navigate based on user role
                    if (userData.role === "ADMIN") {
                        navigate('/admin');
                    } else if (userData.role === "USER") {
                        navigate('/quan-ly');
                    }
                } else {
                    alert("Đăng Nhập Thất Bại. Vui Lòng Kiểm Tra Lại Tài Khoản Hoặc Mật Khẩu!!!");
                    setError(userData.message);
                    setOpen(false);
                }
            }
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setOpen(false);
                setError('');
            }, 3 * 60 * 1000); // Clear error after 3 minutes
        }
    };

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Do not display the form if `isVisible` is false
    if (!isVisible) return null;

    return (
        <div className="login-overlay">
            <div className="login-form">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="text-center mb-4">
                    <img
                        className="login-logo"
                        src={require("../../../../components/images/Logo-Truong-Dai-hoc-CNTT-va-Truyen-thong-Viet-Han-Dai-hoc-Da-Nang.png")}
                        alt="VKU Logo"
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
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
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe" className="ms-2">Ghi nhớ đăng nhập</label>
                        </div>
                        <p className="mb-0">
                            Không có tài khoản?{" "}
                            <a href="/dang-ky" className="register-link">Đăng ký</a>
                        </p>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success w-100">Đăng Nhập</button>
                    </div>

                    {error && <p className="text-danger mt-3">{error}</p>}
                </form>

                {open ? <LoadingProcess open={open}/> : null}
                {denied && <Notification title="Từ Chối Truy Cập" message="Bạn chưa có quyền truy cập vào hệ thống. Liên hệ quản trị viên để được giải quyết"  onClose={setDenied}/>}
            </div>
        </div>
    );
};

export default LogInForm;
