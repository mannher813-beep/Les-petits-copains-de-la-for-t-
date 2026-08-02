import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, Lock, Download, Loader2, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
import { Enfant } from "../types/multiTome";
import { soundManager } from "../utils/audioCelebration";

interface DiplomeVerificationViewProps {
  // Slug du tome encodé dans le QR imprimé (ex: "tome-1"). Ce QR est le même
  // sur chaque exemplaire papier : il ne contient jamais d'identifiant
  // d'enfant, contrairement à /certificat/:tomeSlug/:enfantId qui sert au
  // téléchargement depuis l'appli elle-même.
  tomeSlug: string;
  // Enfant actif sur CET appareil (celui qui scanne), ou null si aucun
  // compte/profil enfant n'existe encore sur ce téléphone.
  activeEnfant: Enfant | null;
  onNavigate: (path: string) => void;
  lang: Language;
}

// Même modèle PNG et même mise en page de champs texte que
// CertificatReussite.tsx — voir ce fichier pour le détail des coordonnées.
const DIPLOME_TEMPLATE_SRC = "/assets/diplome-tome-1.png";
const SIGNATURE_TEXT = "K.Hermann Lana";
const LAYOUT = {
  name: { xCenter: 0.5, yBaseline: 0.503, maxWidth: 0.49 },
  date: { x: 0.238, yBaseline: 0.902 },
  signature: { x: 0.804, yBaseline: 0.967, eraseBox: { x: 0.816, y: 0.927, w: 0.102, h: 0.048 } }
};
const TEXT_COLOR = "#3B2414";

/**
 * Écran affiché quand on scanne le QR "VALIDATION FINALE" imprimé en bas du
 * diplôme (page 40 du livret). Comportement en 3 cas, tel que défini :
 *
 * 1. Le compte qui scanne a terminé tous les défis du tome
 *    -> diplôme affiché + bouton "Télécharger le diplôme" actif.
 * 2. Le compte existe mais les défis ne sont pas tous complétés
 *    -> diplôme affiché mais téléchargement verrouillé.
 * 3. Le téléphone qui scanne n'a aucun compte/profil enfant
 *    -> diplôme générique (anonyme) affiché + proposition de créer un compte.
 */
export const DiplomeVerificationView: React.FC<DiplomeVerificationViewProps> = ({
  tomeSlug,
  activeEnfant,
  onNavigate,
  lang
}) => {
  const [checking, setChecking] = useState(true);
  const [totalMissions, setTotalMissions] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(0);
  const [tomeTitre, setTomeTitre] = useState<string>("");
  const isComplete = totalMissions > 0 && completedMissions >= totalMissions;

  useEffect(() => {
    if (isComplete) {
      soundManager.playDiplomeVictoire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const mascot = getMascot(activeEnfant?.avatar);

  useEffect(() => {
    let cancelled = false;
    async function checkCompletion() {
      if (!activeEnfant) {
        setChecking(false);
        return;
      }
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
      if (!cancelled) setTomeTitre(tome.titre || "");
      const [chapitres, progressions] = await Promise.all([
        multiTomeService.getChapitresByTomeId(tome.id),
        multiTomeService.getProgressionsByEnfant(activeEnfant.id)
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
  }, [tomeSlug, activeEnfant?.id]);

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

  // Dessine le diplôme complet (template PNG + champs dynamiques) sur un
  // canvas à la résolution demandée — voir CertificatReussite.tsx pour le
  // détail de chaque étape, la logique est identique ici.
  const renderDiplomaToCanvas = async (targetWidth: number, enfantName: string): Promise<HTMLCanvasElement> => {
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

    ctx.drawImage(template, 0, 0, W, H);

    const nameCfg = LAYOUT.name;
    const nameMaxWidthPx = W * nameCfg.maxWidth;
    const nameFontSize = fitFontSize(ctx, enfantName, "Playfair Display", W * 0.033, W * 0.013, nameMaxWidthPx);
    ctx.font = `700 ${nameFontSize}px "Playfair Display"`;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(enfantName, W * nameCfg.xCenter, H * nameCfg.yBaseline, nameMaxWidthPx);

    const dateStr = new Date().toLocaleDateString("fr-FR");
    const dateCfg = LAYOUT.date;
    const dateFontSize = W * 0.019;
    ctx.font = `600 ${dateFontSize}px "Playfair Display"`;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "left";
    ctx.fillText(dateStr, W * dateCfg.x, H * dateCfg.yBaseline);

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

  // Aperçu affiché dès que le diplôme est authentifié comme complet.
  useEffect(() => {
    if (!isComplete || !activeEnfant) return;
    let cancelled = false;
    (async () => {
      try {
        const canvas = await renderDiplomaToCanvas(900, activeEnfant.pseudo);
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
  }, [isComplete, activeEnfant?.pseudo]);

  const handleGenerate = async () => {
    if (!isComplete || !activeEnfant) return;
    setIsGenerating(true);
    setGenError(false);
    if (pngUrl) {
      URL.revokeObjectURL(pngUrl);
      setPngUrl(null);
    }
    try {
      const canvas = await renderDiplomaToCanvas(3840, activeEnfant.pseudo);
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob a échoué"))), "image/png", 1)
      );
      const nom = (activeEnfant.pseudo || "diplome").replace(/\s+/g, "-").toLowerCase();
      setPngUrl(URL.createObjectURL(blob));
      setPngFileName(`diplome-${nom}-${tomeSlug}.png`);
    } catch (e) {
      console.error("Erreur lors de la génération du PNG du diplôme", e);
      setGenError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- CAS 3 : aucun compte/profil enfant sur cet appareil ---
  if (!activeEnfant) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-5 animate-fade-in text-center">
        <div className="pt-4 space-y-1">
          <ShieldCheck className="w-9 h-9 text-amber-500 mx-auto" />
          <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
            Vérification du diplôme
          </h1>
        </div>

        {/* Diplôme générique / anonyme */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-6 space-y-3 relative">
          <div className="inline-block bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            Diplôme Éco-Gardien
          </div>
          <div className="text-5xl">🏅</div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Ce diplôme n'est pas encore associé à un compte sur cet appareil.
          </p>
        </div>

        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">
          Pour authentifier ce diplôme et voir s'il est débloqué, crée (ou retrouve) ton profil enfant.
        </p>

        <button
          onClick={() => onNavigate("/compte/enfants/nouveau")}
          className="w-full font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
        >
          <UserPlus className="w-4 h-4" />
          <span>Créer mon compte</span>
        </button>

        <button
          onClick={() => onNavigate("/compte/enfants")}
          className="w-full font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
        >
          <span>J'ai déjà un compte</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // --- CAS 1 & 2 : un compte existe sur cet appareil ---
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-5 animate-fade-in">
      <div className="flex items-center justify-center gap-2 pt-2">
        {checking ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : isComplete ? (
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-amber-500" />
        )}
        <h1 className="text-lg font-black font-fun text-gray-800 dark:text-gray-100">
          {checking
            ? "Vérification en cours…"
            : isComplete
            ? "Diplôme authentique et validé ✅"
            : "Diplôme authentique — encore en cours"}
        </h1>
      </div>

      {/* APERÇU DU DIPLÔME (rendu du template PNG + textes dynamiques) */}
      {isComplete ? (
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 relative">
          <canvas ref={previewCanvasRef} className="w-full h-auto block" />
          <Sparkles className="w-5 h-5 text-amber-500 absolute top-3 right-3 animate-spin drop-shadow" />
        </div>
      ) : (
        <div className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-8 border-amber-400 rounded-3xl p-8 text-center space-y-3 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white p-1 border-4 border-amber-400 mx-auto shadow-lg overflow-hidden">
            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg font-black font-fun text-emerald-900">{activeEnfant.pseudo}</h3>
          <p className="text-xs font-semibold text-amber-900">
            Diplôme {tomeTitre || tomeSlug} — pas encore débloqué sur ce compte.
          </p>
        </div>
      )}

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
