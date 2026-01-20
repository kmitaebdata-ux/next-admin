import admin from "../../../lib/firebaseAdmin";

export async function GET() {
  const db = admin.firestore();

  const snapshot = await db
    .collection("notices")
    .orderBy("postedOn", "desc")
    .get();

  const notices = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Response.json(notices);
}

export async function POST(req) {
  try {
    const db = admin.firestore();

    const data = await req.json();

    const notice = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      expiryDate: new Date(data.lastDate),
      postedOn: new Date(),
    };

    const ref = await db.collection("notices").add(notice);

    return Response.json({
      message: "created",
      id: ref.id,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
