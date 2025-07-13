import React from 'react';
import { Header } from './components/Header';
import { ChatSection } from './components/ChatSection';
import { PasswordModal } from './components/PasswordModal';
import { BuyModal } from './components/BuyModal';
import { useChatApp } from './hooks/useChatApp';
import { CHAT_TIERS } from './config/tiers';

function App() {
  const {
    currentTier,
    email,
    counts,
    history,
    isPasswordModalOpen,
    isBuyModalOpen,
    passwordError,
    switchTier,
    setIsPasswordModalOpen,
    setIsBuyModalOpen,
    setPasswordError,
    handlePasswordSubmit,
    sendMessage
  } = useChatApp();

  const currentTierData = CHAT_TIERS.find(tier => tier.key === currentTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <Header
          email={email}
          onPremiumClick={() => {
            setPasswordError('');
            setIsPasswordModalOpen(true);
          }}
        />

        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {currentTierData && (
            <ChatSection
              tier={currentTierData}
              messages={history[currentTier] || []}
              count={counts[currentTier] || 0}
              onSendMessage={(message) => sendMessage(currentTier, message)}
              isActive={true}
            />
          )}
        </main>

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
        />

        <BuyModal
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;