# Material 3 Expressive Components for Home Assistant

> [!NOTE]
> **AI / Vibecoded Project Notice:** This project is **vibecoded** (designed, iterated, and built with AI assistance). While every component is tested in-browser and built strictly around Google's Material 3 Expressive specifications and `Nerwyn/material-you-utilities`, expect rapid iteration and review before deploying to mission-critical dashboards.

## Scopo del progetto / Purpose

**Material 3 Expressive Components** (`m3e-cards`) nasce per portare su Home Assistant un'esperienza davvero nativa rispetto ad **Android** e all'app **Google Home**, seguendo fedelmente le linee guida **Material 3 Expressive (Spec 2025)**:

- **Leggerezza estrema:** scritto da zero in **TypeScript + Lit**, zero dipendenze da `card-mod`, `button-card` o librerie pesanti (~16 KB gzippati totali).
- **Nessun effetto gloss, liquid glass o contorni arbitrari:** superfici tonali opache, shape morphing basato sullo stato e fisica a molla (*Spring physics*).
- **Integrazione nativa con [`Nerwyn/material-you-utilities`](https://github.com/Nerwyn/material-you-utilities):** eredita automaticamente `card_type` (`elevated`, `filled`, `outlined`, `transparent`), livello di contrasto (`-1.0` → `+1.0`), `color scheme` e modalità Light/Dark tramite i token `--md-sys-color-*` e `--ha-card-*`.
- **Card dedicate per dominio:** ogni dispositivo ha controlli e micro-interazioni pensate per il proprio ruolo, non un singolo template generico forzato su tutto.

---

## Card disponibili

### 1. Light Card (`custom:m3e-light-card`)
Ispirata direttamente alla tile e al controllo luce dell'app **Google Home Android**:

- **Tile compatta orizzontale:** icona lampadina pulita, nome + `On • XX%` / `Off`, riempimento orizzontale a taglio verticale netto ritagliato dal raggio della card.
  - **Tap:** accende/spegne la luce.
  - **Trascinamento orizzontale:** regola la luminosità in tempo reale (senza bloccare lo scroll verticale su mobile).
  - **Pressione prolungata (o tasto destro su desktop):** apre il popup di controllo completo con transizione **Container Transform**.
- **Popup verticale a capsula (`<dialog>` nativo):**
  - Slider verticale a capsula piena con riempimento ritagliato (*clipped fill*) dal basso.
  - Tooltip flottante a sinistra con la percentuale durante il trascinamento.
  - Icona del sole ancorata in basso con inversione di contrasto al pixel lungo il bordo del riempimento.
  - **Morphing On ↔ Off con molla:** allo spegnimento la capsula si trasforma in un rettangolo arrotondato (`28px`) neutro.
  - **Selettore colori morfico:** cerchi perfetti che diventano *squircle* (`16px`) quando selezionati. Supporta `favorite_colors` da YAML, i preferiti esposti da Home Assistant (`entity_registry`), i colori usati di recente salvati localmente e i preset predefiniti.

#### Configurazione YAML

```yaml
type: custom:m3e-light-card
entity: light.lampada_cucina
name: Lampada cucina        # opzionale
icon: mdi:lightbulb         # opzionale
use_light_color: true       # default: true (false usa il colore primary del tema)
allow_drag_off: true        # default: true (trascina a 0% per spegnere)
favorite_colors:            # opzionale
  - label: Calda
    color_temp_kelvin: 2700
  - label: Corallo
    rgb_color: [255, 171, 145]
```

### 2. Status Card (`custom:m3e-status-card`)
Tile di stato con **Shape Coding** (pillola piena colorata quando attiva, rettangolo `28px` neutro quando inattiva), supporto a **doppia icona per stato** (`icon_active` / `icon_inactive`), stati attivi personalizzabili e **4 schermate popup modulari** configurabili direttamente via **GUI Home Assistant** (nessun YAML manuale necessario):

- **Sensore (`sensor`):** anello di stato passivo + pillola telemetrica (`secondary_entity`, es. temperatura).
- **Clima (`climate`):** dial circolare interattivo 270° con thumb che si trasforma in pillola radiale e ispessisce l'arco al trascinamento, step `.5` ad apice (`11⁵`), bottom sheet *"Select a mode"* e telemetria interna/esterna.
- **Telecomando / TV (`remote`):** capsula rocker verticale Volume +/- + split pills (`Unmute | Mute`, `On | Off`), transport, `CH` e `Source`.
- **Media / Speaker (`media`):** media card `28px` + volume slider orizzontale a pillola piena + azioni codificate per forma.

### 3. Toggle Card (`custom:m3e-toggle-card`)
Il classico interruttore / presa in stile **Google Home Android**:
- **Tile uniforme `28px`:** tap per toggle immediato con appiattimento elastico, pressione prolungata (o tasto destro) per aprire il popup con **Container Transform**.
- **Popup interruttore verticale morfico:**
  - **Spento (`Off`):** traccia rettangolare stondata (`28px`) neutra + cursore quadrato stondato (`22px`) in basso.
  - **Acceso (`On`):** la traccia fa morphing a molla in una **pillola verticale piena (`88px`)** tonale e il cursore sale in alto trasformandosi in un **cerchio perfetto (`50%`)**.
  - Supporta click o swipe verticale (su/giù) e configurazione completa via **GUI Home Assistant**.

---

## Installazione

### Via HACS (Custom Repository)
1. Apri **HACS** → **Frontend** → menu `⋮` → **Custom repositories**.
2. Aggiungi l'URL del repository scegliendo categoria **Dashboard / Lovelace**.
3. Installa **Material 3 Expressive Components** e ricarica il browser.

### Manuale
1. Scarica `dist/m3e-cards.js` nella cartella `/config/www/` di Home Assistant.
2. Aggiungi la risorsa in **Impostazioni → Plance → Risorse**:
   - URL: `/local/m3e-cards.js`
   - Tipo: `JavaScript Module`

> **Consigliato:** installa e attiva [Material You Theme](https://github.com/Nerwyn/material-you-theme) e [Material You Utilities](https://github.com/Nerwyn/material-you-utilities) per la sincronizzazione automatica di palette, contrasto e `card_type`.

---

## Sviluppo locale & Preview nel browser

Il progetto include una pagina di anteprima con simulatore completo di `Nerwyn/material-you-utilities` (Spec 2025, Base Color, Scheme, Card Type, Contrast Level e Light/Dark Mode):

```bash
npm install
npm run dev     # avvia il preview workbench su http://127.0.0.1:5173
npm run build   # typecheck TypeScript + build singolo file dist/m3e-cards.js
```

## Roadmap
- [x] `m3e-light-card` (Tile orizzontale + Popup verticale a capsula + colori recenti/preferiti)
- [ ] Tasto Scene nel popup Light Card
- [ ] Prossime card dedicate per dominio (Media Player, Clima, Tapparelle, Switch/Tile…)

## Licenza
[MIT](./LICENSE)
