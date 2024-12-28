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
    updateNamBanHanh,
    insertNewChuanKdcl, getAllChuongTrinhDaoTao, deleteChuanKDCL,
} from "../../../../services/apiServices";
import {useNavigate} from "react-router-dom";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";

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
                    <Modal.Title>Bổ sung chuẩn kiểm định</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="tenKdcl" className="mb-2">
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

                        <Form.Group controlId="namBanHanh" className="mb-2">
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
                        <Form.Group controlId="soLuongTieuChuan" className="mb-2">
                            <Form.Label>Số lượng tiêu chuẩn</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder=""
                                name="soLuongTieuChuan"
                                value={props.formData.soLuongTieuChuan}
                                onChange={handleChange}
                                required
                                min={1}
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="mt-3">
                            <i className="fas fa-check me-2"></i> Xác nhận
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
        <div className="btn-group-vertical" role="group">
            {data.map((item, index) => (
                <button
                    key={`button-${index}`}
                    className="btn btn-primary mb-2"
                >
                    {item.tenCtdt}
                </button>
            ))}
        </div>
    );
};
const ChuanKiemDinh = () => {
    useEffect(() => {
        document.title = 'Chuẩn Kiểm Định | VKU';
      },[])
    const [formData, setFormData] = useState({
        tenKdcl: '',
        namBanHanh: '',
        soLuongTieuChuan: 1
    });
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMaKdcl, setSelectedMaKdcl] = useState('');
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
                item.maKdcl === id ? {...item, isEditing: item.isEditing ? false : true} : item
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
        setSelectedMaKdcl(maKdcl);
        setShowDialog(true);
    }
    const deleteCKDCL = async () => {
        const response = await deleteChuanKDCL(selectedMaKdcl);
        if (response === "OK") {
            alert('Xóa thành công');
            props.fetchData();
        } else {
            alert('Có lỗi trong quá trình xử lý');
        }
    }

    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <LoadingProcess open={open}/>
            <ConfirmDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={deleteCKDCL}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
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
                                <TableCell className="text-white">Tên chuẩn đánh giá</TableCell>
                                <TableCell className="text-white">Thời gian áp dụng</TableCell>
                                <TableCell className="text-white">Tên chương trình đào tạo</TableCell>
                                <TableCell className="text-white">Thao Tác</TableCell>
                                <TableCell>
                                    <button className='btn btn-success' onClick={handleShow}><b>+</b></button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={`chuanKiemDinh-${index}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {row.isEditing ? (
                                            <input
                                                className="form-control"
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
                                                className="form-control"
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
                                        <div className="btn-group-vertical" role="group">
                                            <button
                                                className="btn btn-primary mb-2 d-flex align-items-center"
                                                onClick={() => handleEditClick(row.maKdcl)}
                                                title="Chỉnh sửa"
                                            >
                                                <i className="fas fa-edit me-2"></i>Chỉnh sửa
                                            </button>
                                            <button
                                                className="btn btn-danger mb-2 d-flex align-items-center"
                                                onClick={() => handleDeleteChuanKDCL(row.maKdcl)}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash me-2"></i>Xóa
                                            </button>
                                            <button
                                                className="btn btn-success d-flex align-items-center"
                                                onClick={() => goToPhanCong(row.maKdcl)}
                                                title="Chia nhóm đánh giá"
                                            >
                                                <i className="fas fa-users-cog me-2"></i>Chia nhóm đánh giá
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell></TableCell>
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
