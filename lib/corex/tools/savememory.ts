import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const saveMemoryTool = tool(
  async ({ memory }, config) => {
    const user_id = config?.configurable?.user_id;

    if (!user_id) {
      throw new Error("No user_id found");
    }

    const { error } = await supabase
      .from("memories")
      .insert({
        user_id,
        memory,
      });

    if (error) throw error;

    return `Memory saved: ${memory}`;
  },
  {
    name: "save_memory",

    description:
      "Save important information about the current logged-in user.",

    schema: z.object({
      memory: z.string(),
    }),
  }
);