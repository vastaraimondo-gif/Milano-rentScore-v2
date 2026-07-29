export const dataMode = 'Beta demo · pronto per database';
export const refreshStatus = 'Non ancora collegato a Supabase';

export const zoneMedie = {
  'Città Studi': { euroMq: 20.3, fontePrimaria: 'Immobiliare.it / idealista', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Stabile', variazioneAnnua: '-1,5% / -2,6%', affidabilita: 91, metro: 'M2', mood: 'Universitaria', colore: 'emerald', x: '58%', y: '48%' },
  Lambrate: { euroMq: 19.2, fontePrimaria: 'Immobiliare.it / idealista', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Stabile', variazioneAnnua: '-0,9% / -2,6%', affidabilita: 89, metro: 'M2', mood: 'Comoda', colore: 'emerald', x: '66%', y: '47%' },
  Bicocca: { euroMq: 18.8, fontePrimaria: 'Immobiliare.it / idealista', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Leggero calo', variazioneAnnua: '-1,9% / -2,1%', affidabilita: 88, metro: 'M5', mood: 'Student friendly', colore: 'emerald', x: '54%', y: '28%' },
  Navigli: { euroMq: 24.2, fontePrimaria: 'Immobiliare.it / idealista', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Stabile / lieve crescita', variazioneAnnua: '+1,3% / -0,4%', affidabilita: 92, metro: 'M2', mood: 'Movida', colore: 'amber', x: '43%', y: '67%' },
  'Porta Romana': { euroMq: 23.9, fontePrimaria: 'Immobiliare.it', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Stabile', variazioneAnnua: '+0,3%', affidabilita: 87, metro: 'M3', mood: 'Centrale', colore: 'amber', x: '55%', y: '64%' },
  Loreto: { euroMq: 20.6, fontePrimaria: 'Immobiliare.it', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Leggero calo', variazioneAnnua: '-2,0%', affidabilita: 84, metro: 'M1 / M2', mood: 'Collegata', colore: 'emerald', x: '56%', y: '42%' },
  Isola: { euroMq: 22.5, fontePrimaria: 'Immobiliare.it', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Leggero calo', variazioneAnnua: '-2,0%', affidabilita: 86, metro: 'M5', mood: 'Trend', colore: 'rose', x: '48%', y: '36%' },
  Niguarda: { euroMq: 17.8, fontePrimaria: 'Immobiliare.it', fonteIstituzionale: 'OMI / Comune Milano', ultimoAggiornamento: 'Giugno 2026', trend: 'Leggero calo', variazioneAnnua: '-1,9%', affidabilita: 86, metro: 'Tram / M5 area', mood: 'Conveniente', colore: 'emerald', x: '43%', y: '23%' },
};

export const universita = [
  { nome: 'Politecnico', zona: 'Città Studi / Bovisa', tag: 'Tech' },
  { nome: 'Bocconi', zona: 'Porta Romana / Navigli', tag: 'Business' },
  { nome: 'Bicocca', zona: 'Bicocca / Niguarda', tag: 'Campus' },
  { nome: 'Statale', zona: 'Centro / Città Studi', tag: 'City' },
  { nome: 'IULM', zona: 'Romolo / Navigli', tag: 'Media' },
  { nome: 'Cattolica', zona: "Sant'Ambrogio", tag: 'Centro' },
];

export const pipelineSteps = [
  { nome: '1. Fonti mercato', stato: 'Demo', descrizione: 'Report pubblici, portali immobiliari, dataset OMI e Comune Milano.' },
  { nome: '2. Database', stato: 'Da collegare', descrizione: 'Tabella market_estimates su Supabase/PostgreSQL.' },
  { nome: '3. Refresh', stato: 'Da automatizzare', descrizione: 'Aggiornamento giornaliero per annunci, mensile per report, semestrale per OMI.' },
  { nome: '4. Frontend', stato: 'Pronto', descrizione: 'La pagina legge già campi compatibili con un database reale.' },
];

export const schemaFields = [
  'zona',
  'euro_mq',
  'fonte_mercato',
  'fonte_istituzionale',
  'ultimo_aggiornamento',
  'trend_30g',
  'trend_annuo',
  'affidabilita',
  'created_at',
];
