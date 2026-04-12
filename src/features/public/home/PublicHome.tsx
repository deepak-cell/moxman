import { Box, Button, Container, Typography } from "@mui/material";

export default function PublicHome() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ letterSpacing: "0.3em", fontWeight: 700, color: "primary.main" }}
            >
              MOXMAN
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ textTransform: "none" }}
            >
              Sign in
            </Button>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Insurance operations, unified and secure.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Moxman Fintech App helps teams manage clients, policies, and
            commissions with role-based visibility.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            href="/login"
            sx={{ textTransform: "none", alignSelf: "center" }}
          >
            Access Portal
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
