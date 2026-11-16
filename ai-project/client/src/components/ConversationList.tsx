import { useConversations } from '@/hooks/useChat';
import { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  onNewConversation,
}) => {
  const { data: conversations, isLoading } = useConversations();
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState('');

  const handleNewConversation = async () => {
    navigate('/chat');
    onNewConversation();
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {(conversations || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
            <p>No conversations yet</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {(conversations || []).map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{conv.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};