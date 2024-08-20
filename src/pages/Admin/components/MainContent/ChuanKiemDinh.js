import React, { useEffect, useState } from "react";
import "./ChuanKiemDinh.css";
import { styled } from "@mui/material/styles";
import font from "../../../../components/font";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    getKdclData,
    getCtdtDataByMaKDCL,
    updateTenKdcl,
    updateNamBanHanh, deleteChuanKDCL,
} from "../../../../services/apiServices";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: "16px",
    fontFamily: font.inter,
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: "16px",
    color: "white !important",
    fontFamily: font.inter,
}));
const GenericList = ({ maKdcl }) => {

    const [edit, setEdit] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleButtonClick = (maCtdt) => {
        navigate(`chuong-trinh-dao-tao?KhungCTDT_ID=${maCtdt}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCtdtDataByMaKDCL(maKdcl);
                const initializedData = result.map((item) => ({
                    ...item,
                    isEditing: false,
                }));
                setData(initializedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [maKdcl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <ul>
            {data.map((item, index) => (
                <li style={{marginBottom: "20px", marginTop: "20px"}} key={index}>
                    <button
                        onClick={() => handleButtonClick(item.maCtdt)}
                        className="btn btnViewCTDT"
                    >
                        {item.tenCtdt}
                    </button>
                </li>
            ))}
        </ul>
    );
};
const ChuanKiemDinh = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchDataFromAPI = async () => {
        try {
            const result = await getKdclData();
            const initializedData = result.map((item) => ({
                ...item,
                isEditing: false,
            }));
            setData(initializedData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchDataFromAPI();
    }, []);
    // Hàm xử lý khi nhấn vào nút Edit
    const handleEditClick = (id) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, isEditing: true } : item
            )
        );
    };

    // Hàm xử lý khi người dùng thay đổi giá trị input
    const handleTenChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, tenKdcl: newText } : item
            )
        );
    };
    const handleNamBanHanhChange = (id, newText) => {
        setData((prevList) =>
            prevList.map((item) =>
                item.idKdcl === id ? { ...item, namBanHanh: newText } : item
            )
        );
    };

    // Hàm xử lý khi người dùng nhấn Enter để hoàn tất việc chỉnh sửa
    const handleTenPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.idKdcl === id ? { ...item, isEditing: false } : item
                )
            );
            try {
                const response = await updateTenKdcl(event.target.value, id);
            } catch (e) {}
        }
    };
    const handleNamBanHanhPress = async (id, event) => {
        if (event.key === "Enter") {
            setData((prevList) =>
                prevList.map((item) =>
                    item.idKdcl === id ? { ...item, isEditing: false } : item
                )
            );
            try {
                const response = await updateNamBanHanh(event.target.value, id);
            } catch (e) {}
        }
    };
    const handleDeleteChuanKDCL = async (idKdcl) => {
        try {
            const response = await deleteChuanKDCL(idKdcl);
            fetchDataFromAPI();
        }catch (e) {

        }
    }

    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
            <p style={{ fontSize: "20px" }}>
                DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG
            </p>
            <hr />
            <TableContainer component={Paper}>
                <Table className="font-Inter">
                    <TableHead>
                        <TableRow>
                            <CustomTableHeadCell>STT</CustomTableHeadCell>
                            <CustomTableHeadCell>Tên Chuẩn đánh giá</CustomTableHeadCell>
                            <CustomTableHeadCell>Năm áp dụng</CustomTableHeadCell>
                            <CustomTableHeadCell>Tên CTĐT</CustomTableHeadCell>
                            <CustomTableHeadCell>Tuỳ Chỉnh</CustomTableHeadCell>
                            <CustomTableHeadCell><button className='btn btn-success'>+</button></CustomTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.id}>
                                <CustomTableCell>{index + 1}</CustomTableCell>
                                <CustomTableCell>
                                    {row.isEditing ? (
                                        <input
                                            style={{width : '500px'}}
                                            type="text"
                                            value={row.tenKdcl}
                                            onChange={(e) =>
                                                handleTenChange(row.idKdcl, e.target.value)
                                            }
                                            onKeyPress={(e) => handleTenPress(row.idKdcl, e)}
                                        />
                                    ) : (
                                        row.tenKdcl
                                    )}
                                </CustomTableCell>
                                <CustomTableCell>
                                    {row.isEditing ? (
                                        <input
                                            type="text"
                                            value={row.namBanHanh}
                                            onChange={(e) =>
                                                handleNamBanHanhChange(row.idKdcl, e.target.value)
                                            }
                                            onKeyPress={(e) => handleNamBanHanhPress(row.idKdcl, e)}
                                        />
                                    ) : (
                                        row.namBanHanh
                                    )}
                                </CustomTableCell>
                                <CustomTableCell>
                                    <GenericList maKdcl={row.maKdcl} />
                                </CustomTableCell>
                                <CustomTableCell className="button-edit">
                                    <br />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleEditClick(row.idKdcl)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <br />
                                    <button className="btn btn-danger"
                                    onClick={() => handleDeleteChuanKDCL(row.idKdcl)}
                                    >Xóa</button>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ChuanKiemDinh;
