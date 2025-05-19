// src/app/api/use-hash/route.js
import { NextResponse } from "next/server";
import { getHashRecord, markHashAsUsed } from "@/app/libs/db";

export async function POST(request) {
  try {
    const { hash } = await request.json();

    const hashRecord = await getHashRecord(hash);

    if (!hashRecord) {
      return NextResponse.json(
        { error: "Hash não encontrado" },
        { status: 404 }
      );
    }

    if (hashRecord.used) {
      return NextResponse.json(
        { error: "Hash já foi usado" },
        { status: 400 }
      );
    }

    await markHashAsUsed(hash);

    return NextResponse.json(
      { success: true, shift: hashRecord.shift },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no handler de use-hash:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}