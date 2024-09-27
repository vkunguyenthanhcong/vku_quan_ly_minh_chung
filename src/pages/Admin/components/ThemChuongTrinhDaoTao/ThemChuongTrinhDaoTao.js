import React, {useEffect, useState} from 'react';
import {
    createChuongTrinhDaoTao,
    getCtdtDataByMaKDCL,
    getKdclData,
    getKhoa,
    getNganh
} from "../../../../services/apiServices";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
function ThemChuongTrinhDaoTao() {
    const [formData, setFormData] = useState({
        tenCtdt: "",
        maCtdt: "",
        maKdcl: "",
        maKhoa: "",
        trinhDo: "Đại học",
        soTinChi: 0,
        maNganh: ""
    });
    const [open, setOpen] = useState(false);
    const [ckdcl, setCkdcl] = useState([]);
    const [khoa, setKhoa] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const khoaData = await getKhoa();
                const nganhData = await getNganh();
                setKhoa(khoaData);
                setNganh(nganhData);
                const ChuanKdclData = await getKdclData();
                setCkdcl(ChuanKdclData)
            } catch (e) {
                setError(e)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    const createCTDT = async () => {
        setOpen(true);
        try {
            const data = new FormData();
            let hasEmptyFields = false;

            // Populate FormData and check for empty fields
            for (let key in formData) {
                if (formData[key] === "") {
                    hasEmptyFields = true;  // Set flag if any field is empty
                }
                data.append(key, formData[key]);
            }

            // If any field is empty, return or show an error message
            if (hasEmptyFields) {
                alert('Vui lòng điền tất cả các trường.');
                return;  // Prevent submission
            }

            // Proceed with submission if no empty fields
            const response = await createChuongTrinhDaoTao(data);

            if (response === "OK") {
                setOpen(false);
                alert('Thêm thành công');
            }
        } catch (e) {
            setOpen(false);
            console.log(e);
        }finally {
            setOpen(false);
        }
    };
    if (error) {
        return (error)
    }
    if (loading) {
        return (<p>Loading...</p>)
    }
    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <LoadingProcess open={open} />
            <p><b>CHƯƠNG TRÌNH ĐÀO TẠO MỚI</b></p>
            <div className="form-group col-md-3 col-xs-6">
                <label>Tên chương trình</label><br/>
                <input className="form-control" type="text" id="tenCtdt" name="tenCtdt" onChange={handleOnChange}
                       value={formData.tenCtdt}/>

                <label className="mt-3">Mã chương trình</label><br/>
                <input className="form-control" type="text" id="maCtdt" name="maCtdt" onChange={handleOnChange}
                       value={formData.maCtdt}/>

                <label className="mt-3">Chuẩn kiểm định</label><br/>
                <select className="form-select" onChange={handleOnChange} name="maKdcl" value={formData.maKdcl}>
                    <option value={""}>---Chuẩn kiểm định---</option>
                    {ckdcl.map((item) => (
                        <option key={item.maKdcl} value={item.maKdcl}>
                            {item.tenKdcl}
                        </option>
                    ))}
                </select>

                <label className="mt-3">Mã khoa</label><br/>
                <select className="form-select" onChange={handleOnChange} name="maKhoa" value={formData.maKhoa}>
                    <option value={""}>---Khoa---</option>
                    {khoa.map((item) => (
                        <option key={item.maKhoa} value={item.maKhoa}>
                            {item.tenKhoa}
                        </option>
                    ))}
                </select>

                <label className="mt-3">Số tín chỉ</label><br/>
                <input className="form-control" type="text" id="soTinChi" name="soTinChi" onChange={handleOnChange}
                       value={formData.soTinChi}/>

                <label className="mt-3">Mã ngành</label><br/>
                <select className="form-select" onChange={handleOnChange} name="maNganh" value={formData.maNganh}>
                    <option value={""}>---Ngành---</option>
                    {nganh.map((item) => (
                        <option key={item.maNganh} value={item.maNganh}>
                            {item.tenNganh} - {item.trinhDo}
                        </option>
                    ))}
                </select>

                <button className="btn btn-success mt-5" onClick={createCTDT}>Thêm</button>
            </div>
        </div>
    );
}

export default ThemChuongTrinhDaoTao;