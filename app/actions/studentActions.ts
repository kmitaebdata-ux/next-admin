// 1. Define the shape of your student data
export interface Student {
  name?: string;
  batch?: string;
  year?: string;
  semester?: string;
  regulation?: string;
  section?: string;
  [key: string]: any; // Allow for other dynamic fields
}

export async function getStudents(filters: any = {}) {
  const db = getFirestore(getClientApp());

  let qRef: any = collection(db, "students");

  const clauses: any[] = [];
  if (filters.batch) clauses.push(where("batch", "==", filters.batch));
  if (filters.year) clauses.push(where("year", "==", filters.year));
  if (filters.semester) clauses.push(where("semester", "==", filters.semester));
  if (filters.regulation)
    clauses.push(where("regulation", "==", filters.regulation));
  if (filters.section) clauses.push(where("section", "==", filters.section));

  if (clauses.length) qRef = query(qRef, ...clauses);

  const snap = await getDocs(qRef);

  // 2. Cast d.data() as Student to allow the spread operator
  return snap.docs.map((d) => ({ 
    id: d.id, 
    ...(d.data() as Student) 
  }));
}