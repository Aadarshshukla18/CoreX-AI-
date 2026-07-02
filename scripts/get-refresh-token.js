require("dotenv").config({
  path: ".env.local",
});

const { google } = require("googleapis");
const readline = require("readline");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "\nPaste the code parameter from callback URL here:\n",
  async (code) => {
    try {
      const { tokens } =
        await oauth2Client.getToken(code);

      console.log("\n====================");
      console.log("ACCESS TOKEN:");
      console.log(tokens.access_token);

      console.log("\nREFRESH TOKEN:");
      console.log(tokens.refresh_token);

      console.log("\n====================");
      console.log(
        "Copy REFRESH TOKEN into .env.local"
      );

      rl.close();
    } catch (error) {
      console.error(error);
      rl.close();
    }
  }
);