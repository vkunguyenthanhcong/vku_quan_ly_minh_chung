import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:1309/api', // Replace with your API base URL
    timeout: 20000, // Optional: set a timeout for requests
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getKdclData = () => {
    return api.get('/chuankdcl') // Endpoint for KDCL data
      .then(response => response.data)
      .catch(error => {
        console.error('Error :', error);
        throw error;
      });
  };
  
  // Fetch CTDT data
  export const getCtdtData = () => {
    return api.get('/ctdt/grouped') // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };
  export const getCtdtDataByMaKDCL = (maKdcl) => {
    return api.get(`/ctdt/filter/${maKdcl}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };
  export const getThongTinCTDT = (maCtdt) => {
    return api.get(`/details/${maCtdt}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };

  export const getTieuChuanWithMaCtdt = (maCtdt) => {
    return api.get(`/tieuchuan/filterMaCtdt/${maCtdt}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };

  export const getMinhChung = () => {
    return api.get(`/minhchung`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };
  export const getAllTieuChiWithIdTieuChuan = (idTieuChuan) => {
    return api.get(`/tieuchi/${idTieuChuan}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };
  export const getAllGoiYWithIdTieuChi = (idTieuChi) => {
    return api.get(`/goiy/${idTieuChi}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };
  export const getAllMinhChungWithIdGoiY = (idGoiY) => {
    return api.get(`/minhchung/${idGoiY}`) // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };

export const getAllLoaiMinhChung = () => {
    return api.get(`/loaiminhchung`) // Endpoint for CTDT data
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const getAllDonViBanHanh = () => {
    return api.get(`/donvibanhanh`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const getAllKhoMinhChung = () => {
    return api.get(`/khominhchung`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export const searchLoaiVanBanByNotDate = (tenMc, soHieu, idLoai) => {
    return api.get(`/khominhchung/searchByNotDate?tenMc=${tenMc}&soHieu=${soHieu}&idLoai=${idLoai}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export const searchLoaiVanBanByDate = (tenMc, soHieu, idLoai, startDate, endDate) => {
    return api.get(`/khominhchung/searchByDate?tenMc=${tenMc}&soHieu=${soHieu}&idLoai=${idLoai}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const deleteMinhChung = (idMc, parentMaMc) => {
    return api.get(`/minhchung/delete?idMc=${idMc}&parentMaMc=${parentMaMc}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const uploadMinhChung = (formData) => {
    return api.post('/uploadToGoogleDrive', formData, {headers: {
        'Content-Type': 'multipart/form-data',
    },
}).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const saveMinhChung = (minhChung) => {
    return api.post('/khominhchung', minhChung, {headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};
export const saveFromKMCtoMinhChung = (minhChung) => {
    return api.post('/minhchung', minhChung, {headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

