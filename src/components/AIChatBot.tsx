'use client';

import React, { useState, useRef, useEffect } from 'react';
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

const ROOT_MENU: Option[] = [
  { label: 'रिठाला का इतिहास', value: 'history' },
  { label: 'राजपूताना', value: 'rajputana' },
  { label: 'Events & Festivals', value: 'events' },
  { label: 'Sandeep Rajput कौन हैं?', value: 'sandeep' },
];

type TopicReply = { reply: string; next?: Option[] };

const TREE: Record<string, TopicReply> = {
  history: {
    reply: 'रिठाला गाँव की स्थापना **1384-85 ईस्वी** में हुई थी — 640+ साल पुराना इतिहास। आप क्या जानना चाहते हैं?',
    next: [
      { label: 'Founder कौन था?', value: 'history_founder' },
      { label: 'लाठी वाला नाम क्यों?', value: 'history_lathi' },
      { label: 'पूठ कलां क्या है?', value: 'history_puth' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  history_founder: {
    reply: 'गाँव की नींव **राणा राजपाल सिंह** ने रखी थी। वे **तोमर चंद्रवंशी राजपूत** वंश के साहसी योद्धा थे — दिल्ली के शासकों में से एक।',
    next: [
      { label: 'तोमर वंश के बारे में', value: 'history_tomar' },
      { label: 'लाठी वाला नाम क्यों?', value: 'history_lathi' },
      { label: 'पूरा history पढ़ें', value: 'history_full' },
    ],
  },
  history_lathi: {
    reply: 'रिठाला का प्राचीन नाम **"लाठी वाला"** था। यहाँ के लोग लाठी, भाला, तलवार चलाने में निपुण थे — यही इस गाँव की पहचान थी।',
    next: [
      { label: 'Founder कौन था?', value: 'history_founder' },
      { label: 'राजपूताना वीरता', value: 'rajputana_veerta' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  history_puth: {
    reply: '**पूठ कलां** राणा राजपाल सिंह का पैतृक गाँव था, जिसकी स्थापना 1048-49 ईस्वी में हुई थी — रिठाला से भी पुराना।',
    next: [
      { label: 'Founder कौन था?', value: 'history_founder' },
      { label: 'पूरा history पढ़ें', value: 'history_full' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  history_tomar: {
    reply: '**तोमर वंश** चंद्रवंशी राजपूतों का प्राचीन वंश है। ये दिल्ली के शुरुआती शासकों में गिने जाते हैं — बहादुर और स्वाभिमानी।',
    next: [
      { label: 'राजपूताना के बारे में', value: 'rajputana' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  history_full: {
    reply: 'पूरा detailed history यहाँ पढ़ें — /rithala-village-history/',
    next: [
      { label: 'Founder कौन था?', value: 'history_founder' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  rajputana: {
    reply: '**राजपूताना** का अर्थ है "राजपूतों की भूमि"। रिठाला इसी गौरवशाली परंपरा का हिस्सा है। क्या जानना है?',
    next: [
      { label: 'वीरता की कहानी', value: 'rajputana_veerta' },
      { label: 'सांस्कृतिक परंपराएँ', value: 'rajputana_culture' },
      { label: 'तोमर वंश', value: 'history_tomar' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  rajputana_veerta: {
    reply: 'रिठाला के राजपूत सदियों से अपनी मातृभूमि की रक्षा के लिए तत्पर रहे। लाठी, तलवार और भाले में माहिर — यही इनकी पहचान थी।',
    next: [
      { label: 'लाठी वाला नाम', value: 'history_lathi' },
      { label: 'सांस्कृतिक परंपराएँ', value: 'rajputana_culture' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  rajputana_culture: {
    reply: 'गाँव में पीढ़ी-दर-पीढ़ी त्यौहार, धार्मिक आयोजन, मेले और Kawad Yatra बड़े धूमधाम से मनाए जाते हैं।',
    next: [
      { label: 'Events देखें', value: 'events' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  events: {
    reply: 'रिठाला में पूरे साल events होते हैं। सबसे बड़ा आयोजन है **Kawad Yatra** — हर साल हजारों लोग शामिल होते हैं।',
    next: [
      { label: 'Kawad Yatra 2025', value: 'posts_kawad' },
      { label: 'Temple events', value: 'events_temple' },
      { label: 'Festivals', value: 'events_festivals' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  events_festivals: {
    reply: 'Diwali, Holi, Janmashtami — सब बड़े उत्साह से मनाते हैं। गाँव में एकजुटता और भाईचारे की मिसाल देखने को मिलती है।',
    next: [
      { label: 'Kawad Yatra 2025', value: 'posts_kawad' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  events_temple: {
    reply: 'श्री **जागेश्वर नाथ कात्यायनी धाम** में नियमित धार्मिक आयोजन होते हैं। यह गाँव का सबसे पवित्र स्थल है।',
    next: [
      { label: 'Events देखें', value: 'events' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  posts_kawad: {
    reply: 'Kawad Yatra 2025 की सभी photos और updates यहाँ देखें — /blog/?category=kawad-yatra-2025',
    next: [
      { label: 'Events देखें', value: 'events' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  contact: {
    reply: 'हमसे जुड़ने के तरीके:\n**Email:** rithalyarajput@gmail.com\n**Location:** Rithala Village, North-West Delhi (Pin 110085)\n**Metro:** Rithala — Red Line',
    next: [
      { label: 'Contact form खोलें', value: 'contact_form' },
      { label: 'Social media', value: 'contact_social' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  contact_form: {
    reply: 'Contact form यहाँ भरें — /contact-location/ — हम 24-48 घंटे में reply करते हैं।',
    next: [{ label: 'Main menu', value: 'menu' }],
  },
  contact_social: {
    reply: 'हमें social media पर follow करें:\n**Instagram:** @rithala_update\n**YouTube:** @rithala_update\n**Facebook:** Rithala Update',
    next: [{ label: 'Main menu', value: 'menu' }],
  },
  reels: {
    reply: 'हमारे Instagram Reels और YouTube Shorts यहाँ देखें — /reels/ — गाँव की ताज़ी झलकियाँ।',
    next: [
      { label: 'Blog posts', value: 'posts' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  posts: {
    reply: 'Blog posts यहाँ पढ़ें — /blog/ — category, author, date से filter करें। History, Events, Places सब available हैं।',
    next: [
      { label: 'Kawad Yatra posts', value: 'posts_kawad' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  menu: {
    reply: 'बताइए, क्या जानना चाहते हैं?',
    next: ROOT_MENU,
  },
  sandeep: {
    reply: '**Sandeep Rajput** (online पर **Rithalya Rajput**) — Rithala Update के founder हैं। Rithala Village, Delhi के 18 साल के digital creator, website developer और artist। उन्होंने **15 August 2022** को यह website launch की।',
    next: [
      { label: 'Education क्या है?', value: 'sandeep_edu' },
      { label: 'क्या काम करते हैं?', value: 'sandeep_work' },
      { label: 'Website क्यों बनाई?', value: 'sandeep_why' },
      { label: 'Full profile देखें', value: 'sandeep_full' },
    ],
  },
  sandeep_edu: {
    reply: 'Sandeep ने **Rana Pratap Government Boys Senior Secondary School, Rithala** से schooling की। Lockdown में drawing और design सीखा — और वहीं से creative journey शुरू हुई।',
    next: [
      { label: 'Creative works देखें', value: 'sandeep_works' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  sandeep_works: {
    reply: 'Sandeep के pencil sketches में हैं — **Maharana Pratap, Little Krishna, Little Ram, Karan Aujla, Virat Kohli**। साथ ही website development, social media और digital branding में भी expert हैं।',
    next: [
      { label: 'Full profile देखें', value: 'sandeep_full' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  sandeep_work: {
    reply: 'Sandeep website development, social media handling, digital promotions और creative designing करते हैं। यह पूरी website उन्होंने खुद design और develop की है।',
    next: [
      { label: 'Creative works देखें', value: 'sandeep_works' },
      { label: 'Website क्यों बनाई?', value: 'sandeep_why' },
    ],
  },
  sandeep_why: {
    reply: 'Vision था — Rithala Village को एक strong digital identity देना। एक ऐसा platform जहाँ लोग अपनी culture, community और local updates से जुड़े रहें।',
    next: [
      { label: 'Full profile देखें', value: 'sandeep_full' },
      { label: 'Main menu', value: 'menu' },
    ],
  },
  sandeep_full: {
    reply: 'Sandeep Rajput का पूरा profile यहाँ पढ़ें — /sandeep-rajput/',
    next: [{ label: 'Main menu', value: 'menu' }],
  },
};

// Render message: **bold** -> <strong>, /path/ -> link, \n -> <br>
function renderMsg(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\n|\/[a-z0-9\-/]+\/)/gi);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part === '\n') return <br key={i} />;
    if (/^\/[a-z0-9\-/]+\/$/.test(part)) return <a key={i} href={part}>{part}</a>;
    return part;
  });
}

function plainText(t: string): string {
  return t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\/[a-z0-9-/]+\//gi, '').replace(/\n/g, ' ').trim();
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(plainText(text));
    const voices = window.speechSynthesis.getVoices();
    const hi = voices.find((v) => v.lang.startsWith('hi')) || voices.find((v) => v.lang.startsWith('en-IN')) || voices[0];
    if (hi) utter.voice = hi;
    utter.lang = hi?.lang || 'hi-IN';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {}
}

export default function AIChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);

  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (!open || hasGreeted) return;
    setHasGreeted(true);
    setTimeout(() => {
      setMessages([{
        role: 'bot',
        text: 'Jai Rajputana! Main Rithala AI hun — Rithala Village ka digital assistant. Aap kya jaanna chahte hain?',
        options: ROOT_MENU,
      }]);
    }, 300);
  }, [open, hasGreeted]);

  function botReply(reply: string, options?: Option[]) {
    setMessages((m) => [...m, { role: 'bot', text: reply, options }]);
    if (voiceOn) speak(reply);
  }

  function handleOption(value: string, label: string) {
    setMessages((m) => [...m, { role: 'user', text: label }]);
    setTyping(true);
    setTimeout(() => {
      const topic = TREE[value];
      botReply(topic ? topic.reply : 'Is topic ke baare mein abhi jaankari nahi hai.', topic?.next ?? ROOT_MENU);
      setTyping(false);
    }, 400 + Math.random() * 300);
  }

  function handleTextSend(textOverride?: string) {
    const msg = (textOverride ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      let topicKey = '';
      if (/sandeep|rithalya|founder|owner|creator|kisne banaya|who made|about you|about me|biography|kon hai|कौन है|बनाया|संदीप|रिठाल्या/i.test(msg)) topicKey = 'sandeep';
      else if (/sketch|drawing|art|pencil/i.test(msg)) topicKey = 'sandeep_works';
      else if (/school|college|education|study/i.test(msg)) topicKey = 'sandeep_edu';
      else if (/history|itihas|इतिहास|purana|स्थापना/i.test(msg)) topicKey = 'history';
      else if (/rajput|राजपूत|rajputana|veerta/i.test(msg)) topicKey = 'rajputana';
      else if (/reel|video|वीडियो/i.test(msg)) topicKey = 'reels';
      else if (/contact|email|sampark|संपर्क|address|location|kahan|कहाँ/i.test(msg)) topicKey = 'contact';
      else if (/event|कार्यक्रम|festival|kawad|kanwar/i.test(msg)) topicKey = 'events';
      else if (/blog|post|article|news/i.test(msg)) topicKey = 'posts';
      else if (/founder|राजपाल|rana rajpal/i.test(msg)) topicKey = 'history_founder';
      else if (/lathi|लाठी/i.test(msg)) topicKey = 'history_lathi';
      else if (/puth|पूठ|kalan/i.test(msg)) topicKey = 'history_puth';
      else if (/tomar|तोमर/i.test(msg)) topicKey = 'history_tomar';
      else if (/hi|hello|namaste|नमस्ते|ram ram|jai/i.test(msg.toLowerCase())) topicKey = 'menu';

      const topic = TREE[topicKey];
      if (topic) {
        botReply(topic.reply, topic.next);
      } else {
        botReply('Mujhe aapka sawaal poori tarah samajh nahi aaya. Neeche se koi option chunein ya email karein: rithalyarajput@gmail.com', ROOT_MENU);
      }
      setTyping(false);
    }, 500 + Math.random() * 400);
  }

  function toggleVoice() {
    if (!voiceOn) {
      setVoiceOn(true);
      speak('Voice on. Main aapke sawalon ke jawab bolkar dunga.');
    } else {
      setVoiceOn(false);
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    }
  }

  function toggleListen() {
    const SR = (typeof window !== 'undefined') &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) { alert('Voice input aapke browser mein nahi chalta. Chrome/Edge use karein.'); return; }
    if (listening) {
      try { recogRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const recog = new SR();
    recog.lang = 'hi-IN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setListening(false);
      handleTextSend(text);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
  }

  if (isAdminPage) return null;

  return (
    <>
      {!open && (
        <button
          className="ai-chat-mascot"
          onClick={() => setOpen(true)}
          aria-label="Open Rithala AI chat"
        >
          <span className="ai-mascot-tooltip">
            Rithala AI — Click to chat
          </span>
          <span className="ai-mascot-img-wrap">
            <img src={MASCOT_IMG} alt="Rithala AI" />
          </span>
          <span className="ai-mascot-pulse"></span>
        </button>
      )}

      {open && (
        <div className="ai-chat-window" role="dialog" aria-label="Rithala AI Chat">
          <header className="ai-chat-header">
            <div className="ai-chat-avatar-plain">
              <img src={MASCOT_IMG} alt="Rithala AI" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rithala AI</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                <span className="ai-online-dot"></span> Online
              </div>
            </div>
            <button
              className={`ai-voice-toggle ${voiceOn ? 'on' : ''}`}
              onClick={toggleVoice}
              aria-label={voiceOn ? 'Mute voice' : 'Enable voice'}
              title={voiceOn ? 'Voice on' : 'Enable voice'}
            >
              {voiceOn ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              )}
            </button>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </header>

          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div key={i} className="ai-chat-msg-wrap">
                <div className={`ai-chat-row ai-chat-row-${m.role}`}>
                  {m.role === 'bot' && (
                    <span className="ai-msg-avatar-plain">
                      <img src={MASCOT_IMG} alt="" />
                    </span>
                  )}
                  <div className={`ai-chat-msg ai-chat-msg-${m.role}`}>
                    {renderMsg(m.text)}
                  </div>
                </div>
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
              <div className="ai-chat-row ai-chat-row-bot">
                <span className="ai-msg-avatar-plain">
                  <img src={MASCOT_IMG} alt="" />
                </span>
                <div className="ai-chat-msg ai-chat-msg-bot ai-chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(e) => { e.preventDefault(); handleTextSend(); }}
          >
            <button
              type="button"
              className={`ai-mic-btn ${listening ? 'listening' : ''}`}
              onClick={toggleListen}
              aria-label={listening ? 'Stop' : 'Voice input'}
            >
              {listening ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Sun raha hun...' : 'Kuch puchein...'}
              aria-label="Message"
              disabled={listening}
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
