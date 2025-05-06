
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: string;
  content: string;
  viewed: boolean;
  createdAt: Date;
};

interface MessageContextType {
  messages: Record<string, Message>;
  createMessage: (content: string) => string;
  getMessage: (id: string) => Message | null;
  markAsViewed: (id: string) => void;
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

  const createMessage = (content: string): string => {
    const id = uuidv4();
    const newMessage: Message = {
      id,
      content,
      viewed: false,
      createdAt: new Date(),
    };

    setMessages(prev => ({
      ...prev,
      [id]: newMessage
    }));

    return id;
  };

  const getMessage = (id: string): Message | null => {
    return messages[id] || null;
  };

  const markAsViewed = (id: string): void => {
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
