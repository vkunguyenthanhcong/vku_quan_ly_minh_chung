//
// import React, { useEffect, useState } from 'react';
// import { styled } from '@mui/material/styles';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import {getKdclData, getCtdtDataByMaKDCL, getAllChuongTrinhDaoTao} from '../../../../services/apiServices';
// import { useNavigate, useLocation } from 'react-router-dom';
//
// //danh sach chuong trinh dao tao
//
// const TrangChu = () => {
//   const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const action = queryParams.get('action');
//     const [chuanKdcl, setChuanKdcl] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   //danh sach chuan kiem dinh chat luong
//   useEffect(() => {
//     const fetchDataFromAPI = async () => {
//       try {
//         const result = await getKdclData();
//         setChuanKdcl(result);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDataFromAPI();
//   }, []);
//   const GenericList = ({ maKdcl }) => {
//     const [data, setData] = useState(null);
//     const navigate = useNavigate();
//     const handleButtonClick = (maCtdt) => {
//       if(action === "QuanLyTieuChuan"){
//         navigate(`chuong-trinh-dao-tao?KhungCTDT_ID=${maCtdt}`);
//       }else if(action === "DinhNghiaTieuChuan"){
//         navigate(`tieu-chuan?KhungCTDT_ID=${maCtdt}`);
//       }else if(action === "BaoCaoTuDanhGia"){
//         navigate(`bao-cao-tu-danh-gia?KhungCTDT_ID=${maCtdt}`);
//       }
//     };
//
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const result = await getAllChuongTrinhDaoTao();
//           const filteredData = result.filter(item => item.chuanKdcl && item.chuanKdcl.maKdcl === maKdcl);
//           setData(filteredData)
//         } catch (err) {
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }, []);
//     return (
//         <ul>
//           {data ? data.map((item, index) => (
//               <li style={{marginBottom : '20px', marginTop : '20px', listStyleType : 'none'}} key={index}><button onClick={() => handleButtonClick(item.maCtdt, item.tenCtdt)} className='btn btn-primary'>{item.tenCtdt}</button></li>
//           )) : ('')}
//         </ul>
//     );
//   };
//
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;
//
//   return (
//     <div className="content" style={{ background: "white", margin: '20px' }}>
//       <p style={{ fontSize: '20px' }}>DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
//       <hr />
//       <TableContainer  component={Paper}>
//         <Table className='font-Inter'>
//           <TableHead>
//             <TableRow id='table-row-color'>
//               <TableCell className='text-white'>STT</TableCell>
//               <TableCell className='text-white'>Tên Chuẩn đánh giá</TableCell>
//               <TableCell className='text-white'>Năm áp dụng</TableCell>
//               <TableCell className='text-white'>Tên CTĐT</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {chuanKdcl.map((row, index) => (
//               <TableRow key={row.id}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>{row.tenKdcl}</TableCell>
//                 <TableCell>{row.namBanHanh}</TableCell>
//                 <TableCell><GenericList maKdcl={row.maKdcl}/></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };
//
// export default TrangChu;

import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {
    getKdclData,
    getCtdtDataByMaKDCL,
    getAllChuongTrinhDaoTao,
    findTieuChuaByMaCtdt, getAllTieuChuan, getAllMinhChung
} from '../../../../services/apiServices';
import {useNavigate, useLocation} from 'react-router-dom';
import BaoCaoTuDanhGia from "../BaoCaoTuDanhGia/BaoCaoTuDanhGia";
import VietBaoCaoTieuChi from "../VietBaoCaoTieuChi/VietBaoCaoTieuChi";
import VietBaoCao from "../VietBaoCao/VietBaoCao";
import TieuChi from "../TieuChi/TieuChi";

//danh sach chuong trinh dao tao
const CustomTableCell = styled(TableCell)(({theme}) => ({
    fontSize: '16px'
}));

const CustomTableHeadCell = styled(TableCell)(({theme}) => ({
    fontSize: '16px',
    color: 'white !important'
}));
;
const TrangChu = () => {
    const [chuanKdcl, setChuanKdcl] = useState([]);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState(null);
    const [selectChuanKdcl, setSelectChuanKdcl] = useState("");
    const [selectChucNang, setSelectChucNang] = useState(1);
    const [selectCtdt, setSelectCtdt] = useState("");
    const [tieuChuan, setTieuChuan] = useState([]);
    const [tieuChuanSelected, setTieuChuanSelected] = useState([]);
    const [noCase, setNoCase] = useState(1);
    const [dataTransfer, setDataTransfer] = useState({
        TieuChuan_ID: "",
        TieuChi_ID: "",
        NhomCongTac: "",
        KhungCTDT_ID: ""
    })
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //danh sach chuan kiem dinh chat luong
    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await getKdclData();
                setChuanKdcl(result);
                setSelectChuanKdcl(result[0]?.maKdcl);

                const chuongTrinhData = await getAllChuongTrinhDaoTao();
                const sortedChuongTrinh = chuongTrinhData.sort((a, b) => b.loai - a.loai);
                setChuongTrinhDaoTao(sortedChuongTrinh);

                const filterChuongTrinhDaoTao = sortedChuongTrinh.filter(item => item.chuanKdcl.maKdcl === result[0]?.maKdcl);
                setSelectCtdt(filterChuongTrinhDaoTao[0].maCtdt);

                const tieuChuanData = await getAllTieuChuan();
                setTieuChuan(tieuChuanData);
                const filterTieuChuanData = tieuChuanData.filter(item => item.maCtdt == filterChuongTrinhDaoTao[0].maCtdt);
                setTieuChuanSelected(filterTieuChuanData);

                const minhChung = getAllMinhChung();
                setMinhChung(minhChung);

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, []);
    const onChangeSelectChuanKdcl = (e) => {
        setSelectChuanKdcl(e.target.value);
        setSelectCtdt("");
    }
    const onChangeSelectChucNang = (e) => {
        setSelectChucNang(e.target.value);
        setNoCase(1);
    }
    const onChangeSelectCtdt = async (e) => {
        setSelectCtdt(e.target.value);
        const filterTieuChuan = tieuChuan.filter(item => item.maCtdt === e.target.value);
        if (filterTieuChuan.length > 0) {
            setTieuChuanSelected(filterTieuChuan);
        } else {
            setTieuChuanSelected([]);
        }
    }
    const totalMinhChung = (idTieuChuan) => {
        if (minhChung.length > 0) {
            const total = minhChung.filter(item => item.idTieuChuan === idTieuChuan);
            return total.length;
        } else {
            return 0;
        }
    };
    const QuanLyMinhChung = () => {
        const goToTieuChi = (idTieuChuan) => {
            setDataTransfer({
                ...dataTransfer,
                TieuChuan_ID: idTieuChuan,
                KhungCTDT_ID: selectCtdt
            })
            setNoCase(2);

        }
        return (
            <TableContainer>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow id='table-row-color'>
                            <CustomTableHeadCell>STT</CustomTableHeadCell>
                            <CustomTableHeadCell>Tiêu Chuẩn</CustomTableHeadCell>
                            <CustomTableHeadCell>Minh Chứng</CustomTableHeadCell>
                            <CustomTableHeadCell>Số lượng minh chứng đã thu
                                thập</CustomTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tieuChuanSelected ? (tieuChuanSelected.map((row, index) => (
                            <TableRow key={row.id}>
                                <CustomTableCell>{index + 1}</CustomTableCell>
                                <CustomTableCell>{row.tenTieuChuan}</CustomTableCell>
                                <CustomTableCell>
                                    <button className='btn btn-light text-white'
                                            onClick={() => goToTieuChi(row.idTieuChuan)}>
                                        Quản lý minh chứng
                                    </button>
                                </CustomTableCell>
                                <CustomTableCell>{totalMinhChung(row.idTieuChuan)} minh
                                    chứng</CustomTableCell>
                            </TableRow>
                        ))) : 'Loading...'}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="content" style={{background: "white", margin: '20px'}}>
            <p style={{fontSize: '20px'}} className="text-center"><b>HỆ THỐNG QUẢN LÝ BÁO CÁO ĐÁNH GIÁ CƠ SỞ GIÁO DỤC
                ĐẠI HỌC</b></p>
            <hr/>
            <div className="row">
                <div className="col-3 col-md-3">
                    <select name="chucNang" className="form-select" onChange={onChangeSelectChucNang}>
                        <option value="1">Quản lý tiêu chuẩn</option>
                        <option value="2">Báo cáo tự dánh giá</option>
                    </select>
                </div>
                <div className="col-3 col-md-3">
                    <select name="chuanKdcl" className="form-select" onChange={onChangeSelectChuanKdcl}
                            value={selectChuanKdcl}>
                        {chuanKdcl.map((item, index) => (
                            <option key={index} value={item.maKdcl}>
                                {item.tenKdcl}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-3 col-md-3">
                    <select name="ctdt" className="form-select" onChange={onChangeSelectCtdt} value={selectCtdt}>
                        <option value="">Chọn chương trình</option>
                        {chuongTrinhDaoTao
                            .filter(item => item.chuanKdcl.maKdcl === selectChuanKdcl)
                            .map((item, index) => (
                                <option key={index} value={item.maCtdt}>
                                    {item.tenCtdt}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            <hr/>
            {
                selectChucNang == 1 ? (
                    (() => {
                        const selectedItem = chuongTrinhDaoTao.find(item => item.maCtdt === selectCtdt);
                        return selectedItem ? (
                            <>
                                <p>Giới thiệu khung chương trình <b>{selectedItem.tenCtdt}</b></p>
                                <p>- Chuẩn đánh giá ĐBCL : <button
                                    className="btn btn-primary">{selectedItem.chuanKdcl.tenKdcl}</button></p>
                                {
                                    selectedItem.loai == 2 ? (
                                        <>
                                            {(() => {
                                                switch (noCase) {
                                                    case 1 :
                                                        return <QuanLyMinhChung/>
                                                    case 2 :
                                                        return selectCtdt !== "" ?
                                                            <TieuChi KhungCTDT_ID={selectCtdt}
                                                                     TieuChuan_ID={dataTransfer.TieuChuan_ID}/> : null;
                                                    default:
                                                        return <QuanLyMinhChung/>;
                                                }
                                            })()}
                                        </>
                                    ) : (
                                        <>
                                            <p>- Thuộc Khoa : <b>{selectedItem.khoa.tenKhoa}</b> | Web
                                                : <b>{selectedItem.khoa.web}</b> | Email
                                                : <b>{selectedItem.khoa.email}</b> | Số điện thoại
                                                : <b>{selectedItem.khoa.sdt}</b></p>
                                            <p>- Thuộc Ngành : <b>{selectedItem.nganh.tenNganh}</b></p>
                                            <p>- Thuộc Trình độ : <b>{selectedItem.trinhDo}</b></p>
                                            <p>- Số tín chỉ : <b>{selectedItem.soTinChi}</b></p>

                                            {(() => {
                                                switch (noCase) {
                                                    case 1 :
                                                        return <QuanLyMinhChung/>
                                                    case 2 :
                                                        return <TieuChi/>
                                                    default:
                                                        return <QuanLyMinhChung/>;
                                                }
                                            })()}
                                        </>
                                    )
                                }
                            </>
                        ) : null;
                    })()
                ) : (
                    <>
                        {(() => {
                            switch (noCase) {
                                case 1:
                                    return selectCtdt !== "" ?
                                        <BaoCaoTuDanhGia KhungCTDT_ID={selectCtdt} setNoCase={setNoCase}/> : null;
                                case 2:
                                    return selectCtdt !== "" ?
                                        <VietBaoCao KhungCTDT_ID={selectCtdt} setNoCase={setNoCase}
                                                    setDataTransfer={setDataTransfer}/> : null;
                                case 3:
                                    return <VietBaoCaoTieuChi dataTransfer={dataTransfer}/>;
                                default:
                                    return selectCtdt !== "" ?
                                        <BaoCaoTuDanhGia KhungCTDT_ID={selectCtdt} setNoCase={setNoCase}/> : null;
                            }
                        })()}
                    </>

                )
            }

        </div>
    );
};

export default TrangChu;