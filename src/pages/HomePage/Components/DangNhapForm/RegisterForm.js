import React, {useEffect, useState} from "react";
import "./SignUpLecturer.css";
import {getPhongBanWithoutToken, registerUser, uploadImageAvatar} from "../../../../services/apiServices";
import {useNavigate} from "react-router-dom";

const SignUpLecturer = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        idPhongBan: ""
    });
    const [profileImage, setProfileImage] = useState(null);
    const [phongBan, setPhongBan] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchPhongBan = async () => {
            try {
                const phongBanData = await getPhongBanWithoutToken();
                setPhongBan(phongBanData);
            } catch (error) {
                console.error("Failed to fetch Phong Ban:", error);
            }
        };

        fetchPhongBan();
    }, []);

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.phone || !formData.email) {
                alert("Vui lòng điền đầy đủ thông tin");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Vui lòng nhập email hợp lệ");
                return;
            }
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) {
                alert("Số điện thoại phải bao gồm đúng 10 chữ số");
                return;
            }
        } else if (step === 2) {
            if (!formData.password) {
                alert("Vui lòng nhập mật khẩu");
                return;
            }
            if(formData.password.length < 6) {
                alert("Mật khẩu phải lớn hơn 6 kí tự");
                return;
            }
        }
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => setStep((prevStep) => prevStep - 1);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Update the profileImage state with the file
            setProfileImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // Set the image preview state
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await uploadImageAvatar(profileImage);
        const formDataToSubmit = new FormData();
        if (response) {
            formDataToSubmit.append('fullName', formData.fullName);
            formDataToSubmit.append('email', formData.email);
            formDataToSubmit.append('phone', formData.phone);
            formDataToSubmit.append('password', formData.password);
            formDataToSubmit.append('idPhongBan', formData.idPhongBan);
            formDataToSubmit.append('avatar', response);
            const responseRegister = await registerUser(formDataToSubmit);
            if (responseRegister) {
                navigate("/");
            } else {
                alert("Tài khoản đã tồn tại");
            }
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2>Thông Tin Cá Nhân</h2>
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                required
                                min="0"
                                onInput={(e) => e.target.value = e.target.value.slice(0, 10)}
                            />

                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <h2>Thông Tin Bảo Mật</h2>
                        <div className="form-group">
                        <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                        </div>
                    </>
                );

            case 3:
                return (
                    <>
                        <h2>Thông Tin Cá Nhân</h2>
                        <div className="form-group">
                            <label>Phòng ban</label>
                            <select
                                name="idPhongBan"
                                value={formData.idPhongBan}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn phòng ban</option>
                                {phongBan.map((item) => (
                                    <option key={item.idPhongBan} value={item.idPhongBan}>
                                        {item.tenPhongBan}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ảnh đại diện</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {previewImage && (
                                <div className="image-preview">
                                    <img src={previewImage} alt="Preview"/>
                                </div>
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (

        <div className="signup-container">
            <style>
                {
                    `
                /* SignUpLecturer.css */

/* Tổng quan form */
.signup-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

/* Tiêu đề */
h2 {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

/* Thanh tiến trình */
.progress-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    position: relative;
}

.progress-bar::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 4px;
    background: #e0e0e0;
    z-index: 0;
    transform: translateY(-50%);
}

.progress-step {
    width: 40px;
    height: 40px;
    background-color: #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #999;
    z-index: 1;
    position: relative;
}

.progress-step.active {
    background-color: #4caf50;
    color: #fff;
}

/* Các nhóm form */
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #555;
}

input, select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s ease;
}

input:focus, select:focus {
    border-color: #4caf50;
    outline: none;
}

/* Image Preview */
.image-preview {
    margin-top: 10px;
    text-align: center;
}

.image-preview img {
    max-width: 100px;
    height: auto;
    border-radius: 50%;
    border: 2px solid #ddd;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Navigation Buttons */
.form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="button"] {
    background-color: #e0e0e0;
    color: #555;
}

button[type="button"]:hover {
    background-color: #d6d6d6;
}

button[type="submit"], button[type="button"]:nth-child(2) {
    background-color: #4caf50;
    color: #fff;
}

button[type="submit"]:hover, button[type="button"]:nth-child(2):hover {
    background-color: #45a049;
}

/* Responsive Design */
@media (max-width: 768px) {
    .signup-container {
        padding: 15px;
    }

    h2 {
        font-size: 20px;
    }

    input, select {
        font-size: 14px;
    }

    button {
        font-size: 14px;
        padding: 8px 16px;
    }
}
`
                }
            </style>
            <img
                className="login-logo"
                src={require("../../../../components/images/Logo-Truong-Dai-hoc-CNTT-va-Truyen-thong-Viet-Han-Dai-hoc-Da-Nang.png")}
                alt="VKU Logo"
            />
            <div className="progress-bar">
                {[1, 2, 3].map((stepNumber) => (
                    <div
                        key={stepNumber}
                        className={`progress-step ${step >= stepNumber ? "active" : ""}`}
                    >
                        {stepNumber}
                    </div>
                ))}
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                {renderStepContent()}

                <div className="form-navigation">
                    {step > 1 && (
                        <button type="button" onClick={handlePreviousStep}>
                            Quay lại
                        </button>
                    )}
                    {step < 3 ? (
                        <button type="button" onClick={handleNextStep}>
                            Tiếp tục
                        </button>
                    ) : (
                        <button type="submit">Đăng Ký</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SignUpLecturer;