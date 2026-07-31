/**
 * Internationalization translations for Les Copains de la Forêt
 * Supported languages: fr, en, es, de, it, pt
 */

export type Language = "fr" | "en" | "es" | "de" | "it" | "pt";

export interface Translations {
  appName: string;
  appSubtitle: string;
  welcomeMessage: string;
  scanQrBtn: string;
  scanTitle: string;
  scanSub: string;
  openCamera: string;
  manualCode: string;
  manualCodePlaceholder: string;
  submitCode: string;
  invalidQrTitle: string;
  invalidQrMessage: string;
  tryAgain: string;
  navHome: string;
  navParcours: string;
  navDefis: string;
  navClassement: string;
  navProfil: string;
  currentTome: string;
  progress: string;
  totalPoints: string;
  completedDefis: string;
  rank: string;
  badges: string;
  diplomas: string;
  level: string;
  chooseProfile: string;
  addProfile: string;
  parentSpace: string;
  adminPanel: string;
  logout: string;
  login: string;
  createAccount: string;
  continueNoAccount: string;
  congratulations: string;
  challengeCompleted: string;
  nextChallenge: string;
  seeResults: string;
  downloadDiploma: string;
  share: string;
  locked: string;
  unlocked: string;
  chapter: string;
  question: string;
  validate: string;
  goodJob: string;
  keepGoing: string;
  ageBand: string;
  mascot: string;
  globalLeaderboard: string;
  friendsLeaderboard: string;
  schoolLeaderboard: string;
  leaderboardTitle: string;
  leaderboardSub: string;
  settings: string;
  helpSupport: string;
  darkMode: string;
  lightMode: string;
  language: string;
  pwaInstallText: string;
  pwaInstallBtn: string;
  pwaDismiss: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "Les Copains de la Forêt",
    appSubtitle: "Compagnon magique de ton livre d'activités",
    welcomeMessage: "Bonjour",
    scanQrBtn: "Scanner mon QR Code",
    scanTitle: "Scanner le QR Code",
    scanSub: "Scanne le QR code de ton livret d'activité pour débloquer ton défi !",
    openCamera: "Ouvrir ma caméra",
    manualCode: "Ou entre le code du QR Code",
    manualCodePlaceholder: "Ex: T1-C3 ou 88219",
    submitCode: "Valider le code",
    invalidQrTitle: "Oups ! QR Code non valide",
    invalidQrMessage: "Vérifie le code de ton cahier et réessaie !",
    tryAgain: "Réessayer",
    navHome: "Accueil",
    navParcours: "Parcours",
    navDefis: "Défis",
    navClassement: "Classement",
    navProfil: "Profil",
    currentTome: "Tome actuel",
    progress: "Progression",
    totalPoints: "Points totaux",
    completedDefis: "Défis réussis",
    rank: "Rang",
    badges: "Badges",
    diplomas: "Diplômes",
    level: "Niveau",
    chooseProfile: "Choisis ton profil",
    addProfile: "Ajouter un profil",
    parentSpace: "Espace Parent",
    adminPanel: "Administration",
    logout: "Se déconnecter",
    login: "Se connecter",
    createAccount: "Créer un compte",
    continueNoAccount: "Continuer sans compte",
    congratulations: "Félicitations !",
    challengeCompleted: "Tu as terminé le défi avec succès !",
    nextChallenge: "Continuer mon parcours",
    seeResults: "Voir mes résultats",
    downloadDiploma: "Télécharger mon diplôme",
    share: "Partager",
    locked: "Verrouillé",
    unlocked: "Débloqué",
    chapter: "Chapitre",
    question: "Question",
    validate: "Valider",
    goodJob: "Bravo !",
    keepGoing: "Super effort ! Essaie encore !",
    ageBand: "Tranche d'âge",
    mascot: "Mascotte préférée",
    globalLeaderboard: "Global",
    friendsLeaderboard: "Amis",
    schoolLeaderboard: "École",
    leaderboardTitle: "Le Podium des Champions",
    leaderboardSub: "Gagne des points à chaque défi validé !",
    settings: "Paramètres",
    helpSupport: "Aide et support",
    darkMode: "Mode Forêt de Nuit",
    lightMode: "Mode Jour Clair",
    language: "Langue",
    pwaInstallText: "Installe l'application sur ton écran d'accueil pour jouer même hors-ligne !",
    pwaInstallBtn: "Installer l'app",
    pwaDismiss: "Plus tard"
  },
  en: {
    appName: "Forest Buddies",
    appSubtitle: "Magic companion for your activity book",
    welcomeMessage: "Hello",
    scanQrBtn: "Scan my QR Code",
    scanTitle: "Scan QR Code",
    scanSub: "Scan the QR code in your booklet to unlock your challenge!",
    openCamera: "Open Camera",
    manualCode: "Or enter QR Code manually",
    manualCodePlaceholder: "Ex: T1-C3 or 88219",
    submitCode: "Submit Code",
    invalidQrTitle: "Oops! Invalid QR Code",
    invalidQrMessage: "Check the code in your book and try again!",
    tryAgain: "Try Again",
    navHome: "Home",
    navParcours: "Adventure",
    navDefis: "Challenges",
    navClassement: "Leaderboard",
    navProfil: "Profile",
    currentTome: "Current Book",
    progress: "Progress",
    totalPoints: "Total Points",
    completedDefis: "Completed Challenges",
    rank: "Rank",
    badges: "Badges",
    diplomas: "Diplomas",
    level: "Level",
    chooseProfile: "Choose your profile",
    addProfile: "Add a profile",
    parentSpace: "Parent Hub",
    adminPanel: "Admin Panel",
    logout: "Log out",
    login: "Log in",
    createAccount: "Create Account",
    continueNoAccount: "Continue without account",
    congratulations: "Congratulations!",
    challengeCompleted: "You successfully completed the challenge!",
    nextChallenge: "Continue Adventure",
    seeResults: "See my results",
    downloadDiploma: "Download Diploma",
    share: "Share",
    locked: "Locked",
    unlocked: "Unlocked",
    chapter: "Chapter",
    question: "Question",
    validate: "Submit",
    goodJob: "Great job!",
    keepGoing: "Great effort! Try again!",
    ageBand: "Age Group",
    mascot: "Favorite Mascot",
    globalLeaderboard: "Global",
    friendsLeaderboard: "Friends",
    schoolLeaderboard: "School",
    leaderboardTitle: "Champions Podium",
    leaderboardSub: "Earn points with every validated challenge!",
    settings: "Settings",
    helpSupport: "Help & Support",
    darkMode: "Night Forest Mode",
    lightMode: "Day Forest Mode",
    language: "Language",
    pwaInstallText: "Install the app on your home screen to play offline anytime!",
    pwaInstallBtn: "Install App",
    pwaDismiss: "Later"
  },
  es: {
    appName: "Amigos del Bosque",
    appSubtitle: "Compañero mágico de tu cuaderno de actividades",
    welcomeMessage: "Hola",
    scanQrBtn: "Escanear mi código QR",
    scanTitle: "Escanear código QR",
    scanSub: "¡Escanea el código QR de tu cuaderno para desbloquear tu desafío!",
    openCamera: "Abrir cámara",
    manualCode: "O ingresa el código manualmente",
    manualCodePlaceholder: "Ej: T1-C3 o 88219",
    submitCode: "Validar código",
    invalidQrTitle: "¡Ups! Código QR no válido",
    invalidQrMessage: "¡Revisa el código en tu libro e inténtalo de nuevo!",
    tryAgain: "Intentar de nuevo",
    navHome: "Inicio",
    navParcours: "Aventura",
    navDefis: "Desafíos",
    navClassement: "Clasificación",
    navProfil: "Perfil",
    currentTome: "Tomo actual",
    progress: "Progresión",
    totalPoints: "Puntos totales",
    completedDefis: "Desafíos logrados",
    rank: "Rango",
    badges: "Insignias",
    diplomas: "Diplomas",
    level: "Nivel",
    chooseProfile: "Elige tu perfil",
    addProfile: "Añadir un perfil",
    parentSpace: "Espacio Padres",
    adminPanel: "Administración",
    logout: "Cerrar sesión",
    login: "Iniciar sesión",
    createAccount: "Crear una cuenta",
    continueNoAccount: "Continuar sin cuenta",
    congratulations: "¡Felicitaciones!",
    challengeCompleted: "¡Has completado el desafío con éxito!",
    nextChallenge: "Continuar mi recorrido",
    seeResults: "Ver mis resultados",
    downloadDiploma: "Descargar mi diploma",
    share: "Compartir",
    locked: "Bloqueado",
    unlocked: "Desbloqueado",
    chapter: "Capítulo",
    question: "Pregunta",
    validate: "Validar",
    goodJob: "¡Bravo!",
    keepGoing: "¡Gran esfuerzo! ¡Inténtalo otra vez!",
    ageBand: "Rango de edad",
    mascot: "Mascota favorita",
    globalLeaderboard: "Global",
    friendsLeaderboard: "Amigos",
    schoolLeaderboard: "Escuela",
    leaderboardTitle: "Podio de Campeones",
    leaderboardSub: "¡Gana puntos con cada desafío validado!",
    settings: "Configuración",
    helpSupport: "Ayuda y soporte",
    darkMode: "Modo Bosque Nocturno",
    lightMode: "Modo Bosque Claro",
    language: "Idioma",
    pwaInstallText: "¡Instala la app en tu pantalla para jugar sin conexión!",
    pwaInstallBtn: "Instalar App",
    pwaDismiss: "Más tarde"
  },
  de: {
    appName: "Wald-Freunde",
    appSubtitle: "Magischer Begleiter für dein Mitmachbuch",
    welcomeMessage: "Hallo",
    scanQrBtn: "Meinen QR-Code scannen",
    scanTitle: "QR-Code scannen",
    scanSub: "Scanne den QR-Code aus deinem Heft, um deine Challenge freizuschalten!",
    openCamera: "Kamera öffnen",
    manualCode: "Oder Code manuell eingeben",
    manualCodePlaceholder: "z.B. T1-C3 oder 88219",
    submitCode: "Code bestätigen",
    invalidQrTitle: "Upps! Ungültiger QR-Code",
    invalidQrMessage: "Überprüfe den Code im Heft und versuche es erneut!",
    tryAgain: "Erneut versuchen",
    navHome: "Start",
    navParcours: "Abenteuer",
    navDefis: "Challenges",
    navClassement: "Rangliste",
    navProfil: "Profil",
    currentTome: "Aktueller Band",
    progress: "Fortschritt",
    totalPoints: "Gesamtpunkte",
    completedDefis: "Gelöste Aufgaben",
    rank: "Rang",
    badges: "Abzeichen",
    diplomas: "Urkunden",
    level: "Level",
    chooseProfile: "Wähle dein Profil",
    addProfile: "Profil hinzufügen",
    parentSpace: "Elternbereich",
    adminPanel: "Verwaltung",
    logout: "Abmelden",
    login: "Anmelden",
    createAccount: "Konto erstellen",
    continueNoAccount: "Ohne Konto fortfahren",
    congratulations: "Herzlichen Glückwunsch!",
    challengeCompleted: "Du hast die Aufgabe erfolgreich gelöst!",
    nextChallenge: "Weiter im Abenteuer",
    seeResults: "Ergebnisse ansehen",
    downloadDiploma: "Urkunde herunterladen",
    share: "Teilen",
    locked: "Gesperrt",
    unlocked: "Freigeschaltet",
    chapter: "Kapitel",
    question: "Frage",
    validate: "Bestätigen",
    goodJob: "Super gemacht!",
    keepGoing: "Toller Versuch! Probier es noch einmal!",
    ageBand: "Altersgruppe",
    mascot: "Lieblingsmaskottchen",
    globalLeaderboard: "Global",
    friendsLeaderboard: "Freunde",
    schoolLeaderboard: "Schule",
    leaderboardTitle: "Siegerpodest",
    leaderboardSub: "Sammle Punkte mit jeder gelösten Aufgabe!",
    settings: "Einstellungen",
    helpSupport: "Hilfe & Support",
    darkMode: "Nachtwald-Modus",
    lightMode: "Tagwald-Modus",
    language: "Sprache",
    pwaInstallText: "Installiere die App auf deinem Bildschirm für Offline-Spaß!",
    pwaInstallBtn: "App installieren",
    pwaDismiss: "Später"
  },
  it: {
    appName: "Amici del Bosco",
    appSubtitle: "Compagno magico per il tuo libro di attività",
    welcomeMessage: "Ciao",
    scanQrBtn: "Scansiona il mio codice QR",
    scanTitle: "Scansiona codice QR",
    scanSub: "Scansiona il codice QR nel tuo libro per sbloccare la sfida!",
    openCamera: "Apri fotocamera",
    manualCode: "O inserisci il codice manualmente",
    manualCodePlaceholder: "Es: T1-C3 o 88219",
    submitCode: "Invia codice",
    invalidQrTitle: "Ops! Codice QR non valido",
    invalidQrMessage: "Controlla il codice sul libro e riprova!",
    tryAgain: "Riprova",
    navHome: "Home",
    navParcours: "Avventura",
    navDefis: "Sfide",
    navClassement: "Classifica",
    navProfil: "Profilo",
    currentTome: "Tomo attuale",
    progress: "Progresso",
    totalPoints: "Punti totali",
    completedDefis: "Sfide completate",
    rank: "Posizione",
    badges: "Distintivi",
    diplomas: "Diplomi",
    level: "Livello",
    chooseProfile: "Scegli il tuo profilo",
    addProfile: "Aggiungi profilo",
    parentSpace: "Area Genitori",
    adminPanel: "Amministrazione",
    logout: "Disconnettiti",
    login: "Accedi",
    createAccount: "Crea account",
    continueNoAccount: "Continua senza account",
    congratulations: "Congratulazioni!",
    challengeCompleted: "Hai completato la sfida con successo!",
    nextChallenge: "Continua avventura",
    seeResults: "Vedi i miei risultati",
    downloadDiploma: "Scarica diploma",
    share: "Condividi",
    locked: "Bloccato",
    unlocked: "Sbloccato",
    chapter: "Capitolo",
    question: "Domanda",
    validate: "Invia",
    goodJob: "Bravissimo!",
    keepGoing: "Ottimo tentativo! Riprova!",
    ageBand: "Fascia d'età",
    mascot: "Mascotte preferita",
    globalLeaderboard: "Globale",
    friendsLeaderboard: "Amici",
    schoolLeaderboard: "Scuola",
    leaderboardTitle: "Podio dei Campioni",
    leaderboardSub: "Guadagna punti con ogni sfida completata!",
    settings: "Impostazioni",
    helpSupport: "Aiuto e supporto",
    darkMode: "Modalità Bosco Notturno",
    lightMode: "Modalità Bosco Giorno",
    language: "Lingua",
    pwaInstallText: "Installa l'app sullo schermo per giocare anche offline!",
    pwaInstallBtn: "Installa App",
    pwaDismiss: "Più tardi"
  },
  pt: {
    appName: "Amiguinhos da Floresta",
    appSubtitle: "Companheiro mágico do teu livro de atividades",
    welcomeMessage: "Olá",
    scanQrBtn: "Escanear o meu código QR",
    scanTitle: "Escanear código QR",
    scanSub: "Escaneia o código QR do teu livro para desbloquear o desafio!",
    openCamera: "Abrir câmara",
    manualCode: "Ou digita o código manualmente",
    manualCodePlaceholder: "Ex: T1-C3 ou 88219",
    submitCode: "Validar código",
    invalidQrTitle: "Ops! Código QR inválido",
    invalidQrMessage: "Verifica o código no teu livro e tenta novamente!",
    tryAgain: "Tentar novamente",
    navHome: "Início",
    navParcours: "Aventura",
    navDefis: "Desafios",
    navClassement: "Classificação",
    navProfil: "Perfil",
    currentTome: "Volume atual",
    progress: "Progresso",
    totalPoints: "Pontos totais",
    completedDefis: "Desafios concluídos",
    rank: "Posição",
    badges: "Instígnias",
    diplomas: "Diplomas",
    level: "Nível",
    chooseProfile: "Escolhe o teu perfil",
    addProfile: "Adicionar perfil",
    parentSpace: "Espaço dos Pais",
    adminPanel: "Administração",
    logout: "Sair",
    login: "Entrar",
    createAccount: "Criar conta",
    continueNoAccount: "Continuar sem conta",
    congratulations: "Parabéns!",
    challengeCompleted: "Concluíste o desafio com sucesso!",
    nextChallenge: "Continuar aventura",
    seeResults: "Ver os meus resultados",
    downloadDiploma: "Descarregar diploma",
    share: "Partilhar",
    locked: "Bloqueado",
    unlocked: "Desbloqueado",
    chapter: "Capítulo",
    question: "Pergunta",
    validate: "Validar",
    goodJob: "Parabéns!",
    keepGoing: "Bom esforço! Tenta outra vez!",
    ageBand: "Faixa etária",
    mascot: "Mascote favorita",
    globalLeaderboard: "Global",
    friendsLeaderboard: "Amigos",
    schoolLeaderboard: "Escola",
    leaderboardTitle: "Pódio dos Campeões",
    leaderboardSub: "Ganha pontos com cada desafio concluído!",
    settings: "Definições",
    helpSupport: "Ajuda e Suporte",
    darkMode: "Modo Floresta Noturna",
    lightMode: "Modo Floresta Dia",
    language: "Idioma",
    pwaInstallText: "Instala a app no teu ecrã para jogares offline!",
    pwaInstallBtn: "Instalar App",
    pwaDismiss: "Mais tarde"
  }
};

export function getTranslation(lang: Language, key: keyof Translations): string {
  const dict = translations[lang] || translations.fr;
  return dict[key] || translations.fr[key] || key;
}
