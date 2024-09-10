import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getKhoa, getNganh, getThongTinCTDT } from "../../../../services/apiServices";
const ChiTietChuongTrinhDaoTao = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ChuongTrinh_ID = queryParams.get('ChuongTrinh_ID');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [khoa, setKhoa] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [selectedKhoa, setSelectedKhoa] = useState('');
    const [selectedNganh, setSelectedNganh] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getThongTinCTDT(ChuongTrinh_ID);
                const khoaData = await getKhoa();
                const nganhData = await getNganh();
                setChuongTrinhDaoTao(result);
                setNganh(nganhData);
                setKhoa(khoaData);
                const maKhoa = khoaData.find(item => item.tenKhoa === result[0].tenKhoa).maKhoa;
                setSelectedKhoa(maKhoa);
                const maNganh = nganhData.find(item => item.tenNganh === result[0].tenNganh && item.tenNganh).maNganh;
                setSelectedNganh(maNganh);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }

        };

        fetchData();

    }, [ChuongTrinh_ID]);

    const handleSelectKhoa = (selectedMaKhoa) => {
        setSelectedKhoa(selectedMaKhoa);
    };
    const handleSelectNganh = (selectedMaNganh) => {
        setSelectedNganh(selectedMaNganh);
    };
    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
            {chuongTrinhDaoTao && chuongTrinhDaoTao.length > 0 ? (
                <>
                    <h5><b>Giới thiệu Khung chương trình {chuongTrinhDaoTao[0].tenCtdt}</b></h5>
                    <p>- Chuẩn ánh giá ĐBCL : <button className="btn btn-secondary">{chuongTrinhDaoTao[0].tenKdcl}</button></p>
                    <p>- Thuộc Khoa :
                        <select
                            className="form-select"
                            value={selectedKhoa}
                            onChange={(e) => handleSelectKhoa(e.target.value)}
                        >
                            {khoa.length > 0 ? (
                                khoa.map((item) => (
                                    <option key={item.maKhoa} value={item.maKhoa}>
                                        {item.tenKhoa}
                                    </option>
                                ))
                            ) : (
                                <option>Không có Khoa</option>
                            )}
                        </select>
                    </p>
                    <p>- Thuộc Ngành :
                        <select
                            className="form-select"
                            value={selectedNganh}
                            onChange={(e) => handleSelectNganh(e.target.value)}
                        >
                            {nganh.length > 0 ? (
                                nganh.map((item) => (
                                    <option key={item.maNganh} value={item.maNganh}>
                                        {item.tenNganh}
                                    </option>
                                ))
                            ) : (
                                <option>Không có Ngành</option>
                            )}
                        </select>
                    </p>
                </>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );
}
export default ChiTietChuongTrinhDaoTao;