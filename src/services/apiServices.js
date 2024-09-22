import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://localhost:1309/api', // Replace with your API base URL
    timeout: 20000, // Optional: set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            const isExpired = isTokenExpired(token);
            if (isExpired) {
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

//Thong tin user
export const getThongTinDangNhap = (token) => {
    return api.get(`http://localhost:1309/adminuser/get-profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};

//chuan kiem dinh chat luong du lieu
export const getKdclData = (token) => {
    return api.get('/chuankdcl', {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error :', error);
            throw error;
        });
};
// Sua ten chuan kiem dinh chat luong
export const updateTenKdcl = (tenKdcl, maKdcl, token) => {
    return api.get(`/chuankdcl/updateTenKdcl?tenKdcl=${tenKdcl}&maKdcl=${maKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Sua nam ban hanh cua chuan kiem dinh chat luong
export const updateNamBanHanh = (namBanHanh, maKdcl, token) => {
    return api.get(`/chuankdcl/updateNamBanHanh?namBanHanh=${namBanHanh}&maKdcl=${maKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Xoa chuan kiem dinh chat luong
export const deleteChuanKDCL = (maKdcl, token) => {
    return api.delete(`/chuankdcl/deleteChuanKDCL?maKdcl=${maKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Them chuan kiem dinh chat luong moi
export const insertNewChuanKdcl = (formData, token) => {
    return api.post('/chuankdcl/insert', formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

//Data Chuong Trinh Dao Tao theo Ma Kiem Dinh Chat Luong
export const getCtdtDataByMaKDCL = (maKdcl, token) => {
    return api.get(`/ctdt/filter/${maKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

//update chuong trinh dao tao
    export const updateChuongTrinhDaoTao = (formData, token) => {
        return api.put(`/ctdt/update`, formData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
                
            }
        }).then(response => response.data)
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    };
//xoa chuong trinh dao tao
export const deleteChuongTrinhDaoTao = (maCtdt, token) => {
    return api.delete(`/ctdt/delete/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//Data Tieu Chi Theo Ma Chuong Trinh Dao Tao
export const getTieuChiByMaCtdt = (maCtdt, token) => {
    return api.get(`/tieuchi/findByMaCtdt/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Lay Data Chuong Trinh Dao Tao
export const getThongTinCTDT = (maCtdt, token) => {
    return api.get(`/ctdt/detail/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Tieu Chuan Theo Ma Chuong Trinh Dao Tao
export const getTieuChuanWithMaCtdt = (maCtdt, token) => {
    return api.get(`/tieuchuan/listandcount/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Minh Chung theo Chuong Trinh Dao Tao
export const getMinhChungByMaCtdt = (maCtdt, token) => {
    return api.get(`/minhchung/findByMaCtdt/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};


//Data thong tin cua Tieu Chuan
export const getTieuChuanById = (TieuChuan_ID, token) => {
    return api.get(`/tieuchuan/${TieuChuan_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Tieu Chi theo Tieu Chuan
export const getAllTieuChiWithIdTieuChuan = (idTieuChuan, token) => {
    return api.get(`/tieuchi/${idTieuChuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data thong tin cua Tieu Chi
export const getTieuChiById = (idTieuChi, token) => {
    return api.get(`/tieuchi/findById/${idTieuChi}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
//Tong minh chung trong tieu chi
export const getTotalMinhChungWithTieuChi = (idTieuChi, token) => {
    return api.get(`/minhchung/CountMinhChungWithTieuChi/${idTieuChi}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error :', error);
            throw error;
        });
};
//Tong minh chung trong tieu chuan
export const getTotalMinhChungWithTieuChuan = (idTieuChuan, token) => {
    return api.get(`/minhchung/CountMinhChungByTieuChuan/${idTieuChuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error :', error);
            throw error;
        });
};
// Data Moc Chuan theo Tieu Chi
export const getAllMocChuanWithIdTieuChi = (idTieuChi, token) => {
    return api.get(`/mocchuan/findByIdTieuChi/${idTieuChi}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
//Data Minh Chung theo Tieu Chi
export const getMinhChungWithIdTieuChi = (criteriaID, token) => {
    return api.get(`/minhchung/findByIdTieuChi/${criteriaID}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Data thoong tin Goi Y
export const getGoiYById = (idGoiY, token) => {
    return api.get(`/goiy/findById/${idGoiY}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Goi Y theo Moc Chuan
export const getAllGoiYWithIdMocChuan = (idMocChuan, token) => {
    return api.get(`/goiy/${idMocChuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
// Lay data cua tat ca Minh Chung theo Goi Y
export const getAllMinhChungAndTieuChi = (token) => {
    return api.get(`/minhchung/MinhChungAndIdTieuChi`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
//Luu Goi Y
export const saveGoiY = (goiY, token) => {
    return api.post('/goiy', goiY, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Lay data cua Loai Minh Chung
export const getAllLoaiMinhChung = (token) => {
    return api.get(`/loaiminhchung`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Lay data cua Don vi ban hanh
export const getAllDonViBanHanh = (token) => {
    return api.get(`/donvibanhanh`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Lay data cua Kho Minh Chung
export const getAllKhoMinhChung = (token) => {
    return api.get(`/khominhchung`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Lay thong tin Kho Minh Chung
export const getKhoMinhChungWithId = (EvidenceID, token) => {
    return api.get(`/khominhchung/findById/${EvidenceID}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Cap nhat Kho Minh Chung
export const updateKhoMinhChung = (EvidenceID, minhChung, token) => {
    return api.put(`/khominhchung/edit/${EvidenceID}`, minhChung, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Lay data cua Minh Chung
export const getAllMinhChung = (token) => {
    return api.get(`/minhchung`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Tim kiem Minh Chung theo Loai van ban khong xet den thoi gian
export const searchLoaiVanBanByNotDate = (tenMc, soHieu, idLoai, token) => {
    return api.get(`/khominhchung/searchByNotDate?tenMc=${tenMc}&soHieu=${soHieu}&idLoai=${idLoai}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Tim kiem Minh Chung theo Loai Van Ban trong khoan thoi gian nhat dinh
export const searchLoaiVanBanByDate = (tenMc, soHieu, idLoai, startDate, endDate, token) => {
    return api.get(`/khominhchung/searchByDate?tenMc=${tenMc}&soHieu=${soHieu}&idLoai=${idLoai}&startDate=${startDate}&endDate=${endDate}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Xoa Minh Chung
export const deleteMinhChung = (idMc, parentMaMc, token) => {
    return api.get(`/minhchung/delete?idMc=${idMc}&parentMaMc=${parentMaMc}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Upload Minh Chung
export const uploadMinhChung = (formData, token) => {
    return api.post('/uploadToGoogleDrive', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'

        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Luu Minh Chung
export const saveMinhChung = (minhChung, token) => {
    return api.post('/khominhchung', minhChung, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Luu Minh Chung vao Kho Minh Chung
export const saveFromKMCtoMinhChung = (minhChung, token) => {
    return api.post('/minhchung', minhChung, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
// Luu Minh Chung dung cho ma Minh Chung
export const saveMinhChungDungChung = (minhChung, token) => {
    return api.post('/minhchung/dungchung', minhChung, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const getMinhChungKhongDungChung = (token) => {
    return api.get(`/minhchung/MinhChungKhongDungChung`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
// Dang nhap
export const login = (email, password) => {
    return api.post('http://localhost:1309/auth/login', { email, password }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//khoa
export const getKhoa = (token) => {
    return api.get(`/khoa`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};

//nganh
export const getNganh = (token) => {
    return api.get(`/nganh`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};

//phong ban

export const getPhongBan = (token) => {
    return api.get(`/phongban`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//get phong ban by id
export const getPhongBanById = (idPhongBan, token) => {
    return api.get(`/phongban/${idPhongBan}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//save phong ban
export const savePhongBan = (phongBan, token) => {
    return api.post('/phongban', phongBan, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

//edit phong ban
export const editPhongBan = (phongBan, token) => {
    return api.put('/phongban', phongBan, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

//xoa phong ban
export const deletePhongBan = (idPhongBan, token) => {
    return api.delete(`/phongban/delete/${idPhongBan}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};

//get phan cong
export const getAllPhanCong = (token) => {
    return api.get(`/phancongdanhgia`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//get phan cong by idPhongBan
export const getAllPhanCongByIdPhongBan = (idPhongBan, maKdcl, token) => {
    return api.get(`/phancongdanhgia/findByIdPhongBan?idPhongBan=${idPhongBan}&maKdcl=${maKdcl}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};

//get phan cong
export const insertPhanCong = (token) => {
    return api.get(`/phancongdanhgia`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//xoa phan cong
export const deletePhanCong = (idPhanCong, token) => {
    return api.delete(`/phancongdanhgia/${idPhanCong}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//cap nhat phan cong
export const updatePhanCong = (phanCong, token) => {
    return api.put('/phancongdanhgia', phanCong, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//them phan cong
export const savePhanCong = (phanCong, token) => {
    return api.post('/phancongdanhgia', phanCong, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

//phieu danh gia tieu chi
export const savePhieuDanhGiaTieuChi = (formData, token) => {
    return api.post('/phieudanhgiatieuchi', formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//update phieu danh gia tieu chi
export const updatePhieuDanhGiaTieuChi = (formData, token) => {
    return api.put('/phieudanhgiatieuchi', formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//get phieu danh gia by idTieuChuan va idTieuChi
export const getPhieuDanhGiaTieuChiByTieuChuanAndTieuChi = (idTieuChuan, idTieuChi, token) => {
    return api.get(`/phieudanhgiatieuchi/findByTieuChuanAndTieuChi?idTieuChuan=${idTieuChuan}&idTieuChi=${idTieuChi}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};
//get phieu danh gia by maCtdt
export const getPhieuDanhGiaTieuChiByMaCtdt = (maCtdt, token) => {
    return api.get(`/phieudanhgiatieuchi/findByMaCtdt?maCtdt=${maCtdt}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
};