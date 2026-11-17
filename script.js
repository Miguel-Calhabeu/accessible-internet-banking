const app = document.querySelector('#app');

let view = 'home';
let caseId = null;
let mode = 'problem';
let payment = 'minimum';
let bannerAlternate = false;
let bannerPaused = false;

const cases = [
  { id: 1, title: 'Escolha da modalidade de pagamento', problem: 'Opções ambíguas', solution: 'Instruções claras' },
  { id: 2, title: 'Revisão antes de confirmar', problem: 'Sem revisão', solution: 'Revisar mínimo' },
  { id: 3, title: 'Controle de distrações e ofertas', problem: 'Ofertas automáticas', solution: 'Controle de ofertas' },
];

function text(value, type = 'body') {
  const tag = type === 'title' ? 'h1' : type === 'heading' ? 'h2' : 'p';
  const focusTarget = tag === 'h1' ? ' tabindex="-1"' : '';
  return `<${tag} class="text ${type}"${focusTarget}>${value}</${tag}>`;
}

function card(title, body, options = {}) {
  const className = options.tone ? `card ${options.tone}` : 'card';
  const contents = `<span class="card-title">${title}</span>${body ? `<span class="card-body">${body}</span>` : ''}`;
  if (options.action) {
    return `<button class="${className}" data-action="${options.action}" aria-pressed="${options.selected}">${contents}</button>`;
  }
  return `<div class="${className}">${contents}</div>`;
}

function action(label, actionName) {
  return `<div class="action-row"><button class="action" data-action="${actionName}">${label}</button></div>`;
}

function brand() {
  return text('CLARO / Internet Banking', 'brand');
}

function step(label) {
  return text(label, 'step');
}

function choosePayment() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Como deseja pagar?', 'title') +
    '<img class="payment-image" src="https://images.pexels.com/photos/8837800/pexels-photo-8837800.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=960" alt="Pessoa usando um notebook ao lado de um caderno sobre a mesa" width="960" height="640">' +
    text('Fatura: R$ 1.500,00', 'subtotal') +
    card('Pagamento total • R$ 1.500', 'Quita esta fatura. Saldo restante: R$ 0,00.') +
    action('Selecionar pagamento total', 'select-total') +
    card('Pagamento mínimo • R$ 300', 'Paga apenas parte da fatura. Restam R$ 1.200 sujeitos a juros e encargos.') +
    action('Selecionar pagamento mínimo', 'select-minimum') +
    text('Parcelamento: consulte as condições e o custo total antes de contratar.', 'body muted');
}

function reviewMinimum() {
  return brand() +
    step('Etapa 2 de 3 • Revisar') +
    text('Revise antes de pagar', 'title') +
    card('Pagamento mínimo selecionado', 'Valor da fatura: R$ 1.500,00\nVocê pagará: R$ 300,00\nSaldo restante: R$ 1.200,00') +
    card('Atenção: a fatura não será quitada', 'R$ 1.200 ficarão em aberto, sujeitos a juros e encargos. Consulte as condições do contrato antes de continuar.', { tone: 'warning' }) +
    text('Se deseja quitar a fatura, altere para pagamento total.') +
    action('Alterar opção de pagamento', 'change-payment') +
    action('Confirmar pagamento de R$ 300', 'confirm-minimum');
}

function reviewTotal() {
  return brand() +
    step('Etapa 2 de 3 • Revisar') +
    text('Revise antes de pagar', 'title') +
    card('Pagamento total selecionado', 'Fatura: R$ 1.500,00\nVocê pagará: R$ 1.500,00\nSaldo restante: R$ 0,00') +
    text('Este pagamento quita a fatura apresentada.') +
    action('Alterar opção de pagamento', 'change-payment') +
    action('Confirmar pagamento de R$ 1.500', 'confirm-total');
}

function receiptMinimum() {
  return brand() +
    step('Etapa 3 de 3 • Comprovante') +
    text('Pagamento realizado', 'title') +
    card('R$ 300,00 pagos', 'Modalidade: pagamento mínimo\nSaldo restante: R$ 1.200,00\nNúmero da operação: 001') +
    card('Ainda existe saldo em aberto', 'O saldo restante está sujeito a juros e encargos. A fatura não foi quitada.', { tone: 'warning' });
}

function receiptTotal() {
  return brand() +
    step('Etapa 3 de 3 • Comprovante') +
    text('Fatura quitada', 'title') +
    card('R$ 1.500,00 pagos', 'Modalidade: pagamento total\nSaldo restante: R$ 0,00\nNúmero da operação: 002');
}

function problemOne() {
  const options = [
    { key: 'total', title: 'Integral' },
    { key: 'minimum', title: 'Mínimo • R$ 300,00', body: 'A escolha que cabe no seu bolso.' },
    { key: 'financing', title: 'Financiamento' },
  ];
  return brand() +
    text('Sua fatura', 'title') +
    text('R$ 1.500,00', 'amount') +
    text('Vencimento: 10/10/2026') +
    card('Mais liberdade para você!', 'Pague do seu jeito e aproveite seu limite.', { tone: 'lavender' }) +
    text('Escolha uma opção', 'heading') +
    options.map(option => card(`${payment === option.key ? '●' : '○'} ${option.title}`, option.body, { tone: payment === option.key ? 'lavender' : '', action: `payment:${option.key}`, selected: payment === option.key })).join('') +
    action('Continuar', 'continue-problem-one');
}

function problemTwo() {
  return brand() +
    text('Tudo pronto!', 'title') +
    card('Só falta um toque', 'Vamos resolver sua fatura e liberar novas possibilidades!', { tone: 'lavender' }) +
    text('Opção escolhida: mínimo') +
    text('Ao prosseguir, você concorda com as condições gerais de financiamento do saldo e os termos aplicáveis ao seu contrato.', 'small') +
    action('Confirmar', 'confirm-minimum') +
    card('Aproveite também', 'Crédito disponível para seus planos!');
}

function problemThree() {
  const bannerTitle = bannerAlternate ? 'SEU NOVO CARTÃO!' : 'EMPRÉSTIMO LIBERADO!';
  const bannerBody = bannerAlternate ? 'Mais benefícios. Peça agora.' : 'Uma oferta para você. Solicite agora.';
  return brand() +
    text('Pagar fatura', 'title') +
    card(bannerTitle, bannerBody, { tone: 'lavender banner' }) +
    `<button class="back" type="button" data-action="pause-banner" aria-pressed="${bannerPaused}">Pausar oferta automática</button>` +
    card('INVISTA HOJE', 'Novas oportunidades a cada instante.', { tone: 'peach' }) +
    text('Fatura: R$ 1.500,00', 'subtotal') +
    card('● Mínimo • R$ 300', '○ Total • R$ 1.500\n○ Parcelamento') +
    card('Seu cartão pode ser melhor', 'Conheça o upgrade e mais benefícios.', { tone: 'blue' }) +
    action('Continuar', 'continue-problem-three');
}

function solutionThree() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Pagar fatura', 'title') +
    text('Você controla as ofertas desta tela.') +
    card('Ofertas pausadas', 'O conteúdo não avança sozinho.') +
    action('Ocultar ofertas • Entrar no modo foco', 'focus-on') +
    text('Fatura: R$ 1.500,00', 'subtotal') +
    card('Pagamento total', 'Quita esta fatura.') +
    action('Selecionar pagamento total', 'select-total') +
    card('Pagamento mínimo', 'Restam R$ 1.200 sujeitos a juros e encargos.') +
    action('Selecionar pagamento mínimo', 'select-minimum');
}

function focusScreen() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Pagar fatura', 'title') +
    text('Modo foco ativo • Ofertas ocultas', 'focus-status') +
    text('Fatura: R$ 1.500,00', 'subtotal') +
    card('Pagamento total', 'Quita a fatura. Saldo restante: R$ 0,00.') +
    action('Selecionar pagamento total', 'select-total') +
    card('Pagamento mínimo', 'Paga R$ 300. Restam R$ 1.200 sujeitos a juros e encargos.') +
    action('Selecionar pagamento mínimo', 'select-minimum') +
    action('Mostrar ofertas pausadas', 'focus-off');
}

function homeScreen() {
  return brand() +
    text('Internet Banking', 'title') +
    text('Simule o pagamento da sua fatura com revisão antes de confirmar.') +
    action('Pagar fatura', 'start-payment') +
    text('Comparar os casos', 'heading') +
    cases.map(item => `<button class="case-card" data-action="case:${item.id}"><strong>0${item.id} • ${item.title}</strong><span>${item.problem} / ${item.solution}</span></button>`).join('');
}

const screens = {
  home: [null, homeScreen],
  choose: ['3:381', choosePayment],
  'review-total': ['3:554', reviewTotal],
  'review-minimum': ['3:440', reviewMinimum],
  'receipt-total': ['3:597', receiptTotal],
  'receipt-minimum': ['3:580', receiptMinimum],
  focus: ['3:631', focusScreen],
};

const destinations = {
  home: 'home',
  'start-payment': 'choose',
  'change-payment': 'choose',
  'select-total': 'review-total',
  'select-minimum': 'review-minimum',
  'confirm-total': 'receipt-total',
  'confirm-minimum': 'receipt-minimum',
};

function caseScreen() {
  if (caseId === 1) return mode === 'problem' ? ['3:347', problemOne] : screens.choose;
  if (caseId === 2) return mode === 'problem' ? ['3:411', problemTwo] : screens['review-minimum'];
  return mode === 'problem' ? [bannerAlternate ? '3:667' : '3:469', problemThree] : ['3:503', solutionThree];
}

function comparisonControls() {
  return `<div class="comparison">
    <button class="mode-label" aria-pressed="${mode === 'problem'}" data-action="mode:problem">Problema</button>
    <button class="switch" type="button" role="switch" aria-label="Alternar entre problema e solução" aria-checked="${mode === 'solution'}" data-action="toggle-mode"></button>
    <button class="mode-label" aria-pressed="${mode === 'solution'}" data-action="mode:solution">Solução</button>
  </div>`;
}

function render() {
  const [nodeId, screen] = view === 'case' ? caseScreen() : screens[view];
  const comparison = caseId === null ? '' : comparisonControls();
  const backLabel = caseId === null ? 'Voltar ao início' : 'Selecionar caso';
  const navigation = view === 'home' ? '' :
    `<div class="controls"><button class="back" data-action="home">${backLabel}</button>${comparison}</div>`;
  const figmaNode = nodeId ? ` data-figma-node="${nodeId}"` : '';
  app.innerHTML = `${navigation}<div class="screen"${figmaNode}>${screen()}</div>`;
}

app.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const actionName = target.dataset.action;
  let focusSelector = 'h1';
  if (actionName.startsWith('case:')) {
    caseId = Number(actionName.split(':')[1]);
    mode = 'problem';
    payment = 'minimum';
    view = 'case';
  } else if (actionName === 'toggle-mode' || actionName.startsWith('mode:')) {
    if (caseId === null) return;
    mode = actionName === 'toggle-mode' ? (mode === 'problem' ? 'solution' : 'problem') : actionName.split(':')[1];
    view = 'case';
    focusSelector = `[data-action="${actionName}"]`;
  } else if (actionName.startsWith('payment:')) {
    payment = actionName.split(':')[1];
    focusSelector = `[data-action="${actionName}"]`;
  } else if (actionName === 'continue-problem-one' && payment === 'total') {
    view = 'review-total';
  } else if (actionName === 'continue-problem-one' || actionName === 'continue-problem-three') {
    caseId = 2;
    mode = 'problem';
    view = 'case';
  } else if (actionName === 'pause-banner') {
    bannerPaused = !bannerPaused;
    target.setAttribute('aria-pressed', String(bannerPaused));
    return;
  } else if (actionName === 'focus-on' || actionName === 'focus-off') {
    view = actionName === 'focus-on' ? 'focus' : 'case';
  } else {
    const destination = destinations[actionName];
    if (!destination) return;
    if (actionName === 'home' || actionName === 'start-payment') caseId = null;
    if (actionName === 'change-payment' && caseId !== null) {
      caseId = 1;
      mode = 'solution';
    }
    view = destination;
  }
  render();
  app.querySelector(focusSelector).focus({ preventScroll: focusSelector !== 'h1' });
});

setInterval(() => {
  if (caseId !== 3 || mode !== 'problem' || view !== 'case' || bannerPaused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  bannerAlternate = !bannerAlternate;
  const banner = app.querySelector('.banner');
  banner.querySelector('.card-title').textContent = bannerAlternate ? 'SEU NOVO CARTÃO!' : 'EMPRÉSTIMO LIBERADO!';
  banner.querySelector('.card-body').textContent = bannerAlternate ? 'Mais benefícios. Peça agora.' : 'Uma oferta para você. Solicite agora.';
}, 5000);

render();

const fontSizes = [100, 112.5, 125, 150, 175, 200];
let fontIndex = 0;
const smaller = document.querySelector('#font-smaller');
const larger = document.querySelector('#font-larger');
const contrast = document.querySelector('#contrast');
const fontStatus = document.querySelector('#font-status');

function setFontSize(nextIndex) {
  fontIndex = Math.max(0, Math.min(fontSizes.length - 1, nextIndex));
  const size = fontSizes[fontIndex];
  document.documentElement.style.fontSize = `${size}%`;
  fontStatus.textContent = `Tamanho da fonte: ${size.toLocaleString('pt-BR')}%`;
  smaller.setAttribute('aria-disabled', String(fontIndex === 0));
  larger.setAttribute('aria-disabled', String(fontIndex === fontSizes.length - 1));
}

smaller.addEventListener('click', () => setFontSize(fontIndex - 1));
larger.addEventListener('click', () => setFontSize(fontIndex + 1));
contrast.addEventListener('click', () => {
  const enabled = document.documentElement.classList.toggle('high-contrast');
  contrast.setAttribute('aria-pressed', String(enabled));
});
setFontSize(0);
