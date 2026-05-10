'use client';

import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'bot'; text: string };

const QUICK_REPLIES = [
  { q: 'About Rithala', label: 'रिठाला के बारे में' },
  { q: 'Latest events', label: 'Events' },
  { q: 'Contact', label: 'Contact कैसे करें?' },
  { q: 'History', label: 'History' },
];

const KB: Record<string, string> = {
  rithala:
    'रिठाला गाँव दिल्ली के उत्तर-पश्चिम क्षेत्र में स्थित एक प्राचीन और ऐतिहासिक गाँव है, जो अपनी राजपूताना विरासत के लिए प्रसिद्ध है। 🚩',
  rajput:
    'राजपूताना का अर्थ है "राजपूतों की भूमि"। यह क्षेत्र वीरता, शौर्य और संस्कृति के लिए प्रसिद्ध है। ⚔️',
  history:
    'रिठाला का इतिहास सैकड़ों वर्ष पुराना है। आप /category/history/ पर पूरा इतिहास पढ़ सकते हैं। 📜',
  contact:
    'आप हमें Contact Us page से संपर्क कर सकते हैं या rithalyarajput@gmail.com पर email कर सकते हैं। 📧',
  events:
    'सभी latest events के लिए /category/events/ पर जाएँ। हम Kawad Yatra, festivals और कई events cover करते हैं। 🎉',
  reels:
    'Latest reels देखने के लिए /reels/ page पर जाएँ। 🎬',
  kawad: 'Kawad Yatra 2025 highlights के लिए /category/kawad-yatra-2025/ देखें। 🚩',
  hello:
    'नमस्ते जी! 🙏 मैं Rithala Update का AI assistant हूँ। बताइए, कैसे help करूँ?',
};

function findReply(text: string): string {
  const t = text.toLowerCase();
  if (/hi|hello|namaste|नमस्ते|हाय/.test(t)) return KB.hello;
  if (/contact|sampark|email|phone|संपर्क/.test(t)) return KB.contact;
  if (/event|कार्यक्रम/.test(t)) return KB.events;
  if (/reel|video|वीडियो/.test(t)) return KB.reels;
  if (/kawad|kanwar|कावड़|यात्रा/.test(t)) return KB.kawad;
  if (/history|itihas|इतिहास/.test(t)) return KB.history;
  if (/rajput|rajputana|राजपूत/.test(t)) return KB.rajput;
  if (/rithala|रिठाला|गाँव|gaon|village/.test(t)) return KB.rithala;
  return 'मुझे आपका सवाल पूरा समझ नहीं आया। आप ये topics try करें: रिठाला गाँव, History, Events, Reels, Contact, Kawad Yatra. 🙏';
}

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'नमस्ते! 🙏 मैं Rithala AI हूँ। आप मुझसे रिठाला गाँव, राजपूताना इतिहास, events या contact के बारे में पूछ सकते हैं।' },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: findReply(msg) }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
  }

  return (
    <>
      {!open && (
        <button
          className="ai-chat-mascot"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
        >
          <span className="ai-mascot-tooltip">
            नमस्ते जी! 🙏<br />Click to chat
          </span>
          <span className="ai-mascot-img-wrap">
            <img
              src="https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778402291026-4cf4f2a9-76c0-4609-a454-8283acead86b-Photoroom-eQUrNfKqGDinZB44ThrNwk1FEJVRSj.png"
              alt="Rithala Rajput AI assistant"
            />
          </span>
          <span className="ai-mascot-pulse"></span>
        </button>
      )}

      {open && (
        <div className="ai-chat-window" role="dialog" aria-label="Chat with Rithala AI">
          <header className="ai-chat-header">
            <div className="ai-chat-avatar">🚩</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rithala AI</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>● Online · आप हिंदी/English में पूछ सकते हैं</div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-msg ai-chat-msg-${m.role}`}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="ai-chat-msg ai-chat-msg-bot ai-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="ai-chat-quick">
            {QUICK_REPLIES.map((q, i) => (
              <button key={i} onClick={() => send(q.q)} className="ai-chat-chip">
                {q.label}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपना सवाल टाइप करें..."
              aria-label="Message"
            />
            <button type="submit" aria-label="Send">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
