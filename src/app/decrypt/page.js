//src\app\decrypt\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/navbar";
import { Button, TextField, Container, Card, CardContent, Typography, Snackbar, Alert } from "@mui/material";
import { LockOpen, ContentCopy, CheckCircle, Warning } from "@mui/icons-material";
import { decrypt } from "../libs/caesar";

export default function DecryptPage() {
  const router = useRouter();
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [hash, setHash] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasUserCookie = document.cookie.includes("user=");
    if (!token && !hasUserCookie) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleDecrypt = async () => {
    if (!encryptedMessage.trim() || !hash.trim()) {
      setError("A mensagem criptografada e a chave privada são obrigatórias.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setDecrypted("");

    try {
      const response = await fetch("/api/use-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao buscar o hash.");
        setLoading(false);
        return;
      }

      const decryptedText = decrypt(encryptedMessage, data.shift);
      setDecrypted(decryptedText);
      setSuccess(true);
    } catch (error) {
      console.error("Erro na descriptografia:", error);
      setError("Ocorreu um erro durante a descriptografia. Tente novamente.");
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
    <Container maxWidth="sm" sx={{ pt: { xs: 10, sm: 12 }, }}>
      <Navbar />
      <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockOpen /> Descriptografar Mensagem
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Insira a mensagem criptografada e a chave privada (hash) para descriptografar.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Warning /> {error}
            </Alert>
          )}

          <TextField
            label="Mensagem Criptografada"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={encryptedMessage}
            onChange={(e) => setEncryptedMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Chave Privada (Hash)"
            variant="outlined"
            fullWidth
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDecrypt}
            disabled={!encryptedMessage.trim() || !hash.trim() || loading}
          >
            {loading ? "Descriptografando..." : "Descriptografar"}
          </Button>

          {success && decrypted && (
            <Card sx={{ mt: 3, p: 2, bgcolor: "primary" }}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle /> Descriptografia concluída!
              </Typography>
              <TextField
                value={decrypted}
                fullWidth
                multiline
                rows={3}
                readOnly
                sx={{ mt: 2 }}
              />
              <Button variant="text" onClick={() => copyToClipboard(decrypted)} sx={{ mt: 2 }}>
                <ContentCopy /> Copiar Mensagem
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