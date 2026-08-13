import type { ToolPageCopy } from './registry';

/** 工具页的德语文案。关键词按德语用户的实际搜索习惯选，不是英文直译。 */
export const TOOLS_DE: Record<string, ToolPageCopy> = {
  'pdf-to-mind-map': {
    eyebrow: 'KI-Werkzeug zur Dokumentstrukturierung',
    title: 'PDF zur Mindmap',
    description:
      'Laden Sie ein PDF hoch und erhalten Sie eine bearbeitbare, mehrstufige Mindmap. Abschnitte, Themen und zentrale Argumente werden automatisch erkannt, und jede Aussage behält die Seite, aus der sie stammt.',
    seoTitle: 'PDF zur Mindmap — KI erkennt Struktur und Kernaussagen',
    seoDescription:
      'Testen Sie unser kostenloses KI-Werkzeug, das PDFs in Mindmaps verwandelt. Laden Sie einen Fachartikel, Bericht oder ein E-Book hoch und erhalten Sie eine mehrstufige Map, deren Knoten ihre Quellseite behalten — mit Export als PNG, SVG und Markdown.',
    primaryKeyword: 'PDF in Mindmap umwandeln',
    relatedKeywords: ['PDF Mindmap erstellen', 'PDF mit KI zusammenfassen', 'wissenschaftliche Arbeit als Mindmap', 'PDF-Inhalte visualisieren'],
    benefits: [
      { title: 'Erst die Struktur, dann die Knoten', description: 'Statt Absatz für Absatz zu übernehmen, bestimmen wir zuerst die Themenkategorien und ordnen jede Aussage dann dem passenden Zweig zu.' },
      { title: 'Jeder Punkt bleibt nachprüfbar', description: 'Knoten behalten ihre PDF-Seitenzahl. Eine Aussage zu prüfen heißt also nicht, das gesamte Dokument erneut durchzublättern.' },
      { title: 'Nach der Erstellung weiterarbeiten', description: 'Knoten hinzufügen oder entfernen, Ebenen einklappen und als PNG, SVG oder Markdown exportieren.' },
    ],
    steps: [
      { title: 'PDF hochladen', description: 'Wählen Sie ein PDF mit auswählbarem Text. Die aktuellen Grenzen liegen bei 20 MB und 200 Seiten.' },
      { title: 'Detailtiefe und Zweck wählen', description: 'Legen Sie die Zahl der Ebenen danach fest, ob Sie überfliegen, lernen oder die Struktur analysieren wollen.' },
      { title: 'Quellen prüfen und exportieren', description: 'Sehen Sie die Seitenangaben durch, passen Sie Knoten an und speichern oder exportieren Sie das Ergebnis.' },
    ],
    useCases: ['Fachartikel schnell überblicken', 'Branchenberichte und Whitepaper durcharbeiten', 'Lehrbuchkapitel in ein Lerngerüst überführen', 'Die Struktur von Verträgen und Regelwerken herausziehen'],
    faq: [
      { question: 'Lassen sich gescannte PDFs in Mindmaps verwandeln?', answer: 'Die aktuelle Version unterstützt PDFs, deren Text sich markieren und kopieren lässt. OCR für gescannte Dokumente ist für eine spätere Version geplant.' },
      { question: 'Woher kommen die Seitenzahlen an den Knoten?', answer: 'Sie werden festgehalten, während das Dokument in Abschnitte zerlegt wird. Das Modell verweist nur auf bereits vorhandene Abschnitte, sodass jeder Knoten auf seine Seite zurückgeführt werden kann und die Zahl nie erfunden wird.' },
      { question: 'Wird mein PDF dauerhaft gespeichert?', answer: 'Die Verarbeitung liest die Datei nur, um Ihre Anfrage zu bearbeiten. Das strukturierte Ergebnis gelangt erst dann in Ihre persönliche Sammlung, wenn Sie die Mindmap speichern.' },
    ],
  },
  'text-to-mind-map': {
    eyebrow: 'KI-Werkzeug zur Inhaltsordnung',
    title: 'Text zur Mindmap',
    description: 'Fügen Sie einen Artikel, Ihre Notizen oder ein Protokoll ein — die KI ordnet die Themen in Ebenen und macht aus linearem Text eine bearbeitbare Wissensstruktur.',
    seoTitle: 'Text zur Mindmap — KI erstellt mehrstufige Maps automatisch',
    seoDescription:
      'Testen Sie unser kostenloses Werkzeug, das Text in Mindmaps verwandelt. Fügen Sie lange Texte, Notizen oder Protokolle ein, und die KI ordnet sie zu einer bearbeitbaren, exportierbaren mehrstufigen Map.',
    primaryKeyword: 'Text in Mindmap umwandeln',
    relatedKeywords: ['Mindmap aus Text erstellen', 'Mindmap Generator KI', 'Notizen als Mindmap', 'Protokoll als Mindmap'],
    benefits: [
      { title: 'Themen werden selbst erkannt', description: 'Zuerst entstehen die Hauptkategorien, dann werden die Einzelheiten darunter einsortiert — so türmt sich nicht alles am zentralen Knoten.' },
      { title: 'Drei Detailstufen', description: 'Knapp, normal oder ausführlich — passend zum Überfliegen ebenso wie zum gründlichen Lernen.' },
      { title: 'Kein starres Bild', description: 'Nach der Erstellung lassen sich Texte ändern, Knoten ergänzen, Ebenen einklappen und alles exportieren.' },
    ],
    steps: [
      { title: 'Text einfügen', description: 'Ein Artikel, ein Transkript, eine Spezifikation oder ein beliebiger langer Text.' },
      { title: 'Ziel wählen', description: 'Richten Sie das Ergebnis auf Lernen, Strukturanalyse, Besprechungen oder allgemeines Verstehen aus.' },
      { title: 'Aufräumen und mitnehmen', description: 'Prüfen Sie die Hierarchie, bearbeiten Sie sie von Hand und exportieren Sie oder erzeugen Sie einen Freigabelink.' },
    ],
    useCases: ['Lesenotizen in ein Wissensgerüst überführen', 'Protokolle in Themen und Aufgaben aufteilen', 'Produktanforderungen und Projektpläne ordnen', 'Sich schnell einen Überblick über einen langen Artikel verschaffen'],
    faq: [
      { question: 'Wie viel Text kann ich auf einmal einfügen?', answer: 'Die Grenze hängt von Ihrem Tarif und der gewählten Detailtiefe ab; die genaue Zeichenzahl steht auf der Preisseite. Längere Inhalte kosten mehr Credits.' },
      { question: 'Funktioniert das auch bei gemischtsprachigen Texten?', answer: 'Ja. Sie können die Ausgabesprache getrennt festlegen, und die Sprache der Knoten wird vereinheitlicht.' },
      { question: 'Kann ich später Unterknoten ergänzen?', answer: 'Ja. Wählen Sie einen Knoten und drücken Sie Tab für einen Unterknoten oder Enter für einen Nachbarknoten.' },
    ],
  },
  'webpage-to-mind-map': {
    eyebrow: 'KI-Werkzeug zum Weblesen',
    title: 'Webseite zur Mindmap',
    description: 'Fügen Sie einen Artikellink ein: Wir holen den Fließtext heraus, lassen Navigation und Werbung weg und ordnen die Hauptargumente in einer mehrstufigen Map.',
    seoTitle: 'Webseite zur Mindmap — KI holt den Artikel heraus und mappt ihn',
    seoDescription:
      'Fügen Sie den Link einer Webseite oder eines Artikels ein, und die KI extrahiert den Fließtext und baut daraus eine klar gegliederte Mindmap. Bearbeiten, teilen und als PNG, SVG oder Markdown exportieren.',
    primaryKeyword: 'Webseite in Mindmap umwandeln',
    relatedKeywords: ['Artikel als Mindmap', 'Webartikel zusammenfassen', 'URL zu Mindmap', 'Website-Inhalt zusammenfassen'],
    benefits: [
      { title: 'Ohne das Rauschen der Seite', description: 'Navigation, Werbung und Empfehlungsmodule werden so weit wie möglich ausgeschlossen; übrig bleibt der eigentliche Artikel.' },
      { title: 'Die Sinnstruktur bleibt erhalten', description: 'Themen ergeben sich aus Überschriften, Absätzen und Argumentationsverlauf — nicht daraus, die Seite mechanisch der Reihe nach zu zerteilen.' },
      { title: 'Vom Lesen direkt zum Ordnen', description: 'Ein Link hinein, eine bearbeitbare Map heraus — nützlich für Recherche, Lesezeichen und die Weitergabe im Team.' },
    ],
    steps: [
      { title: 'Öffentlichen Link einfügen', description: 'Geben Sie die URL eines Artikels oder einer Seite ein, die ohne Anmeldung erreichbar ist.' },
      { title: 'Extrahieren und analysieren', description: 'Wir erkennen den Hauptinhalt, zerlegen ihn und bauen daraus die Themenhierarchie.' },
      { title: 'Prüfen und exportieren', description: 'Sehen Sie die Kernpunkte durch, bearbeiten Sie sie und speichern oder teilen Sie danach.' },
    ],
    useCases: ['Branchenartikel und Nachrichtenanalysen ordnen', 'Produktdokumentation und Wissensdatenbanken durchdringen', 'Mehrere Quellen zügig vergleichen', 'Gespeicherte Artikel in eine Lernstruktur bringen'],
    faq: [
      { question: 'Lässt sich jede Webseite auslesen?', answer: 'Am besten funktionieren öffentliche Seiten, die von einem Server aus erreichbar sind. Seiten mit Anmeldepflicht, striktem Bot-Schutz oder rein clientseitigem Rendering lassen sich unter Umständen nicht auslesen.' },
      { question: 'Landen Werbeanzeigen in der Mindmap?', answer: 'Die Fließtexterkennung filtert die üblichen Navigations- und Werbebereiche heraus; bei ungewöhnlich aufgebauten Seiten kann etwas Rauschen zurückbleiben.' },
      { question: 'Funktioniert das mit Nachrichtenseiten und Blogs?', answer: 'Ja — Nachrichten, Blogs, Lexika und öffentliche Dokumentation sind allesamt geeignete Eingaben.' },
    ],
  },
  'youtube-to-mind-map': {
    eyebrow: 'KI-Werkzeug für Video-Zusammenfassungen',
    title: 'YouTube-Video zur Mindmap',
    description: 'Videolink einfügen. Wir lesen die Untertitel und legen den Gedankengang als Mindmap aus, bei der jeder Knoten seinen Zeitpunkt mitbringt — ein Klick öffnet das Video an genau dieser Sekunde.',
    seoTitle: 'YouTube zur Mindmap — ein Video, das sich überprüfen lässt',
    seoDescription:
      'YouTube-Link einfügen und aus den Untertiteln eine bearbeitbare Mindmap erhalten. Jeder Knoten trägt einen Zeitstempel, der direkt zu dieser Stelle springt.',
    primaryKeyword: 'youtube zur mindmap',
    relatedKeywords: ['youtube video zusammenfassen', 'video zur mindmap', 'video zusammenfassung ki', 'youtube untertitel zusammenfassen'],
    benefits: [
      { title: 'Jeder Knoten führt zur Sekunde zurück', description: 'Zeitstempel sind keine Zierde: Ein Klick startet das Video an dieser Stelle, und Sie hören selbst, was tatsächlich gesagt wurde.' },
      { title: 'Eine Stunde Vortrag auf einen Blick', description: 'Lange Vorlesungen und Konferenzbeiträge werden zu einer Struktur, die man überfliegen kann — kein Suchen mehr im Fortschrittsbalken.' },
      { title: 'Nur ansehen, was Sie brauchen', description: 'Erst die Mindmap lesen, dann gezielt die Abschnitte abspielen, auf die es ankommt.' },
    ],
    steps: [
      { title: 'Videolink einfügen', description: 'Normale Wiedergabelinks, youtu.be-Kurzlinks und Shorts-Adressen funktionieren alle.' },
      { title: 'Untertitel lesen und gruppieren', description: 'Untertitel werden zu kurzen Passagen zusammengefasst, damit der Sinn erhalten bleibt; jede Passage behält ihre Startzeit.' },
      { title: 'Per Zeitstempel prüfen', description: 'Jeden zweifelhaften Knoten gleichen Sie mit einem Klick am Video selbst ab.' },
    ],
    useCases: ['Notizen zu Vorlesungen und Onlinekursen', 'Konferenzvorträge und Interviews erschließen', 'Die Argumentation langer Rezensionen herausziehen', 'Entscheiden, ob ein einstündiges Video lohnt'],
    faq: [
      { question: 'Funktionieren Videos ohne Untertitel?', answer: 'Nein. Wir lesen Untertitel, statt den Ton auszuwerten — ein Video ganz ohne Untertitel lässt sich nicht umwandeln. Automatisch erzeugte Untertitel genügen.' },
      { question: 'Wie genau sind die Zeitstempel?', answer: 'Untertitel werden zu Passagen von etwa 30 Sekunden gebündelt, der Zeitstempel zeigt auf deren Anfang. So landen Sie kurz vor der Aussage und nicht mitten im Satz.' },
      { question: 'Und Videos in anderen Sprachen?', answer: 'Ja, sofern Untertitel vorhanden sind. Stimmt deren Sprache nicht mit der gewünschten überein, wird die Mindmap übersetzt und in den Notizen vermerkt.' },
      { question: 'Was ist mit sehr langen Videos?', answer: 'Die gehen, kosten aber mehr Credits; die Zeichengrenzen Ihres Tarifs gelten genauso wie bei Dokumenten.' },
    ],
  },
  'docx-to-mind-map': {
    eyebrow: 'KI-Werkzeug zur Dokumentstrukturierung',
    title: 'Word-Dokument zur Mindmap',
    description: 'Laden Sie ein DOCX hoch: Wir lesen die Absätze des Fließtexts und die Tabelleninhalte der Reihe nach und formen daraus eine bearbeitbare Hierarchie.',
    seoTitle: 'Word zur Mindmap — aus einem DOCX eine bearbeitbare Hierarchie',
    seoDescription:
      'Laden Sie ein DOCX-Word-Dokument hoch, und die KI extrahiert den Text und baut daraus eine klar gegliederte, bearbeitbare Mindmap. Mit abschnittsweiser Zusammenfassung langer Dokumente und Export in mehreren Formaten.',
    primaryKeyword: 'Word in Mindmap umwandeln',
    relatedKeywords: ['docx zu Mindmap', 'Word-Dokument zusammenfassen', 'Mindmap aus Word erstellen', 'doc in Mindmap umwandeln'],
    benefits: [
      { title: 'Gelesen wird das Dokument, nicht das Layout', description: 'Absätze des Fließtexts werden der Reihe nach übernommen, Tabelleninhalte eingeschlossen. Übrig bleibt die Argumentation, nicht das Seitenbeiwerk.' },
      { title: 'Lange Dokumente bleiben zusammenhängend', description: 'Umfangreiche Dateien werden abschnittsweise zusammengefasst und dann zusammengeführt, damit eine 60-seitige Spezifikation nicht zu einer flachen Liste zerfällt.' },
      { title: 'Eine Struktur zum Weiterarbeiten', description: 'Knoten umbenennen, Zweige ergänzen, Ebenen einklappen und für den nächsten Entwurf als PNG, SVG oder Markdown exportieren.' },
    ],
    steps: [
      { title: 'DOCX hochladen', description: 'Dateien bis 20 MB. Das alte .doc-Format und kennwortgeschützte Dateien werden nicht unterstützt.' },
      { title: 'Detailtiefe und Zweck wählen', description: 'Entscheiden Sie, wie viele Ebenen Sie möchten und ob Sie lernen, die Struktur analysieren oder überfliegen.' },
      { title: 'Bearbeiten und exportieren', description: 'Passen Sie die Hierarchie auf der Arbeitsfläche an und speichern, teilen oder exportieren Sie sie dann.' },
    ],
    useCases: ['Eine Spezifikation in eine prüfbare Struktur bringen', 'Einen langen Bericht in Themen zerlegen', 'Den Entwurf einer Abschlussarbeit vor der Überarbeitung ordnen', 'Richtlinien- und Prozessdokumente zusammenfassen'],
    faq: [
      {
        question: 'Tragen Word-Knoten Seitenzahlen wie PDF-Knoten?',
        answer: 'Nein. Ein DOCX speichert einen Absatzfluss und keine festen Seiten — Seitenumbrüche entstehen erst, wenn Word die Datei setzt. Deshalb verankern wir an der Position im Dokument. Wenn Sie Angaben auf Seitenebene brauchen, exportieren Sie zuerst nach PDF und nutzen Sie das PDF-Werkzeug.',
      },
      { question: 'Wird Text in Tabellen mitgelesen?', answer: 'Ja. Tabellentext wird zusammen mit den normalen Absätzen gelesen. Sehr breite Tabellen können sich beim Einebnen in eine Hierarchie seltsam lesen — prüfen Sie diese Zweige.' },
      { question: 'Was ist mit Kopf- und Fußzeilen, Fußnoten und Kommentaren?', answer: 'Sie werden nicht gelesen. Wir extrahieren nur den Hauptteil des Dokuments, damit wiederkehrendes Seitenbeiwerk nicht in der Map landet. Was in der Map erscheinen soll, gehört in den Fließtext.' },
      { question: 'Kann ich eine alte .doc-Datei hochladen?', answer: 'Nein. Unterstützt wird nur das aktuelle DOCX-Format. Öffnen Sie die Datei in Word oder einem kompatiblen Editor und speichern Sie sie als .docx.' },
    ],
  },
  'epub-to-mind-map': {
    eyebrow: 'KI-Werkzeug zur E-Book-Strukturierung',
    title: 'EPUB-E-Book zur Mindmap',
    description: 'Die Kapitel werden in der Lesereihenfolge des Buches ausgelesen, sodass aus einem ganzen Buch eine einzige Struktur wird.',
    seoTitle: 'EPUB zur Mindmap — ein ganzes Buch kapitelweise erschließen',
    seoDescription:
      'Laden Sie ein EPUB-E-Book hoch, und die KI liest den Text in Lesereihenfolge aus und baut daraus eine bearbeitbare Mindmap mit Kapitelangaben.',
    primaryKeyword: 'EPUB in Mindmap umwandeln',
    relatedKeywords: ['Buch als Mindmap', 'E-Book zusammenfassen', 'epub zu Mindmap erstellen', 'Buchkapitel als Mindmap'],
    benefits: [
      { title: 'Folgt der Lesereihenfolge des Buches', description: 'Wir lesen den Spine des EPUB — die vom Verlag festgelegte Reihenfolge — statt sie aus Dateinamen zu erraten, damit die Kapitel so erscheinen, wie Sie sie lesen würden.' },
      { title: 'Knoten nennen ihr Kapitel', description: 'Jeder Block behält seinen Kapiteltitel, sodass sich eine Aussage in der Map bis zu ihrem Kapitel zurückverfolgen lässt.' },
      { title: 'Ein Buch, eine Struktur', description: 'Statt Kapitelzusammenfassungen, die nie zusammenfinden, entsteht eine einzige Hierarchie, in der wiederkehrende Themen beieinanderstehen.' },
    ],
    steps: [
      { title: 'EPUB hochladen', description: 'Dateien bis 20 MB. DRM-geschützte E-Books lassen sich nicht öffnen.' },
      { title: 'Detailtiefe wählen', description: 'Knapp für das Gerüst der Argumentation, ausführlich, um mehr Belegmaterial zu behalten.' },
      { title: 'Kapitelweise prüfen und exportieren', description: 'Sehen Sie die Kapitelangaben an den wichtigsten Zweigen durch, bearbeiten Sie sie und exportieren oder teilen Sie dann.' },
    ],
    useCases: ['Aus einem Lehrbuch ein Lerngerüst bauen', 'Die Argumentation eines Sachbuchs nachzeichnen', 'Vergleichen, wie Kapitel dasselbe Thema entfalten', 'Notizen für einen Lesekreis oder ein Seminar vorbereiten'],
    faq: [
      { question: 'Lassen sich im Handel gekaufte E-Books öffnen?', answer: 'Nur wenn die Datei DRM-frei ist. Mit DRM geschützte Käufe der großen Händler sind verschlüsselt und für kein Drittanbieter-Werkzeug lesbar, auch nicht für dieses.' },
      {
        question: 'Wie hängen die Knoten mit dem Buch zusammen?',
        answer: 'Jeder ausgelesene Block behält den Kapiteltitel des betreffenden EPUB-Abschnitts, sodass Knoten nach Kapitel gekennzeichnet sind. EPUB kennt keine festen Seitenzahlen — sie hängen von Lesegerät und Schriftgröße ab —, deshalb ist das Kapitel der verlässliche Anker.',
      },
      { question: 'Gibt es eine Längenbegrenzung für das Buch?', answer: 'Die Datei muss unter 20 MB liegen, und wir lesen bis zu den ersten 500 Dokumenten des Spine, was praktisch jedes normale Buch abdeckt. Sehr lange Bücher können zusätzlich an das Zeichenlimit Ihres Tarifs stoßen.' },
      { question: 'Funktioniert das bei Romanen?', answer: 'Es funktioniert, passt aber weit besser zu Sachbüchern. Mindmaps zeigen Hierarchie und Einordnung; erzählende Literatur verläuft chronologisch, und eine Map davon nützt meist weniger als das Buch selbst.' },
    ],
  },
  'pptx-to-mind-map': {
    eyebrow: 'KI-Werkzeug zur Präsentationsstrukturierung',
    title: 'PowerPoint-Präsentation zur Mindmap',
    description: 'Der Text wird Folie für Folie ausgelesen und macht aus dem Aufbau der Präsentation und ihren Kernaussagen eine Map — mit der Foliennummer an jedem Knoten.',
    seoTitle: 'PowerPoint zur Mindmap — Folie für Folie, mit Foliennummern',
    seoDescription:
      'Laden Sie eine PPTX-Präsentation hoch, und die KI liest den Text jeder Folie aus und baut daraus eine bearbeitbare Mindmap, in der jeder Knoten seine Folie nennt.',
    primaryKeyword: 'PowerPoint in Mindmap umwandeln',
    relatedKeywords: ['pptx zu Mindmap', 'Präsentation zusammenfassen', 'Folien als Mindmap', 'Mindmap aus PowerPoint erstellen'],
    benefits: [
      { title: 'Jeder Knoten nennt seine Folie', description: 'Knoten sind mit Folie 1, Folie 2 und so weiter gekennzeichnet. Eine Aussage zu prüfen heißt also, eine Folie zu öffnen statt sich durch den gesamten Foliensatz zu klicken.' },
      { title: 'Holt die Argumentation aus den Folien', description: 'Foliensätze werden zum Vortragen gebaut, nicht zum Lesen. Erst als Hierarchie zeigt sich, was der Satz eigentlich behauptet — und wo er sich wiederholt.' },
      { title: 'Präsentationen schnell vergleichen', description: 'Mappen Sie zwei Foliensätze zum selben Thema, und die Unterschiede im Umfang treten deutlich hervor — anders als beim Durchblättern.' },
    ],
    steps: [
      { title: 'PPTX hochladen', description: 'Dateien bis 20 MB. Die Folien werden in der Reihenfolge des Foliensatzes gelesen.' },
      { title: 'Detailtiefe und Zweck wählen', description: 'Knapp für die Hauptaussage, ausführlich, um die untermauernden Punkte zu behalten.' },
      { title: 'Foliennummern prüfen und exportieren', description: 'Gleichen Sie die wichtigsten Zweige mit ihren Folien ab, bearbeiten Sie sie und exportieren oder teilen Sie dann.' },
    ],
    useCases: ['Einen Konferenzvortrag durchdringen', 'Schulungsunterlagen in eine Lernstruktur bringen', 'Prüfen, ob die Argumentation eines Angebots vollständig ist', 'Den Umfang mehrerer Präsentationen zum selben Thema vergleichen'],
    faq: [
      { question: 'Werden die Notizen des Vortragenden gelesen?', answer: 'Nein. Wir lesen nur den Text auf den Folien. Ein Foliensatz, der das Wesentliche in den Notizen versteckt, ergibt eine dünne Map.' },
      { question: 'Und Text in Bildern und Diagrammen?', answer: 'Der lässt sich nicht lesen. Bilder, Audio, Video und Animationen werden nicht ausgewertet; ausgelesen wird nur Text aus Textfeldern und Platzhaltern.' },
      { question: 'Stimmen die Foliennummern an den Knoten?', answer: 'Ja. Die Nummer wird beim Zerlegen des Inhalts gebunden, nach demselben Verfahren wie die Seitenzahlen eines PDF. Sie stammt nicht vom Modell.' },
    ],
  },
};
