"use client";

import { Box, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RequestsApprovalsPoint = { month: string; requests: number; approvals: number };

type LineChartProps = {
  data: RequestsApprovalsPoint[];
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; payload: { month: string } }>;
  label?: string;
};

function RequestsApprovalsTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const requests = payload.find((item) => item.dataKey === "requests")?.value ?? 0;
  const approvals = payload.find((item) => item.dataKey === "approvals")?.value ?? 0;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "0.6rem",
        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        px: 1.2,
        py: 0.9,
        minWidth: 140,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Requests: {requests}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Approvals: {approvals}
      </Typography>
    </Box>
  );
}

export function RequestsApprovalsChart({ data }: LineChartProps) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
        >
          <CartesianGrid stroke="rgba(109, 93, 252, 0.12)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(90, 90, 115, 0.8)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(0,0,0,0.15)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(90, 90, 115, 0.8)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(0,0,0,0.15)" }}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<RequestsApprovalsTooltip />} cursor={{ strokeDasharray: "4 4" }} />
          <Line
            type="monotone"
            dataKey="approvals"
            stroke="#2ecc71"
            strokeWidth={3}
            dot={false}
            activeDot={false}
            strokeDasharray="6 6"
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#6d5dfc"
            strokeWidth={3.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

type DonutChartProps = {
  paid: number;
  pending: number;
};

const paymentColors = ["#2ecc71", "#f39c12"];

export function PaymentStatusDonut({ paid, pending }: DonutChartProps) {
  const total = paid + pending;
  const paidPct = total === 0 ? 0 : Math.round((paid / total) * 100);
  const data = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending },
  ];

  return (
    <Box sx={{ width: "100%", height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={50}
            outerRadius={68}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={paymentColors[index]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const item = payload[0];
              return (
                <Box
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "0.6rem",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                    px: 1.2,
                    py: 0.9,
                    minWidth: 120,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {item.value}
                  </Typography>
                </Box>
              );
            }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#4a4a4a"
            fontWeight="600"
          >
            {paidPct}%
          </text>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

type MiniBarChartProps = {
  data: { month: string; value: number }[];
};

function CustomerGrowthTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value ?? 0;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "0.6rem",
        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        px: 1.2,
        py: 0.9,
        minWidth: 120,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Customers: {value}
      </Typography>
    </Box>
  );
}

export function CustomerGrowthChart({ data }: MiniBarChartProps) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
          <CartesianGrid stroke="rgba(109, 93, 252, 0.12)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(90, 90, 115, 0.8)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(0,0,0,0.15)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(90, 90, 115, 0.8)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(0,0,0,0.15)" }}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomerGrowthTooltip />} cursor={{ fill: "rgba(109, 93, 252, 0.08)" }} />
          <Bar dataKey="value" fill="#6d5dfc" radius={[8, 8, 8, 8]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
