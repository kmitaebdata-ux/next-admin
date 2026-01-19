"use client";

import jsPDF from "jspdf";
import { db } from "../../../lib/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PDFGenerator() {
  const generate = async (hallTicket) => {
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
    <div>
      <input id="ht" placeholder="Hall Ticket" />
      <button
        onClick={() => generate(document.getElementById("ht").value)}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Generate PDF
      </button>
    </div>
  );
}
