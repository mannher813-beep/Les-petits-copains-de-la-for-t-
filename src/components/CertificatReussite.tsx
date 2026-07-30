import React from "react";
import { Enfant, Tome } from "../types/multiTome";
import { Sparkles, Download, ArrowLeft, Printer } from "lucide-react";

interface CertificatReussiteProps {
  enfant: Enfant;
  tome: Tome;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

export const CertificatReussite: React.FC<CertificatReussiteProps> = ({
  enfant,
  tome,
  onNavigate,
  lang
}) => {
  const currentDate = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Action buttons */}
      <div className="no-print mb-6 flex justify-between items-center">
        <button
          onClick={() => onNavigate(`/enfant/${enfant.id}/parcours`)}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === "fr" ? "Retour au parcours" : "Back to path"}</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-forest hover:bg-forest-light text-white font-bold px-5 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Printer size={18} />
          <span>{lang === "fr" ? "Imprimer le Certificat 🖨️" : "Print Certificate 🖨️"}</span>
        </button>
      </div>

      {/* Official Certificate Card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-8 sm:p-12 rounded-3xl border-8 border-amber-400 dark:border-amber-600 shadow-2xl relative text-center overflow-hidden">
        
        {/* Decorative corner seals */}
        <div className="absolute top-4 left-4 text-3xl opacity-40">🌿</div>
        <div className="absolute top-4 right-4 text-3xl opacity-40">🌿</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-40">🌿</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-40">🌿</div>

        <div className="max-w-xl mx-auto">
          
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800/60 px-4 py-1 rounded-full">
            {lang === "fr" ? "CERTIFICAT OFFICIEL DE RÉUSSITE" : "OFFICIAL CERTIFICATE OF COMPLETION"}
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif italic font-bold text-forest dark:text-forest-light mt-4 mb-2">
            Grand Héros de la Forêt
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            {lang === "fr"
              ? "Ce diplôme d'honneur est attribué avec toute la fierté de la tribu des animaux à :"
              : "This diploma of honor is proudly awarded by the forest animals to:"}
          </p>

          {/* Child's Name */}
          <div className="bg-white dark:bg-gray-800 py-4 px-8 rounded-2xl border-2 border-dashed border-amber-400 shadow-inner my-6 inline-block">
            <p className="text-3xl sm:text-4xl font-handwriting font-black text-blue-700 dark:text-blue-300">
              {enfant.pseudo}
            </p>
          </div>

          <p className="text-base font-bold text-gray-800 dark:text-gray-200 my-4">
            {lang === "fr"
              ? `Pour avoir réussi avec brio toutes les épreuves et défis du :`
              : `For successfully completing all challenges of:`}
          </p>

          <h2 className="text-2xl sm:text-3xl font-fun font-bold text-amber-700 dark:text-amber-300 mb-6">
            {tome.titre}
          </h2>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-amber-300 dark:border-amber-700 mt-8 text-xs font-bold text-gray-600 dark:text-gray-300">
            <div>
              <p className="font-handwriting text-lg text-forest">Léo le renard 🦊</p>
              <p className="text-[10px] uppercase text-gray-400">{lang === "fr" ? "Guide de la forêt" : "Forest Guide"}</p>
            </div>
            <div>
              <p className="font-handwriting text-lg text-amber-700">Nina la souris 🐭</p>
              <p className="text-[10px] uppercase text-gray-400">{lang === "fr" ? "Chef des défis" : "Challenge Master"}</p>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-gray-400 font-bold">
            {lang === "fr" ? `Délivré le ${currentDate}` : `Issued on ${currentDate}`}
          </div>

        </div>

      </div>

    </div>
  );
};
