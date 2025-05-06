
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
