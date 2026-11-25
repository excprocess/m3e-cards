# Material Native for Home Assistant

> [!NOTE]
> **AI / Vibecoded Project Notice:** This project is **vibecoded** (designed, iterated, and built with AI assistance). While every component is built strictly around Google's **Material 3 Expressive (Spec 2025)** and **Google Home** design language with native `Nerwyn/material-you-utilities` integration, expect rapid iteration.

## Scopo del progetto / Purpose

**Material Native** (`dist/m3e-cards.js`) porta su Home Assistant un'esperienza davvero nativa rispetto ad **Android** e all'app **Google Home**, seguendo fedelmente le linee guida **Material 3 Expressive (Spec 2025)**:

- **Leggerezza estrema:** scritto da zero in **TypeScript + Lit**, zero dipendenze da `card-mod`, `button-card` o librerie esterne pesanti (~75 KB gzippati per l'intera suite di 10 card).
- **Nessun effetto gloss, liquid glass o contorni arbitrari:** superfici tonali opache, shape morphing basato sullo stato e fisica a molla (*Spring physics*).
- **Integrazione nativa con [`Nerwyn/material-you-utilities`](https://github.com/Nerwyn/material-you-utilities):** eredita automaticamente `card_type` (`elevated`, `filled`, `outlined`, `transparent`), livello di contrasto (`-1.0` → `+1.0`), `color scheme` e modalità Light/Dark tramite i token `--md-sys-color-*` e `--ha-card-*`.
- **100% configurabile da GUI Home Assistant:** ogni card dispone di form visuale nativo o editor dedicato per scegliere entità, attributi, icone, azioni e stile senza dover scrivere YAML a mano.
- **Coerenza grafica rigorosa:** stessa geometria (`28px` / `9999px` pillola), stesso header dei popup (`×` chiusura a sinistra, titolo al centro, toggle/controlli a destra), stesse curve di animazione e blocco dello scroll della dashboard dietro ai popup su Android/iOS.

---

## Card disponibili

Nel selettore card di Home Assistant ogni componente compare con il proprio nome diretto (senza prefissi):

### 1. Light Card (`custom:m3e-light-card`)
Tile orizzontale e controllo luce ispirati a **Google Home Android**:
- **Tile compatta:** tap per accendere/spegnere, trascinamento orizzontale per regolare la luminosità (invio solo al rilascio), pressione prolungata (o tasto destro) per aprire il popup completo.
- **Popup verticale a capsula (`<dialog>` nativo):** slider verticale con riempimento ritagliato, tooltip flottante percentuale, icona sole con inversione di contrasto al pixel, morphing On ↔ Off, selettore colori (preferiti HA + recenti + preset) filtrato per `supported_color_modes`, e pulsante **Scene** con auto-discovery delle scene Hue del dispositivo e degli `effect_list`.
- **Stili selezionabili:** `default`, `morph`, `pill`, `expressive`, `compact`.

```yaml
type: custom:m3e-light-card
entity: light.lampada_cucina
use_light_color: true
card_style: default
```

### 2. Light Control (`custom:m3e-light-control-card`)
Switch dual-choice a pillola **`All on | All off`** con indicatore scorrevole caldo/ambra (adattato Light & Dark), bordo scuro netto e ripple radiale Material 3. Può controllare una lista specifica di luci o **tutte le luci di casa** (lasciando `entities` vuoto).

```yaml
type: custom:m3e-light-control-card
label_on: All on
label_off: All off
```

### 3. Light Group Card (`custom:m3e-light-group-card`)
Barra espandibile per gruppi di luci (`light.*` con `attributes.entity_id`):
- Barra superiore con luminosità media aggregata, slider orizzontale, conteggio luci accese e chevron animato.
- Espansione in griglia responsive a **2 colonne** contenente una `Light Card` completa (con il proprio popup) per ogni singola luce del gruppo.

```yaml
type: custom:m3e-light-group-card
entity: light.gruppo_soggiorno
```

### 4. Thermostat Card (`custom:m3e-thermostat-card`)
Card termostato a larghezza piena (**12 colonne × fit content**) in stile **Google Home**:
- Header con icona contestuale (onde calore, fiocco neve, termometro), nome e chevron `>` (o icona avviso `!` se offline).
- Pulsanti a pillola **`−`** e **`+`** con temperatura target grande al centro e temperatura interna (`Indoor XX`) sotto.
- **Colori semantici automatici:** caldo (`heat` / `heating`) in tonalità rosso-terracotta M3, freddo (`cool` / `cooling`) in blu M3, spento/idle neutro, stato **`Offline`** dedicato.
- Al tap apre direttamente lo **stesso popup Clima completo** della Status Card (dial 270°, selettori Mode / Preset / Fan / Swing, telemetria esterna e umidità).

```yaml
type: custom:m3e-thermostat-card
entity: climate.termostato
outdoor_entity: sensor.temperatura_esterna
```

### 5. Status Card (`custom:m3e-status-card`)
Tile di stato universale con **editor visuale dinamico**, rilevamento automatico dei sensori fratelli sullo stesso `device_id` (inclusi potenza, energia, corrente, tensione e ambiente) e **5 schermate popup modulari**:
- **Sensore (`sensor`) / Personalizzata (`custom`):** anello di stato (nascosto automaticamente per `light`/`switch`/`outlet`, che ricevono invece un toggle M3 in alto a destra nel popup), pillole telemetriche cliccabili (che aprono il `more-info` nativo di HA) + fino a **10 entità aggiuntive** (`extra_entities`) + grafico storico 24h interattivo.
- **Selettore (`selector`):** auto-rilevato per `input_select.*` e `select.*`, apre un selettore radio Material 3 Expressive.
- **Clima (`climate`):** dial circolare 270° interattivo + bottom sheet per modalità, preset, ventola e swing.
- **Telecomando / TV (`remote`):** rocker volume verticale, split pill, transport e pulsanti personalizzabili.
- **Media / Speaker (`media`):** media card con copertina, slider volume a pillola e supporto Android TV.

### 6. Toggle Card (`custom:m3e-toggle-card`)
Interruttore / presa in stile **Google Home**:
- **Tap singolo:** accende/spegne immediatamente (`switch`, `light`, `input_boolean`, `fan`, `lock`, `cover`, ecc.).
- **Pressione prolungata (Hold):** apre il popup verticale morfico (rettangolo `28px` da spento ↔ pillola verticale piena da acceso) con pillole di consumo energetico auto-rilevate dal dispositivo.

### 7. Scene / Button Card (`custom:m3e-scene-card`)
Tile one-tap per `scene.*`, `script.*` e `button.*` con icona sparkle Google Home (outline → filled), stato temporaneo `"Avviata"` e spunta SVG animata.

### 8. Assist & Mode Bar (`custom:m3e-assist-card`)
Barra **"Chiedi a Casa"** in stile Google Home che apre direttamente la chat/voce di **Home Assistant Assist**, integrando a sinistra un pulsante circolare collegabile a un `input_select` / `select` (es. *Casa / Fuori / Notte*) con selettore radio Material 3 Expressive (bottom sheet su mobile, popup su desktop).

```yaml
type: custom:m3e-assist-card
entity: input_select.modalita_casa
placeholder: Chiedi a Casa
```

### 9. At a Glance Strip (`custom:m3e-glance-card`)
Barra orizzontale scorrevole (touch + mouse drag) in stile Google Home At a Glance:
- Badge circolari tonali (`46px`) con icone M3 automatiche (meteo, AQI, temperatura, umidità, ecc.) e testo su due righe (valore principale + etichetta secondaria).
- Editor visuale dedicato per aggiungere, rimuovere e riordinare le entità, scegliendo per ciascuna stato o attributo preferito, attributo secondario (`AQI • Moderate`), nome, unità, icona e azione al tap.

```yaml
type: custom:m3e-glance-card
transparent: true
items:
  - entity: weather.roma
    name: Roma
    unit: "°"
  - entity: sensor.roma_aqi
    name: AQI
    secondary_attribute: level
```

### 10. People Glance (`custom:m3e-people-card`)
Card speculare ad *At a Glance* dedicata alle **persone** (`person.*` / `device_tracker.*`):
- Ordine **Avatar / Foto → Nome → Posizione / Zona** con indicatore di presenza M3 opzionale quando in casa.
- **3 modalità di layout:** `scroll` (barra orizzontale scorrevole), `row` (riga intera senza scorrimento), `list` (elenco verticale a tutta riga).
- **2 dimensioni:** `default` (`46px`) e `compact` (`36px`).

```yaml
type: custom:m3e-people-card
layout: row
size: default
items:
  - entity: person.isabella
  - entity: person.gianluca
  - entity: person.flavia
```

---

## Installazione

### Via HACS (Custom Repository)
1. Apri **HACS** → **Frontend** → menu `⋮` → **Custom repositories**.
2. Aggiungi l'URL del repository scegliendo categoria **Dashboard / Lovelace**.
3. Installa **Material Native** e ricarica il browser.

### Manuale
1. Scarica `dist/m3e-cards.js` nella cartella `/config/www/` di Home Assistant.
2. Aggiungi la risorsa in **Impostazioni → Plance → Risorse**:
   - URL: `/local/m3e-cards.js`
   - Tipo: `JavaScript Module`

> **Consigliato:** installa e attiva [Material You Theme](https://github.com/Nerwyn/material-you-theme) e [Material You Utilities](https://github.com/Nerwyn/material-you-utilities) per la sincronizzazione automatica di palette, contrasto e `card_type`.

---

## Sviluppo locale

```bash
npm install
npm run dev     # avvia il preview workbench su http://127.0.0.1:5173
npm run build   # typecheck TypeScript + build singolo file dist/m3e-cards.js
```

## Licenza
[MIT](./LICENSE)
