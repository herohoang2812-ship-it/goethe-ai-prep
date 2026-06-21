export const DIAGNOSTIC_SECTIONS = [
  { id: 'lesen', label: 'Lesen', minutes: 8, description: 'Đọc chi tiết, ý chính và paraphrase.' },
  { id: 'hoeren', label: 'Hören', minutes: 7, description: 'Nghe ý chính và thông tin cụ thể; mỗi đoạn một lần.' },
  { id: 'schreiben', label: 'Schreiben', minutes: 12, description: 'Viết một Forumsbeitrag ngắn có lập luận.' },
  { id: 'sprechen', label: 'Sprechen', minutes: 8, description: 'Trình bày quan điểm theo cấu trúc B2.' },
];

export const DIAGNOSTIC_LESEN = {
  passage: `Immer mehr Hochschulen bieten sogenannte Lernpatenschaften an. Dabei begleiten Studierende aus höheren Semestern Studienanfänger während der ersten Monate. Anders als bei einer fachlichen Nachhilfe geht es vor allem darum, den Studienalltag zu organisieren, Kontakte zu knüpfen und passende Beratungsangebote zu finden. Eine Untersuchung der Universität Mainz zeigt, dass Teilnehmende ihr Studium seltener abbrechen. Entscheidend sei allerdings eine gute Vorbereitung der Patinnen und Paten. Ohne klare Rollen könnten sie sich für Probleme verantwortlich fühlen, die professionelle Beratung erfordern. Deshalb empfehlen Forschende regelmäßige Schulungen und feste Ansprechpersonen an der Hochschule.`,
  questions: [
    { id: 'DL1', question: 'Was ist das Hauptziel der Lernpatenschaften?', options: ['Prüfungen für Anfänger korrigieren', 'Beim Einstieg in den Studienalltag helfen', 'Fachliche Vorlesungen ersetzen'], correct: 1, skill: 'Ý chính' },
    { id: 'DL2', question: 'Welches Ergebnis nennt die Untersuchung?', options: ['Teilnehmende wechseln häufiger das Fach', 'Patinnen verdienen bessere Noten', 'Teilnehmende brechen seltener ab'], correct: 2, skill: 'Chi tiết' },
    { id: 'DL3', question: 'Welche Gefahr besteht ohne klare Rollen?', options: ['Paten übernehmen unpassende Verantwortung', 'Beratungsstellen werden geschlossen', 'Anfänger verlieren ihre Studienplätze'], correct: 0, skill: 'Suy luận' },
    { id: 'DL4', question: 'Was wird den Hochschulen empfohlen?', options: ['Weniger persönliche Kontakte', 'Schulungen und feste Ansprechpartner', 'Nur digitale Lernmaterialien'], correct: 1, skill: 'Paraphrase' },
  ],
};

export const DIAGNOSTIC_HOEREN = [
  { id: 'DH1', speaker: 'Moderatorin', text: 'Das Bürgerbüro bleibt am kommenden Montag wegen einer internen Fortbildung geschlossen. Bereits vereinbarte Termine werden automatisch auf Dienstag zur gleichen Uhrzeit verschoben.', question: 'Was passiert mit Terminen am Montag?', options: ['Sie fallen ersatzlos aus', 'Sie werden auf Dienstag verschoben', 'Sie finden online statt'], correct: 1, skill: 'Thông tin cụ thể' },
  { id: 'DH2', speaker: 'Student', text: 'Ich wollte zuerst allein für die Prüfung lernen. In der Lerngruppe merke ich aber schneller, welche Themen ich noch nicht wirklich erklären kann. Genau das hilft mir am meisten.', question: 'Welchen Vorteil sieht der Student?', options: ['Er erkennt eigene Wissenslücken', 'Er muss weniger Themen lernen', 'Er bekommt fertige Lösungen'], correct: 0, skill: 'Ý chính' },
  { id: 'DH3', speaker: 'Nachricht', text: 'Der Regionalzug nach Köln fährt heute abweichend von Gleis sieben. Wegen einer technischen Störung beträgt die Verspätung voraussichtlich zwanzig Minuten.', question: 'Welche Information ist richtig?', options: ['Der Zug fällt aus', 'Nur das Gleis ändert sich', 'Gleis und Abfahrtszeit ändern sich'], correct: 2, skill: 'Kết hợp chi tiết' },
  { id: 'DH4', speaker: 'Expertin', text: 'Flexible Arbeitszeiten erhöhen nicht automatisch die Zufriedenheit. Beschäftigte profitieren nur dann, wenn sie ihre Arbeitszeit tatsächlich mitgestalten können und nicht ständig erreichbar sein müssen.', question: 'Unter welcher Bedingung helfen flexible Arbeitszeiten?', options: ['Wenn Beschäftigte mitentscheiden können', 'Wenn alle länger erreichbar sind', 'Wenn es keine festen Pausen gibt'], correct: 0, skill: 'Điều kiện & paraphrase' },
];

export const DIAGNOSTIC_WRITING = {
  title: 'Sollten Innenstädte weitgehend autofrei werden?',
  prompt: 'Viết một Forumsbeitrag khoảng 80–100 từ. Nêu quan điểm, một lợi ích, một bất lợi và đề xuất giải pháp.',
  requirements: ['quan điểm cá nhân', 'một lợi ích', 'một bất lợi', 'một giải pháp'],
};

export const DIAGNOSTIC_SPEAKING = {
  title: 'Online-Unterricht oder Präsenzunterricht?',
  prompt: 'Nói 60–90 giây: giới thiệu chủ đề, nêu quan điểm, đưa một ví dụ và kết luận. Có thể nhập transcript nếu trình duyệt không nhận giọng nói.',
};