import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getActivitiesTool = tool(
  async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "get_activities",
    description: "Get CRM activity timeline",
    schema: z.object({}),
  }
);