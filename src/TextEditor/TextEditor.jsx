import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';

/**
 * Rich text editor component using Quill.js with image upload and resizing.
 * Uses forwardRef to expose imperative methods `hasContent` and `getPlainText`.
 * 
 * Features:
 * - Supports headers, formatting, lists, colors, and images.
 * - Resizes images client-side before insertion (max 500x400 px).
 * - Exposes methods for content checking and plain text extraction via ref.
 * 
 * @component
 * @author Trudy
 */

/**
 * Handles image selection and insertion into the Quill editor.
 * Resizes images client-side to max 500x400 px before insertion.
 * Private helper function.
 * 
 * @param {Quill} quillInstance - The Quill editor instance.
 * @private
 */
const imageHandler = (quillInstance) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  /**
   * Handles the file input element change event.
   * If a file is selected and is an image, it is resized to fit
   * within a maximum size of 500x400 pixels and is inserted at
   * the current cursor position in the Quill editor.
   * If the image is larger than the maximum size, it is resized to
   * fit within the maximum size while maintaining its aspect ratio.
   * If the image is smaller than the maximum size, it is inserted at
   * its original size.
   * 
   * @listens input#file:onchange
   * @param {Event} event - The file input element change event.
   */
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        alert('Bildet er for stort. Maksimal størrelse er 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 500;
          const maxHeight = 400;

          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
          const range = quillInstance.getSelection();
          quillInstance.insertEmbed(range.index, 'image', resizedImageUrl);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  };
};

/**
 * Quill editor toolbar configuration.
 * Includes headers, formatting, color, ordered lists, and image insertion.
 */
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }],
      [{ list: 'ordered' }],
      ['image'],
    ],
    handlers: {
      /**
       * Handles image insertion into the editor toolbar.
       * Triggers the custom image handler for resizing and inserting images.
       * 
       * @this Quill
       */
      image: function () {
        imageHandler(this.quill);
      }
    }
  },
};

/**
 * Defines the allowed formats in the Quill editor.
 */
const formats = ['header', 'bold', 'italic', 'underline', 'color', 'list', 'image'];

/**
 * TextEditor component wraps Quill.js rich text editor with custom image handling.
 * Exposes imperative methods `hasContent` and `getPlainText` via ref.
 * 
 * @param {Object} props
 * @param {string} props.value - The HTML content of the editor.
 * @param {function} props.onChange - Callback fired on content change.
 * @param {React.Ref} ref - Forwarded ref exposing imperative methods.
 */
const TextEditor = forwardRef(({ value, onChange }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    /**
     * Returns true if the editor contains content beyond a single newline.
     * 
     * @returns {boolean}
     */
    hasContent: () => {
      if (!quillRef.current) return false;
      return quillRef.current.getLength() > 1;
    },
    /**
     * Returns the plain text content of the editor, stripped of formatting and trimmed.
     * 
     * @returns {string}
     */
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
    }
  }, [onChange]);

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
});

export default TextEditor;
