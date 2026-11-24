/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, lt = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), St = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (lt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = St.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && St.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Wt = (e) => new It(typeof e == "string" ? e : e + "", void 0, ct), q = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new It(i, e, ct);
}, Gt = (e, t) => {
  if (lt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = W.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, Pt = lt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Wt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Yt, defineProperty: qt, getOwnPropertyDescriptor: Xt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Jt, getPrototypeOf: Qt } = Object, X = globalThis, Ct = X.trustedTypes, te = Ct ? Ct.emptyScript : "", ee = X.reactiveElementPolyfillSupport, z = (e, t) => e, G = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? te : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, pt = (e, t) => !Yt(e, t), kt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: pt };
Symbol.metadata ??= Symbol("metadata"), X.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = kt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && qt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: o } = Xt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const a = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? kt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const i = this.properties, s = [...Kt(i), ...Jt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(Pt(r));
    } else t !== void 0 && i.push(Pt(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : G).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : G;
      this._$Em = r;
      const a = n.fromAttribute(i, o.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? pt)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, a = this[r];
        n !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[z("elementProperties")] = /* @__PURE__ */ new Map(), O[z("finalized")] = /* @__PURE__ */ new Map(), ee?.({ ReactiveElement: O }), (X.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis, At = (e) => e, Y = dt.trustedTypes, Et = Y ? Y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Lt = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + S, ie = `<${zt}>`, T = document, V = () => T.createComment(""), H = (e) => e === null || typeof e != "object" && typeof e != "function", ht = Array.isArray, se = (e) => ht(e) || typeof e?.[Symbol.iterator] == "function", ot = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Tt = />/g, k = RegExp(`>|${ot}(?:([^\\s"'>=/]+)(${ot}*=${ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ot = /'/g, Dt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, Vt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = Vt(1), re = Vt(2), D = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Rt = /* @__PURE__ */ new WeakMap(), E = T.createTreeWalker(T, 129);
function Ht(e, t) {
  if (!ht(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Et !== void 0 ? Et.createHTML(t) : t;
}
const oe = (e, t) => {
  const i = e.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = L;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let h, g, d = -1, v = 0;
    for (; v < l.length && (n.lastIndex = v, g = n.exec(l), g !== null); ) v = n.lastIndex, n === L ? g[1] === "!--" ? n = Mt : g[1] !== void 0 ? n = Tt : g[2] !== void 0 ? (Bt.test(g[2]) && (r = RegExp("</" + g[2], "g")), n = k) : g[3] !== void 0 && (n = k) : n === k ? g[0] === ">" ? (n = r ?? L, d = -1) : g[1] === void 0 ? d = -2 : (d = n.lastIndex - g[2].length, h = g[1], n = g[3] === void 0 ? k : g[3] === '"' ? Dt : Ot) : n === Dt || n === Ot ? n = k : n === Mt || n === Tt ? n = L : (n = k, r = void 0);
    const x = n === k && e[a + 1].startsWith("/>") ? " " : "";
    o += n === L ? l + ie : d >= 0 ? (s.push(h), l.slice(0, d) + Lt + l.slice(d) + S + x) : l + S + (d === -2 ? a : x);
  }
  return [Ht(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = t.length - 1, l = this.parts, [h, g] = oe(t, i);
    if (this.el = N.createElement(h, s), E.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = E.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(Lt)) {
          const v = g[n++], x = r.getAttribute(d).split(S), C = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: o, name: C[2], strings: x, ctor: C[1] === "." ? ae : C[1] === "?" ? le : C[1] === "@" ? ce : K }), r.removeAttribute(d);
        } else d.startsWith(S) && (l.push({ type: 6, index: o }), r.removeAttribute(d));
        if (Bt.test(r.tagName)) {
          const d = r.textContent.split(S), v = d.length - 1;
          if (v > 0) {
            r.textContent = Y ? Y.emptyScript : "";
            for (let x = 0; x < v; x++) r.append(d[x], V()), E.nextNode(), l.push({ type: 2, index: ++o });
            r.append(d[v], V());
          }
        }
      } else if (r.nodeType === 8) if (r.data === zt) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(S, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += S.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const s = T.createElement("template");
    return s.innerHTML = t, s;
  }
}
function R(e, t, i = e, s) {
  if (t === D) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = H(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (t = R(e, r._$AS(e, t.values), r, s)), t;
}
class ne {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? T).importNode(i, !0);
    E.currentNode = r;
    let o = E.nextNode(), n = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new Z(o, o.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (h = new pe(o, this, t)), this._$AV.push(h), l = s[++a];
      }
      n !== l?.index && (o = E.nextNode(), n++);
    }
    return E.currentNode = T, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class Z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = R(this, t, i), H(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== D && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : se(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement(Ht(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new ne(r, this), n = o.u(this.options);
      o.p(i), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Rt.get(t.strings);
    return i === void 0 && Rt.set(t.strings, i = new N(t)), i;
  }
  k(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of t) r === i.length ? i.push(s = new Z(this.O(V()), this.O(V()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = At(t).nextSibling;
      At(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, i = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = R(this, t, i, 0), n = !H(t) || t !== this._$AH && t !== D, n && (this._$AH = t);
    else {
      const a = t;
      let l, h;
      for (t = o[0], l = 0; l < o.length - 1; l++) h = R(this, a[s + l], i, l), h === D && (h = this._$AH[l]), n ||= !H(h) || h !== this._$AH[l], h === p ? t = p : t !== p && (t += (h ?? "") + o[l + 1]), this._$AH[l] = h;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ae extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class le extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class ce extends K {
  constructor(t, i, s, r, o) {
    super(t, i, s, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = R(this, t, i, 0) ?? p) === D) return;
    const s = this._$AH, r = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== p && (s === p || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class pe {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const de = dt.litHtmlPolyfillSupport;
de?.(N, Z), (dt.litHtmlVersions ??= []).push("3.3.3");
const he = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new Z(t.insertBefore(V(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = globalThis;
class M extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = he(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
}
M._$litElement$ = !0, M.finalized = !0, ut.litElementHydrateSupport?.({ LitElement: M });
const ue = ut.litElementPolyfillSupport;
ue?.({ LitElement: M });
(ut.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: pt }, fe = (e = ge, t, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), s === "accessor") {
    const { name: n } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(n, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, e, a), a;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(a) {
      const l = this[n];
      t.call(this, a), this.requestUpdate(n, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function J(e) {
  return (t, i) => typeof i == "object" ? fe(e, t, i) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(e) {
  return J({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(e, t) {
  return (i, s, r) => {
    const o = (n) => n.renderRoot?.querySelector(e) ?? null;
    return me(i, s, { get() {
      return o(this);
    } });
  };
}
const ft = q`
  :host {
    display: block;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
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

    /* M3 Expressive Shape Scale */
    --m3e-corner-xs: var(--md-sys-shape-corner-extra-small, 4px);
    --m3e-corner-sm: var(--md-sys-shape-corner-small, 8px);
    --m3e-corner-md: var(--md-sys-shape-corner-medium, 12px);
    --m3e-corner-lg: var(--md-sys-shape-corner-large, 16px);
    --m3e-corner-xl: var(--md-sys-shape-corner-extra-large, 28px);
    --m3e-corner-full: var(--md-sys-shape-corner-full, 9999px);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  ha-card {
    display: block;
    position: relative;
    overflow: hidden;
    background: var(--ha-card-background, var(--md-sys-color-surface-container-low, #f3f3fa));
    box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, none));
    border-style: solid;
    border-width: var(--ha-card-border-width, 0px);
    border-color: var(--ha-card-border-color, transparent);
    border-radius: var(--ha-card-border-radius, var(--m3e-corner-xl));
    color: var(--md-sys-color-on-surface, #1b1b1f);
    transition:
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }
`;
var _e = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, b = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ve(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (s ? n(t, i, r) : n(r)) || r);
  return s && r && _e(t, i, r), r;
};
const Ut = 8, be = 420, ye = 100, xe = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], Nt = "m3e-light-recent-colors:", $e = 6;
function Zt(e) {
  try {
    const t = window.localStorage.getItem(`${Nt}${e}`);
    if (!t) return [];
    const i = JSON.parse(t);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function we(e, t) {
  try {
    const i = Zt(e).filter((r) => r.hex !== t.hex), s = [t, ...i].slice(0, $e);
    window.localStorage.setItem(`${Nt}${e}`, JSON.stringify(s));
  } catch {
  }
}
function nt([e, t, i]) {
  return "#" + [e, t, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function at(e) {
  const t = Math.max(2e3, Math.min(6500, e));
  return t <= 2400 ? [255, 224, 102] : t <= 2900 ? [255, 230, 138] : t <= 3600 ? [255, 240, 184] : t <= 4500 ? [255, 247, 224] : t <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function Se([e, t, i]) {
  const [s, r, o] = [e, t, i].map((n) => {
    const a = n / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * r + 0.0722 * o;
}
let m = class extends M {
  constructor() {
    super(...arguments), this._dragging = !1, this._pressed = !1, this._dragPct = null, this._popupOpen = !1, this._popupDragging = !1, this._popupDragPct = null, this._selectedPresetId = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._longPressTriggered = !1, this._longPressTimer = null, this._lastServiceCall = 0, this._onDialogBackdropClick = (e) => {
      e.target === this._dialogEl && this.closePopup();
    }, this._onDialogCancel = (e) => {
      e.preventDefault(), this.closePopup();
    }, this._onTilePointerDown = (e) => {
      if (this._isUnavailable || e.button !== 0) return;
      const t = e.currentTarget;
      this._pointerId = e.pointerId, this._pointerStartX = e.clientX, this._pointerStartY = e.clientY, this._hasMoved = !1, this._longPressTriggered = !1, this._pressed = !0, t.setPointerCapture(e.pointerId), this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        !this._hasMoved && this._pointerId !== null && (this._longPressTriggered = !0, this._resetTilePointer(t), this.openPopup());
      }, be);
    }, this._onTilePointerMove = (e) => {
      if (this._pointerId !== e.pointerId || !this._supportsBrightness) return;
      const t = Math.abs(e.clientX - this._pointerStartX), i = Math.abs(e.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (t < Ut && i < Ut) return;
        if (this._clearLongPress(), i > t) {
          this._resetTilePointer(e.currentTarget);
          return;
        }
        this._hasMoved = !0, this._dragging = !0;
      }
      const s = this._computeHorizontalPct(e.clientX, e.currentTarget);
      s !== this._dragPct && (this._dragPct = s, this._emitBrightness(s, !1));
    }, this._onTilePointerUp = (e) => {
      if (this._pointerId !== e.pointerId) return;
      const t = e.currentTarget;
      this._clearLongPress(), this._longPressTriggered || (this._hasMoved && this._dragPct !== null ? this._emitBrightness(this._dragPct, !0) : this._toggleLight()), this._resetTilePointer(t);
    }, this._onTilePointerCancel = (e) => {
      this._pointerId === e.pointerId && (this._clearLongPress(), this._resetTilePointer(e.currentTarget));
    }, this._onTileContextMenu = (e) => {
      e.preventDefault(), this.openPopup();
    }, this._onKeyDown = (e) => {
      if (!this._isUnavailable) {
        if (e.key === " " || e.key === "Enter")
          e.preventDefault(), this._toggleLight();
        else if (e.key === "o" || e.key === "O")
          e.preventDefault(), this.openPopup();
        else if (this._supportsBrightness) {
          const t = e.shiftKey ? 10 : 5;
          e.key === "ArrowRight" || e.key === "ArrowUp" ? (e.preventDefault(), this._emitBrightness(Math.min(100, this._brightnessPct + t), !0)) : (e.key === "ArrowLeft" || e.key === "ArrowDown") && (e.preventDefault(), this._emitBrightness(Math.max(0, this._brightnessPct - t), !0));
        }
      }
    }, this._onCapsulePointerDown = (e) => {
      if (this._isUnavailable || e.button !== 0 || !this._supportsBrightness) return;
      const t = e.currentTarget;
      t.setPointerCapture(e.pointerId), this._popupDragging = !0;
      const i = this._computeVerticalPct(e.clientY, t);
      this._popupDragPct = i, this._emitBrightness(i, !1);
    }, this._onCapsulePointerMove = (e) => {
      if (!this._popupDragging) return;
      const t = this._computeVerticalPct(e.clientY, e.currentTarget);
      t !== this._popupDragPct && (this._popupDragPct = t, this._emitBrightness(t, !1));
    }, this._onCapsulePointerUp = (e) => {
      if (!this._popupDragging) return;
      const t = e.currentTarget;
      t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._popupDragPct !== null && this._emitBrightness(this._popupDragPct, !0), this._popupDragging = !1, this._popupDragPct = null;
    };
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-light-card",
      entity: (e ? Object.keys(e.states).find((i) => i.startsWith("light.")) : void 0) ?? "light.living_room",
      use_light_color: !0,
      allow_drag_off: !0
    };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "light" } } },
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        { name: "use_light_color", selector: { boolean: {} } },
        { name: "allow_drag_off", selector: { boolean: {} } }
      ],
      computeLabel: (e) => ({
        entity: "Entità luce",
        name: "Nome personalizzato",
        icon: "Icona personalizzata",
        use_light_color: "Usa colore reale della luce",
        allow_drag_off: "Spegni trascinando a 0%"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-light-card: you must define an entity");
    this._config = {
      use_light_color: !0,
      allow_drag_off: !0,
      ...e
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress();
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_dragging") || e.has("_pressed") || e.has("_dragPct") || e.has("_popupOpen") || e.has("_popupDragging") || e.has("_popupDragPct") || e.has("_selectedPresetId"))
      return !0;
    if (e.has("hass") && this._config && this.hass) {
      const t = this.hass.states[this._config.entity];
      return t !== this._prevEntityState ? (this._prevEntityState = t, !0) : !1;
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
    const e = this._entity?.state;
    return !e || e === "unavailable" || e === "unknown";
  }
  get _supportsBrightness() {
    const e = this._entity;
    if (!e) return !1;
    if (typeof e.attributes.brightness == "number") return !0;
    const t = e.attributes.supported_color_modes;
    return Array.isArray(t) ? t.some((i) => i !== "onoff") : !0;
  }
  get _brightnessPct() {
    if (this._popupDragging && this._popupDragPct !== null)
      return this._popupDragPct;
    if (this._dragging && this._dragPct !== null)
      return this._dragPct;
    if (!this._isOn) return 0;
    const e = this._entity?.attributes.brightness;
    return typeof e != "number" ? 100 : Math.max(1, Math.min(100, Math.round(e / 255 * 100)));
  }
  get _activeRgb() {
    if (this._config?.use_light_color === !1) return null;
    const e = this._entity?.attributes;
    return e ? Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color : typeof e.color_temp_kelvin == "number" ? at(e.color_temp_kelvin) : null : null;
  }
  get _presets() {
    const e = this._config?.entity ?? "", t = [], i = /* @__PURE__ */ new Set(), s = (o) => {
      const n = o.hex.toLowerCase();
      i.has(n) || (i.add(n), t.push(o));
    };
    Array.isArray(this._config?.favorite_colors) && this._config.favorite_colors.forEach((o, n) => {
      const a = o.rgb_color ?? (o.color_temp_kelvin ? at(o.color_temp_kelvin) : null);
      if (!a) return;
      const l = nt(a);
      s({
        id: `cfg-${n}-${l}`,
        label: o.label || (o.color_temp_kelvin ? `${o.color_temp_kelvin}K` : l),
        hex: l,
        rgb: a,
        kelvin: o.color_temp_kelvin
      });
    });
    const r = this.hass?.entities?.[e]?.options?.light?.favorite_colors;
    if (Array.isArray(r) && r.forEach((o, n) => {
      const a = o.rgb_color ?? (o.color_temp_kelvin ? at(o.color_temp_kelvin) : null);
      if (!a) return;
      const l = nt(a);
      s({
        id: `ha-${n}-${l}`,
        label: o.color_temp_kelvin ? `${o.color_temp_kelvin}K` : l,
        hex: l,
        rgb: a,
        kelvin: o.color_temp_kelvin
      });
    }), e)
      for (const o of Zt(e))
        s(o);
    for (const o of xe)
      s(o);
    return t;
  }
  get _matchedPresetId() {
    if (this._selectedPresetId) return this._selectedPresetId;
    const e = this._activeRgb;
    if (!e) return null;
    let t = null, i = 1 / 0;
    for (const s of this._presets) {
      const r = Math.abs(s.rgb[0] - e[0]) + Math.abs(s.rgb[1] - e[1]) + Math.abs(s.rgb[2] - e[2]);
      r < i && (i = r, t = s.id);
    }
    return i <= 45 ? t : null;
  }
  _computeColorVars() {
    const e = this._activeRgb;
    if (!e)
      return `
        --m3e-light-accent: var(--md-sys-color-primary, #4c5c92);
        --m3e-light-on-accent: var(--md-sys-color-on-primary, #ffffff);
      `;
    const t = nt(e), s = Se(e) > 0.42 ? "#3d2f00" : "#ffffff";
    return `
      --m3e-light-accent: ${t};
      --m3e-light-on-accent: ${s};
    `;
  }
  _emitBrightness(e, t = !1) {
    if (!this.hass || !this._config) return;
    const i = performance.now();
    !t && i - this._lastServiceCall < ye || (this._lastServiceCall = i, e <= 0 ? this.hass.callService("light", "turn_off", {
      entity_id: this._config.entity
    }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      brightness_pct: e
    }));
  }
  _toggleLight() {
    !this.hass || !this._config || this._isUnavailable || this.hass.callService("light", "toggle", {
      entity_id: this._config.entity
    });
  }
  _selectPreset(e) {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this._selectedPresetId = e.id, we(this._config.entity, e);
    const t = {
      entity_id: this._config.entity,
      rgb_color: e.rgb
    };
    e.kelvin && (t.color_temp_kelvin = e.kelvin), this.hass.callService("light", "turn_on", t);
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform from Tile)
     ========================================================================= */
  async openPopup() {
    if (this._isUnavailable || this._popupOpen) return;
    const e = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), n = Math.max(0.25, e.width / s.width), a = Math.max(0.15, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${n}, ${a})`,
            borderRadius: "28px",
            opacity: 0.7
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            borderRadius: "32px",
            opacity: 1
          }
        ],
        {
          duration: 380,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)"
        }
      );
    }
  }
  closePopup() {
    const e = this._dialogEl, t = this._dialogSurfaceEl;
    if (!e || !e.open) {
      this._popupOpen = !1;
      return;
    }
    if (t) {
      const i = t.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.92)", opacity: 0 }
        ],
        {
          duration: 180,
          easing: "cubic-bezier(0.4, 0, 1, 1)"
        }
      );
      i.onfinish = () => {
        e.close(), this._popupOpen = !1;
      };
    } else
      e.close(), this._popupOpen = !1;
  }
  /* =========================================================================
     HORIZONTAL TILE POINTER HANDLERS (Tap = Toggle, Drag = Dim, Hold = Popup)
     ========================================================================= */
  _computeHorizontalPct(e, t) {
    const i = t.getBoundingClientRect();
    if (i.width <= 0) return 0;
    const s = Math.round(Math.max(0, Math.min(1, (e - i.left) / i.width)) * 100);
    return s === 0 && !this._config?.allow_drag_off ? 1 : s;
  }
  _resetTilePointer(e) {
    e && this._pointerId !== null && e.hasPointerCapture(this._pointerId) && e.releasePointerCapture(this._pointerId), this._pointerId = null, this._dragging = !1, this._pressed = !1, this._hasMoved = !1, this._dragPct = null;
  }
  /* =========================================================================
     VERTICAL CAPSULE SLIDER POINTER HANDLERS (Popup Dialog)
     ========================================================================= */
  _computeVerticalPct(e, t) {
    const i = t.getBoundingClientRect();
    if (i.height <= 0) return 0;
    const s = (i.bottom - e) / i.height, r = Math.round(Math.max(0, Math.min(1, s)) * 100);
    return Math.max(1, r);
  }
  /* =========================================================================
     ICONS
     ========================================================================= */
  _renderBulbIcon(e, t) {
    return typeof customElements < "u" && customElements.get("ha-icon") ? c`<ha-icon .icon=${e}></ha-icon>` : t ? c`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        ` : c`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `;
  }
  _renderSunIcon() {
    return c`
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
    if (!this._config) return p;
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._config.icon || e?.attributes.icon || "mdi:lightbulb", s = this._isOn, r = this._brightnessPct, o = this._isUnavailable ? "Unavailable" : s ? this._supportsBrightness ? `On • ${r}%` : "On" : "Off", n = this._computeColorVars(), a = this._matchedPresetId;
    return c`
      <ha-card
        class="tile-card ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${n} --fill-pct: ${s ? r : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${t}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${r}
        aria-valuetext=${o}
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
            <span class="title">${t}</span>
            <span class="subtitle">${o}</span>
          </div>
        </div>
      </ha-card>

      <dialog
        class="light-dialog"
        style="${n}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
      >
        ${this._popupOpen ? c`
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
                  <span class="dialog-title">${t}</span>
                  <button
                    type="button"
                    class="power-btn ${s ? "is-on" : ""}"
                    @click=${this._toggleLight}
                    aria-label="${s ? "Turn off" : "Turn on"} ${t}"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                      />
                    </svg>
                  </button>
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
                      aria-label="${t} brightness"
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
                      ${s ? c`
                            <div class="sun-layer sun-filled" aria-hidden="true">
                              ${this._renderSunIcon()}
                            </div>
                          ` : p}
                    </div>
                  </div>

                  <div class="readout">
                    <span class="readout-value">${s ? `${r}%` : "Off"}</span>
                    <span class="readout-label ${s ? "" : "hidden"}">Brightness</span>
                  </div>
                </div>

                <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                  <button
                    type="button"
                    class="palette-btn"
                    title="Use Material You theme color"
                    @click=${() => {
      this._selectedPresetId = null, this._toggleLight();
    }}
                    aria-label="Color presets"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                      />
                    </svg>
                  </button>

                  ${this._presets.map(
      (l) => c`
                      <button
                        type="button"
                        class="color-swatch ${s && a === l.id ? "selected" : ""}"
                        style="background: ${l.hex};"
                        role="radio"
                        aria-checked=${String(s && a === l.id)}
                        aria-label=${l.label}
                        title=${l.label}
                        @click=${() => this._selectPreset(l)}
                      ></button>
                    `
    )}
                </div>
              </div>
            ` : p}
      </dialog>
    `;
  }
};
m.styles = [
  ft,
  q`
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
        transform: scale(0.985);
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
        min-height: 84px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        pointer-events: none;
      }

      /* Bare lightbulb icon — no container box */
      .bulb-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
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
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
      }

      .meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .title {
        font-size: var(--md-sys-typescale-title-medium-size, 15px);
        font-weight: var(--md-sys-typescale-title-medium-weight, 600);
        line-height: 20px;
        letter-spacing: 0.1px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color var(--m3e-spring-effects-default);
      }

      .subtitle {
        font-size: var(--md-sys-typescale-body-medium-size, 13px);
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
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
        max-width: min(410px, calc(100vw - 24px));
        width: 100%;
        overflow: visible;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.light-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 56%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon-btn,
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
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .power-btn {
        background: var(--md-sys-color-surface-container-highest, #35343a);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .power-btn.is-on {
        background: var(--md-sys-color-primary-container, #344479);
        color: var(--md-sys-color-on-primary-container, #dbe1ff);
      }

      .icon-btn:active,
      .power-btn:active {
        transform: scale(0.92);
      }

      .icon-btn svg,
      .power-btn svg {
        width: 22px;
        height: 22px;
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
        width: 176px;
        height: 348px;
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
b([
  J({ attribute: !1 })
], m.prototype, "hass", 2);
b([
  f()
], m.prototype, "_config", 2);
b([
  f()
], m.prototype, "_dragging", 2);
b([
  f()
], m.prototype, "_pressed", 2);
b([
  f()
], m.prototype, "_dragPct", 2);
b([
  f()
], m.prototype, "_popupOpen", 2);
b([
  f()
], m.prototype, "_popupDragging", 2);
b([
  f()
], m.prototype, "_popupDragPct", 2);
b([
  f()
], m.prototype, "_selectedPresetId", 2);
b([
  w("dialog.light-dialog")
], m.prototype, "_dialogEl", 2);
b([
  w(".tile-card")
], m.prototype, "_tileEl", 2);
b([
  w(".dialog-surface")
], m.prototype, "_dialogSurfaceEl", 2);
m = b([
  gt("m3e-light-card")
], m);
var Pe = Object.defineProperty, Ce = Object.getOwnPropertyDescriptor, y = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ce(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (s ? n(t, i, r) : n(r)) || r);
  return s && r && Pe(t, i, r), r;
};
const ke = /* @__PURE__ */ new Set([
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
]), j = 135, A = 270;
function Ae(e) {
  return e * Math.PI / 180;
}
function B(e, t, i, s) {
  const r = Ae(s);
  return { x: e + i * Math.cos(r), y: t + i * Math.sin(r) };
}
function Ee(e, t, i, s, r) {
  const o = B(e, t, i, s), n = B(e, t, i, r);
  return `M ${o.x.toFixed(2)} ${o.y.toFixed(2)} A ${i} ${i} 0 1 1 ${n.x.toFixed(2)} ${n.y.toFixed(2)}`;
}
let _ = class extends M {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._volDragging = !1, this._volPct = null, this._prevStates = {}, this._onTileClick = () => {
      if (this._config?.tap_action === "toggle" && this.hass && this._config) {
        const e = this._config.entity.split(".")[0];
        this.hass.callService(e, "toggle", { entity_id: this._config.entity });
        return;
      }
      this.openPopup();
    }, this._onDialPointerDown = (e) => {
      if (e.button !== 0) return;
      const t = e.currentTarget;
      t.setPointerCapture(e.pointerId), this._dialDragging = !0;
      const i = this._pointerToTemp(e, t);
      this._dialTemp = i;
    }, this._onDialPointerMove = (e) => {
      if (!this._dialDragging) return;
      const t = this._pointerToTemp(e, e.currentTarget);
      t !== this._dialTemp && (this._dialTemp = t);
    }, this._onDialPointerUp = (e) => {
      if (!this._dialDragging) return;
      const t = e.currentTarget;
      t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._dialTemp !== null && this._setClimateTemp(this._dialTemp), this._dialDragging = !1, this._dialTemp = null;
    }, this._onVolPointerDown = (e) => {
      if (e.button !== 0) return;
      const t = e.currentTarget;
      t.setPointerCapture(e.pointerId), this._volDragging = !0, this._updateVolFromPointer(e.clientX, t, !1);
    }, this._onVolPointerMove = (e) => {
      this._volDragging && this._updateVolFromPointer(e.clientX, e.currentTarget, !1);
    }, this._onVolPointerUp = (e) => {
      if (!this._volDragging) return;
      const t = e.currentTarget;
      t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._updateVolFromPointer(e.clientX, t, !0), this._volDragging = !1, this._volPct = null;
    };
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-status-card",
      entity: (e ? Object.keys(e.states).find(
        (i) => i.startsWith("binary_sensor.") || i.startsWith("climate.") || i.startsWith("media_player.") || i.startsWith("sensor.")
      ) : void 0) ?? "binary_sensor.motion",
      popup_type: "auto",
      tap_action: "popup"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "icon_active", selector: { icon: {} } },
            { name: "icon_inactive", selector: { icon: {} } }
          ]
        },
        {
          name: "active_state",
          selector: { text: {} }
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "label_active", selector: { text: {} } },
            { name: "label_inactive", selector: { text: {} } }
          ]
        },
        {
          name: "popup_type",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: "Automatico (in base al dispositivo)" },
                { value: "sensor", label: "Sensore (Anello di stato + Telemetria)" },
                { value: "climate", label: "Clima / Termostato (Dial circolare + Mode)" },
                { value: "remote", label: "Telecomando / TV (Rocker Volume + Controlli)" },
                { value: "media", label: "Media / Speaker (Player + Volume Pill)" },
                { value: "none", label: "Nessun popup" }
              ]
            }
          }
        },
        {
          name: "tap_action",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "popup", label: "Apri schermata espansa" },
                { value: "toggle", label: "Toggle stato (hold per popup)" }
              ]
            }
          }
        },
        { name: "secondary_entity", selector: { entity: {} } },
        { name: "outdoor_entity", selector: { entity: { domain: "sensor" } } },
        {
          type: "expandable",
          title: "Pulsanti Telecomando (Entità button/script o comandi remote)",
          name: "remote_buttons",
          schema: [
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
      ],
      computeLabel: (e) => ({
        entity: "Entità principale",
        name: "Nome personalizzato",
        icon_active: "Icona stato attivo",
        icon_inactive: "Icona stato inattivo",
        active_state: "Stati attivi (es. on,home,detected)",
        label_active: "Testo stato attivo",
        label_inactive: "Testo stato inattivo",
        popup_type: "Tipo card / Schermata popup",
        tap_action: "Azione al tocco",
        secondary_entity: "Entità secondaria (auto-rilevata dal device se vuota)",
        outdoor_entity: "Temperatura esterna (per Clima)",
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
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-status-card: you must define an entity");
    this._config = {
      popup_type: "auto",
      tap_action: "popup",
      ...e
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 };
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_pressed") || e.has("_popupOpen") || e.has("_dialDragging") || e.has("_dialTemp") || e.has("_activeSheet") || e.has("_volDragging") || e.has("_volPct"))
      return !0;
    if (e.has("hass") && this._config && this.hass) {
      const t = [
        this._config.entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...this._getSiblingEntityIds()
      ].filter(Boolean);
      let i = !1;
      for (const s of t) {
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
  /**
   * Auto-discovers sibling sensor entities belonging to the exact same Home Assistant device_id
   * (e.g. humidity on a thermometer device, or temperature on a motion sensor device).
   */
  _getSiblingEntityIds() {
    if (!this.hass?.entities || !this._config) return [];
    const e = this._config.entity, t = this.hass.entities[e]?.device_id;
    if (!t) return [];
    const i = [];
    for (const [s, r] of Object.entries(this.hass.entities))
      s !== e && r.device_id === t && s.startsWith("sensor.") && i.push(s);
    return i;
  }
  _getSiblingSensors() {
    if (!this.hass) return [];
    const e = [], t = /* @__PURE__ */ new Set();
    if (this._config?.secondary_entity) {
      const r = this.hass.states[this._config.secondary_entity];
      r && (e.push(r), t.add(r.entity_id));
    }
    const i = ["temperature", "humidity", "illuminance", "battery"], s = this._getSiblingEntityIds().map((r) => this.hass.states[r]).filter((r) => !!r && !t.has(r.entity_id));
    s.sort((r, o) => {
      const n = i.indexOf(String(r.attributes.device_class ?? "")), a = i.indexOf(String(o.attributes.device_class ?? ""));
      return (n === -1 ? 99 : n) - (a === -1 ? 99 : a);
    });
    for (const r of s) {
      const o = String(r.attributes.device_class ?? "");
      i.includes(o) && e.push(r);
    }
    return e;
  }
  get _secondaryEntity() {
    return this._getSiblingSensors()[0];
  }
  get _outdoorEntity() {
    if (!(!this.hass || !this._config?.outdoor_entity))
      return this.hass.states[this._config.outdoor_entity];
  }
  get _resolvedPopupType() {
    const e = this._config?.popup_type ?? "auto";
    if (e !== "auto") return e;
    const t = this._config?.entity ?? "";
    return t.startsWith("climate.") ? "climate" : t.startsWith("remote.") ? "remote" : t.startsWith("media_player.") ? String(this._entity?.attributes.device_class ?? "") === "tv" ? "remote" : "media" : "sensor";
  }
  get _isActive() {
    const e = String(this._entity?.state ?? "").toLowerCase();
    return !e || e === "unavailable" || e === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).includes(e) : this._config?.entity.startsWith("sensor.") && !Number.isNaN(Number(e)) ? !0 : ke.has(e);
  }
  get _stateLabel() {
    const e = this._entity;
    if (!e) return "Unavailable";
    const t = e.state;
    if (t === "unavailable" || t === "unknown") return "Unavailable";
    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;
    const i = e.entity_id.split(".")[0];
    if (i === "climate") {
      const s = t.charAt(0).toUpperCase() + t.slice(1), r = e.attributes.temperature;
      return t !== "off" && typeof r == "number" ? `${s} ${r}` : s;
    }
    if (i === "sensor") {
      const s = e.attributes.unit_of_measurement, r = s ? `${t}${s}` : t;
      if (e.attributes.device_class === "temperature" || s === "°C" || s === "°F") {
        const n = this._getSiblingSensors().find(
          (a) => a.attributes.device_class === "humidity" || a.attributes.unit_of_measurement === "%"
        );
        if (n && n.state !== "unavailable" && n.state !== "unknown")
          return `${r} • ${n.state}${n.attributes.unit_of_measurement ?? "%"}`;
      }
      return r;
    }
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform)
     ========================================================================= */
  async openPopup() {
    if (this._resolvedPopupType === "none" || this._popupOpen) return;
    const e = this._tileEl?.getBoundingClientRect();
    this._activeSheet = null, this._popupOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), n = Math.max(0.28, e.width / s.width), a = Math.max(0.16, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${n}, ${a})`,
            borderRadius: "28px",
            opacity: 0.72
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            borderRadius: "32px",
            opacity: 1
          }
        ],
        {
          duration: 380,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)"
        }
      );
    }
  }
  closePopup() {
    const e = this._dialogEl, t = this._dialogSurfaceEl;
    if (!e || !e.open) {
      this._popupOpen = !1, this._activeSheet = null;
      return;
    }
    if (t) {
      const i = t.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.92)", opacity: 0 }
        ],
        { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)" }
      );
      i.onfinish = () => {
        e.close(), this._popupOpen = !1, this._activeSheet = null;
      };
    } else
      e.close(), this._popupOpen = !1, this._activeSheet = null;
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
    const e = this._entity?.attributes.current_temperature;
    if (typeof e == "number") return e;
    const t = this._secondaryEntity?.state;
    return t && !Number.isNaN(Number(t)) ? Number(t) : null;
  }
  _tempToDeg(e) {
    const t = Math.max(
      0,
      Math.min(1, (e - this._climateMin) / (this._climateMax - this._climateMin))
    );
    return j + t * A;
  }
  _pointerToTemp(e, t) {
    const i = t.getBoundingClientRect(), s = i.left + i.width / 2, r = i.top + i.height / 2;
    let o = Math.atan2(e.clientY - r, e.clientX - s) * 180 / Math.PI;
    o < 0 && (o += 360);
    let n = (o - j + 360) % 360;
    n > A && (n = n > A + (360 - A) / 2 ? 0 : A);
    const a = n / A, l = this._climateMin + a * (this._climateMax - this._climateMin);
    return Math.round(l * 2) / 2;
  }
  _setClimateTemp(e) {
    if (!this.hass || !this._config) return;
    const t = Math.max(this._climateMin, Math.min(this._climateMax, Math.round(e * 2) / 2));
    this.hass.callService("climate", "set_temperature", {
      entity_id: this._config.entity,
      temperature: t
    });
  }
  _setClimateMode(e) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this._config.entity,
      hvac_mode: e
    }), this._activeSheet = null);
  }
  _setClimatePreset(e) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_preset_mode", {
      entity_id: this._config.entity,
      preset_mode: e
    }), this._activeSheet = null);
  }
  _setClimateFan(e) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_fan_mode", {
      entity_id: this._config.entity,
      fan_mode: e
    }), this._activeSheet = null);
  }
  _setClimateSwing(e) {
    !this.hass || !this._config || (this.hass.callService("climate", "set_swing_mode", {
      entity_id: this._config.entity,
      swing_mode: e
    }), this._activeSheet = null);
  }
  /**
   * Executes a remote button binding:
   * - If configured as an entity_id (button.*, script.*, switch.*, scene.*), triggers that entity.
   * - If configured as a command string (e.g. "VolumeUp"), sends remote.send_command.
   * - Otherwise falls back to the default media_player service or remote command.
   */
  _triggerRemoteButton(e, t, i = {}, s) {
    if (!this.hass || !this._config) return;
    const r = this._config.remote_buttons?.[e]?.trim();
    if (r) {
      if (r.startsWith("button.")) {
        this.hass.callService("button", "press", { entity_id: r });
        return;
      }
      if (r.startsWith("script.")) {
        this.hass.callService("script", "turn_on", { entity_id: r });
        return;
      }
      if (r.startsWith("scene.")) {
        this.hass.callService("scene", "turn_on", { entity_id: r });
        return;
      }
      if (r.startsWith("switch.")) {
        this.hass.callService("switch", "toggle", { entity_id: r });
        return;
      }
      this.hass.callService("remote", "send_command", {
        entity_id: this._config.entity,
        command: r
      });
      return;
    }
    if (this._config.entity.startsWith("remote.")) {
      this.hass.callService("remote", "send_command", {
        entity_id: this._config.entity,
        command: s ?? e
      });
      return;
    }
    this._callEntityService(t, i);
  }
  /* =========================================================================
     MEDIA VOLUME PILL INTERACTION
     ========================================================================= */
  get _mediaVolumePct() {
    if (this._volDragging && this._volPct !== null) return this._volPct;
    const e = this._entity?.attributes.volume_level;
    return typeof e == "number" ? Math.round(e * 100) : 40;
  }
  _updateVolFromPointer(e, t, i) {
    const s = t.getBoundingClientRect(), r = Math.round(Math.max(0, Math.min(1, (e - s.left) / s.width)) * 100);
    this._volPct = r, i && this.hass && this._config && this.hass.callService("media_player", "volume_set", {
      entity_id: this._config.entity,
      volume_level: r / 100
    });
  }
  _callEntityService(e, t = {}) {
    if (!this.hass || !this._config) return;
    const i = this._config.entity.split(".")[0];
    this.hass.callService(i, e, {
      entity_id: this._config.entity,
      ...t
    });
  }
  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  _renderEntityIcon(e) {
    if (e && typeof customElements < "u" && customElements.get("ha-icon"))
      return c`<ha-icon .icon=${e}></ha-icon>`;
    const t = this._resolvedPopupType;
    return e?.includes("thermometer") || this._config?.entity.includes("temp") ? c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : t === "climate" ? c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : t === "remote" ? c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : t === "media" ? c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : c`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>`;
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _renderSensorPopup(e) {
    const t = this._getSiblingSensors();
    return c`
      <div class="sensor-hero">
        <div class="sensor-ring ${this._isActive ? "is-active" : ""}">
          <span class="sensor-ring-icon">${this._renderEntityIcon(e)}</span>
          <span class="sensor-ring-state">${this._stateLabel}</span>
          <span class="sensor-ring-sub">
            ${this._entity?.attributes.device_class ? String(this._entity.attributes.device_class).replace(/^./, (i) => i.toUpperCase()) : "Status"}
          </span>
        </div>
      </div>

      ${t.length > 0 ? c`
            <div class="modular-stack">
              ${t.map((i) => {
      const s = String(i.attributes.device_class ?? ""), r = i.attributes.friendly_name || (s ? s.replace(/^./, (n) => n.toUpperCase()) : "Sensor"), o = `${i.state}${i.attributes.unit_of_measurement ?? ""}`;
      return c`
                  <div class="info-pill">
                    <span class="info-pill-left">
                      ${s === "humidity" ? c`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : c`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`}
                      <span>${r}</span>
                    </span>
                    <span class="info-pill-val">${o}</span>
                  </div>
                `;
    })}
            </div>
          ` : p}
    `;
  }
  _renderClimatePopup() {
    const e = this._entity, t = String(e?.state ?? "off").toLowerCase(), i = t === "off", s = this._climateTarget, r = this._climateCurrent, o = this._outdoorEntity, n = Math.floor(s), a = Math.abs(s - n - 0.5) < 0.05, l = this._tempToDeg(s), h = r !== null ? this._tempToDeg(r) : null, g = 140, d = 140, v = 114, x = Ee(g, d, v, j, j + A), C = B(g, d, v, l), Q = h !== null ? B(g, d, v, h) : null, tt = h !== null ? B(g, d, v - 22, h) : null, Ft = Array.isArray(e?.attributes.hvac_modes) ? e.attributes.hvac_modes : ["heat", "cool", "off"], _t = Array.isArray(e?.attributes.preset_modes) ? e.attributes.preset_modes : [], vt = Array.isArray(e?.attributes.fan_modes) ? e.attributes.fan_modes : [], bt = Array.isArray(e?.attributes.swing_modes) ? e.attributes.swing_modes : [], yt = String(e?.attributes.preset_mode ?? "none"), xt = String(e?.attributes.fan_mode ?? "auto"), $t = String(e?.attributes.swing_mode ?? "off"), et = typeof e?.attributes.current_humidity == "number" ? `${e.attributes.current_humidity}%` : this._getSiblingSensors().find((u) => u.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((u) => u.attributes.device_class === "humidity").state}%` : null, it = _t.length > 0, st = vt.length > 0, rt = bt.length > 0, wt = t === "heat" || t === "heating" ? "mode-heat" : t === "cool" || t === "cooling" ? "mode-cool" : "mode-off", U = (u) => u.replace(/_/g, " ").replace(/^./, (F) => F.toUpperCase()), I = this._activeSheet === "mode" ? { title: "Select a mode", options: Ft, current: t, onSelect: (u) => this._setClimateMode(u) } : this._activeSheet === "preset" ? { title: "Select preset", options: _t, current: yt, onSelect: (u) => this._setClimatePreset(u) } : this._activeSheet === "fan" ? { title: "Fan speed", options: vt, current: xt, onSelect: (u) => this._setClimateFan(u) } : this._activeSheet === "swing" ? { title: "Swing mode", options: bt, current: $t, onSelect: (u) => this._setClimateSwing(u) } : null;
    return c`
      <div class="climate-hero ${wt} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${g} cy=${d} r="132" class="dial-bg-circle" />
            <path d=${x} class="dial-arc-track" />

            ${Q && tt ? re`
                  <circle cx=${Q.x} cy=${Q.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${tt.x}
                    y=${tt.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(r)}
                  </text>
                ` : p}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${C.x.toFixed(2)}, ${C.y.toFixed(2)}) rotate(${l.toFixed(1)})">
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
            ${i && !this._dialDragging ? c`<span class="dial-readout-off">Off</span>` : c`
                  <span class="dial-readout-num">
                    ${n}${a ? c`<sup>5</sup>` : p}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(u) => u.stopPropagation()}>
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
        <div class="${it ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${it ? "compact-trait" : ""} ${wt}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${t === "heat" ? c`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : t === "cool" ? c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : c`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${U(t)}</span>
            </span>
          </button>

          ${it ? c`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${U(yt)}</span>
                  </span>
                  <span class="trait-chevron">⌄</span>
                </button>
              ` : p}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${st || rt ? c`
              <div class="${st && rt ? "climate-grid-2" : ""}">
                ${st ? c`
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
                            <span class="mode-pill-val">${U(xt)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    ` : p}

                ${rt ? c`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${U($t)}</span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    ` : p}
              </div>
            ` : p}

        ${r !== null || o || et ? c`
              <div class="telemetry-card">
                ${r !== null ? c`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${r}°</strong>
                      </div>
                    ` : p}
                ${et ? c`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${et}</strong>
                      </div>
                    ` : p}
                ${o ? c`
                      <div class="telemetry-row">
                        <span>Outdoor temperature</span>
                        <strong>${o.state}${o.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : p}
              </div>
            ` : p}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${I ? c`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(u) => u.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ⌄
                  </button>
                  <span>${I.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${I.options.map((u) => {
      const F = u.toLowerCase() === I.current.toLowerCase(), jt = this._activeSheet === "mode" ? u === "heat" ? "mode-heat" : u === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return c`
                      <button
                        type="button"
                        class="mode-option ${F ? `selected ${jt}` : ""}"
                        @click=${() => I.onSelect(u)}
                      >
                        <span>${U(u)}</span>
                        ${F ? c`<span class="check-mark">✓</span>` : p}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : p}
    `;
  }
  _renderRemotePopup() {
    const e = String(this._entity?.attributes.source ?? "Source");
    return c`
      <div class="remote-hero">
        <div class="rocker-pill">
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume up"
            @click=${() => this._triggerRemoteButton("volume_up", "volume_up", {}, "VolumeUp")}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>
          </button>
          <span class="rocker-divider"></span>
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume down"
            @click=${() => this._triggerRemoteButton("volume_down", "volume_down", {}, "VolumeDown")}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM5 9v6h4l5 5V4L9 9H5Z"/></svg>
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton("unmute", "volume_mute", { is_volume_muted: !1 }, "Unmute")}
          >
            Unmute
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton("mute", "volume_mute", { is_volume_muted: !0 }, "Mute")}
          >
            Mute
          </button>
        </div>

        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton("power_on", "turn_on", {}, "PowerOn")}
          >
            On
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton("power_off", "turn_off", {}, "PowerOff")}
          >
            Off
          </button>
        </div>

        <div class="transport-row">
          <button
            type="button"
            class="transport-icon"
            aria-label="Previous"
            @click=${() => this._triggerRemoteButton("prev", "media_previous_track", {}, "Previous")}
          >
            ⏮
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Play"
            @click=${() => this._triggerRemoteButton("play", "media_play", {}, "Play")}
          >
            ▶
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Pause"
            @click=${() => this._triggerRemoteButton("pause", "media_pause", {}, "Pause")}
          >
            ⏸
          </button>
          <button
            type="button"
            class="transport-icon"
            aria-label="Next"
            @click=${() => this._triggerRemoteButton("next", "media_next_track", {}, "Next")}
          >
            ⏭
          </button>
        </div>

        <div class="channel-pill">
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel down"
            @click=${() => this._triggerRemoteButton("ch_down", "media_previous_track", {}, "ChannelDown")}
          >
            ⌄
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteButton("ch_up", "media_next_track", {}, "ChannelUp")}
          >
            ⌃
          </button>
        </div>

        <div class="secondary-action-card">
          <span>${e}</span>
          <span>⌄</span>
        </div>
      </div>
    `;
  }
  _renderMediaPopup() {
    const e = this._entity, t = e?.state === "playing", i = !e || e.state === "idle" || e.state === "off", s = String(e?.attributes.media_title ?? (i ? "Nothing playing" : "Paused")), r = String(e?.attributes.media_artist ?? ""), o = String(e?.attributes.app_name ?? ""), n = String(e?.attributes.entity_picture ?? ""), a = this._mediaVolumePct;
    return c`
      <div
        class="media-hero-card ${n && !i ? "has-art" : ""}"
        style=${n && !i ? `--media-art: url("${n}");` : ""}
      >
        <div class="media-hero-top">
          <span class="media-app-badge">${o || "▶"}</span>
        </div>

        <div class="media-hero-mid">
          <div class="media-meta">
            <span class="media-title">${s}</span>
            ${r ? c`<span class="media-artist">${r}</span>` : p}
          </div>
          ${i ? p : c`
                <button
                  type="button"
                  class="media-play-fab"
                  aria-label=${t ? "Pause" : "Play"}
                  @click=${() => this._callEntityService("media_play_pause")}
                >
                  ${t ? "⏸" : "▶"}
                </button>
              `}
        </div>

        <div class="media-scrubber-row">
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callEntityService("media_previous_track")}
          >
            ⏮
          </button>
          <div class="scrubber-track">
            <div class="scrubber-fill" style="width: ${i ? 50 : 28}%"></div>
            <span class="scrubber-dot" style="left: ${i ? 50 : 28}%"></span>
          </div>
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callEntityService("media_next_track")}
          >
            ⏭
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Shape Coding: Full Pill (9999px) for Active Primary Volume Slider -->
        <div
          class="volume-pill ${this._volDragging ? "is-dragging" : ""}"
          style="--vol-pct: ${a}%;"
          role="slider"
          tabindex="0"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${a}
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
            <span>${a}%</span>
          </div>
        </div>

        <!-- Shape Coding: Full Pill (9999px) Tonal Primary for Active Stop Casting -->
        ${i ? p : c`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callEntityService("turn_off")}
              >
                Stop casting
              </button>
            `}

        <!-- Shape Coding: 20px Rounded Rectangle Neutral for Secondary Actions -->
        <button
          type="button"
          class="secondary-action-card"
          @click=${() => this._callEntityService("media_play_pause")}
        >
          <span>${i ? "Cast my audio" : o ? `Open ${o}` : "Open remote"}</span>
          <span>↗</span>
        </button>
      </div>
    `;
  }
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return p;
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._isActive, s = i ? this._config.icon_active || e?.attributes.icon : this._config.icon_inactive || this._config.icon_active || e?.attributes.icon, r = this._resolvedPopupType, o = r !== "none";
    return c`
      <ha-card
        class="status-tile ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""}"
        role="button"
        tabindex="0"
        aria-label="${t}, ${this._stateLabel}"
        @pointerdown=${() => this._pressed = !0}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${this._onTileClick}
        @contextmenu=${(n) => {
      n.preventDefault(), this.openPopup();
    }}
        @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && (n.preventDefault(), this._onTileClick());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderEntityIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${t}</span>
            <span class="tile-subtitle">${this._stateLabel}</span>
          </div>
          ${o ? c`
                <span class="tile-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                    />
                  </svg>
                </span>
              ` : p}
        </div>
      </ha-card>

      <dialog
        class="status-dialog"
        @click=${(n) => {
      n.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(n) => {
      n.preventDefault(), this.closePopup();
    }}
      >
        ${this._popupOpen ? c`
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
                  <span class="dialog-title">${t}</span>
                </header>

                ${r === "sensor" ? this._renderSensorPopup(s) : r === "climate" ? this._renderClimatePopup() : r === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
              </div>
            ` : p}
      </dialog>
    `;
  }
};
_.styles = [
  ft,
  q`
      :host {
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. COMPACT DASHBOARD TILE (Shape Coding: Pill = Active, 28px = Off)
         ===================================================================== */
      .status-tile {
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        outline: none;
        border-radius: var(--ha-card-border-radius, 28px);
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
        min-height: 84px;
        padding: 16px 18px 16px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 26px;
        height: 26px;
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
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .status-tile.is-active .tile-title,
      .status-tile.is-active .tile-subtitle,
      .status-tile.is-active .tile-chevron {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-chevron {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.78;
      }

      .tile-chevron svg {
        width: 20px;
        height: 20px;
      }

      /* =====================================================================
         2. MODULAR EXPANDED POPUP SHELL
         ===================================================================== */
      dialog.status-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(410px, calc(100vw - 24px));
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow: hidden;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

      /* =====================================================================
         VARIANT 1: SENSOR HERO + TELEMETRY PILL
         ===================================================================== */
      .sensor-hero {
        display: flex;
        justify-content: center;
        padding: 12px 0;
      }

      .sensor-ring {
        width: 236px;
        height: 236px;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        border-radius: 24px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        font-size: 15px;
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
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
        width: 264px;
        height: 264px;
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
        font-size: 18px;
        opacity: 0.75;
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
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        align-items: flex-end;
        z-index: 10;
      }

      .mode-sheet {
        width: 100%;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mode-sheet-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .mode-sheet-list {
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
         VARIANT 3: REMOTE / TV (Vertical Rocker Pill + Split Pills)
         ===================================================================== */
      .remote-hero {
        display: flex;
        justify-content: center;
        padding: 6px 0;
      }

      .rocker-pill {
        width: 132px;
        height: 236px;
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
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        overflow: hidden;
      }

      .split-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .split-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .split-vdivider {
        width: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 4px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        font-size: 18px;
      }

      .transport-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
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

      .media-app-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: var(--m3e-corner-full);
        background: color-mix(in srgb, var(--md-sys-color-surface, #131316) 55%, transparent);
        font-size: 12px;
        font-weight: 600;
      }

      .media-hero-mid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .media-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .media-title {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .media-artist {
        font-size: 14px;
        opacity: 0.85;
      }

      .media-play-fab {
        flex: 0 0 48px;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #e8e2d5);
        color: var(--md-sys-color-on-primary-container, #1b1b1f);
        font-size: 18px;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .media-scrubber-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .scrubber-btn {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
      }

      .scrubber-track {
        position: relative;
        flex: 1;
        height: 3px;
        border-radius: 9999px;
        background: color-mix(in srgb, currentColor 28%, transparent);
      }

      .scrubber-fill {
        height: 100%;
        border-radius: 9999px;
        background: currentColor;
      }

      .scrubber-dot {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: currentColor;
        transform: translate(-50%, -50%);
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
    `
];
y([
  J({ attribute: !1 })
], _.prototype, "hass", 2);
y([
  f()
], _.prototype, "_config", 2);
y([
  f()
], _.prototype, "_pressed", 2);
y([
  f()
], _.prototype, "_popupOpen", 2);
y([
  f()
], _.prototype, "_dialDragging", 2);
y([
  f()
], _.prototype, "_dialTemp", 2);
y([
  f()
], _.prototype, "_activeSheet", 2);
y([
  f()
], _.prototype, "_volDragging", 2);
y([
  f()
], _.prototype, "_volPct", 2);
y([
  w("dialog.status-dialog")
], _.prototype, "_dialogEl", 2);
y([
  w(".status-tile")
], _.prototype, "_tileEl", 2);
y([
  w(".dialog-surface")
], _.prototype, "_dialogSurfaceEl", 2);
_ = y([
  gt("m3e-status-card")
], _);
var Me = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, P = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Te(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (s ? n(t, i, r) : n(r)) || r);
  return s && r && Me(t, i, r), r;
};
const Oe = 420;
let $ = class extends M {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._onTilePointerDown = (e) => {
      this._isUnavailable || e.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this.openPopup();
      }, Oe));
    }, this._onTilePointerUp = () => {
      this._clearLongPress(), !this._longPressTriggered && this._pressed && this._toggle(), this._pressed = !1;
    }, this._onTilePointerCancel = () => {
      this._clearLongPress(), this._pressed = !1;
    }, this._onSwitchPointerDown = (e) => {
      e.button === 0 && (e.currentTarget.setPointerCapture(e.pointerId), this._dragStartY = e.clientY);
    }, this._onSwitchPointerUp = (e) => {
      const t = e.currentTarget;
      if (t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._dragStartY === null) return;
      const i = e.clientY - this._dragStartY;
      this._dragStartY = null, Math.abs(i) >= 24 ? this._setState(i < 0) : this._toggle();
    };
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-toggle-card",
      entity: (e ? Object.keys(e.states).find(
        (i) => i.startsWith("switch.") || i.startsWith("input_boolean.")
      ) : void 0) ?? "switch.outlet"
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
              domain: ["switch", "input_boolean", "fan", "light", "automation", "humidifier"]
            }
          }
        },
        { name: "name", selector: { text: {} } },
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
            { name: "label_on", selector: { text: {} } },
            { name: "label_off", selector: { text: {} } }
          ]
        }
      ],
      computeLabel: (e) => ({
        entity: "Entità (switch, presa, input_boolean…)",
        name: "Nome personalizzato",
        icon_on: "Icona acceso",
        icon_off: "Icona spento",
        label_on: "Testo acceso (default: On)",
        label_off: "Testo spento (default: Off)"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-toggle-card: you must define an entity");
    this._config = { ...e };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress();
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_pressed") || e.has("_popupOpen"))
      return !0;
    if (e.has("hass") && this._config && this.hass) {
      const t = this.hass.states[this._config.entity];
      return t !== this._prevEntityState ? (this._prevEntityState = t, !0) : !1;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _isOn() {
    return this._entity?.state === "on";
  }
  get _isUnavailable() {
    const e = this._entity?.state;
    return !e || e === "unavailable" || e === "unknown";
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  _toggle() {
    if (!this.hass || !this._config || this._isUnavailable) return;
    const e = this._config.entity.split(".")[0];
    this.hass.callService(e, "toggle", { entity_id: this._config.entity });
  }
  _setState(e) {
    if (!this.hass || !this._config || this._isUnavailable || e === this._isOn) return;
    const t = this._config.entity.split(".")[0];
    this.hass.callService(t, e ? "turn_on" : "turn_off", {
      entity_id: this._config.entity
    });
  }
  async openPopup() {
    if (this._isUnavailable || this._popupOpen) return;
    const e = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), n = Math.max(0.28, e.width / s.width), a = Math.max(0.16, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${n}, ${a})`,
            borderRadius: "28px",
            opacity: 0.72
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            borderRadius: "32px",
            opacity: 1
          }
        ],
        {
          duration: 380,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)"
        }
      );
    }
  }
  closePopup() {
    const e = this._dialogEl, t = this._dialogSurfaceEl;
    if (!e || !e.open) {
      this._popupOpen = !1;
      return;
    }
    if (t) {
      const i = t.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.92)", opacity: 0 }
        ],
        { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)" }
      );
      i.onfinish = () => {
        e.close(), this._popupOpen = !1;
      };
    } else
      e.close(), this._popupOpen = !1;
  }
  _renderIcon(e) {
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? c`<ha-icon .icon=${e}></ha-icon>` : e?.includes("power-socket") || this._config?.entity.includes("caricatore") ? c`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"
          />
        </svg>
      ` : c`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 2v3h2V9h-2Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return p;
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._isOn, s = i ? this._config.icon_on || e?.attributes.icon : this._config.icon_off || this._config.icon_on || e?.attributes.icon, r = this._isUnavailable ? "Unavailable" : i ? this._config.label_on || "On" : this._config.label_off || "Off";
    return c`
      <ha-card
        class="toggle-tile ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="switch"
        tabindex="0"
        aria-checked=${String(i)}
        aria-label="${t}, ${r}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${(o) => {
      o.preventDefault(), this.openPopup();
    }}
        @keydown=${(o) => {
      o.key === " " || o.key === "Enter" ? (o.preventDefault(), this._toggle()) : (o.key === "o" || o.key === "O") && (o.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${t}</span>
            <span class="tile-subtitle">${r}</span>
          </div>
        </div>
      </ha-card>

      <dialog
        class="toggle-dialog"
        @click=${(o) => {
      o.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(o) => {
      o.preventDefault(), this.closePopup();
    }}
      >
        ${this._popupOpen ? c`
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
                  <span class="dialog-title">${t}</span>
                </header>

                <div class="switch-stage">
                  <div
                    class="vertical-switch ${i ? "is-on" : "is-off"}"
                    role="switch"
                    tabindex="0"
                    aria-checked=${String(i)}
                    aria-label="${t} switch"
                    @pointerdown=${this._onSwitchPointerDown}
                    @pointerup=${this._onSwitchPointerUp}
                    @pointercancel=${() => this._dragStartY = null}
                    @keydown=${(o) => {
      (o.key === " " || o.key === "Enter") && (o.preventDefault(), this._toggle());
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

                  <span class="switch-readout">${r}</span>
                </div>
              </div>
            ` : p}
      </dialog>
    `;
  }
};
$.styles = [
  ft,
  q`
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
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        outline: none;
        border-radius: var(--ha-card-border-radius, 28px);
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

      .toggle-tile.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
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
        min-height: 84px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        pointer-events: none;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
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
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
      }

      .tile-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
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
        max-width: min(390px, calc(100vw - 24px));
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.toggle-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 32px;
        display: flex;
        flex-direction: column;
        gap: 28px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    `
];
P([
  J({ attribute: !1 })
], $.prototype, "hass", 2);
P([
  f()
], $.prototype, "_config", 2);
P([
  f()
], $.prototype, "_pressed", 2);
P([
  f()
], $.prototype, "_popupOpen", 2);
P([
  w("dialog.toggle-dialog")
], $.prototype, "_dialogEl", 2);
P([
  w(".toggle-tile")
], $.prototype, "_tileEl", 2);
P([
  w(".dialog-surface")
], $.prototype, "_dialogSurfaceEl", 2);
$ = P([
  gt("m3e-toggle-card")
], $);
function mt(e) {
  window.customCards = window.customCards || [], window.customCards.some((t) => t.type === e.type) || window.customCards.push(e);
}
mt({
  type: "m3e-light-card",
  name: "M3 Expressive Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You Utilities integration.",
  preview: !0
});
mt({
  type: "m3e-status-card",
  name: "M3 Expressive Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular expanded popups (Sensor, Climate, Remote, Media).",
  preview: !0
});
mt({
  type: "m3e-toggle-card",
  name: "M3 Expressive Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0
});
export {
  m as M3ELightCard,
  _ as M3EStatusCard,
  $ as M3EToggleCard
};
