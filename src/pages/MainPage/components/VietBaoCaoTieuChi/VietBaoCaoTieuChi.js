import React, {useEffect, useState, useRef} from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {useLocation} from "react-router-dom";
import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    CloudServices,
    Essentials,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    SelectAll,
    ShowBlocks,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo,
    PasteFromOffice,
    Mention
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import {
    getAllGoiY, getAllKhoMinhChung,
    getAllMinhChung, getAllMocChuan, getAllPhieuDanhGia,
    getPhongBanById,
    getTieuChiById,
    getTieuChuanById,
    savePhieuDanhGiaTieuChi,
    updatePhieuDanhGiaTieuChi, uploadImage, urlDefault
} from "../../../../services/apiServices";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";
import SuccessDialog from "../../../../components/ConfirmDialog/SuccessDialog";
import Notification from "../../../../components/ConfirmDialog/Notification";


function MentionCustomization(editor) {
    editor.conversion.for('downcast').attributeToElement({
        model: 'mention', view: (modelAttributeValue, {writer}) => {
            if (!modelAttributeValue) {
                return;
            }

            return writer.createAttributeElement('a', {
                class: 'mention',
                'data-mention': modelAttributeValue.id,
                'href': modelAttributeValue.link,
                'data-name': modelAttributeValue.name
            }, {
                id: modelAttributeValue.uid
            });
        }, converterPriority: 'high'
    });
}
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        try {
            const file = await this.loader.file;
            const formData = new FormData();
            formData.append("file", file);

            // Replace with your API call to upload the image
            const imagePath = await uploadImage(formData);

            // Construct the full URL for CKEditor
            const fullUrl = `${imagePath}`;
            return {
                default: fullUrl, // CKEditor will use this to display the image
            };
        } catch (error) {
            console.error("Image upload failed", error);
            return Promise.reject(error);
        }
    }

    abort() {
        // Handle abort if necessary
    }
}

// Plugin to integrate the custom adapter with CKEditor
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

const VietBaoCaoTieuChi = ({dataTransfer}) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleMouseMove = (event) => {
        setMousePosition({
            y: `${event.clientY + 50}`,
            x: `${event.clientX}`,
        });
    };
    useEffect(() => {
        
        const handleBeforeUnload = (event) => {
            const confirmationMessage = "Bạn có chắc chắn muốn rời khỏi trang này? Các thay đổi chưa lưu sẽ bị mất.";
            event.preventDefault();
            event.returnValue = confirmationMessage; // Hiển thị thông báo (trình duyệt cần dòng này)
            return confirmationMessage; // Một số trình duyệt dùng giá trị trả về này
        };

        // Thêm sự kiện `beforeunload`
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Xóa sự kiện khi component bị hủy
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = dataTransfer.TieuChuan_ID;
    const TieuChi_ID = dataTransfer.TieuChi_ID;
    const idPhongBan = dataTransfer.NhomCongTac;
    const [phieuDanhGia, setPhieuDanhGia] = useState(null)
    const [show, setShow] = useState(true);
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([])
    const [tieuChi, setTieuChi] = useState([])
    const [minhChung, setMinhChung] = useState([])
    const [nhomCongTac, setNhomCongTac] = useState(null)
    const [success, setSuccess] = useState(false);
    const showSuccess = () => {setSuccess(true)}
    const hideSuccess = () => {setSuccess(false)}
    const [textSuccess, setTextSuccess] = useState({"title" : "", "message" : ""});
    const [emptyText, setEmptyText] = useState(false);

    const [moTa, setMoTa] = useState('');
    const [diemManh, setDiemManh] = useState('');
    const [diemYeu, setDiemYeu] = useState('');
    const [keHoach, setKeHoach] = useState("<figure class=\"table\"><table><thead><tr><th>TT</th><th>Mục tiêu</th><th>Nội dung</th><th>Đơn vị/ cá nhân thực hiện</th><th>Thời gian thực hiện</th><th>Ghi chú</th></tr></thead></table></figure>");
    const [mucDanhGia, setMucDanhGia] = useState(0);
    const [booleanMention, setBooleanMention] = useState(false);

    const options = [1, 2, 3, 4, 5, 6, 7];
    const fetchData = async () => {
        const response = await getTieuChuanById(TieuChuan_ID);
        setTieuChuan(response);

        const response_2 = await getTieuChiById(TieuChi_ID);
        setTieuChi(response_2);

        const response_3 = await getPhongBanById(idPhongBan);
        setNhomCongTac(response_3);

        const allMinhChungData = await getAllMinhChung();
        const allKhoMinhChungData = await getAllKhoMinhChung();
        const mocChuanData = await getAllMocChuan();
        const goiYAll = await getAllGoiY();
        const updatedMinhChung = allMinhChungData
            .map(item => {
                const maMinhChung = `${item.parentMaMc || 'H1'}${item.childMaMc || ''}`;
                const idMocChuan = goiYAll.find((gy) => gy.idGoiY == item.idGoiY).idMocChuan;
                const idTieuChi = mocChuanData.find((mc) => mc.idMocChuan == idMocChuan).idTieuChi;
                const khoMinhChung = allKhoMinhChungData.find((kmc) => kmc.idKhoMinhChung === item.idKhoMinhChung);
                if (item.allMinhChungData !== 0) {
                    const matchingItem = allMinhChungData.find(mc => mc.idMc === item.maDungChung);

                    if (matchingItem) {
                        return {
                            ...item,
                            khoMinhChung: khoMinhChung,
                            parentMaMc: matchingItem.parentMaMc,
                            childMaMc: matchingItem.childMaMc,
                            maMinhChung: `${matchingItem.parentMaMc || 'H1'}${matchingItem.childMaMc || ''}`,
                            idTieuChi: idTieuChi
                        };
                    }
                }
                return {
                    ...item,
                    khoMinhChung: khoMinhChung,
                    maMinhChung,
                    idTieuChi: idTieuChi
                };
            });
        const minhChungFilter = updatedMinhChung.filter((item) => item.idTieuChi == TieuChi_ID);
        minhChungFilter.length > 0 ? (setBooleanMention(true)) : (setBooleanMention(false));
        const suggestions = minhChungFilter.map(itemB => {
            let parentMaMc = itemB.parentMaMc;
            let childMaMc = itemB.childMaMc;

            if (parentMaMc == "0" && childMaMc == "0") {
                const correspondingA = allMinhChungData.find(itemA => itemA.idMc == itemB.maDungChung);

                if (correspondingA) {
                    parentMaMc = correspondingA.parentMaMc;
                    childMaMc = correspondingA.childMaMc;
                }
            }
            const maMinhChung = `${parentMaMc}${childMaMc}`;
            return {
                tenMinhChung: itemB.khoMinhChung.tenMinhChung,
                maMinhChung: maMinhChung,
                link: "https://drive.google.com/file/d/" + itemB.linkLuuTru + "/preview"
            };
        });
        setMinhChung(suggestions);

        const response_4 = await getAllPhieuDanhGia();
        if (response_4) {
            const filterPhieuDanhGia = response_4.filter((item) => item.idTieuChuan === TieuChuan_ID && item.idTieuChi === TieuChi_ID);
            if (filterPhieuDanhGia && filterPhieuDanhGia.length > 0) {
                const firstItem = filterPhieuDanhGia[0];

                setPhieuDanhGia(filterPhieuDanhGia);
                setMoTa(firstItem.moTa);
                setDiemManh(firstItem.diemManh);
                setDiemYeu(firstItem.diemTonTai);
                setKeHoach(firstItem.keHoach);
                setMucDanhGia(firstItem.mucDanhGia);
            } else {
                setPhieuDanhGia([]);
                setMoTa('');
            }
        }


        setBooleanMention(true)
        setShow(false)
    };
    useEffect(() => {
        fetchData();
    }, [TieuChuan_ID, TieuChi_ID, idPhongBan]);


    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);
    const handleEditorReady = (editor) => {
        setEditorInstance(editor);
    };

    const editorConfig = {
        extraPlugins: [MyCustomUploadAdapterPlugin],
        mention: {
            feeds: [{
                marker: '[',
                feed: (query) => {
                    return minhChung
                        .filter((item) => item.maMinhChung.toLowerCase().includes(query.toLowerCase()))
                        .map((item) => ({
                            id: '[' + item.tenMinhChung + ']',
                            name: item.tenMinhChung,
                            link: item.link,
                            text: '[' + item.tenMinhChung + ']'
                        }));
                },
                itemRenderer: (item) => `${item.name}`
            }]
        },
        toolbar: {
            items: ['undo', 'redo', '|', 'showBlocks', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'link', 'insertImage', 'insertTable', 'blockQuote', 'htmlEmbed', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'],
            shouldNotGroupWhenFull: false
        },
        fontFamily: {
            options: [
                'default',
                'Times New Roman, Times, serif'
            ],
            supportAllValues: true
        },
        plugins: [MentionCustomization, Mention, Autoformat, AutoImage, Autosave, BalloonToolbar, BlockQuote, BlockToolbar, Bold, CloudServices, Essentials, FullPage, GeneralHtmlSupport, Heading, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, Paragraph, SelectAll, ShowBlocks, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, TextTransformation, TodoList, Underline, Undo, PasteFromOffice],
        balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
        blockToolbar: ['bold', 'italic', '|', 'link', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
        heading: {
            options: [{
                model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'
            }, {
                model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'
            }, {
                model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'
            }, {
                model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'
            }, {
                model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'
            }, {
                model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'
            }, {
                model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'
            }]
        },
        htmlSupport: {
            allow: [{
                name: /^.*$/, styles: true, attributes: true, classes: true
            }]
        },
        image: {
            toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage']
        },
        link: {
            addTargetToExternalLinks: true, defaultProtocol: 'https://', decorators: {
                toggleDownloadable: {
                    mode: 'manual', label: 'Downloadable', attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true, startIndex: true, reversed: true
            }
        },
        menuBar: {
            isVisible: true
        },
        placeholder: 'Nhập hoặc dán dữ liệu vào đây!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    }
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };
    const reloadFromDraft = () => {
        const draftKey = `draft_tieuChi_${TieuChi_ID}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft); // Parse the JSON string
                setMoTa(draftData.draft_moTa || ""); // Use default values if data is missing
                setDiemManh(draftData.draft_diemManh || "");
                setDiemYeu(draftData.draft_diemYeu || "");
                setKeHoach(draftData.draft_keHoach || "");
                setMucDanhGia(draftData.draft_mucDanhGia ?? 0);
            } catch (error) {
                console.error("Error parsing saved draft data:", error);
            }
        } else {
            console.log("No draft data found.");
        }
    }
    const saveDraftWithID = (updatedData = {}) => {
        const draftKey = `draft_tieuChi_${TieuChi_ID}`;
        const draftData = {
            draft_moTa: updatedData.moTa ?? moTa,
            draft_diemManh: updatedData.diemManh ?? diemManh,
            draft_diemYeu: updatedData.diemYeu ?? diemYeu,
            draft_keHoach: updatedData.keHoach ?? keHoach,
            draft_mucDanhGia: updatedData.mucDanhGia ?? mucDanhGia ?? 0,
        };
        localStorage.setItem(draftKey, JSON.stringify(draftData));
    };
    const debouncedSaveDraft = debounce(saveDraftWithID, 300);


// Editor handlers with meaningful content check
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setMoTa(data);

        debouncedSaveDraft({ moTa: data });
    };

    const handleSetDiemManh = (event, editor) => {
        const data = editor.getData();
        setDiemManh(data);

        debouncedSaveDraft({ diemManh: data });
    };

    const handleSetDiemYeu = (event, editor) => {
        const data = editor.getData();
        setDiemYeu(data);

        debouncedSaveDraft({ diemYeu: data });
    };

    const handleSetKeHoach = (event, editor) => {
        const data = editor.getData();
        setKeHoach(data);

        debouncedSaveDraft({ keHoach: data });
    };

    const handleSetMucDanhGia = (value) => {
        setMucDanhGia(value);
        debouncedSaveDraft({ mucDanhGia: value });
    };


    const savePhieuDanhGia = async () => {
        try {
            if(moTa.trim === "" && diemManh.trim === "" && diemYeu.trim === "" && mucDanhGia === 0){
                setTextSuccess({"title" : "Lưu Thất Bại", "message" : "Tất cả các dữ liệu không được để trống"});
                setEmptyText(true);
            }else{
                const data = new FormData();
                data.append('idPhongBan', idPhongBan);
                data.append('idTieuChuan', TieuChuan_ID);
                data.append('idTieuChi', TieuChi_ID);

                data.append('moTa', moTa);
                data.append('diemManh', diemManh);
                data.append('diemTonTai', diemYeu);
                data.append('mucDanhGia', mucDanhGia);
                data.append("keHoach", keHoach)
                if (phieuDanhGia?.length === 0) {
                    data.append("nguoiVietBaoCao", localStorage.getItem("fullName"));
                    const response = await savePhieuDanhGiaTieuChi(data);
                    if (response === "OK") {
                        fetchData()
                        setTextSuccess({"title" : "Lưu Thành Công", "message" : "Hệ thông đã lưu thành công báo cáo"});
                        showSuccess();
                    }
                } else {
                    data.append('idPhieuDanhGia', phieuDanhGia[0].idPhieuDanhGiaTieuChi)
                    const response = await updatePhieuDanhGiaTieuChi(data);
                    if (response === "OK") {
                        setTextSuccess({"title" : "Cập Nhật Thành Công", "message" : "Hệ thông đã cập nhật thành công báo cáo"});
                        showSuccess();
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    const viewPhieuDanhGia = () => {
        window.open(`danh-gia-tieu-chi?TieuChuan_ID=${TieuChuan_ID}&TieuChi_ID=${TieuChi_ID}`, '_blank');
    };

    return (
        <div onMouseMove={handleMouseMove}>
            <LoadingProcess open={show}/>
            {emptyText ? <Notification title={textSuccess.title} message={textSuccess.message} onClose={setEmptyText}/> : null}
            <SuccessDialog show={success} onClose={hideSuccess} title={textSuccess.title} message={textSuccess.message}/>
            <style>
                {`
                .mention::after {
                  content: attr(data-name); /* Display the data-name content */
                  position: fixed;
                  top: ${mousePosition.y}px;
                  left: ${mousePosition.x}px;
                  transform: translate(-50%, -50%); /* Move back to exact center */
                  padding: 5px;
                  background-color: black;
                  color: white;
                  border-radius: 4px;
                  white-space: nowrap; /* Prevent wrapping */
                  opacity: 0; /* Start hidden */
                  pointer-events: none; /* Disable mouse events */
                  transition: opacity 0.2s ease-in-out; /* Smooth transition */
                  z-index: 1000; /* Make sure it appears on top */
                }
                .ck-content{
                    font-family: 'Times New Roman', Times, serif !important;
                }

                `}
            </style>
            {booleanMention ? (
                <div className="content bg-white m-3 p-4 rounded shadow-sm">
                    <p className="text-center fs-5 fw-bold">PHIẾU ĐÁNH GIÁ TIÊU CHÍ</p>
                    <p>
                        <strong>Nhóm công tác: </strong>
                        {nhomCongTac ? <span>{nhomCongTac.tenPhongBan}</span> : <span>Loading...</span>}
                    </p>
                    <p>
                        <strong>Tiêu chuẩn {tieuChuan.stt}:</strong> {tieuChuan.tenTieuChuan}
                    </p>
                    <p>
                        <strong>Tiêu chí {tieuChi.stt}:</strong> {tieuChi.tenTieuChi}
                    </p>

                    {/* Section 1: Mô tả */}
                    <p className="mt-3"><strong>1. Mô tả</strong></p>
                    <div className="main-container border p-2 rounded">
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            onReady={handleEditorReady}
                            onChange={handleEditorChange}
                            data={moTa}
                        />
                    </div>

                    {/* Section 2: Điểm mạnh */}
                    <p className="mt-3"><strong>2. Điểm mạnh</strong></p>
                    <div className="main-container border p-2 rounded">
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            onChange={handleSetDiemManh}
                            data={diemManh}
                        />
                    </div>

                    {/* Section 3: Điểm tồn tại */}
                    <p className="mt-3"><strong>3. Điểm tồn tại</strong></p>
                    <div className="main-container border p-2 rounded">
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            onChange={handleSetDiemYeu}
                            data={diemYeu}
                        />
                    </div>

                    {/* Section 4: Kế hoạch hành động */}
                    <p className="mt-3"><strong>4. Kế hoạch hành động</strong></p>
                    <div className="main-container border p-2 rounded">
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            onChange={handleSetKeHoach}
                            data={keHoach}
                        />
                    </div>

                    {/* Section 5: Mức đánh giá */}
                    <p className="mt-3"><strong>5. Mức đánh giá</strong></p>
                    <div className="btn-group w-100" role="group" aria-label="Mức đánh giá">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map((option) => (
                            <button
                                key={option}
                                type="button"
                                className={`btn btn-outline-primary ${mucDanhGia === option ? "active" : ""}`}
                                onClick={() => handleSetMucDanhGia(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="row g-3 mt-4">
                        {[
                            { label: "Lưu", onClick: savePhieuDanhGia, className: "btn-success", icon: "fas fa-save" },
                            { label: "Xem phiếu đánh giá", onClick: viewPhieuDanhGia, className: "btn-primary", icon: "fas fa-eye" },
                            { label: "Tải lại bản nháp", onClick : reloadFromDraft, className: "btn-warning", icon: "fas fa-redo" },
                        ].map(({ label, onClick, className, icon }, index) => (
                            <div className="col-md-4 col-sm-6" key={index}>
                                <button
                                    className={`btn ${className} w-100 py-2 d-flex align-items-center justify-content-center`}
                                    onClick={onClick}
                                    title={label}
                                >
                                    <i className={`${icon} me-2`}></i> {label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

        </div>);

}
export default VietBaoCaoTieuChi;