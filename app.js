const bookingUrl = 'https://res.bins.jp/~moriwaki/miyanosaka/';

const questions = [
  {
    title: '朝、髪に使える時間は？',
    point: '時間がかからないパーマでも、動きや雰囲気はしっかり出せます。',
    options: {
      A: ['ほぼ時間がない', '乾かして終わりにしたい'],
      B: ['5分くらい', 'オイルをつけるくらいならできる'],
      C: ['10分くらい', '少しスタイリングを楽しめる']
    }
  },
  {
    title: '普段、髪を結ぶ？',
    point: '結ぶ頻度は、顔まわり・毛先の動き・パーマの強さを決める大事なヒントです。',
    options: {
      A: ['ほぼ毎日', '仕事・家事・送り迎えでは結びたい'],
      B: ['半々くらい', '仕事では結ぶけど、休日は下ろしたい'],
      C: ['あまり結ばない', '下ろしたスタイルを楽しみたい']
    }
  },
  {
    title: '今の髪で一番変えたいのは？',
    point: '「何が嫌か」より、「毎日どうなったら嬉しいか」で選ぶと診断が合いやすくなります。',
    options: {
      A: ['朝の扱いにくさ', '毎朝の準備をもっとラクにしたい'],
      B: ['いつも同じ髪になること', '仕事と休日で雰囲気を変えたい'],
      C: ['普通すぎて物足りないこと', '髪で少し気分を変えたい']
    }
  },
  {
    title: 'どんな「可愛い」が好き？',
    point: '似合うだけでなく、あなたが「自分らしい」と感じる雰囲気も大切にします。',
    options: {
      A: ['自然で柔らかい', '頑張って見えない感じ'],
      B: ['ちょっとお洒落', 'シンプルな服でも雰囲気が出る感じ'],
      C: ['少し個性的', '人と同じより、自分らしい感じ']
    }
  },
  {
    title: '休日の髪は？',
    point: '仕事の日だけでなく、休日にどう過ごしたいかまで含めてパーマタイプを考えます。',
    options: {
      A: ['休日もできるだけラクしたい', '手をかけなくても可愛くしたい'],
      B: ['仕事の日より少しお洒落したい', '下ろしたりアレンジしたりしたい'],
      C: ['休日くらい髪で遊びたい', 'いつもより少しムードを出したい']
    }
  }
];

const results = {
  A: {
    en: 'EASY NUANCE',
    jp: 'ニュアンスパーマ',
    subline: 'A が多かったあなたは…',
    desc: 'とにかく朝をラクにしたい人へ。乾かしてオイルをなじませるだけでも、柔らかな動きと抜け感が出やすいタイプです。',
    lengths: {
      short: {
        label: 'ショート',
        caption: '短めでも、頑張らずにやわらかく見せたい人に。',
        styles: [
          ['assets/easy-short-01.webp', '丸みコンパクトショート', '耳まわりをすっきり見せながら、やわらかさも残す王道ショート。上品で朝ラク。'],
          ['assets/easy-short-02.webp', 'やわらかショートボブ', '丸みのあるシルエットと透け感バングで、短くても女性らしいショートボブ。'],
          ['assets/easy-short-03.webp', 'ナチュラルハンサムショート', 'すっきりした襟足と長め前髪で、甘すぎない大人ショート。軽くオイルをつけるだけで決まります。']
        ]
      },
      medium: {
        label: 'ミディアム',
        caption: '扱いやすさと可愛さのバランスを取りたい人に。',
        styles: [
          ['assets/easy-medium-01.webp', '肩上ニュアンスミディ', '肩まわりでふわっと動く長さ。忙しい朝でもやわらかい印象を作りやすい万能ミディ。'],
          ['assets/easy-medium-02.webp', '外ハネやわらかミディ', '毛先の軽い動きがポイント。ナチュラルだけど少し洒落て見える、取り入れやすいスタイル。'],
          ['assets/easy-medium-03.webp', 'ナチュラルレイヤーミディ', '顔まわりのレイヤーで軽さをプラス。結んでも下ろしても扱いやすいミディアム。']
        ]
      },
      long: {
        label: 'ロング',
        caption: '長さは残したまま、毎日を少しラクにしたい人に。',
        styles: [
          ['assets/easy-long-01.webp', 'ゆるふわロングレイヤー', 'ロングでも重く見えすぎない、ふわっとした軽さが魅力。オイル仕上げと相性の良いスタイル。'],
          ['assets/easy-long-02.webp', 'さらっと動くセミロング', '長さを残しながらも毛先にやさしく動きを。朝の支度を簡単にしたい人におすすめ。'],
          ['assets/easy-long-03.webp', '朝ラクロングニュアンス', '顔まわりと毛先のニュアンスで、頑張りすぎない大人の可愛さを演出。']
        ]
      }
    }
  },
  B: {
    en: '2WAY',
    jp: 'アンニュイ・2WAYパーマ',
    subline: 'B が多かったあなたは…',
    desc: '仕事も休日も、どっちも大事にしたい人へ。結ぶ・下ろすの両方で顔まわりや毛先が決まりやすく、同じ髪でも2つの雰囲気を楽しめます。',
    lengths: {
      short: {
        label: 'ショート',
        caption: '短めでも、仕事と休日で印象を切り替えたい人に。',
        styles: [
          ['assets/twoway-short-01.webp', '耳かけ2WAYショート', '耳にかけてすっきり見せても、前髪を下ろしてやわらかく見せても可愛い2WAYショート。'],
          ['assets/twoway-short-02.webp', 'くびれショートボブ', '丸みとくびれを両立したショートボブ。仕事ではきれいめ、休日は少しラフにも振れるデザイン。'],
          ['assets/twoway-short-03.webp', '前下がりマッシュショート', 'シャープさとやわらかさのバランスが絶妙。大人っぽくも可愛くも見せられるショート。']
        ]
      },
      medium: {
        label: 'ミディアム',
        caption: '一番2WAYの良さを楽しみやすい王道バランス。',
        styles: [
          ['assets/twoway-medium-01.webp', '低めアレンジも映えるミディ', '結んだ時のおくれ毛まで可愛い、アレンジ対応力の高い2WAYミディアム。'],
          ['assets/twoway-medium-02.webp', '外ハネレイヤーミディ', '毛先の外ハネとレイヤー感で、下ろした時にしっかり洒落感が出るミディアム。'],
          ['assets/twoway-medium-03.webp', 'ナチュラルくびれミディ', 'きれいめにもラフにも寄せやすい万能型。働く日も休日も使いやすい長さです。']
        ]
      },
      long: {
        label: 'ロング',
        caption: '長さを活かして、結ぶ日も下ろす日も可愛く。',
        styles: [
          ['assets/twoway-long-01.webp', '低めポニーアレンジロング', '結んでも顔まわりが可愛く残る、アレンジ映えするロング。仕事の日にも相性◎。'],
          ['assets/twoway-long-02.webp', 'くびれロングレイヤー', '下ろした時はくびれ感とやわらかい動きで、ロングでも軽く見えるデザイン。'],
          ['assets/twoway-long-03.webp', '韓国風やわらかロング', 'ツヤ感とレイヤー感で、きれいめにも抜け感にも振れる2WAYロング。']
        ]
      }
    }
  },
  C: {
    en: 'MOOD',
    jp: 'グランジパーマ',
    subline: 'C が多かったあなたは…',
    desc: '普通じゃ少し物足りない人へ。シンプルな服でも、髪だけで少し洒落て見える。ラフさと個性を楽しむムード重視タイプです。',
    lengths: {
      short: {
        label: 'ショート',
        caption: '短めでも、ムードと洒落感をしっかり出したい人に。',
        styles: [
          ['assets/mood-short-01.webp', 'グランジショートボブ', '無造作な動きが映えるショートボブ。作り込みすぎず、ラフな空気感を楽しめます。'],
          ['assets/mood-short-02.webp', 'ムードショート', '顔まわりに動きをつけて、シンプルでも印象的に。少し個性を足したい人に。'],
          ['assets/mood-short-03.webp', 'ラフウェーブショート', '短めでも程よく力の抜けた雰囲気に。服がシンプルでもお洒落見えしやすいデザイン。']
        ]
      },
      medium: {
        label: 'ミディアム',
        caption: 'ラフさと女性らしさを両立しやすい長さ。',
        styles: [
          ['assets/mood-medium-01.webp', 'ウルフミディ', '首まわりに動きが出るウルフ寄りミディアム。少し個性を出したい人におすすめ。'],
          ['assets/mood-medium-02.webp', 'ラフボブミディ', 'ボブベースでも重く見えないラフな質感。シンプルな服にも映えるムード系ミディ。'],
          ['assets/mood-medium-03.webp', 'モードレイヤーミディ', '少しシャープな雰囲気もあるモード寄りのミディ。大人っぽいムードを出したい人へ。']
        ]
      },
      long: {
        label: 'ロング',
        caption: '長さを残しながら、印象はぐっと洒落たムードに。',
        styles: [
          ['assets/mood-long-01.webp', 'アンニュイウェーブロング', '顔まわりの崩しとラフな質感で、やわらかいのに少し気だるいムードを演出。'],
          ['assets/mood-long-02.webp', 'ダークトーンムードロング', 'ツヤ感を残しつつ、重さと抜け感を両立。普通のロングより少し洒落て見える。'],
          ['assets/mood-long-03.webp', 'グランジロングパーマ', 'しっかりめの動きで、服がシンプルでも存在感が出るグランジ寄りロング。']
        ]
      }
    }
  }
};

const startScreen = document.querySelector('#start-screen');
const quizScreen = document.querySelector('#quiz-screen');
const resultScreen = document.querySelector('#result-screen');
const startBtn = document.querySelector('#start-btn');
const backBtn = document.querySelector('#back-btn');
const restartBtn = document.querySelector('#restart-btn');
const saveBtn = document.querySelector('#save-btn');
const shareBtn = document.querySelector('#share-btn');
const consultBtn = document.querySelector('#consult-btn');
const consultDialog = document.querySelector('#consult-dialog');
const dialogClose = document.querySelector('#dialog-close');
const questionTitle = document.querySelector('#question-title');
const questionKicker = document.querySelector('#question-kicker');
const optionsEl = document.querySelector('#options');
const progressLabel = document.querySelector('#progress-label');
const progressBar = document.querySelector('#progress-bar');
const pointCopy = document.querySelector('#point-copy');
const quizPageNo = document.querySelector('#quiz-page-no');
const optionTemplate = document.querySelector('#option-template');
const styleTemplate = document.querySelector('#style-template');
const savedNote = document.querySelector('#saved-note');
const lengthTabs = document.querySelector('#length-tabs');
const lengthCaption = document.querySelector('#length-caption');

let current = 0;
let answers = [];
let currentResult = null;
let currentLength = 'short';

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('is-active'));
  screen.classList.add('is-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  const q = questions[current];
  questionKicker.textContent = `Q${current + 1}`;
  questionTitle.textContent = q.title;
  progressLabel.textContent = `Q${current + 1} / ${questions.length}`;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
  pointCopy.textContent = q.point;
  quizPageNo.textContent = String(Math.min(4, current + 2)).padStart(2, '0');
  optionsEl.innerHTML = '';

  Object.entries(q.options).forEach(([letter, copy]) => {
    const node = optionTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.option-letter').textContent = letter;
    node.querySelector('strong').textContent = copy[0];
    node.querySelector('small').textContent = copy[1];
    node.dataset.answer = letter;
    node.setAttribute('aria-label', `${letter}: ${copy[0]}。${copy[1]}`);
    node.addEventListener('click', () => chooseAnswer(letter));
    optionsEl.appendChild(node);
  });

  backBtn.hidden = current === 0;
}

function chooseAnswer(letter) {
  answers[current] = letter;
  if (current < questions.length - 1) {
    current += 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const resultKey = calculateResult(answers);
    renderResult(resultKey, 'short');
  }
}

function calculateResult(items) {
  const score = { A: 0, B: 0, C: 0 };
  items.forEach(key => score[key]++);
  const max = Math.max(...Object.values(score));
  const tied = Object.keys(score).filter(key => score[key] === max);
  if (tied.length === 1) return tied[0];

  if (tied.includes(items[3])) return items[3];
  if (tied.includes(items[4])) return items[4];
  return tied[0];
}

function updateUrl() {
  if (!currentResult) return;
  const url = new URL(window.location.href);
  url.searchParams.set('result', currentResult);
  url.searchParams.set('length', currentLength);
  history.replaceState({}, '', url);
}

function renderLengthTabs() {
  const lengthEntries = Object.entries(results[currentResult].lengths);
  lengthTabs.innerHTML = '';

  lengthEntries.forEach(([key, data]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `length-tab${key === currentLength ? ' is-active' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', key === currentLength ? 'true' : 'false');
    button.textContent = data.label;
    button.addEventListener('click', () => setLength(key));
    lengthTabs.appendChild(button);
  });
}

function renderStyles() {
  const lengthData = results[currentResult].lengths[currentLength];
  lengthCaption.textContent = `${lengthData.label}｜${lengthData.caption}`;

  const grid = document.querySelector('#style-grid');
  grid.innerHTML = '';
  lengthData.styles.forEach((style, index) => {
    const node = styleTemplate.content.firstElementChild.cloneNode(true);
    const img = node.querySelector('img');
    img.src = style[0];
    img.alt = `${results[currentResult].jp} ${lengthData.label} おすすめスタイル ${index + 1}：${style[1]}`;
    node.querySelector('.style-number').textContent = `${lengthData.label.toUpperCase?.() || lengthData.label} STYLE ${String(index + 1).padStart(2, '0')}`;
    node.querySelector('h4').textContent = style[1];
    node.querySelector('.style-text').textContent = style[2];
    node.querySelector('.style-reserve').href = bookingUrl;
    grid.appendChild(node);
  });

  renderLengthTabs();
  updateUrl();
}

function setLength(lengthKey) {
  if (!results[currentResult]?.lengths[lengthKey]) return;
  currentLength = lengthKey;
  renderStyles();
}

function renderResult(key, initialLength = 'short', update = true) {
  currentResult = key;
  currentLength = results[key].lengths[initialLength] ? initialLength : 'short';
  const r = results[key];
  document.querySelector('#result-subline').textContent = r.subline;
  document.querySelector('#result-en').textContent = r.en;
  document.querySelector('#result-jp').textContent = r.jp;
  document.querySelector('#result-desc').textContent = r.desc;
  document.querySelector('#reserve-btn').href = bookingUrl;
  renderStyles();
  if (!update) {
    // revert replaceState side effect in direct render case
    const url = new URL(window.location.href);
    url.searchParams.set('result', currentResult);
    url.searchParams.set('length', currentLength);
    history.replaceState({}, '', url);
  }
  savedNote.textContent = '';
  showScreen(resultScreen);
}

function saveResult() {
  if (!currentResult) return;
  const payload = {
    result: currentResult,
    length: currentLength,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('moriwaki-perm-diagnosis', JSON.stringify(payload));
  const r = results[currentResult];
  const lengthData = r.lengths[currentLength];
  savedNote.textContent = `「${r.jp} / ${lengthData.label}」としてこの端末に保存しました。`;
}

async function shareResult() {
  if (!currentResult) return;
  const r = results[currentResult];
  const lengthData = r.lengths[currentLength];
  const url = new URL(window.location.href);
  url.searchParams.set('result', currentResult);
  url.searchParams.set('length', currentLength);
  const text = `私のパーマタイプは「${r.jp}」。気になる長さは「${lengthData.label}」でした。`;

  try {
    if (navigator.share) {
      await navigator.share({ title: '私に合うパーマタイプ診断', text, url: url.toString() });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      savedNote.textContent = '診断結果のリンクをコピーしました。';
    }
  } catch (err) {
    if (err?.name !== 'AbortError') savedNote.textContent = '共有できませんでした。画面のスクリーンショットをご利用ください。';
  }
}

function restart() {
  current = 0;
  answers = [];
  currentResult = null;
  currentLength = 'short';
  const url = new URL(window.location.href);
  url.searchParams.delete('result');
  url.searchParams.delete('length');
  history.replaceState({}, '', url);
  renderQuestion();
  showScreen(startScreen);
}

startBtn.addEventListener('click', () => {
  current = 0;
  answers = [];
  renderQuestion();
  showScreen(quizScreen);
});

backBtn.addEventListener('click', () => {
  if (current > 0) {
    current -= 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

restartBtn.addEventListener('click', restart);
saveBtn.addEventListener('click', saveResult);
shareBtn.addEventListener('click', shareResult);
consultBtn.addEventListener('click', () => consultDialog.showModal());
dialogClose.addEventListener('click', () => consultDialog.close());
consultDialog.addEventListener('click', (event) => {
  if (event.target === consultDialog) consultDialog.close();
});

const params = new URL(window.location.href).searchParams;
const resultFromUrl = params.get('result');
const lengthFromUrl = params.get('length') || 'short';
if (resultFromUrl && results[resultFromUrl]) {
  renderResult(resultFromUrl, lengthFromUrl, false);
} else {
  renderQuestion();
}
