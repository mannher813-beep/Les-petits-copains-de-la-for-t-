import React, { useEffect, useState } from "react";
import { Tome, Chapitre } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import QRCode from "qrcode";
import { Settings, Plus, Edit2, Download, Printer, Code, ArrowLeft, QrCode, BarChart3, Users, BookOpen, CheckCircle, ShieldCheck } from "lucide-react";

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
  isAdminLoggedIn: boolean;
  onSetAdminLoggedIn: (loggedIn: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  lang,
  isAdminLoggedIn,
  onSetAdminLoggedIn
}) => {
  const [subView, setSubView] = useState<"stats" | "list" | "edit-tome" | "edit-chapitre" | "qr" | "sql">("stats");
  const [tomes, setTomes] = useState<Tome[]>([]);
  const [selectedTome, setSelectedTome] = useState<Tome | null>(null);
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<{ total_enfants: number; total_scans: number; total_chapitres: number; total_tomes: number }>({
    total_enfants: 0,
    total_scans: 0,
    total_chapitres: 0,
    total_tomes: 0
  });

  // QR Code generator state
  const [baseUrl, setBaseUrl] = useState("https://lescopainsdelaforet.pages.dev");
  const [qrCodesData, setQrCodesData] = useState<{ code: string; chapterId: string; title: string; slug: string; url: string; dataUrl: string }[]>([]);

  // Editing forms state
  const [tomeForm, setTomeForm] = useState<Partial<Tome>>({});
  const [chapitreForm, setChapitreForm] = useState<Partial<Chapitre>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const allTomes = await multiTomeService.getTomes();
    setTomes(allTomes);
    const stats = await multiTomeService.getAdminStats();
    if (stats) setAdminStats(stats);
    setLoading(false);
  };

  const handleOpenTomeEdit = async (tome: Tome) => {
    setSelectedTome(tome);
    setTomeForm(tome);
    const chaps = await multiTomeService.getChapitresByTomeId(tome.id);
    setChapitres(chaps);
    setSubView("edit-tome");
  };

  const handleSaveTome = async (e: React.FormEvent) => {
    e.preventDefault();
    await multiTomeService.saveTome(tomeForm);
    await loadData();
    setSubView("list");
  };

  const handleOpenChapitreEdit = (chap?: Chapitre) => {
    if (chap) {
      setChapitreForm(chap);
    } else {
      setChapitreForm({
        tome_id: selectedTome?.id,
        slug: `chapitre-${chapitres.length + 1}`,
        numero: chapitres.length + 1,
        titre: `Chapitre ${chapitres.length + 1}`,
        type_reponse: "choix_multiple",
        choix: [
          { label: "Option 1", correct: true },
          { label: "Option 2", correct: false }
        ],
        mots_secrets: ["INDICE"],
        points: 10
      });
    }
    setSubView("edit-chapitre");
  };

  const handleSaveChapitre = async (e: React.FormEvent) => {
    e.preventDefault();
    await multiTomeService.saveChapitre(chapitreForm);
    if (selectedTome) {
      const chaps = await multiTomeService.getChapitresByTomeId(selectedTome.id);
      setChapitres(chaps);
    }
    setSubView("edit-tome");
  };

  const handleGenerateQRCodes = async (tome: Tome) => {
    setSelectedTome(tome);
    const chaps = await multiTomeService.getChapitresByTomeId(tome.id);
    setChapitres(chaps);

    const generated: { code: string; chapterId: string; title: string; slug: string; url: string; dataUrl: string }[] = [];
    const tomeNumero = tome.ordre || 1;

    for (const c of chaps) {
      const targetUrl = `${baseUrl.replace(/\/$/, "")}/defi/${tome.slug}/${c.slug}`;
      const code = `T${tomeNumero}-C${c.numero}`;
      try {
        const dataUrl = await QRCode.toDataURL(targetUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: "#2d5a27",
            light: "#ffffff"
          }
        });
        generated.push({
          code,
          chapterId: c.id,
          title: c.titre,
          slug: c.slug,
          url: targetUrl,
          dataUrl
        });
      } catch (e) {
        console.error("QR Code generation error", e);
      }
    }

    setQrCodesData(generated);
    setSubView("qr");
  };

  // Exporte tous les QR codes générés en un seul fichier CSV (code, titre,
  // URL et image encodée en base64) — facilement intégrable dans un
  // document HTML par une IA, sans dépendre de fichiers PNG/PDF séparés.
  const handleExportQRCodesCSV = () => {
    if (!selectedTome || qrCodesData.length === 0) return;

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const header = ["code", "titre", "url", "qr_image_base64"].join(",");
    const rows = qrCodesData.map((item) =>
      [
        escapeCsv(item.code),
        escapeCsv(item.title),
        escapeCsv(item.url),
        escapeCsv(item.dataUrl)
      ].join(",")
    );
    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTome.slug}-qr-codes.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-amber-200 dark:border-gray-700 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-fun font-bold text-gray-800 dark:text-white mb-2">
            Espace Administration
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Gestion des tomes, chapitres, réponses et générateur de QR codes imprimables.
          </p>

          <button
            onClick={() => onSetAdminLoggedIn(true)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md transition cursor-pointer"
          >
            Se connecter comme Administrateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-6">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 bg-amber-300 text-emerald-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3 h-3" />
            Mode Admin
          </div>
          <h1 className="text-2xl font-black font-fun">Tableau de Bord</h1>
          <p className="text-xs text-emerald-100 font-medium">
            Statistiques & Génération QR Codes
          </p>
        </div>

        <button
          onClick={() => onSetAdminLoggedIn(false)}
          className="bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
        >
          Quitter
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSubView("stats")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition ${
            subView === "stats" ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200"
          }`}
        >
          📊 Stats
        </button>
        <button
          onClick={() => setSubView("list")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition ${
            subView === "list" ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200"
          }`}
        >
          📚 Tomes & Chapitres
        </button>
        <button
          onClick={() => setSubView("sql")}
          className={`px-3 py-2 rounded-xl text-xs font-black transition ${
            subView === "sql" ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200"
          }`}
        >
          <Code className="w-3.5 h-3.5 inline mr-1" /> SQL
        </button>
      </div>

      {/* SUBVIEW STATS OVERVIEW */}
      {subView === "stats" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-amber-200 dark:border-gray-700 shadow-xs">
              <Users className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{adminStats.total_enfants}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Enfants Inscrits</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-amber-200 dark:border-gray-700 shadow-xs">
              <QrCode className="w-5 h-5 text-amber-500 mb-2" />
              <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{adminStats.total_scans}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Scans Réussis</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-amber-200 dark:border-gray-700 shadow-xs">
              <BookOpen className="w-5 h-5 text-teal-600 mb-2" />
              <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{adminStats.total_tomes}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Tomes Actifs</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-amber-200 dark:border-gray-700 shadow-xs">
              <CheckCircle className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{adminStats.total_chapitres}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Défis Intégrés</div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 p-4 rounded-3xl">
            <h3 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-xs uppercase mb-1">
              Statut MoneyFusion Payment Gateway
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              API Webhook opérationnel (`/api/moneyfusion/webhook`). Prêt pour les achats de tomes imprimés.
            </p>
          </div>
        </div>
      )}

      {/* SUBVIEW LIST TOMES */}
      {subView === "list" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black uppercase text-gray-600 dark:text-gray-300">
              Tomes Actifs ({tomes.length})
            </h2>
            <button
              onClick={() => {
                setSelectedTome(null);
                setTomeForm({
                  slug: `tome-${tomes.length + 1}`,
                  titre: `Tome ${tomes.length + 1}`,
                  couleur_theme: "#3f9142",
                  ordre: tomes.length + 1,
                  publie: true
                });
                setSubView("edit-tome");
              }}
              className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Nouveau Tome
            </button>
          </div>

          <div className="space-y-3">
            {tomes.map((tome) => (
              <div
                key={tome.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-3xl border-2 border-amber-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">
                    {tome.titre}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Publié
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => handleOpenTomeEdit(tome)}
                    className="py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Chapitres
                  </button>
                  <button
                    onClick={() => handleGenerateQRCodes(tome)}
                    className="py-2 bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Générer QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW QR CODES GENERATOR */}
      {subView === "qr" && selectedTome && (
        <div className="space-y-4">
          <button
            onClick={() => setSubView("list")}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border-2 border-amber-200 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm">
              QR Codes pour {selectedTome.titre}
            </h3>
            <button
              onClick={() => window.print()}
              className="w-full bg-amber-400 text-amber-950 font-black py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimer les QR Codes
            </button>
            <button
              onClick={handleExportQRCodesCSV}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Télécharger tous les QR Codes (CSV)
            </button>
            <p className="text-[10px] text-gray-400">
              Le CSV contient le code (ex. T1-C1), le titre, l'URL et l'image du QR code encodée en base64 — prêt à intégrer dans un document HTML.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {qrCodesData.map((item) => (
              <div key={item.chapterId} className="bg-white p-3 rounded-2xl border text-center">
                <span className="inline-block text-[10px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full mb-1">
                  {item.code}
                </span>
                <h4 className="text-[11px] font-black uppercase text-emerald-800 mb-1">{item.title}</h4>
                <img src={item.dataUrl} alt={item.title} className="w-28 h-28 mx-auto mb-2 border rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW SQL */}
      {subView === "sql" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-amber-200 shadow-xs space-y-2">
          <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm">
            Schema RPC Supabase
          </h3>
          <p className="text-xs text-gray-500">
            Table setup: `tomes`, `chapitres`, `enfants`, `progressions`.
          </p>
        </div>
      )}
    </div>
  );
};
