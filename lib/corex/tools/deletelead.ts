import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const deleteLeadTool = tool(
  async ({ lead_name }) => {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("name", lead_name);

    if (error) {
      throw new Error(error.message);
    }

    await supabase
      .from("activities")
      .insert([
        {
          lead_name,
          action: "Lead Deleted",
        },
      ]);

    return `${lead_name} deleted successfully`;
  },
  {
    name: "delete_lead",
    description: "Delete a CRM lead",
    schema: z.object({
      lead_name: z.string(),
    }),
  }
);