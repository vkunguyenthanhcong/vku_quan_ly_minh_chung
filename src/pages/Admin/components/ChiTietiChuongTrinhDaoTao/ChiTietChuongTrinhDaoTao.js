import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { deleteChuongTrinhDaoTao, getKhoa, getNganh, getThongTinCTDT, updateChuongTrinhDaoTao } from "../../../../services/apiServices";
import { Input } from "@mui/material";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog'; 
import 'primereact/resources/primereact.min.css';
const ChiTietChuongTrinhDaoTao = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ChuongTrinh_ID = queryParams.get('ChuongTrinh_ID');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState(null);
    const [khoa, setKhoa] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [selectedKhoa, setSelectedKhoa] = useState('');
    const [selectedNganh, setSelectedNganh] = useState('');
    const [tenCTDT, setTenCTDT] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getThongTinCTDT(ChuongTrinh_ID);
                setChuongTrinhDaoTao(result);
                setTenCTDT(result.tenCtdt);
                if(result.khoa.tenKhoa != "" || result.nganh.tenNganh != ""){
                    const khoaData = await getKhoa();
                    const nganhData = await getNganh();
                    setNganh(nganhData);
                    setKhoa(khoaData);
                    const maKhoa = khoaData.find(item => item.tenKhoa === result.khoa.tenKhoa).maKhoa;
                    setSelectedKhoa(maKhoa);
                    const maNganh = nganhData.find(item => item.tenNganh === result.nganh.tenNganh && item.tenNganh).maNganh;
                    setSelectedNganh(maNganh);
                }
                
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
    const handleChangeTenCtdt = (tenCtdtChanged) => {
        setTenCTDT(tenCtdtChanged);
    };
    const updateCtdt = async () => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn cập nhật?',
            header: 'Xác nhận',
            accept: async () => {
                        const formData = new FormData();
                        formData.append('maNganh', selectedNganh);
                        formData.append('maKhoa', selectedKhoa);
                        formData.append('tenCtdt', tenCTDT);
                        formData.append('maCtdt', chuongTrinhDaoTao.maCtdt);

                    const response = await updateChuongTrinhDaoTao(formData);
                if(response === "OK"){
                    alert('Cập nhật thành công');
                }else{
                    alert('Có lỗi trong quá trình xử lý');
                }
            },
            reject: () => {
                console.log('Đã hủy');
            }
          });
    }
    const deleteCtdt = () => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa?',
            header: 'Xác nhận',
            accept: async () => {
                const maCtdt = chuongTrinhDaoTao.maCtdt;
                const response = await deleteChuongTrinhDaoTao(maCtdt);
                if(response === "OK"){
                    alert('Xóa thành công');
                }else{
                    alert('Có lỗi trong quá trình xử lý');
                }
            },
            reject: () => {
              console.log('Đã hủy');
            }
          });
        
    }
    return (
        <div className="content p-5 m-3">
            {chuongTrinhDaoTao ? (
                <>
                    <h5 className="fw-bold text-primary">
                        Giới thiệu Khung chương trình: {chuongTrinhDaoTao.tenCtdt}
                    </h5>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Tên chương trình:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={tenCTDT}
                            onChange={(e) => handleChangeTenCtdt(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <p className="mb-2 fw-bold">Chuẩn ánh giá ĐBCL:</p>
                        <button className="btn btn-secondary btn-sm">
                            {chuongTrinhDaoTao.chuanKdcl.tenKdcl}
                        </button>
                    </div>

                    {chuongTrinhDaoTao?.loai === 1 && (
                        <>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Thuộc Khoa:</label>
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
                                        <option disabled>Không có Khoa</option>
                                    )}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Thuộc Ngành:</label>
                                <select
                                    className="form-select"
                                    value={selectedNganh}
                                    onChange={(e) => handleSelectNganh(e.target.value)}
                                >
                                    {nganh.length > 0 ? (
                                        nganh
                                            .filter((item) => item.maKhoa === selectedKhoa)
                                            .map((item) => (
                                                <option key={item.maNganh} value={item.maNganh}>
                                                    {item.tenNganh} - {item.trinhDo}
                                                </option>
                                            ))
                                    ) : (
                                        <option disabled>Không có Ngành</option>
                                    )}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="d-flex justify-content-start mt-4">
                        <button className="btn btn-success me-2" onClick={() => updateCtdt()}>
                            <i className="fas fa-save me-2"></i>Cập Nhật
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteCtdt()}>
                            <i className="fas fa-trash-alt me-2"></i>Xóa
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Đang tải dữ liệu...</p>
                </div>
            )}

            <ConfirmDialog/>
        </div>

    );
}
export default ChiTietChuongTrinhDaoTao;