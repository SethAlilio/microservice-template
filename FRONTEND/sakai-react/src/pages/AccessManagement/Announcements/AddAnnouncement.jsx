import React, {useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import {Button} from "primereact/button";
import Quill from 'quill';
import MagicUrl from "quill-magic-url";
import AnnouncementService from "../../../../service/Inventory/AccessManagement/AnnouncementService";
import {Toast} from "primereact/toast";

const AddAnnouncement = () => {
    const theme = 'snow';
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline','blockquote'],
            [{ 'font': [] }],
            [{ align: [] }],
            [{ list: 'ordered'}, { list: 'bullet' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['image'],
        ],
        clipboard: {
            matchVisual: false,
        },
        magicUrl:{
            normalizeUrlOptions: {
                stripHash: true,
                stripWWW: false,
                normalizeProtocol: false
            },
            globalRegularExpression: '/(https?:\\/\\/|www\.|tel:)[\S]+/g',
            urlRegularExpression: '/(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g'
        }
    };
    const formats = ['bold', 'italic', 'underline', 'strike','blockquote'];
    const { quill, quillRef} = useQuill({ theme, modules, formats});
    const [text, setText] = useState(null);
    const toast = useRef(null);
    const subjectRef = useRef("");
    // Insert Image to quill
    const insertToEditor = (url) => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
    };

    // Upload Image to Server
    const saveToServer = async (file) => {
        const body = new FormData();
        body.append('file', file);

        const res = await fetch('/saveImage', { method: 'POST', body });
        insertToEditor(res.uploadedImageUrl);
    };
    //Dialog Image File
    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            saveToServer(file);
        };
    };
    useEffect(() => {
        if (Quill && !quill){
            Quill.register('modules/magicUrl',MagicUrl,true);
        }
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
                setText(quill.root.innerHTML);
            });
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
        }
    }, [quill]);

    const postAnnouncement = () => {
        if (!subjectRef.current.value){
            toast.current.show({severity: 'error', summary: 'Error posting announcements',detail: 'Subject/Title is required'});
            return;
        }
        if (!text){
            toast.current.show({severity: 'error', summary: 'Error posting announcements',detail: 'Body is required'});
            return;
        }
        const form = new FormData();
        form.append("subject",subjectRef.current.value);
        form.append("content",text);

        AnnouncementService.saveAnnouncement(form).then((res)=> {
            quill.deleteText(0,quill.getLength())
            toast.current.show({severity: 'success', summary: 'Announcement posted'});
        }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error posting Announcements', detail: 'Please try again'});
        });
    }

    return (
        <>
        <div>
            <Toast ref={toast}/>
            <div className="card">
                <h3 className="flex flex-column md:align-items-center">Fill in the subject/title and body of the announcement</h3>
                <br/>
                <span className="p-input-icon-left p-float-label">
                    <i className="fa fa-bullhorn" />
                    <InputText id="subject" style={{width:300}} name="subject" ref={subjectRef} autoComplete="off"/>
                    <label htmlFor="subject">Subject/Title</label>
                </span>
                <br/><br/>
                <div style={{height: 350}} ref={quillRef} />
                <br/>
                <div className="flex flex-column md:align-items-center">
                    <Button onClick={postAnnouncement} style={{marginLeft:"10px"}} label="Post" icon="fa fa-bullhorn"
                            className="p-button-primary"/>
                </div>
            </div>
        </div>
        </>
    );
}
export default AddAnnouncement;
