import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { formatLeadInsights } from "../formatter";
import { updateContext } from "../context";
export const getLeadInsightsTool = tool(
  async ({ lead_name, user_id }) => {

    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .ilike("name", `%${lead_name}%`)
      .limit(1);

    const lead = leads?.[0];

    if (!lead) {
      return `Lead "${lead_name}" not found.`;
    }
    updateContext(user_id, {
    currentLead: lead,
});

    let score = 50;

    if (lead.email) score += 10;
    if (lead.mobile) score += 10;
    if (lead.status === "New") score += 5;
    if (lead.value && lead.value > 10000) score += 15;

    let health = "Cold";

    if (score >= 80) health = "Hot 🔥";
    else if (score >= 60) health = "Warm 🟡";

return formatLeadInsights(
    lead,
    score,
    health
);
  },
  {
    name: "get_lead_insights",
    description: "Analyze a lead and generate AI insights",
    schema: z.object({
  lead_name: z.string(),
  user_id: z.string(),
}),
  }
);