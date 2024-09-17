import React , {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getThongTinCTDT } from "../../../../services/apiServices";
import { Col, Row } from "react-bootstrap";
const BaoCaoTuDanhGia = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchDataFromAPI = async () => {
          try {
            const result = await getThongTinCTDT(KhungCTDT_ID);
            setChuongTrinhDaoTao(result);
          } catch (error) {
            setError(error);
          } finally {
            setLoading(false);
          }
        };
        fetchDataFromAPI();
      }, [KhungCTDT_ID]);
      if(loading === true){
        return (<p>Loading...</p>)
      }
      const goToVietBaoCao = () => {
        navigate(`../viet-bao-cao?KhungCTDT_ID=${KhungCTDT_ID}`)
      }
    return (
        <div className="content bg-white m-3 p-4">
            <p>BÁO CÁO TỰ ĐÁNH GIÁ <b>{chuongTrinhDaoTao.tenCtdt}</b></p>
            <b>Kế hoạch</b>
            <div className="mt-2">
                <Row>
                    <Col md={2} xs = {12}><button className="btn btn-success">Kế hoạch tự đánh giá</button></Col>
                    <Col md={2} xs = {12}><button className="btn btn-success">Hội đồng tự đánh giá</button></Col>
                    <Col md={2} xs = {12}><button className="btn btn-success">Các nhóm chuyên trách</button></Col>
                </Row>
            </div>
            <br/>
            <b>Viết báo cáo</b>
            <div className="mt-2">
                <Row>
                    <Col md={2} xs = {12}><button className="btn btn-success" onClick={() => goToVietBaoCao()}>Viết báo cáo tiêu chí</button></Col>
                </Row>
            </div>
            <br/>
            <b>Tổng hợp</b>
            <div className="mt-2">
                <Row>
                    <Col md={2} xs = {12}><button className="btn btn-primary">Tổng hợp</button></Col>
                </Row>
            </div>
        </div>   
    );
}
export default BaoCaoTuDanhGia;