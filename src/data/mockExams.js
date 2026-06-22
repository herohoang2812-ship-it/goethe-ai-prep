// ─────────────────────────────────────────────────────────────────────────────
// mockExams.js — Định nghĩa 3 bộ đề thi thử B1 chuẩn Goethe-Zertifikat
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EXAMS = [
  {
    "id": "ausbildung",
    "title": "Đề 1: Chuẩn bị du học nghề (Điều dưỡng - Ausbildung)",
    "level": "B1",
    "lesen": {
      "title": "Lesen (Đọc hiểu)",
      "timeLimit": 3900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?",
          "text": "**Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?**\n\n### „Mein erster Monat als Pflege-Azubi in Deutschland\" – Blog von Linh (22, aus Vietnam)\n\nHallo zusammen! Ich heiße Linh und komme aus Vietnam. Seit vier Wochen lebe ich in Hannover und mache eine Ausbildung zur Pflegefachkraft. Am Anfang war alles neu und ein bisschen anstrengend: die Sprache, das Wetter, das Essen und natürlich die Arbeit im Krankenhaus. Mein erster Arbeitstag war ziemlich aufregend. Ich musste vielen neuen Kollegen die Hand geben und mir alle Namen merken – das war gar nicht so einfach! Zum Glück ist mein Team sehr freundlich. Eine Kollegin, Frau Bauer, erklärt mir geduldig alles, auch wenn ich manche Wörter noch nicht kenne.\n\nIn der Berufsschule lerne ich zwei Tage pro Woche Theorie, zum Beispiel Anatomie oder wie man Medikamente richtig verteilt. Die anderen drei Tage arbeite ich auf der Station. Am Anfang hatte ich Angst, etwas falsch zu machen, aber jetzt fühle ich mich schon sicherer. Was mir hier besonders gefällt: Die Patienten bedanken sich oft, und ich merke, dass meine Arbeit wirklich wichtig ist. Schwierig finde ich noch den deutschen Papierkram – es gibt so viele Formulare! Aber meine Mentorin hilft mir dabei.\n\nAm Wochenende treffe ich mich oft mit anderen Azubis aus Vietnam, dann kochen wir zusammen und sprechen über unsere Erfahrungen. Das tut gut, denn manchmal ist man auch traurig, weil die Familie so weit weg ist. Trotzdem bin ich froh, dass ich diesen Weg gewählt habe.",
          "questions": [
            {
              "id": 1,
              "text": "Linh lebt seit einem Monat in Hannover.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "Linh konnte sich von Anfang an alle Namen der Kollegen merken.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 3,
              "text": "Frau Bauer hilft Linh geduldig, auch wenn sie Wörter nicht kennt.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 4,
              "text": "Linh ist jeden Tag der Woche in der Berufsschule.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 5,
              "text": "Linh trifft sich am Wochenende manchmal mit anderen vietnamesischen Azubis.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).",
          "text": "**Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).**\n\n### „Fachkräftemangel: Deutschland sucht Azubis aus dem Ausland\"\n\nIn vielen deutschen Betrieben fehlen heute Fachkräfte. Besonders in der Pflege, in der Gastronomie und im Handwerk finden Unternehmen kaum genug junge Menschen, die eine Ausbildung machen wollen. Der Grund dafür ist unter anderem der demografische Wandel: Immer mehr Menschen gehen in Rente, aber es werden weniger Kinder geboren. Deshalb schauen immer mehr Betriebe ins Ausland und bieten Ausbildungsplätze für internationale Bewerber an.\n\nBesonders gefragt sind junge Menschen aus Ländern wie Vietnam, den Philippinen oder Indien. Bevor sie nach Deutschland kommen, müssen sie meistens einen Sprachkurs besuchen und mindestens das Sprachniveau B1 oder B2 erreichen. Außerdem brauchen sie ein Visum zur Ausbildung, das mit einem Ausbildungsvertrag beantragt wird. Viele Betriebe unterstützen ihre neuen Azubis auch bei der Wohnungssuche und bei Behördengängen.\n\nExperten sagen, dass sich die Situation in den nächsten Jahren nicht verbessern wird. Deshalb investieren immer mehr Unternehmen in internationale Kooperationen mit Sprachschulen in Asien. Für die jungen Bewerber bedeutet das eine große Chance: Sie können in Deutschland einen anerkannten Berufsabschluss machen, gutes Geld verdienen und nach der Ausbildung oft auch bleiben. Allerdings betonen Fachleute auch, dass der Anfang nicht immer leicht ist – die Sprache, das ungewohnte Klima und das Leben weit weg von der Familie sind eine echte Herausforderung. Wer sich aber gut vorbereitet, hat sehr gute Chancen auf einen erfolgreichen Start.",
          "questions": [
            {
              "id": 6,
              "text": "Warum fehlen in Deutschland Fachkräfte?",
              "options": [
                "Weil viele Betriebe schließen",
                "Weil es immer mehr ältere Menschen und weniger junge Menschen gibt",
                "Weil die Ausbildung zu teuer ist"
              ],
              "correct": 1
            },
            {
              "id": 7,
              "text": "Welches Sprachniveau brauchen die Bewerber meistens mindestens?",
              "options": [
                "A2",
                "B1",
                "C1"
              ],
              "correct": 1
            },
            {
              "id": 8,
              "text": "Was brauchen ausländische Bewerber außer dem Sprachniveau?",
              "options": [
                "Ein Visum zur Ausbildung",
                "Ein Führerschein",
                "Ein abgeschlossenes Studium"
              ],
              "correct": 0
            },
            {
              "id": 9,
              "text": "Wobei helfen viele Betriebe ihren neuen Azubis?",
              "options": [
                "Nur bei der Arbeit",
                "Bei der Wohnungssuche und bei Behördengängen",
                "Beim Deutschlernen vor der Einreise"
              ],
              "correct": 1
            },
            {
              "id": 10,
              "text": "Was sagen Experten über den Anfang in Deutschland?",
              "options": [
                "Er ist immer ganz einfach",
                "Er kann eine Herausforderung sein",
                "Er dauert nur eine Woche"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Một quảng cáo không khớp với bất kỳ ai.",
          "text": "**Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Eine Anzeige passt zu keiner Person.**\n\n**11. Hương** sucht eine Ausbildung im Bereich Pflege. Sie möchte in einer Großstadt wohnen und braucht Unterstützung bei der Wohnungssuche.\n\n**12. Minh** hat schon eine Ausbildung als Koch in Vietnam gemacht und möchte seine Erfahrung in Deutschland weiterverwenden, am liebsten in einem Hotel.\n\n**13. Lan** interessiert sich für Technik und möchte gern in einer Werkstatt mit modernen Maschinen arbeiten.\n\n**14. Tuấn** möchte eine Ausbildung machen, bei der er viel mit Menschen spricht, zum Beispiel im Verkauf oder im Restaurant.\n\n**15. Mai** sucht einen Ausbildungsplatz, bei dem auch Wochenendarbeit kein Problem ist, und ihr ist ein gutes Team besonders wichtig.",
          "questions": [],
          "ads": [
            {
              "id": "a",
              "text": "*Pflegehelfer/in gesucht!* Klinikum München bietet Ausbildungsplätze zur Pflegefachkraft. Wir helfen bei der Zimmersuche und bieten Deutschkurse vor Ausbildungsbeginn. Bewerbung an: bewerbung@klinikum-muenchen.de"
            },
            {
              "id": "b",
              "text": "*Hotel Vier Jahreszeiten Hamburg* sucht Auszubildende im Hotelfach. Erfahrung in der Küche von Vorteil. Internationales Team, gute Übernahmechancen."
            },
            {
              "id": "c",
              "text": "*KFZ-Werkstatt Schmidt, Stuttgart* bietet Ausbildungsplatz zum Mechatroniker an. Moderne Maschinen, erfahrene Meister, faire Bezahlung."
            },
            {
              "id": "d",
              "text": "*Restaurant „Goldener Löwe\", Köln* sucht freundliche Auszubildende für den Service. Kontakt mit Gästen, Teamarbeit, auch am Wochenende."
            },
            {
              "id": "e",
              "text": "*Bäckerei Huber, Berlin* sucht Azubis zum Bäcker/in. Frühschicht ab 4 Uhr, kein Wochenenddienst."
            },
            {
              "id": "f",
              "text": "*Pflegeheim Sonnenschein, Dresden* sucht Azubis zur Pflegefachkraft. Sehr kollegiales Team, flexible Schichten, auch Wochenenddienst möglich."
            },
            {
              "id": "g",
              "text": "*Büro Meyer & Partner* sucht Azubis im Bereich Bürokommunikation. Wenig Kundenkontakt, klassische Bürotätigkeit."
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Lesen Sie các bài viết diễn đàn. Phát biểu nào (a–e) phù hợp với người nào (16–20)?",
          "text": "**Lesen Sie die Forumsbeiträge. Welche Aussage (a–e) passt zu welcher Person (16–20)?**\n\n### Forum: „Lohnt sich eine Ausbildung im Ausland?\"\n\n**16. Đức:** Ich habe vor einem Jahr meine Ausbildung in Deutschland begonnen und bin sehr zufrieden. Klar, am Anfang war es schwer mit der Sprache, aber mein Betrieb hat mir einen Deutschkurs bezahlt. Jetzt verdiene ich schon ganz gut und kann meiner Familie Geld schicken.\n\n**17. Phương:** Ich finde, man sollte sich das gut überlegen. Viele meiner Freunde denken, im Ausland verdient man schnell viel Geld, aber die ersten Monate sind oft sehr hart. Man ist allein, kennt niemanden und muss sich an alles neu gewöhnen.\n\n**18. Hải:** Für mich war die Entscheidung genau richtig. In Vietnam hätte ich nie diesen Beruf erlernen können, weil es bei uns kaum Ausbildungsplätze in diesem Bereich gibt. In Deutschland bekomme ich nicht nur eine gute Ausbildung, sondern auch einen offiziellen Abschluss.\n\n**19. Yến:** Ich vermisse meine Familie sehr und das Wetter in Deutschland ist auch nicht so schön wie bei uns. Trotzdem bereue ich meine Entscheidung nicht, weil ich hier viel mehr lerne als ich es in Vietnam könnte.\n\n**20. Quang:** Man sollte unbedingt vorher gut Deutsch lernen! Ich kannte vor der Abreise nur wenige Wörter und hatte deshalb am Anfang große Probleme, im Betrieb und in der Berufsschule alles zu verstehen.",
          "statements": [
            {
              "id": "a",
              "text": "Diese Person empfiehlt, sich vor der Abreise besser auf die Sprache vorzubereiten."
            },
            {
              "id": "b",
              "text": "Diese Person konnte ihren Beruf in der Heimat gar nicht lernen."
            },
            {
              "id": "c",
              "text": "Diese Person warnt davor, dass der Anfang im Ausland oft schwieriger ist als gedacht."
            },
            {
              "id": "d",
              "text": "Diese Person ist finanziell zufrieden und unterstützt ihre Familie."
            },
            {
              "id": "e",
              "text": "Diese Person vermisst die Heimat, ist aber trotzdem zufrieden mit ihrer Entscheidung."
            }
          ],
          "questions": [
            {
              "id": 16,
              "name": "Đức",
              "correct": "d"
            },
            {
              "id": 17,
              "name": "Phương",
              "correct": "c"
            },
            {
              "id": 18,
              "name": "Hải",
              "correct": "b"
            },
            {
              "id": 19,
              "name": "Yến",
              "correct": "e"
            },
            {
              "id": 20,
              "name": "Quang",
              "correct": "a"
            }
          ]
        },
        {
          "id": "teil5",
          "title": "Teil 5",
          "description": "Lesen Sie các quy định và quyết định: Richtig hay Falsch?",
          "text": "**Lesen Sie die Regeln und entscheiden Sie: Richtig oder Falsch?**\n\n### Wichtige Regeln im Azubi-Wohnheim „Haus am Park\"\n\n1. Die Zimmer müssen jederzeit ordentlich gehalten werden. Eine Reinigung der Gemeinschaftsräume (Küche, Bad) erfolgt durch die Bewohner selbst, im wöchentlichen Wechsel.\n2. Ab 22 Uhr gilt Nachtruhe. Lautes Musikhören oder Telefonieren auf dem Flur ist dann nicht erlaubt.\n3. Besucher dürfen empfangen werden, müssen aber bis 21 Uhr das Haus verlassen. Übernachtungsbesuch ist nur nach vorheriger Anmeldung beim Hausmeister möglich.\n4. Rauchen ist im gesamten Gebäude verboten, auch in den Zimmern. Es gibt einen Raucherbereich im Innenhof.\n5. Die Miete muss spätestens am 3. Werktag jedes Monats überwiesen werden.\n6. Schäden im Zimmer oder in den Gemeinschaftsräumen müssen sofort dem Hausmeister gemeldet werden.\n\n**Aufgaben (21–25): Richtig oder Falsch?**\n\n21. Die Bewohner putzen die Küche und das Bad selbst.\n22. Nach 22 Uhr darf man laut Musik hören.\n23. Besucher dürfen ohne Anmeldung im Zimmer übernachten.\n24. Man darf im eigenen Zimmer rauchen, wenn man das Fenster öffnet.\n25. Schäden müssen sofort gemeldet werden.\n\n**Lösungen Teil 5:** 21. Richtig – 22. Falsch – 23. Falsch – 24. Falsch – 25. Richtig\n\n---",
          "questions": [
            {
              "id": 21,
              "text": "Die Bewohner putzen die Küche und das Bad selbst.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 22,
              "text": "Nach 22 Uhr darf man laut Musik hören.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 23,
              "text": "Besucher dürfen ohne Anmeldung im Zimmer übernachten.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 24,
              "text": "Man darf im eigenen Zimmer rauchen, wenn man das Fenster öffnet.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 25,
              "text": "Schäden müssen sofort gemeldet werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        }
      ]
    },
    "hoeren": {
      "title": "Hören (Nghe hiểu)",
      "timeLimit": 2400,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Sie hören fünf kurze Texte. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "Text 1",
              "text": "„Liebe Kursteilnehmer, bitte beachten Sie: Der B1-Kurs findet ab morgen nicht mehr in Raum 12, sondern in Raum 5 im ersten Stock statt. Der Unterricht beginnt wie gewohnt um 9 Uhr."
            },
            {
              "speaker": "Text 2",
              "text": "„Sehr geehrte Fahrgäste, wegen einer Baustelle hat die Linie 14 derzeit etwa zehn Minuten Verspätung. Wir bitten um Ihr Verständnis."
            },
            {
              "speaker": "Text 3",
              "text": "„Hallo Linh, hier ist Sabine. Ich kann morgen leider nicht zur Frühschicht kommen, weil ich krank bin. Kannst du das bitte der Stationsleitung sagen? Danke und bis bald!"
            },
            {
              "speaker": "Text 4",
              "text": "„Achtung, liebe Bewohner: Am Donnerstag zwischen 10 und 12 Uhr kommt der Hausmeister, um die Heizung in einigen Zimmern zu überprüfen. Bitte lassen Sie die Tür unverschlossen, wenn Sie nicht da sind."
            },
            {
              "speaker": "Text 5",
              "text": "„Liebe Besucher, die Besuchszeiten auf der Station sind von 14 bis 18 Uhr. Außerhalb dieser Zeiten bitten wir Sie, Rücksicht auf die Patienten zu nehmen."
            }
          ],
          "questions": [
            {
              "id": 26,
              "text": "Die Sprachschule informiert über einen Raumwechsel.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 27,
              "text": "Im Bus gibt es eine Verspätungsdurchsage.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 28,
              "text": "Eine Kollegin hinterlässt eine Nachricht auf dem Anrufbeantworter.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 29,
              "text": "Im Wohnheim wird ein Hausmeistertermin angekündigt.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 30,
              "text": "Eine Durchsage im Krankenhaus informiert über Besuchszeiten.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Sie hören einen Vortrag. Wählen Sie bei jeder Aufgabe die richtige Antwort (a, b oder c).",
          "maxPlays": 1,
          "transcript": "„Infoabend zur Pflegeausbildung in Deutschland\"\n\n„Guten Abend, liebe Gäste, schön, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen kurz erklären, wie die Ausbildung zur Pflegefachkraft in Deutschland aufgebaut ist. Die Ausbildung dauert in der Regel drei Jahre und ist eine duale Ausbildung. Das bedeutet: Sie lernen sowohl in der Berufsschule als auch praktisch im Betrieb, also zum Beispiel im Krankenhaus, im Pflegeheim oder bei einem ambulanten Pflegedienst.\n\nIm ersten Jahr stehen vor allem die Grundlagen im Mittelpunkt: Hygiene, Körperpflege, der Umgang mit Patienten. Im zweiten und dritten Jahr vertiefen die Auszubildenden ihr Wissen, zum Beispiel in der Kinderpflege oder in der Altenpflege. Am Ende der Ausbildung steht eine staatliche Prüfung, die aus einem schriftlichen, einem mündlichen und einem praktischen Teil besteht.\n\nWichtig zu wissen: Wer die Ausbildung erfolgreich abschließt, erhält einen in ganz Europa anerkannten Berufsabschluss. Das Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 1.200 und 1.300 Euro brutto im Monat und steigt jedes Jahr. Außerdem übernehmen viele Betriebe nach der Ausbildung ihre Auszubildenden in eine feste Stelle, weil aktuell sehr viele Pflegekräfte gesucht werden. Ich kann Ihnen also sagen: Die Berufsaussichten in diesem Bereich sind zurzeit ausgezeichnet.\"",
          "segments": [
            {
              "speaker": "Vortragende/r",
              "text": "Infoabend zur Pflegeausbildung in Deutschland\"\n\nGuten Abend, liebe Gäste, schön, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen kurz erklären, wie die Ausbildung zur Pflegefachkraft in Deutschland aufgebaut ist. Die Ausbildung dauert in der Regel drei Jahre und ist eine duale Ausbildung. Das bedeutet: Sie lernen sowohl in der Berufsschule als auch praktisch im Betrieb, also zum Beispiel im Krankenhaus, im Pflegeheim oder bei einem ambulanten Pflegedienst.\n\nIm ersten Jahr stehen vor allem die Grundlagen im Mittelpunkt: Hygiene, Körperpflege, der Umgang mit Patienten. Im zweiten und dritten Jahr vertiefen die Auszubildenden ihr Wissen, zum Beispiel in der Kinderpflege oder in der Altenpflege. Am Ende der Ausbildung steht eine staatliche Prüfung, die aus einem schriftlichen, einem mündlichen und einem praktischen Teil besteht.\n\nWichtig zu wissen: Wer die Ausbildung erfolgreich abschließt, erhält einen in ganz Europa anerkannten Berufsabschluss. Das Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 1.200 und 1.300 Euro brutto im Monat und steigt jedes Jahr. Außerdem übernehmen viele Betriebe nach der Ausbildung ihre Auszubildenden in eine feste Stelle, weil aktuell sehr viele Pflegekräfte gesucht werden. Ich kann Ihnen also sagen: Die Berufsaussichten in diesem Bereich sind zurzeit ausgezeichnet.\""
            }
          ],
          "questions": [
            {
              "id": 31,
              "text": "Wie lange dauert die Pflegeausbildung normalerweise?",
              "options": [
                "Zwei Jahre",
                "Drei Jahre",
                "Vier Jahre"
              ],
              "correct": 1
            },
            {
              "id": 32,
              "text": "Was bedeutet „duale Ausbildung\"?",
              "options": [
                "Man lernt nur in der Schule",
                "Man lernt nur im Betrieb",
                "Man lernt in der Schule und im Betrieb"
              ],
              "correct": 2
            },
            {
              "id": 33,
              "text": "Worauf konzentriert man sich im ersten Ausbildungsjahr?",
              "options": [
                "Auf die Grundlagen",
                "Nur auf die Altenpflege",
                "Nur auf die Prüfungsvorbereitung"
              ],
              "correct": 0
            },
            {
              "id": 34,
              "text": "Wie hoch ist das Ausbildungsgehalt im ersten Jahr ungefähr?",
              "options": [
                "800–900 Euro",
                ""
              ],
              "correct": 1
            },
            {
              "id": 1,
              "text": "200–",
              "options": [],
              "correct": 0
            },
            {
              "id": 1,
              "text": "300 Euro",
              "options": [
                ""
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "000 Euro",
              "options": [],
              "correct": 0
            },
            {
              "id": 35,
              "text": "Wie sind die Berufsaussichten laut Vortrag?",
              "options": [
                "Schlecht, weil es zu viele Pflegekräfte gibt",
                "Sehr gut, weil Pflegekräfte gesucht werden",
                "Unklar, weil es zu wenige Informationen gibt"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Sie hören ein Gespräch zwischen zwei Personen. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "Mai",
              "text": "Hey Tâm, na, wie war dein erster Tag in der Werkstatt?"
            },
            {
              "speaker": "Tâm",
              "text": "Hi Mai! Ehrlich gesagt, ganz schön anstrengend. Mein Meister hat mir gezeigt, wie man die Maschinen bedient, aber es gab so viele Fachbegriffe, die ich noch nicht kannte."
            },
            {
              "speaker": "Mai",
              "text": "Das kenne ich! Bei mir im Restaurant war es genauso. Am Anfang habe ich die Hälfte von dem, was die Köche gesagt haben, nicht verstanden."
            },
            {
              "speaker": "Tâm",
              "text": "Und wie hast du das gelöst?"
            },
            {
              "speaker": "Mai",
              "text": "Ich habe mir ein kleines Notizbuch gekauft und alle neuen Wörter aufgeschrieben. Abends habe ich sie dann nachgeschlagen."
            },
            {
              "speaker": "Tâm",
              "text": "Gute Idee, das mache ich auch! Sag mal, gehst du eigentlich noch zum Deutschkurs am Abend?"
            },
            {
              "speaker": "Mai",
              "text": "Ja, zweimal pro Woche. Es ist anstrengend nach der Arbeit, aber es hilft total."
            },
            {
              "speaker": "Tâm",
              "text": "Stimmt, ich überlege auch, mich da anzumelden. Hast du schon mit anderen Azubis aus der Werkstatt gesprochen?"
            },
            {
              "speaker": "Mai",
              "text": "Nein, noch nicht, aber ich habe gehört, dass es am Freitag ein Grillfest für alle neuen Azubis gibt. Da lernt man bestimmt viele Leute kennen."
            },
            {
              "speaker": "Tâm",
              "text": "Super, da gehe ich auf jeden Fall hin!"
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Falsch – 37. Richtig – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 36,
              "text": "Tâm fand seinen ersten Tag in der Werkstatt einfach.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 37,
              "text": "Mai hatte am Anfang im Restaurant ähnliche Probleme wie Tâm.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 38,
              "text": "Mai schreibt neue Wörter in ein Notizbuch.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 39,
              "text": "Mai geht nicht mehr zum Deutschkurs.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 40,
              "text": "Am Freitag gibt es ein Grillfest für neue Azubis.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Sie hören eine Diskussion im Radio. Wer sagt was? Ordnen Sie die Aussagen zu.",
          "maxPlays": 2,
          "segments": [
            {
              "speaker": "Mai",
              "text": "Hey Tâm, na, wie war dein erster Tag in der Werkstatt?"
            },
            {
              "speaker": "Tâm",
              "text": "Hi Mai! Ehrlich gesagt, ganz schön anstrengend. Mein Meister hat mir gezeigt, wie man die Maschinen bedient, aber es gab so viele Fachbegriffe, die ich noch nicht kannte."
            },
            {
              "speaker": "Mai",
              "text": "Das kenne ich! Bei mir im Restaurant war es genauso. Am Anfang habe ich die Hälfte von dem, was die Köche gesagt haben, nicht verstanden."
            },
            {
              "speaker": "Tâm",
              "text": "Und wie hast du das gelöst?"
            },
            {
              "speaker": "Mai",
              "text": "Ich habe mir ein kleines Notizbuch gekauft und alle neuen Wörter aufgeschrieben. Abends habe ich sie dann nachgeschlagen."
            },
            {
              "speaker": "Tâm",
              "text": "Gute Idee, das mache ich auch! Sag mal, gehst du eigentlich noch zum Deutschkurs am Abend?"
            },
            {
              "speaker": "Mai",
              "text": "Ja, zweimal pro Woche. Es ist anstrengend nach der Arbeit, aber es hilft total."
            },
            {
              "speaker": "Tâm",
              "text": "Stimmt, ich überlege auch, mich da anzumelden. Hast du schon mit anderen Azubis aus der Werkstatt gesprochen?"
            },
            {
              "speaker": "Mai",
              "text": "Nein, noch nicht, aber ich habe gehört, dass es am Freitag ein Grillfest für alle neuen Azubis gibt. Da lernt man bestimmt viele Leute kennen."
            },
            {
              "speaker": "Tâm",
              "text": "Super, da gehe ich auf jeden Fall hin!"
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Falsch – 37. Richtig – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 41,
              "text": "Diese Person hatte selbst kaum Unterstützung von ihrem Betrieb.",
              "options": [
                "Moderatorin",
                "Herr Klein",
                "Frau Đặng"
              ],
              "correct": 2
            },
            {
              "id": 42,
              "text": "Diese Person hat in ihrem Betrieb eine feste Ansprechperson eingeführt.",
              "options": [
                "Moderatorin",
                "Herr Klein",
                "Frau Đặng"
              ],
              "correct": 1
            },
            {
              "id": 43,
              "text": "Diese Person fordert ein verpflichtendes Patenprogramm für alle Betriebe.",
              "options": [
                "Moderatorin",
                "Herr Klein",
                "Frau Đặng"
              ],
              "correct": 2
            },
            {
              "id": 44,
              "text": "Diese Person stellt die Gäste im Studio vor.",
              "options": [
                "Moderatorin",
                "Herr Klein",
                "Frau Đặng"
              ],
              "correct": 0
            },
            {
              "id": 45,
              "text": "Diese Person findet, ein begleitender Deutschkurs sollte von Anfang an angeboten werden.",
              "options": [
                "Moderatorin",
                "Herr Klein",
                "Frau Đặng"
              ],
              "correct": 1
            }
          ]
        }
      ]
    },
    "schreiben": {
      "title": "Schreiben (Viết)",
      "timeLimit": 3600,
      "tasks": [
        {
          "id": "task1",
          "title": "Nhiệm vụ 1: Viết E-Mail cá nhân",
          "description": "(ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie haben vor zwei Monaten Ihre Ausbildung in Deutschland begonnen. Schreiben Sie Ihrer Freundin/Ihrem Freund in Vietnam eine E-Mail.\n\nSchreiben Sie:\n- Wie es Ihnen am neuen Ausbildungsort geht\n- Was an der Ausbildung schwierig bzw. schön ist\n- Eine Frage an Ihre Freundin/Ihren Freund",
          "sampleSolution": "Liebe Hoa,\nwie geht es dir? Ich bin jetzt seit zwei Monaten in Deutschland und es läuft eigentlich ganz gut! Die Arbeit im Restaurant macht mir Spaß, aber am Anfang war die Sprache der Kollegen im Stress sehr schnell und schwer zu verstehen. Inzwischen geht es viel besser. Am schönsten finde ich, dass meine Kollegen sehr geduldig sind und mir oft helfen.\nWie läuft es eigentlich bei dir im Job? Hast du auch schon mal überlegt, ins Ausland zu gehen?\nSchreib mir bald!\nLiebe Grüße, Linh",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task2",
          "title": "Nhiệm vụ 2: Viết bài diễn đàn",
          "description": "– Meinung äußern (ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** In einem Online-Forum diskutieren junge Leute über folgendes Thema: „Ist es besser, im Heimatland zu arbeiten oder eine Ausbildung im Ausland zu machen?\" Schreiben Sie einen Beitrag.\n\nSchreiben Sie:\n- Ihre Meinung zum Thema\n- Ein Argument oder Beispiel dafür\n- Einen möglichen Nachteil",
          "sampleSolution": "Meiner Meinung nach lohnt sich eine Ausbildung im Ausland sehr, auch wenn es nicht immer einfach ist. Man bekommt eine international anerkannte Ausbildung und kann gleichzeitig eine neue Sprache und Kultur kennenlernen. Außerdem verdient man oft schon während der Ausbildung gutes Geld. Natürlich gibt es auch Nachteile: Man ist weit weg von der Familie, und am Anfang muss man sich an vieles Neue gewöhnen. Trotzdem würde ich es jedem empfehlen, der offen für Neues ist.",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task3",
          "title": "Nhiệm vụ 3: Viết thư/E-Mail trang trọng",
          "description": "(ca. 40 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie können wegen einer Krankheit nicht zu Ihrem geplanten Sprachkurstermin kommen. Schreiben Sie eine E-Mail an die Sprachschule.\n\nSchreiben Sie:\n- Den Grund für Ihre Absage\n- Eine Bitte um einen neuen Termin\n- Eine höfliche Schlussformel",
          "sampleSolution": "Sehr geehrte Damen und Herren,\nleider kann ich am Mittwoch wegen einer Erkrankung nicht zum vereinbarten Einstufungstest kommen. Wäre es möglich, einen neuen Termin in der nächsten Woche zu bekommen? Vielen Dank im Voraus.\nMit freundlichen Grüßen\nNguyễn Văn Minh",
          "wordCountHint": "ca. 40 Wörter",
          "timeHint": "20 Minuten"
        }
      ]
    },
    "sprechen": {
      "title": "Sprechen (Nói)",
      "timeLimit": 900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1: Gemeinsam etwas planen",
          "description": "(ca. 3 Minuten)\n\n**Aufgabe:** Sie und Ihr Prüfungspartner/Ihre Prüfungspartnerin organisieren eine Abschiedsfeier für Ihre Deutschkurs-Gruppe, bevor alle nach Deutschland fliegen.\n\n**Besprechen Sie:**\n- Termin und Uhrzeit\n- Ort (z. B. Restaurant, Park, bei jemandem zu Hause)\n- Essen und Getränke\n- Programm (z. B. Spiele, Reden, Musik)\n- Kosten – wer bezahlt was?",
          "usefulPhrases": [
            "Vorschlag machen:* „Wie wäre es, wenn wir …?\" / „Ich schlage vor, dass …\"",
            "Zustimmen:* „Das ist eine gute Idee.\" / „Einverstanden, machen wir das so.\"",
            "Ablehnen/Alternative vorschlagen:* „Das finde ich nicht so gut, weil … Wie wäre es stattdessen mit …?\"",
            "Kompromiss:* „Wir könnten auch beides kombinieren, oder?\""
          ],
          "sampleDialogue": "A: Ich schlage vor, dass wir die Feier am Samstagabend machen, dann haben alle Zeit.\nB: Gute Idee! Und wo sollen wir feiern – vielleicht im Park?\nA: Hmm, wenn es regnet, ist das schwierig. Wie wäre es stattdessen mit einem Restaurant?\nB: Einverstanden. Dann müssen wir uns noch über das Essen einigen …",
          "scenario": "Sie planen eine Abschiedsfeier für Ihre Deutschkurs-Gruppe.",
          "prompts": [
            "Termin und Uhrzeit",
            "Ort der Feier",
            "Essen und Getränke",
            "Programm",
            "Kosten"
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2: Ein Thema präsentieren",
          "description": "(2–3 Minuten)\n\n**Thema:** „Arbeiten und Leben im Ausland\"\n\n**Sprechen Sie über:**\n- Ihre eigene Erfahrung (oder die, die Sie erwarten)\n- Die Situation in Ihrem Heimatland\n- Vorteile\n- Nachteile\n- Ihr Fazit/Ihre Meinung\n\n**Gliederungsvorschlag (Musterantwort, gekürzt):**\n\n> „Ich möchte heute über das Thema Arbeiten im Ausland sprechen. In Vietnam ist es für junge Leute oft schwierig, in bestimmten Berufen eine gute Ausbildung zu finden, zum Beispiel in der Pflege. Deshalb entscheiden sich viele, ins Ausland zu gehen.\n> Persönlich finde ich das eine große Chance: Man lernt eine neue Sprache, eine neue Kultur, und man bekommt oft einen besseren Abschluss als in der Heimat.\n> Natürlich gibt es auch Nachteile: Man ist weit weg von der Familie, das Essen und das Wetter sind anders, und am Anfang ist die Sprache eine große Herausforderung.\n> Trotzdem denke ich, dass sich eine Ausbildung im Ausland langfristig lohnt, wenn man bereit ist, hart zu arbeiten und sich anzupassen.\"",
          "sampleSolution": "",
          "topic": "Arbeiten und Leben im Ausland",
          "prompts": [
            "Eigene Erfahrung",
            "Situation im Heimatland",
            "Vorteile",
            "Nachteile",
            "Fazit/Meinung"
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3: Fragen stellen và Trả lời",
          "description": "(ca. 2 Minuten)\n\n**Aufgabe:** Stellen Sie Ihrem Prüfungspartner/Ihrer Prüfungspartnerin Fragen zu seinem/ihrem Thema (Teil 2) und beantworten Sie auch Fragen.\n\n**Beispiele für Fragen, die Sie stellen können:**\n- „Was war für dich am schwierigsten beim Leben im Ausland?\"\n- „Würdest du anderen jungen Leuten empfehlen, ins Ausland zu gehen? Warum (nicht)?\"\n- „Was vermisst du am meisten an deiner Heimat?\"\n\n**Beispiele für mögliche Antworten:**\n- „Am schwierigsten war für mich am Anfang die Sprache, besonders Fachbegriffe bei der Arbeit.\"\n- „Ja, ich würde es empfehlen, weil man dort eine sehr gute Ausbildung bekommt.\"\n- „Am meisten vermisse ich das Essen und natürlich meine Familie.\"",
          "sampleQuestions": [],
          "sampleAnswers": []
        }
      ]
    }
  },
  {
    "id": "gastronomie",
    "title": "Đề 2: Ngành Nhà hàng - Khách sạn & Ẩm thực (Gastronomie)",
    "level": "B1",
    "lesen": {
      "title": "Lesen (Đọc hiểu)",
      "timeLimit": 3900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?",
          "text": "**Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?**\n\n### „Mein erster Monat als Koch-Azubi in Deutschland\" – Blog von An (20, aus Vietnam)\n\nHallo zusammen! Ich heiße An und komme aus Vietnam. Seit einem Monat lebe ich in München und mache eine Ausbildung zum Koch in einem traditionellen bayerischen Restaurant. Am Anfang war alles neu für mich: die deutsche Küche, die vielen Fachbegriffe und natürlich auch das Arbeitstempo in der Küche.\n\nMein erster Arbeitstag war ziemlich stressig. Mein Küchenchef, Herr Bauer, hat mir gezeigt, wie man Gemüse richtig schneidet und wie die Hygieneregeln in der Küche funktionieren. Ich musste mir viele neue Wörter merken, zum Beispiel „Schneidebrett\", „Kochlöffel\" oder „Mise en Place\". Zum Glück erklärt mir Herr Bauer immer alles geduldig, auch wenn manchmal alles sehr schnell gehen muss.\n\nIn der Berufsschule lerne ich zwei Tage pro Woche Theorie, zum Beispiel Lebensmittelkunde und Ernährungslehre. Die anderen drei Tage arbeite ich in der Küche. Am Anfang hatte ich Angst, in der Hektik des Mittagsservices etwas falsch zu machen, aber jetzt fühle ich mich schon viel sicherer.\n\nWas mir besonders gefällt: Ich lerne ständig neue Gerichte und Techniken, und die Gäste freuen sich oft über das Essen – das motiviert mich sehr. Schwierig finde ich noch das Arbeitstempo am Wochenende, wenn das Restaurant voll ist. Aber mein Team hilft mir immer.\n\nAm Wochenende, wenn ich frei habe, treffe ich mich gern mit anderen Azubis aus Vietnam. Wir kochen zusammen vietnamesisch und erzählen uns von unserem Alltag. Ich bin froh, dass ich diesen Weg gewählt habe.",
          "questions": [
            {
              "id": 1,
              "text": "An lebt seit einem Monat in München.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "An kannte von Anfang an alle Fachbegriffe in der Küche.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 3,
              "text": "Herr Bauer erklärt An die Dinge nur, wenn er gerade Zeit hat.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 4,
              "text": "An arbeitet an fünf Tagen pro Woche in der Küche.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 5,
              "text": "An trifft sich am Wochenende mit anderen Azubis aus Vietnam.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).",
          "text": "**Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).**\n\n### „Fachkräftemangel im Gastgewerbe: Hotels und Restaurants suchen Azubis aus dem Ausland\"\n\nDas deutsche Gastgewerbe hat ein großes Problem: Es fehlen Tausende Fachkräfte. Besonders in Hotels und Restaurants finden Betriebe kaum genug junge Menschen, die eine Ausbildung zum Koch, zur Hotelfachfrau oder zum Restaurantfachmann machen möchten. Viele junge Deutsche entscheiden sich heute für andere Berufe, weil die Arbeitszeiten in der Gastronomie – Abende, Wochenenden, Feiertage – als unattraktiv gelten.\n\nDeshalb schauen immer mehr Betriebe ins Ausland. Besonders aus Ländern wie Vietnam kommen junge Menschen, die Interesse an der Gastronomie haben und bereit sind, hart zu arbeiten. Bevor sie nach Deutschland kommen, müssen sie meistens das Sprachniveau B1 erreichen und einen Ausbildungsvertrag mit einem Hotel oder Restaurant abschließen. Viele Betriebe bieten außerdem Unterkunft oder Hilfe bei der Wohnungssuche an.\n\nEin Vorteil der Ausbildung im Gastgewerbe: Man lernt sehr praktisch, bekommt schnell Verantwortung und kann nach der Ausbildung in der ganzen Welt arbeiten, denn gute Köche und Hotelfachkräfte werden überall gesucht. Allerdings ist die Arbeit auch körperlich anstrengend: Man steht viele Stunden, arbeitet oft am Wochenende und muss in stressigen Situationen ruhig bleiben.\n\nExperten empfehlen, sich vor der Abreise schon mit grundlegenden Begriffen aus Küche und Service vertraut zu machen. Auch der Umgang mit Gästen, also Freundlichkeit und gute Umgangsformen, ist sehr wichtig und sollte schon vorher geübt werden. Viele Hotels und Restaurants bieten inzwischen begleitende Deutschkurse an, damit sich die neuen Azubis schneller einleben können. Fachleute sind sich einig: Wer motiviert ist und gut vorbereitet kommt, hat in der deutschen Gastronomie sehr gute Zukunftschancen.",
          "questions": [
            {
              "id": 6,
              "text": "Warum fehlen in der deutschen Gastronomie viele Fachkräfte?",
              "options": [
                "Weil es zu viele Restaurants gibt",
                "Weil viele junge Deutsche andere Berufe wegen der Arbeitszeiten bevorzugen",
                "Weil die Ausbildung zu teuer ist"
              ],
              "correct": 1
            },
            {
              "id": 7,
              "text": "Was müssen Bewerber aus dem Ausland meistens nachweisen?",
              "options": [
                "Das Sprachniveau B1",
                "Einen Hochschulabschluss",
                "Erfahrung als Hotelmanager"
              ],
              "correct": 0
            },
            {
              "id": 8,
              "text": "Was ist laut Artikel ein Vorteil der Ausbildung im Gastgewerbe?",
              "options": [
                "Man kann später überall in der Welt arbeiten",
                "Man muss nie am Wochenende arbeiten",
                "Man bekommt sofort eine Führungsposition"
              ],
              "correct": 0
            },
            {
              "id": 9,
              "text": "Was sollte man laut Experten vor der Abreise üben?",
              "options": [
                "Nur Kochrezepte",
                "Grundbegriffe aus Küche/Service und den Umgang mit Gästen",
                "Nur Fremdsprachen wie Englisch"
              ],
              "correct": 1
            },
            {
              "id": 10,
              "text": "Was bieten viele Betriebe inzwischen an?",
              "options": [
                "Kostenlose Auslandsreisen",
                "Begleitende Deutschkurse",
                "Ein Studium nach der Ausbildung"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Một quảng cáo không khớp với bất kỳ ai.",
          "text": "**Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Zwei Anzeigen passen zu keiner Person.**\n\n**11. Hoa** interessiert sich für das Kochen und möchte gern kreative Gerichte zubereiten.\n\n**12. Đức** ist sehr kommunikativ und möchte gern direkten Kontakt mit Gästen haben, zum Beispiel im Service.\n\n**13. Linh** möchte gern im Hotel arbeiten und sich um die Organisation an der Rezeption kümmern.\n\n**14. Nam** interessiert sich für Brot und Gebäck und möchte gern früh am Morgen backen.\n\n**15. Thảo** möchte am liebsten Cocktails und Getränke zubereiten und mit Gästen an der Bar arbeiten.",
          "questions": [],
          "ads": [
            {
              "id": "a",
              "text": "*Restaurant „Zum Goldenen Hirsch\", Köln* sucht Azubis zum Koch. Kreative Küche, Schwerpunkt regionale Gerichte."
            },
            {
              "id": "b",
              "text": "*Hotel Continental, Berlin* sucht Azubis zum Hotelfachmann/-frau. Arbeit an der Rezeption, Gästebetreuung, Organisation."
            },
            {
              "id": "c",
              "text": "*Restaurant „Seeblick\", Konstanz* sucht freundliche Azubis zum Restaurantfachmann/-frau. Direkter Gästekontakt im Service."
            },
            {
              "id": "d",
              "text": "*Bäckerei Huber, Berlin* sucht Azubis zum Bäcker/in. Frühschicht ab 4 Uhr, Brot und Gebäck."
            },
            {
              "id": "e",
              "text": "*Bar „Nachtfalter\", Hamburg* sucht Azubis mit Schwerpunkt Bar und Getränke. Cocktails mixen, Gäste bedienen."
            },
            {
              "id": "f",
              "text": "*Büro Meyer & Partner* sucht Azubis im Bereich Bürokommunikation. Reine Verwaltungstätigkeit, kein Gästekontakt."
            },
            {
              "id": "g",
              "text": "*Reinigungsfirma Klar* sucht Mitarbeiter für Gebäudereinigung. Kein Gästekontakt."
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Lesen Sie các bài viết diễn đàn. Phát biểu nào (a–e) phù hợp với người nào (16–20)?",
          "text": "**Lesen Sie die Forumsbeiträge. Welche Aussage (a–e) passt zu welcher Person (16–20)?**\n\n### Forum: „Lohnt sich eine Ausbildung in der Gastronomie im Ausland?\"\n\n**16. Hương:** Ich habe vor einem Jahr meine Ausbildung zur Hotelfachfrau in Deutschland begonnen und bin sehr zufrieden. Am Anfang war es schwer, mit den vielen Gästen auf Deutsch zu sprechen, aber mein Betrieb hat mir einen Deutschkurs bezahlt. Jetzt komme ich gut zurecht.\n\n**17. Tâm:** Ich finde, man sollte sich überlegen, ob man mit unregelmäßigen Arbeitszeiten gut leben kann. Man arbeitet oft abends, am Wochenende und an Feiertagen. Das ist nicht für jeden geeignet.\n\n**18. Vy:** Für mich war die Entscheidung perfekt. In Vietnam hätte ich nie eine so professionelle Kochausbildung machen können, mit so vielen verschiedenen Küchenstationen und internationalen Köchen.\n\n**19. Khánh:** Ich vermisse oft meine Familie und das vietnamesische Essen, aber ich bin froh, weil ich hier so viel über internationale Küche lerne, wie ich es in Vietnam nie könnte.\n\n**20. Bảo:** Mein Tipp: Vor der Abreise unbedingt schon mal in einem Restaurant arbeiten oder ein Praktikum machen! Ich kannte vorher nur die Theorie und hatte am Anfang Probleme mit dem hohen Tempo im echten Service.",
          "statements": [
            {
              "id": "a",
              "text": "Diese Person empfiehlt, vor der Abreise praktische Erfahrung in einem Restaurant zu sammeln."
            },
            {
              "id": "b",
              "text": "Diese Person warnt, dass unregelmäßige Arbeitszeiten nicht für jeden geeignet sind."
            },
            {
              "id": "c",
              "text": "Diese Person konnte diese professionelle Kochausbildung in der Heimat nicht machen."
            },
            {
              "id": "d",
              "text": "Diese Person hat dank eines Deutschkurses besser mit Gästen kommunizieren können."
            },
            {
              "id": "e",
              "text": "Diese Person vermisst die Heimat, ist aber froh über das, was sie über internationale Küche lernt."
            }
          ],
          "questions": [
            {
              "id": 16,
              "name": "Hương",
              "correct": "d"
            },
            {
              "id": 17,
              "name": "Tâm",
              "correct": "b"
            },
            {
              "id": 18,
              "name": "Vy",
              "correct": "c"
            },
            {
              "id": 19,
              "name": "Khánh",
              "correct": "e"
            },
            {
              "id": 20,
              "name": "Bảo",
              "correct": "a"
            }
          ]
        },
        {
          "id": "teil5",
          "title": "Teil 5",
          "description": "Lesen Sie các quy định và quyết định: Richtig hay Falsch?",
          "text": "",
          "questions": [
            {
              "id": 21,
              "text": "Hände müssen nur vor Arbeitsbeginn gewaschen werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 22,
              "text": "Rohes Fleisch und Gemüse dürfen auf demselben Schneidebrett verarbeitet werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 23,
              "text": "Schmuck an den Händen ist beim Kochen verboten.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 24,
              "text": "Kühlschränke dürfen beliebig voll gepackt werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 25,
              "text": "Wer krank ist, muss das der Küchenleitung melden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        }
      ]
    },
    "hoeren": {
      "title": "Hören (Nghe hiểu)",
      "timeLimit": 2400,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Sie hören fünf kurze Texte. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "Text 1",
              "text": "„Achtung, liebe Kollegen: Die Gemüselieferung kommt heute erst um 11 Uhr, nicht wie geplant um 9 Uhr. Bitte fangt in der Zwischenzeit mit der Fleischvorbereitung an."
            },
            {
              "speaker": "Text 2",
              "text": "„Liebe Auszubildende, der Kurs Ernährungslehre findet morgen nicht in Raum 3, sondern in Raum 8 statt. Beginn bleibt wie gewohnt um 8 Uhr."
            },
            {
              "speaker": "Text 3",
              "text": "„Hallo An, hier ist Lisa. Ich kann heute Abend leider nicht zur Schicht kommen, weil ich krank bin. Kannst du das bitte dem Küchenchef sagen? Danke dir!"
            },
            {
              "speaker": "Text 4",
              "text": "„Liebe Mitarbeiter, heute Abend gibt es eine größere Reisegruppe. Bitte bereitet das Buffet schon ab 17 Uhr statt 18 Uhr vor."
            },
            {
              "speaker": "Text 5",
              "text": "„Achtung, für Tisch 12 ist heute Abend eine Reservierung für eine Geburtstagsfeier mit zehn Personen. Bitte bereitet rechtzeitig genug Plätze vor."
            }
          ],
          "questions": []
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Sie hören einen Vortrag. Wählen Sie bei jeder Aufgabe die richtige Antwort (a, b oder c).",
          "maxPlays": 1,
          "transcript": "„Infoabend zur Ausbildung als Koch/Hotelfachfrau in Deutschland\"\n\n„Guten Abend, liebe Gäste, schön, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen erklären, wie die Ausbildung im Gastgewerbe in Deutschland aufgebaut ist, zum Beispiel die Ausbildung zum Koch oder zur Hotelfachfrau.\n\nDie Ausbildung dauert in der Regel drei Jahre und ist eine duale Ausbildung, das heißt: Man lernt sowohl im Betrieb als auch in der Berufsschule. Im Betrieb arbeiten die Auszubildenden direkt in der Küche oder im Hotel, lernen also zum Beispiel, wie man Gerichte zubereitet, Gäste empfängt oder Zimmer organisiert. In der Berufsschule stehen Fächer wie Ernährungslehre, Warenkunde und Betriebswirtschaft auf dem Plan.\n\nIm ersten Ausbildungsjahr lernen die Azubis vor allem die Grundlagen: Hygieneregeln, einfache Gerichte, der erste Kontakt mit Gästen. Im zweiten und dritten Jahr kommen anspruchsvollere Themen dazu, zum Beispiel komplexe Menüs, Eventplanung oder Beschwerdemanagement. Am Ende der Ausbildung gibt es eine Abschlussprüfung mit einem theoretischen und einem praktischen Teil.\n\nDas Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 900 und 1.100 Euro brutto im Monat und steigt jedes Jahr. Nach erfolgreichem Abschluss übernehmen viele Betriebe ihre Azubis fest, weil aktuell sehr viele Fachkräfte im Gastgewerbe fehlen. Wer sich weiterbilden möchte, kann später zum Beispiel Küchenmeister, Hotelbetriebswirt oder sogar Restaurantleiter werden.\n\nIch kann Ihnen also sagen: Die Berufsaussichten im Gastgewerbe sind in Deutschland zurzeit sehr gut, gerade weil so viele engagierte Fachkräfte gesucht werden.\"",
          "segments": [
            {
              "speaker": "Vortragende/r",
              "text": "Infoabend zur Ausbildung als Koch/Hotelfachfrau in Deutschland\"\n\nGuten Abend, liebe Gäste, schön, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen erklären, wie die Ausbildung im Gastgewerbe in Deutschland aufgebaut ist, zum Beispiel die Ausbildung zum Koch oder zur Hotelfachfrau.\n\nDie Ausbildung dauert in der Regel drei Jahre und ist eine duale Ausbildung, das heißt: Man lernt sowohl im Betrieb als auch in der Berufsschule. Im Betrieb arbeiten die Auszubildenden direkt in der Küche oder im Hotel, lernen also zum Beispiel, wie man Gerichte zubereitet, Gäste empfängt oder Zimmer organisiert. In der Berufsschule stehen Fächer wie Ernährungslehre, Warenkunde und Betriebswirtschaft auf dem Plan.\n\nIm ersten Ausbildungsjahr lernen die Azubis vor allem die Grundlagen: Hygieneregeln, einfache Gerichte, der erste Kontakt mit Gästen. Im zweiten und dritten Jahr kommen anspruchsvollere Themen dazu, zum Beispiel komplexe Menüs, Eventplanung oder Beschwerdemanagement. Am Ende der Ausbildung gibt es eine Abschlussprüfung mit einem theoretischen und einem praktischen Teil.\n\nDas Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 900 und 1.100 Euro brutto im Monat und steigt jedes Jahr. Nach erfolgreichem Abschluss übernehmen viele Betriebe ihre Azubis fest, weil aktuell sehr viele Fachkräfte im Gastgewerbe fehlen. Wer sich weiterbilden möchte, kann später zum Beispiel Küchenmeister, Hotelbetriebswirt oder sogar Restaurantleiter werden.\n\nIch kann Ihnen also sagen: Die Berufsaussichten im Gastgewerbe sind in Deutschland zurzeit sehr gut, gerade weil so viele engagierte Fachkräfte gesucht werden.\""
            }
          ],
          "questions": [
            {
              "id": 31,
              "text": "Wie lange dauert die Ausbildung im Gastgewerbe normalerweise?",
              "options": [
                "Zwei Jahre",
                "Drei Jahre",
                "Fünf Jahre"
              ],
              "correct": 1
            },
            {
              "id": 32,
              "text": "Was lernen die Azubis vor allem im ersten Ausbildungsjahr?",
              "options": [
                "Komplexe Menüs und Eventplanung",
                "Vor allem die Grundlagen",
                "Nur Theorie in der Berufsschule"
              ],
              "correct": 1
            },
            {
              "id": 33,
              "text": "Welche Fächer stehen in der Berufsschule auf dem Plan?",
              "options": [
                "Ernährungslehre, Warenkunde und Betriebswirtschaft",
                "Nur Fremdsprachen",
                "Nur Mathematik"
              ],
              "correct": 0
            },
            {
              "id": 34,
              "text": "Wie hoch ist das Ausbildungsgehalt im ersten Jahr ungefähr?",
              "options": [
                "900–"
              ],
              "correct": 0
            },
            {
              "id": 1,
              "text": "100 Euro",
              "options": [
                "300–400 Euro",
                ""
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "000 Euro",
              "options": [],
              "correct": 0
            },
            {
              "id": 35,
              "text": "Was kann man nach der Ausbildung machen, wenn man sich weiterbilden möchte?",
              "options": [
                "Nur den Betrieb wechseln",
                "Küchenmeister, Hotelbetriebswirt oder Restaurantleiter werden",
                "Die Ausbildung noch einmal von vorne beginnen"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Sie hören ein Gespräch zwischen zwei Personen. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "An",
              "text": "Hey Linh, wie war dein Tag an der Rezeption?"
            },
            {
              "speaker": "Linh",
              "text": "Hallo An! Stressig, aber gut. Eine große Reisegruppe ist angekommen, und ich musste ganz schnell zwanzig Zimmer einchecken."
            },
            {
              "speaker": "An",
              "text": "Wow, das klingt anstrengend! Hast du das allein gemacht?"
            },
            {
              "speaker": "Linh",
              "text": "Nein, zum Glück hat mir meine Kollegin geholfen. Am Ende hat alles geklappt."
            },
            {
              "speaker": "An",
              "text": "Bei mir war heute Mittagsservice für eine Hochzeitsfeier. Wir mussten fünfzig Teller in kurzer Zeit fertig machen."
            },
            {
              "speaker": "Linh",
              "text": "Das stelle ich mir richtig stressig vor! Sag mal, gehst du heute Abend noch zum Deutschkurs?"
            },
            {
              "speaker": "An",
              "text": "Nein, heute nicht, der ist erst morgen. Aber ich muss noch ein paar neue Begriffe aus der Speisekarte lernen."
            },
            {
              "speaker": "Linh",
              "text": "Gute Idee. Übrigens, hast du gehört, dass es nächste Woche eine Schulung zu Beschwerdemanagement gibt?"
            },
            {
              "speaker": "An",
              "text": "Ja, davon habe ich gehört. Das könnte echt nützlich sein."
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Richtig – 37. Falsch – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 36,
              "text": "Linh musste heute zwanzig Zimmer einchecken.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 37,
              "text": "Linh hat die Arbeit ganz allein gemacht.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 38,
              "text": "An musste heute für eine Hochzeitsfeier kochen.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 39,
              "text": "An geht heute Abend noch zum Deutschkurs.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 40,
              "text": "Nächste Woche gibt es eine Schulung zu Beschwerdemanagement.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Sie hören eine Diskussion im Radio. Wer sagt was? Ordnen Sie die Aussagen zu.",
          "maxPlays": 2,
          "segments": [
            {
              "speaker": "An",
              "text": "Hey Linh, wie war dein Tag an der Rezeption?"
            },
            {
              "speaker": "Linh",
              "text": "Hallo An! Stressig, aber gut. Eine große Reisegruppe ist angekommen, und ich musste ganz schnell zwanzig Zimmer einchecken."
            },
            {
              "speaker": "An",
              "text": "Wow, das klingt anstrengend! Hast du das allein gemacht?"
            },
            {
              "speaker": "Linh",
              "text": "Nein, zum Glück hat mir meine Kollegin geholfen. Am Ende hat alles geklappt."
            },
            {
              "speaker": "An",
              "text": "Bei mir war heute Mittagsservice für eine Hochzeitsfeier. Wir mussten fünfzig Teller in kurzer Zeit fertig machen."
            },
            {
              "speaker": "Linh",
              "text": "Das stelle ich mir richtig stressig vor! Sag mal, gehst du heute Abend noch zum Deutschkurs?"
            },
            {
              "speaker": "An",
              "text": "Nein, heute nicht, der ist erst morgen. Aber ich muss noch ein paar neue Begriffe aus der Speisekarte lernen."
            },
            {
              "speaker": "Linh",
              "text": "Gute Idee. Übrigens, hast du gehört, dass es nächste Woche eine Schulung zu Beschwerdemanagement gibt?"
            },
            {
              "speaker": "An",
              "text": "Ja, davon habe ich gehört. Das könnte echt nützlich sein."
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Richtig – 37. Falsch – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 41,
              "text": "Diese Person hatte am Anfang Schwierigkeiten mit Höflichkeitsformeln und kleinen Witzen.",
              "options": [
                "Moderatorin",
                "Herr Schmidt",
                "Frau Trần"
              ],
              "correct": 2
            },
            {
              "id": 42,
              "text": "Diese Person lässt internationale Azubis jetzt regelmäßig Rollenspiele üben.",
              "options": [
                "Moderatorin",
                "Herr Schmidt",
                "Frau Trần"
              ],
              "correct": 1
            },
            {
              "id": 43,
              "text": "Diese Person fordert, dass Rollenspiele von Anfang an angeboten werden.",
              "options": [
                "Moderatorin",
                "Herr Schmidt",
                "Frau Trần"
              ],
              "correct": 2
            },
            {
              "id": 44,
              "text": "Diese Person stellt die Gäste im Studio vor.",
              "options": [
                "Moderatorin",
                "Herr Schmidt",
                "Frau Trần"
              ],
              "correct": 0
            },
            {
              "id": 45,
              "text": "Diese Person findet, dass Zuschauen am Anfang sehr hilft.",
              "options": [
                "Moderatorin",
                "Herr Schmidt",
                "Frau Trần"
              ],
              "correct": 1
            }
          ]
        }
      ]
    },
    "schreiben": {
      "title": "Schreiben (Viết)",
      "timeLimit": 3600,
      "tasks": [
        {
          "id": "task1",
          "title": "Nhiệm vụ 1: Viết E-Mail cá nhân",
          "description": "(ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie haben vor zwei Monaten Ihre Ausbildung zum Koch in Deutschland begonnen. Schreiben Sie Ihrer Freundin/Ihrem Freund in Vietnam eine E-Mail.\n\nSchreiben Sie:\n- Wie es Ihnen in der Küche geht\n- Was an der Arbeit schwierig bzw. schön ist\n- Eine Frage an Ihre Freundin/Ihren Freund",
          "sampleSolution": "Liebe Hoa,\nwie geht es dir? Ich bin jetzt seit zwei Monaten in Deutschland, und meine Ausbildung zum Koch macht mir richtig Spaß! Am Anfang fand ich das Arbeitstempo in der Küche sehr anstrengend, aber jetzt komme ich schon viel besser zurecht. Am schönsten finde ich, dass die Gäste sich oft über das Essen freuen – das motiviert mich sehr.\nWie läuft es bei dir? Hast du auch schon mal über eine Ausbildung in der Gastronomie im Ausland nachgedacht?\nSchreib mir bald!\nLiebe Grüße, An",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task2",
          "title": "Nhiệm vụ 2: Viết bài diễn đàn",
          "description": "– Meinung äußern (ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** In einem Online-Forum diskutieren junge Leute über folgendes Thema: „Ist Freundlichkeit zu Gästen wichtiger als fachliches Können?\" Schreiben Sie einen Beitrag.\n\nSchreiben Sie:\n- Ihre Meinung zum Thema\n- Ein Argument oder Beispiel dafür\n- Einen möglichen Gegenpunkt",
          "sampleSolution": "Meiner Meinung nach sind beide Eigenschaften wichtig, aber Freundlichkeit steht für mich an erster Stelle. Ein Gast verzeiht kleine fachliche Fehler eher, wenn er freundlich behandelt wird, aber unfreundliches Personal vergisst man schnell negativ. Natürlich darf man die fachlichen Fähigkeiten nicht vernachlässigen, denn ohne gutes Können funktioniert der Service nicht richtig. Ich denke aber, dass man Fachwissen mit der Zeit lernen kann, während echte Freundlichkeit oft schon eine Grundeinstellung ist.",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task3",
          "title": "Nhiệm vụ 3: Viết thư/E-Mail trang trọng",
          "description": "(ca. 40 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie können wegen einer Erkrankung nicht an einer geplanten Hygieneschulung teilnehmen. Schreiben Sie eine E-Mail an die Küchenleitung.\n\nSchreiben Sie:\n- Den Grund für Ihre Absage\n- Eine Bitte um einen Ersatztermin\n- Eine höfliche Schlussformel",
          "sampleSolution": "Sehr geehrte Frau Meier,\nleider kann ich am Freitag wegen einer Erkrankung nicht an der Hygieneschulung teilnehmen. Wäre es möglich, einen Ersatztermin zu bekommen? Vielen Dank im Voraus für Ihr Verständnis.\nMit freundlichen Grüßen\nLê Thị Hoa",
          "wordCountHint": "ca. 40 Wörter",
          "timeHint": "20 Minuten"
        }
      ]
    },
    "sprechen": {
      "title": "Sprechen (Nói)",
      "timeLimit": 900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1: Gemeinsam etwas planen",
          "description": "(ca. 3 Minuten)\n\n**Aufgabe:** Ihr Restaurant möchte einen „Vietnamesischen Themenabend\" für die Gäste organisieren. Planen Sie gemeinsam mit Ihrem Prüfungspartner/Ihrer Prüfungspartnerin.\n\n**Besprechen Sie:**\n- Termin und Uhrzeit\n- Welche Gerichte angeboten werden\n- Dekoration des Restaurants\n- Wie man für den Abend wirbt (Plakat, Social Media, Stammgäste informieren)",
          "usefulPhrases": [
            "Vorschlag machen:* „Wie wäre es, wenn wir …?\" / „Ich schlage vor, dass …\"",
            "Zustimmen:* „Das ist eine gute Idee.\" / „Einverstanden, machen wir das so.\"",
            "Ablehnen/Alternative vorschlagen:* „Das finde ich nicht so gut, weil … Wie wäre es stattdessen mit …?\"",
            "Aufgaben verteilen:* „Ich könnte mich um die Speisekarte kümmern, und du …?\""
          ],
          "sampleDialogue": "A: Ich schlage vor, dass wir Frühlingsrollen und Pho als Hauptgerichte anbieten, das kennen viele Gäste schon.\nB: Gute Idee! Sollen wir das Restaurant auch ein bisschen dekorieren, zum Beispiel mit Laternen?\nA: Ja, das passt gut. Und wer informiert die Stammgäste über den Themenabend?\nB: Das könnte ich machen, ich schreibe eine kleine Ankündigung für unsere Social-Media-Seite.",
          "scenario": "Sie planen einen vietnamesischen Themenabend im Restaurant.",
          "prompts": [
            "Termin und Uhrzeit",
            "Speisekarte/Gerichte",
            "Dekoration",
            "Werbung/Marketing"
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2: Ein Thema präsentieren",
          "description": "(2–3 Minuten)\n\n**Thema:** „Eine Ausbildung in der Gastronomie im Ausland machen\"\n\n**Sprechen Sie über:**\n- Ihre eigene Erfahrung (oder die, die Sie erwarten)\n- Die Situation in Ihrem Heimatland\n- Vorteile\n- Nachteile\n- Ihr Fazit/Ihre Meinung\n\n**Gliederungsvorschlag (Musterantwort, gekürzt):**\n\n> „Ich möchte heute über das Thema Ausbildung in der Gastronomie im Ausland sprechen. In Vietnam ist es für junge Leute oft schwierig, eine so professionelle Ausbildung im Gastgewerbe zu finden, mit so vielen verschiedenen Küchenstationen und internationalen Köchen. Deshalb entscheiden sich viele, nach Deutschland zu gehen.\n> Persönlich finde ich das eine große Chance: Man lernt nicht nur die Sprache, sondern auch neue Techniken und internationale Küche, die es bei uns kaum gibt.\n> Natürlich gibt es auch Nachteile: Die Arbeitszeiten sind oft unregelmäßig, man arbeitet viel am Wochenende, und man ist weit weg von der Familie.\n> Trotzdem denke ich, dass sich eine Ausbildung im Gastgewerbe im Ausland langfristig sehr lohnt, vor allem, wenn man gern mit Menschen arbeitet und Freude am Kochen oder am Service hat.\"",
          "sampleSolution": "",
          "topic": "Ausbildung in der Gastronomie im Ausland machen",
          "prompts": [
            "Eigene Erfahrung",
            "Situation im Heimatland",
            "Vorteile",
            "Nachteile",
            "Fazit/Meinung"
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3: Fragen stellen và Trả lời",
          "description": "(ca. 2 Minuten)\n\n**Aufgabe:** Stellen Sie Ihrem Prüfungspartner/Ihrer Prüfungspartnerin Fragen zu seinem/ihrem Thema (Teil 2) und beantworten Sie auch Fragen.\n\n**Beispiele für Fragen, die Sie stellen können:**\n- „Was war für dich am Anfang am schwierigsten im Umgang mit den Gästen?\"\n- „Würdest du anderen jungen Leuten eine Ausbildung in der Gastronomie im Ausland empfehlen? Warum (nicht)?\"\n- „Was vermisst du am meisten an deiner Heimat, wenn du arbeitest?\"\n\n**Beispiele für mögliche Antworten:**\n- „Am schwierigsten war für mich, schnell genug auf Wünsche der Gäste zu reagieren.\"\n- „Ja, ich würde es empfehlen, weil man dort sehr viel über internationale Küche und Service lernt.\"\n- „Am meisten vermisse ich das vietnamesische Essen und natürlich meine Familie.\"",
          "sampleQuestions": [],
          "sampleAnswers": []
        }
      ]
    }
  },
  {
    "id": "technik",
    "title": "Đề 3: Ngành Cơ khí - Kỹ thuật & Công nghệ (Technik)",
    "level": "B1",
    "lesen": {
      "title": "Lesen (Đọc hiểu)",
      "timeLimit": 3900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?",
          "text": "**Lesen Sie den Blog-Text und entscheiden Sie: Richtig oder Falsch?**\n\n### „Mein erster Monat als Mechatroniker-Azubi in Deutschland\" – Blog von Khải (21, aus Vietnam)\n\nHallo, ich heiße Khải und komme aus Vietnam. Seit einem Monat lebe ich in Stuttgart und mache eine Ausbildung zum Mechatroniker bei einem großen Maschinenbauunternehmen. Am Anfang war wirklich alles neu für mich: die vielen Fachbegriffe auf Deutsch, die großen Maschinen in der Werkhalle und natürlich auch das Leben in einer neuen Stadt.\n\nMein erster Tag in der Werkstatt war aufregend. Mein Ausbilder, Herr Wagner, hat mir gezeigt, wie man eine CNC-Maschine bedient und worauf man beim Arbeitsschutz unbedingt achten muss. Ich musste mir sehr viele neue Wörter merken, zum Beispiel „Schraubenschlüssel\", „Drehmaschine\" oder „Sicherheitsschuhe\". Zum Glück erklärt mir Herr Wagner alles geduldig, auch wenn ich manchmal mehrmals nachfragen muss.\n\nIn der Berufsschule lerne ich zwei Tage pro Woche Theorie, zum Beispiel Elektrotechnik und technisches Zeichnen. Die anderen drei Tage arbeite ich im Betrieb. Am Anfang hatte ich Respekt vor den großen Maschinen, aber jetzt fühle ich mich schon viel sicherer.\n\nWas mir besonders gefällt: Die Arbeit ist sehr genau, und man sieht am Ende immer ein fertiges Produkt – das macht mich stolz. Schwierig finde ich noch die vielen technischen Abkürzungen in den Handbüchern. Aber meine Kollegen helfen mir gern.\n\nAm Wochenende treffe ich mich oft mit anderen Azubis aus Vietnam. Wir kochen zusammen und sprechen über unsere Erfahrungen in der Werkstatt. Ich bin froh, dass ich diesen Weg gewählt habe, auch wenn es nicht immer leicht ist.",
          "questions": [
            {
              "id": 1,
              "text": "Khải lebt seit einem Monat in Stuttgart.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "Khải kannte von Anfang an alle Fachbegriffe auf Deutsch.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 3,
              "text": "Herr Wagner erklärt Khải die Dinge nur ein einziges Mal.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 4,
              "text": "Khải ist jeden Tag der Woche in der Berufsschule.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 5,
              "text": "Khải trifft sich am Wochenende mit anderen Azubis aus Vietnam.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).",
          "text": "**Lesen Sie den Artikel und wählen Sie die richtige Antwort (a, b oder c).**\n\n### „Fachkräftemangel in der Metall- und Elektroindustrie: Deutschland setzt auf Azubis aus dem Ausland\"\n\nIn der deutschen Metall- und Elektroindustrie fehlen aktuell tausende Fachkräfte. Besonders gesucht werden Mechatroniker, Industriemechaniker und Elektroniker. Der Grund: Viele erfahrene Facharbeiter gehen in den nächsten Jahren in Rente, aber es gibt nicht genug junge Deutsche, die eine technische Ausbildung machen möchten.\n\nDeshalb setzen immer mehr Unternehmen auf internationale Bewerber. Besonders aus Ländern wie Vietnam kommen viele junge Männer und Frauen, die technisch interessiert sind und eine Ausbildung in Deutschland machen wollen. Bevor sie einreisen dürfen, müssen sie in der Regel das Sprachniveau B1 nachweisen und einen Ausbildungsvertrag mit einem deutschen Betrieb vorlegen.\n\nEin Vorteil der technischen Ausbildung: Sie ist europaweit anerkannt und bietet gute Karrierechancen, zum Beispiel als Meister oder Techniker nach einer Weiterbildung. Außerdem verdienen Auszubildende in technischen Berufen oft etwas mehr als in anderen Branchen. Allerdings sind die Anforderungen auch hoch: Mathematik, technisches Verständnis und sehr genaues Arbeiten sind wichtig.\n\nExperten betonen, dass die Vorbereitung entscheidend ist. Wer bereits in der Heimat erste praktische Erfahrungen sammeln kann, zum Beispiel in einer Werkstatt, hat es später leichter. Auch gute Deutschkenntnisse, besonders bei technischen Fachbegriffen, sind sehr wichtig, da viele Maschinenhandbücher und Sicherheitsanweisungen nur auf Deutsch vorliegen.\n\nDie Unternehmen selbst reagieren ebenfalls: Viele bieten inzwischen begleitende Sprachkurse und Patenprogramme an, damit sich die neuen Azubis schneller einleben. Fachleute sind sich einig: Wer gut vorbereitet ist, hat in der deutschen Metall- und Elektroindustrie sehr gute Zukunftsaussichten.",
          "questions": [
            {
              "id": 6,
              "text": "Warum werden in der Metall- und Elektroindustrie viele Fachkräfte gesucht?",
              "options": [
                "Weil viele Betriebe schließen",
                "Weil viele erfahrene Facharbeiter in Rente gehen",
                "Weil die Ausbildung zu kurz ist"
              ],
              "correct": 1
            },
            {
              "id": 7,
              "text": "Was müssen Bewerber aus dem Ausland vor der Einreise meistens nachweisen?",
              "options": [
                "Das Sprachniveau B1",
                "Einen Universitätsabschluss",
                "Mehrjährige Berufserfahrung"
              ],
              "correct": 0
            },
            {
              "id": 8,
              "text": "Was ist laut Artikel ein Vorteil der technischen Ausbildung?",
              "options": [
                "Sie ist sehr kurz",
                "Sie ist europaweit anerkannt",
                "Sie kostet nichts"
              ],
              "correct": 1
            },
            {
              "id": 9,
              "text": "Welche Fähigkeiten sind laut Artikel besonders wichtig?",
              "options": [
                "Mathematik und technisches Verständnis",
                "Fremdsprachenkenntnisse in Englisch",
                "Erfahrung im Verkauf"
              ],
              "correct": 0
            },
            {
              "id": 10,
              "text": "Warum sind gute Deutschkenntnisse bei Fachbegriffen wichtig?",
              "options": [
                "Weil alle Kollegen nur Englisch sprechen",
                "Weil Maschinenhandbücher oft nur auf Deutsch vorliegen",
                "Weil es in Deutschland keine Übersetzer gibt"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Một quảng cáo không khớp với bất kỳ ai.",
          "text": "**Ordnen Sie den Personen (11–15) die passende Anzeige (a–g) zu. Zwei Anzeigen passen zu keiner Person.**\n\n**11. Phúc** interessiert sich für Elektrotechnik und möchte gern mit Strom und Schaltungen arbeiten.\n\n**12. Trang** hat handwerkliches Talent und möchte am liebsten mit Metall arbeiten, zum Beispiel schweißen.\n\n**13. Sơn** ist sehr genau und möchte gern an modernen CNC-Maschinen programmieren und fräsen.\n\n**14. Vy** interessiert sich für Autos und möchte gern in einer Autowerkstatt arbeiten.\n\n**15. Bình** möchte eine praktische technische Ausbildung machen, bei der er auch viel mit Steuerungstechnik und Programmieren zu tun hat.",
          "questions": [],
          "ads": [
            {
              "id": "a",
              "text": "*Elektrobetrieb Schulz, Leipzig* sucht Azubis zum Elektroniker für Betriebstechnik. Arbeit mit Schaltplänen, Strom und Steuerungen."
            },
            {
              "id": "b",
              "text": "*Schweißerei Hoffmann, Bremen* bietet Ausbildungsplatz zum Konstruktionsmechaniker an. Schwerpunkt Schweißen und Metallbearbeitung."
            },
            {
              "id": "c",
              "text": "*Präzisionstechnik GmbH, Stuttgart* sucht Azubis zum Zerspanungsmechaniker. Arbeit an modernen CNC-Maschinen, Programmieren und Fräsen."
            },
            {
              "id": "d",
              "text": "*Autohaus Becker, München* sucht Auszubildende zum Kfz-Mechatroniker. Reparatur und Wartung moderner Fahrzeuge."
            },
            {
              "id": "e",
              "text": "*IT-Systemhaus Weber, Köln* sucht Azubis zum Fachinformatiker. Schwerpunkt Softwareentwicklung, kaum praktische Werkstattarbeit."
            },
            {
              "id": "f",
              "text": "*Maschinenbau Krause, Hamburg* sucht Azubis zum Mechatroniker. Kombination aus Mechanik, Elektronik und Steuerungstechnik, Programmierkenntnisse von Vorteil."
            },
            {
              "id": "g",
              "text": "*Bürobedarf Lange & Co.* sucht Azubis im Bereich Bürokommunikation. Reine Verwaltungstätigkeit, kein technischer Bezug."
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Lesen Sie các bài viết diễn đàn. Phát biểu nào (a–e) phù hợp với người nào (16–20)?",
          "text": "**Lesen Sie die Forumsbeiträge. Welche Aussage (a–e) passt zu welcher Person (16–20)?**\n\n### Forum: „Lohnt sich eine technische Ausbildung im Ausland?\"\n\n**16. Tuấn:** Ich habe vor einem Jahr meine Ausbildung zum Mechatroniker in Deutschland begonnen und bin sehr zufrieden. Am Anfang war es schwer, die ganzen Fachbegriffe zu verstehen, aber mein Betrieb hat mir einen technischen Deutschkurs angeboten. Jetzt komme ich im Arbeitsalltag gut zurecht.\n\n**17. Linh:** Ich finde, man sollte sich gut überlegen, ob man körperlich für die Arbeit in der Werkstatt geeignet ist. Die Arbeit ist oft anstrengend, man steht viel, und manchmal ist es laut und schmutzig. Das unterschätzen viele.\n\n**18. Đạt:** Für mich war die Entscheidung goldrichtig. In Vietnam hätte ich diese moderne Ausbildung mit CNC-Maschinen und Robotertechnik niemals machen können, weil es solche Betriebe bei uns kaum gibt.\n\n**19. Hằng:** Ich vermisse oft meine Familie, und das technische Vokabular auf Deutsch ist wirklich eine Herausforderung. Trotzdem bin ich froh, weil ich hier viel mehr praktische Erfahrung sammle, als ich es in Vietnam könnte.\n\n**20. Quân:** Mein Tipp: Vor der Abreise unbedingt schon mal eine Werkstatt besuchen oder ein Praktikum machen! Ich kannte vorher nur Theorie und hatte am Anfang große Probleme, mich in der echten Werkhalle zurechtzufinden.",
          "statements": [
            {
              "id": "a",
              "text": "Diese Person empfiehlt, sich vor der Abreise praktisch vorzubereiten."
            },
            {
              "id": "b",
              "text": "Diese Person warnt, dass die körperliche Belastung in der Werkstatt oft unterschätzt wird."
            },
            {
              "id": "c",
              "text": "Diese Person konnte diese moderne Ausbildung in der Heimat nicht machen."
            },
            {
              "id": "d",
              "text": "Diese Person hat dank eines technischen Deutschkurses Fachbegriffe besser verstanden."
            },
            {
              "id": "e",
              "text": "Diese Person vermisst die Familie, ist aber froh über die praktische Erfahrung."
            }
          ],
          "questions": [
            {
              "id": 16,
              "name": "Tuấn",
              "correct": "d"
            },
            {
              "id": 17,
              "name": "Linh",
              "correct": "b"
            },
            {
              "id": 18,
              "name": "Đạt",
              "correct": "c"
            },
            {
              "id": 19,
              "name": "Hằng",
              "correct": "e"
            },
            {
              "id": 20,
              "name": "Quân",
              "correct": "a"
            }
          ]
        },
        {
          "id": "teil5",
          "title": "Teil 5",
          "description": "Lesen Sie các quy định và quyết định: Richtig hay Falsch?",
          "text": "",
          "questions": [
            {
              "id": 21,
              "text": "Sicherheitsschuhe müssen nur bei bestimmten Maschinen getragen werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 22,
              "text": "Man darf erst an einer Maschine arbeiten, wenn man eine Einweisung bekommen hat.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 23,
              "text": "Kleiner Schmuck ist beim Arbeiten an Maschinen erlaubt.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 24,
              "text": "Auch kleine Verletzungen müssen dem Ausbilder gemeldet werden.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 25,
              "text": "Werkzeuge dürfen über Nacht überall liegen bleiben.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            }
          ]
        }
      ]
    },
    "hoeren": {
      "title": "Hören (Nghe hiểu)",
      "timeLimit": 2400,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1",
          "description": "Sie hören fünf kurze Texte. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "Text 1",
              "text": "„Achtung, liebe Kollegen: Die Fräsmaschine Nummer 3 wird heute Nachmittag gewartet und steht deshalb bis 16 Uhr nicht zur Verfügung. Bitte nutzen Sie in der Zwischenzeit Maschine Nummer 5."
            },
            {
              "speaker": "Text 2",
              "text": "„Liebe Auszubildende, bitte beachten Sie: Die Zwischenprüfung im Fach Technisches Zeichnen wurde von Montag auf Mittwoch verschoben. Der Raum bleibt gleich."
            },
            {
              "speaker": "Text 3",
              "text": "„Hallo Khải, hier ist Jonas. Ich habe heute leider keine Zeit, die Schutzausrüstung zu kontrollieren. Kannst du das bitte für mich übernehmen? Danke dir!"
            },
            {
              "speaker": "Text 4",
              "text": "„Achtung: Am Donnerstag wird eine neue Lieferung Werkzeuge in der Lagerhalle abgeladen. Bitte parken Sie an diesem Tag nicht vor dem Lagereingang."
            },
            {
              "speaker": "Text 5",
              "text": "„Liebe Mitarbeiter, am Freitag um 10 Uhr findet eine Feuerübung statt. Bitte verlassen Sie dann sofort das Gebäude über die markierten Notausgänge."
            }
          ],
          "questions": []
        },
        {
          "id": "teil2",
          "title": "Teil 2",
          "description": "Sie hören einen Vortrag. Wählen Sie bei jeder Aufgabe die richtige Antwort (a, b oder c).",
          "maxPlays": 1,
          "transcript": "„Infoabend zur Ausbildung als Mechatroniker in Deutschland\"\n\n„Guten Abend, liebe Gäste, ich freue mich, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen erklären, wie die Ausbildung zum Mechatroniker in Deutschland aufgebaut ist.\n\nDie Ausbildung dauert in der Regel dreieinhalb Jahre und ist eine duale Ausbildung, das heißt: Man lernt sowohl im Betrieb als auch in der Berufsschule. Im Betrieb arbeiten die Auszubildenden direkt an Maschinen und Anlagen, lernen also zum Beispiel, wie man Bauteile montiert, Maschinen wartet oder Fehler an Steuerungen findet. In der Berufsschule stehen Fächer wie Elektrotechnik, Mechanik und technisches Zeichnen auf dem Plan.\n\nIm ersten Ausbildungsjahr lernen die Azubis vor allem die Grundlagen: Werkzeuge richtig benutzen, einfache Bauteile herstellen, Sicherheitsregeln einhalten. Im zweiten und dritten Jahr kommen anspruchsvollere Themen dazu, zum Beispiel Pneumatik, Hydraulik und Steuerungstechnik. Am Ende der Ausbildung gibt es eine Abschlussprüfung mit einem theoretischen und einem praktischen Teil, bei dem die Auszubildenden ein eigenes Projekt umsetzen müssen.\n\nDas Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 1.000 und 1.100 Euro brutto im Monat und steigt jedes Jahr deutlich. Nach erfolgreichem Abschluss übernehmen viele Betriebe ihre Azubis fest, weil aktuell sehr viele Fachkräfte im technischen Bereich fehlen. Wer sich weiterbilden möchte, kann später zum Beispiel Techniker oder Meister werden, oder sogar studieren.\n\nIch kann Ihnen also sagen: Die Berufsaussichten für Mechatroniker sind in Deutschland zurzeit sehr gut, und viele Türen stehen offen.\"",
          "segments": [
            {
              "speaker": "Vortragende/r",
              "text": "Infoabend zur Ausbildung als Mechatroniker in Deutschland\"\n\nGuten Abend, liebe Gäste, ich freue mich, dass Sie heute zu unserem Infoabend gekommen sind. Ich möchte Ihnen erklären, wie die Ausbildung zum Mechatroniker in Deutschland aufgebaut ist.\n\nDie Ausbildung dauert in der Regel dreieinhalb Jahre und ist eine duale Ausbildung, das heißt: Man lernt sowohl im Betrieb als auch in der Berufsschule. Im Betrieb arbeiten die Auszubildenden direkt an Maschinen und Anlagen, lernen also zum Beispiel, wie man Bauteile montiert, Maschinen wartet oder Fehler an Steuerungen findet. In der Berufsschule stehen Fächer wie Elektrotechnik, Mechanik und technisches Zeichnen auf dem Plan.\n\nIm ersten Ausbildungsjahr lernen die Azubis vor allem die Grundlagen: Werkzeuge richtig benutzen, einfache Bauteile herstellen, Sicherheitsregeln einhalten. Im zweiten und dritten Jahr kommen anspruchsvollere Themen dazu, zum Beispiel Pneumatik, Hydraulik und Steuerungstechnik. Am Ende der Ausbildung gibt es eine Abschlussprüfung mit einem theoretischen und einem praktischen Teil, bei dem die Auszubildenden ein eigenes Projekt umsetzen müssen.\n\nDas Ausbildungsgehalt liegt im ersten Jahr meistens zwischen 1.000 und 1.100 Euro brutto im Monat und steigt jedes Jahr deutlich. Nach erfolgreichem Abschluss übernehmen viele Betriebe ihre Azubis fest, weil aktuell sehr viele Fachkräfte im technischen Bereich fehlen. Wer sich weiterbilden möchte, kann später zum Beispiel Techniker oder Meister werden, oder sogar studieren.\n\nIch kann Ihnen also sagen: Die Berufsaussichten für Mechatroniker sind in Deutschland zurzeit sehr gut, und viele Türen stehen offen.\""
            }
          ],
          "questions": [
            {
              "id": 31,
              "text": "Wie lange dauert die Ausbildung zum Mechatroniker?",
              "options": [
                "Zwei Jahre",
                "Dreieinhalb Jahre",
                "Fünf Jahre"
              ],
              "correct": 1
            },
            {
              "id": 32,
              "text": "Was lernen die Azubis vor allem im ersten Ausbildungsjahr?",
              "options": [
                "Pneumatik und Hydraulik",
                "Vor allem die Grundlagen",
                "Nur Theorie in der Berufsschule"
              ],
              "correct": 1
            },
            {
              "id": 33,
              "text": "Was müssen die Azubis bei der Abschlussprüfung machen?",
              "options": [
                "Nur einen schriftlichen Test schreiben",
                "Ein eigenes Projekt umsetzen",
                "Ein Praktikum im Ausland machen"
              ],
              "correct": 1
            },
            {
              "id": 34,
              "text": "Wie hoch ist das Ausbildungsgehalt im ersten Jahr ungefähr?",
              "options": [
                ""
              ],
              "correct": 0
            },
            {
              "id": 1,
              "text": "000–",
              "options": [],
              "correct": 0
            },
            {
              "id": 1,
              "text": "100 Euro",
              "options": [
                "500–600 Euro",
                ""
              ],
              "correct": 0
            },
            {
              "id": 2,
              "text": "500 Euro",
              "options": [],
              "correct": 0
            },
            {
              "id": 35,
              "text": "Was kann man nach der Ausbildung machen, wenn man sich weiterbilden möchte?",
              "options": [
                "Nur in einem anderen Betrieb arbeiten",
                "Techniker, Meister werden oder studieren",
                "Die Ausbildung noch einmal wiederholen"
              ],
              "correct": 1
            }
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3",
          "description": "Sie hören ein Gespräch zwischen zwei Personen. Entscheiden Sie: Richtig oder Falsch?",
          "maxPlays": 1,
          "segments": [
            {
              "speaker": "Sơn",
              "text": "Hey Trang, wie war dein Tag an der CNC-Maschine?"
            },
            {
              "speaker": "Trang",
              "text": "Hallo Sơn! Ganz gut, aber ich musste heute zum ersten Mal das Programm für ein neues Bauteil selbst schreiben. Das war schon nervenaufreibend."
            },
            {
              "speaker": "Sơn",
              "text": "Das kann ich mir vorstellen! Hat dir dein Ausbilder geholfen?"
            },
            {
              "speaker": "Trang",
              "text": "Ja, zum Glück. Er hat mir gezeigt, wie ich die Koordinaten richtig eingebe. Am Ende hat alles funktioniert."
            },
            {
              "speaker": "Sơn",
              "text": "Bei mir war heute Schweißtag. Ich musste die ganze Zeit die Schutzmaske tragen, das ist echt anstrengend für die Augen."
            },
            {
              "speaker": "Trang",
              "text": "Stimmt, ich hatte das letzte Woche auch. Sag mal, gehst du heute noch zum Deutschkurs?"
            },
            {
              "speaker": "Sơn",
              "text": "Nein, heute nicht, der ist erst morgen. Aber ich muss noch die Fachbegriffe aus dem Handbuch lernen, die ich nicht verstanden habe."
            },
            {
              "speaker": "Trang",
              "text": "Gute Idee. Übrigens, hast du schon gehört, dass es nächste Woche eine Werkstattführung für neue Azubis gibt?"
            },
            {
              "speaker": "Sơn",
              "text": "Ja, davon habe ich gehört. Da kann man bestimmt viel Neues lernen."
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Richtig – 37. Falsch – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 36,
              "text": "Trang musste heute zum ersten Mal ein Programm für ein Bauteil schreiben.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 37,
              "text": "Trangs Ausbilder hat ihr nicht geholfen.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 38,
              "text": "Sơn musste heute schweißen.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            },
            {
              "id": 39,
              "text": "Sơn geht heute noch zum Deutschkurs.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 1
            },
            {
              "id": 40,
              "text": "Nächste Woche gibt es eine Werkstattführung für neue Azubis.",
              "options": [
                "Richtig",
                "Falsch"
              ],
              "correct": 0
            }
          ]
        },
        {
          "id": "teil4",
          "title": "Teil 4",
          "description": "Sie hören eine Diskussion im Radio. Wer sagt was? Ordnen Sie die Aussagen zu.",
          "maxPlays": 2,
          "segments": [
            {
              "speaker": "Sơn",
              "text": "Hey Trang, wie war dein Tag an der CNC-Maschine?"
            },
            {
              "speaker": "Trang",
              "text": "Hallo Sơn! Ganz gut, aber ich musste heute zum ersten Mal das Programm für ein neues Bauteil selbst schreiben. Das war schon nervenaufreibend."
            },
            {
              "speaker": "Sơn",
              "text": "Das kann ich mir vorstellen! Hat dir dein Ausbilder geholfen?"
            },
            {
              "speaker": "Trang",
              "text": "Ja, zum Glück. Er hat mir gezeigt, wie ich die Koordinaten richtig eingebe. Am Ende hat alles funktioniert."
            },
            {
              "speaker": "Sơn",
              "text": "Bei mir war heute Schweißtag. Ich musste die ganze Zeit die Schutzmaske tragen, das ist echt anstrengend für die Augen."
            },
            {
              "speaker": "Trang",
              "text": "Stimmt, ich hatte das letzte Woche auch. Sag mal, gehst du heute noch zum Deutschkurs?"
            },
            {
              "speaker": "Sơn",
              "text": "Nein, heute nicht, der ist erst morgen. Aber ich muss noch die Fachbegriffe aus dem Handbuch lernen, die ich nicht verstanden habe."
            },
            {
              "speaker": "Trang",
              "text": "Gute Idee. Übrigens, hast du schon gehört, dass es nächste Woche eine Werkstattführung für neue Azubis gibt?"
            },
            {
              "speaker": "Sơn",
              "text": "Ja, davon habe ich gehört. Da kann man bestimmt viel Neues lernen."
            },
            {
              "speaker": "Lösungen Teil 3",
              "text": "36. Richtig – 37. Falsch – 38. Richtig – 39. Falsch – 40. Richtig"
            }
          ],
          "questions": [
            {
              "id": 41,
              "text": "Diese Person hatte damals keinen Fachsprachenkurs und musste sich Begriffe selbst heraussuchen.",
              "options": [
                "Moderator",
                "Frau Huber",
                "Herr Phạm"
              ],
              "correct": 2
            },
            {
              "id": 42,
              "text": "Diese Person bietet inzwischen einen zusätzlichen Fachsprachenkurs an.",
              "options": [
                "Moderator",
                "Frau Huber",
                "Herr Phạm"
              ],
              "correct": 1
            },
            {
              "id": 43,
              "text": "Diese Person fordert einen verpflichtenden technischen Sprachkurs vor Ausbildungsbeginn.",
              "options": [
                "Moderator",
                "Frau Huber",
                "Herr Phạm"
              ],
              "correct": 2
            },
            {
              "id": 44,
              "text": "Diese Person stellt die Gäste im Studio vor.",
              "options": [
                "Moderator",
                "Frau Huber",
                "Herr Phạm"
              ],
              "correct": 0
            },
            {
              "id": 45,
              "text": "Diese Person findet, dass erfahrene Kollegen als Mentoren enorm helfen.",
              "options": [
                "Moderator",
                "Frau Huber",
                "Herr Phạm"
              ],
              "correct": 1
            }
          ]
        }
      ]
    },
    "schreiben": {
      "title": "Schreiben (Viết)",
      "timeLimit": 3600,
      "tasks": [
        {
          "id": "task1",
          "title": "Nhiệm vụ 1: Viết E-Mail cá nhân",
          "description": "(ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie haben vor zwei Monaten Ihre Ausbildung zum Mechatroniker in Deutschland begonnen. Schreiben Sie Ihrer Freundin/Ihrem Freund in Vietnam eine E-Mail.\n\nSchreiben Sie:\n- Wie es Ihnen in der Werkstatt geht\n- Was an der Arbeit schwierig bzw. schön ist\n- Eine Frage an Ihre Freundin/Ihren Freund",
          "sampleSolution": "Lieber Nam,\nwie geht es dir? Ich bin jetzt seit zwei Monaten in Deutschland, und meine Ausbildung zum Mechatroniker macht mir richtig Spaß! Am Anfang fand ich die vielen Fachbegriffe in der Werkstatt sehr schwierig, aber jetzt verstehe ich schon viel mehr. Am schönsten finde ich, dass ich am Ende des Tages immer etwas Fertiges in der Hand halte – das macht mich stolz.\nWie läuft es bei dir? Hast du auch schon mal über eine technische Ausbildung im Ausland nachgedacht?\nSchreib mir bald!\nLiebe Grüße, Khải",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task2",
          "title": "Nhiệm vụ 2: Viết bài diễn đàn",
          "description": "– Meinung äußern (ca. 80 Wörter, ca. 20 Minuten)\n\n**Situation:** In einem Online-Forum diskutieren junge Leute über folgendes Thema: „Sollten sich mehr junge Frauen für technische Ausbildungsberufe entscheiden?\" Schreiben Sie einen Beitrag.\n\nSchreiben Sie:\n- Ihre Meinung zum Thema\n- Ein Argument oder Beispiel dafür\n- Einen möglichen Gegenpunkt",
          "sampleSolution": "Meiner Meinung nach sollten sich definitiv mehr junge Frauen für technische Berufe entscheiden. Technik hat nichts mit dem Geschlecht zu tun, sondern mit Interesse und Geschick. Ich kenne selbst eine Kollegin, die als Zerspanungsmechanikerin arbeitet und sehr erfolgreich ist. Natürlich ist die Werkstatt manchmal noch sehr männlich geprägt, und manche Frauen fühlen sich am Anfang unsicher. Trotzdem denke ich, dass sich das mit mehr weiblichen Vorbildern schnell ändern wird.",
          "wordCountHint": "ca. 80 Wörter",
          "timeHint": "20 Minuten"
        },
        {
          "id": "task3",
          "title": "Nhiệm vụ 3: Viết thư/E-Mail trang trọng",
          "description": "(ca. 40 Wörter, ca. 20 Minuten)\n\n**Situation:** Sie können wegen eines Arzttermins nicht an einer geplanten Sicherheitsschulung teilnehmen. Schreiben Sie eine E-Mail an Ihren Ausbilder.\n\nSchreiben Sie:\n- Den Grund für Ihre Absage\n- Eine Bitte um einen Ersatztermin\n- Eine höfliche Schlussformel",
          "sampleSolution": "Sehr geehrter Herr Wagner,\nleider kann ich am Donnerstag wegen eines Arzttermins nicht an der Sicherheitsschulung teilnehmen. Wäre es möglich, einen Ersatztermin zu bekommen? Vielen Dank im Voraus für Ihr Verständnis.\nMit freundlichen Grüßen\nTrần Văn Phúc",
          "wordCountHint": "ca. 40 Wörter",
          "timeHint": "20 Minuten"
        }
      ]
    },
    "sprechen": {
      "title": "Sprechen (Nói)",
      "timeLimit": 900,
      "parts": [
        {
          "id": "teil1",
          "title": "Teil 1: Gemeinsam etwas planen",
          "description": "(ca. 3 Minuten)\n\n**Aufgabe:** Ihr Ausbildungsbetrieb möchte einen „Tag der offenen Tür\" organisieren, um Schüler für eine technische Ausbildung zu begeistern. Planen Sie gemeinsam mit Ihrem Prüfungspartner/Ihrer Prüfungspartnerin.\n\n**Besprechen Sie:**\n- Termin und Uhrzeit\n- Welche Maschinen/Stationen den Schülern gezeigt werden\n- Wer welche Aufgabe übernimmt (Führung, Erklärungen, Snacks)\n- Wie man die Schüler einlädt (Schulen kontaktieren, Plakate, Social Media)",
          "usefulPhrases": [
            "Vorschlag machen:* „Wie wäre es, wenn wir …?\" / „Ich schlage vor, dass …\"",
            "Zustimmen:* „Das ist eine gute Idee.\" / „Einverstanden, machen wir das so.\"",
            "Ablehnen/Alternative vorschlagen:* „Das finde ich nicht so gut, weil … Wie wäre es stattdessen mit …?\"",
            "Aufgaben verteilen:* „Ich könnte die Führung an der CNC-Maschine übernehmen, und du …?\""
          ],
          "sampleDialogue": "A: Ich schlage vor, dass wir die Schüler zuerst an der CNC-Maschine vorbeiführen, das ist immer am beeindruckendsten.\nB: Gute Idee! Soll ich dann die Schweißstation übernehmen?\nA: Klar, gerne. Und wer kümmert sich um die Einladungen an die Schulen?\nB: Das könnte ich machen, ich schreibe einfach eine E-Mail an die umliegenden Schulen.",
          "scenario": "Sie planen einen Tag der offenen Tür für Ihren Ausbildungsbetrieb.",
          "prompts": [
            "Termin und Uhrzeit",
            "Stationen/Maschinen zum Zeigen",
            "Aufgabenverteilung",
            "Einladung der Schüler"
          ]
        },
        {
          "id": "teil2",
          "title": "Teil 2: Ein Thema präsentieren",
          "description": "(2–3 Minuten)\n\n**Thema:** „Eine technische Ausbildung im Ausland machen\"\n\n**Sprechen Sie über:**\n- Ihre eigene Erfahrung (oder die, die Sie erwarten)\n- Die Situation in Ihrem Heimatland\n- Vorteile\n- Nachteile\n- Ihr Fazit/Ihre Meinung\n\n**Gliederungsvorschlag (Musterantwort, gekürzt):**\n\n> „Ich möchte heute über das Thema technische Ausbildung im Ausland sprechen. In Vietnam ist es für junge Leute oft schwierig, eine moderne technische Ausbildung zu finden, zum Beispiel mit CNC-Maschinen oder Robotertechnik. Deshalb entscheiden sich viele, nach Deutschland zu gehen.\n> Persönlich finde ich das eine große Chance: Man lernt nicht nur die Sprache, sondern auch ganz neue technische Verfahren, die es bei uns noch kaum gibt.\n> Natürlich gibt es auch Nachteile: Die Fachsprache ist eine echte Herausforderung, die Arbeit in der Werkhalle ist manchmal körperlich anstrengend, und man ist weit weg von der Familie.\n> Trotzdem denke ich, dass sich eine technische Ausbildung im Ausland langfristig sehr lohnt, vor allem, wenn man bereit ist, sich vorher gut vorzubereiten.\"",
          "sampleSolution": "",
          "topic": "Eine technische Ausbildung im Ausland machen",
          "prompts": [
            "Eigene Erfahrung",
            "Situation im Heimatland",
            "Vorteile",
            "Nachteile",
            "Fazit/Meinung"
          ]
        },
        {
          "id": "teil3",
          "title": "Teil 3: Fragen stellen và Trả lời",
          "description": "(ca. 2 Minuten)\n\n**Aufgabe:** Stellen Sie Ihrem Prüfungspartner/Ihrer Prüfungspartnerin Fragen zu seinem/ihrem Thema (Teil 2) und beantworten Sie auch Fragen.\n\n**Beispiele für Fragen, die Sie stellen können:**\n- „Was war für dich am Anfang die größte technische Herausforderung?\"\n- „Würdest du anderen jungen Leuten eine technische Ausbildung im Ausland empfehlen? Warum (nicht)?\"\n- „Welche Fachbegriffe waren für dich besonders schwierig zu lernen?\"\n\n**Beispiele für mögliche Antworten:**\n- „Am schwierigsten war für mich am Anfang, die ganzen Fachbegriffe in der Werkstatt zu verstehen.\"\n- „Ja, ich würde es empfehlen, weil man dort sehr moderne Technik kennenlernt.\"\n- „Begriffe aus der Steuerungstechnik waren für mich besonders schwierig.\"",
          "sampleQuestions": [],
          "sampleAnswers": []
        }
      ]
    }
  }
];
