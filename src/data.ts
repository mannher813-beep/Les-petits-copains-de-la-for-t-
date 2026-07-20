/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookData } from "./types";

export const booksData: BookData[] = [
  {
    id: 1,
    titleFr: "La rencontre",
    titleEn: "The Meeting",
    descriptionFr: "Fais la connaissance de Léo, Nina, Darina et Lana. Répare le pont et voyage dans la forêt !",
    descriptionEn: "Meet Leo, Nina, Darina, and Lana. Repair the bridge and journey into the forest!",
    themeEmojis: ["🌿", "🍎", "💧"],
    chapters: [
      {
        id: 1,
        titleFr: "La rencontre",
        titleEn: "The Meeting",
        coverSceneId: "scene-ch1-title",
        storyFr: [
          "Un matin, dans la grande forêt, Léo le renard se promène sous les arbres. Soudain, il entend un petit bruit : « scrit, scrit ». C'est Nina la souris qui cherche des graines !",
          "Puis une boule piquante roule sur le chemin : bonjour Darina la hérissonne ! Et dans le ciel, un chant joyeux : « cui-cui ! ». Voilà Lana l'oiseau !",
          "Les quatre animaux deviennent amis. Mais Lana regarde autour d'elle : « Il nous manque quelqu'un… TOI ! Veux-tu faire partie des Copains de la Forêt ? »"
        ],
        storyEn: [
          "One morning, in the big forest, Leo the fox is walking beneath the trees. Suddenly, he hears a little sound: 'scrit, scrit'. It is Nina the mouse who is looking for seeds!",
          "Then a prickly ball rolls down the path: hello Darina the hedgehog! And from the sky comes a happy song: 'tweet-tweet!'. Here is Lana the bird!",
          "The four animals become friends. But Lana looks around her: 'Someone is missing... YOU! Will you join the Forest Friends?'"
        ],
        storySceneId: "scene-ch1-story",
        badgeNameFr: "Ami de la Forêt",
        badgeNameEn: "Forest Friend",
        badgeColor: "#4e9d58",
        badgeIconId: "#d-feuille",
        badgeDescFr: "Tu as rencontré toute la bande et réussi tes 6 premières missions. Tu es maintenant officiellement notre AMI ! La forêt t'ouvre ses portes…",
        badgeDescEn: "You met the whole gang and completed your first 6 missions. You are now officially our FRIEND! The forest opens its doors to you...",
        missions: [
          {
            id: 101,
            difficulty: 1,
            num: 1,
            typeFr: "Lecture · les lettres",
            typeEn: "Reading · letters",
            bubbleFr: "Pour devenir mon ami, retrouve la lettre qui commence mon prénom : Léo !",
            bubbleEn: "To become my friend, find the letter that starts my name: Leo!",
            consigneFr: "👉 Clique (ou entoure) la bonne lettre :",
            consigneEn: "👉 Click (or circle) the correct letter:",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "101-a", textFr: "A", textEn: "A" },
              { id: "101-b", textFr: "L", textEn: "L", isCorrect: true },
              { id: "101-c", textFr: "E", textEn: "E" }
            ],
            solutionFr: "C'est le L ! Léo commence par la lettre L.",
            solutionEn: "It is L! Leo starts with the letter L."
          },
          {
            id: 102,
            difficulty: 2,
            num: 2,
            typeFr: "Lecture · observer les lettres",
            typeEn: "Reading · observing letters",
            bubbleFr: "Des lettres A se cachent dans les feuilles ! Il y en a 4. Trouve-les toutes !",
            bubbleEn: "Letters A are hiding in the leaves! There are 4 of them. Find them all!",
            consigneFr: "👉 Sélectionne les 4 lettres A :",
            consigneEn: "👉 Select the 4 letters A:",
            character: "nina",
            exerciseType: "grid-find",
            gridItems: [
              { id: "102-1", text: "B", isTarget: false },
              { id: "102-2", text: "A", isTarget: true },
              { id: "102-3", text: "M", isTarget: false },
              { id: "102-4", text: "A", isTarget: true },
              { id: "102-5", text: "L", isTarget: false },
              { id: "102-6", text: "O", isTarget: false },
              { id: "102-7", text: "A", isTarget: true },
              { id: "102-8", text: "S", isTarget: false },
              { id: "102-9", text: "T", isTarget: false },
              { id: "102-10", text: "E", isTarget: false },
              { id: "102-11", text: "A", isTarget: true },
              { id: "102-12", text: "R", isTarget: false }
            ],
            solutionFr: "Les 4 A se cachent aux positions 2, 4, 7 et 11.",
            solutionEn: "The 4 As are hiding at positions 2, 4, 7 and 11."
          },
          {
            id: 103,
            difficulty: 3,
            num: 3,
            typeFr: "Maths · compter",
            typeEn: "Math · counting",
            bubbleFr: "J'ai cueilli des pommes pour le goûter. Peux-tu les compter pour moi ?",
            bubbleEn: "I picked some apples for our snack. Can you count them for me?",
            consigneFr: "👉 Combien de pommes a Léo ? (Regarde l'image ci-dessus)",
            consigneEn: "👉 How many apples does Leo have? (Look at the image above)",
            character: "leo",
            exerciseType: "qcm",
            countIcons: [
              { icon: "d-pomme", count: 5 }
            ],
            choices: [
              { id: "103-a", textFr: "3", textEn: "3" },
              { id: "103-b", textFr: "5", textEn: "5", isCorrect: true },
              { id: "103-c", textFr: "7", textEn: "7" }
            ],
            solutionFr: "Il y a 5 pommes : 1, 2, 3, 4, 5 !",
            solutionEn: "There are 5 apples: 1, 2, 3, 4, 5!"
          },
          {
            id: 104,
            difficulty: 1,
            num: 4,
            typeFr: "Maths · comparer",
            typeEn: "Math · comparing",
            bubbleFr: "Regarde : des champignons et des fleurs ! Quel groupe en a le plus ?",
            bubbleEn: "Look: mushrooms and flowers! Which group has the most?",
            consigneFr: "👉 Sélectionne le groupe qui en a le PLUS :",
            consigneEn: "👉 Select the group that has the MOST:",
            character: "tom",
            exerciseType: "qcm",
            countIcons: [
              { icon: "d-champi", count: 4, labelFr: "Champignons", labelEn: "Mushrooms" },
              { icon: "d-fleur", count: 6, labelFr: "Fleurs", labelEn: "Flowers" }
            ],
            choices: [
              { id: "104-a", textFr: "Les champignons (il y en a 4)", textEn: "The mushrooms (there are 4)" },
              { id: "104-b", textFr: "Les fleurs (il y en a 6)", textEn: "The flowers (there are 6)", isCorrect: true }
            ],
            solutionFr: "Les fleurs ! Il y a 6 fleurs et seulement 4 champignons.",
            solutionEn: "The flowers! There are 6 flowers and only 4 mushrooms."
          },
          {
            id: 105,
            difficulty: 2,
            num: 5,
            typeFr: "Écriture · tracer",
            typeEn: "Writing · tracing",
            bubbleFr: "Apprends à écrire la lettre de mon prénom ! Repasse sur les modèles de lettres L et N.",
            bubbleEn: "Learn to write the letter of my name! Trace the letter L and letter N.",
            consigneFr: "👉 Dessine les lettres L et N dans la zone d'écriture :",
            consigneEn: "👉 Draw the letters L and N in the writing zone:",
            character: "leo",
            exerciseType: "tracing-letter",
            solutionFr: "Écris un L comme Léo et un N comme Nina !",
            solutionEn: "Write an L for Leo and an N for Nina!"
          },
          {
            id: 106,
            difficulty: 3,
            num: 6,
            typeFr: "Lecture · majuscules et minuscules",
            typeEn: "Reading · upper and lower case",
            bubbleFr: "Les grandes lettres ont perdu leurs petites sœurs ! Relie chaque majuscule à sa minuscule.",
            bubbleEn: "The capital letters lost their little sisters! Connect each uppercase to its lowercase.",
            consigneFr: "👉 Associe chaque lettre majuscule à sa minuscule :",
            consigneEn: "👉 Match each uppercase letter with its lowercase:",
            character: "zaza",
            exerciseType: "matching",
            matches: [
              { leftFr: "L", leftEn: "L", rightFr: "l", rightEn: "l", correctPairIndex: 0 },
              { leftFr: "N", leftEn: "N", rightFr: "n", rightEn: "n", correctPairIndex: 1 },
              { leftFr: "T", leftEn: "T", rightFr: "t", rightEn: "t", correctPairIndex: 2 },
              { leftFr: "Z", leftEn: "Z", rightFr: "z", rightEn: "z", correctPairIndex: 3 }
            ]
          }
        ]
      },
      {
        id: 2,
        titleFr: "Le chemin mystérieux",
        titleEn: "The Mysterious Path",
        coverSceneId: "scene-ch2-title",
        storyFr: [
          "Nina sort une vieille carte de sa poche. « Regardez ! La Grande Clairière est au bout de ce chemin. C'est l'endroit parfait pour construire notre cabane ! »",
          "Mais le chemin traverse le Bois des Devinettes : des sentiers qui tournent, des cases à compter, des suites à deviner… Seuls les explorateurs très malins peuvent passer !",
          "Léo se tourne vers toi : « Notre nouvel ami, nous avons besoin de tes yeux et de ta tête bien remplie ! Prêt pour l'aventure ? »"
        ],
        storyEn: [
          "Nina pulls an old map from her pocket. 'Look! The Grand Clearing is at the end of this path. It is the perfect place to build our treehouse!'",
          "But the path crosses the Riddle Woods: twisting paths, squares to count, sequences to solve... Only very clever explorers can get through!",
          "Leo turns to you: 'Our new friend, we need your eyes and your clever mind! Ready for the adventure?'"
        ],
        storySceneId: "scene-ch2-story",
        badgeNameFr: "Explorateur",
        badgeNameEn: "Explorer",
        badgeColor: "#e08a2e",
        badgeIconId: "#c-leo",
        badgeDescFr: "Tu as traversé le Bois des Devinettes : labyrinthe, calculs, suites, intrus… rien ne t'arrête ! La Grande Clairière est juste devant nous.",
        badgeDescEn: "You crossed the Riddle Woods: maze, calculations, sequences, odd ones... nothing stops you! The Grand Clearing is right in front of us.",
        missions: [
          {
            id: 107,
            difficulty: 1,
            num: 7,
            typeFr: "Logique · labyrinthe",
            typeEn: "Logic · maze",
            bubbleFr: "Aide-moi à traverser le labyrinthe pour rejoindre le champignon géant !",
            bubbleEn: "Help me cross the maze to reach the giant mushroom!",
            consigneFr: "👉 Utilise la souris ou le doigt pour dessiner le chemin dans le labyrinthe :",
            consigneEn: "👉 Use your mouse or finger to draw the path in the maze:",
            character: "nina",
            exerciseType: "drawing",
            mazeLayout: 1
          },
          {
            id: 108,
            difficulty: 2,
            num: 8,
            typeFr: "Repérage · la grille",
            typeEn: "Positioning · the grid",
            bubbleFr: "Vu du ciel, la forêt ressemble à un quadrillage ! Dans quelle case se trouve le champignon ?",
            bubbleEn: "From above, the forest looks like a grid! Which square is the mushroom in?",
            consigneFr: "👉 Sélectionne la case contenant le champignon (regarde l'image) :",
            consigneEn: "👉 Select the square containing the mushroom (look at the image):",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "108-a", textFr: "A2", textEn: "A2" },
              { id: "108-b", textFr: "B2", textEn: "B2", isCorrect: true },
              { id: "108-c", textFr: "C1", textEn: "C1" }
            ],
            solFr: "Le champignon est dans la colonne B, sur la ligne 2. C'est la case B2 !",
            solEn: "The mushroom is in column B, on line 2. It is square B2!"
          },
          {
            id: 109,
            difficulty: 3,
            num: 9,
            typeFr: "Maths · addition",
            typeEn: "Math · addition",
            bubbleFr: "J'ai trouvé 2 noisettes, puis encore 3 ! Combien j'en ai en tout ?",
            bubbleEn: "I found 2 hazelnuts, then 3 more! How many do I have in total?",
            consigneFr: "👉 Calcule : 2 noisettes + 3 noisettes = ?",
            consigneEn: "👉 Calculate: 2 hazelnuts + 3 hazelnuts = ?",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "109-a", textFr: "4", textEn: "4" },
              { id: "109-b", textFr: "5", textEn: "5", isCorrect: true },
              { id: "109-c", textFr: "6", textEn: "6" }
            ],
            solFr: "2 + 3 = 5 ! Darina a maintenant 5 délicieuses noisettes.",
            solEn: "2 + 3 = 5! Darina now has 5 delicious hazelnuts."
          },
          {
            id: 110,
            difficulty: 1,
            num: 10,
            typeFr: "Maths · petit problème",
            typeEn: "Math · word problem",
            bubbleFr: "J'ai 4 pommes dans mon sac. Darina m'en apporte 3 de plus. Combien ai-je de pommes maintenant ?",
            bubbleEn: "I have 4 apples in my bag. Darina brings me 3 more. How many apples do I have now?",
            consigneFr: "👉 Dessine ou écris le résultat de l'addition (4 + 3) :",
            consigneEn: "👉 Draw or write the result of the addition (4 + 3):",
            character: "leo",
            exerciseType: "input-text",
            inputPlaceholderFr: "Écris le résultat ici...",
            inputPlaceholderEn: "Write the result here...",
            solutionFr: "4 + 3 = 7 ! Léo a maintenant 7 pommes.",
            solutionEn: "4 + 3 = 7! Leo now has 7 apples."
          },
          {
            id: 111,
            difficulty: 2,
            num: 11,
            typeFr: "Logique · suite de formes",
            typeEn: "Logic · shape pattern",
            bubbleFr: "Des cailloux magiques bordent le chemin. Quelle forme vient ensuite ?",
            bubbleEn: "Magic stones border the path. Which shape comes next?",
            consigneFr: "👉 Quelle forme continue la suite : Rond, Carré, Rond, Carré, Rond, ... ?",
            consigneEn: "👉 Which shape continues the pattern: Circle, Square, Circle, Square, Circle, ... ?",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "111-a", textFr: "⚪ le rond", textEn: "⚪ the circle" },
              { id: "111-b", textFr: "🟧 le carré", textEn: "🟧 the square", isCorrect: true },
              { id: "111-c", textFr: "🔺 le triangle", textEn: "🔺 the triangle" }
            ],
            solFr: "Après le rond, c'est au tour du carré de continuer la suite !",
            solEn: "After the circle, it's the square's turn to continue the pattern!"
          },
          {
            id: 112,
            difficulty: 3,
            num: 12,
            typeFr: "Maths · suite de nombres",
            typeEn: "Math · number pattern",
            bubbleFr: "Des nombres sont peints sur les pierres du chemin… mais l'un a été effacé par la pluie !",
            bubbleEn: "Numbers are painted on the stones... but one of them was washed away by the rain!",
            consigneFr: "👉 Quel nombre remplace le point d'interrogation : 1 · 2 · 3 · ? · 5 · 6",
            consigneEn: "👉 Which number replaces the question mark: 1 · 2 · 3 · ? · 5 · 6",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "112-a", textFr: "4", textEn: "4", isCorrect: true },
              { id: "112-b", textFr: "7", textEn: "7" },
              { id: "112-c", textFr: "2", textEn: "2" }
            ],
            solFr: "C'est le nombre 4 qui se trouve entre le 3 et le 5 !",
            solEn: "It's the number 4 that goes between 3 and 5!"
          },
          {
            id: 113,
            difficulty: 1,
            num: 13,
            typeFr: "Maths · relier les points",
            typeEn: "Math · connect the dots",
            bubbleFr: "Une étoile brillante montre la direction de la clairière ! Relie les points de 1 à 10 pour la faire apparaître.",
            bubbleEn: "A bright star shows the direction of the clearing! Connect the dots from 1 to 10 to reveal it.",
            consigneFr: "👉 Utilise le panneau de dessin pour relier les chiffres de 1 à 10 :",
            consigneEn: "👉 Use the drawing panel to connect numbers from 1 to 10:",
            character: "zaza",
            exerciseType: "drawing"
          },
          {
            id: 114,
            difficulty: 2,
            num: 14,
            typeFr: "Maths · comparer les nombres",
            typeEn: "Math · comparing numbers",
            bubbleFr: "Deux sentiers, deux panneaux… Prenons toujours celui du plus grand nombre !",
            bubbleEn: "Two paths, two signs... Let's always take the path with the larger number!",
            consigneFr: "👉 Trouve le plus grand nombre de chaque paire :",
            consigneEn: "👉 Find the larger number in each pair:",
            character: "tom",
            exerciseType: "order-numbers",
            choices: [
              { id: "114-1", textFr: "7 est plus grand que 4", textEn: "7 is greater than 4", isCorrect: true },
              { id: "114-2", textFr: "9 est plus grand que 5", textEn: "9 is greater than 5", isCorrect: true },
              { id: "114-3", textFr: "10 est plus grand que 8", textEn: "10 is greater than 8", isCorrect: true }
            ]
          },
          {
            id: 115,
            difficulty: 3,
            num: 15,
            typeFr: "Observation · l'intrus",
            typeEn: "Observation · the odd one out",
            bubbleFr: "Quelqu'un s'est glissé dans notre groupe d'animaux… Trouve l'intrus qui n'est pas un animal !",
            bubbleEn: "Someone slipped into our group of animals... Find the odd one out that is not an animal!",
            consigneFr: "👉 Sélectionne l'intrus parmi les images :",
            consigneEn: "👉 Select the odd one out among the images:",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "115-a", textFr: "Léo le renard", textEn: "Leo the fox" },
              { id: "115-b", textFr: "Nina la souris", textEn: "Nina the mouse" },
              { id: "115-c", textFr: "La fleur", textEn: "The flower", isCorrect: true },
              { id: "115-d", textFr: "Lana l'oiseau", textEn: "Lana the bird" }
            ],
            solFr: "La fleur ! Elle fait partie de la flore, tandis que les autres sont des animaux (la faune).",
            solEn: "The flower! It is a plant, while the others are animals."
          },
          {
            id: 116,
            difficulty: 1,
            num: 16,
            typeFr: "Observation · cherche et trouve",
            typeEn: "Observation · search and find",
            bubbleFr: "Avant d'arriver, un dernier défi : 3 papillons se cachent dans la clairière. Trouve-les !",
            bubbleEn: "Before arriving, one last challenge: 3 butterflies are hiding in the clearing. Find them!",
            consigneFr: "👉 Observe bien le dessin et trouve les 3 papillons magiques :",
            consigneEn: "👉 Look closely at the picture and find the 3 magic butterflies:",
            character: "zaza",
            exerciseType: "drawing"
          }
        ]
      },
      {
        id: 3,
        titleFr: "La rivière enchantée",
        titleEn: "The Enchanted River",
        coverSceneId: "scene-ch3-title",
        storyFr: [
          "Devant la Grande Clairière coule la rivière enchantée. Son eau chante comme une petite musique. Mais patatras : le vieux pont de bois a perdu ses planches !",
          "Une libellule dorée s'approche et murmure : « Ce pont est magique. Pour le réparer, il faut lire et écrire des mots. Chaque mot réussi fait apparaître une nouvelle planche ! »",
          "Nina saute de joie : « Notre ami sait déjà reconnaître plein de lettres ! Avec toi, ce pont sera réparé en un clin d'œil. »"
        ],
        storyEn: [
          "The enchanted river flows in front of the Grand Clearing. Its water sings like a little melody. But oh no: the old wooden bridge has lost its planks!",
          "A golden dragonfly approaches and whispers: 'This bridge is magical. To repair it, you must read and write words. Each successful word makes a new plank appear!'",
          "Nina jumps with joy: 'Our friend already knows how to recognize so many letters! With you, this bridge will be repaired in the blink of an eye.'"
        ],
        storySceneId: "scene-ch3-story",
        badgeNameFr: "Grand Lecteur",
        badgeNameEn: "Great Reader",
        badgeColor: "#3f9bd8",
        badgeIconId: "#d-champi",
        badgeDescFr: "Grâce à toi, les 10 planches du pont sont réparées ! Tu sais lire des mots, des phrases, et même écrire comme un grand. La rivière enchantée chante ton nom…",
        badgeDescEn: "Thanks to you, the 10 planks of the bridge are repaired! You can read words, sentences, and even write like a big kid. The enchanted river sings your name...",
        missions: [
          {
            id: 117,
            difficulty: 2,
            num: 17,
            typeFr: "Lecture · les syllabes",
            typeEn: "Reading · syllables",
            bubbleFr: "Les mots se sont cassés en deux, comme le pont ! Assemble les syllabes pour les réparer.",
            bubbleEn: "The words broke in two, just like the bridge! Assemble the syllables to repair them.",
            consigneFr: "👉 Relie chaque début de mot à sa fin :",
            consigneEn: "👉 Connect each start of a word to its end:",
            character: "zaza",
            exerciseType: "matching",
            matches: [
              { leftFr: "RE", leftEn: "RE", rightFr: "NARD", rightEn: "NARD", correctPairIndex: 0 },
              { leftFr: "SOU", leftEn: "MOU", rightFr: "RIS", rightEn: "SE", correctPairIndex: 1 },
              { leftFr: "OI", leftEn: "BI", rightFr: "SEAU", rightEn: "RD", correctPairIndex: 2 }
            ]
          },
          {
            id: 118,
            difficulty: 3,
            num: 18,
            typeFr: "Lecture · lettre manquante",
            typeEn: "Reading · missing letter",
            bubbleFr: "Oh non, des lettres sont tombées dans l'eau ! Retrouve la lettre qui manque pour écrire PONT et SOURIS.",
            bubbleEn: "Oh no, some letters fell in the water! Find the missing letter to write BRIDGE and MOUSE.",
            consigneFr: "👉 Quelle lettre manque dans ces mots ?",
            consigneEn: "👉 Which letter is missing in these words?",
            character: "nina",
            exerciseType: "order-numbers",
            choices: [
              { id: "118-1", textFr: "P _ N T (le O est manquant)", textEn: "B R I D G _ (the E is missing)", isCorrect: true },
              { id: "118-2", textFr: "S O U R I _ (le S est manquant)", textEn: "M O U S _ (the E is missing)", isCorrect: true }
            ]
          },
          {
            id: 119,
            difficulty: 1,
            num: 19,
            typeFr: "Lecture · vrai ou faux",
            typeEn: "Reading · true or false",
            bubbleFr: "Lis cette phrase à voix haute, puis réponds. La rivière écoute !",
            bubbleEn: "Read this sentence out loud, then answer. The river is listening!",
            consigneFr: "👉 « Nina est une souris grise. » Vrai ou Faux ?",
            consigneEn: "👉 'Nina is a gray mouse.' True or False?",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "119-a", textFr: "✔ VRAI", textEn: "✔ TRUE", isCorrect: true },
              { id: "119-b", textFr: "✘ FAUX", textEn: "✘ FALSE" }
            ],
            solFr: "C'est vrai ! Nina est bien notre petite amie la souris grise.",
            solEn: "That's true! Nina is indeed our little gray mouse friend."
          },
          {
            id: 120,
            difficulty: 2,
            num: 20,
            typeFr: "Lecture · mots et images",
            typeEn: "Reading · words and pictures",
            bubbleFr: "Relie chaque mot à la bonne image, et deux planches de plus apparaîtront !",
            bubbleEn: "Connect each word to its matching image, and two more planks will appear!",
            consigneFr: "👉 Associe chaque mot à l'illustration correspondante :",
            consigneEn: "👉 Match each word to its corresponding illustration:",
            character: "zaza",
            exerciseType: "matching",
            matches: [
              { leftFr: "SOLEIL", leftEn: "SUN", rightFr: "Soleil ☀️", rightEn: "Sun ☀️", rightIcon: "d-soleil", correctPairIndex: 0 },
              { leftFr: "FLEUR", leftEn: "FLOWER", rightFr: "Fleur 🌸", rightEn: "Flower 🌸", rightIcon: "d-fleur", correctPairIndex: 1 },
              { leftFr: "CHAMPIGNON", leftEn: "MUSHROOM", rightFr: "Champignon 🍄", rightEn: "Mushroom 🍄", rightIcon: "d-champi", correctPairIndex: 2 },
              { leftFr: "ÉTOILE", leftEn: "STAR", rightFr: "Étoile ⭐", rightEn: "Star ⭐", rightIcon: "d-etoile", correctPairIndex: 3 }
            ]
          },
          {
            id: 121,
            difficulty: 3,
            num: 21,
            typeFr: "Lecture · phrase en désordre",
            typeEn: "Reading · scrambled sentence",
            bubbleFr: "Le vent a mélangé les mots de ma phrase ! Remets-les dans l'ordre.",
            bubbleEn: "The wind mixed up the words in my sentence! Put them back in order.",
            consigneFr: "👉 Remets la phrase dans l'ordre : 'chante' (A), 'Lana' (B), 'bien' (C)",
            consigneEn: "👉 Order the sentence: 'sings' (A), 'Lana' (B), 'well' (C)",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "121-a", textFr: "chante bien Lana (A-C-B)", textEn: "sings well Lana" },
              { id: "121-b", textFr: "Lana chante bien (B-A-C)", textEn: "Lana sings well (B-A-C)", isCorrect: true },
              { id: "121-c", textFr: "bien chante Lana (C-A-B)", textEn: "well sings Lana" }
            ],
            solFr: "Lana chante bien ! C'est la jolie phrase que Lana l'oiseau adore entendre.",
            solEn: "Lana sings well! That's the lovely sentence Lana the bird loves to hear."
          },
          {
            id: 122,
            difficulty: 1,
            num: 22,
            typeFr: "Lecture · retrouver un mot",
            typeEn: "Reading · find a word",
            bubbleFr: "Le mot magique du pont est RIVIÈRE. Retrouve-le parmi les mots mouillés !",
            bubbleEn: "The bridge's magic word is RIVER. Find it among the wet words!",
            consigneFr: "👉 Clique sur le mot RIVIÈRE :",
            consigneEn: "👉 Click on the word RIVER:",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "122-a", textFr: "RIVAGE", textEn: "SHORE" },
              { id: "122-b", textFr: "RIVIÈRE", textEn: "RIVER", isCorrect: true },
              { id: "122-c", textFr: "RIRE", textEn: "LAUGH" },
              { id: "122-d", textFr: "LUMIÈRE", textEn: "LIGHT" }
            ],
            solFr: "Bravo ! RIVIÈRE était le deuxième mot.",
            solEn: "Bravo! RIVER was the second word."
          },
          {
            id: 123,
            difficulty: 2,
            num: 23,
            typeFr: "Écriture · écrire un mot",
            typeEn: "Writing · write a word",
            bubbleFr: "Écris le mot magique PONT pour faire apparaître la grande planche du milieu !",
            bubbleEn: "Write the magic word BRIDGE to make the large middle plank appear!",
            consigneFr: "👉 Entraîne-toi à tracer le mot PONT / BRIDGE dans la zone d'écriture :",
            consigneEn: "👉 Practice tracing the word PONT / BRIDGE in the writing zone:",
            character: "tom",
            exerciseType: "tracing-letter",
            solutionFr: "Tu as écrit PONT ! La planche du milieu se répare.",
            solutionEn: "You wrote BRIDGE! The middle plank is now repaired."
          },
          {
            id: 124,
            difficulty: 3,
            num: 24,
            typeFr: "Écriture · compléter une phrase",
            typeEn: "Writing · fill in sentence",
            bubbleFr: "Complète la phrase avec le bon mot. La libellule te souffle trois idées !",
            bubbleEn: "Complete the sentence with the correct word. The dragonfly is whispering three ideas!",
            consigneFr: "👉 « Léo est un ... roux. » Choisis le mot correct :",
            consigneEn: "👉 'Leo is an orange ... ' Choose the correct word:",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "124-a", textFr: "oiseau", textEn: "bird" },
              { id: "124-b", textFr: "renard", textEn: "fox", isCorrect: true },
              { id: "124-c", textFr: "hérisson", textEn: "hedgehog" }
            ],
            solFr: "C'est bien 'renard' ! Léo est un superbe renard roux.",
            solEn: "It is indeed 'fox'! Leo is a beautiful orange fox."
          },
          {
            id: 125,
            difficulty: 1,
            num: 25,
            typeFr: "Écriture · recopier une phrase",
            typeEn: "Writing · copy a sentence",
            bubbleFr: "Dernière planche ! Recopie cette phrase de victoire de ta plus belle écriture.",
            bubbleEn: "Last plank! Copy this victory sentence with your finest handwriting.",
            consigneFr: "👉 Recopie 'Le pont est réparé !' / 'The bridge is repaired!' :",
            consigneEn: "👉 Copy 'Le pont est réparé !' / 'The bridge is repaired!':",
            character: "zaza",
            exerciseType: "tracing-letter"
          },
          {
            id: 126,
            difficulty: 2,
            num: 26,
            typeFr: "Créativité · ton mot magique",
            typeEn: "Creativity · your magic word",
            bubbleFr: "La libellule dorée veut te remercier. Invente TON mot magique à toi et écris-le ici !",
            bubbleEn: "The golden dragonfly wants to thank you. Invent YOUR own magic word and write it here!",
            consigneFr: "👉 Écris ton mot magique inventé :",
            consigneEn: "👉 Write down your invented magic word:",
            character: "leo",
            exerciseType: "input-text",
            inputPlaceholderFr: "Mon mot magique...",
            inputPlaceholderEn: "My magic word..."
          }
        ]
      },
      {
        id: 4,
        titleFr: "Les champignons magiques",
        titleEn: "The Magic Mushrooms",
        coverSceneId: "scene-ch4-title",
        storyFr: [
          "Dans la Grande Clairière, les Copains découvrent un cercle de champignons magiques. Quand on résout un calcul, un champignon s'allume comme une petite lampe !",
          "« Formidable ! » s'écrie Nina. « Si nous allumons tous les champignons, la clairière brillera pour la grande fête de la forêt ! »",
          "Darin sort son petit carnet : « J'adore compter, mais il y a trop de calculs pour moi tout seul. Toi, tu es fort en maths, pas vrai ? Montre-nous ! »"
        ],
        storyEn: [
          "In the Grand Clearing, the Friends discover a circle of magic mushrooms. When we solve a calculation, a mushroom lights up like a little lamp!",
          "'Wonderful!' cries Nina. 'If we light all the mushrooms, the clearing will shine bright for the grand forest festival!'",
          "Darin takes out his notebook: 'I love counting, but there are too many calculations for me to do alone. You are good at math, right? Show us!'"
        ],
        storySceneId: "scene-ch4-story",
        badgeNameFr: "Petit Génie des Maths",
        badgeNameEn: "Little Math Genius",
        badgeColor: "#b0578f",
        badgeIconId: "#d-etoile",
        badgeDescFr: "Les 10 champignons magiques brillent de mille feux grâce à tes calculs ! Additions, soustractions, formes, suites… tu es un vrai petit génie. La clairière est prête !",
        badgeDescEn: "All 10 magic mushrooms are shining brightly thanks to your calculations! Addition, subtraction, shapes, patterns... you're a true genius. The clearing is ready!",
        missions: [
          {
            id: 127,
            difficulty: 3,
            num: 27,
            typeFr: "Maths · soustraction",
            typeEn: "Math · subtraction",
            bubbleFr: "J'avais 7 pommes… et j'en ai croqué 2, miam ! Combien il m'en reste ?",
            bubbleEn: "I had 7 apples... and I munched 2 of them, yum! How many are left?",
            consigneFr: "👉 Calcule : 7 - 2 = ?",
            consigneEn: "👉 Calculate: 7 - 2 = ?",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "127-a", textFr: "4", textEn: "4" },
              { id: "127-b", textFr: "5", textEn: "5", isCorrect: true },
              { id: "127-c", textFr: "6", textEn: "6" }
            ],
            solFr: "7 - 2 = 5 ! Les 2 pommes barrées sont dans le ventre de Léo.",
            solEn: "7 - 2 = 5! The 2 crossed-out apples are in Leo's tummy."
          },
          {
            id: 128,
            difficulty: 1,
            num: 28,
            typeFr: "Maths · petit problème",
            typeEn: "Math · word problem",
            bubbleFr: "J'ai 8 noisettes. J'en donne 3 à Darina pour la remercier. Combien m'en reste-t-il ?",
            bubbleEn: "I have 8 hazelnuts. I give 3 to Darina to say thank you. How many do I have left?",
            consigneFr: "👉 Écris ou dessine le résultat de la soustraction (8 - 3) :",
            consigneEn: "👉 Draw or write the result of the subtraction (8 - 3):",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Résultat...",
            inputPlaceholderEn: "Result...",
            solutionFr: "8 - 3 = 5 ! Le partage, c'est formidable !",
            solutionEn: "8 - 3 = 5! Sharing is caring!"
          },
          {
            id: 129,
            difficulty: 2,
            num: 29,
            typeFr: "Maths · additions à trous",
            typeEn: "Math · missing additions",
            bubbleFr: "Ces champignons sont coquins : ils cachent un nombre ! Trouve-le pour les allumer.",
            bubbleEn: "These mushrooms are cheeky: they are hiding a number! Find it to light them up.",
            consigneFr: "👉 Résous ces trois additions à trous :",
            consigneEn: "👉 Solve these three missing additions:",
            character: "tom",
            exerciseType: "order-numbers",
            choices: [
              { id: "129-1", textFr: "3 + _ = 6 (le nombre caché est 3)", textEn: "3 + _ = 6 (missing number is 3)", isCorrect: true },
              { id: "129-2", textFr: "2 + _ = 5 (le nombre caché est 3)", textEn: "2 + _ = 5 (missing number is 3)", isCorrect: true },
              { id: "129-3", textFr: "_ + 4 = 10 (le nombre caché est 6)", textEn: "_ + 4 = 10 (missing number is 6)", isCorrect: true }
            ]
          },
          {
            id: 130,
            difficulty: 3,
            num: 30,
            typeFr: "Maths · reconnaître les formes",
            typeEn: "Math · recognize shapes",
            bubbleFr: "Regarde la cabane que nous construisons pour la fête ! Elle est faite de formes géométriques.",
            bubbleEn: "Look at the den we are building for the party! It is made of geometric shapes.",
            consigneFr: "👉 Combien y a-t-il de triangles (▲) sur le dessin de la cabane ?",
            consigneEn: "👉 How many triangles (▲) are on the picture of the den?",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "130-a", textFr: "1 triangle", textEn: "1 triangle", isCorrect: true },
              { id: "130-b", textFr: "2 triangles", textEn: "2 triangles" },
              { id: "130-c", textFr: "3 triangles", textEn: "3 triangles" }
            ],
            solFr: "Un seul ! C'est le grand triangle blanc du toit.",
            solEn: "Just one! It's the big white triangle of the roof."
          },
          {
            id: 131,
            difficulty: 1,
            num: 31,
            typeFr: "Logique · suite de nombres",
            typeEn: "Logic · number pattern",
            bubbleFr: "Les champignons s'allument en sautant de 2 en 2 ! Quel est le prochain ?",
            bubbleEn: "The mushrooms light up by skipping by 2! What is the next one?",
            consigneFr: "👉 Complète la suite : 2 · 4 · 6 · ?",
            consigneEn: "👉 Complete the sequence: 2 · 4 · 6 · ?",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "131-a", textFr: "7", textEn: "7" },
              { id: "131-b", textFr: "8", textEn: "8", isCorrect: true },
              { id: "131-c", textFr: "10", textEn: "10" }
            ],
            solFr: "C'est le 8 ! On ajoute 2 à chaque fois.",
            solEn: "It's 8! We add 2 each time."
          },
          {
            id: 132,
            difficulty: 2,
            num: 32,
            typeFr: "Maths · ranger les nombres",
            typeEn: "Math · sorting numbers",
            bubbleFr: "Ces trois champignons portent des numéros mélangés. Range-les du plus petit au plus grand !",
            bubbleEn: "These three mushrooms have mixed up numbers. Sort them from smallest to largest!",
            consigneFr: "👉 Range les nombres 3, 7 et 5 par ordre croissant (du plus petit au plus grand) :",
            consigneEn: "👉 Sort the numbers 3, 7, and 5 in increasing order:",
            character: "tom",
            exerciseType: "input-text",
            inputPlaceholderFr: "Exemple: 1 < 2 < 3...",
            inputPlaceholderEn: "Example: 1 < 2 < 3...",
            solutionFr: "Le bon ordre est : 3 < 5 < 7 !",
            solutionEn: "The correct order is: 3 < 5 < 7!"
          },
          {
            id: 133,
            difficulty: 3,
            num: 33,
            typeFr: "Maths · calcul et coloriage",
            typeEn: "Math · calculate and color",
            bubbleFr: "Seuls les champignons dont le calcul fait 5 sont magiques ! Trouve-les.",
            bubbleEn: "Only the mushrooms whose sum is 5 are magical! Find them.",
            consigneFr: "👉 Sélectionne tous les champignons qui font exactement 5 :",
            consigneEn: "👉 Select all the mushrooms that equal exactly 5:",
            character: "leo",
            exerciseType: "grid-find",
            gridItems: [
              { id: "133-1", text: "2 + 3", isTarget: true },
              { id: "133-2", text: "3 + 3", isTarget: false },
              { id: "133-3", text: "4 + 1", isTarget: true },
              { id: "133-4", text: "2 + 2", isTarget: false },
              { id: "133-5", text: "5 + 0", isTarget: true }
            ],
            solutionFr: "Les calculs corrects sont 2+3, 4+1, et 5+0 !",
            solutionEn: "The correct equations are 2+3, 4+1, and 5+0!"
          },
          {
            id: 134,
            difficulty: 1,
            num: 34,
            typeFr: "Maths · plus grand, plus petit",
            typeEn: "Math · larger, smaller",
            bubbleFr: "Pour décorer, on gonfle des ballons ! Choisis à chaque fois le ballon correct.",
            bubbleEn: "For decoration, we blow up balloons! Choose the correct balloon each time.",
            consigneFr: "👉 Résous ces trois comparaisons :",
            consigneEn: "👉 Solve these three comparisons:",
            character: "zaza",
            exerciseType: "order-numbers",
            choices: [
              { id: "134-1", textFr: "Le plus grand entre 6 et 9 (9)", textEn: "The largest between 6 and 9 (9)", isCorrect: true },
              { id: "134-2", textFr: "Le plus petit entre 2 et 8 (2)", textEn: "The smallest between 2 and 8 (2)", isCorrect: true },
              { id: "134-3", textFr: "Égal à 4 + 4 (8)", textEn: "Equal to 4 + 4 (8)", isCorrect: true }
            ]
          },
          {
            id: 135,
            difficulty: 2,
            num: 35,
            typeFr: "Dessin · symétrie",
            typeEn: "Drawing · symmetry",
            bubbleFr: "Ce champignon géant n'a que la moitié de son chapeau ! Dessine l'autre moitié, comme dans un miroir.",
            bubbleEn: "This giant mushroom only has half of its cap! Draw the other half, like a mirror.",
            consigneFr: "👉 Utilise le tableau de dessin pour compléter le champignon de façon symétrique :",
            consigneEn: "👉 Use the drawing board to complete the mushroom symmetrically:",
            character: "nina",
            exerciseType: "drawing"
          },
          {
            id: 136,
            difficulty: 3,
            num: 36,
            typeFr: "Observation · les 3 différences",
            typeEn: "Observation · 3 differences",
            bubbleFr: "Lana a pris deux photos de la clairière… mais elles ne sont pas pareilles ! Trouve les 3 différences.",
            bubbleEn: "Lana took two pictures of the clearing... but they aren't the same! Find the 3 differences.",
            consigneFr: "👉 Utilise le pinceau pour entourer les 3 différences sur la photo de droite :",
            consigneEn: "👉 Use the brush to circle the 3 differences in the right-side picture:",
            character: "leo",
            exerciseType: "drawing"
          }
        ]
      },
      {
        id: 5,
        titleFr: "Le grand rassemblement",
        titleEn: "The Grand Gathering",
        coverSceneId: "scene-ch5-title",
        storyFr: [
          "Le grand soir est arrivé ! Les champignons magiques éclairent la clairière, les guirlandes flottent dans le vent, et la rivière chante sa plus jolie musique.",
          "Léo monte sur une souche : « Chers amis de la forêt ! Ce soir, nous fêtons notre nouvelle équipe : les 5 Copains de la Forêt ! Grâce à notre nouvel ami — c'est TOI ! — nous avons traversé le bois, réparé le pont et allumé la clairière ! »",
          "Nina chuchote : « Avant le gâteau, il reste quatre dernières missions… les plus belles de toutes ! Tu es prêt ? Tu es prête ? »"
        ],
        storyEn: [
          "The grand evening has arrived! Magic mushrooms light up the clearing, garlands float in the wind, and the river sings its prettiest melody.",
          "Leo climbs onto a stump: 'Dear friends of the forest! Tonight, we celebrate our new team: the 5 Forest Friends! Thanks to our new friend — that's YOU! — we crossed the woods, repaired the bridge, and lit up the clearing!'",
          "Nina whispers: 'Before the cake, there are four final missions... the most beautiful of all! Are you ready?'"
        ],
        storySceneId: "scene-ch5-story",
        badgeNameFr: "Super Copain",
        badgeNameEn: "Super Friend",
        badgeColor: "#d8a020",
        badgeIconId: "#d-trophee",
        badgeDescFr: "Tu as terminé toute l'aventure : 44 missions, 5 chapitres, 6 badges ! Tu sais lire, écrire, compter, observer et surtout… être un ami formidable.",
        badgeDescEn: "You finished the whole adventure: 44 missions, 5 chapters, 6 badges! You can read, write, count, observe, and above all... be a wonderful friend.",
        missions: [
          {
            id: 137,
            difficulty: 1,
            num: 37,
            typeFr: "Lecture · comprendre un texte",
            typeEn: "Reading · text comprehension",
            bubbleFr: "Voici l'invitation que j'ai portée à tous les animaux. Lis-la bien, puis réponds !",
            bubbleEn: "Here is the invitation I brought to all the animals. Read it carefully, then answer!",
            consigneFr: "👉 Réponds aux questions sur l'invitation ci-dessus :",
            consigneEn: "👉 Answer the questions about the invitation above:",
            character: "zaza",
            exerciseType: "order-numbers",
            choices: [
              { id: "137-1", textFr: "Où se passe la fête ? (dans la Grande Clairière)", textEn: "Where is the party? (in the Grand Clearing)", isCorrect: true },
              { id: "137-2", textFr: "Que faut-il apporter ? (un gâteau)", textEn: "What should you bring? (a cake)", isCorrect: true }
            ]
          },
          {
            id: 138,
            difficulty: 2,
            num: 38,
            typeFr: "Écriture · ton invitation",
            typeEn: "Writing · your invitation",
            bubbleFr: "Cette invitation-là est pour TOI ! Écris ton prénom dessus, de ta plus belle écriture.",
            bubbleEn: "This invitation is for YOU! Write your name on it with your best handwriting.",
            consigneFr: "👉 Tape ton prénom dans la case pour personnaliser ton invitation !",
            consigneEn: "👉 Type your name in the box to customize your invitation!",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Ton prénom...",
            inputPlaceholderEn: "Your name...",
            solutionFr: "Magnifique ! Ton invitation est prête.",
            solutionEn: "Beautiful! Your invitation is ready."
          },
          {
            id: 139,
            difficulty: 3,
            num: 39,
            typeFr: "Maths · le gâteau à partager",
            typeEn: "Math · cake sharing",
            bubbleFr: "Le grand gâteau aux noisettes est prêt ! Nous sommes 4 Copains… plus TOI. Combien de parts faut-il couper ?",
            bubbleEn: "The big hazelnut cake is ready! We are 4 Friends... plus YOU. How many slices should we cut?",
            consigneFr: "👉 Calcule le nombre total d'invités (4 copains + 1) :",
            consigneEn: "👉 Calculate the total number of guests (4 friends + 1):",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "139-a", textFr: "4", textEn: "4" },
              { id: "139-b", textFr: "5", textEn: "5", isCorrect: true },
              { id: "139-c", textFr: "6", textEn: "6" }
            ],
            solFr: "Il faut couper 5 parts ! Miam, régale-toi !",
            solEn: "We need to cut 5 slices! Yum, enjoy!"
          },
          {
            id: 140,
            difficulty: 1,
            num: 40,
            typeFr: "Logique · les cadeaux",
            typeEn: "Logic · the gifts",
            bubbleFr: "Chaque Copain a préparé un cadeau. Écoute les indices et relie chaque cadeau à son Copain !",
            bubbleEn: "Each Friend prepared a gift. Listen to the clues and match each gift to its owner!",
            consigneFr: "👉 Relie chaque personnage à son cadeau en fonction des indices :",
            consigneEn: "👉 Match each character to their gift based on the clues:",
            character: "leo",
            exerciseType: "matching",
            matches: [
              { leftFr: "Léo (arbre)", leftEn: "Leo (tree)", rightFr: "La pomme 🍎", rightEn: "The apple 🍎", rightIcon: "d-pomme", correctPairIndex: 0 },
              { leftFr: "Nina (prairie)", leftEn: "Nina (meadow)", rightFr: "La fleur 🌸", rightEn: "The flower 🌸", rightIcon: "d-fleur", correctPairIndex: 1 },
              { leftFr: "Darin (comptage)", leftEn: "Darin (counting)", rightFr: "La noisette 🌰", rightEn: "The hazelnut 🌰", rightIcon: "d-noisette", correctPairIndex: 2 },
              { leftFr: "Lana (ciel)", leftEn: "Lana (sky)", rightFr: "L'étoile ⭐", rightEn: "The star ⭐", rightIcon: "d-etoile", correctPairIndex: 3 }
            ]
          },
          {
            id: 141,
            difficulty: 2,
            num: 41,
            typeFr: "Coloriage magique",
            typeEn: "Color by number",
            bubbleFr: "Colorie le décor de la fête en suivant le code : 1 = rouge · 2 = jaune · 3 = vert.",
            bubbleEn: "Color the party scene following the code: 1 = red · 2 = yellow · 3 = green.",
            consigneFr: "👉 Utilise les couleurs pour peindre le dessin selon les numéros :",
            consigneEn: "👉 Use colors to paint the picture according to the numbers:",
            character: "nina",
            exerciseType: "color-by-number",
            solutionFr: "Bravo ! Le dessin est magnifique avec ces jolies couleurs.",
            solutionEn: "Bravo! The picture is beautiful with those pretty colors."
          },
          {
            id: 142,
            difficulty: 3,
            num: 42,
            typeFr: "Dessin · toi avec les Copains !",
            typeEn: "Drawing · you with Friends!",
            bubbleFr: "La photo souvenir ! Dessine-toi au milieu de nous, avec ton plus beau sourire.",
            bubbleEn: "The souvenir photo! Draw yourself in the middle of us, with your best smile.",
            consigneFr: "👉 Utilise le tableau pour te dessiner aux côtés de tes amis :",
            consigneEn: "👉 Use the board to draw yourself alongside your friends:",
            character: "zaza",
            exerciseType: "drawing"
          },
          {
            id: 143,
            difficulty: 1,
            num: 43,
            typeFr: "Mémoire · quiz de l'histoire",
            typeEn: "Memory · story quiz",
            bubbleFr: "Te souviens-tu de toute notre aventure ? Réponds VRAI ou FAUX !",
            bubbleEn: "Do you remember our whole adventure? Answer TRUE or FALSE!",
            consigneFr: "👉 Résous ce mini-quiz de mémoire :",
            consigneEn: "👉 Solve this mini memory quiz:",
            character: "leo",
            exerciseType: "order-numbers",
            choices: [
              { id: "143-1", textFr: "Nina la souris est très rapide (VRAI)", textEn: "Nina the mouse is super fast (TRUE)", isCorrect: true },
              { id: "143-2", textFr: "Le pont était déjà tout neuf (FAUX)", textEn: "The bridge was already brand new (FALSE)", isCorrect: true },
              { id: "143-3", textFr: "Les champignons s'allument avec des calculs (VRAI)", textEn: "Mushrooms light up with math (TRUE)", isCorrect: true }
            ]
          },
          {
            id: 144,
            difficulty: 2,
            num: 44,
            typeFr: "Écriture · imagine la suite !",
            typeEn: "Writing · imagine the sequel!",
            bubbleFr: "Et après la fête, quelle sera notre prochaine aventure ? Écris une phrase !",
            bubbleEn: "And after the party, what will our next adventure be? Write a sentence!",
            consigneFr: "👉 Imagine la suite : 'Demain, les Copains de la Forêt vont...'",
            consigneEn: "👉 Imagine what's next: 'Tomorrow, the Forest Friends will...'",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Demain, ils vont...",
            inputPlaceholderEn: "Tomorrow, they will..."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    titleFr: "La cabane dans les arbres",
    titleEn: "The Treehouse",
    descriptionFr: "Nouveau ! Aide les Copains à construire une incroyable cabane perchée et prépare la grande fête !",
    descriptionEn: "New! Help the Friends build an incredible perched treehouse and prepare the big party!",
    themeEmojis: ["🏠", "🔨", "🎈"],
    chapters: [
      {
        id: 1,
        titleFr: "Le Grand Projet",
        titleEn: "The Big Project",
        coverSceneId: "scene-ch2-1-title",
        storyFr: [
          "Un beau matin, Léo, Nina, Darina et Lana se réunissent sous le vieux chêne majestueux. « Et si nous construisions une cabane géante dans les branches ? » propose Léo avec enthousiasme.",
          "« Quelle idée géniale ! » s'écrie Nina. « Nous pourrons y jouer, nous y abriter et observer toute la forêt d'en haut ! Mais d'abord, il nous faut un plan et de bons outils. »",
          "Les Copains se mettent au travail. Veux-tu les aider à dessiner les plans et à préparer le chantier ? Allons-y !"
        ],
        storyEn: [
          "One fine morning, Leo, Nina, Darina, and Lana gather beneath the majestic old oak tree. 'What if we built a giant treehouse up in the branches?' Leo proposes enthusiastically.",
          "'What a brilliant idea!' cries Nina. 'We can play there, take shelter, and watch over the entire forest from above! But first, we need a plan and some good tools.'",
          "The Friends set to work. Will you help them draw the plans and prepare the building site? Let's go!"
        ],
        storySceneId: "scene-ch2-1-story",
        badgeNameFr: "Ami des Arbres",
        badgeNameEn: "Friend of the Trees",
        badgeColor: "#69b06c",
        badgeIconId: "#d-feuille",
        badgeDescFr: "Tu as aidé les Copains à dessiner les plans de la cabane et à réunir les premiers outils. Tu es un ami de la nature !",
        badgeDescEn: "You helped the Friends draw the treehouse plans and gather the first tools. You are a true friend of nature!",
        missions: [
          {
            id: 201,
            num: 1,
            typeFr: "Lecture · les lettres",
            typeEn: "Reading · letters",
            bubbleFr: "Pour commencer notre cabane, retrouve la lettre par laquelle commence le mot : CABANE !",
            bubbleEn: "To start our treehouse, find the letter that starts the word: TREEHOUSE!",
            consigneFr: "👉 Clique (ou entoure) la bonne lettre :",
            consigneEn: "👉 Click (or circle) the correct letter:",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "201-a", textFr: "A / H", textEn: "A / H" },
              { id: "201-b", textFr: "C / T", textEn: "C / T", isCorrect: true },
              { id: "201-c", textFr: "B / E", textEn: "B / E" }
            ],
            solutionFr: "C'est le C ! C-A-B-A-N-E.",
            solutionEn: "It is T! T-R-E-E-H-O-U-S-E."
          },
          {
            id: 202,
            num: 2,
            typeFr: "Lecture · chercher les outils",
            typeEn: "Reading · search for tools",
            bubbleFr: "Le vent a caché des outils dans les feuilles ! Trouve toutes les lettres O (comme Outil) !",
            bubbleEn: "The wind hid some tools in the leaves! Find all the letters T (like Tool)!",
            consigneFr: "👉 Sélectionne toutes les lettres O / T :",
            consigneEn: "👉 Select all the letters O / T:",
            character: "nina",
            exerciseType: "grid-find",
            gridItems: [
              { id: "202-1", text: "R", isTarget: false },
              { id: "202-2", text: "O / T", isTarget: true },
              { id: "202-3", text: "S", isTarget: false },
              { id: "202-4", text: "O / T", isTarget: true },
              { id: "202-5", text: "P", isTarget: false },
              { id: "202-6", text: "I", isTarget: false },
              { id: "202-7", text: "O / T", isTarget: true },
              { id: "202-8", text: "M", isTarget: false },
              { id: "202-9", text: "H", isTarget: false },
              { id: "202-10", text: "O / T", isTarget: true },
              { id: "202-11", text: "K", isTarget: false },
              { id: "202-12", text: "V", isTarget: false }
            ],
            solutionFr: "Bien joué, tu as trouvé les 4 lettres O !",
            solutionEn: "Well done, you found the 4 letters T!"
          },
          {
            id: 203,
            num: 3,
            typeFr: "Maths · compter",
            typeEn: "Math · counting",
            bubbleFr: "J'ai ramassé des planches solides pour le plancher. Peux-tu m'aider à les compter ?",
            bubbleEn: "I gathered strong planks for our floor. Can you help me count them?",
            consigneFr: "👉 Combien y a-t-il de planches sur le tas ?",
            consigneEn: "👉 How many planks are in the pile?",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "203-a", textFr: "4 planches", textEn: "4 planks" },
              { id: "203-b", textFr: "6 planches", textEn: "6 planks", isCorrect: true },
              { id: "203-c", textFr: "8 planches", textEn: "8 planks" }
            ],
            solutionFr: "Il y a 6 magnifiques planches de bois !",
            solutionEn: "There are 6 beautiful wooden planks!"
          },
          {
            id: 204,
            num: 4,
            typeFr: "Maths · comparer",
            typeEn: "Math · comparing",
            bubbleFr: "J'ai préparé des clous pour fixer les planches. Quel groupe en contient le plus ?",
            bubbleEn: "I prepared some nails to secure the planks. Which group has the most?",
            consigneFr: "👉 Sélectionne le groupe de clous le plus nombreux :",
            consigneEn: "👉 Select the largest group of nails:",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "204-a", textFr: "Groupe A (5 clous)", textEn: "Group A (5 nails)" },
              { id: "204-b", textFr: "Groupe B (8 clous)", textEn: "Group B (8 nails)", isCorrect: true }
            ],
            solutionFr: "Le groupe B contient 8 clous, c'est le plus grand !",
            solutionEn: "Group B has 8 nails, it is the largest!"
          },
          {
            id: 205,
            num: 5,
            typeFr: "Écriture · tracer",
            typeEn: "Writing · tracing",
            bubbleFr: "Tracons les lettres de notre projet ! Entraîne-toi à écrire la lettre C (pour Cabane) et T (pour Toit).",
            bubbleEn: "Let's trace the letters of our project! Practice writing letter C and T.",
            consigneFr: "👉 Dessine les lettres C et T dans la zone d'écriture :",
            consigneEn: "👉 Draw the letters C and T in the writing space:",
            character: "leo",
            exerciseType: "tracing-letter",
            solutionFr: "Magnifique ! Un joli C comme Cabane et un T comme Toit.",
            solutionEn: "Great! A nice C for Cabin and a T for Treehouse."
          },
          {
            id: 206,
            num: 6,
            typeFr: "Lecture · les outils",
            typeEn: "Reading · the tools",
            bubbleFr: "Chaque outil a un rôle très important. Sauras-tu relier chaque outil à son nom ?",
            bubbleEn: "Each tool has an important job. Can you match each tool to its name?",
            consigneFr: "👉 Relie l'outil à son nom de bâtisseur :",
            consigneEn: "👉 Match the tool with its name:",
            character: "tom",
            exerciseType: "matching",
            matches: [
              { leftFr: "MARTEAU", leftEn: "HAMMER", rightFr: "Marteau 🔨", rightEn: "Hammer 🔨", correctPairIndex: 0 },
              { leftFr: "SCIE", leftEn: "SAW", rightFr: "Scie 🪚", rightEn: "Saw 🪚", correctPairIndex: 1 },
              { leftFr: "VIS", leftEn: "SCREW", rightFr: "Vis 🔩", rightEn: "Screw 🔩", correctPairIndex: 2 }
            ]
          }
        ]
      },
      {
        id: 2,
        titleFr: "Le Bois des Bâtisseurs",
        titleEn: "The Builders' Wood",
        coverSceneId: "scene-ch2-2-title",
        storyFr: [
          "Les Copains s'enfoncent dans le Bois des Bâtisseurs pour récolter de la liane souple et des branches bien droites. Le sol est couvert de feuilles dorées.",
          "« Attention où vous mettez les pieds, » prévient Darina la hérissonne. « Il y a un labyrinthe de ronces magiques à traverser pour atteindre le grand sapin résineux ! »",
          "Avec courage et concentration, les quatre amis et toi avancez pas à pas sur le sentier secret."
        ],
        storyEn: [
          "The Friends venture deep into the Builders' Wood to collect flexible vines and perfectly straight branches. The ground is covered with golden leaves.",
          "'Watch your step,' warns Darina the hedgehog. 'There's a maze of magic brambles to cross to reach the great resinous fir tree!'",
          "With courage and focus, you and the four friends move step by step along the secret path."
        ],
        storySceneId: "scene-ch2-2-story",
        badgeNameFr: "Maitre Bâtisseur",
        badgeNameEn: "Master Builder",
        badgeColor: "#e08a2e",
        badgeIconId: "#c-nina",
        badgeDescFr: "Tu as surmonté les ronces et aidé à compter les matériaux de construction. Tu es un maître de la forêt !",
        badgeDescEn: "You overcame the brambles and helped count the construction materials. You are a true master of the forest!",
        missions: [
          {
            id: 207,
            num: 7,
            typeFr: "Logique · labyrinthe",
            typeEn: "Logic · maze",
            bubbleFr: "Aide-nous à nous faufiler à travers les lianes pour ramasser la corde oubliée !",
            bubbleEn: "Help us weave through the vines to pick up the forgotten rope!",
            consigneFr: "👉 Trace un chemin continu de Nina jusqu'à la corde :",
            consigneEn: "👉 Trace a continuous path from Nina to the rope:",
            character: "nina",
            exerciseType: "drawing",
            mazeLayout: 2
          },
          {
            id: 208,
            num: 8,
            typeFr: "Repérage · la grille",
            typeEn: "Positioning · the grid",
            bubbleFr: "J'ai repéré notre marteau du haut de ma branche ! Peux-tu me dire dans quelle case il se trouve ?",
            bubbleEn: "I spotted our hammer from up on my branch! Can you tell me which box it is in?",
            consigneFr: "👉 Sélectionne la case contenant le marteau 🔨 (regarde la grille) :",
            consigneEn: "👉 Select the box containing the hammer 🔨 (look at the grid):",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "208-a", textFr: "A1", textEn: "A1" },
              { id: "208-b", textFr: "B1", textEn: "B1", isCorrect: true },
              { id: "208-c", textFr: "C2", textEn: "C2" }
            ],
            solFr: "Le marteau se trouve dans la colonne B, sur la ligne 1. Case B1 !",
            solEn: "The hammer is in column B, on line 1. Box B1!"
          },
          {
            id: 209,
            num: 9,
            typeFr: "Maths · addition",
            typeEn: "Math · addition",
            bubbleFr: "J'ai trouvé 3 cordes, et Nina en apporte 4 autres. Combien de cordes avons-nous en tout ?",
            bubbleEn: "I found 3 ropes, and Nina brings 4 more. How many ropes do we have in total?",
            consigneFr: "👉 Calcule : 3 cordes + 4 cordes = ?",
            consigneEn: "👉 Calculate: 3 ropes + 4 ropes = ?",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "209-a", textFr: "6 cordes", textEn: "6 ropes" },
              { id: "209-b", textFr: "7 cordes", textEn: "7 ropes", isCorrect: true },
              { id: "209-c", textFr: "8 cordes", textEn: "8 ropes" }
            ],
            solFr: "3 + 4 = 7 ! Nous avons 7 belles cordes solides.",
            solEn: "3 + 4 = 7! We have 7 fine strong ropes."
          },
          {
            id: 210,
            num: 10,
            typeFr: "Maths · petit problème",
            typeEn: "Math · word problem",
            bubbleFr: "Nous avions 5 seaux de peinture. Léo en apporte 3 nouveaux. Combien de seaux avons-nous ?",
            bubbleEn: "We had 5 paint buckets. Leo brings 3 new ones. How many buckets do we have now?",
            consigneFr: "👉 Dessine les seaux ou écris directement le résultat (5 + 3) :",
            consigneEn: "👉 Draw the buckets or write the result (5 + 3):",
            character: "leo",
            exerciseType: "input-text",
            inputPlaceholderFr: "Nombre de seaux...",
            inputPlaceholderEn: "Number of buckets...",
            solutionFr: "5 + 3 = 8 ! La cabane va être très colorée.",
            solutionEn: "5 + 3 = 8! The treehouse is going to be very colorful."
          },
          {
            id: 211,
            num: 11,
            typeFr: "Logique · suite de formes",
            typeEn: "Logic · shape pattern",
            bubbleFr: "Pour décorer la porte, Nina aligne des feuilles et des fleurs. Quelle forme vient ensuite ?",
            bubbleEn: "To decorate the door, Nina aligns leaves and flowers. What comes next?",
            consigneFr: "👉 Quelle forme continue la suite : Feuille, Fleur, Feuille, Fleur, ... ?",
            consigneEn: "👉 Which shape continues the pattern: Leaf, Flower, Leaf, Flower, ... ?",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "211-a", textFr: "🍃 la feuille", textEn: "🍃 the leaf", isCorrect: true },
              { id: "211-b", textFr: "🌸 la fleur", textEn: "🌸 the flower" }
            ],
            solFr: "C'est au tour de la feuille de continuer le motif décoratif !",
            solEn: "It is the leaf's turn to continue the decorative pattern!"
          },
          {
            id: 212,
            num: 12,
            typeFr: "Maths · suite de nombres",
            typeEn: "Math · number pattern",
            bubbleFr: "Certains arbres portent des numéros secrets. Quel numéro a été effacé par le vent ?",
            bubbleEn: "Some trees carry secret numbers. Which number was blown away by the wind?",
            consigneFr: "👉 Complète la suite de nombres : 2 · 4 · 6 · ? · 10",
            consigneEn: "👉 Complete the number sequence: 2 · 4 · 6 · ? · 10",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "212-a", textFr: "7", textEn: "7" },
              { id: "212-b", textFr: "8", textEn: "8", isCorrect: true },
              { id: "212-c", textFr: "9", textEn: "9" }
            ],
            solFr: "C'est le 8 ! On compte de deux en deux.",
            solEn: "It's 8! We count by twos."
          },
          {
            id: 213,
            num: 13,
            typeFr: "Maths · relier les points",
            typeEn: "Math · connect the dots",
            bubbleFr: "J'ai caché un outil précieux sous les feuilles de hêtre. Relie les points de 1 à 10 pour le découvrir !",
            bubbleEn: "I hid a precious tool under the beech leaves. Connect the dots from 1 to 10 to reveal it!",
            consigneFr: "👉 Relie les points dans l'ordre croissant pour révéler la scie secrète :",
            consigneEn: "👉 Connect the dots in increasing order to reveal the secret saw:",
            character: "zaza",
            exerciseType: "drawing"
          },
          {
            id: 214,
            num: 14,
            typeFr: "Maths · comparer les nombres",
            typeEn: "Math · comparing numbers",
            bubbleFr: "Pour porter les branches, nous devons choisir les fagots les plus légers. Quel nombre est le plus petit ?",
            bubbleEn: "To carry the branches, we must choose the lightest bundles. Which number is smaller?",
            consigneFr: "👉 Sélectionne la bonne comparaison de poids :",
            consigneEn: "👉 Select the correct weight comparison:",
            character: "tom",
            exerciseType: "order-numbers",
            choices: [
              { id: "214-1", textFr: "Le plus petit entre 8 et 5 (5)", textEn: "The smaller between 8 and 5 (5)", isCorrect: true },
              { id: "214-2", textFr: "Le plus petit entre 10 et 6 (6)", textEn: "The smaller between 10 and 6 (6)", isCorrect: true },
              { id: "214-3", textFr: "Le plus petit entre 7 et 9 (7)", textEn: "The smaller between 7 and 9 (7)", isCorrect: true }
            ]
          },
          {
            id: 215,
            num: 15,
            typeFr: "Observation · l'intrus",
            typeEn: "Observation · the odd one out",
            bubbleFr: "Regarde bien notre matériel pour la cabane. Quel objet n'a rien à faire ici ?",
            bubbleEn: "Look closely at our materials for the den. Which object does not belong here?",
            consigneFr: "👉 Trouve l'intrus parmi les objets de construction :",
            consigneEn: "👉 Find the odd one out among the construction objects:",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "215-a", textFr: "La planche de bois", textEn: "The wooden plank" },
              { id: "215-b", textFr: "Le marteau", textEn: "The hammer" },
              { id: "215-c", textFr: "Le gâteau aux fraises", textEn: "The strawberry cake", isCorrect: true },
              { id: "215-d", textFr: "La corde solide", textEn: "The strong rope" }
            ],
            solFr: "Le gâteau ! C'est délicieux, mais ce n'est pas un outil de construction !",
            solEn: "The cake! It is delicious, but it's not a building tool!"
          },
          {
            id: 216,
            num: 16,
            typeFr: "Observation · cherche et trouve",
            typeEn: "Observation · search and find",
            bubbleFr: "Trois petites coccinelles se sont cachées sur notre chantier. Aide-nous à les retrouver !",
            bubbleEn: "Three little ladybugs are hiding on our building site. Help us find them!",
            consigneFr: "👉 Utilise le tableau de dessin pour entourer les 3 coccinelles cachées :",
            consigneEn: "👉 Use the drawing board to circle the 3 hidden ladybugs:",
            character: "zaza",
            exerciseType: "drawing"
          }
        ]
      },
      {
        id: 3,
        titleFr: "Le Message Secret",
        titleEn: "The Secret Message",
        coverSceneId: "scene-ch2-3-title",
        storyFr: [
          "Lana s'envole très haut pour inspecter la solidité du vieux chêne. Coincé entre deux branches, elle aperçoit un mystérieux rouleau d'écorce !",
          "C'est un message secret écrit par les anciens habitants de la forêt. Pour pouvoir construire la cabane en toute sécurité, les Copains doivent décrypter les mots sacrés.",
          "Prends ton courage à deux mains et aide Nina à lire et écrire les formules magiques !"
        ],
        storyEn: [
          "Lana flies very high to inspect the strength of the old oak tree. Wedged between two branches, she spots a mysterious scroll of bark!",
          "It's a secret message written by the ancient inhabitants of the forest. To build the treehouse safely, the Friends must decode the sacred words.",
          "Take your courage in both hands and help Nina read and write the magic formulas!"
        ],
        storySceneId: "scene-ch2-3-story",
        badgeNameFr: "Grand Décodeur",
        badgeNameEn: "Grand Decoder",
        badgeColor: "#3f9bd8",
        badgeIconId: "#d-champi",
        badgeDescFr: "Tu as déchiffré l'écriture mystérieuse et écrit le mot magique. Le secret de la cabane est entre tes mains !",
        badgeDescEn: "You decoded the mysterious writing and wrote the magic word. The treehouse's secret is in your hands!",
        missions: [
          {
            id: 217,
            num: 17,
            typeFr: "Lecture · les syllabes",
            typeEn: "Reading · syllables",
            bubbleFr: "Les mots du secret sont coupés en morceaux. Relie-les pour retrouver les noms des outils !",
            bubbleEn: "The words of the secret are cut into pieces. Connect them to find the names of the tools!",
            consigneFr: "👉 Associe chaque début de mot à sa fin :",
            consigneEn: "👉 Match each start of a word to its end:",
            character: "zaza",
            exerciseType: "matching",
            matches: [
              { leftFr: "CA", leftEn: "TREE", rightFr: "BANE", rightEn: "HOUSE", correctPairIndex: 0 },
              { leftFr: "MAR", leftEn: "HAM", rightFr: "TEAU", rightEn: "MER", correctPairIndex: 1 },
              { leftFr: "PLA", leftEn: "PLA", rightFr: "NCHE", rightEn: "NK", correctPairIndex: 2 }
            ]
          },
          {
            id: 218,
            num: 18,
            typeFr: "Lecture · lettre manquante",
            typeEn: "Reading · missing letter",
            bubbleFr: "Le vent a emporté quelques lettres du parchemin ! Retrouve les voyelles manquantes pour CABANE et PLANCHE.",
            bubbleEn: "The wind blew away some letters from the scroll! Find the missing vowels for CABIN and PLANK.",
            consigneFr: "👉 Quelle lettre complète correctement ces mots ?",
            consigneEn: "👉 Which letter correctly completes these words?",
            character: "nina",
            exerciseType: "order-numbers",
            choices: [
              { id: "218-1", textFr: "C _ B A N E (la lettre A est manquante)", textEn: "C _ B I N (the letter A is missing)", isCorrect: true },
              { id: "218-2", textFr: "P L A N C H _ (la lettre E est manquante)", textEn: "P L _ N K (the letter A is missing)", isCorrect: true }
            ]
          },
          {
            id: 219,
            num: 19,
            typeFr: "Lecture · vrai ou faux",
            typeEn: "Reading · true or false",
            bubbleFr: "Lis bien cette affirmation sur notre projet et dis si elle est vraie !",
            bubbleEn: "Read this statement about our project carefully and say if it is true!",
            consigneFr: "👉 « La cabane sera construite dans un vieux chêne. » Vrai ou Faux ?",
            consigneEn: "👉 'The treehouse will be built in an old oak tree.' True or False?",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "219-a", textFr: "✔ VRAI", textEn: "✔ TRUE", isCorrect: true },
              { id: "219-b", textFr: "✘ FAUX", textEn: "✘ FALSE" }
            ],
            solFr: "C'est vrai ! C'est le plus grand et le plus fort de la forêt.",
            solEn: "That's true! It's the biggest and strongest tree in the forest."
          },
          {
            id: 220,
            num: 20,
            typeFr: "Lecture · mots et images",
            typeEn: "Reading · words and pictures",
            bubbleFr: "Relie chaque mot trouvé dans le message à son image pour valider le parchemin !",
            bubbleEn: "Match each word found in the message to its picture to validate the scroll!",
            consigneFr: "👉 Associe les mots du chantier à leur image :",
            consigneEn: "👉 Match the building words with their pictures:",
            character: "zaza",
            exerciseType: "matching",
            matches: [
              { leftFr: "VIS", leftEn: "SCREW", rightFr: "Vis 🔩", rightEn: "Screw 🔩", rightIcon: "d-noisette", correctPairIndex: 0 },
              { leftFr: "CLOU", leftEn: "NAIL", rightFr: "Clou 📍", rightEn: "Nail 📍", rightIcon: "d-fleur", correctPairIndex: 1 },
              { leftFr: "CORDE", leftEn: "ROPE", rightFr: "Corde ➰", rightEn: "Rope ➰", rightIcon: "d-champi", correctPairIndex: 2 }
            ]
          },
          {
            id: 221,
            num: 21,
            typeFr: "Lecture · phrase en désordre",
            typeEn: "Reading · scrambled sentence",
            bubbleFr: "Les mots de la formule se sont envolés ! Remets-les dans le bon ordre.",
            bubbleEn: "The words of the formula flew away! Put them back in the correct order.",
            consigneFr: "👉 Remets la phrase dans l'ordre : 'cabane' (A), 'La' (B), 'grandit' (C)",
            consigneEn: "👉 Order the sentence: 'treehouse' (A), 'The' (B), 'grows' (C)",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "221-a", textFr: "cabane La grandit (A-B-C)", textEn: "treehouse The grows" },
              { id: "221-b", textFr: "La cabane grandit (B-A-C)", textEn: "The treehouse grows (B-A-C)", isCorrect: true },
              { id: "221-c", textFr: "grandit La cabane (C-B-A)", textEn: "grows The treehouse" }
            ],
            solFr: "La cabane grandit ! Une jolie formule d'encouragement.",
            solEn: "The treehouse grows! A lovely encouraging formula."
          },
          {
            id: 222,
            num: 22,
            typeFr: "Lecture · retrouver un mot",
            typeEn: "Reading · find a word",
            bubbleFr: "Le mot clé du parchemin est CHÊNE. Retrouve-le parmi les mots brouillés !",
            bubbleEn: "The key word on the scroll is OAK. Find it among the scrambled words!",
            consigneFr: "👉 Sélectionne le mot CHÊNE / OAK :",
            consigneEn: "👉 Select the word CHÊNE / OAK:",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "222-a", textFr: "CHIEN", textEn: "OWL" },
              { id: "222-b", textFr: "CHÊNE", textEn: "OAK", isCorrect: true },
              { id: "222-c", textFr: "CHAÎNE", textEn: "BARK" }
            ],
            solFr: "Bravo ! C'était bien le mot CHÊNE.",
            solEn: "Bravo! It was indeed the word OAK."
          },
          {
            id: 223,
            num: 23,
            typeFr: "Écriture · écrire un mot",
            typeEn: "Writing · write a word",
            bubbleFr: "Écris le mot magique CABANE pour valider définitivement les plans !",
            bubbleEn: "Write the magic word CABIN to finally validate the plans!",
            consigneFr: "👉 Trace le mot CABANE / CABIN dans la zone d'écriture :",
            consigneEn: "👉 Trace the word CABANE / CABIN in the writing zone:",
            character: "tom",
            exerciseType: "tracing-letter",
            solutionFr: "Magnifique écriture ! Les plans sont validés.",
            solutionEn: "Wonderful writing! The plans are now validated."
          },
          {
            id: 224,
            num: 24,
            typeFr: "Écriture · compléter une phrase",
            typeEn: "Writing · complete sentence",
            bubbleFr: "Complète la phrase du secret avec le bon mot. Choisis parmi les trois idées de Lana.",
            bubbleEn: "Complete the secret sentence with the correct word. Choose from Lana's three ideas.",
            consigneFr: "👉 « Le nid est dans le ... » Choisis le mot correct :",
            consigneEn: "👉 'The nest is in the ... ' Choose the correct word:",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "224-a", textFr: "lac", textEn: "lake" },
              { id: "224-b", textFr: "chêne", textEn: "oak", isCorrect: true },
              { id: "224-c", textFr: "chemin", textEn: "path" }
            ],
            solFr: "C'est bien 'chêne' ! Le nid de Lana est installé tout là-haut.",
            solEn: "It is indeed 'oak'! Lana's nest is built up there."
          },
          {
            id: 225,
            num: 25,
            typeFr: "Écriture · recopier une phrase",
            typeEn: "Writing · copy a sentence",
            bubbleFr: "Presque fini ! Recopie cette phrase d'encouragement de ta plus belle écriture.",
            bubbleEn: "Almost done! Copy this encouraging sentence with your finest handwriting.",
            consigneFr: "👉 Recopie 'Le projet avance !' / 'We are building!' :",
            consigneEn: "👉 Copy 'Le projet avance !' / 'We are building!':",
            character: "zaza",
            exerciseType: "tracing-letter"
          },
          {
            id: 226,
            num: 26,
            typeFr: "Créativité · mot de passe",
            typeEn: "Creativity · password",
            bubbleFr: "Chaque cabane secrète a besoin d'un mot de passe secret ! Invente le tien et écris-le ici.",
            bubbleEn: "Every secret treehouse needs a secret password! Invent yours and write it here.",
            consigneFr: "👉 Écris ton mot de passe magique :",
            consigneEn: "👉 Write down your magic password:",
            character: "leo",
            exerciseType: "input-text",
            inputPlaceholderFr: "Mon mot de passe...",
            inputPlaceholderEn: "My password..."
          }
        ]
      },
      {
        id: 4,
        titleFr: "L'échelle de corde",
        titleEn: "The Rope Ladder",
        coverSceneId: "scene-ch2-4-title",
        storyFr: [
          "La cabane prend forme tout là-haut ! Mais pour y monter facilement, les Copains doivent fabriquer une échelle de corde solide et bien équilibrée.",
          "« C'est un travail de précision, » explique Darina. « Il faut espacer les barreaux et faire des nœuds solides. Si on se trompe, l'échelle sera trop courte ! »",
          "À l'aide de tes talents de calculateur, mesure et prépare les barreaux avec tes amis."
        ],
        storyEn: [
          "The treehouse is taking shape way up high! But to climb up easily, the Friends must build a strong, well-balanced rope ladder.",
          "'It's a precision job,' explains Darina. 'We need to space out the rungs and tie strong knots. If we make a mistake, the ladder will be too short!'",
          "Using your calculating skills, measure and prepare the rungs with your friends."
        ],
        storySceneId: "scene-ch2-4-story",
        badgeNameFr: "Petit Génie de l'Artisanat",
        badgeNameEn: "Little Craft Genius",
        badgeColor: "#b0578f",
        badgeIconId: "#d-etoile",
        badgeDescFr: "Grâce à tes calculs, l'échelle de corde est solide et tous les Copains peuvent grimper à la cabane. Quel génie !",
        badgeDescEn: "Thanks to your calculations, the rope ladder is strong and all the Friends can climb to the treehouse. Brilliant!",
        missions: [
          {
            id: 227,
            num: 27,
            typeFr: "Maths · soustraction",
            typeEn: "Math · subtraction",
            bubbleFr: "Nous avions découpé 9 barreaux de bois, mais 3 sont fendus et inutilisables. Combien nous en reste-t-il ?",
            bubbleEn: "We cut 9 wooden rungs, but 3 are cracked and useless. How many do we have left?",
            consigneFr: "👉 Calcule la soustraction : 9 - 3 = ?",
            consigneEn: "👉 Calculate the subtraction: 9 - 3 = ?",
            character: "leo",
            exerciseType: "qcm",
            choices: [
              { id: "227-a", textFr: "5 barreaux", textEn: "5 rungs" },
              { id: "227-b", textFr: "6 barreaux", textEn: "6 rungs", isCorrect: true },
              { id: "227-c", textFr: "7 barreaux", textEn: "7 rungs" }
            ],
            solFr: "9 - 3 = 6 ! Il reste 6 barreaux parfaits pour notre échelle.",
            solEn: "9 - 3 = 6! There are 6 perfect rungs left for our ladder."
          },
          {
            id: 228,
            num: 28,
            typeFr: "Maths · petit problème",
            typeEn: "Math · word problem",
            bubbleFr: "J'ai fait 10 nœuds d'arrêt sur ma corde. Darina en a fait 4 de moins. Combien de nœuds Darina a-t-elle faits ?",
            bubbleEn: "I made 10 stopper knots on my rope. Darina made 4 fewer. How many knots did Darina make?",
            consigneFr: "👉 Écris ou dessine le résultat de la soustraction (10 - 4) :",
            consigneEn: "👉 Draw or write the result of the subtraction (10 - 4):",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Nombre de nœuds...",
            inputPlaceholderEn: "Number of knots...",
            solutionFr: "10 - 4 = 6 ! Darina a fait 6 nœuds solides.",
            solutionEn: "10 - 4 = 6! Darina made 6 secure knots."
          },
          {
            id: 229,
            num: 29,
            typeFr: "Maths · additions à trous",
            typeEn: "Math · missing additions",
            bubbleFr: "Pour équilibrer l'échelle, trouve le nombre secret caché sous chaque barreau.",
            bubbleEn: "To balance the ladder, find the secret number hidden under each rung.",
            consigneFr: "👉 Trouve le nombre manquant dans chaque calcul :",
            consigneEn: "👉 Find the missing number in each calculation:",
            character: "tom",
            exerciseType: "order-numbers",
            choices: [
              { id: "229-1", textFr: "5 + _ = 10 (le nombre caché est 5)", textEn: "5 + _ = 10 (missing number is 5)", isCorrect: true },
              { id: "229-2", textFr: "3 + _ = 7 (le nombre caché est 4)", textEn: "3 + _ = 7 (missing number is 4)", isCorrect: true },
              { id: "229-3", textFr: "_ + 2 = 6 (le nombre caché est 4)", textEn: "_ + 2 = 6 (missing number is 4)", isCorrect: true }
            ]
          },
          {
            id: 230,
            num: 30,
            typeFr: "Maths · reconnaître les formes",
            typeEn: "Math · recognize shapes",
            bubbleFr: "Regarde bien l'échelle. De quelle forme géométrique ressemblent les barreaux de bois ?",
            bubbleEn: "Look closely at the ladder. Which geometric shape do the wooden rungs look like?",
            consigneFr: "👉 De quelle forme sont les barreaux de notre échelle ?",
            consigneEn: "👉 What shape are the rungs of our ladder?",
            character: "zaza",
            exerciseType: "qcm",
            choices: [
              { id: "230-a", textFr: "Des ronds ⚪", textEn: "Circles ⚪" },
              { id: "230-b", textFr: "Des rectangles 🟧", textEn: "Rectangles 🟧", isCorrect: true },
              { id: "230-c", textFr: "Des triangles 🔺", textEn: "Triangles 🔺" }
            ],
            solFr: "Des rectangles ! Ils sont plats pour pouvoir bien poser ses pieds.",
            solEn: "Rectangles! They are flat so you can place your feet easily."
          },
          {
            id: 231,
            num: 31,
            typeFr: "Logique · suite de nombres",
            typeEn: "Logic · number pattern",
            bubbleFr: "Pour monter en grimpant, on compte de 5 en 5. Quel est le nombre suivant ?",
            bubbleEn: "To climb up, we count by fives. What is the next number?",
            consigneFr: "👉 Complète la suite logique de la grimpette : 5 · 10 · 15 · ?",
            consigneEn: "👉 Complete the climbing number pattern: 5 · 10 · 15 · ?",
            character: "nina",
            exerciseType: "qcm",
            choices: [
              { id: "231-a", textFr: "18", textEn: "18" },
              { id: "231-b", textFr: "20", textEn: "20", isCorrect: true },
              { id: "231-c", textFr: "25", textEn: "25" }
            ],
            solFr: "C'est le 20 ! 5, 10, 15, 20.",
            solEn: "It's 20! 5, 10, 15, 20."
          },
          {
            id: 232,
            num: 32,
            typeFr: "Maths · ranger les nombres",
            typeEn: "Math · sorting numbers",
            bubbleFr: "Nous trions les cordes de la plus courte à la plus longue. Range ces longueurs !",
            bubbleEn: "We are sorting the ropes from shortest to longest. Sort these lengths!",
            consigneFr: "👉 Range les nombres 4, 8 et 2 par ordre croissant (du plus petit au plus grand) :",
            consigneEn: "👉 Sort the numbers 4, 8, and 2 in increasing order:",
            character: "tom",
            exerciseType: "input-text",
            inputPlaceholderFr: "Exemple: 2 < 4 < 8...",
            inputPlaceholderEn: "Example: 2 < 4 < 8...",
            solutionFr: "L'ordre correct est : 2 < 4 < 8 !",
            solutionEn: "The correct order is: 2 < 4 < 8!"
          },
          {
            id: 233,
            num: 33,
            typeFr: "Maths · calcul et coloriage",
            typeEn: "Math · calculate and color",
            bubbleFr: "Seuls les barreaux dont le calcul fait 6 sont assez solides. Aide-nous à les trouver !",
            bubbleEn: "Only the rungs whose sum is 6 are strong enough. Help us find them!",
            consigneFr: "👉 Sélectionne tous les calculs qui font exactement 6 :",
            consigneEn: "👉 Select all the calculations that equal exactly 6:",
            character: "leo",
            exerciseType: "grid-find",
            gridItems: [
              { id: "233-1", text: "3 + 3", isTarget: true },
              { id: "233-2", text: "4 + 2", isTarget: true },
              { id: "233-3", text: "5 + 0", isTarget: false },
              { id: "233-4", text: "2 + 4", isTarget: true },
              { id: "233-5", text: "3 + 1", isTarget: false }
            ],
            solutionFr: "Les calculs corrects sont 3+3, 4+2, et 2+4 !",
            solutionEn: "The correct equations are 3+3, 4+2, and 2+4!"
          },
          {
            id: 234,
            num: 34,
            typeFr: "Maths · plus grand, plus petit",
            typeEn: "Math · larger, smaller",
            bubbleFr: "Pour le sommet de l'échelle, nous comparons des hauteurs. Choisis la bonne réponse !",
            bubbleEn: "For the top of the ladder, we compare heights. Choose the correct answer!",
            consigneFr: "👉 Résous ces trois comparaisons de hauteur :",
            consigneEn: "👉 Solve these three height comparisons:",
            character: "zaza",
            exerciseType: "order-numbers",
            choices: [
              { id: "234-1", textFr: "Le plus grand entre 12m et 8m (12m)", textEn: "The highest between 12m and 8m (12m)", isCorrect: true },
              { id: "234-2", textFr: "Le plus petit entre 4m et 7m (4m)", textEn: "The shortest between 4m and 7m (4m)", isCorrect: true },
              { id: "234-3", textFr: "Égal à 3m + 3m (6m)", textEn: "Equal to 3m + 3m (6m)", isCorrect: true }
            ]
          },
          {
            id: 235,
            num: 35,
            typeFr: "Dessin · symétrie",
            typeEn: "Drawing · symmetry",
            bubbleFr: "La porte d'entrée de notre cabane n'est dessinée qu'à moitié ! Termine-la par symétrie.",
            bubbleEn: "Only half of our treehouse front door is drawn! Complete it with symmetry.",
            consigneFr: "👉 Dessine l'autre moitié de la porte par symétrie :",
            consigneEn: "👉 Draw the other half of the door symmetrically:",
            character: "nina",
            exerciseType: "drawing"
          },
          {
            id: 236,
            num: 36,
            typeFr: "Observation · les 3 différences",
            typeEn: "Observation · 3 differences",
            bubbleFr: "Notre cabane est enfin terminée ! Lana a pris deux photos, mais il y a 3 petites différences. Trouve-les !",
            bubbleEn: "Our treehouse is finally finished! Lana took two photos, but there are 3 small differences. Find them!",
            consigneFr: "👉 Repère et entoure les 3 différences sur le dessin de droite :",
            consigneEn: "👉 Spot and circle the 3 differences on the right-side drawing:",
            character: "leo",
            exerciseType: "drawing"
          }
        ]
      },
      {
        id: 5,
        titleFr: "La crémaillère",
        titleEn: "The Housewarming Party",
        coverSceneId: "scene-ch2-5-title",
        storyFr: [
          "Le grand soir de l'inauguration est enfin arrivé ! La cabane perchée brille sous la lune, décorée de guirlandes de feuilles et de lanternes lumineuses.",
          "Léo s'exclame joyeusement : « Bienvenue à tous pour l'inauguration de notre incroyable cabane dans les arbres ! Sans l'aide précieuse de notre 5ᵉ Copain, nous n'aurions jamais pu y arriver ! »",
          "Mais avant de souffler les bougies et de danser, Nina nous propose quatre ultimes missions pour célébrer notre amitié."
        ],
        storyEn: [
          "The grand opening night has finally arrived! The perched treehouse shines under the moon, decorated with leaf garlands and glowing lanterns.",
          "Leo exclaims joyfully: 'Welcome everyone to the grand opening of our incredible treehouse! Without the precious help of our 5th Friend, we would never have made it!'",
          "But before blowing out the candles and dancing, Nina proposes four final missions to celebrate our friendship."
        ],
        storySceneId: "scene-ch2-5-story",
        badgeNameFr: "Super Bâtisseur",
        badgeNameEn: "Super Builder",
        badgeColor: "#d8a020",
        badgeIconId: "#d-trophee",
        badgeDescFr: "Félicitations ! Tu as accompli les 44 missions du cahier et tu as aidé à construire la plus belle cabane de la forêt !",
        badgeDescEn: "Congratulations! You have completed all 44 missions in the book and helped build the most beautiful treehouse in the forest!",
        missions: [
          {
            id: 237,
            num: 37,
            typeFr: "Lecture · comprendre l'invitation",
            typeEn: "Reading · understand invitation",
            bubbleFr: "Voici l'invitation que nous avons envoyée. Lis-la attentivement puis réponds aux questions.",
            bubbleEn: "Here is the invitation we sent out. Read it carefully and answer the questions.",
            consigneFr: "👉 Réponds aux questions sur la fête de la cabane :",
            consigneEn: "👉 Answer the questions about the treehouse party:",
            character: "zaza",
            exerciseType: "order-numbers",
            choices: [
              { id: "237-1", textFr: "Où a lieu la fête ? (Dans le vieux chêne géant)", textEn: "Where is the party? (In the giant old oak tree)", isCorrect: true },
              { id: "237-2", textFr: "À quelle heure commence-t-elle ? (À midi)", textEn: "What time does it start? (At noon)", isCorrect: true }
            ]
          },
          {
            id: 238,
            num: 38,
            typeFr: "Écriture · ton invitation personnalisée",
            typeEn: "Writing · customized invitation",
            bubbleFr: "Cette invitation spéciale est pour toi, l'invité d'honneur de notre bande !",
            bubbleEn: "This special invitation is for you, the guest of honor of our gang!",
            consigneFr: "👉 Tape ton prénom ci-dessous pour l'inscrire sur ton invitation :",
            consigneEn: "👉 Type your name below to write it on your invitation:",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Ton prénom...",
            inputPlaceholderEn: "Your name...",
            solutionFr: "Génial ! Ton nom brille sur l'invitation de la cabane.",
            solutionEn: "Awesome! Your name shines on the treehouse invitation."
          },
          {
            id: 239,
            num: 39,
            typeFr: "Maths · partager le gâteau",
            typeEn: "Math · cake sharing",
            bubbleFr: "Le gâteau aux fraises des bois est prêt ! Nous sommes 4 Copains de la forêt plus TOI. Combien de parts devons-nous couper ?",
            bubbleEn: "The wild strawberry cake is ready! We are 4 Forest Friends plus YOU. How many slices should we cut?",
            consigneFr: "👉 Trouve le nombre de parts à découper :",
            consigneEn: "👉 Find the number of slices to cut:",
            character: "tom",
            exerciseType: "qcm",
            choices: [
              { id: "239-a", textFr: "4 parts", textEn: "4 slices" },
              { id: "239-b", textFr: "5 parts", textEn: "5 slices", isCorrect: true },
              { id: "239-c", textFr: "6 parts", textEn: "6 slices" }
            ],
            solFr: "Il faut couper 5 parts ! Une pour chacun des copains de l'aventure.",
            solEn: "We need to cut 5 slices! One for each friend in the adventure."
          },
          {
            id: 240,
            num: 40,
            typeFr: "Logique · les cadeaux de la cabane",
            typeEn: "Logic · treehouse gifts",
            bubbleFr: "Pour notre nouvelle cabane, chacun a apporté un superbe cadeau. Associe chaque copain à son présent !",
            bubbleEn: "For our new treehouse, everyone has brought a superb gift. Match each friend to their present!",
            consigneFr: "👉 Relie chaque ami au cadeau qu'il a fabriqué :",
            consigneEn: "👉 Connect each friend to the gift they made:",
            character: "leo",
            exerciseType: "matching",
            matches: [
              { leftFr: "Léo (renard)", leftEn: "Leo (fox)", rightFr: "La pomme mûre 🍎", rightEn: "The ripe apple 🍎", rightIcon: "d-pomme", correctPairIndex: 0 },
              { leftFr: "Nina (souris)", leftEn: "Nina (mouse)", rightFr: "Le fromage des prés 🧀", rightEn: "The meadow cheese 🧀", rightIcon: "d-fleur", correctPairIndex: 1 },
              { leftFr: "Darina (hérissonne)", leftEn: "Darina (hedgehog)", rightFr: "Le panier de noisettes 🌰", rightEn: "The hazelnut basket 🌰", rightIcon: "d-noisette", correctPairIndex: 2 },
              { leftFr: "Lana (oiseau)", leftEn: "Lana (bird)", rightFr: "L'étoile dorée ⭐", rightEn: "The golden star ⭐", rightIcon: "d-etoile", correctPairIndex: 3 }
            ]
          },
          {
            id: 241,
            num: 41,
            typeFr: "Coloriage magique",
            typeEn: "Color by number",
            bubbleFr: "Pour illuminer la fête, colorie la lanterne suspendue : 1 = rouge · 2 = jaune · 3 = vert.",
            bubbleEn: "To illuminate the party, color the hanging lantern: 1 = red · 2 = yellow · 3 = green.",
            consigneFr: "👉 Peins la lanterne en respectant les numéros :",
            consigneEn: "👉 Paint the lantern following the numbers:",
            character: "nina",
            exerciseType: "color-by-number",
            solutionFr: "Magnifique ! La lanterne brille de mille feux dans l'arbre.",
            solutionEn: "Beautiful! The lantern shines brightly in the tree."
          },
          {
            id: 242,
            num: 42,
            typeFr: "Dessin · la photo dans la cabane",
            typeEn: "Drawing · photo in the treehouse",
            bubbleFr: "Clic-clac, voilà la photo souvenir ! Dessine-toi à l'intérieur de notre belle cabane perchée.",
            bubbleEn: "Click-clack, here's the souvenir photo! Draw yourself inside our beautiful perched treehouse.",
            consigneFr: "👉 Dessine-toi jouant dans la cabane avec tes amis :",
            consigneEn: "👉 Draw yourself playing in the treehouse with your friends:",
            character: "zaza",
            exerciseType: "drawing"
          },
          {
            id: 243,
            num: 43,
            typeFr: "Mémoire · le grand quiz",
            typeEn: "Memory · the big quiz",
            bubbleFr: "Te souviens-tu de tous les secrets de notre construction ? Réponds par Vrai ou Faux !",
            bubbleEn: "Do you remember all the secrets of our build? Answer True or False!",
            consigneFr: "👉 Résous ce quiz final de l'aventure :",
            consigneEn: "👉 Solve this final adventure quiz:",
            character: "leo",
            exerciseType: "order-numbers",
            choices: [
              { id: "243-1", textFr: "La cabane est construite au sol (FAUX)", textEn: "The treehouse is built on the ground (FALSE)", isCorrect: true },
              { id: "243-2", textFr: "Léo a dessiné les plans de la cabane (VRAI)", textEn: "Leo drew the treehouse plans (TRUE)", isCorrect: true },
              { id: "243-3", textFr: "Les Copains sont très heureux (VRAI)", textEn: "The Friends are very happy (TRUE)", isCorrect: true }
            ]
          },
          {
            id: 244,
            num: 44,
            typeFr: "Écriture · imagine la suite !",
            typeEn: "Writing · imagine what's next!",
            bubbleFr: "Notre cabane est prête. Quelle sera notre prochaine idée de jeu ? Écris-la !",
            bubbleEn: "Our treehouse is ready. What will our next play idea be? Write it down!",
            consigneFr: "👉 Imagine la suite : 'Dans notre cabane, nous allons...'",
            consigneEn: "👉 Imagine what's next: 'In our treehouse, we will...'",
            character: "nina",
            exerciseType: "input-text",
            inputPlaceholderFr: "Dans notre cabane, nous allons...",
            inputPlaceholderEn: "In our treehouse, we will..."
          }
        ]
      }
    ]
  }
];

// Helper to customize programmatically generated Books 3, 4, 5, and 6 with unique, themed exercises!
const customizeBookMissions = (book: BookData, bookId: number): BookData => {
  let idOffset = 0;
  let letterTarget = "A";
  let letterReplacement = "A";
  let replacementsFr: { [key: string]: string } = {};
  let replacementsEn: { [key: string]: string } = {};

  if (bookId === 3) {
    idOffset = 200; // 101-144 becomes 301-344
    letterTarget = "A";
    letterReplacement = "T"; // T for Trésor
    replacementsFr = {
      "pont": "chemin du trésor",
      "ponts": "chemins du trésor",
      "rivière": "ruisseau magique",
      "cabane": "grotte secrète",
      "pomme": "pièce d'or",
      "pommes": "pièces d'or",
      "champignon": "cristal précieux",
      "champignons": "cristaux précieux",
      "fleur": "émeraude",
      "fleurs": "émeraudes",
      "noisette": "rubis",
      "noisettes": "rubis",
      "cadeau": "trésor",
      "cadeaux": "trésors",
      "Léo": "Léo l'explorateur",
      "Nina": "Nina l'aventurière",
      "Darina": "Darina la vigie",
      "Lana": "Lana l'astronome",
      "lettre L": "lettre T",
      "lettre A": "lettre T",
    };
    replacementsEn = {
      "bridge": "treasure path",
      "bridges": "treasure paths",
      "river": "magic creek",
      "treehouse": "secret cave",
      "apple": "gold coin",
      "apples": "gold coins",
      "mushroom": "precious crystal",
      "mushrooms": "precious crystals",
      "flower": "emerald",
      "flowers": "emeralds",
      "hazelnut": "ruby",
      "hazelnuts": "rubies",
      "gift": "treasure",
      "gifts": "treasures",
    };
  } else if (bookId === 4) {
    idOffset = 200; // 201-244 becomes 401-444
    letterTarget = "N";
    letterReplacement = "E"; // E for Étoile
    replacementsFr = {
      "cabane": "étoile filante",
      "cabanes": "étoiles filantes",
      "plan": "carte céleste",
      "plans": "cartes célestes",
      "marteau": "télescope",
      "marteaux": "télescopes",
      "bois": "ciel nocturne",
      "rivière": "voie lactée",
      "pont": "pont d'étoiles",
      "pomme": "météorite",
      "pommes": "météorites",
      "champignon": "luciole brillante",
      "champignons": "lucioles brillantes",
      "fleur": "constellation",
      "fleurs": "constellations",
      "noisette": "comète",
      "noisettes": "comètes",
      "cadeau": "étoile",
      "cadeaux": "étoiles",
      "lettre L": "lettre E",
      "lettre N": "lettre E",
      "lettre A": "lettre E",
    };
    replacementsEn = {
      "treehouse": "shooting star",
      "treehouses": "shooting stars",
      "plan": "celestial map",
      "plans": "celestial maps",
      "hammer": "telescope",
      "hammers": "telescopes",
      "wood": "night sky",
      "river": "milky way",
      "bridge": "star bridge",
      "apple": "meteorite",
      "apples": "meteorites",
      "mushroom": "glowing firefly",
      "mushrooms": "glowing fireflies",
      "flower": "constellation",
      "flowers": "constellations",
    };
  } else if (bookId === 5) {
    idOffset = 400; // 101-144 becomes 501-544
    letterTarget = "A";
    letterReplacement = "P"; // P for Pique-nique
    replacementsFr = {
      "pont": "panier de pique-nique",
      "ponts": "paniers de pique-nique",
      "rivière": "nappe de pique-nique",
      "cabane": "gâteau magique",
      "cabanes": "gâteaux magiques",
      "pomme": "fraise sucrée",
      "pommes": "fraises sucrées",
      "champignon": "framboise",
      "champignons": "framboises",
      "fleur": "cerise",
      "fleurs": "cerises",
      "noisette": "mûre sauvage",
      "noisettes": "mûres sauvages",
      "cadeau": "délice sucré",
      "cadeaux": "délices sucrés",
      "lettre L": "lettre P",
      "lettre A": "lettre P",
    };
    replacementsEn = {
      "bridge": "picnic basket",
      "bridges": "picnic baskets",
      "river": "picnic blanket",
      "treehouse": "magic cake",
      "treehouses": "magic cakes",
      "apple": "sweet strawberry",
      "apples": "sweet strawberries",
      "mushroom": "raspberry",
      "mushrooms": "raspberries",
      "flower": "cherry",
      "flowers": "cherries",
    };
  } else if (bookId === 6) {
    idOffset = 400; // 201-244 becomes 601-644
    letterTarget = "N";
    letterReplacement = "O"; // O for Océan
    replacementsFr = {
      "cabane": "sous-marin jaune",
      "cabanes": "sous-marins jaunes",
      "plan": "carte marine",
      "plans": "cartes marines",
      "marteau": "barre de navigation",
      "marteaux": "barres de navigation",
      "bois": "récif de corail",
      "rivière": "fosse sous-marine",
      "pont": "sous-marin",
      "pomme": "perle magique",
      "pommes": "perles magiques",
      "champignon": "poisson-clown",
      "champignons": "poissons-clowns",
      "fleur": "étoile de mer",
      "fleurs": "étoiles de mer",
      "noisette": "coquillage",
      "noisettes": "coquillages",
      "cadeau": "perle",
      "cadeaux": "perles",
      "lettre L": "lettre O",
      "lettre N": "lettre O",
      "lettre A": "lettre O",
    };
    replacementsEn = {
      "treehouse": "yellow submarine",
      "treehouses": "yellow submarines",
      "plan": "marine chart",
      "plans": "marine charts",
      "hammer": "navigation wheel",
      "hammers": "navigation wheels",
      "wood": "coral reef",
      "river": "ocean trench",
      "bridge": "submarine",
      "apple": "magic pearl",
      "apples": "magic pearls",
      "mushroom": "clownfish",
      "mushrooms": "clownfish",
      "flower": "starfish",
      "flowers": "starfish",
    };
  }

  const replaceText = (text: string | undefined, replacements: { [key: string]: string }): string => {
    if (!text) return "";
    let result = text;
    Object.keys(replacements).forEach((key) => {
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp("\\b" + escapedKey + "\\b", "gi");
      result = result.replace(regex, (match) => {
        if (match[0] === match[0].toUpperCase()) {
          return replacements[key].charAt(0).toUpperCase() + replacements[key].slice(1);
        }
        return replacements[key];
      });
      if (key.length > 4) {
        const regexLoose = new RegExp(escapedKey, "gi");
        result = result.replace(regexLoose, (match) => {
          if (match[0] === match[0].toUpperCase()) {
            return replacements[key].charAt(0).toUpperCase() + replacements[key].slice(1);
          }
          return replacements[key];
        });
      }
    });
    return result;
  };

  book.chapters.forEach((chap) => {
    chap.missions.forEach((m) => {
      const oldId = m.id;
      m.id = oldId + idOffset;

      m.typeFr = replaceText(m.typeFr, replacementsFr);
      m.typeEn = replaceText(m.typeEn, replacementsEn);
      m.bubbleFr = replaceText(m.bubbleFr, replacementsFr);
      m.bubbleEn = replaceText(m.bubbleEn, replacementsEn);
      m.consigneFr = replaceText(m.consigneFr, replacementsFr);
      m.consigneEn = replaceText(m.consigneEn, replacementsEn);
      if (m.solutionFr) m.solutionFr = replaceText(m.solutionFr, replacementsFr);
      if (m.solutionEn) m.solutionEn = replaceText(m.solutionEn, replacementsEn);
      if (m.solFr) m.solFr = replaceText(m.solFr, replacementsFr);
      if (m.solEn) m.solEn = replaceText(m.solEn, replacementsEn);
      if (m.inputPlaceholderFr) m.inputPlaceholderFr = replaceText(m.inputPlaceholderFr, replacementsFr);
      if (m.inputPlaceholderEn) m.inputPlaceholderEn = replaceText(m.inputPlaceholderEn, replacementsEn);

      if (oldId === 101) {
        if (bookId === 3) {
          m.bubbleFr = "Pour commencer notre quête, retrouve la lettre qui commence le mot : Trésor !";
          m.bubbleEn = "To start our quest, find the letter that starts the word: Treasure!";
          m.choices = [
            { id: `${m.id}-a`, textFr: "M", textEn: "M" },
            { id: `${m.id}-b`, textFr: "T", textEn: "T", isCorrect: true },
            { id: `${m.id}-c`, textFr: "C", textEn: "C" }
          ];
          m.solFr = "C'est le T ! Trésor commence par la lettre T.";
          m.solEn = "It is T! Treasure starts with the letter T.";
        } else if (bookId === 5) {
          m.bubbleFr = "Pour préparer notre goûter, retrouve la lettre qui commence le mot : Pique-nique !";
          m.bubbleEn = "To prepare our snack, find the letter that starts the word: Picnic!";
          m.choices = [
            { id: `${m.id}-a`, textFr: "R", textEn: "R" },
            { id: `${m.id}-b`, textFr: "P", textEn: "P", isCorrect: true },
            { id: `${m.id}-c`, textFr: "S", textEn: "S" }
          ];
          m.solFr = "C'est le P ! Pique-nique commence par la lettre P.";
          m.solEn = "It is P! Picnic starts with the letter P.";
        }
      } else if (oldId === 102) {
        if (bookId === 3) {
          m.bubbleFr = "Des lettres T se cachent sur la carte ! Il y en a 4. Trouve-les toutes !";
          m.bubbleEn = "Letters T are hiding on the map! There are 4 of them. Find them all!";
          m.consigneFr = "👉 Sélectionne les 4 lettres T :";
          m.consigneEn = "👉 Select the 4 letters T:";
        } else if (bookId === 5) {
          m.bubbleFr = "Des lettres P se cachent sur notre panier ! Il y en a 4. Trouve-les toutes !";
          m.bubbleEn = "Letters P are hiding on our basket! There are 4 of them. Find them all!";
          m.consigneFr = "👉 Sélectionne les 4 lettres P :";
          m.consigneEn = "👉 Select the 4 letters P:";
        }
        if (m.gridItems) {
          m.gridItems.forEach(gi => {
            gi.id = gi.id.replace(String(oldId), String(m.id));
            if (gi.text === letterTarget || (gi.isTarget && gi.text === "A")) {
              gi.text = letterReplacement;
            }
          });
        }
      } else if (oldId === 105) {
        if (bookId === 3) {
          m.bubbleFr = "Apprends à écrire la lettre de notre carte ! Repasse sur les modèles de lettres T et C.";
          m.bubbleEn = "Learn to write the letter of our map! Trace the letters T and C.";
          m.consigneFr = "👉 Dessine les lettres T et C dans la zone d'écriture :";
          m.consigneEn = "👉 Draw the letters T and C in the writing zone:";
        } else if (bookId === 5) {
          m.bubbleFr = "Apprends à écrire la lettre du Panier ! Repasse sur les modèles de lettres P et B.";
          m.bubbleEn = "Learn to write the letter of the Basket! Trace the letters P and B.";
          m.consigneFr = "👉 Dessine les lettres P et B dans la zone d'écriture :";
          m.consigneEn = "👉 Draw the letters P and B in the writing zone:";
        }
      } else if (oldId === 106) {
        if (bookId === 3) {
          m.matches = [
            { leftFr: "T (majuscule)", leftEn: "T (uppercase)", rightFr: "t (minuscule)", rightEn: "t (lowercase)", rightIcon: "d-noisette", correctPairIndex: 0 },
            { leftFr: "C (majuscule)", leftEn: "C (uppercase)", rightFr: "c (minuscule)", rightEn: "c (lowercase)", rightIcon: "d-fleur", correctPairIndex: 1 },
            { leftFr: "O (majuscule)", leftEn: "O (uppercase)", rightFr: "o (minuscule)", rightEn: "o (lowercase)", rightIcon: "d-pomme", correctPairIndex: 2 },
            { leftFr: "M (majuscule)", leftEn: "M (uppercase)", rightFr: "m (minuscule)", rightEn: "m (lowercase)", rightIcon: "d-etoile", correctPairIndex: 3 }
          ];
        } else if (bookId === 5) {
          m.matches = [
            { leftFr: "P (majuscule)", leftEn: "P (uppercase)", rightFr: "p (minuscule)", rightEn: "p (lowercase)", rightIcon: "d-noisette", correctPairIndex: 0 },
            { leftFr: "B (majuscule)", leftEn: "B (uppercase)", rightFr: "b (minuscule)", rightEn: "b (lowercase)", rightIcon: "d-fleur", correctPairIndex: 1 },
            { leftFr: "T (majuscule)", leftEn: "T (uppercase)", rightFr: "t (minuscule)", rightEn: "t (lowercase)", rightIcon: "d-pomme", correctPairIndex: 2 },
            { leftFr: "M (majuscule)", leftEn: "M (uppercase)", rightFr: "m (minuscule)", rightEn: "m (lowercase)", rightIcon: "d-etoile", correctPairIndex: 3 }
          ];
        }
      } else if (oldId === 201) {
        if (bookId === 4) {
          m.bubbleFr = "Pour commencer l'observation, retrouve la lettre qui commence le mot : Étoile !";
          m.bubbleEn = "To start the observation, find the letter that starts the word: Star!";
          m.choices = [
            { id: `${m.id}-a`, textFr: "O", textEn: "O" },
            { id: `${m.id}-b`, textFr: "E", textEn: "E", isCorrect: true },
            { id: `${m.id}-c`, textFr: "U", textEn: "U" }
          ];
          m.solFr = "C'est le E ! Étoile commence par la lettre E.";
          m.solEn = "It is E! Star starts with the letter E.";
        } else if (bookId === 6) {
          m.bubbleFr = "Pour démarrer les moteurs, retrouve la lettre qui commence le mot : Océan !";
          m.bubbleEn = "To start the engines, find the letter that starts the word: Ocean!";
          m.choices = [
            { id: `${m.id}-a`, textFr: "I", textEn: "I" },
            { id: `${m.id}-b`, textFr: "O", textEn: "O", isCorrect: true },
            { id: `${m.id}-c`, textFr: "A", textEn: "A" }
          ];
          m.solFr = "C'est le O ! Océan commence par la lettre O.";
          m.solEn = "It is O! Ocean starts with the letter O.";
        }
      } else if (oldId === 202) {
        if (bookId === 4) {
          m.bubbleFr = "Des lettres E se cachent dans le ciel ! Il y en a 4. Trouve-les toutes !";
          m.bubbleEn = "Letters E are hiding in the sky! There are 4 of them. Find them all!";
          m.consigneFr = "👉 Sélectionne les 4 lettres E :";
          m.consigneEn = "👉 Select the 4 letters E:";
        } else if (bookId === 6) {
          m.bubbleFr = "Des lettres O se cachent dans les bulles ! Il y en a 4. Trouve-les toutes !";
          m.bubbleEn = "Letters O are hiding in the bubbles! There are 4 of them. Find them all!";
          m.consigneFr = "👉 Sélectionne les 4 lettres O :";
          m.consigneEn = "👉 Select the 4 letters O:";
        }
        if (m.gridItems) {
          m.gridItems.forEach(gi => {
            gi.id = gi.id.replace(String(oldId), String(m.id));
            if (gi.text === letterTarget || (gi.isTarget && gi.text === "N")) {
              gi.text = letterReplacement;
            }
          });
        }
      } else if (oldId === 205) {
        if (bookId === 4) {
          m.bubbleFr = "Apprends à écrire la lettre de l'Étoile ! Repasse sur les modèles de lettres E et S.";
          m.bubbleEn = "Learn to write the letter of the Star! Trace the letters E and S.";
          m.consigneFr = "👉 Dessine les lettres E et S dans la zone d'écriture :";
          m.consigneEn = "👉 Draw the letters E and S in the writing zone:";
        } else if (bookId === 6) {
          m.bubbleFr = "Apprends à écrire la lettre du Sous-marin ! Repasse sur les modèles de lettres O et S.";
          m.bubbleEn = "Learn to write the letter of the Submarine! Trace the letters O and S.";
          m.consigneFr = "👉 Dessine les lettres O et S dans la zone d'écriture :";
          m.consigneEn = "👉 Draw the letters O and S in the writing zone:";
        }
      } else if (oldId === 206) {
        if (bookId === 4) {
          m.matches = [
            { leftFr: "E (majuscule)", leftEn: "E (uppercase)", rightFr: "e (minuscule)", rightEn: "e (lowercase)", rightIcon: "d-noisette", correctPairIndex: 0 },
            { leftFr: "S (majuscule)", leftEn: "S (uppercase)", rightFr: "s (minuscule)", rightEn: "s (lowercase)", rightIcon: "d-fleur", correctPairIndex: 1 },
            { leftFr: "C (majuscule)", leftEn: "C (uppercase)", rightFr: "c (minuscule)", rightEn: "c (lowercase)", rightIcon: "d-pomme", correctPairIndex: 2 },
            { leftFr: "L (majuscule)", leftEn: "L (uppercase)", rightFr: "l (minuscule)", rightEn: "l (lowercase)", rightIcon: "d-etoile", correctPairIndex: 3 }
          ];
        } else if (bookId === 6) {
          m.matches = [
            { leftFr: "O (majuscule)", leftEn: "O (uppercase)", rightFr: "o (minuscule)", rightEn: "o (lowercase)", rightIcon: "d-noisette", correctPairIndex: 0 },
            { leftFr: "S (majuscule)", leftEn: "S (uppercase)", rightFr: "s (minuscule)", rightEn: "s (lowercase)", rightIcon: "d-fleur", correctPairIndex: 1 },
            { leftFr: "M (majuscule)", leftEn: "M (uppercase)", rightFr: "m (minuscule)", rightEn: "m (lowercase)", rightIcon: "d-pomme", correctPairIndex: 2 },
            { leftFr: "P (majuscule)", leftEn: "P (uppercase)", rightFr: "p (minuscule)", rightEn: "p (lowercase)", rightIcon: "d-etoile", correctPairIndex: 3 }
          ];
        }
      }

      if (m.choices) {
        m.choices.forEach(c => {
          c.id = c.id.replace(String(oldId), String(m.id));
          c.textFr = replaceText(c.textFr, replacementsFr);
          c.textEn = replaceText(c.textEn, replacementsEn);
        });
      }
      if (m.gridItems) {
        m.gridItems.forEach(gi => {
          gi.id = gi.id.replace(String(oldId), String(m.id));
        });
      }
      if (m.matches) {
        m.matches.forEach(match => {
          match.leftFr = replaceText(match.leftFr, replacementsFr);
          match.leftEn = replaceText(match.leftEn, replacementsEn);
          match.rightFr = replaceText(match.rightFr, replacementsFr);
          match.rightEn = replaceText(match.rightEn, replacementsEn);
        });
      }
    });
  });

  return book;
};

// Programmatically generate Book 3 and Book 4 to give children more options!
const createBook3 = (): BookData => {
  // Deep clone Book 1
  const book = JSON.parse(JSON.stringify(booksData[0])) as BookData;
  book.id = 3;
  book.titleFr = "La grande chasse au trésor";
  book.titleEn = "The Great Treasure Hunt";
  book.descriptionFr = "Trouve la carte secrète, suis les indices et déterre le trésor légendaire des Copains de la forêt !";
  book.descriptionEn = "Find the secret map, follow the clues, and dig up the legendary treasure of the Forest Friends!";
  book.themeEmojis = ["🗺️", "🔑", "💎"];

  // Customizing chapter titles & stories to fit the Treasure Hunt theme
  const chaptersData = [
    {
      titleFr: "La Carte Secrète",
      titleEn: "The Secret Map",
      storyFr: [
        "Dans un vieux tronc creux, Léo et Nina découvrent un morceau de parchemin jauni. « C'est une carte au trésor ! » s'exclame Nina en ouvrant de grands yeux.",
        "Le dessin montre un grand chemin, un ruisseau scintillant et une mystérieuse croix rouge tout au bout de la forêt.",
        "« Allons chercher Darina et Lana ! » s'écrie Léo. « Ensemble, nous allons résoudre les énigmes et trouver ce trésor ! Viens avec nous ! »"
      ],
      storyEn: [
        "Inside an old hollow log, Leo and Nina discover a piece of yellowed parchment. 'It's a treasure map!' exclaims Nina, her eyes wide.",
        "The drawing shows a long path, a sparkling creek, and a mysterious red cross at the very end of the forest.",
        "'Let's find Darina and Lana!' cries Leo. 'Together, we will solve the riddles and find this treasure! Come with us!'"
      ],
      badgeNameFr: "Cartographe en Herbe",
      badgeNameEn: "Budding Cartographer",
      badgeDescFr: "Tu as déchiffré les premiers secrets de la carte ancienne et réuni les aventuriers. Tu as le sens de l'orientation !",
      badgeDescEn: "You deciphered the first secrets of the ancient map and gathered the adventurers. You have a great sense of direction!"
    },
    {
      titleFr: "La Traversée du Ruisseau",
      titleEn: "Crossing the Stream",
      storyFr: [
        "La carte indique qu'il faut traverser le ruisseau aux cailloux ronds. Mais attention, l'eau coule vite et les poissons sautent joyeusement !",
        "« Regardez, il y a de grosses pierres pour traverser en marchant comme des grenouilles ! » propose Lana en battant des ailes.",
        "Chaque pas sur une pierre est une devinette. Aide tes amis à bondir d'un côté à l'autre sans te mouiller les pieds !"
      ],
      storyEn: [
        "The map shows that they must cross the stream of round pebbles. But watch out, the water flows fast and fish are jumping happily!",
        "'Look, there are big stepping stones to cross by hopping like frogs!' proposes Lana, flapping her wings.",
        "Each step on a stone is a riddle. Help your friends leap from one side to the other without getting your feet wet!"
      ],
      badgeNameFr: "Passeur de Ruisseaux",
      badgeNameEn: "Stream Crosser",
      badgeDescFr: "Tu as guidé les Copains à travers les pierres glissantes du ruisseau. Tu es agile et courageux !",
      badgeDescEn: "You guided the Friends across the slippery stepping stones of the stream. You are agile and brave!"
    },
    {
      titleFr: "La Piste des Empreintes",
      titleEn: "The Footprint Trail",
      storyFr: [
        "De l'autre côté de l'eau, le chemin disparaît sous un tapis de feuilles dorées. Mais de drôles de traces de pas sont dessinées au sol.",
        "« Ce sont des empreintes d'animaux ! » dit Darina en grattant le sol de ses petites griffes. « Certaines vont vers le nord, d'autres tournent en rond. »",
        "Pour savoir quel chemin suivre, il va falloir compter les empreintes et observer attentivement la nature. Ouvrons l'œil !"
      ],
      storyEn: [
        "On the other side of the water, the path disappears under a carpet of golden leaves. But funny footprints are marked on the ground.",
        "'These are animal tracks!' says Darina, scratching the ground with her little claws. 'Some go north, others go in circles.'",
        "To know which path to follow, we will need to count the footprints and watch nature closely. Let's keep our eyes open!"
      ],
      badgeNameFr: "Détective de la Forêt",
      badgeNameEn: "Forest Detective",
      badgeDescFr: "Tu as déchiffré les empreintes mystérieuses et retrouvé la bonne piste. Rien n'échappe à ton regard d'aigle !",
      badgeDescEn: "You decoded the mysterious footprints and found the right path. Nothing escapes your eagle eyes!"
    },
    {
      titleFr: "La Grotte aux Échos",
      titleEn: "The Cave of Echoes",
      storyFr: [
        "La piste mène devant l'entrée d'une petite grotte de pierre grise. À l'intérieur, les gouttes d'eau font « plip, plop » et résonnent comme de la musique.",
        "« C'est ici que la clé en or est cachée ! » chuchote Léo. « Mais il fait un peu sombre, nous devons nous entraider pour éclairer les murs. »",
        "Dessine une belle lanterne magique et résous les énigmes de calcul mental pour faire apparaître la clé brillante !"
      ],
      storyEn: [
        "The trail leads to the entrance of a small gray stone cave. Inside, water drops go 'plip, plop' and echo like music.",
        "'The golden key is hidden in here!' whispers Leo. 'But it's a bit dark, we must help each other light up the walls.'",
        "Draw a beautiful magic lantern and solve the mental math riddles to make the shining key appear!"
      ],
      badgeNameFr: "Gardien de la Clé",
      badgeNameEn: "Keeper of the Key",
      badgeDescFr: "Tu as bravé l'obscurité de la grotte et découvert la magnifique clé dorée. Tu es un explorateur intrépide !",
      badgeDescEn: "You braved the darkness of the cave and found the magnificent golden key. You are an intrepid explorer!"
    },
    {
      titleFr: "Le Coffre sous le Grand Chêne",
      titleEn: "The Chest Under the Big Oak",
      storyFr: [
        "La clé en main, les Copains courent vers le plus grand chêne de la forêt. À ses pieds, à moitié caché par des racines géantes, se trouve un vieux coffre en bois.",
        "« Vite, essayons la clé ! » propose Nina en sautillant d'excitation. La serrure tourne avec un doux « clic »... Le couvercle se lève !",
        "À l'intérieur se trouvent des tas de fruits délicieux, des livres illustrés et des jouets en bois. « C'est le plus beau des trésors ! » s'exclament-ils."
      ],
      storyEn: [
        "Key in hand, the Friends run to the largest oak tree in the forest. At its base, half-hidden by giant roots, lies an old wooden chest.",
        "'Quick, let's try the key!' suggests Nina, hopping with excitement. The lock turns with a soft 'click'... The lid lifts!",
        "Inside are heaps of delicious fruits, picture books, and wooden toys. 'It's the best treasure ever!' they exclaim."
      ],
      badgeNameFr: "Maître du Trésor",
      badgeNameEn: "Treasure Master",
      badgeDescFr: "Tu as ouvert le coffre mystérieux et partagé le trésor de l'amitié avec tous les Copains. Félicitations, champion !",
      badgeDescEn: "You opened the mysterious chest and shared the friendship treasure with all the Friends. Congratulations, champion!"
    }
  ];

  for (let i = 0; i < book.chapters.length; i++) {
    const chap = book.chapters[i];
    const data = chaptersData[i];
    if (chap && data) {
      chap.titleFr = data.titleFr;
      chap.titleEn = data.titleEn;
      chap.storyFr = data.storyFr;
      chap.storyEn = data.storyEn;
      chap.badgeNameFr = data.badgeNameFr;
      chap.badgeNameEn = data.badgeNameEn;
      chap.badgeDescFr = data.badgeDescFr;
      chap.badgeDescEn = data.badgeDescEn;
    }
  }

  return customizeBookMissions(book, 3);
};

const createBook4 = (): BookData => {
  // Deep clone Book 2
  const book = JSON.parse(JSON.stringify(booksData[1])) as BookData;
  book.id = 4;
  book.titleFr = "Le mystère de l'étoile filante";
  book.titleEn = "The Mystery of the Shooting Star";
  book.descriptionFr = "Une étoile magique est tombée du ciel pendant la nuit ! Pars à sa recherche avec une lanterne et des lunettes d'astronome.";
  book.descriptionEn = "A magical star fell from the sky during the night! Search for it with a lantern and astronomer goggles.";
  book.themeEmojis = ["🌟", "🔭", "✨"];

  const chaptersData = [
    {
      titleFr: "Le Vœu dans la Nuit",
      titleEn: "The Wish in the Night",
      storyFr: [
        "La nuit est tombée sur la forêt. Assis sur une branche haute, Léo et Lana regardent le ciel noir rempli de milliers de petites lumières scintillantes.",
        "Soudain, une ligne dorée traverse le ciel : « Regarde ! Une étoile filante ! » s'écrie Lana. Mais au lieu de disparaître, l'étoile semble atterrir doucement derrière la colline.",
        "« C'est magique ! » s'étonne Léo. « Si nous la retrouvons, nous pourrons faire un vrai vœu pour toute la forêt ! Préparons nos affaires ! »"
      ],
      storyEn: [
        "Night has fallen over the forest. Sitting on a high branch, Leo and Lana look at the black sky filled with thousands of tiny twinkling lights.",
        "Suddenly, a golden streak shoots across the sky: 'Look! A shooting star!' cries Lana. But instead of disappearing, the star seems to land softly behind the hill.",
        "'It's magic!' says Leo in awe. 'If we find it, we can make a real wish for the whole forest! Let's get our gear ready!'"
      ],
      badgeNameFr: "Observateur d'Étoiles",
      badgeNameEn: "Star Gazer",
      badgeDescFr: "Tu as repéré l'étoile magique et préparé l'expédition nocturne. Tu as de fantastiques yeux de lynx !",
      badgeDescEn: "You spotted the magic star and prepared the night expedition. You have fantastic sharp eyes!"
    },
    {
      titleFr: "La Forêt Phosphorescente",
      titleEn: "The Glowing Forest",
      storyFr: [
        "Dans l'obscurité, la forêt a un aspect féerique. Les champignons brillent doucement et des lucioles volent tout autour des buissons.",
        "« Ouh-ouh ! » chante la chouette. Nina sursaute puis rit : « Ce ne sont que les petits bruits de la nuit ! Suivons la lueur dorée ! »",
        "Pour avancer en sécurité, les Copains doivent tracer des formes géométriques et trier les lucioles par couleur. En route !"
      ],
      storyEn: [
        "In the dark, the forest looks enchanting. Mushrooms glow softly, and fireflies fly all around the bushes.",
        "'Hoot-hoot!' sings the owl. Nina jumps, then laughs: 'It's just the little sounds of the night! Let's follow the golden glow!'",
        "To move forward safely, the Friends must trace geometric shapes and sort the fireflies by color. Let's go!"
      ],
      badgeNameFr: "Ami des Lucioles",
      badgeNameEn: "Friend of the Fireflies",
      badgeDescFr: "Tu as traversé les fourrés sombres grâce à la lumière des lucioles amicales. La nuit ne te fait pas peur !",
      badgeDescEn: "You crossed the dark thickets thanks to the light of the friendly fireflies. You are not afraid of the night!"
    },
    {
      titleFr: "Le Labyrinthe des Brumes",
      titleEn: "The Maze of Mists",
      storyFr: [
        "Une brume légère s'élève près du vieux lac aux nénuphars. Le chemin de l'étoile est caché par d'étranges nuages de brouillard argenté.",
        "« Restons bien groupés ! » conseille Darina en tenant fermement la patte de Nina. « Lana peut voler au-dessus pour nous guider ! »",
        "Aide Lana à dissiper le brouillard en reliant les étoiles identiques et en résolvant des jeux d'observation visuelle !"
      ],
      storyEn: [
        "A light mist rises near the old lily pad lake. The star's path is hidden by strange clouds of silver fog.",
        "'Let's stay close together!' advises Darina, holding Nina's paw firmly. 'Lana can fly above to guide us!'",
        "Help Lana clear the fog by linking identical stars and solving visual observation games!"
      ],
      badgeNameFr: "Guide du Brouillard",
      badgeNameEn: "Mist Guide",
      badgeDescFr: "Tu as dissipé la brume argentée et retrouvé le bon chemin près du grand lac tranquille. Quel talent !",
      badgeDescEn: "You cleared the silver mist and found the correct path near the big quiet lake. What talent!"
    },
    {
      titleFr: "La Clairière de Cristal",
      titleEn: "The Crystal Glade",
      storyFr: [
        "Le brouillard se dissipe enfin. Au centre d'une clairière secrète, une magnifique pierre de cristal jaune brille au sol. C'est l'étoile filante !",
        "Elle scintille de mille couleurs et réchauffe doucement l'air tout autour d'elle. « Elle est si belle ! » murmure Lana en l'approchant.",
        "Mais pour libérer son énergie magique, il faut compléter les dessins de symétrie et peindre les constellations !"
      ],
      storyEn: [
        "The fog finally clears. In the center of a secret glade, a magnificent yellow crystal stone glows on the ground. It is the shooting star!",
        "It sparkles with a thousand colors and gently warms the air around it. 'She is so beautiful!' whispers Lana, approaching it.",
        "But to release its magical energy, we must complete symmetry drawings and paint the constellations!"
      ],
      badgeNameFr: "Ami du Cosmos",
      badgeNameEn: "Cosmos Friend",
      badgeDescFr: "Tu as ranimé la lumière de l'étoile en reliant ses constellations célestes. Tu as la tête pleine de rêves !",
      badgeDescEn: "You revived the star's light by connecting its celestial constellations. Your head is full of beautiful dreams!"
    },
    {
      titleFr: "Le Vœu de la Forêt",
      titleEn: "The Forest Wish",
      storyFr: [
        "L'étoile brille maintenant de tout son éclat céleste. Léo, Nina, Darina et Lana posent une patte dessus et ferment les yeux en souriant.",
        "« Nous faisons le vœu que notre forêt reste toujours verte, belle et remplie de rires d'enfants ! » disent-ils en chœur.",
        "L'étoile s'envole alors doucement vers le ciel en laissant une pluie de poussière dorée sur leurs têtes. Quelle nuit magique !"
      ],
      storyEn: [
        "The star now glows in all its celestial brilliance. Leo, Nina, Darina, and Lana place a paw on it and close their eyes, smiling.",
        "'We wish that our forest always stays green, beautiful, and filled with children's laughter!' they say in unison.",
        "The star then gently floats back up to the sky, leaving a shower of golden stardust on their heads. What a magical night!"
      ],
      badgeNameFr: "Faiseur de Vœux",
      badgeNameEn: "Wish Maker",
      badgeDescFr: "Tu as renvoyé l'étoile dans le ciel et exaucé le vœu d'amitié éternelle. Tu es un magicien de la forêt !",
      badgeDescEn: "You sent the star back to the sky and granted the wish of eternal friendship. You are a true forest wizard!"
    }
  ];

  for (let i = 0; i < book.chapters.length; i++) {
    const chap = book.chapters[i];
    const data = chaptersData[i];
    if (chap && data) {
      chap.titleFr = data.titleFr;
      chap.titleEn = data.titleEn;
      chap.storyFr = data.storyFr;
      chap.storyEn = data.storyEn;
      chap.badgeNameFr = data.badgeNameFr;
      chap.badgeNameEn = data.badgeNameEn;
      chap.badgeDescFr = data.badgeDescFr;
      chap.badgeDescEn = data.badgeDescEn;
    }
  }

  return customizeBookMissions(book, 4);
};

const createBook5 = (): BookData => {
  // Deep clone Book 1
  const book = JSON.parse(JSON.stringify(booksData[0])) as BookData;
  book.id = 5;
  book.titleFr = "Le pique-nique magique";
  book.titleEn = "The Magical Picnic";
  book.descriptionFr = "Aide les Copains à récolter de délicieux ingrédients, à cuisiner une tarte secrète et à inviter les animaux !";
  book.descriptionEn = "Help the Friends gather delicious ingredients, bake a secret pie, and invite all the forest animals!";
  book.themeEmojis = ["🧺", "🍓", "🍰"];

  const chaptersData = [
    {
      titleFr: "La Cueillette des Baies",
      titleEn: "Gathering the Berries",
      storyFr: [
        "Le soleil brille haut dans le ciel. Nina propose une idée délicieuse : « Faisons un grand pique-nique champêtre ! »",
        "Pour commencer, les Copains ont besoin de fruits bien mûrs. Léo court vers les buissons de framboises et de mûres sauvages.",
        "Mais attention aux petites épines ! Il faut trier les baies sucrées et remplir le panier en osier de mille couleurs."
      ],
      storyEn: [
        "The sun shines high in the sky. Nina proposes a delicious idea: 'Let's have a grand country picnic!'",
        "To start, the Friends need ripe fruits. Leo runs toward the bushes of wild raspberries and blackberries.",
        "But watch out for the little thorns! We must sort the sweet berries and fill the wicker basket with a thousand colors."
      ],
      badgeNameFr: "Cueilleur Expert",
      badgeNameEn: "Expert Berry Picker",
      badgeDescFr: "Tu as rempli le panier de délicieuses baies bien mûres sans en écraser une seule. Quelle récolte !",
      badgeDescEn: "You filled the basket with delicious, ripe berries without squishing a single one. What a harvest!"
    },
    {
      titleFr: "La Recette Secrète",
      titleEn: "The Secret Recipe",
      storyFr: [
        "De retour à la clairière, Darina sort son vieux livre de cuisine. « Préparons la célèbre tarte magique de la forêt ! »",
        "Il faut mesurer la farine, casser les œufs en chocolat et mélanger le tout en chantant une joyeuse chanson de cuisine.",
        "Aide Darina à compter les ingrédients et à régler le minuteur du petit four en terre pour réussir la cuisson parfaite !"
      ],
      storyEn: [
        "Back in the clearing, Darina pulls out her old cookbook. 'Let's bake the forest's famous magic pie!'",
        "We need to measure the flour, crack the chocolate eggs, and mix everything while singing a happy cooking song.",
        "Help Darina count the ingredients and set the timer on the clay oven to achieve perfect baking!"
      ],
      badgeNameFr: "Chef Étoilé",
      badgeNameEn: "Star Chef",
      badgeDescFr: "La tarte dorée sent divinement bon et est prête à être dégustée. Tu es un chef cuisinier exceptionnel !",
      badgeDescEn: "The golden pie smells divinely good and is ready to be enjoyed. You are an exceptional chef!"
    },
    {
      titleFr: "La Table de Fête",
      titleEn: "The Festive Table",
      storyFr: [
        "Il est temps de dresser la nappe à carreaux rouges sur l'herbe douce. Lana s'occupe de disposer les verres et les assiettes.",
        "« Ajoutons des fleurs des champs et de jolies feuilles de chêne pour décorer ! » s'exclame-t-elle en volant de fleur en fleur.",
        "Aide Lana à plier les serviettes en origami et à créer une table magnifique pour tous les invités !"
      ],
      storyEn: [
        "It's time to lay out the red-and-white checkered blanket on the soft grass. Lana takes care of arranging the glasses and plates.",
        "'Let's add wild flowers and pretty oak leaves for decoration!' she exclaims, flying from flower to flower.",
        "Help Lana fold the napkins into origami shapes and create a gorgeous table layout for all the guests!"
      ],
      badgeNameFr: "Décorateur Joyeux",
      badgeNameEn: "Joyful Decorator",
      badgeDescFr: "La table de pique-nique est digne d'un palais royal de la forêt. Tu as un goût artistique remarquable !",
      badgeDescEn: "The picnic table looks worthy of a royal forest palace. You have remarkable artistic taste!"
    },
    {
      titleFr: "L'Invité Surprise",
      titleEn: "The Surprise Guest",
      storyFr: [
        "Alors que tout est prêt, un petit grognement timide se fait entendre derrière un gros buisson de fougères.",
        "Un adorable petit hérisson pointe son nez pointu : « Bonjour... Puis-je me joindre à votre pique-nique ? » demande-t-il timidement.",
        "« Bien sûr ! Plus on est de copains, plus on rit ! » répond Léo en lui tendant un grand verre de jus de pomme frais."
      ],
      storyEn: [
        "Just as everything is ready, a shy little grunt is heard from behind a large fern bush.",
        "An adorable tiny hedgehog points his snout out: 'Hello... May I join your picnic?' he asks timidly.",
        "'Of course! The more friends, the more we laugh!' replies Leo, handing him a large glass of fresh apple juice."
      ],
      badgeNameFr: "Hôte Chaleureux",
      badgeNameEn: "Warm Host",
      badgeDescFr: "Tu as accueilli le petit hérisson avec gentillesse et générosité. Tu as le cœur sur la main !",
      badgeDescEn: "You welcomed the little hedgehog with kindness and generosity. You have a heart of gold!"
    },
    {
      titleFr: "Le Partage des Délices",
      titleEn: "Sharing the Delights",
      storyFr: [
        "Tout le monde est installé sur la nappe. On découpe de grandes parts de tarte magique aux baies et on se raconte des histoires.",
        "Le vent souffle doucement dans les arbres, les oiseaux chantent, et les rires résonnent dans toute la forêt enchantée.",
        "« C'est le meilleur pique-nique du monde ! » s'écrient les Copains en levant leurs verres à l'amitié éternelle."
      ],
      storyEn: [
        "Everyone is settled on the blanket. They cut large slices of the magic berry pie and share stories.",
        "The wind blows gently through the trees, birds sing, and laughter echoes throughout the enchanted forest.",
        "'This is the best picnic in the world!' cry the Friends, raising their glasses to eternal friendship."
      ],
      badgeNameFr: "Roi du Partage",
      badgeNameEn: "Sharing King",
      badgeDescFr: "Tu as partagé les délices et répandu le bonheur tout autour de toi. Vive la fête et l'amitié !",
      badgeDescEn: "You shared the delicacies and spread happiness all around you. Long live the party and friendship!"
    }
  ];

  for (let i = 0; i < book.chapters.length; i++) {
    const chap = book.chapters[i];
    const data = chaptersData[i];
    if (chap && data) {
      chap.titleFr = data.titleFr;
      chap.titleEn = data.titleEn;
      chap.storyFr = data.storyFr;
      chap.storyEn = data.storyEn;
      chap.badgeNameFr = data.badgeNameFr;
      chap.badgeNameEn = data.badgeNameEn;
      chap.badgeDescFr = data.badgeDescFr;
      chap.badgeDescEn = data.badgeDescEn;
    }
  }

  return customizeBookMissions(book, 5);
};

const createBook6 = (): BookData => {
  // Deep clone Book 2
  const book = JSON.parse(JSON.stringify(booksData[1])) as BookData;
  book.id = 6;
  book.titleFr = "L'aventure sous-marine";
  book.titleEn = "The Undersea Adventure";
  book.descriptionFr = "Monte à bord du sous-marin des Copains pour explorer les fonds marins et saluer la grande pieuvre musicienne !";
  book.descriptionEn = "Climb aboard the Friends' submarine to explore the deep ocean and greet the great musical octopus!";
  book.themeEmojis = ["🐙", "⚓", "🐚"];

  const chaptersData = [
    {
      titleFr: "Le Sous-Marin Jaune",
      titleEn: "The Yellow Submarine",
      storyFr: [
        "Pour changer de la forêt, Léo a construit une merveilleuse machine étanche : un magnifique sous-marin jaune à pédales !",
        "« Tout le monde à bord ! » crie-t-il en ouvrant l'écoutille ronde. Nina, Darina et Lana s'installent près des hublots de verre.",
        "Mettons nos casques de plongée, vérifions la pression de l'air et démarrons l'hélice magique pour descendre sous l'eau !"
      ],
      storyEn: [
        "For a change of scenery, Leo has built a wonderful waterproof machine: a magnificent pedal-powered yellow submarine!",
        "'All aboard!' he shouts, opening the round hatch. Nina, Darina, and Lana settle near the glass portholes.",
        "Let's put on our diving helmets, check the air pressure, and start the magic propeller to head underwater!"
      ],
      badgeNameFr: "Capitaine Intrépide",
      badgeNameEn: "Intrepid Captain",
      badgeDescFr: "Tu as piloté le sous-marin à travers les courants sous-marins avec beaucoup d'adresse. En avant toute !",
      badgeDescEn: "You piloted the submarine through underwater currents with great skill. Full steam ahead!"
    },
    {
      titleFr: "Le Récif de Corail",
      titleEn: "The Coral Reef",
      storyFr: [
        "Sous l'eau, un monde incroyable se dévoile. Le récif de corail brille de mille feux : rose, jaune, bleu et violet scintillant.",
        "Des dizaines de poissons-clowns et de petites tortues de mer nagent joyeusement en faisant des pirouettes amusantes.",
        "Aide les Copains à compter les étoiles de mer colorées et à nettoyer le récif de quelques petits débris égarés !"
      ],
      storyEn: [
        "Underwater, an incredible world unfolds. The coral reef shines with a thousand lights: sparkling pink, yellow, blue, and purple.",
        "Dozens of clownfish and tiny sea turtles swim happily, performing fun pirouettes in the water.",
        "Help the Friends count the colorful starfish and clean up the reef from a few stray pieces of debris!"
      ],
      badgeNameFr: "Ami des Poissons",
      badgeNameEn: "Friend of the Fish",
      badgeDescFr: "Tu as préservé le récif de corail et salué toutes les créatures marines. Les dauphins t'adorent !",
      badgeDescEn: "You preserved the coral reef and greeted all the marine creatures. The dolphins adore you!"
    },
    {
      titleFr: "La Pieuvre Musicienne",
      titleEn: "The Musical Octopus",
      storyFr: [
        "Soudain, une mélodie entraînante résonne au fond de l'eau : « Bloup, bloup, tra-la-la ! »",
        "C'est une grande pieuvre mauve très gentille qui joue de la batterie sur des coquillages creux avec ses huit longs bras !",
        "« Venez danser ! » propose-t-elle en souriant. Rejoins le rythme en reliant les notes de musique colorées sur l'écran !"
      ],
      storyEn: [
        "Suddenly, a catchy melody echoes at the bottom of the water: 'Bloop, bloop, tra-la-la!'",
        "It's a big, very kind purple octopus playing the drums on hollow seashells with her eight long arms!",
        "'Come dance!' she proposes, smiling. Join the rhythm by linking the colorful music notes on the screen!"
      ],
      badgeNameFr: "Mélomane des Mers",
      badgeNameEn: "Sea Music Lover",
      badgeDescFr: "Tu as suivi le rythme de la pieuvre et composé un incroyable concert aquatique. Quelle ambiance !",
      badgeDescEn: "You followed the octopus's rhythm and composed an incredible aquatic concert. What an atmosphere!"
    },
    {
      titleFr: "La Perle Lumineuse",
      titleEn: "The Glowing Pearl",
      storyFr: [
        "Pour remercier les Copains, la pieuvre leur montre un coquillage géant qui dort au fond d'une petite vallée de sable fin.",
        "Le coquillage s'ouvre doucement pour révéler une magnifique perle magique qui brille d'une douce lueur dorée sous-marine.",
        "« C'est la perle des océans ! » s'émerveille Darina. Résous le puzzle géométrique pour l'admirer de tout près !"
      ],
      storyEn: [
        "To thank the Friends, the octopus shows them a giant clam sleeping at the bottom of a small valley of fine sand.",
        "The clam opens gently to reveal a magnificent magic pearl glowing with a soft golden light underwater.",
        "'It's the ocean's pearl!' says Darina in awe. Solve the geometric puzzle to admire it from up close!"
      ],
      badgeNameFr: "Chasseur de Perles",
      badgeNameEn: "Pearl Hunter",
      badgeDescFr: "Tu as résolu l'énigme du coquillage et fait briller la perle dorée des profondeurs. Merveilleux !",
      badgeDescEn: "You solved the clam's riddle and made the golden pearl of the deep shine. Wonderful!"
    },
    {
      titleFr: "Le Retour à la Surface",
      titleEn: "Return to the Surface",
      storyFr: [
        "Des bulles d'air magiques entourent le sous-marin pour l'aider à remonter doucement vers la surface ensoleillée.",
        "Plop ! Le sous-marin sort de l'eau près de la plage de sable chaud, sous les applaudissements des mouettes de mer.",
        "« Quelle incroyable expédition ! » dit Lana. « Nous avons de merveilleux nouveaux amis sous l'océan ! »"
      ],
      storyEn: [
        "Magical air bubbles surround the submarine to help it float gently back up to the sunny surface.",
        "Pop! The submarine emerges near the warm sandy beach, as the seagulls flap their wings and cheer.",
        "'What an incredible expedition!' says Lana. 'We have wonderful new friends under the ocean!'"
      ],
      badgeNameFr: "Explorateur de l'Océan",
      badgeNameEn: "Ocean Explorer",
      badgeDescFr: "Tu as ramené tout le monde à terre sain et sauf après un fabuleux voyage sous-marin. Félicitations !",
      badgeDescEn: "You brought everyone back to shore safe and sound after a fabulous undersea journey. Congratulations!"
    }
  ];

  for (let i = 0; i < book.chapters.length; i++) {
    const chap = book.chapters[i];
    const data = chaptersData[i];
    if (chap && data) {
      chap.titleFr = data.titleFr;
      chap.titleEn = data.titleEn;
      chap.storyFr = data.storyFr;
      chap.storyEn = data.storyEn;
      chap.badgeNameFr = data.badgeNameFr;
      chap.badgeNameEn = data.badgeNameEn;
      chap.badgeDescFr = data.badgeDescFr;
      chap.badgeDescEn = data.badgeDescEn;
    }
  }

  return customizeBookMissions(book, 6);
};

// Append programmatically generated books to booksData
booksData.push(createBook3());
booksData.push(createBook4());
booksData.push(createBook5());
booksData.push(createBook6());


