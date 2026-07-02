import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const createDealTool = tool(
  async ({ name, value }) => {
    const { data, error } = await supabase
      .from("deals")
.insert([
  {
    client_name: name,
    value,
    stage: "Open",
  },
])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "create_deal",
    description: "Create a CRM deal",
    schema: z.object({
      name: z.string(),
      value: z.number(),
    }),
  }
);

