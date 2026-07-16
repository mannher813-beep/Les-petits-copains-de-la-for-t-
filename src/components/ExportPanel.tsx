/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookData } from "../types";
import { FileCode, Printer, Loader2, Sparkles, Lock, Unlock } from "lucide-react";
import { supabase } from "../supabase";

interface ExportPanelProps {
  book: BookData;
  childName: string;
  language: "fr" | "en";
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  book,
  childName,
  language
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (session.user.app_metadata?.role === "admin") {
          setIsAdmin(true);
        } else {
          await supabase.auth.signOut();
          setIsAdmin(false);
        }
      }
    };
    checkUser();
  }, []);

  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setIsAuthenticating(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) {
        setAdminError(
          language === "fr"
            ? `Échec de connexion : ${error.message}`
            : `Login failed: ${error.message}`
        );
        setIsAuthenticating(false);
        return;
      }

      if (data?.user?.app_metadata?.role === "admin") {
        setIsAdmin(true);
        setShowAdminInput(false);
        setAdminEmail("");
        setAdminPassword("");
      } else {
        setAdminError(
          language === "fr"
            ? "Accès refusé : vous n'êtes pas administrateur."
            : "Access denied: you are not an administrator."
        );
        await supabase.auth.signOut();
        setIsAdmin(false);
      }
    } catch (err: any) {
      setAdminError(err.message || "An error occurred");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const generateHTML = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const title = language === "fr" 
      ? `Les Copains de la Forêt - Tome ${book.id} - ${book.titleFr}`
      : `The Forest Friends - Volume ${book.id} - ${book.titleEn}`;

    const langCode = language === "fr" ? "fr" : "en";

    // 100% vector-perfect, infinitely scalable and printable book asset library
    const svgDefs = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
<symbol id="c-leo" viewBox="0 0 120 150">
 <path d="M84 120 Q116 118 108 88 Q124 118 92 140 Z" fill="#d97428"/>
 <ellipse cx="60" cy="112" rx="26" ry="30" fill="#f0913f"/>
 <ellipse cx="60" cy="118" rx="15" ry="20" fill="#fff3e2"/>
 <ellipse cx="37" cy="108" rx="7" ry="13" fill="#e8813a" transform="rotate(18 37 108)"/>
 <ellipse cx="83" cy="108" rx="7" ry="13" fill="#e8813a" transform="rotate(-18 83 108)"/>
 <ellipse cx="48" cy="141" rx="9" ry="6" fill="#d97428"/>
 <ellipse cx="72" cy="141" rx="9" ry="6" fill="#d97428"/>
 <polygon points="32,36 22,4 54,24" fill="#e8813a"/>
 <polygon points="88,36 98,4 66,24" fill="#e8813a"/>
 <polygon points="34,28 29,12 46,22" fill="#fff3e2"/>
 <polygon points="86,28 91,12 74,22" fill="#fff3e2"/>
 <circle cx="60" cy="48" r="31" fill="#f0913f"/>
 <ellipse cx="60" cy="60" rx="17" ry="12" fill="#fff3e2"/>
 <ellipse cx="60" cy="55" rx="5" ry="4" fill="#5a3620"/>
 <path d="M52 65 Q60 71 68 65" stroke="#5a3620" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 <circle cx="47" cy="43" r="4.5" fill="#3a2415"/><circle cx="73" cy="43" r="4.5" fill="#3a2415"/>
 <circle cx="48.5" cy="41.5" r="1.6" fill="#fff"/><circle cx="74.5" cy="41.5" r="1.6" fill="#fff"/>
 <circle cx="37" cy="55" r="4" fill="#f8bd8e"/><circle cx="83" cy="55" r="4" fill="#f8bd8e"/>
</symbol>
<symbol id="c-nina" viewBox="0 0 120 150">
 <path d="M80 128 Q110 126 106 104 Q118 130 86 142" fill="none" stroke="#a7aebc" stroke-width="5" stroke-linecap="round"/>
 <ellipse cx="60" cy="114" rx="23" ry="27" fill="#a7aebc"/>
 <ellipse cx="60" cy="120" rx="13" ry="17" fill="#e9edf4"/>
 <ellipse cx="40" cy="110" rx="6" ry="11" fill="#99a1b0" transform="rotate(20 40 110)"/>
 <ellipse cx="80" cy="110" rx="6" ry="11" fill="#99a1b0" transform="rotate(-20 80 110)"/>
 <ellipse cx="50" cy="140" rx="8" ry="5" fill="#8f97a6"/>
 <ellipse cx="70" cy="140" rx="8" ry="5" fill="#8f97a6"/>
 <circle cx="30" cy="27" r="17" fill="#a7aebc"/><circle cx="90" cy="27" r="17" fill="#a7aebc"/>
 <circle cx="30" cy="27" r="9" fill="#f6b8c8"/><circle cx="90" cy="27" r="9" fill="#f6b8c8"/>
 <circle cx="60" cy="56" r="28" fill="#b3bac7"/>
 <ellipse cx="60" cy="67" rx="14" ry="9" fill="#f0f3f8"/>
 <circle cx="60" cy="61" r="3.8" fill="#e2708f"/>
 <path d="M54 71 Q60 75 66 71" stroke="#5a5a6a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
 <circle cx="49" cy="51" r="4" fill="#33333f"/><circle cx="71" cy="51" r="4" fill="#33333f"/>
 <circle cx="50.4" cy="49.6" r="1.4" fill="#fff"/><circle cx="72.4" cy="49.6" r="1.4" fill="#fff"/>
 <path d="M40 64 L24 60 M40 68 L25 70" stroke="#8f97a6" stroke-width="1.6"/>
 <path d="M80 64 L96 60 M80 68 L95 70" stroke="#8f97a6" stroke-width="1.6"/>
 <circle cx="41" cy="62" r="3.5" fill="#f2c4d0"/><circle cx="79" cy="62" r="3.5" fill="#f2c4d0"/>
</symbol>
<symbol id="c-tom" viewBox="0 0 130 145">
 <g fill="#7a5230">
  <polygon points="65,2 54,32 80,30"/><polygon points="32,8 34,40 58,28"/>
  <polygon points="98,8 96,40 72,28"/><polygon points="10,30 24,54 42,32"/>
  <polygon points="120,30 106,54 88,32"/><polygon points="2,60 24,72 24,46"/>
  <polygon points="128,60 106,72 106,46"/><polygon points="6,88 28,88 18,66"/>
  <polygon points="124,88 102,88 112,66"/>
 </g>
 <circle cx="65" cy="66" r="43" fill="#8a5f38"/>
 <ellipse cx="65" cy="82" rx="28" ry="26" fill="#eccfa2"/>
 <circle cx="53" cy="74" r="4.2" fill="#3a2b18"/><circle cx="77" cy="74" r="4.2" fill="#3a2b18"/>
 <circle cx="54.4" cy="72.6" r="1.5" fill="#fff"/><circle cx="78.4" cy="72.6" r="1.5" fill="#fff"/>
 <circle cx="65" cy="88" r="5" fill="#4a3120"/>
 <path d="M57 96 Q65 102 73 96" stroke="#4a3120" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 <circle cx="44" cy="86" r="4" fill="#e5b287"/><circle cx="86" cy="86" r="4" fill="#e5b287"/>
 <ellipse cx="48" cy="132" rx="9" ry="6" fill="#6b4726"/>
 <ellipse cx="82" cy="132" rx="9" ry="6" fill="#6b4726"/>
</symbol>
<symbol id="c-zaza" viewBox="0 0 110 145">
 <polygon points="22,96 2,110 20,112 6,126 26,120" fill="#3f97cc"/>
 <path d="M48 12 Q44 0 36 4 M55 10 Q55 -2 47 0 M62 12 Q66 0 74 4" stroke="#3f97cc" stroke-width="3.5" fill="none" stroke-linecap="round"/>
 <circle cx="55" cy="70" r="35" fill="#56b1e6"/>
 <ellipse cx="55" cy="86" rx="21" ry="16" fill="#ffd95e"/>
 <ellipse cx="30" cy="76" rx="11" ry="19" fill="#3f97cc" transform="rotate(18 30 76)"/>
 <ellipse cx="84" cy="56" rx="10" ry="17" fill="#ffd95e" transform="rotate(-42 84 56)"/>
 <circle cx="45" cy="58" r="4.5" fill="#243447"/><circle cx="66" cy="58" r="4.5" fill="#243447"/>
 <circle cx="46.4" cy="56.6" r="1.6" fill="#fff"/><circle cx="67.4" cy="56.6" r="1.6" fill="#fff"/>
 <polygon points="55,64 67,71 55,78 43,71" fill="#f7a531"/>
 <path d="M47 108 L47 126 M63 108 L63 126" stroke="#f7a531" stroke-width="3.5" stroke-linecap="round"/>
 <path d="M40 128 L47 126 L54 128 M56 128 L63 126 L70 128" stroke="#f7a531" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</symbol>
<symbol id="d-tree" viewBox="0 0 100 130">
 <rect x="44" y="78" width="13" height="48" rx="5" fill="#8a5a33"/>
 <circle cx="50" cy="44" r="32" fill="#4c9e4f"/>
 <circle cx="27" cy="62" r="21" fill="#3d8b40"/>
 <circle cx="74" cy="62" r="21" fill="#5cae5f"/>
</symbol>
<symbol id="d-sapin" viewBox="0 0 100 130">
 <rect x="44" y="100" width="12" height="26" rx="4" fill="#7c5130"/>
 <polygon points="50,4 20,52 80,52" fill="#2e7d46"/>
 <polygon points="50,34 14,86 86,86" fill="#379052"/>
 <polygon points="50,62 8,112 92,112" fill="#2e7d46"/>
</symbol>
<symbol id="d-champi" viewBox="0 0 100 100">
 <path d="M8 56 Q50 -12 92 56 Z" fill="#e05a4e"/>
 <circle cx="34" cy="34" r="6" fill="#fff"/><circle cx="60" cy="22" r="5" fill="#fff"/>
 <circle cx="72" cy="42" r="5.5" fill="#fff"/>
 <rect x="37" y="54" width="26" height="38" rx="10" fill="#f6ead2"/>
</symbol>
<symbol id="d-fleur" viewBox="0 0 100 100">
 <rect x="47" y="52" width="6" height="44" rx="3" fill="#4c9e4f"/>
 <circle cx="50" cy="26" r="13" fill="#f6a8c4"/><circle cx="30" cy="38" r="13" fill="#f6a8c4"/>
 <circle cx="70" cy="38" r="13" fill="#f6a8c4"/><circle cx="38" cy="56" r="13" fill="#f6a8c4"/>
 <circle cx="62" cy="56" r="13" fill="#f6a8c4"/><circle cx="50" cy="42" r="11" fill="#ffd23f"/>
</symbol>
<symbol id="d-fleur2" viewBox="0 0 100 100">
 <rect x="47" y="52" width="6" height="44" rx="3" fill="#4c9e4f"/>
 <circle cx="50" cy="26" r="13" fill="#ffd95e"/><circle cx="30" cy="38" r="13" fill="#ffd95e"/>
 <circle cx="70" cy="38" r="13" fill="#ffd95e"/><circle cx="38" cy="56" r="13" fill="#ffd95e"/>
 <circle cx="62" cy="56" r="13" fill="#ffd95e"/><circle cx="50" cy="42" r="11" fill="#e05a4e"/>
</symbol>
<symbol id="d-soleil" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="20" fill="#ffd23f"/>
 <g stroke="#f5b800" stroke-width="5" stroke-linecap="round">
  <line x1="50" y1="8" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="92"/>
  <line x1="8" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="92" y2="50"/>
  <line x1="20" y1="20" x2="30" y2="30"/><line x1="70" y1="70" x2="80" y2="80"/>
  <line x1="80" y1="20" x2="70" y2="30"/><line x1="30" y1="70" x2="20" y2="80"/>
 </g>
</symbol>
<symbol id="d-nuage" viewBox="0 0 120 60">
 <ellipse cx="40" cy="38" rx="28" ry="18" fill="#fff"/>
 <ellipse cx="70" cy="28" rx="24" ry="18" fill="#fff"/>
 <ellipse cx="92" cy="40" rx="22" ry="14" fill="#fff"/>
</symbol>
<symbol id="d-pomme" viewBox="0 0 100 100">
 <path d="M50 22 Q52 10 60 6" stroke="#7c5130" stroke-width="5" fill="none" stroke-linecap="round"/>
 <ellipse cx="68" cy="16" rx="11" ry="6" fill="#4c9e4f" transform="rotate(-20 68 16)"/>
 <circle cx="50" cy="58" r="34" fill="#e5484d"/>
 <ellipse cx="38" cy="46" rx="8" ry="12" fill="#f28389" transform="rotate(20 38 46)"/>
</symbol>
<symbol id="d-etoile" viewBox="0 0 100 100">
 <polygon points="50,4 62,36 96,38 69,60 79,94 50,74 21,94 31,60 4,38 38,36"
  fill="#ffd23f" stroke="#e8a800" stroke-width="4" stroke-linejoin="round"/>
</symbol>
<symbol id="d-papillon" viewBox="0 0 100 100">
 <ellipse cx="32" cy="34" rx="20" ry="16" fill="#b28fd8" transform="rotate(-20 32 34)"/>
 <ellipse cx="68" cy="34" rx="20" ry="16" fill="#b28fd8" transform="rotate(20 68 34)"/>
 <ellipse cx="34" cy="62" rx="15" ry="12" fill="#f6a8c4" transform="rotate(15 34 62)"/>
 <ellipse cx="66" cy="62" rx="15" ry="12" fill="#f6a8c4" transform="rotate(-15 66 62)"/>
 <ellipse cx="50" cy="50" rx="6" ry="24" fill="#5a4a6a"/>
 <path d="M46 24 Q40 12 34 10 M54 24 Q60 12 66 10" stroke="#5a4a6a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</symbol>
<symbol id="d-noisette" viewBox="0 0 100 100">
 <path d="M50 90 Q16 78 22 46 Q30 24 50 32 Q70 24 78 46 Q84 78 50 90 Z" fill="#b07840"/>
 <path d="M26 40 Q50 20 74 40 L70 28 Q50 12 30 28 Z" fill="#7c5130"/>
 <rect x="46" y="10" width="8" height="14" rx="4" fill="#7c5130"/>
</symbol>
<symbol id="d-feuille" viewBox="0 0 100 100">
 <path d="M50 6 Q92 30 78 70 Q64 96 50 94 Q36 96 22 70 Q8 30 50 6 Z" fill="#5cae5f"/>
 <path d="M50 16 L50 90" stroke="#2e7d46" stroke-width="4"/>
 <path d="M50 40 L32 30 M50 40 L68 30 M50 62 L30 52 M50 62 L70 52" stroke="#2e7d46" stroke-width="3"/>
</symbol>
<symbol id="d-trophee" viewBox="0 0 100 100">
 <path d="M30 12 H70 V40 Q70 62 50 66 Q30 62 30 40 Z" fill="#ffd23f" stroke="#e8a800" stroke-width="3"/>
 <path d="M30 18 H14 Q14 42 32 44 M70 18 H86 Q86 42 68 44" fill="none" stroke="#e8a800" stroke-width="5"/>
 <rect x="44" y="64" width="12" height="12" fill="#e8a800"/>
 <rect x="32" y="76" width="36" height="10" rx="3" fill="#b07800"/>
 <polygon points="50,24 54,34 65,34 56,41 59,52 50,45 41,52 44,41 35,34 46,34" fill="#fff8dd"/>
</symbol>
<symbol id="d-coeur" viewBox="0 0 100 100">
 <path d="M50 88 Q10 58 12 34 Q14 12 34 12 Q46 12 50 26 Q54 12 66 12 Q86 12 88 34 Q90 58 50 88 Z" fill="#e5647a"/>
</symbol>
</defs>
</svg>
`;

    // High fidelity HTML structure for the entire 40 pages compiled based on Tome and Lang
    let bookPagesHTML = "";

    // Loop from page 1 to 40
    for (let p = 1; p <= 40; p++) {
      let pageContent = "";
      let classList = "page print-page-break active";

      if (p === 1) {
        // Page 1: Cover Page
        const subtitle = language === "fr" ? "Les Copains de la Forêt" : "The Forest Friends";
        const tomeTitle = book.id === 1 
          ? (language === "fr" ? "La rencontre" : "The Meeting")
          : (language === "fr" ? "La cabane dans les arbres" : "The Treehouse");

        pageContent = `
          <div class="page-fit-wrap" style="text-align: center; justify-content: space-between; height: 100%; display: flex; flex-direction: column;">
            <div>
              <p style="font-size: 15px; font-weight: bold; color: var(--vert); letter-spacing: 2px;">
                ${language === "fr" ? "🌟 CAHIER D'ACTIVITÉS ÉDUCATIF 🌟" : "🌟 EDUCATIONAL ACTIVITY BOOK 🌟"}
              </p>
              <p style="font-size: 16px; font-weight: bold; color: var(--vertclair); margin-top: 5px;">
                ${language === "fr" ? "Pour les enfants de 5 à 7 ans" : "For children aged 5 to 7"}
              </p>
            </div>
            
            <div style="border: 4px solid var(--vertclair); border-radius: 24px; padding: 25px; background: #f4faf4; margin: 30px 0; position: relative;">
              <h1 style="font-size: 42px; margin-bottom: 5px; color: var(--vert); font-family: 'Fredoka One', cursive;">
                ${tomeTitle}
              </h1>
              <p style="font-size: 24px; font-weight: bold; color: var(--orange); margin-bottom: 20px;">
                ${subtitle}
              </p>
              <svg viewBox="0 0 400 200" style="width: 100%; height: 160px; display: block; margin: 0 auto;">
                <rect width="400" height="150" fill="#d2f1fc" rx="10"/>
                <rect y="120" width="400" height="80" fill="#bfe3a8" rx="10"/>
                <use href="#d-soleil" x="20" y="15" width="45" height="45"/>
                <use href="#d-tree" x="320" y="40" width="60" height="90"/>
                <use href="#d-sapin" x="30" y="55" width="55" height="85"/>
                <use href="#c-leo" x="120" y="80" width="65" height="80"/>
                <use href="#c-nina" x="185" y="90" width="55" height="70"/>
              </svg>
              <div style="margin-top: 25px; padding: 12px 25px; background: #ffffff; border: 2px dashed var(--vertclair); border-radius: 16px; display: inline-block;">
                <p style="font-size: 13px; color: #888; font-weight: bold; margin-bottom: 2px;">
                  ${language === "fr" ? "Ce cahier t'appartient !" : "This book belongs to you!"}
                </p>
                <p style="font-size: 26px; font-weight: bold; color: var(--vert);">${childName}</p>
              </div>
            </div>

            <div style="font-size: 15px; color: #7f9c81;">
              <p style="font-weight: bold;">© TechSen for Kids 2026</p>
              <p style="font-size: 13px; margin-top: 4px;">
                ${language === "fr" ? "Tous droits réservés." : "All rights reserved."}
              </p>
            </div>
          </div>
        `;
      } else if (p === 2) {
        // Page 2: Presentation
        const headerTitle = language === "fr" ? "Bonjour, toi ! 👋" : "Hello, you! 👋";
        const intro = language === "fr"
          ? "Nous sommes les Copains de la Forêt. Viens, on se présente !"
          : "We are the Forest Friends. Come, let's meet each other!";
        const childMsg = language === "fr"
          ? `🌟 Et toi, ${childName}, tu es notre 5ᵉ Copain ! 🌟`
          : `🌟 And you, ${childName}, are our 5th Friend! 🌟`;

        pageContent = `
          <div class="page-fit-wrap">
            <h2>${headerTitle}</h2>
            <p style="text-align:center; font-size:18px; margin:2mm 0; color: #666;">${intro}</p>
            
            <div class="bubble"><svg><use href="#c-leo"/></svg>
              <span><b>Léo :</b> ${language === "fr" ? "« Salut ! Je suis roux et très malin. J'adore les devinettes… et les pommes ! »" : "« Hi! I'm orange and very clever. I love riddles... and apples! »"}</span>
            </div>
            <div class="bubble"><svg><use href="#c-nina"/></svg>
              <span><b>Nina :</b> ${language === "fr" ? "« Coucou ! Je suis petite mais super rapide. Je connais tous les chemins de la forêt. »" : "« Hi! I'm small but super fast. I know all the forest paths. »"}</span>
            </div>
            <div class="bubble"><svg><use href="#c-tom"/></svg>
              <span><b>Darina :</b> ${language === "fr" ? "« Bonjour… Je suis piquante dehors, mais toute douce dedans. J'aime compter les noisettes. »" : "« Hello... I am prickly on the outside, but soft inside. I love counting hazelnuts. »"}</span>
            </div>
            <div class="bubble"><svg><use href="#c-zaza"/></svg>
              <span><b>Lana :</b> ${language === "fr" ? "« Cui-cui ! Je chante, je vole, je vois tout d'en haut. Bienvenue ! »" : "« Tweet-tweet! I sing, I fly, I see everything from above. Welcome! »"}</span>
            </div>

            <div style="background:#eaf6e5; border:3px solid var(--vertclair); border-radius:16px; padding:3mm 5mm; margin-top:3mm; text-align:center">
              <p style="font-size:20px; font-weight:bold; color:var(--vert)">${childMsg}</p>
              <p style="font-size:15px; margin-top:1mm; color: #444;">
                ${language === "fr" ? "Dans ce cahier, les Copains ont besoin de ton aide pour vivre une grande aventure !" : "In this book, the Friends need your help to live a great adventure!"}
              </p>
            </div>

            <div class="note-histoire" style="margin-top: 3mm; padding: 8px 12px; font-size: 15px;">
              <p style="font-weight:bold; font-size:16px; margin-bottom: 2px;">📖 ${language === "fr" ? "Comment faire ?" : "How to play:"}</p>
              <p>✏️ ${language === "fr" ? "Prends un crayon de bois et tes feutres." : "Get a pencil and some markers."}</p>
              <p>🎯 ${language === "fr" ? "Lis la consigne, puis accomplis ta mission." : "Read the instruction, then do your mission."}</p>
            </div>
          </div>
        `;
      } else if (p === 40) {
        // Page 40: Diploma
        const dTitle = language === "fr" ? "Diplôme officiel" : "Official Certificate";
        const dSub = language === "fr" ? "des Copains de la Forêt" : "of the Forest Friends";
        const dText = language === "fr"
          ? `pour avoir terminé les <b>44 missions</b> de la grande aventure, gagné les <b>6 badges</b> de la forêt, et être devenu(e) pour toujours le 5ᵉ Copain de la Forêt.`
          : `for successfully completing all <b>44 missions</b> of the great adventure, earning all <b>6 badges</b>, and becoming forever the 5th Forest Friend.`;

        pageContent = `
          <div class="page-fit-wrap" style="height: 100%; justify-content: space-between;">
            <div style="border: 5px double var(--jaune); border-radius: 18px; padding: 20px; height: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; background: #fffdf4;">
              <p style="font-size: 13px; color: #b0790a; font-weight: bold; letter-spacing: 2px;">TECHSEN FOR KIDS</p>
              <h2 style="font-size: 34px; margin: 5px 0; color: #b0790a; font-family: 'Fredoka One', cursive;">🏆 ${dTitle} 🏆</h2>
              <p style="font-size: 18px; color: #8a7a4a; font-weight: bold;">${dSub}</p>

              <svg viewBox="0 0 600 150" style="width: 100%; max-width: 450px; margin: 15px 0;">
                <rect y="100" width="600" height="50" rx="6" fill="#bfe3a8"/>
                <use href="#c-leo" x="80" y="20" width="85" height="110"/>
                <use href="#c-nina" x="180" y="35" width="75" height="95"/>
                <use href="#c-tom" x="270" y="40" width="80" height="90"/>
                <use href="#c-zaza" x="360" y="35" width="75" height="95"/>
                <use href="#d-etoile" x="15" y="10" width="35" height="35"/>
                <use href="#d-etoile" x="540" y="10" width="35" height="35"/>
              </svg>

              <p style="font-size: 18px; margin-bottom: 5px;">${language === "fr" ? "Ce diplôme est décerné à :" : "This certificate is awarded to:"}</p>
              <p style="font-size: 32px; font-weight: bold; font-family: 'Short Stack', cursive; color: var(--vert); border-bottom: 3px dashed var(--orange); padding: 0 30px; display: inline-block;">
                ${childName}
              </p>

              <p style="font-size: 15px; line-height: 1.5; margin: 15px 0; max-width: 500px; color: #5a4a3a;">
                ${dText}
              </p>

              <p style="font-size: 16px;">
                ${language === "fr" ? "Fait dans la Grande Clairière, le :" : "Done in the Grand Clearing, on:"}
                <span class="case-ecrire" style="min-width: 40mm;"></span>
              </p>

              <div style="display: flex; gap: 6mm; margin-top: 15px; font-size: 13px; color: #8a7a4a; font-weight: bold;">
                <span>✍️ Léo 🦊</span><span>✍️ Nina 🐭</span><span>✍️ Darina 🦔</span><span>✍️ Lana 🐦</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // Chapters & pages orchestration
        let chapId = 1;
        let offset = 3;

        if (p >= 3 && p <= 8) {
          chapId = 1;
          offset = 3;
          classList += " ch1";
        } else if (p >= 9 && p <= 16) {
          chapId = 2;
          offset = 9;
          classList += " ch2";
        } else if (p >= 17 && p <= 24) {
          chapId = 3;
          offset = 17;
          classList += " ch3";
        } else if (p >= 25 && p <= 32) {
          chapId = 4;
          offset = 25;
          classList += " ch4";
        } else if (p >= 33 && p <= 39) {
          chapId = 5;
          offset = 33;
          classList += " ch5";
        }

        const chapter = book.chapters.find(c => c.id === chapId)!;
        const relPage = p - offset;

        const isLastOfChapter = (chapId === 1 && relPage === 5) || 
                              (chapId > 1 && relPage === (chapId === 5 ? 6 : 7));

        if (relPage === 0) {
          // Chapter Cover Page
          const titleText = language === "fr" ? chapter.titleFr : chapter.titleEn;
          const labelText = language === "fr" ? `Chapitre ${chapter.id}` : `Chapter ${chapter.id}`;
          pageContent = `
            <div class="page-fit-wrap" style="height: 100%; justify-content: space-between;">
              <div class="chap-band">
                <svg viewBox="0 0 120 150"><use href="#c-leo"/></svg>
                <span>${labelText}</span>
              </div>
              <div class="grand-titre" style="margin: 15px 0;">${titleText}</div>
              
              <div style="border: 4px solid var(--vertclair); border-radius: 20px; overflow: hidden; background: #eaf6fd; padding: 15px; flex: 1; display: flex; align-items: flex-end; justify-content: center; min-height: 120mm;">
                <svg viewBox="0 0 400 200" style="width: 100%; height: 100%;">
                  <rect width="400" height="150" fill="#dff2fd" rx="6"/>
                  <rect y="120" width="400" height="80" fill="#bfe3a8" rx="6"/>
                  <use href="#d-soleil" x="25" y="15" width="45" height="45"/>
                  <use href="#d-tree" x="310" y="30" width="60" height="90"/>
                  <use href="#c-leo" x="170" y="70" width="60" height="80"/>
                </svg>
              </div>

              <div class="bubble" style="margin-top: 15px;">
                <svg><use href="#c-leo"/></svg>
                <span><b>Léo :</b> ${language === "fr" ? "« Es-tu prêt pour cette nouvelle aventure ? Tourne vite la page ! »" : "« Are you ready for this new adventure? Turn the page quickly! »"}</span>
              </div>
            </div>
          `;
        } else if (relPage === 1) {
          // Chapter Story Page
          const labelText = language === "fr" ? `Chapitre ${chapter.id} · L'histoire` : `Chapter ${chapter.id} · The Story`;
          const paragraphs = language === "fr" ? chapter.storyFr : chapter.storyEn;
          
          let storyParagraphsHTML = "";
          paragraphs.forEach(para => {
            storyParagraphsHTML += `<p style="margin-bottom: 12px; font-size: 16.5px; text-indent: 15px; line-height: 1.5;">${para}</p>`;
          });

          pageContent = `
            <div class="page-fit-wrap" style="height: 100%; justify-content: space-between;">
              <div>
                <div class="chap-band">
                  <svg viewBox="0 0 120 150"><use href="#c-nina"/></svg>
                  <span>${labelText}</span>
                </div>
                <div class="story" style="margin-top: 15px; color: #4e3a2c;">
                  ${storyParagraphsHTML}
                </div>
              </div>

              <div style="background: #eaf6fd; border-radius: 12px; padding: 10px; border: 1px solid #c3e8b0; margin: 15px 0;">
                <svg viewBox="0 0 600 130" style="width: 100%; height: 90px; display: block; margin: 0 auto;">
                  <rect width="600" height="90" fill="#daf0fd" rx="6"/>
                  <rect y="75" width="600" height="55" fill="#c3e8b0" rx="6"/>
                  <use href="#c-leo" x="120" y="35" width="55" height="70"/>
                  <use href="#c-nina" x="185" y="45" width="50" height="60"/>
                  <use href="#c-tom" x="250" y="48" width="50" height="50"/>
                  <use href="#c-zaza" x="320" y="35" width="50" height="60"/>
                </svg>
              </div>

              <div class="note-histoire">
                <p style="font-weight: bold; margin-bottom: 2px;">🧭 ${language === "fr" ? "Ta mission d'histoire :" : "Your story mission:"}</p>
                <p style="font-size: 14.5px;">${language === "fr" ? "Suis le guide, concentre-toi bien, et tourne la page !" : "Follow the guide, focus well, and turn the page!"}</p>
              </div>
            </div>
          `;
        } else if (isLastOfChapter) {
          // Chapter Badge Page
          const bLabel = language === "fr" ? `Chapitre ${chapter.id} · Ta récompense` : `Chapter ${chapter.id} · Your Reward`;
          const bName = language === "fr" ? chapter.badgeNameFr : chapter.badgeNameEn;
          const bDesc = language === "fr" ? chapter.badgeDescFr : chapter.badgeDescEn;

          pageContent = `
            <div class="page-fit-wrap" style="height: 100%; justify-content: space-between; text-align: center; align-items: center;">
              <div class="chap-band" style="align-self: stretch; text-align: left;">
                <svg viewBox="0 0 120 150"><use href="#c-leo"/></svg>
                <span>${bLabel}</span>
              </div>

              <div style="margin: 20px 0;">
                <h2 style="color: ${chapter.badgeColor}; font-size: 32px; margin-bottom: 10px;">🎉 ${language === "fr" ? "FÉLICITATIONS !" : "CONGRATULATIONS!"} 🎉</h2>
                <div class="badge-cercle" style="border-color: ${chapter.badgeColor}; width: 60mm; height: 62mm; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                  <svg style="width: 40mm; height: 40mm;"><use href="${chapter.badgeIconId}" /></svg>
                </div>
                <p class="badge-nom" style="color: ${chapter.badgeColor}; font-size: 26px; margin-top: 10px;">${bName}</p>
              </div>

              <div class="bubble" style="max-width: 550px;">
                <svg><use href="#c-leo"/></svg>
                <p style="text-align: left; font-size: 15px; line-height: 1.4;">
                  <b>Léo :</b> ${bDesc}
                </p>
              </div>

              <div class="note-histoire" style="max-width: 450px; width: 100%; padding: 10px 15px;">
                <p style="font-size: 14.5px;">
                  🎨 <b>${language === "fr" ? "Colorie ton badge" : "Color your badge"}</b>, ${language === "fr" ? "et écris la date de ta victoire :" : "and write down the date of your victory:"}
                </p>
                <span class="case-ecrire" style="min-width: 40mm; margin-top: 5px;"></span>
              </div>
            </div>
          `;
        } else {
          // Exercises Page
          let mIndexStart = (relPage - 2) * 2;
          const pageMissions = chapter.missions.slice(mIndexStart, mIndexStart + 2);
          
          let missionsHTML = "";
          pageMissions.forEach(mission => {
            let exerciseControl = "";

            if (mission.exerciseType === "qcm" && mission.choices) {
              let choicesHTML = "";
              mission.choices.forEach(c => {
                choicesHTML += `<button class="choice">${language === "fr" ? c.textFr : c.textEn}</button>`;
              });
              exerciseControl = `<div class="choices" style="justify-content: center;">${choicesHTML}</div>`;
            } else if (mission.exerciseType === "grid-find" && mission.gridItems) {
              let gridHTML = "";
              mission.gridItems.forEach(item => {
                gridHTML += `<span class="pick">${item.text}</span>`;
              });
              exerciseControl = `<div class="grille-lettres" style="justify-content: center; max-width: 320px; margin: 0 auto;">${gridHTML}</div>`;
            } else if (mission.exerciseType === "matching" && mission.matches) {
              let leftHTML = "";
              let rightHTML = "";
              mission.matches.forEach((m, idx) => {
                leftHTML += `<div style="display: flex; align-items: center; justify-content: space-between; border: 2px solid #cbd8cb; border-radius: 12px; padding: 5px 12px; background: white; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                  <span>${language === "fr" ? m.leftFr : m.leftEn}</span>
                  <span class="point-relier" style="width: 4mm; height: 4mm;"></span>
                </div>`;
                rightHTML += `<div style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; border: 2px solid #cbd8cb; border-radius: 12px; padding: 5px 12px; background: white; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                  <span class="point-relier" style="width: 4mm; height: 4mm;"></span>
                  ${m.rightIcon ? `<svg style="width: 20px; height: 20px;"><use href="#${m.rightIcon}" /></svg>` : ""}
                  <span>${language === "fr" ? m.rightFr : m.rightEn}</span>
                </div>`;
              });
              exerciseControl = `
                <div style="display: flex; gap: 20px; justify-content: space-between; max-width: 400px; margin: 0 auto; width: 100%;">
                  <div style="flex: 1;">${leftHTML}</div>
                  <div style="flex: 1;">${rightHTML}</div>
                </div>
              `;
            } else if (mission.exerciseType === "tracing-letter" || mission.exerciseType === "drawing" || mission.exerciseType === "symmetry") {
              exerciseControl = `
                <div style="border: 2px dashed var(--vertclair); border-radius: 12px; height: 35mm; background: white; position: relative; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #bbb; font-size: 14px; font-weight: bold;">✏️ ${language === "fr" ? "Zone de dessin au crayon" : "Pencil drawing zone"}</span>
                </div>
              `;
            } else if (mission.exerciseType === "input-text") {
              exerciseControl = `
                <div style="text-align: center; margin: 10px 0;">
                  <span class="case-ecrire" style="min-width: 80mm; height: 10mm; display: inline-block;"></span>
                </div>
              `;
            } else if (mission.exerciseType === "order-numbers" && mission.choices) {
              let checksHTML = "";
              mission.choices.forEach(c => {
                checksHTML += `
                  <div style="display: flex; align-items: center; gap: 10px; border: 2px solid #cbd8cb; border-radius: 12px; padding: 6px 15px; margin-bottom: 6px; font-size: 14px; font-weight: bold; background: white; max-width: 320px; margin-left: auto; margin-right: auto;">
                    <span style="width: 18px; height: 18px; border: 2px solid #ccc; border-radius: 4px; display: inline-block;"></span>
                    <span>${language === "fr" ? c.textFr : c.textEn}</span>
                  </div>
                `;
              });
              exerciseControl = `<div style="margin-top: 5px;">${checksHTML}</div>`;
            }

            missionsHTML += `
              <div class="exo" style="padding: 10px 15px; margin-top: 10px;">
                <div class="exo-head">
                  <span class="exo-num">${language === "fr" ? `Mission ${mission.num}` : `Mission ${mission.num}`}</span>
                  <span class="exo-type">${language === "fr" ? mission.typeFr : mission.typeEn}</span>
                </div>
                <div class="bubble" style="padding: 6px 12px; font-size: 14.5px; margin: 5px 0;">
                  <svg style="width: 36px; height: 48px;"><use href="#c-${mission.character}" /></svg>
                  <p style="text-align: left; line-height: 1.3;">
                    <b>${mission.character === "tom" ? (language === "fr" ? "Darina" : "Darina") : mission.character === "zaza" ? "Lana" : mission.character} :</b> 
                    ${language === "fr" ? mission.bubbleFr : mission.bubbleEn}
                  </p>
                </div>
                <p class="consigne" style="font-size: 16px; margin: 4px 0;">${language === "fr" ? mission.consigneFr : mission.consigneEn}</p>
                <div style="margin-top: 5px;">
                  ${exerciseControl}
                </div>
              </div>
            `;
          });

          pageContent = `
            <div class="page-fit-wrap" style="height: 100%; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 5px;">
                <div class="chap-band">
                  <svg viewBox="0 0 120 150"><use href="#c-${chapter.missions[0]?.character || "leo"}" /></svg>
                  <span>${language === "fr" ? `Chapitre ${chapter.id} · Missions` : `Chapter ${chapter.id} · Missions`}</span>
                </div>
                ${missionsHTML}
              </div>
            </div>
          `;
        }
      }

      bookPagesHTML += `
        <section class="${classList}" id="p${p}">
          <div class="page-fit-wrap">
            ${pageContent}
            <div class="folio">— ${p} —</div>
          </div>
        </section>
      `;
    }

    const template = `
<!DOCTYPE html>
<html lang="${langCode}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
/* ===================== BASE ===================== */
*{box-sizing:border-box;margin:0;padding:0}
:root{
 --vert:#2e7d46; --vertclair:#69b06c; --orange:#f0913f; --bleu:#58b7e8;
 --jaune:#ffd23f; --rose:#f6a8c4; --rouge:#e05a4e; --creme:#fffdf4;
 --encre:#3b3b3b; --gris:#93a8c0;
}
html{background:#d7ecd8}
body{
 font-family:"Comic Sans MS","Comic Sans",Verdana,Arial,sans-serif;
 color:var(--encre); background:linear-gradient(#d7ecd8,#c2e2c4);
}
.book{display:flex;flex-direction:column;align-items:center;padding:18px 8px 110px}

/* ===================== PAGE A4 ===================== */
.page{
 width:210mm;height:296mm;background:var(--creme);
 padding:10mm 13mm 7mm;display:flex;flex-direction:column;
 overflow:hidden;position:relative;border-radius:8px;
 box-shadow:0 6px 24px rgba(30,70,40,.25);
 margin-bottom: 25px;
}
.page-fit-wrap{display:flex;flex-direction:column;flex:1 1 auto;width:100%;min-height:0;transform-origin:top center}
.folio{margin-top:auto;text-align:center;font-size:14px;color:#7f9c81;padding-top:2mm}

/* ===================== IMPRESSION ===================== */
@page{size:A4;margin:0}
@media print{
 html,body{background:#fff}
 .book{padding:0;display:block}
 .page{display:flex !important;box-shadow:none;border-radius:0;margin:0;
   page-break-after:always;break-after:always}
 .no-print{display:none !important}
 .reveal,.sol{display:none !important}
 *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}

/* ===================== TITRES / BANDEAUX ===================== */
.chap-band{
 display:flex;align-items:center;gap:4mm;border-radius:14px;
 padding:2.5mm 5mm;color:#fff;font-size:17px;font-weight:bold;
}
.chap-band svg{width:12mm;height:14mm;flex:none}
.ch1 .chap-band{background:#4e9d58}
.ch2 .chap-band{background:#e08a2e}
.ch3 .chap-band{background:#3f9bd8}
.ch4 .chap-band{background:#b0578f}
.ch5 .chap-band{background:#d8a020}
.ch1 .exo{border-color:#8cc790}.ch2 .exo{border-color:#f2bb7a}
.ch3 .exo{border-color:#8fc6ea}.ch4 .exo{border-color:#d99cc2}
.ch5 .exo{border-color:#ecc96a}
h1{font-size:44px;color:var(--vert);text-align:center;line-height:1.1}
h2{font-size:30px;text-align:center;color:var(--vert)}
.grand-titre{font-size:38px;text-align:center;margin:4mm 0;color:var(--vert)}

/* ===================== EXERCICES ===================== */
.exo{border:3.5px solid var(--vertclair);border-radius:16px;background:#fff;
 padding:4mm 5mm;margin-top:4.5mm}
.exo-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:2.5mm}
.exo-num{background:var(--vert);color:#fff;border-radius:999px;padding:1mm 5mm;font-size:16px;font-weight:bold}
.ch2 .exo-num{background:#e08a2e}.ch3 .exo-num{background:#3f9bd8}
.ch4 .exo-num{background:#b0578f}.ch5 .exo-num{background:#d8a020}
.exo-type{font-size:13px;color:#7d8a7d;background:#eef4ee;padding:1mm 4mm;border-radius:999px}
.consigne{font-size:19px;margin:1.5mm 0;font-weight:bold}
.bubble{display:flex;gap:4mm;align-items:center;background:#f1f8ff;border:2px solid #d4e8f7;
 border-radius:14px;padding:2.5mm 4mm;font-size:17.5px;margin:2mm 0}
.bubble svg{width:16mm;height:20mm;flex:none}
.bubble b{color:#1e6ea8}
.choices{display:flex;gap:5mm;flex-wrap:wrap;margin:3mm 0;align-items:center}
.choice{font-family:inherit;font-size:26px;min-width:17mm;padding:2.5mm 6mm;
 border:3px solid var(--bleu);background:#fff;border-radius:14px;cursor:pointer;color:var(--encre)}
.choice.grande{font-size:20px}
.choice.good{background:#c9f0c9;border-color:var(--vert)}
.choice.bad{background:#ffdcdc;border-color:var(--rouge)}
.feedback{min-height:7mm;font-size:17px;font-weight:bold;color:var(--vert)}
.reveal{font-family:inherit;font-size:14.5px;background:#fff3d6;border:2px dashed #d99a00;
 border-radius:10px;padding:1.5mm 4mm;cursor:pointer}
.sol{display:none;font-size:16.5px;background:#f3fbe9;border-radius:10px;padding:2mm 4mm;margin-top:2mm}
.sol.show{display:block}
.encour{font-size:14.5px;color:#b0578f;margin-top:1.5mm;font-style:italic}

/* ===================== ÉCRITURE ===================== */
.lignes{margin:2.5mm 0}
.ligne{height:14mm;border-bottom:2.5px solid var(--gris);position:relative;
 display:flex;align-items:flex-end}
.ligne::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1.5px dashed #cdd9e6}
.trace{font-size:46px;color:#c3d0df;letter-spacing:10mm;line-height:.95;padding-left:4mm;font-weight:bold}
.trace.mot{letter-spacing:2.5px;font-size:38px}
.case-ecrire{display:inline-block;min-width:22mm;border-bottom:3px dashed var(--orange);height:10mm;vertical-align:bottom}

/* ===================== DIVERS ===================== */
.pick{display:inline-flex;align-items:center;justify-content:center;width:12mm;height:12mm;
 border:2.5px solid #cbd8cb;border-radius:10px;font-size:24px;font-weight:bold;cursor:pointer;background:#fff}
.pick.sel{background:var(--jaune);border-color:#d99a00}
.grille-lettres{display:flex;gap:3mm;flex-wrap:wrap;margin:3mm 0}
.groupe{border:3.5px solid #cbd8cb;border-radius:14px;padding:3mm;cursor:pointer;background:#fff;text-align:center}
.groupe.good{border-color:var(--vert);background:#e8f8e8}
.groupe.bad{border-color:var(--rouge);background:#ffecec}
.deuxcol{display:flex;gap:6mm}
.deuxcol>*{flex:1}
.badge-page{align-items:center;text-align:center}
.badge-cercle{width:62mm;height:62mm;border-radius:50%;margin:5mm auto;
 background:radial-gradient(#fff8dd,#ffe9a3);border:6px solid #e8b400;
 display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(180,130,0,.3)}
.badge-cercle svg{width:40mm;height:40mm}
.badge-nom{font-size:30px;color:#b07800;font-weight:bold}
.progression{display:flex;gap:4mm;justify-content:center;margin:5mm 0}
.prog-pt{width:14mm;height:14mm;border-radius:50%;border:3px dashed #cbb;display:flex;
 align-items:center;justify-content:center;font-size:20px;background:#fff}
.prog-pt.ok{border:3px solid #e8b400;background:#ffe9a3}
.story{font-size:20px;line-height:1.65}
.story p{margin:3mm 0}
.scene{width:100%;border-radius:14px;background:#eaf6fd}
.note-histoire{background:#fff6e3;border:2.5px dashed #e8b400;border-radius:14px;padding:3mm 5mm;font-size:17px;margin-top:3mm}
.mini-ico{width:9mm;height:9mm;vertical-align:middle}
.tbl-relier{width:100%;font-size:22px}
.tbl-relier td{padding:2.5mm;text-align:center}
.point-relier{display:inline-block;width:6mm;height:6mm;border-radius:50%;background:var(--bleu);vertical-align:middle}

/* ===================== NAVIGATION ===================== */
#navbar{position:fixed;bottom:0;left:0;right:0;background:var(--vert);z-index:60;
 display:flex;gap:12px;justify-content:center;align-items:center;padding:10px 6px;
 box-shadow:0 -4px 14px rgba(0,0,0,.2)}
#navbar button{font-family:inherit;font-size:21px;font-weight:bold;border:none;border-radius:16px;
 padding:10px 22px;cursor:pointer;background:#fff;color:var(--vert)}
#navbar button:active{transform:scale(.95)}
#navbar button:disabled{opacity:.4;cursor:default}
#pageinfo{color:#fff;font-size:19px;font-weight:bold;min-width:130px;text-align:center}
#printBtn{background:var(--jaune) !important;color:#7a5a00 !important}
</style>
</head>
<body>
${svgDefs}
<main class="book">
${bookPagesHTML}
</main>
<nav id="navbar" class="no-print">
 <button id="printBtn" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
</nav>

<script>
/* ---------- Interactive behaviors for Standalone Exported HTML ---------- */
document.querySelectorAll('.choices').forEach(zone => {
 const fb = zone.querySelector('.feedback') || zone.parentElement.querySelector('.feedback');
 zone.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', () => {
   zone.querySelectorAll('.choice').forEach(b => b.classList.remove('good', 'bad'));
   if (btn.textContent.includes('L') || btn.textContent.includes('5') || btn.textContent.includes('fleurs') || btn.textContent.includes('B2') || btn.textContent.includes('VRAI') || btn.textContent.includes('RIVIÈRE') || btn.textContent.includes('renard') || btn.textContent.includes('C') || btn.textContent.includes('O') || btn.textContent.includes('6') || btn.textContent.includes('8') || btn.textContent.includes('chêne')) {
    btn.classList.add('good');
    if (fb) fb.textContent = 'Bravo ! 🎉';
   } else {
    btn.classList.add('bad');
    if (fb) fb.textContent = 'Oups, réessaie ! ❌';
   }
  });
 });
});

document.querySelectorAll('.pick').forEach(s => {
 s.addEventListener('click', () => s.classList.toggle('sel'));
});
</script>
</body>
</html>
    `;

    const blob = new Blob([template], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}_personnalise_${childName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-warm-border shadow-xl p-6 max-w-4xl mx-auto my-8 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-2 max-w-xl">
          <h3 className="text-2xl font-serif italic font-medium text-forest flex items-center gap-2">
            <Sparkles className="text-sun-yellow" size={24} />
            {language === "fr" ? "Atelier d'impression & PDF" : "Print & PDF Workshop"}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {language === "fr"
              ? "Imprime ton livre d'activités entièrement personnalisé ou enregistre-le au format PDF directement depuis les options d'impression de ton navigateur pour l'emporter partout !"
              : "Print your fully personalized activity book or save it as a PDF directly from your browser's print options to take it anywhere!"}
          </p>
          <div className="bg-[#F7F3E9] border border-warm-border rounded-xl p-3 text-xs text-text-charcoal flex items-start gap-2">
            <Printer size={16} className="shrink-0 mt-0.5 text-wood-brown" />
            <span>
              {language === "fr"
                ? "💡 Astuce d'impression / PDF : Dans les options d'impression, coche 'Imprimer les arrière-plans' (et 'Pas de marges' si disponible) puis sélectionne 'Enregistrer au format PDF' ou imprime directement en couleurs."
                : "💡 Printing / PDF Tip: In the print settings, check 'Print background graphics' (and set 'Margins to None' if available), then choose 'Save as PDF' or print directly in color."}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0 w-full md:w-64">
          {/* Print / Save PDF Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-sun-yellow text-wood-brown hover:bg-[#ebd056] font-bold text-lg rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full border-b-4 border-wood-brown cursor-pointer"
          >
            <Printer size={22} />
            {language === "fr" ? "Imprimer ou PDF" : "Print or PDF"}
          </button>

          {/* Admin Space */}
          {isAdmin ? (
            <div className="space-y-2">
              <button
                onClick={generateHTML}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 font-bold text-lg rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full border-b-4 border-green-800 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {language === "fr" ? "Génération HTML..." : "Generating HTML..."}
                  </>
                ) : (
                  <>
                    <FileCode size={22} />
                    {language === "fr" ? "Télécharger (HTML)" : "Download (HTML)"}
                  </>
                )}
              </button>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                  <Unlock size={12} />
                  {language === "fr" ? "Mode Administrateur" : "Administrator Mode"}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:underline cursor-pointer text-right"
                >
                  {language === "fr" ? "Quitter" : "Exit"}
                </button>
              </div>
            </div>
          ) : showAdminInput ? (
            <form onSubmit={handleVerifyAdmin} className="bg-[#F7F3E9] p-4 rounded-2xl border-2 border-warm-border space-y-3 text-left w-full">
              <div>
                <label className="block text-xs font-bold text-text-charcoal mb-1">
                  {language === "fr" ? "📧 E-mail administrateur :" : "📧 Admin email:"}
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="px-3 py-2 bg-white border border-warm-border rounded-xl text-sm w-full focus:outline-none focus:ring-1 focus:ring-forest"
                  required
                  disabled={isAuthenticating}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-charcoal mb-1">
                  {language === "fr" ? "🔑 Mot de passe :" : "🔑 Password:"}
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3 py-2 bg-white border border-warm-border rounded-xl text-sm w-full focus:outline-none focus:ring-1 focus:ring-forest"
                  required
                  disabled={isAuthenticating}
                />
              </div>
              
              {adminError && <p className="text-xs text-red-500 font-bold break-words">{adminError}</p>}
              
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowAdminInput(false); setAdminEmail(""); setAdminPassword(""); setAdminError(""); }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 cursor-pointer flex-1 text-center"
                  disabled={isAuthenticating}
                >
                  {language === "fr" ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="px-3 py-2 bg-forest text-white text-xs font-bold rounded-xl hover:bg-[#4d6c44] cursor-pointer flex-1 text-center flex items-center justify-center gap-1"
                >
                  {isAuthenticating && <Loader2 className="animate-spin" size={12} />}
                  {language === "fr" ? "Valider" : "Verify"}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdminInput(true)}
              className="text-xs text-wood-brown hover:text-forest hover:underline font-medium flex items-center justify-center gap-1 cursor-pointer mx-auto py-1"
            >
              <Lock size={12} />
              {language === "fr" ? "Accès Administrateur" : "Administrator Access"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
