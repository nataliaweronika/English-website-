/* WordBloom Skills Studio – activity content.
   Three school bands: k13 (Klasa 1–3, Pre-A1/A1), k46 (Klasa 4–6, A1–A2), k78 (Klasa 7–8, A2–B1, E8).
   Each skill has 5 activities of different types. The FIRST activity in every skill is a free sample.
   To add an activity: copy one block of the same "type" and change the text. */
window.WB_SKILLS = {
bands: {
  k13: { name: 'Klasa 1–3', en: 'Little Learners', level: 'Pre-A1 · A1', emoji: '🐣' },
  k46: { name: 'Klasa 4–6', en: 'Explorers', level: 'A1 · A2', emoji: '🧭' },
  k78: { name: 'Klasa 7–8', en: 'Achievers · E8', level: 'A2 · B1', emoji: '🚀' }
},
skills: {
  reading:   { en: 'Reading',   pl: 'Czytanie',  emoji: '📖', color: '#2f9e6e', soft: '#e3f6ec', tip: 'Read slowly. Tap any underlined word to see it in Polish.', tipPl: 'Czytaj powoli. Dotknij podkreślonego słowa, aby zobaczyć tłumaczenie.' },
  listening: { en: 'Listening', pl: 'Słuchanie', emoji: '🎧', color: '#3577e0', soft: '#e3eefc', tip: 'Listen twice. Use the 🐢 button to slow it down.', tipPl: 'Posłuchaj dwa razy. Przycisk 🐢 zwalnia nagranie.' },
  speaking:  { en: 'Speaking',  pl: 'Mówienie',  emoji: '🗣️', color: '#e5625b', soft: '#fde8e6', tip: 'Speak loudly and clearly. Mistakes are fine – they help you learn!', tipPl: 'Mów głośno i wyraźnie. Błędy są w porządku – pomagają się uczyć!' },
  writing:   { en: 'Writing',   pl: 'Pisanie',   emoji: '✍️', color: '#d98a1c', soft: '#fdf1dc', tip: 'Start with a capital letter. End with a full stop.', tipPl: 'Zacznij wielką literą. Zakończ kropką.' }
},
types: {
  story: ['Read & answer', 'Przeczytaj i odpowiedz'],
  tf: ['True or false?', 'Prawda czy fałsz?'],
  order: ['Put in order', 'Ułóż po kolei'],
  match: ['Match it', 'Połącz w pary'],
  gap: ['Fill the gaps', 'Uzupełnij luki'],
  pick: ['Listen & pick', 'Posłuchaj i wybierz'],
  lmcq: ['Listen & answer', 'Posłuchaj i odpowiedz'],
  dict: ['Dictation', 'Dyktando'],
  lorder: ['Listen & order', 'Posłuchaj i ułóż'],
  ltf: ['Listen: true or false?', 'Posłuchaj: prawda czy fałsz?'],
  repeat: ['Repeat after me', 'Powtórz za mną'],
  picture: ['Talk about the picture', 'Opowiedz o obrazku'],
  challenge: ['Speaking challenge', 'Wyzwanie mówione'],
  roleplay: ['Role-play', 'Scenka'],
  minimal: ['Sound twins', 'Podobne dźwięki'],
  unscramble: ['Build the sentence', 'Ułóż zdanie'],
  spell: ['Spell it', 'Przeliteruj'],
  wgap: ['Write the missing word', 'Wpisz brakujące słowo'],
  fix: ['Fix the mistake', 'Popraw błąd'],
  guided: ['Write your own text', 'Napisz własny tekst']
},
activities: {
/* ============================== KLASA 1–3 ============================== */
k13: {
reading: [
 { id:'r13-1', type:'story', title:'Tom and his cat', pl:'Tom i jego kot',
   text:['This is Tom. He is seven. Tom has got a small black cat. Her name is Luna.','Luna likes milk and fish. She sleeps on Tom\'s bed. In the morning, Luna plays with a red ball.','Tom loves Luna. Luna loves Tom!'],
   gloss:{small:'mały',black:'czarny',cat:'kot',likes:'lubi',milk:'mleko',fish:'ryba',sleeps:'śpi',bed:'łóżko',morning:'rano',plays:'bawi się',ball:'piłka',loves:'kocha'},
   q:[['How old is Tom?',['six','seven','eight'],1],['What colour is Luna?',['white','black','red'],1],['Where does Luna sleep?',['on Tom\'s bed','in the garden','on a chair'],0],['What does Luna play with?',['a red ball','a blue car','a doll'],0]] },
 { id:'r13-2', type:'match', title:'Animals', pl:'Zwierzęta', pairs:[['🐶','dog'],['🐱','cat'],['🐟','fish'],['🐦','bird'],['🐰','rabbit'],['🐴','horse']] },
 { id:'r13-3', type:'tf', title:'My school bag', pl:'Mój plecak',
   text:'My school bag is blue. In my bag there is a pencil case, two books and an apple. My pencil case is green. I have got four pencils and a rubber.',
   items:[['The school bag is blue.',true],['There is a banana in the bag.',false],['There are two books.',true],['The pencil case is red.',false],['There are four pencils.',true]] },
 { id:'r13-4', type:'order', title:'My morning', pl:'Mój poranek', intro:'Put Ola\'s morning in order. / Ułóż poranek Oli po kolei.',
   items:['🛏️ Ola wakes up at seven.','🚿 She washes her face.','🥣 She eats breakfast.','🎒 She takes her school bag.','🚌 She goes to school by bus.'] },
 { id:'r13-5', type:'gap', title:'At the park', pl:'W parku',
   text:'It is a [sunny] day. Kasia is in the [park] with her dog. The dog is [running] on the grass. Kasia has got an [ice cream]. It is very [cold]!',
   extra:['rainy','swimming'] }
],
listening: [
 { id:'l13-1', type:'pick', title:'Colours and fruit', pl:'Kolory i owoce',
   items:[{say:'a red apple',a:'🍎',opts:['🍎','🍌','🍇','🍊']},{say:'a yellow banana',a:'🍌',opts:['🍐','🍌','🍓','🍎']},{say:'purple grapes',a:'🍇',opts:['🍒','🍋','🍇','🥝']},{say:'an orange',a:'🍊',opts:['🍊','🍉','🍍','🍎']},{say:'a green pear',a:'🍐',opts:['🍓','🍐','🍌','🍇']},{say:'a pink strawberry',a:'🍓',opts:['🍋','🍒','🍓','🍐']}] },
 { id:'l13-2', type:'pick', title:'Toys', pl:'Zabawki',
   items:[{say:'a teddy bear',a:'🧸',opts:['🧸','🚗','⚽','🪁']},{say:'a ball',a:'⚽',opts:['🎲','⚽','🧩','🧸']},{say:'a car',a:'🚗',opts:['✈️','🚂','🚗','🚲']},{say:'a kite',a:'🪁',opts:['🪁','🎈','🧸','🪀']},{say:'a train',a:'🚂',opts:['🚌','🚂','🚗','🚀']},{say:'a puzzle',a:'🧩',opts:['🎲','🧩','🖍️','📚']}] },
 { id:'l13-3', type:'lmcq', title:'At the zoo', pl:'W zoo',
   script:[['Mum','Look, Adam! What can you see?'],['Adam','I can see a big elephant!'],['Mum','What colour is it?'],['Adam','It\'s grey. And look, two monkeys!'],['Mum','Are they eating?'],['Adam','Yes! They are eating bananas.']],
   q:[['What can Adam see first?',['a lion','an elephant','a giraffe'],1],['What colour is the elephant?',['grey','brown','white'],0],['How many monkeys are there?',['one','two','three'],1],['What are the monkeys eating?',['apples','bananas','bread'],1]] },
 { id:'l13-4', type:'lorder', title:'Pip the dog', pl:'Piesek Pip',
   script:'Pip wakes up. Then he eats his breakfast. After that he plays in the garden. Then he has a bath. At night, Pip sleeps in his basket.',
   items:['😴➡️☀️ Pip wakes up','🍖 He eats breakfast','🌳 He plays in the garden','🛁 He has a bath','🧺 He sleeps in his basket'] },
 { id:'l13-5', type:'dict', title:'Write what you hear', pl:'Napisz, co słyszysz', items:['I like cats.','The sun is hot.','My dog is big.','I can swim.'] }
],
speaking: [
 { id:'s13-1', type:'repeat', title:'Hello!', pl:'Cześć!', items:['Hello! My name is Ola.','I am seven.','I like pizza.','Goodbye! See you soon!'] },
 { id:'s13-2', type:'minimal', title:'Sound twins', pl:'Bliźniacze dźwięki', items:[['ship','sheep','🚢','🐑'],['three','tree','3️⃣','🌳'],['hat','hot','🎩','🔥'],['bag','back','🎒','🔙']] },
 { id:'s13-3', type:'picture', title:'My bedroom', pl:'Mój pokój', scene:'🛏️ 🧸 🪟 📚 💡 🐱',
   prompts:['What can you see?','What colour is your bed?','Is there a cat?','What is your favourite toy?'], frames:['I can see a…','There is a…','My favourite toy is…','It is…'], seconds:45 },
 { id:'s13-4', type:'roleplay', title:'At the shop', pl:'W sklepie', you:'B',
   lines:[['A','Hello! Can I help you?'],['B','Hello! An ice cream, please.'],['A','Which flavour?'],['B','Chocolate, please.'],['A','Here you are.'],['B','Thank you! Goodbye!']] },
 { id:'s13-5', type:'challenge', title:'All about me', pl:'Wszystko o mnie', seconds:30,
   qs:['What is your name?','How old are you?','What is your favourite colour?','Have you got a pet?','What do you like to eat?'], frames:['My name is…','I am … years old.','My favourite colour is…','I have got a… / I haven\'t got a pet.','I like…'] }
],
writing: [
 { id:'w13-1', type:'spell', title:'Spell the animal', pl:'Przeliteruj zwierzę', items:[['🐱','cat'],['🐶','dog'],['🐟','fish'],['🐸','frog'],['🦁','lion'],['🐮','cow']] },
 { id:'w13-2', type:'unscramble', title:'Build the sentence', pl:'Ułóż zdanie', items:['I have got a dog.','My bag is red.','She likes apples.','We play football.','It is a sunny day.'] },
 { id:'w13-3', type:'wgap', title:'Numbers and colours', pl:'Liczby i kolory',
   items:[['🌞 The sun is ___.','yellow'],['🐸 The frog is ___.','green'],['✋ I have got ___ fingers on one hand.','five'],['🍅 The tomato is ___.','red'],['🦵 A spider has got ___ legs.','eight']] },
 { id:'w13-4', type:'fix', title:'Capital letters', pl:'Wielkie litery',
   items:[['my name is anna.','My name is Anna.','Names start with a capital letter.'],['i like cats.','I like cats.','"I" is always a capital letter.'],['tom lives in warsaw.','Tom lives in Warsaw.','Cities start with a capital letter.'],['it is monday','It is Monday.','Days start with a capital letter. Don\'t forget the full stop!']] },
 { id:'w13-5', type:'guided', title:'My pet', pl:'Moje zwierzątko', min:15,
   prompt:'Write about a pet (real or dream pet). What is it? What is its name? What colour is it? What does it like?', promptPl:'Napisz o zwierzątku (prawdziwym lub wymarzonym). Co to jest? Jak się nazywa? Jakiego jest koloru? Co lubi?',
   frames:['I have got a…','Its name is…','It is … and …','It likes…','I love my…'], words:['name','like'],
   model:'I have got a rabbit. Its name is Bunny. It is white and small. It likes carrots. I love my rabbit!' }
]
},
/* ============================== KLASA 4–6 ============================== */
k46: {
reading: [
 { id:'r46-1', type:'story', title:'A weekend in the mountains', pl:'Weekend w górach',
   text:['Last weekend, Maja and her family went to Zakopane. They travelled by train and it took five hours.','On Saturday, they climbed a mountain called Gubałówka. The weather was windy but sunny. At the top, Maja ate a hot oscypek with cranberry sauce.','On Sunday, it rained all day, so they visited a museum and played board games in the hotel. Maja was tired but very happy.'],
   gloss:{weekend:'weekend',travelled:'podróżowali',took:'zajęło',climbed:'wspięli się',weather:'pogoda',windy:'wietrzny',top:'szczyt',cranberry:'żurawina',rained:'padało',museum:'muzeum','board games':'gry planszowe',tired:'zmęczona'},
   q:[['How did they travel?',['by car','by train','by plane'],1],['How was the weather on Saturday?',['rainy and cold','windy but sunny','snowy'],1],['What did Maja eat at the top?',['pizza','oscypek','ice cream'],1],['Why did they visit a museum?',['It was raining.','It was free.','Maja was hungry.'],0]] },
 { id:'r46-2', type:'tf', title:'An email from Leo', pl:'E-mail od Leo',
   text:'Hi Kuba! I\'m in London with my parents. Yesterday we went on the London Eye – it was amazing, but I was a bit scared! Today we are going to the Science Museum. The food here is OK, but I miss my grandma\'s pierogi. See you next Friday! Leo',
   items:[['Leo is in London with his friends.',false],['He went on the London Eye yesterday.',true],['He wasn\'t scared at all.',false],['Today he is visiting the Science Museum.',true],['Leo will be back next Friday.',true]] },
 { id:'r46-3', type:'match', title:'Jobs', pl:'Zawody', pairs:[['👩‍⚕️ She helps sick people.','doctor'],['👨‍🍳 He cooks in a restaurant.','chef'],['👩‍🏫 She works at a school.','teacher'],['👨‍🚒 He puts out fires.','firefighter'],['👩‍🌾 She grows vegetables.','farmer'],['👨‍✈️ He flies planes.','pilot']] },
 { id:'r46-4', type:'order', title:'How to make a sandwich', pl:'Jak zrobić kanapkę', intro:'Put the instructions in order. / Ułóż instrukcję po kolei.',
   items:['First, take two slices of bread.','Next, put butter on the bread.','Then, add cheese and ham.','After that, put some tomato on top.','Finally, close the sandwich and enjoy it!'] },
 { id:'r46-5', type:'gap', title:'Healthy habits', pl:'Zdrowe nawyki',
   text:'To stay healthy, you [should] eat fruit and vegetables every day. Drink a lot of [water] and don\'t eat too many [sweets]. It\'s important to [sleep] for about ten hours. Do some [exercise], for example ride a bike or play football.',
   extra:['shouldn\'t','juice','watch'] }
],
listening: [
 { id:'l46-1', type:'lmcq', title:'Planning a birthday party', pl:'Planowanie urodzin',
   script:[['Zosia','Mum, can I have a party for my birthday?'],['Mum','Of course. How many friends do you want to invite?'],['Zosia','Eight. Can we have it at the bowling centre?'],['Mum','It\'s a bit expensive. What about the garden? We can have a barbecue.'],['Zosia','Great idea! And can we have a chocolate cake?'],['Mum','Yes, I\'ll make it on Friday. The party is on Saturday at three.']],
   q:[['How many friends will Zosia invite?',['six','eight','ten'],1],['Where will the party be?',['at the bowling centre','in the garden','at school'],1],['What cake will they have?',['chocolate','strawberry','cheesecake'],0],['When is the party?',['Friday at three','Saturday at three','Saturday at five'],1]] },
 { id:'l46-2', type:'ltf', title:'The weather forecast', pl:'Prognoza pogody',
   script:'Good morning! Here is the weather for tomorrow. In the north it will be cloudy and cold, about five degrees. In the south it will be sunny and warm, around fifteen degrees. In the evening there will be strong winds in the mountains, so take a warm jacket!',
   items:[['It will be sunny in the north.',false],['In the south it will be about fifteen degrees.',true],['There will be strong winds in the mountains.',true],['The winds will come in the morning.',false]] },
 { id:'l46-3', type:'pick', title:'Places in town', pl:'Miejsca w mieście',
   items:[{say:'You can borrow books here. The library.',a:'📚',opts:['📚','🏥','🏦','🎬']},{say:'You can see a film here. The cinema.',a:'🎬',opts:['🏟️','🎬','🏫','⛪']},{say:'You go here when you are ill. The hospital.',a:'🏥',opts:['🏥','🏪','🏨','🏰']},{say:'You can buy bread here. The bakery.',a:'🥖',opts:['🥖','💊','✉️','⛽']},{say:'You can send a letter here. The post office.',a:'✉️',opts:['🎡','✉️','📚','🥖']}] },
 { id:'l46-4', type:'dict', title:'Daily routine dictation', pl:'Dyktando: codzienna rutyna', items:['I usually get up at seven o\'clock.','She never eats meat.','We have English on Tuesday.','My brother is playing computer games now.'] },
 { id:'l46-5', type:'lorder', title:'Ben\'s school trip', pl:'Wycieczka Bena',
   script:'On our school trip, we met at school at eight. First, we went to the zoo by coach. Then we had lunch in the park. After lunch, we visited the dinosaur museum. Finally, we came back to school at four o\'clock, tired but happy.',
   items:['🏫 They met at school at eight','🦒 They went to the zoo','🥪 They had lunch in the park','🦖 They visited the dinosaur museum','🕓 They came back at four'] }
],
speaking: [
 { id:'s46-1', type:'repeat', title:'Asking the way', pl:'Pytanie o drogę', items:['Excuse me, where is the station?','Go straight on and turn left.','It\'s next to the bank.','Thank you very much!'] },
 { id:'s46-2', type:'challenge', title:'My free time', pl:'Mój czas wolny', seconds:45,
   qs:['What do you do after school?','What is your favourite sport? Why?','What did you do last weekend?','What are you going to do this summer?'], frames:['After school I usually…','My favourite sport is … because…','Last weekend I…','This summer I\'m going to…'] },
 { id:'s46-3', type:'picture', title:'At the beach', pl:'Na plaży', scene:'🏖️ ☀️ 👨‍👩‍👧 🏐 🍦 🌊 🦀',
   prompts:['Where are the people?','What is the weather like?','What are they doing?','Do you like the beach? Why?'], frames:['In the picture I can see…','The weather is…','The girl is …-ing','I think they are…','I like / don\'t like… because…'], seconds:60 },
 { id:'s46-4', type:'roleplay', title:'At the café', pl:'W kawiarni', you:'B',
   lines:[['A','Hi! What would you like?'],['B','Can I have a hot chocolate, please?'],['A','Small or large?'],['B','Large, please. And a piece of apple cake.'],['A','Anything else?'],['B','No, thanks. How much is it?'],['A','That\'s twelve złoty.'],['B','Here you are. Thank you!']] },
 { id:'s46-5', type:'minimal', title:'Sound twins', pl:'Bliźniacze dźwięki', items:[['live','leave','🏠','🚪'],['think','sink','🤔','🚰'],['very','berry','💯','🫐'],['walk','work','🚶','💼']] }
],
writing: [
 { id:'w46-1', type:'unscramble', title:'Questions', pl:'Pytania', items:['Do you like chocolate?','Where does she live?','What time is it?','Did you watch the film?','Can you play the guitar?'] },
 { id:'w46-2', type:'wgap', title:'Past simple', pl:'Czas przeszły', hint:'Write the verb in the past. / Wpisz czasownik w czasie przeszłym.',
   items:[['Yesterday I ___ (play) tennis.','played'],['We ___ (go) to the cinema last Friday.','went'],['She ___ (eat) a big pizza.','ate'],['They ___ (see) a dolphin!','saw'],['I ___ (have) a great time.','had']] },
 { id:'w46-3', type:'spell', title:'Spell the school subject', pl:'Przeliteruj przedmiot', items:[['🔢','maths'],['🎨','art'],['🎵','music'],['🌍','geography'],['🔬','science'],['⚽','sport']] },
 { id:'w46-4', type:'fix', title:'Find the mistake', pl:'Znajdź błąd',
   items:[['She go to school by bus.','She goes to school by bus.','He/she/it + verb with -s.'],['I am liking pizza.','I like pizza.','We don\'t use "like" in the -ing form here.'],['Yesterday I goed to the park.','Yesterday I went to the park.','"Go" is irregular: go → went.'],['There is two cats.','There are two cats.','Two cats = plural → there are.']] },
 { id:'w46-5', type:'guided', title:'A postcard from holiday', pl:'Pocztówka z wakacji', min:40,
   prompt:'Write a postcard to a friend from your holiday. Where are you? What is the weather like? What did you do yesterday? What are you going to do tomorrow?', promptPl:'Napisz pocztówkę do kolegi/koleżanki z wakacji. Gdzie jesteś? Jaka jest pogoda? Co robiłeś/aś wczoraj? Co zrobisz jutro?',
   frames:['Hi …!','I\'m in … with…','The weather is…','Yesterday we…','Tomorrow we are going to…','See you soon, …'], words:['yesterday','tomorrow','weather'],
   model:'Hi Ola! I\'m in Gdańsk with my family. The weather is sunny and hot. Yesterday we swam in the sea and ate fish and chips. Tomorrow we are going to visit an old ship. See you soon, Kasia' }
]
},
/* ============================== KLASA 7–8 (E8) ============================== */
k78: {
reading: [
 { id:'r78-1', type:'story', title:'Screen-free week', pl:'Tydzień bez ekranów',
   text:['Last month, our school organised a "screen-free week". For seven days, students were asked not to use phones, tablets or computers after school, except for homework.','At first, many of us thought it would be impossible. On Monday evening, I kept reaching for my phone without thinking. By Wednesday, however, I had started reading a novel I had bought months earlier, and I went for a long bike ride with my dad.','The biggest surprise was how much more time I seemed to have. I won\'t give up my phone forever, but I have decided to switch it off for one hour every evening.'],
   gloss:{organised:'zorganizowała',except:'z wyjątkiem',impossible:'niemożliwe','kept reaching':'ciągle sięgałem/am',however:'jednak',novel:'powieść',earlier:'wcześniej',surprise:'niespodzianka',seemed:'wydawało się','give up':'zrezygnować',decided:'postanowiłem/am','switch it off':'wyłączyć'},
   q:[['During the week, students could use computers…',['only for games.','only for homework.','all the time.'],1],['How did the writer feel on Monday?',['They found it hard.','They were bored by the book.','They forgot about the phone.'],0],['What did the writer do by Wednesday?',['bought a new novel','started reading a book','sold their phone'],1],['What is the writer\'s decision?',['to stop using a phone','to have one phone-free hour a day','to organise another week'],1]] },
 { id:'r78-2', type:'match', title:'E8 reactions: what would you say?', pl:'E8: reakcje językowe', pairs:[['Your friend has passed an exam.','Congratulations! Well done!'],['You didn\'t hear what the teacher said.','Sorry, could you repeat that, please?'],['You want to borrow a pen.','Could I borrow your pen, please?'],['Someone thanks you for help.','You\'re welcome. No problem.'],['You suggest going to the cinema.','Why don\'t we go to the cinema?'],['You bump into someone by accident.','Oh, I\'m so sorry!']] },
 { id:'r78-3', type:'tf', title:'Volunteer at the animal shelter', pl:'Wolontariat w schronisku',
   text:'VOLUNTEERS WANTED! The Happy Paws animal shelter is looking for teenagers aged 14+ to help on Saturday mornings. You will walk dogs, clean cages and play with cats. No experience is needed, but you must love animals and be reliable. Volunteers under 16 need a letter from a parent. To apply, send an email to Anna by 30 November.',
   items:[['The shelter needs help on Saturday afternoons.',false],['You need experience with animals.',false],['A 15-year-old must bring a letter from a parent.',true],['Volunteers will only work with dogs.',false],['You apply by email.',true]] },
 { id:'r78-4', type:'gap', title:'Word formation & grammar (E8 style)', pl:'Gramatyka w stylu E8',
   text:'I have [been] learning English since I was six. If I [had] more time, I would read more books in English. My sister [is] going to study in Ireland next year. She [has] already bought her plane ticket. The tickets [were] booked online last week.',
   extra:['was','have','will'] },
 { id:'r78-5', type:'order', title:'An informal email', pl:'E-mail nieformalny', intro:'Put the parts of the email in order. / Ułóż części e-maila.',
   items:['Hi Tom,','Thanks for your email! It was great to hear from you.','Guess what? I\'ve just joined a climbing club. We meet twice a week.','Would you like to try it when you visit me in July?','Write back soon,','Kuba'] }
],
listening: [
 { id:'l78-1', type:'lmcq', title:'Choosing a summer camp', pl:'Wybór obozu',
   script:[['Mia','Have you decided which camp to go to, Olek?'],['Olek','Not yet. The sailing camp sounds amazing, but it\'s really expensive.'],['Mia','What about the language camp in Kraków? It\'s cheaper.'],['Olek','I went there last year. It was fun, but I want to try something new.'],['Mia','My cousin went to a climbing camp in the Tatras. She said it was the best two weeks of her life.'],['Olek','Really? I\'ve never tried climbing… but why not? I\'ll ask my parents tonight.']],
   q:[['Why isn\'t Olek sure about the sailing camp?',['It\'s too far.','It costs a lot.','It\'s too short.'],1],['What does Olek say about the language camp?',['He has been there before.','It is boring.','It is full.'],0],['Who recommended the climbing camp?',['Mia\'s cousin','Olek\'s parents','a teacher'],0],['What will Olek probably do?',['go sailing','go back to Kraków','try climbing'],2]] },
 { id:'l78-2', type:'ltf', title:'School announcement', pl:'Ogłoszenie szkolne',
   script:'Attention, please. Tomorrow\'s football match against Saint Mary\'s school has been cancelled because of the heavy rain. It will now take place next Wednesday at two p.m. Students who want to watch the match must sign the list in the library by Monday. Thank you.',
   items:[['The match has been cancelled because of the rain.',true],['The new match is on Thursday.',false],['It starts at two in the afternoon.',true],['The list is in the sports hall.',false]] },
 { id:'l78-3', type:'dict', title:'E8 dictation', pl:'Dyktando E8', items:['I\'ve been waiting for the bus for twenty minutes.','If it rains tomorrow, we will stay at home.','She asked me where I lived.','The museum was built in the nineteenth century.'] },
 { id:'l78-4', type:'pick', title:'What is the speaker\'s intention?', pl:'Intencja wypowiedzi',
   items:[{say:'Why don\'t we meet at the café at five?',a:'💡 suggesting',opts:['💡 suggesting','🙏 apologising','⚠️ warning']},{say:'Be careful! The floor is wet.',a:'⚠️ warning',opts:['🎉 congratulating','⚠️ warning','❓ asking for help']},{say:'I\'m really sorry I forgot your birthday.',a:'🙏 apologising',opts:['🙏 apologising','💡 suggesting','🙋 offering']},{say:'Shall I carry that bag for you?',a:'🙋 offering',opts:['⚠️ warning','🙋 offering','🙏 apologising']},{say:'Could you help me with my homework, please?',a:'❓ asking for help',opts:['❓ asking for help','🎉 congratulating','💡 suggesting']}] },
 { id:'l78-5', type:'lorder', title:'Lost in the city', pl:'Zagubiona w mieście',
   script:'When I arrived in Dublin, I realised I had lost my map. First, I asked a police officer for directions. He told me to take the number ten bus. Unfortunately, I got off at the wrong stop. Luckily, a friendly woman walked me to my hostel. In the evening, I bought a new map and a phone charger.',
   items:['🗺️ She lost her map','👮 She asked a police officer','🚌 She took the number ten bus','🚏 She got off at the wrong stop','👩 A woman walked her to the hostel','🛍️ She bought a new map'] }
],
speaking: [
 { id:'s78-1', type:'challenge', title:'E8-style questions', pl:'Pytania w stylu E8', seconds:60,
   qs:['Do you prefer spending free time at home or outside? Why?','Tell me about a trip you will never forget.','What would you change about your school?','Is it a good idea for teenagers to have a part-time job?'], frames:['I prefer … because…','On the other hand,…','I\'ll never forget the time when…','If I could, I would…','In my opinion,… / I think that…'] },
 { id:'s78-2', type:'roleplay', title:'Returning a product', pl:'Reklamacja w sklepie', you:'B',
   lines:[['A','Good afternoon. How can I help you?'],['B','Hello. I bought these headphones last week, but they don\'t work.'],['A','I\'m sorry to hear that. Have you got the receipt?'],['B','Yes, here it is.'],['A','Would you like a new pair or your money back?'],['B','I\'d like a new pair, please.'],['A','No problem. Here you are.'],['B','Thank you for your help!']] },
 { id:'s78-3', type:'picture', title:'Describe the photo', pl:'Opisz zdjęcie', scene:'🏙️ 🚲 👫 ☔ 🛍️ 🐕',
   prompts:['Describe what you can see.','How do you think the people feel?','What happened before? What will happen next?','Do you prefer living in a city or in the countryside?'], frames:['In the foreground / background there is…','It looks like…','They might be… / They seem to be…','I think they have just…','Personally, I\'d rather… because…'], seconds:90 },
 { id:'s78-4', type:'repeat', title:'Linking and stress', pl:'Łączenie słów i akcent', items:['What are you going to do?','I\'d rather stay at home tonight.','Have you ever been abroad?','It\'s not as easy as it looks.'] },
 { id:'s78-5', type:'minimal', title:'Tricky sounds', pl:'Trudne dźwięki', items:[['thought','taught','💭','👩‍🏫'],['worm','warm','🪱','🔥'],['bad','bed','👎','🛏️'],['full','fool','🍽️','🤡']] }
],
writing: [
 { id:'w78-1', type:'fix', title:'Typical Polish mistakes', pl:'Typowe błędy Polaków',
   items:[['I am agree with you.','I agree with you.','"Agree" is a verb – no "am".'],['I have 14 years.','I am 14 years old.','Age in English uses "be".'],['He explained me the problem.','He explained the problem to me.','explain something TO someone.'],['I\'m living here since 2020.','I\'ve been living here since 2020.','"since" → present perfect (continuous).'],['People is very friendly.','People are very friendly.','"people" is plural.']] },
 { id:'w78-2', type:'unscramble', title:'Advanced word order', pl:'Szyk zdania', items:['I have never been to Spain.','She usually goes to bed early.','Could you tell me where the station is?','We were watching TV when the lights went out.','I am not as tall as my brother.'] },
 { id:'w78-3', type:'wgap', title:'Paraphrase (E8 style)', pl:'Parafraza w stylu E8', hint:'Complete so it means the same. / Uzupełnij, aby znaczenie było takie samo.',
   items:[['It isn\'t necessary to bring food. → You ___ to bring food.','don\'t have|do not have'],['This is my first visit to Rome. → I have ___ been to Rome before.','never'],['Tom is taller than Ben. → Ben isn\'t as ___ as Tom.','tall'],['They built the bridge in 1990. → The bridge was ___ in 1990.','built'],['"I\'m tired," said Ola. → Ola said that she ___ tired.','was']] },
 { id:'w78-4', type:'spell', title:'Tricky spellings', pl:'Trudna pisownia', items:[['🤝','friend'],['🏛️','government'],['🌡️','temperature'],['🗓️','Wednesday'],['🙂','beautiful'],['💭','believe']] },
 { id:'w78-5', type:'guided', title:'E8 email: inviting a friend', pl:'E-mail E8: zaproszenie', min:50,
   prompt:'You are organising a picnic for your class. Write an email to your friend from England: 1) say why you are organising it, 2) invite them and say when it is, 3) ask them to bring something.', promptPl:'Organizujesz piknik klasowy. Napisz e-mail do kolegi/koleżanki z Anglii: 1) napisz, dlaczego go organizujesz, 2) zaproś i podaj termin, 3) poproś, aby coś przyniósł/przyniosła.',
   frames:['Hi …,','I\'m writing to tell you that…','We are organising it because…','Would you like to come? It\'s on…','Could you bring…?','Hope to see you there!','Best wishes,'], words:['because','would you like','could you'],
   model:'Hi Emma,\nI\'m writing to tell you that my class is organising a picnic. We are organising it because it\'s the end of the school year and we want to celebrate. Would you like to come? It\'s on Saturday, 20 June, at 12 in the city park. Could you bring some sandwiches or a frisbee? Hope to see you there!\nBest wishes,\nKasia' }
]
}
},
parentTips: {
  reading: ['Poproś dziecko, by przeczytało Ci na głos jeden akapit – nawet jeśli nie znasz angielskiego, chwal za wysiłek, nie za perfekcję.','Zapytaj po polsku: „O czym był ten tekst?”. Opowiadanie po polsku też buduje rozumienie.','Przyklej w domu angielskie karteczki: door, window, fridge.'],
  listening: ['Włączajcie angielskie piosenki lub bajki w aucie albo przy śniadaniu – 10 minut dziennie wystarczy.','Pozwól używać przycisku 🐢 (wolniej) – to nie oszukiwanie, to budowanie pewności siebie.','Poproś dziecko, by codziennie nauczyło Cię jednego nowego słowa.'],
  speaking: ['Ćwiczenia mówione najlepiej robić w cichym pokoju – mikrofon działa wtedy najlepiej.','Nigdy nie śmiej się z błędów w wymowie. Każdą próbę nagródź piątką!','Zadawaj przy obiedzie proste pytania po angielsku: „What is your favourite…?”'],
  writing: ['Sprawdzaj tylko dwie rzeczy: wielkie litery i kropki. Małe sukcesy są ważne.','Raz w tygodniu niech dziecko napisze listę zakupów po angielsku.','Wywieś udane teksty na lodówce – to ogromna motywacja.']
}
};
