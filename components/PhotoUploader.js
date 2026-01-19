import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from "../lib/firebaseClient";

export default function PhotoUploader({ roll, currentURL, onUploaded }) {
  const storage = getStorage(app);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentURL || "");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const ext = file.name.split(".").pop().toLowerCase();
    const fileRef = ref(storage, `students/photos/${roll}.${ext}`);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      setPreview(url);
      onUploaded(url);

      alert("Photo uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setUploading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete photo?")) return;

    const ext = preview.split(".").pop().split("?")[0];
    const fileRef = ref(storage, `students/photos/${roll}.${ext}`);

    try {
      await deleteObject(fileRef);
      setPreview("");
      onUploaded("");
    } catch (err) {
      console.error(err);
      alert("Could not delete photo.");
    }
  };

  return (
    <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
      <div className="text-xs text-slate-300 mb-2">Student Photo</div>

      {preview ? (
        <img
          src={preview}
          className="w-24 h-24 rounded-lg object-cover border border-slate-600 mb-3"
        />
      ) : (
        <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400 mb-3">
          No photo
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />

      {preview && (
        <button
          className="btn-danger mt-2 text-xs"
          onClick={handleDelete}
          disabled={uploading}
        >
          Delete Photo
        </button>
      )}

      {uploading && <div className="text-xs text-slate-400">Uploading…</div>}
    </div>
  );
}
