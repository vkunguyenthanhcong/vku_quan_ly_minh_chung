import React, {useEffect, useState} from "react";
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
import "./minhChung.css";
import {useLocation} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {
    deleteMinhChung, findTieuChuaByMaCtdt, getAllGoiY,
    getAllKhoMinhChung,
    getAllLoaiMinhChung, getAllMinhChung, getAllMocChuan, getGoiYById, getTieuChiById, getTieuChuanById,
    saveFromKMCtoMinhChung,
    saveMinhChungDungChung,
    searchLoaiVanBanByDate,
    searchLoaiVanBanByNotDate,
} from "../../../../services/apiServices";
import PdfPreview from "../../../../services/PdfPreview";
import {createMaMinhChung, format2Number} from "../../../../services/formatNumber";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";


const MinhChung = ({KhungCTDT_ID, dataTransfer, setDataTransfer ,setNoCase}) => {
    const token = localStorage.getItem('token');
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
    const [minhChung, setMinhChung] = useState(null);

    const [goiY, setGoiY] = useState([]);
    const [tieuChi, setTieuChi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);

    const location = useLocation();
    const GoiY_ID = dataTransfer.GoiY_ID;
    const TieuChi_ID = dataTransfer.TieuChi_ID;
    const TieuChuan_ID = dataTransfer.TieuChuan_ID;

    const fetchData = async () => {
        setLoading(true);
        try {
            const tieuChuanData = await findTieuChuaByMaCtdt(KhungCTDT_ID);
            const idTieuChuanArray = tieuChuanData.map(item => item.idTieuChuan);
            const mocChuanData = await getAllMocChuan();
            const minhChungData = await getAllMinhChung();

            const goiYAll = await getAllGoiY();
            const khoMinhChungData = await getAllKhoMinhChung();
            const updatedMinhChung = minhChungData
                .filter(item => idTieuChuanArray.includes(item.idTieuChuan))
                .map(item => {
                    const maMinhChung = `${item.parentMaMc || 'H1'}${item.childMaMc || ''}`;
                    const idMocChuan = goiYAll.find((gy) => gy.idGoiY === item.idGoiY).idMocChuan;
                    const idTieuChi = mocChuanData.find((mc) => mc.idMocChuan === idMocChuan).idTieuChi;
                    const khoMinhChung = khoMinhChungData.find(kmc => kmc.idKhoMinhChung === item.idKhoMinhChung);
                    if (item.maDungChung !== 0) {
                        const matchingItem = minhChungData.find(mc => mc.idMc === item.maDungChung);

                        if (matchingItem) {
                            return {
                                ...item,
                                khoMinhChung: khoMinhChung,
                                parentMaMc: matchingItem.parentMaMc,   // Copy parentMaMc from matching item
                                childMaMc: matchingItem.childMaMc,     // Copy childMaMc from matching item
                                maMinhChung: `${matchingItem.parentMaMc || 'H1'}${matchingItem.childMaMc || ''}`, // Copy maMinhChung from matching item
                                idTieuChi: idTieuChi// Assign idTieuChi if found
                            };
                        }
                    }
                    return {
                        ...item,khoMinhChung: khoMinhChung,
                        maMinhChung,
                        idTieuChi: idTieuChi
                    };
                });
            const tieuChiData = await getTieuChiById(TieuChi_ID);
            const loaiVanBanData = await getAllLoaiMinhChung();
            const goiYData = await getGoiYById(GoiY_ID);
            setMinhChung(updatedMinhChung);
            setLoaiVanBan(loaiVanBanData);
            setKhoMinhChung(khoMinhChungData);
            setGoiY(goiYData);
            setTieuChi(tieuChiData);
            setLoading(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleClick = () => {
        setNoCase(4);
        setDataTransfer({
            ...dataTransfer,
            GoiY_ID : GoiY_ID,
            TieuChi_ID : TieuChi_ID,
            TieuChuan_ID : TieuChuan_ID,
            KhungCTDT_ID : KhungCTDT_ID
        })
        // navigate(`/quan-ly/quan-ly-minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}&TieuChuan_ID=${TieuChuan_ID}&KhungCTDT_ID=${KhungCTDT_ID}`);
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
                    selectedId,
                    token
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
                    endDate,
                    token
                );
                setKhoMinhChung(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const saveFromKMCtoMC = async (idKmc, idParent) => {
        setOpen(true)
        if (tieuChi !== "") {
            try {
                const response = await getTieuChuanById(TieuChuan_ID);

                if (response) {
                    const dataMinhChung = new FormData();
                    const parentMaMc = createMaMinhChung({
                        sttTC: response.stt,
                        sttTieuChuan: format2Number(response.stt),
                        sttTieuChi: format2Number(tieuChi.stt),
                    });

                    dataMinhChung.append("idKmc", idKmc);
                    dataMinhChung.append("idTieuChuan", response.idTieuChuan);
                    dataMinhChung.append("idGoiY", goiY.idGoiY);
                    dataMinhChung.append("parentMaMc", parentMaMc);
                    dataMinhChung.append("linkLuuTru", idParent);
                    dataMinhChung.append("folderIdParent", tieuChi.idGoogleDrive);

                    const filter = minhChung?.filter(item =>
                        item.maDungChung === 0 && item.idTieuChi === TieuChi_ID
                    );
                    dataMinhChung.append("childMaMc", format2Number(filter.length + 1));

                    const result = await saveFromKMCtoMinhChung(dataMinhChung);
                    if(result === "OK"){
                        fetchData();
                        setOpen(false);
                    }
                }
            } catch (err) {
                setError(err);
            }
        }

    };
    const saveDungChung = async (idKmc, idMc) => {
        setOpen(true)
        try {
            const dataMinhChung = new FormData();

            dataMinhChung.append("idKmc", idKmc);
            dataMinhChung.append("idTieuChuan", TieuChuan_ID);
            dataMinhChung.append("idGoiY", goiY.idGoiY);
            dataMinhChung.append("maDungChung", idMc);

            const response = await saveMinhChungDungChung(dataMinhChung);
            if(response === "OK"){
                setOpen(false)
                fetchData();
            }
        } catch (err) {
            setError(err);
        }

    };
    const deleteMC = async (idMc, parentMaMc) => {
        try {
            setOpen(true);
            const response = await deleteMinhChung(idMc, parentMaMc);
            if (response === "OK") {
                setOpen(false);
                fetchData();
            } else {
                setError('Failed to delete Minh Chung.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while deleting Minh Chung.');
        }
    };
    const handleClickEdit = (EvidenceID) => {
        // navigate(`/quan-ly/quan-ly-minh-chung?EvidenceID=${EvidenceID}&GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}`);
        setNoCase(4);
        setDataTransfer({
            ...dataTransfer,
            GoiY_ID : GoiY_ID,
            TieuChi_ID : TieuChi_ID,
            TieuChuan_ID : TieuChuan_ID,
            KhungCTDT_ID : KhungCTDT_ID,
            idMc : EvidenceID
        })
    }
    const Button_Them = ({idKMC, idParent}) => {

        const response = minhChung.filter(item => item.khoMinhChung.idKhoMinhChung === idKMC);
        // Component DungChung nhận props là data
        const DungChung = ({data}) => {
            const filteredData = data.filter(item => item.idTieuChi === TieuChi_ID);
            return (
                <>
                    {filteredData.length > 0 ? null : (
                        <button onClick={() => saveDungChung(idKMC, data[0].idMc)} className="btn btn-success"><i className="fas fa-plus"></i></button>)}
                </>
            );
        };

        return (
            <>
                {response.length > 0 ? (
                    <DungChung data={response}/>
                ) : (
                    <button onClick={() => saveFromKMCtoMC(idKMC, idParent)}
                            className="btn btn-success">
                        <i className="fas fa-plus"></i>
                    </button>
                    )}
            </>
        );
    };

    return (
        <div
            className="content"
            style={{background: "white", margin: "20px", padding: "20px"}}
        >
            <LoadingProcess open={open}/>

            <h5 className="mb-4">
                <strong>Tìm kiếm minh chứng cho Tiêu Chuẩn Mục tiêu và chuẩn đầu ra của chương trình đào tạo</strong>
            </h5>

            <button
                onClick={handleClick}
                className="btn btn-success mb-4 d-flex align-items-center"
            >
                <i className="fas fa-plus me-2"></i>Thêm minh chứng
            </button>

            <Row className="g-4">
                <Col xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className="table table-striped table-bordered">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="bg-light text-dark"><b>Số văn bản</b></TableCell>
                                    <TableCell>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={soVanBan}
                                            onChange={(e) => setSoVanBan(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="bg-light text-dark"><b>Trích dẫn</b></TableCell>
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
                                    <TableCell className="bg-light text-dark"><b>Ngày ban hành</b></TableCell>
                                    <TableCell>
                                        <label className="form-label">Từ ngày</label>
                                        <input
                                            className="form-control mb-2"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <label className="form-label">Đến ngày</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="bg-light text-dark"><b>Loại văn bản</b></TableCell>
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
                        style={{width: "100%"}}
                        className="btn btn-primary mt-3 d-flex align-items-center justify-content-center"
                        onClick={search}
                    >
                        <i className="fas fa-search me-2"></i>Tìm kiếm
                    </button>

                    <hr style={{border: "1px solid black"}}/>

                    <TableContainer component={Paper} className="scrollable-table-container">
                        <Table className="table table-hover">
                            <TableBody>
                                {khoMinhChung.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell><b>{row.soHieu}</b></TableCell>
                                        <TableCell><b>{row.tenMinhChung}</b></TableCell>
                                        <TableCell className="" width={200}>
                                            <div className="btn-group justify-content-center d-flex" role="group">
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleClickViewPDF("https://drive.google.com/file/d/" + row.linkLuuTru + "/preview")}
                                                >
                                                    <i className="fas fa-eye"></i></button>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleClickEdit(row.idKhoMinhChung)}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                </button>
                                                <Button_Them idKMC={row.idKhoMinhChung} idParent={row.linkLuuTru}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>

                <Col xs={12} md={6}>
                    <h6><strong>- Tiêu chí:</strong> {tieuChi.tenTieuChi}</h6>
                    <h6><strong>- Gợi ý minh chứng:</strong> {goiY.tenGoiY}</h6>

                    <TableContainer component={Paper} className="mt-3">
                        <Table className="table table-bordered">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Mã</strong></TableCell>
                                    <TableCell><strong>Tên minh chứng</strong></TableCell>
                                    <TableCell><strong>Tùy chọn</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {minhChung && minhChung.filter(item => item.idGoiY === GoiY_ID).map((item, index) => {
                                    const filteredItem = item.maDungChung !== 0 ? minhChung.find(i => i.idMc === item.maDungChung) : null;
                                    const maMinhChungDisplay = item.maDungChung === 0 ? item.maMinhChung : (filteredItem ? filteredItem.maMinhChung : '');
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{maMinhChungDisplay}</TableCell>
                                            <TableCell>{item.khoMinhChung.tenMinhChung}</TableCell>
                                            <TableCell>
                                                <div className="btn-group justify-content-center d-flex" role="group">
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() => handleClickViewPDF("https://drive.google.com/file/d/" + item.linkLuuTru + "/preview")}
                                                    >
                                                        <i className="fas fa-eye me-1"></i></button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => deleteMC(item.idMc)}
                                                    >
                                                        <i className="fas fa-trash me-1"></i>
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
            </Row>

            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link}/>
        </div>
    );
};
export default MinhChung;
