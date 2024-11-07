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
    updatePhieuDanhGiaTieuChi
} from "../../../../services/apiServices";
import LoadingProcess from "../../../../components/LoadingProcess/LoadingProcess";

function MentionCustomization(editor) {
    // Downcast the model 'mention' text attribute to a view <a> element.
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

const VietBaoCaoTieuChi = ({dataTransfer}) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleMouseMove = (event) => {
        setMousePosition({
            y: `${event.clientY + 50}`,
            x: `${event.clientX}`,
        });
    };

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

    const [moTa, setMoTa] = useState('');
    const [diemManh, setDiemManh] = useState('');
    const [diemYeu, setDiemYeu] = useState('');

    const [booleanMention, setBooleanMention] = useState(false);
    let mentionConfig;
    const [formData, setFormData] = useState({
        noiDungKhacPhuc: '',
        donViKhacPhuc: '',
        thoiGianKhacPhuc: '',
        ghiChuKhacPhuc: '',
        noiDungPhatHuy: '',
        donViPhatHuy: '',
        thoiGianPhatHuy: '',
        ghiChuPhatHuy: '',
        mucDanhGia: 0
    });


    const options = [1, 2, 3, 4, 5, 6, 7];

    useEffect(() => {
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
                const filterPhieuDanhGia = response_4.filter((item) => item.idTieuChuan == TieuChuan_ID && item.idTieuChi == TieuChi_ID);
                if (filterPhieuDanhGia && filterPhieuDanhGia.length > 0) {
                    const firstItem = filterPhieuDanhGia[0];

                    setPhieuDanhGia(filterPhieuDanhGia);
                    setMoTa(firstItem.moTa);
                    setDiemManh(firstItem.diemManh);
                    setDiemYeu(firstItem.diemTonTai);

                    setFormData({
                        noiDungKhacPhuc: firstItem.noiDungKhacPhuc,
                        donViKhacPhuc: firstItem.donViKhacPhuc,
                        thoiGianKhacPhuc: firstItem.thoiGianKhacPhuc,
                        ghiChuKhacPhuc: firstItem.ghiChuKhacPhuc,
                        noiDungPhatHuy: firstItem.noiDungPhatHuy,
                        donViPhatHuy: firstItem.donViPhatHuy,
                        thoiGianPhatHuy: firstItem.thoiGianPhatHuy,
                        ghiChuPhatHuy: firstItem.ghiChuPhatHuy,
                        mucDanhGia: firstItem.mucDanhGia
                    });


                } else {
                    setPhieuDanhGia([]);
                    setMoTa('');
                }
            }


            setBooleanMention(true)
            setShow(false)
        };
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
        mention: {
            feeds: [{
                marker: '[',
                feed: (query) => {
                    return minhChung
                        .filter((item) => item.maMinhChung.toLowerCase().includes(query.toLowerCase()))
                        .map((item) => ({
                            id: '[' + item.maMinhChung + ']',
                            name: item.tenMinhChung,
                            link: item.link,
                            text: '[' + item.maMinhChung + ']'
                        }));
                },
                itemRenderer: (item) => `${item.name}`
            }]
        },
        toolbar: {
            items: ['undo', 'redo', '|', 'sourceEditing', 'showBlocks', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'link', 'insertImageViaUrl', 'insertTable', 'blockQuote', 'htmlEmbed', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'],
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
    const handleSet = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData, [name]: value
        });
    };

    const savePhieuDanhGia = async () => {
        try {
            const data = new FormData();
            data.append('idPhongBan', idPhongBan);
            data.append('idTieuChuan', TieuChuan_ID);
            data.append('idTieuChi', TieuChi_ID);

            data.append('moTa', moTa);
            data.append('diemManh', diemManh);
            data.append('diemTonTai', diemYeu);
            data.append('noiDungKhacPhuc', formData.noiDungKhacPhuc);
            data.append('donViKhacPhuc', formData.donViKhacPhuc);
            data.append('thoiGianKhacPhuc', formData.thoiGianKhacPhuc);
            data.append('ghiChuKhacPhuc', formData.ghiChuKhacPhuc);
            data.append('noiDungPhatHuy', formData.noiDungPhatHuy);
            data.append('donViPhatHuy', formData.donViPhatHuy);
            data.append('thoiGianPhatHuy', formData.thoiGianPhatHuy);
            data.append('ghiChuPhatHuy', formData.ghiChuPhatHuy);
            data.append('mucDanhGia', formData.mucDanhGia);
            if (phieuDanhGia?.length == 0) {
                const response = await savePhieuDanhGiaTieuChi(data);
                if (response === "OK") {
                    alert('Lưu thành công')
                }
            } else {
                data.append('idPhieuDanhGia', phieuDanhGia[0].idPhieuDanhGiaTieuChi)
                const response = await updatePhieuDanhGiaTieuChi(data);
                if (response === "OK") {
                    alert('Lưu thành công')
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

                `}
            </style>
            {booleanMention == true ? (<div className="content bg-white m-3 p-4">
                <p className="text-center"><b>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b></p>
                <p>Nhóm công tác : {nhomCongTac ? (<span>{nhomCongTac.tenPhongBan}</span>) : (
                    <span>Loading...</span>)}</p>
                <p>Tiêu chuẩn : {tieuChuan.tenTieuChuan}</p>
                <p>Tiêu chí : {tieuChi.tenTieuChi}</p>

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
                <table className="easy-table">
                    <thead>
                    <tr>
                        <td>TT</td>
                        <td>Mục tiêu</td>
                        <td>Nội dung</td>
                        <td>Đơn vị/ cá nhân thực hiện</td>
                        <td>Thời gian thực hiện hoặc hoàn thành</td>
                        <td>Ghi chú</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Khắc phục tồn tại</td>
                        <td>
                                <textarea
                                    name="noiDungKhacPhuc"
                                    value={formData.noiDungKhacPhuc}
                                    onChange={handleSet}
                                    placeholder="Nội dung khắc phục"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="donViKhacPhuc"
                                    value={formData.donViKhacPhuc}
                                    onChange={handleSet}
                                    placeholder="Đơn vị khắc phục"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="thoiGianKhacPhuc"
                                    value={formData.thoiGianKhacPhuc}
                                    onChange={handleSet}
                                    placeholder="Thời gian khắc phục"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="ghiChuKhacPhuc"
                                    value={formData.ghiChuKhacPhuc}
                                    onChange={handleSet}
                                    placeholder="Ghi chú khắc phục"
                                />
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Phát huy điểm mạnh</td>
                        <td>
                                <textarea
                                    name="noiDungPhatHuy"
                                    value={formData.noiDungPhatHuy}
                                    onChange={handleSet}
                                    placeholder="Nội dung phát huy"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="donViPhatHuy"
                                    value={formData.donViPhatHuy}
                                    onChange={handleSet}
                                    placeholder="Đơn vị phát huy"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="thoiGianPhatHuy"
                                    value={formData.thoiGianPhatHuy}
                                    onChange={handleSet}
                                    placeholder="Thời gian phát huy"
                                />
                        </td>
                        <td>
                                <textarea
                                    name="ghiChuPhatHuy"
                                    value={formData.ghiChuPhatHuy}
                                    onChange={handleSet}
                                    placeholder="Ghi chú phát huy"
                                />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <p className="mt-2">5. Mức đánh giá</p>

                {options.map((option) => (<div key={option}>
                    <input
                        className="me-1"
                        type="radio"
                        name="mucDanhGia"
                        value={option}
                        id={option.toString()}
                        onChange={handleSet}
                        checked={formData.mucDanhGia == option}
                    />
                    <label htmlFor={option.toString()}>{option}</label>
                </div>))}

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
export default VietBaoCaoTieuChi;