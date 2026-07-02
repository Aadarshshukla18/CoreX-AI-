import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const deleteMeetingTool = tool(
  async ({ meeting_name }) => {

    const { data: meetings } = await supabase
      .from("meetings")
      .select("*")
      .ilike("title", `%${meeting_name}%`)
      .limit(1);

    const meeting = meetings?.[0];

    if (!meeting) {
      return `❌ Meeting "${meeting_name}" not found.`;
    }

    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", meeting.id);

    if (error) {
      throw new Error(error.message);
    }

    return `
✅ Meeting Deleted Successfully

📅 Title: ${meeting.title}

👤 Attendee: ${meeting.attendee}

🕒 Time: ${meeting.meeting_time}
`;
  },
  {
    name: "delete_meeting",
    description:
      "Delete a meeting from CRM using its title",
    schema: z.object({
      meeting_name: z.string(),
    }),
  }
);