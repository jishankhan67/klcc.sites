import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { generateAIResponse, generateChatResponse } from '../services/gemini';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Send message to AI
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { message, conversation_id } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // Get or create conversation
    let convId = conversation_id;

    if (!convId) {
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: userId,
            title: message.substring(0, 50),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (convError) throw new AppError(convError.message, 400);
      convId = convData.id;
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: convId,
          content: message,
          role: 'user',
          created_at: new Date().toISOString(),
        },
      ]);

    if (userMsgError) throw new AppError(userMsgError.message, 400);

    // Get conversation history for context
    const { data: history } = await supabase
      .from('messages')
      .select('content, role')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    // Format history for Gemini
    const messages = history?.map(msg => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    // Generate AI response
    const aiResponse = await generateChatResponse(messages);

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: convId,
          content: aiResponse.message,
          role: 'assistant',
          created_at: new Date().toISOString(),
        },
      ]);

    if (aiMsgError) throw new AppError(aiMsgError.message, 400);

    res.json({
      success: true,
      conversation_id: convId,
      message: aiResponse.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to send message',
    });
  }
};

// Get user conversations
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 400);

    res.json({
      success: true,
      conversations: data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to get conversations',
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    // Verify conversation belongs to user
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !conv) {
      throw new AppError('Conversation not found', 404);
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw new AppError(error.message, 400);

    res.json({
      success: true,
      messages: data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to get messages',
    });
  }
};

// Delete conversation
export const deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    // Delete messages first (foreign key cascade)
    await supabase.from('messages').delete().eq('conversation_id', conversationId);

    // Delete conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) throw new AppError(error.message, 400);

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to delete conversation',
    });
  }
};