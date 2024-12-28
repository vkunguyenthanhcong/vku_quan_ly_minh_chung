import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuanLyMinhChung.css';
import { useLocation } from 'react-router-dom';
import {
    getAllDonViBanHanh,
    getAllLoaiMinhChung,
    getKhoMinhChungWithId,
    saveMinhChung, updateKhoMinhChung,
    uploadMinhChung
} from "../../../../services/apiServices";
import PdfPreview from "../../../../services/PdfPreview";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";



const QuanLyMinhChung = ({dataTransfer, setNoCase}) =>{
    const token = localStorage.getItem('token');
    const location = useLocation();
    const EvidenceID = dataTransfer.idMc;

    const GoiY_ID = dataTransfer.GoiY_ID;
    const TieuChi_ID = dataTransfer.TieuChi_ID;
    const TieuChuan_ID = dataTransfer.TieuChuan_ID;
    const KhungCTDT_ID = dataTransfer.KhungCTDT_ID;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [open, setOpen] = React.useState(false);
    const [loaiMinhChung, setLoaiMinhChung] = useState([]);
    const [donViBanHanh, setDonViBanHanh] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLoai, setSelectedLoai] = useState(0);
    const [selectedDonVi, setSelectedDonVi] = useState(0);
    const [soCongVan, setSoCongVan] = useState('');
    const [trichYeu, setTrichYeu] = useState('');

    const [ngayPhatHanh, setNgayPhatHanh] = useState('');
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);



    const handleClickViewPDF = () => {
        openModal();
    };
    const fetchData = async () => {
        setLoading(true); // Set loading state at the beginning
        try {
            const loaiMcData = await getAllLoaiMinhChung();
            const dvbhData = await getAllDonViBanHanh();
            setLoaiMinhChung(loaiMcData);
            setDonViBanHanh(dvbhData);

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
                setNoCase(3);
            }else{
                setSelectedLoai(response.idLoai);
                setSelectedDonVi(response.idDvbh);
                console.log(response.idDvbh)
                setSoCongVan(response.soHieu);
                setTrichYeu(response.tenMinhChung);
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
        if (!selectedLoai || !selectedDonVi || !soCongVan || !trichYeu  || !ngayPhatHanh) {
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
                minhChung.append('thoiGian', ngayPhatHanh);
                minhChung.append('linkLuuTru', uploadedFile);

                const response_1 = await updateKhoMinhChung(EvidenceID, minhChung);
                if(response_1 === "OK"){
                    setOpen(false);
                    setNoCase(3);
                }
            }else{
                const formData = new FormData();
                formData.append("file", file);

                if(file.size > 20000000) {
                    alert('Hệ thống chỉ chấp nhận file có dung lượng không quá 20 MB.');
                    return;
                }else{
                    try {
                        setOpen(true);

                        const response = await uploadMinhChung(formData, token);

                        const minhChung = new FormData();

                        minhChung.append('idLoai', selectedLoai);
                        minhChung.append('idDvbh', selectedDonVi);
                        minhChung.append('soHieu', soCongVan);
                        minhChung.append('tenMinhChung', trichYeu);

                        minhChung.append('thoigian', ngayPhatHanh);

                        minhChung.append('linkLuuTru', response.url);

                        const response_1 = await updateKhoMinhChung(EvidenceID,minhChung, token);

                        // navigate(`../minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}&TieuChuan=${TieuChuan_ID}&KhungCTDT_ID=${KhungCTDT_ID}`);
                        if(response_1 === "OK"){
                            setOpen(false);
                            setNoCase(3);
                        }
                    } catch (error) {

                    }
                }
            }
        }
    };
    const handleUpload = async () => {
        if (!selectedLoai || !selectedDonVi || !soCongVan || !trichYeu || !ngayPhatHanh || !file)  {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }else{
            const formData = new FormData();
            formData.append("file", file);
            if(file.size > 20000000) {
                alert('Hệ thống chỉ chấp nhận file có dung lượng không quá 20 MB.');
                return;
            }else{
                try {
                    setOpen(true);

                    const response = await uploadMinhChung(formData, token);

                    const minhChung = new FormData();

                    minhChung.append('idLoai', selectedLoai);
                    minhChung.append('idDvbh', selectedDonVi);
                    minhChung.append('soHieu', soCongVan);
                    minhChung.append('tenMinhChung', trichYeu);
                    minhChung.append('thoiGian', ngayPhatHanh);
                    minhChung.append('linkLuuTru', response.url);

                    const response_1 = await saveMinhChung(minhChung, token);

                    // navigate(`../minh-chung?GoiY_ID=${GoiY_ID}&TieuChi_ID=${TieuChi_ID}&TieuChuan=${TieuChuan_ID}&KhungCTDT_ID=${KhungCTDT_ID}`);
                    if(response_1 === "OK"){
                        setOpen(false);
                        setNoCase(3);
                    }
                } catch (error) {

                }
            }
        }
    };
    return (
        <div className="content" style={{margin: '20px', padding: '20px'}}>
            {(EvidenceID == null || EvidenceID == "") ? <p><b>THÊM MINH CHỨNG</b></p> : <p><b>CHỈNH SỬA MINH CHỨNG</b></p>}
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
