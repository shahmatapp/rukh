import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props{
    onBlur?:(a:string)=>void;
    content?:string
}
const Tiptap = ({onBlur, content}:Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps:{
            attributes:{
                class:"p-2 border-solid border rounded border-primary-light min-h-fit"
            }
        },
        content: content || '',
        onBlur:({editor})=>{
            onBlur && onBlur(editor.getHTML());
        }
    },[content])

    return (
        <EditorContent editor={editor} content={content || ''}/>

    )
}

export default Tiptap