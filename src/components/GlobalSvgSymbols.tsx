/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import leoImg from "../assets/images/characters/leo-renard.png";
import ninaImg from "../assets/images/characters/nina-souris.png";
import darinaImg from "../assets/images/characters/darina-herisson.png";
import lanaImg from "../assets/images/characters/lana-oiseau.png";

export const GlobalSvgSymbols: React.FC = () => {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="c-leo" viewBox="0 0 120 150">
          <image href={leoImg} x="0" y="0" width="120" height="150" preserveAspectRatio="xMidYMax meet" />
        </symbol>
        <symbol id="c-nina" viewBox="0 0 120 150">
          <image href={ninaImg} x="0" y="0" width="120" height="150" preserveAspectRatio="xMidYMax meet" />
        </symbol>
        <symbol id="c-tom" viewBox="0 0 130 145">
          <image href={darinaImg} x="0" y="0" width="130" height="145" preserveAspectRatio="xMidYMax meet" />
        </symbol>
        <symbol id="c-zaza" viewBox="0 0 110 145">
          <image href={lanaImg} x="0" y="0" width="110" height="145" preserveAspectRatio="xMidYMax meet" />
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
          <g stroke="#f5b800" strokeWidth="5" strokeLinecap="round">
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
          <path d="M50 22 Q52 10 60 6" stroke="#7c5130" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <ellipse cx="68" cy="16" rx="11" ry="6" fill="#4c9e4f" transform="rotate(-20 68 16)"/>
          <circle cx="50" cy="58" r="34" fill="#e5484d"/>
          <ellipse cx="38" cy="46" rx="8" ry="12" fill="#f28389" transform="rotate(20 38 46)"/>
        </symbol>
        <symbol id="d-etoile" viewBox="0 0 100 100">
          <polygon points="50,4 62,36 96,38 69,60 79,94 50,74 21,94 31,60 4,38 38,36"
            fill="#ffd23f" stroke="#e8a800" strokeWidth="4" strokeLinejoin="round"/>
        </symbol>
        <symbol id="d-papillon" viewBox="0 0 100 100">
          <ellipse cx="32" cy="34" rx="20" ry="16" fill="#b28fd8" transform="rotate(-20 32 34)"/>
          <ellipse cx="68" cy="34" rx="20" ry="16" fill="#b28fd8" transform="rotate(20 68 34)"/>
          <ellipse cx="34" cy="62" rx="15" ry="12" fill="#f6a8c4" transform="rotate(15 34 62)"/>
          <ellipse cx="66" cy="62" rx="15" ry="12" fill="#f6a8c4" transform="rotate(-15 66 62)"/>
          <ellipse cx="50" cy="50" rx="6" ry="24" fill="#5a4a6a"/>
          <path d="M46 24 Q40 12 34 10 M54 24 Q60 12 66 10" stroke="#5a4a6a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </symbol>
        <symbol id="d-noisette" viewBox="0 0 100 100">
          <path d="M50 90 Q16 78 22 46 Q30 24 50 32 Q70 24 78 46 Q84 78 50 90 Z" fill="#b07840"/>
          <path d="M26 40 Q50 20 74 40 L70 28 Q50 12 30 28 Z" fill="#7c5130"/>
          <rect x="46" y="10" width="8" height="14" rx="4" fill="#7c5130"/>
        </symbol>
        <symbol id="d-feuille" viewBox="0 0 100 100">
          <path d="M50 6 Q92 30 78 70 Q64 96 50 94 Q36 96 22 70 Q8 30 50 6 Z" fill="#5cae5f"/>
          <path d="M50 16 L50 90" stroke="#2e7d46" strokeWidth="4"/>
          <path d="M50 40 L32 30 M50 40 L68 30 M50 62 L30 52 M50 62 L70 52" stroke="#2e7d46" strokeWidth="3"/>
        </symbol>
        <symbol id="d-trophee" viewBox="0 0 100 100">
          <path d="M30 12 H70 V40 Q70 62 50 66 Q30 62 30 40 Z" fill="#ffd23f" stroke="#e8a800" strokeWidth="3"/>
          <path d="M30 18 H14 Q14 42 32 44 M70 18 H86 Q86 42 68 44" fill="none" stroke="#e8a800" strokeWidth="5"/>
          <rect x="44" y="64" width="12" height="12" fill="#e8a800"/>
          <rect x="32" y="76" width="36" height="10" rx="3" fill="#b07800"/>
          <polygon points="50,24 54,34 65,34 56,41 59,52 50,45 41,52 44,41 35,34 46,34" fill="#fff8dd"/>
        </symbol>
        <symbol id="d-coeur" viewBox="0 0 100 100">
          <path d="M50 88 Q10 58 12 34 Q14 12 34 12 Q46 12 50 26 Q54 12 66 12 Q86 12 88 34 Q90 58 50 88 Z" fill="#e5647a"/>
        </symbol>
      </defs>
    </svg>
  );
};
