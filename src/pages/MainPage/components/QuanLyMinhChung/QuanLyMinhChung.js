import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import './QuanLyMinhChung.css';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {
    getAllDonViBanHanh,
    getAllLoaiMinhChung,
    getKhoMinhChungWithId,
    saveMinhChung, updateKhoMinhChung,
    uploadMinhChung
} from "../../../../services/apiServices";
import PdfPreview from "../../../../services/PdfPreview";

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


const QuanLyMinhChung = () =>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const EvidenceID = queryParams.get('EvidenceID');

    const GoiY_ID = queryParams.get('GoiY_ID');
    const TieuChi_ID = queryParams.get('TieuChi_ID');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [loaiMinhChung, setLoaiMinhChung] = useState([]);
    const [donViBanHanh, setDonViBanHanh] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [caNhan, setCaNhan] = useState('');
    const [selectedLoai, setSelectedLoai] = useState('');
    const [selectedDonVi, setSelectedDonVi] = useState('');
    const [soCongVan, setSoCongVan] = useState('');
    const [trichYeu, setTrichYeu] = useState('');
    const [tomTat, setTomTat] = useState('');
    const [ngayPhatHanh, setNgayPhatHanh] = useState('');
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);



    const handleClickViewPDF = () => {
        openModal();
    };
    const fetchData = async () => {
        setLoading(true); // Set loading state at the beginning
        try {
            const [loaiMinhChungResponse, donViBanHanhResponse] = await Promise.all([
                getAllLoaiMinhChung(),
                getAllDonViBanHanh(),
            ]);

            setLoaiMinhChung(loaiMinhChungResponse);
            setDonViBanHanh(donViBanHanhResponse);

        } catch (error) {
            setError(error.message || 'An error occurred while fetching data.');
        } finally {
            setLoading(false); // Ensure loading state is turned off after the operation
        }
    };

    const fetchDataFromIdGoiY = async () => {
        if(EvidenceID == null) {
            return;
        }else{
            const response = await getKhoMinhChungWithId(EvidenceID);
            if(response == ''){
                navigate(`quan-ly/minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}`);
            }else{
                setSelectedLoai(response.idLoai);
                setSelectedDonVi(response.idDvbh);
                setSoCongVan(response.soHieu);
                setTrichYeu(response.tenMinhChung);
                setTomTat(response.moTa);
                setCaNhan(response.caNhan);
                setNgayPhatHanh(response.thoigian);
                setUploadedFile(response.linkLuuTru);
            }
        }
    }
    useEffect(() => {
        fetchData();
        fetchDataFromIdGoiY();
    }, []);
    const handleEditEvidence = async () => {
        if (!selectedLoai || !selectedDonVi || !soCongVan || !trichYeu || !tomTat || !ngayPhatHanh || !caNhan) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }else{
            if(file == null){
                setOpen(true);
                const minhChung = new FormData();

                minhChung.append('idLoai', selectedLoai);
                minhChung.append('idDvbh', selectedDonVi);
                minhChung.append('soHieu', soCongVan);
                minhChung.append('tenMinhChung', trichYeu);
                minhChung.append('moTa', tomTat);
                minhChung.append('caNhan', caNhan);
                minhChung.append('thoigian', ngayPhatHanh);
                minhChung.append('linkLuuTru', uploadedFile);

                const response_1 = await updateKhoMinhChung(EvidenceID, minhChung);
                setOpen(false);
                navigate(`/quan-ly/minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}`);
            }else{
                const formData = new FormData();
                formData.append("file", file);
                if(file.size > 2000000) {
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
                        minhChung.append('caNhan', caNhan);
                        minhChung.append('linkLuuTru', response.url);

                        const response_1 = await updateKhoMinhChung(EvidenceID,minhChung);
                        setOpen(false);
                        navigate(`/quan-ly/minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}`);
                    } catch (error) {

                    }
                }
            }
        }
    };
    const handleUpload = async () => {
        if (!selectedLoai || !selectedDonVi || !soCongVan || !trichYeu || !tomTat || !ngayPhatHanh || !file || !caNhan)  {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }else{
            const formData = new FormData();
            formData.append("file", file);
            if(file.size > 2000000) {
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
                    minhChung.append('caNhan', caNhan)
                    minhChung.append('thoigian', ngayPhatHanh);
                    minhChung.append('linkLuuTru', response.url);

                    const response_1 = await saveMinhChung(minhChung);
                    setOpen(false);
                    navigate(`/quan-ly/minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}`);
                } catch (error) {

                }
            }
        }
    };
    return (
        <div className="content" style={{margin: '20px', padding: '20px'}}>
            {EvidenceID == null ? <p><b>THÊM MINH CHỨNG</b></p> : <p><b>CHỈNH SỬA MINH CHỨNG</b></p>}
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
            <label htmlFor="soCongVan"><b>Cá nhân thực hành</b></label>
            <input id="soCongVan" className='form-control' type="text" value={caNhan}
                   onChange={(e) => setCaNhan(e.target.value)} required/>
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
            <input required id="fileUpload" className='form-control' type="file"
                   onChange={(e) => setFile(e.target.files[0])}/>
            <br/>
            {EvidenceID ?
                <button className='btn btn-success' onClick={handleClickViewPDF}>Xem nhanh</button> : null}<br/>
            <br/>
            {EvidenceID == null ? <button onClick={handleUpload} className='btn btn-success'>Thêm</button> :
                <button onClick={handleEditEvidence} className='btn btn-success'>Chỉnh Sửa</button>}

            <LoadingProcess
                open={open}
            />
            <PdfPreview show={isModalOpen} handleClose={closeModal} link={uploadedFile}/>
        </div>
    );
}
export default QuanLyMinhChung;
