import { useState } from 'react';
import { Send, Attach } from 'lucide-react';
import { useSendMessage } from '@/hooks/useChat';

interface ChatInputProps {
  conversationId: string | null;
  onSend: (message: string, conversationId: string | null) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ conversationId, onSend }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sendMessageMutation = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    onSend(input, conversationId);

    try {
      await sendMessageMutation.mutateAsync({
        message: input,
        conversation_id: conversationId || undefined,
      });
    } catch {
      // Error handled by toast in component
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Attach className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="input-field disabled:opacity-50"
          disabled={isLoading || !conversationId}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || !conversationId}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};