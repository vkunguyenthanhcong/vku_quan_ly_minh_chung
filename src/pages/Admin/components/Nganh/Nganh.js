import React, {useEffect, useState} from "react";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";
import SuccessDialog from "../../../../components/ConfirmDialog/SuccessDialog";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {deleteNganh, editNganh, getKhoa, getNganh, saveNganh} from "../../../../services/apiServices";
import {Button, Form, Modal} from "react-bootstrap";
import Notification from "../../../../components/ConfirmDialog/Notification";
const PopupForm = ({ show, handleClose , setNganh, setShowDialogSuccess, setUnavailableKhoa, khoaData, trinhDoData}) => {
    const [formData, setFormData] = useState({
        maNganh : '',
                    tenNganh : '',
                    maKhoa : '',
                    trinhDo : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await saveNganh(formData);
            if(response){
                setNganh(response);
                handleClose();
                setShowDialogSuccess(true);
                setFormData((prevFormData) => ({
                    maNganh : '',
                    tenNganh : '',
                    maKhoa : '',
                    trinhDo : ''
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
                <Modal.Title>Bổ Sung Ngành</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="maNganh">
                        <Form.Label>Mã ngành</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="maNganh"
                            value={formData.maNganh}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="tenNganh">
                        <Form.Label>Tên ngành</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="tenNganh"
                            value={formData.tenNganh}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="maKhoa" className="mt-3">
                        <Form.Label>Khoa</Form.Label>
                        <Form.Select
                            type="text"
                            placeholder=""
                            name="maKhoa"
                            value={formData.maKhoa}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                -- Chọn Khoa --
                            </option>
                            {khoaData.map((item) => (
                                <option key={item.maKhoa} value={item.maKhoa}>
                                    {item.tenKhoa}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="trinhDo" className="mt-3">
                        <Form.Label>Trình độ</Form.Label>
                        <Form.Select
                            name="trinhDo"
                            value={formData.trinhDo}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                -- Chọn Trình Độ --
                            </option>
                            {trinhDoData.map((item) => (
                                <option key={item.maTrinhDo} value={item.maTrinhDo}>
                                    {item.tenTrinhDo}
                                </option>
                            ))}
                        </Form.Select>
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
const Nganh = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nganh, setNganh] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogSuccess, setShowDialogSuccess] = useState(false);
    const handleCloseDialogSuccess = () => {setShowDialogSuccess(false);};
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false);};
    const handleShow = () => {setShow(true);};
    const [maNganhSelected, setMaNganhSelected] = useState('');
    const [unavailableNganh, setUnavailableNganh] = useState(false);
    const [khoa, setKhoa] = useState([]);
    const trinhDo = [
        { maTrinhDo: "Kỹ sư", tenTrinhDo: "Kỹ sư" },
        { maTrinhDo: "Cử nhân", tenTrinhDo: "Cử nhân"}
    ];
    
    
    useEffect(() => {
        const fetchData = async () => {
            const nganhData = await getNganh();
            const khoaData = await getKhoa();
            const initializedData = nganhData.map((item) => ({
                ...item,
                isEditing: false,
            }));
            setKhoa(khoaData);
            setNganh(initializedData);
        }
        fetchData();
    },[]);
    const handleDeleteNganh =  (value) => {
        setMaNganhSelected(value);
        setShowDialog(true);
    }
    const deleteNganhChoose = async () => {
        const response = await deleteNganh(maNganhSelected);
        if(response){
            setNganh(response);
            setShowDialog(false);
        }
    }
 
    const handleEditClick = (id) => {
        setNganh((prevList) =>
            prevList.map((item) =>
                item.maNganh === id
                    ? { ...item, isEditing: !item.isEditing }
                    : item
            )
        );
    };
    const handleEnterChange = async (maNganh, fieldName, event) => {
        if (event.key === "Enter") {
            if (event.target.value === "" || event.target.value === null) {
                alert('Vui lòng điền đầy đủ thông tin');
            } else {
                setNganh(prevList =>
                    prevList.map(item =>
                        item.maNganh === maNganh ? { ...item, isEditing: false } : item
                    )
                );
                const data = new FormData();
                data.append(fieldName, event.target.value);
                try {
                    const response = await editNganh(data, maNganh);
                    if (response === "OK") {
                        alert('Cập nhật thành công');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };
    const handleChangeKhoa = async (maNganh, fieldName, event) => {
        const newData = event.target.value;
        setNganh((prevNganh) =>
            prevNganh.map((nganh) =>
                nganh.maNganh === maNganh
                    ? {
                        ...nganh,
                        [fieldName]: newData, // Use computed property name
                    }
                    : nganh
            )
        );
        const data = new FormData();
                data.append(fieldName, event.target.value);
                try {
                    const response = await editNganh(data, maNganh);
                    if (response === "OK") {
                        alert('Cập nhật thành công');
                    }
                } catch (error) {
                    console.error(error);
                }
    };
    const handleChangeNganh = (id, field, value) => {
        setNganh(prevNganh =>
            prevNganh.map(item =>
                item.maNganh === id
                    ? { ...item, [field]: value, isEditing: true }
                    : item
            )
        );
    };
    

    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            {unavailableNganh ?  <Notification onClose={setUnavailableNganh} message="Ngành đã tồn tại trong hệ thống" title="NGÀNH ĐÃ TỒN TẠI"/> : null}
            <PopupForm show={show} handleClose={handleClose} setNganh={setNganh} setShowDialogSuccess={setShowDialogSuccess} setUnavailableKhoa={setUnavailableNganh} khoaData={khoa} trinhDoData={trinhDo}/>

            <ConfirmDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={deleteNganhChoose}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
            <SuccessDialog
                show={showDialogSuccess}
                onClose={handleCloseDialogSuccess}
                title="Thành Công"
                message="Thêm ngành thành công"
            />
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white">Mã</TableCell>
                            <TableCell className="text-white">Ngành</TableCell>
                            <TableCell className="text-white">Khoa</TableCell>
                            <TableCell className="text-white">Trình độ đào tạo</TableCell>
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
                        {nganh.map((item, index) => (
                            <TableRow key={`phonBan-${index}`}>
                                <TableCell>{item.maNganh}</TableCell>
                                <TableCell>
                                    {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width: '500px'}}
                                            type="text"
                                            value={item.tenNganh}
                                            onChange={(e) => handleChangeNganh(item.maNganh, 'tenNganh', e.target.value)}
                                            onKeyPress={(e) => handleEnterChange(item.maNganh, 'tenNganh', e)}
                                        />
                                    ) : (
                                        item.tenNganh
                                    )}
                                </TableCell>
                                <TableCell>
                                <select className="form-select" value={item.maKhoa}
                                        onChange={(e) => handleChangeKhoa(item.maNganh,'maKhoa', e)}>
                                    {khoa.map((data) => (
                                        <option key={data.maKhoa} value={data.maKhoa}>
                                            {data.tenKhoa}
                                        </option>))}
                                </select>
                                </TableCell>
                                <TableCell>
                                <select className="form-select" value={item.trinhDo}
                                        onChange={(e) => handleChangeKhoa(item.maNganh, 'trinhDo', e)}>
                                    {trinhDo.map((data) => (
                                        <option key={data.maTrinhDo} value={data.maTrinhDo}>
                                            {data.tenTrinhDo}
                                        </option>))}
                                </select>
                                </TableCell>
                               
                                <TableCell>
                                    <div className="d-flex flex-column align-items-start btn-group-vertical" role="group">
                                        <button
                                            className="btn btn-outline-primary btn-sm mb-2"
                                            onClick={() => handleEditClick(item.maNganh)}
                                        >
                                            <i className="fas fa-edit me-2"></i>Sửa
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteNganh(item.maNganh)}
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
export default Nganh;