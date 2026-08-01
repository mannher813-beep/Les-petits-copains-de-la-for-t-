import React, { useEffect, useState } from "react";
import { ShieldCheck, Lock, Download, Loader2, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
import { Enfant } from "../types/multiTome";
import { jsPDF } from "jspdf";

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

/**
 * Écran affiché quand on scanne le QR "VALIDATION FINALE" imprimé en bas du
 * diplôme (page 40 du livret). Comportement en 3 cas, tel que défini :
 *
 * 1. Le compte qui scanne a terminé tous les défis du tome
 *    -> diplôme affiché + bouton "Télécharger le PDF" actif.
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

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfError, setPdfError] = useState(false);

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const renderCircularMascot = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    return canvas.toDataURL("image/png");
  };

  // Dessin direct du diplôme dans le PDF (voir CertificatReussite.tsx pour le
  // détail de pourquoi on n'utilise plus html2canvas ici).
  const handleGenerate = async () => {
    if (!isComplete) return;
    setIsGeneratingPdf(true);
    setPdfError(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    try {
      const W = 480;
      const H = 640;
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [W, H] });

      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(0, 0, W, H, 28, 28, "F");
      pdf.setDrawColor(251, 191, 36);
      pdf.setLineWidth(7);
      pdf.roundedRect(6, 6, W - 12, H - 12, 24, 24, "S");

      pdf.setFillColor(245, 158, 11);
      [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(([cx, cy]) => {
        pdf.circle(cx, cy, 5, "F");
      });

      const ribbonLabel = `DIPLÔME ${(tomeTitre || tomeSlug).toUpperCase()}`;
      const ribbonW = Math.min(360, Math.max(220, ribbonLabel.length * 6.5));
      const ribbonY = 44;
      pdf.setFillColor(245, 158, 11);
      pdf.roundedRect((W - ribbonW) / 2, ribbonY, ribbonW, 30, 15, 15, "F");
      pdf.setTextColor(120, 53, 15);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(ribbonLabel, W / 2, ribbonY + 20, { align: "center" });

      pdf.setFontSize(30);
      pdf.setTextColor(120, 53, 15);
      pdf.text("FÉLICITATIONS !", W / 2, ribbonY + 78, { align: "center" });
      pdf.setFillColor(251, 191, 36);
      pdf.rect(W / 2 - 44, ribbonY + 90, 88, 3, "F");

      const imgSize = 110;
      const imgX = W / 2 - imgSize / 2;
      const imgY = ribbonY + 112;
      try {
        const img = await loadImage(mascot.image);
        const cx = W / 2;
        const cy = imgY + imgSize / 2;
        const outerR = imgSize / 2 + 6;
        pdf.setFillColor(255, 255, 255);
        pdf.circle(cx, cy, outerR, "F");
        pdf.setDrawColor(251, 191, 36);
        pdf.setLineWidth(4);
        pdf.circle(cx, cy, outerR, "S");

        const circularDataUrl = renderCircularMascot(img, imgSize * 2);
        pdf.addImage(circularDataUrl, "PNG", imgX, imgY, imgSize, imgSize);
      } catch (imgErr) {
        console.info("Portrait de mascotte non disponible pour le PDF, on continue sans.", imgErr);
      }

      pdf.setFontSize(24);
      pdf.setTextColor(6, 78, 59);
      pdf.text(activeEnfant?.pseudo || "", W / 2, imgY + imgSize + 46, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(120, 53, 15);
      pdf.text("Tu as terminé avec succès tous les défis du", W / 2, imgY + imgSize + 78, { align: "center" });
      pdf.setFont("helvetica", "bold");
      pdf.text(tomeTitre || tomeSlug, W / 2, imgY + imgSize + 96, { align: "center" });

      const medalY = imgY + imgSize + 140;
      pdf.setFillColor(217, 119, 6);
      pdf.circle(W / 2, medalY, 26, "F");
      pdf.setFillColor(252, 211, 77);
      pdf.circle(W / 2, medalY, 20, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(120, 53, 15);
      pdf.text("1", W / 2, medalY + 7, { align: "center" });

      const nom = (activeEnfant?.pseudo || "diplome").replace(/\s+/g, "-").toLowerCase();
      const blob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(blob));
      setPdfFileName(`diplome-${nom}-${tomeSlug}.pdf`);
    } catch (e) {
      console.error("Erreur lors de la génération du PDF du diplôme", e);
      setPdfError(true);
    } finally {
      setIsGeneratingPdf(false);
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

      <div
        className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-8 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-2 left-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute top-2 right-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute bottom-2 left-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute bottom-2 right-2 text-2xl text-amber-500">⚜️</div>

        <div className="inline-block bg-amber-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md border border-amber-300">
          Diplôme {tomeTitre || tomeSlug}
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-black font-fun text-amber-900 tracking-wide drop-shadow-xs">
            FÉLICITATIONS !
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        <div className="space-y-2 py-2">
          <div className="w-20 h-20 rounded-full bg-white p-1 border-4 border-amber-400 mx-auto shadow-xl relative">
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-spin" />
            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-2xl font-black font-fun text-emerald-900">
            {activeEnfant.pseudo}
          </h3>
        </div>

        <div className="pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-amber-600 mx-auto flex items-center justify-center text-3xl shadow-xl">
            🏅
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {pdfUrl ? (
          // Le PDF est prêt en mémoire (Blob). Ce lien natif <a download>,
          // tapé directement par la personne, est un vrai geste utilisateur :
          // il ne sera jamais bloqué par le navigateur, contrairement à un
          // pdf.save() déclenché en fin de fonction async.
          <a
            href={pdfUrl}
            download={pdfFileName}
            className="w-full font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Appuie ici pour télécharger le PDF</span>
          </a>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!isComplete || checking || isGeneratingPdf}
            className={`w-full font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors ${
              isComplete && !checking && !isGeneratingPdf
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-transform"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed"
            }`}
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification des missions...</span>
              </>
            ) : isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération du PDF...</span>
              </>
            ) : isComplete ? (
              <>
                <Download className="w-4 h-4" />
                <span>Préparer le PDF</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Termine toutes les missions pour débloquer</span>
              </>
            )}
          </button>
        )}

        {pdfError && (
          <p className="text-center text-[11px] font-bold text-red-500 px-2">
            La génération du PDF a échoué. Réessaie, ou vérifie ta connexion.
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
