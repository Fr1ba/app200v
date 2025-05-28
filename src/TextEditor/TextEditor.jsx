import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';


/**
 * Handles the onchange event for the image input field.
 * - Checks file size and alerts if it's too large.
 * - Reads the file and resizes it to fit within maxWidth and maxHeight.
 * - Inserts the resized image into the Quill editor at the current selection.
 * @param {Event} e The onchange event.
 * @listens input#image onchange
 * @author Trudy
 */
const imageHandler = (quillInstance) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  /**
   * Handles the onchange event for the image input field.
   * - Checks file size and alerts if it's too large.
   * - Reads the file and resizes it to fit within maxWidth and maxHeight.
   * - Inserts the resized image into the Quill editor at the current selection.
   * @param {Event} e The onchange event.
   * @listens input#image onchange
   */
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Bildet er for stort. Maksimal størrelse er 5MB.');
        return;
      }

      const reader = new FileReader();

      /**
       * Handles the onload event for the FileReader to process the image.
       * - Creates an Image object and sets its source to the file data URL.
       * - Once the image is loaded, resizes it to fit within specified max dimensions.
       * - Draws the resized image onto a canvas.
       * - Converts the canvas content to a JPEG data URL.
       * - Inserts the resized image into the Quill editor at the current selection.
       * @param {Event} e The load event triggered when the file is read.
       */
      reader.onload = (e) => {
        const img = new Image();
        /**
         * Handles the onload event for the image.
         * - Creates a canvas and draws the image onto it.
         * - Resizes the image to fit within specified max dimensions.
         * - Converts the canvas content to a JPEG data URL.
         * - Inserts the resized image into the Quill editor at the current selection.
         */
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

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] },],
      [{ list: 'ordered' }],
      ['image'],
    ],
    handlers: {
      /**
       * Inserts an image into the Quill editor at the current selection.
       * - Requests the user to select an image file from their local machine.
       * - Resizes the image to fit within specified max dimensions.
       * - Converts the resized image to a JPEG data URL.
       * - Inserts the resized image into the Quill editor at the current selection.
       * @function
       * @instance
       * @memberof Quill
       * @param {Quill} quill The Quill editor instance.
       */
      image: function() {
        imageHandler(this.quill);
      }
    }
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'color', 'list', 'image'
];

const TextEditor = forwardRef(({ value, onChange }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    /**
     * Checks if the text area has content.
     * - Returns false if the text area has not been initialized yet.
     * - Returns true if the text area has content, false otherwise.
     * @returns {boolean} Whether the text area has content.
     */
    hasContent: () => {
      if (!quillRef.current) return false;
      const length = quillRef.current.getLength();
      return length > 1;
    },
    /**
     * Returns the plain text content of the text area, with whitespace removed.
     * - Returns an empty string if the text area has not been initialized yet.
     * - Returns the plain text content with leading and trailing whitespace removed.
     * @returns {string} The plain text content of the text area.
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

      quillRef.current.on('selection-change', (range) => {
        if (range) {
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
