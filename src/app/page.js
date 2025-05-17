"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Navbar } from "./components/navbar";
import { Button, TextField, Card, CardContent, CardActions, Typography, Box, IconButton, Alert, CardHeader, Modal, Fade, Backdrop, CircularProgress } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("Nome de usuário e senha são obrigatórios");
      setLoading(false);
      return;
    }

    try {
    const response = await fetch("/api  /login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Usuário ou senha inválidos");
      setLoading(false);
      return;
    }

    // 🔐 Salvar o token JWT no cookie (ou localStorage)
    if (typeof window !== "undefined") {
      document.cookie = `token=${data.token}; path=/; max-age=3600`;
    }

    // Redireciona após login
    router.push("/encrypt");
    } catch (err) {
      console.error(err);
      setError("Erro ao tentar logar");
    } finally {
      setLoading(false);
    }
  };

  // Modal
  const handleOpenRegister = () => {
    setRegUsername("");
    setRegPassword("");
    setRegError("");
    setRegSuccess(false);
    setOpenRegister(true);
  };

  const handleCloseRegister = () => setOpenRegister(false);

  //Função para enviar cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    setRegSuccess(false);

    if (!regUsername || !regPassword) {
      setRegError("Nome de usuário e senha são obrigatórios");
      setRegLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: regUsername, password: regPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegError(data.error || "Erro ao cadastrar");
        setRegLoading(false);
        return;
      }

      setRegSuccess(true);
      setRegLoading(false);
      setTimeout(() => {
        handleCloseRegister();
      }, 2000);
    } catch (error) {
      setRegError("Erro de conexão");
      setRegLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Navbar />
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
          </Box>

          <CardHeader
            title={
              <Typography variant="h5" align="center" sx={{ mt: 1 }}>
                Bem-vindo de volta
              </Typography>
            }
            subheader={
              <Typography variant="body2" align="center" color="text.secondary">
                Insira suas credenciais para acessar o sistema de criptografia
              </Typography>
            }
            sx={{ pb: 0 }}
          />

          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
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

          <CardActions sx={{ flexDirection: 'column', pb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Use <strong>admin/password</strong> para acesso de demonstração ou
            </Typography>
            <Button variant="text" size="small" onClick={handleOpenRegister}>
              Cadastre-se
            </Button>
          </CardActions>
        </Card>
      </Box>

      <Modal
        open={openRegister}
        onClose={handleCloseRegister}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openRegister}>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 350,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" textAlign="center" gutterBottom>
              Cadastro
            </Typography>

            {regError && <Alert severity="error">{regError}</Alert>}
            {regSuccess && <Alert severity="success">Usuário cadastrado com sucesso!</Alert>}

            <TextField
              fullWidth
              label="Nome de usuário"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              autoComplete="username"
              required
            />

            <TextField
              fullWidth
              label="Senha"
              type={regShowPassword ? 'text' : 'password'}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              autoComplete="new-password"
              required
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setRegShowPassword(!regShowPassword)} edge="end">
                    {regShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button type="submit" variant="contained" disabled={regLoading} fullWidth>
              {regLoading ? <CircularProgress size={24} /> : "Cadastrar"}
            </Button>
          </Box>
        </Fade>
      </Modal>

    </main>
  );
}