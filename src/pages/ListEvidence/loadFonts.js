const fs = require('fs');

// Đọc tệp TimesNewRoman-base64.txt
const timesNewRoman = fs.readFileSync('C:/Users/Trinh/Downloads/font-times-new-roman/TimesNewRoman-base64.txt', 'utf8');

// Đọc tệp TimesNewRomanBold-base64.txt
const timesNewRomanBold = fs.readFileSync('C:/Users/Trinh/Downloads/font-times-new-roman/TimesNewRomanBold-base64.txt', 'utf8');

// Khởi tạo pdfMake.vfs với các chuỗi Base64 từ file .txt
const pdfMakeVFS = {
  'TimesNewRoman.ttf': timesNewRoman,
  'TimesNewRomanBold.ttf': timesNewRomanBold
};

// Xuất kết quả vào tệp pdfMakeVFS.json
fs.writeFileSync('pdfMakeVFS.json', JSON.stringify(pdfMakeVFS, null, 2));
console.log('pdfMake VFS đã được khởi tạo với phông TimesNewRoman.');
