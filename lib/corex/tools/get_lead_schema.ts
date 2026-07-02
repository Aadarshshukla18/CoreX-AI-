import { tool } from "@langchain/core/tools";

export const getLeadSchemaTool = tool(
  async () => {
    return JSON.stringify([
      "name",
      "email",
      "mobile",
      "company",
      "status",
      "source",
      "value",
      "assigned_to",
    ]);
  },
  {
    name: "get_lead_schema",
    description: "Returns lead table columns",
  }
);