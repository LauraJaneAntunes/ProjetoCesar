"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { LockRounded, VpnKeyRounded, LockOpenRounded, LogoutRounded, ArrowBackRounded,} from "@mui/icons-material";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = typeof window !== "undefined" ? Boolean(localStorage.getItem("token")) : false;

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
    <AppBar position="static" sx={{ backgroundColor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: 2, flexWrap: "wrap" }}>
        {/* Botão Voltar (aparece se não estiver na página inicial) */}
        {pathname !== "/" && (
          <IconButton color="primary" onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBackRounded />
          </IconButton>
        )}

        {/* Logo / título */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LockRounded sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ color: 'primary.main' }}>
            Cifra de César
          </Typography>
        </Box>

        {/* Links e botão de Sair (aparecem apenas se não estiver na página inicial) */}
        {pathname !== "/" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Link para Criptografar */}
            <Button
              component={Link}
              href="/encrypt"
              color={pathname === "/encrypt" ? "primary" : "inherit"}
            >
              <VpnKeyRounded sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ display: { xs: "none", sm: "inline" } }}>
                Criptografar
              </Typography>
            </Button>

            {/* Link para Descriptografar */}
            <Button
              component={Link}
              href="/decrypt"
              color={pathname === "/decrypt" ? "primary" : "inherit"}
            >
              <LockOpenRounded sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ display: { xs: "none", sm: "inline" } }}>
                Descriptografar
              </Typography>
            </Button>

            {/* Botão de Logout */}
            {isLoggedIn && (
              <Button variant="outlined" color="primary" size="small" onClick={handleLogout}>
                <LogoutRounded sx={{ mr: 1 }} />
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