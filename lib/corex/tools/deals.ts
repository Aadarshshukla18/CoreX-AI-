import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getDealsTool = tool(
  async () => {
    console.log("GET DEALS TOOL CALLED");

    const { data, error } = await supabase
      .from("deals")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "get_deals",
    description: "Get all CRM deals",
    schema: z.object({}),
  }
);