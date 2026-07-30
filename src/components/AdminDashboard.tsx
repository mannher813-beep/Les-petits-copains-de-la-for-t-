import React, { useEffect, useState } from "react";
import { Tome, Chapitre } from "../types/multiTome";
import { multiTomeService, DEFAULT_TOMES, DEFAULT_CHAPITRES } from "../services/multiTomeService";
import QRCode from "qrcode";
import { Settings, Plus, Edit2, Download, Printer, Check, Eye, EyeOff, Code, ArrowLeft, Trash2, QrCode } from "lucide-react";

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
  const [subView, setSubView] = useState<"list" | "edit-tome" | "edit-chapitre" | "qr" | "sql">("list");
  const [tomes, setTomes] = useState<Tome[]>([]);
  const [selectedTome, setSelectedTome] = useState<Tome | null>(null);
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [loading, setLoading] = useState(true);

  // QR Code generator state
  const [baseUrl, setBaseUrl] = useState("https://lescopainsdelaforet.pages.dev");
  const [qrCodesData, setQrCodesData] = useState<{ chapterId: string; title: string; slug: string; url: string; dataUrl: string }[]>([]);

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

    const generated: { chapterId: string; title: string; slug: string; url: string; dataUrl: string }[] = [];

    for (const c of chaps) {
      const targetUrl = `${baseUrl.replace(/\/$/, "")}/defi/${tome.slug}/${c.slug}`;
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

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-warm-border shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-800 flex items-center justify-center text-3xl mx-auto mb-4">
            🔐
          </div>
          <h1 className="text-2xl font-fun font-bold text-gray-800 dark:text-white mb-2">
            Espace Administration
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Gestion des tomes, chapitres, réponses et générateur de QR codes imprimables.
          </p>

          <button
            onClick={() => onSetAdminLoggedIn(true)}
            className="w-full py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-base shadow-md transition cursor-pointer"
          >
            Se connecter comme Administrateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Navigation Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl font-bold">
            ⚙️
          </div>
          <div className="text-left">
            <h1 className="text-xl font-fun font-bold text-gray-900 dark:text-white">
              Panneau Administrateur
            </h1>
            <p className="text-xs text-gray-500">
              Pilotez tous les tomes & générez vos QR codes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubView("list")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              subView === "list" ? "bg-forest text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            📚 Liste des Tomes
          </button>

          <button
            onClick={() => setSubView("sql")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              subView === "sql" ? "bg-forest text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            <Code size={14} className="inline mr-1" /> SQL Supabase
          </button>

          <button
            onClick={() => onSetAdminLoggedIn(false)}
            className="px-3 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 transition"
          >
            Déconnexion
          </button>
        </div>

      </div>

      {/* SubView: List of Tomes */}
      {subView === "list" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Tomes enregistrés
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
              className="bg-forest text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-md hover:bg-forest-light transition"
            >
              <Plus size={16} /> Nouveau Tome
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tomes.map((tome) => (
              <div
                key={tome.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-forest/10 text-forest">
                      Ordre #{tome.ordre}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tome.publie ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                      {tome.publie ? "Publié ✅" : "Brouillon 🔒"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tome.couleur_theme }} />
                    {tome.titre}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4">
                    Slug: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{tome.slug}</code>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenTomeEdit(tome)}
                    className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Edit2 size={14} /> Éditer chapitres
                  </button>

                  <button
                    onClick={() => handleGenerateQRCodes(tome)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                  >
                    <QrCode size={14} /> Générer QR Codes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubView: Edit Tome & Chapters */}
      {subView === "edit-tome" && (
        <div className="space-y-6 text-left">
          <button
            onClick={() => setSubView("list")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </button>

          <form onSubmit={handleSaveTome} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Éditer les informations du Tome
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Titre du tome :</label>
                <input
                  type="text"
                  required
                  value={tomeForm.titre || ""}
                  onChange={(e) => setTomeForm({ ...tomeForm, titre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Slug URL (ex: tome-1) :</label>
                <input
                  type="text"
                  required
                  value={tomeForm.slug || ""}
                  onChange={(e) => setTomeForm({ ...tomeForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Couleur du thème :</label>
                <input
                  type="color"
                  value={tomeForm.couleur_theme || "#3f9142"}
                  onChange={(e) => setTomeForm({ ...tomeForm, couleur_theme: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer border border-warm-border"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="publie-check"
                  checked={tomeForm.publie ?? true}
                  onChange={(e) => setTomeForm({ ...tomeForm, publie: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <label htmlFor="publie-check" className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Publié sur le site
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-forest text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md hover:bg-forest-light transition"
            >
              Enregistrer le Tome
            </button>
          </form>

          {/* Chapters List */}
          {selectedTome && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Chapitres & Questions ({chapitres.length})
                </h2>
                <button
                  onClick={() => handleOpenChapitreEdit()}
                  className="bg-forest text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md"
                >
                  <Plus size={14} /> Ajouter un Chapitre
                </button>
              </div>

              <div className="space-y-3">
                {chapitres.map((chap) => (
                  <div
                    key={chap.id}
                    className="p-4 rounded-2xl border border-warm-border dark:border-gray-700 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400">#Chapitre {chap.numero}</span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {chap.titre}
                      </h4>
                      <p className="text-xs text-gray-500 italic mt-0.5">
                        Q: {chap.question_defi}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenChapitreEdit(chap)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 transition"
                    >
                      Éditer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubView: Edit Chapter Form */}
      {subView === "edit-chapitre" && (
        <div className="space-y-6 text-left max-w-2xl mx-auto">
          <button
            onClick={() => setSubView("edit-tome")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition"
          >
            <ArrowLeft size={16} /> Annuler
          </button>

          <form onSubmit={handleSaveChapitre} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Éditer le Chapitre
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Numéro du chapitre :</label>
                <input
                  type="number"
                  required
                  value={chapitreForm.numero || 1}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, numero: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Titre du chapitre :</label>
                <input
                  type="text"
                  required
                  value={chapitreForm.titre || ""}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, titre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Slug (ex: chapitre-1) :</label>
                <input
                  type="text"
                  required
                  value={chapitreForm.slug || ""}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Question du défi de compréhension :</label>
                <textarea
                  required
                  rows={2}
                  value={chapitreForm.question_defi || ""}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, question_defi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Type de réponse :</label>
                <select
                  value={chapitreForm.type_reponse || "choix_multiple"}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, type_reponse: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm font-bold"
                >
                  <option value="choix_multiple">Choix Multiple (QCM)</option>
                  <option value="texte_libre">Texte Libre (Comparaison flexible)</option>
                </select>
              </div>

              {chapitreForm.type_reponse === "texte_libre" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Mot / Réponse attendue :</label>
                  <input
                    type="text"
                    value={chapitreForm.reponse_attendue || ""}
                    onChange={(e) => setChapitreForm({ ...chapitreForm, reponse_attendue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Mots secrets (séparés par virgules) :</label>
                <input
                  type="text"
                  value={chapitreForm.mots_secrets?.join(", ") || ""}
                  onChange={(e) => setChapitreForm({ ...chapitreForm, mots_secrets: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-3 py-2 rounded-xl border border-warm-border dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-forest text-white font-bold text-base shadow-md hover:bg-forest-light transition"
            >
              Enregistrer le Chapitre
            </button>
          </form>
        </div>
      )}

      {/* SubView: QR Code Generator */}
      {subView === "qr" && selectedTome && (
        <div className="space-y-6 text-left">
          <button
            onClick={() => setSubView("list")}
            className="no-print flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition"
          >
            <ArrowLeft size={16} /> Retour à la liste des tomes
          </button>

          <div className="no-print bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md space-y-4">
            <h2 className="text-2xl font-fun font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <QrCode size={24} /> Générateur de QR Codes — {selectedTome.titre}
            </h2>
            <p className="text-xs text-gray-500">
              Ces QR codes sont prêts à être imprimés et insérés dans le livre physique. En scannant le QR code d'un chapitre, l'enfant arrive directement sur son défi !
            </p>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-600 whitespace-nowrap">URL de base :</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-warm-border text-xs dark:bg-gray-700 dark:text-white font-mono"
              />
              <button
                onClick={() => handleGenerateQRCodes(selectedTome)}
                className="bg-forest text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
              >
                Actualiser QR
              </button>
              <button
                onClick={() => window.print()}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md flex items-center gap-1"
              >
                <Printer size={14} /> Imprimer les QR
              </button>
            </div>
          </div>

          {/* Printable QR Code Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {qrCodesData.map((item) => (
              <div
                key={item.chapterId}
                className="bg-white p-4 rounded-2xl border-2 border-warm-border shadow-md text-center flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-extrabold text-forest uppercase mb-2">
                    {item.title}
                  </h4>
                  <img src={item.dataUrl} alt={item.title} className="w-36 h-36 mx-auto mb-2 border rounded-xl" />
                  <p className="text-[10px] text-gray-400 font-mono break-all line-clamp-1 mb-2">
                    {item.url}
                  </p>
                </div>

                <a
                  href={item.dataUrl}
                  download={`${selectedTome.slug}-${item.slug}.png`}
                  className="no-print py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <Download size={12} /> Télécharger PNG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubView: SQL Schema Exporter */}
      {subView === "sql" && (
        <div className="space-y-6 text-left">
          <button
            onClick={() => setSubView("list")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition"
          >
            <ArrowLeft size={16} /> Retour
          </button>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md space-y-4">
            <h2 className="text-xl font-fun font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Code size={20} /> Script SQL Supabase (Copier-Coller dans l'éditeur SQL)
            </h2>
            <p className="text-xs text-gray-500">
              Copiez ce script SQL dans votre tableau de bord Supabase (SQL Editor) pour créer les tables `tomes`, `chapitres`, `enfants`, `progressions`, les règles de sécurité RLS et insérer les 11 chapitres du Tome 1.
            </p>

            <pre className="bg-gray-900 text-emerald-400 p-4 rounded-2xl text-xs overflow-x-auto font-mono max-h-96">
{`-- 1. Table Tomes
create table if not exists tomes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  couleur_theme text,
  ordre integer not null,
  publie boolean default false,
  cree_le timestamptz default now()
);

-- 2. Table Chapitres
create table if not exists chapitres (
  id uuid primary key default gen_random_uuid(),
  tome_id uuid references tomes(id) on delete cascade,
  slug text not null,
  numero integer not null,
  titre text not null,
  couleur text,
  question_defi text not null,
  type_reponse text not null,
  choix jsonb,
  reponse_attendue text,
  mots_secrets text[],
  points integer default 10,
  unique(tome_id, slug)
);

-- 3. Table Enfants
create table if not exists enfants (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references auth.users(id) on delete cascade,
  pseudo text not null,
  avatar text not null,
  tranche_age text not null,
  code_livre text,
  cree_le timestamptz default now()
);

-- 4. Table Progressions
create table if not exists progressions (
  id uuid primary key default gen_random_uuid(),
  enfant_id uuid references enfants(id) on delete cascade,
  chapitre_id uuid references chapitres(id) on delete cascade,
  valide_le timestamptz default now(),
  points_gagnes integer not null,
  premiere_tentative boolean default true,
  unique(enfant_id, chapitre_id)
);

-- Enable RLS
alter table tomes enable row level security;
alter table chapitres enable row level security;
alter table enfants enable row level security;
alter table progressions enable row level security;

-- Policies
create policy "Public read tomes" on tomes for select using (true);
create policy "Public read chapitres" on chapitres for select using (true);
create policy "Public read write progressions" on progressions for all using (true);
create policy "Public read write enfants" on enfants for all using (true);`}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
