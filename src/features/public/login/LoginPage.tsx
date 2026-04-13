import { Box, } from "@mui/material";
import Image from "next/image";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/explosive-data-stream-dynamic-burst-glowing-particles-digital-energy-futuristic-light.jpg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          minHeight: "100vh",
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
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            backdropFilter: "blur(8px)",
            overflow: "hidden", // ← needed so child borderRadius clips correctly
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 24,
              left: 24,
              width: 220,
              height: 140,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.1))",
              clipPath:
                "polygon(0% 100%, 0% 65%, 12% 65%, 12% 100%, 24% 100%, 24% 50%, 36% 50%, 36% 100%, 48% 100%, 48% 35%, 60% 35%, 60% 100%, 72% 100%, 72% 22%, 84% 22%, 84% 100%, 96% 100%, 96% 10%, 100% 10%, 100% 100%)",
              boxShadow: "0 12px 30px rgba(1,34,105,0.18)",
              filter: "blur(0.2px)",
              opacity: 0.7,
              pointerEvents: "none",
              zIndex: 0,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 20,
              left: 20,
              width: 228,
              height: 148,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.18)",
              opacity: 0.35,
              pointerEvents: "none",
              zIndex: 0,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              minHeight: 560,
              position: "relative",
              zIndex: 1,
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
                    src="/logo.svg"
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
                // backgroundColor: "rgba(10, 10, 20, 0.85)",
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
