// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getThongTinCTDT, getTieuChuanWithMaCtdt, getMinhChung } from '../../services/apiServices';
import { useNavigate } from 'react-router-dom';
import './CtdtPage.css'

const ChuongTrinhDaoTao = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getThongTinCTDT();
        setData(result);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, []);
  return (
    <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>{}</b></p>
            <p>
              - Chuẩn đánh giá ĐBCL:
              <button style={{ color: 'white', background: 'gray', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>
                <b>{item.ten_kdcl}</b>
              </button>
            </p>
            <p>
              - Thuộc Khoa: <b>{item.ten_khoa}</b>
            </p>
            <p>
              Web <b>{item.web}</b> - Email <b>{item.email}</b> - Điện thoại <b>{item.sdt}</b>
            </p>
            <p>
              - Thuộc Ngành: <b>{item.ten_nganh}</b>
            </p>
            <p>
              - Thuộc Trình độ: <b>{item.trinhdo}</b>
            </p>
            <p>
              - Số tín chỉ áp dụng: <b>{item.sotinchi}</b>
            </p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ChuongTrinhDaoTao;
