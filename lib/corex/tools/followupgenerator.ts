import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const generateFollowUpTool = tool(
  async ({
    lead_name,
    context,
  }) => {

    const email = `
Hi ${lead_name},

I hope you're doing well.

I wanted to follow up regarding our recent discussion.

${context}

Please let me know if you have any questions or would like to schedule another meeting.

Looking forward to hearing from you.

Best regards,
CoreBase Team
`;

    return email;
  },
  {
    name: "generate_followup",
    description:
      "Generate a professional follow-up email for a lead",

    schema: z.object({
      lead_name: z.string(),

      context: z.string().describe(
        "Summary of previous discussion"
      ),
    }),
  }
);