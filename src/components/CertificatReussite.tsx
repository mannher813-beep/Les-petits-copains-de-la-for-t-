import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, Download, Award, Sparkles, Star, Lock, Loader2 } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Diplôme de ${enfantName}`,
          text: `Bravo ${enfantName} pour avoir terminé le Tome 1 des Copains de la Forêt ! 🎉`
        });
      } catch (e) {
        console.info("Share canceled");
      }
    } else {
      alert("Lien de diplôme copié !");
    }
  };

  const handleDownload = () => {
    if (!isComplete) return;
    window.print();
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
      <div className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-8 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
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

      {/* ACTION BUTTONS (Partager & Télécharger) */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleShare}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4" />
          <span>Partager</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!isComplete || checking}
          className={`w-full font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors ${
            isComplete && !checking
              ? "bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed"
          }`}
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Vérification des missions...</span>
            </>
          ) : isComplete ? (
            <>
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Termine toutes les missions pour débloquer</span>
            </>
          )}
        </button>

        {!checking && !isComplete && totalMissions > 0 && (
          <p className="text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 px-2">
            {completedMissions} / {totalMissions} missions terminées — continue ton aventure pour obtenir ton diplôme !
          </p>
        )}
      </div>
    </div>
  );
};
