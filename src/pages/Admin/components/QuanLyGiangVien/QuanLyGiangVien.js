import React, {useEffect, useState} from 'react';
import {getAllUser, getPhongBan, updateUser} from "../../../../services/apiServices";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import SuccessDialog from "../../../../components/ConfirmDialog/SuccessDialog";

const formatPhoneNumber = (phoneNumber) => {
    // Use a regex to format the phone number
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
};

function QuanLyGiangVien() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phongBan, setPhongBan] = useState([]);
    const [open, setOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userData = await getAllUser();
                const phongBanData = await getPhongBan();
                setPhongBan(phongBanData);
                if (userData) {
                    setUser(userData.userList);
                }
            } catch (e) {
                setError(e)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])
    const handleChangePhongBan = (userId, event) => {
        const newIdPhongBan = event.target.value;
        setUser((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        phongBan: {
                            ...user.phongBan,
                            idPhongBan: newIdPhongBan,
                            tenPhongBan: phongBan.find(pb => pb.idPhongBan === parseInt(newIdPhongBan)).tenPhongBan,
                        },
                    }
                    : user
            )
        );
    };
    const handleChangeIsAccept = (userId, event) => {
        const newAccept = event.target.checked;
        setUser((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId // Match based on itemId
                    ? {
                        ...user,
                        isAccept: newAccept, // Update isAccept property
                    }
                    : user
            )
        );
    };
    const editGiangVien = async (idGiangVien) => {
        setOpen(true)
        const filterGiangVien = user.find((item) => item.id === idGiangVien);

        if (filterGiangVien) {
            const formData = {
                id : filterGiangVien.id,
                idPhongBan : filterGiangVien.phongBan.idPhongBan,
                isAccept : filterGiangVien.isAccept
            }
            try {
                const response = await updateUser(formData);
                if(response == "OK"){
                    setOpen(false);
                    handleShowDialog();
                }
            }catch (e) {
                setOpen(false)
                console.log(e)
            }
        }
    }
    if (loading) {
        return (<p>Loading...</p>)
    }
    if (error) {
        return error
    }
    return (<div className="content" style={{background: "white", margin: "20px"}}>
        <LoadingProcess open={open}/>
        <SuccessDialog
            show={showDialog}
            onClose={handleCloseDialog}
            title="Cập Nhật Thành Công"
            message="Quá trình cập nhật hoàn tất"
        />
        <TableContainer component={Paper}>
            <Table className="font-Inter">
                <TableHead>
                    <TableRow id="table-row-color">
                        <TableCell className="text-white">STT</TableCell>
                        <TableCell className="text-white">Họ và tên</TableCell>
                        <TableCell className="text-white">Email</TableCell>
                        <TableCell className="text-white">Số điện thoại</TableCell>

                        <TableCell className="text-white">Phòng ban</TableCell>
                        <TableCell className="text-white">Quyền truy cập</TableCell>
                        <TableCell className="text-white">Hình ảnh</TableCell>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user ? user.map((item, index) => (<TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {item.isEditing ? (<input
                                className="form-control"
                                style={{width: '500px'}}
                                type="text"
                                value={item.fullName}
                            />) : (item.fullName)}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{formatPhoneNumber(item.sdt)}</TableCell>

                        <TableCell>
                            <select className="form-select" value={item.phongBan.idPhongBan}
                                    onChange={(e) => handleChangePhongBan(item.id, e)}>
                                {phongBan.map((data) => (
                                    <option key={data.idPhongBan} value={data.idPhongBan}>
                                        {data.tenPhongBan}
                                    </option>))}
                            </select>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                            <input
                                className="form-check-input mx-auto"
                                type="checkbox"
                                checked={item.isAccept} // Reflect the current state
                                onChange={(event) => handleChangeIsAccept(item.id, event)}
                            />
                        </TableCell>
                        <TableCell>
                            <img src={item.avatar} width="50" height="50"/>
                        </TableCell>
                        <TableCell>
                        <div className="d-flex flex-column align-items-start gap-2 btn-group-vertical" role="group">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => editGiangVien(item.id)}
                                >
                                    <i className="fas fa-edit me-2"></i>Sửa
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    <i className="fas fa-trash-alt me-2"></i>Xóa
                                </button>
                            </div>
                        </TableCell>

                    </TableRow>)) : ('Loading...')}
                </TableBody>
            </Table>
        </TableContainer>
    </div>);
}

export default QuanLyGiangVien;