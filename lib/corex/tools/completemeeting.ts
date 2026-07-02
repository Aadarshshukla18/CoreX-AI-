import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const completeMeetingTool = tool(
  async ({ meeting_id }) => {

    const { error } = await supabase
      .from("meetings")
      .update({
        status: "Completed",
      })
      .eq("id", meeting_id);

    if (error) {
      throw new Error(error.message);
    }

    return `Meeting ${meeting_id} marked as completed`;
  },
  {
    name: "complete_meeting",
    description: "Mark a meeting as completed",
    schema: z.object({
      meeting_id: z.number(),
    }),
  }
);