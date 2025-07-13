import { useState, useCallback } from 'react';
import { useSecureStorage } from './useSecureStorage';
import { ChatCounts, ChatHistory, ChatMessage } from '../types';
import { CHAT_TIERS, WEBHOOK_URLS, FIXED_AI_RESPONSE, LOCAL_STORAGE_KEYS } from '../config/tiers';

export function useChatApp() {
  const [email, setEmail] = useSecureStorage<string | null>(LOCAL_STORAGE_KEYS.EMAIL, null);
  const [counts, setCounts] = useSecureStorage<ChatCounts>(LOCAL_STORAGE_KEYS.COUNTS, { "10": 0, "30": 0, "50": 0 });
  const [history, setHistory] = useSecureStorage<ChatHistory>(LOCAL_STORAGE_KEYS.HISTORY, { "10": [], "30": [], "50": [] });
  
  const [currentTier, setCurrentTier] = useState("10");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const ensureEmail = useCallback(async (): Promise<string> => {
    if (email) return email;
    
    return new Promise((resolve) => {
      const promptEmail = () => {
        const userEmail = window.prompt("Enter your email (used as chat ID):");
        if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
          const trimmedEmail = userEmail.trim();
          setEmail(trimmedEmail);
          resolve(trimmedEmail);
        } else {
          alert("Please enter a valid email address.");
          promptEmail();
        }
      };
      promptEmail();
    });
  }, [email, setEmail]);

  const switchTier = useCallback((tierKey: string) => {
    setCurrentTier(tierKey);
  }, []);

  const handlePasswordSubmit = useCallback((password: string) => {
    const tier30 = CHAT_TIERS.find(t => t.key === "30");
    const tier50 = CHAT_TIERS.find(t => t.key === "50");
    
    if (password === tier30?.password) {
      setIsPasswordModalOpen(false);
      switchTier("30");
      setPasswordError("");
    } else if (password === tier50?.password) {
      setIsPasswordModalOpen(false);
      switchTier("50");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect Password Token.");
    }
  }, [switchTier]);

  const sendMessage = useCallback(async (tierKey: string, message: string) => {
    const tier = CHAT_TIERS.find(t => t.key === tierKey);
    if (!tier) return;

    if (counts[tierKey] >= tier.limit) {
      setIsBuyModalOpen(true);
      return;
    }

    if (!message.trim()) return;

    const userEmail = await ensureEmail();
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: message,
      timestamp: Date.now()
    };

    // Update history with user message first
    const updatedHistoryWithUser = {
      ...history,
      [tierKey]: [...(history[tierKey] || []), userMessage]
    };
    setHistory(updatedHistoryWithUser);

    // Update count immediately after user message
    const newCount = (counts[tierKey] || 0) + 1;
    const updatedCounts = {
      ...counts,
      [tierKey]: newCount
    };
    setCounts(updatedCounts);

    // Send to webhook using GET request
    try {
      const params = new URLSearchParams({
        Message: message,
        "G-mail": userEmail
      });

      for (const url of WEBHOOK_URLS) {
        await fetch(`${url}?${params.toString()}`, { 
          method: "GET",
          mode: 'no-cors' // Handle CORS issues
        });
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }

    // Add AI response
    const aiMessage: ChatMessage = {
      sender: 'ai',
      text: FIXED_AI_RESPONSE,
      timestamp: Date.now()
    };

    // Update history with AI response
    setHistory(prev => ({
      ...prev,
      [tierKey]: [...(prev[tierKey] || []), aiMessage]
    }));

    // Check if limit reached
    if (newCount >= tier.limit) {
      setIsBuyModalOpen(true);
    }
  }, [counts, history, setCounts, setHistory, ensureEmail]);

  return {
    // State
    currentTier,
    email,
    counts,
    history,
    isPasswordModalOpen,
    isBuyModalOpen,
    passwordError,
    
    // Actions
    switchTier,
    setIsPasswordModalOpen,
    setIsBuyModalOpen,
    setPasswordError,
    handlePasswordSubmit,
    sendMessage
  };
}