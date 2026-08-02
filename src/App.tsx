import { useState, useEffect } from "react";
import { GlobalSvgSymbols } from "./components/GlobalSvgSymbols";

// Components
import { SplashScreen } from "./components/SplashScreen";
import { Navigation } from "./components/Navigation";
import { LandingView } from "./components/LandingView";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChoisisTonProfilView } from "./components/ChoisisTonProfilView";
import { QRScannerView } from "./components/QRScannerView";
import { ChildProfileNew } from "./components/ChildProfileNew";
import { ChildParcours } from "./components/ChildParcours";
import { ChildBadges } from "./components/ChildBadges";
import { ChildMotsMagiques } from "./components/ChildMotsMagiques";
import { ChildClassement } from "./components/ChildClassement";
import { DefiChapterView } from "./components/DefiChapterView";
import { MaProgressionView } from "./components/MaProgressionView";
import { CertificatReussite } from "./components/CertificatReussite";
import { DiplomeVerificationView } from "./components/DiplomeVerificationView";
import { MonProfilView } from "./components/MonProfilView";
import { AdminDashboard } from "./components/AdminDashboard";

import { Enfant } from "./types/multiTome";
import { multiTomeService } from "./services/multiTomeService";
import { ensureSession } from "./lib/supabase";
import { Language } from "./i18n/translations";
import { backgroundMusic } from "./utils/backgroundMusic";

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

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
    return null;
  });

  useEffect(() => {
    // Synchronize active child with available real profiles.
    // ensureSession() ouvre (ou réutilise) la session anonyme Supabase : sans
    // elle, la RLS de "children" ne renvoie jamais aucune ligne.
    ensureSession().then(() => multiTomeService.getEnfantsByParent()).then((enfants) => {
      if (enfants.length > 0) {
        if (!activeEnfant || !enfants.some((e) => e.id === activeEnfant.id)) {
          setActiveEnfant(enfants[0]);
          localStorage.setItem("forest_active_enfant", JSON.stringify(enfants[0]));
        } else {
          // Sync existing activeEnfant with fresh data from database (e.g. updated avatar)
          const updatedActive = enfants.find((e) => e.id === activeEnfant.id);
          if (updatedActive) {
            setActiveEnfant(updatedActive);
            localStorage.setItem("forest_active_enfant", JSON.stringify(updatedActive));
          }
        }
      } else {
        if (activeEnfant) {
          setActiveEnfant(null);
          localStorage.removeItem("forest_active_enfant");
        }
      }
    });
  }, []);

  // Language state (fr, en, es, de, it, pt)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("forest_lang");
    return (saved as Language) || "fr";
  });

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("forest_lang", newLang);
  };

  // Admin login status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Dark Mode (defaults to light/white theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("forest_friends_dark_mode") === "true";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

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

  // Helper parsers for dynamic routes
  const isDefiRoute = currentPath.startsWith("/defi/");
  const isParcoursRoute = currentPath.startsWith("/parcours");
  const isBadgesRoute = currentPath.startsWith("/badges");
  const isMotsRoute = currentPath.startsWith("/mots-magiques");
  const isClassementRoute = currentPath.startsWith("/classement");
  const isCertificatRoute = currentPath.startsWith("/certificat/");
  // Route publique visée par le QR "VALIDATION FINALE" imprimé sur le
  // diplôme papier (page 40). Contrairement à /certificat/:tomeSlug/:enfantId,
  // elle ne contient jamais d'identifiant d'enfant : elle s'appuie sur le
  // profil actif de l'appareil qui scanne.
  const isVerificationRoute = currentPath.startsWith("/verification/");
  const isProgressionRoute = currentPath === "/progression";
  const isScanRoute = currentPath === "/scan";
  const isProfilRoute = currentPath === "/profil";
  const isLandingRoute = currentPath === "/landing";

  // Gestionnaire de musique de fond (générique de jeu éducatif)
  // Coupé automatiquement sur l'écran de défi (isDefiRoute) pour préserver la concentration de l'enfant.
  useEffect(() => {
    if (isDefiRoute) {
      backgroundMusic.setConcentrationMode(true);
    } else {
      backgroundMusic.setConcentrationMode(false);
    }
  }, [isDefiRoute, currentPath]);

  // Démarre la musique de fond dès la première interaction utilisateur sur l'écran (politique de lecture auto)
  useEffect(() => {
    const handleGesture = () => {
      if (!isDefiRoute && !backgroundMusic.getMuted()) {
        backgroundMusic.start();
      }
    };
    window.addEventListener("click", handleGesture, { once: true });
    window.addEventListener("touchstart", handleGesture, { once: true });
    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };
  }, [isDefiRoute]);

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 ${isDarkMode ? "dark" : ""}`}>
      <GlobalSvgSymbols />

      {/* 1. SPLASH SCREEN INTRO */}
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
          lang={lang}
        />
      )}

      {/* Global Navigation Bar (Hidden on raw landing view if desired, or shown universally) */}
      {!isLandingRoute && (
        <Navigation
          currentPath={currentPath}
          onNavigate={navigateTo}
          activeEnfant={activeEnfant}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          lang={lang}
          onSelectLang={handleSelectLang}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* ROUTING MAIN VIEW */}
      <main className={isLandingRoute ? "" : "pt-2"}>
        {/* 1. LANDING SCREEN (Screen 1) */}
        {isLandingRoute && (
          <LandingView
            onNavigate={navigateTo}
            lang={lang}
            onSelectLang={handleSelectLang}
            onContinueWithoutAccount={() => navigateTo("/parcours")}
          />
        )}

        {/* 2. ADMIN PANEL — uniquement sur l'URL exacte /admin, jamais via un bouton de l'appli */}
        {currentPath === "/admin" && (
          <AdminDashboard
            onNavigate={navigateTo}
            lang={lang}
            isAdminLoggedIn={isAdminLoggedIn}
            onSetAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}

        {/* 3. QR SCANNER VIEW (Screen 3) */}
        {isScanRoute && (
          <QRScannerView
            onNavigate={navigateTo}
            lang={lang}
            activeEnfantId={activeEnfant?.id}
          />
        )}

        {/* 4. CHOISIS TON PROFIL (Screen 2 & /compte/enfants) */}
        {(currentPath === "/compte/enfants" || currentPath === "/profil/choisir") && (
          <ChoisisTonProfilView
            onNavigate={navigateTo}
            onSelectEnfant={handleSelectEnfant}
            activeEnfantId={activeEnfant?.id}
            lang={lang}
          />
        )}

        {/* 5. NEW CHILD PROFILE */}
        {currentPath === "/compte/enfants/nouveau" && (
          <ChildProfileNew
            onNavigate={navigateTo}
            onChildCreated={(newEnfant) => {
              handleSelectEnfant(newEnfant);
              navigateTo("/");
            }}
            lang={lang}
          />
        )}

        {/* 6. CHILD ADVENTURE PARCOURS (Screen 4) */}
        {isParcoursRoute && (
          activeEnfant ? (
            <ChildParcours
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 7. MA PROGRESSION (Screen 7) */}
        {isProgressionRoute && (
          activeEnfant ? (
            <MaProgressionView
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 8. CHILD BADGES & MEDALS */}
        {isBadgesRoute && (
          activeEnfant ? (
            <ChildBadges
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 9. CHILD MAGIC WORDS */}
        {isMotsRoute && (
          activeEnfant ? (
            <ChildMotsMagiques
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 10. CHILD LEADERBOARD / CLASSEMENT (Screen 8) */}
        {isClassementRoute && (
          activeEnfant ? (
            <ChildClassement
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 11. SCANNABLE DEFI CHALLENGE VIEW (Screen 5 & Screen 6) */}
        {isDefiRoute && (() => {
          const parts = currentPath.split("/").filter(Boolean); // ["defi", "tome-slug", "chapitre-slug"]
          const tomeSlug = parts[1] || "tome-1";
          const chapitreSlug = parts[2] || "chapitre-1";
          return (
            <DefiChapterView
              tomeSlug={tomeSlug}
              chapitreSlug={chapitreSlug}
              activeEnfant={activeEnfant}
              onSelectEnfant={handleSelectEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          );
        })()}

        {/* 12. CERTIFICATE VIEW (Screen 9) */}
        {isCertificatRoute && (() => {
          const parts = currentPath.split("/").filter(Boolean); // ["certificat", "tome-slug", "enfant-id"]
          const tomeSlug = parts[1] || "tome-1";
          const enfantId = parts[2] || activeEnfant?.id || "enfant-1";
          return (
            <CertificatReussite
              tomeSlug={tomeSlug}
              enfantId={enfantId}
              enfantName={activeEnfant?.pseudo || "Léo"}
              enfantAvatar={activeEnfant?.avatar || "leo"}
              onNavigate={navigateTo}
              lang={lang}
            />
          );
        })()}

        {/* 12bis. VÉRIFICATION D'AUTHENTICITÉ DU DIPLÔME (QR final imprimé) */}
        {isVerificationRoute && (() => {
          const parts = currentPath.split("/").filter(Boolean); // ["verification", "tome-slug"]
          const tomeSlug = parts[1] || "tome-1";
          return (
            <DiplomeVerificationView
              tomeSlug={tomeSlug}
              activeEnfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          );
        })()}

        {/* 13. MON PROFIL (Screen 10) */}
        {isProfilRoute && (
          activeEnfant ? (
            <MonProfilView
              enfant={activeEnfant}
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              lang={lang}
            />
          ) : (
            <ChoisisTonProfilView
              onNavigate={navigateTo}
              onSelectEnfant={handleSelectEnfant}
              activeEnfantId={undefined}
              lang={lang}
            />
          )
        )}

        {/* 14. DEFAULT HOME SCREEN */}
        {currentPath === "/" && (
          <WelcomeScreen
            onNavigate={navigateTo}
            activeEnfant={activeEnfant}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
