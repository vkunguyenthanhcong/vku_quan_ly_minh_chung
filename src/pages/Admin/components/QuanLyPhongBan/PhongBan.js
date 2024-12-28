import React, {useEffect, useState} from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { deletePhongBan, editPhongBan, getPhongBan, savePhongBan } from "../../../../services/apiServices";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";
import 'primereact/resources/primereact.min.css';
import SuccessDialog from "../../../../components/ConfirmDialog/SuccessDialog";
const PopupForm = ({ show, handleClose , setPhongBan, setShowDialogSuccess}) => {
    const [formData, setFormData] = useState({
      tenPhongBan: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
          const response = await savePhongBan(formData);
          if(response){
            setPhongBan(response);
            handleClose();
            setShowDialogSuccess(true);
            setFormData((prevFormData) => ({
                ...prevFormData,
                tenPhongBan: '' 
            }));
          }
          
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bổ Sung Phòng Ban</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="tenPhongBan">
              <Form.Label>Tên phòng ban</Form.Label>
              <Form.Control
                type="text"
                placeholder="" 
                name="tenPhongBan"
                value={formData.tenPhongBan}
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
const PhongBan = () => {
    useEffect(() => {
        document.title = 'Phòng Ban | VKU';
      },[])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phongBan, setPhongBan] = useState([]);
    const [idPhongBanSelected, setIdPhongBanSelected] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogSuccess, setShowDialogSuccess] = useState(false);
    const handleCloseDialogSuccess = ()=> {setShowDialogSuccess(false);};
    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await getPhongBan();
                const initializedData = result.map((item) => ({
                    ...item,
                    isEditing: false,
                }));
                setPhongBan(initializedData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, []);
    const handleEditClick = (id) => {
        setPhongBan((prevList) =>
            prevList.map((item) =>
                item.idPhongBan === id
                    ? { ...item, isEditing: !item.isEditing }
                    : item
            )
        );
    };

    // Hàm xử lý khi người dùng thay đổi giá trị input
    const handleChangeTenPhongBan = (id, newText) => {
        setPhongBan((prevList) =>
            prevList.map((item) =>
                item.idPhongBan === id ? { ...item, tenPhongBan: newText } : item
            )
        );
    };
    //Ham xu ly khi nguoi dung nhan enter
    const handleEnterChangeTenPhongBan = async (id, event) => {
        if (event.key === "Enter") {
            if(event.target.value === "" || event.target.value === null){
                alert('Vui lòng điền đầy đủ thông tin');
            }else{
                setPhongBan((prevList) =>
                    prevList.map((item) =>
                        item.idPhongBan === id ? { ...item, isEditing: false } : item
                    )
                );
                try {
                    const data = new FormData();
                    data.append("idPhongBan", id);
                    data.append("tenPhongBan", event.target.value);
                    const response = await editPhongBan(data);
                    if(response === "OK"){
                        alert('Cập nhật thành công');
                    }
                } catch (e) {}
            }
        }
    };
    const handleXoaoaPhongBan = (idPhongBan) => {
        setIdPhongBanSelected(idPhongBan);
        setShowDialog(true);
    }
    const xoaPhongBan = async () => {
        const response = await deletePhongBan(idPhongBanSelected);
        if(response){
            setPhongBan(response);
            setShowDialog(false);
        }else{
            alert('Có lỗi trong quá trình xử lý');
        }
    }

    if(loading === true){return (<p>Loading...</p>)}
    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
            <ConfirmDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={xoaPhongBan}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
            <SuccessDialog
                show={showDialogSuccess}
                onClose={handleCloseDialogSuccess}
                title="Thành Công"
                message="Thêm phòng ban thành công"
            />
        <PopupForm show={show} handleClose={handleClose} setPhongBan={setPhongBan} setShowDialogSuccess={setShowDialogSuccess}/>
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white">STT</TableCell>
                            <TableCell className="text-white">Tên Phòng Ban</TableCell>
                            <TableCell width={200} className="text-center">
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={handleShow}
                                    title="Thêm phòng ban mới"
                                >
                                    <i className="fas fa-plus-circle me-2"></i>Thêm phòng ban
                                </button>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {phongBan.map((item, index) => (
                            <TableRow key={`phonBan-${index}`}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>
                                {item.isEditing ? (
                                        <input
                                            className="form-control"
                                            style={{width : '500px'}}
                                            type="text"
                                            value={item.tenPhongBan}
                                            onChange={(e) =>
                                                handleChangeTenPhongBan(item.idPhongBan, e.target.value)
                                            }
                                            onKeyPress={(e) => handleEnterChangeTenPhongBan(item.idPhongBan, e)}
                                        />
                                    ) : (
                                        item.tenPhongBan
                                    )}      
                                </TableCell>
                                <TableCell>
                                    <div className="d-flex flex-column align-items-start btn-group-vertical" role="group">
                                        <button
                                            className="btn btn-outline-primary btn-sm mb-2"
                                            onClick={() => handleEditClick(item.idPhongBan)}
                                        >
                                            <i className="fas fa-edit me-2"></i>Sửa
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleXoaoaPhongBan(item.idPhongBan)}
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
            <ConfirmDialog />
        </div>
    )
}
export default PhongBan;