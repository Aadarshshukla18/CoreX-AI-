import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const updateLeadTool = tool(
  async ({ lead_name, field, value }) => {
    const { error } = await supabase
      .from("leads")
      .update({
        [field]: value,
      })
      .eq("name", lead_name);

    if (error) {
      throw new Error(error.message);
    }

    return `${lead_name} updated successfully`;
  },
  {
    name: "update_lead",
    description: "Update a lead in the CRM",
    schema: z.object({
      lead_name: z.string(),
      field: z.string(),
      value: z.string(),
    }),
  }
);