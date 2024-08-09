// src/Homepage.js
import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import './ListEvidence.css';
import {
    getAllTieuChiWithIdTieuChuan,
    getMinhChungWithIdTieuChi,
    getTieuChuanWithMaCtdt
} from "../../services/apiServices";
import {TableCell, TableRow} from "@mui/material";

const MinhChung = ({ criteriaID }) => {
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMinhChung = async () => {
            try {
                const result = await getMinhChungWithIdTieuChi(criteriaID);
                setMinhChung(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMinhChung();
    }, [criteriaID]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {minhChung.map((row, index) => (
                <tr>
                    <td></td>
                    <td>{index + 1}</td>
                    <td>{row.parentMaMc}{row.childMaMc}</td>
                    <td>{row.tenMinhChung}</td>
                    <td>{row.soHieu}<br/>{row.thoiGian}</td>
                    <td>{row.donViBanHanh}<br/>{row.caNhan}</td>
                    <td></td>
                </tr>
            ))}
        </>
    );
};
const TieuChi = ({standardID, numberNO}) => {
    const [tieuChi, setTieuChi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(standardID);
                setTieuChi(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTieuChi();
    }, [standardID]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {tieuChi.map((row, index) => (
                <React.Fragment key={row.idTieuChi}> {/* Ensure unique keys for each row */}
                    <tr>
                        <td className='bold-italic'>Tiêu chí {numberNO}.{index + 1}</td>
                        <td className='bold' colSpan={6}>{row.tenTieuChi}</td>
                    </tr>
                    <MinhChung criteriaID={row.idTieuChi} />
                </React.Fragment>
            ))}
        </>
    );
};

const ListEvidence = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungDaoTao_ID = queryParams.get('KhungDaoTao_ID');

    const [tieuChuan, setTieuChuan] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTieuChuan = async () => {
        try {
            const result = await getTieuChuanWithMaCtdt(KhungDaoTao_ID);
            setTieuChuan(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTieuChuan();
    }, []);
    const navigate = useNavigate();
    return (
        <Container fluid style={{ height: '100vh' }}>
            <h1 className='font'><b>DANH MỤC MINH CHỨNG</b></h1>
            <table class='simple-table'>
                <thead>
                    <tr>
                        <th>Tiêu chí</th>
                        <th>STT</th>
                        <th>Mã minh chứng</th>
                        <th>Tên minh chứng</th>
                        <th>Số, ngày ban hành, ...</th>
                        <th>Nơi ban hành hoặc nhóm, cá nhân thực hành</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                {tieuChuan.map((row, index)=> (
                    <tbody>
                    <tr>
                        <td className='bold'>Tiêu chuẩn {index + 1}</td>
                        <td className='bold' colSpan={6}>{row.tenTieuChuan}</td>
                    </tr>
                    <TieuChi standardID={row.idTieuChuan} numberNO={index + 1}/>

                    </tbody>
                ))}
            </table>
        </Container>
    );
};

export default ListEvidence;
