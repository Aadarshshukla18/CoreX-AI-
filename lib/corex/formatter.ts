export function formatLeadReport(lead: any) {
  return `
# 📋 Lead Report

## 👤 ${lead.name}

🏢 **Company:** ${lead.company || "Not Provided"}

📧 **Email:** ${lead.email || "Not Provided"}

📱 **Mobile:** ${lead.mobile || "Not Provided"}

🚦 **Status:** ${lead.status || "New"}

⭐ **Lead Score:** ${lead.score || "75"}/100

📅 **Created:** ${
    lead.created_at
      ? new Date(lead.created_at).toLocaleDateString()
      : "-"
  }

---

## 🤖 AI Recommendation

✅ Follow up within **48 hours**

📨 Send a personalized email

📞 Schedule a meeting

🎯 High conversion potential
`;
}

export function formatLeadInsights(lead: any, score: number, health: string) {
  return `
# 🤖 AI Lead Insights

## 👤 ${lead.name}

🏢 **Company:** ${lead.company || "Not Provided"}

📧 **Email:** ${lead.email || "Not Provided"}

📱 **Mobile:** ${lead.mobile || "Not Provided"}

🚦 **Status:** ${lead.status || "New"}

⭐ **Health Score:** ${score}/100

🔥 **Lead Health:** ${health}

💰 **Deal Value:** ₹${lead.value || 0}

---

## 💡 AI Recommendations

✅ Contact within **24 hours**

📧 Send a personalized email

📅 Schedule a follow-up meeting

🎯 High chance of conversion
`;
}

export function formatMeeting(meeting: any) {
  return `
# 📅 Meeting Details

📝 **Title:** ${meeting.title}

👤 **Attendee:** ${meeting.attendee}

🕒 **Time:** ${meeting.meeting_time}

📌 **Status:** ${meeting.status}

---

💡 **Reminder**

⏰ Join 10 minutes early.

📄 Keep proposal ready.

🤝 Be prepared for discussion.
`;
}

export function formatCRMReport(summary: any) {
  return `
# 📊 CRM Dashboard

👥 **Total Leads:** ${summary.totalLeads}

🔥 **Hot Leads:** ${summary.hotLeads}

💼 **Open Deals:** ${summary.openDeals}

💰 **Pipeline:** ₹${summary.pipeline}

📅 **Today's Meetings:** ${summary.meetings}

✅ **Pending Tasks:** ${summary.tasks}

---

## 🤖 AI Insights

📈 Lead generation is improving.

⚠️ Some follow-ups are overdue.

🚀 Focus on Hot Leads first.
`;
}

export function formatLeads(leads: any[]) {
  if (!leads || leads.length === 0) {
    return `❌ No leads found.`;
  }

  return `
# **👥 Your CRM Leads (${leads.length})**

${leads
  .map(
    (lead, index) => `
    _________________________

## 👤 **${lead.name}**

🏢 **Company:** ${lead.company || "Not Provided"}

📧 **Email:** ${lead.email || "Not Provided"}

📱 **Mobile:** ${lead.mobile || lead.phone || "Not Provided"}

🚦 **Status:** ${lead.status || "New"}

⭐ **Lead Score:** ${lead.score ?? "N/A"}

📅 **Created:** ${
      lead.created_at
        ? new Date(lead.created_at).toLocaleDateString()
        : "-"
    }
`
  )
  .join("\n")}
`;
}