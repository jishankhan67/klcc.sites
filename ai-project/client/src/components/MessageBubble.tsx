import { Message } from '@/hooks/useChat';
import { Loader2, MessageCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-xl rounded-tr-lg rounded-bl-lg text-sm ${
          isUser
            ? 'user-message'
            : 'ai-message'
        }`}
      >
        {message.content}
        {isStreaming && (
          <span className="ml-2 animate-pulse text-blue-400">
            <Loader2 className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
};