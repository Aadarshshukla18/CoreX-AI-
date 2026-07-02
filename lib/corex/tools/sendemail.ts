import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { sendEmail } from "../gmail";

export const sendEmailTool = tool(
  async ({ lead_name, subject, message }) => {
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .ilike("name", `%${lead_name}%`)
      .single();

    if (error || !lead) {
      throw new Error("Lead not found");
    }

    await sendEmail(
      lead.email,
      subject,
      message
    );

    // Save email log
    await supabase
      .from("email_logs")
      .insert([
        {
          lead_name,
          recipient_email: lead.email,
          subject,
          message,
        },
      ]);

    // Save activity
    await supabase
      .from("activities")
      .insert([
        {
          lead_name,
          action: `Email Sent: ${subject}`,
        },
      ]);

    return `Email sent successfully to ${lead_name}`;
  },
  {
    name: "send_email",
    description: "Send email to a CRM lead",
    schema: z.object({
      lead_name: z.string(),
      subject: z.string(),
      message: z.string(),
    }),
  }
);