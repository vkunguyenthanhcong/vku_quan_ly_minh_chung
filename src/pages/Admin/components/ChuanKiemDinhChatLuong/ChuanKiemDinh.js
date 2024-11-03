import React, {useEffect, useState} from "react";
import {Modal, Button, Form} from 'react-bootstrap';
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

    updateTenKdcl,
    updateNamBanHanh, deleteChuanKDCL,
    insertNewChuanKdcl, getAllChuongTrinhDaoTao, deleteChuongTrinhDaoTao,
} from "../../../../services/apiServices";
import {useNavigate} from "react-router-dom";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";

const PopupForm = (props) => {
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        const parsedValue = name === "soLuongTieuChuan" ? parseInt(value, 10) : value;
        props.setFormData({...props.formData, [name]: parsedValue});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true)
        try {
            const response = await insertNewChuanKdcl(props.formData);
            if (response === "OK") {
                await props.fetchData();
                setOpen(false);
                props.handleClose();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setOpen(false);
            props.handleClose();
        }
    };

    return (
        open === false ? (
            <Modal show={props.show} onHide={props.handleClose}>
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
                                value={props.formData.tenKdcl}
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
                                value={props.formData.namBanHanh}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="soLuongTieuChuan">
                            <Form.Label>Số lượng tiêu chuẩn</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder=""
                                name="soLuongTieuChuan"
                                value={props.formData.soLuongTieuChuan}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="mt-3">
                            Xác nhận
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>) : (<LoadingProcess open={open}/>)
    );
};
const GenericList = ({maKdcl}) => {
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
                const result = await getAllChuongTrinhDaoTao();
                const initializedData = result
                    .filter(item => item.chuanKdcl && item.chuanKdcl.maKdcl === maKdcl) // Ensure chuanKdcl exists
                    .map(item => ({
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
                <li style={{marginBottom: "20px", marginTop: "20px", listStyleType: 'none'}} key={index}>
                    <button
                        onClick={() => handleButtonClick(item.maCtdt)}
                        className="btn btn-primary"
                    >
                        {item.tenCtdt}
                    </button>
                </li>
            ))}
        </ul>
    );
};
const ChuanKiemDinh = () => {
    const [formData, setFormData] = useState({
        tenKdcl: '',
        namBanHanh: '',
        soLuongTieuChuan: 0
    });
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
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
                item.maKdcl === id ? {...item, isEditing: true} : item
            )
        );
    };

    // Hàm xử lý khi người dùng thay đổi giá trị input
    const handleTenChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.maKdcl === id ? {...item, tenKdcl: newText} : item
            )
        );
    };
    const handleNamBanHanhChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.maKdcl === id ? {...item, namBanHanh: newText} : item
            )
        );
    };

    // Hàm xử lý khi người dùng nhấn Enter để hoàn tất việc chỉnh sửa
    const handleTenPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.maKdcl === id ? {...item, isEditing: false} : item
                )
            );
            try {
                await updateTenKdcl(event.target.value, id);
            } catch (e) {
            }
        }
    };
    const handleNamBanHanhPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.maKdcl === id ? {...item, isEditing: false} : item
                )
            );
            try {
                await updateNamBanHanh(event.target.value, id);
            } catch (e) {
            }
        }
    };
    const goToPhanCong = (ChuanKiemDinh) => {
        navigate(`../phan-cong?ChuanKiemDinh_ID=${ChuanKiemDinh}`);
    }
    const props = {
        show: show,
        handleClose: handleClose,
        fetchData: fetchDataFromAPI,
        formData: formData,
        setFormData: setFormData
    }
    const handleDeleteChuanKDCL = (maKdcl) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa?',
            header: 'Xác nhận',
            accept: async () => {
                const response = await deleteChuanKDCL(maKdcl);
                if(response === "OK"){
                    alert('Xóa thành công');
                    props.fetchData();
                }else{
                    alert('Có lỗi trong quá trình xử lý');
                }
            },
            reject: () => {
                console.log('Đã hủy');
            }
        });
    }

    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <LoadingProcess open={open}/>
            <PopupForm {...props}/>
            <p style={{fontSize: "20px"}}>
                DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG
            </p>
            <hr/>
            {data.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table className="font-Inter">
                        <TableHead>
                            <TableRow id="table-row-color">
                                <TableCell className="text-white">STT</TableCell>
                                <TableCell className="text-white">Tên Chuẩn đánh giá</TableCell>
                                <TableCell className="text-white">Năm áp dụng</TableCell>
                                <TableCell className="text-white">Tên CTĐT</TableCell>
                                <TableCell className="text-white">Thao Tác</TableCell>
                                <TableCell>
                                    <button className='btn btn-success' onClick={handleShow}>+</button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {row.isEditing ? (
                                            <input
                                                style={{width: '500px'}}
                                                type="text"
                                                value={row.tenKdcl}
                                                onChange={(e) =>
                                                    handleTenChange(row.maKdcl, e.target.value)
                                                }
                                                onKeyPress={(e) => handleTenPress(row.maKdcl, e)}
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
                                                    handleNamBanHanhChange(row.maKdcl, e.target.value)
                                                }
                                                onKeyPress={(e) => handleNamBanHanhPress(row.maKdcl, e)}
                                            />
                                        ) : (
                                            row.namBanHanh
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <GenericList maKdcl={row.maKdcl}/>
                                    </TableCell>
                                    <TableCell className="button-edit">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditClick(row.maKdcl)}
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <br/>
                                        <button className="btn btn-danger mt-2"
                                                onClick={() => handleDeleteChuanKDCL(row.maKdcl)}
                                        >Xóa
                                        </button>
                                        <br/>
                                        <button className="btn btn-success mt-2"
                                                onClick={() => goToPhanCong(row.maKdcl)}>Chia nhóm đánh giá
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (<button className="btn btn-success" onClick={handleShow}>Thêm Chuẩn Kiểm Định</button>)}
            <ConfirmDialog/>
        </div>

    );
};

export default ChuanKiemDinh;
