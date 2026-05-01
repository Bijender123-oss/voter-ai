import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/firebase';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are VoteSmart AI, an expert Indian election education assistant. Your role is to:
- Educate Indian citizens about the election process, voter rights, and civic duties
- Guide first-time voters step-by-step through the voting process
- Explain required documents (Voter ID / EPIC card, Aadhaar, etc.)
- Clarify EVM (Electronic Voting Machine) usage
- Describe the Model Code of Conduct, Election Commission of India (ECI) functions
- Answer questions about Lok Sabha, Rajya Sabha, State Assembly elections
- Explain how to register as a voter (Form 6 on voters.eci.gov.in)
- Be encouraging, simple, accurate, and beginner-friendly
- Respond in the same language the user uses (Hindi or English)
- Keep responses concise but complete
- Use bullet points and numbered lists for clarity
- Never provide false information about elections`;

export async function askGemini(userMessage, chatHistory = []) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
      return getDemoResponse(userMessage);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const history = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood! I'm VoteSmart AI, ready to help Indian citizens learn about elections and voting. How can I assist you today?" }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getDemoResponse(userMessage);
  }
}

function getDemoResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('vote') || lower.includes('voting') || lower.includes('वोट')) {
    return `**How to Vote in India** 🗳️

Here are the steps to cast your vote:

1. **Check Voter Roll** – Verify your name on the Electoral Roll at voters.eci.gov.in
2. **Find Your Booth** – Locate your polling booth (printed on your Voter Slip)
3. **Carry ID** – Bring your Voter ID (EPIC) or any of the 12 alternative photo IDs
4. **Go to Booth** – Visit during polling hours (usually 7 AM – 6 PM)
5. **Get Inked** – Officer will mark indelible ink on your left index finger
6. **Press the Button** – Press the button on the EVM next to your chosen candidate
7. **VVPAT Slip** – Verify your vote on the VVPAT screen (visible for 7 seconds)

✅ Your vote is **secret** and **protected** by law!`;
  }

  if (lower.includes('document') || lower.includes('id') || lower.includes('documents') || lower.includes('दस्तावेज़')) {
    return `**Documents Required for Voting** 📋

**Primary ID (recommended):**
- 🪪 Voter ID Card (EPIC – Electoral Photo Identity Card)

**Alternative valid IDs (any ONE accepted):**
1. Aadhaar Card
2. Passport
3. Driving License
4. PAN Card (with photo)
5. MNREGA Job Card
6. Bank / Post Office Passbook (with photo)
7. Health Insurance Smart Card
8. Pension Documents (with photo)
9. Smart Card issued by RGI
10. Service ID (Government employees)
11. MP / MLA / MLC Official Identity Card
12. Unique Disability ID (UDID)

💡 **Tip:** Carry your Voter Slip given by booth officials + any one of the above.`;
  }

  if (lower.includes('register') || lower.includes('enroll') || lower.includes('registration') || lower.includes('पंजीकरण')) {
    return `**How to Register as a Voter** 📝

**Eligibility:**
- Indian citizen
- Age 18+ (as of 1st January of the registration year)
- Ordinary resident of that constituency

**Steps to Register:**
1. Visit **voters.eci.gov.in** or download the **Voter Helpline App**
2. Click on **"New Voter Registration"** → Fill **Form 6**
3. Upload: Proof of Age + Proof of Address (Aadhaar/Passport etc.)
4. Submit and note your **Application Reference Number**
5. BLO (Booth Level Officer) may visit for verification
6. Voter ID delivered to your address or downloadable as e-EPIC

**Offline Option:**
- Visit your nearest **Electoral Registration Office** with Form 6

🕐 Registration deadlines are notified before each election. Register early!`;
  }

  if (lower.includes('process') || lower.includes('election') || lower.includes('चुनाव')) {
    return `**Indian Election Process** 🇮🇳

The election process has **5 key phases:**

1. 📢 **Announcement** – Election Commission announces schedule; Model Code of Conduct kicks in
2. 📄 **Nomination** – Candidates file nomination papers with Returning Officer
3. 🎤 **Campaigning** – Parties campaign for 14 days before election day
4. 🗳️ **Voting Day** – Voters cast votes via EVM at polling booths
5. 📊 **Counting & Results** – Votes counted, winners declared, government formed

**Key Bodies:**
- **ECI** – Election Commission of India (independent constitutional body)
- **Returning Officer** – Conducts elections in each constituency
- **BLO** – Booth Level Officer manages voter lists

🔒 India uses **Electronic Voting Machines (EVMs)** with **VVPAT** verification for transparency.`;
  }

  return `**Welcome to VoteSmart AI!** 🇮🇳

I'm here to help you understand Indian elections and voting. You can ask me about:

- 🗳️ **How to vote** – Step-by-step voting guide
- 📋 **Documents required** – Valid IDs for voting
- 📝 **Voter registration** – How to enroll as a voter
- 🏛️ **Election process** – Announcement to results
- 📜 **Voter rights** – Your rights as a voter
- 🗺️ **Finding polling booth** – Locate your booth

> 💡 *Configure your Gemini API key in .env for full AI capabilities*

What would you like to know? Ask in **Hindi or English**! 🙏`;
}
