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
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog'; 
import 'primereact/resources/primereact.min.css';
const PopupForm = ({ show, handleClose , setPhongBan}) => {
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
                Xác nhận
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
const PhongBan = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phongBan, setPhongBan] = useState([]);
    
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
    const xoaPhongBan = (idPhongBan) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa?',
            header: 'Xác nhận',
            accept: async () => {
                try {
                    const response = await deletePhongBan(idPhongBan);
                    if(response){
                        setPhongBan(response);
                        alert('Xóa thành công');
                    }else{
                        alert('Có lỗi trong quá trình xử lý');
                    }
                } catch (error) {
                    
                }
            },
            reject: () => {
              console.log('Đã hủy');
            }
          });
    }
    if(loading === true){return (<p>Loading...</p>)}
    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
        <PopupForm show={show} handleClose={handleClose} setPhongBan={setPhongBan}/>
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white">STT</TableCell>
                            <TableCell className="text-white">Tên Phòng Ban</TableCell> 
                            <TableCell><button className='btn btn-success' onClick={handleShow}>+</button></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {phongBan.map((item, index) => (
                            <TableRow>
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
                                    <button className="btn btn-primary" onClick={() => handleEditClick(item.idPhongBan)}>Sửa</button>
                                    <br/>
                                    <button className="btn btn-danger mt-2" onClick={() => xoaPhongBan(item.idPhongBan)}>Xóa</button>        
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