import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Sparkles, Lock, Loader2 } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { multiTomeService } from "../services/multiTomeService";
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

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfError, setPdfError] = useState(false);

  // Charge l'image de la mascotte en mémoire (nécessaire pour jsPDF.addImage,
  // qui a besoin d'un HTMLImageElement déjà chargé, pas juste d'une URL).
  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // Découpe l'image en cercle nous-mêmes via un <canvas> (technique standard
  // et fiable), au lieu de compter sur pdf.clip() qui s'est révélé imprévisible
  // pour ce cas précis. Le cadrage imite "object-contain" : l'image entière
  // reste visible, centrée, sans être étirée ni recadrée n'importe comment.
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

  // On dessine le diplôme directement avec les primitives de jsPDF (formes,
  // couleurs, texte vectoriel) plutôt que de "photographier" le HTML avec
  // html2canvas : cette dernière approche ne restituait ni les dégradés, ni
  // les bordures, ni la police, ni même le cadrage de l'image (Tailwind v4
  // n'est pas fiablement interprété par html2canvas). Dessiner nous-mêmes
  // élimine ce problème à la racine et produit un PDF plus net et plus léger.
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

      // Fond crème + bordure dorée arrondie
      pdf.setFillColor(254, 243, 199); // amber-100
      pdf.roundedRect(0, 0, W, H, 28, 28, "F");
      pdf.setDrawColor(251, 191, 36); // amber-400
      pdf.setLineWidth(7);
      pdf.roundedRect(6, 6, W - 12, H - 12, 24, 24, "S");

      // Petits ornements dorés dans les 4 coins
      pdf.setFillColor(245, 158, 11); // amber-500
      [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(([cx, cy]) => {
        pdf.circle(cx, cy, 5, "F");
      });

      // Ruban "DIPLÔME DU TOME 1"
      const ribbonW = 240;
      const ribbonY = 44;
      pdf.setFillColor(245, 158, 11);
      pdf.roundedRect((W - ribbonW) / 2, ribbonY, ribbonW, 30, 15, 15, "F");
      pdf.setTextColor(120, 53, 15); // amber-950
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("DIPLÔME DU TOME 1", W / 2, ribbonY + 20, { align: "center" });

      // FÉLICITATIONS !
      pdf.setFontSize(30);
      pdf.setTextColor(120, 53, 15);
      pdf.text("FÉLICITATIONS !", W / 2, ribbonY + 78, { align: "center" });
      pdf.setFillColor(251, 191, 36);
      pdf.rect(W / 2 - 44, ribbonY + 90, 88, 3, "F");

      // Portrait de la mascotte, dans un cadre rond doré
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

      // Prénom de l'enfant
      pdf.setFontSize(24);
      pdf.setTextColor(6, 78, 59); // emerald-900
      pdf.text(enfantName, W / 2, imgY + imgSize + 46, { align: "center" });

      // Texte de certification
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(120, 53, 15);
      const line1 = "Tu as terminé avec succès tous les défis du";
      pdf.text(line1, W / 2, imgY + imgSize + 78, { align: "center" });
      pdf.setFont("helvetica", "bold");
      pdf.text("Tome 1 : La découverte de la forêt !", W / 2, imgY + imgSize + 96, { align: "center" });

      // Médaille dorée
      const medalY = imgY + imgSize + 140;
      pdf.setFillColor(217, 119, 6); // amber-600 (contour)
      pdf.circle(W / 2, medalY, 26, "F");
      pdf.setFillColor(252, 211, 77); // amber-300 (intérieur)
      pdf.circle(W / 2, medalY, 20, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(120, 53, 15);
      pdf.text("1", W / 2, medalY + 7, { align: "center" });

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
          <div
            className="w-20 h-20 rounded-full bg-white p-1 border-4 border-amber-400 mx-auto shadow-xl relative overflow-hidden"
            style={{ width: 80, height: 80 }}
          >
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-spin" />
            <img
              src={mascot.image}
              alt={mascot.name}
              className="w-full h-full object-contain"
              style={{ width: "100%", height: "100%" }}
            />
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
