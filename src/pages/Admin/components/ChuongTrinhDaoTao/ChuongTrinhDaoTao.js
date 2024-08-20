import React, { useEffect, useState } from "react";
import "./ChuongTrinhDaoTao.css";
import {
    getCtdtDataByMaKDCL,
    getKdclData, getMinhChungByMaCtdt,
    getTieuChiByMaCtdt,
    getTieuChuanWithMaCtdt
} from "../../../../services/apiServices";

const Total = ({maCtdt}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalTieuChuan, setTotalTieuChuan] = useState('');
    const [totalTieuChi, setTotalTieuChi] = useState('');
    const [totalMinhChung, setTotalMinhChung] = useState('');

    const fetchData = async () => {

        try {
            const tieuChuan = await getTieuChuanWithMaCtdt(maCtdt);
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
    useEffect(() => {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchData = async () => {
        try {
            const result = await getCtdtDataByMaKDCL(maKdcl);
            setChuongTrinhDaoTao(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [maKdcl]);

    return (
        <div style={{marginLeft : '10px'}}>
            {chuongTrinhDaoTao.map((item, index) => (
                <div>
                    <p><b>{index+1}. {item.tenCtdt}</b></p>
                    <Total maCtdt={item.maCtdt} />
                </div>
            ))}
        </div>
    );
};

const AdminChuongTrinhDaoTao = () => {
    const [chuanKDCL, setChuanKDCL] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);


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

    useEffect(() => {
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
