import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Sparkles, Lock, Loader2 } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
import { soundManager } from "../utils/audioCelebration";

interface CertificatReussiteProps {
  tomeSlug: string;
  enfantId: string;
  enfantName?: string;
  enfantAvatar?: string;
  onNavigate: (path: string) => void;
  lang: Language;
}

// Chemin du nouveau modèle PNG du diplôme (remplace l'ancien PDF généré par
// primitives vectorielles). Toute la mise en page graphique — cadre, rubans,
// mascottes, badges, médaille — vient de ce fichier ; seuls le nom, la date
// et la signature sont dessinés par-dessus, dynamiquement.
const DIPLOME_TEMPLATE_SRC = "/assets/diplome-tome-1.png";

// Signataire officiel du diplôme, fixe pour tous les enfants.
const SIGNATURE_TEXT = "K.Hermann Lana";

// Emplacements des champs texte, exprimés en fraction (0 à 1) de la largeur
// et de la hauteur du template. Comme le PNG est dessiné à sa résolution
// native puis mis à l'échelle pour l'export haute résolution, ces fractions
// restent valables quelle que soit la taille de sortie choisie.
const LAYOUT = {
  // Ligne pointillée sous "FÉLICITATIONS !" — accueille le nom de l'enfant.
  name: { xCenter: 0.5, yBaseline: 0.503, maxWidth: 0.49 },
  // Ligne "Date : ..." en bas à gauche.
  date: { x: 0.238, yBaseline: 0.902 },
  // Ligne "Signature : ..." en bas à droite. On efface d'abord le paraphe
  // décoratif imprimé dans le template à cet endroit, avant d'écrire la
  // vraie signature par-dessus.
  signature: { x: 0.804, yBaseline: 0.967, eraseBox: { x: 0.816, y: 0.927, w: 0.102, h: 0.048 } }
};

const TEXT_COLOR = "#3B2414";

export const CertificatReussite: React.FC<CertificatReussiteProps> = ({
  tomeSlug,
  enfantId,
  enfantName = "Léo",
  enfantAvatar = "leo",
  onNavigate,
  lang
}) => {
  const mascot = getMascot(enfantAvatar);

  // Le diplôme n'est réellement téléchargeable que si toutes les missions
  // (chapitres) du tome ont été validées avec succès par cet enfant.
  const [checking, setChecking] = useState(true);
  const [totalMissions, setTotalMissions] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(0);
  const isComplete = totalMissions > 0 && completedMissions >= totalMissions;

  useEffect(() => {
    if (isComplete) {
      soundManager.playDiplomeVictoire();
    }
    // Ne se déclenche qu'au moment où isComplete devient vrai, pas à chaque
    // reprise du composant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    let cancelled = false;
    async function checkCompletion() {
      setChecking(true);
      const tome = await multiTomeService.getTomeBySlug(tomeSlug);
      if (!tome) {
        if (!cancelled) {
          setTotalMissions(0);
          setCompletedMissions(0);
          setChecking(false);
        }
        return;
      }
      const [chapitres, progressions] = await Promise.all([
        multiTomeService.getChapitresByTomeId(tome.id),
        enfantId ? multiTomeService.getProgressionsByEnfant(enfantId) : Promise.resolve([])
      ]);
      if (cancelled) return;
      const validatedChapIds = new Set(progressions.map((p) => p.chapitre_id));
      const completedCount = chapitres.filter((c) => validatedChapIds.has(c.id)).length;
      setTotalMissions(chapitres.length);
      setCompletedMissions(completedCount);
      setChecking(false);
    }
    checkCompletion();
    return () => {
      cancelled = true;
    };
  }, [tomeSlug, enfantId]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngFileName, setPngFileName] = useState<string>("");
  const [genError, setGenError] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // S'assure que la police (avec le bon poids) est bien chargée avant de
  // dessiner sur le canvas — sinon le premier rendu peut retomber sur une
  // police système par défaut.
  const ensureFontsReady = async () => {
    try {
      await Promise.all([
        document.fonts.load('700 60px "Playfair Display"'),
        document.fonts.load('700 60px "Dancing Script"')
      ]);
      await document.fonts.ready;
    } catch (e) {
      console.info("Chargement des polices du diplôme : notice", e);
    }
  };

  // Réduit la taille de police jusqu'à ce que le texte tienne dans la
  // largeur disponible (le nom de l'enfant peut être arbitrairement long).
  const fitFontSize = (
    ctx: CanvasRenderingContext2D,
    text: string,
    fontFamily: string,
    startSize: number,
    minSize: number,
    maxWidthPx: number
  ): number => {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px "${fontFamily}"`;
      if (ctx.measureText(text).width <= maxWidthPx) break;
      size -= 2;
    }
    return size;
  };

  // Dessine le diplôme complet (template + champs dynamiques) sur un canvas
  // à la résolution demandée, et retourne son URL de données PNG.
  const renderDiplomaToCanvas = async (targetWidth: number): Promise<HTMLCanvasElement> => {
    const template = await loadImage(DIPLOME_TEMPLATE_SRC);
    await ensureFontsReady();

    const scale = targetWidth / template.naturalWidth;
    const W = targetWidth;
    const H = Math.round(template.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 1. Le template, tel quel, mis à l'échelle — aucun élément graphique
    // n'est déplacé, seuls les champs texte ci-dessous sont ajoutés.
    ctx.drawImage(template, 0, 0, W, H);

    // 2. Nom de l'enfant, centré sous "FÉLICITATIONS !"
    const nameCfg = LAYOUT.name;
    const nameMaxWidthPx = W * nameCfg.maxWidth;
    const nameFontSize = fitFontSize(ctx, enfantName, "Playfair Display", W * 0.033, W * 0.013, nameMaxWidthPx);
    ctx.font = `700 ${nameFontSize}px "Playfair Display"`;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(enfantName, W * nameCfg.xCenter, H * nameCfg.yBaseline, nameMaxWidthPx);

    // 3. Date du jour, format JJ/MM/AAAA
    const dateStr = new Date().toLocaleDateString("fr-FR");
    const dateCfg = LAYOUT.date;
    const dateFontSize = W * 0.019;
    ctx.font = `600 ${dateFontSize}px "Playfair Display"`;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "left";
    ctx.fillText(dateStr, W * dateCfg.x, H * dateCfg.yBaseline);

    // 4. Signature — on efface d'abord le paraphe décoratif imprimé dans le
    // template à cet endroit précis, en réutilisant la vraie couleur du
    // parchemin prélevée juste au-dessus (zone propre, sans texte), puis on
    // écrit la vraie signature en police manuscrite par-dessus.
    const sigCfg = LAYOUT.signature;
    const erase = sigCfg.eraseBox;
    const eraseX = erase.x * W;
    const eraseY = erase.y * H;
    const eraseW = erase.w * W;
    const eraseH = erase.h * H;
    const sample = ctx.getImageData(Math.round(eraseX + eraseW / 2), Math.max(0, Math.round(eraseY - 14)), 1, 1).data;
    ctx.fillStyle = `rgb(${sample[0]}, ${sample[1]}, ${sample[2]})`;
    ctx.fillRect(eraseX, eraseY, eraseW, eraseH);

    const sigFontSize = W * 0.028;
    ctx.font = `700 ${sigFontSize}px "Dancing Script"`;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "left";
    ctx.fillText(SIGNATURE_TEXT, W * sigCfg.x, H * sigCfg.yBaseline);

    return canvas;
  };

  // Aperçu rapide (résolution d'écran) affiché directement dans la page, dès
  // que les missions sont validées — pas besoin d'attendre un clic pour que
  // l'enfant voie son diplôme personnalisé.
  useEffect(() => {
    if (!isComplete) return;
    let cancelled = false;
    (async () => {
      try {
        const canvas = await renderDiplomaToCanvas(900);
        if (cancelled) return;
        const target = previewCanvasRef.current;
        if (target) {
          target.width = canvas.width;
          target.height = canvas.height;
          const tctx = target.getContext("2d")!;
          tctx.clearRect(0, 0, target.width, target.height);
          tctx.drawImage(canvas, 0, 0);
        }
      } catch (e) {
        console.info("Aperçu du diplôme non disponible", e);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, enfantName]);

  // Génère le fichier PNG final en haute résolution (3840px de large, soit
  // l'équivalent 4K — le template source ne dépasse pas cette qualité, donc
  // exporter davantage n'ajouterait aucun détail réel).
  const handleGenerate = async () => {
    if (!isComplete) return;
    setIsGenerating(true);
    setGenError(false);
    if (pngUrl) {
      URL.revokeObjectURL(pngUrl);
      setPngUrl(null);
    }
    try {
      const canvas = await renderDiplomaToCanvas(3840);
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob a échoué"))), "image/png", 1)
      );
      setPngUrl(URL.createObjectURL(blob));
      setPngFileName(`diplome-${enfantName.replace(/\s+/g, "-").toLowerCase()}-tome-1.png`);
    } catch (e) {
      console.error("Erreur lors de la génération du PNG du diplôme", e);
      setGenError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-5 animate-fade-in">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate("/parcours")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
          Mon diplôme
        </h1>

        <div className="w-9" />
      </div>

      {/* APERÇU DU DIPLÔME (rendu du template PNG + textes dynamiques) */}
      {isComplete ? (
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 relative">
          <canvas ref={previewCanvasRef} className="w-full h-auto block" />
          <Sparkles className="w-5 h-5 text-amber-500 absolute top-3 right-3 animate-spin drop-shadow" />
        </div>
      ) : (
        <div className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-8 border-amber-400 rounded-3xl p-8 text-center space-y-3 shadow-xl">
          <div
            className="w-16 h-16 rounded-full bg-white p-1 border-4 border-amber-400 mx-auto shadow-lg overflow-hidden"
          >
            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg font-black font-fun text-emerald-900">{enfantName}</h3>
          <p className="text-xs font-semibold text-amber-900">
            Termine toutes les missions du Tome 1 pour débloquer ton diplôme personnalisé !
          </p>
        </div>
      )}

      {/* ACTION BUTTONS (Télécharger) */}
      <div className="space-y-2.5 pt-2">
        {pngUrl ? (
          // Le PNG est prêt en mémoire (Blob). Ce lien natif <a download>,
          // tapé directement par la personne, est un vrai geste utilisateur :
          // il ne sera jamais bloqué par le navigateur.
          <a
            href={pngUrl}
            download={pngFileName}
            className="w-full font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Appuie ici pour télécharger le diplôme (PNG)</span>
          </a>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!isComplete || checking || isGenerating}
            className={`w-full font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors ${
              isComplete && !checking && !isGenerating
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-transform"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed"
            }`}
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification des missions...</span>
              </>
            ) : isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération du diplôme...</span>
              </>
            ) : isComplete ? (
              <>
                <Download className="w-4 h-4" />
                <span>Préparer le diplôme en haute résolution</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Termine toutes les missions pour débloquer</span>
              </>
            )}
          </button>
        )}

        {genError && (
          <p className="text-center text-[11px] font-bold text-red-500 px-2">
            La génération du diplôme a échoué. Réessaie, ou vérifie ta connexion.
          </p>
        )}

        {!checking && !isComplete && totalMissions > 0 && (
          <p className="text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 px-2">
            {completedMissions} / {totalMissions} missions terminées — continue ton aventure pour obtenir ton diplôme !
          </p>
        )}
      </div>
    </div>
  );
};
