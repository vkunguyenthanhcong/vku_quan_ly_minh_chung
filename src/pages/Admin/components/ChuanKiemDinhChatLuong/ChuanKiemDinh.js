import React, { useEffect, useState } from "react";
import "./ChuanKiemDinh.css";
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
import {
    getKdclData,
    getCtdtDataByMaKDCL,
    updateTenKdcl,
    updateNamBanHanh, deleteChuanKDCL,
    insertNewChuanKdcl,
} from "../../../../services/apiServices";
import { useNavigate } from "react-router-dom";
const PopupForm = ({ show, handleClose, fetchData }) => {
    const [formData, setFormData] = useState({
      tenKdcl: '',
      namBanHanh: '',
      maKdcl: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await insertNewChuanKdcl(formData); // Đợi insertNewChuanKdcl hoàn tất
          handleClose(); // Đóng popup sau khi hoàn tất chèn dữ liệu
          await fetchData(); // Đợi fetchData thực thi và cập nhật dữ liệu mới
        } catch (error) {
          console.error('Error submitting form:', error);
          // Xử lý lỗi nếu cần
        }
      };
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bổ sung Chuẩn kiểm định</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="tenKdcl">
              <Form.Label>Tên Chuẩn đánh giá</Form.Label>
              <Form.Control
                type="text"
                placeholder="" 
                name="tenKdcl"
                value={formData.tenKdcl}
                onChange={handleChange}
                required
              />
            </Form.Group>
  
            <Form.Group controlId="namBanHanh">
              <Form.Label>Năm áp dụng</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="namBanHanh"
                value={formData.namBanHanh}
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
const GenericList = ({ maKdcl }) => {

    const [edit, setEdit] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleButtonClick = (maCtdt) => {
        navigate(`chuong-trinh-dao-tao?KhungCTDT_ID=${maCtdt}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCtdtDataByMaKDCL(maKdcl);
                const initializedData = result.map((item) => ({
                    ...item,
                    isEditing: false,
                }));
                setData(initializedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [maKdcl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <ul>
            {data.map((item, index) => (
                <li style={{marginBottom: "20px", marginTop: "20px"}} key={index}>
                    <button
                        onClick={() => handleButtonClick(item.maCtdt)}
                        className="btn btnViewCTDT"
                    >
                        {item.tenCtdt}
                    </button>
                </li>
            ))}
        </ul>
    );
};
const ChuanKiemDinh = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const fetchDataFromAPI = async () => {
        
        try {
            const result = await getKdclData();
            const initializedData = result.map((item) => ({
                ...item,
                isEditing: false,
            }));
            setData(initializedData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDataFromAPI();
    }, []);
    // Hàm xử lý khi nhấn vào nút Edit
    const handleEditClick = (id) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, isEditing: true } : item
            )
        );
    };

    // Hàm xử lý khi người dùng thay đổi giá trị input
    const handleTenChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, tenKdcl: newText } : item
            )
        );
    };
    const handleNamBanHanhChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, namBanHanh: newText } : item
            )
        );
    };

    // Hàm xử lý khi người dùng nhấn Enter để hoàn tất việc chỉnh sửa
    const handleTenPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.idKdcl === id ? { ...item, isEditing: false } : item
                )
            );
            try {
                const response = await updateTenKdcl(event.target.value, id);
            } catch (e) {}
        }
    };
    const handleNamBanHanhPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.idKdcl === id ? { ...item, isEditing: false } : item
                )
            );
            try {
                const response = await updateNamBanHanh(event.target.value, id);
            } catch (e) {}
        }
    };
    const handleDeleteChuanKDCL = async (idKdcl) => {
        try {
            const response = await deleteChuanKDCL(idKdcl);
            fetchDataFromAPI();
        }catch (e) {

        }
    }

    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
        <PopupForm show={show} handleClose={handleClose} fetchData={fetchDataFromAPI}/>
            <p style={{ fontSize: "20px" }}>
                DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG
            </p>
            <hr />
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow >
                            <TableCell className="text-white">STT</TableCell>
                            <TableCell className="text-white">Tên Chuẩn đánh giá</TableCell>
                            <TableCell className="text-white">Năm áp dụng</TableCell>
                            <TableCell className="text-white">Tên CTĐT</TableCell>
                            <TableCell className="text-white">Tuỳ Chỉnh</TableCell>
                            <TableCell><button className='btn btn-success' onClick={handleShow}>+</button></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {row.isEditing ? (
                                        <input
                                            style={{width : '500px'}}
                                            type="text"
                                            value={row.tenKdcl}
                                            onChange={(e) =>
                                                handleTenChange(row.idKdcl, e.target.value)
                                            }
                                            onKeyPress={(e) => handleTenPress(row.idKdcl, e)}
                                        />
                                    ) : (
                                        row.tenKdcl
                                    )}
                                </TableCell>
                                <TableCell>
                                    {row.isEditing ? (
                                        <input
                                            type="text"
                                            value={row.namBanHanh}
                                            onChange={(e) =>
                                                handleNamBanHanhChange(row.idKdcl, e.target.value)
                                            }
                                            onKeyPress={(e) => handleNamBanHanhPress(row.idKdcl, e)}
                                        />
                                    ) : (
                                        row.namBanHanh
                                    )}
                                </TableCell>
                                <TableCell>
                                    <GenericList maKdcl={row.maKdcl} />
                                </TableCell>
                                <TableCell className="button-edit">
                                    <br />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleEditClick(row.idKdcl)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <br />
                                    <button className="btn btn-danger"
                                    onClick={() => handleDeleteChuanKDCL(row.idKdcl)}
                                    >Xóa</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ChuanKiemDinh;
