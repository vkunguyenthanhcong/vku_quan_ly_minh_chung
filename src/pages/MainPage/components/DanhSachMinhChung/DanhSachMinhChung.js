import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PdfPreview from '../../../../services/PdfPreview';
import { getMinhChungKhongDungChung } from '../../../../services/apiServices';

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

    const indexTemplate = (rowData, { rowIndex }) => {
        return rowIndex + 1;
      };

    const nameAndEmailTemplate = (rowData) => {
        return (
          <div>
            <p>{rowData.parentMaMc}{rowData.childMaMc}</p>
          </div>
        );
      };
      const buttonXemNhanh = (rowData) => {
        return (
          <div>
            <button className='btn btn-secondary'>Xem Nhanh</button>
          </div>
        );
      };

    return (
        <div
            className="content"
            style={{ background: "white", margin: "20px", padding: "20px" }}
        >
            <DataTable value={minhChung} paginator rows={30} globalFilter={globalFilter} emptyMessage="Không có dữ liệu">
                <Column header="STT" body={indexTemplate} />
                <Column header="Mã Minh Chứng" body={nameAndEmailTemplate} />
                <Column field="tenMinhChung" header="Tên Minh Chứng" sortable />
                <Column header="Xem Nhanh" body={buttonXemNhanh} />
            </DataTable>
        </div>
    );
}
export default DanhSachMinhChung;