"use client";

import React, { useState, useEffect } from 'react';

const MessagingTerminal = () => {
  const [activeTab, setActiveTab] = useState('messaging');
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const [watchlist] = useState([
    { id: 1, title: "Precision HVAC & Cooling", status: "NDA Signed", sde: "$450,000", price: "$1,200,000", unread: 2 },
    { id: 4, title: "Laundromat Portfolio", status: "Reviewing CIM", sde: "$220,000", price: "$950,000", unread: 0 },
    { id: 12, title: "Concrete Paving & Repair", status: "Due Diligence", sde: "$1,100,000", price: "$3,100,000", unread: 5 },
  ]);

  const [chats] = useState([
    { id: 1, broker: "Marcus Thorne", firm: "Equity Partners", deal: "Precision HVAC", lastMsg: "Please review the updated P&L for Q3." },
    { id: 2, broker: "Sarah Jenkins", firm: "Peak Mergers", deal: "Concrete Paving", lastMsg: "The owner is open to a 20% seller note." },
    { id: 3, broker: "System", firm: "Oxidized Ledger", deal: "Vault", lastMsg: "POF Verification successfully processed." },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, chatId: 1, sender: 'broker', text: "Welcome to the data room for Precision HVAC.", time: "09:14" },
    { id: 2, chatId: 1, sender: 'user', text: "Thank you. I've reviewed the preliminary tax returns.", time: "10:05" },
    { id: 3, chatId: 1, sender: 'broker', text: "Great. Please review the updated P&L for Q3. I've attached it to the vault.", time: "10:10" },
  ]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      chatId: selectedChat,
      sender: 'user',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="terminal-container">
      <style jsx>{`
        .terminal-container {
          --obsidian: #050505;
          --bone: #F5F5F0;
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
          --panel: #0F0F0F;
          
          background: var(--obsidian);
          color: var(--bone);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .terminal-container::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }

        /* Dashboard Header */
        .dash-header {
          border-bottom: 2px solid var(--graphite);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--panel);
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--graphite);
          padding: 0.5rem 1rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--acid-green);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--acid-green);
        }

        /* Main Layout */
        .dash-content {
          display: grid;
          grid-template-columns: 240px 1fr;
          flex-grow: 1;
        }

        .sidebar {
          border-right: 2px solid var(--graphite);
          padding: 2rem 0;
          background: var(--obsidian);
        }

        .nav-item {
          padding: 1rem 2rem;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          color: #666;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .nav-item:hover { color: var(--bone); background: #0a0a0a; }
        .nav-item.active {
          color: var(--acid-green);
          background: var(--graphite);
          border-left-color: var(--acid-green);
        }

        /* Messaging Grid */
        .messaging-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          height: calc(100vh - 84px);
        }

        .chat-list {
          border-right: 1px solid var(--graphite);
          overflow-y: auto;
          background: #080808;
        }

        .chat-preview {
          padding: 1.5rem;
          border-bottom: 1px solid var(--graphite);
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-preview:hover { background: #111; }
        .chat-preview.selected { background: var(--graphite); }

        .chat-preview .firm { font-size: 0.6rem; color: var(--oxidized-copper); font-weight: 900; margin-bottom: 0.25rem; }
        .chat-preview .broker { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.25rem; }
        .chat-preview .deal-name { font-size: 0.7rem; color: #888; }

        .message-area {
          display: flex;
          flex-direction: column;
          background: var(--panel);
        }

        .message-history {
          flex-grow: 1;
          padding: 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .msg { max-width: 70%; position: relative; }
        .msg.broker { align-self: flex-start; }
        .msg.user { align-self: flex-end; text-align: right; }

        .msg-content {
          padding: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .msg.broker .msg-content { background: var(--graphite); border-left: 2px solid var(--oxidized-copper); }
        .msg.user .msg-content { background: var(--bone); color: var(--obsidian); font-weight: 500; }

        .msg-meta {
          font-family: 'JetBrains Mono';
          font-size: 0.6rem;
          margin-top: 0.5rem;
          color: #555;
        }

        .input-bar {
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--graphite);
          display: flex;
          gap: 1rem;
          background: var(--obsidian);
        }

        .input-bar input {
          flex-grow: 1;
          background: #111;
          border: 1px solid var(--graphite);
          color: var(--bone);
          padding: 1rem;
          font-family: 'JetBrains Mono';
          outline: none;
        }

        .input-bar input:focus { border-color: var(--acid-green); }

        .send-btn {
          background: var(--acid-green);
          color: var(--obsidian);
          border: none;
          padding: 0 2rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
        }

        /* Vault / Watchlist Tables */
        .data-panel {
          padding: 3rem;
          overflow-y: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
        }

        .data-table th {
          text-align: left;
          font-size: 0.65rem;
          color: #555;
          text-transform: uppercase;
          padding: 1rem;
          border-bottom: 2px solid var(--graphite);
        }

        .data-table td {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid var(--graphite);
          font-size: 0.85rem;
        }

        .badge {
          font-size: 0.6rem;
          padding: 0.3rem 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
        }
        .badge-green { background: var(--acid-green); color: var(--obsidian); }
        .badge-orange { background: var(--blood-orange); color: var(--bone); }
        .badge-copper { background: var(--oxidized-copper); color: var(--bone); }

        .vault-card {
          background: #111;
          border: 1px dashed var(--oxidized-copper);
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }
      `}</style>

      <header className="dash-header">
        <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
          BUYER<span style={{ color: 'var(--oxidized-copper)' }}>COMMAND</span>
        </div>
        <div className="user-badge">
          <div className="status-dot"></div>
          <span className="mono" style={{ fontSize: '0.7rem' }}>Verified Buyer: ID_88291</span>
        </div>
      </header>

      <main className="dash-content">
        <aside className="sidebar">
          <div 
            className={`nav-item mono ${activeTab === 'messaging' ? 'active' : ''}`}
            onClick={() => setActiveTab('messaging')}
          >
            01. Messaging Terminal
          </div>
          <div 
            className={`nav-item mono ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            02. Deal Watchlist
          </div>
          <div 
            className={`nav-item mono ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            03. POF Vault
          </div>
          <div className="nav-item mono">04. Analytics</div>
          <div className="nav-item mono">05. Settings</div>
        </aside>

        <section style={{ height: '100%' }}>
          {activeTab === 'messaging' && (
            <div className="messaging-grid">
              <div className="chat-list">
                {chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-preview ${selectedChat === chat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="firm mono">{chat.firm}</div>
                    <div className="broker">{chat.broker}</div>
                    <div className="deal-name mono">{chat.deal}</div>
                    <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.lastMsg}
                    </div>
                  </div>
                ))}
              </div>
              <div className="message-area">
                <div className="message-history">
                  <div className="mono" style={{ textAlign: 'center', color: '#444', fontSize: '0.6rem', marginBottom: '1rem' }}>
                    --- ENCRYPTED CHANNEL ESTABLISHED ---
                  </div>
                  {messages.filter(m => m.chatId === selectedChat).map(msg => (
                    <div key={msg.id} className={`msg ${msg.sender}`}>
                      <div className="msg-content">{msg.text}</div>
                      <div className="msg-meta">{msg.time} — {msg.sender === 'user' ? 'READ' : 'VERIFIED'}</div>
                    </div>
                  ))}
                </div>
                <form className="input-bar" onSubmit={sendMessage}>
                  <input 
                    type="text" 
                    placeholder="ENTER COMMAND OR MESSAGE..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button type="submit" className="send-btn mono">Transmit</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="data-panel">
              <h2 className="mono" style={{ fontSize: '2rem' }}>Active Deal Flow</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Status</th>
                    <th>Asking Price</th>
                    <th>Cash Flow (SDE)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map(deal => (
                    <tr key={deal.id}>
                      <td style={{ fontWeight: 700 }}>{deal.title}</td>
                      <td><span className={`badge ${deal.status === 'Due Diligence' ? 'badge-orange' : 'badge-green'}`}>{deal.status}</span></td>
                      <td className="mono">{deal.price}</td>
                      <td className="mono" style={{ color: 'var(--acid-green)' }}>{deal.sde}</td>
                      <td>
                        <button className="mono" style={{ background: 'transparent', border: '1px solid var(--bone)', color: 'var(--bone)', padding: '0.4rem 1rem', fontSize: '0.6rem', cursor: 'pointer' }}>
                          Open Prospectus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="data-panel" style={{ maxWidth: '800px' }}>
              <h2 className="mono" style={{ fontSize: '2rem' }}>Proof of Funds Vault</h2>
              <p style={{ color: '#888', marginTop: '1rem', marginBottom: '2rem' }}>Securely store and share your financial verification with brokers to bypass initial screening gates.</p>
              
              <div className="vault-card">
                <div className="mono" style={{ color: 'var(--acid-green)', fontSize: '1.2rem', marginBottom: '1rem' }}>Vault Status: VERIFIED</div>
                <div className="mono" style={{ color: '#444', fontSize: '0.7rem' }}>Last Scan: 2024-05-20 14:30:01</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'var(--panel)', border: '1px solid var(--graphite)', padding: '1.5rem' }}>
                  <div className="mono" style={{ fontSize: '0.6rem', color: '#666' }}>Verified Liquid Capital</div>
                  <div className="mono" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>$450,000.00</div>
                </div>
                <div style={{ background: 'var(--panel)', border: '1px solid var(--graphite)', padding: '1.5rem' }}>
                  <div className="mono" style={{ fontSize: '0.6rem', color: '#666' }}>SBA Pre-Approval</div>
                  <div className="mono" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>$2,500,000.00</div>
                </div>
              </div>

              <button className="mono" style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', background: 'var(--bone)', color: 'var(--obsidian)', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
                UPDATE VERIFICATION DOCUMENTS
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MessagingTerminal;"