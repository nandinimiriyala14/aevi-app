import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../layout/BottomNav';
import imgAeviPersona from 'figma:asset/5a0f64ba7b5039dc859327abff3b6556732015cd.png';
import svgPaths from '../../../imports/Chat/svg-42vg7wfvi0';

interface Message {
  id: string;
  sender: 'aevi' | 'user';
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'aevi',
    text: "I've been reflecting on our last session. You mentioned feeling a sense of quiet resistance when you wake up. Does that resistance feel like a weight, or more like a fog?",
    time: '9:41 AM',
  },
  {
    id: '2',
    sender: 'user',
    text: "It feels more like a fog. It's not heavy, it's just... obscuring. I know what I want to do, but I can't quite see the path to getting started.",
    time: '9:42 AM',
  },
  {
    id: '3',
    sender: 'aevi',
    text: "That's a beautiful way to describe it. A fog doesn't stop you; it just asks you to slow down and feel your way forward. What if we didn't try to clear the fog, but just took one small step into it?",
    time: '9:43 AM',
  },
];

const aeviResponses = [
  "I hear that. Sometimes the most profound insights come not from clarity, but from sitting with the uncertainty. What does that uncertainty feel like in your body right now?",
  "There's real wisdom in what you're sharing. Let's explore this a little deeper — when did you first notice this pattern emerging?",
  "That makes a lot of sense. Your awareness of it is already a form of progress. What would a small, gentle step forward look like for you today?",
  "I'm holding space for that. It sounds like part of you already knows the answer — what's the quietest voice telling you right now?",
];

// Sparkle icon for AI avatar
const SparkleIcon = () => (
  <span
    style={{
      fontSize: '12px',
      color: 'white',
      fontFamily: 'sans-serif',
      lineHeight: 1,
    }}
  >
    ✦
  </span>
);

// Icon components using SVG paths from Figma
const JournalThisIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12.667 12" fill="none">
    <path d={svgPaths.p30d0000} fill="#6c5858" />
  </svg>
);

const GenerateInsightIcon = () => (
  <svg width="10" height="13.33" viewBox="0 0 10 13.3333" fill="none">
    <path d={svgPaths.p3861f7a0} fill="#6c5858" />
  </svg>
);

const RewriteVoiceIcon = () => (
  <svg width="14.67" height="12.63" viewBox="0 0 14.6667 12.6333" fill="none">
    <path d={svgPaths.p20b94c80} fill="#6c5858" />
  </svg>
);

const TurnContentIcon = () => (
  <svg width="13.36" height="13.38" viewBox="0 0 13.3645 13.3804" fill="none">
    <path d={svgPaths.p1ecca000} fill="#6c5858" />
  </svg>
);

const MicIcon = () => (
  <svg width="14" height="19" viewBox="0 0 14 19" fill="none">
    <path d={svgPaths.p39e29d00} fill="#807474" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d={svgPaths.p2bb32400} fill="#807474" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d={svgPaths.p2dbaedc0} fill="#807474" />
  </svg>
);

export function ChatScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndex = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aeviResponses[responseIndex.current % aeviResponses.length];
      responseIndex.current++;
      const aeviMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'aevi',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aeviMsg]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      label: 'Journal this',
      Icon: JournalThisIcon,
      action: () => navigate('/create'),
    },
    {
      label: 'Generate insight',
      Icon: GenerateInsightIcon,
      action: () => navigate('/insights'),
    },
    {
      label: 'Rewrite in my voice',
      Icon: RewriteVoiceIcon,
      action: () => {},
    },
    {
      label: 'Turn into content',
      Icon: TurnContentIcon,
      action: () => navigate('/create'),
    },
  ];

  return (
    <div
      className="flex flex-col"
      style={{ height: '794px', background: '#f5ebeb' }}
    >
      {/* Header */}
      <div
        className="flex items-center px-5 flex-shrink-0"
        style={{
          height: '72px',
          background: 'rgba(250, 243, 242, 0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 180, 180, 0.2)',
          boxShadow: '0 6px 20px rgba(213,180,180,0.18)',
        }}
      >
        {/* Avatar with ring */}
        <div
          className="rounded-full overflow-hidden flex-shrink-0 mr-3"
          style={{
            width: '42px',
            height: '42px',
            boxShadow: '0 0 0 2px rgba(255,255,255,0.5)',
          }}
        >
          <img
            src={imgAeviPersona}
            alt="Nai"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Name + status */}
        <div className="flex-1">
          <p
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a2e2e',
              fontFamily: 'Manrope, sans-serif',
              lineHeight: 1.2,
              marginBottom: '2px',
            }}
          >
            Nai
          </p>
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '10px',
                color: '#807474',
                letterSpacing: '0.55px',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: '500',
                textTransform: 'uppercase',
              }}
            >
              REFLECTIVE
            </span>
          </div>
        </div>

        {/* Search button */}
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background: '#fbf1f1',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <SearchIcon />
        </button>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Date separator */}
        <div className="flex items-center justify-center mb-5">
          <div
            style={{
              background: 'rgba(255,255,255,0.4)',
              borderRadius: '9999px',
              padding: '3px 16px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(128,116,116,0.7)',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: '500',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              TODAY, 9:41 AM
            </span>
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'aevi' && (
              <div className="flex flex-col items-start gap-1 max-w-[84%]">
                {/* Timestamp above */}
                <span
                  style={{
                    fontSize: '10px',
                    color: '#a08888',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '400',
                    marginLeft: '0px',
                  }}
                >
                  Aevi {msg.time}
                </span>
                <div className="flex items-start gap-2.5">
                  {/* Gradient sparkle avatar */}
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #ddb8b8 0%, #b08888 100%)',
                    }}
                  >
                    <SparkleIcon />
                  </div>
                  {/* Bubble */}
                  <div
                    className="px-4 py-3 rounded-tl-sm rounded-tr-5xl rounded-br-5xl rounded-bl-5xl"
                    style={{
                      background: 'rgba(253, 250, 249, 0.9)',
                      border: '1.155px solid rgba(213,180,180,0.3)',
                      boxShadow: '0 15px 20.5px rgba(134,112,112,0.08)',
                      borderRadius: '4px 20px 20px 20px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#4f4444',
                        lineHeight: '22px',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: '400',
                        margin: 0,
                      }}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {msg.sender === 'user' && (
              <div className="flex flex-col items-end gap-1 max-w-[80%]">
                {/* Timestamp above right */}
                <span
                  style={{
                    fontSize: '10px',
                    color: '#a08888',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '400',
                  }}
                >
                  You {msg.time}
                </span>
                <div
                  className="px-4 py-3"
                  style={{
                    background: '#867070',
                    borderRadius: '20px 20px 4px 20px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      lineHeight: '22px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '400',
                      margin: 0,
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start gap-1 mb-4">
            <div className="flex items-start gap-2.5">
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #ddb8b8 0%, #b08888 100%)',
                }}
              >
                <SparkleIcon />
              </div>
              <div
                className="px-4 py-3"
                style={{
                  background: 'rgba(253, 250, 249, 0.9)',
                  border: '1.155px solid rgba(213,180,180,0.3)',
                  borderRadius: '4px 20px 20px 20px',
                  boxShadow: '0 15px 20.5px rgba(134,112,112,0.08)',
                }}
              >
                <div className="flex gap-1.5 items-center py-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#c8a0a0',
                        animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons */}
      <div
        className="px-5 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {quickActions.map((chip) => (
          <button
            key={chip.label}
            onClick={chip.action}
            className="flex items-center gap-2 flex-shrink-0 transition-opacity active:opacity-70"
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              borderRadius: '9999px',
              padding: '7px 17px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#6c5858',
              fontWeight: '400',
              fontFamily: 'Manrope, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <chip.Icon />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0"
        style={{
          margin: '8px 16px 12px',
          background: '#fdfaf9',
          border: '1.155px solid #e4d0d0',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(134,112,112,0.08)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          gap: '2px',
        }}
      >
        {/* Plus button */}
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PlusIcon />
        </button>

        {/* Mic button */}
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <MicIcon />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="A thought, a question, anything..."
            className="w-full outline-none bg-transparent"
            style={{
              fontSize: '14px',
              color: '#3d2b2b',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '400',
              border: 'none',
              padding: '0 4px',
            }}
          />
          {!inputText && (
            <span
              className="absolute inset-0 flex items-center px-1 pointer-events-none"
              style={{
                fontSize: '14px',
                color: 'rgba(61,43,43,0.5)',
                fontFamily: 'Outfit, sans-serif',
              }}
            />
          )}
        </div>

        {/* Send button */}
        <button
          onClick={sendMessage}
          className="flex items-center justify-center rounded-xl flex-shrink-0 transition-opacity active:opacity-80"
          style={{
            width: '40px',
            height: '40px',
            background: inputText.trim() ? '#6c5858' : 'rgba(108,88,88,0.5)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: inputText.trim() ? '0 4px 12px rgba(134,112,112,0.3)' : 'none',
            borderRadius: '10px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 15.5V2.5M9 2.5L3.5 8M9 2.5L14.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom nav */}
      <BottomNav />

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        input::placeholder {
          color: rgba(61,43,43,0.5);
        }
      `}</style>
    </div>
  );
}
