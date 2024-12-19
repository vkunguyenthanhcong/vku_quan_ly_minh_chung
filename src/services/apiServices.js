import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const ipAddress = "localhost"
const api = axios.create({
    baseURL: `http://${ipAddress}:1309/api`, // Replace with your API base URL
    timeout: 200000, // Optional: set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export const urlDefault = `http://${ipAddress}:1309`;
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
    return api.get(`http://${ipAddress}:1309/adminuser/get-profile`, {
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

export const updateUser = (formData, token) => {
    return api.put(`http://${ipAddress}:1309/admin/update`, formData, {
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

export const registerUser = (formData) => {
    return api.post(`../auth/register`, formData, {
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const uploadImageAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);  // 'file' is the name of the field expected by the server

    return api.post('../public/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // This is optional; axios will handle it automatically
        }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
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
    return api.delete(`/chuankdcl?maKdcl=${maKdcl}`, {
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
//get all CTDT
export const getAllChuongTrinhDaoTao = (token) => {
    return api.get(`/ctdt`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
//insert chuong trinh dao tao
export const createChuongTrinhDaoTao = (formData, token) => {
    return api.post(`/ctdt`, formData, {
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
export const findTieuChuaByMaCtdt = (maCtdt, token) => {
    return api.get(`/tieuchuan/findByMaCtdt/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Tieu Chuan
export const getAllTieuChuan = (maCtdt, token) => {
    return api.get(`/tieuchuan`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const deleteTieuChuan = (id, token) => {
    return api.delete(`/tieuchuan/${id}`, {
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
//them tieu chuan moi
export const insertNewTieuChuan = (formData, token) => {
    return api.post(`/tieuchuan`, formData, {
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
//sao chep ctdt
export const copyCtdt = (formData, token) => {
    return api.post(`/ctdt/copydata`, formData, { timeout: 300000 },{
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
//sua tieu chuan
export const updateTieuChuan = (formData, token) => {
    return api.put(`/tieuchuan`, formData, {
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
//them tieu chi moi
export const insertNewTieuChi = (formData, token) => {
    return api.post(`/tieuchi`, formData, {
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

//update tieu chi
export const updateTieuChi = (formData, token) => {
    return api.put(`/tieuchi`, formData, {
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
//get all data tieu chi
export const getAllTieuChi = (token) => {
    return api.get(`/tieuchi`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
// Data Moc Chuan theo Tieu Chi
export const getAllMocChuan = (token) => {
    return api.get(`/mocchuan`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
//them moc chuan moi
export const insertNewMocChuan = (formData, token) => {
    return api.post(`/mocchuan`, formData, {
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
export const deleteMocChuan = (id, token) => {
    return api.delete(`/mocchuan/${id}`, {
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
//update moc chuan
export const updateMocChuan = (formData, token) => {
    return api.put(`/mocchuan`, formData, {
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
export const updateGoiY = (formData, token) => {
    return api.put(`/goiy`, formData, {
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
export const deleteGoiY = (id, token) => {
    return api.delete(`/goiy/${id}`, {
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
export const deleteTieuChi = (id, token) => {
    return api.delete(`/tieuchi/${id}`, {
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
export const getAllGoiY = (token) => {
    return api.get(`/goiy`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
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
    return api.delete(`/minhchung/delete?idMc=${idMc}&parentMaMc=${parentMaMc}`, {
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
    return api.post('/upload', formData, {
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
//upload image
export const uploadImage = (formData, token) => {
    return api.post('/images/upload', formData, {
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
//change slot minhchung
export const downSlotMinhChung = (idMc, token) => {
    return api.put(`/minhchung/down/${idMc}`, {
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
export const upSlotMinhChung = (idMc, token) => {
    return api.put(`/minhchung/up/${idMc}`, {
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
    return api.post(`http://${ipAddress}:1309/auth/login`, { email, password }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//check is accept
export const checkIsAccept = (token) => {
    return api.get(`../auth/isAccept`, {
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
//xoa khoa
export const deleteKhoa = (maKhoa, token) => {
    return api.delete(`/khoa/${maKhoa}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//xoa nganh
export const deleteNganh = (maNganh, token) => {
    return api.delete(`/nganh/${maNganh}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
//edit khoa
export const editKhoa = (formData,maKhoa, token) => {
    return api.put(`/khoa/${maKhoa}`, formData, {
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
//edit nganh
export const editNganh = (formData,maNganh, token) => {
    return api.put(`/nganh/${maNganh}`, formData, {
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
export const getPhongBanWithoutToken = () => {
    return api.get(`../public/phongban`, {
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
//save khoa
export const saveKhoa = (khoa, token) => {
    return api.post('/khoa', khoa, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
            throw error;
        });
};

//save nganh
export const saveNganh = (nganh, token) => {
    return api.post('/nganh', nganh, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => response.data)
        .catch(error => {
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
//phieu danh gia tieu chi
export const savePhieuDanhGiaTieuChuan = (formData, token) => {
    return api.post('/phieudanhgiatieuchuan', formData, {
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
export const updatePhieuDanhGiaTieuChuan = (formData, token) => {
    return api.put('/phieudanhgiatieuchuan', formData, {
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
//get phieu danh gia tieu chi
export const getAllPhieuDanhGia = (token) => {
    return api.get(`/phieudanhgiatieuchi`, {
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
//get phieu danh gia tieu chuan
export const getAllPhieuDanhGiaTieuChuan = (token) => {
    return api.get(`/phieudanhgiatieuchuan`, {
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
//get all user
export const getAllUser = (token) => {
    return api.get(`../admin/get-all-users`, {
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
