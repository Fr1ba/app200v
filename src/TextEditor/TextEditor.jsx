import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';

// Custom image handler to resize images
const imageHandler = (quillInstance) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      // Check file size (e.g., max 2MB)
      const maxSize = 5 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        alert('Bildet er for stort. Maksimal størrelse er 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize image if too large
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions for messaging
          const maxWidth = 500;
          const maxHeight = 400;
          
          let { width, height } = img;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Insert into Quill
          const range = quillInstance.getSelection();
          quillInstance.insertEmbed(range.index, 'image', resizedImageUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
};

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }],
      ['image'],
    ],
    handlers: {
      image: function() {
        imageHandler(this.quill);
      }
    }
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'list', 'image'
];

const TextEditor = forwardRef(({ value, onChange }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    hasContent: () => {
      if (!quillRef.current) return false;
      const length = quillRef.current.getLength();
      return length > 1;
    },
    getPlainText: () => {
      if (!quillRef.current) return '';
      return quillRef.current.getText().trim();
    }
  }));

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

      // Add event listener to handle pasted images
      quillRef.current.on('selection-change', (range) => {
        if (range) {
          // Handle image resizing after insertion
          const images = quillRef.current.root.querySelectorAll('img');
          images.forEach(img => {
            if (!img.style.maxWidth) {
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.maxHeight = '300px';
            }
          });
        }
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      
      // Apply size constraints to any existing images
      const images = quillRef.current.root.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '300px';
      });
    }
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      <div ref={editorRef} />
    </div>
  );
});

export default TextEditor;