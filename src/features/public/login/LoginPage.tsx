import { Box, Grid, Typography } from "@mui/material";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/loginbg.png')",
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
            maxWidth: 980,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "rgba(255,255,255,0.05)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  sx={{ letterSpacing: "0.35em", color: "white", fontWeight: 600 }}
                >
                  MOXMAN
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)" }}
                >
                  Fintech App
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                borderTop: { xs: "1px solid rgba(255,255,255,0.12)", md: "none" },
                borderLeft: { xs: "none", md: "1px solid rgba(255,255,255,0.12)" },
                p: 4,
              }}
            >
              <LoginForm />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>

);
}
