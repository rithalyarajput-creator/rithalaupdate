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
  { label: ' रिठाला का इतिहास', value: 'history' },
  { label: ' राजपूताना', value: 'rajputana' },
  { label: ' Reels & Videos', value: 'reels' },
  { label: ' Location & Contact', value: 'contact' },
  { label: ' Blog Posts', value: 'posts' },
  { label: ' Events', value: 'events' },
  { label: ' Sandeep Rajput कौन हैं?', value: 'sandeep' },
];

type TopicReply = { reply: string; next?: Option[] };

const TREE: Record<string, TopicReply> = {
  history: {
    reply: ' रिठाला गाँव का इतिहास 640+ साल पुराना है। आप क्या जानना चाहते हैं?',
    next: [
      { label: ' गाँव कब बसा?', value: 'history_year' },
      { label: ' Founder कौन था?', value: 'history_founder' },
      { label: ' लाठी वाला नाम क्यों?', value: 'history_lathi' },
      { label: ' पूठ कलां क्या है?', value: 'history_puth' },
      { label: ' पूरा history page', value: 'history_full' },
    ],
  },
  history_year: {
    reply: ' रिठाला गाँव की स्थापना **1384-85 ईस्वी** में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था।',
    next: [
      { label: ' Founder कौन था?', value: 'history_founder' },
      { label: ' लाठी वाला नाम', value: 'history_lathi' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  history_founder: {
    reply: ' गाँव की नींव **राणा राजपाल सिंह** ने रखी थी। वे **तोमर चंद्रवंशी राजपूत** वंश के साहसी योद्धा थे।',
    next: [
      { label: ' पूठ कलां क्या है?', value: 'history_puth' },
      { label: ' तोमर वंश', value: 'history_tomar' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  history_lathi: {
    reply: ' रिठाला का प्राचीन नाम **"लाठी वाला"** था। यहाँ के लोग लाठी, भाला, तलवार चलाने में निपुण थे।',
    next: [
      { label: ' राजपूताना वीरता', value: 'rajputana' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  history_puth: {
    reply: ' **पूठ कलां** राणा राजपाल सिंह का पैतृक गाँव था, जिसकी स्थापना 1048-49 ईस्वी में हुई थी।',
    next: [
      { label: ' Founder कौन था?', value: 'history_founder' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  history_tomar: {
    reply: ' **तोमर वंश** चंद्रवंशी राजपूतों का प्राचीन वंश है, जो दिल्ली के शासकों में रहे हैं।',
    next: [
      { label: ' राजपूताना', value: 'rajputana' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  history_full: {
    reply: ' पूरा detailed history यहाँ पढ़ें: **/rithala-village-history/**',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
  rajputana: {
    reply: ' **राजपूताना** का अर्थ है "राजपूतों की भूमि"।',
    next: [
      { label: ' वीरता की कहानी', value: 'rajputana_veerta' },
      { label: ' सांस्कृतिक परंपराएँ', value: 'rajputana_culture' },
      { label: ' तोमर वंश', value: 'history_tomar' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  rajputana_veerta: {
    reply: ' रिठाला के राजपूत हमेशा अपनी मातृभूमि की रक्षा के लिए तैयार रहे।',
    next: [
      { label: ' लाठी वाला', value: 'history_lathi' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  rajputana_culture: {
    reply: ' गाँव में पीढ़ी-दर-पीढ़ी त्यौहार, धार्मिक आयोजन, मेले निभाए जाते हैं।',
    next: [
      { label: ' Events देखें', value: 'events' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  reels: {
    reply: ' हम Instagram reels और YouTube shorts share करते हैं।',
    next: [
      { label: ' All Reels देखें', value: 'reels_all' },
      { label: ' Instagram', value: 'social_ig' },
      { label: ' YouTube', value: 'social_yt' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  reels_all: {
    reply: ' सारे reels: **/reels/**',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
  contact: {
    reply: ' आप 4 तरीकों से जुड़ सकते हैं:',
    next: [
      { label: ' Email', value: 'contact_email' },
      { label: ' Location/Map', value: 'contact_loc' },
      { label: ' Direct Form', value: 'contact_form' },
      { label: ' Social Media', value: 'contact_social' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  contact_email: {
    reply: ' Email करें: **rithalyarajput@gmail.com**  24-48 घंटे में reply।',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
  contact_loc: {
    reply: ' **Rithala Village, North-West Delhi (Pin 110085)**\nMetro: Rithala (Red Line)\nMap: **/contact-location/**',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
  contact_form: {
    reply: ' Contact form यहाँ: **/contact-location/**',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
  contact_social: {
    reply: ' हमें social पर follow करें:',
    next: [
      { label: ' Instagram', value: 'social_ig' },
      { label: ' Facebook', value: 'social_fb' },
      { label: ' YouTube', value: 'social_yt' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  social_ig: { reply: ' Instagram: **@rithala_update**', next: [{ label: ' Main menu', value: 'menu' }] },
  social_fb: { reply: ' Facebook page पर follow करें।', next: [{ label: ' Main menu', value: 'menu' }] },
  social_yt: { reply: ' YouTube: **@rithala_update**', next: [{ label: ' Main menu', value: 'menu' }] },
  posts: {
    reply: ' Blog posts देखें: **/blog/**  category, author, date से filter करें।',
    next: [
      { label: ' History posts', value: 'posts_history' },
      { label: ' Events posts', value: 'posts_events' },
      { label: ' Places posts', value: 'posts_places' },
      { label: ' Kawad Yatra', value: 'posts_kawad' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  posts_history: { reply: ' History posts: **/blog/?category=history**', next: [{ label: ' Main menu', value: 'menu' }] },
  posts_events: { reply: ' Events posts: **/blog/?category=events**', next: [{ label: ' Main menu', value: 'menu' }] },
  posts_places: { reply: ' Places gallery: **/blog/?category=places**', next: [{ label: ' Main menu', value: 'menu' }] },
  posts_kawad: { reply: ' Kawad Yatra: **/blog/?category=kawad-yatra-2025**', next: [{ label: ' Main menu', value: 'menu' }] },
  events: {
    reply: ' गाँव में पूरे साल events होते हैं:',
    next: [
      { label: ' Kawad Yatra 2025', value: 'posts_kawad' },
      { label: ' Festivals', value: 'events_festivals' },
      { label: ' Temple events', value: 'events_temple' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  events_festivals: { reply: ' Diwali, Holi, Janmashtami सब बड़े उत्साह से मनाते हैं।', next: [{ label: ' Main menu', value: 'menu' }] },
  events_temple: { reply: ' श्री जागेश्वर नाथ कात्यायनी धाम में नियमित आयोजन होते हैं।', next: [{ label: ' Main menu', value: 'menu' }] },
  menu: {
    reply: ' जय राजपूताना! बताइए क्या जानना चाहते हैं?',
    next: ROOT_MENU,
  },
  sandeep: {
    reply: ' **Sandeep Rajput** (जिन्हें online पर **Rithalya Rajput** के नाम से जाना जाता है) Rithala Update के founder हैं। वे Rithala Village, Delhi के 18 साल के digital creator, website developer, artist और social media designer हैं। उन्होंने **15 August 2022** को Rithala Update launch किया था।',
    next: [
      { label: ' Education', value: 'sandeep_edu' },
      { label: ' Creative works', value: 'sandeep_works' },
      { label: ' क्या करते हैं?', value: 'sandeep_work' },
      { label: ' क्यों बनाया Rithala Update?', value: 'sandeep_why' },
      { label: ' Full About Me page', value: 'sandeep_full' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  sandeep_edu: {
    reply: ' Sandeep Rajput ने **Rana Pratap Government Boys Senior Secondary School, Rithala, New Delhi** से schooling पूरी की है। उन्होंने lockdown के दौरान drawing और design skills पर बहुत focus किया।',
    next: [
      { label: ' Creative works', value: 'sandeep_works' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  sandeep_works: {
    reply: ' उनके सबसे बेहतरीन pencil sketches में हैं  **Maharana Pratap**, **Little Krishna**, **Little Ram**, **Karan Aujla** और **Virat Kohli** के sketch। वे website development, social media management, creative designing और digital branding पर भी काम करते हैं।',
    next: [
      { label: ' More about Sandeep', value: 'sandeep' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  sandeep_work: {
    reply: ' Sandeep Rajput website development, social media handling, digital promotions और creative designing करते हैं। उन्होंने ये पूरी Rithala Update website खुद design और develop की है, और Instagram, YouTube channels को भी खुद manage करते हैं।',
    next: [
      { label: ' Creative works', value: 'sandeep_works' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  sandeep_why: {
    reply: ' Rithala Update बनाने के पीछे एक simple vision था  Rithala Village को एक strong digital identity देना और एक ऐसा platform बनाना जहाँ लोग अपनी culture, community और local updates से connected रहें। पहले Instagram और social media पर content share होता था, फिर 15 August 2022 को website launch हुई।',
    next: [
      { label: ' Full About Me page', value: 'sandeep_full' },
      { label: ' Main menu', value: 'menu' },
    ],
  },
  sandeep_full: {
    reply: ' पूरा detailed About Me page यहाँ पढ़ें: **/sandeep-rajput/**',
    next: [{ label: ' Main menu', value: 'menu' }],
  },
};

// Render message text: **bold** -> <strong>, /path/ -> <a>, \n -> <br>
function renderMsg(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\n|\/[a-z0-9\-/]+\/)/gi);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part === '\n') return <br key={i} />;
    if (/^\/[a-z0-9\-/]+\/$/.test(part)) {
      return <a key={i} href={part}>{part}</a>;
    }
    return part;
  });
}

// Strip markdown/HTML for clean voice text
function plainText(t: string): string {
  return t
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\/[a-z0-9-]+\//gi, '')
    .replace(/[]/g, '')
    .trim();
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(plainText(text));
    // Try Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const hi = voices.find((v) => v.lang.startsWith('hi')) || voices.find((v) => v.lang.startsWith('en-IN')) || voices[0];
    if (hi) utter.voice = hi;
    utter.lang = hi?.lang || 'hi-IN';
    utter.rate = 0.95;
    utter.pitch = 1.0;
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

  // Pre-load voices (some browsers need this)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (!open || hasGreeted) return;
    setHasGreeted(true);
    setTimeout(() => {
      setMessages([{ role: 'bot', text: ' राम राम जी! जय राजपूताना!' }]);
    }, 200);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: 'मैं **Rithala AI** हूँ  आपकी सेवा में ' }]);
    }, 900);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'बताइए, आप किस बारे में जानना चाहते हैं?', options: ROOT_MENU },
      ]);
    }, 1700);
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
      if (topic) {
        botReply(topic.reply, topic.next);
      } else {
        botReply('अभी इस topic के बारे में जानकारी नहीं है।', ROOT_MENU);
      }
      setTyping(false);
    }, 500 + Math.random() * 400);
  }

  function handleTextSend(textOverride?: string) {
    const msg = (textOverride ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let topicKey = '';
      if (/sandeep|rithalya|founder|owner|creator|kaun banaya|kisne banaya|who.*made|who.*created|owner kaun|about you|about me|biography|kon hai|कौन है|बनाया|founder kaun|संदीप|रिठाल्या/i.test(msg)) topicKey = 'sandeep';
      else if (/sketch|drawing|art|pencil/i.test(msg)) topicKey = 'sandeep_works';
      else if (/school|college|education|study/i.test(msg)) topicKey = 'sandeep_edu';
      else if (/history|itihas|इतिहास/i.test(msg)) topicKey = 'history';
      else if (/rajput|राजपूत/i.test(msg)) topicKey = 'rajputana';
      else if (/reel|video|वीडियो/i.test(msg)) topicKey = 'reels';
      else if (/contact|email|sampark|संपर्क/i.test(msg)) topicKey = 'contact';
      else if (/event|कार्यक्रम|festival/i.test(msg)) topicKey = 'events';
      else if (/blog|post|article|news/i.test(msg)) topicKey = 'posts';
      else if (/founder|राजपाल|founded|kaun/i.test(msg)) topicKey = 'history_founder';
      else if (/kab|when|year|saal|स्थापना/i.test(msg)) topicKey = 'history_year';
      else if (/lathi|लाठी/i.test(msg)) topicKey = 'history_lathi';
      else if (/puth|पूठ|kalan/i.test(msg)) topicKey = 'history_puth';
      else if (/location|where|kahan|कहाँ|address|पता/i.test(msg)) topicKey = 'contact_loc';
      else if (/hi|hello|namaste|नमस्ते|राम/i.test(lower)) topicKey = 'menu';

      const topic = TREE[topicKey];
      if (topic) {
        botReply(topic.reply, topic.next);
      } else {
        botReply('मुझे आपका सवाल पूरी तरह समझ नहीं आया  नीचे से कोई option चुनें या email करें: rithalyarajput@gmail.com', ROOT_MENU);
      }
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  function toggleVoice() {
    if (!voiceOn) {
      setVoiceOn(true);
      // Briefly speak a confirmation
      speak('Voice on. मैं आपके सवालों के जवाब बोलकर दूँगा।');
    } else {
      setVoiceOn(false);
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    }
  }

  function toggleListen() {
    const SR = (typeof window !== 'undefined') &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) {
      alert('Voice input आपके browser में नहीं चलता। Chrome/Edge use करें।');
      return;
    }
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
          aria-label="Open chat assistant"
        >
          <span className="ai-mascot-tooltip">
             जय राजपूताना!<br />Click to chat
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
                <span className="ai-online-dot"></span> Online
              </div>
            </div>
            <button
              className={`ai-voice-toggle ${voiceOn ? 'on' : ''}`}
              onClick={toggleVoice}
              aria-label={voiceOn ? 'Mute voice' : 'Enable voice'}
              title={voiceOn ? 'Voice on (click to mute)' : 'Click to enable voice'}
            >
              {voiceOn ? '' : ''}
            </button>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div key={i} className="ai-chat-msg-wrap">
                <div className={`ai-chat-row ai-chat-row-${m.role}`}>
                  {m.role === 'bot' && (
                    <span className="ai-msg-avatar">
                      <img src={MASCOT_IMG} alt="" />
                    </span>
                  )}
                  <div className={`ai-chat-msg ai-chat-msg-${m.role}`}>
                    {renderMsg(m.text)}
                  </div>
                  {m.role === 'bot' && (
                    <button
                      className="ai-msg-speak"
                      onClick={() => speak(m.text)}
                      aria-label="Play this message"
                      title="Listen"
                    >
                      
                    </button>
                  )}
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
                <span className="ai-msg-avatar">
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
            onSubmit={(e) => {
              e.preventDefault();
              handleTextSend();
            }}
          >
            <button
              type="button"
              className={`ai-mic-btn ${listening ? 'listening' : ''}`}
              onClick={toggleListen}
              aria-label={listening ? 'Stop listening' : 'Voice input'}
              title="Speak your question (Hindi/English)"
            >
              {listening ? '' : ''}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Listening...' : 'Type or speak...'}
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
