import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import "./style.css";
import {forwardRef, useImperativeHandle} from "react";
interface Props{
    onBlur?:(a:string)=>void;
    content?:string,
    placeholder?:string,
    className?: string
}

const Tiptap = forwardRef(({onBlur, content, placeholder='', className =""}:Props, ref)=>{
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder
            })
        ],
        editorProps:{
            attributes:{
                class:`p-2 border-solid border rounded border-primary-light min-h-fit ${className}`
            }
        },
        content,
        onBlur:({editor})=>{
            onBlur && onBlur(editor.getHTML());
        }
    },[content])

    useImperativeHandle(ref, ()=>{
        return {
            getHTML:()=>{
                return editor?.getHTML()
            }
        }
    });

    return (
        <EditorContent editor={editor} content={content || ''} />

    )
});
Tiptap.displayName ="TipTap"

export default Tiptap