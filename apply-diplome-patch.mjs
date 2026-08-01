// Patch App.tsx pour ajouter la route /verification/:tomeSlug SANS écraser
// le fichier (utile car App.tsx a pu évoluer depuis dans le repo).
//
// Utilisation : à la racine du projet (où se trouve src/App.tsx)
//   node apply-diplome-patch.mjs

import { readFileSync, writeFileSync } from "fs";

const path = "src/App.tsx";
let src = readFileSync(path, "utf-8");
let changed = false;

// 1. Import du nouveau composant
const importAnchor = 'import { CertificatReussite } from "./components/CertificatReussite";';
const importAdd = 'import { DiplomeVerificationView } from "./components/DiplomeVerificationView";';
if (src.includes(importAnchor) && !src.includes(importAdd)) {
  src = src.replace(importAnchor, `${importAnchor}\n${importAdd}`);
  changed = true;
} else if (src.includes(importAdd)) {
  console.log("Import déjà présent, on saute cette étape.");
} else {
  console.error(`ANCRE INTROUVABLE (import) : "${importAnchor}"`);
  console.error("Ouvre src/App.tsx et ajoute l'import à la main juste après celui de CertificatReussite.");
}

// 2. Déclaration de la route
const routeAnchor = 'const isCertificatRoute = currentPath.startsWith("/certificat/");';
const routeAdd =
  '  // Route publique visée par le QR "VALIDATION FINALE" imprimé sur le\n' +
  "  // diplôme papier (page 40). Contrairement à /certificat/:tomeSlug/:enfantId,\n" +
  "  // elle ne contient jamais d'identifiant d'enfant : elle s'appuie sur le\n" +
  "  // profil actif de l'appareil qui scanne.\n" +
  '  const isVerificationRoute = currentPath.startsWith("/verification/");';
if (src.includes(routeAnchor) && !src.includes("isVerificationRoute")) {
  src = src.replace(routeAnchor, `${routeAnchor}\n${routeAdd}`);
  changed = true;
} else if (src.includes("isVerificationRoute")) {
  console.log("Route déjà déclarée, on saute cette étape.");
} else {
  console.error(`ANCRE INTROUVABLE (route) : "${routeAnchor}"`);
}

// 3. Rendu JSX
const jsxAnchor = "{/* 13. MON PROFIL (Screen 10) */}";
const jsxAdd = `{/* 12bis. VÉRIFICATION D'AUTHENTICITÉ DU DIPLÔME (QR final imprimé) */}
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

        `;
if (src.includes(jsxAnchor) && !src.includes("DiplomeVerificationView\n")) {
  src = src.replace(jsxAnchor, `${jsxAdd}${jsxAnchor}`);
  changed = true;
} else if (src.includes("<DiplomeVerificationView")) {
  console.log("JSX déjà présent, on saute cette étape.");
} else {
  console.error(`ANCRE INTROUVABLE (JSX) : "${jsxAnchor}"`);
}

if (changed) {
  writeFileSync(path, src, "utf-8");
  console.log("OK -> src/App.tsx patché.");
} else {
  console.log("Rien écrit (déjà à jour ou ancres manquantes — vérifie les messages ci-dessus).");
}
