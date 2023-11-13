import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import "./style.css";
interface Props{
    onBlur?:(a:string)=>void;
    content?:string,
    placeholder?:string
}
const Tiptap = ({onBlur, content, placeholder=''}:Props) => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder
            })
        ],
        editorProps:{
            attributes:{
                class:"p-2 border-solid border rounded border-primary-light min-h-fit"
            }
        },
        content,
        onBlur:({editor})=>{
            onBlur && onBlur(editor.getHTML());
        }
    },[content])

    return (
        <EditorContent editor={editor} content={content || ''}/>

    )
}

export default Tiptap