import { NextResponse } from "next/server";
import { login } from "@/app/libs/auth";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const user = await login(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Verificação se a variável de ambiente JWT_SECRET está definida
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Erro: JWT_SECRET não definido no .env");
      return NextResponse.json(
        { success: false, message: "Erro de configuração do servidor." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no login." },
      { status: 500 }
    );
  }
}