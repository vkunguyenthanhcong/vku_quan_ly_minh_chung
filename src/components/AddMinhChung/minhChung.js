import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import font from "../font";
import "./minhChung.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
    deleteMinhChung,
    getAllKhoMinhChung,
    getAllLoaiMinhChung,
    getAllMinhChungWithIdGoiY,
    saveFromKMCtoMinhChung,
    saveMinhChung,
    searchLoaiVanBanByDate,
    searchLoaiVanBanByNotDate,
} from "../../services/apiServices";
import PdfPreview from "../../services/PdfPreview";
import { createMaMinhChung, format2Number } from "../../services/formatNumber";
const MinhChung = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [link, setLink] = useState("");
    const [soVanBan, setSoVanBan] = useState("");
    const [trichDan, setTrichDan] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [loaiVanBan, setLoaiVanBan] = useState([]);
    const [khoMinhChung, setKhoMinhChung] = useState([]);
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const addMinhChung = JSON.parse(localStorage.getItem("addMinhChung"));
    const tieuChuan = JSON.parse(localStorage.getItem("tieuChuan"));
    const fetchData = async () => {
        try {
            const result = await getAllKhoMinhChung();
            const loaiMC = await getAllLoaiMinhChung();
            const mC = await getAllMinhChungWithIdGoiY(addMinhChung.idGoiY);
            setMinhChung(mC);
            setLoaiVanBan(loaiMC);
            setKhoMinhChung(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/quan-ly/them-minh-chung");
    };
    const handleClickViewPDF = (link) => {
        setLink(link);
        openModal();
    };
    const search = async () => {
        if (startDate == "" && endDate == "") {
            try {
                const result = await searchLoaiVanBanByNotDate(
                    trichDan,
                    soVanBan,
                    selectedId
                );
                setKhoMinhChung(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        } else if (startDate == "" || endDate == "") {
            alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc ");
        } else {
            try {
                const result = await searchLoaiVanBanByDate(
                    trichDan,
                    soVanBan,
                    selectedId,
                    startDate,
                    endDate
                );
                setKhoMinhChung(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const saveFromKMCtoMC = async (idKmc) => {
        const dataMinhChung = new FormData();
        const parentMaMc = createMaMinhChung({
            sttTieuChuan: format2Number(tieuChuan.stt),
            sttTieuChi: format2Number(addMinhChung.stt),
        });
        dataMinhChung.append("idKmc", idKmc);
        dataMinhChung.append("idTieuChuan", tieuChuan.idTieuChuan);
        dataMinhChung.append("idGoiY", addMinhChung.idGoiY);
        dataMinhChung.append("parentMaMc", parentMaMc);
        dataMinhChung.append("childMaMc", format2Number(minhChung.length + 1));
        try {
            const response = await saveFromKMCtoMinhChung(dataMinhChung);
            fetchData();
        } catch (err) {
            setError(err);
        }
    };
    const deleteMC = async (idMc, parentMaMc) => {
        
        const response = await deleteMinhChung(idMc, parentMaMc);
        fetchData();
    }
    return (
        <div
            className="content"
            style={{ background: "white", margin: "20px", padding: "20px" }}
        >
            <p style={{ fontSize: "20px" }}>
                Tìm kiếm minh chứng cho Tiêu Chuẩn Mục tiêu và chuẩn đầu ra của chương
                trình đào tạo
            </p>
            <button className="btn btn-success">Quản lý minh chứng</button>
            <button
                onClick={handleClick}
                className="btn btn-success"
                style={{ marginLeft: "20px" }}
            >
                Thêm minh chứng
            </button>
            <br />
            <br />
            <Row>
                <Col xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className="font-Inter">
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        className="text-black"
                                        style={{ backgroundColor: "#DEF3FE" }}
                                    >
                                        <b>Số văn bản</b>
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={soVanBan}
                                            onChange={(e) => setSoVanBan(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell
                                        className="text-black"
                                        style={{ backgroundColor: "#DEF3FE" }}
                                    >
                                        <b>Trích dẫn</b>
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={trichDan}
                                            onChange={(e) => setTrichDan(e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        className="text-black"
                                        style={{ backgroundColor: "#DEF3FE" }}
                                    >
                                        <b>Ngày ban hành</b>
                                    </TableCell>
                                    <TableCell>
                                        <span>Từ ngày</span>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <br />
                                        <span>Đến ngày</span>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell
                                        className="text-black"
                                        style={{ backgroundColor: "#DEF3FE" }}
                                    >
                                        <b>Loại văn bản</b>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            id="loaiCongVan"
                                            className="form-select"
                                            value={selectedId}
                                            onChange={(e) => setSelectedId(e.target.value)}
                                        >
                                            <option value="">--Vui lòng chọn--</option>
                                            {loaiVanBan.map((option) => (
                                                <option key={option.id} value={option.idLoai}>
                                                    {option.tenLoai}
                                                </option>
                                            ))}
                                        </select>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button
                        style={{ width: "100%" }}
                        className="btn btn-primary"
                        onClick={search}
                    >
                        Tìm kiếm
                    </button>
                    <hr style={{ border: "1px solid black" }} />
                    <TableContainer component={Paper} className="shadow-none">
                        <Table className="font-Inter">
                            <TableBody>
                                {khoMinhChung.map((row, index) => (
                                    <TableRow>
                                        <TableCell>
                                            <b>{row.tenMinhChung}</b>
                                        </TableCell>
                                        <TableCell width={150}>
                                            <b>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleClickViewPDF(row.linkLuuTru)}
                                                >
                                                    Xem nhanh
                                                </button>
                                            </b>
                                            <br />
                                            <b>
                                                <button className="btn btn-success space-5">Sửa</button>
                                            </b>
                                            <br />

                                            {minhChung.length > 0 ? (
                                                minhChung.find(
                                                    (item) => item.idKmc === row.idKhoMinhChung
                                                ) ? null : (
                                                    <button
                                                        className="btn btn-info space-5"
                                                        onClick={() => saveFromKMCtoMC(row.idKhoMinhChung)}
                                                    >
                                                        Thêm
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    className="btn btn-info space-5"
                                                    onClick={() => saveFromKMCtoMC(row.idKhoMinhChung)}
                                                >
                                                    Thêm
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                <Col xs={12} md={6}>
                    <p>Minh chứng đang có</p>
                    <p>
                        <b>- Tên tiêu chí: </b>
                        {addMinhChung.tenTieuChi}{" "}
                    </p>
                    <p>
                        <b>- Nguồn minh chứng: </b>
                        {addMinhChung.tenGoiY}
                    </p>
                    <br />
                    <TableContainer component={Paper}>
                        <Table className="font-Inter">
                            <TableHead style={{ backgroundColor: "transparent" }}>
                                <TableRow>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên minh chứng</TableCell>
                                    <TableCell>Tùy chọn</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {minhChung.map((row, index) => (
                                    <TableRow>
                                        <TableCell width = {150}>{row.parentMaMc}{row.childMaMc}</TableCell>
                                        <TableCell>{row.tenMinhChung}</TableCell>
                                        <TableCell width={150}>
                                            <button className="btn btn-secondary" onClick={() => handleClickViewPDF(row.linkLuuTru)}>Xem nhanh</button>
                                            <br />
                                            <button className="btn btn-primary space-5">Sửa</button>
                                            <br />
                                            <button onClick={() => deleteMC(row.idMc, row.parentMaMc)}  className="btn btn-danger space-5">Xoá</button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
            </Row>
            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link} />
        </div>
    );
};
export default MinhChung;
