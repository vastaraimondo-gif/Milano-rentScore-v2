import { useMemo, useState } from 'react';
import {
  dataMode,
  refreshStatus,
  zoneMedie,
  universita,
  pipelineSteps,
  schemaFields,
} from './data/marketData.js';

function Badge({ children, className = '' }) {
  return <span className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${className}`}>{children}</span>;
}

function StatCard({ label, value, helper, dark = false }) {
  return (
    <div className={`rounded-3xl p-5 ${dark ? 'bg-white/10 text-white backdrop-blur' : 'bg-white text-slate-950 shadow-sm'}`}>
      <div className={dark ? 'text-sm text-slate-300' : 'text-sm font-bold text-slate-400'}>{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
      {helper && <div className={dark ? 'mt-1 text-sm text-cyan-100' : 'mt-1 text-sm text-slate-500'}>{helper}</div>}
    </div>
  );
}

export default function MilanoRentScore() {
  const [zona, setZona] = useState('Città Studi');
  const [canone, setCanone] = useState(850);
  const [mq, setMq] = useState(38);
  const [stanze, setStanze] = useState(1);
  const [profilo, setProfilo] = useState('Studente');
  const [copiato, setCopiato] = useState(false);
  const [annuncio, setAnnuncio] = useState(
    'Affittasi monolocale ristrutturato in zona Città Studi, 38 mq, vicino M2 Piola, canone 850 euro più spese. Ideale per studenti del Politecnico. Contratto regolare, libero subito.'
  );

  const dataZona = zoneMedie[zona] || zoneMedie['Città Studi'];
  const canoneStimato = Math.round(dataZona.euroMq * mq);
  const differenza = Math.round(((canone - canoneStimato) / canoneStimato) * 100);
  const scorePrezzo = Math.max(3, Math.min(10, 10 - Math.abs(differenza) / 5));
  const scoreMq = mq >= 45 ? 9.2 : mq >= 35 ? 8.5 : mq >= 25 ? 7.2 : 5.8;
  const scoreStanze = stanze >= 3 ? 9 : stanze >= 2 ? 8.4 : 7.4;
  const scoreStileVita = profilo === 'Studente' ? 8.8 : profilo === 'Giovane lavoratore' ? 8.4 : 8.1;
  const scoreAffidabilita = dataZona.affidabilita / 10;
  const rentScore = (scorePrezzo * 0.45 + scoreMq * 0.15 + scoreStanze * 0.15 + scoreStileVita * 0.15 + scoreAffidabilita * 0.1).toFixed(1);
  const giudizio = differenza <= 7 && differenza >= -10 ? 'Prezzo equilibrato' : differenza > 7 ? 'Sopra mercato' : 'Molto interessante';
  const badgeColor = dataZona.colore === 'emerald' ? 'bg-emerald-100 text-emerald-700' : dataZona.colore === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
  const trendColor = dataZona.trend.toLowerCase().includes('cresc') ? 'text-emerald-700 bg-emerald-100' : dataZona.trend.toLowerCase().includes('calo') ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-100';

  const marketPulse = useMemo(() => {
    const values = Object.values(zoneMedie);
    const avg = values.reduce((sum, z) => sum + z.euroMq, 0) / values.length;
    const affidabilitaMedia = Math.round(values.reduce((sum, z) => sum + z.affidabilita, 0) / values.length);
    const zoneSopraMedia = Object.entries(zoneMedie).filter(([, z]) => z.euroMq > avg).length;
    const zonaPiuConveniente = Object.entries(zoneMedie).sort((a, b) => a[1].euroMq - b[1].euroMq)[0];
    const zonaPiuCara = Object.entries(zoneMedie).sort((a, b) => b[1].euroMq - a[1].euroMq)[0];
    return {
      ultimoAggiornamento: 'oggi ore 03:00',
      annunciAnalizzati: '1.245',
      mediaMilano: avg.toFixed(1),
      trend30: '+0,4%',
      affidabilitaMedia,
      zoneSopraMedia,
      zonaPiuConveniente,
      zonaPiuCara,
    };
  }, []);

  const consigli = useMemo(() => {
    const base = [];
    if (differenza > 15) base.push('Il canone è sensibilmente sopra la stima di zona: chiedi motivazioni, servizi inclusi e margine di trattativa.');
    if (differenza > 7 && differenza <= 15) base.push('Il canone è sopra la stima: confronta almeno altri 3 annunci simili nella stessa zona.');
    if (differenza <= -10) base.push("Il prezzo sembra interessante: verifica comunque contratto, spese e condizioni dell'immobile.");
    if (mq < 25) base.push('La metratura è ridotta: valuta bene vivibilità e spazi contenitivi.');
    if (profilo === 'Studente') base.push('Controlla tempi casa-università e collegamenti serali.');
    if (profilo === 'Giovane lavoratore') base.push('Valuta distanza da metro e tempi verso ufficio nelle ore di punta.');
    if (profilo === 'Coppia giovane') base.push('Verifica privacy degli spazi, rumorosità e presenza di servizi vicini.');
    return base.slice(0, 3);
  }, [differenza, mq, profilo]);

  const analisiAnnuncio = useMemo(() => {
    const testo = annuncio.toLowerCase();
    const latiPositivi = [];
    const attenzioni = [];
    const domande = [];
    if (testo.includes('metro') || testo.includes('m1') || testo.includes('m2') || testo.includes('m3') || testo.includes('m5')) latiPositivi.push('L’annuncio cita collegamenti con la metropolitana.');
    if (testo.includes('ristrutturato') || testo.includes('nuovo')) latiPositivi.push('L’immobile sembra presentato come ristrutturato o in buone condizioni.');
    if (testo.includes('contratto') || testo.includes('regolare')) latiPositivi.push('Viene citato un contratto: buon segnale di trasparenza.');
    if (testo.includes('student') || testo.includes('politecnico') || testo.includes('universit')) latiPositivi.push('Il testo è coerente con un target studenti o universitario.');
    if (testo.includes('spese escluse') || testo.includes('più spese') || testo.includes('+ spese')) attenzioni.push('Le spese sembrano escluse: bisogna chiedere il totale mensile reale.');
    if (!testo.includes('contratto')) attenzioni.push('Non viene citato chiaramente il tipo di contratto.');
    if (!testo.includes('mq') && !testo.includes('metri')) attenzioni.push('La metratura non è chiara: va verificata prima della visita.');
    if (testo.includes('solo referenziati') || testo.includes('garanzie')) attenzioni.push('Potrebbero essere richieste garanzie aggiuntive.');
    domande.push('Il canone indicato include spese condominiali, utenze e riscaldamento?');
    domande.push('Che tipo di contratto viene proposto e per quale durata?');
    domande.push('È possibile ricevere planimetria, foto aggiornate e indirizzo preciso prima della visita?');
    return {
      latiPositivi: latiPositivi.length ? latiPositivi : ['Il testo contiene alcune informazioni utili, ma servono più dettagli per una valutazione completa.'],
      attenzioni: attenzioni.length ? attenzioni : ['Non emergono criticità evidenti dal testo demo, ma è sempre necessario verificare contratto e costi totali.'],
      domande,
    };
  }, [annuncio]);

  const reportTesto = useMemo(() => {
    return `MILANO RENT SCORE - REPORT DEMO\nZona: ${zona}\nProfilo: ${profilo}\nCanone richiesto: € ${canone}/mese\nMetratura: ${mq} mq\nStanze: ${stanze}\nValore zona: € ${dataZona.euroMq}/mq/mese\nCanone stimato: € ${canoneStimato}/mese\nScostamento: ${differenza > 0 ? '+' : ''}${differenza}%\nRent Score: ${rentScore}/10\nGiudizio: ${giudizio}\nAffidabilità dato: ${dataZona.affidabilita}/100\nFonte mercato: ${dataZona.fontePrimaria}\nFonte istituzionale: ${dataZona.fonteIstituzionale}\nAggiornamento: ${dataZona.ultimoAggiornamento}\nMarket Pulse: update ${marketPulse.ultimoAggiornamento}, media Milano € ${marketPulse.mediaMilano}/mq\nModalità dati: ${dataMode}\n\nConsigli rapidi:\n- ${consigli.join('\n- ')}\n\nDomande utili:\n- ${analisiAnnuncio.domande.join('\n- ')}`;
  }, [zona, profilo, canone, mq, stanze, dataZona, canoneStimato, differenza, rentScore, giudizio, consigli, analisiAnnuncio.domande, marketPulse]);

  const copiaReport = async () => {
    try {
      await navigator.clipboard.writeText(reportTesto);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 1800);
    } catch {
      setCopiato(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute left-10 top-20 h-56 w-56 rounded-full bg-cyan-400 blur-3xl" />
          <div className="absolute right-16 top-32 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-emerald-400 blur-3xl" />
        </div>
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-400" />
              <div className="relative text-xl font-black text-white">MR</div>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Milano Rent Score</div>
              <div className="text-xs text-blue-100">Affitti chiari per giovani a Milano</div>
            </div>
          </div>
          <div className="hidden items-center gap-5 text-sm text-blue-100 md:flex">
            <a href="#pulse" className="hover:text-white">Market Pulse</a>
            <a href="#data-engine" className="hover:text-white">Data Engine</a>
            <a href="#score" className="hover:text-white">Calcola</a>
            <a href="#market" className="hover:text-white">Market Intelligence</a>
            <a href="#report" className="hover:text-white">Report</a>
            <a href="#beta" className="rounded-full bg-white px-4 py-2 font-bold text-slate-950 hover:bg-cyan-200">Prova beta</a>
          </div>
        </nav>
        <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-20">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur">V8 · Data Engine ready</div>
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">Il progetto reale, pronto per collegare dati vivi.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">Milano Rent Score V8 introduce il livello Data Engine: oggi usa dati demo, ma la struttura è pronta per Supabase, aggiornamenti automatici e fonti di mercato reali.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#data-engine" className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-500/20 hover:bg-cyan-300">Vedi Data Engine</a>
              <a href="#pulse" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center font-bold text-white hover:bg-white/20">Apri Market Pulse</a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <StatCard label="Beta" value="pubblica" dark />
              <StatCard label="DB" value="ready" dark />
              <StatCard label="API" value="future" dark />
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-500">Stima mercato V8</div>
                  <div className="text-2xl font-black">{zona} · {profilo}</div>
                </div>
                <Badge className={badgeColor}>{giudizio}</Badge>
              </div>
              <div className="my-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 p-6 text-white">
                <div className="text-sm text-blue-100">Rent Score</div>
                <div className="text-6xl font-black">{rentScore}/10</div>
                <div className="mt-2 text-blue-50">Stima: € {canoneStimato}/mese · Scostamento {differenza > 0 ? '+' : ''}{differenza}%</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4"><b>Valore zona</b><br />€ {dataZona.euroMq}/mq/mese</div>
                <div className="rounded-2xl bg-slate-50 p-4"><b>Affidabilità</b><br />{dataZona.affidabilita}/100</div>
                <div className="rounded-2xl bg-slate-50 p-4"><b>Modalità dati</b><br />{dataMode}</div>
                <div className="rounded-2xl bg-slate-50 p-4"><b>Stato refresh</b><br />{refreshStatus}</div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main className="bg-slate-50">
        <section className="bg-amber-50 px-6 py-5 text-amber-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-3xl border border-amber-200 bg-white/70 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-black">Beta pubblica · dati dimostrativi</div>
              <div className="text-sm">Il prodotto è reale, ma i valori immobiliari sono ancora demo. Gli aggiornamenti automatici partiranno solo dopo il collegamento a database e fonti dati autorizzate.</div>
            </div>
            <a href="#data-engine" className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-amber-950 hover:bg-amber-300">Capisci il Data Engine</a>
          </div>
        </section>

        <section id="pulse" className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Badge className="mb-4 bg-cyan-400/20 text-cyan-200">Market Pulse V8</Badge>
                <h2 className="text-5xl font-black tracking-tight md:text-6xl">Market Pulse Milano</h2>
                <p className="mt-4 max-w-2xl text-slate-300">Card grande per mostrare il polso del mercato: oggi demo, domani alimentata da database e refresh automatici.</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-6 py-4 text-sm font-bold text-cyan-100 backdrop-blur">Ultimo aggiornamento demo: {marketPulse.ultimoAggiornamento}</div>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-700 via-slate-900 to-cyan-700 p-8 shadow-2xl md:p-10">
              <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="text-sm font-bold uppercase tracking-widest text-cyan-200">Media affitti Milano</div>
                  <div className="mt-3 text-7xl font-black md:text-8xl">€ {marketPulse.mediaMilano}</div>
                  <div className="mt-2 text-xl font-bold text-cyan-100">/mq al mese</div>
                  <p className="mt-6 max-w-xl text-slate-200">Dato demo calcolato sulle zone presenti nel prototipo. Nella versione reale sarà alimentato da Supabase e flussi dati aggiornati.</p>
                </div>
                <div className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-xl">
                  <div className="text-sm font-bold text-slate-500">Annunci analizzati</div>
                  <div className="mt-3 text-5xl font-black">{marketPulse.annunciAnalizzati}</div>
                  <div className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">demo refresh</div>
                </div>
                <div className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-xl">
                  <div className="text-sm font-bold text-slate-500">Trend 30 giorni</div>
                  <div className="mt-3 text-5xl font-black text-emerald-600">{marketPulse.trend30}</div>
                  <div className="mt-3 rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">mercato stabile</div>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                <StatCard label="Affidabilità media" value={`${marketPulse.affidabilitaMedia}/100`} dark />
                <StatCard label="Zone sopra media" value={marketPulse.zoneSopraMedia} dark />
                <StatCard label="Più conveniente" value={marketPulse.zonaPiuConveniente[0]} helper={`€ ${marketPulse.zonaPiuConveniente[1].euroMq}/mq`} dark />
                <StatCard label="Più cara" value={marketPulse.zonaPiuCara[0]} helper={`€ ${marketPulse.zonaPiuCara[1].euroMq}/mq`} dark />
              </div>
            </div>
          </div>
        </section>

        <section id="data-engine" className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <Badge className="mb-4 bg-violet-100 text-violet-800">Nuova funzione V8</Badge>
              <h2 className="text-4xl font-black tracking-tight">Data Engine pronto per Supabase</h2>
              <p className="mt-4 text-slate-600">Questa sezione chiarisce cosa è già pronto e cosa va collegato prima di avere aggiornamenti automatici reali.</p>
              <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-sm text-slate-200"><b>Stato attuale:</b> dati demo nel frontend. <br /><b>Prossimo passo reale:</b> database Supabase + import fonti + job di aggiornamento.</div>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-xl md:col-span-3">
              <div className="grid gap-4 md:grid-cols-2">
                {pipelineSteps.map((step) => (
                  <div key={step.nome} className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-black">{step.nome}</div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{step.stato}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{step.descrizione}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
                <div className="mb-3 font-black">Schema database previsto</div>
                <div className="flex flex-wrap gap-2">{schemaFields.map((field) => <span key={field} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-cyan-100">{field}</span>)}</div>
              </div>
              <div className="mt-5 rounded-3xl bg-blue-50 p-5 text-sm text-blue-900"><b>Nota operativa:</b> in Vite prepareremo il codice in modo che i dati possano rimanere demo oppure essere sostituiti da una chiamata a Supabase senza rifare l'interfaccia.</div>
            </div>
          </div>
        </section>

        <section id="score" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black tracking-tight">Calcolatore V8</h2>
            <p className="mt-4 text-slate-600">Il canone stimato deriva da: valore €/mq della zona × metratura dell'immobile. Il Data Engine rende la struttura pronta per aggiornamenti automatici futuri.</p>
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">I valori sono demo, ma il modello dati è già compatibile con una tabella reale.</div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-xl md:col-span-3">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Zona<select value={zona} onChange={(e) => setZona(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-normal outline-none focus:border-blue-500">{Object.keys(zoneMedie).map((z) => <option key={z}>{z}</option>)}</select></label>
              <label className="text-sm font-bold text-slate-700">Profilo<select value={profilo} onChange={(e) => setProfilo(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-normal outline-none focus:border-blue-500"><option>Studente</option><option>Giovane lavoratore</option><option>Coppia giovane</option></select></label>
              <label className="text-sm font-bold text-slate-700">Canone richiesto (€)<input value={canone} onChange={(e) => setCanone(Number(e.target.value))} type="number" className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-normal outline-none focus:border-blue-500" /></label>
              <label className="text-sm font-bold text-slate-700">Metri quadri<input value={mq} onChange={(e) => setMq(Number(e.target.value))} type="number" className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-normal outline-none focus:border-blue-500" /></label>
              <label className="text-sm font-bold text-slate-700 md:col-span-2">Numero stanze<input value={stanze} onChange={(e) => setStanze(Number(e.target.value))} type="number" className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-normal outline-none focus:border-blue-500" /></label>
            </div>
            <div className="mt-6 grid gap-4 rounded-3xl bg-slate-950 p-6 text-white md:grid-cols-4">
              <div><div className="text-sm text-slate-400">Rent Score</div><div className="text-5xl font-black text-cyan-300">{rentScore}</div></div>
              <div><div className="text-sm text-slate-400">Canone stimato</div><div className="mt-2 text-xl font-bold">€ {canoneStimato}</div></div>
              <div><div className="text-sm text-slate-400">Scostamento</div><div className="mt-2 text-xl font-bold">{differenza > 0 ? '+' : ''}{differenza}%</div></div>
              <div><div className="text-sm text-slate-400">Giudizio</div><div className="mt-2 text-xl font-bold">{giudizio}</div></div>
            </div>
            <div className="mt-5 rounded-3xl bg-slate-50 p-5"><div className="mb-3 font-black">Consigli rapidi</div><div className="space-y-2 text-sm text-slate-700">{consigli.map((c) => <div key={c}>✓ {c}</div>)}</div></div>
          </div>
        </section>

        <section id="market" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-5">
            <div className="md:col-span-2">
              <Badge className="mb-4 bg-blue-100 text-blue-800">Market Intelligence</Badge>
              <h2 className="text-4xl font-black tracking-tight">Dati zona selezionata</h2>
              <p className="mt-4 text-slate-600">Vista trasparente dei dati usati dal calcolatore: valore €/mq, fonti, trend, aggiornamento e affidabilità.</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-xl md:col-span-3">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Zona selezionata" value={zona} helper={`${dataZona.metro} · ${dataZona.mood}`} />
                <StatCard label="Affitto medio" value={`€ ${dataZona.euroMq}`} helper="al mq / mese" />
                <StatCard label="Affidabilità dato" value={`${dataZona.affidabilita}/100`} helper="fonte + aggiornamento" />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white p-5">
                  <div className="text-sm font-bold text-slate-400">Fonti dati</div>
                  <div className="mt-3 text-sm text-slate-700"><b>Mercato:</b> {dataZona.fontePrimaria}</div>
                  <div className="mt-2 text-sm text-slate-700"><b>Istituzionale:</b> {dataZona.fonteIstituzionale}</div>
                  <div className="mt-2 text-sm text-slate-700"><b>Aggiornamento:</b> {dataZona.ultimoAggiornamento}</div>
                </div>
                <div className="rounded-3xl bg-white p-5">
                  <div className="text-sm font-bold text-slate-400">Trend zona</div>
                  <div className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-black ${trendColor}`}>{dataZona.trend}</div>
                  <div className="mt-3 text-sm text-slate-700">Variazione annua rilevata: {dataZona.variazioneAnnua}</div>
                  <div className="mt-2 text-sm text-slate-500">Indicatore demo basato su report di mercato pubblici.</div>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="grid grid-cols-4 bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"><div>Zona</div><div>€/mq</div><div>Trend</div><div>Affidabilità</div></div>
                {Object.entries(zoneMedie).map(([nome, info]) => (
                  <button key={nome} onClick={() => setZona(nome)} className="grid w-full grid-cols-4 px-4 py-3 text-left text-sm hover:bg-blue-50">
                    <div className="font-bold">{nome}</div><div>€ {info.euroMq}</div><div>{info.trend}</div><div>{info.affidabilita}/100</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="analizza" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-5">
            <div className="md:col-span-2">
              <Badge className="mb-4 bg-cyan-100 text-cyan-800">Analisi annuncio</Badge>
              <h2 className="text-4xl font-black tracking-tight">Analizza un annuncio</h2>
              <p className="mt-4 text-slate-600">Incolla il testo di un annuncio immobiliare. Il prototipo evidenzia punti positivi, attenzioni e domande da fare prima della visita.</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-xl md:col-span-3">
              <label className="text-sm font-bold text-slate-700">Testo annuncio<textarea value={annuncio} onChange={(e) => setAnnuncio(e.target.value)} className="mt-2 min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white p-4 font-normal leading-7 outline-none focus:border-blue-500" placeholder="Incolla qui il testo dell'annuncio..." /></label>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-emerald-50 p-5"><div className="mb-3 font-black text-emerald-800">Punti positivi</div><div className="space-y-2 text-sm text-emerald-900">{analisiAnnuncio.latiPositivi.map((item) => <div key={item}>✓ {item}</div>)}</div></div>
                <div className="rounded-3xl bg-amber-50 p-5"><div className="mb-3 font-black text-amber-800">Da verificare</div><div className="space-y-2 text-sm text-amber-900">{analisiAnnuncio.attenzioni.map((item) => <div key={item}>! {item}</div>)}</div></div>
                <div className="rounded-3xl bg-blue-50 p-5"><div className="mb-3 font-black text-blue-800">Domande utili</div><div className="space-y-2 text-sm text-blue-900">{analisiAnnuncio.domande.map((item) => <div key={item}>? {item}</div>)}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="report" className="bg-slate-100">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-5">
            <div className="md:col-span-2">
              <Badge className="mb-4 bg-blue-100 text-blue-800">Report V8</Badge>
              <h2 className="text-4xl font-black tracking-tight">Report finale dell'immobile</h2>
              <p className="mt-4 text-slate-600">Scheda riassuntiva con canone richiesto, canone stimato, scostamento, fonti, market pulse e modalità dati.</p>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-xl md:col-span-3">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start">
                <div><div className="text-sm font-bold text-slate-400">Scheda immobile demo</div><h3 className="mt-1 text-3xl font-black">{zona} · € {canone}/mese</h3><p className="mt-2 text-slate-600">Stima mercato: € {canoneStimato}/mese · {mq} mq · {stanze} stanza/e</p></div>
                <div className="rounded-3xl bg-slate-950 px-6 py-4 text-center text-white"><div className="text-xs text-slate-400">Rent Score</div><div className="text-4xl font-black text-cyan-300">{rentScore}</div></div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-blue-50 p-5"><div className="text-sm font-bold text-blue-700">Prezzo</div><div className="mt-2 text-2xl font-black">{giudizio}</div><div className="mt-1 text-sm text-blue-900">Scostamento: {differenza > 0 ? '+' : ''}{differenza}%</div></div>
                <div className="rounded-3xl bg-emerald-50 p-5"><div className="text-sm font-bold text-emerald-700">Valore zona</div><div className="mt-2 text-2xl font-black">€ {dataZona.euroMq}/mq</div><div className="mt-1 text-sm text-emerald-900">{dataZona.ultimoAggiornamento}</div></div>
                <div className="rounded-3xl bg-amber-50 p-5"><div className="text-sm font-bold text-amber-700">Data mode</div><div className="mt-2 text-xl font-black">Beta demo</div><div className="mt-1 text-sm text-amber-900">pronto per DB</div></div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5"><div className="mb-3 font-black">Checklist prima della visita</div><div className="space-y-2 text-sm text-slate-700"><div>□ Chiedere costo totale mensile incluse spese</div><div>□ Verificare contratto e durata</div><div>□ Richiedere planimetria e indirizzo preciso</div><div>□ Confrontare almeno 3 annunci simili nella stessa zona</div></div></div>
                <div className="rounded-3xl bg-slate-950 p-5 text-white"><div className="mb-3 font-black">Sintesi condivisibile</div><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">{reportTesto}</pre></div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={copiaReport} className="rounded-2xl bg-blue-700 px-6 py-4 font-black text-white hover:bg-blue-800">{copiato ? 'Report copiato' : 'Copia report'}</button>
                <button onClick={() => window.print()} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-900 hover:bg-slate-50">Stampa / salva PDF</button>
              </div>
            </div>
          </div>
        </section>

        <section id="mappa" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
            <div><h2 className="text-4xl font-black tracking-tight">Mappa demo di Milano</h2><p className="mt-4 text-slate-600">Ogni zona mostra valore €/mq e può essere selezionata per aggiornare calcolatore, Market Intelligence e report.</p><div className="mt-6 flex flex-wrap gap-3 text-sm font-bold"><span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">Conveniente</span><span className="rounded-full bg-amber-100 px-4 py-2 text-amber-700">Equilibrata</span><span className="rounded-full bg-rose-100 px-4 py-2 text-rose-700">Cara</span></div></div>
            <div className="relative h-[430px] rounded-[2rem] bg-gradient-to-br from-slate-100 to-blue-50 p-6 shadow-inner">
              <div className="absolute inset-8 rounded-[45%] border-4 border-slate-300 bg-white/60" />
              <div className="absolute left-[18%] top-[48%] h-2 w-[64%] rotate-[-12deg] rounded-full bg-blue-300" />
              <div className="absolute left-[22%] top-[55%] h-2 w-[58%] rotate-[18deg] rounded-full bg-emerald-300" />
              <div className="absolute left-[45%] top-[15%] h-[70%] w-2 rounded-full bg-violet-300" />
              {Object.entries(zoneMedie).map(([nome, z]) => (
                <button key={nome} onClick={() => setZona(nome)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl px-3 py-2 text-xs font-black text-slate-950 shadow-lg transition hover:scale-110 ${z.colore === 'emerald' ? 'bg-emerald-300' : z.colore === 'amber' ? 'bg-amber-300' : 'bg-rose-300'}`} style={{ left: z.x, top: z.y }}>
                  <div>{nome}</div><div className="text-[10px] font-bold">€ {z.euroMq}/mq</div>
                </button>
              ))}
              <div className="absolute bottom-5 left-6 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl">Zona selezionata: {zona}</div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-4xl font-black tracking-tight">Domande frequenti</h2>
            <div className="mt-8 space-y-4">
              {[
                ['I dati si aggiornano già automaticamente?', 'No. In questa V8 sono dati demo. L’interfaccia è pronta, ma per l’aggiornamento reale serve collegare Supabase e una fonte dati autorizzata.'],
                ['Perché allora è il progetto reale?', 'Perché design, UX, logica, report e struttura dati sono già quelli del prodotto. Mancano solo backend e import dati reali.'],
                ['Si può pubblicare subito?', 'Sì, come beta pubblica con disclaimer dati dimostrativi.'],
                ['Cosa cambia con Vite?', 'Convertiremo questa pagina in un progetto React installabile, versionabile su GitHub e pubblicabile su Vercel.'],
              ].map((faq) => (
                <div key={faq[0]} className="rounded-3xl border border-slate-100 bg-slate-50 p-6"><div className="font-black">{faq[0]}</div><div className="mt-2 text-slate-600">{faq[1]}</div></div>
              ))}
            </div>
          </div>
        </section>

        <section id="beta" className="mx-auto max-w-7xl px-6 py-16">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 to-cyan-500 p-8 text-white shadow-2xl md:p-12">
            <div className="max-w-3xl"><Badge className="mb-4 bg-white/20 text-white">Beta pubblica V8</Badge><h2 className="text-4xl font-black tracking-tight">Pronto per Vite, GitHub e Vercel.</h2><p className="mt-4 text-lg text-blue-50">La V8 rende chiaro che Milano Rent Score è un prodotto reale con dati demo e architettura pronta per database e aggiornamenti automatici.</p><a href="#data-engine" className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-black text-blue-700 hover:bg-blue-50">Rivedi Data Engine</a></div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3"><div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white"><div className="absolute inset-1 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-400" /><div className="relative font-black text-white">MR</div></div><div><div className="font-black">Milano Rent Score</div><div className="text-sm text-slate-400">Beta concept V8 · Milano</div></div></div>
          <div className="text-sm text-slate-400">© 2026 Milano Rent Score. Concept landing page.</div>
        </div>
      </footer>
    </div>
  );
}
