import { Box, Typography } from "@mui/material";

export default function PoliciesPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Policies
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Review issued policies, renewals, and lifecycle status.
      </Typography>
    </Box>
  );
}
