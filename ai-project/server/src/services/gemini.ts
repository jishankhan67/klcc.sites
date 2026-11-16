import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the model
export const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Generate AI response
export const generateAIResponse = async (message: string, context?: string) => {
  try {
    const prompt = context 
      ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:`
      : message;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
    };
  } catch (error: any) {
    console.error('Gemini AI Error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error processing your request.',
      error: error.message,
    };
  }
};

// Generate AI response with chat history
export const generateChatResponse = async (messages: Array<{ role: string; content: string }>) => {
  try {
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const result = await chat.sendMessage(lastUserMessage?.content || '');
    const response = await result.response;

    return {
      success: true,
      message: response.text(),
    };
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error processing your request.',
      error: error.message,
    };
  }
};