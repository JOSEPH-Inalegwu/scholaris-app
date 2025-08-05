import React, { useState, useRef } from 'react';
import { Send, Paperclip, FileText, X, Copy, Download } from 'lucide-react';

const ScholarisAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim() || selectedFile) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        file: selectedFile,
        sender: 'user'
      };
      
      setMessages([...messages, newMessage]);
      setInputValue('');
      setSelectedFile(null);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = {
          id: Date.now() + 1,
          text: "I've received your message. How can I help you with your academic work today?",
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = (text, messageId) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ai-response-${messageId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 md:pt-0">
      {/* Chat Messages */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto no-scrollbar pb-40">
        {messages.length === 0 && (
          <div className="flex justify-center items-center min-h-full px-4">
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto border border-gray-100">
                <div>
                    <div className="flex justify-center items-center space-x-6 mb-6">
                    {/* Left Eye */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-sm relative animate-blink" />
                    
                    {/* Right Eye */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-sm relative animate-blink" />
                    </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Welcome to Scholaris AI</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Start a conversation or upload your academic materials to get personalized help with your studies.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up px-2`}
          >
            <div
              className={`max-w-full sm:max-w-xs lg:max-w-lg px-4 py-3 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl group relative ${
                message.sender === 'user'
                  ? 'bg-slate-800 text-white shadow-black/20'
                  : 'bg-white text-black border border-gray-300 shadow-gray/20'
              }`}
            >
              {message.file && (
                <div className="mb-2 p-2 bg-gray-100 rounded-lg text-xs opacity-90 flex items-center">
                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{message.file.name}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed break-words">{message.text}</p>
              
              {/* AI Response Actions */}
              {message.sender === 'ai' && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => copyToClipboard(message.text, message.id)}
                    className="p-1.5 hover:bg-gray-900 rounded-md transition-colors duration-200 flex items-center gap-1"
                    title="Copy response"
                  >
                    <Copy className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {copiedMessageId === message.id ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => downloadAsText(message.text, message.id)}
                    className="p-1.5 hover:bg-gray-900 rounded-md transition-colors duration-200 flex items-center gap-1"
                    title="Download response"
                  >
                    <Download className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Save</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in px-2 mb-6">
            <div className="bg-white text-black px-4 py-3 rounded-md shadow-lg border border-gray-300 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-50 to-gray-100 z-0 px-4 transition-all duration-300"
      style={{ width: '100%', paddingLeft: window.innerWidth >= 1024 ? '16rem' : '1rem' }}>
        <div className="p-3 sm:p-4">
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
            
            {/* File Preview */}
            {selectedFile && (
              <div className="px-3 py-2 border-b border-gray-200 animate-slide-down">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <FileText className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0" />
                    <span className="text-xs text-gray-800 font-medium truncate">{selectedFile.name}</span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all duration-200 ml-2 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Text Input */}
            <div className="p-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your academic work, upload notes for summary, or request help with past questions..."
                className="w-full resize-none focus:outline-none text-black placeholder-gray-500 bg-transparent text-sm sm:text-base"
                rows="2"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 px-3 py-2 border-t border-gray-200 bg-gray-50/50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border border-gray-300"
                title="Upload file"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !selectedFile}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:shadow-none"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ScholarisAI;