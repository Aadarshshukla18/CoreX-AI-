import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { createCalendarEvent }from "../calendar";

export const createCalendarTool = tool(
  async ({
    title,
    startTime,
    endTime,
  }) => {

    const event =
      await createCalendarEvent(
        title,
        startTime,
        endTime
      );

    return JSON.stringify(event);
  },
  {
    name: "create_calendar_event",

    description:
      "Create Google Calendar meeting with Google Meet link",

    schema: z.object({
      title: z.string(),

      startTime: z.string(),

      endTime: z.string(),
    }),
  }
);