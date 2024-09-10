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
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [khoa, setKhoa] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [selectedKhoa, setSelectedKhoa] = useState('');
    const [selectedNganh, setSelectedNganh] = useState('');
    const [tenCTDT, setTenCTDT] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getThongTinCTDT(ChuongTrinh_ID);
                setTenCTDT(result[0].tenCtdt);
                setChuongTrinhDaoTao(result);
                
                if(result[0].tenKhoa != "" || result[0].tenNganh != ""){
                    const khoaData = await getKhoa();
                    const nganhData = await getNganh();
                    setNganh(nganhData);
                    setKhoa(khoaData);
                    const maKhoa = khoaData.find(item => item.tenKhoa === result[0].tenKhoa).maKhoa;
                    setSelectedKhoa(maKhoa);
                    const maNganh = nganhData.find(item => item.tenNganh === result[0].tenNganh && item.tenNganh).maNganh;
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
                formData.append('idCtdt', chuongTrinhDaoTao[0].idCtdt);

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
                const idCtdt = parseInt(chuongTrinhDaoTao[0].idCtdt);
                const response = await deleteChuongTrinhDaoTao(idCtdt);
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
        <div className="content" style={{ background: "white", margin: "20px" }}>
            
            {chuongTrinhDaoTao && chuongTrinhDaoTao.length > 0 ? (
                <>
                    <h5><b>Giới thiệu Khung chương trình {chuongTrinhDaoTao[0].tenCtdt}</b></h5>
                    <p>- Tên chương trình : </p>
                    <Input className="form-control" value={tenCTDT} onChange={(e) => handleChangeTenCtdt(e.target.value)}/>
                    <br/><br/>
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
                                nganh.filter(item=>item.maKhoa === selectedKhoa).map((item) => (
                                    <option key={item.maNganh} value={item.maNganh}>
                                        {item.tenNganh} - {item.trinhDo}
                                    </option>
                                ))
                            ) : (
                                <option>Không có Ngành</option>
                            )}
                        </select>
                    </p>
                    <button className="btn btn-success" onClick={() => updateCtdt()}>Cập Nhật</button>
                    <ConfirmDialog />
                    <button className="btn btn-danger ms-1" onClick={() => deleteCtdt()}>Xóa</button>
                </>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );
}
export default ChiTietChuongTrinhDaoTao;