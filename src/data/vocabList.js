export const VOCAB_CATEGORIES = [
  { id: 'pflege', name: 'Điều dưỡng (Pflege)', icon: 'GraduationCap' },
  { id: 'gastro', name: 'Nhà hàng - Khách sạn (Gastro)', icon: 'Compass' },
  { id: 'kfz', name: 'Cơ khí - Điện tử (KFZ)', icon: 'TrendingUp' },
  { id: 'allgemein', name: 'Công sở & Giao tiếp (Beruf)', icon: 'User' },
  { id: 'medizin', name: 'Y tế - Bệnh viện (Medizin)', icon: 'Activity' },
  { id: 'wohnen', name: 'Nhà ở - Thuê nhà (Wohnen)', icon: 'Home' },
  { id: 'umwelt', name: 'Môi trường (Umwelt)', icon: 'Leaf' }
];

const pflegeVocab = [
  { de: 'die Pflegedokumentation', type: 'Nomen', category: 'pflege', vi: 'hồ sơ/báo cáo chăm sóc y tế', ex: 'Wir müssen die Pflegedokumentation jeden Tag schreiben.', exVi: 'Chúng ta phải viết báo cáo chăm sóc y tế mỗi ngày.' },
  { de: 'unterstützen', type: 'Verb', category: 'pflege', vi: 'hỗ trợ, giúp đỡ', ex: 'Ich unterstütze den Patienten beim Aufstehen.', exVi: 'Tôi hỗ trợ bệnh nhân khi đứng dậy.' },
  { de: 'Blutdruck messen', type: 'Phrase', category: 'pflege', vi: 'đo huyết áp', ex: 'Der Pfleger misst dem Patienten den Blutdruck.', exVi: 'Nam điều dưỡng đo huyết áp cho bệnh nhân.' },
  { de: 'die Übergabe', type: 'Nomen', category: 'pflege', vi: 'sự bàn giao ca trực', ex: 'Bei der Übergabe besprechen wir wichtige Vorfälle.', exVi: 'Khi bàn giao ca, chúng ta thảo luận về các sự cố quan trọng.' },
  { de: 'die Wunddokumentation', type: 'Nomen', category: 'pflege', vi: 'hồ sơ vết thương', ex: 'Bitte schreiben Sie die Wunddokumentation nach der Behandlung.', exVi: 'Vui lòng viết hồ sơ vết thương sau khi điều trị.' },
  { de: 'die Schicht', type: 'Nomen', category: 'pflege', vi: 'ca làm việc', ex: 'Ich arbeite heute in der Nachtschicht.', exVi: 'Hôm nay tôi làm ca đêm.' },
  { de: 'die Nebenwirkung', type: 'Nomen', category: 'pflege', vi: 'tác dụng phụ', ex: 'Dieses Medikament hat fast keine Nebenwirkungen.', exVi: 'Thuốc này hầu như không có tác dụng phụ.' },
  { de: 'desinfizieren', type: 'Verb', category: 'pflege', vi: 'khử trùng, sát khuẩn', ex: 'Bitte desinfizieren Sie Ihre Hände vor dem Patientenkontakt.', exVi: 'Vui lòng sát khuẩn tay trước khi tiếp xúc với bệnh nhân.' },
  { de: 'die Pflegedienstleitung', type: 'Nomen', category: 'pflege', vi: 'trưởng bộ phận chăm sóc', ex: 'Frau Müller ist unsere neue Pflegedienstleitung.', exVi: 'Bà Müller là trưởng bộ phận chăm sóc mới của chúng ta.' },
  { de: 'der Rollstuhl', type: 'Nomen', category: 'pflege', vi: 'xe lăn', ex: 'Der Patient benötigt einen Rollstuhl zum Fortbewegen.', exVi: 'Bệnh nhân cần một chiếc xe lăn để di chuyển.' },
  { de: 'die Spritze', type: 'Nomen', category: 'pflege', vi: 'kim tiêm, ống tiêm', ex: 'Die Krankenschwester bereitet die Spritze vor.', exVi: 'Nữ điều dưỡng chuẩn bị ống tiêm.' },
  { de: 'das Fieber messen', type: 'Phrase', category: 'pflege', vi: 'đo nhiệt độ cơ thể', ex: 'Ich muss bei Herrn Schmidt Fieber messen.', exVi: 'Tôi phải đo nhiệt độ cơ thể cho ông Schmidt.' },
  { de: 'die Wunde', type: 'Nomen', category: 'pflege', vi: 'vết thương', ex: 'Die Wunde heilt sehr gut.', exVi: 'Vết thương đang lành rất tốt.' },
  { de: 'der Verband', type: 'Nomen', category: 'pflege', vi: 'băng gạc', ex: 'Wir müssen den Verband täglich wechseln.', exVi: 'Chúng ta phải thay băng gạc hàng ngày.' },
  { de: 'die Krankenkasse', type: 'Nomen', category: 'pflege', vi: 'quỹ bảo hiểm y tế', ex: 'Die Krankenkasse übernimmt die Kosten für die Pflege.', exVi: 'Quỹ bảo hiểm y tế chi trả chi phí chăm sóc.' },
  { de: 'die Medikation', type: 'Nomen', category: 'pflege', vi: 'việc dùng thuốc, liều thuốc', ex: 'Die Medikation wurde vom Arzt angepasst.', exVi: 'Liều thuốc đã được bác sĩ điều chỉnh.' },
  { de: 'der Hausarzt', type: 'Nomen', category: 'pflege', vi: 'bác sĩ gia đình', ex: 'Rufen Sie bitte den Hausarzt an.', exVi: 'Vui lòng gọi điện cho bác sĩ gia đình.' },
  { de: 'die Demenz', type: 'Nomen', category: 'pflege', vi: 'chứng sa sút trí tuệ', ex: 'Viele Bewohner im Heim leiden an Demenz.', exVi: 'Nhiều cư dân trong viện dưỡng lão bị sa sút trí tuệ.' },
  { de: 'der Patient', type: 'Nomen', category: 'pflege', vi: 'bệnh nhân', ex: 'Der Patient schläft friedlich.', exVi: 'Bệnh nhân đang ngủ yên bình.' },
  { de: 'pflegen', type: 'Verb', category: 'pflege', vi: 'chăm sóc, dưỡng', ex: 'Wir pflegen kranke und alte Menschen.', exVi: 'Chúng tôi chăm sóc người ốm và người già.' },
  { de: 'die Hygiene', type: 'Nomen', category: 'pflege', vi: 'vệ sinh', ex: 'In der Pflege ist persönliche Hygiene sehr wichtig.', exVi: 'Trong ngành chăm sóc, vệ sinh cá nhân rất quan trọng.' },
  { de: 'das Desinfektionsmittel', type: 'Nomen', category: 'pflege', vi: 'nước sát khuẩn', ex: 'Benutzen Sie das Desinfektionsmittel an der Tür.', exVi: 'Hãy sử dụng nước sát khuẩn ở cạnh cửa.' }
];

const gastroVocab = [
  { de: 'die Reservierung', type: 'Nomen', category: 'gastro', vi: 'sự đặt bàn, đặt phòng trước', ex: 'Ich möchte eine Reservierung für vier Personen machen.', exVi: 'Tôi muốn đặt trước cho bốn người.' },
  { de: 'die Speisekarte', type: 'Nomen', category: 'gastro', vi: 'thực đơn, menu món ăn', ex: 'Bringen Sie mir bitte die Speisekarte.', exVi: 'Vui lòng mang cho tôi thực đơn.' },
  { de: 'empfehlen', type: 'Verb', category: 'gastro', vi: 'khuyến nghị, giới thiệu', ex: 'Was können Sie uns heute empfehlen?', exVi: 'Hôm nay bạn có thể giới thiệu món gì cho chúng tôi?' },
  { de: 'die Bestellung', type: 'Nomen', category: 'gastro', vi: 'đơn gọi món, sự đặt hàng', ex: 'Wir möchten unsere Bestellung aufgeben.', exVi: 'Chúng tôi muốn gọi món.' },
  { de: 'der Gast', type: 'Nomen', category: 'gastro', vi: 'khách hàng, thực khách', ex: 'Die Gäste sind sehr zufrieden mit dem Essen.', exVi: 'Các vị khách rất hài lòng với đồ ăn.' },
  { de: 'die Rechnung', type: 'Nomen', category: 'gastro', vi: 'hóa đơn thanh toán', ex: 'Zahlen, bitte! Bringen Sie uns die Rechnung.', exVi: 'Xin mời thanh toán! Hãy mang hóa đơn cho chúng tôi.' },
  { de: 'das Trinkgeld', type: 'Nomen', category: 'gastro', vi: 'tiền boa, tiền tip', ex: 'Das Trinkgeld ist im Preis nicht inbegriffen.', exVi: 'Tiền boa không bao gồm trong giá.' },
  { de: 'buchen', type: 'Verb', category: 'gastro', vi: 'đặt trước (phòng/chuyến đi)', ex: 'Ich habe ein Doppelzimmer für drei Nächte gebucht.', exVi: 'Tôi đã đặt một phòng đôi trong ba đêm.' },
  { de: 'die Buchung', type: 'Nomen', category: 'gastro', vi: 'việc đặt chỗ thành công', ex: 'Wir haben Ihre Buchung per E-Mail bestätigt.', exVi: 'Chúng tôi đã xác nhận việc đặt chỗ của bạn qua email.' },
  { de: 'das Doppelzimmer', type: 'Nomen', category: 'gastro', vi: 'phòng đôi (2 giường/giường đôi)', ex: 'Das Doppelzimmer kostet 90 Euro pro Nacht.', exVi: 'Phòng đôi có giá 90 Euro một đêm.' },
  { de: 'das Einzelzimmer', type: 'Nomen', category: 'gastro', vi: 'phòng đơn (1 giường)', ex: 'Ist noch ein Einzelzimmer frei?', exVi: 'Còn phòng đơn nào trống không?' },
  { de: 'die Stornierung', type: 'Nomen', category: 'gastro', vi: 'sự hủy đặt bàn/hủy phòng', ex: 'Eine Stornierung ist bis 24 Stunden vor Anreise kostenlos.', exVi: 'Hủy phòng miễn phí tối đa 24 giờ trước khi đến.' },
  { de: 'stornieren', type: 'Verb', category: 'gastro', vi: 'hủy bỏ (lịch hẹn/đặt phòng)', ex: 'Ich muss meine Reservierung leider stornieren.', exVi: 'Rất tiếc tôi phải hủy phòng đã đặt.' },
  { de: 'die Allergie', type: 'Nomen', category: 'gastro', vi: 'sự dị ứng', ex: 'Haben Sie Allergien gegen bestimmte Lebensmittel?', exVi: 'Bạn có bị dị ứng với loại thực phẩm cụ thể nào không?' },
  { de: 'die Zutaten', type: 'Nomen', category: 'gastro', vi: 'nguyên liệu, thành phần món ăn', ex: 'Die Zutaten für dieses Gericht sind frisch.', exVi: 'Các nguyên liệu cho món ăn này đều tươi ngon.' },
  { de: 'die Halbpension', type: 'Nomen', category: 'gastro', vi: 'chế độ ăn hai bữa (sáng + tối)', ex: 'Wir haben das Hotel mit Halbpension gebucht.', exVi: 'Chúng tôi đã đặt khách sạn kèm chế độ ăn hai bữa.' },
  { de: 'die Vollpension', type: 'Nomen', category: 'gastro', vi: 'chế độ ăn ba bữa trọn gói', ex: 'Vollpension beinhaltet Frühstück, Mittag- und Abendessen.', exVi: 'Ăn trọn gói bao gồm bữa sáng, trưa và tối.' },
  { de: 'der Koch', type: 'Nomen', category: 'gastro', vi: 'đầu bếp nam', ex: 'Der Koch bereitet die Spezialität des Hauses vor.', exVi: 'Đầu bếp đang chuẩn bị món đặc sản của nhà hàng.' },
  { de: 'die Köchin', type: 'Nomen', category: 'gastro', vi: 'đầu bếp nữ', ex: 'Die Köchin arbeitet in einer Fünf-Sterne-Küche.', exVi: 'Nữ đầu bếp làm việc trong một căn bếp năm sao.' },
  { de: 'die Küche', type: 'Nomen', category: 'gastro', vi: 'nhà bếp, phong cách ẩm thực', ex: 'Die deutsche Küche ist bekannt für Kartoffelgerichte.', exVi: 'Ẩm thực Đức nổi tiếng với các món khoai tây.' },
  { de: 'servieren', type: 'Verb', category: 'gastro', vi: 'phục vụ món ăn', ex: 'Der Kellner serviert die Getränke.', exVi: 'Người phục vụ mang đồ uống lên.' },
  { de: 'der Service', type: 'Nomen', category: 'gastro', vi: 'dịch vụ chăm sóc khách hàng', ex: 'Der Service in diesem Hotel ist ausgezeichnet.', exVi: 'Dịch vụ tại khách sạn này thật tuyệt vời.' }
];

const kfzVocab = [
  { de: 'die Wartung', type: 'Nomen', category: 'kfz', vi: 'sự bảo trì, bảo dưỡng định kỳ', ex: 'Regelmäßige Wartung verlängert die Lebensdauer des Autos.', exVi: 'Bảo dưỡng định kỳ giúp kéo dài tuổi thọ của xe ô tô.' },
  { de: 'reparieren', type: 'Verb', category: 'kfz', vi: 'sửa chữa đồ đạc/xe cộ', ex: 'Der Mechaniker repariert den Motor.', exVi: 'Thợ cơ khí đang sửa chữa động cơ.' },
  { de: 'das Ersatzteil', type: 'Nomen', category: 'kfz', vi: 'phụ tùng thay thế', ex: 'Wir müssen ein neues Ersatzteil bestellen.', exVi: 'Chúng ta phải đặt mua một phụ tùng thay thế mới.' },
  { de: 'der Fehlercode', type: 'Nomen', category: 'kfz', vi: 'mã lỗi hệ thống', ex: 'Das Diagnosegerät zeigt einen Fehlercode an.', exVi: 'Thiết bị chẩn đoán hiển thị một mã lỗi.' },
  { de: 'die Hebebühne', type: 'Nomen', category: 'kfz', vi: 'cầu nâng hạ xe ô tô', ex: 'Das Auto steht auf der Hebebühne.', exVi: 'Chiếc xe đang đỗ trên cầu nâng.' },
  { de: 'das Werkzeug', type: 'Nomen', category: 'kfz', vi: 'công cụ, dụng cụ làm việc', ex: 'Räumen Sie bitte das Werkzeug auf.', exVi: 'Vui lòng dọn dẹp các dụng cụ làm việc gọn gàng.' },
  { de: 'die Werkstatt', type: 'Nomen', category: 'kfz', vi: 'xưởng sửa chữa, garage', ex: 'Er arbeitet als Kfz-Mechatroniker in einer Werkstatt.', exVi: 'Anh ấy làm thợ cơ điện tử xe hơi trong một xưởng sửa chữa.' },
  { de: 'der Reifenwechsel', type: 'Nomen', category: 'kfz', vi: 'sự thay lốp xe', ex: 'Im Oktober steht der Reifenwechsel an.', exVi: 'Vào tháng Mười là thời điểm thay lốp xe.' },
  { de: 'die Bremse', type: 'Nomen', category: 'kfz', vi: 'phanh xe, thắng xe', ex: 'Die Bremsen müssen kontrolliert werden.', exVi: 'Hệ thống phanh xe cần phải được kiểm tra.' },
  { de: 'die Zündkerze', type: 'Nomen', category: 'kfz', vi: 'bugi đánh lửa', ex: 'Wir müssen die Zündkerzen austauschen.', exVi: 'Chúng ta phải thay các bugi đánh lửa.' },
  { de: 'der Motor', type: 'Nomen', category: 'kfz', vi: 'động cơ máy', ex: 'Der Motor läuft sehr ruhig.', exVi: 'Động cơ chạy rất êm ái.' },
  { de: 'das Getriebe', type: 'Nomen', category: 'kfz', vi: 'hộp số truyền động', ex: 'Das Getriebe verliert Öl.', exVi: 'Hộp số đang bị rò rỉ dầu.' },
  { de: 'das Öl wechseln', type: 'Phrase', category: 'kfz', vi: 'thay dầu động cơ', ex: 'Wir sollten das Öl nach 15.000 Kilometern wechseln.', exVi: 'Chúng ta nên thay dầu động cơ sau mỗi 15.000 km.' },
  { de: 'die Batterie', type: 'Nomen', category: 'kfz', vi: 'ắc quy, pin nguồn', ex: 'Die Batterie ist komplett leer.', exVi: 'Ắc quy xe đã hoàn toàn hết điện.' },
  { de: 'der Scheinwerfer', type: 'Nomen', category: 'kfz', vi: 'đèn pha phía trước xe', ex: 'Der linke Scheinwerfer funktioniert nicht.', exVi: 'Đèn pha phía bên trái không hoạt động.' },
  { de: 'das Rücklicht', type: 'Nomen', category: 'kfz', vi: 'đèn hậu phía sau xe', ex: 'Er tauscht die Glühbirne im Rücklicht aus.', exVi: 'Anh ấy thay bóng đèn ở cụm đèn hậu.' },
  { de: 'der Auspuff', type: 'Nomen', category: 'kfz', vi: 'ống xả khí thải, ống pô', ex: 'Aus dem Auspuff kommt schwarzer Rauch.', exVi: 'Khói đen bốc ra từ ống xả.' },
  { de: 'die Abgasuntersuchung', type: 'Nomen', category: 'kfz', vi: 'sự kiểm tra khí thải xe', ex: 'Das Auto hat die Abgasuntersuchung bestanden.', exVi: 'Chiếc xe đã vượt qua kỳ kiểm tra khí thải.' },
  { de: 'die Hauptuntersuchung', type: 'Nomen', category: 'kfz', vi: 'đăng kiểm kiểm định xe định kỳ (TÜV)', ex: 'Das Auto muss diesen Monat zur Hauptuntersuchung.', exVi: 'Chiếc xe phải đi kiểm định đăng kiểm trong tháng này.' },
  { de: 'der Meister', type: 'Nomen', category: 'kfz', vi: 'thợ cả, quản đốc xưởng có bằng cấp', ex: 'Der Meister bespricht den Reparaturauftrag.', exVi: 'Thợ cả thảo luận về đơn đặt hàng sửa chữa.' }
];

const allgemeinVocab = [
  { de: 'der Lebenslauf', type: 'Nomen', category: 'allgemein', vi: 'sơ yếu lý lịch, CV', ex: 'Der Lebenslauf muss lückenlos sein.', exVi: 'Sơ yếu lý lịch phải đầy đủ các mốc thời gian không đứt quãng.' },
  { de: 'das Zeugnis', type: 'Nomen', category: 'allgemein', vi: 'bằng cấp, học bạ, giấy chứng nhận', ex: 'Bringen Sie bitte Ihr B1-Zeugnis mit.', exVi: 'Vui lòng mang theo bằng chứng nhận tiếng B1.' },
  { de: 'das Vorstellungsgespräch', type: 'Nomen', category: 'allgemein', vi: 'buổi phỏng vấn xin việc', ex: 'Ich habe morgen ein Vorstellungsgespräch in Berlin.', exVi: 'Ngày mai tôi có một buổi phỏng vấn xin việc ở Berlin.' },
  { de: 'die Ausbildung', type: 'Nomen', category: 'allgemein', vi: 'chương trình học nghề song hành', ex: 'Die Ausbildung dauert drei Jahre.', exVi: 'Chương trình học nghề kéo dài ba năm.' },
  { de: 'der Auszubildende', type: 'Nomen', category: 'allgemein', vi: 'học viên học nghề', ex: 'Der neue Auszubildende stellt sich vor.', exVi: 'Học viên học nghề mới đang tự giới thiệu bản thân.' },
  { de: 'die Berufsschule', type: 'Nomen', category: 'allgemein', vi: 'trường nghề lý thuyết', ex: 'Zweimal pro Woche gehe ich in die Berufsschule.', exVi: 'Tôi đến trường trung cấp nghề hai lần mỗi tuần.' },
  { de: 'der Betrieb', type: 'Nomen', category: 'allgemein', vi: 'doanh nghiệp, cơ sở thực hành', ex: 'Die praktische Ausbildung findet im Betrieb statt.', exVi: 'Đào tạo thực hành diễn ra tại doanh nghiệp.' },
  { de: 'die Probezeit', type: 'Nomen', category: 'allgemein', vi: 'thời gian thử việc', ex: 'Die Probezeit beträgt in der Regel sechs Monate.', exVi: 'Thời gian thử việc thông thường là sáu tháng.' },
  { de: 'die Überweisung', type: 'Nomen', category: 'allgemein', vi: 'sự chuyển khoản tiền', ex: 'Die Überweisung des Gehalts erfolgt pünktlich.', exVi: 'Chuyển khoản lương được thực hiện đúng hẹn.' },
  { de: 'das Konto', type: 'Nomen', category: 'allgemein', vi: 'tài khoản ngân hàng', ex: 'Ich möchte ein Girokonto eröffnen.', exVi: 'Tôi muốn mở một tài khoản thanh toán.' },
  { de: 'abheben', type: 'Verb', category: 'allgemein', vi: 'rút (tiền từ tài khoản)', ex: 'Er hebt 50 Euro am Geldautomaten ab.', exVi: 'Anh ấy rút 50 Euro tại cây rút tiền tự động.' },
  { de: 'überweisen', type: 'Verb', category: 'allgemein', vi: 'chuyển khoản', ex: 'Können Sie mir das Geld überweisen?', exVi: 'Bạn có thể chuyển khoản tiền đó cho tôi không?' },
  { de: 'Büro', type: 'Nomen', category: 'allgemein', vi: 'văn phòng làm việc', ex: 'Sein Büro liegt im dritten Stock.', exVi: 'Văn phòng của anh ấy nằm ở tầng ba.' },
  { de: 'die Frist', type: 'Nomen', category: 'allgemein', vi: 'hạn chót, thời hạn nộp', ex: 'Die Frist für die Bewerbung läuft morgen ab.', exVi: 'Hạn chót nộp hồ sơ xin việc sẽ kết thúc vào ngày mai.' },
  { de: 'fristgerecht', type: 'Adjektiv', category: 'allgemein', vi: 'đúng thời hạn', ex: 'Die Dokumente wurden fristgerecht eingereicht.', exVi: 'Các tài liệu đã được nộp đúng thời hạn.' },
  { de: 'der Stau', type: 'Nomen', category: 'allgemein', vi: 'sự kẹt xe, tắc nghẽn giao thông', ex: 'Wir standen eine Stunde im Stau.', exVi: 'Chúng tôi đã bị chôn chân một tiếng trong kẹt xe.' },
  { de: 'die Fahrkarte', type: 'Nomen', category: 'allgemein', vi: 'vé tàu xe', ex: 'Zeigen Sie dem Kontrolleur Ihre Fahrkarte.', exVi: 'Hãy xuất trình vé xe của bạn cho người soát vé.' },
  { de: 'der Bahnhof', type: 'Nomen', category: 'allgemein', vi: 'nhà ga tàu hỏa', ex: 'Wir treffen uns vor dem Bahnhof.', exVi: 'Chúng ta gặp nhau ở trước nhà ga.' },
  { de: 'die Abfahrt', type: 'Nomen', category: 'allgemein', vi: 'giờ khởi hành, xuất phát', ex: 'Die Abfahrt des Zuges verzögert sich.', exVi: 'Giờ khởi hành của tàu hỏa bị trì hoãn.' },
  { de: 'die Ankunft', type: 'Nomen', category: 'allgemein', vi: 'giờ đến nơi', ex: 'Die planmäßige Ankunft ist um 14 Uhr.', exVi: 'Giờ đến nơi theo lịch trình là 14 giờ.' }
];

const medizinVocab = [
  { de: 'das Symptom', type: 'Nomen', category: 'medizin', vi: 'triệu chứng lâm sàng', ex: 'Husten und Fieber sind typische Symptome einer Grippe.', exVi: 'Ho và sốt là những triệu chứng điển hình của bệnh cúm.' },
  { de: 'die Diagnose', type: 'Nomen', category: 'medizin', vi: 'chẩn đoán y tế', ex: 'Der Arzt stellt nach der Untersuchung die Diagnose.', exVi: 'Bác sĩ đưa ra chẩn đoán sau khi tiến hành khám.' },
  { de: 'die Therapie', type: 'Nomen', category: 'medizin', vi: 'liệu trình điều trị, liệu pháp', ex: 'Die Therapie dauert mehrere Wochen.', exVi: 'Liệu trình điều trị kéo dài nhiều tuần.' },
  { de: 'das Rezept', type: 'Nomen', category: 'medizin', vi: 'đơn thuốc do bác sĩ kê', ex: 'Der Arzt schreibt ein Rezept für die Schmerzmittel.', exVi: 'Bác sĩ kê một đơn thuốc cho thuốc giảm đau.' },
  { de: 'verschreiben', type: 'Verb', category: 'medizin', vi: 'kê đơn thuốc', ex: 'Welche Medikamente hat der Arzt Ihnen verschrieben?', exVi: 'Bác sĩ đã kê những loại thuốc nào cho ông/bà?' },
  { de: 'die Überweisung', type: 'Nomen', category: 'medizin', vi: 'giấy chuyển viện/khám chuyên khoa', ex: 'Ich brauche eine Überweisung zum Kardiologen.', exVi: 'Tôi cần một giấy chuyển viện đến khám bác sĩ tim mạch.' },
  { de: 'der Befund', type: 'Nomen', category: 'medizin', vi: 'kết quả xét nghiệm/kết luận y tế', ex: 'Der Laborbefund ist in zwei Tagen fertig.', exVi: 'Kết quả xét nghiệm phòng lab sẽ có sau hai ngày.' },
  { de: 'chronisch', type: 'Adjektiv', category: 'medizin', vi: 'mãn tính, kéo dài dai dẳng', ex: 'Diabetes ist eine chronische Erkrankung.', exVi: 'Tiểu đường là một căn bệnh mãn tính.' },
  { de: 'akut', type: 'Adjektiv', category: 'medizin', vi: 'cấp tính, nguy kịch đột ngột', ex: 'Der Patient leidet unter akuten Schmerzen.', exVi: 'Bệnh nhân đang chịu đựng những cơn đau cấp tính.' },
  { de: 'die Krankmeldung', type: 'Nomen', category: 'medizin', vi: 'giấy xin nghỉ ốm, chứng nhận nghỉ bệnh', ex: 'Ich muss meine Krankmeldung beim Arbeitgeber einreichen.', exVi: 'Tôi phải nộp giấy chứng nhận nghỉ ốm cho bên sử dụng lao động.' }
];

const wohnenVocab = [
  { de: 'der Mietvertrag', type: 'Nomen', category: 'wohnen', vi: 'hợp đồng thuê nhà', ex: 'Bitte lesen Sie den Mietvertrag vor der Unterschrift genau durch.', exVi: 'Vui lòng đọc kỹ hợp đồng thuê nhà trước khi ký tên.' },
  { de: 'die Warmmiete', type: 'Nomen', category: 'wohnen', vi: 'tiền thuê nhà đã gồm phí sưởi/nước', ex: 'Die Warmmiete für diese Wohnung beträgt 800 Euro.', exVi: 'Tiền thuê nhà trọn gói cho căn hộ này là 800 Euro.' },
  { de: 'die Kaltmiete', type: 'Nomen', category: 'wohnen', vi: 'tiền thuê nhà thô chưa gồm phí dịch vụ', ex: 'Die Kaltmiete ist ohne Heizung und Nebenkosten.', exVi: 'Tiền thuê thô chưa bao gồm chi phí sưởi và phí dịch vụ.' },
  { de: 'die Kaution', type: 'Nomen', category: 'wohnen', vi: 'tiền đặt cọc thuê nhà (thường 2-3 tháng)', ex: 'Die Kaution beträgt zwei Kaltmieten.', exVi: 'Tiền đặt cọc bằng giá trị của hai tháng thuê nhà thô.' },
  { de: 'der Vermieter', type: 'Nomen', category: 'wohnen', vi: 'chủ nhà cho thuê nam', ex: 'Der Vermieter wohnt im selben Haus.', exVi: 'Chủ nhà cho thuê sống trong cùng một tòa nhà.' },
  { de: 'die Nebenkosten', type: 'Nomen', category: 'wohnen', vi: 'chi phí dịch vụ phụ trợ (rác, nước, thang máy)', ex: 'Die Nebenkosten werden einmal im Jahr abgerechnet.', exVi: 'Chi phí dịch vụ được quyết toán mỗi năm một lần.' },
  { de: 'die Wohngemeinschaft (WG)', type: 'Nomen', category: 'wohnen', vi: 'hình thức ở chung căn hộ chia sẻ phòng', ex: 'Ich wohne in einer Dreier-WG.', exVi: 'Tôi đang sống trong một căn hộ chung chia sẻ cho 3 người.' },
  { de: 'kündigen', type: 'Verb', category: 'wohnen', vi: 'hủy hợp đồng, chấm dứt thuê', ex: 'Ich möchte meinen Mietvertrag zum Jahresende kündigen.', exVi: 'Tôi muốn chấm dứt hợp đồng thuê nhà vào cuối năm.' },
  { de: 'die Kündigungsfrist', type: 'Nomen', category: 'wohnen', vi: 'thời hạn báo trước khi hủy hợp đồng', ex: 'Die Kündigungsfrist beträgt drei Monate.', exVi: 'Thời hạn báo trước khi chấm dứt hợp đồng là ba tháng.' },
  { de: 'die Hausordnung', type: 'Nomen', category: 'wohnen', vi: 'nội quy tòa nhà, quy tắc chung của khu chung cư', ex: 'Laut Hausordnung darf ab 22 Uhr keine laute Musik gespielt werden.', exVi: 'Theo nội quy tòa nhà, không được bật nhạc to sau 22 giờ tối.' }
];

const umweltVocab = [
  { de: 'der Klimawandel', type: 'Nomen', category: 'umwelt', vi: 'sự biến đổi khí hậu toàn cầu', ex: 'Der Klimawandel betrifft alle Länder weltweit.', exVi: 'Biến đổi khí hậu gây ảnh hưởng tới toàn bộ quốc gia trên thế giới.' },
  { de: 'die erneuerbare Energie', type: 'Nomen', category: 'umwelt', vi: 'năng lượng tái tạo', ex: 'Deutschland setzt stark auf erneuerbare Energien.', exVi: 'Đức đang tập trung mạnh mẽ vào các nguồn năng lượng tái tạo.' },
  { de: 'der Umweltschutz', type: 'Nomen', category: 'umwelt', vi: 'sự bảo vệ môi trường', ex: 'Jeder Bürger sollte einen Beitrag zum Umweltschutz leisten.', exVi: 'Mỗi người dân nên đóng góp một phần vào việc bảo vệ môi trường.' },
  { de: 'die Mülltrennung', type: 'Nomen', category: 'umwelt', vi: 'sự phân loại rác thải tại nguồn', ex: 'Die Mülltrennung ist in Deutschland gesetzlich geregelt.', exVi: 'Việc phân loại rác được quy định rõ bằng pháp luật ở Đức.' },
  { de: 'recyceln', type: 'Verb', category: 'umwelt', vi: 'tái chế rác thải/nguyên liệu', ex: 'Altglas kann man vollständig recyceln.', exVi: 'Thủy tinh cũ có thể được tái chế hoàn toàn.' },
  { de: 'die CO2-Emissionen', type: 'Nomen', category: 'umwelt', vi: 'lượng khí thải carbon dioxide', ex: 'Wir müssen die CO2-Emissionen drastisch senken.', exVi: 'Chúng ta phải cắt giảm đáng kể lượng khí thải CO2.' },
  { de: 'die Nachhaltigkeit', type: 'Nomen', category: 'umwelt', vi: 'sự phát triển bền vững', ex: 'Nachhaltigkeit wird in der Wirtschaft immer wichtiger.', exVi: 'Tính bền vững đang ngày càng trở nên quan trọng trong nền kinh tế.' },
  { de: 'umweltfreundlich', type: 'Adjektiv', category: 'umwelt', vi: 'thân thiện với môi trường', ex: 'Fahrradfahren ist eine umweltfreundliche Alternative.', exVi: 'Đi xe đạp là một giải pháp thay thế thân thiện với môi trường.' },
  { de: 'die globale Erwärmung', type: 'Nomen', category: 'umwelt', vi: 'hiện tượng nóng lên toàn cầu', ex: 'Die globale Erwärmung lässt die Gletscher schmelzen.', exVi: 'Hiện tượng nóng lên toàn cầu làm cho các sông băng tan chảy.' },
  { de: 'die Energie sparen', type: 'Phrase', category: 'umwelt', vi: 'tiết kiệm năng lượng điện sưởi', ex: 'Durch moderne Lampen kann man viel Energie sparen.', exVi: 'Nhờ các bóng đèn hiện đại ta có thể tiết kiệm rất nhiều năng lượng.' }
];

export const VOCAB_LIST = [
  ...pflegeVocab,
  ...gastroVocab,
  ...kfzVocab,
  ...allgemeinVocab,
  ...medizinVocab,
  ...wohnenVocab,
  ...umweltVocab
];
