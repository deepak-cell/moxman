"use client";

import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CtaButton from "@/components/ui/CtaButton";
import { useToast } from "@/components/ui/ToastProvider";

const roleLabelMap: Record<string, string> = {
  ADMIN: "Admin",
  SUB_ADMIN: "Sub Admin",
  BRANCH_MANAGER: "Branch Manager",
  RELATIONSHIP_MANAGER: "RM",
  PARTNER: "Partner",
};

export default function DownloadReportButton({ role }: { role?: string | null }) {
  const { showToast } = useToast();
  const roleKey = (role ?? "ADMIN").toUpperCase().replace(/\s+/g, "_");
  const label = roleLabelMap[roleKey] ?? "Admin";

  return (
    <CtaButton
      variant="role"
      startIcon={<CloudDownloadOutlinedIcon />}
      onClick={() =>
        showToast({
          message: `Preparing ${label} report download...`,
          severity: "info",
        })
      }
    >
      Download {label} Report
    </CtaButton>
  );
}
