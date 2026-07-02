import { tool } from "@langchain/core/tools";
import { supabase } from "../../supabase";

export const getEmailsTool = tool(
  async () => {
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "get_emails",
    description: "Show sent emails",
  }
);