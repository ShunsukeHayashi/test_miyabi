/**
 * Collaboration Panel Component
 *
 * Manages room creation, URL sharing, and user invitations
 */

import { useState, useEffect } from 'react';

interface CollaborationPanelProps {
  onRoomChange?: (roomId: string) => void;
}

export function CollaborationPanel({ onRoomChange }: CollaborationPanelProps) {
  const [roomId, setRoomId] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get room ID from URL parameter
    const params = new URLSearchParams(window.location.search);
    const urlRoomId = params.get('room');

    if (urlRoomId) {
      setRoomId(urlRoomId);
      generateShareUrl(urlRoomId);
      if (onRoomChange) {
        onRoomChange(urlRoomId);
      }
    }
  }, [onRoomChange]);

  const generateShareUrl = (id: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?room=${id}`;
    setShareUrl(url);
  };

  const createNewRoom = () => {
    // Generate random room ID
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    generateShareUrl(newRoomId);

    // Update URL without reload
    window.history.pushState({}, '', `?room=${newRoomId}`);

    if (onRoomChange) {
      onRoomChange(newRoomId);
    }
  };

  const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy URL');
    }
  };

  const leaveRoom = () => {
    setRoomId('');
    setShareUrl('');
    window.history.pushState({}, '', window.location.pathname);

    if (onRoomChange) {
      onRoomChange('');
    }
  };

  return (
    <div className="!absolute !bottom-2 !left-2 md:!bottom-3 md:!left-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg !z-[999] min-w-[240px] max-w-[280px] border border-gray-200 dark:border-gray-700" style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', zIndex: 999 }}>
      <div className="mb-2.5">
        <strong className="text-sm text-gray-900 dark:text-white">🤝 Room</strong>
      </div>

      {!roomId ? (
        <button
          onClick={createNewRoom}
          className="w-full px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-md cursor-pointer font-bold text-xs transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          🌐 Create Room
        </button>
      ) : (
        <div>
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-2 text-xs">
            <div className="font-bold mb-1 text-gray-900 dark:text-white">Room ID:</div>
            <div className="font-mono text-gray-600 dark:text-gray-400">{roomId}</div>
          </div>

          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-2 text-[11px] break-all">
            <div className="font-bold mb-1 text-xs text-gray-900 dark:text-white">
              Share URL:
            </div>
            <div className="text-blue-600 dark:text-blue-400">{shareUrl}</div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={copyToClipboard}
              className={`flex-1 px-2 py-2 border-0 rounded-md cursor-pointer font-bold text-[11px] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 ${
                copied
                  ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
              }`}
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>

            <button
              onClick={leaveRoom}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white border-0 rounded-md cursor-pointer font-bold text-[11px] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              🚪 Leave
            </button>
          </div>

          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md text-[11px] text-yellow-800 dark:text-yellow-200">
            💡 <strong>Tip:</strong> Share the URL above to invite others to collaborate on this
            canvas in real-time!
          </div>
        </div>
      )}
    </div>
  );
}
