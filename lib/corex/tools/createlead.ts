import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const createLeadTool = tool(
  async ({
    name,
    email,
    phone,
    company,
    source,
    value,
  }) => {
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,

          mobile: phone,

          company: company || null,

          status: "New",

          source: source || "CoreX AI",

          value: value || 0,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    await supabase
      .from("activities")
      .insert([
        {
          lead_name: name,
          action: "Lead Created",
        },
      ]);

    return `Lead ${name} created successfully`;
  },
  {
    name: "create_lead",

    description: `
Create a CRM lead.

Required:
- name
- email
- phone

Optional:
- company
- source
- value
`,
    schema: z.object({
      name: z.string(),

      email: z.string(),

      phone: z.string(),

      company: z.string().optional(),

      source: z.string().optional(),

      value: z.number().optional(),
    }),
  }
);