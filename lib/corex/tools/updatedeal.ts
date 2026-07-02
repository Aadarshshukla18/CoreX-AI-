import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const updateDealStageTool = tool(
  async ({ dealId, stage }) => {
    const { data, error } = await supabase
      .from("deals")
      .update({ stage })
      .eq("id", dealId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "update_deal_stage",
    description: "Update a deal stage to Open, Won or Lost",
    schema: z.object({
      dealId: z.number(),
      stage: z.enum(["Open", "Won", "Lost"]),
    }),
  }
);