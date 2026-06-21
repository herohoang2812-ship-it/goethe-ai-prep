import { balanceAnswerPositions } from './balanceOptions.js';

export const LESEN_EXAMS = [
  {
    id: 1,
    level: 'B1',
    title: 'Goethe B1 Lesen Teil 1 — Đọc hiểu thực tế: Làm việc trong Viện dưỡng lão',
    text: 'Arbeit im Altenheim: Viele junge Menschen aus Vietnam entscheiden sich für eine Ausbildung in Deutschland. Die Arbeit im Altenheim ist anspruchsvoll, aber sehr erfüllend. Die Auszubildenden lernen nicht nur die medizinische Pflege, sondern auch, wie man mit älteren Menschen spricht und sie im Alltag unterstützt. Ein großes Problem für viele Auszubildende am Anfang ist die Sprache. Obwohl sie in Vietnam das B1-Zertifikat erworben haben, verstehen sie im Arbeitsalltag oft die lokalen Dialekte oder die schnelle Umgangssprache nicht sofort. Deshalb ist eine kontinuierliche Weiterbildung sehr wichtig. Ein weiterer wichtiger Aspekt ist die Schichtarbeit. Die Frühschicht beginnt oft schon um 6:00 Uhr morgens, während die Spätschicht bis 22:00 Uhr dauert. Auch Wochenenddienste gehören zum Alltag dazu. Das erfordert ein gutes Zeitmanagement und körperliche Belastbarkeit. Dennoch betonen viele vietnamesische Auszubildende, dass die Herzlichkeit der Bewohner und die gute Unterstützung durch deutsche Kollegen ihnen helfen, diese Herausforderungen zu meistern.',
    questions: [
      {
        id: 101,
        question: 'Tại sao nhiều thanh niên Việt Nam chọn học nghề tại Đức cảm thấy khó khăn ban đầu?',
        options: [
          'A. Vì công việc điều dưỡng quá nặng nhọc và không được trả lương.',
          'B. Vì ngôn ngữ thực tế trong công việc nhanh và có tiếng địa phương khác với khi học B1.',
          'C. Vì họ không được học về kỹ năng chăm sóc y tế mà chỉ học giao tiếp.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu: "Obwohl sie in Vietnam das B1-Zertifikat erworben haben, verstehen sie im Arbeitsalltag oft die lokalen Dialekte oder die schnelle Umgangssprache nicht sofort." (Mặc dù đã có bằng B1 ở Việt Nam, họ thường không hiểu ngay tiếng địa phương hoặc khẩu ngữ nhanh trong thực tế).'
      },
      {
        id: 102,
        question: 'Chương trình học nghề điều dưỡng ở Đức đào tạo những gì?',
        options: [
          'A. Chỉ đào tạo kỹ năng y tế chuyên sâu.',
          'B. Đào tạo cả kỹ năng y tế lẫn kỹ năng hỗ trợ đời sống, giao tiếp với người già.',
          'C. Chỉ tập trung vào việc học tiếng Đức thương mại.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu: "Die Auszubildenden lernen nicht nur die medizinische Pflege, sondern auch, wie man mit älteren Menschen spricht und sie im Alltag unterstützt."'
      },
      {
        id: 103,
        question: 'Thời gian làm việc ca kíp (Schichtarbeit) được mô tả như thế nào?',
        options: [
          'A. Ca sáng bắt đầu muộn lúc 9:00 và kết thúc sớm.',
          'B. Ca sáng bắt đầu lúc 6:00 sáng, ca chiều kéo dài đến 22:00 tối, bao gồm cả làm việc cuối tuần.',
          'C. Học viên chỉ phải làm ca hành chính từ 8:00 đến 17:00.'
        ],
        correct: 1,
        explanation: 'Đoạn văn nêu rõ: "Die Frühschicht beginnt oft schon um 6:00 Uhr morgens, während die Spätschicht bis 22:00 Uhr dauert. Auch Wochenenddienste gehören zum Alltag dazu."'
      }
    ]
  },
  {
    id: 2,
    level: 'B1',
    title: 'Goethe B1 Lesen Teil 2 — Lựa chọn phương tiện giao thông thân thiện môi trường',
    text: 'Immer mehr deutsche Großstädte versuchen, den Autoverkehr im Stadtzentrum zu reduzieren. In Städten wie Freiburg oder Münster nutzen bereits mehr als 40 Prozent der Einwohner das Fahrrad für die täglichen Wege zur Arbeit oder Schule. Dies liegt vor allem an den gut ausgebauten Radwegen und der Einführung von Fahrradstraßen, auf denen Fahrräder Vorrang vor Autos haben. Für längere Strecken bietet der öffentliche Personennahverkehr (ÖPNV) eine umweltfreundliche Alternative. Mit dem Deutschlandticket können Bürger alle Busse und Nahverkehrszüge im ganzen Land unbegrenzt nutzen. Das Ticket hat zu einem deutlichen Anstieg der Fahrgastzahlen geführt. Experten fordern jedoch einen weiteren Ausbau der Zugverbindungen, besonders im ländlichen Raum, da dort Busse oft nur selten fahren und die Menschen weiterhin auf das eigene Auto angewiesen sind.',
    questions: [
      {
        id: 201,
        question: 'Yếu tố nào giúp tỷ lệ đi xe đạp ở Freiburg hay Münster đạt mức cao?',
        options: [
          'A. Do thời tiết ở các thành phố này mát mẻ quanh năm.',
          'B. Do cơ sở hạ tầng làn đường dành riêng cho xe đạp tốt và có các tuyến phố ưu tiên xe đạp.',
          'C. Do chính quyền cấm hoàn toàn xe ô tô đi vào thành phố.'
        ],
        correct: 1,
        explanation: 'Văn bản viết: "Dies liegt vor allem an den gut ausgebauten Radwegen und der Einführung von Fahrradstraßen, auf denen Fahrräder Vorrang vor Autos haben."'
      },
      {
        id: 202,
        question: 'Lợi ích lớn nhất của Deutschlandticket là gì?',
        options: [
          'A. Miễn phí di chuyển cho tất cả học sinh và sinh viên.',
          'B. Cho phép đi không giới hạn các phương tiện công cộng và tàu nội đô trên cả nước với một vé tháng dùng trên toàn quốc.',
          'C. Giúp rút ngắn một nửa thời gian di chuyển của các đoàn tàu nhanh ICE.'
        ],
        correct: 1,
        explanation: 'Đoạn văn viết: "Mit dem Deutschlandticket können Bürger alle Busse und Nahverkehrszüge im ganzen Land unbegrenzt nutzen."'
      },
      {
        id: 203,
        question: 'Khó khăn nào còn tồn tại ở vùng nông thôn đối với giao thông công cộng?',
        options: [
          'A. Người dân nông thôn không được phép mua vé Deutschlandticket.',
          'B. Tàu xe công cộng chạy thưa thớt, khiến người dân vẫn phụ thuộc vào xe cá nhân.',
          'C. Không có đường cho xe buýt hoạt động.'
        ],
        correct: 1,
        explanation: 'Văn bản nêu: "...da dort Busse oft nur selten fahren und die Menschen weiterhin auf das eigene Auto angewiesen sind."'
      }
    ]
  },
  {
    id: 3,
    level: 'B1',
    title: 'Goethe B1 Lesen Teil 3 — Thói quen đọc sách của giới trẻ hiện nay',
    text: 'Hat das gedruckte Buch in Zeiten von E-Book-Readern, Smartphones und Tablets noch eine Zukunft? Eine aktuelle Umfrage unter Jugendlichen im Alter von 12 bis 19 Jahren zeigt ein überraschendes Ergebnis. Trotz der Allgegenwart digitaler Medien liest fast die Hälfte der Befragten regelmäßig Bücher auf Papier. Die Gründe dafür sind vielfältig: Viele Jugendliche schätzen das Gefühl, ein echtes Buch in den Händen zu halten, die Seiten umzublättern und das Buch nach dem Lesen im Zimmer ins Regal zu stellen. E-Books werden vor allem auf Reisen oder auf dem Weg zur Schule genutzt, da sie leicht sind und man viele Bücher auf einmal mitnehmen kann. Allerdings gibt es auch einen besorgniserregenden Trend: Etwa ein Viertel der Jugendlichen gibt an, in der Freizeit fast nie zu lesen. Sie verbringen ihre freie Zeit lieber mit Videospielen oder in sozialen Netzwerken.',
    questions: [
      {
        id: 301,
        question: 'Kết quả cuộc khảo sát về thói quen đọc sách của thanh thiếu niên chỉ ra điều gì?',
        options: [
          'A. Sách in giấy đã hoàn toàn biến mất và bị thay thế bởi E-Book.',
          'B. Gần một nửa số người được hỏi vẫn thường xuyên đọc sách in truyền thống.',
          'C. Hầu hết thanh thiếu niên chỉ đọc sách giáo khoa bắt buộc tại trường học.'
        ],
        correct: 1,
        explanation: 'Văn bản nêu: "...liest fast die Hälfte der Befragten regelmäßig Bücher auf Papier." (gần một nửa số người được khảo sát đọc sách trên giấy thường xuyên).'
      },
      {
        id: 302,
        question: 'Ưu điểm của E-book đối với giới trẻ là gì?',
        options: [
          'A. Sách điện tử có hình ảnh đẹp và font chữ lớn hơn.',
          'B. Chúng nhẹ nhàng, tiện mang theo nhiều cuốn cùng lúc khi đi du lịch hoặc đến trường.',
          'C. E-book hoàn toàn miễn phí cho tất cả mọi người.'
        ],
        correct: 1,
        explanation: 'Đoạn văn viết: "E-Books werden vor allem auf Reisen oder auf dem Weg zur Schule genutzt, da sie leicht sind und man viele Bücher auf einmal mitnehmen kann."'
      }
    ]
  },
  {
    id: 4,
    level: 'B1',
    title: 'Goethe B1 Lesen Teil 4 — Xu hướng ăn chay ở các trường đại học Đức',
    text: 'In deutschen Universitätsmensabetrieben vollzieht sich ein Wandel. Früher waren Gerichte wie Currywurst mit Pommes oder Schnitzel die unangefochtenen Favoriten der Studenten. Heute hingegen verzeichnen vegetarische und vegane Menüs eine stetig wachsende Nachfrage. Viele Mensen in Berlin, München und Köln bieten mittlerweile täglich mehrere fleischlose Alternativen an. Die Gründe für diese Ernährungsumstellung sind primär der Klimaschutz und das Tierwohl. Studenten sind sich der ökologischen Auswirkungen der Massentierhaltung bewusst und möchten durch ihren Konsum einen Beitrag zur CO2-Reduzierung leisten. Einige Universitäten gehen sogar so weit, reine "Klima-Mensen" einzurichten, in denen komplett auf Fleisch verzichtet wird. Die Resonanz der Studenten ist überwiegend positiv, obwohl es auch kritische Stimmen gibt, die eine freie Wahl des Essens fordern.',
    questions: [
      {
        id: 401,
        question: 'Món ăn yêu thích nhất của sinh viên Đức tại nhà ăn đại học (Mensa) hiện nay là gì?',
        options: [
          'A. Xúc xích Currywurst và thịt chiên Schnitzel.',
          'B. Các thực đơn thuần chay và ăn chay không thịt đang ngày càng phổ biến.',
          'C. Đồ ăn nhanh nhập khẩu từ Mỹ.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu: "Heute hingegen verzeichnen vegetarische und vegane Menüs eine stetig wachsende Nachfrage."'
      },
      {
        id: 402,
        question: 'Động lực chính của sinh viên khi chuyển sang ăn chay là gì?',
        options: [
          'A. Do giá thịt tại các siêu thị Đức tăng quá cao.',
          'B. Nhằm bảo vệ khí hậu và bảo vệ quyền lợi động vật.',
          'C. Để giảm cân và làm đẹp.'
        ],
        correct: 1,
        explanation: 'Văn bản ghi rõ: "Die Gründe für diese Ernährungsumstellung sind primär der Klimaschutz und das Tierwohl."'
      }
    ]
  },
  {
    id: 5,
    level: 'B2',
    title: 'Goethe B2 Lesen Teil 1 — Đọc hiểu chuyên sâu: Số hóa hồ sơ y khoa (Die digitale Krankenakte)',
    text: 'Die Einführung der elektronischen Patientenakte (ePA) in Deutschland soll die Kommunikation zwischen Ärzten, Krankenhäusern und Apotheken verbessern und unnötige Doppeluntersuchungen verhindern. Befürworter betonen, dass wichtige Informationen wie Vorerkrankungen, Allergien und Medikationspläne im Notfall sofort abrufbar sind. Dies kann Leben retten. Auf der anderen Seite gibt es jedoch erhebliche datenschutzrechtliche Bedenken. Kritiker befürchten, dass sensible Gesundheitsdaten durch Hackerangriffe in falsche Hände geraten könnten. Zudem fühlen sich viele ältere Patienten von der zunehmenden Digitalisierung überfordert, da sie keinen Internetzugang haben oder nicht wissen, wie man die entsprechenden Apps bedient. Um eine breite Akzeptanz zu erreichen, müssen daher Datenschutz und Benutzerfreundlichkeit gleichermaßen garantiert sein. Nur wenn die Bürger volles Vertrauen in die Sicherheit der Infrastruktur haben, wird sich das System im Alltag durchsetzen.',
    questions: [
      {
        id: 501,
        question: 'Mục đích chính của việc giới thiệu hồ sơ bệnh án điện tử (ePA) là gì?',
        options: [
          'A. Để cắt giảm nhân sự y tế trong các bệnh viện lớn tại Đức.',
          'B. Để tối ưu giao tiếp y tế giữa các bên liên quan và giảm các xét nghiệm bị trùng lặp không cần thiết.',
          'C. Để bán dữ liệu sức khỏe của bệnh nhân cho các công ty bảo hiểm tư nhân.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu đầu tiên: "Die Einführung der elektronischen Patientenakte (ePA) in Deutschland soll die Kommunikation zwischen Ärzten, Krankenhäusern und Apotheken verbessern und unnötige Doppeluntersuchungen verhindern."'
      },
      {
        id: 502,
        question: 'Những lo ngại lớn nhất của bên phản đối việc số hóa hồ sơ y tế là gì?',
        options: [
          'A. Chi phí vận hành đắt đỏ và các nhà thuốc từ chối sử dụng.',
          'B. Rủi ro rò rỉ dữ liệu y tế nhạy cảm do tin tặc và khó khăn trong tiếp cận công nghệ của người cao tuổi.',
          'C. Sự phản đối từ Hiệp hội Y khoa thế giới.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu: "Kritiker befürchten, dass sensible Gesundheitsdaten durch Hackerangriffe in falsche Hände geraten könnten. Zudem fühlen sich viele ältere Patienten von der zunehmenden Digitalisierung überfordert..."'
      },
      {
        id: 503,
        question: 'Điều kiện then chốt để hồ sơ bệnh án điện tử thành công thực tế là gì?',
        options: [
          'A. Bắt buộc mọi người dân phải có điện thoại thông minh cao cấp.',
          'B. Đảm bảo đồng thời an toàn dữ liệu và thiết kế giao diện dễ sử dụng, tạo lòng tin nơi người dân.',
          'C. Miễn phí dịch vụ khám chữa bệnh cho người dùng hồ sơ điện tử.'
        ],
        correct: 1,
        explanation: 'Dựa vào câu cuối: "Um eine breite Akzeptanz zu erreichen, müssen daher Datenschutz und Benutzerfreundlichkeit gleichermaßen garantiert sein."'
      }
    ]
  },
  {
    id: 6,
    level: 'B2',
    title: 'Goethe B2 Lesen Teil 2 — Tác động của AI đối với thị trường lao động tương lai',
    text: 'Die rasante Entwicklung der Künstlichen Intelligenz (KI) sorgt für gemischte Gefühle in der Bevölkerung. Während Optimisten eine Befreiung des Menschen von monotonen Bürotätigkeiten und Routineaufgaben prophezeien, warnen Skeptiker vor einem massiven Stellenabbau. Betroffen sind längst nicht mehr nur Geringqualifizierte, sondern zunehmend auch akademische Berufe wie Programmierer, Journalisten und Anwälte. KI-Systeme können in Sekundenschnelle Verträge analysieren, Berichte verfassen oder Programmcode generieren. Experten betonen jedoch, dass KI den Menschen nicht vollständig ersetzen, sondern seine Arbeitsweise verändern wird. Soft Skills wie Empathie, kritisches Denken và khả năng sáng tạo nghệ thuật vẫn là những kỹ năng độc quyền của con người mà thuật toán chưa thể sao chép. Lebenslanges Lernen und die Bereitschaft, sich an neue digitale Werkzeuge anzupassen, werden daher zu Schlüsselkompetenzen auf dem zukünftigen Arbeitsmarkt.',
    questions: [
      {
        id: 601,
        question: 'Nhóm nghề nghiệp nào chịu ảnh hưởng bởi sự phát triển của trí tuệ nhân tạo (AI)?',
        options: [
          'A. Chỉ có lao động chân tay ít bằng cấp.',
          'B. Cả lao động trình độ thấp lẫn nhóm lao động trí thức như lập trình viên, nhà báo, luật sư.',
          'C. AI không ảnh hưởng đến bất kỳ thị trường lao động nào.'
        ],
        correct: 1,
        explanation: 'Văn bản viết: "Betroffen sind längst nicht mehr nur Geringqualifizierte, sondern zunehmend auch akademische Berufe wie Programmierer, Journalisten und Anwälte."'
      },
      {
        id: 602,
        question: 'Kỹ năng nào được cho là thế mạnh độc quyền của con người trước AI?',
        options: [
          'A. Tốc độ tính toán và xử lý số liệu lớn.',
          'B. Khả năng ghi nhớ hàng triệu văn bản pháp luật.',
          'C. Sự đồng cảm, tư duy phản biện và khả năng sáng tạo nghệ thuật.'
        ],
        correct: 2,
        explanation: 'Dựa trên câu: "Soft Skills wie Empathie, kritisches Denken und kreative Gestaltungskraft bleiben menschliche Domänen, die Algorithmen nicht kopieren können."'
      }
    ]
  },
  {
    id: 7,
    level: 'B2',
    title: 'Goethe B2 Lesen Teil 3 — Tương lai của giao thông đô thị tự hành',
    text: 'Autonomes Fahren gilt als eine der Schlüsseltechnologien des 21. Jahrhunderts. Befürworter versprechen sich davon eine Revolutionierung der städtischen Mobilität: Weniger Staus, sinkende Unfallzahlen durch den Wegfall menschlicher Fehler und eine erhebliche CO2-Reduktion durch optimierte Fahrweisen. Erste selbstfahrende Busse werden bereits in Testgebieten in deutschen Städten erprobt. Bis zu einer flächendeckenden Einführung müssen jedoch noch komplexe juristische und ethische Fragen geklärt werden. Wer haftet bei einem Unfall, den eine künstliche Intelligenz verursacht hat? Wie entscheidet die Software in einer unausweichlichen Unfallsituation zwischen dem Schutz der Fahrgäste und dem Leben von Passanten? Zudem gibt es Widerstand von Berufskraftfahrern, die um ihre Existenz bangen. Die rechtlichen Rahmenbedingungen müssen von der Politik zeitnah angepasst werden.',
    questions: [
      {
        id: 701,
        question: 'Lợi ích hứa hẹn nhất mà công nghệ lái xe tự hành mang lại là gì?',
        options: [
          'A. Giúp xe chạy nhanh gấp đôi tốc độ thông thường.',
          'B. Giảm ùn tắc, giảm tai nạn giao thông và giảm lượng khí thải CO2.',
          'C. Loại bỏ hoàn toàn sự cần thiết của hệ thống biển báo đường bộ.'
        ],
        correct: 1,
        explanation: 'Đoạn văn viết: "Befürworter versprechen sich davon eine Revolutionierung der städtischen Mobilität: Weniger Staus, sinkende Unfallzahlen durch den Wegfall menschlicher Fehler und eine erhebliche CO2-Reduktion..."'
      },
      {
        id: 702,
        question: 'Những trở ngại lớn nhất trước khi triển khai rộng rãi xe tự lái là gì?',
        options: [
          'A. Dung lượng pin yếu của xe điện.',
          'B. Các vấn đề pháp lý về trách nhiệm khi xảy ra tai nạn, câu hỏi đạo đức lập trình và sự phản đối từ tài xế chuyên nghiệp.',
          'C. Giá thành sản xuất xe tự lái quá rẻ.'
        ],
        correct: 1,
        explanation: 'Văn bản chỉ ra: "Bis zu einer flächendeckenden Einführung müssen jedoch noch komplexe juristische und ethische Fragen geklärt werden... Zudem gibt es Widerstand von Berufskraftfahrern..."'
      }
    ]
  },
  {
    id: 8,
    level: 'B2',
    title: 'Goethe B2 Lesen Teil 4 — Ảnh hưởng của stress công sở đến sức khỏe',
    text: 'Psychische Belastungen am Arbeitsplatz haben in den vergangenen Jahren in Deutschland massiv zugenommen. Laut Statistiken der Krankenkassen sind Burnout-Erkrankungen und Depressionen mittlerweile einer der häufigsten Gründe für Arbeitsunfähigkeit. Die ständige Erreichbarkeit durch Smartphones, hoher Leistungsdruck und unklare Aufgabenverteilungen führen dazu, dass Arbeitnehmer auch in ihrer Freizeit nicht mehr abschalten können. Mediziner warnen, dass chronischer Stress das Risiko für Herz-Kreislauf-Erkrankungen und Schlafstörungen drastisch erhöht. Unternehmen reagieren zunehmend mit betrieblichen Gesundheitsmanagement-Programmen, die Yoga-Kurse hoặc các buổi tư vấn tâm lý cho nhân viên. Kritiker bemängeln jedoch, dass solche Maßnahmen nur Symptome bekämpfen, anstatt die eigentlichen Probleme wie Personalmangel und übertriebene Arbeitszeiten an der Wurzel zu lösen.',
    questions: [
      {
        id: 801,
        question: 'Nguyên nhân nào dẫn đến việc người lao động tại Đức khó thư giãn trong thời gian rảnh rỗi?',
        options: [
          'A. Do họ phải làm thêm ca tối liên tục không được nghỉ phép.',
          'B. Sự kết nối liên lạc liên tục qua điện thoại thông minh, áp lực thành tích và phân công công việc không rõ ràng.',
          'C. Do các chương trình giải trí trên truyền hình quá nhàm chán.'
        ],
        correct: 1,
        explanation: 'Văn bản viết: "Die ständige Erreichbarkeit durch Smartphones, hoher Leistungsdruck und unklare Aufgabenverteilungen führen dazu, dass Arbeitnehmer auch in ihrer Freizeit nicht mehr abschalten können."'
      },
      {
        id: 802,
        question: 'Ý kiến của các nhà phê bình về biện pháp chống stress của các doanh nghiệp hiện nay là gì?',
        options: [
          'A. Các biện pháp này quá đắt đỏ khiến doanh nghiệp nhanh chóng thua lỗ.',
          'B. Chúng chỉ giải quyết phần ngọn (triệu chứng) thay vì giải quyết triệt để vấn đề gốc rễ như thiếu nhân sự hay thời gian làm việc quá dài.',
          'C. Sinh viên thực tập không được tham gia các chương trình này.'
        ],
        correct: 1,
        explanation: 'Đoạn văn viết: "Kritiker bemängeln jedoch, dass solche Maßnahmen nur Symptome bekämpfen, anstatt die eigentlichen Probleme wie Personalmangel und übertriebene Arbeitszeiten an der Wurzel zu lösen."'
      }
    ]
  }
];


balanceAnswerPositions(LESEN_EXAMS);
