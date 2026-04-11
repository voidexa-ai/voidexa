'use client'

import QuantumDebatePanel from '@/components/quantum/QuantumDebatePanel'

// Reserved space for the fixed top nav (~60px) plus a small breathing
// gap. The panel below fills the remaining viewport so the left column
// can be sticky and the right column can scroll independently without
// pushing the rest of the page.
const PAGE_RESERVED_PX = 84

export default function QuantumChatPage() {
  return (
    <div
      className="w-full"
      style={{
        height: `calc(100dvh - ${PAGE_RESERVED_PX}px)`,
        marginTop: PAGE_RESERVED_PX - 16,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes quantum-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes quantum-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes quantum-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(119,119,187,0.3); }
          50% { box-shadow: 0 0 20px rgba(119,119,187,0.6), 0 0 40px rgba(99,102,241,0.3); }
        }
        .quantum-btn-glow {
          animation: quantum-glow 2s ease-in-out infinite;
        }
        /* Markdown rendering inside debate message cards. Sized to
           match the voidexa font-size rule (body >=16px) and the dark
           sci-fi palette of the surrounding chat. */
        .quantum-markdown { color: #c8c8d0; font-size: 16px; line-height: 1.7; }
        .quantum-markdown h1, .quantum-markdown h2, .quantum-markdown h3 {
          color: #e0e0e0;
          font-weight: 600;
          margin: 14px 0 6px;
          line-height: 1.35;
        }
        .quantum-markdown h1 { font-size: 18px; }
        .quantum-markdown h2 { font-size: 16px; }
        .quantum-markdown h3 { font-size: 16px; }
        .quantum-markdown p {
          color: #c8c8d0;
          line-height: 1.75;
          margin: 0 0 10px;
        }
        .quantum-markdown p:last-child { margin-bottom: 0; }
        .quantum-markdown strong { color: #e8e8f0; font-weight: 700; }
        .quantum-markdown em { color: #afa9ec; font-style: italic; }
        .quantum-markdown a {
          color: #a5b4fc;
          text-decoration: underline;
          text-decoration-color: rgba(165,180,252,0.4);
        }
        .quantum-markdown a:hover { text-decoration-color: rgba(165,180,252,0.8); }
        .quantum-markdown code {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(127,119,221,0.18);
          border-radius: 4px;
          padding: 1px 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 14px;
          color: #d4d0ff;
        }
        .quantum-markdown pre {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(127,119,221,0.15);
          border-radius: 8px;
          padding: 12px 14px;
          overflow-x: auto;
          margin: 10px 0;
          font-size: 14px;
          line-height: 1.55;
        }
        .quantum-markdown pre code {
          background: transparent;
          border: 0;
          padding: 0;
          color: #d4d0ff;
        }
        .quantum-markdown ul, .quantum-markdown ol {
          padding-left: 22px;
          margin: 8px 0;
        }
        .quantum-markdown li {
          color: #c8c8d0;
          line-height: 1.7;
          margin: 4px 0;
        }
        .quantum-markdown blockquote {
          border-left: 2px solid rgba(127,119,221,0.4);
          padding-left: 12px;
          margin: 10px 0;
          color: #a5a0c4;
          font-style: italic;
        }
        .quantum-markdown hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 16px 0;
        }
        .quantum-markdown table {
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 14px;
        }
        .quantum-markdown th, .quantum-markdown td {
          border: 1px solid rgba(127,119,221,0.18);
          padding: 6px 10px;
          text-align: left;
        }
        .quantum-markdown th {
          background: rgba(127,119,221,0.08);
          color: #e8e8f0;
          font-weight: 600;
        }
        /* Custom scrollbar for the chat area. */
        .quantum-chat-area::-webkit-scrollbar { width: 6px; }
        .quantum-chat-area::-webkit-scrollbar-track { background: transparent; }
        .quantum-chat-area::-webkit-scrollbar-thumb {
          background: rgba(127,119,221,0.22);
          border-radius: 3px;
        }
        .quantum-chat-area::-webkit-scrollbar-thumb:hover {
          background: rgba(127,119,221,0.4);
        }
      `}</style>
      <QuantumDebatePanel />
    </div>
  )
}
