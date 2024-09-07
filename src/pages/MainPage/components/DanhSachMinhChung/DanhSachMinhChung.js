import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import PdfPreview from '../../../../services/PdfPreview';
import { getMinhChungKhongDungChung } from '../../../../services/apiServices';
import "./DanhSachMinhChung.css";

const DanhSachMinhChung = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minhChung, setMinhChung] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [link, setLink] = useState("");
    const [globalFilter, setGlobalFilter] = useState('');
    const handleClickViewPDF = (link) => {
        setLink(link);
        openModal();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getMinhChungKhongDungChung();
                setMinhChung(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const updateMinhChung = minhChung.map(item => ({
        ...item, // Giữ nguyên các giá trị cũ
        maMinhChung: `${item.parentMaMc}${item.childMaMc}` // Kết hợp parentMaMc và childMaMc
    }));
    const onGlobalFilterChange = (e) => {
        setGlobalFilter(e.target.value);
    };
    const indexTemplate = (rowData, { rowIndex }) => {
        return rowIndex + 1;
    };

    const buttonXemNhanh = (rowData) => {
        return (
            <div>
                <button className='btn btn-secondary' onClick={() => handleClickViewPDF(rowData.linkLuuTru)}>Xem Nhanh</button>
            </div>
        );
    };



    return (
        <div
            className="content"
            style={{ background: "white", margin: "20px", padding: "20px" }}
        >
            <InputText
            className='form-control'
                type="search"
                onInput={onGlobalFilterChange}
                placeholder="Tìm kiếm..."
            />
            <br/>
            <DataTable value={updateMinhChung} paginator rows={30} globalFilter={globalFilter} globalFilterFields={['maMinhChung', 'tenMinhChung']} emptyMessage="Không có dữ liệu">
                <Column header="STT" body={indexTemplate} />
                <Column header="Mã Minh Chứng" field='maMinhChung' />
                <Column field="tenMinhChung" header="Tên Minh Chứng" />
                <Column header="Xem Nhanh" body={buttonXemNhanh} />
            </DataTable>
            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link} />
        </div>
    );
}
export default DanhSachMinhChung;