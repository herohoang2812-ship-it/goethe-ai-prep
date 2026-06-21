import { balanceAnswerPositions } from './balanceOptions.js';

export const GRAMMAR_DATA = [
  {
    id: 'nebensatz',
    title: 'Câu phụ cuối câu (Nebensatz mit weil, dass, wenn, obwohl, da)',
    level: 'B1',
    theory: 'Trong tiếng Đức, khi bắt đầu một câu phụ (Nebensatz) bằng các liên từ phụ thuộc như "weil" (bởi vì), "dass" (rằng), "wenn" (nếu/khi), "obwohl" (mặc dù), "da" (vì), động từ đã chia (động từ chính) bắt buộc phải di chuyển xuống cuối cùng của câu phụ đó.',
    examples: [
      { de: 'Ich bin müde, weil ich heute Frühschicht hatte.', vi: 'Tôi mệt bởi vì hôm nay tôi đã làm ca sáng.' },
      { de: 'Der Arzt sagt, dass der Patient schlafen muss.', vi: 'Bác sĩ nói rằng bệnh nhân phải ngủ.' },
      { de: 'Wenn Sie Schmerzen haben, rufen Sie mich.', vi: 'Nếu bạn có cơn đau, hãy gọi tôi.' },
      { de: 'Obwohl er B1 hat, versteht er den Dialekt nicht.', vi: 'Mặc dù anh ấy có bằng B1, anh ấy vẫn không hiểu tiếng địa phương.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền động từ đúng vào câu sau: "Ich schreibe dir, weil unser Kollege nächste Woche _______."',
        options: ['A. aufhört', 'B. aufhören', 'C. hat aufgehört'],
        correct: 0,
        explanation: 'Liên từ "weil" yêu cầu động từ chia ở ngôi thứ ba số ít ("aufhört" từ động từ tách "aufhören") chuyển xuống cuối câu.'
      },
      {
        id: 2,
        question: 'Chọn câu đúng ngữ pháp:',
        options: [
          'A. Ich weiß, dass der Patient hat Fieber.',
          'B. Ich weiß, dass der Patient Fieber hat.',
          'C. Ich weiß, dass hat der Patient Fieber.'
        ],
        correct: 1,
        explanation: 'Liên từ "dass" bắt buộc động từ chia "hat" phải đứng ở cuối câu phụ.'
      },
      {
        id: 3,
        question: 'Điền đúng: "Sie arbeitet heute länger, da eine Kollegin krank _______."',
        options: ['A. ist geworden', 'B. geworden ist', 'C. ist'],
        correct: 2,
        explanation: 'Liên từ "da" (vì) đưa động từ chia "ist" xuống cuối câu phụ.'
      },
      {
        id: 4,
        question: 'Chọn câu đúng: "Obwohl der Patient Schmerzen _______, lächelt er."',
        options: ['A. hat', 'B. gehabt', 'C. hat gehabt'],
        correct: 0,
        explanation: '"Obwohl" (mặc dù) là liên từ phụ thuộc, động từ "hat" chia theo "der Patient" phải đứng ở cuối câu.'
      }
    ]
  },
  {
    id: 'dat_akk',
    title: 'Phân biệt Cách 3 & Cách 4 (Dativ & Akkusativ)',
    level: 'B1/B2',
    theory: 'Quy tắc cơ bản:\n- Dativ (Cách 3) chỉ vị trí tĩnh, không chuyển động (Câu hỏi "Wo?" - Ở đâu).\n- Akkusativ (Cách 4) chỉ sự chuyển động hướng tới (Câu hỏi "Wohin?" - Đi đâu).\nCác giới từ hai cách (Wechselpräpositionen) như "in, an, auf, unter, vor, hinter, neben, zwischen" đi với Dativ hoặc Akkusativ tùy tính động/tĩnh.',
    examples: [
      { de: 'Ich bin im (in dem) Aufenthaltsraum. (Dativ - Tĩnh)', vi: 'Tôi đang ở trong phòng sinh hoạt chung.' },
      { de: 'Ich gehe in den Aufenthaltsraum. (Akkusativ - Động)', vi: 'Tôi đi vào trong phòng sinh hoạt chung.' },
      { de: 'Das Buch liegt auf dem Tisch. (Dativ - Tĩnh)', vi: 'Cuốn sách nằm trên bàn.' },
      { de: 'Ich lege das Buch auf den Tisch. (Akkusativ - Động)', vi: 'Tôi đặt cuốn sách lên trên bàn.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng: "Der Patient setzt sich auf _______ Stuhl."',
        options: ['A. den', 'B. dem', 'C. der'],
        correct: 0,
        explanation: 'Động từ phản thân "sich setzen" (ngồi xuống) chỉ hành động chuyển động (Wohin?) nên giới từ "auf" đi với Akkusativ. "Stuhl" giống đực (der) -> "den".'
      },
      {
        id: 2,
        question: 'Điền đúng: "Der Patient sitzt auf _______ Stuhl."',
        options: ['A. den', 'B. dem', 'C. der'],
        correct: 1,
        explanation: 'Động từ "sitzen" (đang ngồi) chỉ trạng thái tĩnh (Wo?) nên giới từ "auf" đi với Dativ. "Stuhl" giống đực (der) -> "dem".'
      },
      {
        id: 3,
        question: 'Điền đúng: "Wir treffen uns in _______ Klinik."',
        options: ['A. die', 'B. der', 'C. den'],
        correct: 1,
        explanation: 'Gặp nhau ở đâu (Wo?) chỉ trạng thái tĩnh, Dativ của "die Klinik" là "der Klinik".'
      },
      {
        id: 4,
        question: 'Điền đúng: "Er legt das Fieberthermometer neben _______ Bett."',
        options: ['A. das', 'B. dem', 'C. des'],
        correct: 0,
        explanation: 'Đặt nhiệt kế cạnh giường (Wohin?) chỉ hành động chuyển động hướng tới, Akkusativ của "das Bett" vẫn là "das Bett".'
      }
    ]
  },
  {
    id: 'passiv',
    title: 'Thể bị động (Passiv) trong công việc',
    level: 'B2',
    theory: 'Thể bị động được dùng rất nhiều trong báo cáo y khoa hoặc tài liệu văn phòng để khách quan hóa thông tin. Công thức:\n- Passiv hiện tại: werden + Partizip II.\n- Passiv quá khứ (Präteritum): wurden + Partizip II.\n- Passiv hoàn thành (Perfekt): sein + Partizip II + worden.',
    examples: [
      { de: 'Der Patient wird operiert.', vi: 'Bệnh nhân đang được phẫu thuật.' },
      { de: 'Die Medikamente wurden gestern geliefert.', vi: 'Thuốc đã được giao ngày hôm qua.' },
      { de: 'Die Wunde ist neu verbunden worden.', vi: 'Vết thương vừa mới được băng bó lại.' },
      { de: 'Berichte müssen wöchentlich geschrieben werden.', vi: 'Các báo cáo phải được viết hàng tuần.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Chuyển câu sau sang Passiv ở Präteritum: "Der Arzt impfte den Patienten."',
        options: [
          'A. Der Patient wird geimpft.',
          'B. Der Patient wurde geimpft.',
          'C. Der Patient ist geimpft worden.'
        ],
        correct: 1,
        explanation: 'Thì Präteritum bị động có công thức: wurden + Partizip II. "den Patienten" là tân ngữ trực tiếp chuyển thành chủ ngữ "Der Patient" + "wurde geimpft".'
      },
      {
        id: 2,
        question: 'Chọn câu đúng: "Die Dokumentation _______."',
        options: [
          'A. muss ausgefüllt werden',
          'B. muss werden ausgefüllt',
          'C. ausgefüllt werden muss'
        ],
        correct: 0,
        explanation: 'Trong câu có động từ khuyết thiếu (müssen), cấu trúc bị động là: Modalkonjugiert + ... + Partizip II + werden.'
      },
      {
        id: 3,
        question: 'Điền đúng: "Das Zimmer _______ gestern gründlich gereinigt _______."',
        options: ['A. wird / worden', 'B. wurde / -', 'C. ist / worden'],
        correct: 1,
        explanation: 'Có trạng từ chỉ thời gian quá khứ "gestern" (hôm qua), sử dụng Passiv Präteritum: "wurde gereinigt".'
      }
    ]
  },
  {
    id: 'prepositional_verbs',
    title: 'Động từ đi kèm giới từ cố định (Verben mit Präpositionen)',
    level: 'B2',
    theory: 'Nhiều động từ trong tiếng Đức bắt buộc phải đi kèm với một giới từ cố định và đòi hỏi một cách cụ thể (Dativ hoặc Akkusativ). Đây là kiến thức quan trọng nhất để viết email hoặc thuyết trình.',
    examples: [
      { de: 'Ich warte auf (Akk) den Arzt.', vi: 'Tôi đang đợi bác sĩ.' },
      { de: 'Sie freut sich über (Akk) das Geschenk.', vi: 'Cô ấy vui mừng về món quà (đã nhận).' },
      { de: 'Der Pfleger kümmert sich um (Akk) die Patienten.', vi: 'Điều dưỡng viên chăm sóc các bệnh nhân.' },
      { de: 'Wir sprechen mit (Dat) dem Chef über (Akk) das Projekt.', vi: 'Chúng tôi nói chuyện với sếp về dự án.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền giới từ đúng: "Bitte achten Sie _______ die Hygienevorschriften!"',
        options: ['A. auf (Akk)', 'B. an (Dat)', 'C. für (Akk)'],
        correct: 0,
        explanation: 'Động từ "achten" đi với giới từ "auf" + Akkusativ mang nghĩa là chú ý đến điều gì.'
      },
      {
        id: 2,
        question: 'Chọn giới từ đúng: "Wir freuen uns _______ die kommende Zusammenarbeit."',
        options: ['A. über (Akk)', 'B. auf (Akk)', 'C. an (Dat)'],
        correct: 1,
        explanation: '"sich freuen auf" + Akkusativ dùng để diễn tả niềm vui hướng tới tương lai (mong đợi cái gì sắp tới).'
      },
      {
        id: 3,
        question: 'Điền đúng: "Der Patient leidet _______ einer chronischen Krankheit."',
        options: ['A. über', 'B. unter', 'C. an'],
        correct: 2,
        explanation: 'Động từ "leiden an" + Dativ nói về việc mắc/đau đớn vì một bệnh tật cụ thể.'
      }
    ]
  },
  {
    id: 'konjunktiv_ii',
    title: 'Giả định & Lịch sự (Konjunktiv II)',
    level: 'B2',
    theory: 'Konjunktiv II dùng để thể hiện ước muốn không có thực, giả định trái ngược thực tế, hoặc biểu thị sự lịch sự nhã nhặn khi giao tiếp. Công thức:\n- Hiện tại/tương lai: würde + Infinitiv.\n- Quá khứ: hätte/wäre + Partizip II.',
    examples: [
      { de: 'Könnten Sie mir bitte helfen? (Lịch sự)', vi: 'Bạn có thể giúp tôi một chút được không?' },
      { de: 'Wenn ich Zeit hätte, würde ich Deutsch lernen. (Giả định)', vi: 'Nếu tôi có thời gian, tôi sẽ học tiếng Đức.' },
      { de: 'Ich hätte gern ein Glas Wasser. (Ước muốn)', vi: 'Tôi muốn xin một ly nước.' },
      { de: 'Wäre ich gestern doch früher ins Bett gegangen! (Tiếc nuối)', vi: 'Giá mà hôm qua tôi đi ngủ sớm hơn!' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng câu lịch sự: "_______ Sie mir das bitte erklären?"',
        options: ['A. Konnten', 'B. Könnten', 'C. Kann'],
        correct: 1,
        explanation: 'Dùng dạng Konjunktiv II "Könnten" để thể hiện sự lịch sự tối đa khi nhờ vả.'
      },
      {
        id: 2,
        question: 'Điền đúng giả định quá khứ: "Wenn ich reich _______, _______ ich ein Haus gekauft."',
        options: ['A. wäre / würde', 'B. gewesen wäre / hätte', 'C. gewesen wäre / würde'],
        correct: 1,
        explanation: 'Giả định trái thực tế trong quá khứ: "Wenn ich reich gewesen wäre (Dạng wäre + Partizip II của sein), hätte ich ein Haus gekauft (hätte + Partizip II)".'
      }
    ]
  },
  {
    id: 'relativsaetze',
    title: 'Mệnh đề quan hệ (Relativsätze)',
    level: 'B1',
    theory: 'Mệnh đề quan hệ bổ nghĩa cho danh từ đứng trước nó. Đại từ quan hệ (der/die/das/die) biến đổi tùy thuộc vào giống của danh từ đó và cách (Nominativ, Akkusativ, Dativ, Genitiv) trong mệnh đề phụ.',
    examples: [
      { de: 'Der Mann, der dort steht, ist Arzt. (Nominativ)', vi: 'Người đàn ông đứng ở đằng kia là bác sĩ.' },
      { de: 'Der Patient, den ich betreue, ist nett. (Akkusativ)', vi: 'Bệnh nhân mà tôi chăm sóc rất thân thiện.' },
      { de: 'Die Kollegin, mit der ich arbeite, hilft mir. (Dativ)', vi: 'Đồng nghiệp mà tôi làm việc cùng giúp đỡ tôi.' },
      { de: 'Das Kind, dessen Mutter krank ist, weint. (Genitiv)', vi: 'Đứa trẻ có người mẹ bị ốm đang khóc.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đại từ đúng: "Das ist die Kollegin, _______ ich geholfen habe."',
        options: ['A. die', 'B. der', 'C. denen'],
        correct: 1,
        explanation: 'Động từ "helfen" yêu cầu tân ngữ Dativ. Dativ số ít giống cái (die Kollegin) chuyển thành đại từ quan hệ "der".'
      },
      {
        id: 2,
        question: 'Điền đại từ đúng: "Dort steht das Auto, _______ Motor kaputt ist."',
        options: ['A. dessen', 'B. deren', 'C. das'],
        correct: 0,
        explanation: 'Genitiv giống trung (das Auto) làm đại từ quan hệ sở hữu là "dessen" (cái mà có động cơ bị hỏng).'
      }
    ]
  },
  {
    id: 'adjektivdeklination',
    title: 'Biến cách tính từ (Adjektivdeklination)',
    level: 'B1/B2',
    theory: 'Tính từ đứng trước danh từ phải được chia đuôi thích hợp dựa trên:\n1. Quán từ đi kèm (xác định, không xác định, không quán từ).\n2. Giống của danh từ (M, F, N, Pl).\n3. Cách ngữ pháp (Nom, Akk, Dat, Gen).',
    examples: [
      { de: 'Der nette Arzt hilft mir. (Xác định - Nom)', vi: 'Vị bác sĩ tốt bụng giúp tôi.' },
      { de: 'Ich sehe einen netten Arzt. (Không xác định - Akk)', vi: 'Tôi thấy một vị bác sĩ tốt bụng.' },
      { de: 'Ich spreche mit dem netten Arzt. (Xác định - Dat)', vi: 'Tôi nói chuyện với vị bác sĩ tốt bụng.' },
      { de: 'Guter Kaffee ist teuer. (Không quán từ - Nom)', vi: 'Cà phê ngon thì đắt.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đuôi tính từ đúng: "Ich wünsche Ihnen einen schön_______ Tag!"',
        options: ['A. -en', 'B. -er', 'C. -e'],
        correct: 0,
        explanation: 'Quán từ không xác định Akkusativ giống đực ("einen Tag") yêu cầu đuôi tính từ là "-en" -> "schönen".'
      },
      {
        id: 2,
        question: 'Điền đuôi đúng: "Wir wohnen in einem klein_______ Haus."',
        options: ['A. -em', 'B. -en', 'C. -es'],
        correct: 1,
        explanation: 'Sau quán từ không xác định ở cách Dativ ("einem Haus"), đuôi tính từ luôn luôn là "-en".'
      }
    ]
  },
  {
    id: 'plusquamperfekt',
    title: 'Quá khứ hoàn thành (Plusquamperfekt)',
    level: 'B1',
    theory: 'Thì Plusquamperfekt dùng để diễn tả một hành động xảy ra trước một hành động khác trong quá khứ (thường dùng kết hợp với liên từ "nachdem" - sau khi). Công thức:\n- hatten/waren (ở dạng Präteritum) + Partizip II.',
    examples: [
      { de: 'Nachdem er gegessen hatte, ging er schlafen.', vi: 'Sau khi anh ấy đã ăn xong (Plusquamperfekt), anh ấy đi ngủ (Präteritum).' },
      { de: 'Als der Arzt kam, war der Patient schon gestorben.', vi: 'Khi bác sĩ đến, bệnh nhân đã qua đời từ trước rồi.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng: "Nachdem wir die Dokumentation _______, gingen wir nach Hause."',
        options: ['A. geschrieben haben', 'B. geschrieben hatten', 'C. schreiben werden'],
        correct: 1,
        explanation: 'Cấu trúc "Nachdem + Plusquamperfekt, Präteritum". Viết tài liệu diễn ra trước việc đi về, nên dùng "geschrieben hatten".'
      },
      {
        id: 2,
        question: 'Điền đúng: "Als der Krankenwagen eintraf, _______ der Unfall schon passiert."',
        options: ['A. war', 'B. hatte', 'C. ist'],
        correct: 0,
        explanation: 'Động từ "passieren" đi với trợ động từ "sein". Dạng quá khứ Präteritum của sein ở ngôi thứ ba số ít là "war".'
      }
    ]
  },
  {
    id: 'indirekte_rede',
    title: 'Lời nói gián tiếp (Indirekte Rede mit Konjunktiv I)',
    level: 'B2',
    theory: 'Dùng để thuật lại lời nói của người khác một cách khách quan, thường gặp trong báo cáo, tin tức báo chí. Thường sử dụng Konjunktiv I. Công thức:\n- Gốc động từ + đuôi đặc trưng (-e, -est, -e, -en, -et, -en). Nếu Konjunktiv I trùng với Präsens, ta thay thế bằng Konjunktiv II hoặc würde + Infinitiv.',
    examples: [
      { de: 'Er sagt: "Ich bin krank." -> Er sagte, er sei krank.', vi: 'Anh ấy nói: "Tôi bị ốm." -> Anh ấy nói rằng anh ấy bị ốm.' },
      { de: 'Der Arzt meint: "Der Patient muss ruhen." -> Der Arzt meinte, der Patient müsse ruhen.', vi: 'Bác sĩ cho rằng bệnh nhân phải nghỉ ngơi.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Chuyển sang gián tiếp: Der Kollege sagt: "Ich habe keine Zeit." -> Er sagt, er _______ keine Zeit.',
        options: ['A. hat', 'B. habe', 'C. hätte'],
        correct: 1,
        explanation: 'Konjunktiv I của "haben" đi với ngôi "er" là "habe".'
      },
      {
        id: 2,
        question: 'Điền đúng: "Sie sagt, sie _______ morgen nach Berlin fahren."',
        options: ['A. werde', 'B. wird', 'C. würde'],
        correct: 0,
        explanation: 'Konjunktiv I chỉ tương lai đi với "sie" (số ít) là "werde".'
      }
    ]
  },
  {
    id: 'n_dekination',
    title: 'Biến cách yếu danh từ (n-Deklination)',
    level: 'B2',
    theory: 'Một số danh từ giống đực (thường kết thúc bằng -e, chỉ người, nghề nghiệp, quốc tịch như der Patient, der Kollege, der Assistent, der Name) bắt buộc phải thêm đuôi "-n" hoặc "-en" ở tất cả các cách ngoại trừ Nominativ số ít.',
    examples: [
      { de: 'Der Patient liegt im Bett. (Nominativ)', vi: 'Bệnh nhân nằm trên giường.' },
      { de: 'Ich frage den Patienten. (Akkusativ)', vi: 'Tôi hỏi bệnh nhân.' },
      { de: 'Ich helfe dem Patienten. (Dativ)', vi: 'Tôi giúp bệnh nhân.' },
      { de: 'Die Akte des Patienten ist hier. (Genitiv)', vi: 'Hồ sơ của bệnh nhân ở đây.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền từ đúng: "Haben Sie mit dem neuen _______ gesprochen?"',
        options: ['A. Kollege', 'B. Kollegen', 'C. Kollegem'],
        correct: 1,
        explanation: '"mit" đi với Dativ. Danh từ giống đực thuộc nhóm n-Deklination "der Kollege" phải biến thành "Kollegen" ở dạng Dativ.'
      },
      {
        id: 2,
        question: 'Điền đúng: "Ich kenne den _______ dieses Mannes nicht."',
        options: ['A. Name', 'B. Namen', 'C. Namens'],
        correct: 1,
        explanation: '"der Name" thuộc nhóm n-Deklination. Ở cách Akkusativ (làm tân ngữ của kenne), từ này nhận đuôi -n thành "Namen".'
      }
    ]
  },
  {
    id: 'futur_i_ii',
    title: 'Thì tương lai I & II (Futur I & II)',
    level: 'B2',
    theory: 'Futur I dùng để diễn tả hành động trong tương lai hoặc phỏng đoán ở hiện tại. Công thức: werden + Infinitiv.\nFutur II dùng để diễn tả hành động sẽ hoàn thành tại một thời điểm trong tương lai, hoặc phỏng đoán về quá khứ. Công thức: werden + Partizip II + haben/sein.',
    examples: [
      { de: 'Ich werde morgen die Frühschicht übernehmen. (Tương lai)', vi: 'Ngày mai tôi sẽ nhận ca sáng.' },
      { de: 'Er wird wohl krank sein. (Phỏng đoán hiện tại)', vi: 'Chắc là anh ấy đang bị ốm.' },
      { de: 'Bis morgen werde ich den Bericht geschrieben haben. (Tương lai hoàn thành)', vi: 'Đến ngày mai tôi sẽ viết xong bản báo cáo này.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng: "Morgen _______ wir die Ergebnisse bekommen."',
        options: ['A. werden', 'B. wollen', 'C. würde'],
        correct: 0,
        explanation: 'Thì Futur I sử dụng trợ động từ "werden" chia theo ngôi số nhiều "wir".'
      },
      {
        id: 2,
        question: 'Điền đúng phỏng đoán quá khứ: "Er antwortet nicht. Er wird das Handy _______."',
        options: ['A. verloren haben', 'B. verlieren wird', 'C. verloren sein'],
        correct: 0,
        explanation: 'Phỏng đoán về một sự việc đã hoàn thành: "werden + Partizip II + haben". "verlieren" đi với "haben" -> "verloren haben".'
      }
    ]
  },
  {
    id: 'konnektoren',
    title: 'Liên từ kết nối câu (deshalb, trotzdem, außerdem...)',
    level: 'B1/B2',
    theory: 'Các liên từ trạng từ (Adverbkonjunktionen) nối hai câu chính. Chúng chiếm vị trí số 1 trong câu phụ thuộc, do đó động từ đã chia phải đứng ngay sau chúng (vị trí số 2). Phân biệt:\n- deshalb (vì vậy - chỉ kết quả).\n- trotzdem (mặc dù vậy - chỉ nhượng bộ).\n- außerdem (ngoài ra - chỉ bổ sung).',
    examples: [
      { de: 'Es regnet, trotzdem geht er spazieren.', vi: 'Trời mưa, mặc dù vậy anh ấy vẫn đi dạo.' },
      { de: 'Ich bin müde, deshalb trinke ich Kaffee.', vi: 'Tôi mệt, vì vậy tôi uống cà phê.' },
      { de: 'Deutsch ist schwer, außerdem kostet der Kurs viel.', vi: 'Tiếng Đức khó, ngoài ra khóa học còn tốn nhiều tiền.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng: "Die Wunde ist infiziert, _______ rufen wir den Arzt."',
        options: ['A. trotzdem', 'B. deshalb', 'C. obwohl'],
        correct: 1,
        explanation: 'Chỉ kết quả hợp logic: vết thương bị nhiễm trùng, VÌ VẬY chúng tôi gọi bác sĩ -> chọn "deshalb".'
      },
      {
        id: 2,
        question: 'Chọn câu đúng ngữ pháp:',
        options: [
          'A. Er ist krank, trotzdem er arbeitet.',
          'B. Er ist krank, trotzdem arbeitet er.',
          'C. Er ist krank, trotzdem er arbeitet gern.'
        ],
        correct: 1,
        explanation: '"trotzdem" đứng đầu mệnh đề phụ chiếm vị trí số 1, động từ chia "arbeitet" đứng ở vị trí số 2, tiếp đến là chủ ngữ "er".'
      }
    ]
  },
  {
    id: 'partizip_adjektiv',
    title: 'Phân từ làm tính từ (Partizip I & II als Adjektiv)',
    level: 'B2',
    theory: 'Cả Partizip I (Infinitiv + d) và Partizip II đều có thể đứng trước danh từ đóng vai trò như một tính từ và phải chia đuôi tính từ.\n- Partizip I: Mang tính chủ động, đang diễn ra.\n- Partizip II: Mang tính bị động, đã hoàn thành.',
    examples: [
      { de: 'Der schlafende Patient (Partizip I - đang ngủ)', vi: 'Bệnh nhân đang ngủ.' },
      { de: 'Der operierte Patient (Partizip II - đã được phẫu thuật)', vi: 'Bệnh nhân đã được phẫu thuật.' },
      { de: 'Die kochende Suppe (Partizip I - đang sôi)', vi: 'Nồi súp đang sôi.' },
      { de: 'Das gekochte Essen (Partizip II - đồ ăn đã được nấu chín)', vi: 'Đồ ăn đã được nấu chín.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền từ đúng: "Hören Sie auf das _______ Kind!" (đang khóc)',
        options: ['A. weinende', 'B. geweinte', 'C. weinend'],
        correct: 0,
        explanation: 'Đứa trẻ đang thực hiện hành động khóc (chủ động), dùng Partizip I "weinend" chia đuôi tính từ giống trung cách Akkusativ sau quán từ xác định -> "weinende".'
      },
      {
        id: 2,
        question: 'Điền đúng: "Wo sind die _______ Medikamente?" (đã mua)',
        options: ['A. kaufenden', 'B. gekauften', 'C. gekaufte'],
        correct: 1,
        explanation: 'Thuốc đã được mua xong (bị động/hoàn thành), dùng Partizip II "gekauft" chia đuôi số nhiều -> "gekauften".'
      }
    ]
  },
  {
    id: 'nominalisierung',
    title: 'Danh từ hóa (Nominalisierung von Verben/Adjektiven)',
    level: 'B2',
    theory: 'Biến động từ hoặc tính từ thành danh từ. Rất phổ biến trong văn phong hành chính khoa học của B2.\n- Động từ hóa: Lấy nguyên thể thêm viết hoa, giống trung (das Essen, das Gehen, das Schreiben).\n- Với giới từ: beim + động từ hóa (khi làm gì đó).\n- Tính từ hóa: những từ chỉ khái niệm (das Neue, das Schöne).',
    examples: [
      { de: 'Lernen macht Spaß. -> Das Lernen macht Spaß.', vi: 'Học tập mang lại niềm vui.' },
      { de: 'Wenn man arbeitet -> Beim Arbeiten darf man nicht rauchen.', vi: 'Khi đang làm việc không được hút thuốc.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền đúng: "Geben Sie mir bitte etwas _______!" (ngọt)',
        options: ['A. süßes', 'B. Süßes', 'C. Süße'],
        correct: 1,
        explanation: 'Sau các từ như "etwas, nichts, viel, wenig", tính từ được danh từ hóa viết hoa và chia đuôi giống trung -> "Süßes".'
      },
      {
        id: 2,
        question: 'Điền đúng: "_______ Lesen sollte man die Brille tragen."',
        options: ['A. Beim', 'B. Am', 'C. Vom'],
        correct: 0,
        explanation: 'Cấu trúc "beim + Danh từ hóa động từ" nghĩa là "khi đang làm gì đó" (Beim Lesen = khi đọc sách).'
      }
    ]
  },
  {
    id: 'temporale_nebensaetze',
    title: 'Mệnh đề phụ chỉ thời gian (als, wenn, bevor, nachdem)',
    level: 'B1',
    theory: 'Dùng để nối các hành động có sự liên hệ về thời gian. Phân biệt:\n- als: sự kiện đơn lẻ xảy ra trong quá khứ.\n- wenn: sự kiện lặp lại trong quá khứ hoặc hiện tại/tương lai.\n- bevor: hành động này xảy ra trước hành động kia.\n- nachdem: hành động này xảy ra sau hành động kia.',
    examples: [
      { de: 'Als ich ein Kind war, wohnte ich in Hanoi.', vi: 'Khi tôi còn là một đứa trẻ, tôi đã sống ở Hà Nội.' },
      { de: 'Wenn ich Zeit habe, lese ich Bücher.', vi: 'Khi nào có thời gian, tôi sẽ đọc sách.' },
      { de: 'Waschen Sie die Hände, bevor Sie essen.', vi: 'Hãy rửa tay trước khi bạn ăn.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền liên từ đúng: "_______ ich gestern in der Klinik ankam, brannte kein Licht."',
        options: ['A. Wenn', 'B. Als', 'C. Bevor'],
        correct: 1,
        explanation: 'Hành động xảy ra một lần duy nhất trong quá khứ ("hôm qua tôi đến viện"), dùng "Als".'
      },
      {
        id: 2,
        question: 'Điền đúng: "Jedes Mal, _______ der Patient klingelt, gehen wir zu ihm."',
        options: ['A. als', 'B. wenn', 'C. nachdem'],
        correct: 1,
        explanation: 'Hành động lặp đi lặp lại nhiều lần ("mỗi lần bệnh nhân bấm chuông"), dùng "wenn".'
      }
    ]
  },
  {
    id: 'modalpartikeln',
    title: 'Các từ đệm biểu cảm (Modalpartikeln: doch, mal, ja...)',
    level: 'B2',
    theory: 'Các từ đệm như "doch, mal, ja, halt, eigentlich, denn" không có nghĩa thực tế về mặt dịch thuật nhưng giúp câu nói tự nhiên, thể hiện thái độ của người nói (ngạc nhiên, thân thiện, nhắc nhở, bất lực...).',
    examples: [
      { de: 'Komm mal her! (Thân thiện, giảm bớt tính mệnh lệnh)', vi: 'Lại đây một chút đi!' },
      { de: 'Das ist ja super! (Ngạc nhiên, tán đồng)', vi: 'Cái đó quả thực là tuyệt vời!' },
      { de: 'Du weißt doch, dass er krank ist. (Nhắc nhở về điều đối phương đã biết)', vi: 'Bạn thừa biết là anh ấy đang ốm mà.' },
      { de: 'Was ist denn hier los? (Tò mò, ngạc nhiên)', vi: 'Có chuyện gì xảy ra ở đây thế nhỉ?' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Điền từ đệm thích hợp để giảm bớt tính nghiêm trọng của mệnh lệnh: "Hilf mir _______!"',
        options: ['A. denn', 'B. mal', 'C. halt'],
        correct: 1,
        explanation: 'Từ đệm "mal" giúp câu cầu khiến nhẹ nhàng, thân thiện hơn như lời mời gọi giúp đỡ.'
      },
      {
        id: 2,
        question: 'Điền từ đúng để thể hiện sự ngạc nhiên: "Das hast du _______ toll gemacht!"',
        options: ['A. ja', 'B. doch', 'C. denn'],
        correct: 0,
        explanation: '"ja" được dùng để nhấn mạnh cảm xúc tích cực hoặc sự ngạc nhiên thú vị trước một kết quả tốt.'
      }
    ]
  }
];


balanceAnswerPositions(GRAMMAR_DATA);
