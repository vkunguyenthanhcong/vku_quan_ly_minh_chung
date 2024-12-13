import React, {useEffect, useState} from "react";
import {
    copyCtdt,
    createChuongTrinhDaoTao,
    findTieuChuaByMaCtdt,
    getAllChuongTrinhDaoTao,
    getAllMinhChung,
    getAllTieuChi,
    getKdclData,
    getKhoa, getNganh
} from "../../../../services/apiServices";
import {useNavigate} from "react-router-dom";
import {Button, Form, Modal} from "react-bootstrap";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";

const formatString = (inputString) => {
    const words = inputString.split(' ');
    const abbreviation = words.map((word) => word.charAt(0).toUpperCase()).join('');
    const yearMatch = inputString.match(/\d{4}$/);
    const year = yearMatch ? yearMatch[0] : '';
    return `${abbreviation}${year}`;
};
const PopupForm = (props) => {
    const [open, setOpen] = useState(false);
    const handleChange = (e) => {
        const {name, value} = e.target;
        let updatedFormData = {...props.formData, [name]: value};
        if (name === "tenCtdt") {
            updatedFormData = {
                ...updatedFormData,
                maCtdt: formatString(value),
            };
        }
        props.setFormData(updatedFormData);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(true)
        try {
            if (props.formData.loai != 0) {

                const response = await createChuongTrinhDaoTao(props.formData);
                if (response === "OK") {
                    await props.fetchData();
                    setOpen(false);
                    props.handleClose();
                    props.setFormData({
                        maCtdt: "",
                        tenCtdt: "",
                        maKdcl: "",
                        maKhoa: "",
                        trinhDo: "",
                        soTinChi: 0,
                        maNganh: "",
                        loai: 0
                    })
                }
            } else {
                alert("Vui lòng chọn loại chương trình");
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            // Xử lý lỗi nếu cần
        } finally {
            setOpen(false);
            props.handleClose();
        }
    };

    return (
        open === false ? (
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bổ Sung Chương Trình</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="tenCtdt">
                            <Form.Label>Tên Chương Trình Đào Tạo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Điền tên Chương Trình"
                                name="tenCtdt"
                                value={props.formData.tenCtdt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br/>

                        <Form.Group controlId="namBanHanh">
                            <Form.Label>Loại Chương Trình</Form.Label>
                            <Form.Control name="loai" required as="select" value={props.formData.loai}
                                          onChange={handleChange}>
                                <option value="0">Chọn Loại Chương Trình...</option>
                                <option value="1">Kiểm Định Chất Lượng Đào Tạo</option>
                                <option value="2">Kiểm Định Chất Lượng CSGD</option>
                            </Form.Control>
                        </Form.Group>
                        <br/>
                        {props.formData.loai != 0 && (
                            props.formData.loai == 1 ? (
                                <>
                                    <Form.Group controlId="maKhoa">
                                        <Form.Label>Khoa</Form.Label>
                                        <Form.Control name="maKhoa" required as="select" value={props.formData.maKhoa}
                                                      onChange={handleChange}>
                                            <option value="">Chọn Khoa...</option>
                                            {
                                                props.khoa.map((item, index) => (
                                                    <option key={index} value={item.maKhoa}>{item.tenKhoa}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    <br/>
                                    <Form.Group controlId="trinhDo">
                                        <Form.Label>Trình Độ</Form.Label>
                                        <Form.Control name="trinhDo" required as="select" value={props.formData.trinhDo}
                                                      onChange={handleChange}>
                                            <option value="">Chọn Trình Độ...</option>
                                            {
                                                props.trinhDo.map((item, index) => (
                                                    <option key={index}
                                                            value={item.tenTrinhDo}>{item.tenTrinhDo}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    <br/>
                                    <Form.Group controlId="maNganh">
                                        <Form.Label>Ngành</Form.Label>
                                        <Form.Control name="maNganh" required as="select" value={props.formData.maNganh}
                                                      onChange={handleChange}>
                                            <option value="">Chọn Ngành...</option>
                                            {
                                                props.nganh.map((item, index) => (
                                                    <option key={index}
                                                            value={item.maNganh}>{item.tenNganh} - {item.trinhDo}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    <br/>
                                    <Form.Group controlId="soTinChi">
                                        <Form.Label>Số Tín Chỉ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Điền số tín chỉ"
                                            name="soTinChi"
                                            value={props.formData.soTinChi}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                </>
                            ) : null
                        )}

                        <Button variant="success" type="submit" className="mt-3">
                            Xác nhận
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>) : (<LoadingProcess open={open}/>)
    );
};
const Total = ({maCtdt}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalTieuChuan, setTotalTieuChuan] = useState('');
    const [totalTieuChi, setTotalTieuChi] = useState('');
    const [totalMinhChung, setTotalMinhChung] = useState('');

    useEffect(() => {
        const fetchData = async () => {

            try {
                const tieuChuan = await findTieuChuaByMaCtdt(maCtdt);
                setTotalTieuChuan(tieuChuan.length);
                const tieuChi = await getAllTieuChi();
                const tieuChiMatchTieuChuan = tieuChi.filter(tc =>
                    tieuChuan.find(tch => tch.idTieuChuan === tc.idTieuChuan)
                )
                setTotalTieuChi(tieuChiMatchTieuChuan.length);
                const minhChung = await getAllMinhChung();
                const minhChungMatchTieuChuan = minhChung.filter(mc =>
                    tieuChuan.find(tch => tch.idTieuChuan === mc.idTieuChuan)
                )
                setTotalMinhChung(minhChungMatchTieuChuan.length);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [maCtdt]);

    return (
        <>
            <p>Thống kê : {totalTieuChuan} Tiêu chuân | {totalTieuChi} Tiêu chí | {totalMinhChung} Minh chứng</p>
        </>
    )
}

const ListChuongTrinhDaoTao = ({maKdcl,setOpen}) => {
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            setOpen(true)
            const result = await getAllChuongTrinhDaoTao(maKdcl);
            const filterData = result.filter((item) => item.chuanKdcl && item.chuanKdcl.maKdcl === maKdcl);
            setChuongTrinhDaoTao(filterData);
            if (filterData.length > 0) {
                setMaCtdtGoc(filterData[0].maCtdt);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setOpen(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [maKdcl]);
    const [maCtdtGoc, setMaCtdtGoc] = useState('');
    const goToChuongTrinhDaoTao = (ChuongTrinh_ID) => {
        navigate(`../chi-tiet-chuong-trinh-dao-tao?ChuongTrinh_ID=${ChuongTrinh_ID}`);
    }
    const goToDinhNghiaTieuChuan = (ChuongTrinh_ID) => {
        navigate(`../dinh-nghia-tieu-chuan?ChuongTrinh_ID=${ChuongTrinh_ID}`);
    }
    const copyChuongTrinhDaoTao = async (maCtdt) => {
        setOpen(true)
        const formData = new FormData();
        formData.append("maCtdt_1", maCtdtGoc);
        formData.append("maCtdt_2", maCtdt);
        const response = await copyCtdt(formData);
        if(response === "OK"){
            fetchData(); 
            setOpen(false);
        }
    }


    return (
        <div className="container py-3">
            {chuongTrinhDaoTao.map((item, index) => (
                <div key={item.maCtdt} className="mb-4 p-3 border rounded shadow-sm bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0 fw-bold">
                            {index + 1}. {item.tenCtdt}
                        </p>
                    </div>
                    <div className="mt-2">
                        <Total maCtdt={item.maCtdt}/>
                    </div>
                    <div className="mt-3 d-flex align-items-center">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => goToChuongTrinhDaoTao(item.maCtdt)}
                        >
                            <i className="fas fa-info-circle me-2"></i>Chi tiết
                        </button>
                        <button
                            className="btn btn-success btn-sm ms-2"
                            onClick={() => goToDinhNghiaTieuChuan(item.maCtdt)}
                        >
                            <i className="fas fa-pencil-alt me-2"></i>Định nghĩa tiêu chuẩn
                        </button>
                        {index !== 0 && (
                            <button
                                className="btn btn-warning btn-sm ms-2"
                                onClick={() => copyChuongTrinhDaoTao(item.maCtdt)}
                            >
                                <i className="fas fa-copy me-2"></i>Sao Chép Dữ Liệu
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>

    );
};

const AdminChuongTrinhDaoTao = () => {
    const [chuanKDCL, setChuanKDCL] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [khoa, setKhoa] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [trinhDo, setTrinhDo] = useState([{idTrinhDo: "Cao Đẳng", tenTrinhDo: "Cao Đẳng"}, {
        idTrinhDo: "Đại Học",
        tenTrinhDo: "Đại Học"
    }, {idTrinhDo: "Cao Học", tenTrinhDo: "Cao Học"}]);
    const [formData, setFormData] = useState({
        maCtdt: "",
        tenCtdt: "",
        maKdcl: "",
        maKhoa: "",
        trinhDo: "",
        soTinChi: 0,
        maNganh: "",
        loai: 0
    })
    const getChuanKDCL = async () => {
        setLoading(true)
        try {
            const result = await getKdclData();
            setChuanKDCL(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const getData = async () => {
            try {
                const result = await getKhoa();
                setKhoa(result);
                const result_2 = await getNganh();
                setNganh(result_2)
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getData();
        getChuanKDCL();
    }, []);
    const handleCreateCtdt = (maKdcl) => {
        handleShow();
        setFormData({...formData, "maKdcl": maKdcl});
    }
    const props = {
        formData: formData,
        setFormData: setFormData,
        khoa: khoa,
        handleClose: handleClose,
        show: show,
        fetchData: getChuanKDCL,
        trinhDo: trinhDo,
        nganh: nganh
    }
    if (loading) {
        return ('Loading...')
    }
    return (
        <div className="content bg-white p-5">
            <LoadingProcess open={open}/>
            <PopupForm {...props} />

            {chuanKDCL.length > 0 ? (
                chuanKDCL.map(({maKdcl, tenKdcl}, index) => (
                    <div key={maKdcl} className="mb-4">
                        <div className="row align-items-center">
                            <div className="col-md-8 col-12">
                                <p className="mb-0 fw-bold">
                                    {index + 1}. {tenKdcl}
                                </p>
                            </div>
                            <div className="col-md-4 col-12 text-md-end text-start mt-2 mt-md-0">
                                <button
                                    className="btn btn-success btn-sm p-2"
                                    onClick={() => handleCreateCtdt(maKdcl)}
                                >
                                    <i className="fas fa-plus-circle me-2"></i>Bổ Sung Chương Trình
                                </button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <ListChuongTrinhDaoTao maKdcl={maKdcl} setOpen={setOpen}/>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-4">
                    <i className="fas fa-exclamation-circle fa-2x text-muted"></i>
                    <p className="mt-3 text-muted">Không có dữ liệu nào hiển thị.</p>
                </div>
            )}
        </div>

    );
};

export default AdminChuongTrinhDaoTao;
