import React, { useEffect, useState } from "react";
import { getThongTinDangNhap } from "../../services/apiServices";
const MainPageCaNhan = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const userData = await getThongTinDangNhap(localStorage.getItem("token"));
            console.log(userData);
            setUser(userData.user);
        }
        fetchData();
    }, [])
    return (
        <div className="content bg-white p-4 m-3">
            <p className="text-primary font-weight-bold">
                <i className="fa fa-user-md"></i> THÔNG TIN CÁ NHÂN
                </p>
                <hr />
                <div className="row align-items-center">
                {/* Profile Picture */}
                <div className="col-md-3 text-center">
                    <img
                    className="rounded-circle border"
                    src={user && user.avatar}
                    width={150}
                    height={150}
                    alt="User Avatar"
                    style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* User Information */}
                <div className="col-md-9">
                    <table className="table table-borderless">
                    <tbody>
                        <tr>
                        <th scope="row" style={{ width: '30%' }}>Họ và tên:</th>
                        <td>{user?.fullName || 'N/A'}</td>
                        </tr>
                        <tr>
                        <th scope="row">Email:</th>
                        <td>{user?.email || 'N/A'}</td>
                        </tr>
                        <tr>
                        <th scope="row">Số điện thoại:</th>
                        <td>{user?.sdt || 'N/A'}</td>
                        </tr>
                        <tr>
                        <th scope="row">Quyền:</th>
                        <td>{user?.role || 'N/A'}</td>
                        </tr>
                        <tr>
                        <th scope="row">Phòng ban:</th>
                        <td>{user?.phongBan?.tenPhongBan || 'N/A'}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>

        </div>
    )
}
export default MainPageCaNhan;