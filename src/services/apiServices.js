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
    }) // Endpoint for KDCL data
        .then(response => response.data)
        .catch(error => {
            console.error('Error :', error);
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

//Data Chuong Trinh Dao Tao theo Ma Kiem Dinh Chat Luong
export const getCtdtDataByMaKDCL = (maKdcl, token) => {
    return api.get(`/ctdt/filter/${maKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

//Data Tieu Chi Theo Ma Chuong Trinh Dao Tao
export const getTieuChiByMaCtdt = (maCtdt, token) => {
    return api.get(`/tieuchi/findByMaCtdt/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

export const getThongTinCTDT = (maCtdt, token) => {
    return api.get(`/ctdt/detail/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const getGoiYById = (idGoiY, token) => {
    return api.get(`/goiy/findById/${idGoiY}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const getTieuChiById = (idTieuChi, token) => {
    return api.get(`/tieuchi/findById/${idTieuChi}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

export const getTieuChuanWithMaCtdt = (maCtdt, token) => {
    return api.get(`/tieuchuan/listandcount/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

export const getTieuChuanById = (TieuChuan_ID, token) => {
    return api.get(`/tieuchuan/${TieuChuan_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

export const getMinhChung = (token) => {
    return api.get(`/minhchung`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const getMinhChungByMaCtdt = (maCtdt, token) => {
    return api.get(`/minhchung/findByMaCtdt/${maCtdt}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const getAllTieuChiWithIdTieuChuan = (idTieuChuan, token) => {
    return api.get(`/tieuchi/${idTieuChuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};
export const getAllGoiYWithIdMocChuan = (idMocChuan, token) => {
    return api.get(`/goiy/${idMocChuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
export const getAllMocChuanWithIdTieuChi = (idTieuChi, token) => {
    return api.get(`/mocchuan/findByIdTieuChi/${idTieuChi}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
export const getAllMinhChungWithIdGoiY = (idGoiY, token) => {
    return api.get(`/minhchung/${idGoiY}`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching CTDT data:', error);
            throw error;
        });
};

export const getAllLoaiMinhChung = (token) => {
    return api.get(`/loaiminhchung`, {
        headers: { Authorization: `Bearer ${token}` }
    }) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
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
export const getAllMinhChungAndCtdt = (token) => {
    return api.get(`/minhchung/MinhChungAndCtdt`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export const updateKhoMinhChung = (EvidenceID, minhChung, token) => {
    return api.put(`/khominhchung/edit/${EvidenceID}`, minhChung, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export const updateTenKdcl = (tenKdcl, idKdcl, token) => {
    return api.get(`/chuankdcl/updateTenKdcl?tenKdcl=${tenKdcl}&idKdcl=${idKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const updateNamBanHanh = (namBanHanh, idKdcl, token) => {
    return api.get(`/chuankdcl/updateNamBanHanh?namBanHanh=${namBanHanh}&idKdcl=${idKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export const deleteChuanKDCL = (idKdcl, token) => {
    return api.delete(`/chuankdcl/deleteChuanKDCL?idKdcl=${idKdcl}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

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


export const login = (email, password) => {
    return api.post('http://localhost:1309/auth/login', { email, password }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

