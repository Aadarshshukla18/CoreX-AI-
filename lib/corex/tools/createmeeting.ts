import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const createMeetingTool = tool(
  async ({
    attendee,
    title,
    meeting_time,
  }) => {

    const { error } = await supabase
      .from("meetings")
      .insert([
        {
          attendee,
          title,
          meeting_time,
          status: "Scheduled",
        },
      ]);

    if (error) {
      throw new Error(error.message);
    }

    return `
📅Meeting Scheduled

👤Attendee: ${attendee}

💡Title: ${title}

🕒Meeting Time:
${meeting_time}

📌Status:
Scheduled
`;
  },

  {
    name: "create_meeting",

    description: "Create a meeting",

    schema: z.object({
      attendee: z.string(),
      title: z.string(),
      meeting_time: z.string(),
    }),
  }
);