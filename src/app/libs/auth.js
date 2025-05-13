// Funções simples de autenticação - Em um app real, você usaria um sistema adequado
import { cookies } from "next/headers";

// Mock de banco de usuários - Em um app real, isso estaria em um banco de dados
const users = [
  { username: "admin", password: "password", id: "1" },
  { username: "user", password: "password", id: "2" },
];

// Função de login
export function login(username, password) {
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    return { id: user.id, username: user.username };
  }

  return null;
}

// Função para obter o usuário a partir dos cookies
export function getUser() {
  const userCookie = cookies().get("user")?.value;

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch (error) {
    return null;
  }
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated() {
  return getUser() !== null;
}