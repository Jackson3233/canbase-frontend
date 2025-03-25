'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="block w-full rounded-md ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 hover:border-stone-800 hover:ring-2 hover:ring-stone-800 focus:ring-2 focus:ring-inset focus:ring-stone-600">
      <div className="flex flex-col p-3">
        <div className="flex items-center gap-1 rounded-t-lg pb-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white ${
              editor.isActive('bold') ? 'bg-black text-white' : ''
            }`}
            title="Bold"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={`size-4 ${editor.isActive('bold') ? 'fill-white' : 'fill-stone-700 group-hover:fill-white'}`}>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white ${
              editor.isActive('italic') ? 'bg-black text-white' : ''
            }`}
            title="Italic"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={`size-4 ${editor.isActive('italic') ? 'fill-white' : 'fill-stone-700 group-hover:fill-white'}`}>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white ${
              editor.isActive('underline') ? 'bg-black text-white' : ''
            }`}
            title="Underline"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={`size-4 ${editor.isActive('underline') ? 'fill-white' : 'fill-stone-700 group-hover:fill-white'}`}>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white ${
              editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''
            }`}
            title="H2"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={`size-4 ${editor.isActive('heading', { level: 2 }) ? 'fill-white' : 'fill-stone-700 group-hover:fill-white'}`}>
              <path fill="none" d="M0 0H24V24H0z"></path>
              <path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white ${
              editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : ''
            }`}
            title="H3"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={`size-4 ${editor.isActive('heading', { level: 3 }) ? 'fill-white' : 'fill-stone-700 group-hover:fill-white'}`}>
              <path fill="none" d="M0 0H24V24H0z"></path>
              <path d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="group rounded p-2 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 hover:bg-black hover:text-white"
            title="Clear"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="size-4 fill-stone-700 group-hover:fill-white">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12.651 14.065L11.605 20H9.574l1.35-7.661-7.41-7.41L4.93 3.515 20.485 19.07l-1.414 1.414-6.42-6.42zm-.878-6.535l.27-1.53h-1.8l-2-2H20v2h-5.927L13.5 9.257 11.773 7.53z"></path>
            </svg>
          </button>
        </div>
        <div className="z-0 mx-auto h-px w-full bg-stone-200 px-1"></div>
      </div>
      <div 
        className="block w-full cursor-text appearance-none overflow-hidden rounded-lg px-3 py-2 text-base ring-transparent placeholder:text-stone-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-90 disabled:grayscale-[0.2]"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent 
          editor={editor} 
          className="tiptap ProseMirror prose prose-stone [&_*]:outline-none"
          style={{ minHeight: '300px' }}
        />
      </div>
    </div>
  );
}
