export const format2Number = (num) => {
    return num.toString().padStart(2, '0');
};
export const createMaMinhChung = ({sttTieuChuan, sttTieuChi}) => {
    return 'H1.'+sttTieuChuan+'.'+sttTieuChi+'.';
}