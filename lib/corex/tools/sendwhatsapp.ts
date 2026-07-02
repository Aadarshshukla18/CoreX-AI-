import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const sendWhatsAppTool = tool(
  async ({ phone, message }) => {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    return JSON.stringify(data);
  },
  {
    name: "send_whatsapp",
    description: "Send WhatsApp message",
    schema: z.object({
      phone: z.string(),
      message: z.string(),
    }),
  }
);