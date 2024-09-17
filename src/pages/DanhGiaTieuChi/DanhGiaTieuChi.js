import React, { useEffect, useState } from "react";
import { getPhieuDanhGiaTieuChiByTieuChuanAndTieuChi } from "../../services/apiServices";
import { useLocation } from "react-router-dom";

const DanhGiaTieuChi = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const TieuChi_ID = queryParams.get('TieuChi_ID');
    const [phieuDanhGia, setPhieuDanhGia] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPhieuDanhGiaTieuChiByTieuChuanAndTieuChi(TieuChuan_ID, TieuChi_ID);
                setPhieuDanhGia(response);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        if (TieuChuan_ID && TieuChi_ID) {
            fetchData();
        }
    }, [TieuChuan_ID, TieuChi_ID]);
    const processTextWithLinks = (text) => {
        const regex = /\[<a.*?href="(.*?)".*?>(.*?)<\/a>\]/g;
        const parts = [];
        let lastIndex = 0;

        let match;
        while ((match = regex.exec(text)) !== null) {
            // Push the text before the link
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            // Push the link
            parts.push(
                <a key={match[2]} target="_blank" rel="noopener noreferrer" href={match[1]}>
                    {match[2]}
                </a>
            );
            lastIndex = regex.lastIndex;
        }

        // Push the rest of the text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts;
    };
    return (
        <div className="a4-size">
            <div className="a4-content">
                <p className="text-center">
                    <b style={{ fontSize: '14px' }}>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b>
                </p>
                <p className="a4-tab"><b>Nhóm công tác:</b></p>
                <p className="a4-tab"><b>Tiêu chuẩn:</b></p>
                <p className="a4-tab"><b>Tiêu chí:</b></p>
                <p className="a4-tab"><b>1. Mô tả</b></p>
                <p className="a4-mota">{phieuDanhGia ? (
                    <div dangerouslySetInnerHTML={{ __html: phieuDanhGia.moTa }} />
                ) : (
                    'Loading...'
                )}</p>
            </div>
        </div>
    );
};

export default DanhGiaTieuChi;
