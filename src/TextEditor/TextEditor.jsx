import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'link',
  'image',
];

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Quill only once
      if (!quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: modules,
          formats: formats,
        });
        
        // Handle content changes
        quillRef.current.on('text-change', () => {
          if (onChange) {
            const editorContent = quillRef.current.root.innerHTML;
            onChange(editorContent);
          }
        });
      }
      
      // Set initial content if provided and different from current
      if (value !== undefined && quillRef.current) {
        const currentContent = quillRef.current.root.innerHTML;
        if (value !== currentContent) {
          quillRef.current.root.innerHTML = value;
        }
      }
    }
    
    return () => {
      // Clean up
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
    };
  }, [value, onChange]);

  return <div ref={editorRef} style={{ height: "400px" }}></div>;
};

export default TextEditor;