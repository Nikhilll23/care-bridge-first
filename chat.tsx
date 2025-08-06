'use client';

import { useChat } from 'ai/react';
import type { ToolInvocation } from 'ai';
import type { Message } from '@ai-sdk/ui-utils';
import { useEffect, useRef } from 'react';

// A component to display a tool invocation in a structured way
function ToolCallDisplay({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  const { toolName, args } = toolInvocation;
  const state = 'state' in toolInvocation ? toolInvocation.state : 'result';
  const result = 'result' in toolInvocation ? toolInvocation.result : undefined;

  return (
    <div className="my-2 p-4 border rounded-lg bg-gray-50 text-sm text-gray-800">
      <div className="font-semibold">
        Tool Call: <span className="font-mono text-blue-600">{toolName}</span>
      </div>
      <div className="mt-2">
        <p className="font-medium">Arguments:</p>
        <pre className="p-2 mt-1 bg-gray-100 rounded text-xs overflow-x-auto">
          {JSON.stringify(args, null, 2)}
        </pre>
      </div>
      {state === 'result' && (
        <div className="mt-2">
          <p className="font-medium">Result:</p>
          <pre className="p-2 mt-1 bg-gray-100 rounded text-xs overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      {state === 'call' && (
         <div className="mt-2 flex items-center text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Calling tool...</span>
         </div>
      )}
    </div>
  );
}

// A component to display a single chat message
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const hasParts = message.parts && message.parts.length > 0;

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
          AI
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-xl ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {hasParts ? (
          message.parts!.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index}>{part.text}</span>;
            }
            if (part.type === 'tool-invocation') {
              return <ToolCallDisplay key={index} toolInvocation={part.toolInvocation} />;
            }
            return null;
          })
        ) : (
          <span>{message.content}</span>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
          You
        </div>
      )}
    </div>
  );
}

// The main chat component
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom of the chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
      <header className="p-4 border-b shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800">Enhanced AI Chat</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map(m => <ChatMessage key={m.id} message={m} />)
          ) : (
            <div className="text-center text-gray-500 pt-8">
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          {isLoading && (
            <div className="flex items-start gap-3 my-4">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold">AI</div>
              <div className="p-3 rounded-lg bg-gray-200 text-gray-800"><span className="animate-pulse">...</span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            className="flex-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Ask me anything..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </footer>
    </div>
  );
}