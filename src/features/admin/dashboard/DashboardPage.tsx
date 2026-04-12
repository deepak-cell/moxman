import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { getSessionUser } from "@/lib/session";

const cards = [
  { label: "Active Clients", value: "1,248" },
  { label: "Policies", value: "3,410" },
  { label: "Monthly Revenue", value: "₹28.4L" },
  { label: "Pending Payouts", value: "₹4.2L" },
];

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Dashboard
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Welcome back, {user?.name ?? "Team"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user?.role ?? "ADMIN"} · Track your branch performance and
              client activity.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {cards.map((card) => (
              <Grid key={card.label} item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ letterSpacing: "0.2em" }}
                  >
                    {card.label}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                    {card.value}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      height: 4,
                      width: 64,
                      borderRadius: 999,
                      bgcolor: "secondary.main",
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6">Client Activity</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 30 days
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                    height: 200,
                    borderRadius: 2,
                    border: "1px dashed rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  Chart placeholder
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    "New partner onboarded",
                    "Policy payout approved",
                    "Client status updated",
                  ].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 2,
                        px: 2,
                        py: 1.2,
                        color: "text.secondary",
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
