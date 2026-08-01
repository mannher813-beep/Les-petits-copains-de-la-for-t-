import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Sparkles, Lock, Loader2 } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

interface CertificatReussiteProps {
  tomeSlug: string;
  enfantId: string;
  enfantName?: string;
  enfantAvatar?: string;
  onNavigate: (path: string) => void;
  lang: Language;
}

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

  const diplomaRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfError, setPdfError] = useState(false);

  // Beaucoup de navigateurs mobiles bloquent silencieusement un téléchargement
  // déclenché par le code (pdf.save()) si trop de temps s'est écoulé depuis le
  // dernier vrai geste utilisateur — ce qui est le cas ici car html2canvas
  // (surtout en scale:3) peut prendre une seconde ou plus. Résultat : le
  // bouton tourne, le PDF est bien généré en mémoire, mais rien ne se
  // télécharge, sans erreur visible.
  //
  // Solution fiable : on ne télécharge plus automatiquement à la fin de cette
  // fonction. On génère le PDF en Blob et on affiche un vrai lien <a download>
  // que la personne tape elle-même — ce second tap est un geste utilisateur
  // frais que le navigateur ne bloque jamais.
  const handleGenerate = async () => {
    if (!isComplete || !diplomaRef.current) return;
    setIsGeneratingPdf(true);
    setPdfError(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    try {
      // Capture uniquement la carte du diplôme (pas toute la page) pour
      // produire un vrai PDF du diplôme, et non une impression du site web.
      const canvas = await html2canvas(diplomaRef.current, {
        scale: 3,
        backgroundColor: "#fef3c7",
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");

      // Format paysage adapté au ratio du diplôme.
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const blob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(blob));
      setPdfFileName(`diplome-${enfantName.replace(/\s+/g, "-").toLowerCase()}-tome-1.pdf`);
    } catch (e) {
      console.error("Erreur lors de la génération du PDF du diplôme", e);
      setPdfError(true);
    } finally {
      setIsGeneratingPdf(false);
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

      {/* GOLDEN DIPLOMA CERTIFICATE (Matching Screen 9) */}
      <div
        ref={diplomaRef}
        className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-8 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-2 left-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute top-2 right-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute bottom-2 left-2 text-2xl text-amber-500">⚜️</div>
        <div className="absolute bottom-2 right-2 text-2xl text-amber-500">⚜️</div>

        {/* HEADER RIBBON */}
        <div className="inline-block bg-amber-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md border border-amber-300">
          Diplôme du Tome 1
        </div>

        {/* FÉLICITATIONS BANNER */}
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-fun text-amber-900 tracking-wide drop-shadow-xs">
            FÉLICITATIONS !
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        {/* MASCOT & CHILD NAME */}
        <div className="space-y-2 py-2">
          <div className="w-20 h-20 rounded-full bg-white p-1 border-4 border-amber-400 mx-auto shadow-xl relative">
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-spin" />
            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
          </div>

          <h3 className="text-2xl font-black font-fun text-emerald-900">
            {enfantName}
          </h3>
        </div>

        {/* CERTIFICATION TEXT */}
        <p className="text-xs font-semibold text-amber-900 leading-relaxed max-w-xs mx-auto">
          Tu as terminé avec succès tous les défis du <br />
          <strong className="text-emerald-950 font-extrabold">Tome 1: La découverte de la forêt</strong> !
        </p>

        {/* GOLD MEDAL WAX SEAL BADGE */}
        <div className="pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-amber-600 mx-auto flex items-center justify-center text-3xl shadow-xl">
            🏅
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (Télécharger) */}
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
