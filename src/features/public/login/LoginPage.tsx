import { Box, Typography } from "@mui/material";
import Image from "next/image";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/bglogin.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            minHeight: 560,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.16)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            overflow: "hidden", // ← needed so child borderRadius clips correctly
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              minHeight: 560,
            }}
          >
            {/* Left — branding panel, stays glassy */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                p: 4,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ mb: 2 }}>
                  <Image
                    src="/logo.png"
                    alt="Moxman"
                    width={256}
                    height={54}
                    style={{ width: "256px", height: "auto" }}
                    priority
                  />
                </Box>
              </Box>
            </Box>

            {/* Right — dark form panel */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderTop: { xs: "1px solid rgba(255,255,255,0.12)", md: "none" },
                borderLeft: { xs: "none", md: "1px solid rgba(255,255,255,0.12)" },
                p: 4,
                // ↓ Dark solid background instead of transparent
                backgroundColor: "rgba(10, 10, 20, 0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <LoginForm />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
