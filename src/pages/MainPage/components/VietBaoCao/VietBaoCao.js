import React, {useEffect, useState} from "react";
import {
    findTieuChuaByMaCtdt,
    getAllPhanCongByIdPhongBan, getAllTieuChi,
    getThongTinCTDT
} from "../../../../services/apiServices";
import {useLocation, useNavigate} from "react-router-dom";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const TieuChi = ({idTieuChuan, phongBanUser, setNoCase, setDataTransfer}) => {
    const [tieuChi, setTieuChi] = useState([])

    const navigate = useNavigate()

    useState(() => {
        const fetchData = async () => {
            try {
                const response = await getAllTieuChi();
                const filterResult = response.filter((item) => item.idTieuChuan === idTieuChuan);
                setTieuChi(filterResult)
            } catch (error) {

            }
        }
        fetchData()
    }, [])
    const goToVietBaoCao = (idTieuChi) => {
        setNoCase(3)
        setDataTransfer({
            TieuChuan_ID: idTieuChuan,
            TieuChi_ID: idTieuChi,
            NhomCongTac: phongBanUser
        })
        // navigate(`../viet-bao-cao-tieu-chi?TieuChuan_ID=${idTieuChuan}&TieuChi_ID=${idTieuChi}&NhomCongTac=${phongBanUser}`)
    }
    const viewPhieuDanhGia = (idTieuChi) => {
        window.open(`danh-gia-tieu-chi?TieuChuan_ID=${idTieuChuan}&TieuChi_ID=${idTieuChi}`, '_blank');
    }

    return (
        <>
            {tieuChi.map((item, index) => (
                <TableRow key={index} className="align-middle">
                    <TableCell style={{ width: '10%', fontWeight: 'bold', verticalAlign: 'middle' }}>
                        Tiêu chí {item.stt}
                    </TableCell>
                    <TableCell style={{ width: '40%', verticalAlign: 'middle' }}>
                        <span title={item.tenTieuChi}>{item.tenTieuChi}</span>
                    </TableCell>
                    <TableCell style={{ width: '15%' }}>
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => goToVietBaoCao(item.idTieuChi)}
                            title="Viết Báo Cáo"
                        >
                            <i className="fas fa-edit me-2"></i> Viết Báo Cáo
                        </button>
                    </TableCell>
                    <TableCell style={{ width: '15%' }}>
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => viewPhieuDanhGia(item.idTieuChi)}
                            title="Xem Phiếu Đánh Giá"
                        >
                            <i className="fas fa-file-alt me-2"></i> Phiếu Đánh Giá
                        </button>
                    </TableCell>
                </TableRow>
            ))}
        </>

    )

}

const VietBaoCao = ({KhungCTDT_ID, setNoCase, setDataTransfer, dataTransfer}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [tieuChuan, setTieuChuan] = useState([])
    const [phanCong, setPhanCong] = useState([])

    const phongBanUser = localStorage.getItem('phongBan');
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ThongTinCTDT
                const response = await getThongTinCTDT(KhungCTDT_ID);
                setChuongTrinhDaoTao([response]);

                // Check if response contains chuongTrinhDaoTao and has length
                if (response?.chuanKdcl?.maKdcl) {
                    const maKdcl = response.chuanKdcl.maKdcl;

                    try {
                        // Fetch AllPhanCongByIdPhongBan using phongBanUser and maKdcl
                        const response_3 = await getAllPhanCongByIdPhongBan(phongBanUser, maKdcl);

                        // Update state with the fetched PhanCong data
                        if (response_3.length > 0) {
                            setPhanCong(response_3); // No need to wrap response_3 in an array

                            // Fetch TieuChuanWithMaCtdt
                            const response_2 = await findTieuChuaByMaCtdt(KhungCTDT_ID);
                            const filteredStt = response_2.filter(item => item.stt >= response_3[0].sttTieuChuanBatDau && item.stt <= response_3[0].sttTieuChuanKetThuc);
                            setTieuChuan(filteredStt);
                        } else {
                            setPhanCong([]); // Handle the case when response_3 is empty
                        }
                    } catch (error) {
                        // Handle error in fetching PhanCong data
                        console.error('Error fetching PhanCong data:', error);
                        setPhanCong([]); // Set an empty array in case of error
                    }
                } else {
                    setPhanCong([]); // Handle the case where maKdcl is not present
                }
            } catch (error) {
                // Handle any other error in the main fetch process
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [KhungCTDT_ID, phongBanUser]);
    const VietBaoCaoTieuChuan = (idTieuChuan) => {
        setNoCase(4)
        setDataTransfer({
            ...dataTransfer,
            TieuChuan_ID: idTieuChuan,
            NhomCongTac: phongBanUser
        })
    }
    return (
        <div className="content bg-white m-3 p-4">
            {chuongTrinhDaoTao && chuongTrinhDaoTao.length > 0 ? (
                <>
                    <p className="text-center text-uppercase" style={{fontSize : '20px'}}><b>{chuongTrinhDaoTao[0].tenCtdt}</b></p>
                    <p>- Chuẩn đánh giá :
                        <button className="btn btn-secondary ms-1">
                            {chuongTrinhDaoTao[0].chuanKdcl.tenKdcl}
                        </button>
                    </p>
                    {
                        chuongTrinhDaoTao[0].khoa ? (
                            <div>
                                <p>- Thuộc Khoa: {chuongTrinhDaoTao[0].khoa.tenKhoa}</p>
                                <p>Web: <b>{chuongTrinhDaoTao[0].khoa.web}</b> -
                                    Email: <b>{chuongTrinhDaoTao[0].khoa.email}</b> - Điện
                                    thoại: <b>{chuongTrinhDaoTao[0].khoa.sdt}</b></p>
                            </div>
                        ) : ''
                    }

                    {
                        chuongTrinhDaoTao[0].nganh ? (
                            <div>
                                <p> Thuộc Ngành : {chuongTrinhDaoTao[0].nganh.tenNganh}</p>
                            </div>
                        ) : ''
                    }

                    <TableContainer component={Paper}>
                        <Table className = "table-hover">
                            <TableHead>
                                <TableRow id='table-row-color'>
                                    <TableCell className="text-white" style={{width: '10%'}}>STT</TableCell>
                                    <TableCell className="text-white">Tiêu Chuẩn</TableCell>
                                    <TableCell className="text-white">Viết báo cáo</TableCell>
                                    <TableCell className="text-white">Phiếu đánh giá</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tieuChuan.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className=""
                                                       style={{width: '10%'}}><b>{index + 1}</b></TableCell>
                                            <TableCell className="" colSpan={1}><b>Tiêu
                                                chuẩn {item.stt}. {item.tenTieuChuan}</b></TableCell>
                                            <TableCell colSpan={2}>
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() => VietBaoCaoTieuChuan(item.idTieuChuan)}
                                                    title="Viết Báo Cáo"
                                                >
                                                    <i className="fas fa-edit me-2"></i> Viết Báo
                                                    Cáo Tiêu Chuẩn
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                        <TieuChi idTieuChuan={item.idTieuChuan}
                                                 phongBanUser={phongBanUser} setNoCase={setNoCase}
                                                 setDataTransfer={setDataTransfer}/>
                                    </React.Fragment>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : ('Loading...')}

        </div>
    )
}
export default VietBaoCao;
