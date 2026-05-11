'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Message = {
  role: 'user' | 'bot';
  text: string;
  options?: Option[];
};

type Option = {
  label: string;
  value: string;
};

const MASCOT_IMG = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778477060484-3bd4fa98-21df-4bd8-a3e5-d594a0770adf-Photoroom-cdJpoqggOK8fAIidR10p1NY2cIefcK.png';

// Top-level menu shown on welcome
const ROOT_MENU: Option[] = [
  { label: '🏛️ रिठाला का इतिहास', value: 'history' },
  { label: '🚩 राजपूताना', value: 'rajputana' },
  { label: '🎬 Reels & Videos', value: 'reels' },
  { label: '📍 Location & Contact', value: 'contact' },
  { label: '📝 Blog Posts', value: 'posts' },
  { label: '🎉 Events', value: 'events' },
];

// Reply tree — each topic gives a reply AND optional follow-up options
type TopicReply = {
  reply: string;
  next?: Option[];
};

const TREE: Record<string, TopicReply> = {
  // ===== HISTORY =====
  history: {
    reply: '📜 रिठाला गाँव का इतिहास 640+ साल पुराना है। आप क्या जानना चाहते हैं?',
    next: [
      { label: '📅 गाँव कब बसा?', value: 'history_year' },
      { label: '👑 Founder कौन था?', value: 'history_founder' },
      { label: '🥢 लाठी वाला नाम क्यों?', value: 'history_lathi' },
      { label: '🏘️ पूठ कलां क्या है?', value: 'history_puth' },
      { label: '📖 पूरा history page', value: 'history_full' },
    ],
  },
  history_year: {
    reply: '🗓️ रिठाला गाँव की स्थापना **1384-85 ईस्वी** में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था। 640+ साल पुराना इतिहास है!',
    next: [
      { label: '👑 Founder कौन था?', value: 'history_founder' },
      { label: '🥢 लाठी वाला नाम', value: 'history_lathi' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  history_founder: {
    reply: '👑 गाँव की नींव **राणा राजपाल सिंह** ने रखी थी। वे **तोमर चंद्रवंशी राजपूत** वंश के साहसी योद्धा थे। उन्होंने पूठ कलां से रिठाला की नींव रखी।',
    next: [
      { label: '🏘️ पूठ कलां क्या है?', value: 'history_puth' },
      { label: '⚔️ तोमर वंश', value: 'history_tomar' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  history_lathi: {
    reply: '🥢 रिठाला का प्राचीन नाम **"लाठी वाला"** था। यहाँ के लोग लाठी, भाला, तलवार चलाने में निपुण थे। गाँव की सुरक्षा क़िले से नहीं, योद्धाओं की बहादुरी से होती थी।',
    next: [
      { label: '⚔️ राजपूताना वीरता', value: 'rajputana' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  history_puth: {
    reply: '🏘️ **पूठ कलां** राणा राजपाल सिंह का पैतृक गाँव था, जिसकी स्थापना 1048-49 ईस्वी में हुई थी। बाद में उन्होंने नई बस्ती बसाकर रिठाला की नींव रखी।',
    next: [
      { label: '👑 Founder कौन था?', value: 'history_founder' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  history_tomar: {
    reply: '⚔️ **तोमर वंश** चंद्रवंशी राजपूतों का प्राचीन वंश है, जो दिल्ली के शासकों में रहे हैं। उनकी वीरता और शौर्य की कहानियाँ आज भी प्रसिद्ध हैं।',
    next: [
      { label: '🚩 राजपूताना', value: 'rajputana' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  history_full: {
    reply: '📖 पूरा detailed history यहाँ पढ़ें: **/rithala-village-history/** — 640+ साल का सफर, सभी chapters with timeline।',
    next: [
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },

  // ===== RAJPUTANA =====
  rajputana: {
    reply: '🚩 **राजपूताना** का अर्थ है "राजपूतों की भूमि"। रिठाला इसी विरासत का जीवंत प्रमाण है।',
    next: [
      { label: '🛡️ वीरता की कहानी', value: 'rajputana_veerta' },
      { label: '🎨 सांस्कृतिक परंपराएँ', value: 'rajputana_culture' },
      { label: '⚔️ तोमर वंश', value: 'history_tomar' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  rajputana_veerta: {
    reply: '🛡️ रिठाला के राजपूत हमेशा अपनी मातृभूमि की रक्षा के लिए तैयार रहे। लाठी, तलवार और धनुष-बाण लेकर मोर्चा संभालते थे। यही गाँव की पहचान बनी।',
    next: [
      { label: '🥢 लाठी वाला', value: 'history_lathi' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  rajputana_culture: {
    reply: '🎨 गाँव में पीढ़ी-दर-पीढ़ी त्यौहार, धार्मिक आयोजन, मेले और पारंपरिक रस्में निभाई जाती हैं। भाईचारा और एकता सबसे बड़ी ताकत है।',
    next: [
      { label: '🎉 Events देखें', value: 'events' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },

  // ===== REELS =====
  reels: {
    reply: '🎬 हम Instagram reels और YouTube shorts share करते हैं। Homepage पर auto-play strip है।',
    next: [
      { label: '▶ All Reels देखें', value: 'reels_all' },
      { label: '📷 Instagram', value: 'social_ig' },
      { label: '▶ YouTube', value: 'social_yt' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  reels_all: {
    reply: '▶ सारे reels यहाँ देखें: **/reels/** — Instagram + YouTube दोनों।',
    next: [
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },

  // ===== CONTACT =====
  contact: {
    reply: '📞 आप 4 तरीकों से हमसे जुड़ सकते हैं:',
    next: [
      { label: '📧 Email', value: 'contact_email' },
      { label: '📍 Location/Map', value: 'contact_loc' },
      { label: '📝 Direct Form', value: 'contact_form' },
      { label: '🌐 Social Media', value: 'contact_social' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  contact_email: {
    reply: '📧 हमें email करें: **rithalyarajput@gmail.com** — हम 24-48 घंटे में जवाब देते हैं।',
    next: [
      { label: '📝 Form से message भेजें', value: 'contact_form' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  contact_loc: {
    reply: '📍 **Rithala Village, North-West Delhi (Pin 110085)**\nनज़दीकी metro: **Rithala Metro Station** (Red Line)\nMap देखें: **/contact-location/**',
    next: [
      { label: '🗺️ Google Maps', value: 'contact_maps' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  contact_maps: {
    reply: '🗺️ Google Maps पर Rithala Village search करें या contact page पर embedded map देखें: **/contact-location/**',
    next: [
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  contact_form: {
    reply: '📝 हमारे contact page पर एक form है जहाँ आप directly message भेज सकते हैं: **/contact-location/** — सीधे admin inbox में जाएगा।',
    next: [
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  contact_social: {
    reply: '🌐 आप हमें social media पर follow कर सकते हैं:',
    next: [
      { label: '📷 Instagram', value: 'social_ig' },
      { label: '📘 Facebook', value: 'social_fb' },
      { label: '▶ YouTube', value: 'social_yt' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  social_ig: {
    reply: '📷 Instagram: **@rithala_update** — daily reels, photos, और updates!',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  social_fb: {
    reply: '📘 Facebook page पर हमें follow करें — सारे events और news मिलेंगे।',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  social_yt: {
    reply: '▶ YouTube channel: **@rithala_update** — videos और shorts।',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },

  // ===== POSTS =====
  posts: {
    reply: '📝 हमारे blog posts categories में organize हैं:',
    next: [
      { label: '📜 History posts', value: 'posts_history' },
      { label: '🎉 Events posts', value: 'posts_events' },
      { label: '🏛️ Places posts', value: 'posts_places' },
      { label: '🤝 Brotherhood', value: 'posts_brotherhood' },
      { label: '🚩 Kawad Yatra', value: 'posts_kawad' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  posts_history: {
    reply: '📜 History posts: **/category/history/**',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  posts_events: {
    reply: '🎉 Events posts: **/category/events/**',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  posts_places: {
    reply: '🏛️ Places gallery: **/category/places/** — temples, landmarks, photos।',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  posts_brotherhood: {
    reply: '🤝 Brotherhood posts: **/category/brotherhood/** — गाँव की एकता और संस्कृति।',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  posts_kawad: {
    reply: '🚩 Kawad Yatra posts:\n• 2025: **/category/kawad-yatra-2025/**\n• 2024: **/category/kawad-yatra-2024/**',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },

  // ===== EVENTS =====
  events: {
    reply: '🎉 गाँव में पूरे साल events होते हैं:',
    next: [
      { label: '🚩 Kawad Yatra 2025', value: 'posts_kawad' },
      { label: '🪔 Festivals', value: 'events_festivals' },
      { label: '🏛️ Temple events', value: 'events_temple' },
      { label: '📅 सारे events', value: 'posts_events' },
      { label: '↩️ Main menu', value: 'menu' },
    ],
  },
  events_festivals: {
    reply: '🪔 गाँव में Diwali, Holi, Janmashtami, और कई festivals बड़े उत्साह से मनाते हैं। Photos: **/category/events/**',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },
  events_temple: {
    reply: '🏛️ Temple events: श्री जागेश्वर नाथ कात्यायनी धाम में नियमित आयोजन होते हैं। Places: **/category/places/**',
    next: [{ label: '↩️ Main menu', value: 'menu' }],
  },

  // ===== MENU =====
  menu: {
    reply: '🚩 जय राजपूताना! बताइए क्या जानना चाहते हैं?',
    next: ROOT_MENU,
  },
};

export default function AIChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  // Welcome sequence on first open
  useEffect(() => {
    if (!open || hasGreeted) return;
    setHasGreeted(true);
    setTimeout(() => {
      setMessages([{ role: 'bot', text: '🚩 राम राम जी! जय राजपूताना!' }]);
    }, 200);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: 'मैं **Rithala AI** हूँ — आपकी सेवा में 🙏' }]);
    }, 900);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'बताइए, आप किस बारे में जानना चाहते हैं?',
          options: ROOT_MENU,
        },
      ]);
    }, 1700);
  }, [open, hasGreeted]);

  function handleOption(value: string, label: string) {
    setMessages((m) => [...m, { role: 'user', text: label }]);
    setTyping(true);
    setTimeout(() => {
      const topic = TREE[value];
      if (topic) {
        setMessages((m) => [
          ...m,
          { role: 'bot', text: topic.reply, options: topic.next },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: 'bot', text: 'अभी इस topic के बारे में जानकारी नहीं है।', options: ROOT_MENU },
        ]);
      }
      setTyping(false);
    }, 600 + Math.random() * 500);
  }

  function handleTextSend() {
    const msg = input.trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      // Try keyword routing
      const lower = msg.toLowerCase();
      let topicKey = '';
      if (/history|itihas|इतिहास/i.test(msg)) topicKey = 'history';
      else if (/rajput|राजपूत/i.test(msg)) topicKey = 'rajputana';
      else if (/reel|video|वीडियो/i.test(msg)) topicKey = 'reels';
      else if (/contact|email|sampark|संपर्क/i.test(msg)) topicKey = 'contact';
      else if (/event|कार्यक्रम|festival/i.test(msg)) topicKey = 'events';
      else if (/post|blog|article|news/i.test(msg)) topicKey = 'posts';
      else if (/founder|राजपाल|founded|kaun/i.test(msg)) topicKey = 'history_founder';
      else if (/kab|when|year|saal|स्थापना/i.test(msg)) topicKey = 'history_year';
      else if (/lathi|लाठी/i.test(msg)) topicKey = 'history_lathi';
      else if (/puth|पूठ|kalan/i.test(msg)) topicKey = 'history_puth';
      else if (/location|where|kahan|कहाँ|address|पता/i.test(msg)) topicKey = 'contact_loc';
      else if (/hi|hello|namaste|नमस्ते|राम/i.test(lower)) topicKey = 'menu';

      const topic = TREE[topicKey];
      if (topic) {
        setMessages((m) => [...m, { role: 'bot', text: topic.reply, options: topic.next }]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text: 'मुझे आपका सवाल पूरी तरह समझ नहीं आया 🙏 नीचे से कोई option चुनें या email करें: rithalyarajput@gmail.com',
            options: ROOT_MENU,
          },
        ]);
      }
      setTyping(false);
    }, 700 + Math.random() * 500);
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
            {messages.map((m, i) => (
              <div key={i} className="ai-chat-msg-wrap">
                <div
                  className={`ai-chat-msg ai-chat-msg-${m.role}`}
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/(\/[a-z0-9\-/]+\/?)/gi, '<a href="$1">$1</a>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
                {m.options && m.options.length > 0 && (
                  <div className="ai-chat-options">
                    {m.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleOption(opt.value, opt.label)}
                        className="ai-chat-option-btn"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="ai-chat-msg ai-chat-msg-bot ai-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleTextSend();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question or click an option..."
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
