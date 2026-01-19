import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import app from "../lib/firebaseClient";
import "react-quill/dist/quill.snow.css";

// Dynamic import for Next.js SSR safety
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const storage = getStorage(app);

export default function RichEditor({ value, onChange, height = 200 }) {
  const quillRef = useRef(null);

  /* ----------------------------------------
      IMAGE UPLOAD HANDLER → Firebase Storage
  ---------------------------------------- */
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const fileRef = ref(
          storage,
          `notices/${Date.now()}-${file.name}`
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Image upload failed.");
      }
    };
  }, []);

  /* ----------------------------------------
      Toolbar Configuration
  ---------------------------------------- */
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  return (
    <div
      className="rounded-md bg-white text-black overflow-hidden"
      style={{ height: height + 50 }}
    >
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        style={{ height }}
      />
    </div>
  );
}
