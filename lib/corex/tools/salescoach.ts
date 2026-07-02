import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getSalesCoachTool = tool(
  async () => {
    const { data: leads } = await supabase
      .from("leads")
      .select("*");

    const { data: deals } = await supabase
      .from("deals")
      .select("*");

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*");

    return JSON.stringify({
      leads,
      deals,
      tasks,
    });
  },
  {
    name: "get_sales_coach",
    description: "Get CRM data for AI sales coaching",
    schema: z.object({}),
  }
);