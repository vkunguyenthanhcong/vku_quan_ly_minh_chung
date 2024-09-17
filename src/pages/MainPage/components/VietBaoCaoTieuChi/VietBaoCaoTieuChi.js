import React, { useEffect, useState, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useLocation } from "react-router-dom";
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
    Undo
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './VietBaoCao.css'
import { getPhongBanById, getTieuChiById, getTieuChuanById, savePhieuDanhGiaTieuChi } from "../../../../services/apiServices";
const VietBaoCaoTieuChi = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const TieuChi_ID = queryParams.get('TieuChi_ID');
    const idPhongBan = queryParams.get('NhomCongTac');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [editorInstance, setEditorInstance] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([])
    const [tieuChi, setTieuChi] = useState([])
    const [nhomCongTac, setNhomCongTac] = useState(null)

    const [moTa, setMoTa] = useState('');
    const [diemManh, setDiemManh] = useState('');
    const [diemYeu, setDiemYeu] = useState('');

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
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'sourceEditing',
                'showBlocks',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                '|',
                'link',
                'insertImageViaUrl',
                'insertTable',
                'blockQuote',
                'htmlEmbed',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
                'outdent',
                'indent'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
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
            Undo
        ],
        balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
        blockToolbar: ['bold', 'italic', '|', 'link', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
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
                'resizeImage'
            ]
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        menuBar: {
            isVisible: true
        },
        placeholder: 'Type or paste your content here!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };
    const handleEditorChange = (event, editor) => {

        if (editor && editor.getData) {
            try {
                // Get the editor's data as HTML
                const data = editor.getData();
                setMoTa(data)
                // Parse the HTML to extract plain text
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const inputText = doc.body.textContent || '';
                // Find the position of the last `[`
                const bracketIndex = inputText.lastIndexOf('[');
                if (bracketIndex !== -1) {
                    // Extract the part after `[`
                    const queryText = inputText.substring(bracketIndex + 1).trim();
                    // If there's no additional text after `[`, don't filter suggestions
                    if (queryText.length === 0) {
                        setFilteredSuggestions([]);
                        return;
                    }
                    // Sample suggestions
                    const suggestions = [
                        { tenTieuChuan: 'abc', maTieuChuan: 'H1.01.01.01', link: 'https://www.youtube.com/watch?v=IsYi0lD11Do' },
                        { tenTieuChuan: 'def', maTieuChuan: 'H1.01.01.02', link: 'https://www.youtube.com/watch?v=IsYi0lD11Do' },
                        // Add more data here
                    ];
                    // Filter suggestions based on the query text
                    const filtered = suggestions.filter(suggestion =>
                        suggestion.maTieuChuan.startsWith(queryText)
                    );
                    setFilteredSuggestions(filtered);
                } else {
                    // If `[` is not present, clear suggestions
                    setFilteredSuggestions([]);
                }
            } catch (error) {
                console.error('Error handling editor change:', error);
            }
        } else {
            console.error('Editor or editor.getData is not available.');
        }
    };
    const handleSuggestionClick = (suggestion) => {
        if (editorInstance) {
            const editor = editorInstance;
            const textData = editor.getData();
            if (typeof textData === 'string') {
                const bracketIndex = textData.lastIndexOf('[');
                if (bracketIndex !== -1) {
                    const endBracketIndex = textData.indexOf(']', bracketIndex);
                    let newText;
                    if (endBracketIndex !== -1) {
                        // Replace existing bracketed text with hyperlink
                        newText = `${textData.substring(0, bracketIndex + 1)}<a href="${suggestion.link}" target="_blank">${suggestion.maTieuChuan}</a>${textData.substring(endBracketIndex + 1)}`;
                    } else {
                        // Append suggestion with hyperlink within brackets
                        newText = `${textData.substring(0, bracketIndex + 1)}<a href="${suggestion.link}" target="_blank">${suggestion.maTieuChuan}</a>]`;
                    }
                    editor.setData(newText);
                } else {
                    // If no bracket, insert as a new bracketed text with hyperlink
                    editor.model.change(writer => {
                        // Create a position at the end of the current selection
                        const position = editor.model.document.selection.getFirstPosition();

                        // Insert the hyperlink text
                        writer.insertText(`[<a href="${suggestion.link}" target="_blank">[${suggestion.maTieuChuan}</a>]`, position);
                    });
                }
                // Clear filtered suggestions
                setFilteredSuggestions([]);
            } else {
                console.error("Editor data is not a valid string.");
            }
        } else {
            console.error("Editor instance is not available.");
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
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
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

            const response = await savePhieuDanhGiaTieuChi(data);
            if(response === "OK"){
                alert(response)
            }

        } catch (error) {

        }
    }



    return (
        <div className="content bg-white m-3 p-4">
            <p className="text-center"><b>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b></p>
            <p>Nhóm công tác : {nhomCongTac ? (<span>{nhomCongTac.tenPhongBan}</span>) : (<span>'Loading...'</span>)}</p>
            <p>Tiêu chuẩn : {tieuChuan.tenTieuChuan}</p>
            <p>Tiêu chí : {tieuChi.tenTieuChi}</p>
            <p>1. Mô tả</p>
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor editor-container_include-block-toolbar" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>
                            {isLayoutReady && (
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onReady={handleEditorReady}
                                    onChange={handleEditorChange}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <ul>
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: 'pointer' }}
                        >
                            {suggestion.maTieuChuan}: {suggestion.tenTieuChuan}
                        </li>
                    ))}
                </ul>

            </div>
            <p>2. Điểm mạnh</p>
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor editor-container_include-block-toolbar" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>
                            {isLayoutReady && (
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleSetDiemManh}
                                />
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <p className="mt-2">3. Điểm tồn tại</p>
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor editor-container_include-block-toolbar" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>
                            {isLayoutReady && (
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    onChange={handleSetDiemYeu}
                                />
                            )}
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
                        <td> <textarea
                            name="noiDungKhacPhuc"
                            value={formData.noiDungKhacPhuc}
                            onChange={handleSet}
                            placeholder="Nội dung khắc phục"
                        /></td>
                        <td><textarea
                            name="donViKhacPhuc"
                            value={formData.donViKhacPhuc}
                            onChange={handleSet}
                            placeholder="Đơn vị khắc phục"
                        /></td>
                        <td><textarea
                            name="thoiGianKhacPhuc"
                            value={formData.thoiGianKhacPhuc}
                            onChange={handleSet}
                            placeholder="Thời gian khắc phục"
                        /></td>
                        <td><textarea
                            name="ghiChuKhacPhuc"
                            value={formData.ghiChuKhacPhuc}
                            onChange={handleSet}
                            placeholder="Ghi chú khắc phục"
                        /></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Phát huy điểm mạnh</td>
                        <td><textarea
                            name="noiDungPhatHuy"
                            value={formData.noiDungPhatHuy}
                            onChange={handleSet}
                            placeholder="Nội dung phát huy"
                        /></td>
                        <td><textarea
                            name="donViPhatHuy"
                            value={formData.donViPhatHuy}
                            onChange={handleSet}
                            placeholder="Đơn vị phát huy"
                        /></td>
                        <td><textarea
                            name="thoiGianPhatHuy"
                            value={formData.thoiGianPhatHuy}
                            onChange={handleSet}
                            placeholder="Thời gian phát huy"
                        /></td>
                        <td><textarea
                            name="ghiChuPhatHuy"
                            value={formData.ghiChuPhatHuy}
                            onChange={handleSet}
                            placeholder="Ghi chú phát huy"
                        /></td>
                    </tr>
                </tbody>
            </table>

            <p className="mt-2">5. Mức đánh giá</p>

            {options.map((option) => (
                <div key={option}>
                    <input
                        className="me-1"
                        type="radio"
                        name="mucDanhGia"
                        value={option}
                        id={option.toString()}
                        onChange={handleSet}
                    />
                    <label htmlFor={option.toString()}>{option}</label>
                </div>
            ))}
            <br />

            <button className="btn btn-success" onClick={() => savePhieuDanhGia()}>Lưu</button>



        </div>
    )
}
export default VietBaoCaoTieuChi;