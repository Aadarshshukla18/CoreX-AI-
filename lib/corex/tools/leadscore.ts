import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getLeadScoreTool = tool(
  async ({ lead_name }) => {

    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .ilike("name", `%${lead_name}%`)
      .limit(1);

    const lead = leads?.[0];

    if (!lead) {
      return `Lead "${lead_name}" not found.`;
    }

    let score = 0;

    if (lead.email) score += 20;
    if (lead.mobile) score += 20;
    if (lead.company) score += 10;

    if (lead.value > 50000) score += 30;
    else if (lead.value > 10000) score += 20;
    else score += 10;

    if (lead.status === "Won") score += 20;
    if (lead.status === "Qualified") score += 15;
    if (lead.status === "New") score += 5;

    let probability = Math.min(score, 100);

    let risk = "Low";
    if (probability < 40) risk = "High";
    else if (probability < 70) risk = "Medium";

    return `
📋 Lead Scoring Report

👤 Lead: ${lead.name}

🎯 Score: ${score}/100

📅 Probability To Close: ${probability}%

📱 Risk Level: ${risk}

🤖 Recommendation:
${
  risk === "High"
    ? "Immediate follow-up required."
    : risk === "Medium"
    ? "Schedule a call this week."
    : "Strong opportunity. Continue engagement."
}
`;
  },
  {
    name: "get_lead_score",
    description: "Calculate lead score and close probability",
    schema: z.object({
      lead_name: z.string(),
    }),
  }
);