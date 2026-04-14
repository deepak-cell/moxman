import { Box, Button, Container, Paper, Typography } from "@mui/material";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { getSessionUser } from "@/lib/session";
import {
  customerGrowthSeries,
  paymentStatusBreakdown,
  requestsApprovalsSeries,
} from "./data/mockDashboardData";
import {
  CustomerGrowthChart,
  PaymentStatusDonut,
  RequestsApprovalsChart,
} from "./components/DashboardCharts";

type ActivityItem = {
  name: string;
  partner: string;
  status: "Pending" | "Approved" | "Paid";
  date: string;
};

const summaryCards = [
  {
    label: "New Requests",
    value: "18",
    change: "12% Higher",
  },
  {
    label: "Approved Customers",
    value: "64",
    change: "5% Increased",
  },
  {
    label: "Payments Pending",
    value: "₹2.45L",
    change: "8% Decrease",
  },
];

const recentRequests: ActivityItem[] = [
  { name: "Riya Sharma", partner: "Partner A", status: "Pending", date: "12 Apr 2026" },
  { name: "Arjun Mehta", partner: "Partner B", status: "Approved", date: "11 Apr 2026" },
  { name: "Nisha Verma", partner: "Partner C", status: "Paid", date: "10 Apr 2026" },
  { name: "Rahul Singh", partner: "Partner A", status: "Pending", date: "09 Apr 2026" },
  { name: "Meera Iyer", partner: "Partner D", status: "Approved", date: "08 Apr 2026" },
];

const actionQueue = [
  "Approve 6 customer requests",
  "Mark 3 payments as paid",
];

export default async function DashboardPage() {
  const user = await getSessionUser();
  const userName = user?.name ?? "Super Admin";

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth={false} sx={{ p: "0 !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome To Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Home / Super Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" startIcon={<UploadOutlinedIcon />}>Add Customer</Button>
            <Button variant="outlined" startIcon={<FilterAltOutlinedIcon />}>Filter Requests</Button>
            <Button variant="contained" startIcon={<CloudDownloadOutlinedIcon />}>Download Report</Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: "0.688rem",
                bgcolor: "#5C57D6",
                color: "#fff",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {userName}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                You have 18 new customer requests waiting for approval. Approval completion this month is 57%.
              </Typography>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 1.5,
              }}
            >
              {summaryCards.map((card) => (
                <Paper key={card.label} sx={{ p: 2, borderRadius: "0.688rem" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: "0.12em" }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {card.change}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Paper sx={{ p: 2.5, borderRadius: "0.688rem" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Monthly Requests vs Approvals
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 12 months
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#6d5dfc" }} />
                  <Typography variant="caption" color="text.secondary">
                    Requests
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#2ecc71" }} />
                  <Typography variant="caption" color="text.secondary">
                    Approvals
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  height: 260,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  px: 0,
                }}
              >
                <RequestsApprovalsChart data={requestsApprovalsSeries} />
              </Box>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <Paper sx={{ p: 2.5, borderRadius: "0.688rem" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Approved customers by payment state
                </Typography>
                <PaymentStatusDonut
                  paid={paymentStatusBreakdown.paid}
                  pending={paymentStatusBreakdown.pending}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#2ecc71" }} />
                    <Typography variant="caption" color="text.secondary">
                      Paid ({paymentStatusBreakdown.paid})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f39c12" }} />
                    <Typography variant="caption" color="text.secondary">
                      Pending ({paymentStatusBreakdown.pending})
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: "0.688rem" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Customer Growth
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  New customers added per month
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    px: 0,
                  }}
                >
                  <CustomerGrowthChart data={customerGrowthSeries} />
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper sx={{ p: 2.5, borderRadius: "0.688rem" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Customer Requests
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Latest approvals and status updates
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {recentRequests.map((item) => (
                  <Box
                    key={`${item.name}-${item.date}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.partner} · {item.date}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor:
                          item.status === "Paid"
                            ? "rgba(46, 204, 113, 0.12)"
                            : item.status === "Approved"
                            ? "rgba(52, 152, 219, 0.12)"
                            : "rgba(241, 196, 15, 0.15)",
                        color:
                          item.status === "Paid"
                            ? "#2ecc71"
                            : item.status === "Approved"
                            ? "#3498db"
                            : "#f39c12",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {item.status}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: "0.688rem" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Action Queue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Priority tasks waiting for your approval
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {actionQueue.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "0.688rem",
                      px: 1.5,
                      py: 1,
                      color: "text.secondary",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
