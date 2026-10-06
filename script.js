const app = document.querySelector('#app');

const state = {
  caseId: null,
  mode: 'problem',
  view: 'main',
  payment: 'minimum',
  focus: false,
  bannerAlternate: false,
};

const cases = [
  { id: 1, title: 'Escolha da modalidade de pagamento', problem: 'Opções ambíguas', solution: 'Instruções claras' },
  { id: 2, title: 'Revisão antes de confirmar', problem: 'Sem revisão', solution: 'Revisar mínimo' },
  { id: 3, title: 'Controle de distrações e ofertas', problem: 'Ofertas automáticas', solution: 'Controle de ofertas' },
];

function text(value, x, y, width, height, type = 'body') {
  return `<p class="text ${type}" style="left:${x}px;top:${y}px;width:${width}px;height:${height}px">${value}</p>`;
}

function card(title, body, y, height, options = {}) {
  const className = `card${options.tone ? ` ${options.tone}` : ''}`;
  const inner = `<span class="card-title">${title}</span>${body ? `<span class="card-body">${body}</span>` : ''}`;
  if (options.action) {
    return `<button class="${className}" style="left:28px;top:${y}px;height:${height}px" data-action="${options.action}" aria-label="${title.replace(/<[^>]+>/g, '')}">${inner}</button>`;
  }
  return `<div class="${className}" style="left:28px;top:${y}px;height:${height}px">${inner}</div>`;
}

function action(label, y, actionName) {
  return `<div class="action-row" style="top:${y}px"><button class="action" data-action="${actionName}">${label}</button></div>`;
}

function brand() {
  return text('CLARO / Internet Banking', 28, 28, 424, 30, 'brand');
}

function step(label) {
  return text(label, 28, 74, 424, 24, 'step');
}

function problemOne() {
  const options = [
    { key: 'total', title: 'Integral', y: 405, height: 62 },
    { key: 'minimum', title: 'Mínimo • R$ 300,00', body: 'A escolha que cabe no seu bolso.', y: 483, height: 95 },
    { key: 'financing', title: 'Financiamento', y: 594, height: 62 },
  ];
  return brand() +
    text('Sua fatura', 28, 74, 424, 44, 'title') +
    text('R$ 1.500,00', 28, 134, 424, 55, 'amount') +
    text('Vencimento: 10/10/2026', 28, 205, 424, 27) +
    card('Mais liberdade para você!', 'Pague do seu jeito e aproveite seu limite.', 248, 95, { tone: 'lavender' }) +
    text('Escolha uma opção', 28, 359, 424, 30, 'heading') +
    options.map(option => card(`${state.payment === option.key ? '●' : '○'} ${option.title}`, option.body, option.y, option.height, { tone: state.payment === option.key ? 'lavender' : '', action: `payment:${option.key}` })).join('') +
    action('Continuar', 672, 'continue-problem-one');
}

function solutionOne() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Como deseja pagar?', 28, 114, 424, 44, 'title') +
    text('Fatura: R$ 1.500,00', 28, 174, 424, 38, 'subtotal') +
    card('Pagamento total • R$ 1.500', 'Quita esta fatura. Saldo restante: R$ 0,00.', 228, 95) +
    action('Selecionar pagamento total', 339, 'select-total') +
    card('Pagamento mínimo • R$ 300', 'Paga apenas parte da fatura. Restam R$ 1.200 sujeitos a juros e encargos.', 407, 117) +
    action('Selecionar pagamento mínimo', 540, 'select-minimum') +
    text('Parcelamento: consulte as condições e o custo total antes de contratar.', 28, 608, 424, 67, 'body muted');
}

function problemTwo() {
  return brand() +
    text('Tudo pronto!', 28, 74, 424, 44, 'title') +
    card('Só falta um toque', 'Vamos resolver sua fatura e liberar novas possibilidades!', 134, 117, { tone: 'lavender' }) +
    text('Opção escolhida: mínimo', 28, 267, 424, 27) +
    text('Ao prosseguir, você concorda com as condições gerais de financiamento do saldo e os termos aplicáveis ao seu contrato.', 28, 310, 424, 38, 'small') +
    action('Confirmar', 364, 'confirm-minimum') +
    card('Aproveite também', 'Crédito disponível para seus planos!', 432, 95);
}

function solutionTwo() {
  return brand() +
    step('Etapa 2 de 3 • Revisar') +
    text('Revise antes de pagar', 28, 114, 424, 44, 'title') +
    card('Pagamento mínimo selecionado', 'Valor da fatura: R$ 1.500,00\nVocê pagará: R$ 300,00\nSaldo restante: R$ 1.200,00', 174, 140) +
    card('Atenção: a fatura não será quitada', 'R$ 1.200 ficarão em aberto, sujeitos a juros e encargos. Consulte as condições do contrato antes de continuar.', 330, 140, { tone: 'warning' }) +
    text('Se deseja quitar a fatura, altere para pagamento total.', 28, 486, 424, 49) +
    action('Alterar opção de pagamento', 551, 'change-payment') +
    action('Confirmar pagamento de R$ 300', 619, 'confirm-minimum');
}

function problemThree() {
  const bannerTitle = state.bannerAlternate ? 'SEU NOVO CARTÃO!' : 'EMPRÉSTIMO LIBERADO!';
  const bannerBody = state.bannerAlternate ? 'Mais benefícios. Peça agora.' : 'Uma oferta para você. Solicite agora.';
  return brand() +
    text('Pagar fatura', 28, 74, 424, 44, 'title') +
    card(bannerTitle, bannerBody, 134, 95, { tone: 'lavender' }) +
    card('INVISTA HOJE', 'Novas oportunidades a cada instante.', 245, 95, { tone: 'peach' }) +
    text('Fatura: R$ 1.500,00', 28, 356, 424, 41, 'subtotal') +
    card('● Mínimo • R$ 300', '○ Total • R$ 1.500\n○ Parcelamento', 413, 117) +
    card('Seu cartão pode ser melhor', 'Conheça o upgrade e mais benefícios.', 546, 95, { tone: 'blue' }) +
    action('Continuar', 657, 'continue-problem-three');
}

function solutionThree() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Pagar fatura', 28, 114, 424, 44, 'title') +
    text('Você controla as ofertas desta tela.', 28, 174, 424, 27) +
    card('Ofertas pausadas', 'O conteúdo não avança sozinho.', 217, 95) +
    action('Ocultar ofertas • Entrar no modo foco', 328, 'focus-on') +
    text('Fatura: R$ 1.500,00', 28, 396, 424, 41, 'subtotal') +
    card('Pagamento total', 'Quita esta fatura.', 453, 95) +
    action('Selecionar pagamento total', 564, 'select-total') +
    card('Pagamento mínimo', 'Restam R$ 1.200 sujeitos a juros e encargos.', 632, 95) +
    action('Selecionar pagamento mínimo', 743, 'select-minimum');
}

function focusScreen() {
  return brand() +
    step('Etapa 1 de 3 • Escolher valor') +
    text('Pagar fatura', 28, 114, 424, 44, 'title') +
    text('Modo foco ativo • Ofertas ocultas', 28, 174, 424, 27, 'focus-status') +
    text('Fatura: R$ 1.500,00', 28, 217, 424, 41, 'subtotal') +
    card('Pagamento total', 'Quita a fatura. Saldo restante: R$ 0,00.', 274, 95) +
    action('Selecionar pagamento total', 385, 'select-total') +
    card('Pagamento mínimo', 'Paga R$ 300. Restam R$ 1.200 sujeitos a juros e encargos.', 453, 117) +
    action('Selecionar pagamento mínimo', 586, 'select-minimum') +
    action('Mostrar ofertas pausadas', 654, 'focus-off');
}

function reviewTotal() {
  return brand() +
    step('Etapa 2 de 3 • Revisar') +
    text('Revise antes de pagar', 28, 114, 424, 44, 'title') +
    card('Pagamento total selecionado', 'Fatura: R$ 1.500,00\nVocê pagará: R$ 1.500,00\nSaldo restante: R$ 0,00', 174, 140) +
    text('Este pagamento quita a fatura apresentada.', 28, 330, 424, 27) +
    action('Alterar opção de pagamento', 373, 'change-payment') +
    action('Confirmar pagamento de R$ 1.500', 441, 'confirm-total');
}

function receiptMinimum() {
  return brand() +
    step('Etapa 3 de 3 • Comprovante') +
    text('Pagamento realizado', 28, 114, 424, 44, 'title') +
    card('R$ 300,00 pagos', 'Modalidade: pagamento mínimo\nSaldo restante: R$ 1.200,00\nNúmero da operação: 001', 174, 140) +
    card('Ainda existe saldo em aberto', 'O saldo restante está sujeito a juros e encargos. A fatura não foi quitada.', 330, 117, { tone: 'warning' });
}

function receiptTotal() {
  return brand() +
    step('Etapa 3 de 3 • Comprovante') +
    text('Fatura quitada', 28, 114, 424, 44, 'title') +
    card('R$ 1.500,00 pagos', 'Modalidade: pagamento total\nSaldo restante: R$ 0,00\nNúmero da operação: 002', 174, 140);
}

function selectScreen() {
  return `<div class="screen select-screen">${brand()}${text('Selecione um caso', 28, 74, 424, 44, 'title')}` +
    cases.map((item, index) => `<button class="case-card" style="top:${134 + index * 111}px" data-action="case:${item.id}"><strong>0${item.id} • ${item.title}</strong><span>${item.problem} / ${item.solution}</span></button>`).join('') +
    '</div>';
}

function screenContents() {
  if (state.view === 'review-total') return ['3:554', reviewTotal()];
  if (state.view === 'review-minimum') return ['3:440', solutionTwo()];
  if (state.view === 'receipt-minimum') return ['3:580', receiptMinimum()];
  if (state.view === 'receipt-total') return ['3:597', receiptTotal()];
  if (state.view === 'focus') return ['3:631', focusScreen()];
  if (state.caseId === 1) return state.mode === 'problem' ? ['3:347', problemOne()] : ['3:381', solutionOne()];
  if (state.caseId === 2) return state.mode === 'problem' ? ['3:411', problemTwo()] : ['3:440', solutionTwo()];
  return state.mode === 'problem' ? [state.bannerAlternate ? '3:667' : '3:469', problemThree()] : ['3:503', solutionThree()];
}

function render() {
  if (state.caseId === null) {
    app.innerHTML = selectScreen();
    return;
  }
  const [nodeId, contents] = screenContents();
  app.innerHTML = `<div class="controls"><button class="back" data-action="home">Selecionar caso</button><div class="comparison"><button class="mode-label ${state.mode === 'problem' ? 'active' : ''}" data-action="mode:problem">Problema</button><button class="switch" type="button" role="switch" aria-label="Alternar entre problema e solução" aria-checked="${state.mode === 'solution'}" data-action="toggle-mode"></button><button class="mode-label ${state.mode === 'solution' ? 'active' : ''}" data-action="mode:solution">Solução</button></div></div><div class="screen" data-figma-node="${nodeId}">${contents}</div>`;
}

app.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const actionName = target.dataset.action;
  if (actionName === 'home') {
    state.caseId = null;
    state.view = 'main';
  } else if (actionName.startsWith('case:')) {
    state.caseId = Number(actionName.split(':')[1]);
    state.mode = 'problem';
    state.view = 'main';
    state.payment = 'minimum';
    state.focus = false;
  } else if (actionName === 'toggle-mode' || actionName.startsWith('mode:')) {
    state.mode = actionName === 'toggle-mode' ? (state.mode === 'problem' ? 'solution' : 'problem') : actionName.split(':')[1];
    state.view = 'main';
  } else if (actionName.startsWith('payment:')) {
    state.payment = actionName.split(':')[1];
  } else if (actionName === 'continue-problem-one') {
    if (state.payment === 'total') {
      state.view = 'review-total';
    } else {
      state.caseId = 2;
      state.mode = 'problem';
      state.view = 'main';
    }
  } else if (actionName === 'continue-problem-three') {
    state.caseId = 2;
    state.mode = 'problem';
    state.view = 'main';
  } else if (actionName === 'confirm-minimum') {
    state.view = 'receipt-minimum';
  } else if (actionName === 'select-total') {
    state.payment = 'total';
    state.view = 'review-total';
  } else if (actionName === 'select-minimum') {
    state.payment = 'minimum';
    state.view = 'review-minimum';
  } else if (actionName === 'change-payment') {
    state.caseId = 1;
    state.mode = 'solution';
    state.view = 'main';
  } else if (actionName === 'confirm-total') {
    state.view = 'receipt-total';
  } else if (actionName === 'focus-on') {
    state.focus = true;
    state.view = 'focus';
  } else if (actionName === 'focus-off') {
    state.focus = false;
    state.view = 'main';
  }
  render();
});

setInterval(() => {
  if (state.caseId === 3 && state.mode === 'problem' && state.view === 'main') {
    state.bannerAlternate = !state.bannerAlternate;
    render();
  }
}, 5000);

render();
