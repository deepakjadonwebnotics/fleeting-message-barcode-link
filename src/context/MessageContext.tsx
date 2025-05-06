
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

type Message = {
  id: string;
  content: string;
  viewed: boolean;
  createdAt: Date;
};

interface MessageContextType {
  messages: Record<string, Message>;
  createMessage: (content: string) => Promise<string>;
  getMessage: (id: string) => Promise<Message | null>;
  markAsViewed: (id: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Record<string, Message>>({});

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('secureMessages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string dates back to Date objects
        const processedMessages: Record<string, Message> = {};
        Object.keys(parsedMessages).forEach(key => {
          processedMessages[key] = {
            ...parsedMessages[key],
            createdAt: new Date(parsedMessages[key].createdAt)
          };
        });
        setMessages(processedMessages);
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
      }
    }
  }, []);

  // Update localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('secureMessages', JSON.stringify(messages));
  }, [messages]);

  const createMessage = async (content: string): Promise<string> => {
    const id = uuidv4();
    const newMessage: Message = {
      id,
      content,
      viewed: false,
      createdAt: new Date(),
    };

    try {
      // Save the message to server
      await axios.post('/api/messages', { id, content });
      
      // Update local state
      setMessages(prev => ({
        ...prev,
        [id]: newMessage
      }));
      
      return id;
    } catch (error) {
      console.error('Failed to save message:', error);
      // Fall back to just updating local state if server request fails
      setMessages(prev => ({
        ...prev,
        [id]: newMessage
      }));
      return id;
    }
  };

  const getMessage = async (id: string): Promise<Message | null> => {
    try {
      // Try to get from server first
      const response = await axios.get(`/api/messages/${id}`);
      if (response.data && response.data.content) {
        const serverMessage: Message = {
          id,
          content: response.data.content,
          viewed: false, // Since we're accessing it for the first time from server
          createdAt: new Date()
        };
        
        // Update local state
        setMessages(prev => ({
          ...prev,
          [id]: serverMessage
        }));
        
        return serverMessage;
      }
    } catch (error) {
      console.log('Message not found on server, checking local storage');
    }
    
    // Fall back to local storage
    return messages[id] || null;
  };

  const markAsViewed = async (id: string): Promise<void> => {
    try {
      // Mark as viewed on server
      await axios.put(`/api/messages/${id}/viewed`);
    } catch (error) {
      console.error('Failed to mark message as viewed on server:', error);
    }
    
    // Update local state regardless of server response
    setMessages(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          viewed: true
        }
      };
    });
  };

  return (
    <MessageContext.Provider value={{ messages, createMessage, getMessage, markAsViewed }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
