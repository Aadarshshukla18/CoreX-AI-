import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getDashboardTool = tool(
  async () => {
    const { count: leadCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    const { count: taskCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    const { count: dealCount } = await supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("stage", "Open");

    const { data: deals } = await supabase
      .from("deals")
      .select("value");

    const pipelineValue =
      deals?.reduce((sum, deal) => sum + Number(deal.value || 0), 0) || 0;

    return JSON.stringify({
      total_leads: leadCount || 0,
      pending_tasks: taskCount || 0,
      open_deals: dealCount || 0,
      pipeline_value: pipelineValue,
    });
  },
  {
    name: "get_dashboard",
    description: "Get CRM dashboard metrics",
    schema: z.object({}),
  }
);