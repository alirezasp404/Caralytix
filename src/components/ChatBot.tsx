import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';

const ChatBot: React.FC<any> = ({ chatMessages, isLoading, onSendMessage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim()) {
      onSendMessage(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  };

  return (
    <div className="chatbot-card">
      <h2 className="card-title">
        <Bot size={24} className="icon-accent" />
        Caralytix ChatBot
      </h2>
      <div className="chatbot-content">
        <div className="chat-messages">
          {chatMessages && chatMessages.length > 0 ? (
            chatMessages.map((msg: any, idx: number) => (
              <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                <span>{msg.text}</span>
              </div>
            ))
          ) : (
            <div className="placeholder-content">
              <p className="placeholder-text">Ask anything about car prices, recommendations, or more!</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="chatbot-input-row" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <button type="submit" className="chatbot-send-btn" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
