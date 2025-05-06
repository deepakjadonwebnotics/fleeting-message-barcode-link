
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMessages } from '../context/MessageContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

const ViewMessage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMessage, markAsViewed } = useMessages();
  const [message, setMessage] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (!id || isProcessed) return;

    const fetchedMessage = getMessage(id);
    
    if (!fetchedMessage) {
      setIsExpired(true);
      setIsProcessed(true);
      return;
    }

    if (fetchedMessage.viewed) {
      setIsExpired(true);
      setIsProcessed(true);
      return;
    }

    // Set message content
    setMessage(fetchedMessage.content);
    
    // Mark the message as viewed
    markAsViewed(id);
    
    // Show toast notification
    toast.success("Successfully decrypted and opened the message. This link is now expired.");
    setIsProcessed(true);
    
  }, [id, getMessage, markAsViewed, isProcessed]);

  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Alert variant="destructive" className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
          <Lock className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-2xl font-bold text-red-600 mb-4">Security Warning: This link has expired</AlertTitle>
          <AlertDescription className="text-gray-700">
            <p className="mb-4">
              This secure link has already been viewed or does not exist.
              For security reasons, each link can only be accessed once.
            </p>
            <p>
              If you need to share sensitive information again, please create a new secure link.
            </p>
          </AlertDescription>
        </Alert>
        <Link to="/" className="text-purple-600 hover:text-purple-800">
          Create a new secure message
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Securely send and receive sensitive information</h1>
        <p className="text-purple-500">Client-side encrypted one-time secrets since 2016</p>
      </div>
      
      <Card className="p-6 mb-8 border border-gray-200">
        <Alert className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <AlertDescription className="text-yellow-800">
            <strong>Note:</strong> This message has now been accessed. For security reasons, it cannot be viewed again.
          </AlertDescription>
        </Alert>
        
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {message}
        </div>
      </Card>
      
      <div className="text-center">
        <Link to="/" className="text-purple-600 hover:text-purple-800">
          Create a new secure message
        </Link>
      </div>
    </div>
  );
};

export default ViewMessage;
