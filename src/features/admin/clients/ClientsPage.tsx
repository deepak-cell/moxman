import { Box, Typography } from "@mui/material";

export default function ClientsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Clients
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Track client profiles, status, and policy activity.
      </Typography>
    </Box>
  );
}
