import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-purple"></span>
            AI Assistant
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 hidden md:block"
          >
            <Sun className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.full_name?.[0] || user?.email?.[0]}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};