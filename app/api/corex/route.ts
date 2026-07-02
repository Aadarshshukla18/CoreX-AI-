import { HumanMessage } from "@langchain/core/messages";
import { agent } from "@/lib/corex/graph";

export async function POST(req: Request) {
  try {
    const {
      message,
      userId,
      userEmail,
    } = await req.json();

    

    const result = await agent.invoke(
      {
        messages: [
          new HumanMessage(message),
        ],
      },
      {
        configurable: {
          thread_id: userId,
          user_id: userId,
          user_email: userEmail,
        },
      }
    );

    const lastMessage =
  result.messages[result.messages.length - 1];

let reply = "";

if (typeof lastMessage.content === "string") {
  reply = lastMessage.content;
} else if (Array.isArray(lastMessage.content)) {
  reply = lastMessage.content
    .map((item: any) => item.text || "")
    .join("");
}

return Response.json({ reply });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json(
      {
        error: error?.message || "CoreX Failed",
      },
      {
        status: 500,
      }
    );
  }
}

