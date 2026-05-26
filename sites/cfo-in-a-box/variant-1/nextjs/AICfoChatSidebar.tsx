import React, { useState, useEffect, useRef } from 'react';

const AICfoChatSidebar = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Welcome back. I’ve analyzed your bank sync from the last 24 hours. Your burn rate is holding steady at $12.4k/mo, but I detected a duplicate SaaS subscription for "Segment". Should we flag this for cancellation?',
      timestamp: '09:41 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages([...messages, { role: 'user', content: inputValue, timestamp: 'Just now' }]);
    setInputValue('');
    
    // Simulate AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Analyzing that scenario... If you hire 2 engineers at $120k/yr each, your runway drops from 8.4 months to 5.2 months unless revenue growth accelerates by 15%.',
        timestamp: 'Just now' 
      }]);
    }, 1000);
  };

  return (
    <div style={{
      width: '380px',
      height: '100vh',
      backgroundColor: '#0d0f14',
      borderLeft: '1px solid #1f242d',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      color: '#ffffff',
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #1f242d',
        background: 'linear-gradient(to bottom, #050608, #0d0f14)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#00ff9d',
            boxShadow: '0 0 10px rgba(0, 255, 157, 0.5)'
          }}></div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>AI CFO COMMAND</span>
        </div>
        <p style={{ color: '#8a8f98', fontSize: '0.75rem' }}>Real-time Financial Intelligence</p>
      </div>

      {/* Financial Signals Section */}
      <div style={{ padding: '16px 20px', backgroundColor: 'rgba(0, 255, 157, 0.03)' }}>
        <div style={{ 
          fontSize: '0.65rem', 
          fontWeight: 700, 
          color: '#8a8f98', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          marginBottom: '12px'
        }}>High Priority Signals</div>
        
        <div style={{ 
          backgroundColor: '#14171c', 
          borderLeft: '2px solid #ff4d4d', 
          padding: '12px', 
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ff4d4d', marginBottom: '2px' }}>Cost Leak Detected</div>
          <div style={{ fontSize: '0.75rem', color: '#8a8f98' }}>Unused Slack seats costing $240/mo.</div>
        </div>

        <div style={{ 
          backgroundColor: '#14171c', 
          borderLeft: '2px solid #ffb800', 
          padding: '12px', 
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffb800', marginBottom: '2px' }}>Runway Alert</div>
          <div style={{ fontSize: '0.75rem', color: '#8a8f98' }}>Current burn exceeds projection by 12%.</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '90%'
          }}>
            <div style={{ 
              backgroundColor: msg.role === 'user' ? '#1f242d' : 'transparent',
              padding: msg.role === 'user' ? '12px 16px' : '0',
              borderRadius: '8px',
              border: msg.role === 'user' ? '1px solid #2d343f' : 'none'
            }}>
              {msg.role === 'ai' && (
                <div style={{ 
                  fontFamily: "'JetBrains Mono', monospace", 
                  color: '#00ff9d', 
                  fontSize: '0.7rem',
                  marginBottom: '8px'
                }}>&gt; CFO_CORE_ANALYSIS</div>
              )}
              <p style={{ 
                fontSize: '0.9rem', 
                lineHeight: '1.5',
                color: msg.role === 'user' ? '#ffffff' : '#8a8f98',
                fontFamily: msg.role === 'ai' ? "'JetBrains Mono', monospace" : "'Inter', sans-serif"
              }}>
                {msg.content}
              </p>
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: '#444', 
              marginTop: '6px',
              textAlign: msg.role === 'user' ? 'right' : 'left'
            }}>{msg.timestamp}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', borderTop: '1px solid #1f242d', backgroundColor: '#050608' }}>
        <form onSubmit={handleSend} style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your CFO anything..."
            style={{
              width: '100%',
              backgroundColor: '#14171c',
              border: '1px solid #1f242d',
              padding: '14px 45px 14px 16px',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }}
          />
          <button 
            type="submit"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#00ff9d',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
          >
            →
          </button>
        </form>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          marginTop: '12px' 
        }}>
          <button style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>RUNWAY REPORT</button>
          <button style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>BURN ANALYTICS</button>
          <button style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>SCENARIO WIZARD</button>
        </div>
      </div>
    </div>
  );
};

export default AICfoChatSidebar;