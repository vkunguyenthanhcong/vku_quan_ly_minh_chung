import create from 'zustand';
import { getThongTinCTDT } from "../services/apiServices"; // Kiểm tra đường dẫn

const useCTDTStore = create((set) => ({
    chuongTrinhDaoTao: null,
    error: null,
    loading: false,
    fetchData: async (KhungChuongTrinhID) => {
        set({ loading: true }); // Đặt loading là true
        try {
            const result_1 = await getThongTinCTDT(KhungChuongTrinhID);
            set({ chuongTrinhDaoTao: result_1, error: null });
        } catch (error) {
            set({ error });
        } finally {
            set({ loading: false }); // Đặt loading là false
        }
    },
}));

export default useCTDTStore;
