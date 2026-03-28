export type Book = {
  id: string
  grade: string
  author: string
  title: string
  color: string
  cover: string
  descRu: string
  descKz: string
  url: string
}

export const BOOKS: Book[] = [
  { id: 'b001', grade: '6', author: 'Орынбай Жанайдаров', title: 'Легенды Древнего Казахстана', color: '#1a2d5a', cover: '/covers/legendy.png', url: 'https://kazneb.kz/FileStore/dataFiles/51/f5/1104641/content/pdf24.pdf', descRu: 'Сборник легенд о древнем Казахстане — о батырах, ханах и духах степи.', descKz: 'Ежелгі Қазақстан туралы аңыздар жинағы.' },
  { id: 'b002', grade: '6', author: 'Бердибек Сокпакбаев', title: 'Меня зовут Кожа', color: '#6b3a08', cover: '/covers/kozha.png', url: 'https://www.litlib.net/bk/240785/read', descRu: 'Повесть о жизни обычного казахского мальчика. История взросления и дружбы.', descKz: 'Қарапайым қазақ баласының өмірі туралы повесть.' },
  { id: 'b003', grade: '6', author: 'Антуан де Сент-Экзюпери', title: 'Маленький принц', color: '#103a58', cover: '/covers/princ.png', url: 'https://loveread.ec/read_book.php?id=1833&p=1', descRu: 'Философская сказка для взрослых и детей о настоящих ценностях жизни.', descKz: 'Өмірдің шынайы құндылықтары туралы философиялық ертегі.' },
  { id: 'b004', grade: '6', author: 'Джоан Роулинг', title: 'Гарри Поттер и философский камень', color: '#5a1020', cover: '/covers/harry.png', url: 'https://loveread.ec/read_book.php?id=2317&p=1', descRu: 'Начало легендарной серии о юном волшебнике Гарри Поттере.', descKz: 'Жас сиқыршы Гарри Поттер туралы аңызға айналған сериялың басы.' },
  { id: 'b005', grade: '6', author: 'Даниель Дефо', title: 'Робинзон Крузо', color: '#10402a', cover: '/covers/robinson.png', url: 'https://loveread.ec/read_book.php?id=3623&p=1', descRu: 'Классика мировой литературы. Моряк выживает на необитаемом острове.', descKz: 'Әлем әдебиетінің классикасы. Теңізшінің шөл аралда тіршілік етуі.' },
  { id: 'b006', grade: '6', author: 'Жюль Верн', title: 'Вокруг света за 80 дней', color: '#0e2050', cover: '/covers/vokrug.png', url: 'https://loveread.ec/read_book.php?id=52333&p=5', descRu: 'Захватывающий роман о кругосветном путешествии за 80 дней.', descKz: '80 күнде жер шарын айналып шығу туралы шытырман роман.' },
  { id: 'b007', grade: '6', author: 'Мухтар Ауэзов', title: 'Серый Лютый', color: '#1e2e50', cover: '/covers/seryi.png', url: 'https://flibusta.su/book/152774-seryiy-lyutyiy-kinopovest/read/', descRu: 'Повесть о свободолюбивом волке. Символичная история о свободе и достоинстве.', descKz: 'Бостандықты сүйетін қасқыр туралы символдық повесть.' },
  { id: 'b008', grade: '6', author: 'Владимир Железников', title: 'Чучело', color: '#402010', cover: '/covers/chuchelo.png', url: 'https://loveread.ec/read_book.php?id=64398&p=1', descRu: 'История о школьнице, столкнувшейся с жестоким бойкотом одноклассников.', descKz: 'Сынып жолдастарының бойкотына тап болған оқушы қыз туралы.' },
  { id: 'b009', grade: '7', author: 'Роберт Льюис Стивенсон', title: 'Остров сокровищ', color: '#0a3818', cover: '/covers/ostrov.png', url: 'https://loveread.ec/read_book.php?id=9565&p=1', descRu: 'Классический приключенческий роман о поисках пиратских сокровищ.', descKz: 'Қарақшы қазынасын іздеу туралы классикалық шытырман роман.' },
  { id: 'b010', grade: '7', author: 'Марк Твен', title: 'Приключения Тома Сойера', color: '#184808', cover: '/covers/tom.png', url: 'https://loveread.ec/read_book.php?id=2460&p=1', descRu: 'Детство на берегу Миссисипи и бесконечные приключения непоседливого Тома.', descKz: 'Миссисипи жағасындағы тентек Том Сойердің шексіз шытырман оқиғалары.' },
  { id: 'b011', grade: '7', author: 'Джек Лондон', title: 'Белый клык', color: '#0a1838', cover: '/covers/belyi.png', url: 'https://loveread.ec/read_book.php?id=4450&p=1', descRu: 'История волка от дикой природы Аляски до жизни среди людей. О дружбе и доброте.', descKz: 'Ақ Азу бөрінің Аляскадан адамдар арасына дейінгі тарихы.' },
  { id: 'b012', grade: '7', author: 'Джордж Клейсон', title: 'Самый богатый человек в Вавилоне', color: '#704a08', cover: '/covers/vavilon.png', url: 'https://loveread.ec/read_book.php?id=88373&p=1', descRu: 'Мудрые притчи о деньгах в древнем Вавилоне. Уроки финансовой грамотности.', descKz: 'Ежелгі Вавилондағы ақша туралы дана мысалдар.' },
  { id: 'b013', grade: '8', author: 'Бауыржан Момышулы', title: 'Наша семья', color: '#1a2d5a', cover: '/covers/semya.png', url: 'https://bilim-all.kz/article/16266', descRu: 'Мемуары казахского военачальника о семье и детстве. О ценности семьи.', descKz: 'Қолбасшының отбасы туралы естеліктер.' },
  { id: 'b014', grade: '8', author: 'Чингиз Айтматов', title: 'Белый пароход', color: '#0e1848', cover: '/covers/parohod.png', url: 'https://loveread.ec/read_book.php?id=53&p=17', descRu: 'Пронзительная повесть о мальчике-сироте в горах Киргизии.', descKz: 'Қырғызстан тауларындағы жетім бала туралы шымыр повесть.' },
  { id: 'b015', grade: '8', author: 'Дейл Карнеги', title: 'Как завоевать друзей', color: '#183858', cover: '/covers/karnegi.png', url: 'https://loveread.ec/read_book.php?id=1488&p=1', descRu: 'Мировой бестселлер о навыках общения и построении отношений.', descKz: 'Қарым-қатынас дағдылары туралы дүниежүзілік бестселлер.' },
  { id: 'b016', grade: '8', author: 'Роберт Кийосаки', title: 'Богатый папа, бедный папа', color: '#705008', cover: '/covers/kiyosaki.png', url: 'https://loveread.ec/read_book.php?id=4461&p=1', descRu: 'Книга, изменившая отношение миллионов людей к деньгам.', descKz: 'Миллиондаған адамдардың ақшаға деген көзқарасын өзгерткен кітап.' },
  { id: 'b017', grade: '9', author: 'Стивен Кови', title: '7 навыков высокоэффективных людей', color: '#082838', cover: '/covers/kovi.png', url: 'https://loveread.ec/read_book.php?id=54300&p=1', descRu: 'Семь принципов для достижения целей и осмысленной жизни.', descKz: 'Мақсаттарға жету үшін жеті принцип.' },
  { id: 'b018', grade: '9', author: 'Фил Найт', title: 'Продавец обуви', color: '#583808', cover: '/covers/knight.png', url: 'https://loveread.ec/read_book.php?id=66592&p=1', descRu: 'Автобиография основателя Nike. Честный рассказ о создании великой компании.', descKz: 'Nike негізін қалаушының өмірбаяны.' },
  { id: 'b019', grade: '9', author: 'Стивен Хокинг', title: 'Краткие ответы на большие вопросы', color: '#303050', cover: '/covers/hoking.png', url: 'https://libcat.ru/knigi/nauka-i-obrazovanie/prochaya-nauchnaya-literatura/421127-stiven-hoking-kratkie-otvety-na-bolshie-voprosy.html', descRu: 'Последняя книга великого учёного об устройстве мира.', descKz: 'Ұлы ғалымның соңғы кітабы.' },
  { id: 'b020', grade: '9', author: 'Чингиз Айтматов', title: 'Белый пароход', color: '#083848', cover: '/covers/parohod.png', url: 'https://loveread.ec/read_book.php?id=53&p=1', descRu: 'Пронзительная повесть о мечте и столкновении добра со злом.', descKz: 'Арман мен жақсылықтың жамандықпен соқтығысуы туралы.' },
  { id: 'b021', grade: '10', author: 'Мухтар Ауэзов', title: 'Абай жолы', color: '#1a2d5a', cover: '/covers/abay.png', url: 'https://mylibrary.kz/proza/vystrel-na-perevale-muhtar-aujezov/', descRu: 'Монументальный роман-эпопея о жизни великого поэта Абая. Вершина казахской литературы.', descKz: 'Ұлы ақын Абайдың өмірі туралы монументалды роман-эпопея.' },
  { id: 'b022', grade: '10', author: 'Эрих Мария Ремарк', title: 'Три товарища', color: '#182818', cover: '/covers/remarque.png', url: 'https://loveread.ec/read_book.php?id=3330&p=1', descRu: 'Роман о трёх фронтовых друзьях в послевоенной Германии.', descKz: 'Соғыстан кейінгі Германиядағы үш майдандас дос туралы роман.' },
  { id: 'b023', grade: '10', author: 'Кен Моги', title: 'Икигай: Смысл жизни по-японски', color: '#704808', cover: '/covers/ikigai.png', url: 'https://loveread.ec/read_book.php?id=58735&p=1', descRu: 'Японская философия о том, ради чего стоит вставать по утрам.', descKz: 'Таңертең оянуға тұрарлық нәрсе туралы жапон философиясы.' },
  { id: 'b024', grade: '10', author: 'Мэг Джей', title: 'Важные годы', color: '#501828', cover: '/covers/jay.png', url: 'https://loveread.ec/read_book.php?id=55024&p=1', descRu: 'Психолог объясняет, почему двадцатые годы жизни самые важные.', descKz: 'Психолог жиырмасыншы жылдар неге ең маңызды екенін түсіндіреді.' },
  { id: 'b025', grade: 'dynasty', author: 'Абай Кунанбаев', title: 'Слова назидания', color: '#6a4a08', cover: '/covers/abay-slova.png', url: 'https://www.alpamys.edu.kz/o-shkole/biblioteka/abaj-slova-nazidaniya/', descRu: 'Сорок пять философских произведений Абая о жизни и нравственности.', descKz: 'Абайдың қырық бес философиялық шығармасы.' },
  { id: 'b026', grade: 'dynasty', author: 'Джеймс Клир', title: 'Атомные привычки', color: '#302858', cover: '/covers/habits.png', url: 'https://loveread.ec/read_book.php?id=84968&p=1', descRu: 'Маленькие изменения, которые приводят к выдающимся результатам.', descKz: 'Ерекше нәтижелерге апаратын кіші өзгерістер.' },
  { id: 'b027', grade: 'dynasty', author: 'Мухтар Ауэзов', title: 'Путь Абая', color: '#0e2840', cover: '/covers/abay.png', url: 'https://libcat.ru/knigi/proza/klassicheskaya-proza/50318-muhtar-auezov-put-abaya-tom-1.html', descRu: 'Монументальный роман-эпопея о жизни Абая Кунанбаева.', descKz: 'Абай Құнанбаевтың өмірі туралы монументалды роман-эпопея.' },
  { id: 'b028', grade: 'teacher', author: 'Василий Сухомлинский', title: 'Сердце отдаю детям', color: '#501010', cover: '/covers/suho.png', url: 'https://little.com.ru/media/files/1460702288-526.pdf', descRu: 'Классика педагогики о том, что значит быть настоящим учителем.', descKz: 'Шынайы мұғалім болу нені білдіретіні туралы педагогика классикасы.' },
  { id: 'b029', grade: 'teacher', author: 'Юваль Ной Харари', title: 'Sapiens', color: '#282840', cover: '/covers/sapiens.png', url: 'https://loveread.ec/read_book.php?id=57922&p=1', descRu: 'История человечества от первобытных охотников до кибер-революции.', descKz: 'Алғашқы аңшылардан киберреволюцияға дейінгі адамзат тарихы.' },
  { id: 'b030', grade: 'teacher', author: 'Тимоти Уокер', title: 'Финская система обучения', color: '#083838', cover: '/covers/finland.png', url: 'https://loveread.ec/book-comments.php?book=74647', descRu: 'О финской системе образования — почему финские школы лучшие в мире.', descKz: 'Фин мектептері неліктен дүниеде үздік екені туралы.' },
]

export const GRADE_LABELS: Record<string, { ru: string; kz: string }> = {
  all:     { ru: 'Все',                   kz: 'Барлығы' },
  '6':     { ru: '6 класс',              kz: '6 сынып' },
  '7':     { ru: '7 класс',              kz: '7 сынып' },
  '8':     { ru: '8 класс',              kz: '8 сынып' },
  '9':     { ru: '9 класс',              kz: '9 сынып' },
  '10':    { ru: '10 класс',             kz: '10 сынып' },
  dynasty: { ru: 'Читающая династия',    kz: 'Оқитын әулет' },
  teacher: { ru: 'Читающий педагог',     kz: 'Оқитын ұстаз' },
}
