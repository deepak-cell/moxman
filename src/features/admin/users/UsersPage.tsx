import { Box, Typography } from "@mui/material";

export default function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Users
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage admins, branch managers, RMs, and partners.
      </Typography>
    </Box>
  );
}
