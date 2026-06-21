export const REDEMITTEL_GROUPS = [
  { title:'Mở bài & nêu quan điểm', items:[['In der aktuellen Diskussion über … wird häufig die Frage gestellt, ob …','Trong tranh luận hiện nay về… thường đặt ra câu hỏi liệu…'],['Meines Erachtens lässt sich diese Frage nicht eindeutig beantworten.','Theo tôi, câu hỏi này không thể trả lời một chiều.'],['Im Folgenden möchte ich die wichtigsten Aspekte näher beleuchten.','Sau đây tôi muốn làm rõ các khía cạnh quan trọng.']]},
  { title:'Lập luận & ví dụ', items:[['Ein wesentlicher Vorteil besteht darin, dass …','Một ưu điểm quan trọng nằm ở việc…'],['Dafür spricht insbesondere, dass …','Điều đặc biệt ủng hộ quan điểm này là…'],['Dies lässt sich am Beispiel von … verdeutlichen.','Có thể làm rõ điều này qua ví dụ…']]},
  { title:'Nhượng bộ & phản biện', items:[['Zwar ist einzuräumen, dass …, dennoch …','Đúng là phải thừa nhận rằng…, tuy nhiên…'],['Dem lässt sich entgegenhalten, dass …','Có thể phản biện lại rằng…'],['Einerseits …, andererseits darf nicht übersehen werden, dass …','Một mặt…, mặt khác không nên bỏ qua rằng…']]},
  { title:'Tương tác nói', items:[['Da stimme ich Ihnen nur teilweise zu.','Tôi chỉ đồng ý một phần.'],['Könnten Sie diesen Punkt genauer erläutern?','Bạn có thể giải thích rõ hơn điểm này không?'],['Wenn ich Sie richtig verstanden habe, meinen Sie, dass …','Nếu tôi hiểu đúng, ý bạn là…']]},
  { title:'Kết luận', items:[['Zusammenfassend lässt sich festhalten, dass …','Tóm lại có thể khẳng định rằng…'],['Unter diesen Voraussetzungen halte ich … für sinnvoll.','Trong những điều kiện đó, tôi cho rằng… hợp lý.']]}
];

export const PARAPHRASE_EXERCISES = [
  {id:'P1',prompt:'Viele Beschäftigte wünschen sich flexible Arbeitszeiten.',options:['Flexible Arbeitsmodelle stoßen bei vielen Arbeitnehmern auf Interesse.','Niemand möchte seine Arbeitszeit verändern.','Flexible Arbeit ist gesetzlich verboten.'],correct:0,tip:'wünschen sich → auf Interesse stoßen'},
  {id:'P2',prompt:'Die Maßnahme führte zu einer deutlichen Senkung des Energieverbrauchs.',options:['Der Energieverbrauch blieb unverändert.','Durch die Maßnahme wurde wesentlich weniger Energie verbraucht.','Die Maßnahme erhöhte die Energiekosten.'],correct:1,tip:'Senkung → wesentlich weniger'},
  {id:'P3',prompt:'Kritiker bezweifeln, dass das Konzept langfristig finanzierbar ist.',options:['Kritiker halten die dauerhafte Finanzierung für unsicher.','Kritiker finanzieren das Konzept.','Das Konzept wurde bereits beendet.'],correct:0,tip:'bezweifeln → für unsicher halten'},
  {id:'P4',prompt:'Aufgrund des Personalmangels müssen Termine verschoben werden.',options:['Obwohl genug Personal da ist, fallen Termine aus.','Der Mangel an Mitarbeitenden hat Terminverschiebungen zur Folge.','Die Termine finden früher statt.'],correct:1,tip:'aufgrund → hat … zur Folge'},
  {id:'P5',prompt:'Die Vorteile überwiegen die möglichen Nachteile.',options:['Die Nachteile sind völlig unbekannt.','Insgesamt fallen die positiven Aspekte stärker ins Gewicht.','Vor- und Nachteile sind identisch.'],correct:1,tip:'überwiegen → stärker ins Gewicht fallen'}
];

export const COLLOCATION_EXERCISES = [
  {id:'C1',prompt:'eine Entscheidung ___',options:['treffen','machen','setzen'],correct:0,answer:'eine Entscheidung treffen'},
  {id:'C2',prompt:'Kritik an etwas ___',options:['üben','spielen','bauen'],correct:0,answer:'Kritik üben'},
  {id:'C3',prompt:'Maßnahmen ___',options:['ergreifen','fangen','tragen'],correct:0,answer:'Maßnahmen ergreifen'},
  {id:'C4',prompt:'zur Verfügung ___',options:['stehen','liegen','sitzen'],correct:0,answer:'zur Verfügung stehen'},
  {id:'C5',prompt:'einen Beitrag ___',options:['leisten','geben','stellen'],correct:0,answer:'einen Beitrag leisten'},
  {id:'C6',prompt:'Verantwortung ___',options:['übernehmen','nehmen an','bringen'],correct:0,answer:'Verantwortung übernehmen'},
  {id:'C7',prompt:'in Betracht ___',options:['ziehen','drücken','heben'],correct:0,answer:'in Betracht ziehen'},
  {id:'C8',prompt:'Auswirkungen auf etwas ___',options:['haben','machen','stellen'],correct:0,answer:'Auswirkungen haben'}
];

export const PRODUCTION_EXERCISES = [
  {id:'W1',skill:'Schreiben',prompt:'Viết 3–4 câu phản biện quan điểm: „Homeoffice steigert immer die Produktivität.“ Dùng zwar … dennoch và một ví dụ.',model:'Zwar kann man sich im Homeoffice häufig besser konzentrieren, dennoch steigt die Produktivität nicht automatisch. Eltern werden zu Hause beispielsweise oft durch Betreuungspflichten unterbrochen. Entscheidend sind daher geeignete Arbeitsbedingungen.'},
  {id:'W2',skill:'Paraphrase',prompt:'Viết lại không đổi nghĩa: „Weil immer mehr Menschen online einkaufen, geraten kleine Geschäfte unter Druck.“',model:'Der zunehmende Onlinehandel hat zur Folge, dass kleine Geschäfte immer stärker unter Druck geraten.'},
  {id:'W3',skill:'Nominalisierung',prompt:'Chuyển sang Nominalstil: „Wenn Unternehmen ihre Mitarbeitenden regelmäßig weiterbilden, verbessert sich die Qualität.“',model:'Durch die regelmäßige Weiterbildung der Mitarbeitenden lässt sich eine Verbesserung der Qualität erreichen.'},
  {id:'W4',skill:'Sprechen',prompt:'Chuẩn bị câu trả lời 45 giây: Sollten öffentliche Verkehrsmittel kostenlos sein? Nêu quan điểm, lý do, phản biện.',model:'Meines Erachtens sollten öffentliche Verkehrsmittel zumindest deutlich günstiger werden. Dafür spricht, dass weniger Menschen das Auto nutzen würden. Zwar entstehen dem Staat hohe Kosten, dennoch profitieren Umwelt und Gesellschaft langfristig.'}
];