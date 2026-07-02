import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { formatLeadReport } from "../formatter";
import { updateContext } from "../context";
export const getLeadReportTool = tool(
  async ({ lead_name, user_id }) => {
    console.log("Lead Name Received:", lead_name);

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
return formatLeadReport(lead);

  },
  {
    name: "get_lead_report",
    description: "Get detailed report for a specific lead",
    schema: z.object({
      lead_name: z.string(),
      user_id: z.string(),
    }),
  }
);