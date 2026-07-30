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
import { GlobalSvgSymbols } from "./components/GlobalSvgSymbols";

// New Multi-Tome Components
import { Navigation } from "./components/Navigation";
import { ChildProfilesList } from "./components/ChildProfilesList";
import { ChildProfileNew } from "./components/ChildProfileNew";
import { ChildParcours } from "./components/ChildParcours";
import { ChildBadges } from "./components/ChildBadges";
import { ChildMotsMagiques } from "./components/ChildMotsMagiques";
import { ChildClassement } from "./components/ChildClassement";
import { DefiChapterView } from "./components/DefiChapterView";
import { CertificatReussite } from "./components/CertificatReussite";
import { AdminDashboard } from "./components/AdminDashboard";

import { booksData } from "./data";
import { UserProgress } from "./types";
import { Enfant, Tome } from "./types/multiTome";
import { multiTomeService, DEFAULT_ENFANTS } from "./services/multiTomeService";

export default function App() {
  // Current Path URL routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  // Active Child Profile State
  const [activeEnfant, setActiveEnfant] = useState<Enfant | null>(() => {
    const saved = localStorage.getItem("forest_active_enfant");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Could not parse saved active child", e);
      }
    }
    return DEFAULT_ENFANTS[0];
  });

  // Language state
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // Admin login status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Premium Status & Order ID
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem("forest_friends_is_premium") === "true";
  });

  const [orderId] = useState<string>(() => {
    const saved = localStorage.getItem("forest_friends_order_id");
    if (saved) return saved;
    const generated = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("forest_friends_order_id", generated);
    return generated;
  });

  // User progress for interactive book
  const [progress, setProgress] = useState<UserProgress | null>(() => {
    const saved = localStorage.getItem("forest_friends_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProgress;
        parsed.isPremium = localStorage.getItem("forest_friends_is_premium") === "true";
        parsed.orderId = localStorage.getItem("forest_friends_order_id") || undefined;
        return parsed;
      } catch (e) {
        console.warn("Could not parse saved progress:", e);
      }
    }
    return null;
  });

  const [isBookViewerActive, setIsBookViewerActive] = useState<boolean>(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("forest_friends_dark_mode") === "true";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("forest_friends_dark_mode", String(next));
      return next;
    });
  };

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectEnfant = (enfant: Enfant) => {
    setActiveEnfant(enfant);
    localStorage.setItem("forest_active_enfant", JSON.stringify(enfant));
  };

  // Automatically check payment status from the backend database when the app mounts
  useEffect(() => {
    const savedOrderId = localStorage.getItem("forest_friends_order_id");
    if (savedOrderId) {
      fetch(`/api/payment/status/${savedOrderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Status check failed");
          return res.json();
        })
        .then((data) => {
          if (data.status === "paid") {
            setIsPremium(true);
            localStorage.setItem("forest_friends_is_premium", "true");
          }
        })
        .catch(() => {});
    }
  }, []);

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    localStorage.setItem("forest_friends_is_premium", "true");
  };

  const handleProgressChange = (
    updater: UserProgress | ((prev: UserProgress) => UserProgress)
  ) => {
    setProgress((prev) => {
      if (!prev) return null;
      const updated = typeof updater === "function" ? updater(prev) : updater;
      updated.isPremium = isPremium;
      updated.orderId = orderId;
      localStorage.setItem("forest_friends_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const handleStartBook = (name: string, bookId: number, language: "fr" | "en") => {
    setLang(language);
    const updatedProgress: UserProgress = {
      childName: name,
      completionDate: "",
      currentBookId: bookId,
      currentLanguage: language,
      currentPage: 1,
      completedAnswers: {},
      isPremium,
      orderId
    };
    setProgress(updatedProgress);
    localStorage.setItem("forest_friends_progress", JSON.stringify(updatedProgress));
    setIsBookViewerActive(true);
  };

  const activeBook = progress
    ? booksData.find((b) => b.id === progress.currentBookId) || booksData[0]
    : booksData[0];

  // Helper parser for dynamic routes
  const isDefiRoute = currentPath.startsWith("/defi/");
  const isParcoursRoute = currentPath.includes("/parcours");
  const isBadgesRoute = currentPath.includes("/badges");
  const isMotsRoute = currentPath.includes("/mots-magiques");
  const isClassementRoute = currentPath.includes("/classement");
  const isCertificatRoute = currentPath.startsWith("/certificat/");

  return (
    <div className={`min-h-screen bg-warm-cream dark:bg-gray-900 font-sans text-text-charcoal dark:text-gray-100 selection:bg-sun-yellow/30 ${isDarkMode ? "dark" : ""}`}>
      <GlobalSvgSymbols />

      {/* Global Navigation Bar */}
      <Navigation
        currentPath={currentPath}
        onNavigate={navigateTo}
        activeEnfant={activeEnfant}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === "fr" ? "en" : "fr"))}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* ROUTING VIEW LOGIC */}
      <main className="pb-16">
        
        {/* 1. ADMIN PANEL */}
        {currentPath.startsWith("/admin") && (
          <AdminDashboard
            onNavigate={navigateTo}
            lang={lang}
            isAdminLoggedIn={isAdminLoggedIn}
            onSetAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}

        {/* 2. PARENT FAMILY HUB: CHILDREN LIST */}
        {currentPath === "/compte/enfants" && (
          <ChildProfilesList
            onNavigate={navigateTo}
            onSelectEnfant={handleSelectEnfant}
            activeEnfantId={activeEnfant?.id}
            lang={lang}
          />
        )}

        {/* 3. NEW CHILD PROFILE */}
        {currentPath === "/compte/enfants/nouveau" && (
          <ChildProfileNew
            onNavigate={navigateTo}
            onChildCreated={(newEnfant) => handleSelectEnfant(newEnfant)}
            lang={lang}
          />
        )}

        {/* 4. CHILD ADVENTURE PARCOURS */}
        {isParcoursRoute && activeEnfant && (
          <ChildParcours
            enfant={activeEnfant}
            onNavigate={navigateTo}
            lang={lang}
          />
        )}

        {/* 5. CHILD BADGES & MEDALS */}
        {isBadgesRoute && activeEnfant && (
          <ChildBadges
            enfant={activeEnfant}
            onNavigate={navigateTo}
            lang={lang}
          />
        )}

        {/* 6. CHILD MAGIC WORDS */}
        {isMotsRoute && activeEnfant && (
          <ChildMotsMagiques
            enfant={activeEnfant}
            onNavigate={navigateTo}
            lang={lang}
          />
        )}

        {/* 7. CHILD LEADERBOARD / CLASSEMENT */}
        {isClassementRoute && activeEnfant && (
          <ChildClassement
            enfant={activeEnfant}
            onNavigate={navigateTo}
            lang={lang}
          />
        )}

        {/* 8. SCANNABLE DEFI CHALLENGE VIEW */}
        {isDefiRoute && (() => {
          const parts = currentPath.split("/").filter(Boolean); // ["defi", "tome-slug", "chapitre-slug"]
          const tomeSlug = parts[1] || "tome-1";
          const chapitreSlug = parts[2] || "chapitre-1";
          return (
            <DefiChapterView
              tomeSlug={tomeSlug}
              chapitreSlug={chapitreSlug}
              activeEnfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          );
        })()}

        {/* 9. CERTIFICATE VIEW */}
        {isCertificatRoute && (() => {
          const parts = currentPath.split("/").filter(Boolean); // ["certificat", "tome-slug", "enfant-id"]
          const tomeSlug = parts[1] || "tome-1";
          const dummyTome: Tome = {
            id: "t1",
            slug: tomeSlug,
            titre: tomeSlug === "tome-2" ? "Tome 2 : La Cabane dans les Arbres" : "Tome 1 : La Rencontre",
            couleur_theme: "#3f9142",
            ordre: 1,
            publie: true
          };
          return (
            <CertificatReussite
              enfant={activeEnfant || DEFAULT_ENFANTS[0]}
              tome={dummyTome}
              onNavigate={navigateTo}
              lang={lang}
            />
          );
        })()}

        {/* 10. HOME / WELCOME SCREEN / BOOK VIEWER */}
        {(currentPath === "/" || currentPath === "/welcome") && (
          <div>
            {!isBookViewerActive || !progress ? (
              <WelcomeScreen
                onStart={handleStartBook}
                isPremium={isPremium}
                onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
                initialLanguage={lang}
                initialName={activeEnfant?.pseudo || progress?.childName || ""}
                initialBookId={progress?.currentBookId || 1}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            ) : (
              <div className="animate-fade-in">
                <BookViewer
                  book={activeBook}
                  progress={progress}
                  onChangeProgress={handleProgressChange}
                  onExit={() => setIsBookViewerActive(false)}
                  onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={toggleDarkMode}
                />

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
          </div>
        )}

      </main>

      {/* Premium Upgrade Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        childName={activeEnfant?.pseudo || progress?.childName || "Copain"}
        language={lang}
        orderId={orderId}
      />

      {/* Payment success callback */}
      <PaymentCallback
        language={lang}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
