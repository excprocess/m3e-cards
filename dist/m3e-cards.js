/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const be = globalThis, je = be.ShadowRoot && (be.ShadyCSS === void 0 || be.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, We = Symbol(), ii = /* @__PURE__ */ new WeakMap();
let Ti = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== We) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (je && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ii.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ii.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ts = (t) => new Ti(typeof t == "string" ? t : t + "", void 0, We), I = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, a) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[a + 1], t[0]);
  return new Ti(i, t, We);
}, es = (t, e) => {
  if (je) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = be.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, si = je ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return ts(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is, defineProperty: ss, getOwnPropertyDescriptor: rs, getOwnPropertyNames: as, getOwnPropertySymbols: os, getPrototypeOf: ns } = Object, Ce = globalThis, ri = Ce.trustedTypes, ls = ri ? ri.emptyScript : "", cs = Ce.reactiveElementPolyfillSupport, ie = (t, e) => t, xe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ls : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Ge = (t, e) => !is(t, e), ai = { attribute: !0, type: String, converter: xe, reflect: !1, useDefault: !1, hasChanged: Ge };
Symbol.metadata ??= Symbol("metadata"), Ce.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Lt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ai) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && ss(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: a } = rs(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const n = r?.call(this);
      a?.call(this, o), this.requestUpdate(e, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ai;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ie("elementProperties"))) return;
    const e = ns(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ie("properties"))) {
      const i = this.properties, s = [...as(i), ...os(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) i.unshift(si(r));
    } else e !== void 0 && i.push(si(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return es(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : xe).toAttribute(i, s.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : xe;
      this._$Em = r;
      const n = o.fromAttribute(i, a.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (r === !1 && (a = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? Ge)(a, i) || s.useDefault && s.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: a }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: o } = a, n = this[r];
        o !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, a, n);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Lt.elementStyles = [], Lt.shadowRootOptions = { mode: "open" }, Lt[ie("elementProperties")] = /* @__PURE__ */ new Map(), Lt[ie("finalized")] = /* @__PURE__ */ new Map(), cs?.({ ReactiveElement: Lt }), (Ce.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = globalThis, oi = (t) => t, we = Ye.trustedTypes, ni = we ? we.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ai = "$lit$", ut = `lit$${Math.random().toFixed(9).slice(2)}$`, Oi = "?" + ut, ds = `<${Oi}>`, Mt = document, ae = () => Mt.createComment(""), oe = (t) => t === null || typeof t != "object" && typeof t != "function", Ke = Array.isArray, ps = (t) => Ke(t) || typeof t?.[Symbol.iterator] == "function", Le = `[ 	
\f\r]`, Xt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, li = /-->/g, ci = />/g, $t = RegExp(`>|${Le}(?:([^\\s"'>=/]+)(${Le}*=${Le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), di = /'/g, pi = /"/g, Ii = /^(?:script|style|textarea|title)$/i, Li = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), l = Li(1), ze = Li(2), zt = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), hi = /* @__PURE__ */ new WeakMap(), Pt = Mt.createTreeWalker(Mt, 129);
function zi(t, e) {
  if (!Ke(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ni !== void 0 ? ni.createHTML(e) : e;
}
const hs = (t, e) => {
  const i = t.length - 1, s = [];
  let r, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Xt;
  for (let n = 0; n < i; n++) {
    const c = t[n];
    let p, d, g = -1, u = 0;
    for (; u < c.length && (o.lastIndex = u, d = o.exec(c), d !== null); ) u = o.lastIndex, o === Xt ? d[1] === "!--" ? o = li : d[1] !== void 0 ? o = ci : d[2] !== void 0 ? (Ii.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = $t) : d[3] !== void 0 && (o = $t) : o === $t ? d[0] === ">" ? (o = r ?? Xt, g = -1) : d[1] === void 0 ? g = -2 : (g = o.lastIndex - d[2].length, p = d[1], o = d[3] === void 0 ? $t : d[3] === '"' ? pi : di) : o === pi || o === di ? o = $t : o === li || o === ci ? o = Xt : (o = $t, r = void 0);
    const m = o === $t && t[n + 1].startsWith("/>") ? " " : "";
    a += o === Xt ? c + ds : g >= 0 ? (s.push(p), c.slice(0, g) + Ai + c.slice(g) + ut + m) : c + ut + (g === -2 ? n : m);
  }
  return [zi(t, a + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class ne {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const n = e.length - 1, c = this.parts, [p, d] = hs(e, i);
    if (this.el = ne.createElement(p, s), Pt.currentNode = this.el.content, i === 2 || i === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = Pt.nextNode()) !== null && c.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(Ai)) {
          const u = d[o++], m = r.getAttribute(g).split(ut), f = /([.?@])?(.*)/.exec(u);
          c.push({ type: 1, index: a, name: f[2], strings: m, ctor: f[1] === "." ? ms : f[1] === "?" ? fs : f[1] === "@" ? gs : Se }), r.removeAttribute(g);
        } else g.startsWith(ut) && (c.push({ type: 6, index: a }), r.removeAttribute(g));
        if (Ii.test(r.tagName)) {
          const g = r.textContent.split(ut), u = g.length - 1;
          if (u > 0) {
            r.textContent = we ? we.emptyScript : "";
            for (let m = 0; m < u; m++) r.append(g[m], ae()), Pt.nextNode(), c.push({ type: 2, index: ++a });
            r.append(g[u], ae());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Oi) c.push({ type: 2, index: a });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(ut, g + 1)) !== -1; ) c.push({ type: 7, index: a }), g += ut.length - 1;
      }
      a++;
    }
  }
  static createElement(e, i) {
    const s = Mt.createElement("template");
    return s.innerHTML = e, s;
  }
}
function Dt(t, e, i = t, s) {
  if (e === zt) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const a = oe(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = Dt(t, r._$AS(t, e.values), r, s)), e;
}
class us {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? Mt).importNode(i, !0);
    Pt.currentNode = r;
    let a = Pt.nextNode(), o = 0, n = 0, c = s[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let p;
        c.type === 2 ? p = new pe(a, a.nextSibling, this, e) : c.type === 1 ? p = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (p = new vs(a, this, e)), this._$AV.push(p), c = s[++n];
      }
      o !== c?.index && (a = Pt.nextNode(), o++);
    }
    return Pt.currentNode = Mt, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class pe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = Dt(this, e, i), oe(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== zt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ps(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && oe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Mt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = ne.createElement(zi(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const a = new us(r, this), o = a.u(this.options);
      a.p(i), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let i = hi.get(e.strings);
    return i === void 0 && hi.set(e.strings, i = new ne(e)), i;
  }
  k(e) {
    Ke(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const a of e) r === i.length ? i.push(s = new pe(this.O(ae()), this.O(ae()), this, this.options)) : s = i[r], s._$AI(a), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = oi(e).nextSibling;
      oi(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Se {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(e, i = this, s, r) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = Dt(this, e, i, 0), o = !oe(e) || e !== this._$AH && e !== zt, o && (this._$AH = e);
    else {
      const n = e;
      let c, p;
      for (e = a[0], c = 0; c < a.length - 1; c++) p = Dt(this, n[s + c], i, c), p === zt && (p = this._$AH[c]), o ||= !oe(p) || p !== this._$AH[c], p === h ? e = h : e !== h && (e += (p ?? "") + a[c + 1]), this._$AH[c] = p;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ms extends Se {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class fs extends Se {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class gs extends Se {
  constructor(e, i, s, r, a) {
    super(e, i, s, r, a), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = Dt(this, e, i, 0) ?? h) === zt) return;
    const s = this._$AH, r = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== h && (s === h || r);
    r && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class vs {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Dt(this, e);
  }
}
const _s = Ye.litHtmlPolyfillSupport;
_s?.(ne, pe), (Ye.litHtmlVersions ??= []).push("3.3.3");
const bs = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const a = i?.renderBefore ?? null;
    s._$litPart$ = r = new pe(e.insertBefore(ae(), a), a, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis;
let A = class extends Lt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = bs(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return zt;
  }
};
A._$litElement$ = !0, A.finalized = !0, qe.litElementHydrateSupport?.({ LitElement: A });
const ys = qe.litElementPolyfillSupport;
ys?.({ LitElement: A });
(qe.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xs = { attribute: !0, type: String, converter: xe, reflect: !1, hasChanged: Ge }, ws = (t = xs, e, i) => {
  const { kind: s, metadata: r } = i;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(i.name, t), s === "accessor") {
    const { name: o } = i;
    return { set(n) {
      const c = e.get.call(this);
      e.set.call(this, n), this.requestUpdate(o, c, t, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(o, void 0, t, n), n;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(n) {
      const c = this[o];
      e.call(this, n), this.requestUpdate(o, c, t, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function P(t) {
  return (e, i) => typeof i == "object" ? ws(t, e, i) : ((s, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, s), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(t) {
  return P({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $s = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function T(t, e) {
  return (i, s, r) => {
    const a = (o) => o.renderRoot?.querySelector(t) ?? null;
    return $s(i, s, { get() {
      return a(this);
    } });
  };
}
const U = I`
  :host {
    display: block;
    height: 100%;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    font-family: var(
      --font-family,
      var(--ha-font-family-body, 'Roboto Flex', 'Google Sans', Roboto, system-ui, sans-serif)
    );

    /* M3 Expressive Motion Physics (falls back to CSS linear() spring approximations) */
    --m3e-spring-spatial-fast: var(
      --md-sys-motion-expressive-spatial-fast,
      350ms linear(
        0, 0.232 6.8%, 0.789 20.6%, 1.045 33.7%, 1.09 42.3%,
        1.023 58.6%, 0.992 73.1%, 1.002 88.2%, 1
      )
    );
    --m3e-spring-spatial-default: var(
      --md-sys-motion-expressive-spatial-default,
      500ms linear(
        0, 0.14 6.5%, 0.52 17.5%, 0.85 30.8%, 1.01 46.8%,
        1.03 56.5%, 1.005 74.2%, 1
      )
    );
    --m3e-spring-effects-fast: var(
      --md-sys-motion-expressive-effects-fast,
      150ms cubic-bezier(0.2, 0, 0, 1)
    );
    --m3e-spring-effects-default: var(
      --md-sys-motion-expressive-effects-default,
      250ms cubic-bezier(0.2, 0, 0, 1)
    );
    --m3e-spring-bouncy: 520ms linear(
      0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
      1.038 56%, 0.992 71%, 1.005 86%, 1
    );

    /* M3 Expressive Shape Scale */
    --m3e-corner-xs: var(--md-sys-shape-corner-extra-small, 4px);
    --m3e-corner-sm: var(--md-sys-shape-corner-small, 8px);
    --m3e-corner-md: var(--md-sys-shape-corner-medium, 12px);
    --m3e-corner-lg: var(--md-sys-shape-corner-large, 16px);
    --m3e-corner-xl: var(--md-sys-shape-corner-extra-large, 28px);
    --m3e-corner-full: var(--md-sys-shape-corner-full, 9999px);

    /* Uniform Tactile Press-Rebound Scale (tiles vs wide cards) */
    --m3e-press-scale-tile: 0.965;
    --m3e-press-scale-card: 0.978;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  ha-state-icon {
    --mdc-icon-size: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  ha-card {
    display: block;
    position: relative;
    height: 100%;
    overflow: hidden;
    background: var(--ha-card-background, var(--md-sys-color-surface-container-low, #f3f3fa));
    box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, none));
    border-style: solid;
    border-width: var(--ha-card-border-width, 0px);
    border-color: var(--ha-card-border-color, transparent);
    border-radius: var(--m3e-card-border-radius, var(--ha-card-border-radius, 28px));
    color: var(--md-sys-color-on-surface, #1b1b1f);
    transition:
      transform var(--m3e-spring-spatial-fast),
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  /* Uniform Tactile Spring Press-Rebound across all interactive cards */
  ha-card.is-pressed:not(.is-dragging):not(.is-unavailable) {
    transform: scale(var(--m3e-press-scale-tile, 0.965));
  }

  ha-card.is-wide-card.is-pressed:not(.is-dragging):not(.is-unavailable) {
    transform: scale(var(--m3e-press-scale-card, 0.978));
  }

  /* =========================================================================
     SHARED MATERIAL 3 EXPRESSIVE TILE / PILL DESIGN VARIANTS
     All variants strictly inherit --ha-card-* & --md-sys-color-* from M3Y
     and keep --ha-card-border-radius in sync with border-radius.
     ========================================================================= */

  /* 1. Full Stadium Pill (Android QS / M3 Expressive Pill) */
  ha-card.style-pill {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  /* 2. Google Home Morph (28px/HA standard inactive <-> full round pill active) */
  ha-card.style-morph {
    --ha-card-border-radius: var(--m3e-card-border-radius, 28px);
    border-radius: var(--m3e-card-border-radius, 28px);
    transition:
      border-radius 520ms linear(
        0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
        1.038 56%, 0.992 71%, 1.005 86%, 1
      ),
      transform var(--m3e-spring-spatial-fast),
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  ha-card.style-morph.is-on,
  ha-card.style-morph.is-active {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  /* 3. M3 Expressive Dynamic Shape Morph (20px inactive <-> full pill active) */
  ha-card.style-expressive {
    --ha-card-border-radius: 20px;
    border-radius: 20px;
    transition:
      border-radius 520ms linear(
        0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
        1.038 56%, 0.992 71%, 1.005 86%, 1
      ),
      transform var(--m3e-spring-spatial-fast),
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  ha-card.style-expressive.is-on,
  ha-card.style-expressive.is-active {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  ha-card.style-expressive.is-pressed {
    --ha-card-border-radius: 14px;
    border-radius: 14px;
  }

  /* 4. Compact M3 Tile (56px height / 18px corners for dense 1-row Sections) */
  ha-card.style-compact {
    min-height: 56px;
    --ha-card-border-radius: 18px;
    border-radius: 18px;
  }

  ha-card.style-compact .tile-content,
  ha-card.style-compact .tile-inner {
    min-height: 56px;
    padding: 8px 10px 8px 12px;
    gap: 8px;
  }

  /* =========================================================================
     SHARED GOOGLE HOME M3 OFFLINE STATE (unavailable / unknown)
     Opaque muted disabled surface + muted text/icons + trailing warning badge
     ========================================================================= */
  ha-card.is-unavailable {
    opacity: 1 !important;
    cursor: not-allowed;
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #1b1b1f) 11%,
      var(--md-sys-color-surface, #faf8ff)
    ) !important;
    box-shadow: none !important;
  }

  ha-card.is-unavailable .title,
  ha-card.is-unavailable .subtitle,
  ha-card.is-unavailable .tile-title,
  ha-card.is-unavailable .tile-subtitle,
  ha-card.is-unavailable .bulb-icon,
  ha-card.is-unavailable .tile-icon,
  ha-card.is-unavailable .scene-icon,
  ha-card.is-unavailable .offline-badge {
    color: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #1b1b1f) 46%,
      transparent
    ) !important;
  }

  .offline-badge {
    flex: 0 0 auto;
    margin-inline-start: auto;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
  }

  .offline-badge svg {
    width: 22px;
    height: 22px;
  }

  /* =========================================================================
     SHARED MATERIAL 3 EXPRESSIVE POPUP & SHEET MOTION KEYFRAMES
     ========================================================================= */
  @keyframes m3e-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes m3e-sheet-up {
    from {
      transform: translateY(48px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  dialog[open]::backdrop {
    animation: m3e-fade-in 220ms cubic-bezier(0.2, 0, 0, 1);
    transition:
      opacity 220ms cubic-bezier(0.3, 0, 0.8, 0.15),
      background-color 220ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }

  dialog.is-closing::backdrop {
    opacity: 0 !important;
    background-color: transparent !important;
  }
`;
function bt(t, e) {
  if (!e || !e.open) return;
  const i = t.composedPath();
  for (const s of i) {
    if (s === e) break;
    if (!(s instanceof HTMLElement)) continue;
    const r = window.getComputedStyle(s), a = (r.overflowY === "auto" || r.overflowY === "scroll") && s.scrollHeight > s.clientHeight + 1, o = (r.overflowX === "auto" || r.overflowX === "scroll") && s.scrollWidth > s.clientWidth + 1;
    if (a || o)
      return;
  }
  t.cancelable && t.preventDefault();
}
const ui = "cubic-bezier(0.05, 0.7, 0.1, 1.0)", ks = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";
function yt(t, e) {
  if (!t) return;
  t.closest("dialog")?.classList.remove("is-closing");
  for (const r of t.getAnimations())
    r.cancel();
  const s = window.matchMedia("(max-width: 600px)").matches;
  if (e && !s) {
    const r = t.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      const a = e.left + e.width / 2 - (r.left + r.width / 2), o = e.top + e.height / 2 - (r.top + r.height / 2), n = Math.max(0.35, Math.min(1, e.width / r.width)), c = Math.max(0.22, Math.min(1, e.height / r.height));
      t.animate(
        [
          {
            transform: `translate(${a}px, ${o}px) scale(${n}, ${c})`,
            borderRadius: "28px",
            opacity: 0.65
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            borderRadius: "32px",
            opacity: 1
          }
        ],
        {
          duration: 320,
          easing: ui
        }
      );
      return;
    }
  }
  t.animate(
    s ? [
      { transform: "translate3d(0, 100%, 0)" },
      { transform: "translate3d(0, 0, 0)" }
    ] : [
      { transform: "scale(0.92) translateY(10px)", opacity: 0 },
      { transform: "scale(1) translateY(0px)", opacity: 1 }
    ],
    {
      duration: s ? 320 : 260,
      easing: ui
    }
  );
}
function xt(t, e, i) {
  if (!t || !t.open) {
    i();
    return;
  }
  if (t.classList.contains("is-closing"))
    return;
  if (!e) {
    t.close(), i();
    return;
  }
  t.classList.add("is-closing");
  for (const n of e.getAnimations())
    n.cancel();
  const s = window.matchMedia("(max-width: 600px)").matches, r = e.animate(
    s ? [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, 100%, 0)" }
    ] : [
      { transform: "scale(1) translateY(0px)", opacity: 1 },
      { transform: "scale(0.92) translateY(12px)", opacity: 0 }
    ],
    {
      duration: s ? 240 : 200,
      easing: ks,
      fill: "forwards"
    }
  );
  let a = !1;
  const o = () => {
    a || (a = !0, t.open && t.close(), t.classList.remove("is-closing"), r.cancel(), i());
  };
  r.onfinish = o, r.oncancel = o;
}
var Cs = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, It = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ss(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Cs(e, i, r), r;
};
let ct = class extends A {
  constructor() {
    super(...arguments), this._pressed = !1, this._selectorOpen = !1;
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-assist-card",
      entity: t ? Object.keys(t.states).find(
        (i) => i.startsWith("input_select.") || i.startsWith("select.")
      ) : void 0,
      placeholder: "Chiedi a Home Assistant",
      pipeline_id: "preferred",
      start_listening: !1
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            { name: "placeholder", selector: { text: {} } },
            {
              name: "entity",
              selector: { entity: { domain: ["input_select", "select"] } }
            }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            { name: "start_listening", selector: { boolean: {} } },
            { name: "pipeline_id", selector: { text: {} } }
          ]
        }
      ],
      computeLabel: (t) => ({
        placeholder: `Testo barra Assist (es. "Ask Corazza's" o "Chiedi a Casa")`,
        entity: "Selettore modalità casa (input_select / select per sostituire Home/Away di Google Home)",
        start_listening: "Avvia ascolto vocale subito (spento = apre chat testuale Assist)",
        pipeline_id: "Pipeline Assist (opzionale, default: preferred)"
      })[t.name] ?? t.name,
      computeHelper: (t) => {
        if (t.name === "entity")
          return "Collega un input_select (es. Casa / Fuori / Notte) al pulsante circolare a sinistra: al tap apre il selettore Material 3 Expressive come su Google Home.";
      }
    };
  }
  setConfig(t) {
    this._config = {
      placeholder: "Chiedi a Home Assistant",
      pipeline_id: "preferred",
      start_listening: !1,
      ...t
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: "auto", columns: 12, min_columns: 6 };
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_pressed") || t.has("_selectorOpen"))
      return !0;
    if (t.has("hass") && this._config?.entity && this.hass) {
      const e = this.hass.states[this._config.entity];
      return e !== this._prevEntityState ? (this._prevEntityState = e, !0) : !1;
    }
    return !1;
  }
  get _modeEntity() {
    if (!(!this.hass || !this._config?.entity))
      return this.hass.states[this._config.entity];
  }
  get _options() {
    const t = this._modeEntity?.attributes.options;
    return Array.isArray(t) ? t.map(String) : [];
  }
  _openAssist() {
    const t = {
      tap_action: {
        action: "assist",
        pipeline_id: this._config?.pipeline_id || "preferred",
        start_listening: !!this._config?.start_listening
      }
    };
    this.dispatchEvent(
      new CustomEvent("hass-action", {
        bubbles: !0,
        composed: !0,
        detail: {
          config: t,
          action: "tap"
        }
      })
    );
  }
  async openModeSelector(t) {
    if (t?.stopPropagation(), !this._modeEntity || this._options.length === 0 || this._selectorOpen) return;
    window.getSelection()?.removeAllRanges(), this._selectorOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    e && (e.open || e.showModal(), yt(i));
  }
  closeModeSelector() {
    xt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._selectorOpen = !1;
    });
  }
  _selectOption(t) {
    if (!this.hass || !this._config?.entity) return;
    const e = this._config.entity.split(".")[0];
    this.hass.callService(e, "select_option", {
      entity_id: this._config.entity,
      option: t
    }), window.setTimeout(() => this.closeModeSelector(), 160);
  }
  _renderOptionIcon(t, e) {
    const i = t.toLowerCase();
    return i.includes("away") || i.includes("fuori") || i.includes("assent") || i.includes("out") || i.includes("vacanz") ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3 2 9v12h7v-2H4v-9l6-4.5L15 9.25V11h2V8.25L10 3Zm7 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 6c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z"
          />
        </svg>
      ` : i.includes("night") || i.includes("nott") || i.includes("sleep") ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.3 4.9a7 7 0 0 0 6.8 9.2A8 8 0 1 1 12.3 4.9Z"
          />
        </svg>
      ` : e ? l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm0 5.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm4.5 9.5h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V18Z"
            />
          </svg>
        ` : l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm7 16H5v-8l7-5.44L19 11v8Zm-7-9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7.5h8v-.5c0-1.33-2.67-2-4-2s-4 .67-4 2v.5Z"
            />
          </svg>
        `;
  }
  render() {
    if (!this._config) return h;
    const t = this._modeEntity, e = t?.state ?? "", i = !!(t && this._options.length > 0), s = this._config.placeholder?.trim() || "Chiedi a Home Assistant";
    return l`
      <ha-card
        class="assist-bar ${this._pressed ? "is-pressed" : ""}"
        role="button"
        tabindex="0"
        aria-label=${s}
        @pointerdown=${(r) => {
      r.button === 0 && (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._openAssist()}
        @keydown=${(r) => {
      (r.key === "Enter" || r.key === " ") && (r.preventDefault(), this._openAssist());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>

        <div class="bar-inner">
          ${i ? l`
                <button
                  type="button"
                  class="mode-dot-btn"
                  title=${`${t.attributes.friendly_name ?? "Modalità"}: ${e}`}
                  aria-label=${`Cambia modalità (${e})`}
                  @pointerdown=${(r) => r.stopPropagation()}
                  @click=${(r) => this.openModeSelector(r)}
                >
                  ${this._renderOptionIcon(e, !0)}
                </button>
              ` : l`
                <span class="mode-dot-static" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"
                    />
                  </svg>
                </span>
              `}

          <span class="bar-placeholder">${s}</span>
        </div>
      </ha-card>

      <dialog
        class="mode-dialog"
        @click=${(r) => {
      r.target === this._dialogEl && this.closeModeSelector();
    }}
        @cancel=${(r) => {
      r.preventDefault(), this.closeModeSelector();
    }}
        @touchmove=${(r) => bt(r, this._dialogEl)}
      >
        ${this._selectorOpen && i ? l`
              <div class="dialog-surface">
                <div class="sheet-handle" aria-hidden="true"></div>
                <header class="dialog-header">
                  <span class="dialog-title">
                    ${t.attributes.friendly_name || "Modalità casa"}
                  </span>
                  <button
                    type="button"
                    class="close-btn"
                    @click=${() => this.closeModeSelector()}
                    aria-label="Chiudi"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                </header>

                <div class="mode-list" role="radiogroup" aria-label="Seleziona modalità">
                  ${this._options.map((r) => {
      const a = r === e;
      return l`
                      <button
                        type="button"
                        class="mode-row ${a ? "is-selected" : ""}"
                        role="radio"
                        aria-checked=${String(a)}
                        @click=${() => this._selectOption(r)}
                      >
                        <span class="mode-row-icon">
                          ${this._renderOptionIcon(r, a)}
                        </span>
                        <span class="mode-row-label">${r}</span>
                        <span class="m3-radio ${a ? "checked" : ""}" aria-hidden="true">
                          <span class="m3-radio-dot"></span>
                        </span>
                      </button>
                    `;
    })}
                </div>
              </div>
            ` : h}
      </dialog>
    `;
  }
};
ct.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
        min-width: min(260px, 100%);
        flex: 1 1 100%;
        --m3e-spring-bouncy: 500ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. GOOGLE HOME ASK / ASSIST BAR
         ===================================================================== */
      .assist-bar {
        height: 100%;
        min-height: 56px;
        border-radius: var(--m3e-corner-full);
        cursor: pointer;
        outline: none;
        background: var(--ha-card-background, var(--md-sys-color-surface-container-high, #ececef));
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default);
      }

      .assist-bar.is-pressed {
        transform: scale(var(--m3e-press-scale-card, 0.978));
      }

      .assist-bar:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .assist-bar:hover .state-layer {
        opacity: 0.05;
      }

      .bar-inner {
        position: relative;
        z-index: 1;
        min-height: 56px;
        padding: 8px 20px 8px 8px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .mode-dot-btn,
      .mode-dot-static {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 7%,
          transparent
        );
        color: var(--md-sys-color-on-surface, #1b1b1f);
      }

      .mode-dot-btn {
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      .mode-dot-btn:hover {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 13%,
          transparent
        );
      }

      .mode-dot-btn:active {
        transform: scale(0.9);
      }

      .mode-dot-btn svg,
      .mode-dot-static svg {
        width: 22px;
        height: 22px;
      }

      .bar-placeholder {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 16px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface, #1b1b1f);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      }

      /* =====================================================================
         2. MATERIAL 3 EXPRESSIVE MODE SELECTOR (Bottom Sheet Mobile / Popup PC)
         ===================================================================== */
      dialog.mode-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(410px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #1b1b1f);
      }

      dialog.mode-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 52%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #faf8ff);
        color: var(--md-sys-color-on-surface, #1b1b1f);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
        user-select: none;
        -webkit-user-select: none;
      }

      .sheet-handle {
        display: none;
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline-variant, #c4c6d0);
        align-self: center;
        margin-bottom: 4px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .dialog-title {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .close-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #44464f);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .close-btn svg {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 600px) {
        dialog.mode-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 88dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }

        .sheet-handle {
          display: block;
        }

        .dialog-header {
          display: none;
        }
      }

      .mode-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* M3 Expressive Shape Coding: Selected = Full Pill (9999px) + Primary Container; Unselected = 22px Neutral */
      .mode-row {
        width: 100%;
        min-height: 74px;
        padding: 16px 22px;
        border: 0;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #ededf0);
        color: var(--md-sys-color-on-surface, #1b1b1f);
        font: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 18px;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .mode-row.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .mode-row:active {
        transform: scale(0.98);
      }

      .mode-row-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .mode-row-icon svg {
        width: 24px;
        height: 24px;
      }

      .mode-row-label {
        flex: 1 1 auto;
        font-size: 16px;
        font-weight: 500;
      }

      .mode-row.is-selected .mode-row-label {
        font-weight: 600;
      }

      /* Material 3 Radio Indicator */
      .m3-radio {
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #44464f);
        display: grid;
        place-items: center;
        transition: border-color var(--m3e-spring-effects-fast);
      }

      .m3-radio.checked {
        border-color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .m3-radio-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--md-sys-color-on-primary-container, #2b3248);
        transform: scale(0);
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .m3-radio.checked .m3-radio-dot {
        transform: scale(1);
      }
    `
];
It([
  P({ attribute: !1 })
], ct.prototype, "hass", 2);
It([
  v()
], ct.prototype, "_config", 2);
It([
  v()
], ct.prototype, "_pressed", 2);
It([
  v()
], ct.prototype, "_selectorOpen", 2);
It([
  T("dialog.mode-dialog")
], ct.prototype, "_dialogEl", 2);
It([
  T(".dialog-surface")
], ct.prototype, "_dialogSurfaceEl", 2);
ct = It([
  z("m3e-assist-card")
], ct);
function Tt(t, e, i) {
  const s = t?.entity_id ?? "", r = s.split(".")[0], a = String(t?.attributes.device_class ?? "").toLowerCase(), o = String(t?.state ?? "").toLowerCase();
  return a === "outlet" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3-9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : r === "light" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : r === "switch" || r === "input_boolean" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4 14H9V7h6v10Zm-4-8v3h2V9h-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 5v3h2v-3h-2Z"/></svg>` : a === "door" || a === "opening" || a === "garage_door" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2Zm-6-6h-2v-2h2v2Zm4 6h-2V5h2v14Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2ZM7 19V5h10v14H7Zm8-8h-2v2h2v-2Z"/></svg>` : a === "window" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h14v-6H5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h6v-6H5Zm8 0v6h6v-6h-6Z"/></svg>` : r === "lock" || a === "lock" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6a5 5 0 0 0-9.58-2l1.84.78A3 3 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-6 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Zm-6-3a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"/></svg>` : r === "fan" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 9.8C12 6.5 14.5 4 15.8 5.4c1 1.1-.5 3.4-2.1 4.8M14.2 12c3.3 0 5.8 2.5 4.4 3.8-1.1 1-3.4-.5-4.8-2.1M12 14.2c0 3.3-2.5 5.8-3.8 4.4-1-1.1.5-3.4 2.1-4.8M9.8 12c-3.3 0-5.8-2.5-4.4-3.8 1.1-1 3.4.5 4.8 2.1"/></svg>` : r === "climate" || i === "climate" ? o === "heat" || o === "heating" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" fill="none"/></svg>` : o === "cool" || o === "cooling" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : a === "tv" || r === "remote" || i === "remote" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : r === "media_player" || i === "media" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : r === "weather" ? o === "sunny" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>` : o === "clear-night" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M20.2 14.4A8.2 8.2 0 0 1 9.6 3.8a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>` : o === "rainy" || o === "pouring" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM8.5 18.2l-.9 2.3M12.5 18.2l-.9 2.3M16.5 18.2l-.9 2.3"/></svg>` : o === "lightning" || o === "lightning-rainy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h2.4M15.4 15.5h1.8a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM13 12.5l-2 4.2h2.6l-1.6 3.8"/></svg>` : o === "snowy" || o === "snowy-rainy" || o === "hail" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3Z"/><circle cx="8.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="12.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="16.5" cy="19.2" r="1.1" fill="currentColor"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 18h10.4a3.8 3.8 0 0 0 .6-7.55A5.6 5.6 0 0 0 7.1 9.1 4.4 4.4 0 0 0 6.8 18Z"/></svg>` : a === "aqi" || a === "pm25" || a === "pm10" || a === "carbon_dioxide" || a === "volatile_organic_compounds" || s.includes("aqi") || s.includes("air_quality") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 12.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 16.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8"/></svg>` : a === "temperature" || s.includes("temp") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : a === "humidity" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : a === "power" || a === "energy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.19-.35L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21Z"/></svg>` : a === "illuminance" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : a === "battery" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.8" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5.8 7.8a6.8 6.8 0 0 0 0 8.4M18.2 7.8a6.8 6.8 0 0 1 0 8.4"/></svg>`;
}
function ot(t) {
  const e = (t || "").trim();
  return e ? e.startsWith("#") || e.startsWith("/") ? e.toLowerCase() : `#${e.toLowerCase()}` : "";
}
function Es(t) {
  const e = ot(t);
  return e ? (window.__m3ePopupRegistry = window.__m3ePopupRegistry || /* @__PURE__ */ new Set(), window.__m3ePopupRegistry.add(e), e) : "";
}
function mi(t) {
  !t || !window.__m3ePopupRegistry || window.__m3ePopupRegistry.delete(t);
}
function Ht(t, e, i) {
  const s = (i || "").trim();
  if (!s) return;
  const r = ot(s);
  if (r && window.__m3ePopupRegistry?.has(r)) {
    if (s.startsWith("#")) {
      const n = window.location.href;
      window.history.pushState(null, "", s), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: n, newURL: window.location.href }));
    }
    window.dispatchEvent(new CustomEvent("m3e-popup-open", { detail: { target: r } }));
    return;
  }
  if (s.startsWith("#")) {
    const n = window.location.href;
    window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: n, newURL: window.location.href })), window.dispatchEvent(new CustomEvent("m3e-popup-open", { detail: { target: r } }));
    return;
  }
  if (s.startsWith("script.") && e) {
    e.callService("script", "turn_on", { entity_id: s });
    return;
  }
  const a = s.startsWith("service:") ? s.slice(8).trim() : s;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(a) && !a.startsWith("/") && e) {
    const [n, c] = a.split(".");
    e.callService(n, c, {});
    return;
  }
  const o = window.location.href;
  window.history.pushState(null, "", s), t.dispatchEvent(
    new CustomEvent("location-changed", {
      bubbles: !0,
      composed: !0,
      detail: { replace: !1 }
    })
  ), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), s.includes("#") && window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: o, newURL: window.location.href }));
}
var Ps = Object.defineProperty, Ms = Object.getOwnPropertyDescriptor, Ee = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ms(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Ps(e, i, r), r;
};
let Rt = class extends A {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._computeItemLabel = (t) => ({
      entity: "Entità",
      attribute: "Attributo valore (vuoto = stato)",
      secondary_attribute: "Attributo extra etichetta (es. AQI • Valore)",
      name: "Nome personalizzato",
      unit: "Unità / Suffisso (es. °)",
      icon: "Icona personalizzata (vuoto = M3 auto)",
      tap_action: "Azione al tap",
      navigation_path: "Percorso (/lovelace/..., #popup, script.*)"
    })[t.name] ?? t.name, this._computeTopLabel = (t) => t.name === "transparent" ? "Sfondo trasparente (integrato nella dashboard come Google Home)" : t.name;
  }
  setConfig(t) {
    this._config = {
      ...t,
      items: Array.isArray(t.items) ? t.items.map((e) => ({ ...e })) : []
    };
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onTopChanged(t) {
    if (!this._config) return;
    const e = t.detail.value;
    this._emitConfig({
      ...this._config,
      transparent: e.transparent
    });
  }
  _onItemChanged(t, e) {
    if (!this._config) return;
    const i = [...this._config.items ?? []], s = {
      ...i[t],
      ...e.detail.value
    };
    s.name || delete s.name, s.attribute || delete s.attribute, s.secondary_attribute || delete s.secondary_attribute, s.icon || delete s.icon, s.unit || delete s.unit, s.navigation_path || delete s.navigation_path, i[t] = s, this._emitConfig({ ...this._config, items: i });
  }
  _addItem() {
    if (!this._config) return;
    const t = [...this._config.items ?? [], { entity: "", tap_action: "more-info" }];
    this._expandedIndex = t.length - 1, this._emitConfig({ ...this._config, items: t });
  }
  _removeItem(t, e) {
    if (e.stopPropagation(), !this._config) return;
    const i = [...this._config.items ?? []];
    i.splice(t, 1), this._expandedIndex >= i.length && (this._expandedIndex = Math.max(0, i.length - 1)), this._emitConfig({ ...this._config, items: i });
  }
  _moveItem(t, e, i) {
    if (i.stopPropagation(), !this._config) return;
    const s = [...this._config.items ?? []], r = t + e;
    r < 0 || r >= s.length || ([s[t], s[r]] = [s[r], s[t]], this._expandedIndex === t ? this._expandedIndex = r : this._expandedIndex === r && (this._expandedIndex = t), this._emitConfig({ ...this._config, items: s }));
  }
  _buildItemSchema(t) {
    const e = [
      { name: "entity", required: !0, selector: { entity: {} } }
    ];
    return t.entity && e.push({
      type: "grid",
      name: "",
      schema: [
        {
          name: "attribute",
          selector: { attribute: { entity_id: t.entity } }
        },
        {
          name: "secondary_attribute",
          selector: { attribute: { entity_id: t.entity } }
        }
      ]
    }), e.push(
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "unit", selector: { text: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "icon", selector: { icon: {} } },
          {
            name: "tap_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "more-info", label: "Dettagli entità (More-info)" },
                  { value: "toggle", label: "Toggle stato" },
                  { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
                  { value: "none", label: "Nessuna azione" }
                ]
              }
            }
          }
        ]
      }
    ), t.tap_action === "navigate" && e.push({ name: "navigation_path", selector: { navigation: {} } }), e;
  }
  _itemTitle(t, e) {
    return t.name ? t.name : t.entity ? this.hass?.states[t.entity]?.attributes.friendly_name || t.entity : `Entità #${e + 1}`;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config.items ?? [];
    return l`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${{ transparent: this._config.transparent !== !1 }}
          .schema=${[{ name: "transparent", selector: { boolean: {} } }]}
          .computeLabel=${this._computeTopLabel}
          @value-changed=${this._onTopChanged}
        ></ha-form>

        <div class="section-header">
          <span class="section-title">Entità At a Glance (${t.length})</span>
        </div>

        <div class="items-list">
          ${t.map((e, i) => {
      const s = this._expandedIndex === i, r = {
        entity: e.entity ?? "",
        attribute: e.attribute ?? "",
        secondary_attribute: e.secondary_attribute ?? "",
        name: e.name ?? "",
        unit: e.unit ?? "",
        icon: e.icon ?? "",
        tap_action: e.tap_action ?? "more-info",
        navigation_path: e.navigation_path ?? ""
      };
      return l`
              <div class="item-card ${s ? "is-expanded" : ""}">
                <div
                  class="item-header"
                  role="button"
                  tabindex="0"
                  @click=${() => {
        this._expandedIndex = s ? -1 : i;
      }}
                >
                  <div class="item-header-left">
                    <span class="item-index">${i + 1}</span>
                    <div class="item-summary">
                      <span class="item-title">${this._itemTitle(e, i)}</span>
                      <span class="item-sub">
                        ${e.entity ? e.attribute ? `${e.entity} · ${e.attribute}` : e.entity : "Seleziona un’entità"}
                      </span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${i === 0}
                      @click=${(a) => this._moveItem(i, -1, a)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === t.length - 1}
                      @click=${(a) => this._moveItem(i, 1, a)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(a) => this._removeItem(i, a)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                ${s ? l`
                      <div class="item-body">
                        <ha-form
                          .hass=${this.hass}
                          .data=${r}
                          .schema=${this._buildItemSchema(e)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(a) => this._onItemChanged(i, a)}
                        ></ha-form>
                      </div>
                    ` : h}
              </div>
            `;
    })}
        </div>

        <button type="button" class="add-btn" @click=${this._addItem}>
          + Aggiungi entità
        </button>
      </div>
    `;
  }
};
Rt.styles = I`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .item-card {
      border-radius: 16px;
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
      overflow: hidden;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .item-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .item-index {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 150ms ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(128, 128, 128, 0.16);
      color: var(--primary-text-color);
    }

    .icon-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .icon-btn.danger:hover {
      color: var(--error-color, #d93025);
      background: rgba(217, 48, 37, 0.12);
    }

    .item-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(128, 128, 128, 0.18));
    }

    .add-btn {
      align-self: flex-start;
      padding: 10px 18px;
      border-radius: 9999px;
      border: none;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 150ms ease, transform 150ms ease;
    }

    .add-btn:hover {
      opacity: 0.92;
    }

    .add-btn:active {
      transform: scale(0.97);
    }
  `;
Ee([
  P({ attribute: !1 })
], Rt.prototype, "hass", 2);
Ee([
  v()
], Rt.prototype, "_config", 2);
Ee([
  v()
], Rt.prototype, "_expandedIndex", 2);
Rt = Ee([
  z("m3e-glance-card-editor")
], Rt);
var Ts = Object.defineProperty, As = Object.getOwnPropertyDescriptor, Pe = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? As(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Ts(e, i, r), r;
};
const Os = /* @__PURE__ */ new Set([
  "on",
  "open",
  "opening",
  "unlocked",
  "detected",
  "home",
  "playing",
  "heat",
  "cool",
  "heat_cool",
  "auto",
  "dry",
  "fan_only",
  "active",
  "true"
]);
let Nt = class extends A {
  constructor() {
    super(...arguments), this._isMouseDragging = !1, this._dragMoved = !1, this._dragStartX = 0, this._dragScrollLeft = 0;
  }
  setConfig(t) {
    if (!t)
      throw new Error("m3e-glance-card: configurazione mancante");
    this._config = {
      ...t,
      transparent: t.transparent !== !1,
      items: Array.isArray(t.items) ? t.items : []
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-glance-card-editor");
  }
  static getStubConfig(t) {
    const e = t?.states ?? {}, i = Object.keys(e), s = [], r = i.find((n) => n.startsWith("weather."));
    r && s.push({ entity: r, unit: "°", tap_action: "more-info" });
    const a = i.find(
      (n) => n.startsWith("sensor.") && (e[n]?.attributes.device_class === "aqi" || e[n]?.attributes.device_class === "temperature" || n.includes("aqi"))
    );
    a && s.push({ entity: a, tap_action: "more-info" });
    const o = i.find(
      (n) => n.startsWith("sensor.") && e[n]?.attributes.device_class === "humidity" && n !== a
    );
    if (o && s.push({ entity: o, tap_action: "more-info" }), s.length === 0) {
      const n = i.find((c) => c.startsWith("sensor.") || c.startsWith("sun."));
      s.push({ entity: n ?? "sun.sun", tap_action: "more-info" });
    }
    return {
      type: "custom:m3e-glance-card",
      transparent: !0,
      items: s
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config")) return !0;
    if (t.has("hass")) {
      const e = t.get("hass");
      if (!e || !this.hass) return !0;
      for (const i of this._config.items)
        if (i.entity && e.states[i.entity] !== this.hass.states[i.entity])
          return !0;
      return e.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  _formatRawValue(t) {
    if (t == null || t === "") return "—";
    const e = String(t).trim(), i = e.toLowerCase();
    if (i === "unavailable") return "Offline";
    if (i === "unknown" || i === "none") return "—";
    if (i === "on") return "On";
    if (i === "off") return "Off";
    if (i === "home") return "In casa";
    if (i === "not_home") return "Fuori";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(e)) {
      const s = new Date(e);
      if (!Number.isNaN(s.getTime()))
        return s.toLocaleTimeString(this.hass?.language ?? "it-IT", {
          hour: "2-digit",
          minute: "2-digit"
        });
    }
    if (/^-?\d+\.\d+$/.test(e)) {
      const s = Number(e);
      if (!Number.isNaN(s))
        return Number.isInteger(s) ? String(s) : s.toFixed(1);
    }
    return e;
  }
  _getPrimaryValue(t, e) {
    if (!e) return "—";
    const i = e.entity_id.split(".")[0];
    let s, r = "";
    if (t.attribute)
      s = e.attributes[t.attribute], t.attribute === "temperature" || t.attribute === "current_temperature" ? r = "°" : (t.attribute === "humidity" || t.attribute === "battery_level") && (r = "%");
    else if (i === "weather" && e.attributes.temperature !== void 0)
      s = e.attributes.temperature, r = "°";
    else {
      s = e.state;
      const n = e.attributes.unit_of_measurement;
      typeof n == "string" && n.trim() && (r = n.trim());
    }
    const a = this._formatRawValue(s);
    if (a === "—" || a === "Offline") return a;
    const o = t.unit !== void 0 ? t.unit : r;
    return o ? o === "°" || o === "%" || o === "°C" || o === "°F" ? `${a}${o}` : `${a} ${o}` : a;
  }
  _getSecondaryLabel(t, e) {
    const i = t.name || e?.attributes.friendly_name || t.entity || "Entità";
    if (t.secondary_attribute && e) {
      const s = e.attributes[t.secondary_attribute];
      if (s != null && String(s).trim() !== "") {
        const r = this._formatRawValue(s), a = r.charAt(0).toUpperCase() + r.slice(1);
        return `${i} • ${a}`;
      }
    }
    return i;
  }
  _onMouseDown(t) {
    !this._stripEl || t.button !== 0 || (this._isMouseDragging = !0, this._dragMoved = !1, this._dragStartX = t.pageX - this._stripEl.offsetLeft, this._dragScrollLeft = this._stripEl.scrollLeft);
  }
  _onMouseMove(t) {
    if (!this._isMouseDragging || !this._stripEl) return;
    const i = t.pageX - this._stripEl.offsetLeft - this._dragStartX;
    Math.abs(i) > 6 && (this._dragMoved = !0, t.preventDefault(), this._stripEl.scrollLeft = this._dragScrollLeft - i);
  }
  _onMouseUpOrLeave() {
    this._isMouseDragging = !1;
  }
  _onItemTap(t) {
    if (this._dragMoved) {
      this._dragMoved = !1;
      return;
    }
    if (!this.hass || !t.entity) return;
    const e = t.tap_action ?? "more-info";
    if (e !== "none") {
      if (e === "navigate" && t.navigation_path) {
        Ht(this, this.hass, t.navigation_path);
        return;
      }
      if (e === "toggle") {
        const i = t.entity.split(".")[0];
        if (["light", "switch", "fan", "input_boolean", "cover", "lock", "media_player"].includes(
          i
        )) {
          this.hass.callService("homeassistant", "toggle", { entity_id: t.entity });
          return;
        }
      }
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: t.entity },
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  render() {
    if (!this._config) return h;
    const t = this._config.items ?? [], e = this._config.transparent !== !1, i = l`
      <div
        class="glance-strip ${e ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${t.length === 0 ? l`<div class="empty-hint">Aggiungi entità dalla configurazione della card</div>` : t.map((s) => {
      const r = s.entity ? this.hass?.states[s.entity] : void 0, a = !r || r.state === "unavailable" || r.state === "unknown", o = !a && Os.has(String(r.state ?? "").toLowerCase()), n = this._getPrimaryValue(s, r), c = this._getSecondaryLabel(s, r), p = (s.tap_action ?? "more-info") !== "none" && !!s.entity;
      return l`
                <button
                  type="button"
                  class="glance-item ${a ? "is-dimmed" : ""} ${p ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(s)}
                >
                  <span class="icon-circle" aria-hidden="true">
                    ${s.icon ? l`<ha-icon .icon=${s.icon}></ha-icon>` : Tt(r, o)}
                  </span>
                  <span class="text-col">
                    <span class="primary-value">${n}</span>
                    <span class="secondary-label">${c}</span>
                  </span>
                </button>
              `;
    })}
      </div>
    `;
    return e ? i : l`<ha-card>${i}</ha-card>`;
  }
};
Nt.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
      }

      ha-card {
        border-radius: var(--m3e-shape-card, 28px);
        overflow: hidden;
      }

      .glance-strip {
        display: flex;
        align-items: center;
        gap: 26px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-snap-type: x proximity;
        touch-action: pan-x;
        -webkit-overflow-scrolling: touch;
      }

      .glance-strip::-webkit-scrollbar {
        display: none;
      }

      .glance-strip.is-transparent {
        padding: 4px 2px;
      }

      .glance-strip.is-card {
        padding: 14px 18px;
      }

      .glance-item {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        flex: 0 0 auto;
        scroll-snap-align: start;
        border: none;
        background: transparent;
        padding: 4px 6px 4px 2px;
        margin: 0;
        border-radius: 9999px;
        text-align: left;
        font-family: inherit;
        color: inherit;
        transition: transform 200ms var(--m3e-spring-fast, cubic-bezier(0.2, 0, 0, 1));
        -webkit-tap-highlight-color: transparent;
      }

      .glance-item.is-clickable {
        cursor: pointer;
      }

      .glance-item.is-clickable:active {
        transform: scale(0.96);
      }

      .glance-item.is-dimmed {
        opacity: 0.6;
      }

      .icon-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.16))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color, #444746));
        transition: background-color 180ms ease;
      }

      .glance-item.is-clickable:hover .icon-circle {
        background: var(
          --md-sys-color-surface-container-high,
          var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.22))
        );
      }

      .icon-circle svg {
        width: 23px;
        height: 23px;
        display: block;
      }

      .icon-circle ha-icon {
        --mdc-icon-size: 23px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .text-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        min-width: 0;
      }

      .primary-value {
        font-size: 19px;
        font-weight: 400;
        line-height: 1.18;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
      }

      .secondary-label {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.24;
        letter-spacing: 0.01em;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        padding: 10px 6px;
      }
    `
];
Pe([
  P({ attribute: !1 })
], Nt.prototype, "hass", 2);
Pe([
  v()
], Nt.prototype, "_config", 2);
Pe([
  T(".glance-strip")
], Nt.prototype, "_stripEl", 2);
Nt = Pe([
  z("m3e-glance-card")
], Nt);
function le(t) {
  if (!t) return null;
  const e = Date.parse(t);
  if (Number.isNaN(e)) return null;
  const i = Math.max(0, Math.floor((Date.now() - e) / 1e3));
  if (i < 5) return "Adesso";
  if (i < 60)
    return i === 1 ? "1 secondo fa" : `${i} secondi fa`;
  const s = Math.floor(i / 60);
  if (s < 60)
    return s === 1 ? "1 minuto fa" : `${s} minuti fa`;
  const r = Math.floor(s / 60);
  if (r < 24)
    return r === 1 ? "1 ora fa" : `${r} ore fa`;
  const a = Math.floor(r / 24);
  return a === 1 ? "1 giorno fa" : `${a} giorni fa`;
}
const Is = {
  en: {
    close: "Close",
    done: "Done",
    offline: "Offline",
    unavailable: "Unavailable",
    on: "On",
    off: "Off",
    turn_on: "Turn on",
    turn_off: "Turn off",
    started: "Started",
    history: "Activity history",
    history_tooltip: "Home Assistant activity history",
    more_options: "More options",
    ha_details: "Home Assistant details",
    now_playing: "Now playing",
    playing: "Playing",
    nothing_playing: "Nothing playing",
    sources: "Sources",
    stop_casting: "Stop casting",
    cast: "Cast",
    close_cast: "Close Cast",
    mute: "Mute",
    unmute: "Unmute",
    muted: "Muted",
    shuffle: "Shuffle",
    repeat: "Repeat",
    previous: "Previous",
    next: "Next",
    play: "Play",
    pause: "Pause",
    indoor: "Indoor",
    outdoor_temperature: "Outdoor temperature",
    humidity: "Humidity",
    media_controls: "Media & Controls",
    loading_features: "Loading Features editor…",
    features_unavailable: "Features editor requires Home Assistant 2025.2+.",
    home: "Home",
    away: "Away"
  },
  it: {
    close: "Chiudi",
    done: "Fatto",
    offline: "Offline",
    unavailable: "Non disponibile",
    on: "On",
    off: "Off",
    turn_on: "Accendi",
    turn_off: "Spegni",
    started: "Avviata",
    history: "Cronologia attività",
    history_tooltip: "Cronologia attività Home Assistant",
    more_options: "Altre opzioni",
    ha_details: "Dettagli Home Assistant",
    now_playing: "In riproduzione",
    playing: "In riproduzione",
    nothing_playing: "Nessuna riproduzione",
    sources: "Sorgenti",
    stop_casting: "Interrompi cast",
    cast: "Cast",
    close_cast: "Chiudi Cast",
    mute: "Muto",
    unmute: "Riattiva audio",
    muted: "Muto",
    shuffle: "Casuale",
    repeat: "Ripeti",
    previous: "Precedente",
    next: "Successivo",
    play: "Riproduci",
    pause: "Pausa",
    indoor: "Interno",
    outdoor_temperature: "Temperatura esterna",
    humidity: "Umidità",
    media_controls: "Media & Controlli",
    loading_features: "Caricamento editor Features…",
    features_unavailable: "L’editor Features richiede Home Assistant 2025.2+.",
    home: "Casa",
    away: "Fuori casa"
  }
};
function Di(t) {
  return (t?.language ?? "en").toLowerCase().startsWith("it") ? "it" : "en";
}
function x(t, e) {
  return Is[Di(t)][e];
}
const Ls = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
function Ue(t, e) {
  const i = t.trim();
  if (!Ls.test(i)) return null;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return null;
  const r = Di(e) === "it", a = Math.round((s.getTime() - Date.now()) / 1e3), o = Math.round(Math.abs(a) / 60);
  if (a >= 0) {
    if (o < 1) return r ? "Tra <1m" : "In <1m";
    if (o < 60) return r ? `Tra ${o}m` : `In ${o}m`;
    const d = Math.floor(o / 60), g = o % 60;
    if (d < 24) {
      const b = g > 0 ? `${d}h ${g}m` : `${d}h`;
      return r ? `Tra ${b}` : `In ${b}`;
    }
    const u = Math.floor(d / 24), m = d % 24, f = r ? "g" : "d", y = m > 0 ? `${u}${f} ${m}h` : `${u}${f}`;
    return r ? `Tra ${y}` : `In ${y}`;
  }
  if (o < 1) return r ? "Ora" : "Now";
  if (o < 60) return r ? `${o}m fa` : `${o}m ago`;
  const n = Math.floor(o / 60), c = o % 60;
  if (n < 24) {
    const d = c > 0 ? `${n}h ${c}m` : `${n}h`;
    return r ? `${d} fa` : `${d} ago`;
  }
  const p = Math.floor(n / 24);
  return r ? `${p}g fa` : `${p}d ago`;
}
function dt(t, e, i, s) {
  if (typeof i == "string") {
    const r = i.trim();
    if (r) return r;
  }
  if (e && i !== void 0 && i !== null && typeof i != "string") {
    if (typeof t?.formatEntityName == "function")
      try {
        const c = t.formatEntityName(e, i);
        if (c && c.trim()) return c.trim();
      } catch {
      }
    const r = Array.isArray(i) ? i : [i], a = [], o = t?.entities?.[e.entity_id], n = o?.device_id ? t?.devices?.[o.device_id] : void 0;
    for (const c of r)
      if (!(!c || typeof c != "object")) {
        if (c.type === "text" && "text" in c && c.text)
          a.push(c.text);
        else if (c.type === "device") {
          const p = n?.name_by_user || n?.name;
          p && a.push(p);
        } else if (c.type === "entity") {
          const p = e.attributes.friendly_name;
          p && a.push(p);
        } else if (c.type === "area") {
          const p = o?.area_id || n?.area_id, d = p ? t?.areas?.[p]?.name : void 0;
          d && a.push(d);
        } else if (c.type === "floor") {
          const p = o?.area_id || n?.area_id, d = p ? t?.areas?.[p]?.floor_id : void 0, g = d ? t?.floors?.[d]?.name : void 0;
          g && a.push(g);
        }
      }
    if (a.length > 0) return a.join(" ");
  }
  return e?.attributes.friendly_name ? e.attributes.friendly_name : s || e?.entity_id || "";
}
function jt(t, e, i, s) {
  if (!e || !i) return null;
  const r = (Array.isArray(i) ? i : [i]).map((o) => String(o ?? "").trim()).filter(Boolean);
  if (r.length === 0) return null;
  const a = [];
  for (const o of r)
    if (o === "state") {
      const c = Ue(String(e.state ?? ""), t) ?? (typeof t?.formatEntityState == "function" ? t.formatEntityState(e) : s ?? e.state);
      c && String(c).trim() && a.push(String(c).trim());
    } else if (o === "last_changed" || o === "last-changed") {
      const n = le(e.last_changed);
      n && a.push(n);
    } else if (o === "last_updated" || o === "last-updated") {
      const n = le(e.last_updated);
      n && a.push(n);
    } else {
      const n = e.attributes[o];
      if (n == null || n === "") continue;
      let c;
      if (typeof t?.formatEntityAttributeValue == "function")
        try {
          c = t.formatEntityAttributeValue(e, o);
        } catch {
          c = void 0;
        }
      const p = (c ?? String(n)).trim();
      p && a.push(p);
    }
  return a.length > 0 ? a.join(" · ") : null;
}
var zs = Object.defineProperty, Ds = Object.getOwnPropertyDescriptor, F = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ds(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && zs(e, i, r), r;
};
const fi = 8, Hs = 420, Rs = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], Hi = "m3e-light-recent-colors:", Ns = 6;
function Ri(t) {
  try {
    const e = window.localStorage.getItem(`${Hi}${t}`);
    if (!e) return [];
    const i = JSON.parse(e);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function Bs(t, e) {
  try {
    const i = Ri(t).filter((r) => r.hex !== e.hex), s = [e, ...i].slice(0, Ns);
    window.localStorage.setItem(`${Hi}${t}`, JSON.stringify(s));
  } catch {
  }
}
function De([t, e, i]) {
  return "#" + [t, e, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function He(t) {
  const e = Math.max(2e3, Math.min(6500, t));
  return e <= 2400 ? [255, 224, 102] : e <= 2900 ? [255, 230, 138] : e <= 3600 ? [255, 240, 184] : e <= 4500 ? [255, 247, 224] : e <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function Us([t, e, i]) {
  const [s, r, a] = [t, e, i].map((o) => {
    const n = o / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * r + 0.0722 * a;
}
let B = class extends A {
  constructor() {
    super(...arguments), this._dragging = !1, this._pressed = !1, this._dragPct = null, this._popupOpen = !1, this._popupDragging = !1, this._popupDragPct = null, this._selectedPresetId = null, this._scenesSheetOpen = !1, this._activeSceneId = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._longPressTriggered = !1, this._longPressTimer = null, this._onDialogBackdropClick = (t) => {
      t.target === this._dialogEl && this.closePopup();
    }, this._onDialogCancel = (t) => {
      t.preventDefault(), this.closePopup();
    }, this._onTilePointerDown = (t) => {
      if (this._isUnavailable || t.button !== 0) return;
      const e = t.currentTarget;
      this._pointerId = t.pointerId, this._pointerStartX = t.clientX, this._pointerStartY = t.clientY, this._hasMoved = !1, this._longPressTriggered = !1, this._pressed = !0, e.setPointerCapture(t.pointerId), this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        !this._hasMoved && this._pointerId !== null && (this._longPressTriggered = !0, this._resetTilePointer(e), this.openPopup());
      }, Hs);
    }, this._onTilePointerMove = (t) => {
      if (this._pointerId !== t.pointerId || !this._supportsBrightness) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < fi && i < fi) return;
        if (this._clearLongPress(), i > e) {
          this._resetTilePointer(t.currentTarget);
          return;
        }
        this._hasMoved = !0, this._dragging = !0;
      }
      const s = this._computeHorizontalPct(t.clientX, t.currentTarget);
      s !== this._dragPct && (this._dragPct = s);
    }, this._onTilePointerUp = (t) => {
      if (this._pointerId !== t.pointerId) return;
      const e = t.currentTarget;
      this._clearLongPress(), this._longPressTriggered || (this._hasMoved && this._dragPct !== null ? this._emitBrightness(this._dragPct) : this._toggleLight()), this._resetTilePointer(e);
    }, this._onTilePointerCancel = (t) => {
      this._pointerId === t.pointerId && (this._clearLongPress(), this._resetTilePointer(t.currentTarget));
    }, this._onTileContextMenu = (t) => {
      t.preventDefault(), this.openPopup();
    }, this._onKeyDown = (t) => {
      if (!this._isUnavailable) {
        if (t.key === " " || t.key === "Enter")
          t.preventDefault(), this._toggleLight();
        else if (t.key === "o" || t.key === "O")
          t.preventDefault(), this.openPopup();
        else if (this._supportsBrightness) {
          const e = t.shiftKey ? 10 : 5;
          t.key === "ArrowRight" || t.key === "ArrowUp" ? (t.preventDefault(), this._emitBrightness(Math.min(100, this._brightnessPct + e))) : (t.key === "ArrowLeft" || t.key === "ArrowDown") && (t.preventDefault(), this._emitBrightness(Math.max(0, this._brightnessPct - e)));
        }
      }
    }, this._onCapsulePointerDown = (t) => {
      if (this._isUnavailable || t.pointerType === "mouse" && t.button !== 0 || !this._supportsBrightness)
        return;
      t.preventDefault();
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._popupDragging = !0;
      const i = this._computeVerticalPct(t.clientY, e);
      this._popupDragPct = i;
    }, this._onCapsulePointerMove = (t) => {
      if (!this._popupDragging) return;
      t.preventDefault();
      const e = this._computeVerticalPct(t.clientY, t.currentTarget);
      e !== this._popupDragPct && (this._popupDragPct = e);
    }, this._onCapsulePointerUp = (t) => {
      if (!this._popupDragging) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._popupDragPct !== null && this._emitBrightness(this._popupDragPct), this._popupDragging = !1, this._popupDragPct = null;
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-light-card",
      entity: (t ? Object.keys(t.states).find((i) => i.startsWith("light.")) : void 0) ?? "light.living_room",
      use_light_color: !0,
      allow_drag_off: !0
    };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "light" } } },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            {
              name: "name",
              selector: { entity_name: {} },
              context: { entity: "entity" }
            },
            { name: "icon", selector: { icon: {} } },
            {
              name: "card_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "default", label: "Google Home (Default 28px)" },
                    { value: "morph", label: "Google Home Morph (28px ↔ Pillola)" },
                    { value: "pill", label: "Pillola piena (M3 Stadium)" },
                    { value: "expressive", label: "M3 Expressive Morph (20px ↔ Pillola)" },
                    { value: "compact", label: "Compatta (56px / 18px)" }
                  ]
                }
              }
            },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "use_entity_icon", selector: { boolean: {} } },
                { name: "hide_state", selector: { boolean: {} } }
              ]
            },
            {
              name: "state_content",
              selector: { ui_state_content: { allow_name: !1 } },
              context: { filter_entity: "entity" }
            },
            { name: "use_light_color", selector: { boolean: {} } }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            { name: "allow_drag_off", selector: { boolean: {} } },
            { name: "scenes", selector: { entity: { domain: "scene", multiple: !0 } } }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Entità luce",
        name: "Nome",
        icon: "Icona personalizzata (vuoto = standard Google Home)",
        card_style: "Design della pillola (Material 3)",
        use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
        hide_state: "Nascondi stato",
        state_content: "Contenuto stato (stato / attributi)",
        use_light_color: "Usa colore reale della luce",
        allow_drag_off: "Spegni trascinando a 0%",
        scenes: "Scene collegate (opzionale, oltre a quelle rilevate dal dispositivo/stanza)"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-light-card: you must define an entity");
    this._config = {
      use_light_color: !0,
      allow_drag_off: !0,
      ...t
    };
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 6, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress();
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_dragging") || t.has("_pressed") || t.has("_dragPct") || t.has("_popupOpen") || t.has("_popupDragging") || t.has("_popupDragPct") || t.has("_selectedPresetId") || t.has("_scenesSheetOpen") || t.has("_activeSceneId"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      const e = this.hass.states[this._config.entity];
      return e !== this._prevEntityState ? (this._prevEntityState = e, !0) : !1;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isOn() {
    return this._popupDragging && this._popupDragPct !== null ? this._popupDragPct > 0 : this._dragging && this._dragPct !== null ? this._dragPct > 0 : this._entity?.state === "on";
  }
  get _isUnavailable() {
    const t = this._entity?.state;
    return !t || t === "unavailable" || t === "unknown";
  }
  get _supportsBrightness() {
    const t = this._entity;
    if (!t) return !1;
    if (typeof t.attributes.brightness == "number") return !0;
    const e = t.attributes.supported_color_modes;
    return Array.isArray(e) ? e.some((i) => i !== "onoff") : !0;
  }
  get _brightnessPct() {
    if (this._popupDragging && this._popupDragPct !== null)
      return this._popupDragPct;
    if (this._dragging && this._dragPct !== null)
      return this._dragPct;
    if (!this._isOn) return 0;
    const t = this._entity?.attributes.brightness;
    return typeof t != "number" ? 100 : Math.max(1, Math.min(100, Math.round(t / 255 * 100)));
  }
  get _activeRgb() {
    if (this._config?.use_light_color === !1) return null;
    const t = this._entity?.attributes;
    return t ? Array.isArray(t.rgb_color) && t.rgb_color.length === 3 ? t.rgb_color : typeof t.color_temp_kelvin == "number" ? He(t.color_temp_kelvin) : null : null;
  }
  get _supportsColorTemp() {
    const t = this._entity?.attributes.supported_color_modes;
    return Array.isArray(t) ? t.includes("color_temp") : !1;
  }
  get _supportsRgb() {
    const t = this._entity?.attributes.supported_color_modes;
    return Array.isArray(t) ? t.some((e) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(e)) : !1;
  }
  get _presets() {
    if (!this._supportsRgb && !this._supportsColorTemp) return [];
    const t = this._config?.entity ?? "", e = [], i = /* @__PURE__ */ new Set(), s = Number(this._entity?.attributes.min_color_temp_kelvin ?? 2e3), r = Number(this._entity?.attributes.max_color_temp_kelvin ?? 6500), a = (n) => {
      if (!this._supportsRgb && !n.kelvin) return;
      const c = n.kelvin && !this._supportsRgb ? `k:${n.kelvin}` : n.hex.toLowerCase();
      i.has(c) || (i.add(c), e.push(n));
    };
    Array.isArray(this._config?.favorite_colors) && this._config.favorite_colors.forEach((n, c) => {
      const p = n.rgb_color ?? (n.color_temp_kelvin ? He(n.color_temp_kelvin) : null);
      if (!p) return;
      const d = De(p);
      a({
        id: `cfg-${c}-${d}`,
        label: n.label || (n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : d),
        hex: d,
        rgb: p,
        kelvin: n.color_temp_kelvin
      });
    });
    const o = this.hass?.entities?.[t]?.options?.light?.favorite_colors;
    if (Array.isArray(o) && o.forEach((n, c) => {
      const p = n.rgb_color ?? (n.color_temp_kelvin ? He(n.color_temp_kelvin) : null);
      if (!p) return;
      const d = De(p);
      a({
        id: `ha-${c}-${d}`,
        label: n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : d,
        hex: d,
        rgb: p,
        kelvin: n.color_temp_kelvin
      });
    }), t)
      for (const n of Ri(t))
        a(n);
    for (const n of Rs)
      if (n.kelvin) {
        if (n.kelvin >= s - 200 && n.kelvin <= r + 200) {
          const c = Math.max(s, Math.min(r, n.kelvin));
          a({ ...n, kelvin: c });
        }
      } else this._supportsRgb && a(n);
    return e;
  }
  get _matchedPresetId() {
    if (this._selectedPresetId) return this._selectedPresetId;
    const t = this._activeRgb;
    if (!t) return null;
    let e = null, i = 1 / 0;
    for (const s of this._presets) {
      const r = Math.abs(s.rgb[0] - t[0]) + Math.abs(s.rgb[1] - t[1]) + Math.abs(s.rgb[2] - t[2]);
      r < i && (i = r, e = s.id);
    }
    return i <= 45 ? e : null;
  }
  _computeColorVars() {
    const t = this._activeRgb;
    if (!t)
      return `
        --m3e-light-accent: var(--md-sys-color-primary, #4c5c92);
        --m3e-light-on-accent: var(--md-sys-color-on-primary, #ffffff);
      `;
    const e = De(t), s = Us(t) > 0.42 ? "#3d2f00" : "#ffffff";
    return `
      --m3e-light-accent: ${e};
      --m3e-light-on-accent: ${s};
    `;
  }
  _emitBrightness(t) {
    !this.hass || !this._config || (t <= 0 ? this.hass.callService("light", "turn_off", {
      entity_id: this._config.entity
    }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      brightness_pct: t
    }));
  }
  /**
   * Collects scenes/effects strictly belonging to this light device:
   * 1. Manually configured scenes in card settings
   * 2. scene.* entities sharing the exact same device_id (e.g. Philips Hue Room/Zone Controls)
   * 3. Built-in light effects from entity.attributes.effect_list (e.g. Scene, Music, Off)
   */
  _getAvailableScenes() {
    if (!this.hass || !this._config) return [];
    const t = [], e = /* @__PURE__ */ new Set(), i = (o) => {
      if (e.has(o)) return;
      const n = this.hass?.states[o];
      !n || !o.startsWith("scene.") || (e.add(o), t.push({
        kind: "scene",
        id: o,
        label: this._cleanSceneName(n),
        entity: n
      }));
    };
    if (Array.isArray(this._config.scenes))
      for (const o of this._config.scenes)
        i(o);
    const s = this._config.entity, r = this.hass.entities?.[s]?.device_id ?? null;
    if (r && this.hass.entities)
      for (const [o, n] of Object.entries(this.hass.entities))
        o.startsWith("scene.") && n.device_id === r && i(o);
    const a = this._entity?.attributes.effect_list;
    if (Array.isArray(a))
      for (const o of a) {
        const n = String(o ?? "").trim();
        if (!n) continue;
        const c = `effect:${n}`;
        e.has(c) || (e.add(c), t.push({
          kind: "effect",
          id: c,
          label: n.replace(/_/g, " ").replace(/^./, (p) => p.toUpperCase()),
          effect: n
        }));
      }
    return t;
  }
  _cleanSceneName(t) {
    const e = (t.attributes.friendly_name || t.entity_id.replace("scene.", "")).trim(), i = this.hass?.entities?.[this._config?.entity ?? ""]?.device_id, s = i ? this.hass?.devices?.[i] : void 0, r = [
      String(t.attributes.group_name ?? ""),
      s?.name_by_user ?? "",
      s?.name ?? "",
      typeof this._config?.name == "string" ? this._config.name : "",
      this._entity?.attributes.friendly_name ?? ""
    ];
    for (const a of r) {
      const o = a.trim();
      if (o && e.length > o.length && e.toLowerCase().startsWith(o.toLowerCase())) {
        const n = e.slice(o.length).replace(/^[\s\-–—:]+/, "").trim();
        if (n) return n.charAt(0).toUpperCase() + n.slice(1);
      }
    }
    return e;
  }
  _activateSceneItem(t) {
    !this.hass || !this._config || (this._activeSceneId = t.id, t.kind === "scene" ? this.hass.callService("scene", "turn_on", {
      entity_id: t.entity.entity_id
    }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      effect: t.effect
    }), this._scenesSheetOpen = !1);
  }
  _toggleLight() {
    !this.hass || !this._config || this._isUnavailable || this.hass.callService("light", "toggle", {
      entity_id: this._config.entity
    });
  }
  _selectPreset(t) {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this._selectedPresetId = t.id, Bs(this._config.entity, t);
    const e = {
      entity_id: this._config.entity
    };
    t.kelvin && this._supportsColorTemp ? e.color_temp_kelvin = t.kelvin : this._supportsRgb && (e.rgb_color = t.rgb), this.hass.callService("light", "turn_on", e);
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform from Tile)
     ========================================================================= */
  async openPopup() {
    if (this._isUnavailable || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const t = this._tileEl?.getBoundingClientRect();
    this._scenesSheetOpen = !1, this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    e && (e.open || e.showModal(), yt(i, t));
  }
  closePopup() {
    xt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._scenesSheetOpen = !1;
    });
  }
  /* =========================================================================
     HORIZONTAL TILE POINTER HANDLERS (Tap = Toggle, Drag = Dim, Hold = Popup)
     ========================================================================= */
  _computeHorizontalPct(t, e) {
    const i = e.getBoundingClientRect();
    if (i.width <= 0) return 0;
    const s = Math.round(Math.max(0, Math.min(1, (t - i.left) / i.width)) * 100);
    return s === 0 && !this._config?.allow_drag_off ? 1 : s;
  }
  _resetTilePointer(t) {
    t && this._pointerId !== null && t.hasPointerCapture(this._pointerId) && t.releasePointerCapture(this._pointerId), this._pointerId = null, this._dragging = !1, this._pressed = !1, this._hasMoved = !1, this._dragPct = null;
  }
  /* =========================================================================
     VERTICAL CAPSULE SLIDER POINTER HANDLERS (Popup Dialog)
     ========================================================================= */
  _computeVerticalPct(t, e) {
    const i = e.getBoundingClientRect();
    if (i.height <= 0) return 0;
    const s = (i.bottom - t) / i.height, r = Math.round(Math.max(0, Math.min(1, s)) * 100);
    return Math.max(1, r);
  }
  /* =========================================================================
     ICONS
     ========================================================================= */
  _renderBulbIcon(t, e) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const i = this._entity.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${i}></ha-icon>`;
    }
    return e ? l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        ` : l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `;
  }
  _renderSunIcon() {
    return l`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"
        />
      </svg>
    `;
  }
  /* =========================================================================
     RENDER
     ========================================================================= */
  render() {
    if (!this._config) return h;
    const t = this._entity, e = dt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._isOn, r = this._brightnessPct, a = this._isUnavailable ? "Offline" : this._dragging && this._supportsBrightness ? `${r}%` : s ? this._supportsBrightness ? `On · ${r}%` : "On" : "Off", o = !!this._config.hide_state, n = !o && !this._dragging ? jt(this.hass, t, this._config.state_content, a) : null, c = o && !this._dragging ? "" : n ?? a, p = this._computeColorVars(), d = this._matchedPresetId, g = this._popupOpen ? this._getAvailableScenes() : [], u = this._popupOpen ? le(t?.last_changed) : null, m = `style-${this._config.card_style ?? "default"}`;
    return l`
      <ha-card
        class="tile-card ${m} ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${p} --fill-pct: ${s ? r : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${e}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${r}
        aria-valuetext=${c}
        @pointerdown=${this._onTilePointerDown}
        @pointermove=${this._onTilePointerMove}
        @pointerup=${this._onTilePointerUp}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${this._onTileContextMenu}
        @keydown=${this._onKeyDown}
      >
        <div class="tile-track" aria-hidden="true">
          <div class="tile-fill"></div>
        </div>
        <div class="state-layer" aria-hidden="true"></div>

        <div class="tile-content">
          <span class="bulb-icon">${this._renderBulbIcon(i, s)}</span>
          <div class="meta">
            <span class="title">${e}</span>
            ${c ? l`<span class="subtitle">${c}</span>` : h}
          </div>
          ${this._isUnavailable ? l`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : h}
        </div>
      </ha-card>

      <dialog
        class="light-dialog"
        style="${p}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
        @touchmove=${(f) => bt(f, this._dialogEl)}
      >
        ${this._popupOpen ? l`
              <div class="dialog-surface ${s ? "is-on" : "is-off"}">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.closePopup()}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <div class="dialog-title-wrap">
                    <span class="dialog-title">${e}</span>
                    ${u ? l`<span class="dialog-last-changed">${u}</span>` : h}
                  </div>
                  <div class="header-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label=${x(this.hass, "history")}
                      title=${x(this.hass, "history_tooltip")}
                      @click=${() => {
      const f = this._config?.entity;
      f && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: f, view: "history" }
        })
      ));
    }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="power-btn ${s ? "is-on" : ""}"
                      @click=${this._toggleLight}
                      aria-label="${s ? x(this.hass, "turn_off") : x(this.hass, "turn_on")} ${e}"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                        />
                      </svg>
                    </button>
                  </div>
                </header>

                <div class="capsule-stage">
                  <div
                    class="capsule-wrapper ${s ? "is-on" : "is-off"} ${this._popupDragging ? "is-dragging" : ""}"
                    style="--fill-pct: ${s ? r : 0}%;"
                  >
                    <!-- Floating percentage tooltip on the left during drag -->
                    <div
                      class="drag-tooltip ${this._popupDragging ? "visible" : ""}"
                      aria-hidden="true"
                    >
                      ${r}%
                    </div>

                    <!-- Vertical clipped-fill capsule slider -->
                    <div
                      class="capsule-slider"
                      role="slider"
                      tabindex="0"
                      aria-label="${e} brightness"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${r}
                      aria-valuetext=${s ? `${r}%` : "Off"}
                      @pointerdown=${this._onCapsulePointerDown}
                      @pointermove=${this._onCapsulePointerMove}
                      @pointerup=${this._onCapsulePointerUp}
                      @pointercancel=${this._onCapsulePointerUp}
                      @keydown=${this._onKeyDown}
                    >
                      <div class="capsule-fill"></div>

                      <!-- Base sun icon (light/muted on empty track) -->
                      <div class="sun-layer sun-base" aria-hidden="true">
                        ${this._renderSunIcon()}
                      </div>

                      <!-- Clipped sun icon (dark contrast on active fill, exact horizontal split) -->
                      ${s ? l`
                            <div class="sun-layer sun-filled" aria-hidden="true">
                              ${this._renderSunIcon()}
                            </div>
                          ` : h}
                    </div>
                  </div>

                  <div class="readout">
                    <span class="readout-value">${s ? `${r}%` : "Off"}</span>
                    <span class="readout-label ${s ? "" : "hidden"}">Brightness</span>
                  </div>
                </div>

                ${this._presets.length > 0 || g.length > 0 ? l`
                      <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                        <button
                          type="button"
                          class="palette-btn ${this._scenesSheetOpen ? "is-open" : ""}"
                          title=${g.length > 0 ? "Scene" : "More info"}
                          @click=${() => {
      g.length > 0 ? this._scenesSheetOpen = !this._scenesSheetOpen : this._config && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: this._config.entity }
        })
      ));
    }}
                          aria-label=${g.length > 0 ? "Scenes" : "Color picker"}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                            />
                          </svg>
                        </button>

                        ${this._presets.map(
      (f) => l`
                            <button
                              type="button"
                              class="color-swatch ${s && d === f.id ? "selected" : ""}"
                              style="background: ${f.hex};"
                              role="radio"
                              aria-checked=${String(s && d === f.id)}
                              aria-label=${f.label}
                              title=${f.label}
                              @click=${() => this._selectPreset(f)}
                            ></button>
                          `
    )}
                      </div>
                    ` : h}
                ${this._scenesSheetOpen && g.length > 0 ? l`
                      <div
                        class="scenes-sheet-backdrop"
                        @click=${() => this._scenesSheetOpen = !1}
                      >
                        <div class="scenes-sheet" @click=${(f) => f.stopPropagation()}>
                          <div class="scenes-sheet-header">
                            <button
                              type="button"
                              class="icon-btn"
                              @click=${() => this._scenesSheetOpen = !1}
                              aria-label="Close scenes"
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fill="currentColor"
                                  d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                                />
                              </svg>
                            </button>
                            <span>Scene</span>
                          </div>
                          <div class="scenes-sheet-list">
                            ${g.map((f) => {
      const y = String(this._entity?.attributes.effect ?? ""), b = f.kind === "effect" ? y.toLowerCase() === f.effect.toLowerCase() : this._activeSceneId === f.id;
      return l`
                                <button
                                  type="button"
                                  class="scene-option ${b ? "selected" : ""}"
                                  @click=${() => this._activateSceneItem(f)}
                                >
                                  <span class="scene-option-left">
                                    ${f.kind === "scene" && typeof customElements < "u" && customElements.get("ha-state-icon") ? l`<ha-state-icon
                                          class="scene-ha-icon"
                                          .hass=${this.hass}
                                          .stateObj=${f.entity}
                                        ></ha-state-icon>` : l`<svg viewBox="0 0 24 24" class="scene-svg"><path fill="currentColor" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"/></svg>`}
                                    <span>${f.label}</span>
                                  </span>
                                  ${b ? l`<span>✓</span>` : h}
                                </button>
                              `;
    })}
                          </div>
                        </div>
                      </div>
                    ` : h}
              </div>
            ` : h}
      </dialog>
    `;
  }
};
B.styles = [
  U,
  I`
      :host {
        /* MediumBouncy, Low stiffness spring for M3 Expressive On <-> Off morphing */
        --m3e-spring-bouncy: 560ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. COMPACT GOOGLE HOME HORIZONTAL TILE (Clipped Flat-Edge Slider)
         ===================================================================== */
      .tile-card {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        touch-action: pan-y;
        outline: none;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default),
          box-shadow var(--m3e-spring-effects-default);
      }

      .tile-card.is-on {
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 14%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
      }

      .tile-card.is-pressed:not(.is-dragging) {
        transform: scale(var(--m3e-press-scale-tile, 0.965));
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }

      .tile-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .tile-card.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tile-track {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      /* Clean flat vertical dividing edge clipped by ha-card border-radius (no handle, no dot) */
      .tile-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--fill-pct, 0%);
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 30%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
        transition:
          width var(--m3e-spring-spatial-default),
          background-color var(--m3e-spring-effects-default);
      }

      .tile-card.is-dragging .tile-fill {
        transition: background-color var(--m3e-spring-effects-default);
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .tile-card:hover .state-layer {
        opacity: 0.05;
      }

      .tile-card.is-pressed .state-layer {
        opacity: 0.09;
      }

      .tile-content {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
      }

      /* Bare lightbulb icon — no container box */
      .bulb-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition:
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .tile-card.is-on .bulb-icon {
        color: color-mix(
          in srgb,
          var(--m3e-light-accent) 65%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .bulb-icon ha-icon,
      .bulb-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .title {
        font-size: var(--md-sys-typescale-title-medium-size, 14.5px);
        font-weight: var(--md-sys-typescale-title-medium-weight, 600);
        line-height: 18px;
        letter-spacing: 0.05px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
        transition: color var(--m3e-spring-effects-default);
      }

      .subtitle {
        font-size: var(--md-sys-typescale-body-medium-size, 13px);
        font-weight: 500;
        line-height: 17px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color var(--m3e-spring-effects-default);
      }

      .tile-card.is-on .title,
      .tile-card.is-on .subtitle {
        color: color-mix(
          in srgb,
          var(--m3e-light-accent) 55%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      /* =====================================================================
         2. FULL LIGHT CONTROL POPUP DIALOG (Google Home Vertical Capsule)
         ===================================================================== */
      dialog.light-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overflow: visible;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.light-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 56%, transparent);
      }

      .dialog-surface {
        position: relative;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        border-radius: 32px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.light-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-last-changed {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .icon-btn,
      .scene-btn,
      .power-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .scene-btn,
      .power-btn {
        background: var(--md-sys-color-surface-container-highest, #35343a);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .scene-btn.is-open,
      .power-btn.is-on {
        background: var(--md-sys-color-primary-container, #344479);
        color: var(--md-sys-color-on-primary-container, #dbe1ff);
      }

      .icon-btn:active,
      .scene-btn:active,
      .power-btn:active {
        transform: scale(0.92);
      }

      .icon-btn svg,
      .scene-btn svg,
      .power-btn svg {
        width: 22px;
        height: 22px;
      }

      /* Inline Scenes Bottom Sheet */
      .scenes-sheet-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: flex-end;
        z-index: 10;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .scenes-sheet {
        width: 100%;
        max-height: 78%;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: m3e-sheet-up 260ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }

      .scenes-sheet-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .scenes-sheet-list {
        flex: 1 1 auto;
        overflow-y: auto;
        overscroll-behavior: contain;
        max-height: 52vh;
        padding-bottom: 6px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .scene-option {
        width: 100%;
        border: 0;
        padding: 15px 18px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition: border-radius var(--m3e-spring-spatial-fast);
      }

      .scene-option.selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #344479);
        color: var(--md-sys-color-on-primary-container, #dbe1ff);
      }

      .scene-option-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .scene-svg,
      .scene-ha-icon {
        width: 20px;
        height: 20px;
        --mdc-icon-size: 20px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      /* Vertical Capsule Stage */
      .capsule-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-block: 4px;
      }

      .capsule-wrapper {
        position: relative;
        width: clamp(148px, 42vw, 176px);
        height: clamp(250px, 42dvh, 348px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Floating white/inverse pill tooltip tracking the fill edge on the left */
      .drag-tooltip {
        position: absolute;
        right: calc(100% + 14px);
        bottom: clamp(8px, calc(var(--fill-pct, 0%) - 19px), calc(100% - 44px));
        padding: 9px 16px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-inverse-surface, #f2f0f4);
        color: var(--md-sys-color-inverse-on-surface, #1b1b1f);
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.75) translateX(6px);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .drag-tooltip.visible {
        opacity: 1;
        transform: scale(1) translateX(0);
      }

      /* Vertical Clipped-Fill Capsule with M3 Expressive On <-> Off Shape Morph */
      .capsule-slider {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: ns-resize;
        user-select: none;
        touch-action: none;
        outline: none;

        /* ON state: full capsule pill (raggio = 50% della larghezza) */
        border-radius: 88px;
        transform: scale(1);
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 22%,
          var(--md-sys-color-surface-container-highest, #303036)
        );

        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default);
      }

      /* OFF state: morphs to RoundedCornerShape(28dp) + slight scale reduction + neutral gray */
      .capsule-wrapper.is-off .capsule-slider {
        border-radius: 28px;
        transform: scale(0.94, 0.96);
        background: var(--md-sys-color-surface-container-highest, #303036);
        cursor: pointer;
      }

      .capsule-slider:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 4px;
      }

      .capsule-fill {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: var(--fill-pct, 0%);
        background: var(--m3e-light-accent);
        opacity: 1;
        transition:
          height var(--m3e-spring-spatial-default),
          opacity var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-default);
      }

      .capsule-wrapper.is-off .capsule-fill {
        opacity: 0;
      }

      .capsule-wrapper.is-dragging .capsule-fill,
      .capsule-wrapper.is-dragging .sun-filled {
        transition: background-color var(--m3e-spring-effects-default);
      }

      /* Anchored sun icon at bottom center with pixel-accurate dual contrast clipping */
      .sun-layer {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 24px;
        pointer-events: none;
      }

      .sun-layer svg {
        width: 28px;
        height: 28px;
      }

      .sun-base {
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .sun-filled {
        color: var(--m3e-light-on-accent, #3d2f00);
        clip-path: inset(calc(100% - var(--fill-pct, 0%)) 0 0 0);
        transition: clip-path var(--m3e-spring-spatial-default);
      }

      /* Readout below capsule */
      .readout {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        min-height: 48px;
      }

      .readout-value {
        font-size: 24px;
        font-weight: 500;
        line-height: 30px;
        font-variant-numeric: tabular-nums;
      }

      .readout-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .readout-label.hidden {
        opacity: 0;
      }

      /* =====================================================================
         3. MORPHING COLOR SWATCH STRIP (Circle -> Squircle on Selection)
         ===================================================================== */
      .swatch-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        touch-action: pan-x;
        -webkit-overflow-scrolling: touch;
        padding: 4px 2px;
        scrollbar-width: none;
      }

      .swatch-bar::-webkit-scrollbar {
        display: none;
      }

      .palette-btn,
      .color-swatch {
        flex: 0 0 52px;
        width: 52px;
        height: 52px;
        border: 0;
        padding: 0;
        cursor: pointer;
        border-radius: 50%;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast);
      }

      .palette-btn {
        display: grid;
        place-items: center;
        background: var(--md-sys-color-surface-container-highest, #303036);
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .palette-btn.is-open {
        border-radius: 16px;
        background: var(--md-sys-color-primary-container, #344479);
        color: var(--md-sys-color-on-primary-container, #dbe1ff);
      }

      .palette-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Selected swatch morphs from CircleShape -> RoundedCornerShape(16dp) squircle, no border */
      .color-swatch.selected {
        border-radius: 16px;
        transform: scale(1.04);
      }

      .color-swatch:active,
      .palette-btn:active {
        transform: scale(0.92);
      }
    `
];
F([
  P({ attribute: !1 })
], B.prototype, "hass", 2);
F([
  v()
], B.prototype, "_config", 2);
F([
  v()
], B.prototype, "_dragging", 2);
F([
  v()
], B.prototype, "_pressed", 2);
F([
  v()
], B.prototype, "_dragPct", 2);
F([
  v()
], B.prototype, "_popupOpen", 2);
F([
  v()
], B.prototype, "_popupDragging", 2);
F([
  v()
], B.prototype, "_popupDragPct", 2);
F([
  v()
], B.prototype, "_selectedPresetId", 2);
F([
  v()
], B.prototype, "_scenesSheetOpen", 2);
F([
  v()
], B.prototype, "_activeSceneId", 2);
F([
  T("dialog.light-dialog")
], B.prototype, "_dialogEl", 2);
F([
  T(".tile-card")
], B.prototype, "_tileEl", 2);
F([
  T(".dialog-surface")
], B.prototype, "_dialogSurfaceEl", 2);
B = F([
  z("m3e-light-card")
], B);
var Zs = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, Me = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Vs(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Zs(e, i, r), r;
};
let Bt = class extends A {
  constructor() {
    super(...arguments), this._optimisticOn = null, this._optimisticTimer = null;
  }
  static getStubConfig() {
    return {
      type: "custom:m3e-light-control-card",
      label_on: "All on",
      label_off: "All off"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entities",
          selector: { entity: { domain: "light", multiple: !0 } }
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "label_on", selector: { text: {} } },
            { name: "label_off", selector: { text: {} } }
          ]
        },
        { name: "use_theme_color", selector: { boolean: {} } }
      ],
      computeLabel: (t) => ({
        entities: "Luci o gruppi da controllare (vuoto = tutte le luci di casa)",
        label_on: "Testo sinistra (default: All on)",
        label_off: "Testo destra (default: All off)",
        use_theme_color: "Usa colore tema M3Y invece dell’ambra caldo"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    this._config = {
      label_on: "All on",
      label_off: "All off",
      use_theme_color: !1,
      ...t
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: "auto", columns: 12, min_columns: 6 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._optimisticTimer !== null && (window.clearTimeout(this._optimisticTimer), this._optimisticTimer = null);
  }
  get _isDark() {
    return typeof this.hass?.themes?.darkMode == "boolean" ? this.hass.themes.darkMode : typeof window < "u" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  }
  _targetLightEntities() {
    if (!this.hass) return [];
    const t = this._config?.entities;
    return Array.isArray(t) && t.length > 0 ? t.map((e) => this.hass.states[e]).filter((e) => !!e) : Object.values(this.hass.states).filter((e) => e.entity_id.startsWith("light."));
  }
  _computeAnyOn() {
    return this._targetLightEntities().some((t) => t.state === "on");
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_optimisticOn"))
      return !0;
    if (t.has("hass")) {
      const e = this._computeAnyOn(), i = this._isDark;
      return e !== this._lastAnyOn || i !== this._lastDarkMode ? (this._lastAnyOn = e, this._lastDarkMode = i, !0) : !1;
    }
    return !1;
  }
  _spawnRipple(t) {
    const e = t.currentTarget, i = e.getBoundingClientRect(), s = Math.max(i.width, i.height) * 2.1, r = t.clientX - i.left - s / 2, a = t.clientY - i.top - s / 2, o = document.createElement("span");
    o.className = "m3-ripple", o.style.width = `${s}px`, o.style.height = `${s}px`, o.style.left = `${r}px`, o.style.top = `${a}px`, e.appendChild(o);
    const n = o.animate(
      [
        { transform: "scale(0.15)", opacity: 0.28 },
        { transform: "scale(1)", opacity: 0.16, offset: 0.65 },
        { transform: "scale(1.05)", opacity: 0 }
      ],
      {
        duration: 460,
        easing: "cubic-bezier(0.2, 0, 0, 1)"
      }
    );
    n.onfinish = () => o.remove();
  }
  _trigger(t) {
    if (!this.hass) return;
    const e = this._config?.entities, i = Array.isArray(e) && e.length > 0 ? e : "all";
    this._optimisticOn = t, this._optimisticTimer !== null && window.clearTimeout(this._optimisticTimer), this._optimisticTimer = window.setTimeout(() => {
      this._optimisticOn = null, this._optimisticTimer = null;
    }, 1200), this.hass.callService("light", t ? "turn_on" : "turn_off", {
      entity_id: i
    });
  }
  render() {
    if (!this._config) return h;
    const t = this._optimisticOn !== null ? this._optimisticOn : this._computeAnyOn(), e = this._config.label_on?.trim() || "All on", i = this._config.label_off?.trim() || "All off", s = !!this._config.use_theme_color, r = this._isDark;
    return l`
      <ha-card
        class="control-pill ${t ? "state-on" : "state-off"} ${s ? "use-theme" : ""} ${r ? "is-dark" : "is-light"}"
        role="group"
        aria-label="Light control"
      >
        <!-- Sliding shared-element active indicator with razor-sharp curved border & straight center edge -->
        <div class="pill-indicator" aria-hidden="true"></div>

        <button
          type="button"
          class="seg-btn seg-left ${t ? "is-selected" : ""}"
          aria-pressed=${String(t)}
          @pointerdown=${(a) => this._spawnRipple(a)}
          @click=${() => this._trigger(!0)}
        >
          <span class="seg-label">${e}</span>
        </button>

        <button
          type="button"
          class="seg-btn seg-right ${t ? "" : "is-selected"}"
          aria-pressed=${String(!t)}
          @pointerdown=${(a) => this._spawnRipple(a)}
          @click=${() => this._trigger(!1)}
        >
          <span class="seg-label">${i}</span>
        </button>
      </ha-card>
    `;
  }
};
Bt.styles = [
  U,
  I`
      .control-pill {
        position: relative;
        height: 100%;
        min-height: 64px;
        border-radius: var(--m3e-corner-full);
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        background: var(--ha-card-background, var(--md-sys-color-surface-container, #efefef));
        /* Google Home Light Mode warm amber palette */
        --pill-active-bg: #fae08d;
        --pill-active-fg: #5c4900;
        --pill-active-border: #6f5900;
        --pill-ripple: #6f5900;
      }

      /* Google Home Dark Mode warm amber container */
      .control-pill.is-dark:not(.use-theme) {
        --pill-active-bg: #4d411c;
        --pill-active-fg: #ffe082;
        --pill-active-border: #d9be6c;
        --pill-ripple: #ffe082;
      }

      /* Optional M3Y theme override */
      .control-pill.use-theme {
        --pill-active-bg: var(--md-sys-color-primary-container, #dbe1ff);
        --pill-active-fg: var(--md-sys-color-on-primary-container, #1c1b18);
        --pill-active-border: var(--md-sys-color-on-primary-container, #1c1b18);
        --pill-ripple: var(--md-sys-color-on-primary-container, #1c1b18);
      }

      /* Sliding active indicator: full pill outer edge + straight vertical center edge */
      .pill-indicator {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 50%;
        pointer-events: none;
        box-sizing: border-box;
        background: var(--pill-active-bg);
        box-shadow: inset 0 0 0 1.5px var(--pill-active-border);
        border-radius: 9999px 0 0 9999px;
        transform: translateX(0%);
        transition:
          transform 280ms cubic-bezier(0.2, 0, 0, 1),
          border-radius 280ms cubic-bezier(0.2, 0, 0, 1),
          background-color 200ms cubic-bezier(0.2, 0, 0, 1);
      }

      .control-pill.state-off .pill-indicator {
        transform: translateX(100%);
        border-radius: 0 9999px 9999px 0;
      }

      .seg-btn {
        position: relative;
        z-index: 1;
        overflow: hidden;
        border: 0;
        margin: 0;
        padding: 0 16px;
        min-height: 64px;
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.1px;
        color: var(--md-sys-color-on-surface, #1c1b18);
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        transition: color 200ms cubic-bezier(0.2, 0, 0, 1);
      }

      .seg-left {
        border-radius: 9999px 0 0 9999px;
      }

      .seg-right {
        border-radius: 0 9999px 9999px 0;
      }

      .seg-btn.is-selected {
        color: var(--pill-active-fg);
      }

      .seg-label {
        position: relative;
        z-index: 1;
        pointer-events: none;
      }

      .m3-ripple {
        position: absolute;
        border-radius: 50%;
        background: var(--pill-ripple);
        pointer-events: none;
        transform-origin: center;
      }

      .seg-btn:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: -3px;
      }
    `
];
Me([
  P({ attribute: !1 })
], Bt.prototype, "hass", 2);
Me([
  v()
], Bt.prototype, "_config", 2);
Me([
  v()
], Bt.prototype, "_optimisticOn", 2);
Bt = Me([
  z("m3e-light-control-card")
], Bt);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fs = (t) => t.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const js = { CHILD: 2 }, Ws = (t) => (...e) => ({ _$litDirective$: t, values: e });
class Gs {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, s) {
    this._$Ct = e, this._$AM = i, this._$Ci = s;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = (t, e) => {
  const i = t._$AN;
  if (i === void 0) return !1;
  for (const s of i) s._$AO?.(e, !1), se(s, e);
  return !0;
}, $e = (t) => {
  let e, i;
  do {
    if ((e = t._$AM) === void 0) break;
    i = e._$AN, i.delete(t), t = e;
  } while (i?.size === 0);
}, Ni = (t) => {
  for (let e; e = t._$AM; t = e) {
    let i = e._$AN;
    if (i === void 0) e._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(t)) break;
    i.add(t), qs(e);
  }
};
function Ys(t) {
  this._$AN !== void 0 ? ($e(this), this._$AM = t, Ni(this)) : this._$AM = t;
}
function Ks(t, e = !1, i = 0) {
  const s = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (e) if (Array.isArray(s)) for (let a = i; a < s.length; a++) se(s[a], !1), $e(s[a]);
  else s != null && (se(s, !1), $e(s));
  else se(this, t);
}
const qs = (t) => {
  t.type == js.CHILD && (t._$AP ??= Ks, t._$AQ ??= Ys);
};
class Xs extends Gs {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, i, s) {
    super._$AT(e, i, s), Ni(this), this.isConnected = e._$AU;
  }
  _$AO(e, i = !0) {
    e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), i && (se(this, e), $e(this));
  }
  setValue(e) {
    if (Fs(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = e, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Re = /* @__PURE__ */ new WeakMap(), Ze = Ws(class extends Xs {
  render(t) {
    return h;
  }
  update(t, [e]) {
    const i = e !== this.G;
    return i && this.rt(void 0), (i || this.lt !== this.ct) && (this.G = e, this.ht = t.options?.host, this.rt(this.ct = t.element)), h;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let i = Re.get(e);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), Re.set(e, i)), i.get(this.G) !== void 0 && this.G.call(this.ht, void 0), i.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    return typeof this.G == "function" ? Re.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var Js = Object.defineProperty, Qs = Object.getOwnPropertyDescriptor, st = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Qs(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Js(e, i, r), r;
};
const gi = 8;
let G = class extends A {
  constructor() {
    super(...arguments), this._expanded = !1, this._popupOpen = !1, this._dragging = !1, this._pressed = !1, this._dragPct = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._prevStates = {}, this._onHeaderPointerDown = (t) => {
      if (t.button !== 0 || this._aggregateStats.isUnavailable) return;
      const e = t.currentTarget;
      this._pointerId = t.pointerId, this._pointerStartX = t.clientX, this._pointerStartY = t.clientY, this._hasMoved = !1, this._pressed = !0, e.setPointerCapture(t.pointerId);
    }, this._onHeaderPointerMove = (t) => {
      if (this._pointerId !== t.pointerId) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < gi && i < gi) return;
        if (i > e) {
          this._resetPointer(t.currentTarget);
          return;
        }
        this._hasMoved = !0, this._dragging = !0;
      }
      const s = this._computeHorizontalPct(t.clientX, t.currentTarget);
      s !== this._dragPct && (this._dragPct = s);
    }, this._onHeaderPointerUp = (t) => {
      if (this._pointerId !== t.pointerId) return;
      const e = t.currentTarget;
      this._hasMoved && this._dragPct !== null ? this._emitGroupBrightness(this._dragPct) : this.hass && this._config && this.hass.callService("light", "toggle", { entity_id: this._config.entity }), this._resetPointer(e);
    }, this._toggleExpand = (t) => {
      if (t.stopPropagation(), this._config?.compact) {
        this._openPopup();
        return;
      }
      this._expanded = !this._expanded;
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-light-group-card",
      entity: (t ? Object.values(t.states).find(
        (i) => i.entity_id.startsWith("light.") && Array.isArray(i.attributes.entity_id) && i.attributes.entity_id.length > 0
      )?.entity_id : void 0) ?? "light.living_room_group",
      expanded: !1,
      use_light_color: !0
    };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "light" } } },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            {
              name: "name",
              selector: { entity_name: {} },
              context: { entity: "entity" }
            },
            { name: "icon", selector: { icon: {} } },
            {
              name: "card_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "default", label: "Google Home (Default 28px)" },
                    { value: "morph", label: "Google Home Morph (28px ↔ Pillola)" },
                    { value: "pill", label: "Pillola piena (M3 Stadium)" },
                    { value: "expressive", label: "M3 Expressive Morph (20px ↔ Pillola)" },
                    { value: "compact", label: "Compatta (56px / 18px)" }
                  ]
                }
              }
            },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "use_entity_icon", selector: { boolean: {} } },
                { name: "hide_state", selector: { boolean: {} } }
              ]
            },
            {
              name: "state_content",
              selector: { ui_state_content: { allow_name: !1 } },
              context: { filter_entity: "entity" }
            },
            { name: "use_light_color", selector: { boolean: {} } }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            { name: "compact", selector: { boolean: {} } },
            { name: "expanded", selector: { boolean: {} } }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Gruppo luci (entità light con luci figlie)",
        name: "Nome",
        icon: "Icona personalizzata (vuoto = lampade Google Home)",
        use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
        hide_state: "Nascondi stato",
        state_content: "Contenuto stato (stato / attributi)",
        compact: "Modalità compatta (mezza larghezza con popup)",
        expanded: "Espanso di default (solo modalità estesa)",
        use_light_color: "Usa colore reale delle luci",
        card_style: "Design della pillola (Material 3)"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-light-group-card: you must define a light group entity");
    this._config = {
      compact: !1,
      expanded: !1,
      use_light_color: !0,
      card_style: "default",
      ...t
    }, this._expanded = !this._config.compact && !!this._config.expanded;
  }
  getCardSize() {
    return this._config?.compact ? 2 : this._expanded ? 4 : 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: !!this._config?.compact ? 6 : 12, min_columns: 6 };
  }
  get _groupEntity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _childEntityIds() {
    const t = this._groupEntity?.attributes.entity_id;
    return Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.startsWith("light.")) : [];
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_expanded") || t.has("_popupOpen") || t.has("_dragging") || t.has("_pressed") || t.has("_dragPct"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      const e = [this._config.entity, ...this._childEntityIds];
      let i = !1;
      for (const s of e) {
        const r = this.hass.states[s];
        r !== this._prevStates[s] && (this._prevStates[s] = r, i = !0);
      }
      return i;
    }
    return !1;
  }
  get _aggregateStats() {
    const t = this._groupEntity, i = this._childEntityIds.map((c) => this.hass?.states[c]).filter((c) => !!c), s = i.filter((c) => c.state === "on"), r = i.length > 0 ? s.length : t?.state === "on" ? 1 : 0;
    let a = 0;
    if (this._dragging && this._dragPct !== null)
      a = this._dragPct;
    else if (s.length > 0) {
      const c = s.map(
        (p) => typeof p.attributes.brightness == "number" ? Math.max(1, Math.round(p.attributes.brightness / 255 * 100)) : 100
      );
      a = Math.round(c.reduce((p, d) => p + d, 0) / c.length);
    } else if (t?.state === "on") {
      const c = t.attributes.brightness;
      a = typeof c == "number" ? Math.max(1, Math.round(c / 255 * 100)) : 100;
    }
    const o = this._dragging && this._dragPct !== null ? this._dragPct > 0 : r > 0, n = !t || t.state === "unavailable" || t.state === "unknown";
    return { onCount: r, totalCount: i.length, avgPct: a, isOn: o, isUnavailable: n };
  }
  _computeAccentCss() {
    if (this._config?.use_light_color === !1)
      return "--m3e-group-accent: var(--md-sys-color-primary, #4c5c92);";
    const t = this._groupEntity?.attributes.rgb_color;
    return Array.isArray(t) && t.length === 3 ? `--m3e-group-accent: ${"#" + t.map((i) => Math.max(0, Math.min(255, Math.round(Number(i)))).toString(16).padStart(2, "0")).join("")};` : "--m3e-group-accent: #ffe066;";
  }
  _computeHorizontalPct(t, e) {
    const i = e.getBoundingClientRect();
    return i.width <= 0 ? 0 : Math.round(Math.max(0, Math.min(1, (t - i.left) / i.width)) * 100);
  }
  _emitGroupBrightness(t) {
    !this.hass || !this._config || (t <= 0 ? this.hass.callService("light", "turn_off", { entity_id: this._config.entity }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      brightness_pct: t
    }));
  }
  _resetPointer(t) {
    t && this._pointerId !== null && t.hasPointerCapture(this._pointerId) && t.releasePointerCapture(this._pointerId), this._pointerId = null, this._dragging = !1, this._pressed = !1, this._hasMoved = !1, this._dragPct = null;
  }
  async _openPopup() {
    const t = this._headerEl?.getBoundingClientRect() ?? null;
    this._popupOpen = !0, await this.updateComplete, this._dialogEl && !this._dialogEl.open && this._dialogEl.showModal();
    const e = this.shadowRoot?.querySelector(".dialog-surface");
    yt(e, t);
  }
  _closePopup() {
    const t = this.shadowRoot?.querySelector(".dialog-surface");
    xt(this._dialogEl, t, () => {
      this._popupOpen = !1;
    });
  }
  _toggleGroupMaster(t) {
    !this.hass || !this._config || this.hass.callService("light", t ? "turn_on" : "turn_off", {
      entity_id: this._config.entity
    });
  }
  _renderGroupIcon(t) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._groupEntity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${this._groupEntity}></ha-state-icon>`;
      const e = this._groupEntity.attributes.icon;
      if (e && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${e}></ha-icon>`;
    }
    return l`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5 11h4.5l-1.2-5H6.2L5 11Zm2.25 1v6H5v2h6.5v-2H9.25v-6h-2ZM15 4v3.2a3.5 3.5 0 0 0-2.5 3.3h7A3.5 3.5 0 0 0 17 7.2V4h-2Zm-1.2 8a2.2 2.2 0 0 0 4.4 0h-4.4Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return h;
    const t = this._groupEntity, e = dt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._childEntityIds, { onCount: r, totalCount: a, avgPct: o, isOn: n, isUnavailable: c } = this._aggregateStats, p = c ? "Offline" : this._dragging ? `${o}%` : n ? a > 1 ? `${r} on · ${o}%` : `On · ${o}%` : "Off", d = !!this._config.hide_state, g = !d && !this._dragging ? jt(this.hass, t, this._config.state_content, p) : null, u = d && !this._dragging ? "" : g ?? p, m = `style-${this._config.card_style ?? "default"}`, f = this._computeAccentCss(), y = !!this._config.compact;
    return l`
      <div class="group-wrapper ${y ? "is-compact" : ""}">
        <ha-card
          class="group-header ${m} ${y ? "is-compact" : ""} ${n ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${c ? "is-unavailable" : ""}"
          style="${f} --fill-pct: ${n ? o : 0}%;"
          role="slider"
          tabindex="0"
          aria-label=${e}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${o}
          aria-valuetext=${u}
          @pointerdown=${this._onHeaderPointerDown}
          @pointermove=${this._onHeaderPointerMove}
          @pointerup=${this._onHeaderPointerUp}
          @pointercancel=${(b) => this._resetPointer(b.currentTarget)}
        >
          <div class="header-track" aria-hidden="true">
            <div class="header-fill"></div>
          </div>
          <div class="state-layer" aria-hidden="true"></div>

          <div class="header-content">
            <span class="group-icon">${this._renderGroupIcon(i)}</span>
            <div class="meta">
              <span class="title">${e}</span>
              ${u ? l`<span class="subtitle">${u}</span>` : h}
            </div>

            ${c ? l`
                  <span class="offline-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                      />
                    </svg>
                  </span>
                ` : s.length > 0 ? l`
                    <button
                      type="button"
                      class="expand-btn ${y ? "is-compact-chevron" : ""} ${!y && this._expanded ? "is-expanded" : ""}"
                      aria-expanded=${String(y ? this._popupOpen : this._expanded)}
                      aria-label=${y ? "Apri luci del gruppo" : this._expanded ? "Collapse lights" : "Expand lights"}
                      @pointerdown=${(b) => b.stopPropagation()}
                      @pointermove=${(b) => b.stopPropagation()}
                      @pointerup=${(b) => b.stopPropagation()}
                      @click=${this._toggleExpand}
                    >
                      ${y ? l`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                              />
                            </svg>
                          ` : l`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                              />
                            </svg>
                          `}
                    </button>
                  ` : h}
          </div>
        </ha-card>

        ${!y && s.length > 0 ? l`
              <div class="group-grid-collapse ${this._expanded ? "is-open" : ""}">
                <div class="group-grid-inner">
                  <div class="child-grid">
                    ${s.map(
      (b) => l`
                        <m3e-light-card
                          .hass=${this.hass}
                          ${Ze(this._attachChildConfig(b))}
                        ></m3e-light-card>
                      `
    )}
                  </div>
                </div>
              </div>
            ` : h}
      </div>

      ${y ? l`
            <dialog
              class="group-dialog"
              @click=${(b) => {
      b.target === this._dialogEl && this._closePopup();
    }}
              @cancel=${(b) => {
      b.preventDefault(), this._closePopup();
    }}
              @touchmove=${(b) => bt(b, this._dialogEl)}
            >
              ${this._popupOpen ? l`
                    <div class="dialog-surface">
                      <header class="dialog-header">
                        <button
                          type="button"
                          class="icon-btn"
                          @click=${() => this._closePopup()}
                          aria-label="Chiudi"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                            />
                          </svg>
                        </button>

                        <div class="dialog-title-wrap">
                          <span class="dialog-title">${e}</span>
                          <span class="dialog-sub">${u}</span>
                        </div>

                        <button
                          type="button"
                          class="m3-header-switch ${n ? "is-on" : ""}"
                          role="switch"
                          aria-checked=${String(n)}
                          aria-label=${n ? "Spegni tutte le luci" : "Accendi tutte le luci"}
                          @click=${() => this._toggleGroupMaster(!n)}
                        >
                          <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                        </button>
                      </header>

                      <div class="popup-child-grid">
                        ${s.map(
      (b) => l`
                            <m3e-light-card
                              .hass=${this.hass}
                              ${Ze(this._attachChildConfig(b))}
                            ></m3e-light-card>
                          `
    )}
                      </div>
                    </div>
                  ` : h}
            </dialog>
          ` : h}
    `;
  }
  _attachChildConfig(t) {
    return (e) => {
      if (!e || !(e instanceof HTMLElement)) return;
      const i = e, s = this._config?.card_style ?? "default", r = this._config?.use_light_color ?? !0;
      (i._m3eBoundId !== t || i._m3eBoundStyle !== s || i._m3eBoundColor !== r) && (i._m3eBoundId = t, i._m3eBoundStyle = s, i._m3eBoundColor = r, i.setConfig({
        type: "custom:m3e-light-card",
        entity: t,
        use_light_color: r,
        card_style: s
      }));
    };
  }
};
G.styles = [
  U,
  I`
      .group-wrapper {
        display: flex;
        flex-direction: column;
      }

      .group-header {
        min-height: 76px;
        cursor: pointer;
        touch-action: pan-y;
        outline: none;
        border-radius: var(--m3e-card-border-radius, 28px);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .group-header.is-on {
        background: color-mix(
          in srgb,
          var(--m3e-group-accent) 16%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
      }

      .group-header.is-pressed:not(.is-dragging) {
        transform: scale(var(--m3e-press-scale-card, 0.978));
      }

      .group-header.is-compact.is-pressed:not(.is-dragging) {
        transform: scale(var(--m3e-press-scale-tile, 0.965));
      }

      .header-track {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .header-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--fill-pct, 0%);
        background: color-mix(
          in srgb,
          var(--m3e-group-accent) 34%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
        transition:
          width var(--m3e-spring-spatial-default),
          background-color var(--m3e-spring-effects-default);
      }

      .group-header.is-dragging .header-fill {
        transition: background-color var(--m3e-spring-effects-default);
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .group-header:hover .state-layer {
        opacity: 0.05;
      }

      .header-content {
        position: relative;
        z-index: 1;
        min-height: 76px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .group-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        pointer-events: none;
      }

      .group-header.is-on .group-icon {
        color: color-mix(
          in srgb,
          var(--m3e-group-accent) 65%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .group-icon ha-icon,
      .group-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        pointer-events: none;
      }

      .title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .group-header.is-on .title,
      .group-header.is-on .subtitle {
        color: color-mix(
          in srgb,
          var(--m3e-group-accent) 55%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .expand-btn {
        position: relative;
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: color-mix(
          in srgb,
          var(--md-sys-color-surface-container-lowest, #ffffff) 78%,
          transparent
        );
        color: var(--md-sys-color-on-surface, #1c1b18);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      /* Generous invisible touch hit-zone so tapping near the arrow never toggles the light */
      .expand-btn::before {
        content: '';
        position: absolute;
        inset: -16px -12px -16px -10px;
      }

      .expand-btn svg {
        width: 22px;
        height: 22px;
        transition: transform 320ms cubic-bezier(0.2, 0, 0, 1);
      }

      .expand-btn.is-expanded svg {
        transform: rotate(180deg);
      }

      .expand-btn:active {
        transform: scale(0.9);
      }

      /* Compact half-width tile variant (matches Google Home tile spacing) */
      .group-wrapper.is-compact {
        height: 100%;
      }

      .group-header.is-compact {
        height: 100%;
        min-height: 84px;
      }

      .group-header.is-compact .header-content {
        height: 100%;
        min-height: 84px;
        padding: 12px 10px 12px 14px;
        gap: 8px;
      }

      .group-header.is-compact .title {
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 18px;
      }

      .expand-btn.is-compact-chevron {
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
      }

      .expand-btn.is-compact-chevron::before {
        inset: -24px -10px -24px -10px;
      }

      .expand-btn.is-compact-chevron svg {
        width: 22px;
        height: 22px;
      }

      /* Smooth Expandable 2-Column Grid (with shadow breathing room at bottom & sides) */
      .group-grid-collapse {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition:
          grid-template-rows 340ms cubic-bezier(0.2, 0, 0, 1),
          opacity 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .group-grid-collapse.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
      }

      .group-grid-inner {
        overflow: hidden;
        margin-inline: -4px;
      }

      .child-grid {
        padding: 10px 4px 10px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      /* =====================================================================
         COMPACT MODE POPUP DIALOG (Matches M3E Power Strip Popup)
         ===================================================================== */
      dialog.group-dialog {
        padding: 0;
        border: 0;
        background: transparent;
        max-width: 100vw;
        max-height: 100dvh;
        width: min(440px, calc(100vw - 24px));
        margin: auto;
        overflow: visible;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.group-dialog::backdrop {
        background: rgba(0, 0, 0, 0.48);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
        max-height: 86dvh;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
      }

      .icon-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 9999px;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .icon-btn:active {
        transform: scale(0.92);
      }

      .icon-btn svg {
        width: 24px;
        height: 24px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 26px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-sub {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        font-variant-numeric: tabular-nums;
      }

      .m3-header-switch {
        position: relative;
        flex: 0 0 52px;
        width: 52px;
        height: 32px;
        padding: 0;
        border-radius: 9999px;
        border: 2px solid var(--md-sys-color-outline, #8e9099);
        background: var(--md-sys-color-surface-container-highest, #33353b);
        cursor: pointer;
        transition:
          background-color 220ms cubic-bezier(0.2, 0, 0, 1),
          border-color 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-header-switch.is-on {
        border-color: var(--md-sys-color-primary, #bac3ff);
        background: var(--md-sys-color-primary, #bac3ff);
      }

      .m3-header-switch-thumb {
        position: absolute;
        top: 50%;
        left: 6px;
        width: 16px;
        height: 16px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline, #8e9099);
        transform: translateY(-50%);
        transition:
          left 260ms var(--m3e-spring-spatial-fast),
          width 220ms cubic-bezier(0.2, 0, 0, 1),
          height 220ms cubic-bezier(0.2, 0, 0, 1),
          background-color 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-header-switch.is-on .m3-header-switch-thumb {
        left: 22px;
        width: 24px;
        height: 24px;
        background: var(--md-sys-color-on-primary, #1f2b5a);
      }

      .popup-child-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      @media (max-width: 600px) {
        dialog.group-dialog {
          width: 100vw;
          margin: auto 0 0 0;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }
    `
];
st([
  P({ attribute: !1 })
], G.prototype, "hass", 2);
st([
  v()
], G.prototype, "_config", 2);
st([
  v()
], G.prototype, "_expanded", 2);
st([
  v()
], G.prototype, "_popupOpen", 2);
st([
  v()
], G.prototype, "_dragging", 2);
st([
  v()
], G.prototype, "_pressed", 2);
st([
  v()
], G.prototype, "_dragPct", 2);
st([
  T("dialog.group-dialog")
], G.prototype, "_dialogEl", 2);
st([
  T(".group-header")
], G.prototype, "_headerEl", 2);
G = st([
  z("m3e-light-group-card")
], G);
const vi = [
  [/spotify/i, "spotify"],
  [/music\s*assistant|mass/i, "music_assistant"],
  [/alexa/i, "alexa_media"],
  [/youtube/i, "youtube"],
  [/plex/i, "plex"],
  [/jellyfin/i, "jellyfin"],
  [/emby/i, "emby"],
  [/kodi/i, "kodi"],
  [/sonos/i, "sonos"],
  [/tidal/i, "tidal"],
  [/deezer/i, "deezer"],
  [/soundcloud/i, "soundcloud"],
  [/tunein/i, "tunein"],
  [/apple\s*(music|tv)|airplay/i, "apple_tv"],
  [/chromecast|google\s*cast|cast/i, "cast"],
  [/heos/i, "heos"],
  [/denon/i, "denonavr"],
  [/yamaha|musiccast/i, "yamaha_musiccast"],
  [/squeezebox|lms/i, "squeezebox"],
  [/vlc/i, "vlc_telnet"],
  [/mpd/i, "mpd"],
  [/webos|lg/i, "webostv"],
  [/samsung/i, "samsungtv"],
  [/bravia|sony/i, "braviatv"],
  [/android\s*tv/i, "androidtv_remote"],
  [/dlna/i, "dlna_dmr"]
], tr = {
  spotifyplus: "spotify",
  spotcast: "spotify",
  alexa_media: "alexa"
};
function er(t, e) {
  if (!e) return null;
  const i = t?.entities?.[e.entity_id]?.platform?.trim().toLowerCase() || "", s = tr[i] || i, r = String(e.attributes.app_name ?? "").trim(), a = String(e.attributes.source ?? "").trim(), o = String(e.attributes.icon ?? "").trim();
  if (r) {
    for (const [n, c] of vi)
      if (n.test(r)) return c;
  }
  if (s)
    return s;
  for (const n of [a, o, e.entity_id])
    if (n) {
      for (const [c, p] of vi)
        if (c.test(n)) return p;
    }
  return null;
}
function Bi(t, e) {
  const i = er(t, e);
  if (i) {
    const s = `https://brands.home-assistant.io/_/${encodeURIComponent(i)}/icon.png`;
    return l`
      <span class="app-badge is-brand" title=${i} aria-label=${i}>
        <img
          class="brand-icon-img"
          src=${s}
          alt=${i}
          loading="lazy"
          @error=${(r) => {
      const a = r.currentTarget;
      a.style.display = "none";
      const o = a.nextElementSibling;
      o && (o.style.display = "block");
    }}
        />
        <svg viewBox="0 0 24 24" class="brand-fallback-svg" style="display:none" aria-hidden="true">
          <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
        </svg>
      </span>
    `;
  }
  return l`
    <span class="app-badge is-tonal" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
      </svg>
    </span>
  `;
}
const kt = /* @__PURE__ */ new Map();
function ir(t, e, i) {
  t /= 255, e /= 255, i /= 255;
  const s = Math.max(t, e, i), r = Math.min(t, e, i), a = (s + r) / 2;
  if (s === r) return [0, 0, a];
  const o = s - r, n = a > 0.5 ? o / (2 - s - r) : o / (s + r);
  let c = 0;
  return s === t ? c = ((e - i) / o + (e < i ? 6 : 0)) / 6 : s === e ? c = ((i - t) / o + 2) / 6 : c = ((t - e) / o + 4) / 6, [c * 360, n * 100, a * 100];
}
async function Xe(t) {
  return t ? kt.has(t) ? kt.get(t) ?? null : new Promise((e) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => {
      try {
        const r = document.createElement("canvas");
        r.width = 24, r.height = 24;
        const a = r.getContext("2d", { willReadFrequently: !0 });
        if (!a) {
          kt.set(t, null), e(null);
          return;
        }
        a.drawImage(i, 0, 0, 24, 24);
        const o = a.getImageData(0, 0, 24, 24).data, n = new Array(24);
        for (let _ = 0; _ < 24; _++) n[_] = { w: 0, hSin: 0, hCos: 0, s: 0 };
        let c = 0, p = 0;
        for (let _ = 0; _ < o.length; _ += 4) {
          if (o[_ + 3] < 128) continue;
          const [H, S, E] = ir(o[_], o[_ + 1], o[_ + 2]);
          if (p++, c += S, S < 12 || E < 10 || E > 92) continue;
          const R = Math.floor(H % 360 / 15) % 24, wt = 1 - Math.abs(E - 50) / 52, X = S / 100 * (0.4 + 0.6 * wt), tt = H * Math.PI / 180;
          n[R].w += X, n[R].hSin += Math.sin(tt) * X, n[R].hCos += Math.cos(tt) * X, n[R].s += S * X;
        }
        let d = n[0];
        for (let _ = 1; _ < 24; _++)
          n[_].w > d.w && (d = n[_]);
        if (d.w < 0.7 || p > 0 && c / p < 5) {
          const _ = {
            scrim: "hsl(240, 6%, 11%)",
            accent: "hsl(28, 16%, 90%)",
            onAccent: "hsl(240, 8%, 13%)",
            containerDark: "hsl(30, 8%, 22%)",
            onContainerDark: "hsl(30, 12%, 92%)",
            containerLight: "hsl(30, 14%, 89%)",
            onContainerLight: "hsl(30, 10%, 16%)"
          };
          kt.set(t, _), e(_);
          return;
        }
        let g = Math.atan2(d.hSin, d.hCos) * 180 / Math.PI;
        g < 0 && (g += 360);
        const u = Math.round(g), m = d.s / d.w, f = Math.round(Math.max(18, Math.min(46, m * 0.55))), y = Math.round(Math.max(42, Math.min(82, m * 0.95))), b = Math.round(Math.max(28, Math.min(60, m * 0.65))), C = Math.round(Math.max(22, Math.min(48, m * 0.62))), w = Math.round(Math.max(24, Math.min(72, m * 0.78))), $ = Math.round(Math.max(30, Math.min(74, m * 0.82))), k = Math.round(Math.max(28, Math.min(62, m * 0.68))), M = {
          scrim: `hsl(${u}, ${f}%, 12%)`,
          accent: `hsl(${u}, ${y}%, 86%)`,
          onAccent: `hsl(${u}, ${b}%, 14%)`,
          containerDark: `hsl(${u}, ${C}%, 22%)`,
          onContainerDark: `hsl(${u}, ${w}%, 91%)`,
          containerLight: `hsl(${u}, ${$}%, 88%)`,
          onContainerLight: `hsl(${u}, ${k}%, 16%)`
        };
        kt.set(t, M), e(M);
      } catch {
        kt.set(t, null), e(null);
      }
    }, i.onerror = () => {
      kt.set(t, null), e(null);
    }, i.src = t;
  }) : null;
}
var sr = Object.defineProperty, rr = Object.getOwnPropertyDescriptor, Z = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? rr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && sr(e, i, r), r;
};
const ar = 4;
function _i(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), r = e % 60, a = r < 10 ? `0${r}` : String(r);
  if (i > 0) {
    const o = s < 10 ? `0${s}` : String(s);
    return `${i}:${o}:${a}`;
  }
  return `${s}:${a}`;
}
let N = class extends A {
  constructor() {
    super(...arguments), this.entityId = "", this.playerIds = [], this._open = !1, this._castSheetOpen = !1, this._nowTick = Date.now(), this._scrubbing = !1, this._scrubPct = null, this._volDragging = !1, this._volPct = null, this._palette = null, this._tickTimer = null, this._volPendingTimer = null, this._lastVolSentAt = 0, this._lastArtworkUrl = "", this._lastTrackKey = "", this._pendingTrackDir = "next", this._onSeekDown = (t) => {
      if (this._duration <= 0 || t.pointerType === "mouse" && t.button !== 0) return;
      t.preventDefault();
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._scrubbing = !0, this._scrubPct = this._pctFromX(t.clientX, e);
    }, this._onSeekMove = (t) => {
      this._scrubbing && (t.preventDefault(), this._scrubPct = this._pctFromX(t.clientX, t.currentTarget));
    }, this._onSeekUp = (t) => {
      if (!this._scrubbing) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId);
      const i = this._scrubPct;
      this._scrubbing = !1, this._scrubPct = null, i !== null && this._duration > 0 && this._call("media_seek", { seek_position: Math.round(i / 100 * this._duration) });
    }, this._onVolDown = (t) => {
      if (t.pointerType === "mouse" && t.button !== 0) return;
      t.preventDefault();
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._volPendingTimer !== null && (window.clearTimeout(this._volPendingTimer), this._volPendingTimer = null), this._volDragging = !0, this._volPct = Math.round(this._pctFromX(t.clientX, e));
    }, this._onVolMove = (t) => {
      if (!this._volDragging) return;
      t.preventDefault();
      const e = Math.round(this._pctFromX(t.clientX, t.currentTarget));
      this._volPct = e;
      const i = Date.now();
      i - this._lastVolSentAt >= 120 && (this._lastVolSentAt = i, this._call("volume_set", { volume_level: Number((e / 100).toFixed(2)) }));
    }, this._onVolUp = (t) => {
      if (!this._volDragging) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId);
      const i = this._volPct ?? this._volumePct;
      this._volDragging = !1, this._call("volume_set", { volume_level: Number((i / 100).toFixed(2)) }), this._volPendingTimer = window.setTimeout(() => {
        this._volPct = null, this._volPendingTimer = null;
      }, 800);
    };
  }
  async open(t, e = !1) {
    if (this._open) {
      e && (this._castSheetOpen = !0);
      return;
    }
    window.getSelection()?.removeAllRanges(), this._castSheetOpen = e, this._open = !0, this._nowTick = Date.now(), await this.updateComplete;
    const i = this._dialogEl;
    i && (i.open || i.showModal(), yt(this._dialogSurfaceEl, t));
  }
  close() {
    this._stopTicker(), xt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._open = !1, this._castSheetOpen = !1;
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopTicker(), this._volPendingTimer !== null && (window.clearTimeout(this._volPendingTimer), this._volPendingTimer = null);
  }
  updated(t) {
    const e = this._entity;
    if (this._open && e?.state === "playing" && this._duration > 0 && !this._scrubbing ? this._startTicker() : this._stopTicker(), this._open && e) {
      const s = `${e.entity_id}|${String(e.attributes.media_title ?? "")}|${String(e.attributes.entity_picture ?? "")}`;
      this._lastTrackKey && s !== this._lastTrackKey && this._animateTrackTransition(this._pendingTrackDir), this._lastTrackKey = s;
      const r = String(
        e.attributes.entity_picture_local || e.attributes.entity_picture || ""
      ).trim();
      r !== this._lastArtworkUrl && (this._lastArtworkUrl = r, r ? Xe(r).then((a) => {
        this._lastArtworkUrl === r && (this._palette = a);
      }) : this._palette = null);
    } else
      this._lastTrackKey = "";
  }
  _animateTrackTransition(t) {
    const e = t === "next" ? 28 : -28, i = "cubic-bezier(0.05, 0.7, 0.1, 1.0)";
    this._artworkFrameEl?.animate(
      [
        { transform: `translateX(${e}px) scale(0.92)`, opacity: 0.35 },
        { transform: "translateX(0px) scale(1)", opacity: 1 }
      ],
      { duration: 340, easing: i }
    ), this._metaBlockEl?.animate(
      [
        { transform: `translateX(${e * 0.65}px)`, opacity: 0.25 },
        { transform: "translateX(0px)", opacity: 1 }
      ],
      { duration: 300, easing: i }
    );
  }
  _skipTrack(t) {
    this._pendingTrackDir = t, this._call(t === "next" ? "media_next_track" : "media_previous_track");
  }
  _startTicker() {
    this._tickTimer === null && (this._tickTimer = window.setInterval(() => {
      this._nowTick = Date.now();
    }, 1e3));
  }
  _stopTicker() {
    this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null);
  }
  get _entity() {
    if (!(!this.hass || !this.entityId))
      return this.hass.states[this.entityId];
  }
  get _duration() {
    const t = this._entity?.attributes.media_duration;
    return typeof t == "number" && t > 0 ? t : 0;
  }
  get _currentPosition() {
    const t = this._entity, e = this._duration;
    if (!t || e <= 0) return 0;
    const i = typeof t.attributes.media_position == "number" ? t.attributes.media_position : 0;
    if (t.state !== "playing") return Math.max(0, Math.min(e, i));
    const s = t.attributes.media_position_updated_at;
    if (typeof s == "string") {
      const r = Date.parse(s);
      if (!Number.isNaN(r))
        return Math.max(0, Math.min(e, i + Math.max(0, (this._nowTick - r) / 1e3)));
    }
    return Math.max(0, Math.min(e, i));
  }
  get _progressPct() {
    return this._scrubPct !== null ? this._scrubPct : this._duration <= 0 ? 0 : Math.max(0, Math.min(100, this._currentPosition / this._duration * 100));
  }
  get _volumePct() {
    if (this._volPct !== null) return this._volPct;
    const t = this._entity?.attributes.volume_level;
    return typeof t == "number" ? Math.round(t * 100) : 0;
  }
  _call(t, e = {}, i) {
    const s = i || this.entityId;
    !this.hass || !s || this.hass.callService("media_player", t, { entity_id: s, ...e });
  }
  _openMoreInfo(t) {
    const e = this.entityId;
    e && (this._dialogEl?.open && this._dialogEl.close(), this._open = !1, this._castSheetOpen = !1, this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: t ? { entityId: e, view: t } : { entityId: e },
        bubbles: !0,
        composed: !0
      })
    ));
  }
  _cycleRepeat() {
    const t = String(this._entity?.attributes.repeat ?? "off").toLowerCase(), e = t === "off" ? "all" : t === "all" ? "one" : "off";
    this._call("repeat_set", { repeat: e });
  }
  _toggleShuffle() {
    const t = !!this._entity?.attributes.shuffle;
    this._call("shuffle_set", { shuffle: !t });
  }
  /* Seek slider pointer handlers */
  _pctFromX(t, e) {
    const i = e.getBoundingClientRect();
    return i.width <= 0 ? 0 : Math.max(0, Math.min(100, (t - i.left) / i.width * 100));
  }
  _selectPlayer(t) {
    this.entityId = t, this.dispatchEvent(
      new CustomEvent("m3e-player-selected", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _selectSource(t) {
    this._call("select_source", { source: t });
  }
  _renderAppBadge(t) {
    return Bi(this.hass, t);
  }
  render() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "playing", s = !!t?.attributes.is_volume_muted, r = t?.attributes.friendly_name || this.entityId || "Media", a = String(t?.attributes.media_title ?? "").trim() || r, o = String(t?.attributes.media_artist ?? "").trim() || String(t?.attributes.media_album_name ?? "").trim() || (i ? "In riproduzione" : e.charAt(0).toUpperCase() + e.slice(1)), n = String(
      t?.attributes.entity_picture_local || t?.attributes.entity_picture || ""
    ).trim(), c = this._duration, p = this._progressPct, d = this._scrubPct !== null ? this._scrubPct / 100 * c : this._currentPosition, g = i && !this._scrubbing && c > 0, u = this._volumePct, m = !!t?.attributes.shuffle, f = String(t?.attributes.repeat ?? "off").toLowerCase(), y = Array.from(
      new Set([this.entityId, ...this.playerIds ?? []].filter(Boolean))
    ), b = Array.isArray(t?.attributes.source_list) ? Array.from(
      new Set(
        t.attributes.source_list.map((S) => String(S ?? "").trim()).filter(Boolean)
      )
    ) : [], C = String(t?.attributes.source ?? ""), w = !t || e === "unavailable" || e === "unknown", $ = Number(t?.attributes.supported_features ?? 0), k = !w && ($ === 0 || ($ & ar) !== 0 || typeof t?.attributes.volume_level == "number"), M = b.length > 0 || y.length > 1, _ = s ? 0 : u, H = this._palette ? `--mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};` : "";
    return l`
      <dialog
        class="media-dialog"
        style=${H}
        @click=${(S) => {
      S.target === this._dialogEl && this.close();
    }}
        @cancel=${(S) => {
      S.preventDefault(), this.close();
    }}
        @touchmove=${(S) => bt(S, this._dialogEl)}
      >
        ${this._open ? l`
              <div class="dialog-surface">
                <!-- Header: X Left, Now playing Center, App Badge + More Right -->
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.close()}
                    aria-label="Chiudi"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>

                  <span class="dialog-title">${x(this.hass, "now_playing")}</span>

                  <div class="header-right">
                    ${this._renderAppBadge(t)}
                    <button
                      type="button"
                      class="icon-btn"
                      @click=${() => this._openMoreInfo("history")}
                      aria-label=${x(this.hass, "history")}
                      title=${x(this.hass, "history_tooltip")}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      @click=${() => this._openMoreInfo()}
                      aria-label=${x(this.hass, "more_options")}
                      title=${x(this.hass, "ha_details")}
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                        />
                      </svg>
                    </button>
                  </div>
                </header>

                <!-- Centered Squircle Artwork -->
                <div class="artwork-stage">
                  <div class="artwork-frame">
                    ${n ? l`<img class="artwork-img" src=${n} alt="" />` : l`
                          <svg viewBox="0 0 24 24" class="artwork-fallback" aria-hidden="true">
                            <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                          </svg>
                        `}
                  </div>
                </div>

                <!-- Centered Track Title & Artist -->
                <div class="meta-block">
                  <div class="meta-title">${a}</div>
                  <div class="meta-artist">${o}</div>
                </div>

                <!-- M3 Expressive Wavy Progress Slider + Clocks -->
                <div class="progress-block">
                  <div
                    class="wavy-slider ${g ? "is-wavy" : "is-flat"} ${this._scrubbing ? "is-scrubbing" : ""} ${c > 0 ? "is-seekable" : ""}"
                    role="slider"
                    aria-label="Avanzamento"
                    aria-valuemin="0"
                    aria-valuemax=${c}
                    aria-valuenow=${Math.round(d)}
                    @pointerdown=${this._onSeekDown}
                    @pointermove=${this._onSeekMove}
                    @pointerup=${this._onSeekUp}
                    @pointercancel=${this._onSeekUp}
                  >
                    <div class="wavy-active-wrap" style="width: max(0px, calc(${p}% - 7px));">
                      <div class="wavy-svg-scroller">
                        <svg class="wavy-svg" aria-hidden="true">
                          <defs>
                            <pattern
                              id="m3e-popup-wave"
                              width="28"
                              height="14"
                              patternUnits="userSpaceOnUse"
                            >
                              <path
                                class="wavy-path"
                                d="M 0 7 Q 7 2, 14 7 T 28 7"
                              />
                            </pattern>
                          </defs>
                          <rect width="100%" height="14" fill="url(#m3e-popup-wave)" />
                        </svg>
                      </div>
                      <div class="flat-active-line"></div>
                    </div>
                    <div class="wavy-thumb" style="left: ${p}%;"></div>
                    <div class="wavy-inactive-line" style="left: calc(${p}% + 7px);"></div>
                  </div>

                  <div class="time-row">
                    <span>${_i(d)}</span>
                    <span>${_i(c)}</span>
                  </div>
                </div>

                <!-- 5-Button Expressive Transport Row -->
                <div class="transport-row">
                  <button
                    type="button"
                    class="ctrl-btn toggle-ctrl ${m ? "is-active" : ""}"
                    aria-label="Casuale"
                    aria-pressed=${String(m)}
                    title=${m ? "Casuale attivo" : "Attiva casuale"}
                    @click=${() => this._toggleShuffle()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41ZM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5Zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13Z"
                      />
                    </svg>
                    <span class="active-dot" aria-hidden="true"></span>
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn is-prev"
                    aria-label="Precedente"
                    @click=${() => this._skipTrack("prev")}
                  >
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="play-hero ${i ? "is-playing" : "is-paused"}"
                    aria-label=${i ? "Pausa" : "Riproduci"}
                    @click=${() => this._call("media_play_pause")}
                  >
                    ${i ? l`
                          <svg viewBox="0 0 24 24">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        ` : l`
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                            />
                          </svg>
                        `}
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn is-next"
                    aria-label="Successivo"
                    @click=${() => this._skipTrack("next")}
                  >
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn toggle-ctrl ${f !== "off" ? "is-active" : ""}"
                    aria-label="Ripeti"
                    aria-pressed=${String(f !== "off")}
                    title=${f === "one" ? "Ripeti brano" : f === "all" ? "Ripeti tutto" : "Ripetizione spenta"}
                    @click=${() => this._cycleRepeat()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d=${f === "one" ? "M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Zm-4-2V9h-1l-2 1v1h1.5v4H13Z" : "M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Z"}
                      />
                    </svg>
                    <span class="active-dot" aria-hidden="true"></span>
                  </button>
                </div>

                <!-- Authentic M3 Expressive Volume Slider (50px Pill Track + Gap + Vertical Handle + Stop Dot) -->
                ${k ? l`
                      <div class="m3-vol-row">
                        <button
                          type="button"
                          class="m3-mute-btn ${s ? "is-muted" : ""}"
                          aria-label=${s ? "Riattiva audio" : "Muto"}
                          @click=${() => this._call("volume_mute", { is_volume_muted: !s })}
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d=${s || u === 0 ? "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z" : u < 50 ? "M5 9v6h4l5 5V4L9 9H5Zm11.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z" : "M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"}
                            />
                          </svg>
                        </button>

                        <div
                          class="m3-vol-track ${this._volDragging ? "is-dragging" : ""}"
                          role="slider"
                          aria-label="Volume"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow=${_}
                          @pointerdown=${this._onVolDown}
                          @pointermove=${this._onVolMove}
                          @pointerup=${this._onVolUp}
                          @pointercancel=${this._onVolUp}
                        >
                          ${this._volDragging ? l`<span class="m3-vol-tooltip" style="left: ${_}%;">${_}%</span>` : h}
                          <div
                            class="m3-vol-active"
                            style="width: max(0px, calc(${_}% - 6px));"
                          ></div>
                          <div class="m3-vol-handle" style="left: ${_}%;"></div>
                          <div
                            class="m3-vol-inactive"
                            style="left: calc(${_}% + 6px);"
                          >
                            ${_ < 96 ? l`<span class="m3-vol-stop" aria-hidden="true"></span>` : h}
                          </div>
                        </div>

                        <span class="m3-vol-readout">${s ? "Muto" : `${u}%`}</span>
                      </div>
                    ` : h}

                <!-- M3 Expressive Compact Pill Source / Output Selector -->
                <button
                  type="button"
                  class="cast-pill-btn ${w ? "is-disabled" : ""}"
                  ?disabled=${w}
                  @click=${() => {
      M ? this._castSheetOpen = !0 : this._openMoreInfo();
    }}
                >
                  <span class="cast-pill-left">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span class="cast-pill-label">
                      ${C || r}
                    </span>
                  </span>
                  ${M ? l`
                        <svg viewBox="0 0 24 24" class="cast-pill-chevron" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                          />
                        </svg>
                      ` : h}
                </button>

                <!-- Inline Cast / Source Bottom Sheet (Screen 2) -->
                ${this._castSheetOpen ? l`
                      <div
                        class="cast-sheet-backdrop"
                        @click=${() => this._castSheetOpen = !1}
                      >
                        <div class="cast-sheet" @click=${(S) => S.stopPropagation()}>
                          <div class="sheet-handle" aria-hidden="true"></div>

                          <div class="cast-sheet-header">
                            <button
                              type="button"
                              class="icon-btn"
                              @click=${() => this._castSheetOpen = !1}
                              aria-label="Chiudi Cast"
                            >
                              <svg viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                                />
                              </svg>
                            </button>
                            <span class="cast-sheet-title">Cast</span>
                          </div>

                          <!-- Mini Now Playing Preview -->
                          <div class="cast-now-preview">
                            <div class="cast-mini-art">
                              ${n ? l`<img src=${n} alt="" />` : l`
                                    <svg viewBox="0 0 24 24">
                                      <path
                                        fill="currentColor"
                                        d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
                                      />
                                    </svg>
                                  `}
                            </div>
                            <div class="cast-mini-meta">
                              <div class="cast-mini-top">${this._renderAppBadge(t)}</div>
                              <div class="cast-mini-title">${a}</div>
                              <div class="cast-mini-artist">${o}</div>
                            </div>
                          </div>

                          <!-- Output Devices (M3 Expressive Pill = Selected, 20px = Unselected) -->
                          <div class="cast-list" role="radiogroup" aria-label="Dispositivi Cast">
                            ${y.map((S) => {
      const E = this.hass?.states[S], R = S === this.entityId, wt = E?.attributes.friendly_name || S, X = String(E?.attributes.source ?? "").trim(), tt = X || wt, et = typeof E?.attributes.volume_level == "number" ? Math.round(E.attributes.volume_level * 100) : null, D = E?.attributes.device_class === "tv" || S.toLowerCase().includes("tv") || S.toLowerCase().includes("chromecast") || X.toLowerCase().includes("tv") || X.toLowerCase().includes("chromecast");
      return l`
                                <button
                                  type="button"
                                  class="cast-row ${R ? "is-selected" : ""}"
                                  role="radio"
                                  aria-checked=${String(R)}
                                  @click=${() => this._selectPlayer(S)}
                                >
                                  ${R && et !== null ? l`<span class="cast-row-fill" style="width: ${et}%;"></span>` : h}
                                  <span class="cast-row-inner">
                                    <span class="cast-row-left">
                                      <svg viewBox="0 0 24 24" class="cast-dev-icon" aria-hidden="true">
                                        <path
                                          fill="currentColor"
                                          d=${D ? "M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z" : "M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"}
                                        />
                                      </svg>
                                      <span class="cast-row-text">
                                        <span class="cast-row-name">${tt}</span>
                                        ${R && et !== null ? l`<span class="cast-row-sub">${et}%</span>` : h}
                                      </span>
                                    </span>
                                    <span class="cast-check ${R ? "checked" : ""}" aria-hidden="true">
                                      ${R ? l`
                                            <svg viewBox="0 0 24 24">
                                              <path
                                                fill="currentColor"
                                                d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                              />
                                            </svg>
                                          ` : h}
                                    </span>
                                  </span>
                                </button>
                              `;
    })}
                          </div>

                          <!-- Sources (M3 Expressive Filter Chips with Checkmark & Shape Morph) -->
                          ${b.length > 0 ? l`
                                <div class="cast-section-label">${x(this.hass, "sources")}</div>
                                <div class="source-chips" role="radiogroup" aria-label=${x(this.hass, "sources")}>
                                  ${b.map((S) => {
      const E = S === C;
      return l`
                                      <button
                                        type="button"
                                        class="source-chip ${E ? "is-selected" : ""}"
                                        role="radio"
                                        aria-checked=${String(E)}
                                        @click=${() => this._selectSource(S)}
                                      >
                                        ${E ? l`
                                              <svg viewBox="0 0 24 24" class="chip-check" aria-hidden="true">
                                                <path
                                                  fill="currentColor"
                                                  d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                                />
                                              </svg>
                                            ` : h}
                                        <span>${S}</span>
                                      </button>
                                    `;
    })}
                                </div>
                              ` : h}

                          <!-- Bottom Actions: Stop casting + Done -->
                          <div class="cast-sheet-footer">
                            <button
                              type="button"
                              class="stop-cast-btn"
                              @click=${() => {
      this._call("media_stop"), this._castSheetOpen = !1;
    }}
                            >
                              ${x(this.hass, "stop_casting")}
                            </button>
                            <button
                              type="button"
                              class="done-cast-btn"
                              @click=${() => this._castSheetOpen = !1}
                            >
                              ${x(this.hass, "done")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ` : h}
              </div>
            ` : h}
      </dialog>
    `;
  }
};
N.styles = [
  U,
  I`
      :host {
        display: contents;
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      dialog.media-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.media-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        touch-action: pan-y;
        max-height: calc(100dvh - 24px);
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.media-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 95dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 95dvh;
          padding: 16px 18px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      /* Header */
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dialog-title {
        flex: 1 1 auto;
        font-size: 19px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .icon-btn {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .app-badge {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .app-badge .brand-icon-img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        display: block;
        border-radius: 6px;
      }

      .app-badge .brand-fallback-svg {
        width: 16px;
        height: 16px;
      }

      .app-badge svg {
        width: 24px;
        height: 24px;
      }

      .app-badge.is-tonal {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .app-badge.is-tonal svg {
        width: 16px;
        height: 16px;
      }

      /* Centered Squircle Artwork */
      .artwork-stage {
        display: flex;
        justify-content: center;
        padding: 4px 0;
      }

      .artwork-frame {
        width: clamp(168px, 48vw, 204px);
        height: clamp(168px, 48vw, 204px);
        border-radius: 36px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-highest, #2a2b34);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
      }

      .artwork-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .artwork-fallback {
        width: 64px;
        height: 64px;
      }

      /* Meta */
      .meta-block {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 8px;
      }

      .meta-title {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .meta-artist {
        font-size: 15px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* Wavy Progress Slider */
      .progress-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .wavy-slider {
        position: relative;
        height: 28px;
        display: flex;
        align-items: center;
        touch-action: none;
        user-select: none;
      }

      .wavy-slider.is-seekable {
        cursor: pointer;
      }

      .wavy-active-wrap {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 14px;
        overflow: hidden;
        pointer-events: none;
      }

      .wavy-svg-scroller {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scaleY(0.15);
        transition:
          opacity 220ms ease,
          transform 360ms var(--m3e-spring-spatial-default);
      }

      .wavy-slider.is-wavy .wavy-svg-scroller {
        opacity: 1;
        transform: scaleY(1);
      }

      .wavy-svg {
        width: calc(100% + 28px);
        height: 14px;
        display: block;
        will-change: transform;
        animation: m3e-wave-flow 1.4s linear infinite;
      }

      .wavy-slider.is-flat .wavy-svg {
        animation-play-state: paused;
      }

      .wavy-path {
        fill: none;
        stroke: var(--md-sys-color-primary, #4285f4);
        stroke-width: 3.2;
        stroke-linecap: round;
      }

      @keyframes m3e-wave-flow {
        from {
          transform: translateX(0px);
        }
        to {
          transform: translateX(-28px);
        }
      }

      .flat-active-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--md-sys-color-primary, #4285f4);
        opacity: 1;
        transition: opacity 200ms ease;
      }

      .wavy-slider.is-wavy .flat-active-line {
        opacity: 0;
      }

      .wavy-thumb {
        position: absolute;
        top: 50%;
        width: 4px;
        height: 18px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--md-sys-color-primary, #4285f4);
        pointer-events: none;
        transition: height var(--m3e-spring-spatial-fast);
      }

      .wavy-slider.is-scrubbing .wavy-thumb {
        height: 24px;
      }

      .wavy-inactive-line {
        position: absolute;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.28));
        pointer-events: none;
      }

      .time-row {
        display: flex;
        justify-content: space-between;
        font-size: 12.5px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* 5-Button Transport Row */
      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 6px;
      }

      .ctrl-btn {
        position: relative;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          color var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .ctrl-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      /* M3 Expressive Center-Bounce Tonal Fill for Shuffle & Repeat */
      .ctrl-btn.toggle-ctrl::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #364067);
        transform: scale(0);
        opacity: 0;
        transition:
          transform var(--m3e-spring-bouncy),
          opacity 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .ctrl-btn.toggle-ctrl.is-active::before {
        transform: scale(1);
        opacity: 1;
      }

      .ctrl-btn.toggle-ctrl svg {
        position: relative;
        z-index: 1;
        transition: transform var(--m3e-spring-bouncy);
      }

      .ctrl-btn.toggle-ctrl.is-active {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .ctrl-btn.toggle-ctrl.is-active svg {
        transform: scale(1.08);
      }

      .ctrl-btn.toggle-ctrl:active {
        transform: scale(0.88);
      }

      .active-dot {
        position: absolute;
        bottom: 5px;
        left: 50%;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--md-sys-color-primary, #bac3ff);
        transform: translateX(-50%) scale(0);
        transition: transform var(--m3e-spring-bouncy);
        z-index: 1;
      }

      .ctrl-btn.toggle-ctrl.is-active .active-dot {
        transform: translateX(-50%) scale(1);
      }

      .ctrl-btn.is-prev:active {
        transform: translateX(-5px) scale(0.9);
      }

      .ctrl-btn.is-next:active {
        transform: translateX(5px) scale(0.9);
      }

      .ctrl-btn svg {
        width: 24px;
        height: 24px;
      }

      .play-hero {
        width: 74px;
        height: 74px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #1b1b1f);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast);
      }

      .play-hero.is-playing {
        border-radius: 24px;
      }

      .play-hero:active {
        transform: scale(0.9);
      }

      .play-hero svg {
        width: 30px;
        height: 30px;
      }

      /* =====================================================================
         M3 EXPRESSIVE VOLUME SLIDER (50px Pill Track + Gap + Vertical Handle + Stop Dot)
         ===================================================================== */
      .m3-vol-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .m3-mute-btn {
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .m3-mute-btn:hover {
        background: color-mix(in srgb, currentColor 10%, var(--md-sys-color-surface-container-high, #24252d));
      }

      .m3-mute-btn.is-muted {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m3-mute-btn:active {
        transform: scale(0.92);
      }

      .m3-mute-btn svg {
        width: 22px;
        height: 22px;
      }

      .m3-vol-track {
        position: relative;
        flex: 1 1 auto;
        height: 50px;
        display: flex;
        align-items: center;
        cursor: ew-resize;
        touch-action: none;
        user-select: none;
      }

      .m3-vol-active {
        position: absolute;
        left: 0;
        top: 50%;
        height: 24px;
        transform: translateY(-50%);
        border-radius: 9999px 6px 6px 9999px;
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        pointer-events: none;
        transition: width 140ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-vol-track.is-dragging .m3-vol-active {
        transition: none;
      }

      .m3-vol-handle {
        position: absolute;
        top: 50%;
        width: 5px;
        height: 36px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        pointer-events: none;
        transition:
          left 140ms cubic-bezier(0.2, 0, 0, 1),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .m3-vol-track.is-dragging .m3-vol-handle {
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
        width: 4px;
        height: 44px;
      }

      .m3-vol-inactive {
        position: absolute;
        right: 0;
        top: 50%;
        height: 24px;
        transform: translateY(-50%);
        border-radius: 6px 9999px 9999px 6px;
        background: var(--md-sys-color-surface-container-high, #282932);
        pointer-events: none;
        transition: left 140ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-vol-track.is-dragging .m3-vol-inactive {
        transition: none;
      }

      .m3-vol-stop {
        position: absolute;
        right: 9px;
        top: 50%;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        transform: translateY(-50%);
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        opacity: 0.75;
      }

      .m3-vol-tooltip {
        position: absolute;
        bottom: calc(100% + 4px);
        transform: translateX(-50%);
        padding: 5px 12px;
        border-radius: 9999px;
        background: var(--md-sys-color-inverse-surface, #e3e2e6);
        color: var(--md-sys-color-inverse-on-surface, #1b1b1f);
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        pointer-events: none;
        animation: m3e-fade-in 120ms ease;
      }

      .m3-vol-readout {
        flex: 0 0 42px;
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* M3 Expressive Compact Pill Source / Output Selector */
      .cast-pill-btn {
        width: 100%;
        height: 50px;
        padding: 0 18px 0 20px;
        border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant, #44464f) 55%, transparent);
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        transition:
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          transform 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .cast-pill-btn:hover:not(:disabled) {
        background: color-mix(in srgb, currentColor 8%, var(--md-sys-color-surface-container-high, #24252d));
      }

      .cast-pill-btn:active:not(:disabled) {
        transform: scale(0.98);
      }

      .cast-pill-btn.is-disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .cast-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .cast-pill-left svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .cast-pill-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-pill-chevron {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* =====================================================================
         INLINE CAST / OUTPUT BOTTOM SHEET (Screen 2)
         ===================================================================== */
      .cast-sheet-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.48);
        display: flex;
        align-items: flex-end;
        z-index: 15;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .cast-sheet {
        width: 100%;
        max-height: 84%;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--md-sys-color-surface-container-low, #1b1c22);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 28px 28px 0 0;
        padding: 10px 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        animation: m3e-sheet-up 260ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }

      .sheet-handle {
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline-variant, #44464f);
        align-self: center;
      }

      .cast-sheet-header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cast-sheet-title {
        font-size: 20px;
        font-weight: 500;
      }

      .cast-now-preview {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .cast-mini-art {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #2d2e38);
        display: grid;
        place-items: center;
      }

      .cast-mini-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cast-mini-art svg {
        width: 24px;
        height: 24px;
      }

      .cast-mini-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .cast-mini-top .app-badge {
        width: 18px;
        height: 18px;
      }

      .cast-mini-top .app-badge .brand-icon-img,
      .cast-mini-top .app-badge svg {
        width: 18px;
        height: 18px;
      }

      .cast-mini-title {
        font-size: 15.5px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-mini-artist {
        font-size: 13.5px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cast-row {
        position: relative;
        width: 100%;
        min-height: 66px;
        padding: 0;
        border: 0;
        border-radius: 20px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-high, #25262e);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        cursor: pointer;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .cast-row.is-selected {
        border-radius: 9999px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .cast-row:active {
        transform: scale(0.98);
      }

      .cast-row-fill {
        position: absolute;
        inset-block: 0;
        left: 0;
        background: color-mix(in srgb, currentColor 12%, transparent);
        pointer-events: none;
      }

      .cast-row-inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 18px;
      }

      .cast-row-left {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
      }

      .cast-dev-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }

      .cast-row-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .cast-row-name {
        font-size: 15px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-row.is-selected .cast-row-name {
        font-weight: 600;
      }

      .cast-row-sub {
        font-size: 13px;
        opacity: 0.8;
        font-variant-numeric: tabular-nums;
      }

      .cast-check {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #8e9099);
        display: grid;
        place-items: center;
      }

      .cast-check.checked {
        border-color: transparent;
        background: var(--md-sys-color-on-primary-container, #1b1b1f);
        color: var(--md-sys-color-primary-container, #dce2ff);
      }

      .cast-check svg {
        width: 15px;
        height: 15px;
      }

      .cast-section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .source-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .source-chip {
        height: 38px;
        padding: 0 14px;
        border-radius: 12px;
        border: 1px solid var(--md-sys-color-outline-variant, #44464f);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 13.5px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          border-color 180ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
      }

      .source-chip.is-selected {
        border-radius: 9999px;
        border-color: transparent;
        background: var(--md-sys-color-secondary-container, #364067);
        color: var(--md-sys-color-on-secondary-container, #dce2ff);
      }

      .source-chip:active {
        transform: scale(0.95);
      }

      .chip-check {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .cast-sheet-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 6px;
      }

      .stop-cast-btn {
        border: 0;
        background: transparent;
        color: var(--md-sys-color-primary, #8ab4f8);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        padding: 10px 14px;
        border-radius: 9999px;
        cursor: pointer;
      }

      .stop-cast-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .done-cast-btn {
        border: 0;
        background: var(--md-sys-color-primary, #4285f4);
        color: var(--md-sys-color-on-primary, #ffffff);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        padding: 11px 26px;
        border-radius: 9999px;
        cursor: pointer;
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .done-cast-btn:active {
        transform: scale(0.95);
      }
    `
];
Z([
  P({ attribute: !1 })
], N.prototype, "hass", 2);
Z([
  P({ type: String })
], N.prototype, "entityId", 2);
Z([
  P({ attribute: !1 })
], N.prototype, "playerIds", 2);
Z([
  v()
], N.prototype, "_open", 2);
Z([
  v()
], N.prototype, "_castSheetOpen", 2);
Z([
  v()
], N.prototype, "_nowTick", 2);
Z([
  v()
], N.prototype, "_scrubbing", 2);
Z([
  v()
], N.prototype, "_scrubPct", 2);
Z([
  v()
], N.prototype, "_volDragging", 2);
Z([
  v()
], N.prototype, "_volPct", 2);
Z([
  v()
], N.prototype, "_palette", 2);
Z([
  T("dialog.media-dialog")
], N.prototype, "_dialogEl", 2);
Z([
  T(".dialog-surface")
], N.prototype, "_dialogSurfaceEl", 2);
Z([
  T(".artwork-frame")
], N.prototype, "_artworkFrameEl", 2);
Z([
  T(".meta-block")
], N.prototype, "_metaBlockEl", 2);
N = Z([
  z("m3e-media-popup")
], N);
var or = Object.defineProperty, nr = Object.getOwnPropertyDescriptor, Q = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? nr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && or(e, i, r), r;
};
const lr = 2048;
let W = class extends A {
  constructor() {
    super(...arguments), this._marqueeActive = !1, this._marqueeDuration = 12, this._pressed = !1, this._prevStates = {};
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-media-bar-card: devi specificare un’entità media_player.*");
    this._config = {
      ...t,
      show_cast: t.show_cast !== !1,
      hide_when_inactive: !!t.hide_when_inactive,
      tap_action: t.tap_action ?? "popup"
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-media-bar-card",
      entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("media_player.")) ?? "media_player.salotto_speaker",
      show_cast: !0,
      hide_when_inactive: !1,
      tap_action: "popup"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: { entity: { domain: "media_player" } }
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            { name: "name", selector: { text: {} } },
            {
              name: "entities",
              selector: { entity: { domain: "media_player", multiple: !0 } }
            },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "show_cast", selector: { boolean: {} } },
                { name: "hide_when_inactive", selector: { boolean: {} } }
              ]
            }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            {
              name: "tap_action",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "popup", label: "Apri popup Now Playing M3E" },
                    { value: "more-info", label: "Apri dettagli nativi HA (More-info)" },
                    { value: "none", label: "Nessuna azione" }
                  ]
                }
              }
            }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Media player principale",
        entities: "Media player aggiuntivi (switch automatico su quello in riproduzione)",
        name: "Nome personalizzato (opzionale)",
        show_cast: "Mostra pulsante Cast / Sorgenti",
        hide_when_inactive: "Nascondi barra quando spento / inattivo",
        tap_action: "Azione al tap sulla barra"
      })[t.name] ?? t.name
    };
  }
  get _allEntityIds() {
    if (!this._config) return [];
    const t = [this._config.entity, ...this._config.entities ?? []].filter(Boolean);
    return Array.from(new Set(t));
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_selectedEntityId") || t.has("_marqueeActive") || t.has("_marqueeDuration") || t.has("_pressed"))
      return !0;
    if (t.has("hass") && this.hass) {
      let e = !1;
      for (const s of this._allEntityIds) {
        const r = this.hass.states[s];
        r !== this._prevStates[s] && (this._prevStates[s] = r, e = !0);
      }
      return t.get("hass")?.themes?.darkMode !== this.hass.themes?.darkMode && (e = !0), e;
    }
    return !1;
  }
  connectedCallback() {
    super.connectedCallback(), typeof ResizeObserver < "u" && (this._resizeObserver = new ResizeObserver(() => this._measureMarquee()));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resizeObserver?.disconnect();
  }
  updated() {
    this._marqueeViewport && this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver.observe(this._marqueeViewport)), this._measureMarquee();
  }
  get _activeEntity() {
    if (!this.hass || !this._config) return;
    const t = this._allEntityIds;
    if (this._selectedEntityId && t.includes(this._selectedEntityId)) {
      const e = this.hass.states[this._selectedEntityId];
      if (e) return e;
    }
    for (const e of t)
      if (this.hass.states[e]?.state === "playing") return this.hass.states[e];
    for (const e of t)
      if (this.hass.states[e]?.state === "paused") return this.hass.states[e];
    return this.hass.states[this._config.entity];
  }
  _getMetadataText(t) {
    if (!t) return "Offline";
    const e = String(t.state ?? "").toLowerCase();
    if (e === "unavailable" || e === "unknown") return "Offline";
    if (e === "off") return "Off";
    if (e === "idle" || e === "standby") return "Idle";
    const i = String(t.attributes.media_title ?? "").trim(), s = String(t.attributes.media_artist ?? "").trim(), r = String(t.attributes.media_album_name ?? "").trim(), a = String(t.attributes.app_name ?? "").trim();
    return i && s ? `${i} · ${s}` : i && r ? `${i} · ${r}` : i || s || a || (e === "paused" ? "Paused" : e === "playing" ? "Playing" : e);
  }
  _measureMarquee() {
    const t = this._marqueeViewport, e = this._marqueeMeasure;
    if (!t || !e) {
      this._marqueeActive && (this._marqueeActive = !1);
      return;
    }
    const i = this._activeEntity, s = String(i?.state ?? "").toLowerCase();
    if (!(s === "playing" || s === "paused" || s === "buffering")) {
      this._marqueeActive && (this._marqueeActive = !1);
      return;
    }
    const a = e.scrollWidth, o = t.clientWidth, n = o > 0 && a > o + 4;
    if (n !== this._marqueeActive && (this._marqueeActive = n), n) {
      const c = Math.max(9, Math.round((a + 48) / 36));
      c !== this._marqueeDuration && (this._marqueeDuration = c);
    }
  }
  _togglePlayPause(t) {
    t.stopPropagation();
    const e = this._activeEntity;
    if (!this.hass || !e) return;
    const i = e.state;
    i === "unavailable" || i === "unknown" || this.hass.callService("media_player", "media_play_pause", {
      entity_id: e.entity_id
    });
  }
  _onBarClick() {
    const t = this._activeEntity;
    if (!(!t || this._config?.tap_action === "none")) {
      if (this._config?.tap_action === "more-info") {
        this.dispatchEvent(
          new CustomEvent("hass-more-info", {
            detail: { entityId: t.entity_id },
            bubbles: !0,
            composed: !0
          })
        );
        return;
      }
      this._popupEl?.open(this._barEl?.getBoundingClientRect(), !1);
    }
  }
  _openCastDialog(t) {
    t.stopPropagation(), this._popupEl?.open(this._barEl?.getBoundingClientRect(), !0);
  }
  render() {
    if (!this._config) return h;
    const t = this._activeEntity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", r = i || e === "off" || e === "idle" || e === "standby";
    if (this._config.hide_when_inactive && r)
      return h;
    const a = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, o = this._getMetadataText(t), n = r ? "" : String(t?.attributes.entity_picture_local || t?.attributes.entity_picture || "").trim(), c = Array.isArray(t?.attributes.source_list) ? Array.from(
      new Set(
        t.attributes.source_list.map((m) => String(m ?? "").trim()).filter(Boolean)
      )
    ) : [], d = (Number(t?.attributes.supported_features ?? 0) & lr) !== 0 || c.length > 0, g = this._allEntityIds.length > 1, u = this._config.show_cast !== !1 && !i && (d || g);
    return l`
      <ha-card
        class="media-bar is-wide-card ${s ? "is-playing" : ""} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${a}, ${o}"
        @pointerdown=${(m) => {
      i || m.pointerType === "mouse" && m.button !== 0 || m.target?.closest("button") || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._onBarClick()}
        @keydown=${(m) => {
      (m.key === "Enter" || m.key === " ") && (m.preventDefault(), this._onBarClick());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>

        <div class="bar-inner">
          <!-- Left Slot: Squircle Artwork or Tonal Media Icon -->
          <div class="artwork-box" aria-hidden="true">
            ${n ? l`<img class="artwork-img" src=${n} alt="" loading="lazy" />` : l`
                  <svg viewBox="0 0 24 24" class="artwork-fallback">
                    <path
                      fill="currentColor"
                      d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
                    />
                  </svg>
                `}
          </div>

          <!-- Center Slot: Player Name + Auto-Marquee Metadata -->
          <div class="text-col">
            <span class="player-title">${a}</span>
            <div class="marquee-viewport ${this._marqueeActive ? "is-scrolling" : ""}">
              <span class="marquee-measure" aria-hidden="true">${o}</span>
              ${this._marqueeActive ? l`
                    <div
                      class="marquee-track"
                      style="--marquee-dur: ${this._marqueeDuration}s;"
                    >
                      <span class="marquee-copy">${o}</span>
                      <span class="marquee-copy" aria-hidden="true">${o}</span>
                    </div>
                  ` : l`<span class="meta-static">${o}</span>`}
            </div>
          </div>

          <!-- Right Slot: Cast / Output + Squircle Play/Pause (or Offline Badge) -->
          <div class="actions-col">
            ${i ? l`
                  <span class="offline-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                      />
                    </svg>
                  </span>
                ` : l`
                  ${u ? l`
                        <button
                          type="button"
                          class="cast-btn"
                          aria-label="Sorgente o dispositivo"
                          title="Sorgente / Output"
                          @click=${(m) => this._openCastDialog(m)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                            />
                          </svg>
                        </button>
                      ` : h}

                  <button
                    type="button"
                    class="play-btn ${s ? "is-playing" : ""}"
                    aria-label=${s ? "Pausa" : "Riproduci"}
                    @click=${(m) => this._togglePlayPause(m)}
                  >
                    ${s ? l`
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        ` : l`
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                            />
                          </svg>
                        `}
                  </button>
                `}
          </div>
        </div>
      </ha-card>

      <!-- Shared Material 3 Expressive Now Playing & Cast Popup -->
      <m3e-media-popup
        .hass=${this.hass}
        .entityId=${t?.entity_id ?? this._config.entity}
        .playerIds=${this._allEntityIds}
        @m3e-player-selected=${(m) => {
      this._selectedEntityId = m.detail.entityId;
    }}
      ></m3e-media-popup>
    `;
  }
};
W.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
        --m3e-spring-bouncy: 480ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. FOOTER MEDIA BAR (Google Home Pill Bar)
         ===================================================================== */
      .media-bar {
        border-radius: 28px;
        --ha-card-border-radius: 28px;
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container, #ececef)
        );
        box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, 0 1px 3px rgba(0, 0, 0, 0.08)));
        cursor: pointer;
        outline: none;
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .media-bar:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .media-bar:hover .state-layer {
        opacity: 0.04;
      }

      .media-bar.is-pressed .state-layer {
        opacity: 0.08;
      }

      .bar-inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
      }

      /* Left Slot: Squircle Artwork */
      .artwork-box {
        flex: 0 0 52px;
        width: 52px;
        height: 52px;
        border-radius: 15px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.18));
        color: var(--md-sys-color-on-surface-variant, #444746);
        display: grid;
        place-items: center;
      }

      .artwork-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        animation: m3e-fade-in 240ms cubic-bezier(0.2, 0, 0, 1);
      }

      .artwork-fallback {
        width: 24px;
        height: 24px;
      }

      /* Center Slot: Title + Auto-Marquee Metadata */
      .text-col {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
      }

      .player-title {
        font-size: 15.5px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .marquee-viewport {
        position: relative;
        overflow: hidden;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .marquee-viewport.is-scrolling {
        -webkit-mask-image: linear-gradient(
          90deg,
          transparent 0%,
          #000 8%,
          #000 92%,
          transparent 100%
        );
        mask-image: linear-gradient(
          90deg,
          transparent 0%,
          #000 8%,
          #000 92%,
          transparent 100%
        );
      }

      .marquee-measure {
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        pointer-events: none;
      }

      .meta-static {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .marquee-track {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        will-change: transform;
        animation: m3e-marquee var(--marquee-dur, 12s) linear infinite;
      }

      .marquee-copy {
        padding-right: 48px;
      }

      @keyframes m3e-marquee {
        0%,
        12% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      /* Right Slot: Cast + Squircle Play/Pause */
      .actions-col {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cast-btn {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #444746);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .cast-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .cast-btn:active {
        transform: scale(0.92);
      }

      .cast-btn svg {
        width: 23px;
        height: 23px;
      }

      .play-btn {
        width: 52px;
        height: 52px;
        border: 0;
        border-radius: 17px;
        background: var(--md-sys-color-secondary-container, var(--md-sys-color-surface-container-highest, #ffffff));
        color: var(--md-sys-color-on-secondary-container, var(--md-sys-color-on-surface, #1b1b1f));
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .play-btn:not(.is-playing) {
        border-radius: 50%;
      }

      .play-btn:hover:not(:disabled) {
        background: var(--md-sys-color-secondary-container, var(--md-sys-color-surface-container-lowest, #ffffff));
        color: var(--md-sys-color-on-secondary-container, var(--md-sys-color-on-surface, #1b1b1f));
      }

      .play-btn:active:not(:disabled) {
        transform: scale(0.93);
      }

      .play-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .play-btn svg {
        width: 24px;
        height: 24px;
        transition: transform 160ms cubic-bezier(0.2, 0, 0, 1);
      }

      /* =====================================================================
         2. CAST / SOURCE SELECTOR DIALOG (Consistent M3 Expressive Radio List)
         ===================================================================== */
      dialog.cast-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(410px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #1b1b1f);
      }

      dialog.cast-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 54%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.32);
      }

      @media (max-width: 600px) {
        dialog.cast-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 88dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          padding: 16px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dialog-title {
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .picker-section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        padding: 4px 4px 0;
      }

      .picker-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .picker-row {
        width: 100%;
        min-height: 60px;
        padding: 12px 18px;
        border: 0;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .picker-row.is-selected {
        border-radius: 9999px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .picker-row:active {
        transform: scale(0.98);
      }

      .picker-row-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .picker-row-title {
        font-size: 15px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .picker-row.is-selected .picker-row-title {
        font-weight: 600;
      }

      .picker-row-sub {
        font-size: 12.5px;
        opacity: 0.78;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .m3-radio {
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #8e9099);
        display: grid;
        place-items: center;
      }

      .m3-radio.checked {
        border-color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .m3-radio-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--md-sys-color-on-primary-container, #dce2ff);
        transform: scale(0);
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .m3-radio.checked .m3-radio-dot {
        transform: scale(1);
      }
    `
];
Q([
  P({ attribute: !1 })
], W.prototype, "hass", 2);
Q([
  v()
], W.prototype, "_config", 2);
Q([
  v()
], W.prototype, "_selectedEntityId", 2);
Q([
  v()
], W.prototype, "_marqueeActive", 2);
Q([
  v()
], W.prototype, "_marqueeDuration", 2);
Q([
  v()
], W.prototype, "_pressed", 2);
Q([
  T(".media-bar")
], W.prototype, "_barEl", 2);
Q([
  T(".marquee-viewport")
], W.prototype, "_marqueeViewport", 2);
Q([
  T(".marquee-measure")
], W.prototype, "_marqueeMeasure", 2);
Q([
  T("m3e-media-popup")
], W.prototype, "_popupEl", 2);
W = Q([
  z("m3e-media-bar-card")
], W);
var cr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, q = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? dr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && cr(e, i, r), r;
};
const pr = 2, hr = 16, ur = 32;
function bi(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), r = e % 60, a = r < 10 ? `0${r}` : String(r);
  if (i > 0) {
    const o = s < 10 ? `0${s}` : String(s);
    return `${i}:${o}:${a}`;
  }
  return `${s}:${a}`;
}
let j = class extends A {
  constructor() {
    super(...arguments), this._palette = null, this._nowTick = Date.now(), this._scrubbing = !1, this._scrubPct = null, this._pressed = !1, this._lastArtworkUrl = "", this._tickTimer = null, this._onSliderPointerDown = (t) => {
      if (t.stopPropagation(), this._duration <= 0 || t.pointerType === "mouse" && t.button !== 0) return;
      t.preventDefault();
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._scrubbing = !0, this._scrubPct = this._pointerToPct(t.clientX, e);
    }, this._onSliderPointerMove = (t) => {
      this._scrubbing && (t.stopPropagation(), t.preventDefault(), this._scrubPct = this._pointerToPct(t.clientX, t.currentTarget));
    }, this._onSliderPointerUp = (t) => {
      if (!this._scrubbing) return;
      t.stopPropagation();
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId);
      const i = this._scrubPct;
      if (this._scrubbing = !1, this._scrubPct = null, i !== null && this._duration > 0) {
        const s = Math.round(i / 100 * this._duration);
        this._callService("media_seek", { seek_position: s });
      }
    };
  }
  set config(t) {
    !t || !t.entity || this._config && this._config.entity === t.entity && this._config.name === t.name && this._config.dynamic_color === (t.dynamic_color !== !1) && this._config.show_device_chip === (t.show_device_chip !== !1) && this._config.tap_action === (t.tap_action ?? "popup") || this.setConfig(t);
  }
  get config() {
    return this._config;
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-media-player-card: devi specificare un’entità media_player.*");
    this._config = {
      ...t,
      dynamic_color: t.dynamic_color !== !1,
      show_device_chip: t.show_device_chip !== !1,
      tap_action: t.tap_action ?? "popup"
    };
  }
  getCardSize() {
    return 3;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-media-player-card",
      entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("media_player.")) ?? "media_player.salotto_speaker",
      dynamic_color: !0,
      show_device_chip: !0,
      tap_action: "popup"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: { entity: { domain: "media_player" } }
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            { name: "name", selector: { text: {} } },
            {
              name: "entities",
              selector: { entity: { domain: "media_player", multiple: !0 } }
            },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "dynamic_color", selector: { boolean: {} } },
                { name: "show_device_chip", selector: { boolean: {} } }
              ]
            }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            {
              name: "tap_action",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "popup", label: "Apri popup Now Playing M3E" },
                    { value: "more-info", label: "Apri dettagli nativi HA (More-info)" },
                    { value: "none", label: "Nessuna azione" }
                  ]
                }
              }
            }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Entità media player",
        entities: "Altri media player (selezionabili dal foglio Cast)",
        name: "Nome dispositivo personalizzato (opzionale)",
        dynamic_color: "Colori dinamici estratti dalla copertina (M3 Expressive)",
        show_device_chip: "Mostra chip dispositivo in alto a destra",
        tap_action: "Azione al tap sulla card"
      })[t.name] ?? t.name
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_palette") || t.has("_nowTick") || t.has("_scrubbing") || t.has("_scrubPct") || t.has("_activeEntityId") || t.has("_pressed"))
      return !0;
    if (t.has("hass") && this.hass) {
      const e = this.hass.states[this._currentEntityId], i = t.get("hass");
      return e !== this._prevEntity || i?.themes?.darkMode !== this.hass.themes?.darkMode ? (this._prevEntity = e, !0) : !1;
    }
    return !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopTicker();
  }
  updated() {
    const t = this._entity, e = t?.state === "playing", i = typeof t?.attributes.media_duration == "number" && t.attributes.media_duration > 0;
    e && i && !this._scrubbing ? this._startTicker() : this._stopTicker();
    const s = this._artworkUrl;
    s !== this._lastArtworkUrl && (this._lastArtworkUrl = s, s && this._config?.dynamic_color !== !1 ? Xe(s).then((r) => {
      this._lastArtworkUrl === s && (this._palette = r);
    }) : this._palette = null);
  }
  _startTicker() {
    this._tickTimer === null && (this._tickTimer = window.setInterval(() => {
      this._nowTick = Date.now();
    }, 1e3));
  }
  _stopTicker() {
    this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null);
  }
  get _currentEntityId() {
    return this._activeEntityId || this._config?.entity || "";
  }
  get _entity() {
    if (!(!this.hass || !this._currentEntityId))
      return this.hass.states[this._currentEntityId];
  }
  get _artworkUrl() {
    const t = this._entity, e = String(t?.state ?? "").toLowerCase();
    return !t || e === "off" || e === "idle" || e === "unavailable" || e === "unknown" ? "" : String(
      t.attributes.entity_picture_local || t.attributes.entity_picture || ""
    ).trim();
  }
  get _duration() {
    const t = this._entity?.attributes.media_duration;
    return typeof t == "number" && t > 0 ? t : 0;
  }
  get _currentPosition() {
    const t = this._entity, e = this._duration;
    if (!t || e <= 0) return 0;
    const i = typeof t.attributes.media_position == "number" ? t.attributes.media_position : 0;
    if (t.state !== "playing")
      return Math.max(0, Math.min(e, i));
    const s = t.attributes.media_position_updated_at;
    if (typeof s == "string") {
      const r = Date.parse(s);
      if (!Number.isNaN(r)) {
        const a = Math.max(0, (this._nowTick - r) / 1e3);
        return Math.max(0, Math.min(e, i + a));
      }
    }
    return Math.max(0, Math.min(e, i));
  }
  get _progressPct() {
    if (this._scrubPct !== null) return this._scrubPct;
    const t = this._duration;
    return t <= 0 ? 0 : Math.max(0, Math.min(100, this._currentPosition / t * 100));
  }
  _callService(t, e = {}, i) {
    i?.stopPropagation(), !(!this.hass || !this._currentEntityId) && this.hass.callService("media_player", t, {
      entity_id: this._currentEntityId,
      ...e
    });
  }
  _onCardClick() {
    if (!(!this._config || this._config.tap_action === "none")) {
      if (this._config.tap_action === "more-info") {
        this.dispatchEvent(
          new CustomEvent("hass-more-info", {
            detail: { entityId: this._currentEntityId },
            bubbles: !0,
            composed: !0
          })
        );
        return;
      }
      this._popupEl?.open(this._cardEl?.getBoundingClientRect(), !1);
    }
  }
  _onDeviceChipClick(t) {
    t.stopPropagation(), this._popupEl?.open(this._cardEl?.getBoundingClientRect(), !0);
  }
  _pointerToPct(t, e) {
    const i = e.getBoundingClientRect();
    return i.width <= 0 ? 0 : Math.max(0, Math.min(100, (t - i.left) / i.width * 100));
  }
  _renderAppBadge(t) {
    return Bi(this.hass, t);
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", r = i || e === "off" || e === "idle", a = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, n = String(t?.attributes.source ?? "").trim() || a, c = String(t?.attributes.media_title ?? "").trim() || (i ? "Offline" : r ? a : "In riproduzione"), p = String(t?.attributes.media_artist ?? "").trim() || String(t?.attributes.media_album_name ?? "").trim() || (i ? "Non disponibile" : r ? "Nessuna riproduzione" : a), d = this._artworkUrl, g = this._progressPct, u = this._duration, m = Number(t?.attributes.supported_features ?? 0), f = !i && (m === 0 || (m & hr) !== 0), y = !i && (m === 0 || (m & ur) !== 0), b = !i && u > 0 && (m === 0 || (m & pr) !== 0), C = s && !this._scrubbing && u > 0, w = this._scrubPct !== null ? this._scrubPct / 100 * u : this._currentPosition, $ = this._palette ? `--mp-scrim: ${this._palette.scrim}; --mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};` : "";
    return l`
      <ha-card
        class="media-player-card is-wide-card ${s ? "is-playing" : "is-paused"} ${d ? "has-artwork" : "no-artwork"} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        style=${$}
        role="button"
        tabindex="0"
        aria-label="${c}, ${p}"
        @pointerdown=${(k) => {
      i || k.pointerType === "mouse" && k.button !== 0 || k.target?.closest('button, [role="slider"]') || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._onCardClick()}
        @keydown=${(k) => {
      (k.key === "Enter" || k.key === " ") && (k.preventDefault(), this._onCardClick());
    }}
      >
        <!-- Full-bleed Artwork + Tonal Scrim/Vignette -->
        ${d ? l`<img class="bg-artwork" src=${d} alt="" loading="lazy" />` : h}
        <div class="bg-scrim" aria-hidden="true"></div>

        <div class="card-content">
          <!-- Top Row: App Badge + Output Device Chip -->
          <div class="top-row">
            ${this._renderAppBadge(t)}
            ${this._config.show_device_chip !== !1 ? l`
                  <button
                    type="button"
                    class="device-chip"
                    @click=${(k) => this._onDeviceChipClick(k)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span>${n}</span>
                  </button>
                ` : h}
          </div>

          <!-- Middle Row: Bold Typography + Shape-Morphing Play/Pause -->
          <div class="mid-row">
            <div class="track-meta">
              <div class="track-title">${c}</div>
              <div class="track-artist">${p}</div>
            </div>

            <button
              type="button"
              class="play-fab ${s ? "is-playing" : "is-paused"}"
              aria-label=${s ? "Pausa" : "Riproduci"}
              ?disabled=${i}
              @click=${(k) => this._callService("media_play_pause", {}, k)}
            >
              ${s ? l`
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                      <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                    </svg>
                  ` : l`
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                      />
                    </svg>
                  `}
            </button>
          </div>

          <!-- Bottom Row: Prev + M3 Expressive Wavy/Squiggly Progress + Next -->
          <div class="bottom-row">
            <button
              type="button"
              class="transport-btn is-prev"
              aria-label="Traccia precedente"
              ?disabled=${!f}
              @click=${(k) => this._callService("media_previous_track", {}, k)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
              </svg>
            </button>

            <div
              class="wavy-slider ${C ? "is-wavy" : "is-flat"} ${this._scrubbing ? "is-scrubbing" : ""} ${b ? "is-seekable" : ""}"
              role="slider"
              aria-label="Avanzamento riproduzione"
              aria-valuemin="0"
              aria-valuemax=${u}
              aria-valuenow=${Math.round(w)}
              @click=${(k) => k.stopPropagation()}
              @pointerdown=${this._onSliderPointerDown}
              @pointermove=${this._onSliderPointerMove}
              @pointerup=${this._onSliderPointerUp}
              @pointercancel=${this._onSliderPointerUp}
            >
              ${this._scrubbing && u > 0 ? l`
                    <span class="scrub-badge" style="left: ${g}%;">
                      ${bi(w)} / ${bi(u)}
                    </span>
                  ` : h}

              <!-- Active Wavy / Flat Segment -->
              <div class="wavy-active-wrap" style="width: max(0px, calc(${g}% - 7px));">
                <div class="wavy-svg-scroller">
                  <svg class="wavy-svg" aria-hidden="true">
                    <defs>
                      <pattern
                        id="m3e-mp-wave"
                        width="28"
                        height="14"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          class="wavy-path"
                          d="M 0 7 Q 7 2, 14 7 T 28 7"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="14" fill="url(#m3e-mp-wave)" />
                  </svg>
                </div>
                <div class="flat-active-line"></div>
              </div>

              <!-- M3 Expressive Vertical Pill Thumb -->
              <div class="wavy-thumb" style="left: ${g}%;"></div>

              <!-- Inactive Remaining Track -->
              <div class="wavy-inactive-line" style="left: calc(${g}% + 7px);"></div>
            </div>

            <button
              type="button"
              class="transport-btn is-next"
              aria-label="Traccia successiva"
              ?disabled=${!y}
              @click=${(k) => this._callService("media_next_track", {}, k)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
              </svg>
            </button>
          </div>
        </div>
      </ha-card>

      <m3e-media-popup
        .hass=${this.hass}
        .entityId=${this._currentEntityId}
        .playerIds=${[this._config.entity, ...this._config.entities ?? []].filter(Boolean)}
        @m3e-player-selected=${(k) => {
      this._activeEntityId = k.detail.entityId;
    }}
      ></m3e-media-popup>
    `;
  }
};
j.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. FULL-BLEED EXPRESSIVE MEDIA CARD
         ===================================================================== */
      .media-player-card {
        --mp-scrim: #181920;
        --mp-accent: var(--md-sys-color-primary-container, #e4e0de);
        --mp-on-accent: var(--md-sys-color-on-primary-container, #1b1b1f);
        --mp-fg: #ffffff;
        --mp-fg-muted: rgba(255, 255, 255, 0.84);
        --mp-track-active: var(--mp-accent, #ffffff);
        --mp-track-inactive: rgba(255, 255, 255, 0.28);

        position: relative;
        min-height: 196px;
        border-radius: 28px;
        --ha-card-border-radius: 28px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        background: var(--mp-scrim);
        color: var(--mp-fg);
        transition:
          background-color 420ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
      }

      /* No-artwork / Standby / Idle: follow M3 theme surface & on-surface tokens
         so Light Mode and Dark Mode both maintain high WCAG contrast. */
      .media-player-card.no-artwork {
        --mp-fg: var(--md-sys-color-on-surface, #1b1b1f);
        --mp-fg-muted: var(--md-sys-color-on-surface-variant, #444746);
        --mp-track-active: var(--md-sys-color-primary, #4285f4);
        --mp-track-inactive: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 18%,
          transparent
        );
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container-low, #f3f3fa)
        );
      }

      .media-player-card.no-artwork.is-unavailable {
        --mp-fg: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 62%, transparent);
        --mp-fg-muted: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 48%,
          transparent
        );
        --mp-track-active: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 28%,
          transparent
        );
        --mp-track-inactive: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 14%,
          transparent
        );
      }

      .media-player-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #bac3ff);
        outline-offset: 2px;
      }

      .bg-artwork {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        pointer-events: none;
        animation: m3e-fade-in 380ms cubic-bezier(0.2, 0, 0, 1);
      }

      /* Deep tonal vignette + bottom gradient derived from artwork palette */
      .bg-scrim {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(
            ellipse 78% 72% at 50% 42%,
            color-mix(in srgb, var(--mp-scrim) 22%, transparent) 0%,
            color-mix(in srgb, var(--mp-scrim) 78%, transparent) 100%
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--mp-scrim) 46%, transparent) 0%,
            color-mix(in srgb, var(--mp-scrim) 28%, transparent) 44%,
            color-mix(in srgb, var(--mp-scrim) 88%, transparent) 100%
          );
        transition: background 450ms cubic-bezier(0.2, 0, 0, 1);
      }

      .media-player-card.no-artwork .bg-scrim {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--md-sys-color-primary-container, transparent) 26%, transparent) 0%,
          transparent 100%
        );
      }

      .media-player-card.no-artwork.is-unavailable .bg-scrim {
        display: none;
      }

      .card-content {
        position: relative;
        z-index: 1;
        min-height: 196px;
        padding: 16px 20px 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
      }

      /* =====================================================================
         2. TOP ROW (App Badge + Output Device Chip)
         ===================================================================== */
      .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .app-badge {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .app-badge .brand-icon-img {
        width: 26px;
        height: 26px;
        object-fit: contain;
        display: block;
        border-radius: 6px;
      }

      .app-badge .brand-fallback-svg {
        width: 17px;
        height: 17px;
      }

      .app-badge svg {
        width: 26px;
        height: 26px;
        display: block;
      }

      .app-badge.is-tonal {
        background: color-mix(in srgb, var(--mp-accent) 92%, transparent);
        color: var(--mp-on-accent);
      }

      .app-badge.is-tonal svg {
        width: 17px;
        height: 17px;
      }

      .device-chip {
        border: 0;
        font: inherit;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 68%;
        padding: 5px 12px;
        border-radius: 9999px;
        background: color-mix(in srgb, var(--mp-scrim) 72%, rgba(0, 0, 0, 0.38));
        color: rgba(255, 255, 255, 0.94);
        font-size: 12.5px;
        font-weight: 500;
        line-height: 16px;
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .media-player-card.no-artwork .device-chip {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 10%,
          transparent
        );
        color: var(--mp-fg);
      }

      .device-chip:active {
        transform: scale(0.95);
      }

      .device-chip svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .device-chip span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         3. MIDDLE ROW (Expressive Typography + Morphing Play/Pause FAB)
         ===================================================================== */
      .mid-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-top: 6px;
      }

      .track-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .track-title {
        font-size: 21px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--mp-fg);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        font-size: 14.5px;
        font-weight: 400;
        line-height: 1.28;
        color: var(--mp-fg-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* M3 Expressive Shape Morphing: Playing = Squircle (18px), Paused = Full Circle (50%) */
      .play-fab {
        flex: 0 0 58px;
        width: 58px;
        height: 58px;
        border: 0;
        border-radius: 50%;
        background: var(--mp-accent);
        color: var(--mp-on-accent);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1),
          color 360ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .play-fab.is-playing {
        border-radius: 18px;
      }

      .play-fab:active:not(:disabled) {
        transform: scale(0.9);
      }

      .play-fab:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .media-player-card.no-artwork.is-unavailable .play-fab:disabled {
        opacity: 1;
        background: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 12%, transparent);
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 38%, transparent);
      }

      .play-fab svg {
        width: 26px;
        height: 26px;
      }

      /* =====================================================================
         4. BOTTOM ROW (Prev + M3 Expressive Wavy Slider + Next)
         ===================================================================== */
      .bottom-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .transport-btn {
        flex: 0 0 38px;
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--mp-fg);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .transport-btn:hover:not(:disabled) {
        background: color-mix(in srgb, var(--mp-fg) 12%, transparent);
      }

      .transport-btn.is-prev:active:not(:disabled) {
        transform: translateX(-3px) scale(0.92);
      }

      .transport-btn.is-next:active:not(:disabled) {
        transform: translateX(3px) scale(0.92);
      }

      .transport-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .transport-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Squiggly / Wavy Slider */
      .wavy-slider {
        position: relative;
        flex: 1 1 auto;
        height: 32px;
        display: flex;
        align-items: center;
        touch-action: none;
        user-select: none;
      }

      .wavy-slider.is-seekable {
        cursor: pointer;
      }

      .wavy-active-wrap {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 14px;
        min-width: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .wavy-svg-scroller {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scaleY(0.15);
        transition:
          opacity 240ms cubic-bezier(0.2, 0, 0, 1),
          transform 380ms var(--m3e-spring-spatial-default);
      }

      .wavy-slider.is-wavy .wavy-svg-scroller {
        opacity: 1;
        transform: scaleY(1);
      }

      .wavy-svg {
        width: calc(100% + 28px);
        height: 14px;
        display: block;
        will-change: transform;
        animation: m3e-wave-flow 1.4s linear infinite;
      }

      .wavy-slider.is-flat .wavy-svg {
        animation-play-state: paused;
      }

      .wavy-path {
        fill: none;
        stroke: var(--mp-track-active);
        stroke-width: 3.2;
        stroke-linecap: round;
        transition: stroke 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      @keyframes m3e-wave-flow {
        from {
          transform: translateX(0px);
        }
        to {
          transform: translateX(-28px);
        }
      }

      .flat-active-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--mp-track-active);
        opacity: 1;
        transition:
          opacity 200ms cubic-bezier(0.2, 0, 0, 1),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      .wavy-slider.is-wavy .flat-active-line {
        opacity: 0;
      }

      /* Vertical Pill Thumb (M3 Expressive Media Handle) */
      .wavy-thumb {
        position: absolute;
        top: 50%;
        width: 4px;
        height: 18px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--mp-track-active);
        pointer-events: none;
        transition:
          height var(--m3e-spring-spatial-fast),
          width var(--m3e-spring-spatial-fast),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      .wavy-slider.is-scrubbing .wavy-thumb {
        width: 5px;
        height: 24px;
      }

      .wavy-inactive-line {
        position: absolute;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--mp-track-inactive);
        pointer-events: none;
      }

      .scrub-badge {
        position: absolute;
        bottom: 100%;
        margin-bottom: 6px;
        transform: translateX(-50%);
        padding: 4px 10px;
        border-radius: 9999px;
        background: var(--mp-accent, #ffffff);
        color: var(--mp-on-accent, #1b1b1f);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        pointer-events: none;
      }
    `
];
q([
  P({ attribute: !1 })
], j.prototype, "hass", 2);
q([
  v()
], j.prototype, "_config", 2);
q([
  v()
], j.prototype, "_palette", 2);
q([
  v()
], j.prototype, "_nowTick", 2);
q([
  v()
], j.prototype, "_scrubbing", 2);
q([
  v()
], j.prototype, "_scrubPct", 2);
q([
  v()
], j.prototype, "_activeEntityId", 2);
q([
  v()
], j.prototype, "_pressed", 2);
q([
  T(".media-player-card")
], j.prototype, "_cardEl", 2);
q([
  T("m3e-media-popup")
], j.prototype, "_popupEl", 2);
q([
  P({ attribute: !1 })
], j.prototype, "config", 1);
j = q([
  z("m3e-media-player-card")
], j);
var mr = Object.defineProperty, fr = Object.getOwnPropertyDescriptor, Te = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? fr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && mr(e, i, r), r;
};
let Ut = class extends A {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._computeTopLabel = (t) => ({
      layout: "Layout visualizzazione",
      size: "Dimensione",
      transparent: "Sfondo trasparente (stile At a Glance)",
      show_presence_indicator: "Indicatore presenza (pallino quando in casa)"
    })[t.name] ?? t.name, this._computeItemLabel = (t) => ({
      entity: "Persona (person.* o device_tracker.*)",
      name: "Nome personalizzato",
      icon: "Icona personalizzata (sostituisce la foto)",
      image: "URL immagine personalizzata (opzionale)",
      tap_action: "Azione al tap",
      navigation_path: "Percorso (/lovelace/..., #popup, script.*)"
    })[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = {
      ...t,
      items: Array.isArray(t.items) ? t.items.map((e) => ({ ...e })) : []
    };
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onTopChanged(t) {
    if (!this._config) return;
    const e = t.detail.value;
    this._emitConfig({
      ...this._config,
      layout: e.layout ?? "scroll",
      size: e.size ?? "default",
      transparent: e.transparent,
      show_presence_indicator: e.show_presence_indicator
    });
  }
  _onItemChanged(t, e) {
    if (!this._config) return;
    const i = [...this._config.items ?? []], s = {
      ...i[t],
      ...e.detail.value
    };
    s.name || delete s.name, s.icon || delete s.icon, s.image || delete s.image, s.navigation_path || delete s.navigation_path, i[t] = s, this._emitConfig({ ...this._config, items: i });
  }
  _addItem() {
    if (!this._config) return;
    const t = [...this._config.items ?? [], { entity: "", tap_action: "more-info" }];
    this._expandedIndex = t.length - 1, this._emitConfig({ ...this._config, items: t });
  }
  _removeItem(t, e) {
    if (e.stopPropagation(), !this._config) return;
    const i = [...this._config.items ?? []];
    i.splice(t, 1), this._expandedIndex >= i.length && (this._expandedIndex = Math.max(0, i.length - 1)), this._emitConfig({ ...this._config, items: i });
  }
  _moveItem(t, e, i) {
    if (i.stopPropagation(), !this._config) return;
    const s = [...this._config.items ?? []], r = t + e;
    r < 0 || r >= s.length || ([s[t], s[r]] = [s[r], s[t]], this._expandedIndex === t ? this._expandedIndex = r : this._expandedIndex === r && (this._expandedIndex = t), this._emitConfig({ ...this._config, items: s }));
  }
  _buildTopSchema() {
    return [
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "layout",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "scroll", label: "Orizzontale scorrevole (At a Glance)" },
                  { value: "row", label: "Riga intera (senza scorrimento)" },
                  { value: "list", label: "Elenco verticale a tutta riga" }
                ]
              }
            }
          },
          {
            name: "size",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "default", label: "Standard (46px)" },
                  { value: "compact", label: "Compatta (36px)" }
                ]
              }
            }
          }
        ]
      },
      { name: "transparent", selector: { boolean: {} } },
      { name: "show_presence_indicator", selector: { boolean: {} } }
    ];
  }
  _buildItemSchema(t) {
    const e = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: ["person", "device_tracker"] } }
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } }
        ]
      },
      { name: "image", selector: { text: {} } },
      {
        name: "tap_action",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "more-info", label: "Dettagli persona (More-info)" },
              { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
              { value: "none", label: "Nessuna azione" }
            ]
          }
        }
      }
    ];
    return t.tap_action === "navigate" && e.push({ name: "navigation_path", selector: { navigation: {} } }), e;
  }
  _itemTitle(t, e) {
    return t.name ? t.name : t.entity ? this.hass?.states[t.entity]?.attributes.friendly_name || t.entity : `Persona #${e + 1}`;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config.items ?? [];
    return l`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${{
      layout: this._config.layout ?? "scroll",
      size: this._config.size ?? "default",
      transparent: this._config.transparent !== !1,
      show_presence_indicator: this._config.show_presence_indicator !== !1
    }}
          .schema=${this._buildTopSchema()}
          .computeLabel=${this._computeTopLabel}
          @value-changed=${this._onTopChanged}
        ></ha-form>

        <div class="section-header">
          <span class="section-title">Persone (${t.length})</span>
        </div>

        <div class="items-list">
          ${t.map((e, i) => {
      const s = this._expandedIndex === i, r = {
        entity: e.entity ?? "",
        name: e.name ?? "",
        icon: e.icon ?? "",
        image: e.image ?? "",
        tap_action: e.tap_action ?? "more-info",
        navigation_path: e.navigation_path ?? ""
      };
      return l`
              <div class="item-card ${s ? "is-expanded" : ""}">
                <div
                  class="item-header"
                  role="button"
                  tabindex="0"
                  @click=${() => {
        this._expandedIndex = s ? -1 : i;
      }}
                >
                  <div class="item-header-left">
                    <span class="item-index">${i + 1}</span>
                    <div class="item-summary">
                      <span class="item-title">${this._itemTitle(e, i)}</span>
                      <span class="item-sub">${e.entity || "Seleziona una persona"}</span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${i === 0}
                      @click=${(a) => this._moveItem(i, -1, a)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === t.length - 1}
                      @click=${(a) => this._moveItem(i, 1, a)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(a) => this._removeItem(i, a)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                ${s ? l`
                      <div class="item-body">
                        <ha-form
                          .hass=${this.hass}
                          .data=${r}
                          .schema=${this._buildItemSchema(e)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(a) => this._onItemChanged(i, a)}
                        ></ha-form>
                      </div>
                    ` : h}
              </div>
            `;
    })}
        </div>

        <button type="button" class="add-btn" @click=${this._addItem}>
          + Aggiungi persona
        </button>
      </div>
    `;
  }
};
Ut.styles = I`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .item-card {
      border-radius: 16px;
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
      overflow: hidden;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .item-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .item-index {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 150ms ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(128, 128, 128, 0.16);
      color: var(--primary-text-color);
    }

    .icon-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .icon-btn.danger:hover {
      color: var(--error-color, #d93025);
      background: rgba(217, 48, 37, 0.12);
    }

    .item-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(128, 128, 128, 0.18));
    }

    .add-btn {
      align-self: flex-start;
      padding: 10px 18px;
      border-radius: 9999px;
      border: none;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 150ms ease, transform 150ms ease;
    }

    .add-btn:hover {
      opacity: 0.92;
    }

    .add-btn:active {
      transform: scale(0.97);
    }
  `;
Te([
  P({ attribute: !1 })
], Ut.prototype, "hass", 2);
Te([
  v()
], Ut.prototype, "_config", 2);
Te([
  v()
], Ut.prototype, "_expandedIndex", 2);
Ut = Te([
  z("m3e-people-card-editor")
], Ut);
var gr = Object.defineProperty, vr = Object.getOwnPropertyDescriptor, Ae = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? vr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && gr(e, i, r), r;
};
let Zt = class extends A {
  constructor() {
    super(...arguments), this._isMouseDragging = !1, this._dragMoved = !1, this._dragStartX = 0, this._dragScrollLeft = 0;
  }
  setConfig(t) {
    if (!t)
      throw new Error("m3e-people-card: configurazione mancante");
    this._config = {
      ...t,
      layout: t.layout ?? "scroll",
      size: t.size ?? "default",
      transparent: t.transparent !== !1,
      show_presence_indicator: t.show_presence_indicator !== !1,
      items: Array.isArray(t.items) ? t.items : []
    };
  }
  getCardSize() {
    return this._config?.layout === "list" ? Math.max(1, Math.min(4, this._config.items?.length ?? 1)) : 1;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-people-card-editor");
  }
  static getStubConfig(t) {
    const e = t?.states ?? {}, i = Object.keys(e).filter((r) => r.startsWith("person.")).slice(0, 6);
    return {
      type: "custom:m3e-people-card",
      layout: "scroll",
      size: "default",
      transparent: !0,
      show_presence_indicator: !0,
      items: i.length > 0 ? i.map((r) => ({ entity: r, tap_action: "more-info" })) : [{ entity: "person.home", tap_action: "more-info" }]
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config")) return !0;
    if (t.has("hass")) {
      const e = t.get("hass");
      if (!e || !this.hass) return !0;
      for (const i of this._config.items)
        if (i.entity && e.states[i.entity] !== this.hass.states[i.entity])
          return !0;
      return e.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  _formatLocation(t) {
    if (!t) return "Offline";
    const e = String(t.state ?? "").trim(), i = e.toLowerCase();
    return !e || i === "unavailable" || i === "unknown" ? "Offline" : i === "home" ? "Home" : i === "not_home" ? (this.hass?.language ?? "it").toLowerCase().startsWith("it") ? "Fuori casa" : "Away" : e;
  }
  _onMouseDown(t) {
    this._config?.layout !== "scroll" || !this._containerEl || t.button !== 0 || (this._isMouseDragging = !0, this._dragMoved = !1, this._dragStartX = t.pageX - this._containerEl.offsetLeft, this._dragScrollLeft = this._containerEl.scrollLeft);
  }
  _onMouseMove(t) {
    if (!this._isMouseDragging || !this._containerEl) return;
    const i = t.pageX - this._containerEl.offsetLeft - this._dragStartX;
    Math.abs(i) > 6 && (this._dragMoved = !0, t.preventDefault(), this._containerEl.scrollLeft = this._dragScrollLeft - i);
  }
  _onMouseUpOrLeave() {
    this._isMouseDragging = !1;
  }
  _onItemTap(t) {
    if (this._dragMoved) {
      this._dragMoved = !1;
      return;
    }
    if (!this.hass || !t.entity) return;
    const e = t.tap_action ?? "more-info";
    if (e !== "none") {
      if (e === "navigate" && t.navigation_path) {
        Ht(this, this.hass, t.navigation_path);
        return;
      }
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: t.entity },
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  _renderAvatar(t, e, i = !1) {
    if (t.icon)
      return l`<ha-icon .icon=${t.icon}></ha-icon>`;
    const s = t.image?.trim() || e?.attributes.entity_picture || "";
    return s ? l`<img class="avatar-img" src=${s} alt="" loading="lazy" />` : i ? l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
            />
          </svg>
        ` : l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2Zm0-12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"
            />
          </svg>
        `;
  }
  render() {
    if (!this._config) return h;
    const t = this._config.items ?? [], e = this._config.layout ?? "scroll", i = this._config.size ?? "default", s = this._config.transparent !== !1, r = this._config.show_presence_indicator !== !1, a = l`
      <div
        class="people-container layout-${e} size-${i} ${s ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${t.length === 0 ? l`<div class="empty-hint">Aggiungi persone dalla configurazione della card</div>` : t.map((o) => {
      const n = o.entity ? this.hass?.states[o.entity] : void 0, c = !n || n.state === "unavailable" || n.state === "unknown", p = !c && String(n.state ?? "").toLowerCase() === "home", d = o.name || n?.attributes.friendly_name || o.entity || "Persona", g = this._formatLocation(n), u = (o.tap_action ?? "more-info") !== "none" && !!o.entity, m = !o.icon && !!(o.image?.trim() || n?.attributes.entity_picture?.trim()), f = this.hass?.themes?.darkMode === !1;
      return l`
                <button
                  type="button"
                  class="person-item ${c ? "is-dimmed" : ""} ${u ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(o)}
                >
                  <span class="avatar-wrap" aria-hidden="true">
                    <span
                      class="avatar-circle ${p ? "is-home" : ""} ${m ? "has-picture" : ""} ${f ? "is-light" : "is-dark"}"
                    >
                      ${this._renderAvatar(o, n, p)}
                    </span>
                    ${r && p ? l`<span class="presence-dot"></span>` : h}
                  </span>

                  <span class="text-col">
                    <span class="primary-name">${d}</span>
                    <span class="secondary-location">${g}</span>
                  </span>
                </button>
              `;
    })}
      </div>
    `;
    return s ? a : l`<ha-card>${a}</ha-card>`;
  }
};
Zt.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
      }

      ha-card {
        border-radius: var(--m3e-shape-card, 28px);
        overflow: hidden;
      }

      /* =====================================================================
         LAYOUT MODES: scroll | row | list
         ===================================================================== */
      .people-container.is-transparent {
        padding: 4px 2px;
      }

      .people-container.is-card {
        padding: 14px 18px;
      }

      /* 1. Horizontal Scrollable (At a Glance mirror) */
      .people-container.layout-scroll {
        display: flex;
        align-items: center;
        gap: 26px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-snap-type: x proximity;
        touch-action: pan-x;
        -webkit-overflow-scrolling: touch;
      }

      .people-container.layout-scroll::-webkit-scrollbar {
        display: none;
      }

      .people-container.layout-scroll.size-compact {
        gap: 18px;
      }

      .people-container.layout-scroll .person-item {
        flex: 0 0 auto;
        scroll-snap-align: start;
      }

      /* 2. Full-Row Adaptive Grid (no horizontal scroll, occupies full width) */
      .people-container.layout-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
        gap: 14px 16px;
        align-items: center;
      }

      .people-container.layout-row.size-compact {
        grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
        gap: 10px 12px;
      }

      .people-container.layout-row .person-item {
        width: 100%;
        min-width: 0;
      }

      /* 3. Vertical Full-Width List */
      .people-container.layout-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .people-container.layout-list.size-compact {
        gap: 6px;
      }

      .people-container.layout-list .person-item {
        width: 100%;
        padding: 8px 12px;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-low, transparent);
      }

      .people-container.layout-list .person-item.is-clickable:hover {
        background: var(--md-sys-color-surface-container, rgba(128, 128, 128, 0.1));
      }

      /* =====================================================================
         PERSON ITEM (Image -> Name -> Location)
         ===================================================================== */
      .person-item {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        border: none;
        background: transparent;
        padding: 4px 6px 4px 2px;
        margin: 0;
        border-radius: 9999px;
        text-align: left;
        font-family: inherit;
        color: inherit;
        transition:
          transform 200ms var(--m3e-spring-fast, cubic-bezier(0.2, 0, 0, 1)),
          background-color 180ms ease;
        -webkit-tap-highlight-color: transparent;
      }

      .size-compact .person-item {
        gap: 10px;
        padding: 2px 4px 2px 2px;
      }

      .person-item.is-clickable {
        cursor: pointer;
      }

      .person-item.is-clickable:active {
        transform: scale(0.96);
      }

      .person-item.is-dimmed {
        opacity: 0.6;
      }

      .avatar-wrap {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
      }

      .avatar-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.16))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color, #444746));
        transition: background-color 180ms ease;
      }

      .size-compact .avatar-circle {
        width: 36px;
        height: 36px;
      }

      .avatar-circle.is-home {
        background: var(
          --md-sys-color-primary-container,
          var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.2))
        );
        color: var(--md-sys-color-on-primary-container, var(--primary-text-color));
      }

      /* Light mode: ensure transparent light-colored silhouette PNGs keep crisp contrast
         without affecting opaque user photos (which fully cover the circle background). */
      .avatar-circle.has-picture.is-light {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface-variant, #444746) 72%,
          var(--md-sys-color-surface, #ffffff)
        );
      }

      .avatar-circle.has-picture.is-light.is-home {
        background: var(--md-sys-color-primary, #4285f4);
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .avatar-circle svg {
        width: 24px;
        height: 24px;
        display: block;
      }

      .size-compact .avatar-circle svg {
        width: 20px;
        height: 20px;
      }

      .avatar-circle ha-icon {
        --mdc-icon-size: 23px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .size-compact .avatar-circle ha-icon {
        --mdc-icon-size: 19px;
      }

      .presence-dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--md-sys-color-primary, #4285f4);
        border: 2px solid var(--md-sys-color-surface, var(--lovelace-background, #141416));
        box-sizing: border-box;
      }

      .size-compact .presence-dot {
        width: 10px;
        height: 10px;
      }

      .text-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        min-width: 0;
        flex: 1 1 auto;
      }

      .size-compact .text-col {
        gap: 1px;
      }

      .primary-name {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.005em;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .size-compact .primary-name {
        font-size: 14px;
      }

      .secondary-location {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.22;
        letter-spacing: 0.01em;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .size-compact .secondary-location {
        font-size: 12px;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        padding: 10px 6px;
      }
    `
];
Ae([
  P({ attribute: !1 })
], Zt.prototype, "hass", 2);
Ae([
  v()
], Zt.prototype, "_config", 2);
Ae([
  T(".people-container")
], Zt.prototype, "_containerEl", 2);
Zt = Ae([
  z("m3e-people-card")
], Zt);
var _r = Object.defineProperty, br = Object.getOwnPropertyDescriptor, Wt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? br(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && _r(e, i, r), r;
};
async function Ne() {
  if (!(customElements.get("hui-card-picker") && customElements.get("hui-card-element-editor")))
    try {
      const t = await window.loadCardHelpers?.();
      if (t) {
        const i = (await t.createCardElement({ type: "vertical-stack", cards: [] })).constructor;
        typeof i?.getConfigElement == "function" && await i.getConfigElement();
      }
    } catch {
    }
}
let mt = class extends A {
  constructor() {
    super(...arguments), this._editingCardIdx = null, this._pickingNewCard = !1, this._onValueChanged = (t) => {
      this._config && this._emitConfig({ ...this._config, ...t.detail.value });
    }, this._onCardPicked = (t) => {
      t.stopPropagation();
      const e = t.detail?.config;
      if (!this._config || !e) return;
      const i = [...this._config.cards ?? [], e];
      this._pickingNewCard = !1, this._editingCardIdx = i.length - 1, this._emitConfig({ ...this._config, cards: i });
    }, this._onChildCardChanged = (t) => {
      if (t.stopPropagation(), !this._config || this._editingCardIdx === null || !t.detail?.config) return;
      const e = [...this._config.cards ?? []];
      e[this._editingCardIdx] = t.detail.config, this._emitConfig({ ...this._config, cards: e });
    }, this._computeLabel = (t) => ({
      hash: "Percorso / #hash del Pop-up",
      entity: "Entità header (pulsante a destra e titolo automatico)",
      name: "Titolo personalizzato (vuoto = nome entità)",
      icon: "Icona personalizzata pulsante header",
      use_entity_icon: "Usa icona nativa entità",
      show_header_button: "Mostra pulsante azione a destra",
      show_state: "Mostra stato sotto il titolo"
    })[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = {
      show_header_button: !0,
      show_state: !0,
      ...t,
      hash: t.hash || "#popup"
    };
  }
  connectedCallback() {
    super.connectedCallback(), Ne();
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  _moveCard(t, e) {
    if (!this._config) return;
    const i = [...this._config.cards ?? []], s = t + e;
    if (s < 0 || s >= i.length) return;
    const [r] = i.splice(t, 1);
    i.splice(s, 0, r), this._emitConfig({ ...this._config, cards: i });
  }
  _removeCard(t) {
    if (!this._config) return;
    const e = (this._config.cards ?? []).filter((i, s) => s !== t);
    this._emitConfig({ ...this._config, cards: e });
  }
  render() {
    if (!this.hass || !this._config) return h;
    if (this._pickingNewCard)
      return l`
        <div class="sub-editor">
          <div class="sub-header">
            <button
              type="button"
              class="back-btn"
              @click=${() => this._pickingNewCard = !1}
            >
              ← Indietro
            </button>
            <span>Aggiungi card al Pop-up</span>
          </div>
          <hui-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this._onCardPicked}
          ></hui-card-picker>
        </div>
      `;
    if (this._editingCardIdx !== null) {
      const i = this._config.cards?.[this._editingCardIdx];
      if (i)
        return l`
          <div class="sub-editor">
            <div class="sub-header">
              <button
                type="button"
                class="back-btn"
                @click=${() => this._editingCardIdx = null}
              >
                ← Indietro
              </button>
              <span>Modifica card (${i.type})</span>
            </div>
            <hui-card-element-editor
              .hass=${this.hass}
              .lovelace=${this.lovelace}
              .value=${i}
              @config-changed=${this._onChildCardChanged}
            ></hui-card-element-editor>
          </div>
        `;
      this._editingCardIdx = null;
    }
    const t = [
      {
        name: "hash",
        required: !0,
        selector: { navigation: {} }
      },
      {
        name: "entity",
        selector: { entity: {} }
      },
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Header (Titolo e Pulsante)",
        schema: [
          {
            name: "name",
            selector: { entity_name: {} },
            context: { entity: "entity" }
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "icon", selector: { icon: {} } },
              { name: "use_entity_icon", selector: { boolean: {} } }
            ]
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "show_header_button", selector: { boolean: {} } },
              { name: "show_state", selector: { boolean: {} } }
            ]
          }
        ]
      }
    ], e = this._config.cards ?? [];
    return l`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${t}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <div class="cards-section">
          <div class="cards-section-title">Card nel Pop-up (${e.length})</div>

          ${e.length > 0 ? l`
                <div class="cards-list">
                  ${e.map((i, s) => {
      const r = typeof i.name == "string" && i.name || typeof i.title == "string" && i.title || typeof i.entity == "string" && i.entity || i.type;
      return l`
                      <div class="card-row">
                        <button
                          type="button"
                          class="card-row-main"
                          @click=${async () => {
        await Ne(), this._editingCardIdx = s;
      }}
                        >
                          <span class="card-row-name">${r}</span>
                          <span class="card-row-type">${i.type}</span>
                        </button>
                        <div class="card-row-actions">
                          <button
                            type="button"
                            class="mini-btn"
                            title="Sposta su"
                            ?disabled=${s === 0}
                            @click=${() => this._moveCard(s, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            class="mini-btn"
                            title="Sposta giù"
                            ?disabled=${s === e.length - 1}
                            @click=${() => this._moveCard(s, 1)}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            class="mini-btn danger"
                            title="Rimuovi"
                            @click=${() => this._removeCard(s)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    `;
    })}
                </div>
              ` : l`
                <div class="cards-hint">
                  Consigliato: inserisci questa card come prima card di una <strong>Sezione</strong>
                  di Home Assistant (o di un Vertical Stack) per aggiungere, spostare e ridimensionare
                  le card nativamente dalla dashboard, oppure aggiungile direttamente qui sotto.
                </div>
              `}

          <button
            type="button"
            class="add-card-pill"
            @click=${async () => {
      await Ne(), this._pickingNewCard = !0;
    }}
          >
            <span class="add-plus">+</span>
            <span>Add card</span>
          </button>
        </div>
      </div>
    `;
  }
};
mt.styles = I`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cards-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .cards-section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #e3e2e6);
    }

    .cards-hint {
      font-size: 12.5px;
      line-height: 1.45;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 14px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    }

    .card-row-main {
      flex: 1 1 auto;
      min-width: 0;
      border: 0;
      padding: 2px 4px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      cursor: pointer;
    }

    .card-row-name {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color, #e3e2e6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-row-type {
      font-size: 11.5px;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .card-row-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .mini-btn {
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    .mini-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .mini-btn.danger {
      color: var(--error-color, #f2b8b5);
    }

    /* Native HA-inspired dashed pill "+ Add card" button */
    .add-card-pill {
      width: 100%;
      height: 52px;
      border-radius: 9999px;
      border: 2px dashed var(--divider-color, rgba(255, 255, 255, 0.28));
      background: color-mix(in srgb, var(--primary-color, #a8c7fa) 6%, transparent);
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 14.5px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition:
        border-color 180ms ease,
        background-color 180ms ease;
    }

    .add-card-pill:hover {
      border-color: var(--primary-color, #a8c7fa);
      background: color-mix(in srgb, var(--primary-color, #a8c7fa) 12%, transparent);
    }

    .add-plus {
      font-size: 20px;
      line-height: 1;
    }

    .sub-editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sub-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      font-size: 14.5px;
      font-weight: 600;
    }

    .back-btn {
      height: 34px;
      padding: 0 12px;
      border: 0;
      border-radius: 9999px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
  `;
Wt([
  P({ attribute: !1 })
], mt.prototype, "hass", 2);
Wt([
  P({ attribute: !1 })
], mt.prototype, "lovelace", 2);
Wt([
  v()
], mt.prototype, "_config", 2);
Wt([
  v()
], mt.prototype, "_editingCardIdx", 2);
Wt([
  v()
], mt.prototype, "_pickingNewCard", 2);
mt = Wt([
  z("m3e-popup-card-editor")
], mt);
const Ve = "m3e_popups", Ui = "M3E Pop-ups", it = [];
function Je() {
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
  }
}
function Zi() {
  for (let t = it.length - 1; t >= 0; t--)
    it[t].ref.deref()?.isConnected || it.splice(t, 1);
}
function yr(t, e, i = {}) {
  Zi();
  const s = ot(e), r = it.findIndex((o) => o.ref.deref() === t);
  if (!s || !t.isConnected) {
    r !== -1 && it.splice(r, 1);
    return;
  }
  const a = {
    ref: new WeakRef(t),
    hash: s,
    path: Je(),
    name: i.name?.trim() || void 0,
    icon: i.icon?.trim() || void 0
  };
  r !== -1 ? it[r] = a : it.push(a);
}
function xr(t) {
  const e = it.findIndex((i) => i.ref.deref() === t);
  e !== -1 && it.splice(e, 1);
}
function ye(t, e) {
  if (!t || typeof t != "object") return;
  if (Array.isArray(t)) {
    for (const s of t) ye(s, e);
    return;
  }
  const i = t;
  if (i.type === "custom:m3e-popup-card" && typeof i.hash == "string") {
    const s = ot(i.hash);
    s && e.push({
      hash: s,
      name: typeof i.name == "string" ? i.name.trim() : void 0,
      icon: typeof i.icon == "string" ? i.icon.trim() : void 0
    });
  }
  Array.isArray(i.cards) && ye(i.cards, e), Array.isArray(i.sections) && ye(i.sections, e);
}
function wr() {
  const t = [];
  try {
    const o = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("ha-panel-lovelace")?.shadowRoot?.querySelector("hui-root")?.lovelace?.config?.views;
    if (!Array.isArray(o) || o.length === 0) return t;
    const n = Je().split("/").filter(Boolean), c = n[n.length - 1] ?? "", p = o.find((d, g) => String(d.path ?? g) === c) ?? o[Number(c)] ?? o[0];
    p && ye(p, t);
  } catch {
  }
  return t;
}
function $r(t, e) {
  const i = typeof e == "string" ? e.trim().toLowerCase() : "";
  return i ? t.filter(
    (s) => [s.id, s.primary, s.secondary].some((r) => (r || "").toLowerCase().includes(i))
  ) : t;
}
function kr() {
  Zi();
  const t = Je(), e = /* @__PURE__ */ new Map();
  for (const a of it)
    a.path === t && a.ref.deref()?.isConnected && !e.has(a.hash) && e.set(a.hash, a);
  const i = [], s = /* @__PURE__ */ new Set(), r = (a, o) => {
    if (!a || s.has(a)) return;
    s.add(a);
    const n = o?.name?.trim();
    i.push({
      id: a,
      primary: n || a,
      secondary: n ? a : "M3E Pop-up",
      icon: o?.icon || "mdi:pound",
      sorting_label: `zzz_m3e_popup_${a}`
    });
  };
  for (const a of wr())
    r(a.hash, e.get(a.hash) ?? a);
  for (const [a, o] of e.entries())
    r(a, o);
  return i;
}
function Fe(t) {
  if (!t?._navigationItems) return;
  const e = kr();
  typeof t._sortBySortingLabel == "function" && e.sort((o, n) => t._sortBySortingLabel(o, n));
  const i = new Set((t.__m3ePopUpItems ?? []).map((o) => o.id)), s = t._navigationItems.filter((o) => !i.has(o?.id)), r = new Set(s.map((o) => o?.id)), a = e.filter((o) => !r.has(o.id));
  t.__m3ePopUpItems = a, t._navigationItems = [...s, ...a];
}
function Cr(t) {
  const e = t.renderRoot?.querySelector("ha-generic-picker");
  if (!e) return;
  const i = (t.__m3ePopUpItems?.length ?? 0) > 0, s = Array.isArray(e.sections) ? e.sections : [], r = s.filter((a) => a?.id !== Ve);
  i ? e.sections = [
    ...r,
    { id: Ve, label: Ui }
  ] : r.length !== s.length && (e.sections = r);
}
function yi(t) {
  if (t.__m3eGetItemsPatched) return;
  const e = t._getItems;
  typeof e == "function" && (t._getItems = function(i, s) {
    Fe(t);
    const r = $r(t.__m3ePopUpItems ?? [], i);
    if (s === Ve) return r;
    const a = e.call(t, i, s);
    return s || r.length === 0 ? a : [...a, Ui, ...r];
  }, t.__m3eGetItemsPatched = !0);
}
function xi() {
  const e = customElements.get("ha-navigation-picker")?.prototype;
  if (!e || typeof e._loadNavigationItems != "function") return !1;
  if (e.__m3ePatched) return !0;
  const i = e._loadNavigationItems, s = e.updated;
  return e._loadNavigationItems = async function(...r) {
    await i.apply(this, r), yi(this), Fe(this);
  }, e.updated = function(r) {
    s?.call(this, r);
    try {
      yi(this), Fe(this), Cr(this);
    } catch {
    }
  }, e.__m3ePatched = !0, !0;
}
function Sr() {
  typeof window > "u" || window.__m3eNavPickerBridgeInit || (window.__m3eNavPickerBridgeInit = !0, xi() || customElements.whenDefined("ha-navigation-picker").then(() => {
    xi();
  }).catch(() => {
  }));
}
var Er = Object.defineProperty, Pr = Object.getOwnPropertyDescriptor, rt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Pr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Er(e, i, r), r;
};
const Mr = /* @__PURE__ */ new Set([
  "on",
  "open",
  "opening",
  "unlocked",
  "playing",
  "heat",
  "heating",
  "cool",
  "cooling",
  "home",
  "active",
  "true"
]);
let Y = class extends A {
  constructor() {
    super(...arguments), this._isOpen = !1, this._isEditMode = !1, this._isSectionGrid = !1, this._registeredTarget = "", this._cardElements = [], this._lastCardsJson = "", this._adoptedSiblings = [], this._hiddenSiblings = [], this._onLocationChange = () => {
      this._checkEditMode(), this._checkTriggerMatch();
    }, this._onPopupOpenEvent = (t) => {
      const e = ot(t.detail?.target), i = ot(this._config?.hash);
      e && i && e === i && this.openPopup();
    };
  }
  static getStubConfig() {
    return {
      type: "custom:m3e-popup-card",
      hash: "#popup",
      name: "Pop-up",
      show_header_button: !0,
      show_state: !0
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-popup-card-editor");
  }
  setConfig(t) {
    if (!t)
      throw new Error("m3e-popup-card: invalid configuration");
    this._config = {
      show_header_button: !0,
      show_state: !0,
      ...t,
      hash: t.hash || "#popup"
    }, this._syncRegistration();
  }
  getCardSize() {
    return this._isEditMode ? 1 : 0;
  }
  getGridOptions() {
    return this._isEditMode ? { columns: 12, min_columns: 6, rows: 1 } : { columns: 12, rows: 0 };
  }
  connectedCallback() {
    super.connectedCallback(), this._syncRegistration(), this._checkEditMode(), window.addEventListener("hashchange", this._onLocationChange), window.addEventListener("popstate", this._onLocationChange), window.addEventListener("location-changed", this._onLocationChange), window.addEventListener("m3e-popup-open", this._onPopupOpenEvent), requestAnimationFrame(() => {
      this._checkEditMode(), this._syncContainerLayout(), this._checkTriggerMatch();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), mi(this._registeredTarget), xr(this), this._registeredTarget = "", this._restoreAdoptedSiblings(), this._restoreContainerStyles(), window.removeEventListener("hashchange", this._onLocationChange), window.removeEventListener("popstate", this._onLocationChange), window.removeEventListener("location-changed", this._onLocationChange), window.removeEventListener("m3e-popup-open", this._onPopupOpenEvent);
  }
  _syncRegistration() {
    const t = ot(this._config?.hash);
    t !== this._registeredTarget && (mi(this._registeredTarget), this._registeredTarget = Es(t));
    const e = dt(this.hass, this._entity, this._config?.name);
    yr(this, this._config?.hash, {
      name: e || void 0,
      icon: this._config?.icon
    });
  }
  _checkEditMode() {
    const t = window.location.search.includes("edit=1");
    let e = !1, i = this;
    for (; i; ) {
      if (i instanceof HTMLElement) {
        const r = i.tagName.toLowerCase();
        if (r === "hui-card-preview" || r === "hui-dialog-edit-card" || r === "hui-card-edit-mode" || i.classList.contains("edit-mode")) {
          e = !0;
          break;
        }
      }
      i = i.parentNode ?? (i instanceof ShadowRoot ? i.host : null);
    }
    const s = t || e;
    s !== this._isEditMode && (this._isEditMode = s, s ? (this._isOpen && this.closePopup(!1), this._restoreAdoptedSiblings(), this._restoreContainerStyles()) : this._syncContainerLayout());
  }
  /**
   * Detects whether this card is the first card of either:
   * - a native Home Assistant Section (`hui-grid-section` / `hui-section`)
   * - a native Home Assistant `vertical-stack` (`hui-vertical-stack-card`)
   */
  _findEnclosingContainer() {
    let t = this.parentElement;
    for (; t && t.parentElement; ) {
      const e = t.parentElement, i = e.getRootNode();
      if (i instanceof ShadowRoot && i.host) {
        const s = i.host.tagName.toLowerCase();
        if (s === "hui-grid-section") {
          if (e.firstElementChild === t) {
            let r;
            const a = i.host, o = a.getRootNode();
            return o instanceof ShadowRoot && o.host?.tagName.toLowerCase() === "hui-section" ? r = o.host : r = a, { kind: "section", container: e, cardWrapper: t, outerSection: r };
          }
          return null;
        }
        if (s === "hui-vertical-stack-card")
          return e.firstElementChild === t ? { kind: "stack", container: e, cardWrapper: t } : null;
      }
      t = e;
    }
    return null;
  }
  _syncContainerLayout() {
    const t = this._findEnclosingContainer();
    if (this._isSectionGrid = t?.kind === "section", this._isEditMode || this._isOpen || !t) {
      this._restoreContainerStyles();
      return;
    }
    const e = Array.from(t.container.children).filter(
      (i) => i !== t.cardWrapper
    );
    this._hiddenSiblings = e;
    for (const i of e)
      i.style.display = "none";
    t.outerSection && (this._collapsedSection = t.outerSection, t.outerSection.style.position = "fixed", t.outerSection.style.width = "0", t.outerSection.style.height = "0", t.outerSection.style.overflow = "visible", t.outerSection.style.margin = "0", t.outerSection.style.padding = "0", t.outerSection.style.pointerEvents = "none");
  }
  _restoreContainerStyles() {
    for (const t of this._hiddenSiblings)
      t.style.display = "";
    this._hiddenSiblings = [], this._collapsedSection && (this._collapsedSection.style.position = "", this._collapsedSection.style.width = "", this._collapsedSection.style.height = "", this._collapsedSection.style.overflow = "", this._collapsedSection.style.margin = "", this._collapsedSection.style.padding = "", this._collapsedSection.style.pointerEvents = "", this._collapsedSection = void 0);
  }
  _adoptContainerSiblings() {
    if (this._adoptedSiblings.length > 0 || !this._stackPortalEl) return;
    const t = this._findEnclosingContainer();
    if (!t) return;
    this._isSectionGrid = t.kind === "section";
    const e = Array.from(t.container.children).filter(
      (i) => i !== t.cardWrapper
    );
    for (const i of e) {
      const s = i.style.gridColumn;
      if (this._adoptedSiblings.push({
        el: i,
        parent: t.container,
        nextSibling: i.nextSibling,
        prevGridColumn: s
      }), i.style.display = "", t.kind === "section") {
        const r = getComputedStyle(i).getPropertyValue("--column-size").trim();
        r && !i.style.gridColumn && (i.style.gridColumn = `span ${r}`);
      }
      this._stackPortalEl.appendChild(i);
    }
  }
  _restoreAdoptedSiblings() {
    if (this._adoptedSiblings.length !== 0) {
      for (const t of this._adoptedSiblings)
        t.el.style.gridColumn = t.prevGridColumn, t.nextSibling && t.nextSibling.parentNode === t.parent ? t.parent.insertBefore(t.el, t.nextSibling) : t.parent.appendChild(t.el);
      this._adoptedSiblings = [];
    }
  }
  _checkTriggerMatch() {
    if (this._isEditMode) return;
    const t = ot(this._config?.hash);
    if (!t) return;
    const e = window.location.hash.trim().toLowerCase(), i = window.location.pathname.trim().toLowerCase(), s = `${i}${e}`, r = t.startsWith("#") && e === t || t.startsWith("/") && (i === t || s === t);
    r && !this._isOpen ? this.openPopup() : !r && this._isOpen && t.startsWith("#") && this.closePopup(!1);
  }
  async openPopup() {
    if (this._isOpen) return;
    this._isOpen = !0, await this.updateComplete, await this._syncEmbeddedCards(), this._adoptContainerSiblings();
    const t = this._dialogEl;
    t && !t.open && t.showModal(), this._surfaceEl && yt(this._surfaceEl);
  }
  closePopup(t = !0) {
    if (!this._isOpen) return;
    const e = () => {
      if (this._dialogEl?.open && this._dialogEl.close(), this._restoreAdoptedSiblings(), this._isOpen = !1, this._syncContainerLayout(), t) {
        const i = ot(this._config?.hash);
        i.startsWith("#") && window.location.hash.trim().toLowerCase() === i && window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    this._dialogEl && this._surfaceEl ? xt(this._dialogEl, this._surfaceEl, e) : e();
  }
  async _syncEmbeddedCards() {
    const t = this._config?.cards ?? [];
    if (t.length === 0) return;
    const e = JSON.stringify(t);
    if (e !== this._lastCardsJson) {
      this._lastCardsJson = e;
      const i = await window.loadCardHelpers?.(), s = [];
      for (const r of t)
        try {
          let a = null;
          if (i?.createCardElement)
            a = await i.createCardElement(r);
          else if (r.type?.startsWith("custom:")) {
            const o = r.type.slice(7);
            a = document.createElement(o), a.setConfig?.(r);
          }
          a && (this.hass && (a.hass = this.hass), s.push(a));
        } catch {
        }
      this._cardElements = s;
    }
    if (this._cardsHostEl) {
      const i = Array.from(this._cardsHostEl.children);
      i.length === this._cardElements.length && i.every((r, a) => r === this._cardElements[a]) || this._cardsHostEl.replaceChildren(...this._cardElements);
    }
    if (this.hass)
      for (const i of this._cardElements)
        i.hass = this.hass;
  }
  updated(t) {
    (t.has("_config") || t.has("hass")) && this._syncRegistration(), this._isOpen && (t.has("hass") || t.has("_config") || t.has("_isOpen")) && this._syncEmbeddedCards();
  }
  get _entity() {
    if (!(!this.hass || !this._config?.entity))
      return this.hass.states[this._config.entity];
  }
  get _isEntityActive() {
    const t = String(this._entity?.state ?? "").toLowerCase();
    return Mr.has(t);
  }
  _onHeaderActionClick() {
    if (!this.hass || !this._config?.entity) return;
    const t = this._config.entity, e = t.split(".")[0];
    if (navigator.vibrate?.(10), e === "button" || e === "input_button") {
      this.hass.callService(e, "press", { entity_id: t });
      return;
    }
    if (e === "script" || e === "scene") {
      this.hass.callService(e, "turn_on", { entity_id: t });
      return;
    }
    if (e === "lock") {
      const i = this._entity?.state === "locked";
      this.hass.callService("lock", i ? "unlock" : "lock", { entity_id: t });
      return;
    }
    if ([
      "light",
      "switch",
      "fan",
      "input_boolean",
      "cover",
      "media_player",
      "climate",
      "remote",
      "humidifier"
    ].includes(e)) {
      this.hass.callService(e, "toggle", { entity_id: t });
      return;
    }
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: t }
      })
    );
  }
  _renderHeaderIcon() {
    const t = this._entity, e = this._config?.icon?.trim();
    if (e && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${e}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      if (t.attributes.icon && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${t.attributes.icon}></ha-icon>`;
    }
    return Tt(t, this._isEntityActive);
  }
  _renderHeaderBar(t) {
    const e = this._entity, i = this._isEntityActive, s = dt(this.hass, e, this._config?.name) || this._config?.hash || "Pop-up", r = !!this._config?.entity && this._config?.show_header_button !== !1, o = !!e && this._config?.show_state !== !1 && e ? this.hass && typeof this.hass.formatEntityState == "function" ? this.hass.formatEntityState(e) : String(e.state ?? "") : "";
    return l`
      <header class="dialog-header ${t ? "is-preview" : ""}">
        <!-- Close (X) ALWAYS on the left per M3E guidelines -->
        <button
          type="button"
          class="close-btn"
          aria-label="Chiudi"
          @click=${() => t ? void this.openPopup() : this.closePopup(!0)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
            />
          </svg>
        </button>

        <div class="dialog-title-wrap">
          <span class="dialog-title">${s}</span>
          ${o || t ? l`
                <span class="dialog-sub">
                  ${o}${o && t ? " · " : ""}${t ? this._config?.hash || "#popup" : ""}
                </span>
              ` : h}
        </div>

        <!-- Optional Entity Action Button ALWAYS on the right -->
        ${r ? l`
              <button
                type="button"
                class="header-action-btn ${i ? "is-active" : ""}"
                aria-label=${s}
                aria-pressed=${String(i)}
                @click=${() => this._onHeaderActionClick()}
              >
                ${this._renderHeaderIcon()}
              </button>
            ` : h}
      </header>
    `;
  }
  render() {
    return this._config ? l`
      ${this._isEditMode ? l`<div class="edit-header-host">${this._renderHeaderBar(!0)}</div>` : h}

      <dialog
        class="m3e-popup-dialog"
        @click=${(t) => {
      t.target === this._dialogEl && this.closePopup(!0);
    }}
        @cancel=${(t) => {
      t.preventDefault(), this.closePopup(!0);
    }}
        @touchmove=${bt}
      >
        <div class="dialog-surface">
          ${this._renderHeaderBar(!1)}

          <div class="popup-body">
            <div class="cards-host"></div>
            <div class="stack-portal ${this._isSectionGrid ? "is-section-grid" : ""}"></div>
          </div>
        </div>
      </dialog>
    ` : h;
  }
};
Y.styles = [
  U,
  I`
      :host {
        display: block;
        height: auto;
      }

      /* Clean native header preview in Dashboard Edit Mode (fits 1 HA Section row = 56px cleanly) */
      .edit-header-host {
        display: flex;
        align-items: center;
        min-height: 56px;
        height: 100%;
        padding: 4px 6px;
        box-sizing: border-box;
      }

      .edit-header-host .dialog-header {
        width: 100%;
      }

      /* Unified M3E Popup Dialog Shell (matches Status Card & Light Group compact popup) */
      dialog.m3e-popup-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        width: min(460px, calc(100vw - 24px));
        max-width: min(460px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        overscroll-behavior: contain;
        pointer-events: auto;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.m3e-popup-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
        transition: opacity 220ms ease;
      }

      dialog.m3e-popup-dialog.is-closing::backdrop {
        opacity: 0;
      }

      .dialog-surface {
        position: relative;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.m3e-popup-dialog {
          margin: auto 0 0 0;
          width: 100vw;
          max-width: 100vw;
          max-height: 92dvh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 92dvh;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .close-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .close-btn:active {
        transform: scale(0.92);
      }

      .close-btn svg {
        width: 22px;
        height: 22px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-sub {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-action-btn {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .header-action-btn.is-active {
        border-radius: 14px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .header-action-btn:active {
        transform: scale(0.92);
      }

      .header-action-btn svg,
      .header-action-btn ha-icon,
      .header-action-btn ha-state-icon {
        width: 21px;
        height: 21px;
        --mdc-icon-size: 21px;
      }

      /* Popup Body: unified elevated surface tokens for all child cards */
      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      .cards-host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .stack-portal {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Preserve native Home Assistant 12-column Sections grid & card resize spans */
      .stack-portal.is-section-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 10px;
        align-items: stretch;
      }

      .stack-portal.is-section-grid > * {
        grid-column: span var(--column-size, 12);
      }

      .cards-host:empty,
      .stack-portal:empty {
        display: none;
      }
    `
];
rt([
  P({ attribute: !1 })
], Y.prototype, "hass", 2);
rt([
  v()
], Y.prototype, "_config", 2);
rt([
  v()
], Y.prototype, "_isOpen", 2);
rt([
  v()
], Y.prototype, "_isEditMode", 2);
rt([
  v()
], Y.prototype, "_isSectionGrid", 2);
rt([
  T("dialog.m3e-popup-dialog")
], Y.prototype, "_dialogEl", 2);
rt([
  T(".dialog-surface")
], Y.prototype, "_surfaceEl", 2);
rt([
  T(".cards-host")
], Y.prototype, "_cardsHostEl", 2);
rt([
  T(".stack-portal")
], Y.prototype, "_stackPortalEl", 2);
Y = rt([
  z("m3e-popup-card")
], Y);
var Tr = Object.defineProperty, Ar = Object.getOwnPropertyDescriptor, Oe = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ar(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Tr(e, i, r), r;
};
const Or = [
  { value: "player", label: "Azione Player / Remote" },
  { value: "entity", label: "Entità / Script / Switch" },
  { value: "remote_command", label: "Comando Remote custom" },
  { value: "source", label: "Sorgente / App (Source)" }
], Ir = [
  { value: "mute", label: "Mute" },
  { value: "unmute", label: "Unmute" },
  { value: "power_on", label: "Accendi (Power On)" },
  { value: "power_off", label: "Spegni (Power Off)" },
  { value: "play", label: "Play" },
  { value: "pause", label: "Pause" },
  { value: "prev", label: "Precedente" },
  { value: "next", label: "Successivo" },
  { value: "volume_up", label: "Volume +" },
  { value: "volume_down", label: "Volume −" },
  { value: "ch_up", label: "Canale +" },
  { value: "ch_down", label: "Canale −" },
  { value: "back", label: "Indietro (Back)" },
  { value: "home", label: "Home" },
  { value: "assist", label: "Assist / Ricerca" },
  { value: "dpad_center", label: "OK / Seleziona" }
], Lr = [
  { value: "auto", label: "Automatico (toggle / press / script)" },
  { value: "toggle", label: "Toggle" },
  { value: "turn_on", label: "Turn On" },
  { value: "turn_off", label: "Turn Off" },
  { value: "select_option", label: "Select Option (input_select)" }
];
function wi(t) {
  const e = t.action_type || "entity", i = [
    {
      type: "grid",
      name: "",
      schema: [
        { name: "label", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } }
      ]
    },
    {
      name: "action_type",
      selector: {
        select: { mode: "dropdown", options: Or }
      }
    }
  ];
  return e === "player" ? i.push({
    name: "player_action",
    selector: {
      select: { mode: "dropdown", options: Ir }
    }
  }) : e === "entity" ? i.push(
    { name: "entity", selector: { entity: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        {
          name: "entity_action",
          selector: {
            select: { mode: "dropdown", options: Lr }
          }
        },
        { name: "value", selector: { text: {} } }
      ]
    }
  ) : e === "remote_command" ? i.push({
    type: "grid",
    name: "",
    schema: [
      { name: "command", selector: { text: {} } },
      { name: "device", selector: { text: {} } }
    ]
  }) : e === "source" && i.push({ name: "value", selector: { text: {} } }), i;
}
let Vt = class extends A {
  constructor() {
    super(...arguments), this.controls = [], this._expandedIdx = null, this._computeLabel = (t) => ({
      label: "Etichetta",
      icon: "Icona (opzionale)",
      action_type: "Tipo azione",
      player_action: "Azione Player / Remote",
      entity: "Entità / Script",
      entity_action: "Servizio entità",
      value: "Valore (Sorgente / Opzione)",
      command: "Comando Remote (es. NETFLIX, KEY_HDMI)",
      device: "Device ID (opzionale)",
      state_entity: "Entità stato attivo (opzionale)",
      active_state: "Stato attivo (es. on, off, Cinema)",
      selector_attribute: "Lista opzioni"
    })[t.name] ?? t.name;
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent("controls-changed", {
        bubbles: !0,
        composed: !0,
        detail: { controls: t }
      })
    );
  }
  _addButton() {
    const t = [
      ...this.controls,
      {
        type: "button",
        label: "Nuovo pulsante",
        action_type: "entity",
        entity_action: "auto"
      }
    ];
    this._expandedIdx = t.length - 1, this._emit(t);
  }
  _addSegmented() {
    const t = [
      ...this.controls,
      {
        type: "segmented",
        segments: [
          { label: "Opzione 1", action_type: "entity", entity_action: "turn_on", active_state: "on" },
          { label: "Opzione 2", action_type: "entity", entity_action: "turn_off", active_state: "off" }
        ]
      }
    ];
    this._expandedIdx = t.length - 1, this._emit(t);
  }
  _addSelector() {
    const t = [
      ...this.controls,
      {
        type: "selector",
        label: "Selettore",
        selector_attribute: "auto"
      }
    ];
    this._expandedIdx = t.length - 1, this._emit(t);
  }
  _removeControl(t) {
    const e = this.controls.filter((i, s) => s !== t);
    this._expandedIdx === t ? this._expandedIdx = null : this._expandedIdx !== null && this._expandedIdx > t && this._expandedIdx--, this._emit(e);
  }
  _moveControl(t, e) {
    const i = t + e;
    if (i < 0 || i >= this.controls.length) return;
    const s = [...this.controls], [r] = s.splice(t, 1);
    s.splice(i, 0, r), this._expandedIdx === t && (this._expandedIdx = i), this._emit(s);
  }
  _updateControl(t, e) {
    const i = this.controls.map((s, r) => r === t ? { ...s, ...e } : s);
    this._emit(i);
  }
  _updateSegment(t, e, i) {
    const r = [...this.controls[t].segments ?? []];
    r[e] = { ...r[e], ...i }, this._updateControl(t, { segments: r });
  }
  _addSegment(t) {
    const i = [...this.controls[t].segments ?? []];
    i.length >= 4 || (i.push({
      label: `Opzione ${i.length + 1}`,
      action_type: "entity",
      entity_action: "auto"
    }), this._updateControl(t, { segments: i }));
  }
  _removeSegment(t, e) {
    const s = (this.controls[t].segments ?? []).filter((r, a) => a !== e);
    s.length < 2 || this._updateControl(t, { segments: s });
  }
  render() {
    return this.hass ? l`
      <div class="custom-editor-root">
        <div class="toolbar">
          <button type="button" class="add-btn" @click=${() => this._addButton()}>
            + Pulsante
          </button>
          <button type="button" class="add-btn" @click=${() => this._addSegmented()}>
            + Pillola segmentata
          </button>
          <button type="button" class="add-btn" @click=${() => this._addSelector()}>
            + Selettore
          </button>
        </div>

        ${this.controls.length === 0 ? l`
              <div class="empty-hint">
                Nessun controllo personalizzato. Aggiungi pulsanti nativi o pillole segmentate per
                azioni del player, script, entità o comandi remote.
              </div>
            ` : this.controls.map((t, e) => {
      const i = this._expandedIdx === e, s = t.type === "segmented" ? `Pillola: ${(t.segments ?? []).map((r) => r.label || "…").join(" | ")}` : t.type === "selector" ? `Selettore: ${t.label || t.entity || "Senza nome"}` : `Pulsante: ${t.label || t.command || t.player_action || "Senza nome"}`;
      return l`
                <div class="ctrl-card">
                  <div class="ctrl-head" @click=${() => this._expandedIdx = i ? null : e}>
                    <span class="ctrl-title">${s}</span>
                    <div class="ctrl-actions" @click=${(r) => r.stopPropagation()}>
                      <button
                        type="button"
                        class="mini-btn"
                        title="Sposta su"
                        ?disabled=${e === 0}
                        @click=${() => this._moveControl(e, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        class="mini-btn"
                        title="Sposta giù"
                        ?disabled=${e === this.controls.length - 1}
                        @click=${() => this._moveControl(e, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        class="mini-btn danger"
                        title="Elimina"
                        @click=${() => this._removeControl(e)}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  ${i ? t.type === "button" ? l`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${t}
                              .schema=${[
        ...wi(t),
        {
          type: "grid",
          name: "",
          schema: [
            { name: "state_entity", selector: { entity: {} } },
            { name: "active_state", selector: { text: {} } }
          ]
        }
      ]}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(r) => {
        r.stopPropagation(), this._updateControl(e, r.detail.value);
      }}
                            ></ha-form>
                          </div>
                        ` : t.type === "selector" ? l`
                            <div class="ctrl-body">
                              <ha-form
                                .hass=${this.hass}
                                .data=${t}
                                .schema=${[
        {
          type: "grid",
          name: "",
          schema: [
            { name: "label", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } }
          ]
        },
        {
          name: "entity",
          selector: {
            entity: { domain: ["input_select", "select", "media_player"] }
          }
        },
        {
          name: "selector_attribute",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: "Automatico (opzioni / sorgenti)" },
                { value: "options", label: "Opzioni (select / input_select)" },
                { value: "source_list", label: "Sorgenti (source_list)" },
                { value: "sound_mode_list", label: "Modalità audio (sound_mode_list)" }
              ]
            }
          }
        }
      ]}
                                .computeLabel=${this._computeLabel}
                                @value-changed=${(r) => {
        r.stopPropagation(), this._updateControl(e, r.detail.value);
      }}
                              ></ha-form>
                            </div>
                          ` : l`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${{ state_entity: t.state_entity ?? "" }}
                              .schema=${[{ name: "state_entity", selector: { entity: {} } }]}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(r) => {
        r.stopPropagation(), this._updateControl(e, {
          state_entity: r.detail.value.state_entity || void 0
        });
      }}
                            ></ha-form>

                            <div class="seg-list">
                              ${(t.segments ?? []).map(
        (r, a) => l`
                                  <div class="seg-card">
                                    <div class="seg-head">
                                      <span>Segmento ${a + 1}</span>
                                      ${(t.segments?.length ?? 0) > 2 ? l`
                                            <button
                                              type="button"
                                              class="mini-btn danger"
                                              @click=${() => this._removeSegment(e, a)}
                                            >
                                              ×
                                            </button>
                                          ` : h}
                                    </div>
                                    <ha-form
                                      .hass=${this.hass}
                                      .data=${r}
                                      .schema=${[
          ...wi(r),
          { name: "active_state", selector: { text: {} } }
        ]}
                                      .computeLabel=${this._computeLabel}
                                      @value-changed=${(o) => {
          o.stopPropagation(), this._updateSegment(e, a, o.detail.value);
        }}
                                    ></ha-form>
                                  </div>
                                `
      )}
                            </div>

                            ${(t.segments?.length ?? 0) < 4 ? l`
                                  <button
                                    type="button"
                                    class="add-btn seg-add"
                                    @click=${() => this._addSegment(e)}
                                  >
                                    + Aggiungi segmento
                                  </button>
                                ` : h}
                          </div>
                        ` : h}
                </div>
              `;
    })}
      </div>
    ` : h;
  }
};
Vt.styles = I`
    :host {
      display: block;
    }

    .custom-editor-root {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toolbar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .add-btn {
      height: 36px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.16));
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }

    .add-btn:hover {
      border-color: var(--primary-color, #a8c7fa);
    }

    .empty-hint {
      font-size: 12.5px;
      color: var(--secondary-text-color, #9aa0a6);
      line-height: 1.4;
    }

    .ctrl-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      overflow: hidden;
      background: var(--card-background-color, transparent);
    }

    .ctrl-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .ctrl-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color, #e3e2e6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ctrl-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .mini-btn {
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    .mini-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .mini-btn.danger {
      color: var(--error-color, #f2b8b5);
    }

    .ctrl-body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .seg-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .seg-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .seg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .seg-add {
      align-self: flex-start;
    }
  `;
Oe([
  P({ attribute: !1 })
], Vt.prototype, "hass", 2);
Oe([
  P({ attribute: !1 })
], Vt.prototype, "controls", 2);
Oe([
  v()
], Vt.prototype, "_expandedIdx", 2);
Vt = Oe([
  z("m3e-remote-custom-controls-editor")
], Vt);
var zr = Object.defineProperty, Dr = Object.getOwnPropertyDescriptor, Qe = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Dr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && zr(e, i, r), r;
};
let ce = class extends A {
  constructor() {
    super(...arguments), this._onValueChanged = (t) => {
      if (!this._config) return;
      const e = { ...this._config, ...t.detail.value };
      this._emitConfig(e);
    }, this._onCustomControlsChanged = (t) => {
      if (!this._config) return;
      const e = {
        ...this._config,
        remote_custom_controls: t.detail.controls
      };
      this._emitConfig(e);
    }, this._computeLabel = (t) => ({
      entity: "Entità TV / Media Player / Remote",
      status_entity: "Entità stato dispositivo (opzionale)",
      name: "Nome",
      icon: "Icona personalizzata",
      use_entity_icon: "Usa icona nativa entità",
      pad_mode: "Modalità Pad direzionale",
      show_touchpad: "Mostra Touchpad / D-Pad",
      show_volume: "Mostra bilanciere Volume + Mute",
      show_essentials: "Mostra 3 tasti essenziali (Back · Home · Assist)",
      show_transport: "Mostra controlli riproduzione (Play / Pause)",
      show_channels: "Mostra selettore Canali (CH −/+)",
      show_source: "Mostra pulsante Sorgenti (Source)",
      show_power: "Mostra pulsante Accensione (Power)",
      remote_device: "Device ID trasmettitore (multi-dispositivo)",
      dpad_up: "Pad Su",
      dpad_down: "Pad Giù",
      dpad_left: "Pad Sinistra",
      dpad_right: "Pad Destra",
      dpad_center: "Pad Selezione / OK",
      back: "Indietro (Back)",
      home: "Home",
      assist: "Assistente / Ricerca",
      volume_up: "Volume +",
      volume_down: "Volume −",
      mute: "Mute",
      unmute: "Unmute",
      power_on: "Accensione (On)",
      power_off: "Spegnimento (Off)",
      play: "Play",
      pause: "Pause",
      prev: "Precedente",
      next: "Successivo",
      ch_up: "Canale +",
      ch_down: "Canale −"
    })[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = {
      pad_mode: "touchpad",
      show_touchpad: !0,
      show_volume: !0,
      show_essentials: !0,
      show_transport: !0,
      show_channels: !1,
      show_source: !0,
      show_power: !0,
      ...t
    };
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: ["media_player", "remote"] } }
      },
      {
        name: "pad_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "touchpad", label: "Touchpad gestuale (stile Google Home)" },
              { value: "dpad", label: "D-Pad a 4 frecce + OK (ideale per mouse)" }
            ]
          }
        }
      },
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Contenuto e Aspetto",
        schema: [
          { name: "name", selector: { text: {} } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "icon", selector: { icon: {} } },
              { name: "use_entity_icon", selector: { boolean: {} } }
            ]
          },
          { name: "status_entity", selector: { entity: {} } }
        ]
      },
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Sezioni Telecomando",
        schema: [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "show_touchpad", selector: { boolean: {} } },
              { name: "show_volume", selector: { boolean: {} } },
              { name: "show_essentials", selector: { boolean: {} } },
              { name: "show_transport", selector: { boolean: {} } },
              { name: "show_channels", selector: { boolean: {} } },
              { name: "show_source", selector: { boolean: {} } },
              { name: "show_power", selector: { boolean: {} } }
            ]
          }
        ]
      },
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Override Comandi Remote (opzionale)",
        schema: [
          { name: "remote_device", selector: { text: {} } },
          {
            type: "expandable",
            title: "Mappatura manuale tasti",
            name: "remote_buttons",
            schema: [
              { name: "dpad_up", selector: { text: {} } },
              { name: "dpad_down", selector: { text: {} } },
              { name: "dpad_left", selector: { text: {} } },
              { name: "dpad_right", selector: { text: {} } },
              { name: "dpad_center", selector: { text: {} } },
              { name: "back", selector: { text: {} } },
              { name: "home", selector: { text: {} } },
              { name: "assist", selector: { text: {} } },
              { name: "volume_up", selector: { text: {} } },
              { name: "volume_down", selector: { text: {} } },
              { name: "mute", selector: { text: {} } },
              { name: "unmute", selector: { text: {} } },
              { name: "power_on", selector: { text: {} } },
              { name: "power_off", selector: { text: {} } },
              { name: "play", selector: { text: {} } },
              { name: "pause", selector: { text: {} } },
              { name: "prev", selector: { text: {} } },
              { name: "next", selector: { text: {} } },
              { name: "ch_up", selector: { text: {} } },
              { name: "ch_down", selector: { text: {} } }
            ]
          }
        ]
      }
    ];
    return l`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${t}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <span slot="header" class="panel-header">
            Pulsanti e Pillole Personalizzate (${this._config.remote_custom_controls?.length ?? 0})
          </span>
          <div class="panel-content">
            <m3e-remote-custom-controls-editor
              .hass=${this.hass}
              .controls=${this._config.remote_custom_controls ?? []}
              @controls-changed=${this._onCustomControlsChanged}
            ></m3e-remote-custom-controls-editor>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
ce.styles = I`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .panel-header {
      font-weight: 500;
      font-size: 14px;
    }

    .panel-content {
      padding: 8px 0 4px;
    }
  `;
Qe([
  P({ attribute: !1 })
], ce.prototype, "hass", 2);
Qe([
  v()
], ce.prototype, "_config", 2);
ce = Qe([
  z("m3e-remote-card-editor")
], ce);
const Hr = {
  androidtv_remote: {
    commands: {
      dpad_up: "DPAD_UP",
      dpad_down: "DPAD_DOWN",
      dpad_left: "DPAD_LEFT",
      dpad_right: "DPAD_RIGHT",
      dpad_center: "DPAD_CENTER",
      back: "BACK",
      home: "HOME",
      assist: "ASSIST",
      volume_up: "VOLUME_UP",
      volume_down: "VOLUME_DOWN",
      mute: "MUTE",
      unmute: "MUTE",
      power_on: "POWER",
      power_off: "POWER",
      play: "MEDIA_PLAY",
      pause: "MEDIA_PAUSE",
      prev: "MEDIA_PREVIOUS",
      next: "MEDIA_NEXT",
      ch_up: "CHANNEL_UP",
      ch_down: "CHANNEL_DOWN"
    }
  },
  androidtv: {
    commands: {
      dpad_up: "UP",
      dpad_down: "DOWN",
      dpad_left: "LEFT",
      dpad_right: "RIGHT",
      dpad_center: "CENTER",
      back: "BACK",
      home: "HOME",
      assist: "SEARCH",
      volume_up: "VOLUME_UP",
      volume_down: "VOLUME_DOWN",
      mute: "MUTE",
      unmute: "MUTE",
      power_on: "POWER",
      power_off: "POWER",
      play: "MEDIA_PLAY",
      pause: "MEDIA_PAUSE",
      prev: "MEDIA_PREVIOUS",
      next: "MEDIA_NEXT",
      ch_up: "CHANNEL_UP",
      ch_down: "CHANNEL_DOWN"
    }
  },
  firetv: {
    commands: {
      dpad_up: "UP",
      dpad_down: "DOWN",
      dpad_left: "LEFT",
      dpad_right: "RIGHT",
      dpad_center: "CENTER",
      back: "BACK",
      home: "HOME",
      assist: "SEARCH",
      volume_up: "VOLUME_UP",
      volume_down: "VOLUME_DOWN",
      mute: "MUTE",
      unmute: "MUTE",
      power_on: "POWER",
      power_off: "POWER",
      play: "MEDIA_PLAY",
      pause: "MEDIA_PAUSE",
      prev: "MEDIA_PREVIOUS",
      next: "MEDIA_NEXT"
    }
  },
  apple_tv: {
    commands: {
      dpad_up: "up",
      dpad_down: "down",
      dpad_left: "left",
      dpad_right: "right",
      dpad_center: "select",
      back: "menu",
      home: "home",
      assist: "top_menu",
      volume_up: "volume_up",
      volume_down: "volume_down",
      power_on: "wakeup",
      power_off: "suspend",
      play: "play",
      pause: "pause",
      prev: "previous",
      next: "next"
    }
  },
  webostv: {
    service: "webostv.button",
    paramKey: "button",
    commands: {
      dpad_up: "UP",
      dpad_down: "DOWN",
      dpad_left: "LEFT",
      dpad_right: "RIGHT",
      dpad_center: "ENTER",
      back: "BACK",
      home: "HOME",
      assist: "MENU",
      volume_up: "VOLUMEUP",
      volume_down: "VOLUMEDOWN",
      mute: "MUTE",
      unmute: "MUTE",
      play: "PLAY",
      pause: "PAUSE",
      prev: "REWIND",
      next: "FASTFORWARD",
      ch_up: "CHANNELUP",
      ch_down: "CHANNELDOWN"
    }
  },
  samsungtv: {
    commands: {
      dpad_up: "KEY_UP",
      dpad_down: "KEY_DOWN",
      dpad_left: "KEY_LEFT",
      dpad_right: "KEY_RIGHT",
      dpad_center: "KEY_ENTER",
      back: "KEY_RETURN",
      home: "KEY_HOME",
      assist: "KEY_MENU",
      volume_up: "KEY_VOLUP",
      volume_down: "KEY_VOLDOWN",
      mute: "KEY_MUTE",
      unmute: "KEY_MUTE",
      power_on: "KEY_POWER",
      power_off: "KEY_POWER",
      play: "KEY_PLAY",
      pause: "KEY_PAUSE",
      prev: "KEY_REWIND",
      next: "KEY_FF",
      ch_up: "KEY_CHUP",
      ch_down: "KEY_CHDOWN"
    }
  },
  samsungtv_smart: {
    commands: {
      dpad_up: "KEY_UP",
      dpad_down: "KEY_DOWN",
      dpad_left: "KEY_LEFT",
      dpad_right: "KEY_RIGHT",
      dpad_center: "KEY_ENTER",
      back: "KEY_RETURN",
      home: "KEY_HOME",
      assist: "KEY_MENU",
      volume_up: "KEY_VOLUP",
      volume_down: "KEY_VOLDOWN",
      mute: "KEY_MUTE",
      unmute: "KEY_MUTE",
      power_on: "KEY_POWER",
      power_off: "KEY_POWER",
      play: "KEY_PLAY",
      pause: "KEY_PAUSE",
      prev: "KEY_REWIND",
      next: "KEY_FF",
      ch_up: "KEY_CHUP",
      ch_down: "KEY_CHDOWN"
    }
  },
  samsungtv_tizen: {
    commands: {
      dpad_up: "KEY_UP",
      dpad_down: "KEY_DOWN",
      dpad_left: "KEY_LEFT",
      dpad_right: "KEY_RIGHT",
      dpad_center: "KEY_ENTER",
      back: "KEY_RETURN",
      home: "KEY_HOME",
      assist: "KEY_MENU",
      volume_up: "KEY_VOLUP",
      volume_down: "KEY_VOLDOWN",
      mute: "KEY_MUTE",
      unmute: "KEY_MUTE",
      power_on: "KEY_POWER",
      power_off: "KEY_POWER",
      play: "KEY_PLAY",
      pause: "KEY_PAUSE",
      prev: "KEY_REWIND",
      next: "KEY_FF",
      ch_up: "KEY_CHUP",
      ch_down: "KEY_CHDOWN"
    }
  },
  braviatv: {
    commands: {
      dpad_up: "Up",
      dpad_down: "Down",
      dpad_left: "Left",
      dpad_right: "Right",
      dpad_center: "Confirm",
      back: "Return",
      home: "Home",
      assist: "GoogleAssistant",
      volume_up: "VolumeUp",
      volume_down: "VolumeDown",
      mute: "Mute",
      unmute: "Mute",
      power_on: "WakeUp",
      power_off: "Sleep",
      play: "Play",
      pause: "Pause",
      prev: "Prev",
      next: "Next",
      ch_up: "ChannelUp",
      ch_down: "ChannelDown"
    }
  },
  roku: {
    commands: {
      dpad_up: "up",
      dpad_down: "down",
      dpad_left: "left",
      dpad_right: "right",
      dpad_center: "select",
      back: "back",
      home: "home",
      assist: "search",
      volume_up: "volume_up",
      volume_down: "volume_down",
      mute: "volume_mute",
      unmute: "volume_mute",
      power_on: "power",
      power_off: "power",
      play: "play",
      pause: "play",
      prev: "rev",
      next: "fwd",
      ch_up: "channel_up",
      ch_down: "channel_down"
    }
  },
  philips_js: {
    commands: {
      dpad_up: "CursorUp",
      dpad_down: "CursorDown",
      dpad_left: "CursorLeft",
      dpad_right: "CursorRight",
      dpad_center: "Confirm",
      back: "Back",
      home: "Home",
      assist: "Search",
      volume_up: "VolumeUp",
      volume_down: "VolumeDown",
      mute: "Mute",
      unmute: "Mute",
      power_on: "Standby",
      power_off: "Standby",
      play: "Play",
      pause: "Pause",
      prev: "Previous",
      next: "Next",
      ch_up: "ChannelStepUp",
      ch_down: "ChannelStepDown"
    }
  },
  panasonic_viera: {
    commands: {
      dpad_up: "NRC_UP-ONOFF",
      dpad_down: "NRC_DOWN-ONOFF",
      dpad_left: "NRC_LEFT-ONOFF",
      dpad_right: "NRC_RIGHT-ONOFF",
      dpad_center: "NRC_ENTER-ONOFF",
      back: "NRC_RETURN-ONOFF",
      home: "NRC_HOME-ONOFF",
      assist: "NRC_MENU-ONOFF",
      volume_up: "NRC_VOLUP-ONOFF",
      volume_down: "NRC_VOLDOWN-ONOFF",
      mute: "NRC_MUTE-ONOFF",
      unmute: "NRC_MUTE-ONOFF",
      power_on: "NRC_POWER-ONOFF",
      power_off: "NRC_POWER-ONOFF",
      play: "NRC_PLAY-ONOFF",
      pause: "NRC_PAUSE-ONOFF",
      prev: "NRC_SKIP_PREV-ONOFF",
      next: "NRC_SKIP_NEXT-ONOFF",
      ch_up: "NRC_CH_UP-ONOFF",
      ch_down: "NRC_CH_DOWN-ONOFF"
    }
  }
}, Rr = {
  pause: 1,
  volume_up: 1024,
  volume_down: 1024,
  mute: 8,
  unmute: 8,
  prev: 16,
  next: 32,
  power_on: 128,
  power_off: 256,
  play: 16384
}, Nr = {
  volume_up: { service: "volume_up" },
  volume_down: { service: "volume_down" },
  mute: { service: "volume_mute", data: { is_volume_muted: !0 } },
  unmute: { service: "volume_mute", data: { is_volume_muted: !1 } },
  power_on: { service: "turn_on" },
  power_off: { service: "turn_off" },
  play: { service: "media_play" },
  pause: { service: "media_pause" },
  prev: { service: "media_previous_track" },
  next: { service: "media_next_track" }
}, Br = {
  dpad_up: "DPAD_UP",
  dpad_down: "DPAD_DOWN",
  dpad_left: "DPAD_LEFT",
  dpad_right: "DPAD_RIGHT",
  dpad_center: "DPAD_CENTER",
  back: "BACK",
  home: "HOME",
  assist: "ASSIST",
  volume_up: "VolumeUp",
  volume_down: "VolumeDown",
  mute: "Mute",
  unmute: "Mute",
  power_on: "PowerOn",
  power_off: "PowerOff",
  play: "Play",
  pause: "Pause",
  prev: "Previous",
  next: "Next",
  ch_up: "ChannelUp",
  ch_down: "ChannelDown"
};
function lt(t, e, i) {
  if (e.startsWith(`${i}.`)) return e;
  const s = t.entities?.[e]?.device_id;
  if (!(!s || !t.entities)) {
    for (const [r, a] of Object.entries(t.entities))
      if (a.device_id === s && r.startsWith(`${i}.`) && t.states[r])
        return r;
  }
}
function Ur(t, e, i) {
  const s = t.entities?.[e]?.device_id;
  if (!s || !t.entities) return;
  const a = {
    dpad_up: ["dpad_up", "nav_up", "_up"],
    dpad_down: ["dpad_down", "nav_down", "_down"],
    dpad_left: ["dpad_left", "nav_left", "_left"],
    dpad_right: ["dpad_right", "nav_right", "_right"],
    dpad_center: ["dpad_center", "select", "enter", "_ok"],
    back: ["back", "return"],
    home: ["home"],
    assist: ["assist", "voice", "search", "menu"],
    volume_up: ["volume_up", "vol_up", "vol+"],
    volume_down: ["volume_down", "vol_down", "vol-"],
    mute: ["mute"],
    unmute: ["unmute", "mute"],
    power_on: ["power_on", "turn_on", "power"],
    power_off: ["power_off", "turn_off", "standby", "power"],
    play: ["play"],
    pause: ["pause"],
    prev: ["previous", "prev", "rewind"],
    next: ["next", "forward"],
    ch_up: ["channel_up", "ch_up", "prog_up"],
    ch_down: ["channel_down", "ch_down", "prog_down"]
  }[i] ?? [];
  for (const [o, n] of Object.entries(t.entities)) {
    if (n.device_id !== s || !o.startsWith("button.")) continue;
    const c = o.toLowerCase();
    if (a.some((p) => c.includes(p))) return o;
  }
}
function ti(t, e, i, s, r) {
  const a = lt(t, e, "remote"), o = lt(t, e, "media_player"), n = o ? t.states[o] : void 0, c = s?.[i]?.trim();
  if (c) {
    if (c.startsWith("button.") || c.startsWith("input_button.")) {
      t.callService(c.split(".")[0], "press", { entity_id: c });
      return;
    }
    if (c.startsWith("script.")) {
      t.callService("script", "turn_on", { entity_id: c });
      return;
    }
    if (c.startsWith("switch.")) {
      t.callService("switch", i === "power_off" ? "turn_off" : "turn_on", {
        entity_id: c
      });
      return;
    }
    const m = a || e;
    if (m.startsWith("remote.")) {
      const f = { entity_id: m, command: c };
      r?.trim() && (f.device = r.trim()), t.callService("remote", "send_command", f);
      return;
    }
  }
  const p = Nr[i];
  if (n && p) {
    const m = Number(n.attributes.supported_features ?? 0), f = Rr[i] ?? 0;
    if (m === 0 || f === 0 || (m & f) !== 0) {
      t.callService("media_player", p.service, {
        entity_id: n.entity_id,
        ...p.data ?? {}
      });
      return;
    }
  }
  const d = ((a ? t.entities?.[a]?.platform : void 0) || (o ? t.entities?.[o]?.platform : void 0) || t.entities?.[e]?.platform || "").toLowerCase(), g = Hr[d];
  if (g) {
    if (g.service === "webostv.button" && o && g.commands[i]) {
      t.callService("webostv", "button", {
        entity_id: o,
        [g.paramKey ?? "button"]: g.commands[i]
      });
      return;
    }
    if (a && (i === "power_on" || i === "power_off") && d === "apple_tv") {
      t.callService("remote", i === "power_on" ? "turn_on" : "turn_off", {
        entity_id: a
      });
      return;
    }
    const m = g.commands[i];
    if (a && m) {
      const f = { entity_id: a, command: m };
      r?.trim() && (f.device = r.trim()), t.callService("remote", "send_command", f);
      return;
    }
  }
  const u = Ur(t, e, i);
  if (u) {
    t.callService("button", "press", { entity_id: u });
    return;
  }
  if (n && (i === "ch_up" || i === "ch_down")) {
    t.callService(
      "media_player",
      i === "ch_up" ? "media_next_track" : "media_previous_track",
      { entity_id: n.entity_id }
    );
    return;
  }
  if (a) {
    if (i === "power_on" || i === "power_off") {
      t.callService("remote", i === "power_on" ? "turn_on" : "turn_off", {
        entity_id: a
      });
      return;
    }
    const m = {
      entity_id: a,
      command: Br[i]
    };
    r?.trim() && (m.device = r.trim()), t.callService("remote", "send_command", m);
  }
}
function $i(t, e, i, s, r) {
  const a = i.action_type || (i.command?.trim() ? "remote_command" : i.entity?.trim() ? "entity" : i.value?.trim() && !i.player_action ? "source" : "player");
  if (a === "player" && i.player_action) {
    ti(
      t,
      e,
      i.player_action,
      s,
      i.device || r
    );
    return;
  }
  if (a === "source" && i.value?.trim()) {
    const o = i.entity?.trim() || lt(t, e, "media_player");
    o && t.callService("media_player", "select_source", {
      entity_id: o,
      source: i.value.trim()
    });
    return;
  }
  if (a === "remote_command" && i.command?.trim()) {
    const o = (i.entity?.trim().startsWith("remote.") ? i.entity.trim() : void 0) || lt(t, e, "remote"), n = lt(t, e, "media_player");
    if (((o ? t.entities?.[o]?.platform : void 0) || (n ? t.entities?.[n]?.platform : void 0) || t.entities?.[e]?.platform || "").toLowerCase() === "webostv" && n) {
      t.callService("webostv", "button", {
        entity_id: n,
        button: i.command.trim()
      });
      return;
    }
    if (o) {
      const p = {
        entity_id: o,
        command: i.command.trim()
      }, d = (i.device || r)?.trim();
      d && (p.device = d), t.callService("remote", "send_command", p);
    }
    return;
  }
  if (a === "entity" && i.entity?.trim()) {
    const o = i.entity.trim(), n = o.split(".")[0], c = i.entity_action || "auto";
    if (n === "button" || n === "input_button") {
      t.callService(n, "press", { entity_id: o });
      return;
    }
    if (n === "script" || n === "scene") {
      t.callService(n, "turn_on", { entity_id: o });
      return;
    }
    if ((n === "input_select" || n === "select") && (c === "select_option" || i.value?.trim())) {
      i.value?.trim() && t.callService(n, "select_option", {
        entity_id: o,
        option: i.value.trim()
      });
      return;
    }
    if (n === "media_player" && i.value?.trim() && c === "auto") {
      t.callService("media_player", "select_source", {
        entity_id: o,
        source: i.value.trim()
      });
      return;
    }
    if (c === "turn_on" || c === "turn_off" || c === "toggle") {
      t.callService(n, c, { entity_id: o });
      return;
    }
    t.callService(n, "toggle", { entity_id: o });
  }
}
function ki(t, e, i, s) {
  const r = i.action_type || (i.command?.trim() ? "remote_command" : i.entity?.trim() ? "entity" : i.value?.trim() && !i.player_action ? "source" : "player");
  if (r === "source" && i.value?.trim()) {
    const c = s?.trim() || i.entity?.trim() || lt(t, e, "media_player"), p = c ? t.states[c] : void 0, d = String(p?.attributes.source ?? "").trim().toLowerCase();
    return d !== "" && d === i.value.trim().toLowerCase();
  }
  if (r === "player" && i.player_action && !s) {
    const c = lt(t, e, "media_player"), p = (c ? t.states[c] : void 0) ?? t.states[e];
    if (!p) return !1;
    const d = String(p.state ?? "").toLowerCase();
    return i.player_action === "mute" ? p.attributes.is_volume_muted === !0 : i.player_action === "unmute" ? p.attributes.is_volume_muted === !1 : i.player_action === "play" ? d === "playing" : i.player_action === "pause" ? d === "paused" : i.player_action === "power_on" ? d !== "" && d !== "off" && d !== "standby" && d !== "unavailable" && d !== "unknown" : i.player_action === "power_off" ? d === "off" || d === "standby" : !1;
  }
  const a = s?.trim() || i.entity?.trim();
  if (!a) return !1;
  const o = t.states[a];
  if (!o) return !1;
  const n = String(o.state ?? "").toLowerCase();
  return n === "unavailable" || n === "unknown" ? !1 : i.active_state?.trim() ? n === i.active_state.trim().toLowerCase() : i.value?.trim() && (a.startsWith("input_select.") || a.startsWith("select.")) ? n === i.value.trim().toLowerCase() : i.entity_action === "turn_off" ? n === "off" || n === "standby" : ["on", "playing", "home", "open", "active", "true"].includes(n);
}
const Zr = l`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
  </svg>
`;
function fe(t) {
  return Array.isArray(t) ? Array.from(new Set(t.map((e) => String(e ?? "").trim()).filter(Boolean))) : [];
}
function Vr(t, e, i) {
  const s = i.entity?.trim() || lt(t, e, "media_player") || e, r = s ? t.states[s] : void 0, a = s.split(".")[0], o = i.label?.trim() || String(r?.attributes.friendly_name ?? "").trim() || s;
  if (!r)
    return { title: o, current: "", request: null, entityId: s };
  const n = i.selector_attribute || "auto";
  if (n === "options" || n === "auto" && (a === "input_select" || a === "select")) {
    const d = fe(r.attributes.options), g = String(r.state ?? "").trim();
    return {
      title: o,
      current: g,
      entityId: s,
      request: d.length > 0 ? {
        title: o,
        options: d,
        current: g,
        onSelect: (u) => {
          t.callService(a === "select" ? "select" : "input_select", "select_option", {
            entity_id: s,
            option: u
          });
        }
      } : null
    };
  }
  if (n === "sound_mode_list") {
    const d = fe(r.attributes.sound_mode_list), g = String(r.attributes.sound_mode ?? "").trim();
    return {
      title: o,
      current: g,
      entityId: s,
      request: d.length > 0 ? {
        title: o,
        options: d,
        current: g,
        onSelect: (u) => {
          t.callService("media_player", "select_sound_mode", {
            entity_id: s,
            sound_mode: u
          });
        }
      } : null
    };
  }
  const c = fe(r.attributes.source_list);
  if (c.length > 0) {
    const d = String(r.attributes.source ?? "").trim();
    return {
      title: o,
      current: d,
      entityId: s,
      request: {
        title: o,
        options: c,
        current: d,
        onSelect: (g) => {
          t.callService("media_player", "select_source", {
            entity_id: s,
            source: g
          });
        }
      }
    };
  }
  const p = fe(r.attributes.sound_mode_list);
  if (p.length > 0) {
    const d = String(r.attributes.sound_mode ?? "").trim();
    return {
      title: o,
      current: d,
      entityId: s,
      request: {
        title: o,
        options: p,
        current: d,
        onSelect: (g) => {
          t.callService("media_player", "select_sound_mode", {
            entity_id: s,
            sound_mode: g
          });
        }
      }
    };
  }
  return { title: o, current: String(r.state ?? ""), request: null, entityId: s };
}
const Vi = I`
  .custom-controls-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .custom-btn-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .custom-btn-grid.is-single {
    grid-template-columns: 1fr;
  }

  .custom-remote-btn {
    height: 52px;
    padding: 0 16px;
    border: 0;
    border-radius: 20px;
    background: var(--md-sys-color-surface-container-high, #282930);
    color: var(--md-sys-color-on-surface, #e3e2e6);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    overflow: hidden;
    transition:
      transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1)),
      border-radius var(--m3e-spring-bouncy, 420ms cubic-bezier(0.34, 1.4, 0.64, 1)),
      background-color var(--m3e-spring-effects-fast, 160ms ease),
      color var(--m3e-spring-effects-fast, 160ms ease);
    -webkit-tap-highlight-color: transparent;
  }

  .custom-remote-btn.is-active {
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-primary-container, #364067);
    color: var(--md-sys-color-on-primary-container, #dce2ff);
    font-weight: 600;
  }

  .custom-remote-btn:hover:not(.is-active) {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #e3e2e6) 7%,
      var(--md-sys-color-surface-container-high, #282930)
    );
  }

  .custom-remote-btn:active {
    transform: scale(0.96);
  }

  .custom-remote-btn ha-icon {
    --mdc-icon-size: 20px;
    flex: 0 0 auto;
    display: inline-flex;
  }

  .custom-remote-btn-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Custom Native Selector Pill */
  .custom-selector-card {
    height: 54px;
    width: 100%;
    padding: 0 18px;
    border: 0;
    border-radius: 20px;
    background: var(--md-sys-color-surface-container-high, #282930);
    color: var(--md-sys-color-on-surface, #e3e2e6);
    font: inherit;
    font-size: 14.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
    transition:
      transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1)),
      border-radius var(--m3e-spring-bouncy, 420ms cubic-bezier(0.34, 1.4, 0.64, 1)),
      background-color var(--m3e-spring-effects-fast, 160ms ease);
    -webkit-tap-highlight-color: transparent;
  }

  .custom-selector-card:hover {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #e3e2e6) 7%,
      var(--md-sys-color-surface-container-high, #282930)
    );
  }

  .custom-selector-card:active {
    transform: scale(0.97);
    border-radius: 16px;
  }

  .custom-selector-left {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .custom-selector-left ha-icon {
    --mdc-icon-size: 20px;
    flex: 0 0 auto;
    color: var(--md-sys-color-on-surface-variant, #c4c6d0);
  }

  .custom-selector-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  .custom-selector-title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .custom-selector-val {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant, #c4c6d0);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .custom-selector-chevron {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    color: var(--md-sys-color-on-surface-variant, #c4c6d0);
  }

  .custom-selector-chevron svg {
    width: 20px;
    height: 20px;
  }

  /* Custom Segmented M3 Pill (2 to 4 segments with sliding tonal indicator) */
  .custom-seg-pill {
    position: relative;
    height: 52px;
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-surface-container-high, #282930);
    display: grid;
    grid-template-columns: repeat(var(--seg-count, 2), minmax(0, 1fr));
    overflow: hidden;
  }

  .custom-seg-pill.has-active {
    padding: 4px;
  }

  .custom-seg-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc((100% - 8px) / var(--seg-count, 2));
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-primary-container, #364067);
    transform: translateX(calc(var(--seg-idx, 0) * 100%));
    transition: transform var(--m3e-spring-spatial-fast, 240ms cubic-bezier(0.2, 0, 0, 1));
    pointer-events: none;
    z-index: 0;
  }

  .custom-seg-btn {
    position: relative;
    z-index: 1;
    border: 0;
    padding: 0 10px;
    border-radius: var(--m3e-corner-full, 9999px);
    background: transparent;
    color: var(--md-sys-color-on-surface, #e3e2e6);
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    overflow: hidden;
    transition:
      color var(--m3e-spring-effects-fast, 160ms ease),
      background-color var(--m3e-spring-effects-fast, 160ms ease),
      transform var(--m3e-spring-spatial-fast, 180ms ease);
    -webkit-tap-highlight-color: transparent;
  }

  .custom-seg-pill:not(.has-active) .custom-seg-btn + .custom-seg-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: var(--md-sys-color-outline-variant, #44464f);
    pointer-events: none;
  }

  .custom-seg-btn.is-selected {
    color: var(--md-sys-color-on-primary-container, #dce2ff);
    font-weight: 600;
  }

  .custom-seg-btn:hover:not(.is-selected) {
    background: color-mix(in srgb, currentColor 7%, transparent);
  }

  .custom-seg-btn:active {
    transform: scale(0.96);
  }

  .custom-seg-btn ha-icon {
    --mdc-icon-size: 18px;
    flex: 0 0 auto;
    display: inline-flex;
  }

  .custom-seg-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
function Fi(t, e, i, s, r, a, o) {
  if (!t || !i || i.length === 0) return h;
  const n = [];
  for (const c of i)
    if (c.type === "segmented")
      n.push({ kind: "segmented", item: c });
    else if (c.type === "selector")
      n.push({ kind: "selector", item: c });
    else {
      const p = n[n.length - 1];
      p && p.kind === "buttons" ? p.items.push(c) : n.push({ kind: "buttons", items: [c] });
    }
  return l`
    <div class="custom-controls-stack">
      ${n.map((c) => {
    if (c.kind === "buttons")
      return l`
            <div class="custom-btn-grid ${c.items.length === 1 ? "is-single" : ""}">
              ${c.items.map((u) => {
        const m = ki(t, e, u, u.state_entity), f = u.label?.trim() || u.command || u.player_action || u.value || "Button";
        return l`
                  <button
                    type="button"
                    class="custom-remote-btn ${m ? "is-active" : ""}"
                    aria-pressed=${String(m)}
                    @click=${() => {
          navigator.vibrate?.(10), $i(
            t,
            e,
            u,
            s,
            r
          );
        }}
                  >
                    ${u.icon ? l`<ha-icon .icon=${u.icon}></ha-icon>` : h}
                    <span class="custom-remote-btn-label">${f}</span>
                  </button>
                `;
      })}
            </div>
          `;
    if (c.kind === "selector") {
      const u = Vr(t, e, c.item);
      return l`
            <button
              type="button"
              class="custom-selector-card"
              @click=${() => {
        navigator.vibrate?.(10), u.request && a ? a(u.request) : u.entityId && o && o(u.entityId);
      }}
            >
              <span class="custom-selector-left">
                ${c.item.icon ? l`<ha-icon .icon=${c.item.icon}></ha-icon>` : h}
                <span class="custom-selector-text">
                  <span class="custom-selector-title">${u.title}</span>
                  ${u.current ? l`<span class="custom-selector-val">${u.current}</span>` : h}
                </span>
              </span>
              <span class="custom-selector-chevron">${Zr}</span>
            </button>
          `;
    }
    const p = (c.item.segments ?? []).slice(0, 4);
    if (p.length === 0) return h;
    const d = p.findIndex(
      (u) => ki(t, e, u, c.item.state_entity)
    ), g = d >= 0;
    return l`
          <div
            class="custom-seg-pill ${g ? "has-active" : ""}"
            role="group"
            style="--seg-count: ${p.length}; --seg-idx: ${Math.max(0, d)};"
          >
            ${g ? l`<span class="custom-seg-indicator" aria-hidden="true"></span>` : h}
            ${p.map((u, m) => {
      const f = m === d, y = u.label?.trim() || u.value || u.command || u.player_action || `Option ${m + 1}`;
      return l`
                <button
                  type="button"
                  class="custom-seg-btn ${f ? "is-selected" : ""}"
                  aria-pressed=${String(f)}
                  @click=${() => {
        navigator.vibrate?.(10), $i(
          t,
          e,
          u,
          s,
          r
        );
      }}
                >
                  ${u.icon ? l`<ha-icon .icon=${u.icon}></ha-icon>` : h}
                  <span class="custom-seg-label">${y}</span>
                </button>
              `;
    })}
          </div>
        `;
  })}
    </div>
  `;
}
var Fr = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, at = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? jr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Fr(e, i, r), r;
};
const Ci = l`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41Z" />
  </svg>
`, Jt = l`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
  </svg>
`, Wr = l`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
  </svg>
`, Gr = l`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
  </svg>
`;
let K = class extends A {
  constructor() {
    super(...arguments), this._padOffsetX = 0, this._padOffsetY = 0, this._padActive = !1, this._padTapPulse = !1, this._selectorSheet = null, this._padPointerId = null, this._padStartX = 0, this._padStartY = 0, this._padSwiped = !1, this._padDir = null, this._padHoldTimer = null, this._padRepeatTimer = null, this._padPulseTimer = null, this._onPadPointerDown = (t) => {
      if (t.button !== 0) return;
      t.currentTarget.setPointerCapture(t.pointerId), this._padPointerId = t.pointerId, this._padStartX = t.clientX, this._padStartY = t.clientY, this._padSwiped = !1, this._padDir = null, this._padActive = !0, this._padOffsetX = 0, this._padOffsetY = 0;
    }, this._onPadPointerMove = (t) => {
      if (this._padPointerId !== t.pointerId) return;
      const i = t.currentTarget.getBoundingClientRect(), s = t.clientX - this._padStartX, r = t.clientY - this._padStartY, a = Math.max(24, i.width / 2 - 28), o = Math.max(20, i.height / 2 - 28);
      if (this._padOffsetX = Math.max(-a, Math.min(a, s * 0.85)), this._padOffsetY = Math.max(-o, Math.min(o, r * 0.85)), Math.hypot(s, r) >= 24) {
        const c = Math.abs(s) >= Math.abs(r) ? s > 0 ? "dpad_right" : "dpad_left" : r > 0 ? "dpad_down" : "dpad_up";
        (!this._padSwiped || this._padDir !== c) && (this._padSwiped = !0, this._padDir = c, this._triggerKey(c), this._startPadRepeat(c));
      }
    }, this._onPadPointerUp = (t) => {
      if (this._padPointerId !== t.pointerId) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId);
      const i = this._padSwiped;
      this._padPointerId = null, this._padActive = !1, this._padDir = null, this._padOffsetX = 0, this._padOffsetY = 0, this._padHoldTimer !== null && (window.clearTimeout(this._padHoldTimer), this._padHoldTimer = null), this._padRepeatTimer !== null && (window.clearInterval(this._padRepeatTimer), this._padRepeatTimer = null), !i && t.type === "pointerup" && (this._triggerKey("dpad_center"), this._padTapPulse = !0, this._padPulseTimer !== null && window.clearTimeout(this._padPulseTimer), this._padPulseTimer = window.setTimeout(() => {
        this._padTapPulse = !1, this._padPulseTimer = null;
      }, 180));
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-remote-card",
      entity: (t ? Object.keys(t.states).find(
        (i) => i.startsWith("media_player.") || i.startsWith("remote.")
      ) : void 0) ?? "media_player.living_room_tv",
      pad_mode: "touchpad",
      show_touchpad: !0,
      show_volume: !0,
      show_essentials: !0,
      show_transport: !0,
      show_channels: !1,
      show_source: !0,
      show_power: !0
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-remote-card-editor");
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-remote-card: you must define an entity");
    this._config = {
      pad_mode: "touchpad",
      show_touchpad: !0,
      show_volume: !0,
      show_essentials: !0,
      show_transport: !0,
      show_channels: !1,
      show_source: !0,
      show_power: !0,
      ...t
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearPadTimers();
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto"
    };
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _mediaEntity() {
    if (!this.hass || !this._config) return;
    const t = lt(this.hass, this._config.entity, "media_player");
    return t ? this.hass.states[t] : void 0;
  }
  get _statusEntity() {
    if (!(!this.hass || !this._config))
      return this._config.status_entity && this.hass.states[this._config.status_entity] ? this.hass.states[this._config.status_entity] : this._mediaEntity ?? this._entity;
  }
  _triggerKey(t) {
    !this.hass || !this._config || (navigator.vibrate?.(10), ti(
      this.hass,
      this._config.entity,
      t,
      this._config.remote_buttons,
      this._config.remote_device
    ));
  }
  _openMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: t }
      })
    );
  }
  _openSelectorDialog(t) {
    this._selectorSheet = t;
    const e = this._sourceDialogEl;
    !e || e.open || (e.showModal(), this._sourceSurfaceEl && yt(this._sourceSurfaceEl));
  }
  _closeSourceDialog() {
    const t = this._sourceDialogEl;
    !t || !t.open || xt(t, this._sourceSurfaceEl ?? null, () => {
      t.open && t.close(), this._selectorSheet = null;
    });
  }
  _clearPadTimers() {
    this._padHoldTimer !== null && (window.clearTimeout(this._padHoldTimer), this._padHoldTimer = null), this._padRepeatTimer !== null && (window.clearInterval(this._padRepeatTimer), this._padRepeatTimer = null), this._padPulseTimer !== null && (window.clearTimeout(this._padPulseTimer), this._padPulseTimer = null);
  }
  _startPadRepeat(t) {
    this._padHoldTimer !== null && window.clearTimeout(this._padHoldTimer), this._padRepeatTimer !== null && window.clearInterval(this._padRepeatTimer), this._padHoldTimer = window.setTimeout(() => {
      this._padHoldTimer = null, this._padRepeatTimer = window.setInterval(() => {
        this._padDir === t && this._triggerKey(t);
      }, 220);
    }, 420);
  }
  _renderHeaderIcon() {
    const t = this._statusEntity ?? this._entity, e = this._config?.icon;
    if (e && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${e}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      if (t.attributes.icon && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${t.attributes.icon}></ha-icon>`;
    }
    return Tt(t, !0);
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = this._mediaEntity, i = e ?? t, s = this._statusEntity, r = String(s?.state ?? "").toLowerCase(), a = !!r && r !== "off" && r !== "standby" && r !== "unavailable" && r !== "unknown", o = i?.attributes.is_volume_muted === !0, n = String(e?.state ?? "").toLowerCase(), c = n === "playing", p = n === "paused", d = String(i?.attributes.source ?? "").trim(), g = String(e?.attributes.app_name ?? "").trim(), u = Array.isArray(i?.attributes.source_list) ? Array.from(
      new Set(
        i.attributes.source_list.map((E) => String(E ?? "").trim()).filter(Boolean)
      )
    ) : [], m = String(i?.attributes.sound_mode ?? "").trim(), f = Array.isArray(i?.attributes.sound_mode_list) ? Array.from(
      new Set(
        i.attributes.sound_mode_list.map((E) => String(E ?? "").trim()).filter(Boolean)
      )
    ) : [], y = dt(this.hass, t, this._config.name) || this._config.entity, b = this.hass && s?.state && typeof this.hass.formatEntityState == "function" ? this.hass.formatEntityState(s) : r ? r.charAt(0).toUpperCase() + r.slice(1) : x(this.hass, "off"), C = a && (g || d) ? `${b} · ${g || d}` : b, w = this._config.show_touchpad !== !1, $ = this._config.show_volume !== !1, k = this._config.show_essentials !== !1, M = this._config.show_transport !== !1, _ = this._config.show_channels === !0, H = this._config.show_source !== !1, S = this._config.show_power !== !1;
    return l`
      <ha-card class="remote-card">
        <!-- Header -->
        <div class="remote-header">
          <button
            type="button"
            class="header-id"
            @click=${() => i && this._openMoreInfo(i.entity_id)}
          >
            <span class="header-icon ${a ? "is-on" : ""}">${this._renderHeaderIcon()}</span>
            <span class="header-meta">
              <span class="header-title">${y}</span>
              <span class="header-sub">${C}</span>
            </span>
          </button>

          <div class="header-actions">
            ${H ? l`
                  <button
                    type="button"
                    class="source-chip"
                    @click=${() => {
      u.length > 0 && e ? this._openSelectorDialog({
        title: x(this.hass, "sources"),
        options: u,
        current: d,
        onSelect: (E) => {
          this.hass?.callService("media_player", "select_source", {
            entity_id: e.entity_id,
            source: E
          });
        }
      }) : i && this._openMoreInfo(i.entity_id);
    }}
                  >
                    <span class="source-chip-label">${d || x(this.hass, "sources")}</span>
                    <span class="source-chip-chevron">${Jt}</span>
                  </button>
                ` : h}

            ${S ? l`
                  <button
                    type="button"
                    class="power-btn ${a ? "is-on" : ""}"
                    aria-label=${a ? x(this.hass, "off") : x(this.hass, "on")}
                    aria-pressed=${String(a)}
                    @click=${() => this._triggerKey(a ? "power_off" : "power_on")}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.16.98-4.09 2.58-5.41L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                      />
                    </svg>
                  </button>
                ` : h}
          </div>
        </div>

        <!-- Hero Zone: Touchpad / D-Pad + Vertical Volume Rocker -->
        ${w || $ ? l`
              <div class="hero-grid ${w && $ ? "" : "is-single"}">
                ${w ? this._config.pad_mode === "dpad" ? l`
                        <div class="dpad-surface" role="group" aria-label="Directional pad">
                          <button
                            type="button"
                            class="dpad-btn is-up"
                            aria-label="Up"
                            @click=${() => this._triggerKey("dpad_up")}
                          >
                            ${Ci}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-left"
                            aria-label="Left"
                            @click=${() => this._triggerKey("dpad_left")}
                          >
                            ${Wr}
                          </button>
                          <button
                            type="button"
                            class="dpad-center"
                            aria-label="Select"
                            @click=${() => this._triggerKey("dpad_center")}
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-right"
                            aria-label="Right"
                            @click=${() => this._triggerKey("dpad_right")}
                          >
                            ${Gr}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-down"
                            aria-label="Down"
                            @click=${() => this._triggerKey("dpad_down")}
                          >
                            ${Jt}
                          </button>
                        </div>
                      ` : l`
                        <div
                          class="remote-touchpad ${this._padActive ? "is-dragging" : ""}"
                          role="application"
                          aria-label="Navigation touchpad"
                          @pointerdown=${this._onPadPointerDown}
                          @pointermove=${this._onPadPointerMove}
                          @pointerup=${this._onPadPointerUp}
                          @pointercancel=${this._onPadPointerUp}
                        >
                          <span
                            class="touchpad-dot ${this._padActive ? "is-dragging" : ""} ${this._padTapPulse ? "is-pulsing" : ""}"
                            style="transform: translate3d(${this._padOffsetX}px, ${this._padOffsetY}px, 0)"
                            aria-hidden="true"
                          ></span>
                        </div>
                      ` : h}

                ${$ ? l`
                      <div class="volume-rocker" role="group" aria-label="Volume">
                        <button
                          type="button"
                          class="vol-btn"
                          aria-label="Volume up"
                          @click=${() => this._triggerKey("volume_up")}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="vol-btn is-mute ${o ? "is-muted" : ""}"
                          aria-label=${o ? x(this.hass, "unmute") : x(this.hass, "mute")}
                          aria-pressed=${String(o)}
                          @click=${() => this._triggerKey(o ? "unmute" : "mute")}
                        >
                          ${o ? l`
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    fill="currentColor"
                                    d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"
                                  />
                                </svg>
                              ` : l`
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    fill="currentColor"
                                    d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"
                                  />
                                </svg>
                              `}
                        </button>
                        <button
                          type="button"
                          class="vol-btn"
                          aria-label="Volume down"
                          @click=${() => this._triggerKey("volume_down")}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M19 13H5v-2h14v2Z" />
                          </svg>
                        </button>
                      </div>
                    ` : h}
              </div>
            ` : h}

        <!-- 3 Essential Navigation Buttons: Back | Home | Assist -->
        ${k ? l`
              <div class="essential-row">
                <button
                  type="button"
                  class="essential-btn"
                  aria-label="Back"
                  @click=${() => this._triggerKey("back")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="essential-btn is-home"
                  aria-label="Home"
                  @click=${() => this._triggerKey("home")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="essential-btn is-assist"
                  aria-label="Assistant"
                  @click=${() => this._triggerKey("assist")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9.2" cy="10.2" r="3.4" fill="currentColor" />
                    <circle cx="16.4" cy="8.4" r="1.7" fill="currentColor" />
                    <circle cx="15.4" cy="13.4" r="2.1" fill="currentColor" />
                    <circle cx="19.5" cy="11.2" r="1" fill="currentColor" />
                  </svg>
                </button>
              </div>
            ` : h}

        <!-- M3 Expressive Transport Row -->
        ${M ? l`
              <div class="transport-row">
                <button
                  type="button"
                  class="transport-icon is-prev"
                  aria-label=${x(this.hass, "previous")}
                  @click=${() => this._triggerKey("prev")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-circle ${c ? "is-active" : ""}"
                  aria-label=${x(this.hass, "play")}
                  aria-pressed=${String(c)}
                  @click=${() => this._triggerKey("play")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-circle ${p ? "is-active" : ""}"
                  aria-label=${x(this.hass, "pause")}
                  aria-pressed=${String(p)}
                  @click=${() => this._triggerKey("pause")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                    <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-icon is-next"
                  aria-label=${x(this.hass, "next")}
                  @click=${() => this._triggerKey("next")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
                  </svg>
                </button>
              </div>
            ` : h}

        <!-- Optional Channel Rocker -->
        ${_ ? l`
              <div class="channel-pill">
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel down"
                  @click=${() => this._triggerKey("ch_down")}
                >
                  ${Jt}
                </button>
                <span class="channel-label">CH</span>
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel up"
                  @click=${() => this._triggerKey("ch_up")}
                >
                  ${Ci}
                </button>
              </div>
            ` : h}

        <!-- Native Sound Mode Selector (when supported by media_player) -->
        ${f.length > 0 && e ? l`
              <button
                type="button"
                class="custom-selector-card"
                @click=${() => {
      this._openSelectorDialog({
        title: "Sound mode",
        options: f,
        current: m,
        onSelect: (E) => {
          this.hass?.callService("media_player", "select_sound_mode", {
            entity_id: e.entity_id,
            sound_mode: E
          });
        }
      });
    }}
              >
                <span class="custom-selector-left">
                  <span class="custom-selector-text">
                    <span class="custom-selector-title">Sound mode</span>
                    ${m ? l`<span class="custom-selector-val">${m}</span>` : h}
                  </span>
                </span>
                <span class="custom-selector-chevron">${Jt}</span>
              </button>
            ` : h}

        <!-- Custom Native Buttons, Segmented Pills & Selectors -->
        ${Fi(
      this.hass,
      this._config.entity,
      this._config.remote_custom_controls,
      this._config.remote_buttons,
      this._config.remote_device,
      (E) => this._openSelectorDialog(E),
      (E) => this._openMoreInfo(E)
    )}
      </ha-card>

      <!-- Unified Selector Sheet Dialog (Sources, Sound Mode & Custom Selectors) -->
      <dialog
        class="source-dialog"
        @click=${(E) => {
      E.target === this._sourceDialogEl && this._closeSourceDialog();
    }}
        @cancel=${(E) => {
      E.preventDefault(), this._closeSourceDialog();
    }}
        @touchmove=${bt}
      >
        <div class="source-dialog-surface">
          <div class="source-dialog-header">
            <button
              type="button"
              class="dialog-close-btn"
              aria-label="Close"
              @click=${() => this._closeSourceDialog()}
            >
              ${Jt}
            </button>
            <span>${this._selectorSheet?.title ?? x(this.hass, "sources")}</span>
          </div>
          <div class="source-list">
            ${(this._selectorSheet?.options ?? []).map((E) => {
      const R = E.toLowerCase() === (this._selectorSheet?.current ?? "").toLowerCase();
      return l`
                <button
                  type="button"
                  class="source-option ${R ? "is-selected" : ""}"
                  @click=${() => {
        this._selectorSheet?.onSelect(E), this._closeSourceDialog();
      }}
                >
                  <span>${E}</span>
                  ${R ? l`<span class="check-mark">✓</span>` : h}
                </button>
              `;
    })}
          </div>
        </div>
      </dialog>
    `;
  }
};
K.styles = [
  U,
  Vi,
  I`
      :host {
        display: block;
      }

      ha-card.remote-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: var(--m3e-corner-card, 28px);
        background: var(--md-sys-color-surface-container-low, #1c1d22);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        box-shadow: none;
        border: 0;
        overflow: hidden;
      }

      /* Header */
      .remote-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .header-id {
        flex: 1 1 auto;
        min-width: 0;
        border: 0;
        padding: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .header-icon {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .header-icon.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .header-icon svg,
      .header-icon ha-icon,
      .header-icon ha-state-icon {
        width: 22px;
        height: 22px;
        --mdc-icon-size: 22px;
      }

      .header-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .header-title {
        font-size: 15.5px;
        font-weight: 600;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-sub {
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-actions {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .source-chip {
        height: 36px;
        max-width: 130px;
        padding: 0 10px 0 14px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 12.5px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast);
      }

      .source-chip:hover {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .source-chip:active {
        transform: scale(0.94);
        border-radius: 12px;
      }

      .source-chip-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .source-chip-chevron {
        display: inline-flex;
        width: 18px;
        height: 18px;
        flex: 0 0 18px;
      }

      .source-chip-chevron svg {
        width: 18px;
        height: 18px;
      }

      .power-btn {
        width: 40px;
        height: 40px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .power-btn.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        border-radius: 14px;
      }

      .power-btn:hover:not(.is-on) {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .power-btn:active {
        transform: scale(0.9);
        border-radius: 12px;
      }

      .power-btn svg {
        width: 21px;
        height: 21px;
      }

      /* Hero 2-Column Zone */
      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 68px;
        gap: 12px;
        align-items: stretch;
      }

      .hero-grid.is-single {
        grid-template-columns: 1fr;
      }

      /* Gesture Touchpad */
      .remote-touchpad {
        position: relative;
        width: 100%;
        height: 204px;
        min-height: 204px;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        display: grid;
        place-items: center;
        touch-action: none;
        user-select: none;
        cursor: grab;
        overflow: hidden;
        transition: background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .remote-touchpad.is-dragging {
        cursor: grabbing;
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 5%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .touchpad-dot {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--md-sys-color-on-surface, #e3e2e6);
        pointer-events: none;
        will-change: transform;
        transition:
          transform var(--m3e-spring-bouncy),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-dragging {
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-pulsing {
        width: 32px;
        height: 32px;
      }

      /* Alternative 4-Way D-Pad */
      .dpad-surface {
        height: 204px;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        display: grid;
        grid-template-columns: 1fr 56px 1fr;
        grid-template-rows: 1fr 56px 1fr;
        place-items: center;
        padding: 8px;
      }

      .dpad-btn {
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: 18px;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .dpad-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .dpad-btn:active {
        transform: scale(0.92);
      }

      .dpad-btn svg {
        width: 26px;
        height: 26px;
      }

      .dpad-btn.is-up {
        grid-column: 2;
        grid-row: 1;
      }
      .dpad-btn.is-left {
        grid-column: 1;
        grid-row: 2;
      }
      .dpad-btn.is-right {
        grid-column: 3;
        grid-row: 2;
      }
      .dpad-btn.is-down {
        grid-column: 2;
        grid-row: 3;
      }

      .dpad-center {
        grid-column: 2;
        grid-row: 2;
        width: 54px;
        height: 54px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy);
      }

      .dpad-center:active {
        transform: scale(0.9);
        border-radius: 16px;
      }

      /* Vertical Volume Rocker */
      .volume-rocker {
        height: 204px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        flex-direction: column;
        padding: 4px;
        gap: 2px;
      }

      .vol-btn {
        flex: 1;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          color var(--m3e-spring-effects-fast),
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast);
      }

      .vol-btn:hover:not(.is-muted) {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .vol-btn:active {
        transform: scale(0.9);
        border-radius: 16px;
      }

      .vol-btn.is-muted {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        border-radius: 18px;
      }

      .vol-btn svg {
        width: 22px;
        height: 22px;
      }

      /* 3 Essential Navigation Buttons */
      .essential-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
      }

      .essential-btn {
        width: 52px;
        height: 52px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .essential-btn.is-home {
        width: 62px;
        height: 62px;
      }

      .essential-btn.is-assist {
        background: var(--md-sys-color-on-surface, #e3e2e6);
        color: var(--md-sys-color-surface, #141418);
      }

      .essential-btn:hover:not(.is-assist) {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .essential-btn.is-assist:hover {
        opacity: 0.92;
      }

      .essential-btn:active {
        transform: scale(0.92);
        border-radius: 18px;
      }

      .essential-btn svg {
        width: 22px;
        height: 22px;
      }

      .essential-btn.is-home svg {
        width: 24px;
        height: 24px;
      }

      /* Transport Row */
      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 8px;
        padding: 2px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        padding: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
        -webkit-tap-highlight-color: transparent;
      }

      .transport-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-icon:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .transport-icon.is-prev:active {
        transform: translateX(-3px) scale(0.92);
      }

      .transport-icon.is-next:active {
        transform: translateX(3px) scale(0.92);
      }

      .transport-icon svg {
        width: 22px;
        height: 22px;
      }

      .transport-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .transport-circle:hover:not(.is-active) {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .transport-circle.is-active {
        border-radius: 18px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .transport-circle:active {
        transform: scale(0.92);
        border-radius: 16px;
      }

      .transport-circle svg {
        width: 25px;
        height: 25px;
      }

      /* Channel Pill */
      .channel-pill {
        height: 50px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
      }

      .channel-btn {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .channel-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .channel-btn:active {
        transform: scale(0.9);
      }

      .channel-btn svg {
        width: 22px;
        height: 22px;
      }

      .channel-label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      /* Source Sheet Dialog */
      dialog.source-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(400px, calc(100vw - 24px));
        width: 100%;
        overflow: visible;
      }

      dialog.source-dialog::backdrop {
        background: rgba(0, 0, 0, 0.52);
        transition: opacity 220ms ease;
      }

      dialog.source-dialog.is-closing::backdrop {
        opacity: 0;
      }

      .source-dialog-surface {
        border-radius: 28px;
        background: var(--md-sys-color-surface-container, #22232a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 70dvh;
      }

      .source-dialog-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }

      .dialog-close-btn {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .dialog-close-btn svg {
        width: 22px;
        height: 22px;
      }

      .source-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
      }

      .source-option {
        min-height: 48px;
        padding: 0 18px;
        border: 0;
        border-radius: 16px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: inherit;
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      .source-option.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font-weight: 600;
      }

      .check-mark {
        font-weight: 700;
      }
    `
];
at([
  P({ attribute: !1 })
], K.prototype, "hass", 2);
at([
  v()
], K.prototype, "_config", 2);
at([
  v()
], K.prototype, "_padOffsetX", 2);
at([
  v()
], K.prototype, "_padOffsetY", 2);
at([
  v()
], K.prototype, "_padActive", 2);
at([
  v()
], K.prototype, "_padTapPulse", 2);
at([
  v()
], K.prototype, "_selectorSheet", 2);
at([
  T("dialog.source-dialog")
], K.prototype, "_sourceDialogEl", 2);
at([
  T(".source-dialog-surface")
], K.prototype, "_sourceSurfaceEl", 2);
K = at([
  z("m3e-remote-card")
], K);
var Yr = Object.defineProperty, Kr = Object.getOwnPropertyDescriptor, he = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Kr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Yr(e, i, r), r;
};
const qr = 2200;
let At = class extends A {
  constructor() {
    super(...arguments), this._pressed = !1, this._activated = !1, this._resetTimer = null;
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-scene-card",
      entity: (t ? Object.keys(t.states).find(
        (i) => i.startsWith("scene.") || i.startsWith("script.") || i.startsWith("button.") || i.startsWith("input_button.")
      ) : void 0) ?? "scene.home"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: {
            entity: {
              domain: ["scene", "script", "button", "input_button", "automation"]
            }
          }
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            {
              name: "name",
              selector: { entity_name: {} },
              context: { entity: "entity" }
            },
            { name: "icon", selector: { icon: {} } },
            {
              name: "card_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "default", label: "Google Home (Default 28px)" },
                    { value: "morph", label: "Google Home Morph (28px ↔ Pillola)" },
                    { value: "pill", label: "Pillola piena (M3 Stadium)" },
                    { value: "expressive", label: "M3 Expressive Morph (20px ↔ Pillola)" },
                    { value: "compact", label: "Compatta (56px / 18px)" }
                  ]
                }
              }
            },
            {
              name: "accent",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "primary", label: "Primary (Tema M3Y)" },
                    { value: "secondary", label: "Secondary (Tema M3Y)" },
                    { value: "tertiary", label: "Tertiary (Tema M3Y)" }
                  ]
                }
              }
            },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "use_entity_icon", selector: { boolean: {} } },
                { name: "hide_state", selector: { boolean: {} } }
              ]
            },
            {
              name: "state_content",
              selector: { ui_state_content: { allow_name: !1 } },
              context: { filter_entity: "entity" }
            },
            { name: "subtitle", selector: { text: {} } }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Scena, Script o Pulsante",
        name: "Nome",
        use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
        hide_state: "Nascondi stato",
        state_content: "Contenuto stato (stato / attributi)",
        subtitle: "Sottotitolo opzionale",
        icon: "Icona personalizzata (vuoto = scintille Google Home)",
        accent: "Colore di attivazione (M3Y)",
        card_style: "Design della pillola (Material 3)"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-scene-card: you must define an entity");
    this._config = {
      accent: "primary",
      card_style: "default",
      ...t
    };
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 6, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resetTimer !== null && (window.clearTimeout(this._resetTimer), this._resetTimer = null);
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_pressed") || t.has("_activated"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      const e = this.hass.states[this._config.entity];
      return e !== this._prevEntityState ? (this._prevEntityState = e, !0) : !1;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isUnavailable() {
    return this._entity?.state === "unavailable";
  }
  _trigger() {
    if (!this.hass || !this._config || this._isUnavailable) return;
    const t = this._config.entity, e = t.split(".")[0];
    e === "button" || e === "input_button" ? this.hass.callService(e, "press", { entity_id: t }) : e === "automation" ? this.hass.callService("automation", "trigger", { entity_id: t }) : e === "scene" || e === "script" ? this.hass.callService(e, "turn_on", { entity_id: t }) : this.hass.callService("homeassistant", "turn_on", { entity_id: t }), this._activated = !0, this._resetTimer !== null && window.clearTimeout(this._resetTimer), this._resetTimer = window.setTimeout(() => {
      this._activated = !1, this._resetTimer = null;
    }, qr);
  }
  _renderIcon(t, e) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const i = this._entity.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${i}></ha-icon>`;
    }
    return e ? l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.5 3.5 11.4 9l5.6 1.9-5.6 1.9-1.9 5.7-1.9-5.7L2 10.9 7.6 9 9.5 3.5Zm9 1.5.9 2.6L22 8.5l-2.6.9-.9 2.6-.9-2.6L15 8.5l2.6-.9.9-2.6Zm0 10 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"
            />
          </svg>
        ` : l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
              d="M9.5 4.2 11.2 9.2 16.2 10.9 11.2 12.6 9.5 17.6 7.8 12.6 2.8 10.9 7.8 9.2 9.5 4.2Z"
            />
            <path
              fill="currentColor"
              d="M18.5 5l.8 2.2L21.5 8l-2.2.8-.8 2.2-.8-2.2L15.5 8l2.2-.8.8-2.2Zm0 10 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"
            />
          </svg>
        `;
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = dt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._config.accent ?? "primary", r = `style-${this._config.card_style ?? "default"}`, a = this._config.subtitle?.trim() || "", o = this._isUnavailable ? x(this.hass, "offline") : this._activated ? x(this.hass, "started") : a, n = !!this._config.hide_state, c = !n && !this._activated ? jt(this.hass, t, this._config.state_content, o) : null, p = n ? "" : c ?? o;
    return l`
      <ha-card
        class="scene-tile ${r} accent-${s} ${this._activated ? "is-on is-activated" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label=${e}
        @pointerdown=${(d) => {
      d.button === 0 && !this._isUnavailable && (this._pressed = !0);
    }}
        @pointerup=${() => {
      this._pressed && (this._pressed = !1, this._trigger());
    }}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @keydown=${(d) => {
      (d.key === " " || d.key === "Enter") && (d.preventDefault(), this._trigger());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="scene-icon">${this._renderIcon(i, this._activated)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            ${p ? l`<span class="tile-subtitle">${p}</span>` : h}
          </div>
          ${this._isUnavailable ? l`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : l`
                <span class="scene-check ${this._activated ? "visible" : ""}" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="check-path"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4.5 4.5L19 7.5"
                    />
                  </svg>
                </span>
              `}
        </div>
      </ha-card>
    `;
  }
};
At.styles = [
  U,
  I`
      .scene-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        outline: none;
        --m3e-scene-bg: var(--md-sys-color-primary-container, #dbe1ff);
        --m3e-scene-fg: var(--md-sys-color-on-primary-container, #16306b);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .scene-tile.accent-secondary {
        --m3e-scene-bg: var(--md-sys-color-secondary-container, #dde1f9);
        --m3e-scene-fg: var(--md-sys-color-on-secondary-container, #161b2c);
      }

      .scene-tile.accent-tertiary {
        --m3e-scene-bg: var(--md-sys-color-tertiary-container, #fdd7f4);
        --m3e-scene-fg: var(--md-sys-color-on-tertiary-container, #2b122a);
      }

      .scene-tile.is-activated {
        background: var(--m3e-scene-bg);
        color: var(--m3e-scene-fg);
      }

      .scene-tile.is-pressed {
        transform: scale(0.965);
      }

      .scene-tile:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .scene-tile:hover .state-layer {
        opacity: 0.06;
      }

      .scene-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
      }

      .scene-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transform: scale(1);
        transition:
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .scene-tile.is-activated .scene-icon {
        color: var(--m3e-scene-fg);
        animation: m3e-sparkle-pop 420ms cubic-bezier(0.2, 0.9, 0.2, 1);
      }

      @keyframes m3e-sparkle-pop {
        0% {
          transform: scale(0.82) rotate(-8deg);
        }
        55% {
          transform: scale(1.14) rotate(4deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }

      .scene-icon ha-icon,
      .scene-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 18px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
        transition: color var(--m3e-spring-effects-default);
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color var(--m3e-spring-effects-default);
      }

      .scene-tile.is-activated .tile-title,
      .scene-tile.is-activated .tile-subtitle {
        color: var(--m3e-scene-fg);
      }

      /* Animated Checkmark on Activation */
      .scene-check {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--m3e-scene-fg);
        opacity: 0;
        transform: scale(0.6);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .scene-check.visible {
        opacity: 1;
        transform: scale(1);
      }

      .scene-check svg {
        width: 22px;
        height: 22px;
      }

      .check-path {
        stroke-dasharray: 28;
        stroke-dashoffset: 28;
        transition: stroke-dashoffset 320ms cubic-bezier(0.2, 0.8, 0.2, 1) 60ms;
      }

      .scene-check.visible .check-path {
        stroke-dashoffset: 0;
      }
    `
];
he([
  P({ attribute: !1 })
], At.prototype, "hass", 2);
he([
  v()
], At.prototype, "_config", 2);
he([
  v()
], At.prototype, "_pressed", 2);
he([
  v()
], At.prototype, "_activated", 2);
At = he([
  z("m3e-scene-card")
], At);
var Xr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, Ie = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Jr(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Xr(e, i, r), r;
};
let Ft = class extends A {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._computeTopLabel = (t) => ({
      title: "Titolo in alto a sinistra",
      icon: "Icona in alto a sinistra (vuoto = Casa M3)",
      show_unit: "Mostra unità di misura accanto ai valori"
    })[t.name] ?? t.name, this._computeItemLabel = (t) => ({
      entity: "Sensore / Entità",
      name: "Nome personalizzato (opzionale)",
      attribute: "Attributo (vuoto = stato / temp. attuale)"
    })[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = {
      ...t,
      items: Array.isArray(t.items) ? t.items.map((e) => ({ ...e })) : []
    };
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onTopChanged(t) {
    if (!this._config) return;
    const e = t.detail.value, i = {
      ...this._config,
      title: e.title || "",
      icon: e.icon || "",
      show_unit: !!e.show_unit
    };
    i.title || delete i.title, i.icon || delete i.icon, this._emitConfig(i);
  }
  _onItemChanged(t, e) {
    if (!this._config) return;
    const i = [...this._config.items ?? []], s = {
      ...i[t],
      ...e.detail.value
    };
    s.name || delete s.name, s.attribute || delete s.attribute, i[t] = s, this._emitConfig({ ...this._config, items: i });
  }
  _addItem() {
    if (!this._config) return;
    const t = [...this._config.items ?? [], { entity: "" }];
    this._expandedIndex = t.length - 1, this._emitConfig({ ...this._config, items: t });
  }
  _removeItem(t, e) {
    if (e.stopPropagation(), !this._config) return;
    const i = [...this._config.items ?? []];
    i.splice(t, 1), this._expandedIndex >= i.length && (this._expandedIndex = Math.max(0, i.length - 1)), this._emitConfig({ ...this._config, items: i });
  }
  _moveItem(t, e, i) {
    if (i.stopPropagation(), !this._config) return;
    const s = [...this._config.items ?? []], r = t + e;
    r < 0 || r >= s.length || ([s[t], s[r]] = [s[r], s[t]], this._expandedIndex === t ? this._expandedIndex = r : this._expandedIndex === r && (this._expandedIndex = t), this._emitConfig({ ...this._config, items: s }));
  }
  _buildTopSchema() {
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } }
        ]
      },
      { name: "show_unit", selector: { boolean: {} } }
    ];
  }
  _buildItemSchema(t) {
    const e = [{ name: "entity", required: !0, selector: { entity: {} } }];
    return t.entity ? e.push({
      type: "grid",
      name: "",
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "attribute", selector: { attribute: { entity_id: t.entity } } }
      ]
    }) : e.push({ name: "name", selector: { text: {} } }), e;
  }
  _itemTitle(t, e) {
    return t.name ? t.name : t.entity ? this.hass?.states[t.entity]?.attributes.friendly_name || t.entity : `Sensore #${e + 1}`;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config.items ?? [];
    return l`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${{
      title: this._config.title ?? "",
      icon: this._config.icon ?? "",
      show_unit: !!this._config.show_unit
    }}
          .schema=${this._buildTopSchema()}
          .computeLabel=${this._computeTopLabel}
          @value-changed=${this._onTopChanged}
        ></ha-form>

        <div class="section-header">
          <span class="section-title">Sensori a confronto (${t.length})</span>
        </div>

        <div class="items-list">
          ${t.map((e, i) => {
      const s = this._expandedIndex === i, r = {
        entity: e.entity ?? "",
        name: e.name ?? "",
        attribute: e.attribute ?? ""
      };
      return l`
              <div class="item-card ${s ? "is-expanded" : ""}">
                <div
                  class="item-header"
                  role="button"
                  tabindex="0"
                  @click=${() => {
        this._expandedIndex = s ? -1 : i;
      }}
                >
                  <div class="item-header-left">
                    <span class="item-index">${i + 1}</span>
                    <div class="item-summary">
                      <span class="item-title">${this._itemTitle(e, i)}</span>
                      <span class="item-sub">
                        ${e.entity ? e.attribute ? `${e.entity} · ${e.attribute}` : e.entity : "Seleziona un sensore"}
                      </span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${i === 0}
                      @click=${(a) => this._moveItem(i, -1, a)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === t.length - 1}
                      @click=${(a) => this._moveItem(i, 1, a)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(a) => this._removeItem(i, a)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                ${s ? l`
                      <div class="item-body">
                        <ha-form
                          .hass=${this.hass}
                          .data=${r}
                          .schema=${this._buildItemSchema(e)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(a) => this._onItemChanged(i, a)}
                        ></ha-form>
                      </div>
                    ` : h}
              </div>
            `;
    })}
        </div>

        <button type="button" class="add-btn" @click=${this._addItem}>
          + Aggiungi sensore
        </button>
      </div>
    `;
  }
};
Ft.styles = I`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .item-card {
      border-radius: 16px;
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
      overflow: hidden;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .item-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .item-index {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 150ms ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(128, 128, 128, 0.16);
      color: var(--primary-text-color);
    }

    .icon-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .icon-btn.danger:hover {
      color: var(--error-color, #d93025);
      background: rgba(217, 48, 37, 0.12);
    }

    .item-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(128, 128, 128, 0.18));
    }

    .add-btn {
      align-self: flex-start;
      padding: 10px 18px;
      border-radius: 9999px;
      border: none;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 150ms ease, transform 150ms ease;
    }

    .add-btn:hover {
      opacity: 0.92;
    }

    .add-btn:active {
      transform: scale(0.97);
    }
  `;
Ie([
  P({ attribute: !1 })
], Ft.prototype, "hass", 2);
Ie([
  v()
], Ft.prototype, "_config", 2);
Ie([
  v()
], Ft.prototype, "_expandedIndex", 2);
Ft = Ie([
  z("m3e-stack-card-editor")
], Ft);
var Qr = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, ei = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ta(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Qr(e, i, r), r;
};
let de = class extends A {
  setConfig(t) {
    if (!t)
      throw new Error("m3e-stack-card: configurazione mancante");
    this._config = {
      ...t,
      show_unit: !!t.show_unit,
      items: Array.isArray(t.items) ? t.items : []
    };
  }
  getCardSize() {
    const t = this._config?.items?.length ?? 2;
    return Math.max(2, Math.ceil((t + 1) / 2));
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-stack-card-editor");
  }
  static getStubConfig(t) {
    const e = t?.states ?? {}, i = Object.keys(e).filter(
      (r) => r.startsWith("sensor.") && e[r]?.attributes.device_class === "temperature" || r.startsWith("climate.")
    ).slice(0, 3);
    return {
      type: "custom:m3e-stack-card",
      title: "Indoor temperatures",
      show_unit: !1,
      items: i.length > 0 ? i.map((r) => ({ entity: r })) : [{ entity: "sensor.temperature" }]
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config")) return !0;
    if (t.has("hass")) {
      const e = t.get("hass");
      if (!e || !this.hass) return !0;
      for (const i of this._config.items)
        if (i.entity && e.states[i.entity] !== this.hass.states[i.entity])
          return !0;
      return e.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  _formatValue(t, e) {
    if (!e) return "—";
    const i = e.entity_id.split(".")[0];
    let s;
    if (t.attribute ? s = e.attributes[t.attribute] : i === "climate" && e.attributes.current_temperature !== void 0 ? s = e.attributes.current_temperature : s = e.state, s == null || s === "") return "—";
    const r = String(s).trim(), a = r.toLowerCase();
    if (a === "unavailable" || a === "unknown") return "Offline";
    let o = r;
    if (/^-?\d+\.\d+$/.test(r)) {
      const n = Number(r);
      Number.isNaN(n) || (o = Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1))));
    }
    if (this._config?.show_unit && !t.attribute) {
      const n = e.attributes.unit_of_measurement;
      if (typeof n == "string" && n.trim()) {
        const c = n.trim();
        return c === "°" || c === "%" || c === "°C" || c === "°F" ? `${o}${c}` : `${o} ${c}`;
      }
    }
    return o;
  }
  _renderHeaderIcon() {
    const t = this._config?.icon?.trim();
    return t ? l`<ha-icon .icon=${t}></ha-icon>` : l`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return h;
    const t = this._config.title?.trim() || "Indoor temperatures", e = this._config.items ?? [];
    return l`
      <ha-card class="stack-card">
        <header class="stack-header">
          <span class="stack-icon" aria-hidden="true">${this._renderHeaderIcon()}</span>
          <span class="stack-title">${t}</span>
        </header>

        ${e.length === 0 ? l`<div class="empty-hint">Aggiungi due o più sensori dalla configurazione</div>` : l`
              <div class="stack-list">
                ${e.map((i) => {
      const s = i.entity ? this.hass?.states[i.entity] : void 0, r = i.name || s?.attributes.friendly_name || i.entity || "Sensore", a = this._formatValue(i, s);
      return l`
                    <div class="stack-row">
                      <span class="row-name">${r}</span>
                      <span class="row-value">${a}</span>
                    </div>
                  `;
    })}
              </div>
            `}
      </ha-card>
    `;
  }
};
de.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
      }

      .stack-card {
        padding: 20px 22px 22px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .stack-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0;
        margin: 0;
      }

      .stack-icon {
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .stack-icon svg {
        width: 24px;
        height: 24px;
        display: block;
      }

      .stack-icon ha-icon {
        --mdc-icon-size: 22px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .stack-title {
        font-size: 17px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: -0.005em;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stack-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .stack-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
      }

      .row-name {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .row-value {
        font-size: 16.5px;
        font-weight: 600;
        line-height: 22px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        flex-shrink: 0;
      }

      .empty-hint {
        font-size: 13.5px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }
    `
];
ei([
  P({ attribute: !1 })
], de.prototype, "hass", 2);
ei([
  v()
], de.prototype, "_config", 2);
de = ei([
  z("m3e-stack-card")
], de);
const ji = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/, ea = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/, Wi = /* @__PURE__ */ new Set(["s", "sec", "secs", "second", "seconds", "min", "mins", "minute", "minutes", "m", "h", "hr", "hrs", "hour", "hours", "d", "day", "days"]);
function Si(t) {
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function Ct(t) {
  if (t == null) return null;
  const e = String(t).trim();
  if (!e) return null;
  const i = e.match(/^(\d+):(\d{2}):(\d{2})$/);
  if (i)
    return (Number(i[1]) * 3600 + Number(i[2]) * 60 + Number(i[3])) * 1e3;
  let s = 0, r = !1;
  const a = /(\d+(?:\.\d+)?)\s*(d|days?|giorn[io]|h|hrs?|hours?|or[ae]|m|mins?|minutes?|minut[io]|s|secs?|seconds?|second[io])\b/gi;
  let o;
  for (; (o = a.exec(e)) !== null; ) {
    r = !0;
    const n = parseFloat(o[1]), c = o[2].toLowerCase();
    c.startsWith("d") || c.startsWith("giorn") ? s += n * 864e5 : c.startsWith("h") || c.startsWith("or") ? s += n * 36e5 : c.startsWith("m") ? s += n * 6e4 : c.startsWith("s") && (s += n * 1e3);
  }
  return r ? s : null;
}
function Be(t, e) {
  if (!e) return null;
  const i = e.trim().toLowerCase();
  return Wi.has(i) ? i === "s" || i.startsWith("sec") ? t * 1e3 : i === "m" || i.startsWith("min") ? t * 6e4 : i === "h" || i.startsWith("hr") || i.startsWith("hour") ? t * 36e5 : i === "d" || i.startsWith("day") ? t * 864e5 : null : null;
}
function Qt(t, e) {
  if (e) {
    if (typeof e.attributes.timestamp == "number" && Number.isFinite(e.attributes.timestamp)) {
      const r = e.attributes.timestamp;
      if (r >= 0 && r <= 86400 && e.attributes.has_date === !1) {
        const a = /* @__PURE__ */ new Date();
        return a.setHours(0, 0, 0, 0), a.getTime() + r * 1e3;
      }
      return r > 1e12 ? r : r * 1e3;
    }
    if (typeof e.attributes.finishes_at == "string") {
      const r = Date.parse(e.attributes.finishes_at);
      if (Number.isFinite(r)) return r;
    }
  }
  if (t == null) return null;
  const i = String(t).trim();
  if (!i || i === "unavailable" || i === "unknown" || i === "none") return null;
  if (i.toLowerCase() === "now") return Date.now();
  const s = i.match(ea);
  if (s) {
    const r = /* @__PURE__ */ new Date();
    return r.setHours(Number(s[1]), Number(s[2]), Number(s[3] ?? 0), 0), r.getTime();
  }
  if (ji.test(i) || e?.attributes.device_class === "timestamp") {
    const r = Date.parse(i);
    if (Number.isFinite(r)) return r;
  }
  return null;
}
function St(t, e) {
  if (t != null && t !== "") {
    const i = Number(String(t).trim().replace(",", "."));
    if (Number.isFinite(i)) return i;
  }
  if (e) {
    const i = Number(String(e.state ?? "").trim().replace(",", "."));
    if (Number.isFinite(i)) return i;
    if (typeof e.attributes.percentage == "number") return e.attributes.percentage;
    if (typeof e.attributes.battery_level == "number") return e.attributes.battery_level;
  }
  return null;
}
function Ei(t) {
  const e = Math.max(0, Math.round(t / 1e3)), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), r = e % 60;
  return i > 0 ? s > 0 ? `${i}h ${s}m` : `${i}h` : s > 0 ? r > 0 && s < 10 ? `${s}m ${r}s` : `${s}m` : `${r}s`;
}
function Pi(t, e, i, s) {
  const r = `m3e_badge_prog_${t}`;
  try {
    const o = window.localStorage.getItem(r);
    if (o) {
      const n = JSON.parse(o);
      if (n && n.sig === e && Number.isFinite(n.startMs)) {
        if (s !== void 0 && (n.peakVal === void 0 || s > n.peakVal)) {
          const c = { sig: e, startMs: n.startMs, peakVal: s };
          return window.localStorage.setItem(r, JSON.stringify(c)), c;
        }
        return n;
      }
    }
  } catch {
  }
  const a = { sig: e, startMs: i, peakVal: s };
  try {
    window.localStorage.setItem(r, JSON.stringify(a));
  } catch {
  }
  return a;
}
const ia = /(remain|left|rimanent|restant|time_to_full|time_left|charging_time|eta|countdown)/i;
function sa(t) {
  if (!t) return !1;
  const e = `${t.entity_id} ${String(t.attributes.friendly_name ?? "")}`;
  return ia.test(e);
}
function Mi(t, e, i = Date.now()) {
  if (!t || !e.progress_enabled)
    return { percent: null, isTimeBased: !1 };
  const s = e.progress_entity?.trim() || e.entity, r = t.states[s], a = e.progress_start_entity ? t.states[e.progress_start_entity] : void 0, o = e.progress_end_entity ? t.states[e.progress_end_entity] : void 0, n = ($, k, M) => {
    if ($ === null) return { percent: null, isTimeBased: k, liveRemainingText: M };
    const _ = Si($);
    return {
      percent: e.progress_invert ? Si(100 - _) : _,
      isTimeBased: k,
      liveRemainingText: M
    };
  }, c = r?.entity_id.startsWith("timer.") ? r : o?.entity_id.startsWith("timer.") ? o : void 0;
  if (c) {
    const $ = Ct(c.attributes.duration);
    if (c.state === "idle" || !$ || $ <= 0)
      return n(0, !1);
    if (c.state === "active" && typeof c.attributes.finishes_at == "string") {
      const k = Date.parse(c.attributes.finishes_at);
      if (Number.isFinite(k)) {
        const M = Math.max(0, k - i), _ = ($ - M) / $ * 100;
        return n(_, !0, Ei(M));
      }
    }
    if (c.state === "paused") {
      const k = Ct(c.attributes.remaining);
      if (k !== null) {
        const M = ($ - k) / $ * 100;
        return n(M, !1, Ei(k));
      }
    }
    return n(0, !1);
  }
  const p = Qt(r?.state, r), d = !!e.progress_start_now || String(e.progress_start_value ?? "").trim().toLowerCase() === "now", g = a ? Qt(a.state, a) : d ? null : Qt(e.progress_start_value), u = o ? Qt(o.state, o) : Qt(e.progress_end_value);
  let m = u ?? p;
  if (m !== null) {
    d && m < i - 6e4 && !ji.test(String(o?.state ?? r?.state ?? "")) && (m += 864e5);
    let $ = g;
    if ($ === null) {
      const H = !d && e.progress_start_value !== void 0 && e.progress_start_value !== "" ? Number(e.progress_start_value) : NaN;
      Number.isFinite(H) && H > 0 ? $ = m - H * 6e4 : $ = Pi(e.entity, `ts:${m}`, i).startMs;
    }
    m <= $ && (i < m ? $ -= 864e5 : m += 864e5);
    const k = m - $;
    if (k <= 0) return n(100, !0);
    const _ = ((g !== null && u !== null && p !== null && p !== m ? p : i) - $) / k * 100;
    return n(_, !0);
  }
  const f = String(r?.state ?? "").trim(), y = String(r?.attributes.unit_of_measurement ?? "").trim(), b = St(r?.state, r), C = Ct(f) ?? (b !== null ? Be(b, y) : null);
  if ((sa(r) || !!e.progress_start_now || Ct(f) !== null && b === null) && C !== null && (Wi.has(y.toLowerCase()) || r?.attributes.device_class === "duration" || Ct(f) !== null)) {
    if (C <= 0) return n(100, !1);
    const $ = o ? Ct(o.state) ?? (St(o.state, o) !== null ? Be(
      St(o.state, o),
      String(o.attributes.unit_of_measurement ?? y)
    ) : null) : null, k = Ct(e.progress_end_value) ?? (e.progress_end_value !== void 0 && e.progress_end_value !== "" ? Be(Number(e.progress_end_value), y || "min") : null);
    let M = $ ?? k;
    if (!M || M <= 0) {
      const H = Pi(s, "rem_session", i, C);
      M = Math.max(C, H.peakVal ?? C);
    }
    const _ = M > 0 ? (M - C) / M * 100 : 0;
    return n(_, !1);
  }
  if (b !== null) {
    const $ = (a ? St(a.state, a) : null) ?? St(e.progress_start_value) ?? (typeof r?.attributes.min == "number" ? r.attributes.min : null) ?? (typeof r?.attributes.minimum == "number" ? r.attributes.minimum : null) ?? 0, M = ((o ? St(o.state, o) : null) ?? St(e.progress_end_value) ?? (typeof r?.attributes.max == "number" ? r.attributes.max : null) ?? (typeof r?.attributes.maximum == "number" ? r.attributes.maximum : null) ?? 100) - $;
    if (M === 0) return n(0, !1);
    const _ = (b - $) / M * 100;
    return n(_, !1);
  }
  return n(null, !1);
}
var ra = Object.defineProperty, aa = Object.getOwnPropertyDescriptor, ue = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? aa(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ra(e, i, r), r;
};
const oa = /* @__PURE__ */ new Set([
  "on",
  "open",
  "opening",
  "unlocked",
  "detected",
  "home",
  "playing",
  "heat",
  "heating",
  "cool",
  "cooling",
  "active",
  "problem",
  "alarm",
  "triggered",
  "true"
]);
let Ot = class extends A {
  constructor() {
    super(...arguments), this._pressed = !1, this._tick = 0, this._tickTimer = null, this._tickIntervalMs = 0;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null, this._tickIntervalMs = 0);
  }
  updated() {
    const t = this._entity?.entity_id.startsWith("timer.") && this._entity.state === "active", e = this._config ? Mi(this.hass, this._config) : null, i = !!(this._entity && (this._entity.attributes.device_class === "timestamp" || Ue(String(this._entity.state ?? ""), this.hass) !== null)), s = t ? 1e3 : e?.isTimeBased ? 5e3 : i ? 3e4 : 0;
    s !== this._tickIntervalMs && (this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null), this._tickIntervalMs = s, s > 0 && (this._tickTimer = window.setInterval(() => {
      this._tick++;
    }, s)));
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-status-badge: entity is required");
    this._config = {
      badge_style: "glance",
      tap_action: "more-info",
      alert_color: !1,
      ...t
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 4,
      min_columns: 2
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-status-badge",
      entity: Object.keys(t?.states ?? {}).find(
        (i) => i.startsWith("sensor.") || i.startsWith("binary_sensor.") || i.startsWith("person.") || i.startsWith("light.")
      ) ?? "sun.sun",
      badge_style: "glance",
      tap_action: "more-info"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: {} } },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            {
              name: "badge_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "glance", label: "Glance Mini (Cerchio 38px · At a Glance)" },
                    { value: "glance_icon", label: "Glance Mini Solo Icona (Cerchio compatto)" },
                    { value: "split", label: "Split Tonal Pill (Telemetria doppia zona)" },
                    { value: "dot", label: "Minimal Dot Badge (Ultra-compatto con pallino)" },
                    { value: "alert", label: "Squircle Morph Badge (Alert · Pillola ↔ Squircle)" }
                  ]
                }
              }
            },
            {
              name: "name",
              selector: { entity_name: {} },
              context: { entity: "entity" }
            },
            { name: "icon", selector: { icon: {} } },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "use_entity_icon", selector: { boolean: {} } },
                { name: "hide_state", selector: { boolean: {} } }
              ]
            },
            { name: "alert_color", selector: { boolean: {} } },
            {
              name: "state_content",
              selector: { ui_state_content: { allow_name: !1 } },
              context: { filter_entity: "entity" }
            },
            { name: "active_state", selector: { text: {} } }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:progress-clock",
          title: "Progress (Entity Progress Badge)",
          schema: [
            {
              type: "grid",
              name: "",
              schema: [
                { name: "progress_enabled", selector: { boolean: {} } },
                { name: "progress_start_now", selector: { boolean: {} } }
              ]
            },
            { name: "progress_entity", selector: { entity: {} } },
            { name: "progress_start_entity", selector: { entity: {} } },
            { name: "progress_start_value", selector: { text: {} } },
            { name: "progress_end_entity", selector: { entity: {} } },
            { name: "progress_end_value", selector: { text: {} } },
            {
              type: "grid",
              name: "",
              schema: [
                { name: "progress_invert", selector: { boolean: {} } },
                { name: "progress_show_percent", selector: { boolean: {} } }
              ]
            }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            {
              name: "tap_action",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "more-info", label: "Dettagli Home Assistant (More-info)" },
                    { value: "toggle", label: "Toggle stato" },
                    { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
                    { value: "none", label: "Nessuna azione" }
                  ]
                }
              }
            },
            { name: "navigation_path", selector: { navigation: {} } }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Entità",
        badge_style: "Stile Badge (Material 3 Expressive)",
        name: "Nome",
        icon: "Icona personalizzata (vuoto = automatica)",
        use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
        hide_state: "Nascondi stato",
        alert_color: "Usa colore di avviso/errore quando attivo",
        state_content: "Contenuto stato (stato / attributi)",
        active_state: "Stati attivi personalizzati (es. on,open,problem)",
        tap_action: "Azione al tocco",
        navigation_path: "Percorso dashboard o #hash Pop-up",
        progress_enabled: "Abilita Entity Progress Badge",
        progress_start_now: "Partenza da ora (sveglie / remaining time)",
        progress_entity: "Entità progresso (vuoto = entità principale, es. history_stats)",
        progress_start_entity: "Entità valore iniziale (numero, counter, data/ora)",
        progress_start_value: "Valore iniziale fisso (es. 0, 07:30, now)",
        progress_end_entity: "Entità valore finale (numero, counter, data/ora, timer)",
        progress_end_value: "Valore finale fisso (es. 100, 22:00, minuti max)",
        progress_invert: "Inverti barra (100% → 0%)",
        progress_show_percent: "Mostra percentuale (%)"
      })[t.name] ?? t.name
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_pressed") || t.has("_tick"))
      return !0;
    if (t.has("hass") && this.hass) {
      const e = this.hass.states[this._config.entity], i = this._config.progress_entity ? this.hass.states[this._config.progress_entity] : void 0, s = this._config.progress_start_entity ? this.hass.states[this._config.progress_start_entity] : void 0, r = this._config.progress_end_entity ? this.hass.states[this._config.progress_end_entity] : void 0, a = t.get("hass");
      return e !== this._prevEntity || i !== this._prevProgressEntity || s !== this._prevStartEntity || r !== this._prevEndEntity || a?.themes?.darkMode !== this.hass.themes?.darkMode ? (this._prevEntity = e, this._prevProgressEntity = i, this._prevStartEntity = s, this._prevEndEntity = r, !0) : !1;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isUnavailable() {
    const t = this._entity?.state;
    return !t || t === "unavailable" || t === "unknown";
  }
  get _isActive() {
    if (this._isUnavailable || !this._entity) return !1;
    const t = String(this._entity.state ?? "").toLowerCase();
    return this._config?.active_state?.trim() ? this._config.active_state.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).includes(t) : oa.has(t);
  }
  _formatPrimaryState() {
    const t = this._entity;
    if (!t || this._isUnavailable) return x(this.hass, "offline");
    const e = String(t.state ?? "").trim(), i = Ue(e, this.hass);
    if (i) return i;
    const s = e.toLowerCase();
    if (s === "home") return x(this.hass, "home");
    if (s === "not_home") return x(this.hass, "away");
    if (s === "on") return x(this.hass, "on");
    if (s === "off") return x(this.hass, "off");
    const r = String(t.attributes.unit_of_measurement ?? "");
    if (/^-?\d+\.\d+$/.test(e)) {
      const a = parseFloat(e), o = Number.isInteger(a) ? String(a) : a.toFixed(1).replace(/\.0$/, "");
      return r ? `${o}${r}` : o;
    }
    if (typeof this.hass?.formatEntityState == "function")
      try {
        return this.hass.formatEntityState(t);
      } catch {
      }
    return r ? `${e}${r}` : e;
  }
  _onTap() {
    if (!this.hass || !this._config) return;
    const t = this._config.tap_action ?? "more-info";
    if (t !== "none") {
      if (t === "toggle") {
        const e = this._config.entity.split(".")[0];
        this.hass.callService(e, "toggle", { entity_id: this._config.entity });
        return;
      }
      if (t === "navigate" && this._config.navigation_path) {
        Ht(this, this.hass, this._config.navigation_path);
        return;
      }
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: this._config.entity },
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  _renderIcon(t, e = !1) {
    const i = this._config?.icon?.trim();
    if (i && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${i}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      const s = t.attributes.icon;
      if (s && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${s}></ha-icon>`;
    }
    return Tt(t, e);
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = this._config.badge_style ?? "glance", i = this._isUnavailable, s = this._isActive, r = s && (!!this._config.alert_color || e === "alert"), a = dt(this.hass, t, this._config.name, this._config.entity), o = Mi(this.hass, this._config), n = o.percent !== null, c = o.percent ?? 0, p = o.liveRemainingText || this._formatPrimaryState(), d = !!this._config.hide_state, g = d ? null : jt(this.hass, t, this._config.state_content, p);
    let u = d ? "" : g ?? p;
    if (!d && this._config.progress_show_percent && n) {
      const w = `${Math.round(c)}%`;
      u = u && !u.includes("%") ? `${u} · ${w}` : w;
    }
    const m = i ? "is-unavailable" : r ? "is-alert" : s ? "is-active" : "is-inactive", f = (this._config.tap_action ?? "more-info") !== "none", y = 100.53, b = y * (1 - c / 100);
    return l`
      <button
        type="button"
        class="m3e-badge style-${e} ${m} ${n ? "has-progress" : ""} ${this._pressed ? "is-pressed" : ""} ${f ? "is-clickable" : ""}"
        style=${n ? `--badge-pct: ${c.toFixed(1)}%;` : ""}
        title="${a}${u ? ` · ${u}` : ""}"
        aria-label="${a}${u ? `, ${u}` : ""}"
        @pointerdown=${(w) => {
      !f || w.pointerType === "mouse" && w.button !== 0 || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._onTap()}
      >
        ${n && (e === "alert" || e === "dot") ? l`<span class="badge-progress-fill" aria-hidden="true"></span>` : h}

        ${e === "glance" || e === "glance_icon" ? l`
              <span class="g-circle" aria-hidden="true">
                ${n ? l`
                      <svg class="g-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle class="g-ring-track" cx="18" cy="18" r="16" />
                        <circle
                          class="g-ring-fill"
                          cx="18"
                          cy="18"
                          r="16"
                          stroke-dasharray=${y}
                          stroke-dashoffset=${b}
                        />
                      </svg>
                    ` : h}
                ${this._renderIcon(t, s)}
              </span>
              ${e === "glance" ? l`
                    <span class="g-text">
                      ${u ? l`<span class="g-val">${u}</span>` : h}
                      <span class="g-lbl">${a}</span>
                    </span>
                  ` : h}
            ` : e === "split" ? l`
                <span class="s-left" aria-hidden="true">${this._renderIcon(t, s)}</span>
                <span class="s-right">
                  ${n ? l`<span class="s-progress-fill" aria-hidden="true"></span>` : h}
                  ${u ? l`<span class="s-val">${u}</span>` : h}
                  <span class="s-lbl">${a}</span>
                </span>
              ` : e === "dot" ? l`
                  <span class="d-wrap" aria-hidden="true">
                    ${this._renderIcon(t, s)}
                    <span class="d-dot"></span>
                  </span>
                  <span class="d-txt">${u || a}</span>
                ` : l`
                  <span class="m-ic" aria-hidden="true">${this._renderIcon(t, s)}</span>
                  <span class="m-col">
                    ${u ? l`<span class="m-val">${u}</span>` : h}
                    <span class="m-lbl">${a}</span>
                  </span>
                `}
      </button>
    `;
  }
};
Ot.styles = [
  U,
  I`
      :host {
        display: inline-flex;
        width: auto;
        height: auto;
        --m3e-spring-morph: 480ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      .m3e-badge {
        position: relative;
        overflow: hidden;
        border: 0;
        margin: 0;
        font-family: inherit;
        text-align: left;
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          border-radius var(--m3e-spring-morph);
        -webkit-tap-highlight-color: transparent;
      }

      .badge-progress-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
        transition: width var(--m3e-spring-spatial-default);
        pointer-events: none;
        z-index: 0;
      }

      .m3e-badge.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .style-alert.has-progress.is-active .badge-progress-fill,
      .style-alert.has-progress.is-alert .badge-progress-fill {
        background: color-mix(in srgb, currentColor 14%, transparent);
      }

      .m3e-badge.is-clickable {
        cursor: pointer;
      }

      .m3e-badge.is-pressed {
        transform: scale(0.93);
      }

      .m3e-badge.is-unavailable {
        opacity: 1;
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #e3e2e6) 46%, transparent);
      }

      .m3e-badge svg,
      .m3e-badge ha-icon {
        display: block;
        flex-shrink: 0;
      }

      /* =====================================================================
         1. GLANCE MINI (Compact At a Glance — 36px circle + value + label)
         ===================================================================== */
      .m3e-badge.style-glance {
        background: transparent;
        padding: 3px 6px 3px 2px;
        gap: 9px;
        border-radius: 9999px;
      }

      .m3e-badge.style-glance_icon {
        background: transparent;
        padding: 0;
        border-radius: 9999px;
      }

      .style-glance_icon .g-circle {
        width: 44px;
        height: 44px;
      }

      .style-glance_icon .g-circle svg:not(.g-ring),
      .style-glance_icon .g-circle ha-icon {
        width: 21px;
        height: 21px;
        --mdc-icon-size: 21px;
      }

      .g-circle {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.18))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .g-ring {
        position: absolute;
        inset: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        transform: rotate(-90deg);
        pointer-events: none;
      }

      .g-ring-track {
        fill: none;
        stroke: color-mix(in srgb, var(--md-sys-color-outline-variant, #74777f) 38%, transparent);
        stroke-width: 2.6;
      }

      .g-ring-fill {
        fill: none;
        stroke: var(--md-sys-color-primary, #b1c5ff);
        stroke-width: 2.8;
        stroke-linecap: round;
        transition: stroke-dashoffset var(--m3e-spring-spatial-default);
      }

      .style-glance.is-alert .g-ring-fill {
        stroke: var(--md-sys-color-error, #ffb4ab);
      }

      .style-glance.is-active .g-circle,
      .style-glance_icon.is-active .g-circle {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-glance.is-alert .g-circle,
      .style-glance_icon.is-alert .g-circle {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .style-glance.is-alert .g-ring-fill,
      .style-glance_icon.is-alert .g-ring-fill {
        stroke: var(--md-sys-color-error, #ffb4ab);
      }

      .g-circle svg,
      .g-circle ha-icon {
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .g-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .g-val {
        font-size: 15px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .g-lbl {
        font-size: 11.5px;
        font-weight: 400;
        line-height: 1.15;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         2. SPLIT TONAL PILL (Dual-Zone Telemetry Pill — 44px height)
         ===================================================================== */
      .m3e-badge.style-split {
        height: 44px;
        padding: 0;
        border-radius: 9999px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-high, #292a32);
      }

      .s-left {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 0 12px 0 14px;
        display: inline-flex;
        align-items: center;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .style-split.is-active .s-left {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-split.is-alert .s-left {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .s-left svg,
      .s-left ha-icon {
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .s-right {
        position: relative;
        height: 100%;
        padding: 0 15px 0 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
      }

      .s-progress-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
        transition: width var(--m3e-spring-spatial-default);
        pointer-events: none;
        z-index: 0;
      }

      .style-split.is-alert .s-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .s-val {
        position: relative;
        z-index: 1;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .s-lbl {
        position: relative;
        z-index: 1;
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         3. MINIMAL DOT BADGE (Compact with semantic status dot — 40px)
         ===================================================================== */
      .m3e-badge.style-dot {
        height: 40px;
        padding: 4px 14px 4px 4px;
        gap: 9px;
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container, #1f2027);
      }

      .d-wrap {
        position: relative;
        z-index: 1;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .style-dot.is-active .d-wrap {
        background: var(--md-sys-color-secondary-container, #3e4659);
        color: var(--md-sys-color-on-secondary-container, #dce2f9);
      }

      .style-dot.is-alert .d-wrap {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .d-wrap svg,
      .d-wrap ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }

      .d-dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--md-sys-color-outline-variant, #74777f);
        border: 2px solid var(--md-sys-color-surface-container, #1f2027);
        box-sizing: border-box;
      }

      .style-dot.is-active .d-dot {
        background: var(--md-sys-color-primary, #b1c5ff);
      }

      .style-dot.is-alert .d-dot {
        background: var(--md-sys-color-error, #ffb4ab);
      }

      .d-txt {
        position: relative;
        z-index: 1;
        font-size: 13.5px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         4. SQUIRCLE MORPH BADGE (Alert · Pill Inactive <-> 14px Squircle Active)
         ===================================================================== */
      .m3e-badge.style-alert {
        height: 44px;
        padding: 4px 14px 4px 5px;
        gap: 9px;
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container-high, #292a32);
      }

      .style-alert.is-active {
        border-radius: 14px;
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-alert.is-alert {
        border-radius: 14px;
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m-ic {
        position: relative;
        z-index: 1;
        width: 34px;
        height: 34px;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          border-radius var(--m3e-spring-morph),
          background-color var(--m3e-spring-effects-default);
      }

      .style-alert.is-active .m-ic {
        border-radius: 10px;
        background: var(--md-sys-color-primary, #b1c5ff);
        color: var(--md-sys-color-on-primary, #142c60);
      }

      .style-alert.is-alert .m-ic {
        border-radius: 10px;
        background: var(--md-sys-color-error, #ffb4ab);
        color: var(--md-sys-color-on-error, #690005);
      }

      .m-ic svg,
      .m-ic ha-icon {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 18px;
      }

      .m-col {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .m-val {
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .m-lbl {
        font-size: 11px;
        line-height: 1.15;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
];
ue([
  P({ attribute: !1 })
], Ot.prototype, "hass", 2);
ue([
  v()
], Ot.prototype, "_config", 2);
ue([
  v()
], Ot.prototype, "_pressed", 2);
ue([
  v()
], Ot.prototype, "_tick", 2);
Ot = ue([
  z("m3e-status-badge")
], Ot);
let ge = null, ve = null;
function ke(t, e = 4e3) {
  return typeof customElements > "u" ? Promise.resolve(!1) : customElements.get(t) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(t).then(() => !0),
    new Promise((i) => window.setTimeout(() => i(!!customElements.get(t)), e))
  ]);
}
async function Gi() {
  if (typeof customElements > "u") return !1;
  if (customElements.get("hui-card-features")) return !0;
  ge || (ge = (async () => {
    try {
      return window.loadCardHelpers && await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "" }), await ke("hui-tile-card", 3e3), await ke("hui-card-features", 3e3);
    } catch {
      return !!customElements.get("hui-card-features");
    }
  })());
  const t = await ge;
  return t || (ge = null), t;
}
async function Yi() {
  if (typeof customElements > "u") return !1;
  if (customElements.get("hui-card-features-editor") && customElements.get("hui-sub-element-editor"))
    return !0;
  ve || (ve = (async () => {
    try {
      window.loadCardHelpers && await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "" }), await ke("hui-tile-card", 3500);
      const e = customElements.get("hui-tile-card");
      return e?.getConfigElement && await e.getConfigElement(), await ke("hui-card-features-editor", 4e3);
    } catch {
      return !!customElements.get("hui-card-features-editor");
    }
  })());
  const t = await ve;
  return t || (ve = null), t;
}
function nt(t) {
  t.stopPropagation();
}
var na = Object.defineProperty, la = Object.getOwnPropertyDescriptor, Gt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? la(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && na(e, i, r), r;
};
let ft = class extends A {
  constructor() {
    super(...arguments), this._mountedType = "", this._goBack = () => {
      this.dispatchEvent(new CustomEvent("go-back", { bubbles: !0, composed: !0 }));
    };
  }
  updated() {
    const t = this.config?.elementConfig, e = t?.type ?? "", i = typeof customElements < "u" && !!customElements.get("hui-sub-element-editor"), s = typeof customElements < "u" && !!customElements.get("hui-card-feature-editor");
    if (!i && !s && e && e !== this._mountedType && (this._mountedType = e, this._lastFeatureCfg = void 0, this._mountDirectCustomEditor(e, t)), this._customEditorEl) {
      const r = this._customEditorEl;
      r.hass = this.hass, r.lovelace = this.lovelace, r.context = this.context, this.context?.entity_id && this.hass?.states && (r.stateObj = this.hass.states[this.context.entity_id]), t && t !== this._lastFeatureCfg && (this._lastFeatureCfg = t, r.setConfig?.(t));
    }
  }
  async _mountDirectCustomEditor(t, e) {
    if (!t.startsWith("custom:") || typeof customElements > "u") return;
    const i = t.slice(7), s = customElements.get(i);
    if (s?.getConfigElement)
      try {
        const a = await s.getConfigElement();
        a.hass = this.hass, a.lovelace = this.lovelace, a.context = this.context, this.context?.entity_id && this.hass?.states && (a.stateObj = this.hass.states[this.context.entity_id]), this._lastFeatureCfg = e, a.setConfig?.(e), a.addEventListener("config-changed", (o) => {
          o.stopPropagation();
          const n = o.detail;
          this._emitConfigChanged(n?.config);
        }), this._customEditorEl = a;
      } catch {
        this._customEditorEl = void 0;
      }
  }
  _emitConfigChanged(t) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  render() {
    if (!this.hass || !this.config) return h;
    if (typeof customElements < "u" && !!customElements.get("hui-sub-element-editor"))
      return l`
        <hui-sub-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this.config}
          .context=${this.context}
          @go-back=${this._goBack}
          @config-changed=${(r) => {
        r.stopPropagation(), this._emitConfigChanged(r.detail?.config);
      }}
        ></hui-sub-element-editor>
      `;
    const e = this.config.elementConfig, i = typeof customElements < "u" && !!customElements.get("hui-card-feature-editor"), s = this.context?.entity_id && this.hass.states ? this.hass.states[this.context.entity_id] : void 0;
    return l`
      <div class="sub-editor-shell">
        <div class="sub-header">
          <button type="button" class="back-btn" @click=${this._goBack} aria-label="Back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
              />
            </svg>
          </button>
          <span class="sub-title">Feature</span>
        </div>

        <div class="sub-body">
          ${i && e ? l`
                <hui-card-feature-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .context=${this.context}
                  .stateObj=${s}
                  .config=${e}
                  @config-changed=${(r) => {
      r.stopPropagation(), this._emitConfigChanged(r.detail?.config);
    }}
                ></hui-card-feature-editor>
              ` : this._customEditorEl ? l`${this._customEditorEl}` : l`
                  <div class="fallback-msg">
                    Editor visuale non disponibile per questa feature. Usa <strong>Show code editor</strong> per modificarla in YAML.
                  </div>
                `}
        </div>
      </div>
    `;
  }
};
ft.styles = I`
    :host {
      display: block;
    }

    .sub-editor-shell {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sub-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color, rgba(128, 128, 128, 0.2));
    }

    .back-btn {
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .back-btn:hover {
      background: rgba(128, 128, 128, 0.14);
    }

    .back-btn svg {
      width: 22px;
      height: 22px;
    }

    .sub-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .fallback-msg {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 12px 4px;
    }
  `;
Gt([
  P({ attribute: !1 })
], ft.prototype, "hass", 2);
Gt([
  P({ attribute: !1 })
], ft.prototype, "lovelace", 2);
Gt([
  P({ attribute: !1 })
], ft.prototype, "config", 2);
Gt([
  P({ attribute: !1 })
], ft.prototype, "context", 2);
Gt([
  v()
], ft.prototype, "_customEditorEl", 2);
ft = Gt([
  z("m3e-feature-sub-editor")
], ft);
var ca = Object.defineProperty, da = Object.getOwnPropertyDescriptor, Yt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? da(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ca(e, i, r), r;
};
let gt = class extends A {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1, this._computeLabel = (t) => ({
      entity: "Entità principale",
      status_entity: "Entità stato dispositivo (opzionale)",
      name: "Nome",
      card_style: "Design della pillola (Material 3)",
      use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
      show_entity_picture: "Mostra entity picture (1:1 sfumata)",
      hide_state: "Nascondi stato",
      state_content: "Contenuto stato (stato / attributi)",
      icon_active: "Icona attivo (vuoto = standard Google Home)",
      icon_inactive: "Icona inattivo (vuoto = standard Google Home)",
      active_state: "Stati attivi personalizzati (es. on,home,detected)",
      label_active: "Testo stato attivo",
      label_inactive: "Testo stato inattivo",
      subtitle_entity: "Entità per testo stato (opzionale)",
      subtitle_attribute: "Attributo del dispositivo da mostrare come stato",
      subtitle_visibility: "Quando mostrare lo stato/attributo scelto",
      subtitle_format: "Formato testo / orario",
      subtitle_prefix: "Prefisso testo stato (es. Sveglia: )",
      subtitle_suffix: "Suffisso testo stato",
      popup_type: "Tipo card / Schermata popup",
      tap_action: "Azione al tocco (Tap)",
      hold_action: "Azione pressione prolungata (Hold)",
      navigation_path: "Percorso dashboard o #hash Pop-up",
      secondary_entity: "Entità secondaria (auto-rilevata dal device se vuota)",
      extra_entities: this._resolvedType() === "power_strip" ? "Prese della multipresa (vuoto = auto-rileva dallo stesso dispositivo)" : "Pillole entità aggiuntive nel popup (max 10)",
      outdoor_entity: "Temperatura esterna",
      media_controls_action: 'Azione pulsante "Media & Controls"',
      features_position: "Posizione Features",
      remote_device: "Device ID trasmettitore (multi-dispositivo)",
      dpad_up: "Pad Su (es. DPAD_UP)",
      dpad_down: "Pad Giù (es. DPAD_DOWN)",
      dpad_left: "Pad Sinistra (es. DPAD_LEFT)",
      dpad_right: "Pad Destra (es. DPAD_RIGHT)",
      dpad_center: "Pad Selezione / OK (es. DPAD_CENTER)",
      back: "Indietro (Back)",
      home: "Home",
      assist: "Assistente / Ricerca (Assist)",
      volume_up: "Volume + (es. button.tv_vol_up o VolumeUp)",
      volume_down: "Volume − (es. button.tv_vol_down o VolumeDown)",
      mute: "Mute",
      unmute: "Unmute",
      power_on: "Accensione (On)",
      power_off: "Spegnimento (Off)",
      play: "Play",
      pause: "Pause",
      prev: "Precedente",
      next: "Successivo",
      ch_up: "Canale +",
      ch_down: "Canale −"
    })[t.name] ?? t.name, this._onValueChanged = (t) => {
      if (!this._config) return;
      const e = { ...this._config, ...t.detail.value };
      Array.isArray(e.extra_entities) && (e.extra_entities = e.extra_entities.slice(0, 10), e.extra_entities.length === 0 && delete e.extra_entities), this._emitConfig(e);
    }, this._onFeaturesChanged = (t) => {
      if (t.stopPropagation(), !this._config) return;
      const e = t.detail.features ?? [], i = { ...this._config };
      e.length > 0 ? (i.features = e, i.features_position || (i.features_position = "bottom")) : (delete i.features, delete i.features_position), this._emitConfig(i);
    }, this._onFeaturesPositionChanged = (t) => {
      t.stopPropagation(), this._config && this._emitConfig({
        ...this._config,
        features_position: t.detail.value.features_position ?? "bottom"
      });
    }, this._onEditDetailElement = (t) => {
      t.stopPropagation(), this._subElementEditorConfig = t.detail.subElementConfig;
    }, this._onSubElementConfigChanged = (t) => {
      if (t.stopPropagation(), !this._config || !this._subElementEditorConfig) return;
      const e = this._subElementEditorConfig.index;
      if (typeof e != "number") return;
      const i = [...this._config.features ?? []], s = t.detail.config;
      s ? (i[e] = s, this._subElementEditorConfig = {
        ...this._subElementEditorConfig,
        elementConfig: s
      }) : (i.splice(e, 1), this._subElementEditorConfig = void 0);
      const r = { ...this._config };
      i.length > 0 ? r.features = i : (delete r.features, delete r.features_position), this._emitConfig(r);
    }, this._onGoBack = () => {
      this._subElementEditorConfig = void 0;
    };
  }
  connectedCallback() {
    super.connectedCallback(), Yi().then((t) => {
      t && (this._featuresEditorReady = !0);
    });
  }
  setConfig(t) {
    this._config = { ...t };
  }
  _resolvedType() {
    const t = this._config?.popup_type ?? "auto";
    if (t !== "auto") return t;
    const e = this._config?.entity ?? "";
    if (e.startsWith("input_select.") || e.startsWith("select.")) return "selector";
    if (e.startsWith("climate.")) return "climate";
    if (e.startsWith("media_player.")) return "media";
    if (e.startsWith("remote.")) {
      const i = this.hass?.entities?.[e]?.device_id;
      if (i && this.hass?.entities) {
        for (const [s, r] of Object.entries(this.hass.entities))
          if (r.device_id === i && s.startsWith("media_player."))
            return "media";
      }
      return "remote";
    }
    return "sensor";
  }
  _buildEntitySchema() {
    return [
      { name: "entity", required: !0, selector: { entity: {} } },
      {
        name: "popup_type",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "auto", label: "Automatico (in base al dispositivo)" },
              { value: "power_strip", label: "Power Strip (Multipresa a 2 colonne)" },
              { value: "selector", label: "Selettore (Scelta opzioni M3 Expressive)" },
              { value: "custom", label: "Personalizzata (stato/attributi liberi)" },
              { value: "sensor", label: "Sensore (Anello di stato + Storico)" },
              { value: "climate", label: "Clima / Termostato (Dial + Mode)" },
              { value: "remote", label: "Telecomando / TV (Rocker + Pulsanti)" },
              { value: "media", label: "Media / Speaker (Player + Volume)" },
              { value: "none", label: "Nessun popup" }
            ]
          }
        }
      }
    ];
  }
  _buildContentSchema() {
    const t = this._resolvedType(), e = this._config?.subtitle_entity?.trim() || this._config?.entity || "", i = [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "entity" }
      },
      {
        name: "card_style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "default", label: "Google Home (Default 28px)" },
              { value: "morph", label: "Google Home Morph (28px ↔ Pillola)" },
              { value: "pill", label: "Pillola piena (M3 Stadium)" },
              { value: "expressive", label: "M3 Expressive Morph (20px ↔ Pillola)" },
              { value: "compact", label: "Compatta (56px / 18px)" }
            ]
          }
        }
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "icon_active", selector: { icon: {} } },
          { name: "icon_inactive", selector: { icon: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "use_entity_icon", selector: { boolean: {} } },
          { name: "show_entity_picture", selector: { boolean: {} } }
        ]
      },
      { name: "hide_state", selector: { boolean: {} } }
    ];
    this._config?.hide_state || i.push({
      name: "state_content",
      selector: { ui_state_content: { allow_name: !1 } },
      context: { filter_entity: "entity" }
    });
    const s = {
      name: "subtitle_attribute",
      selector: {
        attribute: {
          entity_id: e
        }
      }
    }, r = {
      name: "subtitle_visibility",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "both", label: "Sempre (sia On che Off)" },
            { value: "on", label: "Solo quando acceso / attivo (On)" },
            { value: "off", label: "Solo quando spento / inattivo (Off)" }
          ]
        }
      }
    }, a = {
      name: "subtitle_format",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "auto", label: "Automatico (HH:MM per orari ISO)" },
            { value: "relative", label: "Relativo (es. Tra 5h 40m / 10m fa)" },
            { value: "time", label: "Orario (HH:MM)" },
            { value: "datetime", label: "Giorno + Orario (es. Oggi 19:35)" },
            { value: "raw", label: "Testo originale (non formattato)" }
          ]
        }
      }
    };
    return t === "custom" ? i.push(
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Sottotitolo avanzato (altra entità / orari relativi)",
        icon: "mdi:clock-outline",
        schema: [
          { name: "subtitle_entity", selector: { entity: {} } },
          s,
          r,
          a,
          {
            type: "grid",
            name: "",
            schema: [
              { name: "subtitle_prefix", selector: { text: {} } },
              { name: "subtitle_suffix", selector: { text: {} } }
            ]
          }
        ]
      },
      { name: "active_state", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "label_active", selector: { text: {} } },
          { name: "label_inactive", selector: { text: {} } }
        ]
      },
      { name: "status_entity", selector: { entity: {} } },
      { name: "extra_entities", selector: { entity: { multiple: !0 } } }
    ) : t === "sensor" ? i.push(
      {
        type: "expandable",
        name: "",
        flatten: !0,
        title: "Sottotitolo avanzato (attributi / orari relativi)",
        icon: "mdi:clock-outline",
        schema: [s, r, a]
      },
      { name: "active_state", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "label_active", selector: { text: {} } },
          { name: "label_inactive", selector: { text: {} } }
        ]
      },
      { name: "secondary_entity", selector: { entity: {} } },
      { name: "extra_entities", selector: { entity: { multiple: !0 } } }
    ) : t === "power_strip" ? i.push({ name: "extra_entities", selector: { entity: { multiple: !0 } } }) : t === "climate" ? i.push({
      name: "outdoor_entity",
      selector: { entity: { domain: "sensor" } }
    }) : (t === "media" || t === "remote") && i.push({ name: "status_entity", selector: { entity: {} } }), i;
  }
  _buildInteractionsSchema() {
    const t = this._resolvedType(), e = this._config?.tap_action === "navigate" || this._config?.hold_action === "navigate", i = [
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "tap_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "popup", label: "Apri popup M3E" },
                  { value: "toggle", label: "Toggle stato" },
                  { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
                  { value: "more-info", label: "Schermata nativa HA" },
                  { value: "none", label: "Nessuna" }
                ]
              }
            }
          },
          {
            name: "hold_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "popup", label: "Apri popup M3E" },
                  { value: "more-info", label: "Schermata nativa HA" },
                  { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
                  { value: "none", label: "Nessuna" }
                ]
              }
            }
          }
        ]
      }
    ];
    return e && i.push({ name: "navigation_path", selector: { navigation: {} } }), t === "media" ? i.push({
      name: "media_controls_action",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "popup", label: "Popup Now Playing M3E (predefinito)" },
            { value: "more-info", label: "Dettagli nativi Home Assistant (More-info)" }
          ]
        }
      }
    }) : t === "remote" && i.push(
      { name: "remote_device", selector: { text: {} } },
      {
        type: "expandable",
        title: "Pulsanti Telecomando (Entità button/script o comandi remote)",
        name: "remote_buttons",
        schema: [
          { name: "dpad_up", selector: { text: {} } },
          { name: "dpad_down", selector: { text: {} } },
          { name: "dpad_left", selector: { text: {} } },
          { name: "dpad_right", selector: { text: {} } },
          { name: "dpad_center", selector: { text: {} } },
          { name: "back", selector: { text: {} } },
          { name: "home", selector: { text: {} } },
          { name: "assist", selector: { text: {} } },
          { name: "volume_up", selector: { text: {} } },
          { name: "volume_down", selector: { text: {} } },
          { name: "mute", selector: { text: {} } },
          { name: "unmute", selector: { text: {} } },
          { name: "power_on", selector: { text: {} } },
          { name: "power_off", selector: { text: {} } },
          { name: "play", selector: { text: {} } },
          { name: "pause", selector: { text: {} } },
          { name: "prev", selector: { text: {} } },
          { name: "next", selector: { text: {} } },
          { name: "ch_up", selector: { text: {} } },
          { name: "ch_down", selector: { text: {} } }
        ]
      }
    ), i;
  }
  _buildFeaturesPositionSchema() {
    return [
      {
        name: "features_position",
        selector: {
          select: {
            mode: "box",
            options: [
              {
                value: "bottom",
                label: "Bottom",
                description: "Mostra tutte le feature impilate sotto la tile"
              },
              {
                value: "inline",
                label: "Inline",
                description: "Mostra le feature affiancate a destra del titolo"
              }
            ]
          }
        }
      }
    ];
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config.entity, e = t ? this.hass.states[t] : void 0, i = { entity_id: t };
    if (this._subElementEditorConfig)
      return l`
        <m3e-feature-sub-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this._subElementEditorConfig}
          .context=${i}
          @go-back=${this._onGoBack}
          @config-changed=${this._onSubElementConfigChanged}
        ></m3e-feature-sub-editor>
      `;
    const s = this._config.features ?? [];
    return l`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildEntitySchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:text-short"></ha-icon>
          <span slot="header">Content</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildContentSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:gesture-tap"></ha-icon>
          <span slot="header">Interactions</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildInteractionsSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        ${this._resolvedType() === "remote" ? l`
              <ha-expansion-panel outlined>
                <ha-icon slot="leading-icon" icon="mdi:remote"></ha-icon>
                <span slot="header">
                  Pulsanti e Pillole Personalizzate (${this._config.remote_custom_controls?.length ?? 0})
                </span>
                <div class="panel-body">
                  <m3e-remote-custom-controls-editor
                    .hass=${this.hass}
                    .controls=${this._config.remote_custom_controls ?? []}
                    @controls-changed=${(r) => {
      this._config && this._emitConfig({
        ...this._config,
        remote_custom_controls: r.detail.controls
      });
    }}
                  ></m3e-remote-custom-controls-editor>
                </div>
              </ha-expansion-panel>
            ` : h}

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
          <span slot="header">Features</span>
          <div class="panel-body features-panel">
            ${this._featuresEditorReady ? l`
                  <hui-card-features-editor
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    .context=${i}
                    .stateObj=${e}
                    .features=${s}
                    @features-changed=${this._onFeaturesChanged}
                    @edit-detail-element=${this._onEditDetailElement}
                  ></hui-card-features-editor>
                  ${s.length > 0 ? l`
                        <div class="features-pos-wrap">
                          <ha-form
                            .hass=${this.hass}
                            .data=${{
      features_position: this._config.features_position ?? "bottom"
    }}
                            .schema=${this._buildFeaturesPositionSchema()}
                            .computeLabel=${this._computeLabel}
                            @value-changed=${this._onFeaturesPositionChanged}
                          ></ha-form>
                        </div>
                      ` : h}
                ` : l`<div class="loading-hint">Caricamento editor Features…</div>`}
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
gt.styles = I`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
    }

    .features-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .features-pos-wrap {
      padding-top: 4px;
    }

    .loading-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 8px 0;
    }
  `;
Yt([
  P({ attribute: !1 })
], gt.prototype, "hass", 2);
Yt([
  P({ attribute: !1 })
], gt.prototype, "lovelace", 2);
Yt([
  v()
], gt.prototype, "_config", 2);
Yt([
  v()
], gt.prototype, "_featuresEditorReady", 2);
Yt([
  v()
], gt.prototype, "_subElementEditorConfig", 2);
gt = Yt([
  z("m3e-status-card-editor")
], gt);
var pa = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, L = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ha(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && pa(e, i, r), r;
};
const ee = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/, Ki = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
function te(t, e) {
  if (e === "raw") return t;
  const i = t.trim();
  let s = null;
  const r = Ki.exec(i);
  if (r) {
    const m = Number(r[1]), f = Number(r[2]), y = Number(r[3] ?? "0");
    if (m >= 0 && m <= 23 && f >= 0 && f <= 59) {
      const b = /* @__PURE__ */ new Date();
      s = new Date(b.getFullYear(), b.getMonth(), b.getDate(), m, f, y), s.getTime() <= b.getTime() && s.setDate(s.getDate() + 1);
    }
  } else if (ee.test(i)) {
    const m = new Date(i);
    Number.isNaN(m.getTime()) || (s = m);
  }
  if (!s) return t;
  const a = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (e === "time" || e === "auto")
    return a;
  if (e === "datetime") {
    const m = /* @__PURE__ */ new Date(), f = (w, $) => w.getFullYear() === $.getFullYear() && w.getMonth() === $.getMonth() && w.getDate() === $.getDate(), y = new Date(m.getFullYear(), m.getMonth(), m.getDate() + 1), b = new Date(m.getFullYear(), m.getMonth(), m.getDate() - 1);
    return f(s, m) ? `Oggi ${a}` : f(s, y) ? `Domani ${a}` : f(s, b) ? `Ieri ${a}` : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
  }
  const o = s.getTime() - Date.now(), n = o >= 0, c = Math.round(Math.abs(o) / 6e4);
  if (c < 1) return "Ora";
  const p = Math.floor(c / 1440), d = Math.floor(c % 1440 / 60), g = c % 60;
  let u;
  return p > 0 ? u = d > 0 ? `${p}g ${d}h` : `${p}g` : d > 0 ? u = g > 0 ? `${d}h ${g}m` : `${d}h` : u = `${g}m`, n ? `Tra ${u}` : `${u} fa`;
}
const ua = /* @__PURE__ */ new Set(["temperature", "humidity"]), ma = /* @__PURE__ */ new Set([
  "on",
  "home",
  "detected",
  "open",
  "unlocked",
  "playing",
  "heat",
  "cool",
  "heat_cool",
  "auto",
  "dry",
  "fan_only",
  "heating",
  "cooling",
  "true"
]), ht = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"/></svg>`, fa = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 15.41a1 1 0 0 1 0-1.41l3.88-3.88a1 1 0 0 1 1.42 0L16.59 14a1 1 0 1 1-1.41 1.41L12 12.23l-3.18 3.18a1 1 0 0 1-1.41 0Z"/></svg>`, _e = 135, Et = 270;
function ga(t) {
  return t * Math.PI / 180;
}
function re(t, e, i, s) {
  const r = ga(s);
  return { x: t + i * Math.cos(r), y: e + i * Math.sin(r) };
}
function va(t, e, i, s, r) {
  const a = re(t, e, i, s), o = re(t, e, i, r);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${i} ${i} 0 1 1 ${o.x.toFixed(2)} ${o.y.toFixed(2)}`;
}
let O = class extends A {
  constructor() {
    super(...arguments), this.popupOnly = !1, this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._remoteSelectorSheet = null, this._volDragging = !1, this._volPct = null, this._volPendingTimer = null, this._historyPoints = [], this._historyLoading = !1, this._historyEntityId = null, this._historyHoverIdx = null, this._featuresLoaded = !1, this._artPalette = null, this._lastArtUrl = "", this._prevStates = {}, this._longPressTimer = null, this._longPressTriggered = !1, this._relativeTimer = null, this._relativeTick = 0, this._padOffsetX = 0, this._padOffsetY = 0, this._padActive = !1, this._padTapPulse = !1, this._padPointerId = null, this._padStartX = 0, this._padStartY = 0, this._padSwiped = !1, this._padDir = null, this._padRepeatTimer = null, this._padHoldTimer = null, this._padPulseTimer = null, this._onTilePointerDown = (t) => {
      t.button === 0 && (this._pressed = !0, this._longPressTriggered = !1, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, 420));
    }, this._onTilePointerUp = () => {
      this._clearLongPress(), this._pressed = !1;
    }, this._onTilePointerCancel = () => {
      this._clearLongPress(), this._pressed = !1;
    }, this._onTileClick = () => {
      if (this._longPressTriggered) {
        this._longPressTriggered = !1;
        return;
      }
      const t = this._config?.tap_action ?? "popup";
      if (t !== "none") {
        if (t === "navigate") {
          Ht(this, this.hass, this._config?.navigation_path);
          return;
        }
        if (t === "more-info" && this._config) {
          this._openMoreInfo(this._config.entity);
          return;
        }
        if (t === "toggle" && this.hass && this._config) {
          const e = this._config.entity.split(".")[0];
          this.hass.callService(e, "toggle", { entity_id: this._config.entity });
          return;
        }
        this.openPopup();
      }
    }, this._onDialPointerDown = (t) => {
      if (t.button !== 0) return;
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._dialDragging = !0;
      const i = this._pointerToTemp(t, e);
      this._dialTemp = i;
    }, this._onDialPointerMove = (t) => {
      if (!this._dialDragging) return;
      const e = this._pointerToTemp(t, t.currentTarget);
      e !== this._dialTemp && (this._dialTemp = e);
    }, this._onDialPointerUp = (t) => {
      if (!this._dialDragging) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._dialTemp !== null && this._setClimateTemp(this._dialTemp), this._dialDragging = !1, this._dialTemp = null;
    }, this._onVolPointerDown = (t) => {
      if (t.button !== 0) return;
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._volPendingTimer !== null && (window.clearTimeout(this._volPendingTimer), this._volPendingTimer = null), this._volDragging = !0, this._updateVolFromPointer(t.clientX, e, !1);
    }, this._onVolPointerMove = (t) => {
      this._volDragging && this._updateVolFromPointer(t.clientX, t.currentTarget, !1);
    }, this._onVolPointerUp = (t) => {
      if (!this._volDragging) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._updateVolFromPointer(t.clientX, e, !0), this._volDragging = !1, this._volPendingTimer = window.setTimeout(() => {
        this._volPct = null, this._volPendingTimer = null;
      }, 900);
    }, this._onPadPointerDown = (t) => {
      if (t.button !== 0) return;
      t.currentTarget.setPointerCapture(t.pointerId), this._padPointerId = t.pointerId, this._padStartX = t.clientX, this._padStartY = t.clientY, this._padSwiped = !1, this._padDir = null, this._padActive = !0, this._padOffsetX = 0, this._padOffsetY = 0;
    }, this._onPadPointerMove = (t) => {
      if (this._padPointerId !== t.pointerId) return;
      const i = t.currentTarget.getBoundingClientRect(), s = t.clientX - this._padStartX, r = t.clientY - this._padStartY, a = Math.max(24, i.width / 2 - 28), o = Math.max(20, i.height / 2 - 28);
      if (this._padOffsetX = Math.max(-a, Math.min(a, s * 0.85)), this._padOffsetY = Math.max(-o, Math.min(o, r * 0.85)), Math.hypot(s, r) >= 24) {
        const c = Math.abs(s) >= Math.abs(r) ? s > 0 ? "dpad_right" : "dpad_left" : r > 0 ? "dpad_down" : "dpad_up";
        (!this._padSwiped || this._padDir !== c) && (this._padSwiped = !0, this._padDir = c, this._triggerRemoteKey(c), navigator.vibrate?.(12), this._startPadRepeat(c));
      }
    }, this._onPadPointerUp = (t) => {
      if (this._padPointerId !== t.pointerId) return;
      const e = t.currentTarget;
      e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId);
      const i = this._padSwiped;
      this._padPointerId = null, this._padActive = !1, this._padDir = null, this._padOffsetX = 0, this._padOffsetY = 0, this._padHoldTimer !== null && (window.clearTimeout(this._padHoldTimer), this._padHoldTimer = null), this._padRepeatTimer !== null && (window.clearInterval(this._padRepeatTimer), this._padRepeatTimer = null), !i && t.type === "pointerup" && (this._triggerRemoteKey("dpad_center"), navigator.vibrate?.(10), this._padTapPulse = !0, this._padPulseTimer !== null && window.clearTimeout(this._padPulseTimer), this._padPulseTimer = window.setTimeout(() => {
        this._padTapPulse = !1, this._padPulseTimer = null;
      }, 180));
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-status-card",
      entity: (t ? Object.keys(t.states).find(
        (i) => i.startsWith("binary_sensor.") || i.startsWith("climate.") || i.startsWith("media_player.") || i.startsWith("sensor.")
      ) : void 0) ?? "binary_sensor.motion",
      popup_type: "auto",
      tap_action: "popup"
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-status-card-editor");
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-status-card: you must define an entity");
    this._config = {
      popup_type: "auto",
      tap_action: "popup",
      hold_action: "popup",
      subtitle_format: "auto",
      ...t
    }, this._syncRelativeTimer(), this._ensureFeatures();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncRelativeTimer(), this._ensureFeatures();
  }
  _ensureFeatures() {
    (this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded && Gi().then((t) => {
      t && (this._featuresLoaded = !0);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress(), this._clearPadTimers(), this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
  }
  _syncRelativeTimer() {
    const t = this._config?.subtitle_format === "relative";
    t && this._relativeTimer === null ? this._relativeTimer = window.setInterval(() => {
      this._relativeTick++;
    }, 3e4) : !t && this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  getCardSize() {
    const t = this._config?.features?.length ?? 0, e = this._config?.features_position === "inline";
    return t > 0 && !e ? 2 + t : 2;
  }
  getGridOptions() {
    const t = this._config?.features?.length ?? 0, e = this._config?.features_position === "inline";
    return t > 0 ? e ? { rows: "auto", columns: 12, min_columns: 6 } : { rows: 1 + t, columns: 6, min_columns: 3 } : { rows: "auto", columns: 6, min_columns: 3 };
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_pressed") || t.has("_popupOpen") || t.has("_dialDragging") || t.has("_dialTemp") || t.has("_activeSheet") || t.has("_remoteSelectorSheet") || t.has("_volDragging") || t.has("_volPct") || t.has("_historyPoints") || t.has("_historyLoading") || t.has("_historyHoverIdx") || t.has("_relativeTick") || t.has("_featuresLoaded") || t.has("_artPalette") || t.has("_padOffsetX") || t.has("_padOffsetY") || t.has("_padActive") || t.has("_padTapPulse"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      if ((this._config.features?.length ?? 0) > 0)
        return !0;
      const e = [
        this._config.entity,
        this._config.status_entity,
        this._config.subtitle_entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...(this._config.extra_entities ?? []).slice(0, 10),
        ...this._getSiblingEntityIds(),
        ...this._resolvedPopupType === "power_strip" ? this._getPowerStripEntities().map((s) => s.entity_id) : []
      ].filter(Boolean);
      let i = !1;
      for (const s of e) {
        const r = this.hass.states[s];
        r !== this._prevStates[s] && (this._prevStates[s] = r, i = !0);
      }
      return i;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  /** Entity used to compute active/inactive state & subtitle (defaults to primary entity). */
  get _statusEntity() {
    if (!(!this.hass || !this._config))
      return this._config.status_entity ? this.hass.states[this._config.status_entity] ?? this._entity : this._entity;
  }
  /**
   * Resolves the media_player entity for Media popups (auto-discovers sibling media_player.*
   * on the same device_id when the card is configured with an Android TV remote.* entity).
   */
  get _mediaEntity() {
    if (!this.hass || !this._config) return;
    if (this._config.entity.startsWith("media_player.")) return this._entity;
    const t = this.hass.entities?.[this._config.entity]?.device_id;
    if (t && this.hass.entities) {
      for (const [e, i] of Object.entries(this.hass.entities))
        if (i.device_id === t && e.startsWith("media_player.")) {
          const s = this.hass.states[e];
          if (s) return s;
        }
    }
    return this._entity;
  }
  /**
   * Auto-discovers sibling sensor entities belonging to the exact same Home Assistant device_id
   * (e.g. humidity on a thermometer device, or temperature/illuminance/battery on a motion sensor).
   */
  _getSiblingEntityIds() {
    if (!this.hass?.entities || !this._config) return [];
    const t = this._config.entity, e = this.hass.entities[t]?.device_id;
    if (!e) return [];
    const i = [];
    for (const [s, r] of Object.entries(this.hass.entities))
      s !== t && r.device_id === e && (s.startsWith("sensor.") || s.startsWith("media_player.")) && i.push(s);
    return i;
  }
  _getSiblingSensors() {
    if (!this.hass) return [];
    const t = [], e = /* @__PURE__ */ new Set();
    if (this._config?.secondary_entity) {
      const r = this.hass.states[this._config.secondary_entity];
      r && (t.push(r), e.add(r.entity_id));
    }
    const i = [
      "power",
      "energy",
      "current",
      "voltage",
      "temperature",
      "humidity",
      "illuminance",
      "pressure",
      "atmospheric_pressure",
      "co2",
      "pm25",
      "battery"
    ], s = this._getSiblingEntityIds().map((r) => this.hass.states[r]).filter((r) => !!r && !e.has(r.entity_id));
    s.sort((r, a) => {
      const o = i.indexOf(String(r.attributes.device_class ?? "")), n = i.indexOf(String(a.attributes.device_class ?? ""));
      return (o === -1 ? 99 : o) - (n === -1 ? 99 : n);
    });
    for (const r of s) {
      const a = String(r.attributes.device_class ?? "");
      i.includes(a) && (t.push(r), e.add(r.entity_id));
    }
    if (Array.isArray(this._config?.extra_entities))
      for (const r of this._config.extra_entities.slice(0, 10)) {
        if (!r || e.has(r)) continue;
        const a = this.hass.states[r];
        a && (t.push(a), e.add(a.entity_id));
      }
    return t;
  }
  get _secondaryEntity() {
    return this._getSiblingSensors()[0];
  }
  get _outdoorEntity() {
    if (!(!this.hass || !this._config?.outdoor_entity))
      return this.hass.states[this._config.outdoor_entity];
  }
  get _resolvedPopupType() {
    const t = this._config?.popup_type ?? "auto";
    if (t !== "auto") return t;
    const e = this._config?.entity ?? "";
    if (e.startsWith("input_select.") || e.startsWith("select.")) return "selector";
    if (e.startsWith("climate.")) return "climate";
    if (e.startsWith("media_player.")) return "media";
    if (e.startsWith("remote.")) {
      const i = this._mediaEntity;
      return i && i.entity_id.startsWith("media_player.") ? "media" : "remote";
    }
    return "sensor";
  }
  /**
   * Resolves all toggleable outlets for the Power Strip popup:
   * - If `extra_entities` are explicitly configured, uses those (up to 10).
   * - Otherwise auto-discovers all switch.* / light.* / input_boolean.* entities on the same device_id.
   */
  _getPowerStripEntities() {
    if (!this.hass || !this._config) return [];
    const t = [], e = /* @__PURE__ */ new Set();
    if (Array.isArray(this._config.extra_entities) && this._config.extra_entities.length > 0) {
      for (const o of this._config.extra_entities.slice(0, 10)) {
        if (!o || e.has(o)) continue;
        const n = this.hass.states[o];
        n && (t.push(n), e.add(o));
      }
      return t;
    }
    const i = this._config.entity, s = this.hass.states[i], r = (o) => o.startsWith("switch.") || o.startsWith("light.") || o.startsWith("input_boolean.");
    s && r(i) && (t.push(s), e.add(i));
    const a = this.hass.entities?.[i]?.device_id;
    if (a && this.hass.entities) {
      const o = [];
      for (const [n, c] of Object.entries(this.hass.entities))
        if (c.device_id === a && !e.has(n) && r(n)) {
          const p = this.hass.states[n];
          p && (o.push(p), e.add(n));
        }
      o.sort(
        (n, c) => this._cleanSiblingLabel(n).localeCompare(this._cleanSiblingLabel(c), void 0, {
          numeric: !0
        })
      ), t.push(...o);
    }
    return t;
  }
  get _isActive() {
    if (this._resolvedPopupType === "power_strip") {
      const i = this._getPowerStripEntities();
      if (i.length > 0)
        return i.some((s) => s.state === "on");
    }
    const t = this._statusEntity, e = String(t?.state ?? "").toLowerCase();
    return !e || e === "unavailable" || e === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(e) : t?.entity_id.startsWith("sensor.") && !Number.isNaN(Number(e)) ? !1 : ma.has(e);
  }
  get _isUnavailable() {
    const t = this._statusEntity?.state;
    return !t || t === "unavailable" || t === "unknown";
  }
  get _stateLabel() {
    if (this._resolvedPopupType === "power_strip") {
      const n = this._getPowerStripEntities();
      if (n.length > 0) {
        if (n.every(
          (d) => d.state === "unavailable" || d.state === "unknown"
        )) return "Offline";
        const p = n.filter((d) => d.state === "on").length;
        return p > 0 ? this._config?.label_active || `${p} on` : this._config?.label_inactive || "Off";
      }
    }
    const t = this._statusEntity;
    if (!t) return "Offline";
    const e = t.state;
    if (e === "unavailable" || e === "unknown") return "Offline";
    const i = this._config?.subtitle_format ?? "auto", s = !!(this._config?.subtitle_entity?.trim() || this._config?.subtitle_attribute?.trim()), r = this._config?.subtitle_visibility ?? (this._config?.subtitle_only_when_active ? "on" : "both"), a = r === "both" || r === "on" && this._isActive || r === "off" && !this._isActive;
    if (s && a) {
      const n = this._config?.subtitle_entity?.trim() ? this.hass?.states[this._config.subtitle_entity.trim()] : t;
      if (n) {
        const c = this._config?.subtitle_attribute?.trim();
        let p;
        if (c)
          p = n.attributes[c];
        else {
          const d = n.state;
          if (d !== "unavailable" && d !== "unknown") {
            const g = n.attributes.unit_of_measurement;
            p = g ? `${d}${g}` : d;
          }
        }
        if (p != null && String(p).trim() !== "") {
          const d = te(String(p), i), g = this._config?.subtitle_prefix ?? "", u = this._config?.subtitle_suffix ?? "";
          return `${g}${d}${u}`;
        }
      }
    }
    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;
    const o = t.entity_id.split(".")[0];
    if (o === "climate") {
      const n = e.charAt(0).toUpperCase() + e.slice(1), c = t.attributes.temperature;
      return e !== "off" && typeof c == "number" ? `${n} ${c}` : n;
    }
    if (o === "sensor") {
      if (ee.test(e.trim()))
        return te(e, i);
      const n = t.attributes.unit_of_measurement, c = n ? `${e}${n}` : e;
      if (t.attributes.device_class === "temperature" || n === "°C" || n === "°F") {
        const d = this._getSiblingSensors().find(
          (g) => g.attributes.device_class === "humidity" || g.attributes.unit_of_measurement === "%"
        );
        if (d && d.state !== "unavailable" && d.state !== "unknown")
          return `${c} • ${d.state}${d.attributes.unit_of_measurement ?? "%"}`;
      }
      return c;
    }
    return o === "media_player" ? e.charAt(0).toUpperCase() + e.slice(1) : ee.test(e.trim()) ? te(e, i) : e.charAt(0).toUpperCase() + e.slice(1);
  }
  _isNumericHistoryEntity(t) {
    if (!t || !t.entity_id.startsWith("sensor.")) return !1;
    const e = String(t.attributes.device_class ?? "").toLowerCase();
    if (ua.has(e)) return !0;
    const i = String(t.attributes.unit_of_measurement ?? "").trim();
    return i === "°C" || i === "°F";
  }
  _resolveHistoryEntity() {
    return this._isNumericHistoryEntity(this._entity) ? this._entity : this._getSiblingSensors().find((t) => this._isNumericHistoryEntity(t));
  }
  async _fetchHistory() {
    if (!this.hass) return;
    const t = this._resolveHistoryEntity();
    if (!t) {
      this._historyPoints = [], this._historyEntityId = null;
      return;
    }
    this._historyEntityId = t.entity_id, this._historyLoading = !0, this._historyHoverIdx = null;
    try {
      const e = /* @__PURE__ */ new Date(), i = new Date(e.getTime() - 1440 * 60 * 1e3);
      let s = [];
      typeof this.hass.callWS == "function" ? s = (await this.hass.callWS({
        type: "history/history_during_period",
        start_time: i.toISOString(),
        end_time: e.toISOString(),
        entity_ids: [t.entity_id],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      }))?.[t.entity_id] ?? [] : typeof this.hass.callApi == "function" && (s = (await this.hass.callApi(
        "GET",
        `history/period/${i.toISOString()}?filter_entity_id=${encodeURIComponent(t.entity_id)}&minimal_response&no_attributes`
      ))?.[0] ?? []);
      const r = [];
      for (const o of s) {
        const n = Number(o.s ?? o.state);
        if (Number.isNaN(n)) continue;
        const c = typeof o.lu == "number" ? o.lu * 1e3 : o.last_updated ? Date.parse(o.last_updated) : NaN;
        Number.isNaN(c) || r.push({ t: c, v: n });
      }
      const a = 44;
      if (r.length > a) {
        const o = (r.length - 1) / (a - 1), n = [];
        for (let c = 0; c < a; c++)
          n.push(r[Math.round(c * o)]);
        this._historyPoints = n;
      } else
        this._historyPoints = r;
    } catch {
      this._historyPoints = [];
    } finally {
      this._historyLoading = !1;
    }
  }
  /* =========================================================================
     POPUP OPEN / CLOSE (Material You Container Transform / Bottom Sheet)
     ========================================================================= */
  async openPopup(t) {
    if (this._resolvedPopupType === "none" || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const e = t ?? this._tileEl?.getBoundingClientRect();
    this._activeSheet = null, this._remoteSelectorSheet = null, this._popupOpen = !0, (this._resolvedPopupType === "sensor" || this._resolvedPopupType === "custom") && this._fetchHistory(), await this.updateComplete;
    const i = this._dialogEl, s = this._dialogSurfaceEl;
    i && (i.open || i.showModal(), yt(s, e));
  }
  closePopup() {
    xt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._activeSheet = null, this._remoteSelectorSheet = null;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        Ht(this, this.hass, this._config.navigation_path);
        return;
      }
      if (t === "more-info") {
        this._openMoreInfo(this._config.entity);
        return;
      }
      this.openPopup();
    }
  }
  /* =========================================================================
     CLIMATE DIAL INTERACTION (Arc Drag with Morphing Radial Thumb)
     ========================================================================= */
  get _climateMin() {
    return Number(this._entity?.attributes.min_temp ?? 7);
  }
  get _climateMax() {
    return Number(this._entity?.attributes.max_temp ?? 30);
  }
  get _climateTarget() {
    return this._dialDragging && this._dialTemp !== null ? this._dialTemp : Number(this._entity?.attributes.temperature ?? 20);
  }
  get _climateCurrent() {
    const t = this._entity?.attributes.current_temperature;
    if (typeof t == "number") return t;
    const e = this._secondaryEntity?.state;
    return e && !Number.isNaN(Number(e)) ? Number(e) : null;
  }
  _tempToDeg(t) {
    const e = Math.max(
      0,
      Math.min(1, (t - this._climateMin) / (this._climateMax - this._climateMin))
    );
    return _e + e * Et;
  }
  _pointerToTemp(t, e) {
    const i = e.getBoundingClientRect(), s = i.left + i.width / 2, r = i.top + i.height / 2;
    let a = Math.atan2(t.clientY - r, t.clientX - s) * 180 / Math.PI;
    a < 0 && (a += 360);
    let o = (a - _e + 360) % 360;
    o > Et && (o = o > Et + (360 - Et) / 2 ? 0 : Et);
    const n = o / Et, c = this._climateMin + n * (this._climateMax - this._climateMin);
    return Math.round(c * 2) / 2;
  }
  _setClimateTemp(t) {
    if (!this.hass || !this._config) return;
    const e = Math.max(this._climateMin, Math.min(this._climateMax, Math.round(t * 2) / 2));
    this.hass.callService("climate", "set_temperature", {
      entity_id: this._config.entity,
      temperature: e
    });
  }
  _setClimateMode(t) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this._config.entity,
      hvac_mode: t
    }), this._activeSheet = null);
  }
  _setClimatePreset(t) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_preset_mode", {
      entity_id: this._config.entity,
      preset_mode: t
    }), this._activeSheet = null);
  }
  _setClimateFan(t) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_fan_mode", {
      entity_id: this._config.entity,
      fan_mode: t
    }), this._activeSheet = null);
  }
  _setClimateSwing(t) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_swing_mode", {
      entity_id: this._config.entity,
      swing_mode: t
    }), this._activeSheet = null);
  }
  /* =========================================================================
     MEDIA VOLUME PILL INTERACTION
     ========================================================================= */
  get _mediaVolumePct() {
    if (this._volPct !== null) return this._volPct;
    const t = this._mediaEntity?.attributes.volume_level;
    return typeof t == "number" ? Math.round(t * 100) : 0;
  }
  _updateVolFromPointer(t, e, i) {
    const s = e.getBoundingClientRect();
    if (s.width <= 0) return;
    const r = Math.round(Math.max(0, Math.min(1, (t - s.left) / s.width)) * 100);
    this._volPct = r;
    const a = this._mediaEntity;
    i && this.hass && a && this.hass.callService("media_player", "volume_set", {
      entity_id: a.entity_id,
      volume_level: Number((r / 100).toFixed(2))
    });
  }
  _callMediaService(t, e = {}) {
    const i = this._mediaEntity;
    !this.hass || !i || this.hass.callService("media_player", t, {
      entity_id: i.entity_id,
      ...e
    });
  }
  _openMoreInfo(t, e) {
    this.closePopup(), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: e ? { entityId: t, view: e } : { entityId: t }
      })
    );
  }
  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  _renderEntityIcon(t) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${t}></ha-icon>`;
    const e = this._statusEntity ?? this._entity;
    if (this._config?.use_entity_icon && e && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${e}></ha-state-icon>`;
      const i = e.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${i}></ha-icon>`;
    }
    return Tt(e, this._isActive, this._resolvedPopupType);
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _cleanSiblingLabel(t) {
    const e = String(t.attributes.device_class ?? ""), i = (t.attributes.friendly_name || "").trim();
    if (!i)
      return e ? e.replace(/_/g, " ").replace(/^./, (n) => n.toUpperCase()) : "Sensor";
    const s = (n, c) => {
      const p = c.trim();
      if (!p || n.length <= p.length) return null;
      if (n.toLowerCase().startsWith(p.toLowerCase())) {
        const d = n.slice(p.length).replace(/^[\s\-–—:]+/, "").trim();
        if (d) return d.charAt(0).toUpperCase() + d.slice(1);
      }
      return null;
    }, r = this.hass?.entities?.[t.entity_id]?.device_id, a = r ? this.hass?.devices?.[r] : void 0;
    for (const n of [
      a?.name_by_user,
      a?.name,
      typeof this._config?.name == "string" ? this._config.name : void 0,
      this._entity?.attributes.friendly_name
    ])
      if (n) {
        const c = s(i, n);
        if (c) return c;
      }
    const o = (this._entity?.attributes.friendly_name || "").trim();
    if (o) {
      const n = o.split(/\s+/), c = i.split(/\s+/);
      let p = 0;
      for (; p < n.length && p < c.length - 1 && n[p].toLowerCase() === c[p].toLowerCase(); )
        p++;
      if (p > 0) {
        const d = c.slice(p).join(" ").replace(/^[\s\-–—:]+/, "").trim();
        if (d) return d.charAt(0).toUpperCase() + d.slice(1);
      }
    }
    return i;
  }
  _renderSiblingIcon(t) {
    if (typeof customElements < "u" && customElements.get("ha-state-icon"))
      return l`<ha-state-icon class="mini-ha-icon" .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
    const e = String(t.attributes.device_class ?? "");
    return e === "humidity" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : e === "illuminance" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : e === "battery" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
  }
  _renderHistoryChart() {
    const t = this._historyEntityId ? this.hass?.states[this._historyEntityId] : this._resolveHistoryEntity();
    if (!t) return h;
    const e = String(t.attributes.unit_of_measurement ?? ""), i = this._historyEntityId === this._entity?.entity_id ? "Last 24 hours" : `${this._cleanSiblingLabel(t)} • 24h`;
    if (this._historyLoading)
      return l`
        <div class="history-card">
          <div class="history-header">
            <span class="history-title">${i}</span>
            <span class="history-range">Loading…</span>
          </div>
          <div class="history-skeleton"></div>
        </div>
      `;
    const s = this._historyPoints;
    if (s.length < 2) return h;
    const r = Math.min(...s.map((_) => _.v)), a = Math.max(...s.map((_) => _.v)), o = a - r || 1, n = s[0].t, c = s[s.length - 1].t, p = c - n || 1, d = 320, g = 104, u = 6, m = 12, f = s.map((_) => ({
      x: u + (_.t - n) / p * (d - u * 2),
      y: g - m - (_.v - r) / o * (g - m * 2),
      ..._
    }));
    let y = `M ${f[0].x.toFixed(1)} ${f[0].y.toFixed(1)}`;
    for (let _ = 1; _ < f.length; _++) {
      const H = f[_ - 1], S = f[_], E = ((H.x + S.x) / 2).toFixed(1);
      y += ` C ${E} ${H.y.toFixed(1)}, ${E} ${S.y.toFixed(1)}, ${S.x.toFixed(1)} ${S.y.toFixed(1)}`;
    }
    const b = `${y} L ${f[f.length - 1].x.toFixed(1)} ${g} L ${f[0].x.toFixed(1)} ${g} Z`, C = this._historyHoverIdx, w = C !== null ? f[C] : f[f.length - 1], $ = (_) => new Date(_).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), k = (_) => {
      const S = _.currentTarget.getBoundingClientRect();
      if (S.width <= 0) return;
      const E = Math.max(0, Math.min(1, (_.clientX - S.left) / S.width));
      this._historyHoverIdx = Math.round(E * (f.length - 1));
    }, M = `m3e-hist-${this._historyEntityId?.replace(/[^a-z0-9]/gi, "_") ?? "g"}`;
    return l`
      <div class="history-card">
        <div class="history-header">
          <span class="history-title">${i}</span>
          <span class="history-range">
            ${C !== null ? `${w.v}${e} · ${$(w.t)}` : `${r}${e} – ${a}${e}`}
          </span>
        </div>

        <svg
          class="history-svg"
          viewBox="0 0 ${d} ${g}"
          preserveAspectRatio="none"
          @pointerdown=${k}
          @pointermove=${(_) => {
      (_.buttons > 0 || _.pointerType === "mouse") && k(_);
    }}
          @pointerleave=${() => this._historyHoverIdx = null}
        >
          ${ze`
            <defs>
              <linearGradient id=${M} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1=${u} y1=${m} x2=${d - u} y2=${m} class="history-grid-line" />
            <line x1=${u} y1=${g / 2} x2=${d - u} y2=${g / 2} class="history-grid-line" />
            <line x1=${u} y1=${g - m} x2=${d - u} y2=${g - m} class="history-grid-line" />
            <path d=${b} fill="url(#${M})" />
            <path d=${y} class="history-line" />
            ${C !== null ? ze`<line x1=${w.x} y1=${m} x2=${w.x} y2=${g - m} class="history-cursor-line" />` : h}
            <circle cx=${w.x} cy=${w.y} r="4.5" class="history-dot" />
          `}
        </svg>

        <div class="history-axis">
          <span>${$(n)}</span>
          <span>${$((n + c) / 2)}</span>
          <span>${$(c)}</span>
        </div>
      </div>
    `;
  }
  get _toggleablePowerEntity() {
    const t = [this._entity, this._statusEntity].filter(Boolean);
    for (const e of t) {
      const i = e.entity_id.split(".")[0];
      if (i === "light" || i === "switch" || i === "input_boolean")
        return e;
    }
  }
  get _defaultRingStateLabel() {
    const t = this._entity ?? this._statusEntity;
    if (!t) return "Offline";
    const e = String(t.state ?? "").trim(), i = e.toLowerCase();
    if (!e || i === "unavailable" || i === "unknown") return "Offline";
    const s = t.entity_id.split(".")[0], r = String(t.attributes.device_class ?? "").toLowerCase();
    if (s === "sensor") {
      if (ee.test(e))
        return te(e, "auto");
      const a = t.attributes.unit_of_measurement;
      return a ? `${e}${a}` : e;
    }
    if (s === "binary_sensor") {
      const a = i === "on";
      return r === "door" || r === "window" || r === "opening" || r === "garage_door" ? a ? "Open" : "Closed" : r === "motion" || r === "occupancy" || r === "presence" ? a ? "Detected" : "Clear" : r === "lock" ? a ? "Unlocked" : "Locked" : r === "connectivity" || r === "plug" ? a ? "Connected" : "Disconnected" : r === "moisture" || r === "smoke" || r === "gas" ? a ? "Detected" : "Clear" : a ? "On" : "Off";
    }
    return i === "home" ? "Home" : i === "not_home" ? "Away" : i === "on" ? "On" : i === "off" ? "Off" : e.replace(/_/g, " ").replace(/^./, (a) => a.toUpperCase());
  }
  _togglePowerEntity(t) {
    if (!this.hass) return;
    const e = t.entity_id.split(".")[0], i = t.state === "on";
    this.hass.callService(e, i ? "turn_off" : "turn_on", {
      entity_id: t.entity_id
    });
  }
  _openEntityMoreInfo(t) {
    const e = this._dialogEl;
    e?.open && e.close(), this._popupOpen = !1, this._activeSheet = null, this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _renderSensorPopup(t) {
    const e = this._getSiblingSensors(), i = !!this._toggleablePowerEntity;
    return l`
      ${i ? h : l`
            <div class="sensor-hero">
              <div class="sensor-ring ${this._isActive ? "is-active" : ""}">
                <span class="sensor-ring-icon">${this._renderEntityIcon(t)}</span>
                <span class="sensor-ring-state">${this._defaultRingStateLabel}</span>
                <span class="sensor-ring-sub">
                  ${this._entity?.attributes.device_class ? String(this._entity.attributes.device_class).replace(
      /^./,
      (s) => s.toUpperCase()
    ) : "Status"}
                </span>
              </div>
            </div>
          `}

      ${e.length > 0 ? l`
            <div class="modular-stack">
              ${e.map((s) => {
      const r = this._cleanSiblingLabel(s), a = String(s.state ?? ""), o = a === "unavailable" || a === "unknown" ? "Offline" : ee.test(a.trim()) || Ki.test(a.trim()) ? te(a, "auto") : `${a}${s.attributes.unit_of_measurement ?? ""}`;
      return l`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(s.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(s)}
                      <span class="info-pill-label">${r}</span>
                    </span>
                    <span class="info-pill-right">
                      <span class="info-pill-val">${o}</span>
                      <svg viewBox="0 0 24 24" class="info-pill-chevron" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                        />
                      </svg>
                    </span>
                  </button>
                `;
    })}
            </div>
          ` : h}

      ${this._renderHistoryChart()}
    `;
  }
  _renderClimatePopup() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "off", s = this._climateTarget, r = this._climateCurrent, a = this._outdoorEntity, o = Math.floor(s), n = Math.abs(s - o - 0.5) < 0.05, c = this._tempToDeg(s), p = r !== null ? this._tempToDeg(r) : null, d = 140, g = 140, u = 114, m = va(d, g, u, _e, _e + Et), f = re(d, g, u, c), y = p !== null ? re(d, g, u, p) : null, b = p !== null ? re(d, g, u - 22, p) : null, C = Array.isArray(t?.attributes.hvac_modes) ? t.attributes.hvac_modes : ["heat", "cool", "off"], w = Array.isArray(t?.attributes.preset_modes) ? t.attributes.preset_modes : [], $ = Array.isArray(t?.attributes.fan_modes) ? t.attributes.fan_modes : [], k = Array.isArray(t?.attributes.swing_modes) ? t.attributes.swing_modes : [], M = String(t?.attributes.preset_mode ?? "none"), _ = String(t?.attributes.fan_mode ?? "auto"), H = String(t?.attributes.swing_mode ?? "off"), S = typeof t?.attributes.current_humidity == "number" ? `${t.attributes.current_humidity}%` : this._getSiblingSensors().find((D) => D.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((D) => D.attributes.device_class === "humidity").state}%` : null, E = w.length > 0, R = $.length > 0, wt = k.length > 0, X = e === "heat" || e === "heating" ? "mode-heat" : e === "cool" || e === "cooling" ? "mode-cool" : "mode-off", tt = (D) => D.replace(/_/g, " ").replace(/^./, (me) => me.toUpperCase()), et = this._activeSheet === "mode" ? { title: "Select a mode", options: C, current: e, onSelect: (D) => this._setClimateMode(D) } : this._activeSheet === "preset" ? { title: "Select preset", options: w, current: M, onSelect: (D) => this._setClimatePreset(D) } : this._activeSheet === "fan" ? { title: "Fan speed", options: $, current: _, onSelect: (D) => this._setClimateFan(D) } : this._activeSheet === "swing" ? { title: "Swing mode", options: k, current: H, onSelect: (D) => this._setClimateSwing(D) } : null;
    return l`
      <div class="climate-hero ${X} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${d} cy=${g} r="132" class="dial-bg-circle" />
            <path d=${m} class="dial-arc-track" />

            ${y && b ? ze`
                  <circle cx=${y.x} cy=${y.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${b.x}
                    y=${b.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(r)}
                  </text>
                ` : h}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) rotate(${c.toFixed(1)})">
              <rect
                class="dial-thumb-pill"
                x=${this._dialDragging ? -14 : -5}
                y=${this._dialDragging ? -3.5 : -5}
                width=${this._dialDragging ? 28 : 10}
                height=${this._dialDragging ? 7 : 10}
                rx="5"
              />
            </g>
          </svg>

          <div class="dial-center">
            ${i && !this._dialDragging ? l`<span class="dial-readout-off">Off</span>` : l`
                  <span class="dial-readout-num">
                    ${o}${n ? l`<sup>5</sup>` : h}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(D) => D.stopPropagation()}>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Decrease temperature"
                @click=${() => this._setClimateTemp(s - 0.5)}
              >
                −
              </button>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Increase temperature"
                @click=${() => this._setClimateTemp(s + 0.5)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Adaptive Row 1: Mode (full pill if alone, or 2-col with Preset like Daikin) -->
        <div class="${E ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${E ? "compact-trait" : ""} ${X}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${e === "heat" ? l`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : e === "cool" ? l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${tt(e)}</span>
            </span>
          </button>

          ${E ? l`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${tt(M)}</span>
                  </span>
                  <span class="trait-chevron">${ht}</span>
                </button>
              ` : h}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${R || wt ? l`
              <div class="${R && wt ? "climate-grid-2" : ""}">
                ${R ? l`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "fan"}
                      >
                        <span class="trait-left">
                          <svg viewBox="0 0 24 24" class="mini-svg">
                            <path
                              fill="currentColor"
                              d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
                            />
                          </svg>
                          <span class="mode-pill-text">
                            <span class="mode-pill-title">Fan speed</span>
                            <span class="mode-pill-val">${tt(_)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">${ht}</span>
                      </button>
                    ` : h}

                ${wt ? l`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${tt(H)}</span>
                        </span>
                        <span class="trait-chevron">${ht}</span>
                      </button>
                    ` : h}
              </div>
            ` : h}

        ${r !== null || a || S ? l`
              <div class="telemetry-card">
                ${r !== null ? l`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${r}°</strong>
                      </div>
                    ` : h}
                ${S ? l`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${S}</strong>
                      </div>
                    ` : h}
                ${a ? l`
                      <div class="telemetry-row">
                        <span>${x(this.hass, "outdoor_temperature")}</span>
                        <strong>${a.state}${a.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : h}
              </div>
            ` : h}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${et ? l`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(D) => D.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ${ht}
                  </button>
                  <span>${et.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${et.options.map((D) => {
      const me = D.toLowerCase() === et.current.toLowerCase(), Qi = this._activeSheet === "mode" ? D === "heat" ? "mode-heat" : D === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return l`
                      <button
                        type="button"
                        class="mode-option ${me ? `selected ${Qi}` : ""}"
                        @click=${() => et.onSelect(D)}
                      >
                        <span>${tt(D)}</span>
                        ${me ? l`<span class="check-mark">✓</span>` : h}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : h}
    `;
  }
  _clearPadTimers() {
    this._padHoldTimer !== null && (window.clearTimeout(this._padHoldTimer), this._padHoldTimer = null), this._padRepeatTimer !== null && (window.clearInterval(this._padRepeatTimer), this._padRepeatTimer = null), this._padPulseTimer !== null && (window.clearTimeout(this._padPulseTimer), this._padPulseTimer = null);
  }
  _startPadRepeat(t) {
    this._padHoldTimer !== null && window.clearTimeout(this._padHoldTimer), this._padRepeatTimer !== null && window.clearInterval(this._padRepeatTimer), this._padHoldTimer = window.setTimeout(() => {
      this._padHoldTimer = null, this._padRepeatTimer = window.setInterval(() => {
        this._padDir === t && (this._triggerRemoteKey(t), navigator.vibrate?.(8));
      }, 220);
    }, 420);
  }
  _triggerRemoteKey(t) {
    !this.hass || !this._config || ti(
      this.hass,
      this._config.entity,
      t,
      this._config.remote_buttons,
      this._config.remote_device
    );
  }
  _renderRemotePopup() {
    const t = this._mediaEntity, e = t ?? this._entity, i = this._statusEntity ?? e, s = String(i?.state ?? "").toLowerCase(), r = !!s && s !== "unavailable" && s !== "unknown", a = r && s !== "off" && s !== "standby", o = e?.attributes.is_volume_muted, n = typeof o == "boolean", c = o === !0, p = String(t?.state ?? "").toLowerCase(), d = p === "playing", g = p === "paused", u = String(e?.attributes.source ?? "").trim(), m = Array.isArray(e?.attributes.source_list) ? Array.from(
      new Set(
        e.attributes.source_list.map((C) => String(C ?? "").trim()).filter(Boolean)
      )
    ) : [], f = u || x(this.hass, "sources"), y = String(e?.attributes.sound_mode ?? "").trim(), b = Array.isArray(e?.attributes.sound_mode_list) ? Array.from(
      new Set(
        e.attributes.sound_mode_list.map((C) => String(C ?? "").trim()).filter(Boolean)
      )
    ) : [];
    return l`
      <!-- Compact Google Home Gesture Touchpad -->
      <div
        class="remote-touchpad ${this._padActive ? "is-dragging" : ""}"
        role="application"
        aria-label="Navigation touchpad"
        @pointerdown=${this._onPadPointerDown}
        @pointermove=${this._onPadPointerMove}
        @pointerup=${this._onPadPointerUp}
        @pointercancel=${this._onPadPointerUp}
      >
        <span
          class="touchpad-dot ${this._padActive ? "is-dragging" : ""} ${this._padTapPulse ? "is-pulsing" : ""}"
          style="transform: translate3d(${this._padOffsetX}px, ${this._padOffsetY}px, 0)"
          aria-hidden="true"
        ></span>
      </div>

      <!-- 3 Essential Navigation Buttons: Back | Home | Assist -->
      <div class="remote-essential-row">
        <button
          type="button"
          class="essential-btn"
          aria-label="Back"
          @click=${() => this._triggerRemoteKey("back")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
          </svg>
        </button>

        <button
          type="button"
          class="essential-btn is-home"
          aria-label="Home"
          @click=${() => this._triggerRemoteKey("home")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
            />
          </svg>
        </button>

        <button
          type="button"
          class="essential-btn is-assist"
          aria-label="Assistant"
          @click=${() => this._triggerRemoteKey("assist")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9.2" cy="10.2" r="3.4" fill="currentColor" />
            <circle cx="16.4" cy="8.4" r="1.7" fill="currentColor" />
            <circle cx="15.4" cy="13.4" r="2.1" fill="currentColor" />
            <circle cx="19.5" cy="11.2" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div class="remote-hero">
        <div class="rocker-pill">
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume up"
            @click=${() => this._triggerRemoteKey("volume_up")}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>
          </button>
          <span class="rocker-divider"></span>
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume down"
            @click=${() => this._triggerRemoteKey("volume_down")}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM5 9v6h4l5 5V4L9 9H5Z"/></svg>
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Segmented M3 Pill: Unmute | Mute (highlights active state when reported) -->
        <div class="split-pill ${n ? "has-state" : ""}" role="group" aria-label="Audio">
          ${n ? l`<span class="split-indicator ${c ? "is-right" : "is-left"}" aria-hidden="true"></span>` : h}
          <button
            type="button"
            class="split-half ${n && !c ? "is-selected" : ""}"
            aria-pressed=${n ? String(!c) : "false"}
            @click=${() => this._triggerRemoteKey("unmute")}
          >
            ${x(this.hass, "unmute")}
          </button>
          ${n ? h : l`<span class="split-vdivider"></span>`}
          <button
            type="button"
            class="split-half ${n && c ? "is-selected" : ""}"
            aria-pressed=${n ? String(c) : "false"}
            @click=${() => this._triggerRemoteKey("mute")}
          >
            ${x(this.hass, "mute")}
          </button>
        </div>

        <!-- Segmented M3 Pill: On | Off (highlights active entity state like Light Control) -->
        <div class="split-pill ${r ? "has-state" : ""}" role="group" aria-label="Power">
          ${r ? l`<span class="split-indicator ${a ? "is-left" : "is-right"}" aria-hidden="true"></span>` : h}
          <button
            type="button"
            class="split-half ${r && a ? "is-selected" : ""}"
            aria-pressed=${r ? String(a) : "false"}
            @click=${() => this._triggerRemoteKey("power_on")}
          >
            ${x(this.hass, "on")}
          </button>
          ${r ? h : l`<span class="split-vdivider"></span>`}
          <button
            type="button"
            class="split-half ${r && !a ? "is-selected" : ""}"
            aria-pressed=${r ? String(!a) : "false"}
            @click=${() => this._triggerRemoteKey("power_off")}
          >
            ${x(this.hass, "off")}
          </button>
        </div>

        <!-- M3 Expressive Transport Row (Crisp SVGs + Shape Morphing Play/Pause) -->
        <div class="transport-row">
          <button
            type="button"
            class="transport-icon is-prev"
            aria-label=${x(this.hass, "previous")}
            @click=${() => this._triggerRemoteKey("prev")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
            </svg>
          </button>
          <button
            type="button"
            class="transport-circle ${d ? "is-active" : ""}"
            aria-label=${x(this.hass, "play")}
            aria-pressed=${String(d)}
            @click=${() => this._triggerRemoteKey("play")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="transport-circle ${g ? "is-active" : ""}"
            aria-label=${x(this.hass, "pause")}
            aria-pressed=${String(g)}
            @click=${() => this._triggerRemoteKey("pause")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
              <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="transport-icon is-next"
            aria-label=${x(this.hass, "next")}
            @click=${() => this._triggerRemoteKey("next")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
            </svg>
          </button>
        </div>

        <div class="channel-pill">
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel down"
            @click=${() => this._triggerRemoteKey("ch_down")}
          >
            ${ht}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteKey("ch_up")}
          >
            ${fa}
          </button>
        </div>

        <button
          type="button"
          class="secondary-action-card"
          @click=${() => {
      m.length > 0 && t ? this._remoteSelectorSheet = {
        title: x(this.hass, "sources"),
        options: m,
        current: u,
        onSelect: (C) => {
          this.hass?.callService("media_player", "select_source", {
            entity_id: t.entity_id,
            source: C
          });
        }
      } : e && this._openMoreInfo(e.entity_id);
    }}
        >
          <span>${f}</span>
          <span class="trait-chevron">${ht}</span>
        </button>

        ${b.length > 0 && t ? l`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => {
      this._remoteSelectorSheet = {
        title: "Sound mode",
        options: b,
        current: y,
        onSelect: (C) => {
          this.hass?.callService("media_player", "select_sound_mode", {
            entity_id: t.entity_id,
            sound_mode: C
          });
        }
      };
    }}
              >
                <span>${y || "Sound mode"}</span>
                <span class="trait-chevron">${ht}</span>
              </button>
            ` : h}

        ${Fi(
      this.hass,
      this._config.entity,
      this._config?.remote_custom_controls,
      this._config?.remote_buttons,
      this._config?.remote_device,
      (C) => {
        this._remoteSelectorSheet = C;
      },
      (C) => this._openMoreInfo(C)
    )}
      </div>

      ${this._remoteSelectorSheet ? l`
            <div class="mode-sheet-backdrop" @click=${() => this._remoteSelectorSheet = null}>
              <div class="mode-sheet" @click=${(C) => C.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._remoteSelectorSheet = null}
                    aria-label=${x(this.hass, "close")}
                  >
                    ${ht}
                  </button>
                  <span>${this._remoteSelectorSheet.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${this._remoteSelectorSheet.options.map((C) => {
      const w = C.toLowerCase() === this._remoteSelectorSheet.current.toLowerCase();
      return l`
                      <button
                        type="button"
                        class="mode-option ${w ? "selected mode-off" : ""}"
                        @click=${() => {
        this._remoteSelectorSheet?.onSelect(C), this._remoteSelectorSheet = null;
      }}
                      >
                        <span>${C}</span>
                        ${w ? l`<span class="check-mark">✓</span>` : h}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : h}
    `;
  }
  _openMediaControls(t) {
    if (this._config?.media_controls_action === "more-info") {
      this._openMoreInfo(t);
      return;
    }
    this.closePopup(), window.setTimeout(() => {
      this._mediaPopupEl?.open(void 0, !1);
    }, 220);
  }
  _renderMediaPopup() {
    const t = this._mediaEntity, e = !t || t.state === "idle" || t.state === "off", i = this._mediaVolumePct;
    return l`
      ${t ? l`
            <m3e-media-player-card
              class="embedded-media-player"
              .hass=${this.hass}
              .config=${{
      type: "custom:m3e-media-player-card",
      entity: t.entity_id,
      dynamic_color: !0,
      show_device_chip: !1,
      tap_action: "none"
    }}
              @click=${() => this._openMediaControls(t.entity_id)}
            ></m3e-media-player-card>
          ` : h}

      <div class="modular-stack">
        <!-- Shape Coding: Full Pill (9999px) for Active Primary Volume Slider -->
        <div
          class="volume-pill ${this._volDragging ? "is-dragging" : ""}"
          style="--vol-pct: ${i}%;"
          role="slider"
          tabindex="0"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${i}
          @pointerdown=${this._onVolPointerDown}
          @pointermove=${this._onVolPointerMove}
          @pointerup=${this._onVolPointerUp}
          @pointercancel=${this._onVolPointerUp}
        >
          <div class="volume-pill-fill"></div>
          <div class="volume-pill-content">
            <svg viewBox="0 0 24 24" class="mini-svg">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"
              />
            </svg>
            <span>${i}%</span>
          </div>
        </div>

        <!-- Primary action pill (Stop when active, Turn on when off) -->
        ${e ? t?.state === "off" ? l`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService("turn_on")}
                >
                  ${x(this.hass, "turn_on")}
                </button>
              ` : h : l`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callMediaService("media_stop")}
              >
                ${x(this.hass, "stop_casting")}
              </button>
            `}

        <!-- Secondary action: opens M3E Now Playing popup by default (or native HA More Info if configured) -->
        ${t ? l`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMediaControls(t.entity_id)}
              >
                <span>${x(this.hass, "media_controls")}</span>
                <span>↗</span>
              </button>
            ` : h}
      </div>
    `;
  }
  _selectOption(t) {
    if (!this.hass || !this._config?.entity) return;
    const e = this._config.entity.split(".")[0];
    this.hass.callService(e, "select_option", {
      entity_id: this._config.entity,
      option: t
    }), window.setTimeout(() => this.closePopup(), 160);
  }
  _renderSelectorOptionIcon(t, e) {
    const i = t.toLowerCase();
    return i.includes("away") || i.includes("fuori") || i.includes("assent") || i.includes("out") || i.includes("vacanz") ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3 2 9v12h7v-2H4v-9l6-4.5L15 9.25V11h2V8.25L10 3Zm7 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 6c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z"
          />
        </svg>
      ` : i.includes("night") || i.includes("nott") || i.includes("sleep") ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.3 4.9a7 7 0 0 0 6.8 9.2A8 8 0 1 1 12.3 4.9Z"
          />
        </svg>
      ` : i.includes("home") || i.includes("casa") || i.includes("present") ? e ? l`
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3 3 10v11h18V10l-9-7Zm0 5.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm4.5 9.5h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V18Z"
              />
            </svg>
          ` : l`
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3 3 10v11h18V10l-9-7Zm7 16H5v-8l7-5.44L19 11v8Zm-7-9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7.5h8v-.5c0-1.33-2.67-2-4-2s-4 .67-4 2v.5Z"
              />
            </svg>
          ` : e ? l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.5-4.5 1.4 1.4-5.9 5.9Z"
            />
          </svg>
        ` : l`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"
            />
          </svg>
        `;
  }
  _togglePowerStripAll(t) {
    if (!this.hass) return;
    const e = this._getPowerStripEntities();
    for (const i of e) {
      if (i.state === "unavailable" || i.state === "unknown" || i.state === "on" === t) continue;
      const s = i.entity_id.split(".")[0];
      this.hass.callService(s, t ? "turn_on" : "turn_off", {
        entity_id: i.entity_id
      });
    }
  }
  _renderPowerStripPopup() {
    const t = this._getPowerStripEntities(), e = new Set(t.map((s) => s.entity_id)), i = this._getSiblingSensors().filter((s) => !e.has(s.entity_id));
    return l`
      ${t.length === 0 ? l`
            <div class="selector-empty">
              Nessuna presa rilevata. Seleziona le entità della multipresa nelle impostazioni della
              card.
            </div>
          ` : l`
            <div class="power-strip-grid">
              ${t.map((s) => {
      const r = s.state === "unavailable" || s.state === "unknown", a = s.state === "on", o = this._cleanSiblingLabel(s), n = r ? "Offline" : a ? "On" : "Off";
      return l`
                  <button
                    type="button"
                    class="ps-tile ${a ? "is-on" : "is-off"} ${r ? "is-unavailable" : ""}"
                    role="switch"
                    aria-checked=${String(a)}
                    ?disabled=${r}
                    @click=${() => this._togglePowerEntity(s)}
                    @contextmenu=${(c) => {
        c.preventDefault(), this._openEntityMoreInfo(s.entity_id);
      }}
                  >
                    <span class="ps-tile-icon" aria-hidden="true">
                      ${Tt(s, a)}
                    </span>
                    <span class="ps-tile-meta">
                      <span class="ps-tile-title">${o}</span>
                      <span class="ps-tile-sub">${n}</span>
                    </span>
                  </button>
                `;
    })}
            </div>
          `}
      ${i.length > 0 ? l`
            <div class="modular-stack">
              ${i.map((s) => {
      const r = this._cleanSiblingLabel(s), a = `${s.state}${s.attributes.unit_of_measurement ?? ""}`;
      return l`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(s.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(s)}
                      <span class="info-pill-label">${r}</span>
                    </span>
                    <span class="info-pill-right">
                      <span class="info-pill-val">${a}</span>
                      <svg viewBox="0 0 24 24" class="info-pill-chevron" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                        />
                      </svg>
                    </span>
                  </button>
                `;
    })}
            </div>
          ` : h}
    `;
  }
  _renderSelectorPopup() {
    const t = this._entity, e = t?.attributes.options, i = Array.isArray(e) ? e.map(String) : [], s = t?.state ?? "";
    return i.length === 0 ? l`
        <div class="selector-empty">
          Nessuna opzione disponibile per questa entità. Collega un <code>input_select</code> o
          <code>select</code>.
        </div>
      ` : l`
      <div class="selector-list" role="radiogroup" aria-label="Seleziona opzione">
        ${i.map((r) => {
      const a = r === s;
      return l`
            <button
              type="button"
              class="selector-row ${a ? "is-selected" : ""}"
              role="radio"
              aria-checked=${String(a)}
              @click=${() => this._selectOption(r)}
            >
              <span class="selector-row-icon">
                ${this._renderSelectorOptionIcon(r, a)}
              </span>
              <span class="selector-row-label">${r}</span>
              <span class="m3-radio ${a ? "checked" : ""}" aria-hidden="true">
                <span class="m3-radio-dot"></span>
              </span>
            </button>
          `;
    })}
      </div>
    `;
  }
  get _entityPictureUrl() {
    if (!this._config?.show_entity_picture) return "";
    const t = this._entity;
    if (!t) return "";
    const e = String(t.state ?? "").toLowerCase();
    return e === "unavailable" || e === "unknown" || t.entity_id.startsWith("media_player.") && (e === "off" || e === "idle") ? "" : String(
      t.attributes.entity_picture_local || t.attributes.entity_picture || ""
    ).trim();
  }
  updated() {
    const t = this._entityPictureUrl;
    t !== this._lastArtUrl && (this._lastArtUrl = t, t ? Xe(t).then((e) => {
      this._lastArtUrl === t && (this._artPalette = e);
    }) : this._artPalette = null);
  }
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return h;
    const t = this._entity, e = dt(this.hass, t, this._config.name, this._config.entity), i = this._isActive, s = i ? this._config.icon_active?.trim() || void 0 : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || void 0, r = this._resolvedPopupType, a = this._config.tap_action === "navigate" || this._config.tap_action === "more-info" || this._config.tap_action !== "toggle" && this._config.tap_action !== "none" && r !== "none", o = `style-${this._config.card_style ?? "default"}`, n = this._popupOpen ? le(this._statusEntity?.last_changed) : null, c = this._config.features ?? [], p = c.length > 0, d = this._config.features_position ?? "bottom", g = !!this._config.hide_state, u = g ? null : jt(this.hass, t, this._config.state_content, this._stateLabel), m = g ? "" : u ?? this._stateLabel, f = this._entityPictureUrl, y = !!f, b = this.hass?.themes?.darkMode !== !1, C = y && this._artPalette ? `--art-bg: ${b ? this._artPalette.containerDark : this._artPalette.containerLight}; --art-fg: ${b ? this._artPalette.onContainerDark : this._artPalette.onContainerLight};` : "";
    return l`
      ${this.popupOnly ? h : l`
            <ha-card
              class="status-tile ${o} ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""} ${p ? `has-features features-${d}` : ""} ${y ? "has-entity-picture" : ""}"
              style=${C}
              role="button"
              tabindex="0"
              aria-label="${e}${m ? `, ${m}` : ""}"
              @pointerdown=${this._onTilePointerDown}
              @pointerup=${this._onTilePointerUp}
              @pointerleave=${this._onTilePointerCancel}
              @pointercancel=${this._onTilePointerCancel}
              @click=${this._onTileClick}
              @contextmenu=${(w) => {
      w.preventDefault(), this._handleHoldAction();
    }}
              @keydown=${(w) => {
      (w.key === "Enter" || w.key === " ") && (w.preventDefault(), this._onTileClick());
    }}
            >
              ${y ? l`
                    <div class="entity-picture-backdrop" aria-hidden="true">
                      <img class="entity-picture-img" src=${f} alt="" loading="lazy" />
                    </div>
                  ` : h}
              <div class="state-layer" aria-hidden="true"></div>
              <div class="tile-inner">
                ${y ? h : l`<span class="tile-icon">${this._renderEntityIcon(s)}</span>`}
                <div class="tile-meta">
                  <span class="tile-title">${e}</span>
                  ${m ? l`<span class="tile-subtitle">${m}</span>` : h}
                </div>
                ${this._isUnavailable ? l`
                      <span class="offline-badge" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                          />
                        </svg>
                      </span>
                    ` : a ? l`
                        <span class="tile-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                            />
                          </svg>
                        </span>
                      ` : h}
              </div>
              ${p ? l`
                    <div
                      class="features-wrap"
                      @click=${nt}
                      @pointerdown=${nt}
                      @pointerup=${nt}
                      @contextmenu=${nt}
                    >
                      <hui-card-features
                        .hass=${this.hass}
                        .context=${{ entity_id: this._config.entity }}
                        .stateObj=${this._entity}
                        .features=${c}
                        .position=${d}
                      ></hui-card-features>
                    </div>
                  ` : h}
            </ha-card>
          `}

      <dialog
        class="status-dialog"
        @click=${(w) => {
      w.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(w) => {
      w.preventDefault(), this.closePopup();
    }}
        @touchmove=${(w) => bt(w, this._dialogEl)}
      >
        ${this._popupOpen ? (() => {
      const w = r === "power_strip", $ = r === "sensor" || r === "custom" ? this._toggleablePowerEntity : void 0, k = w ? this._getPowerStripEntities() : [], M = !!$ || w && k.length > 0, _ = w ? k.some((S) => S.state === "on") : $?.state === "on", H = l`
                <button
                  type="button"
                  class="icon-btn"
                  @click=${() => this.closePopup()}
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                    />
                  </svg>
                </button>
              `;
      return l`
                <div class="dialog-surface">
                  <header class="dialog-header">
                    ${H}
                    <div class="dialog-title-wrap">
                      <span class="dialog-title">${e}</span>
                      ${n ? l`<span class="dialog-last-changed">${n}</span>` : h}
                    </div>
                    ${M ? l`
                          <button
                            type="button"
                            class="m3-header-switch ${_ ? "is-on" : ""}"
                            role="switch"
                            aria-checked=${String(_)}
                            aria-label=${_ ? "Spegni" : "Accendi"}
                            @click=${() => w ? this._togglePowerStripAll(!_) : $ && this._togglePowerEntity($)}
                          >
                            <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                          </button>
                        ` : r === "climate" || r === "media" ? l`
                            <button
                              type="button"
                              class="icon-btn"
                              aria-label=${x(this.hass, "history")}
                              title=${x(this.hass, "history_tooltip")}
                              @click=${() => this._openMoreInfo(
        r === "media" && this._mediaEntity ? this._mediaEntity.entity_id : this._config.entity,
        "history"
      )}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fill="currentColor"
                                  d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                                />
                              </svg>
                            </button>
                          ` : h}
                  </header>

                  ${r === "power_strip" ? this._renderPowerStripPopup() : r === "selector" ? this._renderSelectorPopup() : r === "sensor" || r === "custom" ? this._renderSensorPopup(s) : r === "climate" ? this._renderClimatePopup() : r === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
                </div>
              `;
    })() : h}
      </dialog>

      ${r === "media" && this._mediaEntity ? l`
            <m3e-media-popup
              .hass=${this.hass}
              .entityId=${this._mediaEntity.entity_id}
            ></m3e-media-popup>
          ` : h}
    `;
  }
};
O.styles = [
  U,
  Vi,
  I`
      :host {
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      .embedded-media-player {
        display: block;
        width: 100%;
        height: auto;
        margin-bottom: 14px;
      }

      /* Native HA Card Features Sub-Row */
      .status-tile.has-features.features-bottom {
        display: flex;
        flex-direction: column;
      }

      .status-tile.has-features.features-bottom .tile-inner {
        height: auto;
        min-height: 68px;
      }

      .status-tile.has-features.features-inline {
        display: flex;
        align-items: center;
      }

      .status-tile.has-features.features-inline .tile-inner {
        flex: 1 1 50%;
        min-width: 0;
      }

      .features-wrap {
        position: relative;
        z-index: 2;
        --feature-border-radius: 18px;
        --feature-color: var(--md-sys-color-primary, #4c5c92);
      }

      .status-tile.features-bottom .features-wrap {
        padding: 0 12px 12px;
      }

      .status-tile.features-inline .features-wrap {
        flex: 1 1 50%;
        min-width: 0;
        padding: 8px 12px 8px 0;
      }

      /* Left-side 1:1 radially dissolving Entity Picture with M3E artwork-derived tonal surface */
      ha-card.status-tile.has-entity-picture,
      ha-card.status-tile.has-entity-picture.is-active,
      ha-card.status-tile.has-entity-picture.is-inactive {
        background: var(
          --art-bg,
          var(--md-sys-color-primary-container, var(--ha-card-background, #24252d))
        );
        color: var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6));
      }

      ha-card.status-tile.has-entity-picture .tile-title {
        color: var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6));
        text-shadow: 0 1px 10px
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 72%,
            transparent
          );
      }

      ha-card.status-tile.has-entity-picture .tile-subtitle,
      ha-card.status-tile.has-entity-picture .tile-chevron {
        color: color-mix(
          in srgb,
          var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6)) 88%,
          transparent
        );
        text-shadow: 0 1px 8px
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 68%,
            transparent
          );
      }

      ha-card.status-tile.has-entity-picture .tile-inner {
        padding-inline-start: 16px;
      }

      .entity-picture-backdrop {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        height: 100%;
        width: 164px;
        max-width: 72%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
        -webkit-mask-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.94) 28%,
          rgba(0, 0, 0, 0.74) 48%,
          rgba(0, 0, 0, 0.44) 66%,
          rgba(0, 0, 0, 0.18) 82%,
          rgba(0, 0, 0, 0.05) 92%,
          rgba(0, 0, 0, 0) 100%
        );
        mask-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.94) 28%,
          rgba(0, 0, 0, 0.74) 48%,
          rgba(0, 0, 0, 0.44) 66%,
          rgba(0, 0, 0, 0.18) 82%,
          rgba(0, 0, 0, 0.05) 92%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      .entity-picture-backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to right,
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 46%,
            transparent
          ) 0%,
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 30%,
            transparent
          ) 58%,
          transparent 100%
        );
        pointer-events: none;
      }

      .status-tile.has-features.features-bottom .entity-picture-backdrop {
        height: 106px;
        bottom: auto;
        -webkit-mask-image:
          linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 28%,
            rgba(0, 0, 0, 0.74) 48%,
            rgba(0, 0, 0, 0.44) 66%,
            rgba(0, 0, 0, 0.18) 82%,
            rgba(0, 0, 0, 0.05) 92%,
            rgba(0, 0, 0, 0) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 36%,
            rgba(0, 0, 0, 0.7) 56%,
            rgba(0, 0, 0, 0.36) 74%,
            rgba(0, 0, 0, 0.12) 88%,
            rgba(0, 0, 0, 0) 100%
          ),
          radial-gradient(
            ellipse 108% 108% at 0% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.96) 44%,
            rgba(0, 0, 0, 0.62) 68%,
            rgba(0, 0, 0, 0.22) 86%,
            rgba(0, 0, 0, 0) 100%
          );
        -webkit-mask-composite: source-in, source-in;
        mask-image:
          linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 28%,
            rgba(0, 0, 0, 0.74) 48%,
            rgba(0, 0, 0, 0.44) 66%,
            rgba(0, 0, 0, 0.18) 82%,
            rgba(0, 0, 0, 0.05) 92%,
            rgba(0, 0, 0, 0) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 36%,
            rgba(0, 0, 0, 0.7) 56%,
            rgba(0, 0, 0, 0.36) 74%,
            rgba(0, 0, 0, 0.12) 88%,
            rgba(0, 0, 0, 0) 100%
          ),
          radial-gradient(
            ellipse 108% 108% at 0% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.96) 44%,
            rgba(0, 0, 0, 0.62) 68%,
            rgba(0, 0, 0, 0.22) 86%,
            rgba(0, 0, 0, 0) 100%
          );
        mask-composite: intersect;
      }

      .entity-picture-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
      }

      /* =====================================================================
         1. COMPACT DASHBOARD TILE (Shape Coding: Pill = Active, 28px = Off)
         ===================================================================== */
      .status-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        outline: none;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      /* Uniform 28px form factor matching m3e-light-card (tonal primary fill indicates active) */
      .status-tile.is-active {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .status-tile.is-pressed {
        transform: scale(0.965);
      }

      .status-tile:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .status-tile:hover .state-layer {
        opacity: 0.06;
      }

      .status-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: color var(--m3e-spring-effects-default);
      }

      .status-tile.is-active .tile-icon {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-icon ha-icon,
      .tile-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 18px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status-tile.is-active .tile-title,
      .status-tile.is-active .tile-subtitle,
      .status-tile.is-active .tile-chevron {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-chevron {
        flex: 0 0 auto;
        width: 18px;
        height: 18px;
        margin-inline-start: -8px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.78;
      }

      .tile-chevron svg {
        width: 18px;
        height: 18px;
      }

      /* =====================================================================
         2. MODULAR EXPANDED POPUP SHELL
         ===================================================================== */
      dialog.status-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        touch-action: pan-y;
        max-height: calc(100dvh - 24px);
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.status-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-last-changed {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .icon-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      /* Material 3 Expressive Header Toggle Switch (for outlet / light in sensor popup) */
      .m3-header-switch {
        position: relative;
        flex: 0 0 52px;
        width: 52px;
        height: 32px;
        padding: 0;
        border-radius: 9999px;
        border: 2px solid var(--md-sys-color-outline, #8e9099);
        background: var(--md-sys-color-surface-container-highest, #2f313a);
        cursor: pointer;
        display: flex;
        align-items: center;
        transition:
          background-color var(--m3e-spring-effects-fast),
          border-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .m3-header-switch.is-on {
        background: var(--md-sys-color-primary, #bac3ff);
        border-color: var(--md-sys-color-primary, #bac3ff);
      }

      .m3-header-switch:active {
        transform: scale(0.95);
      }

      .m3-header-switch-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--md-sys-color-outline, #8e9099);
        transform: translateX(6px);
        transition:
          transform var(--m3e-spring-bouncy),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      .m3-header-switch.is-on .m3-header-switch-thumb {
        width: 24px;
        height: 24px;
        background: var(--md-sys-color-on-primary, #1f2a56);
        transform: translateX(22px);
      }

      .modular-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mini-svg {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
      }

      .mini-ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      /* =====================================================================
         VARIANT 1: SENSOR HERO + TELEMETRY PILL
         ===================================================================== */
      .sensor-hero {
        display: flex;
        justify-content: center;
        padding: 12px 0;
      }

      .sensor-ring {
        width: clamp(190px, 52vw, 236px);
        height: clamp(190px, 52vw, 236px);
        border-radius: 50%;
        border: 22px solid var(--md-sys-color-surface-container-high, #24252d);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: border-color var(--m3e-spring-effects-default);
      }

      .sensor-ring.is-active {
        border-color: var(--md-sys-color-primary-container, #364067);
      }

      .sensor-ring-icon {
        width: 28px;
        height: 28px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .sensor-ring-icon svg,
      .sensor-ring-icon ha-icon {
        width: 28px;
        height: 28px;
      }

      .sensor-ring-state {
        font-size: 22px;
        font-weight: 500;
      }

      .sensor-ring-sub {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .info-pill {
        width: 100%;
        border: 0;
        font: inherit;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 20px;
        border-radius: 24px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 15px;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .info-pill.is-clickable {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .info-pill.is-clickable:hover {
        background: var(--md-sys-color-surface-container-highest, #2f313a);
      }

      .info-pill.is-clickable:active {
        transform: scale(0.98);
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .info-pill-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .info-pill-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .info-pill-chevron {
        width: 18px;
        height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.7;
        flex-shrink: 0;
      }

      /* M3 Expressive 24h Sensor History Chart Card */
      .history-card {
        background: var(--md-sys-color-surface-container-high, #24252d);
        border-radius: 24px;
        padding: 16px 18px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .history-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .history-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .history-range {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-primary, #bac3ff);
      }

      .history-svg {
        width: 100%;
        height: 104px;
        display: block;
        cursor: crosshair;
        touch-action: none;
      }

      .history-grid-line {
        stroke: var(--md-sys-color-outline-variant, #44464f);
        stroke-width: 1;
        stroke-dasharray: 3 4;
        opacity: 0.45;
      }

      .history-line {
        fill: none;
        stroke: var(--md-sys-color-primary, #bac3ff);
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .history-cursor-line {
        stroke: var(--md-sys-color-primary, #bac3ff);
        stroke-width: 1;
        opacity: 0.55;
      }

      .history-dot {
        fill: var(--md-sys-color-primary, #bac3ff);
        stroke: var(--md-sys-color-surface-container-high, #24252d);
        stroke-width: 2;
      }

      .history-axis {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.75;
      }

      .history-skeleton {
        height: 104px;
        border-radius: 14px;
        background: var(--md-sys-color-surface-container-highest, #303036);
        opacity: 0.6;
      }

      /* =====================================================================
         VARIANT 2: CLIMATE DIAL + RADIAL THUMB MORPH + MODE SHEET
         ===================================================================== */
      .climate-hero {
        display: flex;
        justify-content: center;
        --climate-accent: var(--md-sys-color-primary, #bac3ff);
      }

      .climate-hero.mode-heat {
        --climate-accent: #f3b59b;
      }

      .climate-hero.mode-cool {
        --climate-accent: #9ecaff;
      }

      .dial-container {
        position: relative;
        width: clamp(216px, 60vw, 264px);
        height: clamp(216px, 60vw, 264px);
        touch-action: none;
        user-select: none;
        cursor: grab;
      }

      .dial-container:active {
        cursor: grabbing;
      }

      .dial-svg {
        width: 100%;
        height: 100%;
      }

      .dial-bg-circle {
        fill: var(--md-sys-color-surface-container-high, #2b2b30);
      }

      .dial-arc-track {
        fill: none;
        stroke: var(--md-sys-color-outline-variant, #4a4a52);
        stroke-width: 8;
        stroke-linecap: round;
        transition: stroke-width var(--m3e-spring-spatial-fast);
      }

      .climate-hero.is-dragging .dial-arc-track {
        stroke-width: 18;
      }

      .dial-ambient-dot {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        opacity: 0.75;
      }

      .dial-ambient-label {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 13px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }

      .dial-thumb-pill {
        fill: var(--climate-accent);
        transition:
          x var(--m3e-spring-spatial-fast),
          y var(--m3e-spring-spatial-fast),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .dial-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .dial-readout-off {
        font-size: 46px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .dial-readout-num {
        font-size: 58px;
        font-weight: 500;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .dial-readout-num sup {
        font-size: 28px;
        vertical-align: super;
        margin-left: 2px;
      }

      .dial-steppers {
        position: absolute;
        bottom: 24px;
        display: flex;
        gap: 36px;
        pointer-events: auto;
      }

      .dial-step-btn {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .dial-step-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .mode-pill {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: var(--m3e-corner-full);
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .mode-pill:active {
        transform: scale(0.98);
      }

      .mode-pill.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-pill.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-pill-icon svg {
        width: 22px;
        height: 22px;
        display: block;
      }

      .mode-pill-text {
        display: flex;
        flex-direction: column;
      }

      .mode-pill-title {
        font-size: 14px;
        font-weight: 600;
      }

      .mode-pill-val {
        font-size: 13px;
        opacity: 0.85;
      }

      .climate-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .mode-pill.compact-trait {
        border-radius: 20px;
      }

      .trait-card {
        width: 100%;
        border: 0;
        padding: 16px 18px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .trait-card:active {
        transform: scale(0.98);
      }

      .trait-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .trait-chevron {
        display: grid;
        place-items: center;
        opacity: 0.78;
      }

      .m3-chevron {
        width: 22px;
        height: 22px;
        display: block;
      }

      .telemetry-card {
        background: var(--md-sys-color-surface-container-high, #22232a);
        border-radius: 24px;
        padding: 14px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .telemetry-row {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }

      /* Inline Mode Selector Bottom Sheet */
      .mode-sheet-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.48);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        z-index: 40;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .mode-sheet {
        width: 100%;
        max-width: 440px;
        max-height: 76dvh;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px calc(20px + env(safe-area-inset-bottom, 0px));
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: m3e-sheet-up 260ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }

      .mode-sheet-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .mode-sheet-list {
        flex: 1 1 auto;
        overflow-y: auto;
        overscroll-behavior: contain;
        max-height: 52vh;
        padding-bottom: 6px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mode-option {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition: border-radius var(--m3e-spring-spatial-fast);
      }

      .mode-option.selected {
        border-radius: var(--m3e-corner-full);
      }

      .mode-option.selected.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-option.selected.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-option.selected.mode-off {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      /* =====================================================================
         VARIANT 3: REMOTE / TV (Touchpad + Essentials + Vertical Rocker + Split Pills)
         ===================================================================== */
      .remote-touchpad {
        position: relative;
        flex: 0 0 auto;
        width: 100%;
        height: 216px;
        min-height: 216px;
        border-radius: 28px;
        background: var(--md-sys-color-surface-container-high, #282930);
        display: grid;
        place-items: center;
        touch-action: none;
        user-select: none;
        cursor: grab;
        overflow: hidden;
        transition: background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .remote-touchpad.is-dragging {
        cursor: grabbing;
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 5%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .touchpad-dot {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--md-sys-color-on-surface, #e3e2e6);
        pointer-events: none;
        will-change: transform;
        transition:
          transform var(--m3e-spring-bouncy),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-dragging {
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-pulsing {
        width: 32px;
        height: 32px;
      }

      .remote-essential-row {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 12px;
      }

      .essential-btn {
        width: 56px;
        height: 56px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .essential-btn.is-home {
        width: 68px;
        height: 68px;
      }

      .essential-btn.is-assist {
        background: var(--md-sys-color-on-surface, #e3e2e6);
        color: var(--md-sys-color-surface, #141418);
      }

      .essential-btn:hover {
        filter: brightness(1.06);
      }

      .essential-btn:active {
        transform: scale(0.92);
        border-radius: 18px;
      }

      .essential-btn svg {
        width: 24px;
        height: 24px;
      }

      .essential-btn.is-home svg {
        width: 26px;
        height: 26px;
      }

      .remote-hero {
        display: flex;
        justify-content: center;
        padding: 4px 0;
      }

      .rocker-pill {
        width: 124px;
        height: 176px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .rocker-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .rocker-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .rocker-half svg {
        width: 24px;
        height: 24px;
      }

      .rocker-divider {
        height: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .split-pill {
        position: relative;
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        overflow: hidden;
      }

      .split-pill.has-state {
        padding: 4px;
      }

      .split-indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc(50% - 4px);
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        transition: transform var(--m3e-spring-spatial-fast);
        pointer-events: none;
        z-index: 0;
      }

      .split-indicator.is-right {
        transform: translateX(100%);
      }

      .split-half {
        position: relative;
        z-index: 1;
        flex: 1;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        cursor: pointer;
        transition:
          color var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .split-half.is-selected {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font-weight: 600;
      }

      .split-half:hover:not(.is-selected) {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .split-half:active {
        transform: scale(0.96);
      }

      .split-vdivider {
        width: 1px;
        margin: 12px 0;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 10px;
        padding: 6px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        padding: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
        -webkit-tap-highlight-color: transparent;
      }

      .transport-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-icon:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .transport-icon.is-prev:active {
        transform: translateX(-3px) scale(0.92);
      }

      .transport-icon.is-next:active {
        transform: translateX(3px) scale(0.92);
      }

      .transport-icon svg {
        width: 24px;
        height: 24px;
      }

      .transport-circle {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .transport-circle.is-active {
        border-radius: 18px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .transport-circle:active {
        transform: scale(0.91);
      }

      .transport-circle svg {
        width: 26px;
        height: 26px;
      }

      .channel-pill {
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
      }

      .channel-btn {
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
        cursor: pointer;
      }

      .channel-label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      /* =====================================================================
         VARIANT 4: MEDIA / SPEAKER (Media Card + Shape-Coded Volume & Actions)
         ===================================================================== */
      .media-hero-card {
        position: relative;
        overflow: hidden;
        min-height: 178px;
        border-radius: 28px;
        padding: 18px 20px;
        background: var(--md-sys-color-surface-container-high, #2b2b30);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
      }

      .media-hero-card.has-art::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: var(--media-art);
        background-size: cover;
        background-position: center;
        filter: brightness(0.45);
      }

      .media-hero-top,
      .media-hero-mid,
      .media-scrubber-row {
        position: relative;
        z-index: 1;
      }

      /* Full Pill Volume Slider */
      .volume-pill {
        position: relative;
        height: 64px;
        border-radius: var(--m3e-corner-full);
        overflow: hidden;
        cursor: ew-resize;
        user-select: none;
        touch-action: pan-y;
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #364067) 48%,
          var(--md-sys-color-surface-container-high, #24252d)
        );
      }

      .volume-pill-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--vol-pct, 40%);
        background: var(--md-sys-color-primary-container, #364067);
        transition: width var(--m3e-spring-spatial-default);
      }

      .volume-pill.is-dragging .volume-pill-fill {
        transition: none;
      }

      .volume-pill-content {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 0 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 15px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        pointer-events: none;
      }

      /* Full Pill Active Primary Action */
      .primary-action-pill {
        height: 60px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        padding: 0 22px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
      }

      /* 20px Rounded Rectangle Neutral Secondary Action */
      .secondary-action-card {
        height: 60px;
        border: 0;
        border-radius: 20px;
        padding: 0 20px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      /* =====================================================================
         SELECTOR POPUP (M3 Expressive Radio Option List)
         ===================================================================== */
      .selector-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 58dvh;
        overflow-y: auto;
        padding: 2px 0;
      }

      .selector-row {
        width: 100%;
        min-height: 70px;
        padding: 15px 22px;
        border: 0;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #ededf0);
        color: var(--md-sys-color-on-surface, #1b1b1f);
        font: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 18px;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .selector-row.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .selector-row:active {
        transform: scale(0.98);
      }

      .selector-row-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .selector-row-icon svg {
        width: 24px;
        height: 24px;
      }

      .selector-row-label {
        flex: 1 1 auto;
        font-size: 16px;
        font-weight: 500;
      }

      .selector-row.is-selected .selector-row-label {
        font-weight: 600;
      }

      .m3-radio {
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #44464f);
        display: grid;
        place-items: center;
        transition: border-color var(--m3e-spring-effects-fast);
      }

      .m3-radio.checked {
        border-color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .m3-radio-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--md-sys-color-on-primary-container, #2b3248);
        transform: scale(0);
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .m3-radio.checked .m3-radio-dot {
        transform: scale(1);
      }

      .selector-empty {
        padding: 20px 16px;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        font-size: 14px;
        line-height: 1.45;
        text-align: center;
      }

      /* =====================================================================
         POWER STRIP POPUP (2-Column M3 Expressive Toggle Grid)
         ===================================================================== */
      .power-strip-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .ps-tile {
        min-height: 76px;
        padding: 14px 16px;
        border: 0;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        -webkit-tap-highlight-color: transparent;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .ps-tile.is-on {
        border-radius: 28px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .ps-tile:active:not(:disabled) {
        transform: scale(0.96);
      }

      .ps-tile.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .ps-tile-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .ps-tile-icon svg {
        width: 24px;
        height: 24px;
      }

      .ps-tile-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ps-tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 19px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ps-tile-sub {
        font-size: 12.5px;
        font-weight: 500;
        line-height: 16px;
        opacity: 0.78;
      }
    `
];
L([
  P({ attribute: !1 })
], O.prototype, "hass", 2);
L([
  P({ type: Boolean })
], O.prototype, "popupOnly", 2);
L([
  v()
], O.prototype, "_config", 2);
L([
  v()
], O.prototype, "_pressed", 2);
L([
  v()
], O.prototype, "_popupOpen", 2);
L([
  v()
], O.prototype, "_dialDragging", 2);
L([
  v()
], O.prototype, "_dialTemp", 2);
L([
  v()
], O.prototype, "_activeSheet", 2);
L([
  v()
], O.prototype, "_remoteSelectorSheet", 2);
L([
  v()
], O.prototype, "_volDragging", 2);
L([
  v()
], O.prototype, "_volPct", 2);
L([
  v()
], O.prototype, "_historyPoints", 2);
L([
  v()
], O.prototype, "_historyLoading", 2);
L([
  v()
], O.prototype, "_historyEntityId", 2);
L([
  v()
], O.prototype, "_historyHoverIdx", 2);
L([
  v()
], O.prototype, "_featuresLoaded", 2);
L([
  v()
], O.prototype, "_artPalette", 2);
L([
  T("dialog.status-dialog")
], O.prototype, "_dialogEl", 2);
L([
  T(".status-tile")
], O.prototype, "_tileEl", 2);
L([
  T("m3e-media-popup")
], O.prototype, "_mediaPopupEl", 2);
L([
  T(".dialog-surface")
], O.prototype, "_dialogSurfaceEl", 2);
L([
  v()
], O.prototype, "_relativeTick", 2);
L([
  v()
], O.prototype, "_padOffsetX", 2);
L([
  v()
], O.prototype, "_padOffsetY", 2);
L([
  v()
], O.prototype, "_padActive", 2);
L([
  v()
], O.prototype, "_padTapPulse", 2);
O = L([
  z("m3e-status-card")
], O);
var _a = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, Kt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ba(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && _a(e, i, r), r;
};
let vt = class extends A {
  constructor() {
    super(...arguments), this._optimisticTemp = null, this._pressed = !1, this._optimisticTimer = null, this._boundPopupKey = "", this._attachPopupHost = (t) => {
      if (!t || !(t instanceof HTMLElement) || !this._config) return;
      const e = t;
      this._popupHost = e;
      const i = `${this._config.entity}|${this._config.name ?? ""}|${this._config.outdoor_entity ?? ""}`;
      if (this._boundPopupKey !== i) {
        this._boundPopupKey = i;
        const s = {
          type: "custom:m3e-status-card",
          entity: this._config.entity,
          name: this._config.name,
          outdoor_entity: this._config.outdoor_entity,
          popup_type: "climate"
        };
        e.setConfig(s);
      }
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-thermostat-card: devi specificare un’entità climate.*");
    this._config = { ...t };
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-thermostat-card",
      entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("climate.")) ?? "climate.termostato"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: { entity: { domain: "climate" } }
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:text-short",
          title: "Content",
          schema: [
            { name: "name", selector: { text: {} } },
            { name: "outdoor_entity", selector: { entity: { domain: "sensor" } } }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:gesture-tap",
          title: "Interactions",
          schema: [
            {
              name: "step",
              selector: { number: { min: 0.1, max: 2, step: 0.1, mode: "box" } }
            }
          ]
        }
      ],
      computeLabel: (t) => ({
        entity: "Entità termostato / clima",
        name: "Nome personalizzato",
        outdoor_entity: "Sensore temperatura esterna (opzionale, per popup)",
        step: "Passo temperatura (− / +, default automatico)"
      })[t.name] ?? t.name
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_optimisticTemp")) return !0;
    if (t.has("hass") && this.hass) {
      const e = this.hass.states[this._config.entity], i = this._config.outdoor_entity ? this.hass.states[this._config.outdoor_entity] : void 0, r = t.get("hass")?.themes?.darkMode !== this.hass.themes?.darkMode;
      return e !== this._prevEntity || i !== this._prevOutdoor || r ? (this._prevEntity = e, this._prevOutdoor = i, !0) : !1;
    }
    return !0;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._optimisticTimer !== null && (window.clearTimeout(this._optimisticTimer), this._optimisticTimer = null);
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isUnavailable() {
    const t = this._entity?.state;
    return !t || t === "unavailable" || t === "unknown";
  }
  get _step() {
    if (typeof this._config?.step == "number" && this._config.step > 0)
      return this._config.step;
    const t = this._entity?.attributes.target_temp_step;
    return typeof t == "number" && t > 0 ? t : 0.5;
  }
  get _minTemp() {
    const t = this._entity?.attributes.min_temp;
    return typeof t == "number" ? t : 7;
  }
  get _maxTemp() {
    const t = this._entity?.attributes.max_temp;
    return typeof t == "number" ? t : 32;
  }
  get _targetTemp() {
    if (this._optimisticTemp !== null) return this._optimisticTemp;
    const t = this._entity?.attributes.temperature;
    return typeof t == "number" ? t : null;
  }
  get _currentTemp() {
    const t = this._entity?.attributes.current_temperature;
    return typeof t == "number" ? t : null;
  }
  get _climateTone() {
    if (this._isUnavailable) return "neutral";
    const t = String(this._entity?.state ?? "off").toLowerCase(), e = String(this._entity?.attributes.hvac_action ?? "").toLowerCase();
    return e === "heating" || t === "heat" || t === "heating" ? "heat" : e === "cooling" || t === "cool" || t === "cooling" ? "cool" : t === "off" || t === "idle" ? "neutral" : "auto";
  }
  _nudgeTemp(t, e) {
    if (e.stopPropagation(), !this.hass || !this._config || this._isUnavailable) return;
    const i = this._targetTemp ?? this._currentTemp ?? 20, s = this._step, r = i + t * s, a = Math.max(this._minTemp, Math.min(this._maxTemp, r)), o = Math.round(a / s) * s, n = Number(o.toFixed(1));
    this._optimisticTemp = n, this._optimisticTimer !== null && window.clearTimeout(this._optimisticTimer), this._optimisticTimer = window.setTimeout(() => {
      this._optimisticTemp = null, this._optimisticTimer = null;
    }, 1500), this.hass.callService("climate", "set_temperature", {
      entity_id: this._config.entity,
      temperature: n
    });
  }
  _openPopup() {
    this._isUnavailable || this._popupHost?.openPopup(this._cardEl?.getBoundingClientRect());
  }
  _renderHeaderIcon(t, e) {
    const i = String(this._entity?.state ?? "off").toLowerCase();
    return e || t === "neutral" ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3 7a3 3 0 0 1-1.6-5.54l.6-.38V5a1 1 0 0 1 2 0v9.08l.6.38A3 3 0 0 1 12 20Z"
          />
        </svg>
      ` : t === "heat" ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M12 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M17 19c1.4-2 1.4-4 0-6s-1.4-4 0-6"
            stroke="currentColor"
            stroke-width="2.1"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      ` : t === "cool" ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"
          />
        </svg>
      ` : i === "dry" ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z" />
        </svg>
      ` : i === "fan_only" ? l`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
          />
        </svg>
      ` : l`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"
        />
      </svg>
    `;
  }
  _formatTempNumber(t) {
    return Number.isInteger(t) ? String(t) : t.toFixed(1);
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isUnavailable, s = this._climateTone, r = !!this.hass?.themes?.darkMode, a = this._targetTemp, o = this._currentTemp, n = String(t?.state ?? "off").toLowerCase(), c = x(this.hass, "indoor"), p = o !== null ? n === "off" ? `${x(this.hass, "off")} · ${c} ${this._formatTempNumber(o)}` : `${c} ${this._formatTempNumber(o)}` : n === "off" ? x(this.hass, "off") : n.charAt(0).toUpperCase() + n.slice(1);
    return l`
      <ha-card
        class="thermostat-card is-wide-card tone-${s} ${r ? "is-dark" : "is-light"} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${e}, ${i ? "Offline" : a !== null ? `${a}°` : n}"
        @pointerdown=${(d) => {
      i || d.pointerType === "mouse" && d.button !== 0 || d.target?.closest("button") || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._openPopup()}
        @keydown=${(d) => {
      (d.key === "Enter" || d.key === " ") && (d.preventDefault(), this._openPopup());
    }}
      >
        <header class="thermo-header">
          <span class="header-left">
            <span class="header-icon">${this._renderHeaderIcon(s, i)}</span>
            <span class="header-title">${e}</span>
          </span>

          ${i ? l`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : l`
                <span class="header-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                    />
                  </svg>
                </span>
              `}
        </header>

        ${i ? l`<div class="offline-hero">Offline</div>` : l`
              <div class="controls-row">
                <button
                  type="button"
                  class="step-btn"
                  aria-label="Riduci temperatura"
                  @click=${(d) => this._nudgeTemp(-1, d)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      d="M6 12h12"
                    />
                  </svg>
                </button>

                <div class="temp-readout">
                  ${a !== null ? this._formatTempNumber(a) : "—"}
                </div>

                <button
                  type="button"
                  class="step-btn"
                  aria-label="Aumenta temperatura"
                  @click=${(d) => this._nudgeTemp(1, d)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </button>
              </div>

              <div class="indoor-label">${p}</div>
            `}
      </ha-card>

      <!-- Reuses the exact Climate popup from m3e-status-card without rendering a tile -->
      <m3e-status-card
        .popupOnly=${!0}
        .hass=${this.hass}
        ${Ze(this._attachPopupHost)}
      ></m3e-status-card>
    `;
  }
};
vt.styles = [
  U,
  I`
      :host {
        display: block;
        width: 100%;
      }

      .thermostat-card {
        padding: 18px 20px 20px;
        cursor: pointer;
        outline: none;
        display: flex;
        flex-direction: column;
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .thermostat-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      /* =====================================================================
         CLIMATE SEMANTIC TONES (Heat = Warm Red, Cool = Blue, Off = Neutral)
         ===================================================================== */
      .thermostat-card.tone-neutral {
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container-high, #e3e3e6)
        );
        color: var(--md-sys-color-on-surface, #1f1f24);
        --m3e-thermo-btn-bg: color-mix(in srgb, currentColor 11%, transparent);
      }

      .thermostat-card.tone-heat.is-light {
        background: #ffd8cc;
        color: #5c1900;
        --m3e-thermo-btn-bg: rgba(92, 25, 0, 0.11);
      }

      .thermostat-card.tone-heat.is-dark {
        background: #592416;
        color: #ffdad0;
        --m3e-thermo-btn-bg: rgba(255, 218, 208, 0.15);
      }

      .thermostat-card.tone-cool.is-light {
        background: #d3e4ff;
        color: #001c38;
        --m3e-thermo-btn-bg: rgba(0, 28, 56, 0.1);
      }

      .thermostat-card.tone-cool.is-dark {
        background: #19385b;
        color: #d3e4ff;
        --m3e-thermo-btn-bg: rgba(211, 228, 255, 0.15);
      }

      .thermostat-card.tone-auto {
        background: var(--md-sys-color-primary-container, #dbe1ff);
        color: var(--md-sys-color-on-primary-container, #16306b);
        --m3e-thermo-btn-bg: color-mix(in srgb, currentColor 12%, transparent);
      }

      /* =====================================================================
         HEADER ROW (avoid HA reserved .card-header class)
         ===================================================================== */
      .thermo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0;
        margin: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .header-icon {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .header-icon svg {
        width: 22px;
        height: 22px;
      }

      .header-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-chevron {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        opacity: 0.85;
      }

      .header-chevron svg {
        width: 20px;
        height: 20px;
      }

      /* =====================================================================
         ONLINE CONTROLS ROW (-   7   +) + INDOOR LABEL
         ===================================================================== */
      .controls-row {
        display: grid;
        grid-template-columns: 78px 1fr 78px;
        align-items: center;
        gap: 12px;
        margin: 22px 0 16px;
      }

      .step-btn {
        width: 78px;
        height: 54px;
        border: 0;
        border-radius: 9999px;
        background: var(--m3e-thermo-btn-bg, color-mix(in srgb, currentColor 11%, transparent));
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .step-btn:hover {
        background: color-mix(in srgb, currentColor 17%, transparent);
      }

      .step-btn:active {
        transform: scale(0.92);
      }

      .step-btn svg {
        width: 22px;
        height: 22px;
      }

      .temp-readout {
        text-align: center;
        font-size: 62px;
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.025em;
        font-variant-numeric: tabular-nums;
      }

      .indoor-label {
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        opacity: 0.88;
      }

      /* =====================================================================
         OFFLINE STATE (matches Google Home screenshot)
         ===================================================================== */
      .offline-hero {
        text-align: center;
        font-size: 56px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.015em;
        padding: 28px 0 26px;
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 46%, transparent);
      }

      .thermostat-card.is-unavailable .header-icon,
      .thermostat-card.is-unavailable .header-title {
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 46%, transparent);
      }
    `
];
Kt([
  P({ attribute: !1 })
], vt.prototype, "hass", 2);
Kt([
  v()
], vt.prototype, "_config", 2);
Kt([
  v()
], vt.prototype, "_optimisticTemp", 2);
Kt([
  v()
], vt.prototype, "_pressed", 2);
Kt([
  T(".thermostat-card")
], vt.prototype, "_cardEl", 2);
vt = Kt([
  z("m3e-thermostat-card")
], vt);
var ya = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, qt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? xa(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ya(e, i, r), r;
};
let _t = class extends A {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1, this._computeLabel = (t) => ({
      entity: "Entità (switch, presa, input_boolean…)",
      name: "Nome",
      card_style: "Design della pillola (Material 3)",
      icon_on: "Icona acceso (vuoto = standard Google Home)",
      icon_off: "Icona spento (vuoto = standard Google Home)",
      use_entity_icon: "Usa icona entità HA (al posto di Google Home)",
      hide_state: "Nascondi stato",
      state_content: "Contenuto stato (stato / attributi)",
      label_on: "Testo acceso (default: On)",
      label_off: "Testo spento (default: Off)",
      hold_action: "Azione pressione prolungata (Hold)",
      navigation_path: "Percorso dashboard o #hash Pop-up",
      features_position: "Posizione Features"
    })[t.name] ?? t.name, this._onValueChanged = (t) => {
      this._config && this._emitConfig({ ...this._config, ...t.detail.value });
    }, this._onFeaturesChanged = (t) => {
      if (t.stopPropagation(), !this._config) return;
      const e = t.detail.features ?? [], i = { ...this._config };
      e.length > 0 ? (i.features = e, i.features_position || (i.features_position = "bottom")) : (delete i.features, delete i.features_position), this._emitConfig(i);
    }, this._onFeaturesPositionChanged = (t) => {
      t.stopPropagation(), this._config && this._emitConfig({
        ...this._config,
        features_position: t.detail.value.features_position ?? "bottom"
      });
    }, this._onEditDetailElement = (t) => {
      t.stopPropagation(), this._subElementEditorConfig = t.detail.subElementConfig;
    }, this._onSubElementConfigChanged = (t) => {
      if (t.stopPropagation(), !this._config || !this._subElementEditorConfig) return;
      const e = this._subElementEditorConfig.index;
      if (typeof e != "number") return;
      const i = [...this._config.features ?? []], s = t.detail.config;
      s ? (i[e] = s, this._subElementEditorConfig = {
        ...this._subElementEditorConfig,
        elementConfig: s
      }) : (i.splice(e, 1), this._subElementEditorConfig = void 0);
      const r = { ...this._config };
      i.length > 0 ? r.features = i : (delete r.features, delete r.features_position), this._emitConfig(r);
    }, this._onGoBack = () => {
      this._subElementEditorConfig = void 0;
    };
  }
  connectedCallback() {
    super.connectedCallback(), Yi().then((t) => {
      t && (this._featuresEditorReady = !0);
    });
  }
  setConfig(t) {
    this._config = { ...t };
  }
  _buildEntitySchema() {
    return [
      {
        name: "entity",
        required: !0,
        selector: {
          entity: {
            domain: [
              "switch",
              "input_boolean",
              "fan",
              "light",
              "automation",
              "humidifier",
              "lock",
              "cover"
            ]
          }
        }
      }
    ];
  }
  _buildContentSchema() {
    const t = [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "entity" }
      },
      {
        name: "card_style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "default", label: "Google Home (Default 28px)" },
              { value: "morph", label: "Google Home Morph (28px ↔ Pillola)" },
              { value: "pill", label: "Pillola piena (M3 Stadium)" },
              { value: "expressive", label: "M3 Expressive Morph (20px ↔ Pillola)" },
              { value: "compact", label: "Compatta (56px / 18px)" }
            ]
          }
        }
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "icon_on", selector: { icon: {} } },
          { name: "icon_off", selector: { icon: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "use_entity_icon", selector: { boolean: {} } },
          { name: "hide_state", selector: { boolean: {} } }
        ]
      }
    ];
    return this._config?.hide_state || t.push(
      {
        name: "state_content",
        selector: { ui_state_content: { allow_name: !1 } },
        context: { filter_entity: "entity" }
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "label_on", selector: { text: {} } },
          { name: "label_off", selector: { text: {} } }
        ]
      }
    ), t;
  }
  _buildInteractionsSchema() {
    const t = [
      {
        name: "hold_action",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "popup", label: "Apri popup Material 3 Expressive" },
              { value: "more-info", label: "Schermata nativa Home Assistant" },
              { value: "navigate", label: "Naviga / Apri Pop-up (#hash)" },
              { value: "none", label: "Nessuna azione" }
            ]
          }
        }
      }
    ];
    return this._config?.hold_action === "navigate" && t.push({ name: "navigation_path", selector: { navigation: {} } }), t;
  }
  _buildFeaturesPositionSchema() {
    return [
      {
        name: "features_position",
        selector: {
          select: {
            mode: "box",
            options: [
              {
                value: "bottom",
                label: "Bottom",
                description: "Mostra tutte le feature impilate sotto la tile"
              },
              {
                value: "inline",
                label: "Inline",
                description: "Mostra le feature affiancate a destra del titolo"
              }
            ]
          }
        }
      }
    ];
  }
  _emitConfig(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config.entity, e = t ? this.hass.states[t] : void 0, i = { entity_id: t };
    if (this._subElementEditorConfig)
      return l`
        <m3e-feature-sub-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this._subElementEditorConfig}
          .context=${i}
          @go-back=${this._onGoBack}
          @config-changed=${this._onSubElementConfigChanged}
        ></m3e-feature-sub-editor>
      `;
    const s = this._config.features ?? [];
    return l`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildEntitySchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:text-short"></ha-icon>
          <span slot="header">Content</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildContentSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:gesture-tap"></ha-icon>
          <span slot="header">Interactions</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildInteractionsSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
          <span slot="header">Features</span>
          <div class="panel-body features-panel">
            ${this._featuresEditorReady ? l`
                  <hui-card-features-editor
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    .context=${i}
                    .stateObj=${e}
                    .features=${s}
                    @features-changed=${this._onFeaturesChanged}
                    @edit-detail-element=${this._onEditDetailElement}
                  ></hui-card-features-editor>
                  ${s.length > 0 ? l`
                        <div class="features-pos-wrap">
                          <ha-form
                            .hass=${this.hass}
                            .data=${{
      features_position: this._config.features_position ?? "bottom"
    }}
                            .schema=${this._buildFeaturesPositionSchema()}
                            .computeLabel=${this._computeLabel}
                            @value-changed=${this._onFeaturesPositionChanged}
                          ></ha-form>
                        </div>
                      ` : h}
                ` : l`<div class="loading-hint">Caricamento editor Features…</div>`}
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
_t.styles = I`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
    }

    .features-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .features-pos-wrap {
      padding-top: 4px;
    }

    .loading-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 8px 0;
    }
  `;
qt([
  P({ attribute: !1 })
], _t.prototype, "hass", 2);
qt([
  P({ attribute: !1 })
], _t.prototype, "lovelace", 2);
qt([
  v()
], _t.prototype, "_config", 2);
qt([
  v()
], _t.prototype, "_featuresEditorReady", 2);
qt([
  v()
], _t.prototype, "_subElementEditorConfig", 2);
_t = qt([
  z("m3e-toggle-card-editor")
], _t);
var wa = Object.defineProperty, $a = Object.getOwnPropertyDescriptor, pt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? $a(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && wa(e, i, r), r;
};
const ka = 420;
let J = class extends A {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._featuresLoaded = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._downX = 0, this._downY = 0, this._onTilePointerDown = (t) => {
      this._isUnavailable || t.pointerType === "mouse" && t.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._downX = t.clientX, this._downY = t.clientY, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, ka));
    }, this._onTilePointerMove = (t) => {
      this._pressed && Math.hypot(t.clientX - this._downX, t.clientY - this._downY) > 10 && (this._clearLongPress(), this._pressed = !1);
    }, this._onTilePointerUp = () => {
      this._clearLongPress(), this._pressed = !1;
    }, this._onTilePointerCancel = () => {
      this._clearLongPress(), this._pressed = !1;
    }, this._onTileClick = () => {
      if (this._clearLongPress(), this._pressed = !1, this._longPressTriggered) {
        this._longPressTriggered = !1;
        return;
      }
      this._toggle();
    }, this._onSwitchPointerDown = (t) => {
      t.button === 0 && (t.currentTarget.setPointerCapture(t.pointerId), this._dragStartY = t.clientY);
    }, this._onSwitchPointerUp = (t) => {
      const e = t.currentTarget;
      if (e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._dragStartY === null) return;
      const i = t.clientY - this._dragStartY;
      this._dragStartY = null, Math.abs(i) >= 24 ? this._setState(i < 0) : this._toggle();
    };
  }
  static getStubConfig(t) {
    return {
      type: "custom:m3e-toggle-card",
      entity: (t ? Object.keys(t.states).find(
        (i) => i.startsWith("switch.") || i.startsWith("input_boolean.")
      ) : void 0) ?? "switch.outlet"
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-toggle-card-editor");
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-toggle-card: you must define an entity");
    this._config = {
      hold_action: "popup",
      ...t
    }, this._ensureFeatures();
  }
  connectedCallback() {
    super.connectedCallback(), this._ensureFeatures();
  }
  _ensureFeatures() {
    (this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded && Gi().then((t) => {
      t && (this._featuresLoaded = !0);
    });
  }
  getCardSize() {
    const t = this._config?.features?.length ?? 0, e = this._config?.features_position === "inline";
    return t > 0 && !e ? 2 + t : 2;
  }
  getGridOptions() {
    const t = this._config?.features?.length ?? 0, e = this._config?.features_position === "inline";
    return t > 0 ? e ? { rows: "auto", columns: 12, min_columns: 6 } : { rows: 1 + t, columns: 6, min_columns: 3 } : { rows: "auto", columns: 6, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress();
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_pressed") || t.has("_popupOpen") || t.has("_featuresLoaded"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      if ((this._config.features?.length ?? 0) > 0)
        return !0;
      const e = this.hass.states[this._config.entity];
      return e !== this._prevEntityState ? (this._prevEntityState = e, !0) : !1;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isOn() {
    const t = this._entity?.state;
    return t === "on" || t === "open" || t === "unlocked";
  }
  get _isUnavailable() {
    const t = this._entity?.state;
    return !t || t === "unavailable" || t === "unknown";
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  _toggle() {
    if (!this.hass || !this._config || this._isUnavailable) return;
    const t = this._config.entity, e = t.split(".")[0];
    if (e === "lock") {
      this.hass.callService("lock", this._isOn ? "lock" : "unlock", { entity_id: t });
      return;
    }
    if (e === "cover") {
      this.hass.callService("cover", this._isOn ? "close_cover" : "open_cover", {
        entity_id: t
      });
      return;
    }
    if (["switch", "light", "input_boolean", "fan", "automation"].includes(e)) {
      this.hass.callService(e, this._isOn ? "turn_off" : "turn_on", {
        entity_id: t
      });
      return;
    }
    this.hass.callService("homeassistant", "toggle", { entity_id: t });
  }
  _setState(t) {
    if (!this.hass || !this._config || this._isUnavailable || t === this._isOn) return;
    const e = this._config.entity, i = e.split(".")[0];
    if (i === "lock") {
      this.hass.callService("lock", t ? "unlock" : "lock", { entity_id: e });
      return;
    }
    if (i === "cover") {
      this.hass.callService("cover", t ? "open_cover" : "close_cover", {
        entity_id: e
      });
      return;
    }
    this.hass.callService(i, t ? "turn_on" : "turn_off", {
      entity_id: e
    });
  }
  async openPopup() {
    if (this._isUnavailable || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const t = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    e && (e.open || e.showModal(), yt(i, t));
  }
  closePopup() {
    xt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        Ht(this, this.hass, this._config.navigation_path);
        return;
      }
      if (t === "more-info") {
        this.dispatchEvent(
          new CustomEvent("hass-more-info", {
            bubbles: !0,
            composed: !0,
            detail: { entityId: this._config.entity }
          })
        );
        return;
      }
      this.openPopup();
    }
  }
  _renderIcon(t) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return l`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return l`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const e = this._entity.attributes.icon;
      if (e && customElements.get("ha-icon"))
        return l`<ha-icon .icon=${e}></ha-icon>`;
    }
    return Tt(this._entity, this._isOn);
  }
  _getPowerSiblings() {
    if (!this.hass?.entities || !this._config) return [];
    const t = this._config.entity, e = this.hass.entities[t]?.device_id;
    if (!e) return [];
    const i = ["power", "energy", "current", "voltage"], s = [];
    for (const [r, a] of Object.entries(this.hass.entities)) {
      if (r === t || a.device_id !== e || !r.startsWith("sensor.")) continue;
      const o = this.hass.states[r];
      if (!o || o.state === "unavailable" || o.state === "unknown") continue;
      const n = String(o.attributes.device_class ?? "");
      i.includes(n) && s.push(o);
    }
    return s.sort(
      (r, a) => i.indexOf(String(r.attributes.device_class ?? "")) - i.indexOf(String(a.attributes.device_class ?? ""))
    ), s;
  }
  _cleanSiblingLabel(t) {
    const e = (t.attributes.friendly_name || "").trim(), i = this.hass?.entities?.[t.entity_id]?.device_id, s = i ? this.hass?.devices?.[i] : void 0;
    for (const r of [
      s?.name_by_user,
      s?.name,
      typeof this._config?.name == "string" ? this._config.name : void 0,
      this._entity?.attributes.friendly_name
    ]) {
      const a = r?.trim();
      if (a && e.length > a.length && e.toLowerCase().startsWith(a.toLowerCase())) {
        const o = e.slice(a.length).replace(/^[\s\-–—:]+/, "").trim();
        if (o) return o.charAt(0).toUpperCase() + o.slice(1);
      }
    }
    return e || String(t.attributes.device_class ?? "Sensor");
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = dt(this.hass, t, this._config.name, this._config.entity), i = this._isOn, s = i ? this._config.icon_on?.trim() || void 0 : this._config.icon_off?.trim() || this._config.icon_on?.trim() || void 0, r = this._isUnavailable ? "Offline" : i ? this._config.label_on || "On" : this._config.label_off || "Off", a = !!this._config.hide_state, o = a ? null : jt(this.hass, t, this._config.state_content, r), n = a ? "" : o ?? r, c = `style-${this._config.card_style ?? "default"}`, p = this._popupOpen ? le(t?.last_changed) : null, d = this._popupOpen ? this._getPowerSiblings() : [], g = this._config.features ?? [], u = g.length > 0, m = this._config.features_position ?? "bottom";
    return l`
      <ha-card
        class="toggle-tile ${c} ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""} ${u ? `has-features features-${m}` : ""}"
        role="switch"
        tabindex="0"
        aria-checked=${String(i)}
        aria-label="${e}, ${n}"
        @pointerdown=${this._onTilePointerDown}
        @pointermove=${this._onTilePointerMove}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @click=${this._onTileClick}
        @contextmenu=${(f) => {
      f.preventDefault(), this._clearLongPress(), this._longPressTriggered = !0, this._handleHoldAction();
    }}
        @keydown=${(f) => {
      f.key === " " || f.key === "Enter" ? (f.preventDefault(), this._toggle()) : (f.key === "o" || f.key === "O") && (f.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            ${n ? l`<span class="tile-subtitle">${n}</span>` : h}
          </div>
          ${this._isUnavailable ? l`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : h}
        </div>
        ${u ? l`
              <div
                class="features-wrap"
                @click=${nt}
                @pointerdown=${nt}
                @pointermove=${nt}
                @pointerup=${nt}
                @contextmenu=${nt}
              >
                <hui-card-features
                  .hass=${this.hass}
                  .context=${{ entity_id: this._config.entity }}
                  .stateObj=${t}
                  .features=${g}
                  .position=${m}
                ></hui-card-features>
              </div>
            ` : h}
      </ha-card>

      <dialog
        class="toggle-dialog"
        @click=${(f) => {
      f.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(f) => {
      f.preventDefault(), this.closePopup();
    }}
        @touchmove=${(f) => bt(f, this._dialogEl)}
      >
        ${this._popupOpen ? l`
              <div class="dialog-surface">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.closePopup()}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <div class="dialog-title-wrap">
                    <span class="dialog-title">${e}</span>
                    ${p ? l`<span class="dialog-last-changed">${p}</span>` : h}
                  </div>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${x(this.hass, "history")}
                    title=${x(this.hass, "history_tooltip")}
                    @click=${() => {
      const f = this._config?.entity;
      f && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: f, view: "history" }
        })
      ));
    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                      />
                    </svg>
                  </button>
                </header>

                <div class="switch-stage">
                  <div
                    class="vertical-switch ${i ? "is-on" : "is-off"}"
                    role="switch"
                    tabindex="0"
                    aria-checked=${String(i)}
                    aria-label="${e} switch"
                    @pointerdown=${this._onSwitchPointerDown}
                    @pointerup=${this._onSwitchPointerUp}
                    @pointercancel=${() => this._dragStartY = null}
                    @keydown=${(f) => {
      (f.key === " " || f.key === "Enter") && (f.preventDefault(), this._toggle());
    }}
                  >
                    <div class="switch-thumb">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <span class="switch-readout">${n}</span>
                </div>

                ${d.length > 0 ? l`
                      <div class="telemetry-stack">
                        ${d.map(
      (f) => l`
                            <div class="info-pill">
                              <span class="info-pill-left">
                                ${typeof customElements < "u" && customElements.get("ha-state-icon") ? l`<ha-state-icon
                                      class="mini-ha-icon"
                                      .hass=${this.hass}
                                      .stateObj=${f}
                                    ></ha-state-icon>` : h}
                                <span>${this._cleanSiblingLabel(f)}</span>
                              </span>
                              <span class="info-pill-val">
                                ${f.state}${f.attributes.unit_of_measurement ?? ""}
                              </span>
                            </div>
                          `
    )}
                      </div>
                    ` : h}
              </div>
            ` : h}
      </dialog>
    `;
  }
};
J.styles = [
  U,
  I`
      :host {
        --m3e-spring-bouncy: 540ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. DASHBOARD TOGGLE TILE (Uniform 28px form factor)
         ===================================================================== */
      .toggle-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        outline: none;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .toggle-tile.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .toggle-tile.is-pressed {
        transform: scale(0.965);
      }

      .toggle-tile:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .toggle-tile:hover .state-layer {
        opacity: 0.06;
      }

      .toggle-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
      }

      /* Native HA Card Features Sub-Row */
      .toggle-tile.has-features.features-bottom {
        display: flex;
        flex-direction: column;
      }

      .toggle-tile.has-features.features-bottom .tile-inner {
        height: auto;
        min-height: 68px;
      }

      .toggle-tile.has-features.features-inline {
        display: flex;
        align-items: center;
      }

      .toggle-tile.has-features.features-inline .tile-inner {
        flex: 1 1 50%;
        min-width: 0;
      }

      .features-wrap {
        position: relative;
        z-index: 2;
        --feature-border-radius: 18px;
        --feature-color: var(--md-sys-color-primary, #4c5c92);
      }

      .toggle-tile.features-bottom .features-wrap {
        padding: 0 12px 12px;
      }

      .toggle-tile.features-inline .features-wrap {
        flex: 1 1 50%;
        min-width: 0;
        padding: 8px 12px 8px 0;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: color var(--m3e-spring-effects-default);
      }

      .toggle-tile.is-on .tile-icon {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-icon ha-icon,
      .tile-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 18px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .toggle-tile.is-on .tile-title,
      .toggle-tile.is-on .tile-subtitle {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      /* =====================================================================
         2. VERTICAL MORPHING TOGGLE SWITCH POPUP (Google Home On <-> Off)
         ===================================================================== */
      dialog.toggle-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(420px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.toggle-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        overscroll-behavior: contain;
        touch-action: pan-y;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        border-radius: 32px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        padding: 20px 20px 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.toggle-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          padding: 18px 16px calc(28px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-last-changed {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .icon-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .switch-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 8px 0;
      }

      /* Vertical Morphing Track: 28px rounded rect (Off) <-> 88px full pill (On) */
      .vertical-switch {
        position: relative;
        width: 176px;
        height: 316px;
        padding: 12px;
        cursor: pointer;
        user-select: none;
        touch-action: none;
        outline: none;
        border-radius: 28px;
        background: var(--md-sys-color-surface-container-highest, #323236);
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default);
      }

      .vertical-switch.is-on {
        border-radius: 88px;
        background: var(--md-sys-color-primary-container, #2c3554);
      }

      .vertical-switch:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 4px;
      }

      /* Sliding Morphing Thumb: 22px squircle at bottom (Off) <-> 50% circle at top (On) */
      .switch-thumb {
        width: 152px;
        height: 152px;
        display: grid;
        place-items: center;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container, #1d1d20);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transform: translateY(140px);
        transition:
          transform var(--m3e-spring-bouncy),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .vertical-switch.is-on .switch-thumb {
        border-radius: 50%;
        transform: translateY(0px);
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-primary-container, #dce2ff) 14%,
          var(--md-sys-color-primary-container, #2c3554)
        );
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .switch-thumb svg {
        width: 34px;
        height: 34px;
      }

      .switch-readout {
        font-size: 24px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .telemetry-stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .info-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 18px;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        font-size: 14px;
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .mini-ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
    `
];
pt([
  P({ attribute: !1 })
], J.prototype, "hass", 2);
pt([
  v()
], J.prototype, "_config", 2);
pt([
  v()
], J.prototype, "_pressed", 2);
pt([
  v()
], J.prototype, "_popupOpen", 2);
pt([
  v()
], J.prototype, "_featuresLoaded", 2);
pt([
  T("dialog.toggle-dialog")
], J.prototype, "_dialogEl", 2);
pt([
  T(".toggle-tile")
], J.prototype, "_tileEl", 2);
pt([
  T(".dialog-surface")
], J.prototype, "_dialogSurfaceEl", 2);
J = pt([
  z("m3e-toggle-card")
], J);
Sr();
function V(t) {
  window.customCards = window.customCards || [], window.customCards.some((e) => e.type === t.type) || window.customCards.push(t);
}
function qi(t) {
  window.customBadges = window.customBadges || [], window.customBadges.some((e) => e.type === t.type) || window.customBadges.push(t);
}
V({
  type: "m3e-light-card",
  name: "Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You integration.",
  preview: !0
});
V({
  type: "m3e-status-card",
  name: "Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular popups (Sensor, Selector, Climate, Remote, Media).",
  preview: !0
});
V({
  type: "m3e-toggle-card",
  name: "Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0
});
V({
  type: "m3e-scene-card",
  name: "Scene / Button Card",
  description: "Google Home–style one-tap scene, script, or button tile with animated activation feedback.",
  preview: !0
});
V({
  type: "m3e-light-control-card",
  name: "Light Control (All on / All off)",
  description: "Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.",
  preview: !0
});
V({
  type: "m3e-light-group-card",
  name: "Light Group Card",
  description: "Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.",
  preview: !0
});
const Xi = {
  type: "m3e-assist-card",
  name: "Assist & Mode Bar",
  description: 'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector.',
  preview: !0
};
V(Xi);
qi(Xi);
V({
  type: "m3e-glance-card",
  name: "At a Glance Strip",
  description: "Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.",
  preview: !0
});
V({
  type: "m3e-people-card",
  name: "People Glance",
  description: "At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.",
  preview: !0
});
V({
  type: "m3e-thermostat-card",
  name: "Thermostat Card",
  description: "Full-width Google Home–style thermostat card with +/- pill steppers, heat/cool semantic colors, offline state, and full climate dial popup.",
  preview: !0
});
V({
  type: "m3e-stack-card",
  name: "Stack",
  description: "Google Home–style comparison card to list and compare multiple sensors side-by-side with customizable header icon and title.",
  preview: !0
});
V({
  type: "m3e-media-bar-card",
  name: "Media Bar",
  description: "Footer-ready Google Home–style media player bar with squircle artwork, auto-scrolling marquee metadata, Cast/Source selector, and Play/Pause button.",
  preview: !0
});
V({
  type: "m3e-media-player-card",
  name: "Media Player",
  description: "Full-bleed Material 3 Expressive media player card with dynamic artwork color extraction, shape-morphing Play/Pause, and animated wavy progress slider.",
  preview: !0
});
V({
  type: "m3e-popup-card",
  name: "Pop-up Card",
  description: "Customizable Material 3 Expressive pop-up container with entity header button, native HA Add card picker / vertical-stack support, and hash/path navigation trigger.",
  preview: !0
});
V({
  type: "m3e-remote-card",
  name: "Remote Card",
  description: "Google Home–style Material 3 Expressive TV & Media remote card with gesture touchpad / D-Pad, volume rocker, out-of-the-box multi-platform commands, and custom native buttons & segmented pills.",
  preview: !0
});
const Ji = {
  type: "m3e-status-badge",
  name: "Status Badge",
  description: "Compact Material 3 Expressive status badge (Glance Mini, Split Tonal Pill, Minimal Dot, Squircle Alert) for dashboard headers or compact grids.",
  preview: !0
};
qi(Ji);
V(Ji);
export {
  ct as M3EAssistCard,
  Nt as M3EGlanceCard,
  B as M3ELightCard,
  Bt as M3ELightControlCard,
  G as M3ELightGroupCard,
  W as M3EMediaBarCard,
  j as M3EMediaPlayerCard,
  Zt as M3EPeopleCard,
  Y as M3EPopupCard,
  K as M3ERemoteCard,
  At as M3ESceneCard,
  de as M3EStackCard,
  Ot as M3EStatusBadge,
  O as M3EStatusCard,
  vt as M3EThermostatCard,
  J as M3EToggleCard
};
