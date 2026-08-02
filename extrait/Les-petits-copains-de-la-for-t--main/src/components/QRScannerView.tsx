import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QrCode, Camera, Keyboard, AlertTriangle, ArrowRight, RefreshCw, Upload, Image as ImageIcon, ShieldAlert, X, BookOpen, ExternalLink } from "lucide-react";
import { multiTomeService } from "../services/multiTomeService";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { soundManager } from "../utils/audioCelebration";

interface QRScannerViewProps {
  onNavigate: (path: string) => void;
  lang: Language;
  activeEnfantId?: string;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({ onNavigate, lang }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [externalModalType, setExternalModalType] = useState<"external_url" | "invalid_platform_qr" | null>(null);
  const [hasZoom, setHasZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [clarityStatus, setClarityStatus] = useState<{
    type: "perfect" | "too_close" | "too_far" | "scanning";
    message: string;
    color: string;
  }>({
    type: "scanning",
    message: "Place le QR Code dans le carré",
    color: "border-emerald-400 text-emerald-300"
  });

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mascot = getMascot("chouette");

  // Real-time video frame analysis to guide child on camera distance & image clarity
  useEffect(() => {
    if (!isScanning) return;

    let animId: number;
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    let lastCheck = 0;

    const analyzeFrame = (time: number) => {
      if (time - lastCheck > 300) {
        lastCheck = time;
        const videoEl = document.querySelector("#reader video") as HTMLVideoElement | null;
        if (videoEl && videoEl.readyState >= 2 && ctx) {
          try {
            ctx.drawImage(videoEl, 0, 0, 100, 100);
            const imgData = ctx.getImageData(0, 0, 100, 100);
            const data = imgData.data;

            let totalBrightness = 0;
            let diffSum = 0;
            const totalPixels = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
              const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              totalBrightness += brightness;

              if (i > 4) {
                const prevBrightness = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
                diffSum += Math.abs(brightness - prevBrightness);
              }
            }

            const avgBrightness = totalBrightness / totalPixels;
            const avgContrast = diffSum / totalPixels;

            if (avgBrightness < 35) {
              setClarityStatus({
                type: "too_close",
                message: "🔍 Trop près ou trop sombre ! Éloigne un peu (~15 cm)",
                color: "border-amber-400 text-amber-300"
              });
            } else if (avgContrast < 5 && avgBrightness > 210) {
              setClarityStatus({
                type: "too_close",
                message: "⚠️ Trop collé au papier ! Recule le téléphone",
                color: "border-amber-400 text-amber-300"
              });
            } else if (avgContrast < 5.5) {
              setClarityStatus({
                type: "too_far",
                message: "🔎 Rapproche un peu ton téléphone",
                color: "border-blue-400 text-blue-300"
              });
            } else {
              setClarityStatus({
                type: "perfect",
                message: "✨ Distance idéale ! Ne bouge plus...",
                color: "border-emerald-400 text-emerald-300"
              });
            }
          } catch (e) {
            // Ignore potential canvas taint
          }
        }
      }
      animId = requestAnimationFrame(analyzeFrame);
    };

    animId = requestAnimationFrame(analyzeFrame);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isScanning]);

  // QR "VALIDATION FINALE" imprimé sur le diplôme : pointe vers la page
  // publique https://lescopainsdelaforet.pages.dev/verification/tome-1 (ou tout
  // autre tome). On reconnaît ce lien précis et on navigue directement dessus,
  // sans le faire passer par le blocage "lien externe" ni par la recherche de défi.
  const VERIFICATION_URL_REGEX = /(?:https?:\/\/[^/\s]+)?\/verification\/([a-z0-9-]+)/i;

  const handleProcessToken = async (rawToken: string) => {
    if (!rawToken || loading) return;
    setLoading(true);
    setErrorMessage(null);

    const verifMatch = rawToken.trim().match(VERIFICATION_URL_REGEX);
    if (verifMatch) {
      soundManager.playCorrectAnswer();
      if (scannerRef.current && isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.warn("Scanner stop notice", e);
        }
        setIsScanning(false);
      }
      onNavigate(`/verification/${verifMatch[1]}`);
      setLoading(false);
      return;
    }

    try {
      const defi = await multiTomeService.getDefiByToken(rawToken);
      
      if (defi && defi.errorReason) {
        soundManager.playWrongAnswer();
        if (scannerRef.current && isScanning) {
          try { await scannerRef.current.stop(); } catch (e) {}
          setIsScanning(false);
        }
        setExternalModalType(defi.errorReason);
        return;
      }

      if (defi && defi.tome_slug) {
        soundManager.playCorrectAnswer();
        if (scannerRef.current && isScanning) {
          try {
            await scannerRef.current.stop();
          } catch (e) {
            console.warn("Scanner stop notice", e);
          }
        }
        // Redirect to challenge route
        onNavigate(`/defi/${defi.tome_slug}/${defi.chapitre_slug}`);
      } else {
        soundManager.playWrongAnswer();
        setExternalModalType("invalid_platform_qr");
      }
    } catch (e) {
      console.error("Error processing QR token", e);
      soundManager.playWrongAnswer();
      setErrorMessage(getTranslation(lang, "invalidQrMessage") || "Erreur de lecture. Vérifie le code saisi.");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomChange = async (newZoom: number) => {
    setZoomLevel(newZoom);
    if (scannerRef.current) {
      try {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ zoom: newZoom }] as any
        });
      } catch (e) {
        console.warn("Failed to set camera zoom", e);
      }
    }
  };

  const toggleTorch = async () => {
    const nextTorch = !isTorchOn;
    setIsTorchOn(nextTorch);
    if (scannerRef.current) {
      try {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: nextTorch }] as any
        });
      } catch (e) {
        console.warn("Failed to toggle camera flash", e);
      }
    }
  };

  const startCameraScanner = async () => {
    soundManager.playTapSound();
    setErrorMessage(null);
    setIsScanning(true);
    setHasZoom(false);
    setHasTorch(false);
    setZoomLevel(1);
    setIsTorchOn(false);

    // Stop existing scanner if running
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // ignore
      }
      scannerRef.current = null;
    }

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const qrConfig = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minEdge * 0.78);
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
        };

        // Try getting cameras list first for best reliability on Android/iOS
        let cameraToUse: string | { facingMode: string } = { facingMode: "environment" };

        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const backCam = cameras.find((c) =>
              c.label.toLowerCase().includes("back") ||
              c.label.toLowerCase().includes("rear") ||
              c.label.toLowerCase().includes("environnement") ||
              c.label.toLowerCase().includes("environment") ||
              c.label.toLowerCase().includes("arrière")
            );
            if (backCam) {
              cameraToUse = backCam.id;
            } else {
              cameraToUse = cameras[cameras.length - 1].id;
            }
          }
        } catch (camErr) {
          console.warn("Could not list cameras, using facingMode fallback:", camErr);
        }

        await html5QrCode.start(
          cameraToUse as any,
          qrConfig,
          (decodedText) => handleProcessToken(decodedText),
          () => {}
        );

        // Safely check for hardware capabilities (zoom, torch)
        try {
          const caps = html5QrCode.getRunningTrackCapabilities();
          if (caps && (caps as any).zoom) {
            setHasZoom(true);
            setMaxZoom((caps as any).zoom.max || 3);
          }
          if (caps && (caps as any).torch) {
            setHasTorch(true);
          }
        } catch (e) {
          console.warn("Could not fetch camera track capabilities", e);
        }

      } catch (err: any) {
        console.warn("Camera start failed:", err);
        setIsScanning(false);
        soundManager.playWrongAnswer();
        setErrorMessage(
          "Impossible d'ouvrir la caméra (autorisation refusée ou non disponible). Tu peux importer une photo de ton QR Code ci-dessous ou entrer le code (ex: T1-C1) !"
        );
      }
    }, 150);
  };

  const stopCameraScanner = async () => {
    soundManager.playTapSound();
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (e) {
        console.warn("Scanner stop notice", e);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const html5QrCode = new Html5Qrcode("file-reader-hidden");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleProcessToken(decodedText);
    } catch (err) {
      console.warn("QR code not found in image:", err);
      soundManager.playWrongAnswer();
      setErrorMessage("Aucun QR code lisible trouvé dans cette image. Essaie de prendre une photo bien éclairée ou entre le code manuellement.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch (e) {
          // Cleanup
        }
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-24 space-y-5 animate-fade-in">
      {/* Hidden container for file decoding */}
      <div id="file-reader-hidden" className="hidden" />

      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-300 text-emerald-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <QrCode className="w-3.5 h-3.5" />
              Scan Magique
            </div>
            <h1 className="text-2xl font-black font-fun">{getTranslation(lang, "scanTitle")}</h1>
            <p className="text-emerald-100 text-xs mt-1 max-w-[220px]">
              {getTranslation(lang, "scanSub")}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* INVALID QR OR CAMERA ERROR BANNER */}
      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
              {getTranslation(lang, "invalidQrTitle") || "Information de scan"}
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* CAMERA SCANNER BOX */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-amber-200 dark:border-gray-700 shadow-md text-center">
        {!isScanning ? (
          <div className="py-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-gray-700 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 border-2 border-amber-300 shadow-inner">
              <Camera className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1">
              Prêt à scanner ton livre ?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-4">
              Pointe la caméra vers le QR Code imprimé sur ton cahier.
            </p>
            
            <div className="w-full space-y-2">
              <button
                onClick={startCameraScanner}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-base active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{getTranslation(lang, "openCamera")}</span>
              </button>

              {/* FILE / IMAGE UPLOAD BUTTON */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-emerald-50 dark:bg-gray-700 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-300 dark:border-gray-600 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Importer une photo de QR code</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* ANIMATED TARGET VIEWFINDER OVERLAY */}
            <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border-4 border-emerald-500 shadow-xl mb-3">
              <div id="reader" className="w-full bg-black min-h-[260px]" />

              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-3 z-10">
                {/* DYNAMIC TEXT BADGE */}
                <div className={`px-3 py-1.5 rounded-full text-[11px] font-black backdrop-blur-md bg-black/75 border ${clarityStatus.color} shadow-lg transition-all duration-300 flex items-center gap-1.5 text-center`}>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      clarityStatus.type === "perfect" ? "bg-emerald-400" : clarityStatus.type === "too_close" ? "bg-amber-400" : "bg-blue-400"
                    }`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      clarityStatus.type === "perfect" ? "bg-emerald-500" : clarityStatus.type === "too_close" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                  </span>
                  <span>{clarityStatus.message}</span>
                </div>

                {/* ANIMATED RETICLE SQUARE WITH LASER & CORNERS */}
                <div className={`relative w-44 h-44 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  clarityStatus.type === "perfect"
                    ? "border-2 border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.6)]"
                    : clarityStatus.type === "too_close"
                    ? "border-2 border-amber-400/90 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105"
                    : "border-2 border-blue-400/90 shadow-[0_0_20px_rgba(96,165,250,0.6)] scale-95"
                }`}>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                  {/* SCANNING LASER */}
                  <div className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-[scanLine_2s_infinite_ease-in-out]" />

                  {/* CENTER DOT */}
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-ping" />
                </div>

                {/* DISTANCE FOOTER */}
                <div className="text-[10px] font-bold text-white/90 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-lg border border-white/20">
                  📐 Distance idéale : 15 à 20 cm
                </div>
              </div>

              <style>{`
                @keyframes scanLine {
                  0% { top: 8%; opacity: 0.3; }
                  50% { top: 88%; opacity: 1; }
                  100% { top: 8%; opacity: 0.3; }
                }
              `}</style>
            </div>

            {/* FOCUS & DISTANCE GUIDANCE */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 mb-3 max-w-xs text-center leading-relaxed">
              💡 <strong>Conseil :</strong> Maintiens le QR Code au centre du viseur. Ne colle pas le téléphone contre la feuille !
            </div>

            {/* CAMERA ZOOM CONTROLS */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Zoom :</span>
              {[1, 1.5, 2].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => handleZoomChange(z)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                    zoomLevel === z
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {z}x
                </button>
              ))}

              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                    isTorchOn ? "bg-amber-400 text-amber-950 shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  🔦 Flash
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center w-full max-w-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Uploader la photo</span>
              </button>

              <button
                type="button"
                onClick={stopCameraScanner}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MANUAL CODE INPUT FORM */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-amber-200 dark:border-gray-700 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Keyboard className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
            {getTranslation(lang, "manualCode")}
          </h3>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Entrez le code figurant sous le QR code (ex: <strong className="text-emerald-700 dark:text-emerald-300">T1-C1</strong>, <strong className="text-emerald-700 dark:text-emerald-300">T1-C2</strong>, etc.)
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessToken(manualCode);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="ex: T1-C1"
            className="flex-1 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!manualCode.trim() || loading}
            className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 font-extrabold px-5 py-3 rounded-2xl flex items-center justify-center gap-1.5 text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Valider</span>
          </button>
        </form>
      </div>

      {/* PLAYFUL CHILD MODAL FOR EXTERNAL LINKS OR NON-PLATFORM QR CODES */}
      {externalModalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 border-4 border-amber-300 dark:border-gray-700 shadow-2xl relative space-y-4 animate-scale-up text-center">
            <button
              onClick={() => {
                soundManager.playTapSound();
                setExternalModalType(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* MASCOT ANIMATED HEADER */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-300 p-1 border-4 border-amber-400 shadow-lg relative mb-2 animate-bounce">
                <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
                <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1 rounded-full border-2 border-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              {externalModalType === "external_url" ? (
                <div className="space-y-1">
                  <div className="inline-block bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Lien Internet Externe 🌐
                  </div>
                  <h3 className="text-lg font-black font-fun text-gray-900 dark:text-gray-100">
                    Oups ! Ce n'est pas un code du livre
                  </h3>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="inline-block bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Code QR Inconnu 🔍
                  </div>
                  <h3 className="text-lg font-black font-fun text-gray-900 dark:text-gray-100">
                    Oups ! Code non reconnu
                  </h3>
                </div>
              )}
            </div>

            {/* SPEECH BUBBLE CONTENT */}
            <div className="bg-amber-50 dark:bg-gray-700/60 rounded-2xl p-4 border-2 border-amber-200 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-200 text-left space-y-2 relative">
              {externalModalType === "external_url" ? (
                <>
                  <p className="font-extrabold text-amber-900 dark:text-amber-300">
                    Coucou ! Pour ta sécurité, cette application n'ouvre pas les liens web extérieurs.
                  </p>
                  <p className="leading-relaxed">
                    Ce QR Code pointe vers un site internet externe. Pour continuer ton aventure magique, ouvre ton livre de conte et scanne le QR code imprimé dedans !
                  </p>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-amber-900 dark:text-amber-300">
                    Ce QR Code ne vient pas de la forêt des contes !
                  </p>
                  <p className="leading-relaxed">
                    Assure-toi de scanner le bon code au bas des pages de ton livre ou entre directement le code (ex: <strong>T1-C1</strong>).
                  </p>
                </>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 border border-amber-300 flex items-center justify-around text-center mt-2">
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Exemple 1</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">T1-C1</span>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Exemple 2</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">T1-C2</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => {
                soundManager.playTapSound();
                setExternalModalType(null);
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-95 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>D'accord, je cherche mon livre ! 📖</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
