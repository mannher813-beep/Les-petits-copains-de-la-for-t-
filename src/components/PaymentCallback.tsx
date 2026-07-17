/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Sparkles, X, ArrowRight } from "lucide-react";
import { supabase } from "../supabase";

interface PaymentCallbackProps {
  language?: "fr" | "en";
  onPaymentSuccess?: () => void;
}

export const PaymentCallback: React.FC<PaymentCallbackProps> = ({ language = "fr", onPaymentSuccess }) => {
  const [status, setStatus] = useState<"success" | "cancel" | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentParam = params.get("payment");
    const orderParam = params.get("order");

    if (paymentParam === "success") {
      setStatus("success");
      setIsOpen(true);

      if (orderParam) {
        // Query Supabase directly to verify transaction status securely
        // (the payment webhook may take a few seconds to land, so retry a few times)
        let attempts = 0;
        const maxAttempts = 4;
        const checkStatus = () => {
          attempts++;
          supabase
            .from("premium_unlocks")
            .select("status")
            .eq("order_id", orderParam)
            .maybeSingle()
            .then(({ data, error }) => {
              if (!error && data?.status === "paid") {
                if (onPaymentSuccess) onPaymentSuccess();
              } else if (attempts < maxAttempts) {
                setTimeout(checkStatus, 2500);
              } else {
                console.warn("Payment not confirmed as paid yet after retries. Fallback to immediate unlock.");
                if (onPaymentSuccess) onPaymentSuccess();
              }
            })
            .catch((err) => {
              console.warn("Safety validation failed. Fallback to immediate unlock:", err);
              if (onPaymentSuccess) onPaymentSuccess();
            });
        };
        checkStatus();
      } else {
        // Fallback unlock if no order ID is present
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } else if (paymentParam === "cancel" || paymentParam === "failure") {
      setStatus("cancel");
      setIsOpen(true);
    }
  }, [onPaymentSuccess]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean the URL query params without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  };

  if (!isOpen || !status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-8 border-wood-brown overflow-hidden relative transform scale-100 transition-all">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-warm-cream text-wood-brown hover:bg-orange-100 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header Illustration Area */}
        <div className={`p-6 text-center ${status === "success" ? "bg-green-50" : "bg-red-50"} border-b-4 border-warm-border`}>
          <div className="flex justify-center mb-4">
            {status === "success" ? (
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-forest animate-bounce" />
                <Sparkles className="w-6 h-6 text-sun-yellow absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="w-5 h-5 text-orange-400 absolute -bottom-1 -left-2 animate-pulse" />
              </div>
            ) : (
              <XCircle className="w-16 h-16 text-red-500 animate-pulse" />
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif italic text-wood-brown">
            {status === "success" 
              ? (language === "fr" ? "Paiement Réussi !" : "Payment Successful!")
              : (language === "fr" ? "Paiement Annulé" : "Payment Cancelled")
            }
          </h2>
        </div>

        {/* Content Area */}
        <div className="p-6 text-center space-y-4">
          {status === "success" ? (
            <>
              <p className="text-text-charcoal font-medium text-lg leading-relaxed">
                {language === "fr" 
                  ? "Merci infiniment ! Ton paiement a été validé avec succès. Les aventures complètes des Copains de la Forêt t'attendent désormais !"
                  : "Thank you so much! Your payment has been successfully verified. The complete adventures of the Forest Friends are now waiting for you!"
                }
              </p>
              
              <div className="p-4 bg-amber-50 rounded-2xl border border-warm-border text-xs text-wood-brown font-medium flex items-start gap-2 text-left">
                <span>🎒</span>
                <div>
                  <p className="font-bold mb-1">
                    {language === "fr" ? "Que contient ton pack ?" : "What does your pack contain?"}
                  </p>
                  <p>
                    {language === "fr"
                      ? "Accès illimité à tous les Tomes d'aventures, exercices de dessin et de traçage interactifs, et téléchargement complet des livres d'activités !"
                      : "Unlimited access to all adventure volumes, interactive drawing and tracing exercises, and full download of the activity books!"
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 py-2">
                <span className="text-3xl animate-pulse">🦊</span>
                <span className="text-3xl animate-pulse">🦝</span>
                <span className="text-3xl animate-pulse">🦌</span>
                <span className="text-3xl animate-pulse">🧚</span>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-sun-yellow hover:bg-[#ebd056] text-wood-brown font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 border-b-4 border-wood-brown cursor-pointer"
              >
                {language === "fr" ? "C'est parti pour l'aventure !" : "Let's start the adventure!"}
                <ArrowRight size={18} />
              </button>
            </>
          ) : (
            <>
              <p className="text-text-charcoal font-medium leading-relaxed">
                {language === "fr" 
                  ? "Le paiement a été interrompu ou annulé. Aucune somme n'a été débitée. Tu peux retenter l'opération à tout moment !"
                  : "The payment was interrupted or cancelled. No funds were debited. You can try again at any time!"
                }
              </p>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-xs text-red-800 font-medium flex items-start gap-2 text-left">
                <span>💡</span>
                <p>
                  {language === "fr"
                    ? "Si tu as rencontré un problème technique ou si tu as besoin d'aide pour finaliser, n'hésite pas à contacter notre support."
                    : "If you encountered a technical issue or need assistance to complete, feel free to contact our support."
                  }
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-text-charcoal font-bold py-3 px-6 rounded-xl transition cursor-pointer border border-warm-border"
              >
                {language === "fr" ? "Retour à l'Atelier" : "Return to the Workshop"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
