export const SCHREIBEN_TOPICS = [
  {
    id: 1,
    level: 'B1',
    type: 'Teil 1 - Thư cá nhân (Lên kế hoạch)',
    title: 'Kế hoạch tổ chức tiệc chia tay đồng nghiệp',
    description: 'Một đồng nghiệp trong viện dưỡng lão/văn phòng của bạn sẽ nghỉ việc vào tuần tới. Bạn hãy viết một email cho đồng nghiệp khác tên là Anna để lên kế hoạch tổ chức một bữa tiệc chia tay.',
    points: [
      'Giải thích lý do viết email.',
      'Đề xuất thời gian và địa điểm tổ chức tiệc.',
      'Gợi ý món quà chia tay ý nghĩa và hỏi ý kiến Anna.',
      'Hẹn gặp để bàn bạc thêm.'
    ],
    redemittel: [
      { de: 'Ich schreibe dir, weil...', vi: 'Tôi viết thư cho bạn vì...' },
      { de: 'Was hältst du davon, wenn wir...?', vi: 'Bạn nghĩ sao nếu chúng ta...?' },
      { de: 'Als Geschenk schlage ich vor, ... zu kaufen.', vi: 'Làm quà tặng tôi đề xuất mua...' },
      { de: 'Gib mir bitte Bescheid, ob...', vi: 'Vui lòng báo cho tôi biết liệu...' }
    ],
    defaultText: 'Liebe Anna,\nich schreibe dir, weil unser Kollege Herr Schmidt nächste Woche aufhört. Wir sollten eine Abschiedsfeier organisieren...'
  },
  {
    id: 2,
    level: 'B2',
    type: 'Teil 1 - Bài đăng diễn đàn (Forumsbeitrag)',
    title: 'Sử dụng Robot trong chăm sóc y tế (Roboter in der Pflege)',
    description: 'Bạn hãy viết một bài luận ngắn đăng trên diễn đàn trực tuyến về chủ đề sử dụng robot trong ngành điều dưỡng chăm sóc người bệnh/người già.',
    points: [
      'Nêu ý kiến của bạn về việc áp dụng công nghệ robot trong y tế.',
      'Giải thích lý do tại sao xu hướng này ngày càng phổ biến.',
      'Nêu những ưu điểm và nhược điểm của robot điều dưỡng.',
      'Đề xuất giải pháp kết hợp hài hòa giữa người và máy.'
    ],
    redemittel: [
      { de: 'Ich bin der Meinung, dass...', vi: 'Tôi có ý kiến rằng...' },
      { de: 'Ein großer Vorteil von Robotern ist...', vi: 'Một lợi thế lớn của robot là...' },
      { de: 'Auf der anderen Seite muss man bedenken, dass...', vi: 'Mặt khác ta phải cân nhắc rằng...' },
      { de: 'Zusammenfassend lässt sich sagen, dass...', vi: 'Tóm lại có thể nói rằng...' }
    ],
    defaultText: 'Ich möchte in diesem Forumsbeitrag meine Meinung zum Thema "Roboter in der Pflege" äußern. Meiner Ansicht nach ist das eine wichtige Entwicklung...'
  },
  {
    id: 3,
    level: 'B1',
    type: 'Teil 2 - Diễn đàn bày tỏ quan điểm',
    title: 'Học tiếng Đức trực tuyến hay trực tiếp (Online-Lernen vs. Präsenzunterricht)',
    description: 'Viết bài luận ngắn bày tỏ quan điểm cá nhân trên diễn đàn học tập về việc tự học tiếng Đức trực tuyến so với học trực tiếp tại trung tâm.',
    points: [
      'Bày tỏ thái độ của bạn đối với việc học online.',
      'Nêu lý do vì sao nhiều học viên thích tự học online.',
      'So sánh ưu/nhược điểm của hai hình thức học tập này.',
      'Lời khuyên cho các bạn học viên B1.'
    ],
    redemittel: [
      { de: 'Heutzutage lernen viele Menschen online, weil...', vi: 'Ngày nay nhiều người học trực tuyến vì...' },
      { de: 'Ein Vorteil des Online-Lernens ist die Flexibilität.', vi: 'Một ưu điểm của học online là sự linh hoạt.' },
      { de: 'Im Gegensatz dazu bietet der Präsenzunterricht...', vi: 'Ngược lại với điều đó, học trực tiếp đem lại...' }
    ],
    defaultText: 'Im Internet wird viel über das Thema "Online-Lernen" diskutiert. Ich finde, dass Online-Kurse sehr praktisch sind, aber...'
  },
  {
    id: 4,
    level: 'B2',
    type: 'Teil 2 - Thư chính thức (Formelle E-Mail)',
    title: 'Đăng ký tham gia khóa đào tạo nâng cao (Fortbildung)',
    description: 'Bạn muốn đăng ký tham gia khóa đào tạo nâng cao về kỹ thuật chăm sóc mới/quản lý công sở. Hãy viết một bức thư chính thức gửi cho người quản lý nhân sự Herr Wagner.',
    points: [
      'Giải thích lý do viết thư đăng ký.',
      'Nêu lý do tại sao khóa học này hữu ích cho công việc hiện tại của bạn.',
      'Đề xuất phương án sắp xếp thời gian làm việc trong những ngày đi học.',
      'Yêu cầu công ty hỗ trợ một phần kinh phí khóa học.'
    ],
    redemittel: [
      { de: 'Sehr geehrter Herr Wagner, ...', vi: 'Kính gửi ông Wagner, ...' },
      { de: 'Ich interessiere mich sehr für die Fortbildung zum Thema...', vi: 'Tôi rất quan tâm đến khóa đào tạo nâng cao về chủ đề...' },
      { de: 'Dieses Seminar würde mir helfen, meine Aufgaben besser zu...', vi: 'Buổi hội thảo này sẽ giúp tôi thực hiện nhiệm vụ tốt hơn...' },
      { de: 'Ich hoffe auf eine positive Rückmeldung.', vi: 'Tôi hy vọng nhận được phản hồi tích cực.' }
    ],
    defaultText: 'Sehr geehrter Herr Wagner,\nich schreibe Ihnen, da ich mich für die angebotene Fortbildung im Bereich moderne Pflegetechniken interessiere...'
  },
  {
    id: 5,
    level: 'B1',
    type: 'Teil 3 - Email công việc chính thức',
    title: 'Xin nghỉ phép ngắn ngày vì việc gia đình',
    description: 'Bạn có việc gia đình đột xuất và muốn xin nghỉ làm 3 ngày. Viết email gửi cho người quản lý ca làm việc (Herr Müller) để xin phép nghỉ.',
    points: [
      'Nêu lý do xin nghỉ phép đột xuất.',
      'Cho biết thời gian nghỉ cụ thể (từ ngày nào đến ngày nào).',
      'Đề xuất đồng nghiệp (ví dụ: Thomas) sẽ nhận ca trực thay cho bạn.',
      'Lời cảm ơn và mong nhận được phản hồi sớm.'
    ],
    redemittel: [
      { de: 'Ich muss mich für drei Tage entschuldigen, weil...', vi: 'Tôi xin phép vắng mặt 3 ngày vì...' },
      { de: 'Mein Kollege Thomas hat sich bereit erklärt, meine Schicht zu übernehmen.', vi: 'Đồng nghiệp Thomas của tôi đã đồng ý nhận ca trực thay tôi.' },
      { de: 'Vielen Dank für Ihr Verständnis.', vi: 'Xin chân thành cảm ơn sự thông cảm của ông.' }
    ],
    defaultText: 'Sehr geehrter Herr Müller,\nich schreibe Ihnen, weil ich nächste Woche aus dringenden familiären Gründen drei Tage frei brauche...'
  },
  {
    id: 6,
    level: 'B2',
    type: 'Teil 1 - Bài đăng diễn đàn (Forumsbeitrag)',
    title: 'Xu hướng làm việc từ xa (Homeoffice) trong y tế và công sở',
    description: 'Viết bài luận bày tỏ quan điểm về xu hướng làm việc từ xa (Homeoffice) đối với các vị trí hành chính y tế hoặc nhân viên văn phòng.',
    points: [
      'Nêu định nghĩa và mức độ phổ biến của Homeoffice hiện nay.',
      'Phân tích những lợi ích đối với nhân viên (tiết kiệm thời gian, tự chủ).',
      'Chỉ ra những thách thức đối với doanh nghiệp (quản lý, tính bảo mật).',
      'Đưa ra nhận định xu hướng này có phát triển lâu dài không.'
    ],
    redemittel: [
      { de: 'Das Arbeiten im Homeoffice hat in den letzten Jahren...', vi: 'Làm việc ở nhà trong những năm gần đây đã...' },
      { de: 'Für die Arbeitnehmer bedeutet Homeoffice vor allem...', vi: 'Đối với người lao động, Homeoffice trước hết có nghĩa là...' },
      { de: 'Es darf jedoch nicht übersehen werden, dass...', vi: 'Tuy nhiên không thể bỏ qua một thực tế là...' }
    ],
    defaultText: 'In der heutigen Zeit wird viel über die Vor- und Nachteile von Homeoffice gesprochen. Meiner Meinung nach...'
  },
  {
    id: 7,
    level: 'B2',
    type: 'Teil 2 - Thư khiếu nại (Beschwerdebrief)',
    title: 'Khiếu nại về khóa học tiếng Đức kém chất lượng',
    description: 'Bạn đã đăng ký học một khóa luyện thi B2 trực tuyến trị giá 500 Euro nhưng chất lượng thực tế rất tệ (giáo viên đi muộn, tài liệu cũ, lỗi kết nối liên tục). Hãy viết thư khiếu nại gửi trung tâm.',
    points: [
      'Mô tả khóa học bạn đã đăng ký và lý do khiếu nại.',
      'Chi tiết các sự cố xảy ra trong suốt khóa học.',
      'Yêu cầu hoàn trả lại ít nhất 50% học phí hoặc đổi khóa học miễn phí.',
      'Đưa ra thời hạn giải quyết trước khi tìm đến sự can thiệp pháp lý.'
    ],
    redemittel: [
      { de: 'Ich schreibe Ihnen, um mich über den Kurs... zu beschweren.', vi: 'Tôi viết thư cho ông/bà để khiếu nại về khóa học...' },
      { de: 'Entgegen den Angaben in Ihrer Werbung war...', vi: 'Trái ngược với những thông tin trong quảng cáo của ông/bà, ...' },
      { de: 'Aus diesem Grund fordere ich eine teilweise Rückerstattung der...', vi: 'Vì lý do này tôi yêu cầu hoàn lại một phần tiền...' }
    ],
    defaultText: 'Sehr geehrte Damen und Herren,\nich wende mich an Sie, um mich über den B2-Vorbereitungskurs zu beschweren, den ich letzten Monat gebucht habe...'
  },
  {
    id: 8,
    level: 'B1',
    type: 'Teil 1 - Thư cá nhân (Sự cố)',
    title: 'Hủy hẹn đột xuất với bạn thân',
    description: 'Bạn có hẹn đi ăn tối với người bạn thân tên là Max vào ngày mai, nhưng sếp yêu cầu bạn phải trực tăng ca khẩn cấp. Hãy viết email xin lỗi và dời lịch hẹn.',
    points: [
      'Xin lỗi vì phải hủy hẹn đột xuất.',
      'Giải thích lý do liên quan đến công việc ở viện/công ty.',
      'Đề xuất một cuộc hẹn khác vào cuối tuần này.',
      'Hỏi ý kiến Max xem ngày đó có tiện không.'
    ],
    redemittel: [
      { de: 'Es tut mir schrecklich leid, aber...', vi: 'Tôi vô cùng xin lỗi nhưng...' },
      { de: 'Mein Chef hat mich gebeten, morgen eine Extraschicht zu übernehmen.', vi: 'Sếp của tôi đã yêu cầu tôi nhận thêm một ca làm ngày mai.' },
      { de: 'Wie wäre es, wenn wir uns stattdessen am Samstag treffen?', vi: 'Hay là chúng ta gặp nhau vào thứ Bảy thay thế nhé?' }
    ],
    defaultText: 'Lieber Max,\nes tut mir leid, aber ich muss unser Treffen für morgen leider absagen. Auf der Arbeit gibt es einen Notfall...'
  },
  {
    id: 9,
    level: 'B2',
    type: 'Teil 1 - Bài đăng diễn đàn (Forumsbeitrag)',
    title: 'Sử dụng túi nilon và rác thải nhựa (Plastikmüll)',
    description: 'Viết một bài luận trên diễn đàn môi trường bàn về các biện pháp giảm thiểu sử dụng túi nilon và đồ nhựa dùng một lần trong xã hội hiện đại.',
    points: [
      'Thực trạng sử dụng túi nhựa và tác động tiêu cực đến sinh thái.',
      'Các giải pháp cá nhân có thể làm (mang túi vải, hạn chế mua đồ đóng chai nhựa).',
      'Vai trò của các chính sách cấm hoặc đánh thuế đồ nhựa của chính phủ.',
      'Tầm quan trọng của việc giáo dục ý thức bảo vệ môi trường từ nhỏ.'
    ],
    redemittel: [
      { de: 'Plastikmüll stellt eine ernsthafte Bedrohung für unsere Umwelt dar.', vi: 'Rác thải nhựa là mối đe dọa nghiêm trọng cho môi trường của chúng ta.' },
      { de: 'Jeder Einzelne kann einen Beitrag leisten, indem er...', vi: 'Mỗi cá nhân có thể đóng góp bằng cách...' },
      { de: 'Darüber hinaus sollte die Regierung gesetzliche Maßnahmen...', vi: 'Ngoài ra chính phủ nên đưa ra các biện pháp luật pháp...' }
    ],
    defaultText: 'Plastikmüll ist eines der größten Umweltprobleme unserer Zeit. Ich denke, wir alle müssen unser Verhalten ändern...'
  },
  {
    id: 10,
    level: 'B2',
    type: 'Teil 2 - Thư chính thức (Formelle E-Mail)',
    title: 'Đơn xin thực tập tại bệnh viện/doanh nghiệp Đức',
    description: 'Bạn muốn ứng tuyển vào vị trí thực tập sinh y tế/hành chính tại một bệnh viện hoặc doanh nghiệp ở Đức. Hãy viết thư gửi cho bà Frau Sommer để ứng tuyển.',
    points: [
      'Giới thiệu bản thân và khóa đào tạo bạn đang theo học.',
      'Nêu rõ lý do tại sao bạn muốn thực tập tại cơ sở này.',
      'Trình bày các thế mạnh cá nhân của bạn (kỹ năng tiếng Đức, sự chăm chỉ).',
      'Đề xuất thời gian thực tập mong muốn và yêu cầu một buổi phỏng vấn.'
    ],
    redemittel: [
      { de: 'Sehr geehrte Frau Sommer, ...', vi: 'Kính gửi bà Sommer, ...' },
      { de: 'hiermit bewerbe ich mich um eine Praktikumsstelle in Ihrer...', vi: 'Tôi viết thư này để ứng tuyển vào vị trí thực tập tại cơ sở của bà...' },
      { de: 'Zu meinen Stärken gehören Zuverlässigkeit und...', vi: 'Thế mạnh của tôi bao gồm sự đáng tin cậy và...' },
      { de: 'Über die Gelegenheit zu einem persönlichen Gespräch würde ich mich sehr freuen.', vi: 'Tôi rất vui nếu có cơ hội được phỏng vấn trực tiếp.' }
    ],
    defaultText: 'Sehr geehrte Frau Sommer,\nhiermit bewerbe ich mich um ein Praktikum in Ihrer Klinik ab dem nächsten Monat...'
  }
];
