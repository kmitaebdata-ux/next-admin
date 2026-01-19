// components/BulkPhotoUploader.js
import JSZip from "jszip";
import { useState } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

/**
 * Props:
 *  - students: array of { roll, id } to match (id = doc id)
 *  - onComplete(status)
 */
export default function BulkPhotoUploader({ students = [], onComplete = ()=>{} }) {
  const [status, setStatus] = useState("");
  const storage = getStorage();

  const handleZip = async (file) => {
    if (!file) return;
    setStatus("Reading zip...");
    const zip = await JSZip.loadAsync(file);
    const entries = {};
    zip.forEach((p, f) => { entries[p.split("/").pop().toLowerCase()] = f; });

    // validate
    const missing = [];
    for (const s of students) {
      const found = Object.keys(entries).find(k => k.split(".")[0] === s.roll.toLowerCase());
      if (!found) missing.push(s.roll);
    }
    if (missing.length) {
      setStatus(`Missing photos for: ${missing.slice(0,10).join(", ")}${missing.length>10 ? '...' : ''}`);
      return onComplete({ ok:false, missing });
    }

    setStatus("Uploading photos...");
    let done = 0;
    for (const s of students) {
      const key = Object.keys(entries).find(k=>k.split(".")[0] === s.roll.toLowerCase());
      const fileObj = entries[key];
      const blob = await fileObj.async("blob");
      const ext = key.split(".").pop();
      const filename = `${s.roll}.${ext}`;
      const sref = storageRef(storage, `students/photos/${filename}`);
      await uploadBytes(sref, blob);
      const url = await getDownloadURL(sref);
      // update student doc
      await updateDoc(doc(db, "students", s.id), { photoURL: url });
      done++;
      setStatus(`Uploaded ${done}/${students.length}`);
    }

    setStatus("All uploaded");
    onComplete({ ok:true });
  };

  return (
    <div className="panel-card">
      <p className="text-sm text-slate-400 mb-3">Upload photos ZIP (each file named exactly as roll)</p>
      <input type="file" accept=".zip" onChange={(e)=>handleZip(e.target.files?.[0])} />
      <div className="text-xs text-slate-400 mt-2">{status}</div>
    </div>
  );
}
