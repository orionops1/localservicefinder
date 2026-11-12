import React from "react";

export type VerificationType =
  | "phone_confirmed"
  | "identity_checked"
  | "business_details_checked"
  | "qualification_checked"
  | "platform_reviewed";

interface VerificationBadgeProps {
  type: VerificationType;
  label?: string;
  checkedAt?: string;
  size?: "sm" | "md";
  showDescription?: boolean;
}

const BADGE_CONFIG: Record<
  VerificationType,
  { label: string; icon: string; description: string; colorClass: string }
> = {
  phone_confirmed: {
    label: "Phone confirmed",
    icon: "📞",
    description: "Mobile number verified via direct confirmation",
    colorClass: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  identity_checked: {
    label: "Identity checked",
    icon: "🪪",
    description: "National Identity Card (NIC) / Government ID reviewed by platform",
    colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  business_details_checked: {
    label: "Business checked",
    icon: "🏛️",
    description: "Official Business Registration (BR) certificate reviewed",
    colorClass: "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  },
  qualification_checked: {
    label: "Qualification checked",
    icon: "📜",
    description: "Trade licence, NVQ certificate, or professional credential reviewed",
    colorClass: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  platform_reviewed: {
    label: "Platform reviewed",
    icon: "🛡️",
    description: "Comprehensive manual verification and onboarding review completed",
    colorClass: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
  },
};

export function VerificationBadge({
  type,
  label,
  checkedAt,
  size = "sm",
  showDescription = false,
}: VerificationBadgeProps) {
  const config = BADGE_CONFIG[type] || {
    label: label || "Verified",
    icon: "✓",
    description: "Verification completed",
    colorClass: "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  };

  const displayText = label || config.label;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.colorClass} ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
      title={config.description}
    >
      <span className="text-[10px]">{config.icon}</span>
      <span>{displayText}</span>
      {checkedAt && (
        <span className="text-[10px] opacity-70">
          ({new Date(checkedAt).getFullYear()})
        </span>
      )}
      {showDescription && (
        <span className="ml-1 text-[10px] opacity-80 block">— {config.description}</span>
      )}
    </div>
  );
}
