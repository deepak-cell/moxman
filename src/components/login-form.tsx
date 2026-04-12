"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCsrf = async () => {
      const res = await fetch("/api/auth/csrf");
      const data = await res.json();
      setCsrfToken(data.csrfToken);
    };
    loadCsrf();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, csrfToken }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload.error ?? "Login failed");
      setLoading(false);
      return;
    }

    const next = params.get("next") ?? "/admin/dashboard";
    router.push(next);
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ color: "white" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              height: 32,
              width: 32,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            M
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)" }}
            >
              MOXMAN
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              Sign in
            </Typography>
          </Box>
        </Box>

        <TextField
          label="User ID"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          variant="outlined"
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.75)" } }}
          InputProps={{
            style: {
              color: "white",
              background: "rgba(255,255,255,0.08)",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D0142C",
            },
          }}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          variant="outlined"
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.75)" } }}
          InputProps={{
            style: {
              color: "white",
              background: "rgba(255,255,255,0.08)",
            },
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D0142C",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Secure sign-in enabled
          </Typography>
          <Button variant="text" sx={{ color: "white", textTransform: "none" }}>
            Forgot password?
          </Button>
        </Box>

        {error ? (
          <Typography variant="body2" color="#FFD6D6">
            {error}
          </Typography>
        ) : null}

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          sx={{ py: 1.2, fontWeight: 600, textTransform: "none" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      </Box>
    </Box>
  );
}
