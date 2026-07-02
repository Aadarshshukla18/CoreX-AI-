import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const generateEmailTool = tool(
  async ({ lead_name, purpose }) => {
   const generatedSubject =
  `Following Up Regarding ${purpose}`;

const generatedBody = `
Dear ${lead_name},

I hope you are doing well.

I wanted to follow up regarding ${purpose} and discuss how CoreBase can help streamline your business operations.

Our platform helps businesses manage leads, automate workflows, track customer interactions, and improve team productivity.

I would be happy to schedule a brief call to understand your requirements and demonstrate how CoreBase can help.

Please let me know a convenient time for a discussion.

Best Regards,
CoreBase Team
`;

const cleanBody = generatedBody
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .replace(/json/g, "")
  .trim();

   return JSON.stringify({
  type: "email_preview",
  to: lead_name,
  subject: generatedSubject,
  body: cleanBody,
});

  },
  {
    name: "generate_email",
    description:
"Generate a business email preview as JSON. Use this whenever the user asks to write, generate, compose, draft or create an email.",
    schema: z.object({
      lead_name: z.string(),
      purpose: z.string(),
    }),
  }
);