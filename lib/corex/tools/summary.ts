import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";
import { formatCRMReport } from "../formatter";

export const crmSummaryTool = tool(
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

    const totalLeads = leads?.length || 0;
    const totalDeals = deals?.length || 0;
    const totalTasks = tasks?.length || 0;

    const openDeals =
      deals?.filter((d) => d.stage === "Open").length || 0;

    const wonDeals =
      deals?.filter((d) => d.stage === "Won").length || 0;

    const pendingTasks =
      tasks?.filter((t) => t.status === "Pending").length || 0;

    const pipelineValue =
      deals?.reduce(
        (sum, d) => sum + (d.value || 0),
        0
      ) || 0;

    const summary = {
      totalLeads,
      totalDeals,
      openDeals,
      wonDeals,
      pendingTasks,
      pipelineValue
    };

    return formatCRMReport(summary);
  },
  {
    name: "crm_summary",
    description:
      "Get CRM dashboard summary statistics",
    schema: z.object({}),
  }
);