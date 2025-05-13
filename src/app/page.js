"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Navbar } from "./components/navbar";
import { Button, TextField, Card, CardContent, CardActions, CardHeader, Typography, Box, IconButton, Alert } from '@mui/material';


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação simples
    if (!username || !password) {
      setError("Nome de usuário e senha são obrigatórios");
      setLoading(false);
      return;
    }

    // Autenticação simulada - em um aplicativo real, você chamaria uma API
    // Usando admin/password ou user/password para demonstração
    if ((username === "admin" && password === "password") ||
        (username === "user" && password === "password")) {
      // Define o cookie para armazenar o estado de login
      document.cookie = `user=${JSON.stringify({ username, id: username === "admin" ? "1" : "2" })}; path=/`;
      router.push("/encrypt");
    } else {
      setError("Nome de usuário ou senha inválidos");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Navbar />

      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <CardHeader
            titleTypographyProps={{ variant: 'h5', align: 'center' }}
            subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary', align: 'center' }}
            avatar={
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <LockIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
            }
            title="Bem-vindo de volta"
            subheader="Insira suas credenciais para acessar o sistema de criptografia"
          />
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  id="username"
                  label="Nome de usuário"
                  placeholder="Insira seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <TextField
                  fullWidth
                  id="password"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Insira sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </Box>
            </form>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Use admin/password para acesso de demonstração
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </main>
  );
}