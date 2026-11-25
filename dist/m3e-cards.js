/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, Ne = $e.ShadowRoot && ($e.ShadyCSS === void 0 || $e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, je = Symbol(), Qe = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== je) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Ne && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = Qe.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Qe.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const wt = (e) => new ht(typeof e == "string" ? e : e + "", void 0, je), C = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, o) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new ht(i, e, je);
}, $t = (e, t) => {
  if (Ne) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = $e.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, et = Ne ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return wt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: St, defineProperty: kt, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: Mt, getOwnPropertySymbols: Pt, getPrototypeOf: At } = Object, Me = globalThis, tt = Me.trustedTypes, Et = tt ? tt.emptyScript : "", Tt = Me.reactiveElementPolyfillSupport, pe = (e, t) => e, Se = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Et : null;
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
} }, Ge = (e, t) => !St(e, t), it = { attribute: !0, type: String, converter: Se, reflect: !1, useDefault: !1, hasChanged: Ge };
Symbol.metadata ??= Symbol("metadata"), Me.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let J = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = it) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && kt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: o } = Ct(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const n = r?.call(this);
      o?.call(this, a), this.requestUpdate(t, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(pe("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(pe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(pe("properties"))) {
      const i = this.properties, s = [...Mt(i), ...Pt(i)];
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
      for (const r of s) i.unshift(et(r));
    } else t !== void 0 && i.push(et(t));
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
    return $t(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : Se).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Se;
      this._$Em = r;
      const n = a.fromAttribute(i, o.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, o) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), s ??= a.getPropertyOptions(t), !((s.hasChanged ?? Ge)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: o }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: a } = o, n = this[r];
        a !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, o, n);
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
J.elementStyles = [], J.shadowRootOptions = { mode: "open" }, J[pe("elementProperties")] = /* @__PURE__ */ new Map(), J[pe("finalized")] = /* @__PURE__ */ new Map(), Tt?.({ ReactiveElement: J }), (Me.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis, st = (e) => e, ke = Fe.trustedTypes, rt = ke ? ke.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ut = "$lit$", B = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + B, Ot = `<${ft}>`, G = document, fe = () => G.createComment(""), ge = (e) => e === null || typeof e != "object" && typeof e != "function", We = Array.isArray, Lt = (e) => We(e) || typeof e?.[Symbol.iterator] == "function", De = `[ 	
\f\r]`, de = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, V = RegExp(`>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, lt = /"/g, gt = /^(?:script|style|textarea|title)$/i, mt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), l = mt(1), He = mt(2), Q = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), j = G.createTreeWalker(G, 129);
function vt(e, t) {
  if (!We(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const It = (e, t) => {
  const i = e.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = de;
  for (let n = 0; n < i; n++) {
    const c = e[n];
    let d, u, p = -1, g = 0;
    for (; g < c.length && (a.lastIndex = g, u = a.exec(c), u !== null); ) g = a.lastIndex, a === de ? u[1] === "!--" ? a = ot : u[1] !== void 0 ? a = at : u[2] !== void 0 ? (gt.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = V) : u[3] !== void 0 && (a = V) : a === V ? u[0] === ">" ? (a = r ?? de, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, d = u[1], a = u[3] === void 0 ? V : u[3] === '"' ? lt : nt) : a === lt || a === nt ? a = V : a === ot || a === at ? a = de : (a = V, r = void 0);
    const m = a === V && e[n + 1].startsWith("/>") ? " " : "";
    o += a === de ? c + Ot : p >= 0 ? (s.push(d), c.slice(0, p) + ut + c.slice(p) + B + m) : c + B + (p === -2 ? n : m);
  }
  return [vt(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class me {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const n = t.length - 1, c = this.parts, [d, u] = It(t, i);
    if (this.el = me.createElement(d, s), j.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = j.nextNode()) !== null && c.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(ut)) {
          const g = u[a++], m = r.getAttribute(p).split(B), b = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: o, name: b[2], strings: m, ctor: b[1] === "." ? Dt : b[1] === "?" ? Ht : b[1] === "@" ? Zt : Pe }), r.removeAttribute(p);
        } else p.startsWith(B) && (c.push({ type: 6, index: o }), r.removeAttribute(p));
        if (gt.test(r.tagName)) {
          const p = r.textContent.split(B), g = p.length - 1;
          if (g > 0) {
            r.textContent = ke ? ke.emptyScript : "";
            for (let m = 0; m < g; m++) r.append(p[m], fe()), j.nextNode(), c.push({ type: 2, index: ++o });
            r.append(p[g], fe());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ft) c.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(B, p + 1)) !== -1; ) c.push({ type: 7, index: o }), p += B.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const s = G.createElement("template");
    return s.innerHTML = t, s;
  }
}
function ee(e, t, i = e, s) {
  if (t === Q) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = ge(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (t = ee(e, r._$AS(e, t.values), r, s)), t;
}
class zt {
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
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? G).importNode(i, !0);
    j.currentNode = r;
    let o = j.nextNode(), a = 0, n = 0, c = s[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let d;
        c.type === 2 ? d = new be(o, o.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (d = new Bt(o, this, t)), this._$AV.push(d), c = s[++n];
      }
      a !== c?.index && (o = j.nextNode(), a++);
    }
    return j.currentNode = G, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class be {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = ee(this, t, i), ge(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== Q && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && ge(this._$AH) ? this._$AA.nextSibling.data = t : this.T(G.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = me.createElement(vt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new zt(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = ct.get(t.strings);
    return i === void 0 && ct.set(t.strings, i = new me(t)), i;
  }
  k(t) {
    We(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of t) r === i.length ? i.push(s = new be(this.O(fe()), this.O(fe()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = st(t).nextSibling;
      st(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Pe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, i = this, s, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = ee(this, t, i, 0), a = !ge(t) || t !== this._$AH && t !== Q, a && (this._$AH = t);
    else {
      const n = t;
      let c, d;
      for (t = o[0], c = 0; c < o.length - 1; c++) d = ee(this, n[s + c], i, c), d === Q && (d = this._$AH[c]), a ||= !ge(d) || d !== this._$AH[c], d === h ? t = h : t !== h && (t += (d ?? "") + o[c + 1]), this._$AH[c] = d;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends Pe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ht extends Pe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Zt extends Pe {
  constructor(t, i, s, r, o) {
    super(t, i, s, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = ee(this, t, i, 0) ?? h) === Q) return;
    const s = this._$AH, r = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== h && (s === h || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ee(this, t);
  }
}
const Rt = Fe.litHtmlPolyfillSupport;
Rt?.(me, be), (Fe.litHtmlVersions ??= []).push("3.3.3");
const Ut = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new be(t.insertBefore(fe(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = globalThis;
let $ = class extends J {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Q;
  }
};
$._$litElement$ = !0, $.finalized = !0, Ye.litElementHydrateSupport?.({ LitElement: $ });
const Vt = Ye.litElementPolyfillSupport;
Vt?.({ LitElement: $ });
(Ye.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { attribute: !0, type: String, converter: Se, reflect: !1, hasChanged: Ge }, jt = (e = Nt, t, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), s === "accessor") {
    const { name: a } = i;
    return { set(n) {
      const c = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(a, c, e, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(a, void 0, e, n), n;
    } };
  }
  if (s === "setter") {
    const { name: a } = i;
    return function(n) {
      const c = this[a];
      t.call(this, n), this.requestUpdate(a, c, e, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function M(e) {
  return (t, i) => typeof i == "object" ? jt(e, t, i) : ((s, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(e) {
  return M({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(e, t) {
  return (i, s, r) => {
    const o = (a) => a.renderRoot?.querySelector(e) ?? null;
    return Gt(i, s, { get() {
      return o(this);
    } });
  };
}
const D = C`
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
    height: 100%;
    overflow: hidden;
    background: var(--ha-card-background, var(--md-sys-color-surface-container-low, #f3f3fa));
    box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, none));
    border-style: solid;
    border-width: var(--ha-card-border-width, 0px);
    border-color: var(--ha-card-border-color, transparent);
    border-radius: var(--m3e-card-border-radius, 28px);
    color: var(--md-sys-color-on-surface, #1b1b1f);
    transition:
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  /* =========================================================================
     SHARED MATERIAL 3 EXPRESSIVE TILE / PILL DESIGN VARIANTS
     All variants strictly inherit --ha-card-* & --md-sys-color-* from M3Y.
     ========================================================================= */

  /* 1. Full Stadium Pill (Android QS / M3 Expressive Pill) */
  ha-card.style-pill {
    border-radius: var(--m3e-corner-full);
  }

  /* 2. Google Home Morph (28px standard inactive <-> full round pill active) */
  ha-card.style-morph {
    border-radius: 28px;
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
    border-radius: var(--m3e-corner-full);
  }

  /* 3. M3 Expressive Dynamic Shape Morph (20px inactive <-> full pill active) */
  ha-card.style-expressive {
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
    border-radius: var(--m3e-corner-full);
  }

  ha-card.style-expressive.is-pressed {
    border-radius: 14px;
  }

  /* 3. Compact M3 Tile (56px height / 18px corners for dense 1-row Sections) */
  ha-card.style-compact {
    min-height: 56px;
    border-radius: 18px;
  }

  ha-card.style-compact .tile-content,
  ha-card.style-compact .tile-inner {
    min-height: 56px;
    padding: 10px 16px;
    gap: 12px;
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
`;
var Ft = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, W = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Wt(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && Ft(t, i, r), r;
};
let I = class extends $ {
  constructor() {
    super(...arguments), this._pressed = !1, this._selectorOpen = !1;
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-assist-card",
      entity: e ? Object.keys(e.states).find(
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
        { name: "placeholder", selector: { text: {} } },
        {
          name: "entity",
          selector: { entity: { domain: ["input_select", "select"] } }
        },
        { name: "start_listening", selector: { boolean: {} } },
        { name: "pipeline_id", selector: { text: {} } }
      ],
      computeLabel: (e) => ({
        placeholder: `Testo barra Assist (es. "Ask Corazza's" o "Chiedi a Casa")`,
        entity: "Selettore modalità casa (input_select / select per sostituire Home/Away di Google Home)",
        start_listening: "Avvia ascolto vocale subito (spento = apre chat testuale Assist)",
        pipeline_id: "Pipeline Assist (opzionale, default: preferred)"
      })[e.name] ?? e.name,
      computeHelper: (e) => {
        if (e.name === "entity")
          return "Collega un input_select (es. Casa / Fuori / Notte) al pulsante circolare a sinistra: al tap apre il selettore Material 3 Expressive come su Google Home.";
      }
    };
  }
  setConfig(e) {
    this._config = {
      placeholder: "Chiedi a Home Assistant",
      pipeline_id: "preferred",
      start_listening: !1,
      ...e
    };
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return { rows: "auto", columns: 12, min_columns: 6 };
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_pressed") || e.has("_selectorOpen"))
      return !0;
    if (e.has("hass") && this._config?.entity && this.hass) {
      const t = this.hass.states[this._config.entity];
      return t !== this._prevEntityState ? (this._prevEntityState = t, !0) : !1;
    }
    return !1;
  }
  get _modeEntity() {
    if (!(!this.hass || !this._config?.entity))
      return this.hass.states[this._config.entity];
  }
  get _options() {
    const e = this._modeEntity?.attributes.options;
    return Array.isArray(e) ? e.map(String) : [];
  }
  _openAssist() {
    const e = {
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
          config: e,
          action: "tap"
        }
      })
    );
  }
  async openModeSelector(e) {
    if (e?.stopPropagation(), !this._modeEntity || this._options.length === 0 || this._selectorOpen) return;
    window.getSelection()?.removeAllRanges(), this._selectorOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i)) {
      const s = window.matchMedia("(max-width: 600px)").matches;
      i.animate(
        s ? [
          { transform: "translateY(36px)", opacity: 0 },
          { transform: "translateY(0px)", opacity: 1 }
        ] : [
          { transform: "scale(0.92)", opacity: 0 },
          { transform: "scale(1)", opacity: 1 }
        ],
        { duration: 280, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
      );
    }
  }
  closeModeSelector() {
    const e = this._dialogEl, t = this._dialogSurfaceEl;
    if (!e || !e.open) {
      this._selectorOpen = !1;
      return;
    }
    if (t) {
      const i = window.matchMedia("(max-width: 600px)").matches, s = t.animate(
        i ? [
          { transform: "translateY(0px)", opacity: 1 },
          { transform: "translateY(28px)", opacity: 0 }
        ] : [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.94)", opacity: 0 }
        ],
        { duration: 160, easing: "cubic-bezier(0.4, 0, 1, 1)" }
      );
      s.onfinish = () => {
        e.close(), this._selectorOpen = !1;
      };
    } else
      e.close(), this._selectorOpen = !1;
  }
  _selectOption(e) {
    if (!this.hass || !this._config?.entity) return;
    const t = this._config.entity.split(".")[0];
    this.hass.callService(t, "select_option", {
      entity_id: this._config.entity,
      option: e
    }), window.setTimeout(() => this.closeModeSelector(), 160);
  }
  _renderOptionIcon(e, t) {
    const i = e.toLowerCase();
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
      ` : t ? l`
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
    const e = this._modeEntity, t = e?.state ?? "", i = !!(e && this._options.length > 0), s = this._config.placeholder?.trim() || "Chiedi a Home Assistant";
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
                  title=${`${e.attributes.friendly_name ?? "Modalità"}: ${t}`}
                  aria-label=${`Cambia modalità (${t})`}
                  @pointerdown=${(r) => r.stopPropagation()}
                  @click=${(r) => this.openModeSelector(r)}
                >
                  ${this._renderOptionIcon(t, !0)}
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
      >
        ${this._selectorOpen && i ? l`
              <div class="dialog-surface">
                <div class="sheet-handle" aria-hidden="true"></div>
                <header class="dialog-header">
                  <span class="dialog-title">
                    ${e.attributes.friendly_name || "Modalità casa"}
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
      const o = r === t;
      return l`
                      <button
                        type="button"
                        class="mode-row ${o ? "is-selected" : ""}"
                        role="radio"
                        aria-checked=${String(o)}
                        @click=${() => this._selectOption(r)}
                      >
                        <span class="mode-row-icon">
                          ${this._renderOptionIcon(r, o)}
                        </span>
                        <span class="mode-row-label">${r}</span>
                        <span class="m3-radio ${o ? "checked" : ""}" aria-hidden="true">
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
I.styles = [
  D,
  C`
      :host {
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
        transform: scale(0.985);
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
W([
  M({ attribute: !1 })
], I.prototype, "hass", 2);
W([
  f()
], I.prototype, "_config", 2);
W([
  f()
], I.prototype, "_pressed", 2);
W([
  f()
], I.prototype, "_selectorOpen", 2);
W([
  P("dialog.mode-dialog")
], I.prototype, "_dialogEl", 2);
W([
  P(".dialog-surface")
], I.prototype, "_dialogSurfaceEl", 2);
I = W([
  E("m3e-assist-card")
], I);
function Xe(e, t, i) {
  const s = e?.entity_id ?? "", r = s.split(".")[0], o = String(e?.attributes.device_class ?? "").toLowerCase(), a = String(e?.state ?? "").toLowerCase();
  return o === "outlet" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3-9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : r === "light" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : r === "switch" || r === "input_boolean" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4 14H9V7h6v10Zm-4-8v3h2V9h-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 5v3h2v-3h-2Z"/></svg>` : o === "door" || o === "opening" || o === "garage_door" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2Zm-6-6h-2v-2h2v2Zm4 6h-2V5h2v14Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2ZM7 19V5h10v14H7Zm8-8h-2v2h2v-2Z"/></svg>` : o === "window" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h14v-6H5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h6v-6H5Zm8 0v6h6v-6h-6Z"/></svg>` : r === "lock" || o === "lock" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6a5 5 0 0 0-9.58-2l1.84.78A3 3 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-6 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Zm-6-3a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"/></svg>` : r === "fan" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 9.8C12 6.5 14.5 4 15.8 5.4c1 1.1-.5 3.4-2.1 4.8M14.2 12c3.3 0 5.8 2.5 4.4 3.8-1.1 1-3.4-.5-4.8-2.1M12 14.2c0 3.3-2.5 5.8-3.8 4.4-1-1.1.5-3.4 2.1-4.8M9.8 12c-3.3 0-5.8-2.5-4.4-3.8 1.1-1 3.4.5 4.8 2.1"/></svg>` : r === "climate" || i === "climate" ? a === "heat" || a === "heating" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" fill="none"/></svg>` : a === "cool" || a === "cooling" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : o === "tv" || r === "remote" || i === "remote" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : r === "media_player" || i === "media" ? t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : r === "weather" ? a === "sunny" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>` : a === "clear-night" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M20.2 14.4A8.2 8.2 0 0 1 9.6 3.8a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>` : a === "rainy" || a === "pouring" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM8.5 18.2l-.9 2.3M12.5 18.2l-.9 2.3M16.5 18.2l-.9 2.3"/></svg>` : a === "lightning" || a === "lightning-rainy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h2.4M15.4 15.5h1.8a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM13 12.5l-2 4.2h2.6l-1.6 3.8"/></svg>` : a === "snowy" || a === "snowy-rainy" || a === "hail" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3Z"/><circle cx="8.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="12.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="16.5" cy="19.2" r="1.1" fill="currentColor"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 18h10.4a3.8 3.8 0 0 0 .6-7.55A5.6 5.6 0 0 0 7.1 9.1 4.4 4.4 0 0 0 6.8 18Z"/></svg>` : o === "aqi" || o === "pm25" || o === "pm10" || o === "carbon_dioxide" || o === "volatile_organic_compounds" || s.includes("aqi") || s.includes("air_quality") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 12.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 16.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8"/></svg>` : o === "temperature" || s.includes("temp") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : o === "humidity" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : o === "power" || o === "energy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.19-.35L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21Z"/></svg>` : o === "illuminance" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : o === "battery" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : t ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.8" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5.8 7.8a6.8 6.8 0 0 0 0 8.4M18.2 7.8a6.8 6.8 0 0 1 0 8.4"/></svg>`;
}
function ve(e, t, i) {
  const s = (i || "").trim();
  if (!s) return;
  if (s.startsWith("#")) {
    const o = window.location.href;
    window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: o, newURL: window.location.href }));
    return;
  }
  if (s.startsWith("script.") && t) {
    t.callService("script", "turn_on", { entity_id: s });
    return;
  }
  const r = s.startsWith("service:") ? s.slice(8).trim() : s;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(r) && !r.startsWith("/") && t) {
    const [o, a] = r.split(".");
    t.callService(o, a, {});
    return;
  }
  window.history.pushState(null, "", s), e.dispatchEvent(
    new CustomEvent("location-changed", {
      bubbles: !0,
      composed: !0,
      detail: { replace: !1 }
    })
  ), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 }));
}
var Yt = Object.defineProperty, Xt = Object.getOwnPropertyDescriptor, Ae = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Xt(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && Yt(t, i, r), r;
};
let te = class extends $ {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._computeItemLabel = (e) => ({
      entity: "Entità",
      attribute: "Attributo valore (vuoto = stato)",
      secondary_attribute: "Attributo extra etichetta (es. AQI • Valore)",
      name: "Nome personalizzato",
      unit: "Unità / Suffisso (es. °)",
      icon: "Icona personalizzata (vuoto = M3 auto)",
      tap_action: "Azione al tap",
      navigation_path: "Percorso (/lovelace/..., #popup, script.*)"
    })[e.name] ?? e.name, this._computeTopLabel = (e) => e.name === "transparent" ? "Sfondo trasparente (integrato nella dashboard come Google Home)" : e.name;
  }
  setConfig(e) {
    this._config = {
      ...e,
      items: Array.isArray(e.items) ? e.items.map((t) => ({ ...t })) : []
    };
  }
  _emitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onTopChanged(e) {
    if (!this._config) return;
    const t = e.detail.value;
    this._emitConfig({
      ...this._config,
      transparent: t.transparent
    });
  }
  _onItemChanged(e, t) {
    if (!this._config) return;
    const i = [...this._config.items ?? []], s = {
      ...i[e],
      ...t.detail.value
    };
    s.name || delete s.name, s.attribute || delete s.attribute, s.secondary_attribute || delete s.secondary_attribute, s.icon || delete s.icon, s.unit || delete s.unit, s.navigation_path || delete s.navigation_path, i[e] = s, this._emitConfig({ ...this._config, items: i });
  }
  _addItem() {
    if (!this._config) return;
    const e = [...this._config.items ?? [], { entity: "", tap_action: "more-info" }];
    this._expandedIndex = e.length - 1, this._emitConfig({ ...this._config, items: e });
  }
  _removeItem(e, t) {
    if (t.stopPropagation(), !this._config) return;
    const i = [...this._config.items ?? []];
    i.splice(e, 1), this._expandedIndex >= i.length && (this._expandedIndex = Math.max(0, i.length - 1)), this._emitConfig({ ...this._config, items: i });
  }
  _moveItem(e, t, i) {
    if (i.stopPropagation(), !this._config) return;
    const s = [...this._config.items ?? []], r = e + t;
    r < 0 || r >= s.length || ([s[e], s[r]] = [s[r], s[e]], this._expandedIndex === e ? this._expandedIndex = r : this._expandedIndex === r && (this._expandedIndex = e), this._emitConfig({ ...this._config, items: s }));
  }
  _buildItemSchema(e) {
    const t = [
      { name: "entity", required: !0, selector: { entity: {} } }
    ];
    return e.entity && t.push({
      type: "grid",
      name: "",
      schema: [
        {
          name: "attribute",
          selector: { attribute: { entity_id: e.entity } }
        },
        {
          name: "secondary_attribute",
          selector: { attribute: { entity_id: e.entity } }
        }
      ]
    }), t.push(
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
                  { value: "navigate", label: "Percorso / Bubble / Script" },
                  { value: "none", label: "Nessuna azione" }
                ]
              }
            }
          }
        ]
      }
    ), e.tap_action === "navigate" && t.push({ name: "navigation_path", selector: { text: {} } }), t;
  }
  _itemTitle(e, t) {
    return e.name ? e.name : e.entity ? this.hass?.states[e.entity]?.attributes.friendly_name || e.entity : `Entità #${t + 1}`;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const e = this._config.items ?? [];
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
          <span class="section-title">Entità At a Glance (${e.length})</span>
        </div>

        <div class="items-list">
          ${e.map((t, i) => {
      const s = this._expandedIndex === i, r = {
        entity: t.entity ?? "",
        attribute: t.attribute ?? "",
        secondary_attribute: t.secondary_attribute ?? "",
        name: t.name ?? "",
        unit: t.unit ?? "",
        icon: t.icon ?? "",
        tap_action: t.tap_action ?? "more-info",
        navigation_path: t.navigation_path ?? ""
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
                      <span class="item-title">${this._itemTitle(t, i)}</span>
                      <span class="item-sub">
                        ${t.entity ? t.attribute ? `${t.entity} · ${t.attribute}` : t.entity : "Seleziona un’entità"}
                      </span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${i === 0}
                      @click=${(o) => this._moveItem(i, -1, o)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === e.length - 1}
                      @click=${(o) => this._moveItem(i, 1, o)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(o) => this._removeItem(i, o)}
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
                          .schema=${this._buildItemSchema(t)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(o) => this._onItemChanged(i, o)}
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
te.styles = C`
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
Ae([
  M({ attribute: !1 })
], te.prototype, "hass", 2);
Ae([
  f()
], te.prototype, "_config", 2);
Ae([
  f()
], te.prototype, "_expandedIndex", 2);
te = Ae([
  E("m3e-glance-card-editor")
], te);
var qt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, Ee = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Kt(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && qt(t, i, r), r;
};
const Jt = /* @__PURE__ */ new Set([
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
let ie = class extends $ {
  constructor() {
    super(...arguments), this._isMouseDragging = !1, this._dragMoved = !1, this._dragStartX = 0, this._dragScrollLeft = 0;
  }
  setConfig(e) {
    if (!e)
      throw new Error("m3e-glance-card: configurazione mancante");
    this._config = {
      ...e,
      transparent: e.transparent !== !1,
      items: Array.isArray(e.items) ? e.items : []
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
  static getStubConfig(e) {
    const t = e?.states ?? {}, i = Object.keys(t), s = [], r = i.find((n) => n.startsWith("weather."));
    r && s.push({ entity: r, unit: "°", tap_action: "more-info" });
    const o = i.find(
      (n) => n.startsWith("sensor.") && (t[n]?.attributes.device_class === "aqi" || t[n]?.attributes.device_class === "temperature" || n.includes("aqi"))
    );
    o && s.push({ entity: o, tap_action: "more-info" });
    const a = i.find(
      (n) => n.startsWith("sensor.") && t[n]?.attributes.device_class === "humidity" && n !== o
    );
    if (a && s.push({ entity: a, tap_action: "more-info" }), s.length === 0) {
      const n = i.find((c) => c.startsWith("sensor.") || c.startsWith("sun."));
      s.push({ entity: n ?? "sun.sun", tap_action: "more-info" });
    }
    return {
      type: "custom:m3e-glance-card",
      transparent: !0,
      items: s
    };
  }
  shouldUpdate(e) {
    if (!this._config) return !1;
    if (e.has("_config")) return !0;
    if (e.has("hass")) {
      const t = e.get("hass");
      if (!t || !this.hass) return !0;
      for (const i of this._config.items)
        if (i.entity && t.states[i.entity] !== this.hass.states[i.entity])
          return !0;
      return t.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  _formatRawValue(e) {
    if (e == null || e === "") return "—";
    const t = String(e).trim(), i = t.toLowerCase();
    if (i === "unavailable") return "Offline";
    if (i === "unknown" || i === "none") return "—";
    if (i === "on") return "On";
    if (i === "off") return "Off";
    if (i === "home") return "In casa";
    if (i === "not_home") return "Fuori";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t)) {
      const s = new Date(t);
      if (!Number.isNaN(s.getTime()))
        return s.toLocaleTimeString(this.hass?.language ?? "it-IT", {
          hour: "2-digit",
          minute: "2-digit"
        });
    }
    if (/^-?\d+\.\d{2,}$/.test(t)) {
      const s = Number(t);
      if (!Number.isNaN(s))
        return Number.isInteger(s) ? String(s) : s.toFixed(1);
    }
    return t;
  }
  _getPrimaryValue(e, t) {
    if (!t) return "—";
    const i = t.entity_id.split(".")[0];
    let s, r = "";
    if (e.attribute)
      s = t.attributes[e.attribute], e.attribute === "temperature" || e.attribute === "current_temperature" ? r = "°" : (e.attribute === "humidity" || e.attribute === "battery_level") && (r = "%");
    else if (i === "weather" && t.attributes.temperature !== void 0)
      s = t.attributes.temperature, r = "°";
    else {
      s = t.state;
      const n = t.attributes.unit_of_measurement;
      typeof n == "string" && n.trim() && (r = n.trim());
    }
    const o = this._formatRawValue(s);
    if (o === "—" || o === "Offline") return o;
    const a = e.unit !== void 0 ? e.unit : r;
    return a ? a === "°" || a === "%" || a === "°C" || a === "°F" ? `${o}${a}` : `${o} ${a}` : o;
  }
  _getSecondaryLabel(e, t) {
    const i = e.name || t?.attributes.friendly_name || e.entity || "Entità";
    if (e.secondary_attribute && t) {
      const s = t.attributes[e.secondary_attribute];
      if (s != null && String(s).trim() !== "") {
        const r = this._formatRawValue(s), o = r.charAt(0).toUpperCase() + r.slice(1);
        return `${i} • ${o}`;
      }
    }
    return i;
  }
  _onMouseDown(e) {
    !this._stripEl || e.button !== 0 || (this._isMouseDragging = !0, this._dragMoved = !1, this._dragStartX = e.pageX - this._stripEl.offsetLeft, this._dragScrollLeft = this._stripEl.scrollLeft);
  }
  _onMouseMove(e) {
    if (!this._isMouseDragging || !this._stripEl) return;
    const i = e.pageX - this._stripEl.offsetLeft - this._dragStartX;
    Math.abs(i) > 6 && (this._dragMoved = !0, e.preventDefault(), this._stripEl.scrollLeft = this._dragScrollLeft - i);
  }
  _onMouseUpOrLeave() {
    this._isMouseDragging = !1;
  }
  _onItemTap(e) {
    if (this._dragMoved) {
      this._dragMoved = !1;
      return;
    }
    if (!this.hass || !e.entity) return;
    const t = e.tap_action ?? "more-info";
    if (t !== "none") {
      if (t === "navigate" && e.navigation_path) {
        ve(this, this.hass, e.navigation_path);
        return;
      }
      if (t === "toggle") {
        const i = e.entity.split(".")[0];
        if (["light", "switch", "fan", "input_boolean", "cover", "lock", "media_player"].includes(
          i
        )) {
          this.hass.callService("homeassistant", "toggle", { entity_id: e.entity });
          return;
        }
      }
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: e.entity },
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  render() {
    if (!this._config) return h;
    const e = this._config.items ?? [], t = this._config.transparent !== !1, i = l`
      <div
        class="glance-strip ${t ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${e.length === 0 ? l`<div class="empty-hint">Aggiungi entità dalla configurazione della card</div>` : e.map((s) => {
      const r = s.entity ? this.hass?.states[s.entity] : void 0, o = !r || r.state === "unavailable" || r.state === "unknown", a = !o && Jt.has(String(r.state ?? "").toLowerCase()), n = this._getPrimaryValue(s, r), c = this._getSecondaryLabel(s, r), d = (s.tap_action ?? "more-info") !== "none" && !!s.entity;
      return l`
                <button
                  type="button"
                  class="glance-item ${o ? "is-dimmed" : ""} ${d ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(s)}
                >
                  <span class="icon-circle" aria-hidden="true">
                    ${s.icon ? l`<ha-icon .icon=${s.icon}></ha-icon>` : Xe(r, a)}
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
    return t ? i : l`<ha-card>${i}</ha-card>`;
  }
};
ie.styles = [
  D,
  C`
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
Ee([
  M({ attribute: !1 })
], ie.prototype, "hass", 2);
Ee([
  f()
], ie.prototype, "_config", 2);
Ee([
  P(".glance-strip")
], ie.prototype, "_stripEl", 2);
ie = Ee([
  E("m3e-glance-card")
], ie);
function qe(e) {
  if (!e) return null;
  const t = Date.parse(e);
  if (Number.isNaN(t)) return null;
  const i = Math.max(0, Math.floor((Date.now() - t) / 1e3));
  if (i < 5) return "Adesso";
  if (i < 60)
    return i === 1 ? "1 secondo fa" : `${i} secondi fa`;
  const s = Math.floor(i / 60);
  if (s < 60)
    return s === 1 ? "1 minuto fa" : `${s} minuti fa`;
  const r = Math.floor(s / 60);
  if (r < 24)
    return r === 1 ? "1 ora fa" : `${r} ore fa`;
  const o = Math.floor(r / 24);
  return o === 1 ? "1 giorno fa" : `${o} giorni fa`;
}
var Qt = Object.defineProperty, ei = Object.getOwnPropertyDescriptor, S = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ei(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && Qt(t, i, r), r;
};
const dt = 8, ti = 420, ii = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], _t = "m3e-light-recent-colors:", si = 6;
function bt(e) {
  try {
    const t = window.localStorage.getItem(`${_t}${e}`);
    if (!t) return [];
    const i = JSON.parse(t);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function ri(e, t) {
  try {
    const i = bt(e).filter((r) => r.hex !== t.hex), s = [t, ...i].slice(0, si);
    window.localStorage.setItem(`${_t}${e}`, JSON.stringify(s));
  } catch {
  }
}
function Ze([e, t, i]) {
  return "#" + [e, t, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function Be(e) {
  const t = Math.max(2e3, Math.min(6500, e));
  return t <= 2400 ? [255, 224, 102] : t <= 2900 ? [255, 230, 138] : t <= 3600 ? [255, 240, 184] : t <= 4500 ? [255, 247, 224] : t <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function oi([e, t, i]) {
  const [s, r, o] = [e, t, i].map((a) => {
    const n = a / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * r + 0.0722 * o;
}
let w = class extends $ {
  constructor() {
    super(...arguments), this._dragging = !1, this._pressed = !1, this._dragPct = null, this._popupOpen = !1, this._popupDragging = !1, this._popupDragPct = null, this._selectedPresetId = null, this._scenesSheetOpen = !1, this._activeSceneId = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._longPressTriggered = !1, this._longPressTimer = null, this._onDialogBackdropClick = (e) => {
      e.target === this._dialogEl && this.closePopup();
    }, this._onDialogCancel = (e) => {
      e.preventDefault(), this.closePopup();
    }, this._onTilePointerDown = (e) => {
      if (this._isUnavailable || e.button !== 0) return;
      const t = e.currentTarget;
      this._pointerId = e.pointerId, this._pointerStartX = e.clientX, this._pointerStartY = e.clientY, this._hasMoved = !1, this._longPressTriggered = !1, this._pressed = !0, t.setPointerCapture(e.pointerId), this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        !this._hasMoved && this._pointerId !== null && (this._longPressTriggered = !0, this._resetTilePointer(t), this.openPopup());
      }, ti);
    }, this._onTilePointerMove = (e) => {
      if (this._pointerId !== e.pointerId || !this._supportsBrightness) return;
      const t = Math.abs(e.clientX - this._pointerStartX), i = Math.abs(e.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (t < dt && i < dt) return;
        if (this._clearLongPress(), i > t) {
          this._resetTilePointer(e.currentTarget);
          return;
        }
        this._hasMoved = !0, this._dragging = !0;
      }
      const s = this._computeHorizontalPct(e.clientX, e.currentTarget);
      s !== this._dragPct && (this._dragPct = s);
    }, this._onTilePointerUp = (e) => {
      if (this._pointerId !== e.pointerId) return;
      const t = e.currentTarget;
      this._clearLongPress(), this._longPressTriggered || (this._hasMoved && this._dragPct !== null ? this._emitBrightness(this._dragPct) : this._toggleLight()), this._resetTilePointer(t);
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
          e.key === "ArrowRight" || e.key === "ArrowUp" ? (e.preventDefault(), this._emitBrightness(Math.min(100, this._brightnessPct + t))) : (e.key === "ArrowLeft" || e.key === "ArrowDown") && (e.preventDefault(), this._emitBrightness(Math.max(0, this._brightnessPct - t)));
        }
      }
    }, this._onCapsulePointerDown = (e) => {
      if (this._isUnavailable || e.button !== 0 || !this._supportsBrightness) return;
      const t = e.currentTarget;
      t.setPointerCapture(e.pointerId), this._popupDragging = !0;
      const i = this._computeVerticalPct(e.clientY, t);
      this._popupDragPct = i;
    }, this._onCapsulePointerMove = (e) => {
      if (!this._popupDragging) return;
      const t = this._computeVerticalPct(e.clientY, e.currentTarget);
      t !== this._popupDragPct && (this._popupDragPct = t);
    }, this._onCapsulePointerUp = (e) => {
      if (!this._popupDragging) return;
      const t = e.currentTarget;
      t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._popupDragPct !== null && this._emitBrightness(this._popupDragPct), this._popupDragging = !1, this._popupDragPct = null;
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
        { name: "use_light_color", selector: { boolean: {} } },
        { name: "allow_drag_off", selector: { boolean: {} } },
        { name: "scenes", selector: { entity: { domain: "scene", multiple: !0 } } }
      ],
      computeLabel: (e) => ({
        entity: "Entità luce",
        name: "Nome personalizzato",
        icon: "Icona personalizzata (vuoto = standard Google Home)",
        card_style: "Design della pillola (Material 3)",
        use_light_color: "Usa colore reale della luce",
        allow_drag_off: "Spegni trascinando a 0%",
        scenes: "Scene collegate (opzionale, oltre a quelle rilevate dal dispositivo/stanza)"
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
    return 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 6, min_columns: 3 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress();
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_dragging") || e.has("_pressed") || e.has("_dragPct") || e.has("_popupOpen") || e.has("_popupDragging") || e.has("_popupDragPct") || e.has("_selectedPresetId") || e.has("_scenesSheetOpen") || e.has("_activeSceneId"))
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
    return e ? Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color : typeof e.color_temp_kelvin == "number" ? Be(e.color_temp_kelvin) : null : null;
  }
  get _supportsColorTemp() {
    const e = this._entity?.attributes.supported_color_modes;
    return Array.isArray(e) ? e.includes("color_temp") : !1;
  }
  get _supportsRgb() {
    const e = this._entity?.attributes.supported_color_modes;
    return Array.isArray(e) ? e.some((t) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(t)) : !1;
  }
  get _presets() {
    if (!this._supportsRgb && !this._supportsColorTemp) return [];
    const e = this._config?.entity ?? "", t = [], i = /* @__PURE__ */ new Set(), s = Number(this._entity?.attributes.min_color_temp_kelvin ?? 2e3), r = Number(this._entity?.attributes.max_color_temp_kelvin ?? 6500), o = (n) => {
      if (!this._supportsRgb && !n.kelvin) return;
      const c = n.kelvin && !this._supportsRgb ? `k:${n.kelvin}` : n.hex.toLowerCase();
      i.has(c) || (i.add(c), t.push(n));
    };
    Array.isArray(this._config?.favorite_colors) && this._config.favorite_colors.forEach((n, c) => {
      const d = n.rgb_color ?? (n.color_temp_kelvin ? Be(n.color_temp_kelvin) : null);
      if (!d) return;
      const u = Ze(d);
      o({
        id: `cfg-${c}-${u}`,
        label: n.label || (n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : u),
        hex: u,
        rgb: d,
        kelvin: n.color_temp_kelvin
      });
    });
    const a = this.hass?.entities?.[e]?.options?.light?.favorite_colors;
    if (Array.isArray(a) && a.forEach((n, c) => {
      const d = n.rgb_color ?? (n.color_temp_kelvin ? Be(n.color_temp_kelvin) : null);
      if (!d) return;
      const u = Ze(d);
      o({
        id: `ha-${c}-${u}`,
        label: n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : u,
        hex: u,
        rgb: d,
        kelvin: n.color_temp_kelvin
      });
    }), e)
      for (const n of bt(e))
        o(n);
    for (const n of ii)
      if (n.kelvin) {
        if (n.kelvin >= s - 200 && n.kelvin <= r + 200) {
          const c = Math.max(s, Math.min(r, n.kelvin));
          o({ ...n, kelvin: c });
        }
      } else this._supportsRgb && o(n);
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
    const t = Ze(e), s = oi(e) > 0.42 ? "#3d2f00" : "#ffffff";
    return `
      --m3e-light-accent: ${t};
      --m3e-light-on-accent: ${s};
    `;
  }
  _emitBrightness(e) {
    !this.hass || !this._config || (e <= 0 ? this.hass.callService("light", "turn_off", {
      entity_id: this._config.entity
    }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      brightness_pct: e
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
    const e = [], t = /* @__PURE__ */ new Set(), i = (a) => {
      if (t.has(a)) return;
      const n = this.hass?.states[a];
      !n || !a.startsWith("scene.") || (t.add(a), e.push({
        kind: "scene",
        id: a,
        label: this._cleanSceneName(n),
        entity: n
      }));
    };
    if (Array.isArray(this._config.scenes))
      for (const a of this._config.scenes)
        i(a);
    const s = this._config.entity, r = this.hass.entities?.[s]?.device_id ?? null;
    if (r && this.hass.entities)
      for (const [a, n] of Object.entries(this.hass.entities))
        a.startsWith("scene.") && n.device_id === r && i(a);
    const o = this._entity?.attributes.effect_list;
    if (Array.isArray(o))
      for (const a of o) {
        const n = String(a ?? "").trim();
        if (!n) continue;
        const c = `effect:${n}`;
        t.has(c) || (t.add(c), e.push({
          kind: "effect",
          id: c,
          label: n.replace(/_/g, " ").replace(/^./, (d) => d.toUpperCase()),
          effect: n
        }));
      }
    return e;
  }
  _cleanSceneName(e) {
    const t = (e.attributes.friendly_name || e.entity_id.replace("scene.", "")).trim(), i = this.hass?.entities?.[this._config?.entity ?? ""]?.device_id, s = i ? this.hass?.devices?.[i] : void 0, r = [
      String(e.attributes.group_name ?? ""),
      s?.name_by_user ?? "",
      s?.name ?? "",
      this._config?.name ?? "",
      this._entity?.attributes.friendly_name ?? ""
    ];
    for (const o of r) {
      const a = o.trim();
      if (a && t.length > a.length && t.toLowerCase().startsWith(a.toLowerCase())) {
        const n = t.slice(a.length).replace(/^[\s\-–—:]+/, "").trim();
        if (n) return n.charAt(0).toUpperCase() + n.slice(1);
      }
    }
    return t;
  }
  _activateSceneItem(e) {
    !this.hass || !this._config || (this._activeSceneId = e.id, e.kind === "scene" ? this.hass.callService("scene", "turn_on", {
      entity_id: e.entity.entity_id
    }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      effect: e.effect
    }), this._scenesSheetOpen = !1);
  }
  _toggleLight() {
    !this.hass || !this._config || this._isUnavailable || this.hass.callService("light", "toggle", {
      entity_id: this._config.entity
    });
  }
  _selectPreset(e) {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this._selectedPresetId = e.id, ri(this._config.entity, e);
    const t = {
      entity_id: this._config.entity
    };
    e.kelvin && this._supportsColorTemp ? t.color_temp_kelvin = e.kelvin : this._supportsRgb && (t.rgb_color = e.rgb), this.hass.callService("light", "turn_on", t);
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
    const e = this._tileEl?.getBoundingClientRect();
    this._scenesSheetOpen = !1, this._popupOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), a = Math.max(0.25, e.width / s.width), n = Math.max(0.15, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${a}, ${n})`,
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
        e.close(), this._popupOpen = !1, this._scenesSheetOpen = !1;
      };
    } else
      e.close(), this._popupOpen = !1, this._scenesSheetOpen = !1;
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
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${e}></ha-icon>` : t ? l`
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
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._isOn, r = this._brightnessPct, o = this._isUnavailable ? "Offline" : this._dragging && this._supportsBrightness ? `${r}%` : s ? this._supportsBrightness ? `On • ${r}%` : "On" : "Off", a = this._computeColorVars(), n = this._matchedPresetId, c = this._popupOpen ? this._getAvailableScenes() : [], d = this._popupOpen ? qe(e?.last_changed) : null, u = `style-${this._config.card_style ?? "default"}`;
    return l`
      <ha-card
        class="tile-card ${u} ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${a} --fill-pct: ${s ? r : 0}%;"
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
        style="${a}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
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
                    <span class="dialog-title">${t}</span>
                    ${d ? l`<span class="dialog-last-changed">${d}</span>` : h}
                  </div>
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

                ${this._presets.length > 0 || c.length > 0 ? l`
                      <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                        <button
                          type="button"
                          class="palette-btn ${this._scenesSheetOpen ? "is-open" : ""}"
                          title=${c.length > 0 ? "Scene" : "More info"}
                          @click=${() => {
      c.length > 0 ? this._scenesSheetOpen = !this._scenesSheetOpen : this._config && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: this._config.entity }
        })
      ));
    }}
                          aria-label=${c.length > 0 ? "Scenes" : "Color picker"}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                            />
                          </svg>
                        </button>

                        ${this._presets.map(
      (p) => l`
                            <button
                              type="button"
                              class="color-swatch ${s && n === p.id ? "selected" : ""}"
                              style="background: ${p.hex};"
                              role="radio"
                              aria-checked=${String(s && n === p.id)}
                              aria-label=${p.label}
                              title=${p.label}
                              @click=${() => this._selectPreset(p)}
                            ></button>
                          `
    )}
                      </div>
                    ` : h}
                ${this._scenesSheetOpen && c.length > 0 ? l`
                      <div
                        class="scenes-sheet-backdrop"
                        @click=${() => this._scenesSheetOpen = !1}
                      >
                        <div class="scenes-sheet" @click=${(p) => p.stopPropagation()}>
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
                            ${c.map((p) => {
      const g = String(this._entity?.attributes.effect ?? ""), m = p.kind === "effect" ? g.toLowerCase() === p.effect.toLowerCase() : this._activeSceneId === p.id;
      return l`
                                <button
                                  type="button"
                                  class="scene-option ${m ? "selected" : ""}"
                                  @click=${() => this._activateSceneItem(p)}
                                >
                                  <span class="scene-option-left">
                                    ${p.kind === "scene" && typeof customElements < "u" && customElements.get("ha-state-icon") ? l`<ha-state-icon
                                          class="scene-ha-icon"
                                          .hass=${this.hass}
                                          .stateObj=${p.entity}
                                        ></ha-state-icon>` : l`<svg viewBox="0 0 24 24" class="scene-svg"><path fill="currentColor" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"/></svg>`}
                                    <span>${p.label}</span>
                                  </span>
                                  ${m ? l`<span>✓</span>` : h}
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
w.styles = [
  D,
  C`
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
        height: 100%;
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
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overflow: visible;
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
S([
  M({ attribute: !1 })
], w.prototype, "hass", 2);
S([
  f()
], w.prototype, "_config", 2);
S([
  f()
], w.prototype, "_dragging", 2);
S([
  f()
], w.prototype, "_pressed", 2);
S([
  f()
], w.prototype, "_dragPct", 2);
S([
  f()
], w.prototype, "_popupOpen", 2);
S([
  f()
], w.prototype, "_popupDragging", 2);
S([
  f()
], w.prototype, "_popupDragPct", 2);
S([
  f()
], w.prototype, "_selectedPresetId", 2);
S([
  f()
], w.prototype, "_scenesSheetOpen", 2);
S([
  f()
], w.prototype, "_activeSceneId", 2);
S([
  P("dialog.light-dialog")
], w.prototype, "_dialogEl", 2);
S([
  P(".tile-card")
], w.prototype, "_tileEl", 2);
S([
  P(".dialog-surface")
], w.prototype, "_dialogSurfaceEl", 2);
w = S([
  E("m3e-light-card")
], w);
var ai = Object.defineProperty, ni = Object.getOwnPropertyDescriptor, Te = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ni(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && ai(t, i, r), r;
};
let se = class extends $ {
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
      computeLabel: (e) => ({
        entities: "Luci o gruppi da controllare (vuoto = tutte le luci di casa)",
        label_on: "Testo sinistra (default: All on)",
        label_off: "Testo destra (default: All off)",
        use_theme_color: "Usa colore tema M3Y invece dell’ambra caldo"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    this._config = {
      label_on: "All on",
      label_off: "All off",
      use_theme_color: !1,
      ...e
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
    const e = this._config?.entities;
    return Array.isArray(e) && e.length > 0 ? e.map((t) => this.hass.states[t]).filter((t) => !!t) : Object.values(this.hass.states).filter((t) => t.entity_id.startsWith("light."));
  }
  _computeAnyOn() {
    return this._targetLightEntities().some((e) => e.state === "on");
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_optimisticOn"))
      return !0;
    if (e.has("hass")) {
      const t = this._computeAnyOn(), i = this._isDark;
      return t !== this._lastAnyOn || i !== this._lastDarkMode ? (this._lastAnyOn = t, this._lastDarkMode = i, !0) : !1;
    }
    return !1;
  }
  _spawnRipple(e) {
    const t = e.currentTarget, i = t.getBoundingClientRect(), s = Math.max(i.width, i.height) * 2.1, r = e.clientX - i.left - s / 2, o = e.clientY - i.top - s / 2, a = document.createElement("span");
    a.className = "m3-ripple", a.style.width = `${s}px`, a.style.height = `${s}px`, a.style.left = `${r}px`, a.style.top = `${o}px`, t.appendChild(a);
    const n = a.animate(
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
    n.onfinish = () => a.remove();
  }
  _trigger(e) {
    if (!this.hass) return;
    const t = this._config?.entities, i = Array.isArray(t) && t.length > 0 ? t : "all";
    this._optimisticOn = e, this._optimisticTimer !== null && window.clearTimeout(this._optimisticTimer), this._optimisticTimer = window.setTimeout(() => {
      this._optimisticOn = null, this._optimisticTimer = null;
    }, 1200), this.hass.callService("light", e ? "turn_on" : "turn_off", {
      entity_id: i
    });
  }
  render() {
    if (!this._config) return h;
    const e = this._optimisticOn !== null ? this._optimisticOn : this._computeAnyOn(), t = this._config.label_on?.trim() || "All on", i = this._config.label_off?.trim() || "All off", s = !!this._config.use_theme_color, r = this._isDark;
    return l`
      <ha-card
        class="control-pill ${e ? "state-on" : "state-off"} ${s ? "use-theme" : ""} ${r ? "is-dark" : "is-light"}"
        role="group"
        aria-label="Light control"
      >
        <!-- Sliding shared-element active indicator with razor-sharp curved border & straight center edge -->
        <div class="pill-indicator" aria-hidden="true"></div>

        <button
          type="button"
          class="seg-btn seg-left ${e ? "is-selected" : ""}"
          aria-pressed=${String(e)}
          @pointerdown=${(o) => this._spawnRipple(o)}
          @click=${() => this._trigger(!0)}
        >
          <span class="seg-label">${t}</span>
        </button>

        <button
          type="button"
          class="seg-btn seg-right ${e ? "" : "is-selected"}"
          aria-pressed=${String(!e)}
          @pointerdown=${(o) => this._spawnRipple(o)}
          @click=${() => this._trigger(!1)}
        >
          <span class="seg-label">${i}</span>
        </button>
      </ha-card>
    `;
  }
};
se.styles = [
  D,
  C`
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
Te([
  M({ attribute: !1 })
], se.prototype, "hass", 2);
Te([
  f()
], se.prototype, "_config", 2);
Te([
  f()
], se.prototype, "_optimisticOn", 2);
se = Te([
  E("m3e-light-control-card")
], se);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = (e) => e.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ci = { CHILD: 2 }, di = (e) => (...t) => ({ _$litDirective$: e, values: t });
class pi {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, s) {
    this._$Ct = t, this._$AM = i, this._$Ci = s;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = (e, t) => {
  const i = e._$AN;
  if (i === void 0) return !1;
  for (const s of i) s._$AO?.(t, !1), he(s, t);
  return !0;
}, Ce = (e) => {
  let t, i;
  do {
    if ((t = e._$AM) === void 0) break;
    i = t._$AN, i.delete(e), e = t;
  } while (i?.size === 0);
}, yt = (e) => {
  for (let t; t = e._$AM; e = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(e)) break;
    i.add(e), fi(t);
  }
};
function hi(e) {
  this._$AN !== void 0 ? (Ce(this), this._$AM = e, yt(this)) : this._$AM = e;
}
function ui(e, t = !1, i = 0) {
  const s = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(s)) for (let o = i; o < s.length; o++) he(s[o], !1), Ce(s[o]);
  else s != null && (he(s, !1), Ce(s));
  else he(this, e);
}
const fi = (e) => {
  e.type == ci.CHILD && (e._$AP ??= ui, e._$AQ ??= hi);
};
class gi extends pi {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, s) {
    super._$AT(t, i, s), yt(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), i && (he(this, t), Ce(this));
  }
  setValue(t) {
    if (li(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Re = /* @__PURE__ */ new WeakMap(), mi = di(class extends gi {
  render(e) {
    return h;
  }
  update(e, [t]) {
    const i = t !== this.G;
    return i && this.rt(void 0), (i || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), h;
  }
  rt(e) {
    if (this.G !== void 0) if (this.isConnected || (e = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let i = Re.get(t);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), Re.set(t, i)), i.get(this.G) !== void 0 && this.G.call(this.ht, void 0), i.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
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
var vi = Object.defineProperty, _i = Object.getOwnPropertyDescriptor, Y = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? _i(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && vi(t, i, r), r;
};
const pt = 8;
let z = class extends $ {
  constructor() {
    super(...arguments), this._expanded = !1, this._dragging = !1, this._pressed = !1, this._dragPct = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._prevStates = {}, this._onHeaderPointerDown = (e) => {
      if (e.button !== 0 || this._aggregateStats.isUnavailable) return;
      const t = e.currentTarget;
      this._pointerId = e.pointerId, this._pointerStartX = e.clientX, this._pointerStartY = e.clientY, this._hasMoved = !1, this._pressed = !0, t.setPointerCapture(e.pointerId);
    }, this._onHeaderPointerMove = (e) => {
      if (this._pointerId !== e.pointerId) return;
      const t = Math.abs(e.clientX - this._pointerStartX), i = Math.abs(e.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (t < pt && i < pt) return;
        if (i > t) {
          this._resetPointer(e.currentTarget);
          return;
        }
        this._hasMoved = !0, this._dragging = !0;
      }
      const s = this._computeHorizontalPct(e.clientX, e.currentTarget);
      s !== this._dragPct && (this._dragPct = s);
    }, this._onHeaderPointerUp = (e) => {
      if (this._pointerId !== e.pointerId) return;
      const t = e.currentTarget;
      this._hasMoved && this._dragPct !== null ? this._emitGroupBrightness(this._dragPct) : this.hass && this._config && this.hass.callService("light", "toggle", { entity_id: this._config.entity }), this._resetPointer(t);
    }, this._toggleExpand = (e) => {
      e.stopPropagation(), this._expanded = !this._expanded;
    };
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-light-group-card",
      entity: (e ? Object.values(e.states).find(
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
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        { name: "expanded", selector: { boolean: {} } },
        { name: "use_light_color", selector: { boolean: {} } },
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
        }
      ],
      computeLabel: (e) => ({
        entity: "Gruppo luci (entità light con luci figlie)",
        name: "Nome personalizzato",
        icon: "Icona personalizzata (vuoto = lampade Google Home)",
        expanded: "Espanso di default",
        use_light_color: "Usa colore reale delle luci",
        card_style: "Design della pillola (Material 3)"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-light-group-card: you must define a light group entity");
    this._config = {
      expanded: !1,
      use_light_color: !0,
      card_style: "default",
      ...e
    }, this._expanded = !!this._config.expanded;
  }
  getCardSize() {
    return this._expanded ? 4 : 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 12, min_columns: 6 };
  }
  get _groupEntity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _childEntityIds() {
    const e = this._groupEntity?.attributes.entity_id;
    return Array.isArray(e) ? e.filter((t) => typeof t == "string" && t.startsWith("light.")) : [];
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_expanded") || e.has("_dragging") || e.has("_pressed") || e.has("_dragPct"))
      return !0;
    if (e.has("hass") && this._config && this.hass) {
      const t = [this._config.entity, ...this._childEntityIds];
      let i = !1;
      for (const s of t) {
        const r = this.hass.states[s];
        r !== this._prevStates[s] && (this._prevStates[s] = r, i = !0);
      }
      return i;
    }
    return !1;
  }
  get _aggregateStats() {
    const e = this._groupEntity, i = this._childEntityIds.map((c) => this.hass?.states[c]).filter((c) => !!c), s = i.filter((c) => c.state === "on"), r = i.length > 0 ? s.length : e?.state === "on" ? 1 : 0;
    let o = 0;
    if (this._dragging && this._dragPct !== null)
      o = this._dragPct;
    else if (s.length > 0) {
      const c = s.map(
        (d) => typeof d.attributes.brightness == "number" ? Math.max(1, Math.round(d.attributes.brightness / 255 * 100)) : 100
      );
      o = Math.round(c.reduce((d, u) => d + u, 0) / c.length);
    } else if (e?.state === "on") {
      const c = e.attributes.brightness;
      o = typeof c == "number" ? Math.max(1, Math.round(c / 255 * 100)) : 100;
    }
    const a = this._dragging && this._dragPct !== null ? this._dragPct > 0 : r > 0, n = !e || e.state === "unavailable" || e.state === "unknown";
    return { onCount: r, totalCount: i.length, avgPct: o, isOn: a, isUnavailable: n };
  }
  _computeAccentCss() {
    if (this._config?.use_light_color === !1)
      return "--m3e-group-accent: var(--md-sys-color-primary, #4c5c92);";
    const e = this._groupEntity?.attributes.rgb_color;
    return Array.isArray(e) && e.length === 3 ? `--m3e-group-accent: ${"#" + e.map((i) => Math.max(0, Math.min(255, Math.round(Number(i)))).toString(16).padStart(2, "0")).join("")};` : "--m3e-group-accent: #ffe066;";
  }
  _computeHorizontalPct(e, t) {
    const i = t.getBoundingClientRect();
    return i.width <= 0 ? 0 : Math.round(Math.max(0, Math.min(1, (e - i.left) / i.width)) * 100);
  }
  _emitGroupBrightness(e) {
    !this.hass || !this._config || (e <= 0 ? this.hass.callService("light", "turn_off", { entity_id: this._config.entity }) : this.hass.callService("light", "turn_on", {
      entity_id: this._config.entity,
      brightness_pct: e
    }));
  }
  _resetPointer(e) {
    e && this._pointerId !== null && e.hasPointerCapture(this._pointerId) && e.releasePointerCapture(this._pointerId), this._pointerId = null, this._dragging = !1, this._pressed = !1, this._hasMoved = !1, this._dragPct = null;
  }
  _renderGroupIcon(e) {
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${e}></ha-icon>` : l`
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
    const e = this._groupEntity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._childEntityIds, { onCount: r, totalCount: o, avgPct: a, isOn: n, isUnavailable: c } = this._aggregateStats, d = c ? "Offline" : this._dragging ? `${a}%` : n ? o > 1 ? `${r} on • ${a}%` : `On • ${a}%` : "Off", u = `style-${this._config.card_style ?? "default"}`, p = this._computeAccentCss();
    return l`
      <div class="group-wrapper">
        <ha-card
          class="group-header ${u} ${n ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${c ? "is-unavailable" : ""}"
          style="${p} --fill-pct: ${n ? a : 0}%;"
          role="slider"
          tabindex="0"
          aria-label=${t}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${a}
          aria-valuetext=${d}
          @pointerdown=${this._onHeaderPointerDown}
          @pointermove=${this._onHeaderPointerMove}
          @pointerup=${this._onHeaderPointerUp}
          @pointercancel=${(g) => this._resetPointer(g.currentTarget)}
        >
          <div class="header-track" aria-hidden="true">
            <div class="header-fill"></div>
          </div>
          <div class="state-layer" aria-hidden="true"></div>

          <div class="header-content">
            <span class="group-icon">${this._renderGroupIcon(i)}</span>
            <div class="meta">
              <span class="title">${t}</span>
              <span class="subtitle">${d}</span>
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
                      class="expand-btn ${this._expanded ? "is-expanded" : ""}"
                      aria-expanded=${String(this._expanded)}
                      aria-label=${this._expanded ? "Collapse lights" : "Expand lights"}
                      @pointerdown=${(g) => g.stopPropagation()}
                      @click=${this._toggleExpand}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                        />
                      </svg>
                    </button>
                  ` : h}
          </div>
        </ha-card>

        ${s.length > 0 ? l`
              <div class="group-grid-collapse ${this._expanded ? "is-open" : ""}">
                <div class="group-grid-inner">
                  <div class="child-grid">
                    ${s.map(
      (g) => l`
                        <m3e-light-card
                          .hass=${this.hass}
                          ${mi(this._attachChildConfig(g))}
                        ></m3e-light-card>
                      `
    )}
                  </div>
                </div>
              </div>
            ` : h}
      </div>
    `;
  }
  _attachChildConfig(e) {
    return (t) => {
      if (!t || !(t instanceof HTMLElement)) return;
      const i = t, s = this._config?.card_style ?? "default", r = this._config?.use_light_color ?? !0;
      (i._m3eBoundId !== e || i._m3eBoundStyle !== s || i._m3eBoundColor !== r) && (i._m3eBoundId = e, i._m3eBoundStyle = s, i._m3eBoundColor = r, i.setConfig({
        type: "custom:m3e-light-card",
        entity: e,
        use_light_color: r,
        card_style: s
      }));
    };
  }
};
z.styles = [
  D,
  C`
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
        transform: scale(0.985);
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
        padding: 14px 16px 14px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .group-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
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
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
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
          var(--md-sys-color-surface-container-lowest, #ffffff) 75%,
          transparent
        );
        color: var(--md-sys-color-on-surface, #1c1b18);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
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

      /* Smooth Expandable 2-Column Grid */
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
      }

      .child-grid {
        padding-top: 10px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
    `
];
Y([
  M({ attribute: !1 })
], z.prototype, "hass", 2);
Y([
  f()
], z.prototype, "_config", 2);
Y([
  f()
], z.prototype, "_expanded", 2);
Y([
  f()
], z.prototype, "_dragging", 2);
Y([
  f()
], z.prototype, "_pressed", 2);
Y([
  f()
], z.prototype, "_dragPct", 2);
z = Y([
  E("m3e-light-group-card")
], z);
var bi = Object.defineProperty, yi = Object.getOwnPropertyDescriptor, Oe = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? yi(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && bi(t, i, r), r;
};
let re = class extends $ {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._computeTopLabel = (e) => ({
      layout: "Layout visualizzazione",
      size: "Dimensione",
      transparent: "Sfondo trasparente (stile At a Glance)",
      show_presence_indicator: "Indicatore presenza (pallino quando in casa)"
    })[e.name] ?? e.name, this._computeItemLabel = (e) => ({
      entity: "Persona (person.* o device_tracker.*)",
      name: "Nome personalizzato",
      icon: "Icona personalizzata (sostituisce la foto)",
      image: "URL immagine personalizzata (opzionale)",
      tap_action: "Azione al tap",
      navigation_path: "Percorso (/lovelace/..., #popup, script.*)"
    })[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = {
      ...e,
      items: Array.isArray(e.items) ? e.items.map((t) => ({ ...t })) : []
    };
  }
  _emitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onTopChanged(e) {
    if (!this._config) return;
    const t = e.detail.value;
    this._emitConfig({
      ...this._config,
      layout: t.layout ?? "scroll",
      size: t.size ?? "default",
      transparent: t.transparent,
      show_presence_indicator: t.show_presence_indicator
    });
  }
  _onItemChanged(e, t) {
    if (!this._config) return;
    const i = [...this._config.items ?? []], s = {
      ...i[e],
      ...t.detail.value
    };
    s.name || delete s.name, s.icon || delete s.icon, s.image || delete s.image, s.navigation_path || delete s.navigation_path, i[e] = s, this._emitConfig({ ...this._config, items: i });
  }
  _addItem() {
    if (!this._config) return;
    const e = [...this._config.items ?? [], { entity: "", tap_action: "more-info" }];
    this._expandedIndex = e.length - 1, this._emitConfig({ ...this._config, items: e });
  }
  _removeItem(e, t) {
    if (t.stopPropagation(), !this._config) return;
    const i = [...this._config.items ?? []];
    i.splice(e, 1), this._expandedIndex >= i.length && (this._expandedIndex = Math.max(0, i.length - 1)), this._emitConfig({ ...this._config, items: i });
  }
  _moveItem(e, t, i) {
    if (i.stopPropagation(), !this._config) return;
    const s = [...this._config.items ?? []], r = e + t;
    r < 0 || r >= s.length || ([s[e], s[r]] = [s[r], s[e]], this._expandedIndex === e ? this._expandedIndex = r : this._expandedIndex === r && (this._expandedIndex = e), this._emitConfig({ ...this._config, items: s }));
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
  _buildItemSchema(e) {
    const t = [
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
              { value: "navigate", label: "Percorso / Bubble / Script" },
              { value: "none", label: "Nessuna azione" }
            ]
          }
        }
      }
    ];
    return e.tap_action === "navigate" && t.push({ name: "navigation_path", selector: { text: {} } }), t;
  }
  _itemTitle(e, t) {
    return e.name ? e.name : e.entity ? this.hass?.states[e.entity]?.attributes.friendly_name || e.entity : `Persona #${t + 1}`;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const e = this._config.items ?? [];
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
          <span class="section-title">Persone (${e.length})</span>
        </div>

        <div class="items-list">
          ${e.map((t, i) => {
      const s = this._expandedIndex === i, r = {
        entity: t.entity ?? "",
        name: t.name ?? "",
        icon: t.icon ?? "",
        image: t.image ?? "",
        tap_action: t.tap_action ?? "more-info",
        navigation_path: t.navigation_path ?? ""
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
                      <span class="item-title">${this._itemTitle(t, i)}</span>
                      <span class="item-sub">${t.entity || "Seleziona una persona"}</span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${i === 0}
                      @click=${(o) => this._moveItem(i, -1, o)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === e.length - 1}
                      @click=${(o) => this._moveItem(i, 1, o)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(o) => this._removeItem(i, o)}
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
                          .schema=${this._buildItemSchema(t)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(o) => this._onItemChanged(i, o)}
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
re.styles = C`
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
Oe([
  M({ attribute: !1 })
], re.prototype, "hass", 2);
Oe([
  f()
], re.prototype, "_config", 2);
Oe([
  f()
], re.prototype, "_expandedIndex", 2);
re = Oe([
  E("m3e-people-card-editor")
], re);
var xi = Object.defineProperty, wi = Object.getOwnPropertyDescriptor, Le = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? wi(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && xi(t, i, r), r;
};
let oe = class extends $ {
  constructor() {
    super(...arguments), this._isMouseDragging = !1, this._dragMoved = !1, this._dragStartX = 0, this._dragScrollLeft = 0;
  }
  setConfig(e) {
    if (!e)
      throw new Error("m3e-people-card: configurazione mancante");
    this._config = {
      ...e,
      layout: e.layout ?? "scroll",
      size: e.size ?? "default",
      transparent: e.transparent !== !1,
      show_presence_indicator: e.show_presence_indicator !== !1,
      items: Array.isArray(e.items) ? e.items : []
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
  static getStubConfig(e) {
    const t = e?.states ?? {}, i = Object.keys(t).filter((r) => r.startsWith("person.")).slice(0, 6);
    return {
      type: "custom:m3e-people-card",
      layout: "scroll",
      size: "default",
      transparent: !0,
      show_presence_indicator: !0,
      items: i.length > 0 ? i.map((r) => ({ entity: r, tap_action: "more-info" })) : [{ entity: "person.home", tap_action: "more-info" }]
    };
  }
  shouldUpdate(e) {
    if (!this._config) return !1;
    if (e.has("_config")) return !0;
    if (e.has("hass")) {
      const t = e.get("hass");
      if (!t || !this.hass) return !0;
      for (const i of this._config.items)
        if (i.entity && t.states[i.entity] !== this.hass.states[i.entity])
          return !0;
      return t.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  _formatLocation(e) {
    if (!e) return "Offline";
    const t = String(e.state ?? "").trim(), i = t.toLowerCase();
    return !t || i === "unavailable" || i === "unknown" ? "Offline" : i === "home" ? "Home" : i === "not_home" ? (this.hass?.language ?? "it").toLowerCase().startsWith("it") ? "Fuori casa" : "Away" : t;
  }
  _onMouseDown(e) {
    this._config?.layout !== "scroll" || !this._containerEl || e.button !== 0 || (this._isMouseDragging = !0, this._dragMoved = !1, this._dragStartX = e.pageX - this._containerEl.offsetLeft, this._dragScrollLeft = this._containerEl.scrollLeft);
  }
  _onMouseMove(e) {
    if (!this._isMouseDragging || !this._containerEl) return;
    const i = e.pageX - this._containerEl.offsetLeft - this._dragStartX;
    Math.abs(i) > 6 && (this._dragMoved = !0, e.preventDefault(), this._containerEl.scrollLeft = this._dragScrollLeft - i);
  }
  _onMouseUpOrLeave() {
    this._isMouseDragging = !1;
  }
  _onItemTap(e) {
    if (this._dragMoved) {
      this._dragMoved = !1;
      return;
    }
    if (!this.hass || !e.entity) return;
    const t = e.tap_action ?? "more-info";
    if (t !== "none") {
      if (t === "navigate" && e.navigation_path) {
        ve(this, this.hass, e.navigation_path);
        return;
      }
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: e.entity },
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  _renderAvatar(e, t, i = !1) {
    if (e.icon)
      return l`<ha-icon .icon=${e.icon}></ha-icon>`;
    const s = e.image?.trim() || t?.attributes.entity_picture || "";
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
    const e = this._config.items ?? [], t = this._config.layout ?? "scroll", i = this._config.size ?? "default", s = this._config.transparent !== !1, r = this._config.show_presence_indicator !== !1, o = l`
      <div
        class="people-container layout-${t} size-${i} ${s ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${e.length === 0 ? l`<div class="empty-hint">Aggiungi persone dalla configurazione della card</div>` : e.map((a) => {
      const n = a.entity ? this.hass?.states[a.entity] : void 0, c = !n || n.state === "unavailable" || n.state === "unknown", d = !c && String(n.state ?? "").toLowerCase() === "home", u = a.name || n?.attributes.friendly_name || a.entity || "Persona", p = this._formatLocation(n), g = (a.tap_action ?? "more-info") !== "none" && !!a.entity;
      return l`
                <button
                  type="button"
                  class="person-item ${c ? "is-dimmed" : ""} ${g ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(a)}
                >
                  <span class="avatar-wrap" aria-hidden="true">
                    <span class="avatar-circle ${d ? "is-home" : ""}">
                      ${this._renderAvatar(a, n, d)}
                    </span>
                    ${r && d ? l`<span class="presence-dot"></span>` : h}
                  </span>

                  <span class="text-col">
                    <span class="primary-name">${u}</span>
                    <span class="secondary-location">${p}</span>
                  </span>
                </button>
              `;
    })}
      </div>
    `;
    return s ? o : l`<ha-card>${o}</ha-card>`;
  }
};
oe.styles = [
  D,
  C`
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
Le([
  M({ attribute: !1 })
], oe.prototype, "hass", 2);
Le([
  f()
], oe.prototype, "_config", 2);
Le([
  P(".people-container")
], oe.prototype, "_containerEl", 2);
oe = Le([
  E("m3e-people-card")
], oe);
var $i = Object.defineProperty, Si = Object.getOwnPropertyDescriptor, ye = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Si(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && $i(t, i, r), r;
};
const ki = 2200;
let F = class extends $ {
  constructor() {
    super(...arguments), this._pressed = !1, this._activated = !1, this._resetTimer = null;
  }
  static getStubConfig(e) {
    return {
      type: "custom:m3e-scene-card",
      entity: (e ? Object.keys(e.states).find(
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
        { name: "name", selector: { text: {} } },
        { name: "subtitle", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
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
        }
      ],
      computeLabel: (e) => ({
        entity: "Scena, Script o Pulsante",
        name: "Nome personalizzato",
        subtitle: "Sottotitolo opzionale",
        icon: "Icona personalizzata (vuoto = scintille Google Home)",
        accent: "Colore di attivazione (M3Y)",
        card_style: "Design della pillola (Material 3)"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-scene-card: you must define an entity");
    this._config = {
      accent: "primary",
      card_style: "default",
      ...e
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
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_pressed") || e.has("_activated"))
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
  get _isUnavailable() {
    return this._entity?.state === "unavailable";
  }
  _trigger() {
    if (!this.hass || !this._config || this._isUnavailable) return;
    const e = this._config.entity, t = e.split(".")[0];
    t === "button" || t === "input_button" ? this.hass.callService(t, "press", { entity_id: e }) : t === "automation" ? this.hass.callService("automation", "trigger", { entity_id: e }) : t === "scene" || t === "script" ? this.hass.callService(t, "turn_on", { entity_id: e }) : this.hass.callService("homeassistant", "turn_on", { entity_id: e }), this._activated = !0, this._resetTimer !== null && window.clearTimeout(this._resetTimer), this._resetTimer = window.setTimeout(() => {
      this._activated = !1, this._resetTimer = null;
    }, ki);
  }
  _renderIcon(e, t) {
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${e}></ha-icon>` : t ? l`
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
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._config.accent ?? "primary", r = `style-${this._config.card_style ?? "default"}`, o = this._config.subtitle?.trim() || "", a = this._isUnavailable ? "Offline" : this._activated ? "Avviata" : o;
    return l`
      <ha-card
        class="scene-tile ${r} accent-${s} ${this._activated ? "is-on is-activated" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label=${t}
        @pointerdown=${(n) => {
      n.button === 0 && !this._isUnavailable && (this._pressed = !0);
    }}
        @pointerup=${() => {
      this._pressed && (this._pressed = !1, this._trigger());
    }}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @keydown=${(n) => {
      (n.key === " " || n.key === "Enter") && (n.preventDefault(), this._trigger());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="scene-icon">${this._renderIcon(i, this._activated)}</span>
          <div class="tile-meta">
            <span class="tile-title">${t}</span>
            ${a ? l`<span class="tile-subtitle">${a}</span>` : h}
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
F.styles = [
  D,
  C`
      .scene-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        outline: none;
        border-radius: var(--m3e-card-border-radius, 28px);
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

      .scene-tile.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
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
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        pointer-events: none;
      }

      .scene-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
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
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
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
        transition: color var(--m3e-spring-effects-default);
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
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
ye([
  M({ attribute: !1 })
], F.prototype, "hass", 2);
ye([
  f()
], F.prototype, "_config", 2);
ye([
  f()
], F.prototype, "_pressed", 2);
ye([
  f()
], F.prototype, "_activated", 2);
F = ye([
  E("m3e-scene-card")
], F);
var Ci = Object.defineProperty, Mi = Object.getOwnPropertyDescriptor, Ke = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Mi(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && Ci(t, i, r), r;
};
let _e = class extends $ {
  constructor() {
    super(...arguments), this._computeLabel = (e) => ({
      entity: "Entità principale",
      status_entity: "Entità stato dispositivo (opzionale)",
      name: "Nome personalizzato",
      card_style: "Design della pillola (Material 3)",
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
      navigation_path: "Percorso dashboard (/lovelace/...) · #hash Bubble Card · script/browser_mod",
      secondary_entity: "Entità secondaria (auto-rilevata dal device se vuota)",
      extra_entities: "Pillole entità aggiuntive nel popup (max 10)",
      outdoor_entity: "Temperatura esterna",
      remote_device: "Device ID trasmettitore (multi-dispositivo)",
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
    })[e.name] ?? e.name, this._onValueChanged = (e) => {
      const t = { ...this._config, ...e.detail.value };
      Array.isArray(t.extra_entities) && (t.extra_entities = t.extra_entities.slice(0, 10), t.extra_entities.length === 0 && delete t.extra_entities), this._config = t, this.dispatchEvent(
        new CustomEvent("config-changed", {
          bubbles: !0,
          composed: !0,
          detail: { config: t }
        })
      );
    };
  }
  setConfig(e) {
    this._config = { ...e };
  }
  _resolvedType() {
    const e = this._config?.popup_type ?? "auto";
    if (e !== "auto") return e;
    const t = this._config?.entity ?? "";
    if (t.startsWith("input_select.") || t.startsWith("select.")) return "selector";
    if (t.startsWith("climate.")) return "climate";
    if (t.startsWith("media_player.")) return "media";
    if (t.startsWith("remote.")) {
      const i = this.hass?.entities?.[t]?.device_id;
      if (i && this.hass?.entities) {
        for (const [s, r] of Object.entries(this.hass.entities))
          if (r.device_id === i && s.startsWith("media_player."))
            return "media";
      }
      return "remote";
    }
    return "sensor";
  }
  _buildSchema() {
    const e = this._resolvedType(), t = this._config?.tap_action === "navigate" || this._config?.hold_action === "navigate", i = [
      { name: "entity", required: !0, selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
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
        name: "popup_type",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "auto", label: "Automatico (in base al dispositivo)" },
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
          {
            name: "tap_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "popup", label: "Apri popup M3E" },
                  { value: "toggle", label: "Toggle stato" },
                  { value: "navigate", label: "Percorso / Bubble / Browser Mod" },
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
                  { value: "navigate", label: "Percorso / Bubble / Browser Mod" },
                  { value: "none", label: "Nessuna" }
                ]
              }
            }
          }
        ]
      }
    ];
    t && i.push({ name: "navigation_path", selector: { text: {} } });
    const r = {
      name: "subtitle_attribute",
      selector: {
        attribute: {
          entity_id: this._config?.subtitle_entity?.trim() || this._config?.entity || ""
        }
      }
    }, o = {
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
    return e === "custom" ? i.push(
      { name: "subtitle_entity", selector: { entity: {} } },
      r,
      o,
      a,
      {
        type: "grid",
        name: "",
        schema: [
          { name: "subtitle_prefix", selector: { text: {} } },
          { name: "subtitle_suffix", selector: { text: {} } }
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
    ) : e === "sensor" ? i.push(
      r,
      o,
      a,
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
    ) : e === "climate" ? i.push({
      name: "outdoor_entity",
      selector: { entity: { domain: "sensor" } }
    }) : e === "media" ? i.push({ name: "status_entity", selector: { entity: {} } }) : e === "remote" && i.push(
      { name: "status_entity", selector: { entity: {} } },
      { name: "remote_device", selector: { text: {} } },
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
    ), i;
  }
  render() {
    return !this.hass || !this._config ? h : l`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._buildSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }
};
_e.styles = C`
    :host {
      display: block;
    }
  `;
Ke([
  M({ attribute: !1 })
], _e.prototype, "hass", 2);
Ke([
  f()
], _e.prototype, "_config", 2);
_e = Ke([
  E("m3e-status-card-editor")
], _e);
var Pi = Object.defineProperty, Ai = Object.getOwnPropertyDescriptor, x = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ai(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && Pi(t, i, r), r;
};
const Ve = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
function Ue(e, t) {
  if (t === "raw") return e;
  const i = e.trim();
  if (!Ve.test(i)) return e;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return e;
  const r = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (t === "time" || t === "auto")
    return r;
  if (t === "datetime") {
    const g = /* @__PURE__ */ new Date(), m = (T, k) => T.getFullYear() === k.getFullYear() && T.getMonth() === k.getMonth() && T.getDate() === k.getDate(), b = new Date(g.getFullYear(), g.getMonth(), g.getDate() + 1), L = new Date(g.getFullYear(), g.getMonth(), g.getDate() - 1);
    return m(s, g) ? `Oggi ${r}` : m(s, b) ? `Domani ${r}` : m(s, L) ? `Ieri ${r}` : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${r}`;
  }
  const o = s.getTime() - Date.now(), a = o >= 0, n = Math.round(Math.abs(o) / 6e4);
  if (n < 1) return "Ora";
  const c = Math.floor(n / 1440), d = Math.floor(n % 1440 / 60), u = n % 60;
  let p;
  return c > 0 ? p = d > 0 ? `${c}g ${d}h` : `${c}g` : d > 0 ? p = u > 0 ? `${d}h ${u}m` : `${d}h` : p = `${u}m`, a ? `Tra ${p}` : `${p} fa`;
}
const Ei = /* @__PURE__ */ new Set([
  "temperature",
  "humidity",
  "illuminance",
  "pressure",
  "atmospheric_pressure",
  "power",
  "energy",
  "battery",
  "co2",
  "pm25",
  "pm10",
  "aqi",
  "moisture",
  "voltage",
  "current"
]), Ti = /* @__PURE__ */ new Set([
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
]), K = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"/></svg>`, Oi = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 15.41a1 1 0 0 1 0-1.41l3.88-3.88a1 1 0 0 1 1.42 0L16.59 14a1 1 0 1 1-1.41 1.41L12 12.23l-3.18 3.18a1 1 0 0 1-1.41 0Z"/></svg>`, we = 135, N = 270;
function Li(e) {
  return e * Math.PI / 180;
}
function ue(e, t, i, s) {
  const r = Li(s);
  return { x: e + i * Math.cos(r), y: t + i * Math.sin(r) };
}
function Ii(e, t, i, s, r) {
  const o = ue(e, t, i, s), a = ue(e, t, i, r);
  return `M ${o.x.toFixed(2)} ${o.y.toFixed(2)} A ${i} ${i} 0 1 1 ${a.x.toFixed(2)} ${a.y.toFixed(2)}`;
}
let y = class extends $ {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._volDragging = !1, this._volPct = null, this._volPendingTimer = null, this._historyPoints = [], this._historyLoading = !1, this._historyEntityId = null, this._historyHoverIdx = null, this._prevStates = {}, this._longPressTimer = null, this._longPressTriggered = !1, this._relativeTimer = null, this._relativeTick = 0, this._onTilePointerDown = (e) => {
      e.button === 0 && (this._pressed = !0, this._longPressTriggered = !1, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
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
      const e = this._config?.tap_action ?? "popup";
      if (e !== "none") {
        if (e === "navigate") {
          ve(this, this.hass, this._config?.navigation_path);
          return;
        }
        if (e === "more-info" && this._config) {
          this._openMoreInfo(this._config.entity);
          return;
        }
        if (e === "toggle" && this.hass && this._config) {
          const t = this._config.entity.split(".")[0];
          this.hass.callService(t, "toggle", { entity_id: this._config.entity });
          return;
        }
        this.openPopup();
      }
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
      t.setPointerCapture(e.pointerId), this._volPendingTimer !== null && (window.clearTimeout(this._volPendingTimer), this._volPendingTimer = null), this._volDragging = !0, this._updateVolFromPointer(e.clientX, t, !1);
    }, this._onVolPointerMove = (e) => {
      this._volDragging && this._updateVolFromPointer(e.clientX, e.currentTarget, !1);
    }, this._onVolPointerUp = (e) => {
      if (!this._volDragging) return;
      const t = e.currentTarget;
      t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this._updateVolFromPointer(e.clientX, t, !0), this._volDragging = !1, this._volPendingTimer = window.setTimeout(() => {
        this._volPct = null, this._volPendingTimer = null;
      }, 900);
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
  static getConfigElement() {
    return document.createElement("m3e-status-card-editor");
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-status-card: you must define an entity");
    this._config = {
      popup_type: "auto",
      tap_action: "popup",
      hold_action: "popup",
      subtitle_format: "auto",
      ...e
    }, this._syncRelativeTimer();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncRelativeTimer();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress(), this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
  }
  _syncRelativeTimer() {
    const e = this._config?.subtitle_format === "relative";
    e && this._relativeTimer === null ? this._relativeTimer = window.setInterval(() => {
      this._relativeTick++;
    }, 3e4) : !e && this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
  }
  _clearLongPress() {
    this._longPressTimer !== null && (window.clearTimeout(this._longPressTimer), this._longPressTimer = null);
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 6, min_columns: 3 };
  }
  shouldUpdate(e) {
    if (e.has("_config") || e.has("_pressed") || e.has("_popupOpen") || e.has("_dialDragging") || e.has("_dialTemp") || e.has("_activeSheet") || e.has("_volDragging") || e.has("_volPct") || e.has("_historyPoints") || e.has("_historyLoading") || e.has("_historyHoverIdx") || e.has("_relativeTick"))
      return !0;
    if (e.has("hass") && this._config && this.hass) {
      const t = [
        this._config.entity,
        this._config.status_entity,
        this._config.subtitle_entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...(this._config.extra_entities ?? []).slice(0, 10),
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
    const e = this.hass.entities?.[this._config.entity]?.device_id;
    if (e && this.hass.entities) {
      for (const [t, i] of Object.entries(this.hass.entities))
        if (i.device_id === e && t.startsWith("media_player.")) {
          const s = this.hass.states[t];
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
    const e = this._config.entity, t = this.hass.entities[e]?.device_id;
    if (!t) return [];
    const i = [];
    for (const [s, r] of Object.entries(this.hass.entities))
      s !== e && r.device_id === t && (s.startsWith("sensor.") || s.startsWith("media_player.")) && i.push(s);
    return i;
  }
  _getSiblingSensors() {
    if (!this.hass) return [];
    const e = [], t = /* @__PURE__ */ new Set();
    if (this._config?.secondary_entity) {
      const r = this.hass.states[this._config.secondary_entity];
      r && (e.push(r), t.add(r.entity_id));
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
    ], s = this._getSiblingEntityIds().map((r) => this.hass.states[r]).filter((r) => !!r && !t.has(r.entity_id));
    s.sort((r, o) => {
      const a = i.indexOf(String(r.attributes.device_class ?? "")), n = i.indexOf(String(o.attributes.device_class ?? ""));
      return (a === -1 ? 99 : a) - (n === -1 ? 99 : n);
    });
    for (const r of s) {
      const o = String(r.attributes.device_class ?? "");
      i.includes(o) && (e.push(r), t.add(r.entity_id));
    }
    if (Array.isArray(this._config?.extra_entities))
      for (const r of this._config.extra_entities.slice(0, 10)) {
        if (!r || t.has(r)) continue;
        const o = this.hass.states[r];
        o && (e.push(o), t.add(o.entity_id));
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
    if (t.startsWith("input_select.") || t.startsWith("select.")) return "selector";
    if (t.startsWith("climate.")) return "climate";
    if (t.startsWith("media_player.")) return "media";
    if (t.startsWith("remote.")) {
      const i = this._mediaEntity;
      return i && i.entity_id.startsWith("media_player.") ? "media" : "remote";
    }
    return "sensor";
  }
  get _isActive() {
    const e = this._statusEntity, t = String(e?.state ?? "").toLowerCase();
    return !t || t === "unavailable" || t === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(t) : e?.entity_id.startsWith("sensor.") && !Number.isNaN(Number(t)) ? !1 : Ti.has(t);
  }
  get _isUnavailable() {
    const e = this._statusEntity?.state;
    return !e || e === "unavailable" || e === "unknown";
  }
  get _stateLabel() {
    const e = this._statusEntity;
    if (!e) return "Offline";
    const t = e.state;
    if (t === "unavailable" || t === "unknown") return "Offline";
    const i = this._config?.subtitle_format ?? "auto", s = !!(this._config?.subtitle_entity?.trim() || this._config?.subtitle_attribute?.trim()), r = this._config?.subtitle_visibility ?? (this._config?.subtitle_only_when_active ? "on" : "both"), o = r === "both" || r === "on" && this._isActive || r === "off" && !this._isActive;
    if (s && o) {
      const n = this._config?.subtitle_entity?.trim() ? this.hass?.states[this._config.subtitle_entity.trim()] : e;
      if (n) {
        const c = this._config?.subtitle_attribute?.trim();
        let d;
        if (c)
          d = n.attributes[c];
        else {
          const u = n.state;
          if (u !== "unavailable" && u !== "unknown") {
            const p = n.attributes.unit_of_measurement;
            d = p ? `${u}${p}` : u;
          }
        }
        if (d != null && String(d).trim() !== "") {
          const u = Ue(String(d), i), p = this._config?.subtitle_prefix ?? "", g = this._config?.subtitle_suffix ?? "";
          return `${p}${u}${g}`;
        }
      }
    }
    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;
    const a = e.entity_id.split(".")[0];
    if (a === "climate") {
      const n = t.charAt(0).toUpperCase() + t.slice(1), c = e.attributes.temperature;
      return t !== "off" && typeof c == "number" ? `${n} ${c}` : n;
    }
    if (a === "sensor") {
      if (Ve.test(t.trim()))
        return Ue(t, i);
      const n = e.attributes.unit_of_measurement, c = n ? `${t}${n}` : t;
      if (e.attributes.device_class === "temperature" || n === "°C" || n === "°F") {
        const u = this._getSiblingSensors().find(
          (p) => p.attributes.device_class === "humidity" || p.attributes.unit_of_measurement === "%"
        );
        if (u && u.state !== "unavailable" && u.state !== "unknown")
          return `${c} • ${u.state}${u.attributes.unit_of_measurement ?? "%"}`;
      }
      return c;
    }
    return a === "media_player" ? t.charAt(0).toUpperCase() + t.slice(1) : Ve.test(t.trim()) ? Ue(t, i) : t.charAt(0).toUpperCase() + t.slice(1);
  }
  _isNumericHistoryEntity(e) {
    if (!e || !e.entity_id.startsWith("sensor.")) return !1;
    const t = String(e.attributes.device_class ?? "");
    return Ei.has(t) ? !0 : !!e.attributes.unit_of_measurement && !Number.isNaN(Number(e.state));
  }
  _resolveHistoryEntity() {
    return this._isNumericHistoryEntity(this._entity) ? this._entity : this._getSiblingSensors().find((e) => this._isNumericHistoryEntity(e));
  }
  async _fetchHistory() {
    if (!this.hass) return;
    const e = this._resolveHistoryEntity();
    if (!e) {
      this._historyPoints = [], this._historyEntityId = null;
      return;
    }
    this._historyEntityId = e.entity_id, this._historyLoading = !0, this._historyHoverIdx = null;
    try {
      const t = /* @__PURE__ */ new Date(), i = new Date(t.getTime() - 1440 * 60 * 1e3);
      let s = [];
      typeof this.hass.callWS == "function" ? s = (await this.hass.callWS({
        type: "history/history_during_period",
        start_time: i.toISOString(),
        end_time: t.toISOString(),
        entity_ids: [e.entity_id],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      }))?.[e.entity_id] ?? [] : typeof this.hass.callApi == "function" && (s = (await this.hass.callApi(
        "GET",
        `history/period/${i.toISOString()}?filter_entity_id=${encodeURIComponent(e.entity_id)}&minimal_response&no_attributes`
      ))?.[0] ?? []);
      const r = [];
      for (const a of s) {
        const n = Number(a.s ?? a.state);
        if (Number.isNaN(n)) continue;
        const c = typeof a.lu == "number" ? a.lu * 1e3 : a.last_updated ? Date.parse(a.last_updated) : NaN;
        Number.isNaN(c) || r.push({ t: c, v: n });
      }
      const o = 44;
      if (r.length > o) {
        const a = (r.length - 1) / (o - 1), n = [];
        for (let c = 0; c < o; c++)
          n.push(r[Math.round(c * a)]);
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
     POPUP OPEN / CLOSE (Container Transform)
     ========================================================================= */
  async openPopup() {
    if (this._resolvedPopupType === "none" || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const e = this._tileEl?.getBoundingClientRect();
    this._activeSheet = null, this._popupOpen = !0, (this._resolvedPopupType === "sensor" || this._resolvedPopupType === "custom") && this._fetchHistory(), await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), a = Math.max(0.28, e.width / s.width), n = Math.max(0.16, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${a}, ${n})`,
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
  _handleHoldAction() {
    if (!this._config) return;
    const e = this._config.hold_action ?? "popup";
    if (e !== "none") {
      if (window.getSelection()?.removeAllRanges(), e === "navigate") {
        ve(this, this.hass, this._config.navigation_path);
        return;
      }
      if (e === "more-info") {
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
    return we + t * N;
  }
  _pointerToTemp(e, t) {
    const i = t.getBoundingClientRect(), s = i.left + i.width / 2, r = i.top + i.height / 2;
    let o = Math.atan2(e.clientY - r, e.clientX - s) * 180 / Math.PI;
    o < 0 && (o += 360);
    let a = (o - we + 360) % 360;
    a > N && (a = a > N + (360 - N) / 2 ? 0 : N);
    const n = a / N, c = this._climateMin + n * (this._climateMax - this._climateMin);
    return Math.round(c * 2) / 2;
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
      const o = {
        entity_id: this._config.entity,
        command: r
      };
      this._config.remote_device?.trim() && (o.device = this._config.remote_device.trim()), this.hass.callService("remote", "send_command", o);
      return;
    }
    if (this._config.entity.startsWith("remote.")) {
      const o = {
        entity_id: this._config.entity,
        command: s ?? e
      };
      this._config.remote_device?.trim() && (o.device = this._config.remote_device.trim()), this.hass.callService("remote", "send_command", o);
      return;
    }
    this._callEntityService(t, i);
  }
  /* =========================================================================
     MEDIA VOLUME PILL INTERACTION
     ========================================================================= */
  get _mediaVolumePct() {
    if (this._volPct !== null) return this._volPct;
    const e = this._mediaEntity?.attributes.volume_level;
    return typeof e == "number" ? Math.round(e * 100) : 0;
  }
  _updateVolFromPointer(e, t, i) {
    const s = t.getBoundingClientRect();
    if (s.width <= 0) return;
    const r = Math.round(Math.max(0, Math.min(1, (e - s.left) / s.width)) * 100);
    this._volPct = r;
    const o = this._mediaEntity;
    i && this.hass && o && this.hass.callService("media_player", "volume_set", {
      entity_id: o.entity_id,
      volume_level: Number((r / 100).toFixed(2))
    });
  }
  _callMediaService(e, t = {}) {
    const i = this._mediaEntity;
    !this.hass || !i || this.hass.callService("media_player", e, {
      entity_id: i.entity_id,
      ...t
    });
  }
  _openMoreInfo(e) {
    this.closePopup(), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: e }
      })
    );
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
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${e}></ha-icon>` : Xe(this._statusEntity ?? this._entity, this._isActive, this._resolvedPopupType);
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _cleanSiblingLabel(e) {
    const t = String(e.attributes.device_class ?? ""), i = (e.attributes.friendly_name || "").trim();
    if (!i)
      return t ? t.replace(/_/g, " ").replace(/^./, (n) => n.toUpperCase()) : "Sensor";
    const s = (n, c) => {
      const d = c.trim();
      if (!d || n.length <= d.length) return null;
      if (n.toLowerCase().startsWith(d.toLowerCase())) {
        const u = n.slice(d.length).replace(/^[\s\-–—:]+/, "").trim();
        if (u) return u.charAt(0).toUpperCase() + u.slice(1);
      }
      return null;
    }, r = this.hass?.entities?.[e.entity_id]?.device_id, o = r ? this.hass?.devices?.[r] : void 0;
    for (const n of [
      o?.name_by_user,
      o?.name,
      this._config?.name,
      this._entity?.attributes.friendly_name
    ])
      if (n) {
        const c = s(i, n);
        if (c) return c;
      }
    const a = (this._entity?.attributes.friendly_name || "").trim();
    if (a) {
      const n = a.split(/\s+/), c = i.split(/\s+/);
      let d = 0;
      for (; d < n.length && d < c.length - 1 && n[d].toLowerCase() === c[d].toLowerCase(); )
        d++;
      if (d > 0) {
        const u = c.slice(d).join(" ").replace(/^[\s\-–—:]+/, "").trim();
        if (u) return u.charAt(0).toUpperCase() + u.slice(1);
      }
    }
    return i;
  }
  _renderSiblingIcon(e) {
    if (typeof customElements < "u" && customElements.get("ha-state-icon"))
      return l`<ha-state-icon class="mini-ha-icon" .hass=${this.hass} .stateObj=${e}></ha-state-icon>`;
    const t = String(e.attributes.device_class ?? "");
    return t === "humidity" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : t === "illuminance" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : t === "battery" ? l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : l`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
  }
  _renderHistoryChart() {
    const e = this._historyEntityId ? this.hass?.states[this._historyEntityId] : this._resolveHistoryEntity();
    if (!e) return h;
    const t = String(e.attributes.unit_of_measurement ?? ""), i = this._historyEntityId === this._entity?.entity_id ? "Last 24 hours" : `${this._cleanSiblingLabel(e)} • 24h`;
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
    const r = Math.min(...s.map((v) => v.v)), o = Math.max(...s.map((v) => v.v)), a = o - r || 1, n = s[0].t, c = s[s.length - 1].t, d = c - n || 1, u = 320, p = 104, g = 6, m = 12, b = s.map((v) => ({
      x: g + (v.t - n) / d * (u - g * 2),
      y: p - m - (v.v - r) / a * (p - m * 2),
      ...v
    }));
    let L = `M ${b[0].x.toFixed(1)} ${b[0].y.toFixed(1)}`;
    for (let v = 1; v < b.length; v++) {
      const q = b[v - 1], A = b[v], Z = ((q.x + A.x) / 2).toFixed(1);
      L += ` C ${Z} ${q.y.toFixed(1)}, ${Z} ${A.y.toFixed(1)}, ${A.x.toFixed(1)} ${A.y.toFixed(1)}`;
    }
    const X = `${L} L ${b[b.length - 1].x.toFixed(1)} ${p} L ${b[0].x.toFixed(1)} ${p} Z`, T = this._historyHoverIdx, k = T !== null ? b[T] : b[b.length - 1], U = (v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ae = (v) => {
      const A = v.currentTarget.getBoundingClientRect();
      if (A.width <= 0) return;
      const Z = Math.max(0, Math.min(1, (v.clientX - A.left) / A.width));
      this._historyHoverIdx = Math.round(Z * (b.length - 1));
    }, ne = `m3e-hist-${this._historyEntityId?.replace(/[^a-z0-9]/gi, "_") ?? "g"}`;
    return l`
      <div class="history-card">
        <div class="history-header">
          <span class="history-title">${i}</span>
          <span class="history-range">
            ${T !== null ? `${k.v}${t} · ${U(k.t)}` : `${r}${t} – ${o}${t}`}
          </span>
        </div>

        <svg
          class="history-svg"
          viewBox="0 0 ${u} ${p}"
          preserveAspectRatio="none"
          @pointerdown=${ae}
          @pointermove=${(v) => {
      (v.buttons > 0 || v.pointerType === "mouse") && ae(v);
    }}
          @pointerleave=${() => this._historyHoverIdx = null}
        >
          ${He`
            <defs>
              <linearGradient id=${ne} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1=${g} y1=${m} x2=${u - g} y2=${m} class="history-grid-line" />
            <line x1=${g} y1=${p / 2} x2=${u - g} y2=${p / 2} class="history-grid-line" />
            <line x1=${g} y1=${p - m} x2=${u - g} y2=${p - m} class="history-grid-line" />
            <path d=${X} fill="url(#${ne})" />
            <path d=${L} class="history-line" />
            ${T !== null ? He`<line x1=${k.x} y1=${m} x2=${k.x} y2=${p - m} class="history-cursor-line" />` : h}
            <circle cx=${k.x} cy=${k.y} r="4.5" class="history-dot" />
          `}
        </svg>

        <div class="history-axis">
          <span>${U(n)}</span>
          <span>${U((n + c) / 2)}</span>
          <span>${U(c)}</span>
        </div>
      </div>
    `;
  }
  _openEntityMoreInfo(e) {
    const t = this._dialogEl;
    t?.open && t.close(), this._popupOpen = !1, this._activeSheet = null, this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _renderSensorPopup(e) {
    const t = this._getSiblingSensors();
    return l`
      <div class="sensor-hero">
        <div class="sensor-ring ${this._isActive ? "is-active" : ""}">
          <span class="sensor-ring-icon">${this._renderEntityIcon(e)}</span>
          <span class="sensor-ring-state">${this._stateLabel}</span>
          <span class="sensor-ring-sub">
            ${this._entity?.attributes.device_class ? String(this._entity.attributes.device_class).replace(/^./, (i) => i.toUpperCase()) : "Status"}
          </span>
        </div>
      </div>

      ${t.length > 0 ? l`
            <div class="modular-stack">
              ${t.map((i) => {
      const s = this._cleanSiblingLabel(i), r = `${i.state}${i.attributes.unit_of_measurement ?? ""}`;
      return l`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(i.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(i)}
                      <span class="info-pill-label">${s}</span>
                    </span>
                    <span class="info-pill-right">
                      <span class="info-pill-val">${r}</span>
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
    const e = this._entity, t = String(e?.state ?? "off").toLowerCase(), i = t === "off", s = this._climateTarget, r = this._climateCurrent, o = this._outdoorEntity, a = Math.floor(s), n = Math.abs(s - a - 0.5) < 0.05, c = this._tempToDeg(s), d = r !== null ? this._tempToDeg(r) : null, u = 140, p = 140, g = 114, m = Ii(u, p, g, we, we + N), b = ue(u, p, g, c), L = d !== null ? ue(u, p, g, d) : null, X = d !== null ? ue(u, p, g - 22, d) : null, T = Array.isArray(e?.attributes.hvac_modes) ? e.attributes.hvac_modes : ["heat", "cool", "off"], k = Array.isArray(e?.attributes.preset_modes) ? e.attributes.preset_modes : [], U = Array.isArray(e?.attributes.fan_modes) ? e.attributes.fan_modes : [], ae = Array.isArray(e?.attributes.swing_modes) ? e.attributes.swing_modes : [], ne = String(e?.attributes.preset_mode ?? "none"), v = String(e?.attributes.fan_mode ?? "auto"), q = String(e?.attributes.swing_mode ?? "off"), A = typeof e?.attributes.current_humidity == "number" ? `${e.attributes.current_humidity}%` : this._getSiblingSensors().find((_) => _.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((_) => _.attributes.device_class === "humidity").state}%` : null, Z = k.length > 0, Ie = U.length > 0, ze = ae.length > 0, Je = t === "heat" || t === "heating" ? "mode-heat" : t === "cool" || t === "cooling" ? "mode-cool" : "mode-off", le = (_) => _.replace(/_/g, " ").replace(/^./, (xe) => xe.toUpperCase()), ce = this._activeSheet === "mode" ? { title: "Select a mode", options: T, current: t, onSelect: (_) => this._setClimateMode(_) } : this._activeSheet === "preset" ? { title: "Select preset", options: k, current: ne, onSelect: (_) => this._setClimatePreset(_) } : this._activeSheet === "fan" ? { title: "Fan speed", options: U, current: v, onSelect: (_) => this._setClimateFan(_) } : this._activeSheet === "swing" ? { title: "Swing mode", options: ae, current: q, onSelect: (_) => this._setClimateSwing(_) } : null;
    return l`
      <div class="climate-hero ${Je} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${u} cy=${p} r="132" class="dial-bg-circle" />
            <path d=${m} class="dial-arc-track" />

            ${L && X ? He`
                  <circle cx=${L.x} cy=${L.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${X.x}
                    y=${X.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(r)}
                  </text>
                ` : h}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${b.x.toFixed(2)}, ${b.y.toFixed(2)}) rotate(${c.toFixed(1)})">
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
                    ${a}${n ? l`<sup>5</sup>` : h}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(_) => _.stopPropagation()}>
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
        <div class="${Z ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${Z ? "compact-trait" : ""} ${Je}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${t === "heat" ? l`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : t === "cool" ? l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${le(t)}</span>
            </span>
          </button>

          ${Z ? l`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${le(ne)}</span>
                  </span>
                  <span class="trait-chevron">${K}</span>
                </button>
              ` : h}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${Ie || ze ? l`
              <div class="${Ie && ze ? "climate-grid-2" : ""}">
                ${Ie ? l`
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
                            <span class="mode-pill-val">${le(v)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">${K}</span>
                      </button>
                    ` : h}

                ${ze ? l`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${le(q)}</span>
                        </span>
                        <span class="trait-chevron">${K}</span>
                      </button>
                    ` : h}
              </div>
            ` : h}

        ${r !== null || o || A ? l`
              <div class="telemetry-card">
                ${r !== null ? l`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${r}°</strong>
                      </div>
                    ` : h}
                ${A ? l`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${A}</strong>
                      </div>
                    ` : h}
                ${o ? l`
                      <div class="telemetry-row">
                        <span>Outdoor temperature</span>
                        <strong>${o.state}${o.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : h}
              </div>
            ` : h}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${ce ? l`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(_) => _.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ${K}
                  </button>
                  <span>${ce.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${ce.options.map((_) => {
      const xe = _.toLowerCase() === ce.current.toLowerCase(), xt = this._activeSheet === "mode" ? _ === "heat" ? "mode-heat" : _ === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return l`
                      <button
                        type="button"
                        class="mode-option ${xe ? `selected ${xt}` : ""}"
                        @click=${() => ce.onSelect(_)}
                      >
                        <span>${le(_)}</span>
                        ${xe ? l`<span class="check-mark">✓</span>` : h}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : h}
    `;
  }
  _renderRemotePopup() {
    const e = String(this._entity?.attributes.source ?? "Source");
    return l`
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
            ${K}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteButton("ch_up", "media_next_track", {}, "ChannelUp")}
          >
            ${Oi}
          </button>
        </div>

        <div class="secondary-action-card">
          <span>${e}</span>
          <span class="trait-chevron">${K}</span>
        </div>
      </div>
    `;
  }
  _renderMediaPopup() {
    const e = this._mediaEntity, t = e?.state === "playing", i = !e || e.state === "idle" || e.state === "off", s = String(e?.attributes.media_title ?? (i ? "Nothing playing" : "Paused")), r = String(e?.attributes.media_artist ?? ""), o = String(e?.attributes.app_name ?? ""), a = String(e?.attributes.entity_picture ?? ""), n = this._mediaVolumePct;
    return l`
      <div
        class="media-hero-card ${a && !i ? "has-art" : ""}"
        style=${a && !i ? `--media-art: url("${a}");` : ""}
      >
        <div class="media-hero-top">
          <span class="media-app-badge">${o || "▶"}</span>
        </div>

        <div class="media-hero-mid">
          <div class="media-meta">
            <span class="media-title">${s}</span>
            ${r ? l`<span class="media-artist">${r}</span>` : h}
          </div>
          ${i ? h : l`
                <button
                  type="button"
                  class="media-play-fab"
                  aria-label=${t ? "Pause" : "Play"}
                  @click=${() => this._callMediaService("media_play_pause")}
                >
                  ${t ? "⏸" : "▶"}
                </button>
              `}
        </div>

        <div class="media-scrubber-row">
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callMediaService("media_previous_track")}
          >
            ⏮
          </button>
          <div class="scrubber-track">
            <div class="scrubber-fill" style="width: ${i ? 0 : 28}%"></div>
            ${i ? h : l`<span class="scrubber-dot" style="left: 28%"></span>`}
          </div>
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callMediaService("media_next_track")}
          >
            ⏭
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Shape Coding: Full Pill (9999px) for Active Primary Volume Slider -->
        <div
          class="volume-pill ${this._volDragging ? "is-dragging" : ""}"
          style="--vol-pct: ${n}%;"
          role="slider"
          tabindex="0"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${n}
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
            <span>${n}%</span>
          </div>
        </div>

        <!-- Primary action pill (Stop when active, Turn on when off) -->
        ${i ? e?.state === "off" ? l`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService("turn_on")}
                >
                  Turn on
                </button>
              ` : h : l`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callMediaService("media_stop")}
              >
                Stop casting
              </button>
            `}

        <!-- Secondary action: opens native Home Assistant Media Browser / More Info -->
        ${e ? l`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMoreInfo(e.entity_id)}
              >
                <span>Media &amp; Controls</span>
                <span>↗</span>
              </button>
            ` : h}
      </div>
    `;
  }
  _selectOption(e) {
    if (!this.hass || !this._config?.entity) return;
    const t = this._config.entity.split(".")[0];
    this.hass.callService(t, "select_option", {
      entity_id: this._config.entity,
      option: e
    }), window.setTimeout(() => this.closePopup(), 160);
  }
  _renderSelectorOptionIcon(e, t) {
    const i = e.toLowerCase();
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
      ` : i.includes("home") || i.includes("casa") || i.includes("present") ? t ? l`
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
          ` : t ? l`
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
  _renderSelectorPopup() {
    const e = this._entity, t = e?.attributes.options, i = Array.isArray(t) ? t.map(String) : [], s = e?.state ?? "";
    return i.length === 0 ? l`
        <div class="selector-empty">
          Nessuna opzione disponibile per questa entità. Collega un <code>input_select</code> o
          <code>select</code>.
        </div>
      ` : l`
      <div class="selector-list" role="radiogroup" aria-label="Seleziona opzione">
        ${i.map((r) => {
      const o = r === s;
      return l`
            <button
              type="button"
              class="selector-row ${o ? "is-selected" : ""}"
              role="radio"
              aria-checked=${String(o)}
              @click=${() => this._selectOption(r)}
            >
              <span class="selector-row-icon">
                ${this._renderSelectorOptionIcon(r, o)}
              </span>
              <span class="selector-row-label">${r}</span>
              <span class="m3-radio ${o ? "checked" : ""}" aria-hidden="true">
                <span class="m3-radio-dot"></span>
              </span>
            </button>
          `;
    })}
      </div>
    `;
  }
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return h;
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._isActive, s = i ? this._config.icon_active?.trim() || void 0 : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || void 0, r = this._resolvedPopupType, o = this._config.tap_action === "navigate" || this._config.tap_action === "more-info" || this._config.tap_action !== "toggle" && this._config.tap_action !== "none" && r !== "none", a = `style-${this._config.card_style ?? "default"}`, n = this._popupOpen ? qe(this._statusEntity?.last_changed) : null;
    return l`
      <ha-card
        class="status-tile ${a} ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${t}, ${this._stateLabel}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @click=${this._onTileClick}
        @contextmenu=${(c) => {
      c.preventDefault(), this._handleHoldAction();
    }}
        @keydown=${(c) => {
      (c.key === "Enter" || c.key === " ") && (c.preventDefault(), this._onTileClick());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderEntityIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${t}</span>
            <span class="tile-subtitle">${this._stateLabel}</span>
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
              ` : o ? l`
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
      </ha-card>

      <dialog
        class="status-dialog"
        @click=${(c) => {
      c.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(c) => {
      c.preventDefault(), this.closePopup();
    }}
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
                    <span class="dialog-title">${t}</span>
                    ${n ? l`<span class="dialog-last-changed">${n}</span>` : h}
                  </div>
                </header>

                ${r === "selector" ? this._renderSelectorPopup() : r === "sensor" || r === "custom" ? this._renderSensorPopup(s) : r === "climate" ? this._renderClimatePopup() : r === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
              </div>
            ` : h}
      </dialog>
    `;
  }
};
y.styles = [
  D,
  C`
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
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        outline: none;
        border-radius: var(--m3e-card-border-radius, 28px);
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
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
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
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        align-items: flex-end;
        z-index: 10;
      }

      .mode-sheet {
        width: 100%;
        max-height: 78%;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
    `
];
x([
  M({ attribute: !1 })
], y.prototype, "hass", 2);
x([
  f()
], y.prototype, "_config", 2);
x([
  f()
], y.prototype, "_pressed", 2);
x([
  f()
], y.prototype, "_popupOpen", 2);
x([
  f()
], y.prototype, "_dialDragging", 2);
x([
  f()
], y.prototype, "_dialTemp", 2);
x([
  f()
], y.prototype, "_activeSheet", 2);
x([
  f()
], y.prototype, "_volDragging", 2);
x([
  f()
], y.prototype, "_volPct", 2);
x([
  f()
], y.prototype, "_historyPoints", 2);
x([
  f()
], y.prototype, "_historyLoading", 2);
x([
  f()
], y.prototype, "_historyEntityId", 2);
x([
  f()
], y.prototype, "_historyHoverIdx", 2);
x([
  P("dialog.status-dialog")
], y.prototype, "_dialogEl", 2);
x([
  P(".status-tile")
], y.prototype, "_tileEl", 2);
x([
  P(".dialog-surface")
], y.prototype, "_dialogSurfaceEl", 2);
x([
  f()
], y.prototype, "_relativeTick", 2);
y = x([
  E("m3e-status-card")
], y);
var zi = Object.defineProperty, Di = Object.getOwnPropertyDescriptor, R = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Di(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (s ? a(t, i, r) : a(r)) || r);
  return s && r && zi(t, i, r), r;
};
const Hi = 420;
let O = class extends $ {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._onTilePointerDown = (e) => {
      this._isUnavailable || e.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, Hi));
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
            { name: "label_on", selector: { text: {} } },
            { name: "label_off", selector: { text: {} } }
          ]
        },
        {
          name: "hold_action",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "popup", label: "Apri popup Material 3 Expressive" },
                { value: "more-info", label: "Schermata nativa Home Assistant" },
                { value: "navigate", label: "Apri percorso / Bubble Card (#hash) / Browser Mod" },
                { value: "none", label: "Nessuna azione" }
              ]
            }
          }
        },
        { name: "navigation_path", selector: { text: {} } }
      ],
      computeLabel: (e) => ({
        entity: "Entità (switch, presa, input_boolean…)",
        name: "Nome personalizzato",
        card_style: "Design della pillola (Material 3)",
        icon_on: "Icona acceso (vuoto = standard Google Home)",
        icon_off: "Icona spento (vuoto = standard Google Home)",
        label_on: "Testo acceso (default: On)",
        label_off: "Testo spento (default: Off)",
        hold_action: "Azione pressione prolungata (Hold)",
        navigation_path: "Percorso / #popup Bubble Card / script o browser_mod"
      })[e.name] ?? e.name
    };
  }
  setConfig(e) {
    if (!e || !e.entity)
      throw new Error("m3e-toggle-card: you must define an entity");
    this._config = {
      hold_action: "popup",
      ...e
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
    window.getSelection()?.removeAllRanges();
    const e = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const t = this._dialogEl, i = this._dialogSurfaceEl;
    if (t && (t.open || t.showModal(), i && e)) {
      const s = i.getBoundingClientRect(), r = e.left + e.width / 2 - (s.left + s.width / 2), o = e.top + e.height / 2 - (s.top + s.height / 2), a = Math.max(0.28, e.width / s.width), n = Math.max(0.16, e.height / s.height);
      i.animate(
        [
          {
            transform: `translate(${r}px, ${o}px) scale(${a}, ${n})`,
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
  _handleHoldAction() {
    if (!this._config) return;
    const e = this._config.hold_action ?? "popup";
    if (e !== "none") {
      if (window.getSelection()?.removeAllRanges(), e === "navigate") {
        ve(this, this.hass, this._config.navigation_path);
        return;
      }
      if (e === "more-info") {
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
  _renderIcon(e) {
    return e && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${e}></ha-icon>` : Xe(this._entity, this._isOn);
  }
  _getPowerSiblings() {
    if (!this.hass?.entities || !this._config) return [];
    const e = this._config.entity, t = this.hass.entities[e]?.device_id;
    if (!t) return [];
    const i = ["power", "energy", "current", "voltage"], s = [];
    for (const [r, o] of Object.entries(this.hass.entities)) {
      if (r === e || o.device_id !== t || !r.startsWith("sensor.")) continue;
      const a = this.hass.states[r];
      if (!a || a.state === "unavailable" || a.state === "unknown") continue;
      const n = String(a.attributes.device_class ?? "");
      i.includes(n) && s.push(a);
    }
    return s.sort(
      (r, o) => i.indexOf(String(r.attributes.device_class ?? "")) - i.indexOf(String(o.attributes.device_class ?? ""))
    ), s;
  }
  _cleanSiblingLabel(e) {
    const t = (e.attributes.friendly_name || "").trim(), i = this.hass?.entities?.[e.entity_id]?.device_id, s = i ? this.hass?.devices?.[i] : void 0;
    for (const r of [
      s?.name_by_user,
      s?.name,
      this._config?.name,
      this._entity?.attributes.friendly_name
    ]) {
      const o = r?.trim();
      if (o && t.length > o.length && t.toLowerCase().startsWith(o.toLowerCase())) {
        const a = t.slice(o.length).replace(/^[\s\-–—:]+/, "").trim();
        if (a) return a.charAt(0).toUpperCase() + a.slice(1);
      }
    }
    return t || String(e.attributes.device_class ?? "Sensor");
  }
  render() {
    if (!this._config) return h;
    const e = this._entity, t = this._config.name || e?.attributes.friendly_name || this._config.entity, i = this._isOn, s = i ? this._config.icon_on?.trim() || void 0 : this._config.icon_off?.trim() || this._config.icon_on?.trim() || void 0, r = this._isUnavailable ? "Offline" : i ? this._config.label_on || "On" : this._config.label_off || "Off", o = `style-${this._config.card_style ?? "default"}`, a = this._popupOpen ? qe(e?.last_changed) : null, n = this._popupOpen ? this._getPowerSiblings() : [];
    return l`
      <ha-card
        class="toggle-tile ${o} ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="switch"
        tabindex="0"
        aria-checked=${String(i)}
        aria-label="${t}, ${r}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${(c) => {
      c.preventDefault(), this._handleHoldAction();
    }}
        @keydown=${(c) => {
      c.key === " " || c.key === "Enter" ? (c.preventDefault(), this._toggle()) : (c.key === "o" || c.key === "O") && (c.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${t}</span>
            <span class="tile-subtitle">${r}</span>
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
        class="toggle-dialog"
        @click=${(c) => {
      c.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(c) => {
      c.preventDefault(), this.closePopup();
    }}
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
                    <span class="dialog-title">${t}</span>
                    ${a ? l`<span class="dialog-last-changed">${a}</span>` : h}
                  </div>
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
                    @keydown=${(c) => {
      (c.key === " " || c.key === "Enter") && (c.preventDefault(), this._toggle());
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

                ${n.length > 0 ? l`
                      <div class="telemetry-stack">
                        ${n.map(
      (c) => l`
                            <div class="info-pill">
                              <span class="info-pill-left">
                                ${typeof customElements < "u" && customElements.get("ha-state-icon") ? l`<ha-state-icon
                                      class="mini-ha-icon"
                                      .hass=${this.hass}
                                      .stateObj=${c}
                                    ></ha-state-icon>` : h}
                                <span>${this._cleanSiblingLabel(c)}</span>
                              </span>
                              <span class="info-pill-val">
                                ${c.state}${c.attributes.unit_of_measurement ?? ""}
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
O.styles = [
  D,
  C`
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
        border-radius: var(--m3e-card-border-radius, 28px);
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
        height: 100%;
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
        max-width: min(420px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.toggle-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
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
R([
  M({ attribute: !1 })
], O.prototype, "hass", 2);
R([
  f()
], O.prototype, "_config", 2);
R([
  f()
], O.prototype, "_pressed", 2);
R([
  f()
], O.prototype, "_popupOpen", 2);
R([
  P("dialog.toggle-dialog")
], O.prototype, "_dialogEl", 2);
R([
  P(".toggle-tile")
], O.prototype, "_tileEl", 2);
R([
  P(".dialog-surface")
], O.prototype, "_dialogSurfaceEl", 2);
O = R([
  E("m3e-toggle-card")
], O);
function H(e) {
  window.customCards = window.customCards || [], window.customCards.some((t) => t.type === e.type) || window.customCards.push(e);
}
H({
  type: "m3e-light-card",
  name: "M3 Expressive Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You Utilities integration.",
  preview: !0
});
H({
  type: "m3e-status-card",
  name: "M3 Expressive Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular expanded popups (Sensor, Climate, Remote, Media).",
  preview: !0
});
H({
  type: "m3e-toggle-card",
  name: "M3 Expressive Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0
});
H({
  type: "m3e-scene-card",
  name: "M3 Expressive Scene / Button Card",
  description: "Google Home–style one-tap scene, script, or button tile with animated activation feedback.",
  preview: !0
});
H({
  type: "m3e-light-control-card",
  name: "M3 Expressive Light Control (All on / All off)",
  description: "Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.",
  preview: !0
});
H({
  type: "m3e-light-group-card",
  name: "M3 Expressive Light Group Card",
  description: "Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.",
  preview: !0
});
H({
  type: "m3e-assist-card",
  name: "M3 Expressive Assist & Mode Bar",
  description: 'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector in Material 3 Expressive.',
  preview: !0
});
H({
  type: "m3e-glance-card",
  name: "M3 Expressive At a Glance Strip",
  description: "Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.",
  preview: !0
});
H({
  type: "m3e-people-card",
  name: "M3 Expressive People Glance",
  description: "At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.",
  preview: !0
});
export {
  I as M3EAssistCard,
  ie as M3EGlanceCard,
  w as M3ELightCard,
  se as M3ELightControlCard,
  z as M3ELightGroupCard,
  oe as M3EPeopleCard,
  F as M3ESceneCard,
  y as M3EStatusCard,
  O as M3EToggleCard
};
