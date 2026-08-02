// Génère le QR code de validation finale du diplôme et l'insère dans
// indexfrancais-corrige-v3.html à la place du placeholder [QR VALIDATION FINALE].
//
// Utilisation (dans le dossier du projet, où "qrcode" est déjà une dépendance) :
//   node generate-qr-diplome.mjs
//
// Le fichier corrigé sera écrit en indexfrancais-corrige-v4.html

import QRCode from "qrcode";
import { readFileSync, writeFileSync } from "fs";

const URL_VERIFICATION = "https://lescopainsdelaforet.pages.dev/verification/tome-1";
const SRC = "indexfrancais-corrige-v3.html";
const DEST = "indexfrancais-corrige-v4.html";

const dataUrl = await QRCode.toDataURL(URL_VERIFICATION, {
  // 400px : suffisant pour une impression nette à ~2cm sur 300 DPI.
  width: 400,
  margin: 1,
  color: { dark: "#78350f", light: "#ffffff" } // ambre foncé, cohérent avec le diplôme
});

let html = readFileSync(SRC, "utf-8");

const target =
  '<div class="qr-slot" style="border-color:#ca8a04;width:80px;height:80px" data-qr-target="' +
  URL_VERIFICATION +
  '">\n      <span style="font-size:24px">▦</span>\n      <span class="qr-label">[QR VALIDATION FINALE — À REMPLACER PAR LE PNG POINTANT VERS ' +
  URL_VERIFICATION +
  ']</span>\n    </div>';

const replacement =
  '<div class="qr-slot" style="border-color:#ca8a04;width:80px;height:80px">\n' +
  `      <img src="${dataUrl}" alt="QR code validation finale du diplôme" width="80" height="80" style="display:block">\n` +
  '    </div>';

if (!html.includes(target)) {
  console.error("Placeholder introuvable — vérifie que tu utilises bien indexfrancais-corrige-v3.html");
  process.exit(1);
}

html = html.replace(target, replacement);
writeFileSync(DEST, html, "utf-8");
console.log(`OK -> ${DEST}`);
