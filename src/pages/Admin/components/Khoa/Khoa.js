import React, {useEffect, useState} from "react";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";
import SuccessDialog from "../../../../components/ConfirmDialog/SuccessDialog";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {deleteChuanKDCL, deleteKhoa, editKhoa, editPhongBan, getKhoa, saveKhoa, savePhongBan} from "../../../../services/apiServices";
import {Button, Form, Modal} from "react-bootstrap";
import Notification from "../../../../components/ConfirmDialog/Notification";
const PopupForm = ({ show, handleClose , setKhoa, setShowDialogSuccess, setUnavailableKhoa}) => {
    const [formData, setFormData] = useState({
        tenKhoa : '',
        sdt : '',
        email : '',
        web : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await saveKhoa(formData);
            console.log(response);
            if(response){
                setKhoa(response);
                handleClose();
                setShowDialogSuccess(true);
                setFormData((prevFormData) => ({
                    tenKhoa : '',
                    sdt : '',
                    email : '',
                    web : ''
                }));
            }else{

            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setUnavailableKhoa(true); // Show dialog for 400 status
            } else {
                setUnavailableKhoa(true);
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Bổ Sung Khoa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="tenKhoa">
                        <Form.Label>Tên khoa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="tenKhoa"
                            value={formData.tenKhoa}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="sdt" className="mt-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="sdt"
                            value={formData.sdt}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="web" className="mt-3">
                        <Form.Label>Web</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="web"
                            value={formData.web}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" className="mt-3">
                        <i className="fas fa-check me-2"></i>
                        Xác nhận
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
const Khoa = () => {
    useEffect(() => {
        document.title = 'Khoa | VKU';
      },[])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [khoa, setKhoa] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogSuccess, setShowDialogSuccess] = useState(false);
    const handleCloseDialogSuccess = () => {setShowDialogSuccess(false);};
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false);};
    const handleShow = () => {setShow(true);};
    const [maKhoaSelected, setMaKhoaSelected] = useState('');
    const [unavailableKhoa, setUnavailableKhoa] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const khoaData = await getKhoa();
            const initializedData = khoaData.map((item) => ({
                ...item,
                isEditing: false,
            }));
            setKhoa(initializedData);
        }
        fetchData();
    },[]);
    const handleDeleteKhoa =  (maKhoa) => {
        setMaKhoaSelected(maKhoa);
        setShowDialog(true);
    }
    const deleteKhoaChoose = async () => {
        const response = await deleteKhoa(maKhoaSelected);
        if(response){
            setKhoa(response);
            setShowDialog(false);
        }
    }
    const handleChangeKhoa = (id, field, value) => {
        setKhoa(prevKhoa =>
            prevKhoa.map(item =>
                item.maKhoa === id
                    ? { ...item, [field]: value, isEditing: true }
                    : item
            )
        );
    };
    const handleEditClick = (id) => {
        setKhoa((prevList) =>
            prevList.map((item) =>
                item.maKhoa === id
                    ? { ...item, isEditing: !item.isEditing }
                    : item
            )
        );
    };
    const handleEnterChange = async (maKhoa, fieldName, event) => {
        if (event.key === "Enter") {
            if (event.target.value === "" || event.target.value === null) {
                alert('Vui lòng điền đầy đủ thông tin');
            } else {
                setKhoa(prevList =>
                    prevList.map(item =>
                        item.maKhoa === maKhoa ? { ...item, isEditing: false } : item
                    )
                );

                const data = new FormData();
                data.append(fieldName, event.target.value);
                try {
                    const response = await editKhoa(data, maKhoa);
                    if (response === "OK") {
                        alert('Cập nhật thành công');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            {unavailableKhoa ?  <Notification onClose={setUnavailableKhoa} message="Khoa đã tồn tại trong hệ thống" title="KHOA ĐÃ TỒN TẠI"/> : null}
            <PopupForm show={show} handleClose={handleClose} setKhoa={setKhoa} setShowDialogSuccess={setShowDialogSuccess} setUnavailableKhoa={setUnavailableKhoa}/>

            <ConfirmDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={deleteKhoaChoose}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
            <SuccessDialog
                show={showDialogSuccess}
                onClose={handleCloseDialogSuccess}
                title="Thành Công"
                message="Thêm khoa thành công"
            />
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white">Mã</TableCell>
                            <TableCell className="text-white">Tên Khoa</TableCell>
                            <TableCell className="text-white">Web</TableCell>
                            <TableCell className="text-white">Email</TableCell>
                            <TableCell className="text-white">Số điện thoại</TableCell>
                            <TableCell width={200} className="text-center">
                                <button
                                    className="btn btn-success btn-sm fw-bold pt-2 pb-2 ps-3 pe-3"
                                    style={{fontSize : '12px'}}
                                    onClick={handleShow}
                                    title="Thêm khoa mới"
                                >
                                    <i className="fas fa-plus-circle me-2"></i>THÊM KHOA
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {khoa.map((item, index) => (
                            <TableRow key={`phonBan-${index}`}>
                                <TableCell>{item.maKhoa}</TableCell>
                                <TableCell>
                                    {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width: '500px'}}
                                            type="text"
                                            value={item.tenKhoa}
                                            onChange={(e) => handleChangeKhoa(item.maKhoa, 'tenKhoa', e.target.value)}
                                            onKeyPress={(e) => handleEnterChange(item.maKhoa, 'tenKhoa', e)}
                                        />
                                    ) : (
                                        item.tenKhoa
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width: '200px'}}
                                            type="text"
                                            value={item.web}
                                            onChange={(e) => handleChangeKhoa(item.maKhoa, 'web', e.target.value)}
                                            onKeyPress={(e) => handleEnterChange(item.maKhoa, 'web', e)}
                                        />
                                    ) : (
                                        item.web
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width: '200px'}}
                                            type="text"
                                            value={item.email}
                                            onChange={(e) => handleChangeKhoa(item.maKhoa, 'email', e.target.value)}
                                            onKeyPress={(e) => handleEnterChange(item.maKhoa, 'email', e)}
                                        />
                                    ) : (
                                        item.email
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width: '200px'}}
                                            type="text"
                                            value={item.sdt}
                                            onChange={(e) => handleChangeKhoa(item.maKhoa, 'sdt', e.target.value)}
                                            onKeyPress={(e) => handleEnterChange(item.maKhoa, 'sdt', e)}
                                        />
                                    ) : (
                                        item.sdt
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="d-flex flex-column align-items-start btn-group-vertical" role="group">
                                        <button
                                            className="btn btn-outline-primary btn-sm mb-2"
                                            onClick={() => handleEditClick(item.maKhoa)}
                                        >
                                            <i className="fas fa-edit me-2"></i>Sửa
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteKhoa(item.maKhoa)}
                                        >
                                            <i className="fas fa-trash-alt me-2"></i>Xóa
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <ConfirmDialog/>
        </div>
    )
}
export default Khoa;