import { Box, Typography } from "@mui/material";

export default function SlabsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Slabs
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Configure slab thresholds and payouts.
      </Typography>
    </Box>
  );
}
