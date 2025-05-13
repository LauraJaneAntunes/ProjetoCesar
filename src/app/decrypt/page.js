"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/navbar";
import { Button, TextField, Container, Card, CardContent, Typography, Snackbar, Alert } from "@mui/material";
import { LockOpen, ContentCopy, CheckCircle, Warning } from "@mui/icons-material";
import { decrypt } from "../libs/caesar";
import { getHashRecord, markHashAsUsed } from "../libs/db";

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
    const hasUserCookie = document.cookie.includes("user=");
    if (!hasUserCookie) {
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
      const hashRecord = await getHashRecord(hash);

      if (!hashRecord) {
        setError("Hash inválido. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      if (hashRecord.used) {
        setError("Este hash já foi utilizado. Cada hash pode ser usado apenas uma vez.");
        setLoading(false);
        return;
      }

      const decryptedText = decrypt(encryptedMessage, hashRecord.shift);
      setDecrypted(decryptedText);

      await markHashAsUsed(hash);

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
    <Container maxWidth="sm">
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
            <Card sx={{ mt: 3, p: 2, bgcolor: "secondary.light" }}>
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