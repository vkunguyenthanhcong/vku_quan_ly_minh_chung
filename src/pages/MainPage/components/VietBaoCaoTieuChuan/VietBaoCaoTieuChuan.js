
import React, {useEffect, useState, useRef} from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
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
import {getAllKhoMinhChung,
    getAllMinhChung, getAllPhieuDanhGia, getAllPhieuDanhGiaTieuChuan, getAllTieuChi,
    getPhongBanById,
    getTieuChuanById,savePhieuDanhGiaTieuChuan,updatePhieuDanhGiaTieuChuan, uploadImage
} from "../../../../services/apiServices";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";

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
            const imagePath = await uploadImage(formData); // e.g., '/uploads/1732009349333_14.jpg'

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


const VietBaoCaoTieuChuan = ({dataTransfer}) => {

    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleMouseMove = (event) => {
        setMousePosition({
            y: `${event.clientY + 50}`,
            x: `${event.clientX}`,
        });
    };

    const TieuChuan_ID = dataTransfer.TieuChuan_ID;
    const TieuChi_ID = dataTransfer.TieuChi_ID;
    const idPhongBan = dataTransfer.NhomCongTac;
    const [show, setShow] = useState(true);
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([])
    const [minhChung, setMinhChung] = useState([])
    const [nhomCongTac, setNhomCongTac] = useState(null)

    const [moTa, setMoTa] = useState('');
    const [diemManh, setDiemManh] = useState('');
    const [diemYeu, setDiemYeu] = useState('');
    const [keHoach, setKeHoach] = useState('<figure class="table"></figure>');
    const [mucDanhGia, setMucDanhGia] = useState('');

    const [booleanMention, setBooleanMention] = useState(false);
    const [idPhieuDanhGia, setIdPhieuDanhGia] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const response_3 = await getPhongBanById(idPhongBan);
            setNhomCongTac(response_3);

            const allMinhChungData = await getAllMinhChung();
            const allKhoMinhChungData = await getAllKhoMinhChung();
            const updatedMinhChung = allMinhChungData.filter(i => i.idTieuChuan == TieuChuan_ID)
                .map(item => {
                    const maMinhChung = `${item.parentMaMc || 'H1'}${item.childMaMc || ''}`;
                    const khoMinhChung = allKhoMinhChungData.find((kmc) => kmc.idKhoMinhChung === item.idKhoMinhChung);
                    if (item.allMinhChungData !== 0) {
                        const matchingItem = allMinhChungData.find(mc => mc.idMc === item.maDungChung);
                        if (matchingItem) {
                            return {
                                ...item,
                                khoMinhChung: khoMinhChung,
                                parentMaMc: matchingItem.parentMaMc,
                                childMaMc: matchingItem.childMaMc,
                                maMinhChung: `${matchingItem.parentMaMc || 'H1'}${matchingItem.childMaMc || ''}`
                            };
                        }
                    }
                    return {
                        ...item,
                        khoMinhChung: khoMinhChung,
                        maMinhChung
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

            setBooleanMention(true)
            setShow(false)
        };
        fetchData();

    }, [TieuChuan_ID, TieuChi_ID, idPhongBan]);
    const fetchMinhChung = async (TieuChuan_ID) => {
        const response = await getTieuChuanById(TieuChuan_ID);
        setTieuChuan(response);

        const tieuChiData = await getAllTieuChi();
        const filterTieuChi = tieuChiData.filter(item => item.idTieuChuan == TieuChuan_ID).sort((a, b) => a.stt - b.stt);
        const phieuDanhGiaTieuChi = await getAllPhieuDanhGia();
        const phieuDanhGiaTieuChuan = await getAllPhieuDanhGiaTieuChuan();
        const filterPhieuDanhGia = phieuDanhGiaTieuChuan.filter((item) => item.idTieuChuan == TieuChuan_ID);
        if (filterPhieuDanhGia.length == 0) {
            let newMoTa = '';
            let newDiemManh = '';
            let newDiemYeu = '';
            let newKeHoach = '';
            let newMucDanhGia = '';
            let totalScore = 0;
            let totalTieuChi = 0;
            filterTieuChi.forEach((tc) => {
                const filterPhieuDanhGia = phieuDanhGiaTieuChi.filter((item) => item.idTieuChuan == TieuChuan_ID && item.idTieuChi == tc.idTieuChi);
                if (filterPhieuDanhGia && filterPhieuDanhGia.length > 0) {
                    const moTaContent = filterPhieuDanhGia.map(phieu => phieu.moTa).join(' ');
                    const mucDanhGiaContent = filterPhieuDanhGia.map(phieu => phieu.mucDanhGia).join(', ');
                    newMoTa += `
                      <h2 style="font-size: 16px"><b><i>Tiêu chí ${response.stt}.${tc.stt}. ${tc.tenTieuChi}</i></b></h2>
                      ${moTaContent}
                      <p><b>Tự đánh giá: ${mucDanhGiaContent}/7</b></p>`;
                    newDiemManh += filterPhieuDanhGia
                        .map(item => item.diemManh)
                        .filter(diemManh => diemManh !== '' && diemManh !== null)
                        .map(diemManh => {
                            if (diemManh.includes('<ul>') || diemManh.includes('<li>')) {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(diemManh, 'text/html');
                                const liElements = doc.querySelectorAll('ul li');

                                const liTexts = Array.from(liElements).map(li => li.innerText.trim());

                                return liTexts.map(item => `<li>${item}</li>`).join('');
                            } else {
                                const newString = diemManh.trim().slice(3, -4);
                                return `<li>${newString}</li>`;
                            }
                        })
                        .join(', ');
                    newDiemYeu += filterPhieuDanhGia
                        .map(item => item.diemTonTai)
                        .filter(diemTonTai => diemTonTai !== '' && diemTonTai !== null)
                        .map(diemTonTai => {
                            if (diemTonTai.includes('<ul>') || diemTonTai.includes('<li>')) {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(diemTonTai, 'text/html');
                                const liElements = doc.querySelectorAll('ul li');

                                const liTexts = Array.from(liElements).map(li => li.innerText.trim());

                                return liTexts.map(item => `<li>${item}</li>`).join('');
                            } else {
                                const newString = diemTonTai.trim().slice(3, -4);
                                return `<li>${newString}</li>`;
                            }
                        })
                        .join(', ');

                    newKeHoach += filterPhieuDanhGia
                        .map(item => item.keHoach)
                        .filter(keHoach => keHoach !== '' && keHoach !== null)
                        .map(keHoach => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(keHoach, 'text/html');
                            const tbody = doc.querySelector('tbody');
                            if (tbody) {
                                const tbodyContent = tbody.outerHTML;
                                return tbodyContent + ' ';
                            } else {

                            }
                        });
                    newMucDanhGia += filterPhieuDanhGia
                        .map((item) => {
                            totalScore += item.mucDanhGia;
                            totalTieuChi = tc.stt;
                            return `<tr><td>Tiêu chí ${response.stt}.${tc.stt}</td><td>${item.mucDanhGia}</td></tr>`;
                        })
                        .join('');
                }
            });
            setMoTa(newMoTa);
            setDiemManh(newDiemManh);
            setDiemYeu(`<ul>${newDiemYeu}</ul>`);
            setKeHoach(`<figure class="table"><table><thead><tr><th>TT</th><th>Mục tiêu</th><th>Nội dung</th><th>Đơn vị/ cá nhân thực hiện</th><th>Thời gian thực hiện</th><th>Ghi chú</th></tr></thead>${newKeHoach}</table></figure>`);
            setMucDanhGia(`<figure class="table"><table id="mucdanhgia"><thead><tr><th class="text-center">Tiêu chuẩn/Tiêu chí</th><th class="text-center">Tự đánh giá</th></tr><tr><th class="text-center"><i>Tiêu chuẩn ${response.stt}</i></th><th class="text-center">${totalScore / totalTieuChi}</th></tr></thead><tbody class="text-center">${newMucDanhGia}</tbody></table></figure>`);
        }else{
            setIdPhieuDanhGia(filterPhieuDanhGia[0].idPhieuDanhGiaTieuChuan);
            setMoTa(filterPhieuDanhGia[0].moTa);
            setMucDanhGia(filterPhieuDanhGia[0].mucDanhGia);
            setDiemManh(filterPhieuDanhGia[0].diemManh);
            setDiemYeu(filterPhieuDanhGia[0].diemTonTai);
            setKeHoach(filterPhieuDanhGia[0].keHoach);
        }
    };
    useEffect(()=>{
        fetchMinhChung(TieuChuan_ID);
    },[TieuChuan_ID])


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
            items: ['undo', 'redo', '|', 'sourceEditing', 'showBlocks', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'link', 'insertImage', 'insertTable', 'blockQuote', 'htmlEmbed', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'],
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
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage',
                '|',
                'ckboxImageEdit'
            ]
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

    const handleEditorChange = (event, editor) => {
        if (editor && editor.getData) {
            try {
                const data = editor.getData();
                setMoTa(data);
            } catch (error) {
                console.error('Error handling editor change:', error);
            }
        } else {
            console.error('Editor or editor.getData is not available.');
        }
    };


    const handleSetDiemManh = (event, editor) => {
        const data = editor.getData();
        setDiemManh(data)
    }
    const handleSetDiemYeu = (event, editor) => {
        const data = editor.getData();
        setDiemYeu(data)
    }
    const handleSetKeHoach = (event, editor) => {
        const data = editor.getData();
        setKeHoach(data)
    }
    const handleChangeMucDanhGia = (event, editor) => {
        const data = editor.getData();
        setMucDanhGia(data)
    }

    const savePhieuDanhGia = async () => {
        try {
            const data = new FormData();
            data.append('idPhongBan', idPhongBan);
            data.append('idTieuChuan', TieuChuan_ID);

            data.append('moTa', moTa);
            data.append('diemManh', diemManh);
            data.append('diemTonTai', diemYeu);
            data.append("keHoach", keHoach);
            data.append("mucDanhGia", mucDanhGia);
            if (idPhieuDanhGia == 0) {
                const response = await savePhieuDanhGiaTieuChuan(data);
                if (response === "OK") {
                    fetchMinhChung(TieuChuan_ID);
                    alert('Lưu thành công')
                }
            } else {
                data.append('idPhieuDanhGia', idPhieuDanhGia)
                const response = await updatePhieuDanhGiaTieuChuan(data);
                if (response === "OK") {
                    alert('Lưu thành công')
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    const viewPhieuDanhGia = () => {
        window.open(`danh-gia-tieu-chuan?TieuChuan_ID=${TieuChuan_ID}`, '_blank');
    };

    return (
        <div onMouseMove={handleMouseMove}>
            <LoadingProcess open={show}/>
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
            {booleanMention == true ? (<div className="content bg-white m-3 p-4">

                <p className="text-center"><b>PHIẾU ĐÁNH GIÁ TIÊU CHUẨN</b></p>
                <p>Nhóm công tác : {nhomCongTac ? (<span>{nhomCongTac.tenPhongBan}</span>) : (
                    <span>Loading...</span>)}</p>
                <p>Tiêu chuẩn {tieuChuan.stt} : {tieuChuan.tenTieuChuan}</p>

                <p>1. Mô tả</p>
                <div className="main-container">
                    <div
                        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar"
                        ref={editorContainerRef}
                    >
                        <div className="editor-container__editor">
                            <div ref={editorRef} spellCheck={false}>
                                {isLayoutReady && (
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={editorConfig}
                                        onReady={handleEditorReady}
                                        onChange={handleEditorChange}
                                        data={moTa}
                                    />)}
                            </div>
                        </div>
                    </div>

                </div>


                <p>2. Điểm mạnh</p>
                <div className="main-container">
                    <div
                        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar"
                        ref={editorContainerRef}
                    >
                        <div className="editor-container__editor">
                            <div ref={editorRef} spellCheck={false}>
                                {isLayoutReady && (<CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleSetDiemManh}
                                    data={diemManh}
                                />)}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-2">3. Điểm tồn tại</p>
                <div className="main-container">
                    <div
                        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar"
                        ref={editorContainerRef}
                    >
                        <div className="editor-container__editor">
                            <div ref={editorRef} spellCheck={false}>
                                {isLayoutReady && (<CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleSetDiemYeu}
                                    data={diemYeu}
                                />)}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-2">4. Kế hoạch hành động</p>
                <div className="main-container">
                    <div
                        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar"
                        ref={editorContainerRef}
                    >
                        <div className="editor-container__editor">
                            <div ref={editorRef} spellCheck={false}>
                                {isLayoutReady && (<CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleSetKeHoach}
                                    data={keHoach}
                                />)}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-2">5. Mức đánh giá</p>
                <div className="main-container">
                    <div
                        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar"
                        ref={editorContainerRef}
                    >
                        <div className="editor-container__editor">
                            <div ref={editorRef} spellCheck={false}>
                                {isLayoutReady && (<CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleChangeMucDanhGia}
                                    data={mucDanhGia}
                                />)}
                            </div>
                        </div>
                    </div>
                </div>


                <br/>
                <div className="row">
                    <div className="col-1">
                        <button className="btn btn-success" onClick={savePhieuDanhGia}>
                            Lưu
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="btn btn-success" onClick={viewPhieuDanhGia}>
                            Xem phiếu đánh giá
                        </button>
                    </div>
                </div>
            </div>) : (null)}
        </div>);

}
export default VietBaoCaoTieuChuan;