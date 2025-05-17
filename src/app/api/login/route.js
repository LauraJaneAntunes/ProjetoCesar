// src/app/api/login/route.js
import { NextResponse } from "next/server";
import { login } from "@/app/libs/auth";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { username, password } = await req.json();

  const user = await login(username, password);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Credenciais inválidas." },
      { status: 401 }
    );
  }

  // 🔐 Gerar o token JWT
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
    },
    token, // ← Aqui vai o token gerado
  });
}