"use client";
import { Send, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type Message = {
  role: "user" | "assistant";
  text: string;

  emailPreview?: {
    to: string;
    subject: string;
    body: string;
  };
};

function EmailPreviewCard({
  to,
  subject,
  body,
  onSend,
  onEdit,
  onCancel,
}: {
  to: string;
  subject: string;
  body: string;
  onSend: () => void;
  onEdit: () => void;
  onCancel: () => void;
})

{
  return (
    <div className="bg-slate-800 border border-cyan-900/30 rounded-2xl p-4 w-full">
      <div className="mb-3">
        <p className="text-xs text-slate-400">
          TO
        </p>

        <p className="text-white">
          {to}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-400">
          SUBJECT
        </p>

        <p className="text-cyan-400 font-semibold">
          {subject}
        </p>
      </div>

<div className="bg-slate-900 rounded-xl p-3 text-sm text-slate-200 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
  {body}
</div>

<div className="flex gap-2 mt-4">
  <button
    onClick={onSend}
    className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl"
  >
    Send
  </button>

  <button
  onClick={onEdit}
  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2"
  >
  Edit
  </button>

  <button
  onClick={onCancel}
  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-2"
  >
  Cancel
  </button>
</div>
    </div>
  );
}

export default function CoreX() {
const [mounted, setMounted] = useState(false);
const [input, setInput] = useState("");
const [showScrollButton, setShowScrollButton] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);
const messagesContainerRef = useRef<HTMLDivElement>(null);
const [loading, setLoading] = useState(false);
const [voiceMode, setVoiceMode] = useState(false);
const [showEmailEditor, setShowEmailEditor] =
  useState(false);

const [editingEmail, setEditingEmail] =
  useState({
    to: "",
    subject: "",
    body: "",
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hi! I'm CoreX. Ask me anything about your CRM.",
    },
  ]);

  const sendEmailFromPreview = async (
  leadName: string,
  subject: string,
  body: string
) => {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const response = await fetch("/api/corex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Send email to ${leadName}
Subject: ${subject}

${body}`,
        userId: user?.id,
        userEmail: user?.email,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: data.reply,
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

const editEmailPreview = (
  to: string,
  subject: string,
  body: string
) => {
  setEditingEmail({
    to,
    subject,
    body,
  });

  setShowEmailEditor(true);
};

const cancelEmailPreview = (
  index: number
) => {
  setMessages((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  scrollToBottom();
}, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: messageText,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "❌ Please login first.",
          },
        ]);
        return;
      }

      const response = await fetch("/api/corex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        const errorText = await response.text();

        console.error("API Error:", errorText);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `❌ API Error: ${response.status}`,
          },
        ]);

        return;
      }
      const data = await response.json();

console.log("RAW REPLY:", data.reply);

try {
  const parsed = JSON.parse(data.reply);

  if (parsed.type === "email_preview") {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "",
        emailPreview: {
          to: parsed.to,
          subject: parsed.subject,
          body: parsed.body,
        },
      },
    ]);

    setLoading(false);
    return;
  }
} catch (err) {
  console.log("Not an email preview");
}

setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    text: data.reply,
  },
]);

setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Network Error",
        },
      ]);
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      sendMessage(transcript);
    }
  }, [listening, transcript]);

const startListening = () => {
  setVoiceMode(true);

  resetTranscript();

  SpeechRecognition.startListening({
    continuous: false,
    language: "en-US",
  });
};
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
};

const handleScroll = () => {
  const container = messagesContainerRef.current;

  if (!container) return;

  const isNearBottom =
    container.scrollHeight -
      container.scrollTop -
      container.clientHeight <
    100;

  setShowScrollButton(!isNearBottom);
};

  if (!mounted) {
    return null;
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-500 p-4">
        Browser does not support speech recognition.
      </div>
    );
  }

  return (
    <div className="relative w-[450px] h-screen bg-[#07111f] border-l border-cyan-900/20 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-cyan-900/20">
        <h1 className="text-3xl font-bold text-white">
          CoreX AI
        </h1>

        <p className="text-cyan-400">
          Your CRM Assistant
        </p>
      </div>

      {/* Messages */}
      <div
  ref={messagesContainerRef}
  onScroll={handleScroll}
  className="flex-1 overflow-y-auto p-5 space-y-4"
>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "flex justify-end"
                : "flex"
            }
          >
            <div
  className={
    msg.emailPreview
      ? "max-w-[95%]"
      : msg.role === "user"
      ? "bg-cyan-600 rounded-2xl p-4 max-w-[85%]"
      : "bg-slate-800 rounded-2xl p-4 max-w-[85%]"
  }
>
  {msg.emailPreview ? (
  <EmailPreviewCard
  to={msg.emailPreview!.to}
  subject={msg.emailPreview!.subject}
  body={msg.emailPreview!.body}

  onSend={() =>
    sendEmailFromPreview(
      msg.emailPreview!.to,
      msg.emailPreview!.subject,
      msg.emailPreview!.body
    )
  }

  onEdit={() =>
  editEmailPreview(
    msg.emailPreview!.to,
    msg.emailPreview!.subject,
    msg.emailPreview!.body
  )
}

  onCancel={() =>
    cancelEmailPreview(index)
  }
/>
) : (
  <div
  className="
    text-white
    prose
    prose-invert
    max-w-none

    prose-headings:text-cyan-400
    prose-headings:font-bold

    prose-strong:text-white
    prose-p:text-slate-200

    prose-ul:text-slate-200
    prose-li:marker:text-cyan-400

    prose-code:text-cyan-300
  "
>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {msg.text}
  </ReactMarkdown>
</div>
)}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
        {loading && (
  <div className="flex">
    <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">

      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>

      <span className="text-slate-300 text-sm">
        Thinking...
      </span>

    </div>
  </div>
)}
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setInput("Show my leads")}
            className="bg-slate-800 text-white rounded-xl p-3 hover:bg-slate-700"
          >
            Show Leads
          </button>

          < button
            onClick={() => setInput("Show today's tasks")}
            className="bg-slate-800 text-white rounded-xl p-3 hover:bg-slate-700"
          >
            Today's Tasks
          </button>

          <button
            onClick={() => setInput("Show open deals")}
            className="bg-slate-800 text-white rounded-xl p-3 hover:bg-slate-700"
          >
            Open Deals
          </button>

          <button
            onClick={() => setInput("Create a new lead")}
            className="bg-slate-800 text-white rounded-xl p-3 hover:bg-slate-700"
          >
            Create Lead
          </button>
        </div>

        {listening && (
          <div className="text-green-400 text-sm mb-2">
            🎤 Listening...
          </div>
        )}

        {showScrollButton && (
  <button
    onClick={scrollToBottom}
    className="
      absolute
      bottom-24
      right-6
      w-10
      h-10
      rounded-full
      bg-slate-800
      hover:bg-slate-700
      text-white
      shadow-lg
      flex
      items-center
      justify-center
      z-50
    "
  >
    ↓
  </button>
)}

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Ask CoreX..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
          />

<button
  onClick={startListening}
  className="
    text-slate-400
    hover:text-cyan-400
    transition-colors
    px-2
    flex
    items-center
    justify-center
  "
>
<Mic
  size={30}
  className={
    listening
      ? "text-green-400 animate-pulse"
      : ""
  }
/>

</button>
          <button
            onClick={handleSend}
            className="bg-cyan-500 hover:bg-cyan-400 rounded-xl px-4"
          >
            <Send className="h-5 w-5 text-black" />
          </button>
        </div>
            </div>

      {showEmailEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-slate-900 w-[700px] rounded-2xl p-6 border border-cyan-800">

            <h2 className="text-white text-xl font-bold mb-4">
              Edit Email
            </h2>

            <input
              value={editingEmail.to}
              readOnly
              className="w-full mb-3 p-3 rounded-lg bg-slate-800 text-white"
            />

            <input
              value={editingEmail.subject}
              onChange={(e) =>
                setEditingEmail({
                  ...editingEmail,
                  subject: e.target.value,
                })
              }
              className="w-full mb-3 p-3 rounded-lg bg-slate-800 text-white"
            />

            <textarea
              rows={15}
              value={editingEmail.body}
              onChange={(e) =>
                setEditingEmail({
                  ...editingEmail,
                  body: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-slate-800 text-white"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={async () => {

                  await sendEmailFromPreview(
                  editingEmail.to,
                  editingEmail.subject,
                  editingEmail.body
                );

                 setShowEmailEditor(false);
               }}
                className="bg-green-600 px-5 py-2 rounded-xl text-white"
              >
                Send
              </button>

              <button
                onClick={() => setShowEmailEditor(false)}
                className="bg-red-600 px-5 py-2 rounded-xl text-white"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}