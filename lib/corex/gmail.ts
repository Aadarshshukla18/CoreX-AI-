import { google } from "googleapis";

export const oauth2Client =
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/google/callback"
  );

oauth2Client.setCredentials({
  refresh_token:
    process.env.GOOGLE_REFRESH_TOKEN,
});


// =========================
// SEND EMAIL
// =========================

export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const htmlBody = body
  .replace(/\n\n/g, "<br><br>")
  .replace(/\n/g, "<br>");

  const message = [
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    `Subject: ${subject}`,
    "",
    htmlBody,
  ].join("\n");

  const encodedMessage = Buffer
    .from(message)
    .toString("base64url");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return "Email sent successfully";
}


// =========================
// READ INBOX
// =========================

export async function getInboxEmails() {
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const response =
    await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

  const messages =
    response.data.messages || [];

  const emails = [];

  for (const msg of messages) {
    const email =
      await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
      });

    const headers =
      email.data.payload?.headers || [];

    const subject =
      headers.find(
        (h) => h.name === "Subject"
      )?.value || "No Subject";

    const from =
      headers.find(
        (h) => h.name === "From"
      )?.value || "Unknown Sender";

    const date =
      headers.find(
        (h) => h.name === "Date"
      )?.value || "";

    emails.push({
      from,
      subject,
      date,
    });
  }

  return emails;
}



// =========================
// READ UNREAD EMAILS
// =========================

export async function getUnreadEmails() {
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const response =
    await gmail.users.messages.list({
      userId: "me",
      labelIds: ["UNREAD"],
      maxResults: 10,
    });

  const messages =
    response.data.messages || [];

  const emails = [];

  for (const msg of messages) {
    const email =
      await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
      });

    const headers =
      email.data.payload?.headers || [];

    const subject =
      headers.find(
        (h) => h.name === "Subject"
      )?.value || "No Subject";

    const from =
      headers.find(
        (h) => h.name === "From"
      )?.value || "Unknown Sender";

    emails.push({
      from,
      subject,
    });
  }

  return emails;
}

