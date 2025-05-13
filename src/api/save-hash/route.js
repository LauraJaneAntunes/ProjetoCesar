// src/api/save-hash/route.js
import { saveHash } from "@/app/libs/db";

export async function POST(req) {
  const { hash, shift } = await req.json();

  const id = await saveHash(hash, shift);

  if (id) {
    return Response.json({ success: true, id });
  } else {
    return Response.json({ success: false }, { status: 500 });
  }
}