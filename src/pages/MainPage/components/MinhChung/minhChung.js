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
import {useLocation, useNavigate} from "react-router-dom";
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


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
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
            const updatedMinhChung = minhChungData
                .filter(item => idTieuChuanArray.includes(item.idTieuChuan))
                .map(item => {
                    const maMinhChung = `${item.parentMaMc || 'H1'}${item.childMaMc || ''}`;
                    const idMocChuan = goiYAll.find((gy) => gy.idGoiY == item.idGoiY).idMocChuan;
                    const idTieuChi = mocChuanData.find((mc) => mc.idMocChuan == idMocChuan).idTieuChi;
                    if (item.maDungChung !== 0) {
                        const matchingItem = minhChungData.find(mc => mc.idMc === item.maDungChung);

                        if (matchingItem) {
                            return {
                                ...item,
                                khoMinhChung: matchingItem.khoMinhChung,
                                parentMaMc: matchingItem.parentMaMc,   // Copy parentMaMc from matching item
                                childMaMc: matchingItem.childMaMc,     // Copy childMaMc from matching item
                                maMinhChung: `${matchingItem.parentMaMc || 'H1'}${matchingItem.childMaMc || ''}`, // Copy maMinhChung from matching item
                                idTieuChi: idTieuChi// Assign idTieuChi if found
                            };
                        }
                    }
                    return {
                        ...item,
                        maMinhChung,
                        idTieuChi: idTieuChi
                    };
                });
            const tieuChiData = await getTieuChiById(TieuChi_ID);
            const loaiVanBanData = await getAllLoaiMinhChung();
            const khoMinhChungData = await getAllKhoMinhChung();
            const goiYData = await getGoiYById(GoiY_ID);
            setMinhChung(updatedMinhChung);
            setLoaiVanBan(loaiVanBanData);
            setKhoMinhChung(khoMinhChungData);
            setGoiY(goiYData);
            setTieuChi(tieuChiData);
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
                        item.maDungChung == 0 && item.idTieuChi == TieuChi_ID
                    );
                    dataMinhChung.append("childMaMc", format2Number(filter.length + 1));

                    const response_1 = await saveFromKMCtoMinhChung(dataMinhChung);
                    if(response_1 === "OK"){
                        fetchData();
                    }
                }
            } catch (err) {
                setError(err);
            }
        }

    };
    const saveDungChung = async (idKmc, idMc) => {
        try {
            const dataMinhChung = new FormData();

            dataMinhChung.append("idKmc", idKmc);
            dataMinhChung.append("idTieuChuan", TieuChuan_ID);
            dataMinhChung.append("idGoiY", goiY.idGoiY);
            dataMinhChung.append("maDungChung", idMc);

            const response = await saveMinhChungDungChung(dataMinhChung);
            if(response === "OK"){
                fetchData();
            }
        } catch (err) {
            setError(err);
        }

    };
    const deleteMC = async (idMc, parentMaMc) => {
        try {
            const response = await deleteMinhChung(idMc, parentMaMc);
            if (response) {
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

        const response = minhChung.filter(item => item.khoMinhChung.idKhoMinhChung == idKMC);

        // Component DungChung nhận props là data
        const DungChung = ({data}) => {
            const filteredData = data.filter(item => item.idTieuChi == TieuChi_ID);
            return (
                <>
                    {filteredData.length > 0 ? null : (
                        <button onClick={() => saveDungChung(idKMC, data[0].idMc)} className="btn btn-success mt-2">Dùng
                            chung</button>)}
                </>
            );
        };

        return (
            <>
                {response.length > 0 ? (
                    <DungChung data={response}/>
                ) : (
                    <button onClick={() => saveFromKMCtoMC(idKMC, idParent)} style={{marginTop: '5px'}}
                            className="btn btn-success">
                        Thêm
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
            <p style={{fontSize: "20px"}}>
                Tìm kiếm minh chứng cho Tiêu Chuẩn Mục tiêu và chuẩn đầu ra của chương
                trình đào tạo
            </p>
            <button
                onClick={handleClick}
                className="btn btn-success"
                style={{marginLeft: "20px"}}
            >
                Thêm minh chứng
            </button>
            <br/>
            <br/>
            <Row>
                <Col xs={12} md={6}>
                    <TableContainer component={Paper}>
                        <Table className="font-Inter">
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        className="text-black"
                                        style={{backgroundColor: "#DEF3FE"}}
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
                                        style={{backgroundColor: "#DEF3FE"}}
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
                                        style={{backgroundColor: "#DEF3FE"}}
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
                                        <br/>
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
                                        style={{backgroundColor: "#DEF3FE"}}
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
                        style={{width: "100%"}}
                        className="btn btn-primary"
                        onClick={search}
                    >
                        Tìm kiếm
                    </button>
                    <hr style={{border: "1px solid black"}}/>
                    <TableContainer component={Paper} className="shadow-none scrollable-table-container">
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
                                                    onClick={() => handleClickViewPDF("https://drive.google.com/file/d/" + row.linkLuuTru + "/preview")}
                                                >
                                                    Xem nhanh
                                                </button>
                                            </b>
                                            <br/>
                                            <b>
                                                <button className="btn btn-primary space-5"
                                                        onClick={() => handleClickEdit(row.idKhoMinhChung)}>Sửa
                                                </button>
                                            </b>
                                            <br/>
                                            <Button_Them idKMC={row.idKhoMinhChung} idParent={row.linkLuuTru}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                <Col xs={12} md={6}>
                    <p>
                        <b>- Tiêu chí: </b>
                        {tieuChi.tenTieuChi}
                    </p>
                    <p>
                        <b>- Gợi ý minh chứng: </b>
                        {goiY.tenGoiY}
                    </p>
                    <br/>
                    <TableContainer component={Paper}>
                        <Table className="font-Inter">
                            <TableHead style={{backgroundColor: "transparent"}}>
                                <TableRow>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên minh chứng</TableCell>
                                    <TableCell>Tùy chọn</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {minhChung && minhChung
                                    .filter(item => item.idGoiY == GoiY_ID) // Filter based on GoiY_ID
                                    .map((item, index) => {
                                        // Find the matching item if maDungChung is not 0
                                        const filteredItem = item.maDungChung !== 0
                                            ? minhChung.find(i => i.idMc === item.maDungChung)
                                            : null;

                                        // Determine which maMinhChung to display
                                        const maMinhChungDisplay = item.maDungChung === 0
                                            ? item.maMinhChung
                                            : (filteredItem ? filteredItem.maMinhChung : '');

                                        // Prepare modifiedString only if maDungChung is 0
                                        const modifiedString = item.maDungChung === 0
                                            ? item.maMinhChung.slice(0, -3) + '.'
                                            : null;

                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{maMinhChungDisplay}</TableCell>
                                                <TableCell>{item.khoMinhChung.tenMinhChung}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => handleClickViewPDF(item.linkLuuTru)}
                                                        >
                                                            Xem nhanh
                                                        </button>
                                                        <br/>
                                                        <button
                                                            className="btn btn-danger"
                                                            style={{marginTop: '5px'}}
                                                            onClick={() => deleteMC(item.idMc, modifiedString)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
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
