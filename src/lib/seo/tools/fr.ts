import type { ToolPageCopy } from './registry';

/** 工具页的法语文案。关键词按法语用户的实际搜索习惯选，不是英文直译。 */
export const TOOLS_FR: Record<string, ToolPageCopy> = {
  'pdf-to-mind-map': {
    eyebrow: 'Outil de structuration de documents par IA',
    title: 'PDF en carte mentale',
    description:
      "Importez un PDF et obtenez une carte mentale modifiable à plusieurs niveaux. Les sections, les thèmes et les arguments principaux sont repérés automatiquement, et chaque conclusion garde la page dont elle provient.",
    seoTitle: 'PDF en carte mentale — une IA qui extrait la structure et les idées clés',
    seoDescription:
      "Essayez gratuitement notre outil de conversion PDF en carte mentale par IA. Importez un article, un rapport ou un livre et obtenez une carte à plusieurs niveaux dont les nœuds conservent leur page d'origine, exportable en PNG, SVG et Markdown.",
    primaryKeyword: 'PDF en carte mentale',
    relatedKeywords: ['convertir un PDF en carte mentale', 'résumer un PDF avec l’IA', 'article scientifique en carte mentale', 'visualiser le contenu d’un PDF'],
    benefits: [
      { title: "D'abord la structure, ensuite les nœuds", description: "Plutôt que de recopier paragraphe après paragraphe, nous dégageons les catégories thématiques puis rangeons chaque fait dans la bonne branche." },
      { title: 'Chaque point reste vérifiable', description: "Les nœuds conservent leur numéro de page : vérifier une conclusion ne demande donc pas de reparcourir tout le document." },
      { title: 'Modifiable après génération', description: 'Ajoutez ou supprimez des nœuds, repliez des niveaux et exportez en PNG, SVG ou Markdown.' },
    ],
    steps: [
      { title: 'Importez votre PDF', description: 'Choisissez un PDF dont le texte est sélectionnable. Les limites actuelles sont de 20 Mo et 200 pages.' },
      { title: 'Choisissez la profondeur et l’objectif', description: "Réglez le nombre de niveaux selon que vous survolez, étudiez ou analysez la structure." },
      { title: 'Vérifiez les sources et exportez', description: 'Passez en revue les renvois de page, ajustez les nœuds, puis enregistrez ou exportez le résultat.' },
    ],
    useCases: ['Survoler rapidement des articles scientifiques', 'Venir à bout de rapports sectoriels et de livres blancs', "Transformer des chapitres de manuel en trame de révision", 'Dégager la structure de contrats et de règlements'],
    faq: [
      { question: 'Peut-on convertir des PDF numérisés ?', answer: "La version actuelle prend en charge les PDF dont le texte peut être sélectionné et copié. La reconnaissance optique des documents numérisés est prévue pour une version ultérieure." },
      { question: "D'où viennent les numéros de page des nœuds ?", answer: "Ils sont enregistrés au moment du découpage du document. Le modèle ne référence que des fragments existants : chaque nœud peut donc être ramené à sa page, et le numéro n'est jamais inventé." },
      { question: 'Mon PDF est-il conservé durablement ?', answer: "Le traitement lit le fichier uniquement pour répondre à votre demande. Le résultat structuré n'entre dans votre bibliothèque personnelle que si vous choisissez d'enregistrer la carte." },
    ],
  },
  'text-to-mind-map': {
    eyebrow: 'Outil d’organisation de contenu par IA',
    title: 'Texte en carte mentale',
    description: "Collez un article, vos notes ou un compte rendu : l'IA regroupe les thèmes par niveaux et transforme un texte linéaire en structure de connaissance modifiable.",
    seoTitle: 'Texte en carte mentale — une IA qui construit des cartes à plusieurs niveaux',
    seoDescription:
      "Essayez gratuitement notre outil de conversion de texte en carte mentale. Collez un texte long, des notes ou un compte rendu, et l'IA les organise en une carte modifiable et exportable.",
    primaryKeyword: 'texte en carte mentale',
    relatedKeywords: ['créer une carte mentale à partir d’un texte', 'générateur de carte mentale IA', 'notes en carte mentale', 'compte rendu en carte mentale'],
    benefits: [
      { title: 'Thèmes dégagés automatiquement', description: "Les grandes catégories sont posées d'abord et les détails rangés ensuite, pour que tout ne s'entasse pas sur le nœud central." },
      { title: 'Trois niveaux de détail', description: 'Concis, standard ou détaillé, selon que vous survolez ou étudiez en profondeur.' },
      { title: "Ce n'est pas une image figée", description: 'Après la génération, vous pouvez modifier le texte, ajouter des nœuds, replier des niveaux et exporter.' },
    ],
    steps: [
      { title: 'Collez votre texte', description: 'Un article, une transcription, un cahier des charges ou tout autre texte long.' },
      { title: 'Choisissez votre objectif', description: "Orientez le résultat vers l'étude, l'analyse de structure, les réunions ou la compréhension générale." },
      { title: 'Mettez au propre et emportez', description: 'Vérifiez la hiérarchie, retouchez-la à la main, puis exportez ou créez un lien de partage.' },
    ],
    useCases: ['Transformer des notes de lecture en trame de connaissances', 'Découper un compte rendu en sujets et en actions', 'Organiser des exigences produit et des plans de projet', 'Saisir vite la vue d’ensemble d’un long article'],
    faq: [
      { question: 'Quelle quantité de texte puis-je coller en une fois ?', answer: "La limite dépend de votre formule et de la profondeur choisie ; le nombre exact de caractères figure sur la page des tarifs. Plus le contenu est long, plus il consomme de crédits." },
      { question: 'Cela fonctionne-t-il avec des textes multilingues ?', answer: 'Oui. Vous pouvez indiquer la langue de sortie séparément, et la langue des nœuds sera uniformisée.' },
      { question: 'Puis-je ajouter des nœuds enfants ensuite ?', answer: 'Oui. Sélectionnez un nœud et appuyez sur Tab pour un enfant ou sur Entrée pour un voisin.' },
    ],
  },
  'webpage-to-mind-map': {
    eyebrow: 'Outil de lecture web par IA',
    title: 'Page web en carte mentale',
    description: "Collez le lien d'un article : nous extrayons le corps du texte, écartons la navigation et la publicité, et organisons les arguments principaux en une carte à plusieurs niveaux.",
    seoTitle: "Page web en carte mentale — l'IA extrait l'article et le cartographie",
    seoDescription:
      "Collez le lien d'une page ou d'un article et l'IA en extrait le corps du texte pour bâtir une carte mentale clairement structurée. Modification, partage et export PNG, SVG et Markdown.",
    primaryKeyword: 'page web en carte mentale',
    relatedKeywords: ['convertir un article en carte mentale', 'résumer un article web', 'URL en carte mentale', 'résumé du contenu d’un site'],
    benefits: [
      { title: 'Sans le bruit de la page', description: "La navigation, les publicités et les modules de recommandation sont écartés autant que possible : reste le contenu de l'article." },
      { title: 'La structure de sens est préservée', description: "Les thèmes découlent des titres, des paragraphes et du fil de l'argumentation, non d'un découpage mécanique dans l'ordre de la page." },
      { title: "De la lecture à l'organisation, sans détour", description: "Un lien en entrée, une carte modifiable en sortie — utile pour la recherche, les favoris et le partage en équipe." },
    ],
    steps: [
      { title: 'Collez un lien public', description: "Saisissez l'adresse d'un article ou d'une page accessible sans connexion." },
      { title: 'Extraction et analyse', description: 'Nous identifions le contenu principal, le découpons, puis construisons la hiérarchie des thèmes.' },
      { title: 'Vérifiez et exportez', description: 'Contrôlez les points clés, modifiez-les, puis enregistrez ou partagez.' },
    ],
    useCases: ['Organiser des articles sectoriels et des analyses', 'Assimiler la documentation produit et les bases de connaissances', 'Comparer rapidement plusieurs références', 'Transformer des articles mis de côté en structure de révision'],
    faq: [
      { question: 'Toutes les pages web peuvent-elles être extraites ?', answer: "Les pages publiques accessibles depuis un serveur fonctionnent le mieux. Celles qui exigent une connexion, sont protégées contre les robots ou rendues entièrement côté client peuvent ne pas être extraites." },
      { question: 'Les publicités finissent-elles dans la carte ?', answer: "La détection du corps du texte filtre les zones habituelles de navigation et de publicité, mais un peu de bruit peut subsister sur les pages à structure inhabituelle." },
      { question: 'Cela marche-t-il avec les sites d’actualité et les blogs ?', answer: 'Oui : actualité, blogs, encyclopédies et documentation publique sont autant d’entrées adaptées.' },
    ],
  },
  'youtube-to-mind-map': {
    eyebrow: 'Outil de résumé vidéo par IA',
    title: 'Vidéo YouTube en carte mentale',
    description: 'Collez le lien d\'une vidéo. Nous lisons ses sous-titres et disposons le raisonnement en carte, chaque nœud portant l\'instant dont il provient : un clic ouvre la vidéo à cette seconde.',
    seoTitle: 'YouTube en carte mentale — une vidéo que vous pouvez vérifier',
    seoDescription:
      'Collez un lien YouTube et obtenez une carte mentale modifiable construite à partir des sous-titres. Chaque nœud conserve un horodatage qui ramène directement à ce moment.',
    primaryKeyword: 'youtube en carte mentale',
    relatedKeywords: ['résumé de vidéo youtube', 'vidéo en carte mentale', 'résumer une vidéo ia', 'résumé des sous-titres youtube'],
    benefits: [
      { title: 'Chaque nœud renvoie à sa seconde', description: 'Les horodatages ne sont pas décoratifs : un clic lance la vidéo à cet instant et vous entendez ce qui a réellement été dit.' },
      { title: 'Une heure de parole, à plat', description: 'Les cours et conférences deviennent une structure qui se parcourt d\'un regard, sans faire glisser la barre de lecture.' },
      { title: 'Ne regarder que l\'utile', description: 'Lisez d\'abord la carte, puis ne lisez que les passages qui vous concernent.' },
    ],
    steps: [
      { title: 'Collez le lien de la vidéo', description: 'Les liens de lecture classiques, les liens courts youtu.be et les adresses Shorts fonctionnent.' },
      { title: 'Lecture et regroupement des sous-titres', description: 'Les sous-titres sont réunis en courts passages pour préserver le sens, chacun gardant son heure de début.' },
      { title: 'Vérifiez en cliquant un horodatage', description: 'Tout nœud douteux se confronte à la vidéo elle-même en un seul clic.' },
    ],
    useCases: ['Prendre des notes de cours et de MOOC', 'Assimiler conférences et entretiens', 'Extraire la thèse d\'une longue analyse', 'Décider si une vidéo d\'une heure vaut le temps'],
    faq: [
      { question: 'Les vidéos sans sous-titres fonctionnent-elles ?', answer: 'Non. Nous lisons les sous-titres au lieu d\'écouter l\'audio : une vidéo totalement dépourvue de sous-titres ne peut pas être convertie. Les sous-titres automatiques conviennent.' },
      { question: 'Les horodatages sont-ils précis ?', answer: 'Les sous-titres sont groupés en passages d\'environ 30 secondes et l\'horodatage vise le début du passage : vous arrivez juste avant l\'idée, pas au milieu d\'une phrase.' },
      { question: 'Et les vidéos en d\'autres langues ?', answer: 'Oui, dès lors que des sous-titres existent. S\'ils ne sont pas dans la langue demandée, la carte est traduite et les notes le précisent.' },
      { question: 'Et les vidéos très longues ?', answer: 'Elles passent, mais coûtent davantage de crédits, et les limites de caractères de votre forfait s\'appliquent comme pour les documents.' },
    ],
  },
  'docx-to-mind-map': {
    eyebrow: 'Outil de structuration de documents par IA',
    title: 'Document Word en carte mentale',
    description: "Importez un DOCX : nous lisons dans l'ordre les paragraphes du corps et le texte des tableaux pour en faire une hiérarchie modifiable.",
    seoTitle: 'Word en carte mentale — transformez un DOCX en hiérarchie modifiable',
    seoDescription:
      "Importez un document Word DOCX et l'IA en extraira le texte pour bâtir une carte mentale claire et modifiable. Résumé par sections des documents longs et export en plusieurs formats.",
    primaryKeyword: 'Word en carte mentale',
    relatedKeywords: ['docx en carte mentale', 'résumer un document Word', 'créer une carte mentale depuis Word', 'doc en carte mentale'],
    benefits: [
      { title: 'On lit le document, pas la mise en page', description: "Les paragraphes du corps sont repris dans l'ordre, texte des tableaux compris : ce qui reste, c'est l'argumentation, pas l'habillage de page." },
      { title: 'Les longs documents tiennent debout', description: "Les fichiers volumineux sont résumés section par section puis fusionnés, pour qu'un cahier des charges de 60 pages ne s'effondre pas en liste plate." },
      { title: 'Une structure avec laquelle continuer', description: 'Renommez des nœuds, ajoutez des branches, repliez des niveaux et exportez en PNG, SVG ou Markdown pour votre prochain brouillon.' },
    ],
    steps: [
      { title: 'Importez votre DOCX', description: "Fichiers jusqu'à 20 Mo. L'ancien format .doc et les fichiers protégés par mot de passe ne sont pas pris en charge." },
      { title: 'Choisissez la profondeur et l’objectif', description: "Décidez du nombre de niveaux et si vous étudiez, analysez la structure ou survolez." },
      { title: 'Modifiez et exportez', description: 'Ajustez la hiérarchie sur le plan de travail, puis enregistrez, partagez ou exportez.' },
    ],
    useCases: ['Transformer un cahier des charges en structure relisable', 'Découper un long rapport en sujets', 'Organiser le brouillon d’un mémoire avant révision', 'Résumer des documents de procédure et de politique interne'],
    faq: [
      {
        question: 'Les nœuds Word portent-ils un numéro de page comme ceux des PDF ?',
        answer: "Non. Un DOCX enregistre un flux de paragraphes et non des pages fixes : les sauts n'existent qu'une fois le fichier mis en page par Word. Nous ancrons donc à la position dans le document. Si vous avez besoin de références à la page, exportez d'abord en PDF et utilisez l'outil PDF.",
      },
      { question: 'Le texte des tableaux est-il inclus ?', answer: 'Oui. Le texte des cellules est lu avec les paragraphes ordinaires. Les tableaux très larges peuvent se lire étrangement une fois aplatis en hiérarchie : vérifiez ces branches.' },
      { question: 'Et les en-têtes, pieds de page, notes et commentaires ?', answer: "Ils ne sont pas lus. Nous extrayons uniquement le corps du document, ce qui évite de retrouver dans la carte les éléments répétés de mise en page. Ce que vous voulez y voir doit figurer dans le corps du texte." },
      { question: 'Puis-je importer un ancien fichier .doc ?', answer: "Non. Seul le format DOCX actuel est pris en charge. Ouvrez le fichier dans Word ou un éditeur compatible et enregistrez-le au format .docx." },
    ],
  },
  'epub-to-mind-map': {
    eyebrow: 'Outil de structuration de livres par IA',
    title: 'Livre EPUB en carte mentale',
    description: "Les chapitres sont extraits dans l'ordre de lecture du livre, ce qui transforme un ouvrage entier en une seule structure.",
    seoTitle: 'EPUB en carte mentale — cartographier un livre entier par chapitres',
    seoDescription:
      "Importez un livre EPUB et l'IA en extraira le texte dans l'ordre de lecture pour bâtir une carte mentale modifiable où chaque nœud indique son chapitre.",
    primaryKeyword: 'EPUB en carte mentale',
    relatedKeywords: ['livre en carte mentale', 'résumer un livre numérique', 'convertir un epub en carte mentale', 'carte mentale par chapitre'],
    benefits: [
      { title: "Suit l'ordre de lecture du livre", description: "Nous lisons le spine de l'EPUB — l'ordre défini par l'éditeur — plutôt que de le deviner d'après les noms de fichiers : les chapitres apparaissent comme vous les liriez." },
      { title: 'Les nœuds indiquent leur chapitre', description: "Chaque bloc conserve le titre du chapitre dont il provient, si bien qu'une affirmation de la carte peut être ramenée à sa source." },
      { title: 'Un livre, une structure', description: "Au lieu de résumés chapitre par chapitre qui ne se rejoignent jamais, vous obtenez une hiérarchie unique où les thèmes récurrents se retrouvent ensemble." },
    ],
    steps: [
      { title: 'Importez votre EPUB', description: "Fichiers jusqu'à 20 Mo. Les livres protégés par DRM ne peuvent pas être ouverts." },
      { title: 'Choisissez la profondeur', description: "Concis pour l'ossature de l'argumentation, détaillé pour conserver davantage d'éléments d'appui." },
      { title: 'Vérifiez par chapitre et exportez', description: 'Contrôlez les mentions de chapitre sur les branches principales, modifiez, puis exportez ou partagez.' },
    ],
    useCases: ['Bâtir une trame de révision à partir d’un manuel', "Retracer l'argumentation d'un essai", 'Comparer la façon dont les chapitres développent un même thème', 'Préparer des notes avant un club de lecture ou un séminaire'],
    faq: [
      { question: 'Peut-on ouvrir les livres achetés en librairie numérique ?', answer: "Seulement si le fichier est sans DRM. Les achats protégés par DRM chez la plupart des enseignes sont chiffrés et illisibles par tout outil tiers, celui-ci compris." },
      {
        question: 'Comment les nœuds sont-ils reliés au livre ?',
        answer: "Chaque bloc extrait conserve le titre du chapitre correspondant de l'EPUB : les nœuds sont donc étiquetés par chapitre. L'EPUB n'a pas de pagination fixe — elle dépend de la liseuse et du corps de texte —, le chapitre est donc le repère fiable.",
      },
      { question: 'Y a-t-il une limite de longueur ?', answer: "Le fichier doit peser moins de 20 Mo et nous lisons jusqu'aux 500 premiers documents du spine, ce qui couvre pratiquement tout livre ordinaire. Les ouvrages très longs peuvent aussi atteindre la limite de caractères de votre formule." },
      { question: 'Cela fonctionne-t-il pour les romans ?', answer: "Cela fonctionne, mais convient bien mieux à la non-fiction. Les cartes mentales révèlent une hiérarchie et un classement ; un récit est chronologique, et sa carte se révèle souvent moins utile que le livre lui-même." },
    ],
  },
  'pptx-to-mind-map': {
    eyebrow: 'Outil de structuration de présentations par IA',
    title: 'Présentation PowerPoint en carte mentale',
    description: "Le texte est extrait diapositive par diapositive et transforme la structure de la présentation et ses arguments en une carte, avec le numéro de diapositive sur chaque nœud.",
    seoTitle: 'PowerPoint en carte mentale — diapositive par diapositive, avec numérotation',
    seoDescription:
      "Importez une présentation PPTX et l'IA extraira le texte de chaque diapositive pour bâtir une carte mentale modifiable où chaque nœud indique sa diapositive.",
    primaryKeyword: 'PowerPoint en carte mentale',
    relatedKeywords: ['pptx en carte mentale', 'résumer une présentation', 'diapositives en carte mentale', 'convertir un PowerPoint en carte mentale'],
    benefits: [
      { title: 'Chaque nœud garde sa diapositive', description: "Les nœuds portent la mention diapositive 1, diapositive 2, etc. : vérifier un point revient à ouvrir une diapositive plutôt qu'à parcourir tout le support." },
      { title: "Retrouve l'argumentation dans les diapositives", description: "Un support est conçu pour être présenté, pas lu. Regrouper le texte en hiérarchie montre ce qu'il défend réellement, et où il se répète." },
      { title: 'Comparer des supports rapidement', description: "Cartographiez deux supports sur le même sujet et les écarts de couverture sautent aux yeux, ce que le survol des diapositives ne permet pas." },
    ],
    steps: [
      { title: 'Importez votre PPTX', description: "Fichiers jusqu'à 20 Mo. Les diapositives sont lues dans l'ordre du support." },
      { title: 'Choisissez la profondeur et l’objectif', description: "Concis pour l'argument principal, détaillé pour conserver les points d'appui." },
      { title: 'Vérifiez la numérotation et exportez', description: 'Recoupez les branches principales avec leurs diapositives, modifiez, puis exportez ou partagez.' },
    ],
    useCases: ['Assimiler une intervention en conférence', 'Transformer un support de formation en structure de révision', "Vérifier que l'argumentation d'une proposition est complète", 'Comparer la couverture de plusieurs supports sur un même sujet'],
    faq: [
      { question: 'Les notes du présentateur sont-elles lues ?', answer: "Non. Nous extrayons uniquement le texte des diapositives. Un support qui cache l'essentiel dans les notes donnera une carte pauvre." },
      { question: 'Et le texte dans les images et les graphiques ?', answer: "Il ne peut pas être lu. Les images, l'audio, la vidéo et les animations ne sont pas analysés ; seul le texte des zones de texte et des espaces réservés est extrait." },
      { question: 'Les numéros de diapositive sont-ils exacts ?', answer: "Oui. Le numéro est lié au moment du découpage du contenu, selon le même mécanisme que les pages d'un PDF. Il n'est pas généré par le modèle." },
    ],
  },
};
