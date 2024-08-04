import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import './NewMinhChung.css';
import { useNavigate } from "react-router-dom";
import {getAllDonViBanHanh, getAllLoaiMinhChung, saveMinhChung, uploadMinhChung} from "../../services/apiServices";

function LoadingProcess(props) {
    const { open } = props;
    return (
        <Dialog open={open}>
            <DialogTitle>Hệ thống đang tiến hành thêm dữ liệu</DialogTitle>
            <Box className='d-flex justify-content-center' sx={{ display: 'flex' }} md={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </Dialog>
    );
}


const NewMinhChung = () =>{
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [loaiMinhChung, setLoaiMinhChung] = useState([]);
    const [donViBanHanh, setDonViBanHanh] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLoai, setSelectedLoai] = useState('');
    const [selectedDonVi, setSelectedDonVi] = useState('');
    const [soCongVan, setSoCongVan] = useState('');
    const [trichYeu, setTrichYeu] = useState('');
    const [tomTat, setTomTat] = useState('');
    const [ngayPhatHanh, setNgayPhatHanh] = useState('');
    const [file, setFile] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const loaiMinhChungResponse = await getAllLoaiMinhChung();
                const donViBanHanhResponse = await getAllDonViBanHanh();
                setDonViBanHanh(donViBanHanhResponse);
                setLoaiMinhChung(loaiMinhChungResponse);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpload = async () => {
        if (!selectedLoai || !selectedDonVi || !soCongVan || !trichYeu || !tomTat || !ngayPhatHanh || !file) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }else{
            const formData = new FormData();
            formData.append("file", file);
            if(file.size > 3000000) {
                alert('Hệ thống chỉ chấp nhận file có dung lượng không quá 20 MB.');
                return;
            }else{
                try {
                    setOpen(true);

                    const response = await uploadMinhChung(formData);

                    const minhChung = new FormData();

                    minhChung.append('idLoai', selectedLoai);
                    minhChung.append('idDvbh', selectedDonVi);
                    minhChung.append('soHieu', soCongVan);
                    minhChung.append('tenMinhChung', trichYeu);
                    minhChung.append('moTa', tomTat);
                    minhChung.append('thoigian', ngayPhatHanh);
                    minhChung.append('linkLuuTru', response.url);

                    const response_1 = await saveMinhChung(minhChung);
                    setOpen(false);
                    navigate('/quan-ly/minh-chung');
                } catch (error) {

                }
            }
        }
    };
    return (
        <div className="content" style={{margin: '20px', padding: '20px'}}>

            <label htmlFor="loaiCongVan"><b>Loại công văn</b></label>
            <select id="loaiCongVan" className='form-select' value={selectedLoai}
                    onChange={(e) => setSelectedLoai(e.target.value)} required>
                <option value="">--Select--</option>
                {loaiMinhChung.map(option => (
                    <option key={option.id} value={option.idLoai}>
                        {option.tenLoai}
                    </option>
                ))}
            </select>
            <br/>
            <label htmlFor="donViBanHanh"><b>Đơn vị ban hành</b></label>
            <select id="donViBanHanh" className='form-select' value={selectedDonVi}
                    onChange={(e) => setSelectedDonVi(e.target.value)} required>
                <option value="">--Select--</option>
                {donViBanHanh.map(option => (
                    <option key={option.id} value={option.idDvbh}>
                        {option.tenDvbh}
                    </option>
                ))}
            </select>
            <br/>
            <label htmlFor="soCongVan"><b>Số công văn (ví dụ: Số 112/QĐ - ĐHĐN)</b></label>
            <input id="soCongVan" className='form-control' type="text" value={soCongVan}
                   onChange={(e) => setSoCongVan(e.target.value)} required/>
            <br/>
            <label htmlFor="trichYeu"><b>Trích yếu (ví dụ: V/v quyết định ...)</b></label>
            <input id="trichYeu" className='form-control' type="text" value={trichYeu}
                   onChange={(e) => setTrichYeu(e.target.value)} required/>
            <br/>
            <label htmlFor="tomTat"><b>Tóm tắt mô tả nội dung chính của văn bản</b></label>
            <textarea id="tomTat" className='form-control' name="Text1" cols="40" rows="5" value={tomTat}
                      onChange={(e) => setTomTat(e.target.value)} required></textarea>
            <br/>
            <label htmlFor="ngayPhatHanh"><b>Ngày phát hành</b></label>
            <input id="ngayPhatHanh" className='form-control' type="date" value={ngayPhatHanh}
                   onChange={(e) => setNgayPhatHanh(e.target.value)} required/>
            <br/>
            <label htmlFor="fileUpload"><b>File</b></label>
            <input required id="fileUpload" className='form-control' type="file" onChange={(e) => setFile(e.target.files[0])}/>
            <br/>
            <button onClick={handleUpload} className='btn btn-success'>Thêm</button>

            <LoadingProcess
                open={open}
            />

        </div>
    );
}
export default NewMinhChung;
