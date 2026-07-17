import React, { useState } from "react";
import { X, Sparkles, Phone, ShieldCheck, Loader2, Award } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  language: "fr" | "en";
  orderId: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  childName,
  language,
  orderId
}) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError(
        language === "fr"
          ? "⚠️ S'il te plaît, entre ton numéro de téléphone."
          : "⚠️ Please enter your phone number."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
      const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";
      const useEdgeFunction = !!supabaseUrl && !!supabaseAnonKey;

      let response;
      const payload = {
        totalPrice: 1000,
        article: [{ "Pack Premium (Tomes 2 à 6)": 1000 }],
        numeroSend: phone.trim(),
        nomclient: childName || (language === "fr" ? "Copain" : "Friend"),
        orderId,
        unlockedBooks: ["2", "3", "4", "5", "6"]
      };

      if (useEdgeFunction) {
        const endpoint = `${supabaseUrl}/functions/v1/create-payment`;
        console.log(`Calling Supabase Edge Function: ${endpoint}`);
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        console.log("Calling local API payment proxy");
        response = await fetch("/api/payment/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone: phone.trim(),
            childName: payload.nomclient,
            orderId,
            totalPrice: payload.totalPrice,
            article: payload.article,
            numeroSend: payload.numeroSend,
            nomclient: payload.nomclient,
            unlockedBooks: payload.unlockedBooks
          })
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Payment creation failed");
      }

      const data = await response.json();
      if (data.url) {
        // Redirection to Money Fusion checkout page
        window.location.href = data.url;
      } else {
        throw new Error("No redirection URL returned from server.");
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(
        language === "fr"
          ? `Désolé, une erreur est survenue : ${err.message}`
          : `Sorry, an error occurred: ${err.message}`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-8 border-wood-brown overflow-hidden relative transform scale-100 transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-warm-cream text-wood-brown hover:bg-orange-100 transition cursor-pointer disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Header Illustration Area */}
        <div className="p-6 text-center bg-amber-50 border-b-4 border-warm-border">
          <div className="flex justify-center mb-2 relative">
            <div className="w-16 h-16 bg-sun-yellow/20 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-yellow-600" />
            </div>
            <Award className="w-6 h-6 text-forest absolute -top-1 right-1/3 animate-bounce" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif italic text-forest drop-shadow-sm">
            {language === "fr" ? "Débloquer le Mode Premium 🌟" : "Unlock Premium Mode 🌟"}
          </h2>
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mt-1">
            {language === "fr" ? "Paiement Unique • Pas d'abonnement" : "Single Payment • No Subscription"}
          </p>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Benefits list */}
          <div className="bg-warm-cream p-4 rounded-2xl border-2 border-warm-border text-sm text-text-charcoal space-y-2.5">
            <p className="font-bold text-center text-wood-brown mb-1.5">
              {language === "fr" ? "Ce que tu vas débloquer :" : "What you will unlock:"}
            </p>
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">📚</span>
              <p>
                <strong>{language === "fr" ? "Tous les Tomes (Tomes 2 à 6)" : "All Volumes (Volumes 2 to 6)"}</strong>:{" "}
                {language === "fr" 
                  ? "Les aventures complètes et tous les exercices interactifs débloqués d'un coup !" 
                  : "All complete adventures and interactive exercises unlocked at once!"}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">🌟</span>
              <p>
                <strong>{language === "fr" ? "Badge d'Honneur Premium" : "Premium Honor Badge"}</strong>:{" "}
                {language === "fr" 
                  ? "Un badge d'or sur l'accueil et des autocollants exclusifs !" 
                  : "A golden badge on your welcome screen and exclusive stickers!"}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">🖨️</span>
              <p>
                <strong>{language === "fr" ? "Exports HTML & PDF Illimités" : "Unlimited HTML & PDF Exports"}</strong>:{" "}
                {language === "fr" 
                  ? "Télécharge ton livre d'activités personnalisé complet pour l'imprimer ou y jouer hors-ligne !" 
                  : "Download your fully custom activity book to print it or play offline!"}
              </p>
            </div>
          </div>

          {/* Child prefill reminder */}
          <div className="text-center text-xs text-gray-500 font-medium">
            {language === "fr" 
              ? `Le livre sera personnalisé au nom de : ` 
              : `The book will be personalized for: `}
            <span className="text-forest font-bold font-handwriting text-lg">{childName}</span>
          </div>

          {/* Phone input */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-charcoal text-left">
              {language === "fr" 
                ? "📞 Numéro de téléphone Money Fusion (requis) :" 
                : "📞 Money Fusion Phone Number (required):"}
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={language === "fr" ? "Ex: 6XXXXXXXX" : "e.g., 6XXXXXXXX"}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-warm-border text-base focus:outline-none focus:border-forest font-mono min-h-[44px]"
              />
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sun-yellow hover:bg-[#ebd056] text-wood-brown font-bold text-lg py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center gap-2 border-b-4 border-wood-brown cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-wood-brown" />
                {language === "fr" ? "Redirection sécurisée..." : "Redirecting securely..."}
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-wood-brown" />
                <span>
                  {language === "fr" 
                    ? "Acheter le Pack Premium • 1000 FCFA" 
                    : "Buy Premium Pack • 1000 FCFA"}
                </span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400 leading-tight">
            {language === "fr"
              ? "Transactions sécurisées par Money Fusion. Les fonds soutiennent le développement de cahiers d'activités éco-responsables."
              : "Secure transactions handled by Money Fusion. Funds support eco-responsible activity book development."}
          </p>

        </form>
      </div>
    </div>
  );
};
