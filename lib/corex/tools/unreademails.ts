import { tool } from "@langchain/core/tools";
import { getUnreadEmails } from "../gmail";

export const unreadEmailsTool = tool(
  async () => {
    const emails = await getUnreadEmails();

    return JSON.stringify({
      unread_count: emails.length,
      emails,
    });
  },
  {
    name: "get_unread_emails",
    description: "Get unread Gmail emails",
  }
);