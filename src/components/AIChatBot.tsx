'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Message = { role: 'user' | 'bot'; text: string };

const MASCOT_IMG = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778477060484-3bd4fa98-21df-4bd8-a3e5-d594a0770adf-Photoroom-cdJpoqggOK8fAIidR10p1NY2cIefcK.png';

const QUICK_REPLIES = [
  { q: 'रिठाला गाँव क्या है?', label: 'रिठाला गाँव' },
  { q: 'History', label: 'History' },
  { q: 'Latest events', label: 'Events' },
  { q: 'How to contact?', label: 'Contact' },
  { q: 'Reels', label: 'Reels' },
];

// Smart knowledge base — pattern -> reply
type Reply = { match: RegExp; reply: string };
const KNOWLEDGE: Reply[] = [
  {
    match: /(^|\W)(hi|hello|hey|namaste|नमस्ते|नमस्कार|राम राम|जय)/i,
    reply: 'राम राम जी 🙏 जय राजपूताना! मैं Rithala AI हूँ। आप मुझसे रिठाला गाँव, राजपूताना इतिहास, events, reels, या कैसे संपर्क करें — कुछ भी पूछ सकते हैं।',
  },
  {
    match: /(founder|founding|kisne banaya|kisne banaai|kab basa|kab basi|kis ne|राजपाल|founder|कौन था)/i,
    reply: 'रिठाला गाँव की नींव **राणा राजपाल सिंह** ने 1384-85 ईस्वी में रखी थी। वे तोमर चंद्रवंशी राजपूत वंश के साहसी योद्धा थे। पूरी history: /rithala-village-history/',
  },
  {
    match: /(year|kab|when|started|founded|established|sthapna|स्थापना|कब)/i,
    reply: 'रिठाला गाँव की स्थापना **1384-85 ईस्वी** में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था। 640+ साल पुराना इतिहास! 🏛️',
  },
  {
    match: /(lathi|लाठी|wala|वाला|prachin naam)/i,
    reply: 'रिठाला गाँव का प्राचीन नाम **"लाठी वाला"** था। यहाँ के लोग लाठी, भाला, तलवार चलाने में निपुण थे। गाँव की सुरक्षा क़िले से नहीं, योद्धाओं की बहादुरी से होती थी। ⚔️',
  },
  {
    match: /(puth|पूठ|kalan|कलां|ancestor|purvaj|पूर्वज)/i,
    reply: 'राणा राजपाल सिंह के पूर्वज **पूठ कलां** गाँव में रहते थे, जिसकी स्थापना 1048-49 ईस्वी में हुई थी। बाद में उन्होंने रिठाला बसाया।',
  },
  {
    match: /(tomar|तोमर|chandravanshi|चंद्रवंशी|rajput vansh|राजपूत वंश)/i,
    reply: 'रिठाला के राजपूत **तोमर चंद्रवंशी** हैं। तोमर वंश दिल्ली के प्राचीन शासकों में से एक है, जो अपनी वीरता और शौर्य के लिए प्रसिद्ध है।',
  },
  {
    match: /(history|itihas|इतिहास|story|kahani|कहानी)/i,
    reply: '📜 रिठाला गाँव का 640+ साल पुराना इतिहास पढ़ें: **/rithala-village-history/** — Tomar Rajput वंश, राणा राजपाल सिंह, लाठी वाला परंपरा, और पूठ कलां की पूरी कहानी।',
  },
  {
    match: /(contact|sampark|email|phone|address|संपर्क|पता)/i,
    reply: '📞 हमसे संपर्क करें: **/contact-location/** पर email, phone, location map, और direct message form है। या seedha email करें: rithalyarajput@gmail.com',
  },
  {
    match: /(location|where|kahan|कहाँ|address|पता)/i,
    reply: '📍 **Rithala Village, North-West Delhi** (Pin 110085)। नज़दीकी metro: Rithala Metro Station (Red Line)। Map देखें: /contact-location/',
  },
  {
    match: /(reel|video|वीडियो|short|insta video)/i,
    reply: '🎬 हमारी latest reels देखें: **/reels/** — Instagram aur YouTube shorts दोनों मिलेंगे। Homepage पर भी auto-play strip है।',
  },
  {
    match: /(event|कार्यक्रम|festival|त्यौहार|mela|मेला)/i,
    reply: '🎉 गाँव के सारे events: **/category/events/** — Kawad Yatra, festivals, religious aayojan सब cover होते हैं।',
  },
  {
    match: /(kawad|kanwar|कावड़|कांवड़|यात्रा)/i,
    reply: '🚩 **Kawad Yatra 2025** highlights: /category/kawad-yatra-2025/ | Kawad 2024: /category/kawad-yatra-2024/',
  },
  {
    match: /(temple|mandir|मंदिर|katyayani|jageshwar)/i,
    reply: '🏛️ रिठाला में कई पवित्र मंदिर हैं, जिनमें **श्री जागेश्वर नाथ कात्यायनी धाम** प्रसिद्ध है। Places gallery: /category/places/',
  },
  {
    match: /(post|blog|article|news|update|samachar|samachara)/i,
    reply: '📝 सारे blog posts: **/posts/** | Categories के हिसाब से देखें: /category/history/, /category/events/, /category/places/',
  },
  {
    match: /(about|kaun|who are you|aap kon)/i,
    reply: 'मैं **Rithala AI** हूँ 🚩 — रिठाला गाँव की official website का assistant। मुझे गाँव का इतिहास, events, reels, contact info सब पता है। About: /about/',
  },
  {
    match: /(thank|shukriya|dhanyavaad|धन्यवाद|शुक्रिया)/i,
    reply: 'आपका भी धन्यवाद! 🙏 जय राजपूताना! कुछ और जानना हो तो पूछिए।',
  },
  {
    match: /(bye|goodbye|alvida|अलविदा)/i,
    reply: 'राम राम जी! फिर मिलते हैं। 🚩 Rithala Update को visit करते रहिए!',
  },
  {
    match: /(admin|login|dashboard|kaise post|kaise add)/i,
    reply: '🔐 Admin panel: /admin/login | वहाँ से नए blog posts, reels, categories add कर सकते हैं।',
  },
  {
    match: /(install|app|download|pwa|mobile app)/i,
    reply: '📱 हाँ! Rithala Update को आप **app की तरह install** कर सकते हैं। Browser में "Install" prompt आएगा, या menu से "Add to Home Screen" चुनें।',
  },
  {
    match: /(seo|google|search|rank)/i,
    reply: '🔍 हमारी website full SEO optimized है — Google Search Console, structured data, sitemap, और fast loading सब set है।',
  },
];

function smartReply(text: string): string {
  for (const k of KNOWLEDGE) {
    if (k.match.test(text)) return k.reply;
  }
  // Fallback
  return 'मुझे आपका सवाल पूरी तरह समझ नहीं आया 🙏 आप ये topics try करें:\n\n• रिठाला गाँव का इतिहास\n• Founder कौन था?\n• Kawad Yatra\n• Reels / Events / Posts\n• Contact कैसे करें?\n\nया seedha email करें: rithalyarajput@gmail.com';
}

const WELCOME_MSGS = [
  '🚩 राम राम जी! जय राजपूताना!',
  'मैं **Rithala AI** हूँ — आपकी सेवा में 🙏',
  'रिठाला गाँव, इतिहास, events, reels या contact — कुछ भी पूछिए!',
];

export default function AIChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Don't render chatbot on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Send greeting messages one by one when chat opens for first time
  useEffect(() => {
    if (!open || hasGreeted) return;
    setHasGreeted(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= WELCOME_MSGS.length) {
        clearInterval(interval);
        return;
      }
      setMessages((m) => [...m, { role: 'bot', text: WELCOME_MSGS[i] }]);
      i++;
    }, 700);
    return () => clearInterval(interval);
  }, [open, hasGreeted]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: smartReply(msg) }]);
      setTyping(false);
    }, 700 + Math.random() * 600);
  }

  if (isAdminPage) return null;

  return (
    <>
      {!open && (
        <button
          className="ai-chat-mascot"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
        >
          <span className="ai-mascot-tooltip">
            🙏 जय राजपूताना!<br />Click to chat
          </span>
          <span className="ai-mascot-img-wrap">
            <img src={MASCOT_IMG} alt="Rithala AI Assistant" />
          </span>
          <span className="ai-mascot-pulse"></span>
        </button>
      )}

      {open && (
        <div className="ai-chat-window" role="dialog" aria-label="Chat with Rithala AI">
          <header className="ai-chat-header">
            <div className="ai-chat-avatar">
              <img src={MASCOT_IMG} alt="" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rithala AI</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                <span className="ai-online-dot"></span> Online · Ask anything
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="ai-chat-body">
            {messages.length === 0 && (
              <div className="ai-chat-msg ai-chat-msg-bot ai-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`ai-chat-msg ai-chat-msg-${m.role}`}
                dangerouslySetInnerHTML={{
                  __html: m.text
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/(\/[a-z0-9\-/]+\/?)/gi, '<a href="$1">$1</a>')
                    .replace(/\n/g, '<br/>'),
                }}
              />
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
              placeholder="अपना सवाल टाइप करें... (Hindi/English)"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
