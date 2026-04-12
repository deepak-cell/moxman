import { Box, Typography } from "@mui/material";

export default function PaymentsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Payments
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Track payouts, approvals, and payment history.
      </Typography>
    </Box>
  );
}
