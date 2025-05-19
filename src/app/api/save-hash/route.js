// src/app/api/save-hash/route.js
import { NextResponse } from "next/server";
import { saveHash } from "@/app/libs/db";

export async function POST(request) {
  try {
    const { hash, shift } = await request.json();

    const id = await saveHash(hash, shift);

    if (id) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro ao criar hash:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}