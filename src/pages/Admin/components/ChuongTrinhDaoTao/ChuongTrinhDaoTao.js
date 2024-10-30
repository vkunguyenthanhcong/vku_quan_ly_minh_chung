import React, { useEffect, useState } from "react";
import {
    findTieuChuaByMaCtdt, getAllChuongTrinhDaoTao,
    getCtdtDataByMaKDCL,
    getKdclData, getMinhChungByMaCtdt,
    getTieuChiByMaCtdt
} from "../../../../services/apiServices";
import { useNavigate } from "react-router-dom";


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
                const tieuChi = await getTieuChiByMaCtdt(maCtdt);
                setTotalTieuChi(tieuChi.length);
                const minhChung = await getMinhChungByMaCtdt(maCtdt);
                setTotalMinhChung(minhChung.length);
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

const ListChuongTrinhDaoTao = ({maKdcl}) => {
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const  goToChuongTrinhDaoTao = (ChuongTrinh_ID) => {
        navigate(`../chi-tiet-chuong-trinh-dao-tao?ChuongTrinh_ID=${ChuongTrinh_ID}`);
    }
    const  goToDinhNghiaTieuChuan = (ChuongTrinh_ID) => {
        navigate(`../dinh-nghia-tieu-chuan?ChuongTrinh_ID=${ChuongTrinh_ID}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllChuongTrinhDaoTao(maKdcl);
                const filterData = result.filter((item) => item.chuanKdcl && item.chuanKdcl.maKdcl === maKdcl);
                setChuongTrinhDaoTao(filterData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [maKdcl]);

    return (
        <div style={{marginLeft : '10px'}}>
            {chuongTrinhDaoTao.map((item, index) => (
                <div style={{marginBottom : '10px'}}>
                    <p><b>{index+1}. {item.tenCtdt}</b></p>
                    <Total maCtdt={item.maCtdt} />
                    <button className="btn btn-primary" onClick={() => goToChuongTrinhDaoTao(item.maCtdt)}>Chi tiết</button>
                    <button className="btn btn-success ms-2" onClick={() => goToDinhNghiaTieuChuan(item.maCtdt)}>Định nghĩa tiêu chuẩn</button>
                </div>
            ))}
        </div>
    );
};

const AdminChuongTrinhDaoTao = () => {
    const [chuanKDCL, setChuanKDCL] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    useEffect(() => {
        const getChuanKDCL = async () => {
            try {
                const result = await getKdclData();
                setChuanKDCL(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getChuanKDCL();
    }, []);

    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
            {
                chuanKDCL.length > 0 ?
                    chuanKDCL.map((item, index) => (
                        <div>
                            <p>{index + 1}. {item.tenKdcl}</p>
                            <ListChuongTrinhDaoTao maKdcl={item.maKdcl}/>
                            
                        </div>
                    )) :
                    (
                        <div></div>
                    )
            }
        </div>
    );
};

export default AdminChuongTrinhDaoTao;
