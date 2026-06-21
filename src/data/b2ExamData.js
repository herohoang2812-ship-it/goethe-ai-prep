export const B2_LESEN_PARTS = [
  {
    id: 'L1', title: 'Teil 1 · Quan điểm trong diễn đàn', minutes: 18, format: 'Ghép 9 phát biểu với 4 người; một người có thể được chọn nhiều lần.',
    passage: `Lea: Seit einem Jahr kaufe ich fast nichts Neues. Mir hilft eine feste Liste, damit ich mich nicht von Werbung verführen lasse. Auf Reisen möchte ich aber nicht auf Komfort verzichten.\n\nMurat: Minimalismus bedeutet für mich vor allem mehr Zeit. Ich habe mein Auto verkauft und teile Werkzeuge mit den Nachbarn. Das spart Geld und schafft Kontakte.\n\nSophie: Ich trenne mich ungern von Erinnerungsstücken. Bei Kleidung bin ich dagegen konsequent: Was ich zwölf Monate nicht getragen habe, verschenke ich.\n\nJonas: Beruflich brauche ich viele technische Geräte. Privat versuche ich, digital aufzuräumen und Benachrichtigungen auszuschalten. Weniger Ablenkung verbessert meine Konzentration.`,
    questions: [
      ['Wer schützt sich mit einer Einkaufsliste vor spontanen Käufen?',0],['Wer sieht Teilen auch als soziale Chance?',1],['Wer behält persönliche Erinnerungen?',2],['Wer reduziert digitale Ablenkungen?',3],['Wer verzichtet auf ein eigenes Verkehrsmittel?',1],['Wer sortiert Kleidung nach einer Zeitregel aus?',2],['Wer macht im Urlaub eine Ausnahme?',0],['Wer benötigt Technik aus beruflichen Gründen?',3],['Wer verbindet Minimalismus hauptsächlich mit gewonnener Zeit?',1]
    ].map((q,i)=>({id:`L1-${i+1}`,question:q[0],options:['Lea','Murat','Sophie','Jonas'],correct:q[1],explanation:'Die passende Aussage steht im jeweiligen Personenabschnitt.'}))
  },
  {
    id: 'L2', title: 'Teil 2 · Câu chèn vào văn bản', minutes: 12, format: 'Chọn câu phù hợp cho 6 chỗ trống; 2 câu không dùng.',
    passage: `Lernen im Schlaf?\nViele Menschen hoffen, neue Inhalte ohne Anstrengung aufnehmen zu können. [1] Forschende unterscheiden jedoch klar zwischen Lernen und Festigen. [2] Im Schlaf ordnet das Gehirn Informationen, die tagsüber aufgenommen wurden. [3] Besonders wichtig ist dabei die Tiefschlafphase. [4] Wer vor einer Prüfung die ganze Nacht lernt, verzichtet deshalb auf einen entscheidenden Teil des Lernprozesses. [5] Auch kurze Pausen am Tag helfen, neue Verbindungen zu stabilisieren. [6] Erfolgreiches Lernen bleibt also eine Kombination aus aktiver Beschäftigung, Erholung und Wiederholung.`,
    sentenceOptions: ['A. Ganz ohne vorherige Beschäftigung mit dem Stoff funktioniert das allerdings nicht.','B. Deshalb genügt es, ein Lehrbuch unter das Kopfkissen zu legen.','C. Neue Vokabeln müssen zunächst bewusst gelernt werden.','D. In dieser Zeit werden Gedächtnisinhalte besonders intensiv verarbeitet.','E. Schlaf ist damit kein Ersatz, sondern ein wichtiger Partner des Lernens.','F. Das erklärt, warum ausreichender Schlaf die Erinnerungsleistung verbessert.','G. Sport sollte vor jeder Prüfung vermieden werden.','H. Dabei spielt auch die regelmäßige Wiederholung eine Rolle.'],
    questions: [['Lücke 1',0],['Lücke 2',2],['Lücke 3',7],['Lücke 4',3],['Lücke 5',5],['Lücke 6',4]].map((q,i)=>({id:`L2-${i+1}`,question:q[0],options:['A','B','C','D','E','F','G','H'],correct:q[1],explanation:'Achten Sie auf logische Bezüge, Pronomen und Konnektoren vor und nach der Lücke.'}))
  },
  {
    id: 'L3', title: 'Teil 3 · Bài báo chuyên sâu', minutes: 12, format: 'Đọc bài báo và chọn 1 trong 3 đáp án cho 6 câu.',
    passage: `Reparieren statt wegwerfen\nIn vielen Städten entstehen sogenannte Repair-Cafés. Dort unterstützen ehrenamtliche Fachleute Besucher dabei, defekte Geräte selbst zu reparieren. Ziel ist nicht nur, Abfall zu vermeiden. Die Initiativen möchten auch Wissen weitergeben, das im Alltag zunehmend verloren geht. Nicht jedes Gerät lässt sich retten: Ersatzteile fehlen oder Gehäuse sind so konstruiert, dass sie kaum geöffnet werden können. Die Organisatoren fordern deshalb ein Recht auf Reparatur. Hersteller sollen Ersatzteile und Anleitungen länger bereitstellen. Kritiker befürchten höhere Produktionskosten. Erste Untersuchungen zeigen jedoch, dass langlebige Produkte neue Geschäftsmodelle ermöglichen können, etwa Wartungsverträge und den Verkauf geprüfter Gebrauchtgeräte.`,
    questions: [
      ['Welches zusätzliche Ziel haben Repair-Cafés?',['Kostenlose Neugeräte verteilen','Praktisches Wissen erhalten','Hersteller ersetzen'],1],
      ['Warum scheitern manche Reparaturen?',['Geräte lassen sich schwer öffnen','Besucher haben kein Interesse','Strom ist zu teuer'],0],
      ['Was fordern die Organisatoren?',['Ein Verbot elektronischer Geräte','Ein Recht auf Reparatur','Kürzere Garantien'],1],
      ['Was sollen Hersteller länger anbieten?',['Werbung und Rabatte','Ersatzteile und Anleitungen','Kostenlose Kurse'],1],
      ['Welche Sorge haben Kritiker?',['Mehr Produktionskosten','Weniger Arbeitsplätze in Cafés','Zu viele Gebrauchtgeräte'],0],
      ['Welche Chance nennen Untersuchungen?',['Neue Geschäftsmodelle','Weniger Produktvielfalt','Vollständige Abfallvermeidung'],0]
    ].map((q,i)=>({id:`L3-${i+1}`,question:q[0],options:q[1],correct:q[2],explanation:'Die Lösung ergibt sich aus der entsprechenden Textstelle, oft als Paraphrase.'}))
  },
  {
    id: 'L4', title: 'Teil 4 · Ý kiến và tiêu đề', minutes: 12, format: 'Ghép 6 ý kiến với tiêu đề phù hợp; 1 ý kiến không dùng.',
    passage: `a) Digitale Arbeit spart Pendelzeit, aber mir fehlt der spontane Austausch.\nb) Im Homeoffice kann ich mich besser konzentrieren als im Großraumbüro.\nc) Ohne klare Arbeitszeiten beantworte ich E-Mails bis spät am Abend.\nd) Zwei Bürotage pro Woche sind für unser Team der beste Kompromiss.\ne) Nicht jede Wohnung bietet einen ruhigen Arbeitsplatz.\nf) Unternehmen sparen Bürofläche, sollten aber Ausstattung zu Hause finanzieren.\ng) Für neue Mitarbeitende ist persönlicher Kontakt besonders wichtig.`,
    questions: [['Bessere Konzentration',1],['Grenzen zwischen Beruf und Freizeit',2],['Hybride Lösung',3],['Ungeeignete Wohnbedingungen',4],['Verantwortung des Arbeitgebers',5],['Einarbeitung im direkten Kontakt',6]].map((q,i)=>({id:`L4-${i+1}`,question:q[0],options:['a','b','c','d','e','f','g'],correct:q[1],explanation:'Suchen Sie die zentrale Aussage, nicht nur gleiche Wörter.'}))
  },
  {
    id: 'L5', title: 'Teil 5 · Quy định và mục lục', minutes: 6, format: 'Ghép 3 đoạn quy định với tiêu đề; 4 tiêu đề không dùng.',
    passage: `§ 4 Studierende müssen sich bis zum 15. Januar online für Prüfungen registrieren. Eine verspätete Anmeldung ist nur mit schriftlicher Begründung möglich.\n\n§ 7 Wer wegen Krankheit nicht teilnehmen kann, muss innerhalb von drei Werktagen ein ärztliches Attest einreichen.\n\n§ 12 Prüfungsergebnisse werden spätestens sechs Wochen nach dem Termin im Hochschulportal veröffentlicht.`,
    headingOptions: ['A Anmeldung zur Prüfung','B Prüfungsräume','C Rücktritt aus gesundheitlichen Gründen','D Bekanntgabe der Ergebnisse','E Wiederholung der Prüfung','F Hilfsmittel','G Datenschutz'],
    questions: [['Welche Überschrift passt zu § 4?',0],['Welche Überschrift passt zu § 7?',2],['Welche Überschrift passt zu § 12?',3]].map((q,i)=>({id:`L5-${i+1}`,question:q[0],options:['A','B','C','D','E','F','G'],correct:q[1],explanation:'Ordnen Sie die Funktion des Paragrafen der Überschrift zu.'}))
  }
];

const mc=(part,items)=>items.map((q,i)=>({
  id:`${part}-${i+1}`,
  question:q[0],
  options:q[1],
  correct:q[2],
  explanation:'Die Antwort wird im Hörtext sinngemäß genannt.',
  keyword:q[3] || q[1][q[2]],
  paraphrase:q[4] || `Im Hörtext wird die richtige Option „${q[1][q[2]]}“ sinngemäß statt wortgleich ausgedrückt.`,
  trap:q[5] || 'Distraktoren greifen einzelne Wörter oder naheliegende Annahmen auf, verändern aber die Kernaussage.'
}));
export const B2_HOREN_PARTS = [
  { id:'H1', title:'Teil 1 · 5 Gespräche und Äußerungen', maxPlays:1, format:'Jeden Text einmal hören; pro Text Richtig/Falsch und Multiple Choice.', segments:[
    {speaker:'Ansage',text:'Wegen Bauarbeiten fährt die Linie 8 heute nur bis Marktplatz. Fahrgäste zum Hauptbahnhof steigen dort in den Ersatzbus um.'},
    {speaker:'Frau',text:'Seit ich morgens mit dem Fahrrad fahre, komme ich wacher ins Büro. Bei starkem Regen nehme ich allerdings die Straßenbahn.'},
    {speaker:'Mann',text:'Das Praktikum war anspruchsvoll. Gerade weil ich eigene Aufgaben übernehmen durfte, habe ich viel gelernt.'},
    {speaker:'Frau',text:'Ich bezahle fast alles mit Karte. Auf dem Wochenmarkt brauche ich aber weiterhin Bargeld.'},
    {speaker:'Mann',text:'Der Vortrag beginnt nicht wie angekündigt um achtzehn Uhr, sondern eine halbe Stunde später im Saal drei.'}
  ], questions:mc('H1',[
    ['Die Linie 8 fährt heute direkt zum Hauptbahnhof.',['Richtig','Falsch'],1],['Wo steigen Fahrgäste um?',['Am Marktplatz','Am Rathaus','Am Flughafen'],0],
    ['Die Frau fährt bei jedem Wetter Rad.',['Richtig','Falsch'],1],['Wann nutzt sie die Straßenbahn?',['Bei Kälte','Bei starkem Regen','Am Wochenende'],1],
    ['Der Mann hatte im Praktikum nur einfache Aufgaben.',['Richtig','Falsch'],1],['Warum fand er das Praktikum lehrreich?',['Er bekam Verantwortung','Es war sehr kurz','Er verdiente viel'],0],
    ['Die Frau verzichtet völlig auf Bargeld.',['Richtig','Falsch'],1],['Wo braucht sie Bargeld?',['Im Supermarkt','Auf dem Wochenmarkt','Im Restaurant'],1],
    ['Der Vortrag beginnt um 18 Uhr.',['Richtig','Falsch'],1],['Wann beginnt er?',['17:30 Uhr','18:30 Uhr','19:00 Uhr'],1]
  ])},
  { id:'H2', title:'Teil 2 · Radiointerview', maxPlays:2, format:'Interview zweimal hören; 6 Multiple-Choice-Aufgaben.', segments:[
    {speaker:'Moderator',text:'Frau Keller, warum werden Stadtbibliotheken trotz digitaler Medien wieder beliebter?'},
    {speaker:'Expertin',text:'Sie verleihen längst nicht mehr nur Bücher. Viele bieten Arbeitsplätze, Sprachcafés und technische Geräte. Entscheidend ist, dass man sich dort ohne Konsumzwang aufhalten kann.'},
    {speaker:'Moderator',text:'Welche Herausforderung sehen Sie?'},
    {speaker:'Expertin',text:'Die Nachfrage steigt schneller als das Personal. Kooperationen mit Schulen und Ehrenamtlichen helfen, ersetzen aber keine dauerhaft finanzierten Fachkräfte.'},
    {speaker:'Moderator',text:'Und wie sieht die Zukunft aus?'},
    {speaker:'Expertin',text:'Bibliotheken werden stärker zu Lern- und Begegnungsorten. Digitale Angebote bleiben wichtig, doch persönliche Beratung gewinnt gerade wegen der Informationsflut an Bedeutung.'}
  ], questions:mc('H2',[
    ['Was bieten moderne Bibliotheken zusätzlich?',['Nur E-Books','Arbeitsplätze und Sprachcafés','Kostenpflichtige Büros'],1],
    ['Was ist laut Keller besonders wichtig?',['Aufenthalt ohne Kaufpflicht','Längere Leihfristen','Mehr Werbung'],0],
    ['Was wächst schneller als das Personal?',['Die Miete','Die Nachfrage','Der Buchbestand'],1],
    ['Was können Ehrenamtliche nicht ersetzen?',['Schulkooperationen','Dauerhaft finanzierte Fachkräfte','Digitale Geräte'],1],
    ['Zu welchen Orten entwickeln sich Bibliotheken?',['Reinen Archiven','Lern- und Begegnungsorten','Verkaufszentren'],1],
    ['Warum wird persönliche Beratung wichtiger?',['Wegen der Informationsflut','Wegen weniger Medien','Wegen kürzerer Öffnungszeiten'],0]
  ])},
  { id:'H3', title:'Teil 3 · Gespräch mit mehreren Personen', maxPlays:1, format:'Gespräch einmal hören; Aussagen den Sprechenden zuordnen.', segments:[
    {speaker:'Moderator',text:'Heute diskutieren wir über eine autofreie Innenstadt. Frau Brandt?'},
    {speaker:'Frau Brandt',text:'Weniger Autos bedeuten bessere Luft. Lieferdienste brauchen aber feste Zeitfenster, sonst leiden kleine Geschäfte.'},
    {speaker:'Herr Yilmaz',text:'Ich betreibe ein Café. Mehr Platz für Fußgänger wäre gut, doch meine älteren Gäste müssen den Ort weiterhin erreichen können.'},
    {speaker:'Moderator',text:'Der Nahverkehr müsste also zuerst ausgebaut werden.'},
    {speaker:'Frau Brandt',text:'Genau, Verbote allein reichen nicht. Sichere Radwege und häufigere Busse müssen vorher da sein.'},
    {speaker:'Herr Yilmaz',text:'Und Entscheidungen sollten zunächst in einem begrenzten Testgebiet erprobt werden.'}
  ], questions:mc('H3',[
    ['Wer betont die bessere Luft?',['Moderator','Frau Brandt','Herr Yilmaz'],1],
    ['Wer denkt besonders an kleine Geschäfte?',['Moderator','Frau Brandt','Herr Yilmaz'],1],
    ['Wer erwähnt ältere Besucher?',['Moderator','Frau Brandt','Herr Yilmaz'],2],
    ['Wer fordert zuerst besseren Nahverkehr?',['Moderator','Frau Brandt','Herr Yilmaz'],0],
    ['Wer nennt sichere Radwege?',['Moderator','Frau Brandt','Herr Yilmaz'],1],
    ['Wer schlägt ein Testgebiet vor?',['Moderator','Frau Brandt','Herr Yilmaz'],2]
  ])},
  { id:'H4', title:'Teil 4 · Kurzer Vortrag', maxPlays:2, format:'Vortrag zweimal hören; 8 Multiple-Choice-Aufgaben.', segments:[
    {speaker:'Dozentin',text:'Guten Abend. Mein Thema ist nachhaltiger Konsum. Viele Menschen achten beim Kauf auf den Preis, unterschätzen aber die Nutzungsdauer. Ein teureres Gerät kann günstiger sein, wenn es repariert werden kann und lange hält. Umweltzeichen helfen, doch nicht jedes Siegel wird unabhängig geprüft. Deshalb sollte man Kriterien und Herausgeber kennen. Besonders wirksam ist es, Produkte gemeinsam zu nutzen, gebraucht zu kaufen oder vor einer Anschaffung zu prüfen, ob man sie wirklich braucht. Politik und Hersteller tragen ebenfalls Verantwortung: transparente Lieferketten, verfügbare Ersatzteile und verständliche Informationen erleichtern bewusste Entscheidungen. Verbraucher allein können komplexe Produktionsbedingungen nicht vollständig kontrollieren.'}
  ], questions:mc('H4',[
    ['Was unterschätzen viele Käufer?',['Die Lieferzeit','Die Nutzungsdauer','Die Verpackung'],1],
    ['Wann kann ein teureres Gerät günstiger sein?',['Wenn es lange hält','Wenn es Werbung gibt','Wenn es importiert wird'],0],
    ['Was gilt für Umweltzeichen?',['Alle sind unabhängig','Man sollte Herausgeber kennen','Sie sind unnötig'],1],
    ['Welche Handlung nennt die Dozentin?',['Produkte teilen','Mehr neu kaufen','Verpackungen sammeln'],0],
    ['Was sollte man vor dem Kauf prüfen?',['Ob man das Produkt braucht','Ob Freunde es besitzen','Ob es modern aussieht'],0],
    ['Was sollen Hersteller anbieten?',['Kürzere Garantien','Verfügbare Ersatzteile','Weniger Informationen'],1],
    ['Was erleichtert bewusste Entscheidungen?',['Transparente Lieferketten','Häufige Modellwechsel','Komplexe Siegel'],0],
    ['Warum reicht individuelles Handeln nicht aus?',['Produktion ist zu komplex','Verbraucher interessieren sich nicht','Produkte sind immer billig'],0]
  ])}
];