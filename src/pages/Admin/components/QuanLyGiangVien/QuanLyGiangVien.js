import React, {useEffect, useState} from 'react';
import {getAllUser, getPhongBan, updateUser} from "../../../../services/apiServices";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";

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
    const editGiangVien = async (idGiangVien) => {
        setOpen(true)
        const filterGiangVien = user.find((item) => item.id === idGiangVien);

        if (filterGiangVien) {
            const formData = {
                id : filterGiangVien.id,
                idPhongBan : filterGiangVien.phongBan.idPhongBan,
            }
            try {
                const response = await updateUser(formData);

                if(response == "OK"){
                    setOpen(false)
                    alert("Cập nhật thành công");
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
        <TableContainer component={Paper}>
            <Table className="font-Inter">
                <TableHead>
                    <TableRow id="table-row-color">
                        <TableCell className="text-white">STT</TableCell>
                        <TableCell className="text-white">Họ và tên</TableCell>
                        <TableCell className="text-white">Email</TableCell>
                        <TableCell className="text-white">Số điện thoại</TableCell>

                        <TableCell className="text-white">Phòng ban</TableCell>
                        <TableCell className="text-white">Hình ảnh</TableCell>
                        <TableCell>
                            <button className='btn btn-success'>+</button>
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
                        <TableCell>
                            <img src={item.avatar} width="50" height="50"/>
                        </TableCell>
                        <TableCell>
                            <button className="btn btn-primary" onClick={() => editGiangVien(item.id)}>Sửa</button>
                            <br/>
                            <button className="btn btn-danger mt-2">Xóa</button>
                        </TableCell>
                    </TableRow>)) : ('Loading...')}
                </TableBody>
            </Table>
        </TableContainer>
    </div>);
}

export default QuanLyGiangVien;