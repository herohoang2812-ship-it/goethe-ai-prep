export const SPRECHEN_TOPICS = [
  {
    id: 1,
    level: 'B1',
    type: 'Teil 1 - Gemeinsam planen (Cùng lên kế hoạch)',
    title: 'Tổ chức chuyến dã ngoại cuối tuần cho các cụ già',
    scenario: 'Một nhóm 5 cụ già trong viện dưỡng lão nơi bạn làm việc muốn đi dã ngoại vào cuối tuần này. Bạn và đối tác luyện tập sẽ cùng thảo luận để lên kế hoạch chi tiết.',
    prompts: [
      'Nên đi bằng phương tiện gì (Bus, Taxi, đi bộ)?',
      'Chuẩn bị thức ăn và nước uống như thế nào?',
      'Lựa chọn địa điểm phù hợp (Công viên, hồ nước gần đó)?',
      'Sắp xếp thời gian đi và về để tránh các cụ bị mệt?'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Hallo! Wir müssen heute den Ausflug für die Senioren planen. Hast du schon eine Idee, wohin wir fahren könnten?' },
      { id: 2, sender: 'user', text: 'Hallo. Ich denke, wir können in den Stadtpark fahren. Dort ist es sehr ruhig und schön.' },
      { id: 3, sender: 'ai', text: 'Das ist ein guter Vorschlag. Der Stadtpark hat auch flache Wege für Rollstühle. Wie sollten wir denn dorthin reisen?' }
    ]
  },
  {
    id: 2,
    level: 'B1',
    type: 'Teil 1 - Gemeinsam planen (Cùng lên kế hoạch)',
    title: 'Tổ chức tiệc sinh nhật bất ngờ cho cụ Schmidt',
    scenario: 'Cụ Schmidt ở phòng số 12 sắp bước sang tuổi 80 vào tuần tới. Cụ không có người thân ở gần. Bạn và đối tác luyện tập bàn bạc tổ chức một buổi tiệc sinh nhật bất ngờ tại phòng sinh hoạt chung.',
    prompts: [
      'Trang trí phòng sinh hoạt chung như thế nào?',
      'Mua hoặc tự làm bánh sinh nhật?',
      'Mời những ai tham gia (các cụ khác, điều dưỡng trực ca)?',
      'Chuẩn bị món quà gì ý nghĩa?'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Hallo! Nächste Woche wird Herr Schmidt 80 Jahre alt. Wir sollten ihn überraschen. Was meinst du, wie fangen wir an?' },
      { id: 2, sender: 'user', text: 'Hallo. Wir können den Aufenthaltsraum schön mit Blumen und Luftballons dekorieren.' },
      { id: 3, sender: 'ai', text: 'Ja, das gefällt ihm bestimmt! Sollen wir einen Geburtstagskuchen bestellen oder lieber selbst backen?' }
    ]
  },
  {
    id: 3,
    level: 'B2',
    type: 'Teil 1 - Vortrag (Thuyết trình)',
    title: 'Tác hại của đồ ăn nhanh (Fast Food)',
    scenario: 'Bạn được yêu cầu thực hiện một bài thuyết trình ngắn về chủ đề "Tác hại của đồ ăn nhanh đối với sức khỏe thanh thiếu niên" và trả lời câu hỏi phản biện của giám khảo.',
    prompts: [
      'Giải thích tại sao đồ ăn nhanh lại thu hút giới trẻ.',
      'Phân tích những tác động tiêu cực đến sức khỏe (béo phì, bệnh tim mạch).',
      'Thực trạng tiêu dùng thức ăn nhanh ở quốc gia của bạn (Việt Nam).',
      'Đề xuất các biện pháp thay thế lành mạnh.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Guten Tag. Ich bin sehr gespannt auf Ihre Präsentation zum Thema Fast Food. Bitte beginnen Sie, wenn Sie bereit sind.' },
      { id: 2, sender: 'user', text: 'Guten Tag. Heute möchte ich über das Thema Fast Food präsentieren. Zuerst spreche ich über die Beliebtheit...' },
      { id: 3, sender: 'ai', text: 'Vielen Dank für den ersten Teil. Sie haben erwähnt, dass Fast Food in Vietnam immer beliebter wird. Woran liegt das Ihrer Meinung nach?' }
    ]
  },
  {
    id: 4,
    level: 'B1',
    type: 'Teil 2 - Präsentation (Thuyết trình)',
    title: 'Học ngoại ngữ từ khi còn nhỏ (Fremdsprachen im Kindergarten)',
    scenario: 'Bạn thuyết trình về chủ đề: Có nên cho trẻ em học ngoại ngữ từ bậc mẫu giáo hay không.',
    prompts: [
      'Bày tỏ quan điểm cá nhân (đồng ý hay phản đối).',
      'Lợi ích của việc tiếp xúc sớm với ngoại ngữ (phát âm tự nhiên, phản xạ tốt).',
      'Khó khăn hoặc tác động ngược nếu ép trẻ học quá nhiều.',
      'Kinh nghiệm bản thân hoặc thực tế tại Việt Nam.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Hallo. Bitte präsentieren Sie uns Ihre Meinung zum Sprachenlernen im Kindergarten.' },
      { id: 2, sender: 'user', text: 'Hallo. Meiner Meinung nach ist es sehr gut, wenn Kinder früh eine Fremdsprache lernen...' },
      { id: 3, sender: 'ai', text: 'Ein interessanter Vortrag. Glauben Sie nicht, dass die Kinder dadurch überfordert werden, wenn sie noch nicht richtig ihre Muttersprache können?' }
    ]
  },
  {
    id: 5,
    level: 'B2',
    type: 'Teil 2 - Thảo luận & Tranh luận (Debatte)',
    title: 'Nên cấm sử dụng điện thoại trong trường học không?',
    scenario: 'Bạn và giám khảo mô phỏng cùng thảo luận sôi nổi về việc đưa ra lệnh cấm hoàn toàn điện thoại di động trong các trường phổ thông.',
    prompts: [
      'Lợi ích của việc cấm điện thoại (tập trung học tập, giảm bạo lực mạng học đường).',
      'Vai trò của điện thoại như công cụ tra cứu thông tin hữu ích trong bài học.',
      'Sự tự chủ của học sinh và cách quản lý thay vì cấm đoán.',
      'Đề xuất quy chế sử dụng điện thoại thông minh hợp lý.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Ich bin absolut der Meinung, dass Smartphones an Schulen verboten werden sollten. Die Schüler sind ständig abgelenkt. Wie sehen Sie das?' },
      { id: 2, sender: 'user', text: 'Das sehe ich anders. Smartphones können auch beim Lernen helfen, wenn man schnell Informationen im Internet sucht.' },
      { id: 3, sender: 'ai', text: 'Das stimmt zwar, aber viele Schüler nutzen das Handy in der Pause nur für soziale Medien, statt mit Mitschülern zu reden. Sollte man das nicht einschränken?' }
    ]
  },
  {
    id: 6,
    level: 'B1',
    type: 'Teil 1 - Gemeinsam planen (Cùng lên kế hoạch)',
    title: 'Lên kế hoạch dọn dẹp và trang trí lại văn phòng làm việc',
    scenario: 'Văn phòng của bạn trông rất lộn xộn. Bạn và đối tác luyện tập cùng lập kế hoạch dọn dẹp vệ sinh và trang trí lại không gian làm việc chung vào ngày thứ Bảy tới.',
    prompts: [
      'Thời gian bắt đầu dọn dẹp?',
      'Phân chia công việc (ai dọn bàn ghế, ai vứt tài liệu cũ)?',
      'Mua sắm đồ trang trí mới (chậu cây xanh, tranh treo tường)?',
      'Tổ chức liên hoan nhẹ sau khi hoàn thành?'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Hallo. Unser Büro ist wirklich unordentlich. Wollen wir am Samstag aufräumen? Wann passt es dir?' },
      { id: 2, sender: 'user', text: 'Hallo. Am Samstag um 9 Uhr morgens ist eine gute Zeit für mich. Was meinst du?' },
      { id: 3, sender: 'ai', text: '9 Uhr ist perfekt. Wer sollte die alten Akten sortieren und wer kümmert sich um die Pflanzen?' }
    ]
  },
  {
    id: 7,
    level: 'B2',
    type: 'Teil 1 - Vortrag (Thuyết trình)',
    title: 'Sử dụng năng lượng tái tạo (Erneuerbare Energien)',
    scenario: 'Bạn trình bày về tầm quan trọng của việc chuyển dịch sang năng lượng mặt trời và gió để bảo vệ môi trường.',
    prompts: [
      'Nêu vai trò của năng lượng tái tạo so với năng lượng hóa thạch truyền thống.',
      'Các khó khăn về mặt kỹ thuật và chi phí lắp đặt ban đầu.',
      'Tiềm năng phát triển năng lượng gió/mặt trời tại Việt Nam.',
      'Kết luận và thông điệp kêu gọi tiết kiệm năng lượng.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Willkommen. Bitte halten Sie Ihren Vortrag über erneuerbare Energien.' },
      { id: 2, sender: 'user', text: 'Guten Tag. Das Thema meiner Präsentation lautet erneuerbare Energien. Zuerst möchte ich betonen...' },
      { id: 3, sender: 'ai', text: 'Sie haben über die hohen Kosten gesprochen. Glauben Sie, dass arme Länder sich diesen Übergang überhaupt leisten können?' }
    ]
  },
  {
    id: 8,
    level: 'B1',
    type: 'Teil 1 - Gemeinsam planen (Cùng lên kế hoạch)',
    title: 'Lên kế hoạch chuẩn bị đón đoàn thanh tra y tế',
    scenario: 'Tuần tới sẽ có đoàn thanh tra y tế của bang đến kiểm tra viện dưỡng lão. Bạn và điều dưỡng trưởng mô phỏng bàn bạc để chuẩn bị đón tiếp thật chu đáo.',
    prompts: [
      'Kiểm tra lại toàn bộ hồ sơ bệnh án và lịch phát thuốc.',
      'Dọn dẹp phòng bệnh nhân và khu vệ sinh chung.',
      'Phân công nhân sự hướng dẫn đoàn đi tham quan.',
      'Chuẩn bị nước uống, trà bánh tiếp đón.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Hallo! Nächste Woche kommt die Kontrollbehörde zu uns. Wir müssen alles vorbereiten. Hast du die Medikamentenpläne schon überprüft?' },
      { id: 2, sender: 'user', text: 'Hallo. Ja, ich habe alle Pläne gestern kontrolliert. Sie sind alle auf dem neuesten Stand.' },
      { id: 3, sender: 'ai', text: 'Sehr gut. Wer übernimmt das Aufräumen der Patientenzimmer und des Flurs?' }
    ]
  },
  {
    id: 9,
    level: 'B2',
    type: 'Teil 2 - Thảo luận & Tranh luận (Debatte)',
    title: 'Có nên mua sắm trực tuyến (Online-Shopping) thay vì ra cửa hàng?',
    scenario: 'Cuộc thảo luận về việc mua sắm online đang chiếm ưu thế hoàn toàn và liệu các cửa hàng truyền thống có bị xóa sổ.',
    prompts: [
      'Ưu điểm mua sắm online: rẻ hơn, nhiều lựa chọn, giao hàng tận nhà.',
      'Giá trị của các cửa hàng truyền thống: được thử đồ, tư vấn trực tiếp, giao lưu xã hội.',
      'Hậu quả của việc các cửa hàng truyền thống đóng cửa hàng loạt tại trung tâm thành phố.',
      'Dự đoán tương lai kết hợp của hai hình thức bán lẻ.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Ich kaufe fast alles nur noch online. Es spart Zeit und ist viel billiger. Geschäfte in der Innenstadt brauchen wir bald nicht mehr, oder?' },
      { id: 2, sender: 'user', text: 'Das sehe ich nicht so. Im Geschäft kann ich Kleidung anprobieren und die Qualität sofort prüfen.' },
      { id: 3, sender: 'ai', text: 'Stimmt, aber wenn alle so denken, sterben die Innenstädte aus und viele Menschen verlieren ihre Arbeit. Ist Ihnen das egal?' }
    ]
  },
  {
    id: 10,
    level: 'B2',
    type: 'Teil 1 - Vortrag (Thuyết trình)',
    title: 'Lợi ích và tác hại của việc sống ở thành phố lớn',
    scenario: 'Thuyết trình về đề tài cuộc sống đô thị hiện đại: Cơ hội phát triển so với các áp lực sinh hoạt.',
    prompts: [
      'Lợi thế: Cơ hội việc làm, học tập, dịch vụ y tế, văn hóa giải trí đa dạng.',
      'Bất lợi: Chi phí đắt đỏ, tiếng ồn, ô nhiễm môi trường, kẹt xe thường xuyên.',
      'Sự lựa chọn cá nhân của bạn và lý do.',
      'Lời khuyên cho những người muốn di cư từ nông thôn ra thành phố.'
    ],
    aiMessages: [
      { id: 1, sender: 'ai', text: 'Guten Tag. Bitte starten Sie Ihre Präsentation über das Leben in der Großstadt.' },
      { id: 2, sender: 'user', text: 'Guten Tag. Mein Vortrag beschäftigt sich mit dem Leben in Großstädten. Ein großer Vorteil ist...' },
      { id: 3, sender: 'ai', text: 'Sie haben über die Umweltbelastung gesprochen. Würden Sie selbst lieber aufs Land ziehen, wenn Sie im Homeoffice arbeiten könnten?' }
    ]
  }
];
