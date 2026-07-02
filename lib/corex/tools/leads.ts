import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { formatLeads } from "../formatter";

export const getLeadsTool = tool(
  async () => {
    console.log("GET LEADS TOOL CALLED");

    const { data, error } = await supabase
      .from("leads")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return formatLeads(data);
  },
  {
    name: "get_leads",
    description: "Get all CRM leads",
    schema: z.object({}),
  }
);