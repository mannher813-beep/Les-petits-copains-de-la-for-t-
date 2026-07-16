/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { BookViewer } from "./components/BookViewer";
import { ExportPanel } from "./components/ExportPanel";
import { PaymentCallback } from "./components/PaymentCallback";
import { booksData } from "./data";
import { UserProgress } from "./types";

export default function App() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  // Handle initialization of progress from WelcomeScreen
  const handleStart = (name: string, bookId: number, lang: "fr" | "en") => {
    setProgress({
      childName: name,
      completionDate: "",
      currentBookId: bookId,
      currentLanguage: lang,
      currentPage: 1,
      completedAnswers: {}
    });
  };

  // Exit back to welcome screen
  const handleExit = () => {
    setProgress(null);
  };

  // Retrieve active book
  const activeBook = progress 
    ? booksData.find(b => b.id === progress.currentBookId) || booksData[0]
    : null;

  return (
    <div className="min-h-screen bg-warm-cream font-sans text-text-charcoal selection:bg-sun-yellow/30">
      {!progress || !activeBook ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <div className="animate-fade-in">
          {/* Main Book Reader and Exercises Board */}
          <BookViewer
            book={activeBook}
            progress={progress}
            onChangeProgress={setProgress}
            onExit={handleExit}
          />

          {/* Exporting section at the bottom for printable files */}
          <section className="no-print pb-16">
            <ExportPanel
              book={activeBook}
              childName={progress.childName}
              language={progress.currentLanguage}
            />
          </section>
        </div>
      )}
      
      {/* Payment success/cancellation notifications */}
      <PaymentCallback language={progress?.currentLanguage || "fr"} />
    </div>
  );
}
