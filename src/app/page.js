"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchema } from "../app/libs/validationSchema";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Navbar } from "./components/navbar";
import {
  Button,
  TextField,
  Card,
  Container,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Alert,
  CardHeader,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
} from "@mui/material";

function FormikTextField({ label, type = "text", name, showPasswordToggle, showPassword, setShowPassword }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          fullWidth
          label={label}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          {...field}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          InputProps={{
            endAdornment: (showPasswordToggle && isMounted) ? (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ) : null,
          }}
        />
      )}
    </Field>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Usuário ou senha inválidos");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=3600`;
      }

      router.push("/encrypt");
    } catch (err) {
      console.error(err);
      setError("Erro ao tentar logar");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (values, { resetForm }) => {
    setRegLoading(true);
    setRegError("");
    setRegSuccess(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegError(data.error || "Erro ao cadastrar");
        setRegLoading(false);
        return;
      }

      setRegSuccess(true);
      setRegLoading(false);
      resetForm();
      setTimeout(() => setOpenRegister(false), 2000);
    } catch (error) {
      setRegError("Erro de conexão");
      setRegLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 10, sm: 12 },
        pb: 4,
      }}
    >
      <Navbar />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            textAlign: "center",
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockIcon sx={{ fontSize: 32, color: "primary.main" }} />
            </Box>
          </Box>

          <CardHeader
            title={
              <Typography variant="h5" align="center" sx={{ mt: 1 }}>
                Bem-vindo!
              </Typography>
            }
            subheader={
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: 3 }}
              >
                Insira suas credenciais para acessar o sistema de criptografia
              </Typography>
            }
            sx={{ pb: 0 }}
          />

          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}
            >
              {() => (
                <Form>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <FormikTextField label="Nome de usuário" name="username" />
                    <FormikTextField
                      label="Senha"
                      name="password"
                      showPasswordToggle={true}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>

          <CardActions sx={{ flexDirection: "column", pb: 2 }}>
            <Button variant="text" size="small" onClick={() => setOpenRegister(true)}>
              Cadastre-se
            </Button>
          </CardActions>
        </Card>
      </Box>

      {isMounted && (
        <Modal
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openRegister}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 350 },
                maxWidth: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6" textAlign="center" gutterBottom>
                Cadastro
              </Typography>

              {regError && <Alert severity="error">{regError}</Alert>}
              {regSuccess && (
                <Alert severity="success">Usuário cadastrado com sucesso!</Alert>
              )}

              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleRegisterSubmit}
              >
                {() => (
                  <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <FormikTextField label="Nome de usuário" name="username" />
                      <FormikTextField
                        label="Senha"
                        name="password"
                        showPasswordToggle={true}
                        showPassword={regShowPassword}
                        setShowPassword={setRegShowPassword}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={regLoading}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        {regLoading ? <CircularProgress size={24} /> : "Cadastrar"}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Fade>
        </Modal>
      )}
    </Box>
  );
}