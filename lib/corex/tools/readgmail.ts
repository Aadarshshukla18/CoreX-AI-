import { tool } from "@langchain/core/tools";
import { getInboxEmails } from "../gmail";

export const readGmailTool = tool(
  async () => {
    const emails = await getInboxEmails();

    return JSON.stringify(emails);
  },
  {
    name: "read_gmail",

    description:
      "Read the user's Gmail inbox",
  }
);