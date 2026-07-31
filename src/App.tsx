/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { GlobalSvgSymbols } from "./components/GlobalSvgSymbols";

// Multi-Tome / Défi-Suivi Components
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
    return DEFAULT_ENFANTS[0] ?? null;
  });

  // Language state
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // Admin login status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

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
              onSelectEnfant={handleSelectEnfant}
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

        {/* 10. HOME — Child Parcours (défi-suivi), or profile creation if no child yet */}
        {(currentPath === "/" || currentPath === "/welcome") && (
          activeEnfant ? (
            <ChildParcours
              enfant={activeEnfant}
              onNavigate={navigateTo}
              lang={lang}
            />
          ) : (
            <ChildProfileNew
              onNavigate={navigateTo}
              onChildCreated={(newEnfant) => handleSelectEnfant(newEnfant)}
              lang={lang}
            />
          )
        )}

      </main>
    </div>
  );
}
