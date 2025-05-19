"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { LockRounded, VpnKeyRounded, LockOpenRounded, LogoutRounded, ArrowBackRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Função para voltar à página anterior
  const handleGoBack = () => {
    router.back(); 
  };

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      sx={{ 
        width: "100%", 
        top: 0, 
        left: 0,
        backgroundColor: "background.paper", 
        borderBottom: "1px solid", 
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 }, flexWrap: "wrap" }}>
        {/* Botão Voltar (aparece se não estiver na página inicial) */}
        {pathname !== "/" && isMounted && (
          <IconButton color="primary" onClick={handleGoBack} sx={{ mr: 1 }}>
            <ArrowBackRounded />
          </IconButton>
        )}

        {/* Logo / título */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LockRounded sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Cifra de César
          </Typography>
        </Box>

        {/* Links e botão de Sair (aparecem apenas se não estiver na página inicial) */}
        {pathname !== "/" && isMounted && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Link para Criptografar */}
            <Button
              component={Link}
              href="/encrypt"
              color={pathname === "/encrypt" ? "primary" : "inherit"}
              size="small"
            >
              <VpnKeyRounded sx={{ mr: 0.5, fontSize: { xs: 18, sm: 20 } }} />
              <Typography variant="subtitle2" sx={{ display: { xs: "none", sm: "inline" } }}>
                Criptografar
              </Typography>
            </Button>

            {/* Link para Descriptografar */}
            <Button
              component={Link}
              href="/decrypt"
              color={pathname === "/decrypt" ? "primary" : "inherit"}
              size="small"
            >
              <LockOpenRounded sx={{ mr: 0.5, fontSize: { xs: 18, sm: 20 } }} />
              <Typography variant="subtitle2" sx={{ display: { xs: "none", sm: "inline" } }}>
                Descriptografar
              </Typography>
            </Button>

            {/* Botão de Logout */}
            {isLoggedIn && (
              <Button variant="outlined" color="primary" size="small" onClick={handleLogout}>
                <LogoutRounded sx={{ mr: 0.5, fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="subtitle2" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Sair
                </Typography>
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}