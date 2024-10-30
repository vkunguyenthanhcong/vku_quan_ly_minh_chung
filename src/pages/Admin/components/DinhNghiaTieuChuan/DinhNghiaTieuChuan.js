import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    findTieuChuaByMaCtdt, getAllGoiY, getAllMocChuan, getAllTieuChi,
    getThongTinCTDT, insertNewMocChuan,
    insertNewTieuChi,
    insertNewTieuChuan, saveGoiY, updateChuongTrinhDaoTao, updateMocChuan, updateTieuChi, updateTieuChuan
} from "../../../../services/apiServices";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Button, Form, Modal} from "react-bootstrap";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";

const findMissingSTT = (arr) => {
    if (arr.length > 0) {
        const sttArray = arr.map(item => item.stt);
        const maxSTT = Math.max(...sttArray);

        for (let i = 1; i <= maxSTT; i++) {
            if (!sttArray.includes(i)) {
                return i;
            }
        }
        return maxSTT + 1;
    } else {
        return 1;
    }
};
const PopupForm = ({show, handleClose, fetchData, formData, setFormData}) => {
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {

        const { name, type, checked, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true)
        try {
            let response;

            if(formData.id == 0){
                if (formData.title === 'Tiêu Chuẩn') {
                    response = await insertNewTieuChuan(formData);
                } else if (formData.title === 'Tiêu Chí') {
                    response = await insertNewTieuChi(formData);
                } else if (formData.title === 'Mốc Chuẩn') {
                    response = await insertNewMocChuan(formData);
                }else if (formData.title === 'Gợi Ý') {
                    alert(formData.ten)
                    alert(formData.batBuoc)
                    alert(formData.idParent)
                    response  = await saveGoiY(formData);
                }
            }else{
                if (formData.title === 'Tiêu Chuẩn') {
                    response = await updateTieuChuan(formData);
                } else if (formData.title === 'Tiêu Chí') {
                    response = await updateTieuChi(formData);
                } else if (formData.title === 'Mốc Chuẩn') {
                    response = await updateMocChuan(formData);
                }
            }
            if (response === "OK") {
                await fetchData();
                setOpen(false);
                handleClose();
                setFormData({
                    title: '',
                    ten: '',
                    stt: 0,
                    yeuCau: '',
                    idParent: '',
                    id: 0
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setOpen(false);
            handleClose();
        }
    };

    return (
        open === false ? (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Định Nghĩa {formData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {(formData.title === "Mốc Chuẩn" || formData.title === "Gợi Ý") ? (null) : (<Form.Group controlId="stt">
                            <Form.Label>Số Thứ Tự {formData.title}</Form.Label>
                            <Form.Control
                                type="number"
                                name="stt"
                                value={formData.stt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>)}
                        <Form.Group controlId="ten" className="mt-2">
                            <Form.Label>Tên {formData.title}</Form.Label>
                            <Form.Control
                                type="text"
                                name="ten"
                                value={formData.ten}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </Form.Group>
                        {formData.title === 'Tiêu Chí' ? (
                            <Form.Group controlId="yeuCau" className="mt-2">
                                <Form.Label>Yêu Cầu {formData.title} (1.., 2..)</Form.Label>
                                <Form.Control
                                    type="text"
                                    as="textarea"
                                    name="yeuCau"
                                    value={formData.yeuCau}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                />
                            </Form.Group>) : (null)}
                        {formData.title === 'Gợi Ý' ? (
                            <Form.Group controlId="batBuoc" className="mt-2">
                                <Form.Label>Bắt buộc</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    name="batBuoc"
                                    checked={formData.batBuoc}
                                    onChange={handleChange}
                                />
                            </Form.Group>) : (null)}

                        <Button variant="success" type="submit" className="mt-3">
                            Xác nhận
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>) : (<LoadingProcess open={open}/>)
    );
};
const DinhNghiaTieuChuan = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ChuongTrinh_ID = queryParams.get('ChuongTrinh_ID');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState(null);
    const [tieuChuan, setTieuChuan] = useState('');


    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        title: '',
        ten: '',
        stt: 0,
        yeuCau: '',
        idParent: ''
    });

    const fetchData = async () => {
        try {
            const response = await getThongTinCTDT(ChuongTrinh_ID);
            setChuongTrinhDaoTao(response);
            const tieuChuanData = await findTieuChuaByMaCtdt(ChuongTrinh_ID);
            const tieuChiData = await getAllTieuChi();
            const mocChuanData = await getAllMocChuan();
            const goiYData = await getAllGoiY();
            const updatedTieuChuan = tieuChuanData.map(tch => {
                // Filter tieuChiData where idTieuChuan matches
                const filteredTieuChi = tieuChiData.map(tc => {
                    if (tc.idTieuChuan === tch.idTieuChuan) {
                        // Filter mocChuanData where idTieuChi matches
                        const filteredMocChuan = mocChuanData.map(mc => {
                            if (mc.idTieuChi === tc.idTieuChi) {
                                // Filter goiYData where idMocChuan matches
                                const filteredGoiY = goiYData.filter(gy => gy.idMocChuan === mc.idMocChuan);

                                // Return mocChuan with GoiY data attached
                                return {
                                    ...mc,
                                    goiY: filteredGoiY // Attach filtered GoiY to each mocChuan
                                };
                            }
                            return mc;
                        });

                        // Return tieuChi with mocChuan (with goiY data) attached
                        return {
                            ...tc,
                            mocChuan: filteredMocChuan.filter(mc => mc.idTieuChi === tc.idTieuChi) // Attach filtered mocChuan array to each tieuChi
                        };
                    }
                    return tc;
                });

                // Add the filtered tieuChi (with mocChuan and goiY) to the corresponding tieuChuan object
                return {
                    ...tch,
                    tieuChi: filteredTieuChi.filter(tc => tc.idTieuChuan === tch.idTieuChuan)  // Only return filtered tieuChi for this tieuChuan
                };
            });

            setTieuChuan(updatedTieuChuan);
        } catch (e) {
            setLoading(true);
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [ChuongTrinh_ID])

    const deleteData = (id, title) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa?',
            header: 'Xác nhận',
            accept: async () => {
                let response;
                if(title === "Gợi Ý"){
                    response = await updateChuongTrinhDaoTao(id);
                }
                if(response === "OK"){
                    alert('Cập nhật thành công');
                }else{
                    alert('Có lỗi trong quá trình xử lý');
                }
            },
            reject: () => {
                console.log('Đã hủy');
            }
        });
    }

    if (loading) {
        return (<p>Loading...</p>)
    }
    if (error != '') {
        return (<p>{error}</p>)
    }
    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <ConfirmDialog />
            <LoadingProcess open={open}/>
            <PopupForm show={show} handleClose={handleClose} fetchData={fetchData} formData={formData}
                       setFormData={setFormData}/>
            <p>DANH SÁCH TIÊU CHUẨN</p>
            <p>Số lượng tiêu chuẩn tối đa
                : {chuongTrinhDaoTao ? chuongTrinhDaoTao.chuanKdcl.soLuongTieuChuan : 'Loading...'}</p>
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow id="table-row-color">
                            <TableCell className="text-white" width={150}>STT</TableCell>
                            <TableCell className="text-white">Tiêu chuẩn</TableCell>
                            <TableCell className="text-white">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                {tieuChuan.length > 0 ? (tieuChuan.length === chuongTrinhDaoTao.chuanKdcl.soLuongTieuChuan ? (
                                    <button className="btn btn-success disabled">Thêm tiêu chuẩn</button>
                                ) : (
                                    <button className="btn btn-success" onClick={() => {
                                        setFormData({
                                            title: 'Tiêu Chuẩn',
                                            ten: '',
                                            stt: findMissingSTT(tieuChuan),
                                            yeuCau: '',
                                            idParent: ChuongTrinh_ID
                                        });
                                        handleShow()
                                    }}>Thêm tiêu chuẩn</button>
                                )) : ('Loading...')}
                            </TableCell>
                        </TableRow>

                        {tieuChuan.length ? tieuChuan.map((item, index) => (
                            <React.Fragment key={index}>
                                <TableRow style={{backgroundColor : "#f6f6ee"}} key={`tieuChuan-${index}`}>
                                    <TableCell className="fw-bold" width={150}>{item.stt}</TableCell>
                                    <TableCell className="fw-bold">{item.tenTieuChuan}</TableCell>
                                    <TableCell width={200}>
                                        <button className='btn btn-primary'
                                                onClick={() => {
                                                setFormData({
                                                    title: 'Tiêu Chuẩn',
                                                    ten: item.tenTieuChuan,
                                                    stt: item.stt,
                                                    yeuCau: '',
                                                    idParent: ChuongTrinh_ID,
                                                    id : item.idTieuChuan
                                                });
                                            handleShow();
                                        }}>Chỉnh sửa</button>
                                        <br/>
                                        <button className='btn btn-danger mt-1'>Xóa</button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setFormData({
                                                    title: 'Tiêu Chí',
                                                    ten: '',
                                                    stt: findMissingSTT(item.tieuChi),
                                                    yeuCau: '',
                                                    idParent: item.idTieuChuan
                                                });
                                                handleShow();
                                            }}
                                        >
                                            Thêm tiêu chí
                                        </button>

                                    </TableCell>
                                </TableRow>
                                {item.tieuChi && item.tieuChi.map((i, idx) => (
                                    <React.Fragment key={`tieuChi-${idx}`}>
                                        <TableRow key={`tieuChiDetail-${idx}`}>
                                            <TableCell width={150}><b>Tiêu chí {i.stt}. </b></TableCell>
                                            <TableCell>{i.tenTieuChi}</TableCell>
                                            <TableCell width={200}>
                                                <button className='btn btn-primary'
                                                        onClick={() => {
                                                            setFormData({
                                                                title: 'Tiêu Chí',
                                                                ten: i.tenTieuChi,
                                                                stt: i.stt,
                                                                yeuCau: i.yeuCau,
                                                                idParent: item.idTieuChuan,
                                                                id: i.idTieuChi
                                                            });
                                                            handleShow();
                                                        }}>Chỉnh sửa
                                                </button>
                                                <br/>
                                                <button className='btn btn-danger mt-1'>Xóa</button>
                                            </TableCell>

                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setFormData({
                                                            title: 'Mốc Chuẩn',
                                                            ten: '',
                                                            stt: 0,
                                                            yeuCau: '',
                                                            idParent: i.idTieuChi
                                                        });
                                                        handleShow();
                                                    }}
                                                >
                                                    Thêm mốc chuẩn
                                                </button>

                                            </TableCell>
                                        </TableRow>
                                        {i.mocChuan && i.mocChuan.map((mc, mci) => (
                                            <React.Fragment key={`mocChuan-${mc.idMocChuan}`}>
                                                <TableRow key={`mocChuan-${mci}`}>
                                                    <TableCell width={150}>Mốc chuẩn {mci + 1}</TableCell>
                                                    <TableCell>{mc.tenMocChuan}</TableCell>
                                                    <TableCell width={200}>
                                                        <button className='btn btn-primary'
                                                                onClick={() => {
                                                                    setFormData({
                                                                        title: 'Mốc Chuẩn',
                                                                        ten: mc.tenMocChuan,
                                                                        stt: 0,
                                                                        yeuCau: '',
                                                                        idParent: i.idTieuChi,
                                                                        id: mc.idMocChuan
                                                                    });
                                                                    handleShow();
                                                                }}>Chỉnh sửa
                                                        </button>
                                                        <br/>
                                                        <button className='btn btn-danger mt-1'>Xóa</button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                setFormData({
                                                                    title: 'Gợi Ý',
                                                                    ten: '',
                                                                    stt: 0,
                                                                    yeuCau: '',
                                                                    idParent: mc.idMocChuan,
                                                                    id : 0,
                                                                    batBuoc: 'checked'
                                                                });
                                                                handleShow();
                                                            }}
                                                        >
                                                            Thêm gợi ý
                                                        </button>

                                                    </TableCell>
                                                </TableRow>
                                                    {mc.goiY && mc.goiY.map((gy, gyx) => (
                                                        <TableRow key={`goiY-${gy.idGoiY}`}>
                                                            <TableCell width={150}>Gợi ý {gyx + 1}</TableCell>
                                                            <TableCell>{gy.tenGoiY}</TableCell>
                                                            <TableCell width={200}>
                                                                <button className='btn btn-primary'
                                                                        onClick={() => {
                                                                            setFormData({
                                                                                title: 'Gợi Ý',
                                                                                ten: gy.tenGoiY,
                                                                                stt: 0,
                                                                                yeuCau: '',
                                                                                idParent: mc.idMocChuan,
                                                                                id: gy.idGoiY
                                                                            });
                                                                            handleShow();
                                                                        }}>Chỉnh sửa
                                                                </button>
                                                                <br/>
                                                                <button className='btn btn-danger mt-1'>Xóa</button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </React.Fragment>
                                        ))}

                                    </React.Fragment>

                                ))}

                            </React.Fragment>
                        )) : ('')}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
}
export default DinhNghiaTieuChuan;