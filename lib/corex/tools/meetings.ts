import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { formatMeeting } from "../formatter";

export const getMeetingsTool = tool(
  async () => {

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_time", {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return "📅 No meetings scheduled.";
    }

    return data
      .map((meeting) => formatMeeting(meeting))
      .join("\n\n");
  },
  {
    name: "get_meetings",
    description: "Get all scheduled meetings",
    schema: z.object({}),
  }
);