export async function planUserRequest(message: string) {
  const text = message.toLowerCase();

  if (
    text.includes("email") ||
    text.includes("mail")
  ) {
    return {
      intent: "send_email",
      steps: [
        "find_lead",
        "generate_email",
        "preview_email",
        "send_email",
      ],
    };
  }

  if (
    text.includes("meeting") ||
    text.includes("schedule")
  ) {
    return {
      intent: "meeting",
      steps: [
        "find_lead",
        "check_calendar",
        "create_meeting",
      ],
    };
  }

  if (
    text.includes("lead insight") ||
    text.includes("insight")
  ) {
    return {
      intent: "lead_insight",
      steps: [
        "find_lead",
        "analyze_lead",
      ],
    };
  }

  return {
    intent: "chat",
    steps: [],
  };
}