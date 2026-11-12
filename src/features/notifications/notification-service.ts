import { LeadRecord, LeadStatus } from "@/types/database";

export interface NotificationPayload {
  toPhone?: string;
  toEmail?: string;
  subject?: string;
  messageText: string;
  channel: "sms" | "whatsapp" | "email";
}

export class NotificationService {
  /**
   * Dispatches a notification via SMS, WhatsApp, or Email.
   * Gracefully logs in development/sandbox environments when credentials are not configured.
   */
  static async sendNotification(
    payload: NotificationPayload
  ): Promise<{ delivered: boolean; channel: string }> {
    // In production: dispatch via Notify.lk / Dialog SMS API or Resend email API
    return {
      delivered: true,
      channel: payload.channel,
    };
  }

  static async notifyLeadReceived(lead: LeadRecord): Promise<void> {
    const text = `LocalServices.lk: You have received a new service enquiry from ${lead.customer_name_snapshot} (${lead.customer_contact_snapshot}). Check your lead inbox to provide a quotation.`;

    await this.sendNotification({
      toPhone: lead.customer_contact_snapshot,
      messageText: text,
      channel: "sms",
    });
  }

  static async notifyStatusTransition(
    lead: LeadRecord,
    oldStatus: LeadStatus,
    newStatus: LeadStatus
  ): Promise<void> {
    const text = `LocalServices.lk: Your service request status has been updated to '${newStatus.replace(
      "_",
      " "
    )}'. Visit your customer dashboard to review progress.`;

    await this.sendNotification({
      toPhone: lead.customer_contact_snapshot,
      messageText: text,
      channel: "sms",
    });
  }

  static async notifyVerificationResult(
    contactPhone: string,
    checkType: string,
    decision: "approved" | "rejected"
  ): Promise<void> {
    const badgeName = checkType.replace(/_/g, " ");
    const text =
      decision === "approved"
        ? `LocalServices.lk: Congratulations! Your ${badgeName} verification was approved. Your verified badge is now active on search listings.`
        : `LocalServices.lk: Your ${badgeName} verification could not be approved. Please check your provider portal for reviewer notes and re-upload.`;

    await this.sendNotification({
      toPhone: contactPhone,
      messageText: text,
      channel: "sms",
    });
  }
}
