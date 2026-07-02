import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getMemoryTool = tool(
  async (_, config) => {
    const user_id = config?.configurable?.user_id;

    if (!user_id) {
      throw new Error("No user_id found");
    }

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return JSON.stringify(data);
  },
  {
    name: "get_memory",

    description:
      "Retrieve memories for the current logged-in user.",

    schema: z.object({}),
  }
);