import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "../../supabase";

export const getTasksTool = tool(
  async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "get_tasks",
    description: "Get all CRM tasks",
    schema: z.object({}),
  }
);

export const createTaskTool = tool(
  async ({ title, due_date }) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          due_date,
          status: "Pending",
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "create_task",
    description: "Create a CRM task",
    schema: z.object({
      title: z.string(),
      due_date: z.string(),
    }),
  }
);

export const completeTaskTool = tool(
  async ({ id }) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "Completed",
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return JSON.stringify(data);
  },
  {
    name: "complete_task",
    description: "Mark a task as completed",
    schema: z.object({
      id: z.number(),
    }),
  }
);

