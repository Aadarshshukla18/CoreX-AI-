import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getFollowupRiskTool = tool(
  async () => {

    const today =
      new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("followups")
      .select("*")
      .lte("followup_date", today)
      .eq("status", "Pending");

    if (!data?.length) {
      return "No pending follow-ups.";
    }

    return `
Pending Follow-Ups

${data
  .map(
    (lead) =>
      `• ${lead.lead_name}
Follow-up Date: ${lead.followup_date}`
  )
  .join("\n\n")}
`;
  },

  {
    name: "get_followup_risk",

    description:
      "Get all overdue followups",

    schema: z.object({}),
  }
);