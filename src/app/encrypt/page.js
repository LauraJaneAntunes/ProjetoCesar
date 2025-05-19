//src\app\encrypt\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Container, Card, CardContent, Typography, Slider, Snackbar, Alert } from "@mui/material";
import { Lock, Key, ContentCopy, ArrowForward } from "@mui/icons-material";
import { Navbar } from "../components/navbar";
import { encrypt, generateHash } from "../libs/caesar";

export default function EncryptPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(3);
  const [encrypted, setEncrypted] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasUserCookie = document.cookie.includes("user=");
    if (!token && !hasUserCookie) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleEncrypt = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      // Criptografa a mensagem localmente
      const encryptedText = encrypt(message, shift);
      setEncrypted(encryptedText);

      // Gera o hash localmente
      const newHash = generateHash();
      setHash(newHash);

      // Salva o hash e shift no backend, no endpoint save-hash
      const response = await fetch("/api/save-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash: newHash, shift }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Erro ao salvar hash no MongoDB");
      }
    } catch (error) {
      console.error("Erro na criptografia ou no save-hash:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Navbar />
      <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Key /> Criptografar Mensagem
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Use a cifra de César para criptografar sua mensagem.
          </Typography>

          <TextField
            label="Mensagem para criptografar"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" sx={{ mb: 1 }}>
            Valor de deslocamento: {shift}
          </Typography>
          <Slider
            min={1}
            max={25}
            step={1}
            value={shift}
            onChange={(e, newValue) => setShift(newValue)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleEncrypt} disabled={!message.trim() || loading}>
            {loading ? "Criptografando..." : "Criptografar"}
          </Button>

          {encrypted && (
            <Card sx={{ mt: 3, p: 2, bgcolor: "primary" }}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Lock /> Mensagem Criptografada
              </Typography>
              <TextField value={encrypted} fullWidth multiline rows={3} readOnly sx={{ mt: 2 }} />
              <Button variant="text" onClick={() => copyToClipboard(encrypted)} sx={{ mt: 2 }}>
                <ContentCopy /> Copiar Mensagem
              </Button>

              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
                <Key /> Chave Privada (Hash)
              </Typography>
              <TextField value={hash} fullWidth readOnly sx={{ mt: 2 }} />
              <Button variant="text" onClick={() => copyToClipboard(hash)} sx={{ mt: 2 }}>
                <ContentCopy /> Copiar Hash
              </Button>

              <Button variant="outlined" fullWidth onClick={() => router.push("/decrypt")} sx={{ mt: 2 }}>
                Ir para Descriptografia <ArrowForward sx={{ ml: 1 }} />
              </Button>
            </Card>
          )}
        </CardContent>
      </Card>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
        <Alert severity="success">Copiado para a área de transferência!</Alert>
      </Snackbar>
    </Container>
  );
}