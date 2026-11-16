import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { userAPI, chatAPI } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Flame, TrendingUp, BarChart3, Shield, LogOut, Settings, DollarSign, Banknote, Zap } from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back to your AI assistant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_conversations || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_messages || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {stats?.member_since || 'Just now'}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Start New Chat
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;