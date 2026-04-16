import { Box, Typography } from "@mui/material";

export default function CommissionsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Commissions
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Review commission calculations and tier assignments.
      </Typography>
    </Box>
  );
}
