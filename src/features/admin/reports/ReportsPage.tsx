import { Box, Typography } from "@mui/material";

export default function ReportsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Reports
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Generate role-based performance and compliance reports.
      </Typography>
    </Box>
  );
}
