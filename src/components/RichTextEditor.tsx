"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const toggleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="editor-toolbar" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '8px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <b>B</b>
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <i>I</i>
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <u>U</u>
      </button>
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </button>
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        • List
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        1. List
      </button>
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      <button type="button" onClick={toggleLink} className={editor.isActive("link") ? "is-active" : ""}>
        🔗 Link
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        ↩️
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        ↪️
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .editor-toolbar button {
          padding: 6px 10px;
          border-radius: 4px;
          background: white;
          border: 1px solid var(--border);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .editor-toolbar button:hover {
          background: var(--accent-light);
          color: var(--accent);
        }
        .editor-toolbar button.is-active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .editor-toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}} />
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content',
      },
    },
  });

  return (
    <div style={{ 
      border: '1px solid var(--border)', 
      borderRadius: '8px',
      background: 'white',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <MenuBar editor={editor} />
      <div style={{ padding: '20px', flex: 1 }}>
        <EditorContent editor={editor} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap-content {
          min-height: 350px;
          outline: none;
        }
        .tiptap-content p { margin-bottom: 1em; }
        .tiptap-content h1 { font-size: 2rem; margin: 1.5em 0 0.5em; }
        .tiptap-content h2 { font-size: 1.5rem; margin: 1.2em 0 0.5em; }
        .tiptap-content ul, .tiptap-content ol { padding-left: 1.5em; margin-bottom: 1em; }
        .tiptap-content a { color: var(--accent); text-decoration: underline; }
        .tiptap-content blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1em;
          margin-left: 0;
          color: var(--text-secondary);
          font-style: italic;
        }
      `}} />
    </div>
  );
}
