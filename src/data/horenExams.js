import { balanceAnswerPositions } from './balanceOptions.js';

export const HOREN_EXAMS = [
  {
    id: 1,
    level: 'B1',
    title: 'Hören Teil 1 — Thông báo ga tàu (Alltag am Bahnhof)',
    audioText: 'Achtung an Gleis 4: Der Intercity-Express ICE 521 nach München Hauptbahnhof über Nürnberg fährt jetzt ein. Die Abfahrt ist für 14 Uhr 15 vorgesehen. Bitte beachten Sie, dass die Wagen der ersten Klasse heute im hinteren Bereich des Zuges, im Sektor G, stehen. Der Speisewagen befindet sich in der Mitte des Zuges im Sektor E. Bitte halten Sie Abstand von der Bahnsteigkante.',
    questions: [
      {
        id: 101,
        question: 'Wohin fährt der Zug ICE 521?',
        options: [
          'A. Nach Nürnberg Hauptbahnhof',
          'B. Nach München Hauptbahnhof',
          'C. Nach Frankfurt Hauptbahnhof'
        ],
        correct: 1,
        explanation: 'Thông báo nói rõ: "Der Intercity-Express ICE 521 nach München Hauptbahnhof... fährt jetzt ein." (Tàu ICE 521 đi Nhà ga chính Munich đang tiến vào ga).'
      },
      {
        id: 102,
        question: 'Wo befindet sich der Speisewagen heute?',
        options: [
          'A. Im Sektor G (hinterer Bereich)',
          'B. Im Sektor E (in der Mitte des Zuges)',
          'C. Im vorderen Bereich des Zuges'
        ],
        correct: 1,
        explanation: 'Thông báo cho biết: "Der Speisewagen befindet sich in der Mitte des Zuges im Sektor E." (Toa ăn uống nằm ở giữa tàu tại khu vực E).'
      }
    ]
  },
  {
    id: 2,
    level: 'B1',
    title: 'Hören Teil 2 — Hướng dẫn tham quan bảo tàng (Museumsführung)',
    audioText: 'Herzlich willkommen im Technischen Museum. Mein Name ist Christian Wagner và tôi sẽ đồng hành cùng các bạn hôm nay. Bevor wir mit unserem Rundgang beginnen, möchte ich Sie bitten, Ihre großen Taschen und Rucksäcke an der Garderobe abzugeben. Das Fotografieren ist in allen Räumen erlaubt, aber bitte schalten Sie unbedingt den Blitz aus, um die empfindlichen Exponate zu schützen. Nach der Führung haben Sie noch eine Stunde Zeit, das Museum auf eigene Faust zu erkunden.',
    questions: [
      {
        id: 201,
        question: 'Was müssen die Besucher an der Garderobe abgeben?',
        options: [
          'A. Ihre Mobiltelefone und Kameras',
          'B. Große Taschen und Rucksäcke',
          'C. Jacken und Mäntel'
        ],
        correct: 1,
        explanation: 'Hướng dẫn viên nhắc: "...möchte ich Sie bitten, Ihre großen Taschen und Rucksäcke an der Garderobe abzugeben." (Tôi muốn xin các bạn gửi túi lớn và balo ở quầy giữ đồ).'
      },
      {
        id: 202,
        question: 'Welche Regel gilt für das Fotografieren?',
        options: [
          'A. Fotografieren ist im ganzen Museum verboten',
          'B. Man darf überall fotografieren, aber ohne Blitz',
          'C. Fotografieren ist nur in manchen Räumen erlaubt'
        ],
        correct: 1,
        explanation: 'Quy định nêu rõ: "Das Fotografieren ist in allen Räumen erlaubt, aber bitte schalten Sie unbedingt den Blitz aus..." (Việc chụp ảnh được cho phép ở tất cả các phòng, nhưng vui lòng tắt đèn flash).'
      }
    ]
  },
  {
    id: 3,
    level: 'B1',
    title: 'Hören Teil 3 — Cuộc trò chuyện trên radio (Radio-Interview)',
    audioText: 'Moderator: Guten Abend, liebe Zuhörer. Heute sprechen wir mit Frau Dr. Sabine Weber über das Thema "Work-Life-Balance". Frau Weber, Sie beraten Unternehmen zu diesem Thema. Ist das Problem wirklich so neu? Dr. Weber: Nein, das Problem ist nicht neu, aber die Erwartungen der Menschen haben sich geändert. Früher war Arbeit vor allem Broterwerb. Heute suchen junge Fachkräfte nach einem Sinn in ihrer Arbeit und möchten auch genügend Zeit für Familie und Hobbys haben. Unternehmen müssen flexibler werden, wenn sie gute Mitarbeiter gewinnen wollen.',
    questions: [
      {
        id: 301,
        question: 'Welche Rolle hat Frau Dr. Sabine Weber?',
        options: [
          'A. Sie arbeitet als Journalistin beim Radio',
          'B. Sie berät Unternehmen zum Thema Work-Life-Balance',
          'C. Sie leitet eine große Abteilung in einer Fabrik'
        ],
        correct: 1,
        explanation: 'Người dẫn chương trình giới thiệu: "...Heute sprechen wir mit Frau Dr. Sabine Weber über das Thema Work-Life-Balance. Frau Weber, Sie beraten Unternehmen zu diesem Thema." (Hôm nay chúng ta nói chuyện với Tiến sĩ Sabine Weber về chủ đề Cân bằng công việc - cuộc sống. Bà Weber, bà tư vấn cho các doanh nghiệp về chủ đề này).'
      },
      {
        id: 302,
        question: 'Was ist laut Frau Weber der Unterschied zu früher?',
        options: [
          'A. Früher gab es weniger Arbeitsplätze als heute',
          'B. Junge Menschen wollen heute überhaupt nicht mehr arbeiten',
          'C. Heute suchen Menschen nach Sinn in der Arbeit und mehr Freizeit'
        ],
        correct: 2,
        explanation: 'Bà Weber giải thích: "Früher war Arbeit vor allem Broterwerb. Heute suchen junge Fachkräfte nach einem Sinn in ihrer Arbeit und möchten auch genügend Zeit für Familie und Hobbys haben." (Trước đây công việc chủ yếu để kiếm cơm. Ngày nay nhân lực trẻ tìm kiếm ý nghĩa trong công việc và muốn có đủ thời gian cho gia đình và sở thích).'
      }
    ]
  },
  {
    id: 4,
    level: 'B2',
    title: 'Hören Teil 1 — Thảo luận về việc làm việc từ xa (Homeoffice-Diskussion)',
    audioText: 'Sprecherin: Ich halte die aktuelle Debatte um das Recht auf Homeoffice für extrem wichtig. Wir sehen, dass in Branchen wie der Informationstechnologie oder dem Marketing die Produktivität zu Hause oft sogar höher ist als im Großraumbüro. Dennoch dürfen wir die sozialen Aspekte nicht vernachlässigen. Der informelle Austausch an der Kaffeemaschine ist oft der Ort, an dem die kreativsten Ideen entstehen. Ein hybrides Modell mit zwei Tagen Homeoffice und drei Tagen Präsenz scheint mir daher die vielversprechendste Lösung für die Zukunft zu sein.',
    questions: [
      {
        id: 401,
        question: 'Wie steht die Sprecherin zur Produktivität im Homeoffice?',
        options: [
          'A. Sie glaubt, Homeoffice senkt die Produktivität generell',
          'B. In bestimmten Branchen ist die Produktivität im Homeoffice oft höher',
          'C. Sie sieht keinen Unterschied zum Arbeiten im Büro'
        ],
        correct: 1,
        explanation: 'Sprecherin nói: "...dass in Branchen wie der Informationstechnologie oder dem Marketing die Produktivität zu Hause oft sogar höher ist..." (rằng ở các ngành như CNTT hoặc Marketing, năng suất ở nhà thường thậm chí cao hơn).'
      },
      {
        id: 402,
        question: 'Welches Arbeitsmodell schlägt die Sprecherin vor?',
        options: [
          'A. Reine Heimarbeit für alle Angestellten',
          'B. Eine 5-Tage-Woche komplett im Büro',
          'C. Ein Hybridmodell (2 Tage Homeoffice, 3 Tage Büro)'
        ],
        correct: 2,
        explanation: 'Cô ấy kết luận: "Ein hybrides Modell mit zwei Tagen Homeoffice und drei Tagen Präsenz scheint mir daher die vielversprechendste Lösung... zu sein." (Một mô hình kết hợp với 2 ngày làm việc ở nhà và 3 ngày có mặt tại văn phòng dường như là giải pháp hứa hẹn nhất).'
      }
    ]
  },
  {
    id: 5,
    level: 'B2',
    title: 'Hören Teil 2 — Thuyết trình về số hóa y tế (Digitalisierung in der Pflege)',
    audioText: 'Sprecher: Sehr geehrte Kolleginnen und Kollegen. Im Rahmen unseres heutigen Pflegesymposiums präsentiere ich Ihnen den Prototyp unseres neuen digitalen Pflegedokumentationssystems. Durch den Einsatz von Tablets direkt am Patientenbett reduziert sich der zeitliche Dokumentationsaufwand pro Schicht um durchschnittlich dreißig Prozent. Dadurch gewinnen wir wertvolle Zeit zurück, die wir direkt in die persönliche Betreuung unserer Patienten investieren können. Die Benutzeroberfläche wurde so intuitiv gestaltet, dass auch ältere Mitarbeiter nach einer kurzen Schulung mühelos damit arbeiten können.',
    questions: [
      {
        id: 501,
        question: 'Um wie viel Prozent reduziert das neue System den Dokumentationsaufwand?',
        options: [
          'A. Um etwa 10 Prozent',
          'B. Um durchschnittlich 30 Prozent',
          'C. Um mehr als 50 Prozent'
        ],
        correct: 1,
        explanation: 'Người thuyết trình báo cáo: "...reduziert sich der zeitliche Dokumentationsaufwand pro Schicht um durchschnittlich dreißig Prozent." (giảm thời gian ghi chép tài liệu mỗi ca trung bình khoảng 30%).'
      },
      {
        id: 502,
        question: 'Was ist der Hauptvorteil des neuen Systems für Pflegekräfte?',
        options: [
          'A. Es spart Papier und schützt so die Umwelt',
          'B. Es ermöglicht den Mitarbeitern, früher nach Hause zu gehen',
          'C. Die gesparte Zeit kann für die direkte Betreuung genutzt werden'
        ],
        correct: 2,
        explanation: 'Diễn giả chỉ ra: "Dadurch gewinnen wir wertvolle Zeit zurück, die wir direkt in die persönliche Betreuung unserer Patienten investieren können." (Nhờ đó chúng ta giành lại thời gian quý báu để có thể đầu tư trực tiếp vào việc chăm sóc cá nhân cho bệnh nhân của mình).'
      }
    ]
  },
  {
    id: 6,
    level: 'B2',
    title: 'Hören Teil 3 — Bài giảng về biến đổi khí hậu (Vorlesung: Klimawandel)',
    audioText: 'Professorin: Willkommen zur Vorlesung über Umweltmeteorologie. Heute betrachten wir die Auswirkungen des globalen Klimawandels auf die alpinen Regionen. Die Gletscherschmelze in den Alpen hat sich in den letzten zwei Jahrzehnten dramatisch beschleunigt. Dies führt nicht nur zu einem Anstieg des Meeresspiegels weltweit, sondern gefährdet primär die Trinkwasserversorgung von Millionen Menschen in Mitteleuropa, da die Alpengletscher als natürliche Wasserspeicher fungieren. Zudem steigt das Risiko von Hangrutschungen und Muren durch das Auftauen des Permafrostbodens signifikant an.',
    questions: [
      {
        id: 601,
        question: 'Welches primäre Problem in Mitteleuropa verursacht das Gletscherschmelzen?',
        options: [
          'A. Die Überschwemmung von Städten an den Küsten',
          'B. Die Gefährdung der Trinkwasserversorgung',
          'C. Ein Rückgang des Wintertourismus in den Alpen'
        ],
        correct: 1,
        explanation: 'Giáo sư chỉ ra: "...sondern gefährdet primär die Trinkwasserversorgung von Millionen Menschen in Mitteleuropa..." (mà chủ yếu đe dọa nguồn cung cấp nước uống của hàng triệu người ở Trung Âu).'
      },
      {
        id: 602,
        question: 'Warum steigt die Gefahr von Hangrutschungen in den Bergen?',
        options: [
          'A. Wegen des ständigen starken Regens',
          'B. Durch das Auftauen des Permafrostbodens',
          'C. Wegen des Fehlens von Bergwäldern'
        ],
        correct: 1,
        explanation: 'Bài giảng nêu: "Zudem steigt das Risiko von Hangrutschungen... durch das Auftauen des Permafrostbodens signifikant an." (Ngoài ra nguy cơ sạt lở đất đá tăng lên đáng kể do hiện tượng tan băng vĩnh cửu).'
      }
    ]
  }
];


balanceAnswerPositions(HOREN_EXAMS);
