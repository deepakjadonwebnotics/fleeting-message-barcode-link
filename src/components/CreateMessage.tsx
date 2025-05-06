
import React, { useState } from 'react';
import { useMessages } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CreateMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsLoading(true);
    try {
      const messageId = await createMessage(message);
      navigate(`/created/${messageId}`);
    } catch (error) {
      console.error('Failed to create message:', error);
      toast.error('Failed to create message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Securely send and receive sensitive information</h1>
        <p className="text-purple-500">Client-side encrypted one-time secrets since 2016</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a secret here. Get a secure one-time link in return."
          className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <span>Creating...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Create secure link</span>
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-10">One-time links for total security</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 text-left">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Send</h3>
            <p className="text-gray-700">
              Ensure the confidentiality of your data with our one-time links for sending information. 
              Create a secure link, share your sensitive data, and rest assured knowing that once the 
              link is accessed, it expires immediately, leaving no trace.
            </p>
          </div>
          
          <div className="p-6 text-left">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Receive</h3>
            <p className="text-gray-700">
              Receive sensitive information securely with our one-time links. Request data from 
              others and get it delivered through a self-destructing link that guarantees complete 
              privacy. Once you access the information, the link deactivates.
            </p>
          </div>
          
          <div className="p-6 text-left">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Chat</h3>
            <p className="text-gray-700">
              Chat privately without leaving a digital footprint with our secure one-time links. 
              Start a conversation using a link that expires as soon as your chat ends, ensuring 
              all your communications remain confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMessage;
