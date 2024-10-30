import React, {useEffect, useState, useCallback} from 'react';
import colors from '../../../../components/color';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {
    findTieuChuaByMaCtdt,
    getAllChuongTrinhDaoTao, getAllGoiY,
    getAllMocChuan,
    getAllTieuChi,
    saveGoiY
} from "../../../../services/apiServices";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import {Button, Form, Modal} from "react-bootstrap";

const PopupForm = ({show, handleClose, formData, setFormData, fetchData}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungChuongTrinhID = queryParams.get('KhungCTDT_ID');
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true)
        try {
            const response = await saveGoiY(formData);
            if (response === "OK") {
                await fetchData();
                setOpen(false);
                handleClose();
                setFormData({
                    ten: '',
                    batbuoc: 0,
                    idParent: ''
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
                    <Modal.Title>Thêm Gợi Ý</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="ten">
                            <Form.Label>Gợi Ý</Form.Label>
                            <Form.Control
                                type="text"
                                name="ten"
                                value={formData.ten}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="batBuoc" className="mt-2">
                            <Form.Label>Bắt Buộc</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="batBuoc"
                                checked={formData.batBuoc}
                                onChange={handleChange}

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
const ListGoiY = ({idMocChuan}) => {
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [goiY, setGoiY] = useState([])
    const fetchData = async () => {
        try {
            const response = await getAllGoiY();
            const filter = response.filter((item) => item.idMocChuan == idMocChuan);
            setGoiY(filter);
        } catch (e) {

        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    const [formData, setFormData] = useState({
        ten: '',
        batBuoc: 0,
        idParent: idMocChuan
    });
    return (
        <>
            <LoadingProcess open={open}/>
            <PopupForm show={show} handleClose={handleClose} formData={formData} setFormData={setFormData} fetchData={fetchData}/>
            {goiY.length > 0 ? goiY.map((row) => (
                <React.Fragment key={`goiy-${row.idGoiY}`}>
                    <TableRow className="no-border">
                        <TableCell>{row.tenGoiY}</TableCell>
                    </TableRow>
                    <hr/>
                </React.Fragment>
            )) : ('')}
            <div className='d-flex justify-content-center'>
                <button onClick={handleShow} className='btn'><i className='fas fa-edit'> </i> <span>  Bổ sung thêm gợi ý minh chứng</span>
                </button>
            </div>
        </>
    );
};
const ListMocChuan = ({idTieuChi}) => {
    const [mocChuan, setMocChuan] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllMocChuan();
                const filter = response.filter((item) => item.idTieuChi == idTieuChi);
                setMocChuan(filter);
            } catch (e) {

            }
        }
        fetchData();
    }, [])
    return (
        <>
            {mocChuan.length > 0 ? mocChuan.map((row, index) => (
                <React.Fragment key={`mocchuan-${row.idMocChuan}`}>
                    <TableRow>
                        <TableCell style={{width: '50%'}}>{index + 1}. {row.tenMocChuan}</TableCell>
                        <TableCell style={{width: '50%'}}><ListGoiY idMocChuan={row.idMocChuan} /></TableCell>
                    </TableRow>
                </React.Fragment>
            )) : ('')}
        </>
    );
};
const ListTieuChi = ({idTieuChuan, stt}) => {
    const [tieuChi, setTieuChi] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllTieuChi();
                const filter = response.filter((item) => item.idTieuChuan == idTieuChuan);
                setTieuChi(filter);
            } catch (e) {

            }
        }
        fetchData();
    }, [])
    return (
        <>
            {tieuChi.length > 0 ? tieuChi.map((row, index) => (
                <React.Fragment key={`tieuchi-${row.idTieuChi}`}>
                    <TableRow className='border-gray'>
                        <TableCell><b>{stt}.{index + 1}</b> {row.tenTieuChi}</TableCell>
                        <TableCell>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                            <p key={index}>{item.trim()}</p>
                        ))}</TableCell>
                        <TableCell colSpan={2}><ListMocChuan idTieuChi={row.idTieuChi}/></TableCell>
                    </TableRow>
                </React.Fragment>
            )) : ('')}
        </>
    );
};

const DanhSachTieuChuan = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungChuongTrinhID = queryParams.get('KhungCTDT_ID');

    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllChuongTrinhDaoTao();
                const filter = response.filter((item) => item.maCtdt == KhungChuongTrinhID)
                setChuongTrinhDaoTao(filter);
                const tieuChuanData = await findTieuChuaByMaCtdt(KhungChuongTrinhID);
                setTieuChuan(tieuChuanData);

            } catch (e) {

            }
        }
        fetchData();
    }, [])

    return (
        <div className="content" style={{background: "white", margin: '20px'}}>
            <style>
                {`
                th{
                    color:white !important;
                }
                .border-gray > td{
                    border : 1px solid #ccc !important;
                }

                .no-border > td{
                    border : 1px solid white !important;
                }
                `}
            </style>
            <p className='text-center' style={{fontSize: '20px'}}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH <span
                style={{color: colors.secondary}}>{chuongTrinhDaoTao ? chuongTrinhDaoTao[0].tenCtdt : 'Loading...'}</span></b>
            </p>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead id="table-row-color">
                        <TableRow>
                            <TableCell style={{width: '15%'}}>Tiêu chuẩn/ <br/>Tiêu chí</TableCell>
                            <TableCell style={{width: '15%'}}>Yêu cầu của tiêu chí</TableCell>
                            <TableCell style={{width: '35%'}}>Mốc chuẩn để tham chiếu để đánh giá tiêu chí đạt mức
                                4</TableCell>
                            <TableCell style={{width: '35%'}}>Các gợi ý bắt buộc</TableCell>
                        </TableRow>
                    </TableHead>
                    {tieuChuan.length > 0 ? tieuChuan.map((row, index) => (
                        <TableBody key={`tieu-chuan-${row.idTieuChuan}`}>
                            <TableRow>
                                <TableCell style={{backgroundColor: colors.grayColorLess, fontSize: '16px'}}
                                           colSpan={4}><b>Tiêu chuẩn {index + 1}. {row.tenTieuChuan}</b></TableCell>
                            </TableRow>
                            <ListTieuChi idTieuChuan={row.idTieuChuan} stt={index + 1}/>
                        </TableBody>
                    )) : 'Loading...'}
                </Table>
            </TableContainer>

        </div>
    );
};

export default DanhSachTieuChuan;