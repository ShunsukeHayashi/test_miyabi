/**
 * Agent Chat UI Component
 *
 * Chat interface for sending instructions to ImageGenAgent and VideoGenAgent
 * Features:
 * - Streaming responses with typing indicator
 * - Chat commands (/clear, /help, /history, /export, /status)
 * - Agent status display (idle/processing/generating)
 * - Message actions (copy, regenerate, delete, edit)
 */

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  type?: 'image' | 'video';
  isStreaming?: boolean;
  error?: boolean;
}

interface AgentStatus {
  state: 'idle' | 'processing' | 'generating';
  currentTask?: string;
  progress?: number;
  queuedTasks: number;
}

interface GenerationHistoryItem {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  timestamp: number;
  status: 'success' | 'failed';
}

interface AgentChatUIProps {
  onSendMessage?: (message: string, type: 'image' | 'video') => void;
  isProcessing?: boolean;
  onClose?: () => void;
  agentStatus?: AgentStatus;
  onRegenerateMessage?: (messageId: string) => void;
}

export function AgentChatUI({
  onSendMessage,
  isProcessing,
  onClose,
  agentStatus: externalAgentStatus,
  onRegenerateMessage
}: AgentChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [agentType, setAgentType] = useState<'image' | 'video'>('image');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showCommandHelp, setShowCommandHelp] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    state: 'idle',
    queuedTasks: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages and history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('agent-chat-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedHistory = localStorage.getItem('agent-generation-history');
    if (savedHistory) {
      setGenerationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agent-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save history to localStorage
  useEffect(() => {
    if (generationHistory.length > 0) {
      localStorage.setItem('agent-generation-history', JSON.stringify(generationHistory));
    }
  }, [generationHistory]);

  // Update agent status from external prop or isProcessing
  useEffect(() => {
    if (externalAgentStatus) {
      setAgentStatus(externalAgentStatus);
    } else {
      setAgentStatus((prev) => ({
        ...prev,
        state: isProcessing ? 'processing' : 'idle',
      }));
    }
  }, [externalAgentStatus, isProcessing]);

  // Command handlers
  const handleCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim();

    if (cmd === '/clear') {
      if (confirm('Clear all chat messages?')) {
        setMessages([]);
        localStorage.removeItem('agent-chat-messages');
        addSystemMessage('Chat cleared successfully');
      }
      return true;
    }

    if (cmd === '/help') {
      setShowCommandHelp(true);
      addSystemMessage(
        'Available commands:\n' +
        '/clear - Clear chat history\n' +
        '/help - Show this help message\n' +
        '/history - View generation history\n' +
        '/export - Export chat as JSON/Markdown\n' +
        '/status - Show agent status'
      );
      return true;
    }

    if (cmd === '/history') {
      if (generationHistory.length === 0) {
        addSystemMessage('No generation history available');
      } else {
        const historyText = generationHistory
          .slice(-10)
          .map(
            (item) =>
              `[${new Date(item.timestamp).toLocaleString()}] ${item.type}: ${item.prompt} - ${item.status}`
          )
          .join('\n');
        addSystemMessage(`Recent generations:\n${historyText}`);
      }
      return true;
    }

    if (cmd === '/export') {
      exportChat();
      return true;
    }

    if (cmd === '/status') {
      const statusText = `Agent Status:
State: ${agentStatus.state}
Current Task: ${agentStatus.currentTask || 'None'}
Progress: ${agentStatus.progress ? `${agentStatus.progress}%` : 'N/A'}
Queued Tasks: ${agentStatus.queuedTasks}`;
      addSystemMessage(statusText);
      return true;
    }

    return false;
  }, [generationHistory, agentStatus]);

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: 'system',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const exportChat = () => {
    const exportData = {
      messages,
      generationHistory,
      exportedAt: new Date().toISOString(),
    };

    // Export as JSON
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `agent-chat-export-${Date.now()}.json`;
    jsonLink.click();

    // Export as Markdown
    const markdownContent = `# Agent Chat Export
Exported: ${new Date().toISOString()}

## Messages
${messages.map((msg) => `### ${msg.role} (${new Date(msg.timestamp).toLocaleString()})
${msg.type ? `Type: ${msg.type}\n` : ''}${msg.content}
`).join('\n')}

## Generation History
${generationHistory.map((item) => `- [${new Date(item.timestamp).toLocaleString()}] ${item.type}: ${item.prompt} - ${item.status}`).join('\n')}
`;

    const mdBlob = new Blob([markdownContent], { type: 'text/markdown' });
    const mdUrl = URL.createObjectURL(mdBlob);
    const mdLink = document.createElement('a');
    mdLink.href = mdUrl;
    mdLink.download = `agent-chat-export-${Date.now()}.md`;
    mdLink.click();

    addSystemMessage('Chat exported as JSON and Markdown');
  };

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;

    const trimmedInput = inputValue.trim();

    // Check if it's a command
    if (trimmedInput.startsWith('/')) {
      if (handleCommand(trimmedInput)) {
        setInputValue('');
        return;
      }
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: Date.now(),
      type: agentType,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add to generation history
    const historyItem: GenerationHistoryItem = {
      id: userMessage.id,
      type: agentType,
      prompt: trimmedInput,
      timestamp: Date.now(),
      status: 'success',
    };
    setGenerationHistory((prev) => [...prev, historyItem]);

    // Send to agent
    if (onSendMessage) {
      onSendMessage(trimmedInput, agentType);
    }

    // Simulate streaming agent response
    simulateStreamingResponse(trimmedInput, agentType);

    setInputValue('');
  };

  // Simulate streaming response with typing animation
  const simulateStreamingResponse = (prompt: string, type: 'image' | 'video') => {
    const responseText = `Processing your ${type} generation request: "${prompt}"`;
    const agentMessageId = `agent-${Date.now()}`;

    // Add initial empty streaming message
    const streamingMessage: Message = {
      id: agentMessageId,
      role: 'agent',
      content: '',
      timestamp: Date.now(),
      type,
      isStreaming: true,
    };
    setMessages((prev) => [...prev, streamingMessage]);

    // Simulate streaming by adding characters progressively
    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      currentIndex++;
      const partialContent = responseText.slice(0, currentIndex);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMessageId
            ? { ...msg, content: partialContent }
            : msg
        )
      );

      if (currentIndex >= responseText.length) {
        clearInterval(streamInterval);
        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }
    }, 30); // 30ms per character for smooth animation
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm('Clear all chat messages?')) {
      setMessages([]);
      localStorage.removeItem('agent-chat-messages');
    }
  };

  // Message actions
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addSystemMessage('Message copied to clipboard');
  };

  const deleteMessage = (messageId: string) => {
    if (confirm('Delete this message?')) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  const startEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const saveEditMessage = () => {
    if (!editingMessageId || !editingContent.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId
          ? { ...msg, content: editingContent.trim() }
          : msg
      )
    );

    setEditingMessageId(null);
    setEditingContent('');
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const regenerateMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || message.role !== 'user') return;

    if (onRegenerateMessage) {
      onRegenerateMessage(messageId);
    } else {
      // Default regeneration: resend the message
      if (onSendMessage && message.type) {
        onSendMessage(message.content, message.type);
        simulateStreamingResponse(message.content, message.type);
      }
    }
  };

  return (
    <div className="absolute top-15 right-3 w-80 md:w-96 h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[1000] flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-t-xl">
        <strong className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="animate-pulse">🤖</span> Agent Chat
        </strong>
        <div className="flex gap-1.5">
          <button
            onClick={clearChat}
            title="Clear chat"
            aria-label="Clear chat history"
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0 rounded cursor-pointer text-[10px] font-bold transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🗑️
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close agent chat"
              className="bg-transparent border-0 text-xl cursor-pointer px-1 leading-none hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Agent Type Selector */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1.5" role="group" aria-label="Agent type selector">
          <button
            onClick={() => setAgentType('image')}
            aria-label="Image agent"
            aria-pressed={agentType === 'image'}
            className={`flex-1 px-2 py-1.5 border rounded-md cursor-pointer text-xs font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              agentType === 'image'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md focus:ring-blue-500'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400'
            }`}
          >
            🖼️ Image
          </button>
          <button
            onClick={() => setAgentType('video')}
            aria-label="Video agent"
            aria-pressed={agentType === 'video'}
            className={`flex-1 px-2 py-1.5 border rounded-md cursor-pointer text-xs font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              agentType === 'video'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md focus:ring-blue-500'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400'
            }`}
          >
            🎬 Video
          </button>
        </div>
      </div>

      {/* Agent Status Display */}
      {agentStatus.state !== 'idle' && (
        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-gray-200 dark:border-gray-700 text-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${
                agentStatus.state === 'processing'
                  ? 'bg-orange-500 animate-pulse'
                  : agentStatus.state === 'generating'
                  ? 'bg-blue-600 animate-pulse'
                  : 'bg-gray-400'
              }`}
              aria-hidden="true"
            />
            <strong className="text-gray-900 dark:text-white">
              {agentStatus.state === 'processing'
                ? 'Processing...'
                : agentStatus.state === 'generating'
                ? 'Generating...'
                : 'Idle'}
            </strong>
          </div>
          {agentStatus.currentTask && (
            <div className="text-gray-600 dark:text-gray-400 text-[10px] ml-3.5">
              {agentStatus.currentTask}
            </div>
          )}
          {agentStatus.progress !== undefined && agentStatus.progress > 0 && (
            <div className="mt-1 ml-3.5">
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${agentStatus.progress}%` }}
                  role="progressbar"
                  aria-valuenow={agentStatus.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                {agentStatus.progress}% complete
              </div>
            </div>
          )}
          {agentStatus.queuedTasks > 0 && (
            <div className="text-gray-600 dark:text-gray-400 text-[10px] mt-1 ml-3.5">
              {agentStatus.queuedTasks} task{agentStatus.queuedTasks > 1 ? 's' : ''} in queue
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-xs mt-10 animate-fade-in">
            <div className="text-4xl mb-2">💬</div>
            <div className="font-bold mb-1">No messages yet</div>
            <div className="text-[11px]">Send a message to your agents</div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf:
                  message.role === 'user'
                    ? 'flex-end'
                    : message.role === 'system'
                    ? 'center'
                    : 'flex-start',
                maxWidth: message.role === 'system' ? '90%' : '75%',
              }}
              onMouseEnter={() => setHoveredMessageId(message.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {editingMessageId === message.id ? (
                // Edit mode
                <div style={{ width: '100%' }}>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      padding: '8px',
                      border: '2px solid #0066ff',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={saveEditMessage}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#0066ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditMessage}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal display mode
                <div style={{ position: 'relative', width: '100%' }}>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor:
                        message.role === 'user'
                          ? '#0066ff'
                          : message.role === 'system'
                          ? '#f0f0f0'
                          : message.error
                          ? '#ffebee'
                          : '#f0f0f0',
                      color:
                        message.role === 'user'
                          ? 'white'
                          : message.error
                          ? '#c62828'
                          : '#333',
                      borderRadius: '8px',
                      fontSize: '12px',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      border: message.role === 'system' ? '1px dashed #ccc' : 'none',
                    }}
                  >
                    {message.type && (
                      <div
                        style={{
                          fontSize: '10px',
                          opacity: 0.8,
                          marginBottom: '4px',
                          fontWeight: 'bold',
                        }}
                      >
                        {message.type === 'image' ? '🖼️ Image' : '🎬 Video'}
                      </div>
                    )}
                    {message.content}
                    {message.isStreaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '12px',
                          backgroundColor: 'currentColor',
                          marginLeft: '2px',
                          animation: 'blink 1s infinite',
                        }}
                      />
                    )}
                  </div>

                  {/* Message actions (shown on hover) */}
                  {hoveredMessageId === message.id && message.role !== 'system' && !message.isStreaming && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: message.role === 'user' ? '0' : 'auto',
                        left: message.role === 'agent' ? '0' : 'auto',
                        display: 'flex',
                        gap: '4px',
                        backgroundColor: 'white',
                        padding: '4px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <button
                        onClick={() => copyMessage(message.content)}
                        title="Copy message"
                        style={{
                          padding: '4px 6px',
                          backgroundColor: '#f0f0f0',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        📋
                      </button>
                      {message.role === 'user' && (
                        <>
                          <button
                            onClick={() => startEditMessage(message.id, message.content)}
                            title="Edit message"
                            style={{
                              padding: '4px 6px',
                              backgroundColor: '#f0f0f0',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => regenerateMessage(message.id)}
                            title="Regenerate response"
                            style={{
                              padding: '4px 6px',
                              backgroundColor: '#f0f0f0',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            🔄
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteMessage(message.id)}
                        title="Delete message"
                        style={{
                          padding: '4px 6px',
                          backgroundColor: '#ffebee',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: '9px',
                      color: '#999',
                      marginTop: '2px',
                      textAlign: message.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
        <div className="flex gap-1.5 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${agentType} agent...`}
            disabled={isProcessing}
            aria-label={`Message ${agentType} agent`}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-xs resize-none min-h-[36px] max-h-[80px] font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            aria-label="Send message"
            className={`px-3 py-2 border-0 rounded-md font-bold text-base min-w-[40px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !inputValue.trim() || isProcessing
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:scale-110 hover:shadow-md focus:ring-blue-500'
            }`}
          >
            {isProcessing ? '⏳' : '↑'}
          </button>
        </div>
        <div className="mt-1.5 text-[10px] text-gray-600 dark:text-gray-400">
          {inputValue.startsWith('/') ? (
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              💡 Type /help for available commands
            </span>
          ) : (
            '💡 Press Enter to send, Shift+Enter for new line'
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-in {
          animation: slide-in-from-right 0.3s ease-out;
        }
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4a5568;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
}

// Utility function to add agent response
export function addAgentResponse(content: string, type: 'image' | 'video', options?: {
  isStreaming?: boolean;
  error?: boolean;
}) {
  const messages = JSON.parse(localStorage.getItem('agent-chat-messages') || '[]');
  const newMessage: Message = {
    id: `agent-${Date.now()}`,
    role: 'agent',
    content,
    timestamp: Date.now(),
    type,
    isStreaming: options?.isStreaming,
    error: options?.error,
  };
  messages.push(newMessage);
  localStorage.setItem('agent-chat-messages', JSON.stringify(messages));
  return newMessage.id;
}

// Utility function to start streaming agent response
export function startStreamingResponse(type: 'image' | 'video') {
  const messages = JSON.parse(localStorage.getItem('agent-chat-messages') || '[]');
  const streamingMessage: Message = {
    id: `agent-${Date.now()}`,
    role: 'agent',
    content: '',
    timestamp: Date.now(),
    type,
    isStreaming: true,
  };
  messages.push(streamingMessage);
  localStorage.setItem('agent-chat-messages', JSON.stringify(messages));
  return streamingMessage.id;
}

// Utility function to update streaming response
export function updateStreamingResponse(messageId: string, content: string, complete = false) {
  const messages = JSON.parse(localStorage.getItem('agent-chat-messages') || '[]');
  const messageIndex = messages.findIndex((msg: Message) => msg.id === messageId);

  if (messageIndex !== -1) {
    messages[messageIndex] = {
      ...messages[messageIndex],
      content,
      isStreaming: !complete,
    };
    localStorage.setItem('agent-chat-messages', JSON.stringify(messages));
  }
}

// Utility function to add system message
export function addSystemMessage(content: string) {
  const messages = JSON.parse(localStorage.getItem('agent-chat-messages') || '[]');
  const systemMessage: Message = {
    id: `system-${Date.now()}`,
    role: 'system',
    content,
    timestamp: Date.now(),
  };
  messages.push(systemMessage);
  localStorage.setItem('agent-chat-messages', JSON.stringify(messages));
}

// Utility function to get generation history
export function getGenerationHistory(): GenerationHistoryItem[] {
  return JSON.parse(localStorage.getItem('agent-generation-history') || '[]');
}

// Utility function to add to generation history
export function addToGenerationHistory(item: GenerationHistoryItem) {
  const history = getGenerationHistory();
  history.push(item);
  localStorage.setItem('agent-generation-history', JSON.stringify(history));
}

// Export interfaces for external use
export type { Message, AgentStatus, GenerationHistoryItem };
