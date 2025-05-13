"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box, } from "@mui/material";
import { LockRounded, VpnKeyRounded, LockOpenRounded, LogoutRounded, } from "@mui/icons-material";

export function Navbar() {
  const pathname = usePathname();

  const isLoggedIn = typeof window !== "undefined" 
    ? Boolean(document.cookie.includes("user=")) 
    : false;

  const handleLogout = () => {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  if (!isLoggedIn && pathname !== "/") {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          px: 2,
          flexWrap: "wrap", // permite quebra se necessário
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LockRounded sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div">
            Cifra de César
          </Typography>
        </Box>

        {pathname !== "/" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5, // define espaço entre os botões
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              component={Link}
              href="/encrypt"
              color={pathname === "/encrypt" ? "primary" : "inherit"}
            >
              <VpnKeyRounded sx={{ mr: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Criptografar
              </Typography>
            </Button>

            <Button
              component={Link}
              href="/decrypt"
              color={pathname === "/decrypt" ? "primary" : "inherit"}
            >
              <LockOpenRounded sx={{ mr: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Descriptografar
              </Typography>
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleLogout}
            >
              <LogoutRounded sx={{ mr: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Sair
              </Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}