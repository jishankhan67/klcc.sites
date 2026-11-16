import { ConversationList } from './ConversationList';
import { MessageCircle } from 'lucide-react';

interface SidebarProps {
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectConversation,
  onNewConversation,
}) => {
  return (
    <div className="hidden md:flex flex-col w-80">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-xl text-gray-900 tracking-tight">AI Chat</h1>
      </div>
      <ConversationList
        onSelectConversation={onSelectConversation}
        onNewConversation={onNewConversation}
      />
    </div>
  );
};