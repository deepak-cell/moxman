import { Box, Typography } from "@mui/material";

export default function ProductsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Products
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage policy products and commission rules.
      </Typography>
    </Box>
  );
}
