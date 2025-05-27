import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{list: 'ordered'}],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'list'
];

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules,
        formats,
      });

      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange?.(html);
      });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      <div ref={editorRef} />
    </div>
  );
};

export default TextEditor;