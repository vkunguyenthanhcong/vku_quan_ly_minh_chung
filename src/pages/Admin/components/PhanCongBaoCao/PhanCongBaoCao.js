import React, {useEffect, useState} from "react";
import {
    deletePhanCong,
    getAllPhanCong,
    getKdclData,
    getPhongBan,
    savePhanCong,
    updatePhanCong
} from "../../../../services/apiServices";
import {useLocation} from "react-router-dom";
import {Modal, Button, Form} from 'react-bootstrap';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";

const PopupForm = ({
                       show,
                       handleClose,
                       idChuanKiemDinh,
                       phongBan,
                       soLuongTieuChuan,
                       fetchData,
                       formData,
                       setFormData
                   }) => {

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.idPhongBan === "") {
                alert('Vui lòng chọn phòng ban')
            } else if (formData.sttTieuChuanBatDau === "" || formData.sttTieuChuanBatDau === 0) {
                alert('Vui lòng chọn tiêu chuẩn bắt đầu')
            } else if (formData.sttTieuChuanKetThuc === "" || formData.sttTieuChuanKetThuc === 0) {
                alert('Vui lòng chọn tiêu chuẩn kết thúc')
            } else {
                if (Number(formData.sttTieuChuanKetThuc) < Number(formData.sttTieuChuanBatDau)) {
                    alert('Tiêu chuẩn sau phải lớn hơn tiêu chuẩn trước');
                } else {
                    if (formData.idPhanCong === '') {
                        const data = new FormData();
                        data.append("maKdcl", formData.idChuanKiemDinh)
                        data.append("idPhongBan", formData.idPhongBan)
                        data.append("sttTieuChuanBatDau", formData.sttTieuChuanBatDau)
                        data.append("sttTieuChuanKetThuc", formData.sttTieuChuanKetThuc)
                        const response = await savePhanCong(data);
                        if (response === "OK") {
                            fetchData();
                            handleClose();
                        }
                    } else if (formData.idPhanCong !== '') {
                        const data = new FormData();
                        data.append("idPhanCong", formData.idPhanCong)
                        data.append("maKdcl", formData.idChuanKiemDinh)
                        data.append("idPhongBan", formData.idPhongBan)
                        data.append("sttTieuChuanBatDau", formData.sttTieuChuanBatDau)
                        data.append("sttTieuChuanKetThuc", formData.sttTieuChuanKetThuc)
                        const response = await updatePhanCong(data);
                        if (response === "OK") {
                            fetchData();
                            handleClose();
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thiết lập nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="tenKdcl">
                        <Form.Label>Phòng ban</Form.Label>
                        <Form.Select name="idPhongBan"
                                     value={formData.idPhongBan}
                                     onChange={handleChange}>
                            <option value="">
                                --- Chọn Phòng Ban ---
                            </option>
                            {phongBan.map((item, index) => (
                                <option key={index} value={item.idPhongBan}>
                                    {item.tenPhongBan}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="sttTieuChuanBatDau">
                        <Form.Label>Số thứ tự tiêu chuẩn bắt đầu</Form.Label>
                        <Form.Select name="sttTieuChuanBatDau"
                                     value={formData.sttTieuChuanBatDau}
                                     onChange={handleChange}>
                            <option value="">
                                --- Tiêu Chuẩn ---
                            </option>
                            {Array.from({length: soLuongTieuChuan}, (_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="sttTieuChuanKetThuc">
                        <Form.Label>Số thứ tự tiêu chuẩn kết thúc</Form.Label>
                        <Form.Select name="sttTieuChuanKetThuc"
                                     value={formData.sttTieuChuanKetThuc}
                                     onChange={handleChange}>
                            <option value="">
                                --- Tiêu Chuẩn ---
                            </option>
                            {Array.from({length: soLuongTieuChuan}, (_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Button variant="success" type="submit" className="mt-3">
                        Xác nhận
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
const TieuChuan = ({sttBatDau, sttKetThuc}) => {
    const tieuChuanList = [];
    for (let i = sttBatDau; i <= sttKetThuc; i++) {
        tieuChuanList.push(i);
    }
    return (
        <>
            {
                tieuChuanList.map((tieuChuan, index) => (
                    <span key={index}> {tieuChuan} </span>
                ))}
        </>
    )
}
const PhanCongBaoCao = () => {
    const [chuanKdcl, setChuanKdcl] = useState([]);
    const [phongBan, setPhongBan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [phanCong, setPhanCong] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [idPhanCongSelected, setIdPhanCongSelected] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ChuanKiemDinh_ID = queryParams.get('ChuanKiemDinh_ID');

    const [formData, setFormData] = useState({
        idPhanCong: '',
        idPhongBan: '',
        idChuanKiemDinh: ChuanKiemDinh_ID,
        sttTieuChuanBatDau: 0,
        sttTieuChuanKetThuc: 0
    });
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setFormData({
            idPhanCong: '',
            idPhongBan: '',
            idChuanKiemDinh: ChuanKiemDinh_ID,
            sttTieuChuanBatDau: 0,
            sttTieuChuanKetThuc: 0
        })
    };
    const handleShow = () => setShow(true);

    const fetchPhanCong = async () => {
        try {
            const result_3 = await getAllPhanCong();
            const filterPhanCong = result_3.filter(item => item.chuanKdcl.maKdcl === ChuanKiemDinh_ID);
            setPhanCong(filterPhanCong);

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getKdclData();
                setChuanKdcl(result);
                const result_2 = await getPhongBan();
                setPhongBan(result_2);

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchPhanCong();
    }, []);
    const handleXoaPhanCong = (idPhongBan) => {
        setIdPhanCongSelected(idPhongBan);
        setShowDialog(true);

    }
    const xoaPhanCong = async () => {

        const response = await deletePhanCong(idPhanCongSelected);
        if (response === "OK") {
            fetchPhanCong();
        }
    }
    const suaPhanCong = async (idPhanCong, idPhongBan, sttTieuChuanBatDau, sttTieuChuanKetThuc) => {
        setFormData({
            idPhanCong: idPhanCong,
            idPhongBan: idPhongBan,
            idChuanKiemDinh: ChuanKiemDinh_ID,
            sttTieuChuanBatDau: sttTieuChuanBatDau,
            sttTieuChuanKetThuc: sttTieuChuanKetThuc
        })
        handleShow();
    }
    const filterChuanKiemDinh = chuanKdcl.filter(item => item.maKdcl === ChuanKiemDinh_ID);
    if (loading === true) {
        return (<p>Loading...</p>)
    }
    ;
    if (error !== "") {
        return (<p>{error}</p>)
    }
    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <ConfirmDialog
                show={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={xoaPhanCong}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
            <PopupForm show={show} handleClose={handleClose} idChuanKiemDinh={ChuanKiemDinh_ID} phongBan={phongBan}
                       soLuongTieuChuan={filterChuanKiemDinh[0].soLuongTieuChuan} fetchData={fetchPhanCong}
                       formData={formData} setFormData={setFormData}/>
            <p>CHIA NHÓM NHIỆM VỤ ĐÁNH GIÁ CHƯƠNG TRÌNH <b>{filterChuanKiemDinh[0].tenKdcl}</b></p>
            <br/>
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white">STT</TableCell>
                            <TableCell className="text-white">Phòng ban</TableCell>
                            <TableCell className="text-white">Tiêu chuẩn</TableCell>
                            <TableCell className="text-white text-center">
                                <div className="d-flex flex-column align-items-stretch gap-2">
                                    <button className="btn btn-success" onClick={handleShow}>Thiết lập nhóm</button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {phanCong.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.phongBan.tenPhongBan}</TableCell>
                                <TableCell>Tiêu chuẩn : <TieuChuan sttBatDau={item.sttTieuChuanBatDau}
                                                                   sttKetThuc={item.sttTieuChuanKetThuc}/>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="d-flex flex-column align-items-stretch gap-2">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() =>
                                                suaPhanCong(
                                                    item.idPhanCong,
                                                    item.phongBan.idPhongBan,
                                                    item.sttTieuChuanBatDau,
                                                    item.sttTieuChuanKetThuc
                                                )
                                            }
                                        >
                                            <i className="fas fa-edit me-2"></i> Chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => handleXoaPhanCong(item.idPhanCong)}
                                        >
                                            <i className="fas fa-trash-alt me-2"></i> Xóa
                                        </button>
                                    </div>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default PhanCongBaoCao;