import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Remove quill.core.css - only need snow.css
import styles from './TextEditor.module.css';

// Import and register the List module
const List = Quill.import('formats/list');
Quill.register(List, true);

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],


const formats = [

  'header', 'bold', 'italic', 'underline', 
];

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      try {
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules,
          formats,
        });
        
        quillRef.current.on('text-change', () => {
          try {
            const html = quillRef.current.root.innerHTML;

            onChange?.(html);
          } catch (error) {
            console.error('Error handling text change:', error);
          }
        });
      } catch (error) {
        console.error('Failed to initialize Quill editor:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      try {
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
      } catch (error) {
        console.error('Error setting editor value:', error);
      }
    }
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      <div ref={editorRef} />
    </div>
  );
};

export default TextEditor;