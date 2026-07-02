import { google } from "googleapis";
import { oauth2Client } from "./gmail";

export async function createCalendarEvent(
  summary: string,
  startTime: string,
  endTime: string
) {
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const event = await calendar.events.insert({
    calendarId: "primary",

    requestBody: {
      summary,

      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },

      conferenceData: {
        createRequest: {
          requestId: Date.now().toString(),
        },
      },
    },

    conferenceDataVersion: 1,
  });

  return {
    eventId: event.data.id,
    meetLink: event.data.hangoutLink,
  };
}