
import React, { useState, useEffect } from 'react';
import { useMessages } from '../context/MessageContext';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';

const CreatedMessage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMessage } = useMessages();
  const [message, setMessage] = useState(getMessage(id || ''));
  const baseUrl = window.location.origin;
  const messageUrl = `${baseUrl}/view/${id}`;

  useEffect(() => {
    if (!id || !message) {
      setMessage(null);
    }
  }, [id, message]);

  if (!message) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Message not found</h1>
        <p className="mb-6">The message you are looking for does not exist or has been viewed already.</p>
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
      
      <div className="bg-white rounded-md p-6 mb-8 flex items-center justify-between border border-gray-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 mr-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-gray-600">{messageUrl}</span>
        </div>
        
        <CopyToClipboard text={messageUrl} onCopy={() => toast.success("Link copied to clipboard!")}>
          <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </CopyToClipboard>
      </div>
      
      <p className="text-gray-600 mb-8">
        Created a new secret with ID {id.substring(0, 8)}. It can be viewed using the link above.
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">QR code</h2>
        <div className="bg-white p-4 inline-block rounded-md border border-gray-200">
          <QRCode value={messageUrl} size={200} />
        </div>
        <p className="mt-4 text-gray-600">You can also use the QR code above to share the link.</p>
      </div>
      
      <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => window.location.href = '/'}>
        Create new
      </Button>
    </div>
  );
};

export default CreatedMessage;
