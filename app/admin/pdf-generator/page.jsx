"use client";

import { db } from "../../../lib/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PDFGenerator() {
  const generate = async (hallTicket) => {
    // 1. Dynamically import jsPDF only when the button is clicked
    const { default: jsPDF } = await import("jspdf");
    
    const q = query(
      collection(db, "marks"),
      where("hallTicket", "==", hallTicket)
    );

    const snap = await getDocs(q);
    const pdf = new jsPDF();
    
    pdf.text(`Mark Sheet - ${hallTicket}`, 20, 20);

    let y = 40;
    snap.forEach(d => {
      const m = d.data();
      pdf.text(`${m.subject}: ${m.marks}`, 20, y);
      y += 10;
    });

    pdf.save(`${hallTicket}.pdf`);
  };

  return (
    <div className="p-4">
      <input 
        id="ht" 
        placeholder="Hall Ticket" 
        className="border p-2 mr-2 text-black" 
      />
      <button
        onClick={() => {
          const ht = document.getElementById("ht").value;
          if (ht) generate(ht);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate PDF
      </button>
    </div>
  );
}