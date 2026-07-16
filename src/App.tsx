/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { BookViewer } from "./components/BookViewer";
import { ExportPanel } from "./components/ExportPanel";
import { PaymentCallback } from "./components/PaymentCallback";
import { PremiumModal } from "./components/PremiumModal";
import { booksData } from "./data";
import { UserProgress } from "./types";

export default function App() {
  // 1. Persistent State for Premium Status (unlocked globally)
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem("forest_friends_is_premium") === "true";
  });

  // 2. Persistent State for Order ID
  const [orderId, setOrderId] = useState<string>(() => {
    const saved = localStorage.getItem("forest_friends_order_id");
    if (saved) return saved;
    // Generate a secure, unique order ID
    const generated = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("forest_friends_order_id", generated);
    return generated;
  });

  // 3. Persistent State for User Progress
  const [progress, setProgress] = useState<UserProgress | null>(() => {
    const saved = localStorage.getItem("forest_friends_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProgress;
        // Backfill premium status into parsed progress if needed
        parsed.isPremium = localStorage.getItem("forest_friends_is_premium") === "true";
        parsed.orderId = localStorage.getItem("forest_friends_order_id") || undefined;
        return parsed;
      } catch (e) {
        console.warn("Could not parse saved progress:", e);
      }
    }
    return null;
  });

  // Modal Control
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Synchronize premium updates
  const handlePaymentSuccess = () => {
    console.log("Payment validated! Unlocking Premium Mode.");
    setIsPremium(true);
    localStorage.setItem("forest_friends_is_premium", "true");
    
    // Update active session progress
    setProgress((prev) => {
      if (!prev) return null;
      const updated = { ...prev, isPremium: true };
      localStorage.setItem("forest_friends_progress", JSON.stringify(updated));
      return updated;
    });
  };

  // Synchronize session progress and save to localStorage
  const handleProgressChange = (
    updater: UserProgress | ((prev: UserProgress) => UserProgress)
  ) => {
    setProgress((prev) => {
      if (!prev) return null;
      const updated = typeof updater === "function" ? updater(prev) : updater;
      // Guarantee premium state is attached
      updated.isPremium = isPremium;
      updated.orderId = orderId;
      localStorage.setItem("forest_friends_progress", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle initialization of progress from WelcomeScreen
  const handleStart = (name: string, bookId: number, lang: "fr" | "en") => {
    const newProgress: UserProgress = {
      childName: name,
      completionDate: "",
      currentBookId: bookId,
      currentLanguage: lang,
      currentPage: 1,
      completedAnswers: {},
      isPremium,
      orderId
    };
    setProgress(newProgress);
    localStorage.setItem("forest_friends_progress", JSON.stringify(newProgress));
  };

  // Exit back to welcome screen
  const handleExit = () => {
    setProgress(null);
  };

  // Retrieve active book
  const activeBook = progress
    ? booksData.find((b) => b.id === progress.currentBookId) || booksData[0]
    : null;

  return (
    <div className="min-h-screen bg-warm-cream font-sans text-text-charcoal selection:bg-sun-yellow/30">
      {!progress || !activeBook ? (
        <WelcomeScreen
          onStart={handleStart}
          isPremium={isPremium}
          onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          initialLanguage={progress?.currentLanguage || "fr"}
          initialName={progress?.childName || ""}
        />
      ) : (
        <div className="animate-fade-in">
          {/* Main Book Reader and Exercises Board */}
          <BookViewer
            book={activeBook}
            progress={progress}
            onChangeProgress={handleProgressChange}
            onExit={handleExit}
          />

          {/* Exporting section at the bottom for printable files */}
          <section className="no-print pb-16">
            <ExportPanel
              book={activeBook}
              childName={progress.childName}
              language={progress.currentLanguage}
              isPremium={isPremium}
              onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            />
          </section>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        childName={progress?.childName || "Copain"}
        language={progress?.currentLanguage || "fr"}
        orderId={orderId}
      />

      {/* Payment success/cancellation notifications callback */}
      <PaymentCallback
        language={progress?.currentLanguage || "fr"}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
