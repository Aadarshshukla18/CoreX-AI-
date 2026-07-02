export type WorkflowStep =
  | "find_lead"
  | "get_email"
  | "generate_email"
  | "preview_email"
  | "send_email"
  | "create_meeting"
  | "get_meetings"
  | "create_task"
  | "get_tasks";

export interface Workflow {

  name: string;

  steps: WorkflowStep[];
}

export const workflows: Record<string, Workflow> = {

  send_email: {

    name: "Send Email",

    steps: [
      "find_lead",
      "get_email",
      "generate_email",
      "preview_email",
      "send_email",
    ],
  },

  schedule_meeting: {

    name: "Meeting",

    steps: [
      "find_lead",
      "create_meeting",
    ],
  },

  create_followup: {

    name: "Follow Up",

    steps: [
      "find_lead",
      "create_task",
    ],
  },

};