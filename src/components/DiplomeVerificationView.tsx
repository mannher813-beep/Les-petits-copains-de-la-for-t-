import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, Lock, Download, Loader2, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
import { Enfant } from "../types/multiTome";
import html2canvas from "html2canvas";
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
      const canvas = await html2canvas(diplomaRef.current, {
        scale: 3,
        backgroundColor: "#fef3c7",
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
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
        ref={diplomaRef}
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
