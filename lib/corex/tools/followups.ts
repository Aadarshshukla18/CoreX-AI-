import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getFollowUpsTool = tool(
  async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("status", "New");

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "get_followups",
    description: "Get leads needing follow-up",
    schema: z.object({}),
  }
);