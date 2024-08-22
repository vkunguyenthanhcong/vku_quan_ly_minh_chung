export const format2Number = (num) => {
    return num.toString().padStart(2, '0');
};
export const createMaMinhChung = ({sttTC, sttTieuChuan, sttTieuChi}) => {
    return 'H'+sttTC+'.'+sttTieuChuan+'.'+sttTieuChi+'.';
}