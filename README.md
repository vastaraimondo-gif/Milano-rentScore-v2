# Milano Rent Score V8

Beta pubblica del progetto **Milano Rent Score**: landing page realizzata in React + Vite + Tailwind CSS, pronta per GitHub e Vercel.

## Stato progetto

- Prodotto reale: interfaccia, Rent Score, Market Pulse, analisi annuncio e report sono funzionanti.
- Dati immobiliari: al momento sono demo e dichiarati come tali.
- Data Engine: struttura pronta per Supabase e aggiornamenti automatici futuri.

## Requisiti

- Node.js
- npm
- Git
- Account GitHub
- Account Vercel

## Avvio locale

```bash
npm install
npm run dev
```

## Build produzione

```bash
npm run build
npm run preview
```

## Pubblicazione GitHub

```bash
git init
git add .
git commit -m "Milano Rent Score V8"
git branch -M main
git remote add origin https://github.com/TUO_ACCOUNT/milano-rent-score.git
git push -u origin main
```

## Pubblicazione Vercel

1. Vai su Vercel.
2. Clicca **New Project**.
3. Importa il repository GitHub.
4. Vercel rileverà Vite/React.
5. Premi **Deploy**.

## Supabase - fase successiva

Il file `src/lib/supabaseClient.js` è già predisposto come placeholder.
La tabella prevista è `market_estimates`, con campi:

- zona
- euro_mq
- fonte_mercato
- fonte_istituzionale
- ultimo_aggiornamento
- trend_30g
- trend_annuo
- affidabilita
- created_at

## Nota importante

Questa beta va pubblicata con disclaimer: i valori immobiliari sono dimostrativi e non costituiscono consulenza professionale o stima ufficiale.
