/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xe = globalThis, Di = Xe.ShadowRoot && (Xe.ShadyCSS === void 0 || Xe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ii = Symbol(), Gi = /* @__PURE__ */ new WeakMap();
let Ts = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== Ii) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Di && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = Gi.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Gi.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const da = (t) => new Ts(typeof t == "string" ? t : t + "", void 0, Ii), R = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, a, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[r + 1], t[0]);
  return new Ts(i, t, Ii);
}, pa = (t, e) => {
  if (Di) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), a = Xe.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, t.appendChild(s);
  }
}, Ki = Di ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return da(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ha, defineProperty: ua, getOwnPropertyDescriptor: ma, getOwnPropertyNames: fa, getOwnPropertySymbols: ga, getPrototypeOf: _a } = Object, oi = globalThis, qi = oi.trustedTypes, va = qi ? qi.emptyScript : "", ba = oi.reactiveElementPolyfillSupport, Te = (t, e) => t, Qe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? va : null;
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
} }, zi = (t, e) => !ha(t, e), Xi = { attribute: !0, type: String, converter: Qe, reflect: !1, useDefault: !1, hasChanged: zi };
Symbol.metadata ??= Symbol("metadata"), oi.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let te = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Xi) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(e, s, i);
      a !== void 0 && ua(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: a, set: r } = ma(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: a, set(o) {
      const n = a?.call(this);
      r?.call(this, o), this.requestUpdate(e, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Xi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Te("elementProperties"))) return;
    const e = _a(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Te("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Te("properties"))) {
      const i = this.properties, s = [...fa(i), ...ga(i)];
      for (const a of s) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, a] of i) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const a = this._$Eu(i, s);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const a of s) i.unshift(Ki(a));
    } else e !== void 0 && i.push(Ki(e));
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
    return pa(e, this.constructor.elementStyles), e;
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
    const s = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, s);
    if (a !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : Qe).toAttribute(i, s.type);
      this._$Em = e, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, a = s._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const r = s.getPropertyOptions(a), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Qe;
      this._$Em = a;
      const n = o.fromAttribute(i, r.type);
      this[a] = n ?? this._$Ej?.get(a) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, a = !1, r) {
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (r = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? zi)(r, i) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: a, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), r !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, r] of s) {
        const { wrapped: o } = r, n = this[a];
        o !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, r, n);
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
te.elementStyles = [], te.shadowRootOptions = { mode: "open" }, te[Te("elementProperties")] = /* @__PURE__ */ new Map(), te[Te("finalized")] = /* @__PURE__ */ new Map(), ba?.({ ReactiveElement: te }), (oi.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hi = globalThis, Ji = (t) => t, ti = Hi.trustedTypes, Qi = ti ? ti.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, As = "$lit$", Ct = `lit$${Math.random().toFixed(9).slice(2)}$`, Os = "?" + Ct, ya = `<${Os}>`, jt = document, Ie = () => jt.createComment(""), ze = (t) => t === null || typeof t != "object" && typeof t != "function", Ni = Array.isArray, xa = (t) => Ni(t) || typeof t?.[Symbol.iterator] == "function", vi = `[ 	
\f\r]`, $e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ts = /-->/g, es = />/g, Dt = RegExp(`>|${vi}(?:([^\\s"'>=/]+)(${vi}*=${vi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), is = /'/g, ss = /"/g, Ls = /^(?:script|style|textarea|title)$/i, Ds = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Ds(1), X = Ds(2), se = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), as = /* @__PURE__ */ new WeakMap(), Ut = jt.createTreeWalker(jt, 129);
function Is(t, e) {
  if (!Ni(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qi !== void 0 ? Qi.createHTML(e) : e;
}
const wa = (t, e) => {
  const i = t.length - 1, s = [];
  let a, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = $e;
  for (let n = 0; n < i; n++) {
    const l = t[n];
    let p, c, h = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, c = o.exec(l), c !== null); ) f = o.lastIndex, o === $e ? c[1] === "!--" ? o = ts : c[1] !== void 0 ? o = es : c[2] !== void 0 ? (Ls.test(c[2]) && (a = RegExp("</" + c[2], "g")), o = Dt) : c[3] !== void 0 && (o = Dt) : o === Dt ? c[0] === ">" ? (o = a ?? $e, h = -1) : c[1] === void 0 ? h = -2 : (h = o.lastIndex - c[2].length, p = c[1], o = c[3] === void 0 ? Dt : c[3] === '"' ? ss : is) : o === ss || o === is ? o = Dt : o === ts || o === es ? o = $e : (o = Dt, a = void 0);
    const m = o === Dt && t[n + 1].startsWith("/>") ? " " : "";
    r += o === $e ? l + ya : h >= 0 ? (s.push(p), l.slice(0, h) + As + l.slice(h) + Ct + m) : l + Ct + (h === -2 ? n : m);
  }
  return [Is(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class He {
  constructor({ strings: e, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let r = 0, o = 0;
    const n = e.length - 1, l = this.parts, [p, c] = wa(e, i);
    if (this.el = He.createElement(p, s), Ut.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = Ut.nextNode()) !== null && l.length < n; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(As)) {
          const f = c[o++], m = a.getAttribute(h).split(Ct), u = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: u[2], strings: m, ctor: u[1] === "." ? Ca : u[1] === "?" ? ka : u[1] === "@" ? Sa : ni }), a.removeAttribute(h);
        } else h.startsWith(Ct) && (l.push({ type: 6, index: r }), a.removeAttribute(h));
        if (Ls.test(a.tagName)) {
          const h = a.textContent.split(Ct), f = h.length - 1;
          if (f > 0) {
            a.textContent = ti ? ti.emptyScript : "";
            for (let m = 0; m < f; m++) a.append(h[m], Ie()), Ut.nextNode(), l.push({ type: 2, index: ++r });
            a.append(h[f], Ie());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Os) l.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(Ct, h + 1)) !== -1; ) l.push({ type: 7, index: r }), h += Ct.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const s = jt.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ae(t, e, i = t, s) {
  if (e === se) return e;
  let a = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const r = ze(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(t), a._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = a : i._$Cl = a), a !== void 0 && (e = ae(t, a._$AS(t, e.values), a, s)), e;
}
class $a {
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
    const { el: { content: i }, parts: s } = this._$AD, a = (e?.creationScope ?? jt).importNode(i, !0);
    Ut.currentNode = a;
    let r = Ut.nextNode(), o = 0, n = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new Ue(r, r.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (p = new Ea(r, this, e)), this._$AV.push(p), l = s[++n];
      }
      o !== l?.index && (r = Ut.nextNode(), o++);
    }
    return Ut.currentNode = jt, a;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class Ue {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, a) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = a?.isConnected ?? !0;
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
    e = ae(this, e, i), ze(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== se && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xa(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && ze(this._$AH) ? this._$AA.nextSibling.data = e : this.T(jt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = He.createElement(Is(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const r = new $a(a, this), o = r.u(this.options);
      r.p(i), this.T(o), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = as.get(e.strings);
    return i === void 0 && as.set(e.strings, i = new He(e)), i;
  }
  k(e) {
    Ni(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const r of e) a === i.length ? i.push(s = new Ue(this.O(Ie()), this.O(Ie()), this, this.options)) : s = i[a], s._$AI(r), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = Ji(e).nextSibling;
      Ji(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ni {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, a, r) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(e, i = this, s, a) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) e = ae(this, e, i, 0), o = !ze(e) || e !== this._$AH && e !== se, o && (this._$AH = e);
    else {
      const n = e;
      let l, p;
      for (e = r[0], l = 0; l < r.length - 1; l++) p = ae(this, n[s + l], i, l), p === se && (p = this._$AH[l]), o ||= !ze(p) || p !== this._$AH[l], p === g ? e = g : e !== g && (e += (p ?? "") + r[l + 1]), this._$AH[l] = p;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ca extends ni {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class ka extends ni {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Sa extends ni {
  constructor(e, i, s, a, r) {
    super(e, i, s, a, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = ae(this, e, i, 0) ?? g) === se) return;
    const s = this._$AH, a = e === g && s !== g || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== g && (s === g || a);
    a && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ea {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ae(this, e);
  }
}
const Ma = Hi.litHtmlPolyfillSupport;
Ma?.(He, Ue), (Hi.litHtmlVersions ??= []).push("3.3.3");
const Pa = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const r = i?.renderBefore ?? null;
    s._$litPart$ = a = new Ue(e.insertBefore(Ie(), r), r, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ri = globalThis;
let N = class extends te {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Pa(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return se;
  }
};
N._$litElement$ = !0, N.finalized = !0, Ri.litElementHydrateSupport?.({ LitElement: N });
const Ta = Ri.litElementPolyfillSupport;
Ta?.({ LitElement: N });
(Ri.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Aa = { attribute: !0, type: String, converter: Qe, reflect: !1, hasChanged: zi }, Oa = (t = Aa, e, i) => {
  const { kind: s, metadata: a } = i;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(i.name, t), s === "accessor") {
    const { name: o } = i;
    return { set(n) {
      const l = e.get.call(this);
      e.set.call(this, n), this.requestUpdate(o, l, t, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(o, void 0, t, n), n;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(n) {
      const l = this[o];
      e.call(this, n), this.requestUpdate(o, l, t, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function O(t) {
  return (e, i) => typeof i == "object" ? Oa(t, e, i) : ((s, a, r) => {
    const o = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return O({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const La = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function z(t, e) {
  return (i, s, a) => {
    const r = (o) => o.renderRoot?.querySelector(t) ?? null;
    return La(i, s, { get() {
      return r(this);
    } });
  };
}
const V = R`
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
`, zs = R`
  dialog.m3e-dialog {
    margin: auto;
    padding: 0;
    border: 0;
    background: transparent;
    overflow: visible;
    width: min(var(--m3e-dialog-max-width, 440px), calc(100vw - 24px));
    max-width: min(var(--m3e-dialog-max-width, 440px), calc(100vw - 24px));
    max-height: calc(100dvh - 24px);
    overscroll-behavior: contain;
    touch-action: none;
    pointer-events: auto;
    color: var(--md-sys-color-on-surface, #e3e2e6);
  }

  dialog.m3e-dialog::backdrop {
    background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 56%, transparent);
  }

  .m3e-dialog-surface {
    position: relative;
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
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
    touch-action: pan-y;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
  }

  @media (max-width: 600px) {
    dialog.m3e-dialog {
      position: fixed;
      inset: auto 0 0 0;
      margin: auto 0 0 0;
      width: 100vw;
      max-width: 100vw;
      max-height: var(--m3e-dialog-mobile-max-height, 92dvh);
      border-radius: 28px 28px 0 0;
      overflow: hidden;
    }

    .m3e-dialog-surface {
      border-radius: 28px 28px 0 0;
      max-height: var(--m3e-dialog-mobile-max-height, 92dvh);
      box-shadow: none;
      padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
    }
  }
`;
function At(t, e) {
  if (!e || !e.open) return;
  const i = t.composedPath();
  for (const s of i) {
    if (s === e) break;
    if (!(s instanceof HTMLElement)) continue;
    const a = window.getComputedStyle(s), r = (a.overflowY === "auto" || a.overflowY === "scroll") && s.scrollHeight > s.clientHeight + 1, o = (a.overflowX === "auto" || a.overflowX === "scroll") && s.scrollWidth > s.clientWidth + 1;
    if (r || o)
      return;
  }
  t.cancelable && t.preventDefault();
}
const rs = "cubic-bezier(0.05, 0.7, 0.1, 1.0)", Da = "cubic-bezier(0.3, 0.0, 0.8, 0.15)", Bi = "__m3eDialogId", Vt = [];
let Ia = 0, Ae = 0, Zt = null, os = !1;
function za() {
  Zt !== null && window.clearTimeout(Zt), Zt = window.setTimeout(() => {
    Ae = 0, Zt = null;
  }, 500);
}
function Fi() {
  try {
    const e = window.history.state?.[Bi];
    return typeof e == "number" ? e : void 0;
  } catch {
    return;
  }
}
function Hs(t) {
  try {
    if (Fi() !== t) return;
    const e = window.history.state;
    if (e && typeof e == "object") {
      const i = { ...e };
      delete i[Bi], window.history.replaceState(
        Object.keys(i).length > 0 ? i : null,
        "",
        window.location.href
      );
    } else
      window.history.replaceState(null, "", window.location.href);
  } catch {
  }
}
function Ui(t) {
  const e = Vt.findIndex((s) => s.dialog === t);
  if (e === -1) return;
  const [i] = Vt.splice(e, 1);
  return t.removeEventListener("close", i.closeListener), i;
}
function Ha(t) {
  if (!t.open) return !1;
  try {
    return t.matches(":modal");
  } catch {
    return t.open;
  }
}
function Na() {
  os || typeof window > "u" || (os = !0, window.addEventListener(
    "popstate",
    (t) => {
      if (Ae > 0) {
        Ae--, Ae <= 0 && Zt !== null && (window.clearTimeout(Zt), Zt = null), t.stopImmediatePropagation(), t.stopPropagation();
        return;
      }
      const e = Vt[Vt.length - 1];
      if (!e) return;
      const i = Fi();
      if (e.pushedHistory && i !== e.id) {
        e.historyPopped = !0, t.stopImmediatePropagation(), t.stopPropagation(), e.onRequestClose();
        return;
      }
      const s = window.location.pathname, a = Vt.filter((r) => r.originPath !== s);
      for (const r of a)
        ut(r.dialog, r.surface, r.onForceReset);
    },
    !0
  ), window.addEventListener(
    "location-changed",
    () => {
      const t = window.location.pathname, e = Vt.filter((i) => i.originPath !== t);
      for (const i of e)
        ut(i.dialog, i.surface, i.onForceReset);
    },
    !0
  ));
}
function Ns(t, e) {
  if (!t) return;
  t.closest("dialog")?.classList.remove("is-closing"), t.style.pointerEvents = "";
  for (const a of t.getAnimations())
    a.cancel();
  const s = window.matchMedia("(max-width: 600px)").matches;
  if (e && !s) {
    const a = t.getBoundingClientRect();
    if (a.width > 0 && a.height > 0) {
      const r = e.left + e.width / 2 - (a.left + a.width / 2), o = e.top + e.height / 2 - (a.top + a.height / 2), n = Math.max(0.35, Math.min(1, e.width / a.width)), l = Math.max(0.22, Math.min(1, e.height / a.height));
      t.animate(
        [
          {
            transform: `translate3d(${r}px, ${o}px, 0) scale(${n}, ${l})`,
            borderRadius: "28px",
            opacity: 0.65
          },
          {
            transform: "translate3d(0, 0, 0) scale(1, 1)",
            borderRadius: "32px",
            opacity: 1
          }
        ],
        {
          duration: 320,
          easing: rs
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
      { transform: "translate3d(0, 12px, 0) scale(0.94)", opacity: 0 },
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 }
    ],
    {
      duration: s ? 300 : 260,
      easing: rs
    }
  );
}
function Rs(t, e, i) {
  if (!t || !t.open) {
    t?.removeAttribute("open"), i();
    return;
  }
  if (t.classList.contains("is-closing"))
    return;
  if (!e) {
    try {
      t.close();
    } catch {
    }
    t.removeAttribute("open"), i();
    return;
  }
  t.classList.add("is-closing"), e.style.pointerEvents = "none";
  for (const n of e.getAnimations())
    n.cancel();
  const s = window.matchMedia("(max-width: 600px)").matches, a = e.animate(
    s ? [
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
      { transform: "translate3d(0, 100%, 0)", opacity: 0.92 }
    ] : [
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
      { transform: "translate3d(0, 10px, 0) scale(0.94)", opacity: 0 }
    ],
    {
      duration: s ? 220 : 190,
      easing: Da,
      fill: "forwards"
    }
  );
  let r = !1;
  const o = () => {
    if (!r) {
      if (r = !0, t.open)
        try {
          t.close();
        } catch {
        }
      t.removeAttribute("open"), t.classList.remove("is-closing"), e.style.pointerEvents = "", a.cancel(), i();
    }
  };
  a.onfinish = o, a.oncancel = o;
}
function Kt(t, e, i) {
  if (!t) return;
  if (Na(), Ui(t), t.hasAttribute("open") && !Ha(t)) {
    try {
      t.close();
    } catch {
    }
    t.removeAttribute("open");
  }
  t.open || t.showModal();
  const s = ++Ia, a = i.pushHistory !== !1;
  let r = !1;
  if (a)
    try {
      const l = window.history.state && typeof window.history.state == "object" ? window.history.state : {};
      window.history.pushState({ ...l, [Bi]: s }, "", window.location.href), r = !0;
    } catch {
      r = !1;
    }
  const o = () => {
    ut(t, e, i.onForceReset);
  }, n = {
    id: s,
    dialog: t,
    surface: e ?? null,
    originPath: window.location.pathname,
    pushedHistory: r,
    historyPopped: !1,
    onRequestClose: i.onRequestClose,
    onForceReset: i.onForceReset,
    closeListener: o
  };
  Vt.push(n), t.addEventListener("close", o), Ns(e, i.originRect);
}
function qt(t, e, i) {
  const s = t ? Ui(t) : void 0;
  if (s?.pushedHistory && !s.historyPopped && Fi() === s.id) {
    Ae++, za();
    try {
      window.history.back();
    } catch {
      Hs(s.id);
    }
  }
  Rs(t, e, i);
}
function ut(t, e, i) {
  const s = t ? Ui(t) : void 0;
  if (s?.pushedHistory && !s.historyPopped && Hs(s.id), e) {
    for (const a of e.getAnimations())
      a.cancel();
    e.style.pointerEvents = "";
  }
  if (t) {
    if (t.classList.remove("is-closing"), t.open)
      try {
        t.close();
      } catch {
      }
    t.removeAttribute("open");
  }
  i?.();
}
var Ra = Object.defineProperty, Ba = Object.getOwnPropertyDescriptor, Xt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ba(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Ra(e, i, a), a;
};
let xt = class extends N {
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
  disconnectedCallback() {
    super.disconnectedCallback(), ut(this._dialogEl, this._dialogSurfaceEl, () => {
      this._selectorOpen = !1;
    });
  }
  async openModeSelector(t) {
    if (t?.stopPropagation(), !this._modeEntity || this._options.length === 0) return;
    if (this._selectorOpen && this._dialogEl?.open) {
      let s = !0;
      try {
        s = this._dialogEl.matches(":modal");
      } catch {
      }
      if (s) return;
      this._selectorOpen = !1;
    }
    window.getSelection()?.removeAllRanges(), this._selectorOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    if (!e) {
      this._selectorOpen = !1;
      return;
    }
    Kt(e, i, {
      onRequestClose: () => this.closeModeSelector(),
      onForceReset: () => {
        this._selectorOpen = !1;
      }
    });
  }
  closeModeSelector() {
    qt(this._dialogEl, this._dialogSurfaceEl, () => {
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
    return i.includes("away") || i.includes("fuori") || i.includes("assent") || i.includes("out") || i.includes("vacanz") ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3 2 9v12h7v-2H4v-9l6-4.5L15 9.25V11h2V8.25L10 3Zm7 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 6c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z"
          />
        </svg>
      ` : i.includes("night") || i.includes("nott") || i.includes("sleep") ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.3 4.9a7 7 0 0 0 6.8 9.2A8 8 0 1 1 12.3 4.9Z"
          />
        </svg>
      ` : e ? d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm0 5.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm4.5 9.5h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V18Z"
            />
          </svg>
        ` : d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm7 16H5v-8l7-5.44L19 11v8Zm-7-9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7.5h8v-.5c0-1.33-2.67-2-4-2s-4 .67-4 2v.5Z"
            />
          </svg>
        `;
  }
  render() {
    if (!this._config) return g;
    const t = this._modeEntity, e = t?.state ?? "", i = !!(t && this._options.length > 0), s = this._config.placeholder?.trim() || "Chiedi a Home Assistant";
    return d`
      <ha-card
        class="assist-bar ${this._pressed ? "is-pressed" : ""}"
        role="button"
        tabindex="0"
        aria-label=${s}
        @pointerdown=${(a) => {
      a.button === 0 && (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._openAssist()}
        @keydown=${(a) => {
      (a.key === "Enter" || a.key === " ") && (a.preventDefault(), this._openAssist());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>

        <div class="bar-inner">
          ${i ? d`
                <button
                  type="button"
                  class="mode-dot-btn"
                  title=${`${t.attributes.friendly_name ?? "Modalità"}: ${e}`}
                  aria-label=${`Cambia modalità (${e})`}
                  @pointerdown=${(a) => a.stopPropagation()}
                  @click=${(a) => this.openModeSelector(a)}
                >
                  ${this._renderOptionIcon(e, !0)}
                </button>
              ` : d`
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
        @click=${(a) => {
      a.target === this._dialogEl && this.closeModeSelector();
    }}
        @cancel=${(a) => {
      a.preventDefault(), this.closeModeSelector();
    }}
        @touchmove=${(a) => At(a, this._dialogEl)}
      >
        ${this._selectorOpen && i ? d`
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
                  ${this._options.map((a) => {
      const r = a === e;
      return d`
                      <button
                        type="button"
                        class="mode-row ${r ? "is-selected" : ""}"
                        role="radio"
                        aria-checked=${String(r)}
                        @click=${() => this._selectOption(a)}
                      >
                        <span class="mode-row-icon">
                          ${this._renderOptionIcon(a, r)}
                        </span>
                        <span class="mode-row-label">${a}</span>
                        <span class="m3-radio ${r ? "checked" : ""}" aria-hidden="true">
                          <span class="m3-radio-dot"></span>
                        </span>
                      </button>
                    `;
    })}
                </div>
              </div>
            ` : g}
      </dialog>
    `;
  }
};
xt.styles = [
  V,
  R`
      :host {
        display: block;
        width: 100%;
        min-width: min(260px, 100%);
        flex: 1 1 100%;
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
Xt([
  O({ attribute: !1 })
], xt.prototype, "hass", 2);
Xt([
  b()
], xt.prototype, "_config", 2);
Xt([
  b()
], xt.prototype, "_pressed", 2);
Xt([
  b()
], xt.prototype, "_selectorOpen", 2);
Xt([
  z("dialog.mode-dialog")
], xt.prototype, "_dialogEl", 2);
Xt([
  z(".dialog-surface")
], xt.prototype, "_dialogSurfaceEl", 2);
xt = Xt([
  B("m3e-assist-card")
], xt);
function Yt(t, e, i) {
  const s = t?.entity_id ?? "", a = s.split(".")[0], r = String(t?.attributes.device_class ?? "").toLowerCase(), o = String(t?.state ?? "").toLowerCase();
  return r === "outlet" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3-9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : a === "light" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : a === "switch" || a === "input_boolean" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4 14H9V7h6v10Zm-4-8v3h2V9h-2Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 5v3h2v-3h-2Z"/></svg>` : r === "door" || r === "opening" || r === "garage_door" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2Zm-6-6h-2v-2h2v2Zm4 6h-2V5h2v14Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2ZM7 19V5h10v14H7Zm8-8h-2v2h2v-2Z"/></svg>` : r === "window" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h14v-6H5Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h6v-6H5Zm8 0v6h6v-6h-6Z"/></svg>` : a === "lock" || r === "lock" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6a5 5 0 0 0-9.58-2l1.84.78A3 3 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-6 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Zm-6-3a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"/></svg>` : a === "fan" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 9.8C12 6.5 14.5 4 15.8 5.4c1 1.1-.5 3.4-2.1 4.8M14.2 12c3.3 0 5.8 2.5 4.4 3.8-1.1 1-3.4-.5-4.8-2.1M12 14.2c0 3.3-2.5 5.8-3.8 4.4-1-1.1.5-3.4 2.1-4.8M9.8 12c-3.3 0-5.8-2.5-4.4-3.8 1.1-1 3.4.5 4.8 2.1"/></svg>` : a === "climate" || i === "climate" ? o === "heat" || o === "heating" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" fill="none"/></svg>` : o === "cool" || o === "cooling" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : r === "tv" || a === "remote" || i === "remote" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : a === "media_player" || i === "media" ? e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : a === "weather" ? o === "sunny" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>` : o === "clear-night" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M20.2 14.4A8.2 8.2 0 0 1 9.6 3.8a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>` : o === "rainy" || o === "pouring" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM8.5 18.2l-.9 2.3M12.5 18.2l-.9 2.3M16.5 18.2l-.9 2.3"/></svg>` : o === "lightning" || o === "lightning-rainy" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h2.4M15.4 15.5h1.8a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM13 12.5l-2 4.2h2.6l-1.6 3.8"/></svg>` : o === "snowy" || o === "snowy-rainy" || o === "hail" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3Z"/><circle cx="8.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="12.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="16.5" cy="19.2" r="1.1" fill="currentColor"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 18h10.4a3.8 3.8 0 0 0 .6-7.55A5.6 5.6 0 0 0 7.1 9.1 4.4 4.4 0 0 0 6.8 18Z"/></svg>` : r === "aqi" || r === "pm25" || r === "pm10" || r === "carbon_dioxide" || r === "volatile_organic_compounds" || s.includes("aqi") || s.includes("air_quality") ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 12.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 16.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8"/></svg>` : r === "temperature" || s.includes("temp") ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : r === "humidity" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : r === "power" || r === "energy" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.19-.35L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21Z"/></svg>` : r === "illuminance" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : r === "battery" ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : e ? d`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.8" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>` : d`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5.8 7.8a6.8 6.8 0 0 0 0 8.4M18.2 7.8a6.8 6.8 0 0 1 0 8.4"/></svg>`;
}
function lt(t) {
  const e = (t || "").trim();
  return e ? e.startsWith("#") || e.startsWith("/") ? e.toLowerCase() : `#${e.toLowerCase()}` : "";
}
function Fa(t) {
  const e = lt(t);
  return e ? (window.__m3ePopupRegistry = window.__m3ePopupRegistry || /* @__PURE__ */ new Set(), window.__m3ePopupRegistry.add(e), e) : "";
}
function ns(t) {
  !t || !window.__m3ePopupRegistry || window.__m3ePopupRegistry.delete(t);
}
function re(t, e, i) {
  const s = (i || "").trim();
  if (!s) return;
  const a = lt(s);
  if (a && window.__m3ePopupRegistry?.has(a)) {
    if (s.startsWith("#")) {
      const n = window.location.href;
      window.history.pushState(null, "", s), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: n, newURL: window.location.href }));
    }
    window.dispatchEvent(new CustomEvent("m3e-popup-open", { detail: { target: a } }));
    return;
  }
  if (s.startsWith("#")) {
    const n = window.location.href;
    window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: n, newURL: window.location.href })), window.dispatchEvent(new CustomEvent("m3e-popup-open", { detail: { target: a } }));
    return;
  }
  if (s.startsWith("script.") && e) {
    e.callService("script", "turn_on", { entity_id: s });
    return;
  }
  const r = s.startsWith("service:") ? s.slice(8).trim() : s;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(r) && !r.startsWith("/") && e) {
    const [n, l] = r.split(".");
    e.callService(n, l, {});
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
var Ua = Object.defineProperty, Va = Object.getOwnPropertyDescriptor, li = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Va(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Ua(e, i, a), a;
};
let oe = class extends N {
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
    const s = [...this._config.items ?? []], a = t + e;
    a < 0 || a >= s.length || ([s[t], s[a]] = [s[a], s[t]], this._expandedIndex === t ? this._expandedIndex = a : this._expandedIndex === a && (this._expandedIndex = t), this._emitConfig({ ...this._config, items: s }));
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
    if (!this.hass || !this._config) return g;
    const t = this._config.items ?? [];
    return d`
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
      const s = this._expandedIndex === i, a = {
        entity: e.entity ?? "",
        attribute: e.attribute ?? "",
        secondary_attribute: e.secondary_attribute ?? "",
        name: e.name ?? "",
        unit: e.unit ?? "",
        icon: e.icon ?? "",
        tap_action: e.tap_action ?? "more-info",
        navigation_path: e.navigation_path ?? ""
      };
      return d`
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
                      @click=${(r) => this._moveItem(i, -1, r)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === t.length - 1}
                      @click=${(r) => this._moveItem(i, 1, r)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(r) => this._removeItem(i, r)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                ${s ? d`
                      <div class="item-body">
                        <ha-form
                          .hass=${this.hass}
                          .data=${a}
                          .schema=${this._buildItemSchema(e)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(r) => this._onItemChanged(i, r)}
                        ></ha-form>
                      </div>
                    ` : g}
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
oe.styles = R`
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
li([
  O({ attribute: !1 })
], oe.prototype, "hass", 2);
li([
  b()
], oe.prototype, "_config", 2);
li([
  b()
], oe.prototype, "_expandedIndex", 2);
oe = li([
  B("m3e-glance-card-editor")
], oe);
var Za = Object.defineProperty, Wa = Object.getOwnPropertyDescriptor, ci = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Wa(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Za(e, i, a), a;
};
const ja = /* @__PURE__ */ new Set([
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
let ne = class extends N {
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
    const e = t?.states ?? {}, i = Object.keys(e), s = [], a = i.find((n) => n.startsWith("weather."));
    a && s.push({ entity: a, unit: "°", tap_action: "more-info" });
    const r = i.find(
      (n) => n.startsWith("sensor.") && (e[n]?.attributes.device_class === "aqi" || e[n]?.attributes.device_class === "temperature" || n.includes("aqi"))
    );
    r && s.push({ entity: r, tap_action: "more-info" });
    const o = i.find(
      (n) => n.startsWith("sensor.") && e[n]?.attributes.device_class === "humidity" && n !== r
    );
    if (o && s.push({ entity: o, tap_action: "more-info" }), s.length === 0) {
      const n = i.find((l) => l.startsWith("sensor.") || l.startsWith("sun."));
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
    let s, a = "";
    if (t.attribute)
      s = e.attributes[t.attribute], t.attribute === "temperature" || t.attribute === "current_temperature" ? a = "°" : (t.attribute === "humidity" || t.attribute === "battery_level") && (a = "%");
    else if (i === "weather" && e.attributes.temperature !== void 0)
      s = e.attributes.temperature, a = "°";
    else {
      s = e.state;
      const n = e.attributes.unit_of_measurement;
      typeof n == "string" && n.trim() && (a = n.trim());
    }
    const r = this._formatRawValue(s);
    if (r === "—" || r === "Offline") return r;
    const o = t.unit !== void 0 ? t.unit : a;
    return o ? o === "°" || o === "%" || o === "°C" || o === "°F" ? `${r}${o}` : `${r} ${o}` : r;
  }
  _getSecondaryLabel(t, e) {
    const i = t.name || e?.attributes.friendly_name || t.entity || "Entità";
    if (t.secondary_attribute && e) {
      const s = e.attributes[t.secondary_attribute];
      if (s != null && String(s).trim() !== "") {
        const a = this._formatRawValue(s), r = a.charAt(0).toUpperCase() + a.slice(1);
        return `${i} • ${r}`;
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
        re(this, this.hass, t.navigation_path);
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
    if (!this._config) return g;
    const t = this._config.items ?? [], e = this._config.transparent !== !1, i = d`
      <div
        class="glance-strip ${e ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${t.length === 0 ? d`<div class="empty-hint">Aggiungi entità dalla configurazione della card</div>` : t.map((s) => {
      const a = s.entity ? this.hass?.states[s.entity] : void 0, r = !a || a.state === "unavailable" || a.state === "unknown", o = !r && ja.has(String(a.state ?? "").toLowerCase()), n = this._getPrimaryValue(s, a), l = this._getSecondaryLabel(s, a), p = (s.tap_action ?? "more-info") !== "none" && !!s.entity;
      return d`
                <button
                  type="button"
                  class="glance-item ${r ? "is-dimmed" : ""} ${p ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(s)}
                >
                  <span class="icon-circle" aria-hidden="true">
                    ${s.icon ? d`<ha-icon .icon=${s.icon}></ha-icon>` : Yt(a, o)}
                  </span>
                  <span class="text-col">
                    <span class="primary-value">${n}</span>
                    <span class="secondary-label">${l}</span>
                  </span>
                </button>
              `;
    })}
      </div>
    `;
    return e ? i : d`<ha-card>${i}</ha-card>`;
  }
};
ne.styles = [
  V,
  R`
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
ci([
  O({ attribute: !1 })
], ne.prototype, "hass", 2);
ci([
  b()
], ne.prototype, "_config", 2);
ci([
  z(".glance-strip")
], ne.prototype, "_stripEl", 2);
ne = ci([
  B("m3e-glance-card")
], ne);
const ls = {
  red: [244, 67, 54],
  pink: [233, 30, 99],
  purple: [156, 39, 176],
  "deep-purple": [103, 58, 183],
  indigo: [63, 81, 181],
  blue: [33, 150, 243],
  "light-blue": [3, 169, 244],
  cyan: [0, 188, 212],
  teal: [0, 150, 136],
  green: [76, 175, 80],
  "light-green": [139, 195, 74],
  lime: [205, 220, 57],
  yellow: [255, 235, 59],
  amber: [255, 193, 7],
  orange: [255, 152, 0],
  "deep-orange": [255, 87, 34],
  brown: [121, 85, 72],
  "light-grey": [189, 189, 189],
  grey: [158, 158, 158],
  "dark-grey": [97, 97, 97],
  "blue-grey": [96, 125, 139],
  black: [33, 33, 33],
  white: [245, 245, 245]
};
function ht(t, e, i) {
  return Math.max(e, Math.min(i, t));
}
function Ya(t) {
  if (!t) return null;
  if (Array.isArray(t) && t.length >= 3) {
    const e = Number(t[0]), i = Number(t[1]), s = Number(t[2]);
    return [e, i, s].every((a) => Number.isFinite(a)) ? [
      ht(Math.round(e), 0, 255),
      ht(Math.round(i), 0, 255),
      ht(Math.round(s), 0, 255)
    ] : null;
  }
  if (typeof t == "string") {
    const e = t.trim().toLowerCase();
    if (e in ls)
      return ls[e];
    const i = e.replace(/^#/, "");
    if (/^[0-9a-f]{6}$/.test(i))
      return [
        parseInt(i.slice(0, 2), 16),
        parseInt(i.slice(2, 4), 16),
        parseInt(i.slice(4, 6), 16)
      ];
    if (/^[0-9a-f]{3}$/.test(i))
      return [
        parseInt(i[0] + i[0], 16),
        parseInt(i[1] + i[1], 16),
        parseInt(i[2] + i[2], 16)
      ];
    const s = e.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (s)
      return [
        ht(Number(s[1]), 0, 255),
        ht(Number(s[2]), 0, 255),
        ht(Number(s[3]), 0, 255)
      ];
  }
  return null;
}
function Ga(t, e, i) {
  const s = t / 255, a = e / 255, r = i / 255, o = Math.max(s, a, r), n = Math.min(s, a, r), l = o - n, p = (o + n) / 2;
  if (l === 0) return [0, 0, p * 100];
  const c = l / (1 - Math.abs(2 * p - 1));
  let h = 0;
  return o === s ? h = (a - r) / l % 6 : o === a ? h = (r - s) / l + 2 : h = (s - a) / l + 4, h = Math.round(h * 60), h < 0 && (h += 360), [h, c * 100, p * 100];
}
function ei(t, e) {
  if (typeof t == "string") {
    const h = t.trim().toLowerCase();
    if (!h || h === "state" || h === "none")
      return null;
    if (h === "primary")
      return {
        container: "color-mix(in srgb, var(--md-sys-color-scrim, #000000) 28%, var(--md-sys-color-primary-container, #2e4379))",
        well: "color-mix(in srgb, var(--md-sys-color-scrim, #000000) 44%, var(--md-sys-color-primary-container, #2e4379))",
        progressFill: "color-mix(in srgb, var(--md-sys-color-primary, #b1c5ff) 35%, var(--md-sys-color-primary-container, #2e4379))",
        onContainer: "var(--md-sys-color-on-primary-container, #dae2ff)",
        accent: "var(--md-sys-color-primary, #b1c5ff)",
        onAccent: "var(--md-sys-color-on-primary, #142c60)"
      };
    if (h === "accent")
      return {
        container: "color-mix(in srgb, var(--md-sys-color-scrim, #000000) 28%, var(--md-sys-color-tertiary-container, #5a3d5a))",
        well: "color-mix(in srgb, var(--md-sys-color-scrim, #000000) 44%, var(--md-sys-color-tertiary-container, #5a3d5a))",
        progressFill: "color-mix(in srgb, var(--md-sys-color-tertiary, #ebb5ea) 35%, var(--md-sys-color-tertiary-container, #5a3d5a))",
        onContainer: "var(--md-sys-color-on-tertiary-container, #ffd7fc)",
        accent: "var(--md-sys-color-tertiary, #ebb5ea)",
        onAccent: "var(--md-sys-color-on-tertiary, #482948)"
      };
  }
  const i = Ya(t);
  if (!i) return null;
  const [s, a] = Ga(i[0], i[1], i[2]);
  if (a < 10)
    return e ? {
      container: "hsl(220, 6%, 20%)",
      well: "hsl(220, 7%, 13%)",
      progressFill: "hsl(220, 6%, 42%)",
      onContainer: "hsl(220, 10%, 90%)",
      accent: "hsl(220, 10%, 74%)",
      onAccent: "hsl(220, 10%, 14%)"
    } : {
      container: "hsl(220, 10%, 91%)",
      well: "hsl(220, 10%, 82%)",
      progressFill: "hsl(220, 10%, 75%)",
      onContainer: "hsl(220, 12%, 18%)",
      accent: "hsl(220, 12%, 42%)",
      onAccent: "#ffffff"
    };
  const o = ht(a * 0.56, 18, 46), n = ht(a * 0.62, 20, 52), l = ht(a * 0.68, 32, 58), p = ht(a * 0.72, 24, 68), c = ht(a * 0.7, 30, 66);
  return e ? {
    container: `hsl(${s}, ${o.toFixed(0)}%, 20%)`,
    well: `hsl(${s}, ${n.toFixed(0)}%, 13%)`,
    progressFill: `hsl(${s}, ${l.toFixed(0)}%, 52%)`,
    onContainer: `hsl(${s}, ${p.toFixed(0)}%, 90%)`,
    accent: `hsl(${s}, ${c.toFixed(0)}%, 74%)`,
    onAccent: `hsl(${s}, ${n.toFixed(0)}%, 14%)`
  } : {
    container: `hsl(${s}, ${o.toFixed(0)}%, 91%)`,
    well: `hsl(${s}, ${n.toFixed(0)}%, 82%)`,
    progressFill: `hsl(${s}, ${l.toFixed(0)}%, 75%)`,
    onContainer: `hsl(${s}, ${p.toFixed(0)}%, 18%)`,
    accent: `hsl(${s}, ${c.toFixed(0)}%, 42%)`,
    onAccent: "#ffffff"
  };
}
function Ne(t) {
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
  const a = Math.floor(s / 60);
  if (a < 24)
    return a === 1 ? "1 ora fa" : `${a} ore fa`;
  const r = Math.floor(a / 24);
  return r === 1 ? "1 giorno fa" : `${r} giorni fa`;
}
const Ka = {
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
function Bs(t) {
  return (t?.language ?? "en").toLowerCase().startsWith("it") ? "it" : "en";
}
function P(t, e) {
  return Ka[Bs(t)][e];
}
const qa = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
function Pi(t, e) {
  const i = t.trim();
  if (!qa.test(i)) return null;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return null;
  const a = Bs(e) === "it", r = Math.round((s.getTime() - Date.now()) / 1e3), o = Math.round(Math.abs(r) / 60);
  if (r >= 0) {
    if (o < 1) return a ? "Tra <1m" : "In <1m";
    if (o < 60) return a ? `Tra ${o}m` : `In ${o}m`;
    const c = Math.floor(o / 60), h = o % 60;
    if (c < 24) {
      const _ = h > 0 ? `${c}h ${h}m` : `${c}h`;
      return a ? `Tra ${_}` : `In ${_}`;
    }
    const f = Math.floor(c / 24), m = c % 24, u = a ? "g" : "d", v = m > 0 ? `${f}${u} ${m}h` : `${f}${u}`;
    return a ? `Tra ${v}` : `In ${v}`;
  }
  if (o < 1) return a ? "Ora" : "Now";
  if (o < 60) return a ? `${o}m fa` : `${o}m ago`;
  const n = Math.floor(o / 60), l = o % 60;
  if (n < 24) {
    const c = l > 0 ? `${n}h ${l}m` : `${n}h`;
    return a ? `${c} fa` : `${c} ago`;
  }
  const p = Math.floor(n / 24);
  return a ? `${p}g fa` : `${p}d ago`;
}
function mt(t, e, i, s) {
  if (typeof i == "string") {
    const a = i.trim();
    if (a) return a;
  }
  if (e && i !== void 0 && i !== null && typeof i != "string") {
    if (typeof t?.formatEntityName == "function")
      try {
        const l = t.formatEntityName(e, i);
        if (l && l.trim()) return l.trim();
      } catch {
      }
    const a = Array.isArray(i) ? i : [i], r = [], o = t?.entities?.[e.entity_id], n = o?.device_id ? t?.devices?.[o.device_id] : void 0;
    for (const l of a)
      if (!(!l || typeof l != "object")) {
        if (l.type === "text" && "text" in l && l.text)
          r.push(l.text);
        else if (l.type === "device") {
          const p = n?.name_by_user || n?.name;
          p && r.push(p);
        } else if (l.type === "entity") {
          const p = e.attributes.friendly_name;
          p && r.push(p);
        } else if (l.type === "area") {
          const p = o?.area_id || n?.area_id, c = p ? t?.areas?.[p]?.name : void 0;
          c && r.push(c);
        } else if (l.type === "floor") {
          const p = o?.area_id || n?.area_id, c = p ? t?.areas?.[p]?.floor_id : void 0, h = c ? t?.floors?.[c]?.name : void 0;
          h && r.push(h);
        }
      }
    if (r.length > 0) return r.join(" ");
  }
  return e?.attributes.friendly_name ? e.attributes.friendly_name : s || e?.entity_id || "";
}
function fe(t, e, i, s) {
  if (!e || !i) return null;
  const a = (Array.isArray(i) ? i : [i]).map((o) => String(o ?? "").trim()).filter(Boolean);
  if (a.length === 0) return null;
  const r = [];
  for (const o of a)
    if (o === "state") {
      const l = Pi(String(e.state ?? ""), t) ?? (typeof t?.formatEntityState == "function" ? t.formatEntityState(e) : s ?? e.state);
      l && String(l).trim() && r.push(String(l).trim());
    } else if (o === "last_changed" || o === "last-changed") {
      const n = Ne(e.last_changed);
      n && r.push(n);
    } else if (o === "last_updated" || o === "last-updated") {
      const n = Ne(e.last_updated);
      n && r.push(n);
    } else {
      const n = e.attributes[o];
      if (n == null || n === "") continue;
      let l;
      if (typeof t?.formatEntityAttributeValue == "function")
        try {
          l = t.formatEntityAttributeValue(e, o);
        } catch {
          l = void 0;
        }
      const p = (l ?? String(n)).trim();
      p && r.push(p);
    }
  return r.length > 0 ? r.join(" · ") : null;
}
var Xa = Object.defineProperty, Ja = Object.getOwnPropertyDescriptor, J = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ja(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Xa(e, i, a), a;
};
const Qa = ["D", "W", "M", "3M", "Y"], tr = {
  illuminance: {
    accentDark: "#FFD54F",
    onAccentDark: "#3E2700",
    accentLight: "#FFE082",
    onAccentLight: "#3E2700",
    lineDark: "#FFA726",
    lineLight: "#EF6C00",
    cumulative: ["#F57C00", "#FB8C00", "#FFB300", "#FFD54F", "#FF9800", "#FFE082"]
  },
  humidity: {
    accentDark: "#90CAF9",
    onAccentDark: "#002F54",
    accentLight: "#90CAF9",
    onAccentLight: "#002F54",
    lineDark: "#42A5F5",
    lineLight: "#1E88E5",
    cumulative: ["#1565C0", "#1E88E5", "#42A5F5", "#64B5F6", "#81D4FA", "#B3E5FC"]
  },
  moisture: {
    accentDark: "#A5D6A7",
    onAccentDark: "#0A3818",
    accentLight: "#A5D6A7",
    onAccentLight: "#0A3818",
    lineDark: "#4CAF50",
    lineLight: "#2E7D32",
    cumulative: ["#1B5E20", "#2E7D32", "#43A047", "#66BB6A", "#81C784", "#A5D6A7"]
  },
  temperature: {
    accentDark: "#FFAB91",
    onAccentDark: "#4A1108",
    accentLight: "#FFAB91",
    onAccentLight: "#4A1108",
    lineDark: "#E64A19",
    lineLight: "#C62828",
    cumulative: ["#9B1B30", "#C62828", "#E53935", "#E64A19", "#F57C00", "#FF9800"]
  }
};
function ii(t) {
  return String(t?.language ?? "").toLowerCase().startsWith("it");
}
function cs(t, e) {
  return String(t?.attributes.friendly_name ?? "").trim() || e;
}
function er(t, e, i) {
  const s = e === "illuminance" ? 0 : e === "temperature" ? 1 : Number.isInteger(t) ? 0 : 1, a = ii(i) ? "it-IT" : void 0;
  return new Intl.NumberFormat(a, {
    minimumFractionDigits: s,
    maximumFractionDigits: s
  }).format(t);
}
function It(t, e, i, s) {
  const a = er(t, e, s), r = i.trim();
  return r ? r === "%" ? `${a} %` : `${a} ${r}` : a;
}
function ds(t, e, i) {
  const s = ii(i), a = s ? "it-IT" : "en-US", r = /* @__PURE__ */ new Date();
  if (t === "D") {
    const u = new Date(r.getFullYear(), r.getMonth(), r.getDate() + e), v = u.getTime(), _ = [], x = [];
    for (let M = 0; M < 24; M++) {
      const $ = new Date(u.getFullYear(), u.getMonth(), u.getDate(), M).getTime(), L = new Date(u.getFullYear(), u.getMonth(), u.getDate(), M + 1).getTime();
      _.push($), x.push(L);
    }
    const y = x[23], w = e === 0 ? s ? "Oggi" : "Today" : e === -1 ? s ? "Ieri" : "Yesterday" : new Intl.DateTimeFormat(a, { day: "numeric", month: "short" }).format(u), S = [0, 6, 12, 18, 23].map((M) => ({
      index: M,
      text: `${String(M).padStart(2, "0")}:00`
    }));
    return { start: v, end: y, bucketStarts: _, bucketEnds: x, periodLabel: w, xLabels: S };
  }
  if (t === "W") {
    const u = (r.getDay() + 6) % 7, v = new Date(
      r.getFullYear(),
      r.getMonth(),
      r.getDate() - u + e * 7
    ), _ = [], x = [], y = [];
    for (let $ = 0; $ < 7; $++) {
      const L = new Date(v.getFullYear(), v.getMonth(), v.getDate() + $), E = new Date(v.getFullYear(), v.getMonth(), v.getDate() + $ + 1);
      _.push(L.getTime()), x.push(E.getTime());
      const C = new Intl.DateTimeFormat(a, { weekday: "short" }).format(L);
      y.push({
        index: $,
        text: C.charAt(0).toUpperCase() + C.slice(1, 3)
      });
    }
    const w = _[0], S = x[6];
    let M;
    if (e === 0)
      M = s ? "Questa settimana" : "This week";
    else if (e === -1)
      M = s ? "Settimana scorsa" : "Last week";
    else {
      const $ = new Date(_[6]), L = new Intl.DateTimeFormat(a, { day: "numeric", month: "short" });
      M = `${L.format(v)} – ${L.format($)}`;
    }
    return { start: w, end: S, bucketStarts: _, bucketEnds: x, periodLabel: M, xLabels: y };
  }
  if (t === "M") {
    const u = new Date(r.getFullYear(), r.getMonth() + e, 1), v = new Date(u.getFullYear(), u.getMonth() + 1, 0).getDate(), _ = [], x = [];
    for (let E = 1; E <= v; E++)
      _.push(new Date(u.getFullYear(), u.getMonth(), E).getTime()), x.push(new Date(u.getFullYear(), u.getMonth(), E + 1).getTime());
    const y = _[0], w = x[v - 1], S = new Intl.DateTimeFormat(a, { month: "long" }).format(u), M = e === 0 ? s ? "Questo mese" : "This month" : S.charAt(0).toUpperCase() + S.slice(1), $ = [1, 5, 10, 15, 20, 25];
    $.includes(v) || $.push(v);
    const L = $.filter((E) => E <= v).map((E) => ({ index: E - 1, text: String(E) }));
    return { start: y, end: w, bucketStarts: _, bucketEnds: x, periodLabel: M, xLabels: L };
  }
  if (t === "3M") {
    const u = new Date(r.getFullYear(), r.getMonth() + e * 3, 1), v = new Date(u.getFullYear(), u.getMonth() - 2, 1), _ = new Date(
      u.getFullYear(),
      u.getMonth() + 1,
      1
    ), x = v.getTime(), y = _.getTime(), w = 13, S = (y - x) / w, M = [], $ = [];
    for (let A = 0; A < w; A++)
      M.push(Math.round(x + A * S)), $.push(Math.round(x + (A + 1) * S));
    const L = new Intl.DateTimeFormat(a, { month: "short" }), E = new Intl.DateTimeFormat(a, { month: "long" }), C = L.format(v).replace(/\.$/, ""), k = L.format(u).replace(/\.$/, ""), T = (A) => A.charAt(0).toUpperCase() + A.slice(1), H = `${T(C)}–${T(k)}`, I = [0, 1, 2].map((A) => {
      const D = new Date(v.getFullYear(), v.getMonth() + A, 1), at = D.getTime(), q = Math.max(0, Math.min(w - 1, Math.round((at - x) / (y - x) * (w - 1)))), Ot = E.format(D);
      return { index: q, text: T(Ot) };
    });
    return { start: x, end: y, bucketStarts: M, bucketEnds: $, periodLabel: H, xLabels: I };
  }
  const o = r.getFullYear() + e, n = [], l = [];
  for (let u = 0; u < 12; u++)
    n.push(new Date(o, u, 1).getTime()), l.push(new Date(o, u + 1, 1).getTime());
  const p = n[0], c = l[11], h = String(o), f = new Intl.DateTimeFormat(a, { month: "short" }), m = [0, 3, 6, 9, 11].map((u) => {
    const v = f.format(new Date(o, u, 1)).replace(/\.$/, "");
    return { index: u, text: v.charAt(0).toUpperCase() + v.slice(1) };
  });
  return { start: p, end: c, bucketStarts: n, bucketEnds: l, periodLabel: h, xLabels: m };
}
let j = class extends N {
  constructor() {
    super(...arguments), this.entityIds = [], this.metricKind = "temperature", this.unit = "", this.headerTitle = "", this._range = "D", this._offset = 0, this._loading = !1, this._series = [], this._isolatedEntityId = null, this._plotWidth = 340, this._fetchSeq = 0, this._lastQueryKey = "";
  }
  connectedCallback() {
    super.connectedCallback(), typeof ResizeObserver < "u" && (this._ro = new ResizeObserver((t) => {
      for (const e of t) {
        const i = Math.round(e.contentRect.width);
        i > 120 && Math.abs(i - this._plotWidth) > 2 && (this._plotWidth = i);
      }
    }));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  firstUpdated() {
    this._chartAreaEl && this._ro && this._ro.observe(this._chartAreaEl);
  }
  updated(t) {
    if (t.has("entityIds") || t.has("_range") || t.has("_offset") || t.has("metricKind") || t.has("hass") && !this._lastQueryKey && this.hass) {
      t.has("entityIds") && (this._isolatedEntityId = null);
      const e = `${this.entityIds.join(",")}|${this._range}|${this._offset}`;
      e !== this._lastQueryKey && this.hass && this.entityIds.length > 0 && (this._lastQueryKey = e, this._fetchData());
    }
  }
  _setRange(t) {
    this._range !== t && (navigator.vibrate?.(6), this._range = t, this._offset = 0);
  }
  _stepOffset(t) {
    const e = Math.min(0, this._offset + t);
    e !== this._offset && (navigator.vibrate?.(6), this._offset = e);
  }
  _resetToPresent() {
    this._offset !== 0 && (navigator.vibrate?.(6), this._offset = 0);
  }
  async _fetchHistoryRaw(t, e, i) {
    if (!this.hass) return {};
    if (typeof this.hass.callWS == "function")
      try {
        const s = await this.hass.callWS({
          type: "history/history_during_period",
          start_time: t,
          end_time: e,
          entity_ids: i,
          minimal_response: !0,
          no_attributes: !0,
          significant_changes_only: !1
        });
        if (s && typeof s == "object") return s;
      } catch {
      }
    if (typeof this.hass.callApi == "function")
      try {
        const s = await this.hass.callApi(
          "GET",
          `history/period/${t}?end_time=${encodeURIComponent(e)}&filter_entity_id=${encodeURIComponent(i.join(","))}&minimal_response&no_attributes`
        ), a = {};
        if (Array.isArray(s))
          for (let r = 0; r < s.length; r++) {
            const o = s[r];
            if (!Array.isArray(o) || o.length === 0) continue;
            const n = o[0]?.entity_id || i[r];
            n && (a[n] = o);
          }
        return a;
      } catch {
        return {};
      }
    return {};
  }
  async _fetchStatistics(t, e, i, s) {
    if (!this.hass || typeof this.hass.callWS != "function") return {};
    try {
      const a = await this.hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: t,
        end_time: e,
        statistic_ids: i,
        period: s,
        types: ["mean", "min", "max", "state"]
      });
      return a && typeof a == "object" ? a : {};
    } catch {
      return {};
    }
  }
  _bucketRawPoints(t, e, i) {
    const s = e.bucketStarts.length, a = Array.from({ length: s }, () => []);
    for (const r of t) {
      const o = Number(r.s ?? r.state);
      if (!Number.isFinite(o)) continue;
      const n = typeof r.lu == "number" ? r.lu * 1e3 : r.last_updated ? Date.parse(r.last_updated) : NaN;
      if (!(!Number.isFinite(n) || n < e.start || n >= e.end || n > i)) {
        for (let l = 0; l < s; l++)
          if (n >= e.bucketStarts[l] && n < e.bucketEnds[l]) {
            a[l].push(o);
            break;
          }
      }
    }
    return e.bucketStarts.map((r, o) => {
      const n = a[o];
      if (n.length === 0 || r > i)
        return { t: r, v: null, min: null, max: null };
      const l = n.reduce((p, c) => p + c, 0);
      return {
        t: r,
        v: l / n.length,
        min: Math.min(...n),
        max: Math.max(...n)
      };
    });
  }
  _bucketStatPoints(t, e, i) {
    const s = e.bucketStarts.length, a = Array.from(
      { length: s },
      () => []
    );
    for (const r of t) {
      const o = r.mean ?? r.state;
      if (o == null || !Number.isFinite(Number(o))) continue;
      const n = Number(o), l = r.min !== void 0 && r.min !== null ? Number(r.min) : n, p = r.max !== void 0 && r.max !== null ? Number(r.max) : n, c = typeof r.start == "number" ? r.start : Date.parse(String(r.start));
      if (!(!Number.isFinite(c) || c < e.start || c >= e.end || c > i)) {
        for (let h = 0; h < s; h++)
          if (c >= e.bucketStarts[h] && c < e.bucketEnds[h]) {
            a[h].push({ v: n, min: l, max: p });
            break;
          }
      }
    }
    return e.bucketStarts.map((r, o) => {
      const n = a[o];
      if (n.length === 0 || r > i)
        return { t: r, v: null, min: null, max: null };
      const l = n.reduce((p, c) => p + c.v, 0);
      return {
        t: r,
        v: l / n.length,
        min: Math.min(...n.map((p) => p.min)),
        max: Math.max(...n.map((p) => p.max))
      };
    });
  }
  _resolveColors() {
    const t = this.hass?.themes?.darkMode !== !1, e = this.customColor ? ei(this.customColor, t) : null, i = tr[this.metricKind], s = e?.accent ?? (t ? i.accentDark : i.accentLight), a = e?.onAccent ?? (t ? i.onAccentDark : i.onAccentLight), r = e?.accent ?? (t ? i.lineDark : i.lineLight), o = e ? [e.accent, ...i.cumulative.filter((n) => n !== e.accent)] : i.cumulative;
    return { accent: s, onAccent: a, singleLine: r, cumulative: o };
  }
  async _fetchData() {
    if (!this.hass || this.entityIds.length === 0) return;
    const t = ++this._fetchSeq, e = [...this.entityIds], i = ds(this._range, this._offset, this.hass);
    this._spec = i, this._loading = !0;
    const s = Date.now(), a = new Date(i.start).toISOString(), r = new Date(Math.min(i.end, s)).toISOString(), o = e.length > 1, n = this._resolveColors();
    try {
      const l = i.start > s, p = /* @__PURE__ */ new Map();
      if (!l)
        if (this._range === "D" && this._offset >= -9) {
          const c = await this._fetchHistoryRaw(a, r, e);
          if (t !== this._fetchSeq) return;
          let h = !1;
          for (const f of e) {
            const m = c[f] ?? [];
            m.length > 0 && (h = !0), p.set(f, this._bucketRawPoints(m, i, s));
          }
          if (!h) {
            const f = await this._fetchStatistics(a, r, e, "hour");
            if (t !== this._fetchSeq) return;
            for (const m of e)
              p.set(m, this._bucketStatPoints(f[m] ?? [], i, s));
          }
        } else {
          const c = this._range === "D" ? "hour" : this._range === "Y" ? "month" : "day", h = await this._fetchStatistics(a, r, e, c);
          if (t !== this._fetchSeq) return;
          let f = !1;
          for (const m of e) {
            const u = h[m] ?? [];
            u.length > 0 && (f = !0), p.set(m, this._bucketStatPoints(u, i, s));
          }
          if (!f && (this._range === "W" || this._range === "M" && this._offset === 0)) {
            const m = await this._fetchHistoryRaw(a, r, e);
            if (t !== this._fetchSeq) return;
            for (const u of e)
              p.set(u, this._bucketRawPoints(m[u] ?? [], i, s));
          }
        }
      if (t !== this._fetchSeq) return;
      this._series = e.map((c, h) => {
        const f = this.hass?.states[c], m = o ? n.cumulative[h % n.cumulative.length] : n.singleLine, u = p.get(c) ?? i.bucketStarts.map((v) => ({ t: v, v: null, min: null, max: null }));
        return {
          entityId: c,
          label: cs(f, c),
          color: m,
          buckets: u
        };
      });
    } catch {
      if (t !== this._fetchSeq) return;
      this._series = e.map((l, p) => ({
        entityId: l,
        label: cs(this.hass?.states[l], l),
        color: o ? n.cumulative[p % n.cumulative.length] : n.singleLine,
        buckets: i.bucketStarts.map((c) => ({ t: c, v: null, min: null, max: null }))
      }));
    } finally {
      t === this._fetchSeq && (this._loading = !1);
    }
  }
  _computeStats() {
    const t = [], e = [];
    let i = 1 / 0, s = -1 / 0;
    for (const r of this._series) {
      const o = [];
      for (const n of r.buckets) {
        if (n.v === null) continue;
        t.push(n.v), o.push(n.v);
        const l = n.min ?? n.v, p = n.max ?? n.v;
        l < i && (i = l), p > s && (s = p);
      }
      o.length > 0 && e.push(o.reduce((n, l) => n + l, 0) / o.length);
    }
    return t.length === 0 ? {
      hasData: !1,
      avg: 0,
      min: 0,
      max: 0,
      activeSensors: 0,
      sensorMinAvg: 0,
      sensorMaxAvg: 0
    } : {
      hasData: !0,
      avg: t.reduce((r, o) => r + o, 0) / t.length,
      min: i,
      max: s,
      activeSensors: e.length,
      sensorMinAvg: Math.min(...e),
      sensorMaxAvg: Math.max(...e)
    };
  }
  _metricDescriptor() {
    const t = ii(this.hass);
    switch (this.metricKind) {
      case "humidity":
        return {
          avgLabel: t ? "umidità media" : "humidity (avg)",
          noun: t ? "L'umidità media è stata di" : "Average humidity was"
        };
      case "illuminance":
        return {
          avgLabel: t ? "illuminazione media" : "illuminance (avg)",
          noun: t ? "L'illuminazione media è stata di" : "Average illuminance was"
        };
      case "moisture":
        return {
          avgLabel: t ? "moisture medio" : "moisture (avg)",
          noun: t ? "Il moisture medio è stato di" : "Average moisture was"
        };
      default:
        return {
          avgLabel: t ? "temperatura media" : "temperature (avg)",
          noun: t ? "La temperatura media è stata di" : "Average temperature was"
        };
    }
  }
  _formatTickY(t) {
    const e = this.metricKind === "illuminance" ? Math.round(t) : Math.abs(t) < 10 && !Number.isInteger(t) ? Number(t.toFixed(1)) : Math.round(t), i = this.unit.trim();
    return i ? i === "%" || i === "°C" || i === "°F" ? `${e}${i}` : `${e} ${i}` : String(e);
  }
  render() {
    if (!this.hass || this.entityIds.length === 0) return g;
    const t = this._spec ?? ds(this._range, this._offset, this.hass), e = ii(this.hass), i = this._resolveColors(), s = this._computeStats(), { avgLabel: a, noun: r } = this._metricDescriptor(), o = this._series.length > 1;
    let n;
    if (!s.hasData)
      n = e ? "Nessun dato raccolto" : "No data collected";
    else if (o) {
      const C = It(s.avg, this.metricKind, this.unit, this.hass), k = It(s.min, this.metricKind, this.unit, this.hass), T = It(s.max, this.metricKind, this.unit, this.hass);
      n = e ? `Media complessiva di ${C} tra ${this._series.length} sensori (da ${k} a ${T}) nella finestra selezionata.` : `Overall average of ${C} across ${this._series.length} sensors (from ${k} to ${T}) in the selected window.`;
    } else {
      const C = It(s.avg, this.metricKind, this.unit, this.hass), k = It(s.min, this.metricKind, this.unit, this.hass), T = It(s.max, this.metricKind, this.unit, this.hass);
      n = e ? `${r} ${C} (min ${k} – max ${T}) nella finestra selezionata.` : `${r} ${C} (min ${k} – max ${T}) in the selected window.`;
    }
    const l = Math.max(240, this._plotWidth), p = 224, c = 8, h = 46, f = 12, m = 34, u = l - c - h, v = p - f - m, _ = Math.max(1, t.bucketStarts.length);
    let x = 0, y = this.metricKind === "temperature" ? 30 : 100;
    if (s.hasData) {
      let C = 1 / 0, k = -1 / 0;
      for (const I of this._series)
        for (const A of I.buckets)
          A.v !== null && (A.v < C && (C = A.v), A.v > k && (k = A.v));
      const T = k - C, H = T > 0 ? T * 0.18 : Math.max(2, Math.abs(k) * 0.15);
      x = this.metricKind === "temperature" ? Math.floor(C - H) : Math.max(0, Math.floor(C - H)), y = Math.ceil(k + H), y <= x && (y = x + 4);
    }
    const w = y - x || 1, S = (C) => _ <= 1 ? c + u / 2 : c + C / (_ - 1) * u, M = (C) => f + v - (C - x) / w * v, $ = [0, 1, 2, 3].map((C) => {
      const k = C / 3, T = x + k * w;
      return { y: f + v - k * v, label: this._formatTickY(T) };
    }), L = p - 22, E = p - 5;
    return d`
      <div
        class="m3e-chart-root"
        style="--chart-accent: ${i.accent}; --chart-on-accent: ${i.onAccent};"
      >
        <!-- 1. Top Segmented Time Selector -->
        <div class="range-bar" role="tablist" aria-label=${e ? "Intervallo temporale" : "Time range"}>
          ${Qa.map((C) => {
      const k = C === this._range;
      return d`
              <button
                type="button"
                role="tab"
                class="range-btn ${k ? "is-selected" : ""}"
                aria-selected=${String(k)}
                @click=${() => this._setRange(C)}
              >
                ${C}
              </button>
            `;
    })}
        </div>

        <!-- 2. Contextual Header & Chronological Navigation -->
        <div class="chart-header">
          <div class="period-row">
            <span class="period-label">
              ${this.headerTitle ? this._offset === 0 ? this.headerTitle : d`${this.headerTitle}<span class="period-suffix"> · ${t.periodLabel}</span>` : t.periodLabel}
            </span>
            <div class="nav-group">
              <button
                type="button"
                class="nav-btn"
                aria-label=${e ? "Periodo precedente" : "Previous period"}
                @click=${() => this._stepOffset(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-btn"
                ?disabled=${this._offset === 0}
                aria-label=${e ? "Periodo successivo" : "Next period"}
                @click=${() => this._stepOffset(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-btn ${this._offset < 0 ? "is-highlighted" : "is-present"}"
                ?disabled=${this._offset === 0}
                aria-label=${e ? "Torna al presente" : "Jump to present"}
                @click=${() => this._resetToPresent()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="hero-row">
            ${s.hasData ? d`
                  <span class="hero-val">
                    ${It(s.avg, this.metricKind, this.unit, this.hass)}
                  </span>
                  <span class="hero-lbl">${a}</span>
                ` : d`<span class="hero-val">${e ? "Nessun dato" : "No data"}</span>`}
          </div>

          <div class="summary-sub">${n}</div>
        </div>

        <!-- 3. Clean Line + Dot SVG Chart -->
        <div class="chart-area ${this._loading ? "is-loading" : ""}">
          <svg
            class="chart-svg"
            viewBox="0 0 ${l} ${p}"
            role="img"
            aria-label=${t.periodLabel}
          >
            ${X`
              <!-- Right-aligned minimal Y-axis labels (no gridlines) -->
              ${$.map(
      (C) => X`
                  <text
                    x=${l - 2}
                    y=${C.y + 4}
                    text-anchor="end"
                    class="y-tick-label"
                  >${C.label}</text>
                `
    )}

              <!-- Bottom X-axis scan dots & key labels -->
              ${t.bucketStarts.map((C, k) => {
      const T = S(k);
      return X`<circle cx=${T} cy=${L} r="1.25" class="x-scan-dot" />`;
    })}
              ${t.xLabels.map((C) => {
      const k = S(C.index), T = C.index === 0 ? "start" : C.index === _ - 1 ? "end" : "middle";
      return X`
                  <text
                    x=${k}
                    y=${E}
                    text-anchor=${T}
                    class="x-tick-label"
                  >${C.text}</text>
                `;
    })}

              <!-- Single or Cumulative Sensor Series -->
              ${this._series.map((C, k) => {
      const T = o ? i.cumulative[k % i.cumulative.length] : i.singleLine, I = o && this._isolatedEntityId !== null && this._isolatedEntityId !== C.entityId ? 0.16 : 1;
      let A = "", D = !1;
      const at = [];
      return C.buckets.forEach((q, Ot) => {
        if (q.v === null) {
          D = !1;
          return;
        }
        const Jt = S(Ot), Lt = M(q.v);
        at.push({ cx: Jt, cy: Lt }), A += `${D ? "L" : "M"} ${Jt.toFixed(1)} ${Lt.toFixed(1)} `, D = !0;
      }), X`
                  <g style="opacity: ${I}; transition: opacity 200ms ease;">
                    ${A ? X`<path d=${A.trim()} stroke=${T} class="series-line" />` : g}
                    ${at.map(
        (q) => X`
                        <circle
                          cx=${q.cx.toFixed(1)}
                          cy=${q.cy.toFixed(1)}
                          r="3.5"
                          fill=${T}
                          class="series-dot"
                        />
                      `
      )}
                  </g>
                `;
    })}
            `}
          </svg>
        </div>

        <!-- 4. Interactive Legend Footer -->
        <div class="legend-row">
          ${this._series.map((C, k) => {
      const T = o ? i.cumulative[k % i.cumulative.length] : i.singleLine, H = o && this._isolatedEntityId !== null && this._isolatedEntityId !== C.entityId;
      return d`
              <button
                type="button"
                class="legend-item ${o ? "is-interactive" : ""} ${H ? "is-dimmed" : ""}"
                @click=${() => {
        o && (navigator.vibrate?.(5), this._isolatedEntityId = this._isolatedEntityId === C.entityId ? null : C.entityId);
      }}
              >
                <span class="legend-dot" style="background: ${T};"></span>
                <span class="legend-lbl">${C.label}</span>
              </button>
            `;
    })}
        </div>
      </div>
    `;
  }
};
j.styles = R`
    :host {
      display: block;
      width: 100%;
    }

    .m3e-chart-root {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 4px;
    }

    /* 1. Segmented Control */
    .range-bar {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      width: 100%;
    }

    .range-btn {
      height: 38px;
      border: 0;
      padding: 0;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container-high, #23262a);
      color: var(--md-sys-color-on-surface, #e3e2e6);
      font: inherit;
      font-size: 13.5px;
      font-weight: 500;
      display: grid;
      place-items: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition:
        border-radius 320ms cubic-bezier(0.2, 0, 0, 1),
        background-color 240ms cubic-bezier(0.2, 0, 0, 1),
        color 200ms cubic-bezier(0.2, 0, 0, 1),
        transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1));
    }

    .range-btn:hover:not(.is-selected) {
      filter: brightness(1.08);
    }

    .range-btn.is-selected {
      border-radius: 19px;
      background: var(--chart-accent);
      color: var(--chart-on-accent);
      font-weight: 600;
    }

    .range-btn:active {
      transform: scale(0.95);
    }

    /* 2. Contextual Header */
    .chart-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .period-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .period-label {
      font-size: 1.15rem;
      font-weight: 500;
      line-height: 1.25;
      color: var(--md-sys-color-on-surface, #e3e2e6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .period-suffix {
      font-weight: 400;
      color: var(--md-sys-color-on-surface-variant, #c4c7c5);
    }

    .nav-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .nav-btn {
      width: 36px;
      height: 36px;
      border: 0;
      padding: 0;
      border-radius: 50%;
      background: var(--md-sys-color-surface-container-high, #23262a);
      color: var(--md-sys-color-on-surface, #e3e2e6);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition:
        opacity 180ms ease,
        background-color 180ms ease,
        color 180ms ease,
        transform var(--m3e-spring-spatial-fast, 200ms ease);
      -webkit-tap-highlight-color: transparent;
    }

    .nav-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .nav-btn.is-highlighted {
      background: color-mix(in srgb, var(--chart-accent) 22%, var(--md-sys-color-surface-container-high, #23262a));
      color: var(--chart-accent);
    }

    .nav-btn:not(:disabled):active {
      transform: scale(0.9);
    }

    .nav-btn svg {
      width: 20px;
      height: 20px;
    }

    .hero-row {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 2px;
    }

    .hero-val {
      font-size: 2.25rem;
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--md-sys-color-on-surface, #e3e2e6);
    }

    .hero-lbl {
      font-size: 1rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant, #c4c7c5);
    }

    .summary-sub {
      font-size: 0.875rem;
      line-height: 1.35;
      color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* 3. Clean Chart Canvas */
    .chart-area {
      width: 100%;
      height: 224px;
      transition: opacity 180ms ease;
    }

    .chart-area.is-loading {
      opacity: 0.45;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .y-tick-label {
      font-size: 0.75rem;
      font-weight: 500;
      fill: var(--md-sys-color-outline, #8e918f);
      font-variant-numeric: tabular-nums;
    }

    .x-scan-dot {
      fill: var(--md-sys-color-outline-variant, #5c5f5e);
    }

    .x-tick-label {
      font-size: 0.72rem;
      font-weight: 500;
      fill: var(--md-sys-color-outline, #8e918f);
      font-variant-numeric: tabular-nums;
    }

    .series-line {
      fill: none;
      stroke-width: 2.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .series-dot {
      stroke: var(--md-sys-color-surface, #111315);
      stroke-width: 1.5px;
    }

    /* 4. Interactive Legend Footer */
    .legend-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px 16px;
      padding: 2px 4px 0;
    }

    .legend-item {
      border: 0;
      padding: 4px 6px;
      border-radius: 9999px;
      background: transparent;
      color: var(--md-sys-color-on-surface, #e3e2e6);
      font: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: default;
      transition: opacity 180ms ease, background-color 150ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .legend-item.is-interactive {
      cursor: pointer;
    }

    .legend-item.is-interactive:hover {
      background: color-mix(in srgb, currentColor 7%, transparent);
    }

    .legend-item.is-dimmed {
      opacity: 0.42;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-lbl {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
  `;
J([
  O({ attribute: !1 })
], j.prototype, "hass", 2);
J([
  O({ attribute: !1 })
], j.prototype, "entityIds", 2);
J([
  O({ type: String })
], j.prototype, "metricKind", 2);
J([
  O({ type: String })
], j.prototype, "unit", 2);
J([
  O({ attribute: !1 })
], j.prototype, "customColor", 2);
J([
  O({ type: String })
], j.prototype, "headerTitle", 2);
J([
  b()
], j.prototype, "_range", 2);
J([
  b()
], j.prototype, "_offset", 2);
J([
  b()
], j.prototype, "_loading", 2);
J([
  b()
], j.prototype, "_series", 2);
J([
  b()
], j.prototype, "_isolatedEntityId", 2);
J([
  b()
], j.prototype, "_spec", 2);
J([
  b()
], j.prototype, "_plotWidth", 2);
J([
  z(".chart-area")
], j.prototype, "_chartAreaEl", 2);
j = J([
  B("m3e-history-chart")
], j);
var ir = Object.defineProperty, sr = Object.getOwnPropertyDescriptor, st = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? sr(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && ir(e, i, a), a;
};
const ar = /* @__PURE__ */ new Set(["ms", "s", "sec", "secs", "m", "min", "mins", "h", "hr", "hrs"]);
function ee(t) {
  return String(t?.language ?? "").toLowerCase().startsWith("it");
}
function rr(t, e) {
  return String(t?.attributes.device_class ?? "").toLowerCase() === "duration" ? !0 : ar.has(e.trim().toLowerCase());
}
function ps(t, e) {
  const i = e.trim().toLowerCase();
  return i === "ms" ? t / 6e4 : i === "s" || i === "sec" || i === "secs" ? t / 60 : i === "h" || i === "hr" || i === "hrs" ? t * 60 : t;
}
function bi(t) {
  const e = Math.max(0, Math.round(t));
  if (e < 60) return `${e}min`;
  const i = Math.floor(e / 60), s = e % 60;
  return s === 0 ? `${i}h` : `${i}h ${s}m`;
}
function or(t, e) {
  const i = Math.max(0, Math.round(t)), s = Math.floor(i / 60), a = i % 60;
  if (s === 0)
    return e ? `${a} ${a === 1 ? "minuto" : "minuti"}` : `${a} ${a === 1 ? "minute" : "minutes"}`;
  const r = e ? `${s} ${s === 1 ? "ora" : "ore"}` : `${s} ${s === 1 ? "hour" : "hours"}`;
  if (a === 0) return r;
  const o = e ? `${a} ${a === 1 ? "minuto" : "minuti"}` : `${a} ${a === 1 ? "minute" : "minutes"}`;
  return e ? `${r} e ${o}` : `${r} ${o}`;
}
function Fs(t, e) {
  const i = Math.abs(t), s = Number.isInteger(t) || i >= 100 ? 0 : i >= 10 ? 1 : 2, a = ee(e) ? "it-IT" : void 0;
  return new Intl.NumberFormat(a, {
    minimumFractionDigits: 0,
    maximumFractionDigits: s
  }).format(Number(t.toFixed(s)));
}
function zt(t, e, i) {
  const s = Fs(t, i), a = e.trim();
  return a ? a === "%" ? `${s}%` : `${s} ${a}` : s;
}
function nr(t, e, i, s) {
  if (e) {
    if (t >= 180) {
      const o = t / 60;
      return `${Number.isInteger(o) ? o : o.toFixed(1).replace(/\.0$/, "")}h`;
    }
    return `${Math.round(t)}m`;
  }
  const a = Fs(t, s), r = i.trim();
  return r && r.length <= 3 ? r === "%" || r === "°C" || r === "°F" ? `${a}${r}` : `${a}${r}` : a;
}
function We(t, e, i) {
  const s = ee(i), a = s ? "it-IT" : "en-US", r = /* @__PURE__ */ new Date(), o = (_) => _ && _.charAt(0).toUpperCase() + _.slice(1);
  if (t === "W") {
    const _ = (r.getDay() + 6) % 7, x = new Date(
      r.getFullYear(),
      r.getMonth(),
      r.getDate() - _ + e * 7
    ), y = [], w = [], S = [], M = new Intl.DateTimeFormat(a, { weekday: "narrow" });
    for (let C = 0; C < 7; C++) {
      const k = new Date(x.getFullYear(), x.getMonth(), x.getDate() + C), T = new Date(x.getFullYear(), x.getMonth(), x.getDate() + C + 1);
      y.push(k.getTime()), w.push(T.getTime()), S.push({ index: C, text: M.format(k).toUpperCase() });
    }
    const $ = y[0], L = w[6];
    let E;
    if (e === 0)
      E = s ? "Questa settimana" : "This week";
    else {
      const C = new Date(y[6]);
      if (x.getMonth() === C.getMonth()) {
        const k = o(
          new Intl.DateTimeFormat(a, { month: "short" }).format(x).replace(/\.$/, "")
        );
        E = s ? `${x.getDate()}–${C.getDate()} ${k}` : `${k} ${x.getDate()}–${C.getDate()}`;
      } else {
        const k = new Intl.DateTimeFormat(a, { month: "short", day: "numeric" });
        E = `${k.format(x)}–${k.format(C)}`;
      }
    }
    return { range: t, offset: e, start: $, end: L, bucketStarts: y, bucketEnds: w, periodLabel: E, xLabels: S };
  }
  const n = new Date(r.getFullYear(), r.getMonth() + e, 1), l = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate(), p = [], c = [];
  for (let _ = 1; _ <= l; _++)
    p.push(new Date(n.getFullYear(), n.getMonth(), _).getTime()), c.push(new Date(n.getFullYear(), n.getMonth(), _ + 1).getTime());
  const h = p[0], f = c[l - 1];
  let m;
  e === 0 ? m = s ? "Questo mese" : "This month" : n.getFullYear() === r.getFullYear() ? m = o(new Intl.DateTimeFormat(a, { month: "long" }).format(n)) : m = o(
    new Intl.DateTimeFormat(a, { month: "short", year: "numeric" }).format(n)
  );
  const u = [1, 5, 10, 15, 20, 25];
  u.includes(l) || u.push(l);
  const v = u.filter((_) => _ <= l).map((_) => ({ index: _ - 1, text: String(_) }));
  return { range: t, offset: e, start: h, end: f, bucketStarts: p, bucketEnds: c, periodLabel: m, xLabels: v };
}
function lr(t) {
  const e = String(t?.attributes.device_class ?? "").toLowerCase(), i = String(t?.attributes.unit_of_measurement ?? "").toLowerCase();
  return e === "temperature" || i === "°c" || i === "°f" ? "temperature" : e === "moisture" ? "moisture" : e === "illuminance" || e === "energy" || e === "power" || i === "lx" || i === "lux" ? "illuminance" : "humidity";
}
let G = class extends N {
  constructor() {
    super(...arguments), this._range = "M", this._offset = 0, this._loading = !1, this._values = [], this._plotWidth = 320, this._hoverIdx = null, this._prevExtraSig = "", this._cache = /* @__PURE__ */ new Map(), this._fetchSeq = 0, this._lastQueryKey = "", this._pendingAnimDir = 0, this._animTimer = null, this._swipePointerId = null, this._swipeStartX = 0, this._swipeStartY = 0, this._swiping = !1, this._dragOffsetPx = 0;
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-history-card: entity is required");
    const e = this._config, i = t.default_range === "W" ? "W" : "M";
    (!e || e.entity !== t.entity || e.aggregation !== t.aggregation) && (this._cache.clear(), this._lastQueryKey = "", this._values = [], this._prevSlide = void 0, this._hoverIdx = null), (!e || e.default_range !== t.default_range) && (this._range = i, this._offset = 0), this._config = {
      chart_style: "bar",
      default_range: "M",
      aggregation: "auto",
      ...t
    };
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 12,
      min_columns: 6
    };
  }
  static getStubConfig(t) {
    const e = t?.states ?? {}, i = Object.keys(e).filter((a) => {
      if (!a.startsWith("sensor.") && !a.startsWith("counter.")) return !1;
      const r = e[a];
      if (!r) return !1;
      if (typeof r.attributes?.unit_of_measurement == "string" && r.attributes.unit_of_measurement)
        return !0;
      const o = Number(r.state);
      return r.state !== "" && Number.isFinite(o);
    });
    return {
      type: "custom:m3e-history-card",
      entity: i.find((a) => {
        const r = String(e[a]?.attributes.device_class ?? "").toLowerCase();
        return r === "duration" || r === "energy" || r === "power" || r === "temperature" || r === "humidity";
      }) ?? i[0] ?? "sensor.example",
      chart_style: "bar",
      default_range: "M"
    };
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: !0,
          selector: { entity: { domain: ["sensor", "counter"] } }
        },
        {
          name: "chart_style",
          selector: {
            select: {
              mode: "box",
              options: [
                { value: "bar", label: "Capsule Bars (Week / Month)" },
                { value: "line", label: "Line & Dots (D / W / M / 3M / Y)" }
              ]
            }
          }
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:chart-bar",
          title: "Content & Data",
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
                {
                  name: "default_range",
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "M", label: "Month / Mese" },
                        { value: "W", label: "Week / Settimana" }
                      ]
                    }
                  }
                },
                {
                  name: "aggregation",
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "auto", label: "Auto (sensor type)" },
                        { value: "sum", label: "Daily Total / Delta (sum)" },
                        { value: "avg", label: "Daily Average (mean)" },
                        { value: "max", label: "Daily Peak (max)" }
                      ]
                    }
                  }
                }
              ]
            },
            { name: "metric_label", selector: { text: {} } },
            {
              name: "entities",
              selector: { entity: { multiple: !0, domain: ["sensor", "counter"] } }
            }
          ]
        },
        {
          type: "expandable",
          name: "",
          flatten: !0,
          icon: "mdi:palette",
          title: "Appearance",
          schema: [
            {
              name: "accent_color",
              selector: { ui_color: { default_color: "state", include_state: !0 } }
            },
            { name: "transparent", selector: { boolean: {} } }
          ]
        }
      ],
      computeLabel: (t, e) => (ee(e) ? {
        entity: "Entità sensore o contatore",
        chart_style: "Stile grafico",
        name: "Nome entità",
        default_range: "Vista predefinita (Settimana / Mese)",
        aggregation: "Aggregazione giornaliera",
        metric_label: "Etichetta unità (es. al giorno (media))",
        entities: "Sensori extra (per modalità Line & Dots multi-sensore)",
        accent_color: "Colore tema (controlli e grafico)",
        transparent: "Sfondo trasparente (ignora stile Material You)"
      } : {
        entity: "Sensor or Counter Entity",
        chart_style: "Chart Style",
        name: "Entity Name",
        default_range: "Default View (Week / Month)",
        aggregation: "Daily Aggregation",
        metric_label: "Metric Label (e.g. per day (avg))",
        entities: "Extra Sensors (for multi-sensor Line & Dots mode)",
        accent_color: "Theme Color (Controls & Chart)",
        transparent: "Transparent background (bypass Material You card style)"
      })[t.name] ?? t.name
    };
  }
  connectedCallback() {
    super.connectedCallback(), typeof ResizeObserver < "u" && (this._ro = new ResizeObserver((t) => {
      for (const e of t) {
        const i = Math.round(e.contentRect.width);
        i > 120 && Math.abs(i - this._plotWidth) > 2 && (this._plotWidth = i);
      }
    }));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), this._cancelSlideAnims();
  }
  firstUpdated() {
    this._stageEl && this._ro && this._ro.observe(this._stageEl);
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_range") || t.has("_offset") || t.has("_loading") || t.has("_values") || t.has("_spec") || t.has("_plotWidth") || t.has("_hoverIdx") || t.has("_prevSlide"))
      return !0;
    if (t.has("hass") && this.hass) {
      const e = t.get("hass");
      if (!e) return !0;
      const i = this.hass.states[this._config.entity], s = (this._config.entities ?? []).map((a) => `${a}:${this.hass?.states[a]?.state ?? ""}`).join("|");
      return i !== this._prevEntity || s !== this._prevExtraSig || e.language !== this.hass.language || e.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return !0;
  }
  updated(t) {
    if (this._config && this.hass && (this._prevEntity = this.hass.states[this._config.entity], this._prevExtraSig = (this._config.entities ?? []).map((e) => `${e}:${this.hass?.states[e]?.state ?? ""}`).join("|")), this._stageEl && this._ro && this._ro.observe(this._stageEl), this._config?.chart_style !== "line" && this.hass && this._config?.entity) {
      const e = `${this._config.entity}|${this._config.aggregation ?? "auto"}|${this._range}|${this._offset}`;
      e !== this._lastQueryKey && (this._lastQueryKey = e, this._loadBarWindow(this._range, this._offset));
    }
    if (this._pendingAnimDir !== 0 && this._incomingEl && (t.has("_values") || t.has("_prevSlide") || t.has("_spec"))) {
      const e = this._pendingAnimDir;
      this._pendingAnimDir = 0, this._runCarouselSlide(e);
    }
  }
  get _entity() {
    return this._config?.entity ? this.hass?.states[this._config.entity] : void 0;
  }
  _getEffectiveMode(t) {
    const e = String(t?.attributes.unit_of_measurement ?? "").trim(), i = rr(t, e), s = this._config?.aggregation ?? "auto", a = (this._config?.entity ?? "").split(".")[0], r = String(t?.attributes.state_class ?? "").toLowerCase(), o = String(t?.attributes.device_class ?? "").toLowerCase();
    return s === "sum" ? { agg: "sum", isAdditive: !0, isDuration: i, unit: e } : s === "max" ? { agg: "max", isAdditive: i, isDuration: i, unit: e } : s === "avg" ? { agg: "avg", isAdditive: !1, isDuration: i, unit: e } : a === "counter" || r === "total_increasing" || r === "total" ? { agg: "sum", isAdditive: !0, isDuration: i, unit: e } : o === "duration" || i ? { agg: "max", isAdditive: !0, isDuration: !0, unit: e } : { agg: "avg", isAdditive: !1, isDuration: !1, unit: e };
  }
  _cacheKey(t, e) {
    return `${this._config?.entity ?? ""}|${this._config?.aggregation ?? "auto"}|${t}|${e}`;
  }
  _captureCurrentSlide() {
    if (!this._spec) return;
    const { isAdditive: t, isDuration: e, unit: i } = this._getEffectiveMode(this._entity);
    return {
      spec: this._spec,
      values: [...this._values],
      isDuration: e,
      isAdditive: t,
      unit: i
    };
  }
  _navigate(t, e, i) {
    const s = Math.min(0, e);
    if (t === this._range && s === this._offset) return;
    navigator.vibrate?.(6), this._hoverIdx = null, this._cancelSlideAnims(), this._prevSlide = this._captureCurrentSlide();
    const a = this._cacheKey(t, s), r = this._cache.get(a);
    this._range = t, this._offset = s, r ? (this._spec = We(t, s, this.hass), this._values = [...r], this._loading = !1, this._lastQueryKey = a, this._pendingAnimDir = i) : this._pendingAnimDir = i;
  }
  _setRange(t) {
    if (this._range === t) return;
    const e = t === "M" ? 1 : -1;
    this._navigate(t, 0, e);
  }
  _stepOffset(t) {
    const e = Math.min(0, this._offset + t);
    e !== this._offset && this._navigate(this._range, e, t);
  }
  _resetToPresent() {
    this._offset !== 0 && this._navigate(this._range, 0, 1);
  }
  _cancelSlideAnims() {
    this._animTimer !== null && (window.clearTimeout(this._animTimer), this._animTimer = null), this._outgoingAnim?.cancel(), this._incomingAnim?.cancel(), this._outgoingAnim = void 0, this._incomingAnim = void 0;
  }
  _runCarouselSlide(t) {
    this._cancelSlideAnims();
    const e = this._outgoingEl, i = this._incomingEl;
    if (!i || typeof i.animate != "function") {
      this._prevSlide = void 0;
      return;
    }
    const s = "cubic-bezier(0.2, 0, 0, 1)", a = 280, r = 36;
    e && typeof e.animate == "function" && (this._outgoingAnim = e.animate(
      [
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
        { transform: `translate3d(${-t * r}%, 0, 0)`, opacity: 0 }
      ],
      { duration: a, easing: s, fill: "forwards" }
    )), this._incomingAnim = i.animate(
      [
        { transform: `translate3d(${t * r}%, 0, 0)`, opacity: 0 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 }
      ],
      { duration: a, easing: s, fill: "both" }
    );
    const o = () => {
      this._prevSlide = void 0, this._outgoingAnim = void 0, this._incomingAnim = void 0, this._animTimer !== null && (window.clearTimeout(this._animTimer), this._animTimer = null);
    };
    this._incomingAnim.onfinish = o, this._animTimer = window.setTimeout(o, a + 40);
  }
  async _fetchDailyBuckets(t, e, i, s, a, r) {
    const o = Date.now(), n = e.bucketStarts.length;
    if (!this.hass || e.start > o)
      return Array.from({ length: n }, () => null);
    const l = new Date(e.start).toISOString(), p = new Date(Math.min(e.end, o)).toISOString();
    let c = null;
    if (typeof this.hass.callWS == "function")
      try {
        const f = (await this.hass.callWS({
          type: "recorder/statistics_during_period",
          start_time: l,
          end_time: p,
          statistic_ids: [t],
          period: "day",
          types: ["mean", "max", "sum", "state", "change"]
        }))?.[t];
        Array.isArray(f) && f.length > 0 && (c = this._bucketStatRows(f, e, i, s, a, r, o));
      } catch {
      }
    if (!c && (e.offset === 0 || e.range === "W")) {
      const h = await this._fetchRawHistory(t, l, p);
      h.length > 0 && (c = this._bucketRawRows(h, e, i, s, a, r, o));
    }
    return c || (c = e.bucketStarts.map((h) => h > o ? null : a ? 0 : null)), c;
  }
  async _fetchRawHistory(t, e, i) {
    if (!this.hass) return [];
    if (typeof this.hass.callWS == "function")
      try {
        const a = (await this.hass.callWS({
          type: "history/history_during_period",
          start_time: e,
          end_time: i,
          entity_ids: [t],
          minimal_response: !0,
          no_attributes: !0,
          significant_changes_only: !1
        }))?.[t];
        if (Array.isArray(a)) return a;
      } catch {
      }
    if (typeof this.hass.callApi == "function")
      try {
        const s = await this.hass.callApi(
          "GET",
          `history/period/${e}?end_time=${encodeURIComponent(i)}&filter_entity_id=${encodeURIComponent(t)}&minimal_response&no_attributes`
        );
        if (Array.isArray(s) && Array.isArray(s[0])) return s[0];
      } catch {
      }
    return [];
  }
  _bucketStatRows(t, e, i, s, a, r, o) {
    const n = e.bucketStarts.length, l = Array.from({ length: n }, () => null);
    let p = null;
    for (const c of t) {
      const h = typeof c.start == "number" ? c.start : Date.parse(String(c.start));
      if (!Number.isFinite(h)) continue;
      let f = null;
      if (i === "sum")
        if (c.change !== null && c.change !== void 0 && Number.isFinite(Number(c.change)))
          f = Math.max(0, Number(c.change));
        else if (c.sum !== null && c.sum !== void 0 && Number.isFinite(Number(c.sum))) {
          const u = Number(c.sum);
          p !== null && (f = Math.max(0, u - p)), p = u;
        } else {
          const u = c.state ?? c.max ?? c.mean;
          u != null && Number.isFinite(Number(u)) && (f = Math.max(0, Number(u)));
        }
      else if (i === "max") {
        const u = c.max ?? c.state ?? c.mean;
        u != null && Number.isFinite(Number(u)) && (f = Number(u));
      } else {
        const u = c.mean ?? c.state ?? c.max;
        u != null && Number.isFinite(Number(u)) && (f = Number(u));
      }
      if (c.sum !== null && c.sum !== void 0 && Number.isFinite(Number(c.sum)) && (p = Number(c.sum)), f === null || h < e.start || h >= e.end || h > o) continue;
      const m = s ? ps(f, r) : f;
      for (let u = 0; u < n; u++)
        if (h >= e.bucketStarts[u] && h < e.bucketEnds[u]) {
          l[u] = a ? (l[u] ?? 0) + Math.max(0, m) : m;
          break;
        }
    }
    return e.bucketStarts.map((c, h) => c > o ? null : l[h] !== null ? l[h] : a ? 0 : null);
  }
  _bucketRawRows(t, e, i, s, a, r, o) {
    const n = e.bucketStarts.length, l = Array.from({ length: n }, () => []);
    for (const p of t) {
      const c = Number(p.s ?? p.state);
      if (!Number.isFinite(c)) continue;
      const h = typeof p.lu == "number" ? p.lu * 1e3 : p.last_updated ? Date.parse(p.last_updated) : NaN;
      if (!Number.isFinite(h) || h < e.start || h >= e.end || h > o) continue;
      const f = s ? ps(c, r) : c;
      for (let m = 0; m < n; m++)
        if (h >= e.bucketStarts[m] && h < e.bucketEnds[m]) {
          l[m].push(f);
          break;
        }
    }
    return e.bucketStarts.map((p, c) => {
      if (p > o) return null;
      const h = l[c];
      if (h.length === 0) return a ? 0 : null;
      if (i === "sum") {
        let f = 0;
        for (let m = 1; m < h.length; m++) {
          const u = h[m] - h[m - 1];
          f += u >= 0 ? u : h[m];
        }
        return Math.max(0, f || h[h.length - 1]);
      }
      return i === "max" ? Math.max(...h) : h.reduce((f, m) => f + m, 0) / h.length;
    });
  }
  async _loadBarWindow(t, e) {
    if (!this.hass || !this._config?.entity) return;
    const i = this._cacheKey(t, e), s = ++this._fetchSeq, a = We(t, e, this.hass), { agg: r, isAdditive: o, isDuration: n, unit: l } = this._getEffectiveMode(this._entity);
    this._spec = a, this._loading = !0;
    try {
      const p = await this._fetchDailyBuckets(
        this._config.entity,
        a,
        r,
        n,
        o,
        l
      );
      if (s !== this._fetchSeq) return;
      this._cache.set(i, p), this._values = p, this._loading = !1;
      const c = this._cacheKey(t, e - 1);
      if (!this._cache.has(c)) {
        const h = We(t, e - 1, this.hass);
        this._fetchDailyBuckets(
          this._config.entity,
          h,
          r,
          n,
          o,
          l
        ).then((f) => {
          this._cache.set(c, f);
        });
      }
    } catch {
      if (s !== this._fetchSeq) return;
      this._values = a.bucketStarts.map(() => null), this._loading = !1;
    }
  }
  /* =========================================================================
     HORIZONTAL SWIPE GESTURE ON CHART STAGE (touch-action: pan-y)
     ========================================================================= */
  _onStagePointerDown(t) {
    t.button !== 0 && t.pointerType === "mouse" || (this._swipePointerId = t.pointerId, this._swipeStartX = t.clientX, this._swipeStartY = t.clientY, this._swiping = !1, this._dragOffsetPx = 0);
  }
  _onStagePointerMove(t) {
    if (this._swipePointerId !== t.pointerId) return;
    const e = t.clientX - this._swipeStartX, i = t.clientY - this._swipeStartY;
    if (!this._swiping && Math.abs(e) > 14 && Math.abs(e) > Math.abs(i) * 1.25 && (this._swiping = !0, this._hoverIdx = null, this._stageEl?.setPointerCapture?.(t.pointerId)), this._swiping && this._incomingEl) {
      const s = this._offset === 0 && e < 0 ? 0.1 : 0.3;
      this._dragOffsetPx = Math.max(-44, Math.min(44, e * s)), this._incomingEl.style.transform = `translate3d(${this._dragOffsetPx.toFixed(1)}px, 0, 0)`;
    }
  }
  _onStagePointerEnd(t) {
    if (this._swipePointerId !== t.pointerId) return;
    const e = t.clientX - this._swipeStartX, i = this._swiping;
    this._swipePointerId = null, this._swiping = !1, this._dragOffsetPx = 0, this._incomingEl && (this._incomingEl.style.transform = ""), i && Math.abs(e) >= 42 && (e > 0 ? this._stepOffset(-1) : this._offset < 0 && this._stepOffset(1));
  }
  /* =========================================================================
     SUMMARY STATS & SVG LAYER RENDERING
     ========================================================================= */
  _computeWindowSummary(t, e, i, s, a) {
    const r = ee(this.hass), o = Date.now(), n = this._config?.metric_label?.trim();
    if (s) {
      let y = 0, w = 0, S = 0;
      for (let T = 0; T < t.bucketStarts.length; T++) {
        t.bucketStarts[T] <= o && S++;
        const H = e[T];
        H !== null && H > 0 && (y += H, H > w && (w = H));
      }
      const M = Math.max(1, S), $ = y / M, L = w > 0, E = i ? bi($) : zt($, a, this.hass), C = n || (r ? "al giorno (media)" : "per day (avg)");
      let k;
      if (!L)
        k = r ? "Nessun dato registrato in questo periodo" : "No data tracked in this period";
      else {
        const T = i ? or(y, r) : zt(y, a, this.hass);
        t.offset === 0 ? k = r ? `Totale di ${T} finora ${t.range === "M" ? "questo mese" : "questa settimana"}` : `Total of ${T} so far this ${t.range === "M" ? "month" : "week"}` : k = r ? `Totale di ${T} in questo periodo` : `Total of ${T} in this period`;
      }
      return { heroText: E, heroLabel: C, subtitleText: k, hasPositiveBars: L, maxBarVal: w };
    }
    const l = e.filter((y) => y !== null && Number.isFinite(y));
    if (l.length === 0)
      return {
        heroText: r ? "Nessun dato" : "No data",
        heroLabel: n || "",
        subtitleText: r ? "Nessun dato registrato in questo periodo" : "No data tracked in this period",
        hasPositiveBars: !1,
        maxBarVal: 0
      };
    const p = l.reduce((y, w) => y + w, 0) / l.length, c = Math.min(...l), h = Math.max(...l), f = h > 0, m = zt(p, a, this.hass), u = n || (r ? "al giorno (media)" : "per day (avg)"), v = zt(c, a, this.hass), _ = zt(h, a, this.hass), x = r ? `Escursione da ${v} a ${_} nel periodo` : `Range from ${v} to ${_} in this period`;
    return { heroText: m, heroLabel: u, subtitleText: x, hasPositiveBars: f, maxBarVal: h };
  }
  _renderCapsuleSvg(t, e) {
    const { spec: i, values: s, isDuration: a, unit: r } = t, o = Math.max(1, i.bucketStarts.length), n = Math.max(240, this._plotWidth), l = 228, p = 6, c = 46, h = 18, f = l - 22, m = l - 4, u = f - 7, v = Math.max(120, n - p - c), _ = Math.max(60, u - h), x = v / o, y = i.range === "W" ? Math.max(18, Math.min(28, x * 0.54)) : Math.max(5, Math.min(8, x * 0.62)), w = y / 2, S = s.filter((I) => I !== null && I > 0), M = S.length > 0, $ = M ? Math.max(...S) : 0, L = $ > 0 ? Math.max($ * 1.08, a ? Math.ceil($) : $) : 1, E = M ? [0, 1, 2, 3].map((I) => {
      const A = I / 3, D = A * L;
      return {
        y: u - A * _,
        label: nr(D, a, r, this.hass)
      };
    }) : [], C = (I) => p + (I + 0.5) * x, T = ee(this.hass) ? "it-IT" : "en-US", H = e ? this._hoverIdx : null;
    return X`
      <svg class="chart-svg" viewBox="0 0 ${n} ${l}" role="img" aria-label=${i.periodLabel}>
        <!-- Minimal right-aligned Y-axis labels (completely hidden when no data) -->
        ${E.map(
      (I) => X`
            <text
              x=${n - 2}
              y=${(I.y + 4).toFixed(1)}
              text-anchor="end"
              class="y-tick-label"
            >${I.label}</text>
          `
    )}

        <!-- X-axis scan dots & day labels -->
        ${i.bucketStarts.map((I, A) => {
      const D = C(A);
      return X`<circle cx=${D.toFixed(1)} cy=${f} r="1.35" class="x-scan-dot" />`;
    })}

        ${i.xLabels.map((I) => {
      const A = C(I.index);
      return X`
            <text
              x=${A.toFixed(1)}
              y=${m}
              text-anchor="middle"
              class="x-tick-label"
            >${I.text}</text>
          `;
    })}

        <!-- Floating Vertical Capsule Bars (Stadium ends) -->
        ${s.map((I, A) => {
      if (I === null || I <= 0) return g;
      const D = C(A), at = I / L * _, q = Math.max(y, Math.min(_, at)), Ot = u - q, Jt = H === A, Lt = H !== null && H !== A, Qt = new Intl.DateTimeFormat(T, {
        day: "numeric",
        month: "short"
      }).format(new Date(i.bucketStarts[A])), Ze = a ? bi(I) : zt(I, r, this.hass);
      return X`
            <g class="bar-group ${Lt ? "is-dimmed" : ""} ${Jt ? "is-hovered" : ""}">
              <rect
                class="capsule-bar"
                x=${(D - y / 2).toFixed(2)}
                y=${Ot.toFixed(2)}
                width=${y.toFixed(2)}
                height=${q.toFixed(2)}
                rx=${w.toFixed(2)}
                ry=${w.toFixed(2)}
                style="transform-origin: ${D.toFixed(1)}px ${u}px;"
              />
              ${e ? X`
                    <rect
                      x=${(p + A * x).toFixed(1)}
                      y=${h}
                      width=${x.toFixed(1)}
                      height=${(f - h).toFixed(1)}
                      fill="transparent"
                      class="bar-hit"
                      @pointerenter=${(we) => {
        we.pointerType !== "touch" && (this._hoverIdx = A);
      }}
                      @pointerleave=${(we) => {
        we.pointerType !== "touch" && this._hoverIdx === A && (this._hoverIdx = null);
      }}
                      @click=${(we) => {
        we.stopPropagation(), this._hoverIdx = this._hoverIdx === A ? null : A;
      }}
                    >
                      <title>${Qt}: ${Ze}</title>
                    </rect>
                  ` : g}
            </g>
          `;
    })}

        <!-- Floating Tooltip Pill on Bar Hover/Tap -->
        ${H !== null && s[H] !== null && (s[H] ?? 0) > 0 ? (() => {
      const I = s[H], A = C(H), D = I / L * _, at = Math.max(y, Math.min(_, D)), q = Math.max(12, u - at - 8), Ot = new Intl.DateTimeFormat(T, {
        day: "numeric",
        month: "short"
      }).format(new Date(i.bucketStarts[H])), Jt = a ? bi(I) : zt(I, r, this.hass), Lt = `${Ot} · ${Jt}`, Qt = Math.max(68, Lt.length * 6.5 + 16), Ze = Math.max(Qt / 2 + 2, Math.min(n - c - Qt / 2, A));
      return X`
                <g class="bar-tooltip" pointer-events="none">
                  <rect
                    x=${(Ze - Qt / 2).toFixed(1)}
                    y=${(q - 14).toFixed(1)}
                    width=${Qt.toFixed(1)}
                    height="20"
                    rx="10"
                    class="tooltip-bg"
                  />
                  <text
                    x=${Ze.toFixed(1)}
                    y=${(q - 1).toFixed(1)}
                    text-anchor="middle"
                    class="tooltip-txt"
                  >${Lt}</text>
                </g>
              `;
    })() : g}
      </svg>
    `;
  }
  _renderBarMode() {
    const t = ee(this.hass), e = this._entity, { isAdditive: i, isDuration: s, unit: a } = this._getEffectiveMode(e), r = this._spec ?? We(this._range, this._offset, this.hass), o = this._computeWindowSummary(r, this._values, s, i, a), n = this.hass?.themes?.darkMode !== !1, l = this._config?.accent_color ?? this._config?.bar_color, p = l ? ei(l, n) : null, c = p?.accent ?? (n ? "#97D0F9" : "#BFE4FF"), h = p?.onAccent ?? "#003351", f = p?.accent ?? (n ? "#2CE0D0" : "#00BFA5"), m = {
      spec: r,
      values: this._values,
      isDuration: s,
      isAdditive: i,
      unit: a
    }, u = t ? "Settimana" : "Week", v = t ? "Mese" : "Month", _ = mt(
      this.hass,
      e,
      this._config?.name,
      this._config?.entity
    );
    return d`
      <div
        class="history-root"
        style="--history-tab-accent: ${c}; --history-tab-on-accent: ${h}; --history-bar-color: ${f};"
        @click=${() => {
      this._hoverIdx !== null && (this._hoverIdx = null);
    }}
      >
        <!-- 1. Top Dual Segmented Control (Week | Month) -->
        <div
          class="dual-tabs"
          role="tablist"
          aria-label=${t ? "Intervallo temporale" : "Time range"}
        >
          <button
            type="button"
            role="tab"
            class="dual-tab ${this._range === "W" ? "is-selected" : ""}"
            aria-selected=${String(this._range === "W")}
            @click=${() => this._setRange("W")}
          >
            ${u}
          </button>
          <button
            type="button"
            role="tab"
            class="dual-tab ${this._range === "M" ? "is-selected" : ""}"
            aria-selected=${String(this._range === "M")}
            @click=${() => this._setRange("M")}
          >
            ${v}
          </button>
        </div>

        <!-- 2. Contextual Header & Chronological Navigation -->
        <div class="header-block">
          <div class="period-row">
            <span class="period-title">
              ${this._offset === 0 ? _ : d`${_}<span class="period-suffix"> · ${r.periodLabel}</span>`}
            </span>
            <div class="nav-controls">
              <button
                type="button"
                class="nav-circle"
                aria-label=${t ? "Periodo precedente" : "Previous period"}
                @click=${() => this._stepOffset(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-circle"
                ?disabled=${this._offset === 0}
                aria-label=${t ? "Periodo successivo" : "Next period"}
                @click=${() => this._stepOffset(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-circle ${this._offset < 0 ? "is-highlighted" : ""}"
                ?disabled=${this._offset === 0}
                aria-label=${t ? "Torna al presente" : "Jump to present"}
                @click=${() => this._resetToPresent()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="hero-row">
            <span class="hero-val">${o.heroText}</span>
            ${o.heroLabel ? d`<span class="hero-lbl">${o.heroLabel}</span>` : g}
          </div>

          <div class="hero-subtitle">${o.subtitleText}</div>
        </div>

        <!-- 3. Dual-Layer Carousel Capsule Bar Chart -->
        <div
          class="chart-stage ${this._loading && !this._prevSlide ? "is-loading" : ""}"
          @pointerdown=${this._onStagePointerDown}
          @pointermove=${this._onStagePointerMove}
          @pointerup=${this._onStagePointerEnd}
          @pointercancel=${this._onStagePointerEnd}
        >
          ${this._prevSlide ? d`<div class="chart-layer outgoing">${this._renderCapsuleSvg(this._prevSlide, !1)}</div>` : g}
          <div class="chart-layer incoming">${this._renderCapsuleSvg(m, !0)}</div>
        </div>
      </div>
    `;
  }
  _renderLineMode() {
    const t = this._config?.entity;
    if (!t || !this.hass) return g;
    const e = this.hass.states[t], i = [], s = e?.attributes.entity_id;
    if (Array.isArray(s) && s.length > 0)
      for (const p of s)
        typeof p == "string" && this.hass.states[p] && !i.includes(p) && i.push(p);
    i.length === 0 && i.push(t);
    for (const p of this._config?.entities ?? [])
      p && !i.includes(p) && i.push(p);
    const a = this.hass.states[i[0]] ?? e, r = lr(a), o = String(a?.attributes.unit_of_measurement ?? "").trim(), n = this._config?.accent_color ?? this._config?.bar_color, l = mt(this.hass, e, this._config?.name, t);
    return d`
      <m3e-history-chart
        .hass=${this.hass}
        .entityIds=${i}
        .metricKind=${r}
        .unit=${o}
        .customColor=${n}
        .headerTitle=${l}
      ></m3e-history-chart>
    `;
  }
  render() {
    return this._config ? d`
      <ha-card class="history-card ${this._config.transparent ? "is-transparent" : ""}">
        ${this._config.chart_style === "line" ? this._renderLineMode() : this._renderBarMode()}
      </ha-card>
    ` : g;
  }
};
G.styles = [
  V,
  R`
      :host {
        display: block;
        width: 100%;
      }

      /* Strictly preserve M3Y --ha-card-* tokens unless user explicitly opts into transparent */
      .history-card {
        padding: 18px 18px 16px;
        display: flex;
        flex-direction: column;
      }

      ha-card.history-card.is-transparent {
        --ha-card-background: transparent;
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --ha-card-border-color: transparent;
        background: transparent;
        box-shadow: none;
        border-width: 0;
        border-color: transparent;
        padding: 6px 4px 4px;
      }

      .history-root {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* 1. Dual Segmented Control (Week | Month) */
      .dual-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
      }

      .dual-tab {
        height: 40px;
        border: 0;
        padding: 0 12px;
        border-radius: 12px;
        background: var(--md-sys-color-surface-container-high, #23262a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 0.9375rem;
        font-weight: 500;
        display: grid;
        place-items: center;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition:
          border-radius 320ms cubic-bezier(0.2, 0, 0, 1),
          background-color 240ms cubic-bezier(0.2, 0, 0, 1),
          color 200ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1));
      }

      .dual-tab:hover:not(.is-selected) {
        filter: brightness(1.08);
      }

      .dual-tab.is-selected {
        border-radius: 20px;
        background: var(--history-tab-accent);
        color: var(--history-tab-on-accent);
        font-weight: 600;
      }

      .dual-tab:active {
        transform: scale(0.96);
      }

      /* 2. Contextual Header */
      .header-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .period-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .period-title {
        font-size: 1.15rem;
        font-weight: 500;
        line-height: 1.25;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .period-suffix {
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      }

      .nav-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .nav-circle {
        width: 36px;
        height: 36px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #23262a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition:
          opacity 180ms ease,
          background-color 180ms ease,
          color 180ms ease,
          transform var(--m3e-spring-spatial-fast, 200ms ease);
      }

      .nav-circle:disabled {
        opacity: 0.35;
        cursor: default;
      }

      .nav-circle.is-highlighted {
        background: color-mix(
          in srgb,
          var(--history-tab-accent) 22%,
          var(--md-sys-color-surface-container-high, #23262a)
        );
        color: var(--history-tab-accent);
      }

      .nav-circle:not(:disabled):active {
        transform: scale(0.9);
      }

      .nav-circle svg {
        width: 20px;
        height: 20px;
      }

      .hero-row {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 2px;
      }

      .hero-val {
        font-size: 2.4rem;
        font-weight: 600;
        line-height: 1.08;
        letter-spacing: -0.025em;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .hero-lbl {
        font-size: 1rem;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      }

      .hero-subtitle {
        font-size: 0.875rem;
        line-height: 1.38;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* 3. Carousel Capsule Chart Stage */
      .chart-stage {
        position: relative;
        width: 100%;
        height: 228px;
        overflow: hidden;
        touch-action: pan-y;
        transition: opacity 180ms ease;
      }

      .chart-stage.is-loading {
        opacity: 0.45;
      }

      .chart-layer {
        width: 100%;
        height: 100%;
        will-change: transform, opacity;
      }

      .chart-layer.outgoing {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .chart-layer.outgoing .capsule-bar {
        animation: none;
      }

      .chart-layer.incoming {
        position: relative;
      }

      .chart-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }

      .y-tick-label {
        font-size: 0.75rem;
        font-weight: 500;
        fill: var(--md-sys-color-outline, #8e918f);
        font-variant-numeric: tabular-nums;
      }

      .x-scan-dot {
        fill: var(--md-sys-color-outline-variant, #5c5f5e);
      }

      .x-tick-label {
        font-size: 0.75rem;
        font-weight: 500;
        fill: var(--md-sys-color-outline, #8e918f);
        font-variant-numeric: tabular-nums;
      }

      @keyframes m3e-capsule-rise {
        from {
          transform: scaleY(0.18);
          opacity: 0.5;
        }
        to {
          transform: scaleY(1);
          opacity: 1;
        }
      }

      .bar-group {
        transition: opacity 160ms ease;
      }

      .bar-group.is-dimmed {
        opacity: 0.42;
      }

      .capsule-bar {
        fill: var(--history-bar-color);
        animation: m3e-capsule-rise 360ms var(--m3e-spring-spatial-default, cubic-bezier(0.2, 0, 0, 1)) both;
        transition: filter 160ms ease;
      }

      .bar-group.is-hovered .capsule-bar {
        filter: brightness(1.12);
      }

      .bar-hit {
        cursor: pointer;
      }

      .tooltip-bg {
        fill: var(--md-sys-color-inverse-surface, #e3e2e6);
      }

      .tooltip-txt {
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        fill: var(--md-sys-color-inverse-on-surface, #1b1b1f);
      }
    `
];
st([
  O({ attribute: !1 })
], G.prototype, "hass", 2);
st([
  b()
], G.prototype, "_config", 2);
st([
  b()
], G.prototype, "_range", 2);
st([
  b()
], G.prototype, "_offset", 2);
st([
  b()
], G.prototype, "_loading", 2);
st([
  b()
], G.prototype, "_values", 2);
st([
  b()
], G.prototype, "_spec", 2);
st([
  b()
], G.prototype, "_plotWidth", 2);
st([
  b()
], G.prototype, "_hoverIdx", 2);
st([
  b()
], G.prototype, "_prevSlide", 2);
st([
  z(".chart-stage")
], G.prototype, "_stageEl", 2);
st([
  z(".chart-layer.outgoing")
], G.prototype, "_outgoingEl", 2);
st([
  z(".chart-layer.incoming")
], G.prototype, "_incomingEl", 2);
G = st([
  B("m3e-history-card")
], G);
var cr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, Q = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? dr(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && cr(e, i, a), a;
};
const hs = 8, pr = 420, hr = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], Us = "m3e-light-recent-colors:", ur = 6;
function Vs(t) {
  try {
    const e = window.localStorage.getItem(`${Us}${t}`);
    if (!e) return [];
    const i = JSON.parse(e);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function mr(t, e) {
  try {
    const i = Vs(t).filter((a) => a.hex !== e.hex), s = [e, ...i].slice(0, ur);
    window.localStorage.setItem(`${Us}${t}`, JSON.stringify(s));
  } catch {
  }
}
function yi([t, e, i]) {
  return "#" + [t, e, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function xi(t) {
  const e = Math.max(2e3, Math.min(6500, t));
  return e <= 2400 ? [255, 224, 102] : e <= 2900 ? [255, 230, 138] : e <= 3600 ? [255, 240, 184] : e <= 4500 ? [255, 247, 224] : e <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function fr([t, e, i]) {
  const [s, a, r] = [t, e, i].map((o) => {
    const n = o / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * a + 0.0722 * r;
}
let Y = class extends N {
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
      }, pr);
    }, this._onTilePointerMove = (t) => {
      if (this._pointerId !== t.pointerId || !this._supportsBrightness) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < hs && i < hs) return;
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
    super.disconnectedCallback(), ut(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._scenesSheetOpen = !1;
    }), this._clearLongPress();
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
    return t ? Array.isArray(t.rgb_color) && t.rgb_color.length === 3 ? t.rgb_color : typeof t.color_temp_kelvin == "number" ? xi(t.color_temp_kelvin) : null : null;
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
    const t = this._config?.entity ?? "", e = [], i = /* @__PURE__ */ new Set(), s = Number(this._entity?.attributes.min_color_temp_kelvin ?? 2e3), a = Number(this._entity?.attributes.max_color_temp_kelvin ?? 6500), r = (n) => {
      if (!this._supportsRgb && !n.kelvin) return;
      const l = n.kelvin && !this._supportsRgb ? `k:${n.kelvin}` : n.hex.toLowerCase();
      i.has(l) || (i.add(l), e.push(n));
    };
    Array.isArray(this._config?.favorite_colors) && this._config.favorite_colors.forEach((n, l) => {
      const p = n.rgb_color ?? (n.color_temp_kelvin ? xi(n.color_temp_kelvin) : null);
      if (!p) return;
      const c = yi(p);
      r({
        id: `cfg-${l}-${c}`,
        label: n.label || (n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : c),
        hex: c,
        rgb: p,
        kelvin: n.color_temp_kelvin
      });
    });
    const o = this.hass?.entities?.[t]?.options?.light?.favorite_colors;
    if (Array.isArray(o) && o.forEach((n, l) => {
      const p = n.rgb_color ?? (n.color_temp_kelvin ? xi(n.color_temp_kelvin) : null);
      if (!p) return;
      const c = yi(p);
      r({
        id: `ha-${l}-${c}`,
        label: n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : c,
        hex: c,
        rgb: p,
        kelvin: n.color_temp_kelvin
      });
    }), t)
      for (const n of Vs(t))
        r(n);
    for (const n of hr)
      if (n.kelvin) {
        if (n.kelvin >= s - 200 && n.kelvin <= a + 200) {
          const l = Math.max(s, Math.min(a, n.kelvin));
          r({ ...n, kelvin: l });
        }
      } else this._supportsRgb && r(n);
    return e;
  }
  get _matchedPresetId() {
    if (this._selectedPresetId) return this._selectedPresetId;
    const t = this._activeRgb;
    if (!t) return null;
    let e = null, i = 1 / 0;
    for (const s of this._presets) {
      const a = Math.abs(s.rgb[0] - t[0]) + Math.abs(s.rgb[1] - t[1]) + Math.abs(s.rgb[2] - t[2]);
      a < i && (i = a, e = s.id);
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
    const e = yi(t), s = fr(t) > 0.42 ? "#3d2f00" : "#ffffff";
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
    const s = this._config.entity, a = this.hass.entities?.[s]?.device_id ?? null;
    if (a && this.hass.entities)
      for (const [o, n] of Object.entries(this.hass.entities))
        o.startsWith("scene.") && n.device_id === a && i(o);
    const r = this._entity?.attributes.effect_list;
    if (Array.isArray(r))
      for (const o of r) {
        const n = String(o ?? "").trim();
        if (!n) continue;
        const l = `effect:${n}`;
        e.has(l) || (e.add(l), t.push({
          kind: "effect",
          id: l,
          label: n.replace(/_/g, " ").replace(/^./, (p) => p.toUpperCase()),
          effect: n
        }));
      }
    return t;
  }
  _cleanSceneName(t) {
    const e = (t.attributes.friendly_name || t.entity_id.replace("scene.", "")).trim(), i = this.hass?.entities?.[this._config?.entity ?? ""]?.device_id, s = i ? this.hass?.devices?.[i] : void 0, a = [
      String(t.attributes.group_name ?? ""),
      s?.name_by_user ?? "",
      s?.name ?? "",
      typeof this._config?.name == "string" ? this._config.name : "",
      this._entity?.attributes.friendly_name ?? ""
    ];
    for (const r of a) {
      const o = r.trim();
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
    this._selectedPresetId = t.id, mr(this._config.entity, t);
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
    if (this._isUnavailable) return;
    if (this._popupOpen && this._dialogEl?.open) {
      let s = !0;
      try {
        s = this._dialogEl.matches(":modal");
      } catch {
      }
      if (s) return;
      this._popupOpen = !1;
    }
    window.getSelection()?.removeAllRanges();
    const t = this._tileEl?.getBoundingClientRect();
    this._scenesSheetOpen = !1, this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    if (!e) {
      this._popupOpen = !1;
      return;
    }
    Kt(e, i, {
      originRect: t,
      onRequestClose: () => this.closePopup(),
      onForceReset: () => {
        this._popupOpen = !1, this._scenesSheetOpen = !1;
      }
    });
  }
  closePopup() {
    qt(this._dialogEl, this._dialogSurfaceEl, () => {
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
    const s = (i.bottom - t) / i.height, a = Math.round(Math.max(0, Math.min(1, s)) * 100);
    return Math.max(1, a);
  }
  /* =========================================================================
     ICONS
     ========================================================================= */
  _renderBulbIcon(t, e) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return d`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const i = this._entity.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${i}></ha-icon>`;
    }
    return e ? d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        ` : d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `;
  }
  _renderSunIcon() {
    return d`
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
    if (!this._config) return g;
    const t = this._entity, e = mt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._isOn, a = this._brightnessPct, r = this._isUnavailable ? "Offline" : this._dragging && this._supportsBrightness ? `${a}%` : s ? this._supportsBrightness ? `On · ${a}%` : "On" : "Off", o = !!this._config.hide_state, n = !o && !this._dragging ? fe(this.hass, t, this._config.state_content, r) : null, l = o && !this._dragging ? "" : n ?? r, p = this._computeColorVars(), c = this._matchedPresetId, h = this._popupOpen ? this._getAvailableScenes() : [], f = this._popupOpen ? Ne(t?.last_changed) : null, m = `style-${this._config.card_style ?? "default"}`;
    return d`
      <ha-card
        class="tile-card ${m} ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${p} --fill-pct: ${s ? a : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${e}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${a}
        aria-valuetext=${l}
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
            ${l ? d`<span class="subtitle">${l}</span>` : g}
          </div>
          ${this._isUnavailable ? d`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : g}
        </div>
      </ha-card>

      <dialog
        class="light-dialog"
        style="${p}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
        @touchmove=${(u) => At(u, this._dialogEl)}
      >
        ${this._popupOpen ? d`
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
                    ${f ? d`<span class="dialog-last-changed">${f}</span>` : g}
                  </div>
                  <div class="header-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label=${P(this.hass, "history")}
                      title=${P(this.hass, "history_tooltip")}
                      @click=${() => {
      const u = this._config?.entity;
      u && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: u, view: "history" }
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
                      aria-label="${s ? P(this.hass, "turn_off") : P(this.hass, "turn_on")} ${e}"
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
                    style="--fill-pct: ${s ? a : 0}%;"
                  >
                    <!-- Floating percentage tooltip on the left during drag -->
                    <div
                      class="drag-tooltip ${this._popupDragging ? "visible" : ""}"
                      aria-hidden="true"
                    >
                      ${a}%
                    </div>

                    <!-- Vertical clipped-fill capsule slider -->
                    <div
                      class="capsule-slider"
                      role="slider"
                      tabindex="0"
                      aria-label="${e} brightness"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${a}
                      aria-valuetext=${s ? `${a}%` : "Off"}
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
                      ${s ? d`
                            <div class="sun-layer sun-filled" aria-hidden="true">
                              ${this._renderSunIcon()}
                            </div>
                          ` : g}
                    </div>
                  </div>

                  <div class="readout">
                    <span class="readout-value">${s ? `${a}%` : "Off"}</span>
                    <span class="readout-label ${s ? "" : "hidden"}">Brightness</span>
                  </div>
                </div>

                ${this._presets.length > 0 || h.length > 0 ? d`
                      <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                        <button
                          type="button"
                          class="palette-btn ${this._scenesSheetOpen ? "is-open" : ""}"
                          title=${h.length > 0 ? "Scene" : "More info"}
                          @click=${() => {
      h.length > 0 ? this._scenesSheetOpen = !this._scenesSheetOpen : this._config && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: this._config.entity }
        })
      ));
    }}
                          aria-label=${h.length > 0 ? "Scenes" : "Color picker"}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                            />
                          </svg>
                        </button>

                        ${this._presets.map(
      (u) => d`
                            <button
                              type="button"
                              class="color-swatch ${s && c === u.id ? "selected" : ""}"
                              style="background: ${u.hex};"
                              role="radio"
                              aria-checked=${String(s && c === u.id)}
                              aria-label=${u.label}
                              title=${u.label}
                              @click=${() => this._selectPreset(u)}
                            ></button>
                          `
    )}
                      </div>
                    ` : g}
                ${this._scenesSheetOpen && h.length > 0 ? d`
                      <div
                        class="scenes-sheet-backdrop"
                        @click=${() => this._scenesSheetOpen = !1}
                      >
                        <div class="scenes-sheet" @click=${(u) => u.stopPropagation()}>
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
                            ${h.map((u) => {
      const v = String(this._entity?.attributes.effect ?? ""), _ = u.kind === "effect" ? v.toLowerCase() === u.effect.toLowerCase() : this._activeSceneId === u.id;
      return d`
                                <button
                                  type="button"
                                  class="scene-option ${_ ? "selected" : ""}"
                                  @click=${() => this._activateSceneItem(u)}
                                >
                                  <span class="scene-option-left">
                                    ${u.kind === "scene" && typeof customElements < "u" && customElements.get("ha-state-icon") ? d`<ha-state-icon
                                          class="scene-ha-icon"
                                          .hass=${this.hass}
                                          .stateObj=${u.entity}
                                        ></ha-state-icon>` : d`<svg viewBox="0 0 24 24" class="scene-svg"><path fill="currentColor" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"/></svg>`}
                                    <span>${u.label}</span>
                                  </span>
                                  ${_ ? d`<span>✓</span>` : g}
                                </button>
                              `;
    })}
                          </div>
                        </div>
                      </div>
                    ` : g}
              </div>
            ` : g}
      </dialog>
    `;
  }
};
Y.styles = [
  V,
  R`
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
Q([
  O({ attribute: !1 })
], Y.prototype, "hass", 2);
Q([
  b()
], Y.prototype, "_config", 2);
Q([
  b()
], Y.prototype, "_dragging", 2);
Q([
  b()
], Y.prototype, "_pressed", 2);
Q([
  b()
], Y.prototype, "_dragPct", 2);
Q([
  b()
], Y.prototype, "_popupOpen", 2);
Q([
  b()
], Y.prototype, "_popupDragging", 2);
Q([
  b()
], Y.prototype, "_popupDragPct", 2);
Q([
  b()
], Y.prototype, "_selectedPresetId", 2);
Q([
  b()
], Y.prototype, "_scenesSheetOpen", 2);
Q([
  b()
], Y.prototype, "_activeSceneId", 2);
Q([
  z("dialog.light-dialog")
], Y.prototype, "_dialogEl", 2);
Q([
  z(".tile-card")
], Y.prototype, "_tileEl", 2);
Q([
  z(".dialog-surface")
], Y.prototype, "_dialogSurfaceEl", 2);
Y = Q([
  B("m3e-light-card")
], Y);
var gr = Object.defineProperty, _r = Object.getOwnPropertyDescriptor, di = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? _r(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && gr(e, i, a), a;
};
let le = class extends N {
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
    const e = t.currentTarget, i = e.getBoundingClientRect(), s = Math.max(i.width, i.height) * 2.1, a = t.clientX - i.left - s / 2, r = t.clientY - i.top - s / 2, o = document.createElement("span");
    o.className = "m3-ripple", o.style.width = `${s}px`, o.style.height = `${s}px`, o.style.left = `${a}px`, o.style.top = `${r}px`, e.appendChild(o);
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
    if (!this._config) return g;
    const t = this._optimisticOn !== null ? this._optimisticOn : this._computeAnyOn(), e = this._config.label_on?.trim() || "All on", i = this._config.label_off?.trim() || "All off", s = !!this._config.use_theme_color, a = this._isDark;
    return d`
      <ha-card
        class="control-pill ${t ? "state-on" : "state-off"} ${s ? "use-theme" : ""} ${a ? "is-dark" : "is-light"}"
        role="group"
        aria-label="Light control"
      >
        <!-- Sliding shared-element active indicator with razor-sharp curved border & straight center edge -->
        <div class="pill-indicator" aria-hidden="true"></div>

        <button
          type="button"
          class="seg-btn seg-left ${t ? "is-selected" : ""}"
          aria-pressed=${String(t)}
          @pointerdown=${(r) => this._spawnRipple(r)}
          @click=${() => this._trigger(!0)}
        >
          <span class="seg-label">${e}</span>
        </button>

        <button
          type="button"
          class="seg-btn seg-right ${t ? "" : "is-selected"}"
          aria-pressed=${String(!t)}
          @pointerdown=${(r) => this._spawnRipple(r)}
          @click=${() => this._trigger(!1)}
        >
          <span class="seg-label">${i}</span>
        </button>
      </ha-card>
    `;
  }
};
le.styles = [
  V,
  R`
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
di([
  O({ attribute: !1 })
], le.prototype, "hass", 2);
di([
  b()
], le.prototype, "_config", 2);
di([
  b()
], le.prototype, "_optimisticOn", 2);
le = di([
  B("m3e-light-control-card")
], le);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vr = (t) => t.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const br = { CHILD: 2 }, yr = (t) => (...e) => ({ _$litDirective$: t, values: e });
class xr {
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
const Oe = (t, e) => {
  const i = t._$AN;
  if (i === void 0) return !1;
  for (const s of i) s._$AO?.(e, !1), Oe(s, e);
  return !0;
}, si = (t) => {
  let e, i;
  do {
    if ((e = t._$AM) === void 0) break;
    i = e._$AN, i.delete(t), t = e;
  } while (i?.size === 0);
}, Zs = (t) => {
  for (let e; e = t._$AM; t = e) {
    let i = e._$AN;
    if (i === void 0) e._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(t)) break;
    i.add(t), Cr(e);
  }
};
function wr(t) {
  this._$AN !== void 0 ? (si(this), this._$AM = t, Zs(this)) : this._$AM = t;
}
function $r(t, e = !1, i = 0) {
  const s = this._$AH, a = this._$AN;
  if (a !== void 0 && a.size !== 0) if (e) if (Array.isArray(s)) for (let r = i; r < s.length; r++) Oe(s[r], !1), si(s[r]);
  else s != null && (Oe(s, !1), si(s));
  else Oe(this, t);
}
const Cr = (t) => {
  t.type == br.CHILD && (t._$AP ??= $r, t._$AQ ??= wr);
};
class kr extends xr {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, i, s) {
    super._$AT(e, i, s), Zs(this), this.isConnected = e._$AU;
  }
  _$AO(e, i = !0) {
    e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), i && (Oe(this, e), si(this));
  }
  setValue(e) {
    if (vr(this._$Ct)) this._$Ct._$AI(e, this);
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
const wi = /* @__PURE__ */ new WeakMap(), Ti = yr(class extends kr {
  render(t) {
    return g;
  }
  update(t, [e]) {
    const i = e !== this.G;
    return i && this.rt(void 0), (i || this.lt !== this.ct) && (this.G = e, this.ht = t.options?.host, this.rt(this.ct = t.element)), g;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let i = wi.get(e);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), wi.set(e, i)), i.get(this.G) !== void 0 && this.G.call(this.ht, void 0), i.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    return typeof this.G == "function" ? wi.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var Sr = Object.defineProperty, Er = Object.getOwnPropertyDescriptor, gt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Er(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Sr(e, i, a), a;
};
const us = 8;
let rt = class extends N {
  constructor() {
    super(...arguments), this._expanded = !1, this._popupOpen = !1, this._dragging = !1, this._pressed = !1, this._dragPct = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._prevStates = {}, this._onHeaderPointerDown = (t) => {
      if (t.button !== 0 || this._aggregateStats.isUnavailable) return;
      const e = t.currentTarget;
      this._pointerId = t.pointerId, this._pointerStartX = t.clientX, this._pointerStartY = t.clientY, this._hasMoved = !1, this._pressed = !0, e.setPointerCapture(t.pointerId);
    }, this._onHeaderPointerMove = (t) => {
      if (this._pointerId !== t.pointerId) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < us && i < us) return;
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
        const a = this.hass.states[s];
        a !== this._prevStates[s] && (this._prevStates[s] = a, i = !0);
      }
      return i;
    }
    return !1;
  }
  get _aggregateStats() {
    const t = this._groupEntity, i = this._childEntityIds.map((l) => this.hass?.states[l]).filter((l) => !!l), s = i.filter((l) => l.state === "on"), a = i.length > 0 ? s.length : t?.state === "on" ? 1 : 0;
    let r = 0;
    if (this._dragging && this._dragPct !== null)
      r = this._dragPct;
    else if (s.length > 0) {
      const l = s.map(
        (p) => typeof p.attributes.brightness == "number" ? Math.max(1, Math.round(p.attributes.brightness / 255 * 100)) : 100
      );
      r = Math.round(l.reduce((p, c) => p + c, 0) / l.length);
    } else if (t?.state === "on") {
      const l = t.attributes.brightness;
      r = typeof l == "number" ? Math.max(1, Math.round(l / 255 * 100)) : 100;
    }
    const o = this._dragging && this._dragPct !== null ? this._dragPct > 0 : a > 0, n = !t || t.state === "unavailable" || t.state === "unknown";
    return { onCount: a, totalCount: i.length, avgPct: r, isOn: o, isUnavailable: n };
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
  disconnectedCallback() {
    super.disconnectedCallback();
    const t = this._dialogSurfaceEl ?? this.shadowRoot?.querySelector(".dialog-surface");
    ut(this._dialogEl, t, () => {
      this._popupOpen = !1;
    });
  }
  async _openPopup() {
    if (this._popupOpen && this._dialogEl?.open) {
      let s = !0;
      try {
        s = this._dialogEl.matches(":modal");
      } catch {
      }
      if (s) return;
      this._popupOpen = !1;
    }
    const t = this._headerEl?.getBoundingClientRect() ?? null;
    this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl;
    if (!e) {
      this._popupOpen = !1;
      return;
    }
    const i = this._dialogSurfaceEl ?? this.shadowRoot?.querySelector(".dialog-surface");
    Kt(e, i, {
      originRect: t,
      onRequestClose: () => this._closePopup(),
      onForceReset: () => {
        this._popupOpen = !1;
      }
    });
  }
  _closePopup() {
    const t = this._dialogSurfaceEl ?? this.shadowRoot?.querySelector(".dialog-surface");
    qt(this._dialogEl, t, () => {
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
      return d`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._groupEntity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${this._groupEntity}></ha-state-icon>`;
      const e = this._groupEntity.attributes.icon;
      if (e && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${e}></ha-icon>`;
    }
    return d`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5 11h4.5l-1.2-5H6.2L5 11Zm2.25 1v6H5v2h6.5v-2H9.25v-6h-2ZM15 4v3.2a3.5 3.5 0 0 0-2.5 3.3h7A3.5 3.5 0 0 0 17 7.2V4h-2Zm-1.2 8a2.2 2.2 0 0 0 4.4 0h-4.4Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return g;
    const t = this._groupEntity, e = mt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._childEntityIds, { onCount: a, totalCount: r, avgPct: o, isOn: n, isUnavailable: l } = this._aggregateStats, p = l ? "Offline" : this._dragging ? `${o}%` : n ? r > 1 ? `${a} on · ${o}%` : `On · ${o}%` : "Off", c = !!this._config.hide_state, h = !c && !this._dragging ? fe(this.hass, t, this._config.state_content, p) : null, f = c && !this._dragging ? "" : h ?? p, m = `style-${this._config.card_style ?? "default"}`, u = this._computeAccentCss(), v = !!this._config.compact;
    return d`
      <div class="group-wrapper ${v ? "is-compact" : ""}">
        <ha-card
          class="group-header ${m} ${v ? "is-compact" : ""} ${n ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${l ? "is-unavailable" : ""}"
          style="${u} --fill-pct: ${n ? o : 0}%;"
          role="slider"
          tabindex="0"
          aria-label=${e}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${o}
          aria-valuetext=${f}
          @pointerdown=${this._onHeaderPointerDown}
          @pointermove=${this._onHeaderPointerMove}
          @pointerup=${this._onHeaderPointerUp}
          @pointercancel=${(_) => this._resetPointer(_.currentTarget)}
        >
          <div class="header-track" aria-hidden="true">
            <div class="header-fill"></div>
          </div>
          <div class="state-layer" aria-hidden="true"></div>

          <div class="header-content">
            <span class="group-icon">${this._renderGroupIcon(i)}</span>
            <div class="meta">
              <span class="title">${e}</span>
              ${f ? d`<span class="subtitle">${f}</span>` : g}
            </div>

            ${l ? d`
                  <span class="offline-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                      />
                    </svg>
                  </span>
                ` : s.length > 0 ? d`
                    <button
                      type="button"
                      class="expand-btn ${v ? "is-compact-chevron" : ""} ${!v && this._expanded ? "is-expanded" : ""}"
                      aria-expanded=${String(v ? this._popupOpen : this._expanded)}
                      aria-label=${v ? "Apri luci del gruppo" : this._expanded ? "Collapse lights" : "Expand lights"}
                      @pointerdown=${(_) => _.stopPropagation()}
                      @pointermove=${(_) => _.stopPropagation()}
                      @pointerup=${(_) => _.stopPropagation()}
                      @click=${this._toggleExpand}
                    >
                      ${v ? d`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                              />
                            </svg>
                          ` : d`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                              />
                            </svg>
                          `}
                    </button>
                  ` : g}
          </div>
        </ha-card>

        ${!v && s.length > 0 ? d`
              <div class="group-grid-collapse ${this._expanded ? "is-open" : ""}">
                <div class="group-grid-inner">
                  <div class="child-grid">
                    ${s.map(
      (_) => d`
                        <m3e-light-card
                          .hass=${this.hass}
                          ${Ti(this._attachChildConfig(_))}
                        ></m3e-light-card>
                      `
    )}
                  </div>
                </div>
              </div>
            ` : g}
      </div>

      ${v ? d`
            <dialog
              class="group-dialog"
              @click=${(_) => {
      _.target === this._dialogEl && this._closePopup();
    }}
              @cancel=${(_) => {
      _.preventDefault(), this._closePopup();
    }}
              @touchmove=${(_) => At(_, this._dialogEl)}
            >
              ${this._popupOpen ? d`
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
                          <span class="dialog-sub">${f}</span>
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
      (_) => d`
                            <m3e-light-card
                              .hass=${this.hass}
                              ${Ti(this._attachChildConfig(_))}
                            ></m3e-light-card>
                          `
    )}
                      </div>
                    </div>
                  ` : g}
            </dialog>
          ` : g}
    `;
  }
  _attachChildConfig(t) {
    return (e) => {
      if (!e || !(e instanceof HTMLElement)) return;
      const i = e, s = this._config?.card_style ?? "default", a = this._config?.use_light_color ?? !0;
      (i._m3eBoundId !== t || i._m3eBoundStyle !== s || i._m3eBoundColor !== a) && (i._m3eBoundId = t, i._m3eBoundStyle = s, i._m3eBoundColor = a, i.setConfig({
        type: "custom:m3e-light-card",
        entity: t,
        use_light_color: a,
        card_style: s
      }));
    };
  }
};
rt.styles = [
  V,
  R`
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
gt([
  O({ attribute: !1 })
], rt.prototype, "hass", 2);
gt([
  b()
], rt.prototype, "_config", 2);
gt([
  b()
], rt.prototype, "_expanded", 2);
gt([
  b()
], rt.prototype, "_popupOpen", 2);
gt([
  b()
], rt.prototype, "_dragging", 2);
gt([
  b()
], rt.prototype, "_pressed", 2);
gt([
  b()
], rt.prototype, "_dragPct", 2);
gt([
  z("dialog.group-dialog")
], rt.prototype, "_dialogEl", 2);
gt([
  z(".dialog-surface")
], rt.prototype, "_dialogSurfaceEl", 2);
gt([
  z(".group-header")
], rt.prototype, "_headerEl", 2);
rt = gt([
  B("m3e-light-group-card")
], rt);
const ms = [
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
], Mr = {
  spotifyplus: "spotify",
  spotcast: "spotify",
  alexa_media: "alexa"
};
function Pr(t, e) {
  if (!e) return null;
  const i = t?.entities?.[e.entity_id]?.platform?.trim().toLowerCase() || "", s = Mr[i] || i, a = String(e.attributes.app_name ?? "").trim(), r = String(e.attributes.source ?? "").trim(), o = String(e.attributes.icon ?? "").trim();
  if (a) {
    for (const [n, l] of ms)
      if (n.test(a)) return l;
  }
  if (s)
    return s;
  for (const n of [r, o, e.entity_id])
    if (n) {
      for (const [l, p] of ms)
        if (l.test(n)) return p;
    }
  return null;
}
function Ws(t, e) {
  const i = Pr(t, e);
  if (i) {
    const s = `https://brands.home-assistant.io/_/${encodeURIComponent(i)}/icon.png`;
    return d`
      <span class="app-badge is-brand" title=${i} aria-label=${i}>
        <img
          class="brand-icon-img"
          src=${s}
          alt=${i}
          loading="lazy"
          @error=${(a) => {
      const r = a.currentTarget;
      r.style.display = "none";
      const o = r.nextElementSibling;
      o && (o.style.display = "block");
    }}
        />
        <svg viewBox="0 0 24 24" class="brand-fallback-svg" style="display:none" aria-hidden="true">
          <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
        </svg>
      </span>
    `;
  }
  return d`
    <span class="app-badge is-tonal" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
      </svg>
    </span>
  `;
}
const Ht = /* @__PURE__ */ new Map();
function Tr(t, e, i) {
  t /= 255, e /= 255, i /= 255;
  const s = Math.max(t, e, i), a = Math.min(t, e, i), r = (s + a) / 2;
  if (s === a) return [0, 0, r];
  const o = s - a, n = r > 0.5 ? o / (2 - s - a) : o / (s + a);
  let l = 0;
  return s === t ? l = ((e - i) / o + (e < i ? 6 : 0)) / 6 : s === e ? l = ((i - t) / o + 2) / 6 : l = ((t - e) / o + 4) / 6, [l * 360, n * 100, r * 100];
}
async function Vi(t) {
  return t ? Ht.has(t) ? Ht.get(t) ?? null : new Promise((e) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => {
      try {
        const a = document.createElement("canvas");
        a.width = 24, a.height = 24;
        const r = a.getContext("2d", { willReadFrequently: !0 });
        if (!r) {
          Ht.set(t, null), e(null);
          return;
        }
        r.drawImage(i, 0, 0, 24, 24);
        const o = r.getImageData(0, 0, 24, 24).data, n = new Array(24);
        for (let $ = 0; $ < 24; $++) n[$] = { w: 0, hSin: 0, hCos: 0, s: 0 };
        let l = 0, p = 0;
        for (let $ = 0; $ < o.length; $ += 4) {
          if (o[$ + 3] < 128) continue;
          const [L, E, C] = Tr(o[$], o[$ + 1], o[$ + 2]);
          if (p++, l += E, E < 12 || C < 10 || C > 92) continue;
          const k = Math.floor(L % 360 / 15) % 24, T = 1 - Math.abs(C - 50) / 52, H = E / 100 * (0.4 + 0.6 * T), I = L * Math.PI / 180;
          n[k].w += H, n[k].hSin += Math.sin(I) * H, n[k].hCos += Math.cos(I) * H, n[k].s += E * H;
        }
        let c = n[0];
        for (let $ = 1; $ < 24; $++)
          n[$].w > c.w && (c = n[$]);
        if (c.w < 0.7 || p > 0 && l / p < 5) {
          const $ = {
            scrim: "hsl(240, 6%, 11%)",
            accent: "hsl(28, 16%, 90%)",
            onAccent: "hsl(240, 8%, 13%)",
            containerDark: "hsl(30, 8%, 22%)",
            onContainerDark: "hsl(30, 12%, 92%)",
            containerLight: "hsl(30, 14%, 89%)",
            onContainerLight: "hsl(30, 10%, 16%)"
          };
          Ht.set(t, $), e($);
          return;
        }
        let h = Math.atan2(c.hSin, c.hCos) * 180 / Math.PI;
        h < 0 && (h += 360);
        const f = Math.round(h), m = c.s / c.w, u = Math.round(Math.max(18, Math.min(46, m * 0.55))), v = Math.round(Math.max(42, Math.min(82, m * 0.95))), _ = Math.round(Math.max(28, Math.min(60, m * 0.65))), x = Math.round(Math.max(22, Math.min(48, m * 0.62))), y = Math.round(Math.max(24, Math.min(72, m * 0.78))), w = Math.round(Math.max(30, Math.min(74, m * 0.82))), S = Math.round(Math.max(28, Math.min(62, m * 0.68))), M = {
          scrim: `hsl(${f}, ${u}%, 12%)`,
          accent: `hsl(${f}, ${v}%, 86%)`,
          onAccent: `hsl(${f}, ${_}%, 14%)`,
          containerDark: `hsl(${f}, ${x}%, 22%)`,
          onContainerDark: `hsl(${f}, ${y}%, 91%)`,
          containerLight: `hsl(${f}, ${w}%, 88%)`,
          onContainerLight: `hsl(${f}, ${S}%, 16%)`
        };
        Ht.set(t, M), e(M);
      } catch {
        Ht.set(t, null), e(null);
      }
    }, i.onerror = () => {
      Ht.set(t, null), e(null);
    }, i.src = t;
  }) : null;
}
var Ar = Object.defineProperty, Or = Object.getOwnPropertyDescriptor, K = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Or(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Ar(e, i, a), a;
};
const Lr = 4;
function fs(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), a = e % 60, r = a < 10 ? `0${a}` : String(a);
  if (i > 0) {
    const o = s < 10 ? `0${s}` : String(s);
    return `${i}:${o}:${r}`;
  }
  return `${s}:${r}`;
}
let Z = class extends N {
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
    i && (i.open || i.showModal(), Ns(this._dialogSurfaceEl, t));
  }
  close() {
    this._stopTicker(), Rs(this._dialogEl, this._dialogSurfaceEl, () => {
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
      const a = String(
        e.attributes.entity_picture_local || e.attributes.entity_picture || ""
      ).trim();
      a !== this._lastArtworkUrl && (this._lastArtworkUrl = a, a ? Vi(a).then((r) => {
        this._lastArtworkUrl === a && (this._palette = r);
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
      const a = Date.parse(s);
      if (!Number.isNaN(a))
        return Math.max(0, Math.min(e, i + Math.max(0, (this._nowTick - a) / 1e3)));
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
    return Ws(this.hass, t);
  }
  render() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "playing", s = !!t?.attributes.is_volume_muted, a = t?.attributes.friendly_name || this.entityId || "Media", r = String(t?.attributes.media_title ?? "").trim() || a, o = String(t?.attributes.media_artist ?? "").trim() || String(t?.attributes.media_album_name ?? "").trim() || (i ? "In riproduzione" : e.charAt(0).toUpperCase() + e.slice(1)), n = String(
      t?.attributes.entity_picture_local || t?.attributes.entity_picture || ""
    ).trim(), l = this._duration, p = this._progressPct, c = this._scrubPct !== null ? this._scrubPct / 100 * l : this._currentPosition, h = i && !this._scrubbing && l > 0, f = this._volumePct, m = !!t?.attributes.shuffle, u = String(t?.attributes.repeat ?? "off").toLowerCase(), v = Array.from(
      new Set([this.entityId, ...this.playerIds ?? []].filter(Boolean))
    ), _ = Array.isArray(t?.attributes.source_list) ? Array.from(
      new Set(
        t.attributes.source_list.map((E) => String(E ?? "").trim()).filter(Boolean)
      )
    ) : [], x = String(t?.attributes.source ?? ""), y = !t || e === "unavailable" || e === "unknown", w = Number(t?.attributes.supported_features ?? 0), S = !y && (w === 0 || (w & Lr) !== 0 || typeof t?.attributes.volume_level == "number"), M = _.length > 0 || v.length > 1, $ = s ? 0 : f, L = this._palette ? `--mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};` : "";
    return d`
      <dialog
        class="media-dialog"
        style=${L}
        @click=${(E) => {
      E.target === this._dialogEl && this.close();
    }}
        @cancel=${(E) => {
      E.preventDefault(), this.close();
    }}
        @touchmove=${(E) => At(E, this._dialogEl)}
      >
        ${this._open ? d`
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

                  <span class="dialog-title">${P(this.hass, "now_playing")}</span>

                  <div class="header-right">
                    ${this._renderAppBadge(t)}
                    <button
                      type="button"
                      class="icon-btn"
                      @click=${() => this._openMoreInfo("history")}
                      aria-label=${P(this.hass, "history")}
                      title=${P(this.hass, "history_tooltip")}
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
                      aria-label=${P(this.hass, "more_options")}
                      title=${P(this.hass, "ha_details")}
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
                    ${n ? d`<img class="artwork-img" src=${n} alt="" />` : d`
                          <svg viewBox="0 0 24 24" class="artwork-fallback" aria-hidden="true">
                            <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                          </svg>
                        `}
                  </div>
                </div>

                <!-- Centered Track Title & Artist -->
                <div class="meta-block">
                  <div class="meta-title">${r}</div>
                  <div class="meta-artist">${o}</div>
                </div>

                <!-- M3 Expressive Wavy Progress Slider + Clocks -->
                <div class="progress-block">
                  <div
                    class="wavy-slider ${h ? "is-wavy" : "is-flat"} ${this._scrubbing ? "is-scrubbing" : ""} ${l > 0 ? "is-seekable" : ""}"
                    role="slider"
                    aria-label="Avanzamento"
                    aria-valuemin="0"
                    aria-valuemax=${l}
                    aria-valuenow=${Math.round(c)}
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
                    <span>${fs(c)}</span>
                    <span>${fs(l)}</span>
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
                    ${i ? d`
                          <svg viewBox="0 0 24 24">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        ` : d`
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
                    class="ctrl-btn toggle-ctrl ${u !== "off" ? "is-active" : ""}"
                    aria-label="Ripeti"
                    aria-pressed=${String(u !== "off")}
                    title=${u === "one" ? "Ripeti brano" : u === "all" ? "Ripeti tutto" : "Ripetizione spenta"}
                    @click=${() => this._cycleRepeat()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d=${u === "one" ? "M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Zm-4-2V9h-1l-2 1v1h1.5v4H13Z" : "M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Z"}
                      />
                    </svg>
                    <span class="active-dot" aria-hidden="true"></span>
                  </button>
                </div>

                <!-- Authentic M3 Expressive Volume Slider (50px Pill Track + Gap + Vertical Handle + Stop Dot) -->
                ${S ? d`
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
                              d=${s || f === 0 ? "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z" : f < 50 ? "M5 9v6h4l5 5V4L9 9H5Zm11.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z" : "M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"}
                            />
                          </svg>
                        </button>

                        <div
                          class="m3-vol-track ${this._volDragging ? "is-dragging" : ""}"
                          role="slider"
                          aria-label="Volume"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow=${$}
                          @pointerdown=${this._onVolDown}
                          @pointermove=${this._onVolMove}
                          @pointerup=${this._onVolUp}
                          @pointercancel=${this._onVolUp}
                        >
                          ${this._volDragging ? d`<span class="m3-vol-tooltip" style="left: ${$}%;">${$}%</span>` : g}
                          <div
                            class="m3-vol-active"
                            style="width: max(0px, calc(${$}% - 6px));"
                          ></div>
                          <div class="m3-vol-handle" style="left: ${$}%;"></div>
                          <div
                            class="m3-vol-inactive"
                            style="left: calc(${$}% + 6px);"
                          >
                            ${$ < 96 ? d`<span class="m3-vol-stop" aria-hidden="true"></span>` : g}
                          </div>
                        </div>

                        <span class="m3-vol-readout">${s ? "Muto" : `${f}%`}</span>
                      </div>
                    ` : g}

                <!-- M3 Expressive Compact Pill Source / Output Selector -->
                <button
                  type="button"
                  class="cast-pill-btn ${y ? "is-disabled" : ""}"
                  ?disabled=${y}
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
                      ${x || a}
                    </span>
                  </span>
                  ${M ? d`
                        <svg viewBox="0 0 24 24" class="cast-pill-chevron" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                          />
                        </svg>
                      ` : g}
                </button>

                <!-- Inline Cast / Source Bottom Sheet (Screen 2) -->
                ${this._castSheetOpen ? d`
                      <div
                        class="cast-sheet-backdrop"
                        @click=${() => this._castSheetOpen = !1}
                      >
                        <div class="cast-sheet" @click=${(E) => E.stopPropagation()}>
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
                              ${n ? d`<img src=${n} alt="" />` : d`
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
                              <div class="cast-mini-title">${r}</div>
                              <div class="cast-mini-artist">${o}</div>
                            </div>
                          </div>

                          <!-- Output Devices (M3 Expressive Pill = Selected, 20px = Unselected) -->
                          <div class="cast-list" role="radiogroup" aria-label="Dispositivi Cast">
                            ${v.map((E) => {
      const C = this.hass?.states[E], k = E === this.entityId, T = C?.attributes.friendly_name || E, H = String(C?.attributes.source ?? "").trim(), I = H || T, A = typeof C?.attributes.volume_level == "number" ? Math.round(C.attributes.volume_level * 100) : null, D = C?.attributes.device_class === "tv" || E.toLowerCase().includes("tv") || E.toLowerCase().includes("chromecast") || H.toLowerCase().includes("tv") || H.toLowerCase().includes("chromecast");
      return d`
                                <button
                                  type="button"
                                  class="cast-row ${k ? "is-selected" : ""}"
                                  role="radio"
                                  aria-checked=${String(k)}
                                  @click=${() => this._selectPlayer(E)}
                                >
                                  ${k && A !== null ? d`<span class="cast-row-fill" style="width: ${A}%;"></span>` : g}
                                  <span class="cast-row-inner">
                                    <span class="cast-row-left">
                                      <svg viewBox="0 0 24 24" class="cast-dev-icon" aria-hidden="true">
                                        <path
                                          fill="currentColor"
                                          d=${D ? "M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z" : "M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"}
                                        />
                                      </svg>
                                      <span class="cast-row-text">
                                        <span class="cast-row-name">${I}</span>
                                        ${k && A !== null ? d`<span class="cast-row-sub">${A}%</span>` : g}
                                      </span>
                                    </span>
                                    <span class="cast-check ${k ? "checked" : ""}" aria-hidden="true">
                                      ${k ? d`
                                            <svg viewBox="0 0 24 24">
                                              <path
                                                fill="currentColor"
                                                d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                              />
                                            </svg>
                                          ` : g}
                                    </span>
                                  </span>
                                </button>
                              `;
    })}
                          </div>

                          <!-- Sources (M3 Expressive Filter Chips with Checkmark & Shape Morph) -->
                          ${_.length > 0 ? d`
                                <div class="cast-section-label">${P(this.hass, "sources")}</div>
                                <div class="source-chips" role="radiogroup" aria-label=${P(this.hass, "sources")}>
                                  ${_.map((E) => {
      const C = E === x;
      return d`
                                      <button
                                        type="button"
                                        class="source-chip ${C ? "is-selected" : ""}"
                                        role="radio"
                                        aria-checked=${String(C)}
                                        @click=${() => this._selectSource(E)}
                                      >
                                        ${C ? d`
                                              <svg viewBox="0 0 24 24" class="chip-check" aria-hidden="true">
                                                <path
                                                  fill="currentColor"
                                                  d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                                />
                                              </svg>
                                            ` : g}
                                        <span>${E}</span>
                                      </button>
                                    `;
    })}
                                </div>
                              ` : g}

                          <!-- Bottom Actions: Stop casting + Done -->
                          <div class="cast-sheet-footer">
                            <button
                              type="button"
                              class="stop-cast-btn"
                              @click=${() => {
      this._call("media_stop"), this._castSheetOpen = !1;
    }}
                            >
                              ${P(this.hass, "stop_casting")}
                            </button>
                            <button
                              type="button"
                              class="done-cast-btn"
                              @click=${() => this._castSheetOpen = !1}
                            >
                              ${P(this.hass, "done")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ` : g}
              </div>
            ` : g}
      </dialog>
    `;
  }
};
Z.styles = [
  V,
  R`
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
K([
  O({ attribute: !1 })
], Z.prototype, "hass", 2);
K([
  O({ type: String })
], Z.prototype, "entityId", 2);
K([
  O({ attribute: !1 })
], Z.prototype, "playerIds", 2);
K([
  b()
], Z.prototype, "_open", 2);
K([
  b()
], Z.prototype, "_castSheetOpen", 2);
K([
  b()
], Z.prototype, "_nowTick", 2);
K([
  b()
], Z.prototype, "_scrubbing", 2);
K([
  b()
], Z.prototype, "_scrubPct", 2);
K([
  b()
], Z.prototype, "_volDragging", 2);
K([
  b()
], Z.prototype, "_volPct", 2);
K([
  b()
], Z.prototype, "_palette", 2);
K([
  z("dialog.media-dialog")
], Z.prototype, "_dialogEl", 2);
K([
  z(".dialog-surface")
], Z.prototype, "_dialogSurfaceEl", 2);
K([
  z(".artwork-frame")
], Z.prototype, "_artworkFrameEl", 2);
K([
  z(".meta-block")
], Z.prototype, "_metaBlockEl", 2);
Z = K([
  B("m3e-media-popup")
], Z);
var Dr = Object.defineProperty, Ir = Object.getOwnPropertyDescriptor, _t = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ir(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Dr(e, i, a), a;
};
const zr = 2048;
let ot = class extends N {
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
        const a = this.hass.states[s];
        a !== this._prevStates[s] && (this._prevStates[s] = a, e = !0);
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
    const i = String(t.attributes.media_title ?? "").trim(), s = String(t.attributes.media_artist ?? "").trim(), a = String(t.attributes.media_album_name ?? "").trim(), r = String(t.attributes.app_name ?? "").trim();
    return i && s ? `${i} · ${s}` : i && a ? `${i} · ${a}` : i || s || r || (e === "paused" ? "Paused" : e === "playing" ? "Playing" : e);
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
    const r = e.scrollWidth, o = t.clientWidth, n = o > 0 && r > o + 4;
    if (n !== this._marqueeActive && (this._marqueeActive = n), n) {
      const l = Math.max(9, Math.round((r + 48) / 36));
      l !== this._marqueeDuration && (this._marqueeDuration = l);
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
    if (!this._config) return g;
    const t = this._activeEntity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", a = i || e === "off" || e === "idle" || e === "standby";
    if (this._config.hide_when_inactive && a)
      return g;
    const r = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, o = this._getMetadataText(t), n = a ? "" : String(t?.attributes.entity_picture_local || t?.attributes.entity_picture || "").trim(), l = Array.isArray(t?.attributes.source_list) ? Array.from(
      new Set(
        t.attributes.source_list.map((m) => String(m ?? "").trim()).filter(Boolean)
      )
    ) : [], c = (Number(t?.attributes.supported_features ?? 0) & zr) !== 0 || l.length > 0, h = this._allEntityIds.length > 1, f = this._config.show_cast !== !1 && !i && (c || h);
    return d`
      <ha-card
        class="media-bar is-wide-card ${s ? "is-playing" : ""} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${r}, ${o}"
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
            ${n ? d`<img class="artwork-img" src=${n} alt="" loading="lazy" />` : d`
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
            <span class="player-title">${r}</span>
            <div class="marquee-viewport ${this._marqueeActive ? "is-scrolling" : ""}">
              <span class="marquee-measure" aria-hidden="true">${o}</span>
              ${this._marqueeActive ? d`
                    <div
                      class="marquee-track"
                      style="--marquee-dur: ${this._marqueeDuration}s;"
                    >
                      <span class="marquee-copy">${o}</span>
                      <span class="marquee-copy" aria-hidden="true">${o}</span>
                    </div>
                  ` : d`<span class="meta-static">${o}</span>`}
            </div>
          </div>

          <!-- Right Slot: Cast / Output + Squircle Play/Pause (or Offline Badge) -->
          <div class="actions-col">
            ${i ? d`
                  <span class="offline-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                      />
                    </svg>
                  </span>
                ` : d`
                  ${f ? d`
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
                      ` : g}

                  <button
                    type="button"
                    class="play-btn ${s ? "is-playing" : ""}"
                    aria-label=${s ? "Pausa" : "Riproduci"}
                    @click=${(m) => this._togglePlayPause(m)}
                  >
                    ${s ? d`
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        ` : d`
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
ot.styles = [
  V,
  R`
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
_t([
  O({ attribute: !1 })
], ot.prototype, "hass", 2);
_t([
  b()
], ot.prototype, "_config", 2);
_t([
  b()
], ot.prototype, "_selectedEntityId", 2);
_t([
  b()
], ot.prototype, "_marqueeActive", 2);
_t([
  b()
], ot.prototype, "_marqueeDuration", 2);
_t([
  b()
], ot.prototype, "_pressed", 2);
_t([
  z(".media-bar")
], ot.prototype, "_barEl", 2);
_t([
  z(".marquee-viewport")
], ot.prototype, "_marqueeViewport", 2);
_t([
  z(".marquee-measure")
], ot.prototype, "_marqueeMeasure", 2);
_t([
  z("m3e-media-popup")
], ot.prototype, "_popupEl", 2);
ot = _t([
  B("m3e-media-bar-card")
], ot);
var Hr = Object.defineProperty, Nr = Object.getOwnPropertyDescriptor, dt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Nr(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Hr(e, i, a), a;
};
const Rr = 2, Br = 16, Fr = 32;
function gs(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), a = e % 60, r = a < 10 ? `0${a}` : String(a);
  if (i > 0) {
    const o = s < 10 ? `0${s}` : String(s);
    return `${i}:${o}:${r}`;
  }
  return `${s}:${r}`;
}
let et = class extends N {
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
    s !== this._lastArtworkUrl && (this._lastArtworkUrl = s, s && this._config?.dynamic_color !== !1 ? Vi(s).then((a) => {
      this._lastArtworkUrl === s && (this._palette = a);
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
      const a = Date.parse(s);
      if (!Number.isNaN(a)) {
        const r = Math.max(0, (this._nowTick - a) / 1e3);
        return Math.max(0, Math.min(e, i + r));
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
    return Ws(this.hass, t);
  }
  render() {
    if (!this._config) return g;
    const t = this._entity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", a = i || e === "off" || e === "idle", r = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, n = String(t?.attributes.source ?? "").trim() || r, l = String(t?.attributes.media_title ?? "").trim() || (i ? "Offline" : a ? r : "In riproduzione"), p = String(t?.attributes.media_artist ?? "").trim() || String(t?.attributes.media_album_name ?? "").trim() || (i ? "Non disponibile" : a ? "Nessuna riproduzione" : r), c = this._artworkUrl, h = this._progressPct, f = this._duration, m = Number(t?.attributes.supported_features ?? 0), u = !i && (m === 0 || (m & Br) !== 0), v = !i && (m === 0 || (m & Fr) !== 0), _ = !i && f > 0 && (m === 0 || (m & Rr) !== 0), x = s && !this._scrubbing && f > 0, y = this._scrubPct !== null ? this._scrubPct / 100 * f : this._currentPosition, w = this._palette ? `--mp-scrim: ${this._palette.scrim}; --mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};` : "";
    return d`
      <ha-card
        class="media-player-card is-wide-card ${s ? "is-playing" : "is-paused"} ${c ? "has-artwork" : "no-artwork"} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        style=${w}
        role="button"
        tabindex="0"
        aria-label="${l}, ${p}"
        @pointerdown=${(S) => {
      i || S.pointerType === "mouse" && S.button !== 0 || S.target?.closest('button, [role="slider"]') || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._onCardClick()}
        @keydown=${(S) => {
      (S.key === "Enter" || S.key === " ") && (S.preventDefault(), this._onCardClick());
    }}
      >
        <!-- Full-bleed Artwork + Tonal Scrim/Vignette -->
        ${c ? d`<img class="bg-artwork" src=${c} alt="" loading="lazy" />` : g}
        <div class="bg-scrim" aria-hidden="true"></div>

        <div class="card-content">
          <!-- Top Row: App Badge + Output Device Chip -->
          <div class="top-row">
            ${this._renderAppBadge(t)}
            ${this._config.show_device_chip !== !1 ? d`
                  <button
                    type="button"
                    class="device-chip"
                    @click=${(S) => this._onDeviceChipClick(S)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span>${n}</span>
                  </button>
                ` : g}
          </div>

          <!-- Middle Row: Bold Typography + Shape-Morphing Play/Pause -->
          <div class="mid-row">
            <div class="track-meta">
              <div class="track-title">${l}</div>
              <div class="track-artist">${p}</div>
            </div>

            <button
              type="button"
              class="play-fab ${s ? "is-playing" : "is-paused"}"
              aria-label=${s ? "Pausa" : "Riproduci"}
              ?disabled=${i}
              @click=${(S) => this._callService("media_play_pause", {}, S)}
            >
              ${s ? d`
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                      <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                    </svg>
                  ` : d`
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
              ?disabled=${!u}
              @click=${(S) => this._callService("media_previous_track", {}, S)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
              </svg>
            </button>

            <div
              class="wavy-slider ${x ? "is-wavy" : "is-flat"} ${this._scrubbing ? "is-scrubbing" : ""} ${_ ? "is-seekable" : ""}"
              role="slider"
              aria-label="Avanzamento riproduzione"
              aria-valuemin="0"
              aria-valuemax=${f}
              aria-valuenow=${Math.round(y)}
              @click=${(S) => S.stopPropagation()}
              @pointerdown=${this._onSliderPointerDown}
              @pointermove=${this._onSliderPointerMove}
              @pointerup=${this._onSliderPointerUp}
              @pointercancel=${this._onSliderPointerUp}
            >
              ${this._scrubbing && f > 0 ? d`
                    <span class="scrub-badge" style="left: ${h}%;">
                      ${gs(y)} / ${gs(f)}
                    </span>
                  ` : g}

              <!-- Active Wavy / Flat Segment -->
              <div class="wavy-active-wrap" style="width: max(0px, calc(${h}% - 7px));">
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
              <div class="wavy-thumb" style="left: ${h}%;"></div>

              <!-- Inactive Remaining Track -->
              <div class="wavy-inactive-line" style="left: calc(${h}% + 7px);"></div>
            </div>

            <button
              type="button"
              class="transport-btn is-next"
              aria-label="Traccia successiva"
              ?disabled=${!v}
              @click=${(S) => this._callService("media_next_track", {}, S)}
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
        @m3e-player-selected=${(S) => {
      this._activeEntityId = S.detail.entityId;
    }}
      ></m3e-media-popup>
    `;
  }
};
et.styles = [
  V,
  R`
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
dt([
  O({ attribute: !1 })
], et.prototype, "hass", 2);
dt([
  b()
], et.prototype, "_config", 2);
dt([
  b()
], et.prototype, "_palette", 2);
dt([
  b()
], et.prototype, "_nowTick", 2);
dt([
  b()
], et.prototype, "_scrubbing", 2);
dt([
  b()
], et.prototype, "_scrubPct", 2);
dt([
  b()
], et.prototype, "_activeEntityId", 2);
dt([
  b()
], et.prototype, "_pressed", 2);
dt([
  z(".media-player-card")
], et.prototype, "_cardEl", 2);
dt([
  z("m3e-media-popup")
], et.prototype, "_popupEl", 2);
dt([
  O({ attribute: !1 })
], et.prototype, "config", 1);
et = dt([
  B("m3e-media-player-card")
], et);
var Ur = Object.defineProperty, Vr = Object.getOwnPropertyDescriptor, pi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Vr(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Ur(e, i, a), a;
};
let ce = class extends N {
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
    const s = [...this._config.items ?? []], a = t + e;
    a < 0 || a >= s.length || ([s[t], s[a]] = [s[a], s[t]], this._expandedIndex === t ? this._expandedIndex = a : this._expandedIndex === a && (this._expandedIndex = t), this._emitConfig({ ...this._config, items: s }));
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
    if (!this.hass || !this._config) return g;
    const t = this._config.items ?? [];
    return d`
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
      const s = this._expandedIndex === i, a = {
        entity: e.entity ?? "",
        name: e.name ?? "",
        icon: e.icon ?? "",
        image: e.image ?? "",
        tap_action: e.tap_action ?? "more-info",
        navigation_path: e.navigation_path ?? ""
      };
      return d`
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
                      @click=${(r) => this._moveItem(i, -1, r)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${i === t.length - 1}
                      @click=${(r) => this._moveItem(i, 1, r)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(r) => this._removeItem(i, r)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                ${s ? d`
                      <div class="item-body">
                        <ha-form
                          .hass=${this.hass}
                          .data=${a}
                          .schema=${this._buildItemSchema(e)}
                          .computeLabel=${this._computeItemLabel}
                          @value-changed=${(r) => this._onItemChanged(i, r)}
                        ></ha-form>
                      </div>
                    ` : g}
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
ce.styles = R`
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
pi([
  O({ attribute: !1 })
], ce.prototype, "hass", 2);
pi([
  b()
], ce.prototype, "_config", 2);
pi([
  b()
], ce.prototype, "_expandedIndex", 2);
ce = pi([
  B("m3e-people-card-editor")
], ce);
var Zr = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, hi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Wr(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Zr(e, i, a), a;
};
let de = class extends N {
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
    const e = t?.states ?? {}, i = Object.keys(e).filter((a) => a.startsWith("person.")).slice(0, 6);
    return {
      type: "custom:m3e-people-card",
      layout: "scroll",
      size: "default",
      transparent: !0,
      show_presence_indicator: !0,
      items: i.length > 0 ? i.map((a) => ({ entity: a, tap_action: "more-info" })) : [{ entity: "person.home", tap_action: "more-info" }]
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
        re(this, this.hass, t.navigation_path);
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
      return d`<ha-icon .icon=${t.icon}></ha-icon>`;
    const s = t.image?.trim() || e?.attributes.entity_picture || "";
    return s ? d`<img class="avatar-img" src=${s} alt="" loading="lazy" />` : i ? d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
            />
          </svg>
        ` : d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2Zm0-12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"
            />
          </svg>
        `;
  }
  render() {
    if (!this._config) return g;
    const t = this._config.items ?? [], e = this._config.layout ?? "scroll", i = this._config.size ?? "default", s = this._config.transparent !== !1, a = this._config.show_presence_indicator !== !1, r = d`
      <div
        class="people-container layout-${e} size-${i} ${s ? "is-transparent" : "is-card"}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${t.length === 0 ? d`<div class="empty-hint">Aggiungi persone dalla configurazione della card</div>` : t.map((o) => {
      const n = o.entity ? this.hass?.states[o.entity] : void 0, l = !n || n.state === "unavailable" || n.state === "unknown", p = !l && String(n.state ?? "").toLowerCase() === "home", c = o.name || n?.attributes.friendly_name || o.entity || "Persona", h = this._formatLocation(n), f = (o.tap_action ?? "more-info") !== "none" && !!o.entity, m = !o.icon && !!(o.image?.trim() || n?.attributes.entity_picture?.trim()), u = this.hass?.themes?.darkMode === !1;
      return d`
                <button
                  type="button"
                  class="person-item ${l ? "is-dimmed" : ""} ${f ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(o)}
                >
                  <span class="avatar-wrap" aria-hidden="true">
                    <span
                      class="avatar-circle ${p ? "is-home" : ""} ${m ? "has-picture" : ""} ${u ? "is-light" : "is-dark"}"
                    >
                      ${this._renderAvatar(o, n, p)}
                    </span>
                    ${a && p ? d`<span class="presence-dot"></span>` : g}
                  </span>

                  <span class="text-col">
                    <span class="primary-name">${c}</span>
                    <span class="secondary-location">${h}</span>
                  </span>
                </button>
              `;
    })}
      </div>
    `;
    return s ? r : d`<ha-card>${r}</ha-card>`;
  }
};
de.styles = [
  V,
  R`
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
hi([
  O({ attribute: !1 })
], de.prototype, "hass", 2);
hi([
  b()
], de.prototype, "_config", 2);
hi([
  z(".people-container")
], de.prototype, "_containerEl", 2);
de = hi([
  B("m3e-people-card")
], de);
const ie = /* @__PURE__ */ new Set(), Le = /* @__PURE__ */ new Set();
function jr(t) {
  Le.add(t);
}
function Yr(t) {
  Le.delete(t);
}
function Ce() {
  return Le.size === 0 ? null : Array.from(Le)[Le.size - 1] ?? null;
}
function Gr(t) {
  ie.add(t);
}
function Kr(t) {
  ie.delete(t);
}
function $i(t) {
  if (ie.size === 0) return null;
  const e = lt(t?.hash);
  for (const i of ie) {
    const s = i.getConfig();
    if (s && lt(s.hash) === e)
      return i;
  }
  return Array.from(ie)[ie.size - 1] ?? null;
}
const js = "dashboardCardClipboard";
function ai(t) {
  try {
    sessionStorage.setItem(js, JSON.stringify(t));
  } catch {
  }
}
function Ys() {
  try {
    const t = sessionStorage.getItem(js);
    if (!t) return null;
    const e = JSON.parse(t);
    return e && typeof e == "object" && !Array.isArray(e) ? e : null;
  } catch {
    return null;
  }
}
function Wt(t) {
  return JSON.parse(JSON.stringify(t));
}
function ui() {
  return document.querySelector("body > home-assistant");
}
function Re() {
  return ui()?.shadowRoot?.querySelector("hui-dialog-edit-card") ?? null;
}
function qr(t, e) {
  try {
    const i = t?._dirtySlices?.get("__default__")?.initial;
    if (i && typeof i == "object")
      return Wt(i);
    if (t?._params?.cardConfig)
      return Wt(t._params.cardConfig);
  } catch {
  }
  return Wt(e);
}
function Xr(t, e) {
  if (!t || !e) return;
  const i = (s = 0) => {
    try {
      const a = t._dirtySlices?.get("__default__");
      if (!a) {
        s < 8 && requestAnimationFrame(() => i(s + 1));
        return;
      }
      a.initial = Wt(e);
      const r = t._effectiveNormalize;
      a.normalizedInitial = typeof r == "function" ? r(Wt(e)) : Wt(e), t._publishContext?.();
    } catch {
    }
  };
  requestAnimationFrame(() => i(0));
}
function Jr(t) {
  const e = t?.views, i = e?.[0]?.sections?.[0]?.cards;
  return Array.isArray(i) ? i : Array.isArray(e?.[0]?.cards) ? e[0].cards : [];
}
function Gs(t, e, i) {
  const s = ui();
  if (!s) return;
  const a = {
    ...t,
    cardConfig: e
  };
  setTimeout(() => {
    s.dispatchEvent(
      new CustomEvent("show-dialog", {
        bubbles: !0,
        composed: !0,
        detail: {
          dialogTag: "hui-dialog-edit-card",
          dialogImport: () => Promise.resolve(),
          dialogParams: a
        }
      })
    ), requestAnimationFrame(() => {
      const r = Re();
      r && r._params !== a && typeof r.showDialog == "function" && r.showDialog(a), Xr(Re(), i);
    });
  }, 30);
}
function _s(t, e, i, s, a) {
  const r = Re();
  if (!r || typeof r.showDialog != "function")
    return a(), !1;
  let o = !1, n;
  const l = Object.prototype.hasOwnProperty.call(r, "closeDialog"), p = r.closeDialog, c = () => {
    r.closeDialog === f && (l ? r.closeDialog = p : delete r.closeDialog);
  }, h = () => {
    o || (o = !0, n !== void 0 && (window.clearTimeout(n), n = void 0), c(), r.removeEventListener("dialog-closed", m), window.removeEventListener("dialog-closed", m, !0), a(), Gs(e, s(), i));
  };
  function f(...u) {
    return c(), (typeof p == "function" ? p.apply(this, u) : !0) === !1 ? (r.closeDialog = f, !1) : (n === void 0 && (n = window.setTimeout(() => {
      !o && !r?._params && h();
    }, 450)), !0);
  }
  const m = (u) => {
    (u.detail?.dialog === "hui-dialog-edit-card" || u.target === r || typeof u.composedPath == "function" && u.composedPath().includes(r)) && h();
  };
  return r.showDialog(t), r.closeDialog = f, r.addEventListener("dialog-closed", m), window.addEventListener("dialog-closed", m, !0), !0;
}
async function vs(t, e, i, s, a) {
  const r = ui();
  if (!r) return null;
  const o = {
    type: "grid",
    cards: Wt(e)
  }, n = {
    config: {
      views: [
        {
          path: "m3e-popup-editor",
          title: "M3E Pop-up",
          sections: [o]
        }
      ]
    },
    editMode: !0,
    saveConfig: a
  }, l = customElements.get("hui-section") ? document.createElement("hui-section") : null;
  if ((!!(l && "path" in l) || !!(customElements.get("hui-view") && !l)) && customElements.get("hui-view")) {
    const h = document.createElement("hui-view");
    h.style.display = "none", h.hass = t, h.index = 0, h.lovelace = n;
    const f = ["views", 0, "sections", 0, "cards"], m = i === "ll-edit-card" && typeof s == "number" ? [...f, s] : f;
    r.appendChild(h);
    try {
      return h.dispatchEvent(
        new CustomEvent(i, {
          bubbles: !0,
          composed: !0,
          detail: { path: m }
        })
      ), () => {
        h.isConnected && h.remove();
      };
    } catch {
      return h.remove(), null;
    } finally {
      h.remove();
    }
  }
  if (!l) return null;
  l.style.display = "none", l.hass = t, l.index = 0, l.viewIndex = 0, l.config = o, l.lovelace = n, r.appendChild(l);
  const c = () => {
    l.isConnected && l.remove();
  };
  try {
    typeof l._initializeConfig == "function" && await l._initializeConfig(), l.updateComplete && await l.updateComplete;
    const h = l._layoutElement;
    if (!h)
      return c(), null;
    const f = i === "ll-edit-card" && typeof s == "number" ? { path: [0, 0, s] } : void 0;
    return h.dispatchEvent(
      new CustomEvent(i, {
        bubbles: !0,
        composed: !0,
        detail: f
      })
    ), c;
  } catch {
    return c(), null;
  }
}
async function Ai(t) {
  const e = ui(), i = Re(), s = i?._params ? { ...i._params } : null;
  if (!e || !s) return !1;
  const a = qr(i, t.parentConfig);
  let r = !1, o = t.applyCards(t.parentConfig, [...t.cards]);
  const n = async (c) => {
    const h = Jr(c);
    r = !0, o = t.applyCards(o, h), t.onCardsUpdated(h);
  };
  if (t.mode === "add") {
    let c = null, h = null;
    const f = (u) => {
      const v = u.detail;
      v?.dialogTag === "hui-dialog-edit-card" && (c = v.dialogParams ?? null, u.stopImmediatePropagation?.(), u.stopPropagation());
    }, m = (u) => {
      if (u.detail?.dialog === "hui-dialog-create-card")
        if (e.removeEventListener("show-dialog", f, !0), window.removeEventListener("dialog-closed", m, !0), c) {
          const _ = c;
          setTimeout(() => {
            _s(
              _,
              s,
              a,
              () => o,
              () => h?.()
            );
          }, 0);
        } else
          h?.(), r && Gs(s, o, a);
    };
    return e.addEventListener("show-dialog", f, !0), window.addEventListener("dialog-closed", m, !0), h = await vs(
      t.hass,
      t.cards,
      "ll-create-card",
      void 0,
      n
    ), h ? !0 : (e.removeEventListener("show-dialog", f, !0), window.removeEventListener("dialog-closed", m, !0), !1);
  }
  if (typeof t.index != "number") return !1;
  let l = null;
  const p = (c) => {
    const h = c.detail;
    h?.dialogTag === "hui-dialog-edit-card" && (e.removeEventListener("show-dialog", p, !0), c.stopImmediatePropagation?.(), c.stopPropagation(), h.dialogParams ? _s(
      h.dialogParams,
      s,
      a,
      () => o,
      () => l?.()
    ) : l?.());
  };
  return e.addEventListener("show-dialog", p, !0), l = await vs(
    t.hass,
    t.cards,
    "ll-edit-card",
    t.index,
    n
  ), l ? !0 : (e.removeEventListener("show-dialog", p, !0), !1);
}
async function bs(t) {
  return Ai({
    hass: t.hass,
    parentConfig: t.popupConfig,
    cards: t.popupConfig.cards ?? [],
    applyCards: (e, i) => ({ ...e, cards: i }),
    mode: t.mode,
    index: t.index,
    onCardsUpdated: t.onCardsUpdated
  });
}
function Ks() {
  try {
    const t = Re()?.shadowRoot?.querySelector(
      "ha-dialog > div.content > div.element-preview"
    );
    t && t.style.overflowY !== "auto" && (t.style.position = "sticky", t.style.top = "0", t.style.maxHeight = "calc(100vh - 210px)", t.style.overflowY = "auto");
  } catch {
  }
}
var Qr = Object.defineProperty, to = Object.getOwnPropertyDescriptor, mi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? to(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Qr(e, i, a), a;
};
let pe = class extends N {
  constructor() {
    super(...arguments), this._bridgeHandle = {
      getConfig: () => this._config,
      updateCards: (t) => {
        this._config && this._emitConfig({ ...this._config, cards: t });
      },
      openAddCard: () => {
        !this.hass || !this._config || bs({
          hass: this.hass,
          popupConfig: this._config,
          mode: "add",
          onCardsUpdated: (t) => {
            this._config && this._emitConfig({ ...this._config, cards: t });
          }
        });
      },
      openEditCard: (t) => {
        !this.hass || !this._config || bs({
          hass: this.hass,
          popupConfig: this._config,
          mode: "edit",
          index: t,
          onCardsUpdated: (e) => {
            this._config && this._emitConfig({ ...this._config, cards: e });
          }
        });
      }
    }, this._onValueChanged = (t) => {
      this._config && this._emitConfig({ ...this._config, ...t.detail.value });
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
    super.connectedCallback(), Gr(this._bridgeHandle), requestAnimationFrame(() => Ks());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Kr(this._bridgeHandle);
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
    if (!this.hass || !this._config) return g;
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
    ];
    return d`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${t}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      </div>
    `;
  }
};
pe.styles = R`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: min(480px, 58dvh);
    }
  `;
mi([
  O({ attribute: !1 })
], pe.prototype, "hass", 2);
mi([
  O({ attribute: !1 })
], pe.prototype, "lovelace", 2);
mi([
  b()
], pe.prototype, "_config", 2);
pe = mi([
  B("m3e-popup-card-editor")
], pe);
const Oi = "m3e_popups", qs = "M3E Pop-ups", bt = [];
function Zi() {
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
  }
}
function Xs() {
  for (let t = bt.length - 1; t >= 0; t--)
    bt[t].ref.deref()?.isConnected || bt.splice(t, 1);
}
function eo(t, e, i = {}) {
  Xs();
  const s = lt(e), a = bt.findIndex((o) => o.ref.deref() === t);
  if (!s || !t.isConnected) {
    a !== -1 && bt.splice(a, 1);
    return;
  }
  const r = {
    ref: new WeakRef(t),
    hash: s,
    path: Zi(),
    name: i.name?.trim() || void 0,
    icon: i.icon?.trim() || void 0
  };
  a !== -1 ? bt[a] = r : bt.push(r);
}
function io(t) {
  const e = bt.findIndex((i) => i.ref.deref() === t);
  e !== -1 && bt.splice(e, 1);
}
function Je(t, e) {
  if (!t || typeof t != "object") return;
  if (Array.isArray(t)) {
    for (const s of t) Je(s, e);
    return;
  }
  const i = t;
  if (i.type === "custom:m3e-popup-card" && typeof i.hash == "string") {
    const s = lt(i.hash);
    s && e.push({
      hash: s,
      name: typeof i.name == "string" ? i.name.trim() : void 0,
      icon: typeof i.icon == "string" ? i.icon.trim() : void 0
    });
  }
  Array.isArray(i.cards) && Je(i.cards, e), Array.isArray(i.sections) && Je(i.sections, e);
}
function so() {
  const t = [];
  try {
    const o = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("ha-panel-lovelace")?.shadowRoot?.querySelector("hui-root")?.lovelace?.config?.views;
    if (!Array.isArray(o) || o.length === 0) return t;
    const n = Zi().split("/").filter(Boolean), l = n[n.length - 1] ?? "", p = o.find((c, h) => String(c.path ?? h) === l) ?? o[Number(l)] ?? o[0];
    p && Je(p, t);
  } catch {
  }
  return t;
}
function ao(t, e) {
  const i = typeof e == "string" ? e.trim().toLowerCase() : "";
  return i ? t.filter(
    (s) => [s.id, s.primary, s.secondary].some((a) => (a || "").toLowerCase().includes(i))
  ) : t;
}
function ro() {
  Xs();
  const t = Zi(), e = /* @__PURE__ */ new Map();
  for (const r of bt)
    r.path === t && r.ref.deref()?.isConnected && !e.has(r.hash) && e.set(r.hash, r);
  const i = [], s = /* @__PURE__ */ new Set(), a = (r, o) => {
    if (!r || s.has(r)) return;
    s.add(r);
    const n = o?.name?.trim();
    i.push({
      id: r,
      primary: n || r,
      secondary: n ? r : "M3E Pop-up",
      icon: o?.icon || "mdi:pound",
      sorting_label: `zzz_m3e_popup_${r}`
    });
  };
  for (const r of so())
    a(r.hash, e.get(r.hash) ?? r);
  for (const [r, o] of e.entries())
    a(r, o);
  return i;
}
function Li(t) {
  if (!t?._navigationItems) return;
  const e = ro();
  typeof t._sortBySortingLabel == "function" && e.sort((o, n) => t._sortBySortingLabel(o, n));
  const i = new Set((t.__m3ePopUpItems ?? []).map((o) => o.id)), s = t._navigationItems.filter((o) => !i.has(o?.id)), a = new Set(s.map((o) => o?.id)), r = e.filter((o) => !a.has(o.id));
  t.__m3ePopUpItems = r, t._navigationItems = [...s, ...r];
}
function oo(t) {
  const e = t.renderRoot?.querySelector("ha-generic-picker");
  if (!e) return;
  const i = (t.__m3ePopUpItems?.length ?? 0) > 0, s = Array.isArray(e.sections) ? e.sections : [], a = s.filter((r) => r?.id !== Oi);
  i ? e.sections = [
    ...a,
    { id: Oi, label: qs }
  ] : a.length !== s.length && (e.sections = a);
}
function ys(t) {
  if (t.__m3eGetItemsPatched) return;
  const e = t._getItems;
  typeof e == "function" && (t._getItems = function(i, s) {
    Li(t);
    const a = ao(t.__m3ePopUpItems ?? [], i);
    if (s === Oi) return a;
    const r = e.call(t, i, s);
    return s || a.length === 0 ? r : [...r, qs, ...a];
  }, t.__m3eGetItemsPatched = !0);
}
function xs() {
  const e = customElements.get("ha-navigation-picker")?.prototype;
  if (!e || typeof e._loadNavigationItems != "function") return !1;
  if (e.__m3ePatched) return !0;
  const i = e._loadNavigationItems, s = e.updated;
  return e._loadNavigationItems = async function(...a) {
    await i.apply(this, a), ys(this), Li(this);
  }, e.updated = function(a) {
    s?.call(this, a);
    try {
      ys(this), Li(this), oo(this);
    } catch {
    }
  }, e.__m3ePatched = !0, !0;
}
function no() {
  typeof window > "u" || window.__m3eNavPickerBridgeInit || (window.__m3eNavPickerBridgeInit = !0, xs() || customElements.whenDefined("ha-navigation-picker").then(() => {
    xs();
  }).catch(() => {
  }));
}
var lo = Object.defineProperty, co = Object.getOwnPropertyDescriptor, pt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? co(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && lo(e, i, a), a;
};
const po = /* @__PURE__ */ new Set([
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
let Ci = null;
function ho() {
  if (!Ci) {
    const t = window.loadCardHelpers;
    Ci = t ? t() : Promise.resolve(void 0);
  }
  return Ci;
}
function ki(t, e) {
  const i = t.grid_options ?? {}, s = e?.getGridOptions?.(), a = i.columns ?? s?.columns ?? 12, r = a === "full" ? 12 : typeof a == "number" && Number.isFinite(a) ? Math.max(1, Math.min(12, Math.round(a))) : 12, o = i.rows, n = typeof o == "number" && Number.isFinite(o) && o > 0 ? Math.round(o) : void 0;
  return { cols: r, rows: n };
}
let it = class extends N {
  constructor() {
    super(...arguments), this._isOpen = !1, this._isEditMode = !1, this._isDialogPreview = !1, this._isSectionGrid = !1, this._registeredTarget = "", this._cardElements = [], this._cardWrappers = [], this._editModeElements = [], this._lastCardsJson = "", this._lastBuildWasPreview = !1, this._prewarmHandle = null, this._adoptedSiblings = [], this._hiddenSiblings = [], this._onLocationChange = () => {
      this._checkEditMode(), this._checkTriggerMatch();
    }, this._onPopupOpenEvent = (t) => {
      if (this._isDialogPreview) return;
      const e = lt(t.detail?.target), i = lt(this._config?.hash);
      e && i && e === i && this.openPopup();
    }, this._isClosing = !1;
  }
  static getStubConfig() {
    return {
      type: "custom:m3e-popup-card",
      hash: "#popup",
      name: "Pop-up",
      show_header_button: !0,
      show_state: !0,
      cards: []
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
    }, this._syncRegistration(), this._schedulePrewarm();
  }
  getCardSize() {
    return this._isEditMode ? 1 : 0;
  }
  getGridOptions() {
    return this._isEditMode ? { columns: 12, min_columns: 6, rows: 1 } : { columns: 12, rows: 0 };
  }
  connectedCallback() {
    super.connectedCallback(), this._syncRegistration(), this._checkEditMode(), window.addEventListener("hashchange", this._onLocationChange), window.addEventListener("popstate", this._onLocationChange), window.addEventListener("location-changed", this._onLocationChange), window.addEventListener("m3e-popup-open", this._onPopupOpenEvent), requestAnimationFrame(() => {
      this._checkEditMode(), this._syncContainerLayout(), this._checkTriggerMatch(), this._isDialogPreview ? this._syncEmbeddedCards() : this._schedulePrewarm();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), ut(this._dialogEl, this._surfaceEl, () => {
      this._isClosing = !1, this._isOpen = !1;
    }), this._prewarmHandle !== null && ("cancelIdleCallback" in window ? window.cancelIdleCallback(this._prewarmHandle) : clearTimeout(this._prewarmHandle), this._prewarmHandle = null), ns(this._registeredTarget), io(this), this._registeredTarget = "", this._restoreAdoptedSiblings(), this._restoreContainerStyles(), window.removeEventListener("hashchange", this._onLocationChange), window.removeEventListener("popstate", this._onLocationChange), window.removeEventListener("location-changed", this._onLocationChange), window.removeEventListener("m3e-popup-open", this._onPopupOpenEvent);
  }
  /**
   * Hass Gate:
   * - While closed on the dashboard, skip ALL Lit re-renders unless the header entity's own
   *   object reference changed (so navigation picker metadata stays fresh at near-zero cost).
   * - While open or in preview, propagate `hass` directly to child cards without re-rendering
   *   the outer popup shell unless the header entity or theme changed.
   */
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_isOpen") || t.has("_isEditMode") || t.has("_isDialogPreview") || t.has("_isSectionGrid"))
      return !0;
    if (t.has("hass") && this.hass) {
      if (this._isClosing) return !1;
      if (this._isOpen || this._isDialogPreview) {
        for (const s of this._cardElements) s.hass = this.hass;
        for (const s of this._editModeElements) s.hass = this.hass;
      }
      const e = this._config?.entity ? this.hass.states[this._config.entity] : void 0, i = t.get("hass");
      return e !== this._prevHeaderEntity ? (this._prevHeaderEntity = e, this._syncRegistration(), this._isOpen || this._isEditMode) : i?.themes?.darkMode !== this.hass.themes?.darkMode ? this._isOpen || this._isEditMode : !1;
    }
    return !1;
  }
  _schedulePrewarm() {
    if (this._isEditMode || this._isOpen || (this._config?.cards?.length ?? 0) === 0 || this._prewarmHandle !== null) return;
    const t = () => {
      this._prewarmHandle = null, !this._isEditMode && !this._isOpen && this._ensureCardInstances(this._config?.cards ?? []);
    };
    "requestIdleCallback" in window ? this._prewarmHandle = window.requestIdleCallback(t, { timeout: 1500 }) : this._prewarmHandle = setTimeout(t, 250);
  }
  _syncRegistration() {
    const t = lt(this._config?.hash);
    t !== this._registeredTarget && (ns(this._registeredTarget), this._registeredTarget = Fa(t));
    const e = mt(this.hass, this._entity, this._config?.name);
    eo(this, this._config?.hash, {
      name: e || void 0,
      icon: this._config?.icon
    });
  }
  _checkEditMode() {
    const t = window.location.search.includes("edit=1");
    let e = !1, i = !1, s = this;
    for (; s; ) {
      if (s instanceof HTMLElement) {
        const r = s.tagName.toLowerCase();
        r === "hui-card-preview" || r === "hui-dialog-edit-card" ? (i = !0, e = !0) : (r === "hui-card-edit-mode" || s.classList.contains("edit-mode")) && (e = !0);
      }
      s = s.parentNode ?? (s instanceof ShadowRoot ? s.host : null);
    }
    const a = t || e;
    (a !== this._isEditMode || i !== this._isDialogPreview) && (this._isEditMode = a, this._isDialogPreview = i, a ? (this._isOpen && this.closePopup(!1), this._restoreAdoptedSiblings(), this._restoreContainerStyles()) : this._syncContainerLayout());
  }
  _findEnclosingContainer() {
    if (this._isDialogPreview) return null;
    let t = this.parentElement;
    for (; t && t.parentElement; ) {
      const e = t.parentElement, i = e.getRootNode();
      if (i instanceof ShadowRoot && i.host) {
        const s = i.host.tagName.toLowerCase();
        if (s === "hui-grid-section") {
          if (e.firstElementChild === t) {
            let a;
            const r = i.host, o = r.getRootNode();
            return o instanceof ShadowRoot && o.host?.tagName.toLowerCase() === "hui-section" ? a = o.host : a = r, { kind: "section", container: e, cardWrapper: t, outerSection: a };
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
        const a = getComputedStyle(i).getPropertyValue("--column-size").trim();
        a && !i.style.gridColumn && (i.style.gridColumn = `span ${a}`);
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
    const t = lt(this._config?.hash);
    if (!t) return;
    const e = window.location.hash.trim().toLowerCase(), i = window.location.pathname.trim().toLowerCase(), s = `${i}${e}`, a = t.startsWith("#") && e === t || t.startsWith("/") && (i === t || s === t);
    a && !this._isOpen ? this.openPopup() : !a && this._isOpen && t.startsWith("#") && this.closePopup(!1);
  }
  async openPopup() {
    if (this._isDialogPreview) return;
    if (this._isOpen && this._dialogEl?.open) {
      let e = !0;
      try {
        e = this._dialogEl.matches(":modal");
      } catch {
      }
      if (e) return;
      this._isOpen = !1, this._isClosing = !1;
    }
    this._isOpen = !0, await this.updateComplete;
    const t = this._dialogEl;
    if (t) {
      const e = lt(this._config?.hash), i = e.startsWith("#") && window.location.hash.trim().toLowerCase() === e;
      Kt(t, this._surfaceEl, {
        pushHistory: !i,
        onRequestClose: () => this.closePopup(!0),
        onForceReset: () => {
          this._isClosing = !1, this._restoreAdoptedSiblings(), this._isOpen = !1, this._syncContainerLayout();
        }
      });
    }
    this._adoptContainerSiblings(), this._syncEmbeddedCards();
  }
  closePopup(t = !0) {
    if (!this._isOpen || this._isClosing) return;
    this._isClosing = !0;
    const e = () => {
      if (this._isClosing = !1, this._dialogEl?.open && this._dialogEl.close(), this._restoreAdoptedSiblings(), this._isOpen = !1, this._syncContainerLayout(), t) {
        const i = lt(this._config?.hash);
        i.startsWith("#") && window.location.hash.trim().toLowerCase() === i && window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    this._dialogEl ? qt(this._dialogEl, this._surfaceEl, e) : e();
  }
  _persistPreviewCards(t, e = !0) {
    if (!this._config) return;
    this._config = { ...this._config, cards: t }, this._lastCardsRef = t, this._lastCardsJson = JSON.stringify(t);
    const i = $i(this._config);
    i ? i.updateCards(t) : this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: this._config }
      })
    ), e && this._syncEmbeddedCards(!0);
  }
  _buildSortablePreviewContainer(t, e) {
    const i = document.createElement("ha-sortable");
    i.disabled = !1, i.draggableSelector = ".card", i.rollback = !1, i.invertSwap = !0, i.options = {
      delay: 100,
      delayOnTouchOnly: !0,
      invertedSwapThreshold: 0.7
    };
    const s = document.createElement("div");
    s.className = "popup-cards-grid edit-mode", this._editModeElements = [], this._cardWrappers = [];
    for (let l = 0; l < e.length; l++) {
      const p = t[l], c = e[l], { cols: h, rows: f } = ki(p, c), m = document.createElement("div");
      m.className = "card", m.style.gridColumn = `span ${h}`, m.style.gridRow = f ? `span ${f}` : "";
      const u = document.createElement("hui-card-edit-mode");
      u.hass = this.hass, u.lovelace = {
        editMode: !0,
        saveConfig: async () => {
        }
      }, u.path = [0, 0, l], u.hiddenOverlay = !1, u.appendChild(c), this._editModeElements.push(u), this._cardWrappers.push(m), m.appendChild(u), s.appendChild(m);
    }
    const a = document.createElement("button");
    a.type = "button", a.className = "add-card-pill";
    const r = this.hass?.localize?.(
      "ui.panel.lovelace.editor.section.add_card"
    ) || "Add card";
    a.setAttribute("aria-label", r), a.title = r;
    const o = document.createElement("ha-svg-icon");
    o.path = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
    const n = document.createElement("span");
    return n.textContent = r, a.appendChild(o), a.appendChild(n), a.addEventListener("click", (l) => {
      l.stopPropagation(), $i(this._config)?.openAddCard();
    }), s.appendChild(a), i.addEventListener("item-moved", (l) => {
      l.stopPropagation();
      const { oldIndex: p, newIndex: c } = l.detail;
      if (typeof p != "number" || typeof c != "number" || p === c || !this._config)
        return;
      const h = [...this._config.cards ?? []], [f] = h.splice(p, 1);
      if (!f) return;
      h.splice(c, 0, f);
      const [m] = this._cardElements.splice(p, 1);
      m && this._cardElements.splice(c, 0, m);
      const [u] = this._cardWrappers.splice(p, 1);
      u && this._cardWrappers.splice(c, 0, u);
      const [v] = this._editModeElements.splice(p, 1);
      v && this._editModeElements.splice(c, 0, v);
      for (let _ = 0; _ < this._editModeElements.length; _++)
        this._editModeElements[_].path = [0, 0, _];
      this._persistPreviewCards(h, !1);
    }), i.addEventListener("drag-start", () => {
      for (const l of this._editModeElements) l.hiddenOverlay = !0;
    }), i.addEventListener("drag-end", () => {
      for (const l of this._editModeElements) l.hiddenOverlay = !1;
    }), i.addEventListener("ll-edit-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2];
      typeof p == "number" && $i(this._config)?.openEditCard(p);
    }), i.addEventListener("ll-duplicate-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2];
      if (typeof p != "number" || !this._config?.cards?.[p]) return;
      const c = [...this._config.cards];
      c.splice(p + 1, 0, JSON.parse(JSON.stringify(c[p]))), this._persistPreviewCards(c, !0);
    }), i.addEventListener("ll-delete-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2];
      if (typeof p != "number" || !this._config?.cards) return;
      const c = [...this._config.cards];
      c.splice(p, 1), this._persistPreviewCards(c, !0);
    }), i.addEventListener("ll-copy-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2], c = typeof p == "number" ? this._config?.cards?.[p] : void 0;
      c && ai(c);
    }), i.addEventListener("ll-cut-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2], c = typeof p == "number" ? this._config?.cards?.[p] : void 0;
      if (!c || typeof p != "number" || !this._config?.cards) return;
      ai(c);
      const h = [...this._config.cards];
      h.splice(p, 1), this._persistPreviewCards(h, !0);
    }), i.addEventListener("ll-paste-card", (l) => {
      l.stopPropagation();
      const p = l.detail?.path?.[2], c = Ys();
      if (!c) return;
      const h = [...this._config?.cards ?? []], f = typeof p == "number" ? Math.min(p + 1, h.length) : h.length;
      h.splice(f, 0, c), this._persistPreviewCards(h, !0);
    }), i.addEventListener("ll-change-grid-options", (l) => {
      l.stopPropagation();
      const p = l.detail, c = p?.path?.[2], h = p?.gridOptions;
      if (typeof c != "number" || !h || !this._config?.cards?.[c]) return;
      const f = [...this._config.cards], m = {
        ...f[c],
        grid_options: {
          ...f[c].grid_options ?? {},
          ...h
        }
      };
      f[c] = m;
      const u = this._cardWrappers[c];
      if (u) {
        const { cols: v, rows: _ } = ki(m, this._cardElements[c]);
        u.style.gridColumn = `span ${v}`, u.style.gridRow = _ ? `span ${_}` : "";
      }
      this._persistPreviewCards(f, !1);
    }), i.addEventListener("ll-move-to-section", (l) => {
      l.stopPropagation();
    }), i.appendChild(s), i;
  }
  async _ensureCardInstances(t) {
    const e = JSON.stringify(t);
    if (e === this._lastCardsJson && this._cardElements.length === t.length)
      return this._cardElements;
    this._lastCardsRef = t, this._lastCardsJson = e;
    const i = await ho(), s = [];
    for (const a of t)
      try {
        let r = null;
        i?.createCardElement ? r = await i.createCardElement(a) : a.type?.startsWith("custom:") && (r = document.createElement(a.type.slice(7)), r.setConfig?.(a)), r && (this.hass && (r.hass = this.hass), s.push(r));
      } catch {
      }
    return this._cardElements = s, s;
  }
  async _syncEmbeddedCards(t = !1) {
    const e = this._config?.cards ?? [], i = this._isDialogPreview ? this._previewHostEl : this._cardsHostEl;
    if (!i) return;
    const a = e !== this._lastCardsRef && JSON.stringify(e) !== this._lastCardsJson, r = this._lastBuildWasPreview !== this._isDialogPreview;
    if (t || a || r || i.childElementCount === 0) {
      this._lastBuildWasPreview = this._isDialogPreview;
      const n = await this._ensureCardInstances(e);
      if (this._isDialogPreview) {
        const l = this._buildSortablePreviewContainer(e, n);
        i.replaceChildren(l);
      } else {
        this._editModeElements = [], this._cardWrappers = [];
        const l = document.createElement("div");
        l.className = "popup-cards-grid";
        for (let p = 0; p < n.length; p++) {
          const { cols: c, rows: h } = ki(e[p], n[p]), f = document.createElement("div");
          f.className = "card", f.style.gridColumn = `span ${c}`, h && (f.style.gridRow = `span ${h}`), f.appendChild(n[p]), l.appendChild(f);
        }
        i.replaceChildren(l);
      }
    }
    if (this.hass) {
      for (const n of this._cardElements) n.hass = this.hass;
      for (const n of this._editModeElements) n.hass = this.hass;
    }
  }
  updated(t) {
    t.has("_config") && this._syncRegistration(), (this._isOpen || this._isDialogPreview) && (t.has("_config") || t.has("_isOpen") || t.has("_isDialogPreview")) && this._syncEmbeddedCards();
  }
  get _entity() {
    if (!(!this.hass || !this._config?.entity))
      return this.hass.states[this._config.entity];
  }
  get _isEntityActive() {
    const t = String(this._entity?.state ?? "").toLowerCase();
    return po.has(t);
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
      return d`<ha-icon .icon=${e}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      if (t.attributes.icon && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${t.attributes.icon}></ha-icon>`;
    }
    return Yt(t, this._isEntityActive);
  }
  _renderHeaderBar(t) {
    const e = this._entity, i = this._isEntityActive, s = mt(this.hass, e, this._config?.name) || this._config?.hash || "Pop-up", a = !!this._config?.entity && this._config?.show_header_button !== !1, o = !!e && this._config?.show_state !== !1 && e ? this.hass && typeof this.hass.formatEntityState == "function" ? this.hass.formatEntityState(e) : String(e.state ?? "") : "";
    return d`
      <header class="dialog-header ${t ? "is-preview" : ""}">
        <!-- Close (X) ALWAYS on the left per M3E guidelines -->
        <button
          type="button"
          class="close-btn"
          aria-label="Chiudi"
          @click=${() => t ? void 0 : this.closePopup(!0)}
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
          ${o || t && !this._isDialogPreview ? d`
                <span class="dialog-sub">
                  ${o}${o && t && !this._isDialogPreview ? " · " : ""}${t && !this._isDialogPreview ? this._config?.hash || "#popup" : ""}
                </span>
              ` : g}
        </div>

        <!-- Optional Entity Action Button ALWAYS on the right -->
        ${a ? d`
              <button
                type="button"
                class="header-action-btn ${i ? "is-active" : ""}"
                aria-label=${s}
                aria-pressed=${String(i)}
                @click=${() => this._onHeaderActionClick()}
              >
                ${this._renderHeaderIcon()}
              </button>
            ` : g}
      </header>
    `;
  }
  render() {
    return this._config ? this._isDialogPreview ? d`
        <div class="editor-preview-surface">
          ${this._renderHeaderBar(!0)}
          <div class="popup-body">
            <div class="preview-cards-host"></div>
          </div>
        </div>
      ` : d`
      ${this._isEditMode ? d`<div class="edit-header-host">${this._renderHeaderBar(!0)}</div>` : g}

      <dialog
        class="m3e-dialog m3e-popup-dialog"
        @click=${(t) => {
      t.target === this._dialogEl && this.closePopup(!0);
    }}
        @cancel=${(t) => {
      t.preventDefault(), this.closePopup(!0);
    }}
        @touchmove=${At}
      >
        <div class="m3e-dialog-surface dialog-surface">
          ${this._renderHeaderBar(!1)}

          <div class="popup-body">
            <div class="cards-host"></div>
            <div class="stack-portal ${this._isSectionGrid ? "is-section-grid" : ""}"></div>
          </div>
        </div>
      </dialog>
    ` : g;
  }
};
it.styles = [
  V,
  zs,
  R`
      :host {
        display: block;
        height: auto;
      }

      .editor-preview-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 28px;
        padding: 18px 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

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

      dialog.m3e-popup-dialog {
        --m3e-dialog-max-width: 460px;
        --m3e-dialog-mobile-max-height: 92dvh;
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

      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      .popup-cards-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: minmax(56px, auto);
        gap: 10px;
        align-items: stretch;
      }

      .popup-cards-grid > .card {
        position: relative;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .popup-cards-grid > .card > *,
      .popup-cards-grid hui-card-edit-mode {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      /* Material 3 Expressive Tonal Pill "+ Add card" button */
      .add-card-pill {
        grid-column: 1 / -1;
        width: 100%;
        height: 52px;
        margin-top: 6px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          filter var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .add-card-pill:hover {
        filter: brightness(1.07);
      }

      .add-card-pill:active {
        transform: scale(0.97);
        border-radius: 18px;
      }

      .add-card-pill ha-svg-icon {
        --mdc-icon-size: 20px;
        display: inline-flex;
      }

      .stack-portal {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

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
pt([
  O({ attribute: !1 })
], it.prototype, "hass", 2);
pt([
  b()
], it.prototype, "_config", 2);
pt([
  b()
], it.prototype, "_isOpen", 2);
pt([
  b()
], it.prototype, "_isEditMode", 2);
pt([
  b()
], it.prototype, "_isDialogPreview", 2);
pt([
  b()
], it.prototype, "_isSectionGrid", 2);
pt([
  z("dialog.m3e-popup-dialog")
], it.prototype, "_dialogEl", 2);
pt([
  z(".dialog-surface")
], it.prototype, "_surfaceEl", 2);
pt([
  z(".cards-host")
], it.prototype, "_cardsHostEl", 2);
pt([
  z(".preview-cards-host")
], it.prototype, "_previewHostEl", 2);
pt([
  z(".stack-portal")
], it.prototype, "_stackPortalEl", 2);
it = pt([
  B("m3e-popup-card")
], it);
const uo = {
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
}, mo = {
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
}, fo = {
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
}, go = {
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
function ct(t, e, i) {
  if (e.startsWith(`${i}.`)) return e;
  const s = t.entities?.[e]?.device_id;
  if (!(!s || !t.entities)) {
    for (const [a, r] of Object.entries(t.entities))
      if (r.device_id === s && a.startsWith(`${i}.`) && t.states[a])
        return a;
  }
}
function _o(t, e, i) {
  const s = t.entities?.[e]?.device_id;
  if (!s || !t.entities) return;
  const r = {
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
    const l = o.toLowerCase();
    if (r.some((p) => l.includes(p))) return o;
  }
}
function Wi(t, e, i, s, a, r) {
  const o = r?.trim() || void 0, n = (o?.startsWith("remote.") ? o : void 0) || ct(t, e, "remote"), l = (o?.startsWith("media_player.") ? o : void 0) || ct(t, e, "media_player"), p = l ? t.states[l] : void 0, c = s?.[i]?.trim();
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
    const v = n || e;
    if (v.startsWith("remote.")) {
      const _ = { entity_id: v, command: c };
      a?.trim() && (_.device = a.trim()), t.callService("remote", "send_command", _);
      return;
    }
  }
  const h = fo[i];
  if (p && h) {
    const v = Number(p.attributes.supported_features ?? 0), _ = mo[i] ?? 0;
    if (v === 0 || _ === 0 || (v & _) !== 0) {
      t.callService("media_player", h.service, {
        entity_id: p.entity_id,
        ...h.data ?? {}
      });
      return;
    }
  }
  const f = ((n ? t.entities?.[n]?.platform : void 0) || (l ? t.entities?.[l]?.platform : void 0) || t.entities?.[e]?.platform || "").toLowerCase(), m = uo[f];
  if (m) {
    if (m.service === "webostv.button" && l && m.commands[i]) {
      t.callService("webostv", "button", {
        entity_id: l,
        [m.paramKey ?? "button"]: m.commands[i]
      });
      return;
    }
    if (n && (i === "power_on" || i === "power_off") && f === "apple_tv") {
      t.callService("remote", i === "power_on" ? "turn_on" : "turn_off", {
        entity_id: n
      });
      return;
    }
    const v = m.commands[i];
    if (n && v) {
      const _ = { entity_id: n, command: v };
      a?.trim() && (_.device = a.trim()), t.callService("remote", "send_command", _);
      return;
    }
  }
  const u = _o(t, e, i);
  if (u) {
    t.callService("button", "press", { entity_id: u });
    return;
  }
  if (p && (i === "ch_up" || i === "ch_down")) {
    t.callService(
      "media_player",
      i === "ch_up" ? "media_next_track" : "media_previous_track",
      { entity_id: p.entity_id }
    );
    return;
  }
  if (n) {
    if ((i === "power_on" || i === "power_off") && !a?.trim()) {
      t.callService("remote", i === "power_on" ? "turn_on" : "turn_off", {
        entity_id: n
      });
      return;
    }
    const v = {
      entity_id: n,
      command: go[i]
    };
    a?.trim() && (v.device = a.trim()), t.callService("remote", "send_command", v);
  }
}
function ws(t, e, i, s, a, r) {
  const o = i.action_type || (i.command?.trim() ? "remote_command" : i.entity?.trim() ? "entity" : i.value?.trim() && !i.player_action ? "source" : "player");
  if (o === "player" && i.player_action) {
    Wi(
      t,
      e,
      i.player_action,
      s,
      i.device || a,
      r
    );
    return;
  }
  if (o === "source" && i.value?.trim()) {
    const n = i.entity?.trim() || ct(t, e, "media_player");
    n && t.callService("media_player", "select_source", {
      entity_id: n,
      source: i.value.trim()
    });
    return;
  }
  if ((o === "remote_command" || o === "ir_command") && i.command?.trim()) {
    const n = i.remote_entity?.trim() || void 0, l = r?.trim() || void 0, p = n || (i.entity?.trim().startsWith("remote.") ? i.entity.trim() : void 0) || (l?.startsWith("remote.") ? l : void 0) || ct(t, e, "remote"), c = (l?.startsWith("media_player.") ? l : void 0) || ct(t, e, "media_player");
    if (o === "remote_command" && !n && ((p ? t.entities?.[p]?.platform : void 0) || (c ? t.entities?.[c]?.platform : void 0) || t.entities?.[e]?.platform || "").toLowerCase() === "webostv" && c) {
      t.callService("webostv", "button", {
        entity_id: c,
        button: i.command.trim()
      });
      return;
    }
    if (p) {
      const h = {
        entity_id: p,
        command: i.command.trim()
      }, f = (i.device || a)?.trim();
      f && (h.device = f), t.callService("remote", "send_command", h);
    }
    return;
  }
  if (o === "entity" && i.entity?.trim()) {
    const n = i.entity.trim(), l = n.split(".")[0], p = i.entity_action || "auto";
    if (l === "button" || l === "input_button") {
      t.callService(l, "press", { entity_id: n });
      return;
    }
    if (l === "script" || l === "scene") {
      t.callService(l, "turn_on", { entity_id: n });
      return;
    }
    if ((l === "input_select" || l === "select") && (p === "select_option" || i.value?.trim())) {
      i.value?.trim() && t.callService(l, "select_option", {
        entity_id: n,
        option: i.value.trim()
      });
      return;
    }
    if (l === "media_player" && i.value?.trim() && p === "auto") {
      t.callService("media_player", "select_source", {
        entity_id: n,
        source: i.value.trim()
      });
      return;
    }
    if (p === "turn_on" || p === "turn_off" || p === "toggle") {
      t.callService(l, p, { entity_id: n });
      return;
    }
    t.callService(l, "toggle", { entity_id: n });
  }
}
function $s(t, e, i, s) {
  const a = i.action_type || (i.command?.trim() ? "remote_command" : i.entity?.trim() ? "entity" : i.value?.trim() && !i.player_action ? "source" : "player");
  if (a === "source" && i.value?.trim()) {
    const l = s?.trim() || i.entity?.trim() || ct(t, e, "media_player"), p = l ? t.states[l] : void 0, c = String(p?.attributes.source ?? "").trim().toLowerCase();
    return c !== "" && c === i.value.trim().toLowerCase();
  }
  if (a === "player" && i.player_action && !s) {
    const l = ct(t, e, "media_player"), p = (l ? t.states[l] : void 0) ?? t.states[e];
    if (!p) return !1;
    const c = String(p.state ?? "").toLowerCase();
    return i.player_action === "mute" ? p.attributes.is_volume_muted === !0 : i.player_action === "unmute" ? p.attributes.is_volume_muted === !1 : i.player_action === "play" ? c === "playing" : i.player_action === "pause" ? c === "paused" : i.player_action === "power_on" ? c !== "" && c !== "off" && c !== "standby" && c !== "unavailable" && c !== "unknown" : i.player_action === "power_off" ? c === "off" || c === "standby" : !1;
  }
  const r = s?.trim() || i.entity?.trim();
  if (!r) return !1;
  const o = t.states[r];
  if (!o) return !1;
  const n = String(o.state ?? "").toLowerCase();
  return n === "unavailable" || n === "unknown" ? !1 : i.active_state?.trim() ? n === i.active_state.trim().toLowerCase() : i.value?.trim() && (r.startsWith("input_select.") || r.startsWith("select.")) ? n === i.value.trim().toLowerCase() : i.entity_action === "turn_off" ? n === "off" || n === "standby" : ["on", "playing", "home", "open", "active", "true"].includes(n);
}
var vo = Object.defineProperty, bo = Object.getOwnPropertyDescriptor, fi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? bo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && vo(e, i, a), a;
};
const yo = [
  { value: "player", label: "Azione Player / Remote" },
  { value: "entity", label: "Entità / Script / Switch" },
  { value: "ir_command", label: "IR Command (Trasmettitore Remote)" },
  { value: "remote_command", label: "Comando Remote custom" },
  { value: "source", label: "Sorgente / App (Source)" }
], xo = [
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
], wo = [
  { value: "auto", label: "Automatico (toggle / press / script)" },
  { value: "toggle", label: "Toggle" },
  { value: "turn_on", label: "Turn On" },
  { value: "turn_off", label: "Turn Off" },
  { value: "select_option", label: "Select Option (input_select)" }
];
function Cs(t) {
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
        select: { mode: "dropdown", options: yo }
      }
    }
  ];
  return e === "player" ? i.push({
    name: "player_action",
    selector: {
      select: { mode: "dropdown", options: xo }
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
            select: { mode: "dropdown", options: wo }
          }
        },
        { name: "value", selector: { text: {} } }
      ]
    }
  ) : e === "remote_command" || e === "ir_command" ? i.push(
    {
      name: "remote_entity",
      selector: { entity: { domain: "remote" } }
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "command", selector: { text: {} } },
        { name: "device", selector: { text: {} } }
      ]
    }
  ) : e === "source" && i.push({ name: "value", selector: { text: {} } }), i;
}
let he = class extends N {
  constructor() {
    super(...arguments), this.controls = [], this._expandedIdx = null, this._computeLabel = (t) => ({
      label: "Etichetta",
      icon: "Icona (opzionale)",
      action_type: "Tipo azione",
      player_action: "Azione Player / Remote",
      entity: "Entità / Script",
      remote_entity: "Entità Remote / Trasmettitore (opzionale)",
      entity_action: "Servizio entità",
      value: "Valore (Sorgente / Opzione)",
      command: "Comando IR / Remote (es. NETFLIX, KEY_HDMI, VolUp)",
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
    const s = [...this.controls], [a] = s.splice(t, 1);
    s.splice(i, 0, a), this._expandedIdx === t && (this._expandedIdx = i), this._emit(s);
  }
  _updateControl(t, e) {
    const i = this.controls.map((s, a) => a === t ? { ...s, ...e } : s);
    this._emit(i);
  }
  _updateSegment(t, e, i) {
    const a = [...this.controls[t].segments ?? []];
    a[e] = { ...a[e], ...i }, this._updateControl(t, { segments: a });
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
    const s = (this.controls[t].segments ?? []).filter((a, r) => r !== e);
    s.length < 2 || this._updateControl(t, { segments: s });
  }
  render() {
    return this.hass ? d`
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

        ${this.controls.length === 0 ? d`
              <div class="empty-hint">
                Nessun controllo personalizzato. Aggiungi pulsanti nativi o pillole segmentate per
                azioni del player, script, entità o comandi remote.
              </div>
            ` : this.controls.map((t, e) => {
      const i = this._expandedIdx === e, s = t.type === "segmented" ? `Pillola: ${(t.segments ?? []).map((a) => a.label || "…").join(" | ")}` : t.type === "selector" ? `Selettore: ${t.label || t.entity || "Senza nome"}` : `Pulsante: ${t.label || t.command || t.player_action || "Senza nome"}`;
      return d`
                <div class="ctrl-card">
                  <div class="ctrl-head" @click=${() => this._expandedIdx = i ? null : e}>
                    <span class="ctrl-title">${s}</span>
                    <div class="ctrl-actions" @click=${(a) => a.stopPropagation()}>
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

                  ${i ? t.type === "button" ? d`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${t}
                              .schema=${[
        ...Cs(t),
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
                              @value-changed=${(a) => {
        a.stopPropagation(), this._updateControl(e, a.detail.value);
      }}
                            ></ha-form>
                          </div>
                        ` : t.type === "selector" ? d`
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
                                @value-changed=${(a) => {
        a.stopPropagation(), this._updateControl(e, a.detail.value);
      }}
                              ></ha-form>
                            </div>
                          ` : d`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${{ state_entity: t.state_entity ?? "" }}
                              .schema=${[{ name: "state_entity", selector: { entity: {} } }]}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(a) => {
        a.stopPropagation(), this._updateControl(e, {
          state_entity: a.detail.value.state_entity || void 0
        });
      }}
                            ></ha-form>

                            <div class="seg-list">
                              ${(t.segments ?? []).map(
        (a, r) => d`
                                  <div class="seg-card">
                                    <div class="seg-head">
                                      <span>Segmento ${r + 1}</span>
                                      ${(t.segments?.length ?? 0) > 2 ? d`
                                            <button
                                              type="button"
                                              class="mini-btn danger"
                                              @click=${() => this._removeSegment(e, r)}
                                            >
                                              ×
                                            </button>
                                          ` : g}
                                    </div>
                                    <ha-form
                                      .hass=${this.hass}
                                      .data=${a}
                                      .schema=${[
          ...Cs(a),
          { name: "active_state", selector: { text: {} } }
        ]}
                                      .computeLabel=${this._computeLabel}
                                      @value-changed=${(o) => {
          o.stopPropagation(), this._updateSegment(e, r, o.detail.value);
        }}
                                    ></ha-form>
                                  </div>
                                `
      )}
                            </div>

                            ${(t.segments?.length ?? 0) < 4 ? d`
                                  <button
                                    type="button"
                                    class="add-btn seg-add"
                                    @click=${() => this._addSegment(e)}
                                  >
                                    + Aggiungi segmento
                                  </button>
                                ` : g}
                          </div>
                        ` : g}
                </div>
              `;
    })}
      </div>
    ` : g;
  }
};
he.styles = R`
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
fi([
  O({ attribute: !1 })
], he.prototype, "hass", 2);
fi([
  O({ attribute: !1 })
], he.prototype, "controls", 2);
fi([
  b()
], he.prototype, "_expandedIdx", 2);
he = fi([
  B("m3e-remote-custom-controls-editor")
], he);
var $o = Object.defineProperty, Co = Object.getOwnPropertyDescriptor, ji = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Co(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && $o(e, i, a), a;
};
let Be = class extends N {
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
      remote_entity: "Entità Remote / Trasmettitore (opzionale)",
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
      show_volume: !0,
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
    if (!this.hass || !this._config) return g;
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
          {
            name: "remote_entity",
            selector: { entity: { domain: ["remote", "media_player"] } }
          },
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
    ], e = !!(this._config.entity && ct(this.hass, this._config.entity, "media_player")), i = {
      ...this._config,
      show_touchpad: this._config.show_touchpad ?? e,
      show_essentials: this._config.show_essentials ?? e
    };
    return d`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${i}
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
Be.styles = R`
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
ji([
  O({ attribute: !1 })
], Be.prototype, "hass", 2);
ji([
  b()
], Be.prototype, "_config", 2);
Be = ji([
  B("m3e-remote-card-editor")
], Be);
const ko = d`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
  </svg>
`;
function je(t) {
  return Array.isArray(t) ? Array.from(new Set(t.map((e) => String(e ?? "").trim()).filter(Boolean))) : [];
}
function So(t, e, i) {
  const s = i.entity?.trim() || ct(t, e, "media_player") || e, a = s ? t.states[s] : void 0, r = s.split(".")[0], o = i.label?.trim() || String(a?.attributes.friendly_name ?? "").trim() || s;
  if (!a)
    return { title: o, current: "", request: null, entityId: s };
  const n = i.selector_attribute || "auto";
  if (n === "options" || n === "auto" && (r === "input_select" || r === "select")) {
    const c = je(a.attributes.options), h = String(a.state ?? "").trim();
    return {
      title: o,
      current: h,
      entityId: s,
      request: c.length > 0 ? {
        title: o,
        options: c,
        current: h,
        onSelect: (f) => {
          t.callService(r === "select" ? "select" : "input_select", "select_option", {
            entity_id: s,
            option: f
          });
        }
      } : null
    };
  }
  if (n === "sound_mode_list") {
    const c = je(a.attributes.sound_mode_list), h = String(a.attributes.sound_mode ?? "").trim();
    return {
      title: o,
      current: h,
      entityId: s,
      request: c.length > 0 ? {
        title: o,
        options: c,
        current: h,
        onSelect: (f) => {
          t.callService("media_player", "select_sound_mode", {
            entity_id: s,
            sound_mode: f
          });
        }
      } : null
    };
  }
  const l = je(a.attributes.source_list);
  if (l.length > 0) {
    const c = String(a.attributes.source ?? "").trim();
    return {
      title: o,
      current: c,
      entityId: s,
      request: {
        title: o,
        options: l,
        current: c,
        onSelect: (h) => {
          t.callService("media_player", "select_source", {
            entity_id: s,
            source: h
          });
        }
      }
    };
  }
  const p = je(a.attributes.sound_mode_list);
  if (p.length > 0) {
    const c = String(a.attributes.sound_mode ?? "").trim();
    return {
      title: o,
      current: c,
      entityId: s,
      request: {
        title: o,
        options: p,
        current: c,
        onSelect: (h) => {
          t.callService("media_player", "select_sound_mode", {
            entity_id: s,
            sound_mode: h
          });
        }
      }
    };
  }
  return { title: o, current: String(a.state ?? ""), request: null, entityId: s };
}
const Js = R`
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
function Qs(t, e, i, s, a, r, o, n) {
  if (!t || !i || i.length === 0) return g;
  const l = [];
  for (const p of i)
    if (p.type === "segmented")
      l.push({ kind: "segmented", item: p });
    else if (p.type === "selector")
      l.push({ kind: "selector", item: p });
    else {
      const c = l[l.length - 1];
      c && c.kind === "buttons" ? c.items.push(p) : l.push({ kind: "buttons", items: [p] });
    }
  return d`
    <div class="custom-controls-stack">
      ${l.map((p) => {
    if (p.kind === "buttons")
      return d`
            <div class="custom-btn-grid ${p.items.length === 1 ? "is-single" : ""}">
              ${p.items.map((m) => {
        const u = $s(t, e, m, m.state_entity), v = m.label?.trim() || m.command || m.player_action || m.value || "Button";
        return d`
                  <button
                    type="button"
                    class="custom-remote-btn ${u ? "is-active" : ""}"
                    aria-pressed=${String(u)}
                    @click=${() => {
          navigator.vibrate?.(10), ws(
            t,
            e,
            m,
            s,
            a,
            n
          );
        }}
                  >
                    ${m.icon ? d`<ha-icon .icon=${m.icon}></ha-icon>` : g}
                    <span class="custom-remote-btn-label">${v}</span>
                  </button>
                `;
      })}
            </div>
          `;
    if (p.kind === "selector") {
      const m = So(t, e, p.item);
      return d`
            <button
              type="button"
              class="custom-selector-card"
              @click=${() => {
        navigator.vibrate?.(10), m.request && r ? r(m.request) : m.entityId && o && o(m.entityId);
      }}
            >
              <span class="custom-selector-left">
                ${p.item.icon ? d`<ha-icon .icon=${p.item.icon}></ha-icon>` : g}
                <span class="custom-selector-text">
                  <span class="custom-selector-title">${m.title}</span>
                  ${m.current ? d`<span class="custom-selector-val">${m.current}</span>` : g}
                </span>
              </span>
              <span class="custom-selector-chevron">${ko}</span>
            </button>
          `;
    }
    const c = (p.item.segments ?? []).slice(0, 4);
    if (c.length === 0) return g;
    const h = c.findIndex(
      (m) => $s(t, e, m, p.item.state_entity)
    ), f = h >= 0;
    return d`
          <div
            class="custom-seg-pill ${f ? "has-active" : ""}"
            role="group"
            style="--seg-count: ${c.length}; --seg-idx: ${Math.max(0, h)};"
          >
            ${f ? d`<span class="custom-seg-indicator" aria-hidden="true"></span>` : g}
            ${c.map((m, u) => {
      const v = u === h, _ = m.label?.trim() || m.value || m.command || m.player_action || `Option ${u + 1}`;
      return d`
                <button
                  type="button"
                  class="custom-seg-btn ${v ? "is-selected" : ""}"
                  aria-pressed=${String(v)}
                  @click=${() => {
        navigator.vibrate?.(10), ws(
          t,
          e,
          m,
          s,
          a,
          n
        );
      }}
                >
                  ${m.icon ? d`<ha-icon .icon=${m.icon}></ha-icon>` : g}
                  <span class="custom-seg-label">${_}</span>
                </button>
              `;
    })}
          </div>
        `;
  })}
    </div>
  `;
}
var Eo = Object.defineProperty, Mo = Object.getOwnPropertyDescriptor, vt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Mo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Eo(e, i, a), a;
};
const ks = d`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41Z" />
  </svg>
`, ke = d`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
  </svg>
`, Po = d`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
  </svg>
`, To = d`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
  </svg>
`;
let nt = class extends N {
  constructor() {
    super(...arguments), this._padOffsetX = 0, this._padOffsetY = 0, this._padActive = !1, this._padTapPulse = !1, this._pressed = !1, this._selectorSheet = null, this._padPointerId = null, this._padStartX = 0, this._padStartY = 0, this._padSwiped = !1, this._padDir = null, this._padHoldTimer = null, this._padRepeatTimer = null, this._padPulseTimer = null, this._prevStates = {}, this._onPadPointerDown = (t) => {
      if (t.button !== 0) return;
      t.currentTarget.setPointerCapture(t.pointerId), this._padPointerId = t.pointerId, this._padStartX = t.clientX, this._padStartY = t.clientY, this._padSwiped = !1, this._padDir = null, this._padActive = !0, this._padOffsetX = 0, this._padOffsetY = 0;
    }, this._onPadPointerMove = (t) => {
      if (this._padPointerId !== t.pointerId) return;
      const i = t.currentTarget.getBoundingClientRect(), s = t.clientX - this._padStartX, a = t.clientY - this._padStartY, r = Math.max(24, i.width / 2 - 28), o = Math.max(20, i.height / 2 - 28);
      if (this._padOffsetX = Math.max(-r, Math.min(r, s * 0.85)), this._padOffsetY = Math.max(-o, Math.min(o, a * 0.85)), Math.hypot(s, a) >= 24) {
        const l = Math.abs(s) >= Math.abs(a) ? s > 0 ? "dpad_right" : "dpad_left" : a > 0 ? "dpad_down" : "dpad_up";
        (!this._padSwiped || this._padDir !== l) && (this._padSwiped = !0, this._padDir = l, this._triggerKey(l), this._startPadRepeat(l));
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
      show_volume: !0,
      show_transport: !0,
      show_channels: !1,
      show_source: !0,
      show_power: !0,
      ...t
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), ut(this._sourceDialogEl, this._sourceSurfaceEl ?? null, () => {
      this._selectorSheet = null;
    }), this._clearPadTimers();
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
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_padOffsetX") || t.has("_padOffsetY") || t.has("_padActive") || t.has("_padTapPulse") || t.has("_pressed") || t.has("_selectorSheet"))
      return !0;
    if (t.has("hass") && this.hass && this._config) {
      const e = /* @__PURE__ */ new Set([this._config.entity]);
      this._config.status_entity && e.add(this._config.status_entity), this._config.remote_entity && e.add(this._config.remote_entity);
      const i = ct(this.hass, this._config.entity, "media_player");
      i && e.add(i);
      for (const r of this._config.remote_custom_controls ?? []) {
        r.entity && e.add(r.entity), r.state_entity && e.add(r.state_entity);
        for (const o of r.segments ?? [])
          o.entity && e.add(o.entity);
      }
      let s = !1;
      for (const r of e) {
        const o = this.hass.states[r];
        this._prevStates[r] !== o && (this._prevStates[r] = o, s = !0);
      }
      return t.get("hass")?.themes?.darkMode !== this.hass.themes?.darkMode && (s = !0), s;
    }
    return !1;
  }
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _mediaEntity() {
    if (!this.hass || !this._config) return;
    const t = ct(this.hass, this._config.entity, "media_player");
    return t ? this.hass.states[t] : void 0;
  }
  get _statusEntity() {
    if (!(!this.hass || !this._config))
      return this._config.status_entity && this.hass.states[this._config.status_entity] ? this.hass.states[this._config.status_entity] : this._mediaEntity ?? this._entity;
  }
  _triggerKey(t) {
    !this.hass || !this._config || (navigator.vibrate?.(10), Wi(
      this.hass,
      this._config.entity,
      t,
      this._config.remote_buttons,
      this._config.remote_device,
      this._config.remote_entity
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
  async _openSelectorDialog(t) {
    if (this._sourceDialogEl?.open) {
      let i = !0;
      try {
        i = this._sourceDialogEl.matches(":modal");
      } catch {
      }
      if (i) return;
    }
    this._selectorSheet = t, await this.updateComplete;
    const e = this._sourceDialogEl;
    if (!e) {
      this._selectorSheet = null;
      return;
    }
    Kt(e, this._sourceSurfaceEl ?? null, {
      onRequestClose: () => this._closeSourceDialog(),
      onForceReset: () => {
        this._selectorSheet = null;
      }
    });
  }
  _closeSourceDialog() {
    const t = this._sourceDialogEl;
    qt(t, this._sourceSurfaceEl ?? null, () => {
      this._selectorSheet = null;
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
      return d`<ha-icon .icon=${e}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      if (t.attributes.icon && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${t.attributes.icon}></ha-icon>`;
    }
    return Yt(t, !0);
  }
  render() {
    if (!this._config) return g;
    const t = this._entity, e = this._mediaEntity, i = e ?? t, s = this._statusEntity, a = String(s?.state ?? "").toLowerCase(), r = !!a && a !== "off" && a !== "standby" && a !== "unavailable" && a !== "unknown", o = i?.attributes.is_volume_muted === !0, n = String(e?.state ?? "").toLowerCase(), l = n === "playing", p = n === "paused", c = String(i?.attributes.source ?? "").trim(), h = String(e?.attributes.app_name ?? "").trim(), f = Array.isArray(i?.attributes.source_list) ? Array.from(
      new Set(
        i.attributes.source_list.map((k) => String(k ?? "").trim()).filter(Boolean)
      )
    ) : [], m = String(i?.attributes.sound_mode ?? "").trim(), u = Array.isArray(i?.attributes.sound_mode_list) ? Array.from(
      new Set(
        i.attributes.sound_mode_list.map((k) => String(k ?? "").trim()).filter(Boolean)
      )
    ) : [], v = mt(this.hass, t, this._config.name) || this._config.entity, _ = this.hass && s?.state && typeof this.hass.formatEntityState == "function" ? this.hass.formatEntityState(s) : a ? a.charAt(0).toUpperCase() + a.slice(1) : P(this.hass, "off"), x = r && (h || c) ? `${_} · ${h || c}` : _, y = !!e, w = this._config.show_touchpad ?? y, S = this._config.show_volume !== !1, M = this._config.show_essentials ?? y, $ = this._config.show_transport !== !1, L = this._config.show_channels === !0, E = this._config.show_source !== !1, C = this._config.show_power !== !1;
    return d`
      <ha-card
        class="remote-card is-wide-card ${this._pressed ? "is-pressed" : ""}"
        @pointerdown=${(k) => {
      k.button !== 0 || k.target?.closest('button, .remote-touchpad, [role="slider"]') || (this._pressed = !0);
    }}
        @pointerup=${() => {
      this._pressed = !1;
    }}
        @pointerleave=${() => {
      this._pressed = !1;
    }}
        @pointercancel=${() => {
      this._pressed = !1;
    }}
      >
        <!-- Header -->
        <div class="remote-header">
          <button
            type="button"
            class="header-id"
            @click=${() => i && this._openMoreInfo(i.entity_id)}
          >
            <span class="header-icon ${r ? "is-on" : ""}">${this._renderHeaderIcon()}</span>
            <span class="header-meta">
              <span class="header-title">${v}</span>
              <span class="header-sub">${x}</span>
            </span>
          </button>

          <div class="header-actions">
            ${E ? d`
                  <button
                    type="button"
                    class="source-chip"
                    @click=${() => {
      f.length > 0 && e ? this._openSelectorDialog({
        title: P(this.hass, "sources"),
        options: f,
        current: c,
        onSelect: (k) => {
          this.hass?.callService("media_player", "select_source", {
            entity_id: e.entity_id,
            source: k
          });
        }
      }) : i && this._openMoreInfo(i.entity_id);
    }}
                  >
                    <span class="source-chip-label">${c || P(this.hass, "sources")}</span>
                    <span class="source-chip-chevron">${ke}</span>
                  </button>
                ` : g}

            ${C ? d`
                  <button
                    type="button"
                    class="power-btn ${r ? "is-on" : ""}"
                    aria-label=${r ? P(this.hass, "off") : P(this.hass, "on")}
                    aria-pressed=${String(r)}
                    @click=${() => this._triggerKey(r ? "power_off" : "power_on")}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.16.98-4.09 2.58-5.41L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                      />
                    </svg>
                  </button>
                ` : g}
          </div>
        </div>

        <!-- Hero Zone: Touchpad / D-Pad + Vertical Volume Rocker -->
        ${w || S ? d`
              <div class="hero-grid ${w && S ? "" : "is-single"}">
                ${w ? this._config.pad_mode === "dpad" ? d`
                        <div class="dpad-surface" role="group" aria-label="Directional pad">
                          <button
                            type="button"
                            class="dpad-btn is-up"
                            aria-label="Up"
                            @click=${() => this._triggerKey("dpad_up")}
                          >
                            ${ks}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-left"
                            aria-label="Left"
                            @click=${() => this._triggerKey("dpad_left")}
                          >
                            ${Po}
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
                            ${To}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-down"
                            aria-label="Down"
                            @click=${() => this._triggerKey("dpad_down")}
                          >
                            ${ke}
                          </button>
                        </div>
                      ` : d`
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
                      ` : g}

                ${S ? d`
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
                          aria-label=${o ? P(this.hass, "unmute") : P(this.hass, "mute")}
                          aria-pressed=${String(o)}
                          @click=${() => this._triggerKey(o ? "unmute" : "mute")}
                        >
                          ${o ? d`
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    fill="currentColor"
                                    d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"
                                  />
                                </svg>
                              ` : d`
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
                    ` : g}
              </div>
            ` : g}

        <!-- 3 Essential Navigation Buttons: Back | Home | Assist -->
        ${M ? d`
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
            ` : g}

        <!-- M3 Expressive Transport Row -->
        ${$ ? d`
              <div class="transport-row">
                <button
                  type="button"
                  class="transport-icon is-prev"
                  aria-label=${P(this.hass, "previous")}
                  @click=${() => this._triggerKey("prev")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-circle ${l ? "is-active" : ""}"
                  aria-label=${P(this.hass, "play")}
                  aria-pressed=${String(l)}
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
                  aria-label=${P(this.hass, "pause")}
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
                  aria-label=${P(this.hass, "next")}
                  @click=${() => this._triggerKey("next")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
                  </svg>
                </button>
              </div>
            ` : g}

        <!-- Optional Channel Rocker -->
        ${L ? d`
              <div class="channel-pill">
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel down"
                  @click=${() => this._triggerKey("ch_down")}
                >
                  ${ke}
                </button>
                <span class="channel-label">CH</span>
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel up"
                  @click=${() => this._triggerKey("ch_up")}
                >
                  ${ks}
                </button>
              </div>
            ` : g}

        <!-- Native Sound Mode Selector (when supported by media_player) -->
        ${u.length > 0 && e ? d`
              <button
                type="button"
                class="custom-selector-card"
                @click=${() => {
      this._openSelectorDialog({
        title: "Sound mode",
        options: u,
        current: m,
        onSelect: (k) => {
          this.hass?.callService("media_player", "select_sound_mode", {
            entity_id: e.entity_id,
            sound_mode: k
          });
        }
      });
    }}
              >
                <span class="custom-selector-left">
                  <span class="custom-selector-text">
                    <span class="custom-selector-title">Sound mode</span>
                    ${m ? d`<span class="custom-selector-val">${m}</span>` : g}
                  </span>
                </span>
                <span class="custom-selector-chevron">${ke}</span>
              </button>
            ` : g}

        <!-- Custom Native Buttons, Segmented Pills & Selectors -->
        ${Qs(
      this.hass,
      this._config.entity,
      this._config.remote_custom_controls,
      this._config.remote_buttons,
      this._config.remote_device,
      (k) => this._openSelectorDialog(k),
      (k) => this._openMoreInfo(k),
      this._config.remote_entity
    )}
      </ha-card>

      <!-- Unified Selector Sheet Dialog (Sources, Sound Mode & Custom Selectors) -->
      <dialog
        class="m3e-dialog source-dialog"
        @click=${(k) => {
      k.target === this._sourceDialogEl && this._closeSourceDialog();
    }}
        @cancel=${(k) => {
      k.preventDefault(), this._closeSourceDialog();
    }}
        @touchmove=${At}
      >
        <div class="m3e-dialog-surface source-dialog-surface">
          <div class="source-dialog-header">
            <button
              type="button"
              class="dialog-close-btn"
              aria-label="Close"
              @click=${() => this._closeSourceDialog()}
            >
              ${ke}
            </button>
            <span>${this._selectorSheet?.title ?? P(this.hass, "sources")}</span>
          </div>
          <div class="source-list">
            ${(this._selectorSheet?.options ?? []).map((k) => {
      const T = k.toLowerCase() === (this._selectorSheet?.current ?? "").toLowerCase();
      return d`
                <button
                  type="button"
                  class="source-option ${T ? "is-selected" : ""}"
                  @click=${() => {
        this._selectorSheet?.onSelect(k), this._closeSourceDialog();
      }}
                >
                  <span>${k}</span>
                  ${T ? d`<span class="check-mark">✓</span>` : g}
                </button>
              `;
    })}
          </div>
        </div>
      </dialog>
    `;
  }
};
nt.styles = [
  V,
  zs,
  Js,
  R`
      :host {
        display: block;
      }

      ha-card.remote-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
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

      /* Source Sheet Dialog (inherits universal desktop modal + mobile bottom sheet) */
      dialog.source-dialog {
        --m3e-dialog-max-width: 400px;
        --m3e-dialog-mobile-max-height: 75dvh;
      }

      .source-dialog-surface {
        padding: 16px;
        gap: 12px;
      }

      @media (max-width: 600px) {
        .source-dialog-surface {
          padding: 18px 16px calc(22px + env(safe-area-inset-bottom, 0px));
        }
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
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .dialog-close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .dialog-close-btn:active {
        transform: scale(0.92);
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
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast);
      }

      .source-option:active {
        transform: scale(0.98);
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
vt([
  O({ attribute: !1 })
], nt.prototype, "hass", 2);
vt([
  b()
], nt.prototype, "_config", 2);
vt([
  b()
], nt.prototype, "_padOffsetX", 2);
vt([
  b()
], nt.prototype, "_padOffsetY", 2);
vt([
  b()
], nt.prototype, "_padActive", 2);
vt([
  b()
], nt.prototype, "_padTapPulse", 2);
vt([
  b()
], nt.prototype, "_pressed", 2);
vt([
  b()
], nt.prototype, "_selectorSheet", 2);
vt([
  z("dialog.source-dialog")
], nt.prototype, "_sourceDialogEl", 2);
vt([
  z(".source-dialog-surface")
], nt.prototype, "_sourceSurfaceEl", 2);
nt = vt([
  B("m3e-remote-card")
], nt);
var Ao = Object.defineProperty, Oo = Object.getOwnPropertyDescriptor, Ve = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Oo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Ao(e, i, a), a;
};
const Lo = 2200;
let Gt = class extends N {
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
    }, Lo);
  }
  _renderIcon(t, e) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return d`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const i = this._entity.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${i}></ha-icon>`;
    }
    return e ? d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.5 3.5 11.4 9l5.6 1.9-5.6 1.9-1.9 5.7-1.9-5.7L2 10.9 7.6 9 9.5 3.5Zm9 1.5.9 2.6L22 8.5l-2.6.9-.9 2.6-.9-2.6L15 8.5l2.6-.9.9-2.6Zm0 10 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"
            />
          </svg>
        ` : d`
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
    if (!this._config) return g;
    const t = this._entity, e = mt(this.hass, t, this._config.name, this._config.entity), i = this._config.icon?.trim() || void 0, s = this._config.accent ?? "primary", a = `style-${this._config.card_style ?? "default"}`, r = this._config.subtitle?.trim() || "", o = this._isUnavailable ? P(this.hass, "offline") : this._activated ? P(this.hass, "started") : r, n = !!this._config.hide_state, l = !n && !this._activated ? fe(this.hass, t, this._config.state_content, o) : null, p = n ? "" : l ?? o;
    return d`
      <ha-card
        class="scene-tile ${a} accent-${s} ${this._activated ? "is-on is-activated" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label=${e}
        @pointerdown=${(c) => {
      c.button === 0 && !this._isUnavailable && (this._pressed = !0);
    }}
        @pointerup=${() => {
      this._pressed && (this._pressed = !1, this._trigger());
    }}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @keydown=${(c) => {
      (c.key === " " || c.key === "Enter") && (c.preventDefault(), this._trigger());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="scene-icon">${this._renderIcon(i, this._activated)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            ${p ? d`<span class="tile-subtitle">${p}</span>` : g}
          </div>
          ${this._isUnavailable ? d`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : d`
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
Gt.styles = [
  V,
  R`
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
Ve([
  O({ attribute: !1 })
], Gt.prototype, "hass", 2);
Ve([
  b()
], Gt.prototype, "_config", 2);
Ve([
  b()
], Gt.prototype, "_pressed", 2);
Ve([
  b()
], Gt.prototype, "_activated", 2);
Gt = Ve([
  B("m3e-scene-card")
], Gt);
var Do = Object.defineProperty, Io = Object.getOwnPropertyDescriptor, gi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Io(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Do(e, i, a), a;
};
let ue = class extends N {
  constructor() {
    super(...arguments), this._expandedIndex = 0, this._onItemMoved = (t) => {
      if (t.stopPropagation(), !this._config) return;
      const { oldIndex: e, newIndex: i } = t.detail, s = [...this._config.items ?? []];
      if (e < 0 || i < 0 || e >= s.length || i >= s.length || e === i)
        return;
      const [a] = s.splice(e, 1);
      s.splice(i, 0, a), this._expandedIndex === e ? this._expandedIndex = i : this._expandedIndex > e && this._expandedIndex <= i ? this._expandedIndex -= 1 : this._expandedIndex < e && this._expandedIndex >= i && (this._expandedIndex += 1), this._emitConfig({ ...this._config, items: s });
    }, this._computeTopLabel = (t) => ({
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
    if (!this.hass || !this._config) return g;
    const t = this._config.items ?? [];
    return d`
      <div class="editor-root">
        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:text-short"></ha-icon>
          <span slot="header">Content</span>
          <div class="panel-body">
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
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:format-list-bulleted"></ha-icon>
          <span slot="header">Sensori (${t.length})</span>
          <div class="panel-body">
            ${t.length === 0 ? d`<div class="empty-hint">Nessun sensore aggiunto.</div>` : d`
                  <ha-sortable
                    handle-selector=".drag-handle"
                    @item-moved=${this._onItemMoved}
                  >
                    <div class="items-list">
                      ${t.map((e, i) => {
      const s = this._expandedIndex === i, a = e.entity ? this.hass?.states[e.entity] : void 0, r = {
        entity: e.entity ?? "",
        name: e.name ?? "",
        attribute: e.attribute ?? ""
      };
      return d`
                          <div class="item-row ${s ? "is-expanded" : ""}">
                            <div
                              class="item-header"
                              role="button"
                              tabindex="0"
                              @click=${() => {
        this._expandedIndex = s ? -1 : i;
      }}
                            >
                              <div class="drag-handle" @click=${(o) => o.stopPropagation()}>
                                <ha-icon icon="mdi:drag"></ha-icon>
                              </div>

                              <div class="item-icon" aria-hidden="true">
                                ${a ? d`<ha-state-icon
                                      .hass=${this.hass}
                                      .stateObj=${a}
                                    ></ha-state-icon>` : d`<ha-icon icon="mdi:gauge"></ha-icon>`}
                              </div>

                              <div class="item-summary">
                                <span class="item-title">${this._itemTitle(e, i)}</span>
                                <span class="item-sub">
                                  ${e.entity ? e.attribute ? `${e.entity} · ${e.attribute}` : e.entity : "Seleziona un sensore"}
                                </span>
                              </div>

                              <div class="item-actions">
                                <ha-icon-button
                                  class="row-action"
                                  .label=${s ? "Comprimi" : "Modifica"}
                                  @click=${(o) => {
        o.stopPropagation(), this._expandedIndex = s ? -1 : i;
      }}
                                >
                                  <ha-icon
                                    icon=${s ? "mdi:chevron-up" : "mdi:chevron-down"}
                                  ></ha-icon>
                                </ha-icon-button>
                                <ha-icon-button
                                  class="row-action danger"
                                  .label=${"Rimuovi"}
                                  @click=${(o) => this._removeItem(i, o)}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </ha-icon-button>
                              </div>
                            </div>

                            ${s ? d`
                                  <div class="item-body">
                                    <ha-form
                                      .hass=${this.hass}
                                      .data=${r}
                                      .schema=${this._buildItemSchema(e)}
                                      .computeLabel=${this._computeItemLabel}
                                      @value-changed=${(o) => this._onItemChanged(i, o)}
                                    ></ha-form>
                                  </div>
                                ` : g}
                          </div>
                        `;
    })}
                    </div>
                  </ha-sortable>
                `}

            <div class="add-row">
              <ha-button appearance="filled" size="small" @click=${this._addItem}>
                <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                Aggiungi sensore
              </ha-button>
            </div>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
ue.styles = R`
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
      --expansion-panel-summary-padding: 0 16px;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .empty-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 4px 2px;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-row {
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--outline-color, var(--divider-color));
      background: var(--card-background-color, transparent);
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .item-row.is-expanded {
      border-color: var(--primary-color);
    }

    .item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 52px;
      padding: 4px 6px 4px 8px;
      cursor: pointer;
      user-select: none;
    }

    .item-header:hover {
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
    }

    .drag-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 36px;
      color: var(--secondary-text-color);
      cursor: grab;
      flex-shrink: 0;
      --mdc-icon-size: 20px;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .item-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
      color: var(--secondary-text-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      --mdc-icon-size: 19px;
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      line-height: 1.3;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .row-action {
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
    }

    .row-action.danger:hover {
      color: var(--error-color);
    }

    .item-body {
      padding: 12px 14px 14px;
      border-top: 1px solid var(--divider-color);
    }

    .add-row {
      display: flex;
      justify-content: flex-start;
      padding-top: 2px;
    }
  `;
gi([
  O({ attribute: !1 })
], ue.prototype, "hass", 2);
gi([
  b()
], ue.prototype, "_config", 2);
gi([
  b()
], ue.prototype, "_expandedIndex", 2);
ue = gi([
  B("m3e-stack-card-editor")
], ue);
var zo = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, Yi = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ho(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && zo(e, i, a), a;
};
let Fe = class extends N {
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
      (a) => a.startsWith("sensor.") && e[a]?.attributes.device_class === "temperature" || a.startsWith("climate.")
    ).slice(0, 3);
    return {
      type: "custom:m3e-stack-card",
      title: "Indoor temperatures",
      show_unit: !1,
      items: i.length > 0 ? i.map((a) => ({ entity: a })) : [{ entity: "sensor.temperature" }]
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
    const a = String(s).trim(), r = a.toLowerCase();
    if (r === "unavailable" || r === "unknown") return "Offline";
    let o = a;
    if (/^-?\d+\.\d+$/.test(a)) {
      const n = Number(a);
      Number.isNaN(n) || (o = Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1))));
    }
    if (this._config?.show_unit && !t.attribute) {
      const n = e.attributes.unit_of_measurement;
      if (typeof n == "string" && n.trim()) {
        const l = n.trim();
        return l === "°" || l === "%" || l === "°C" || l === "°F" ? `${o}${l}` : `${o} ${l}`;
      }
    }
    return o;
  }
  _renderHeaderIcon() {
    const t = this._config?.icon?.trim();
    return t ? d`<ha-icon .icon=${t}></ha-icon>` : d`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return g;
    const t = this._config.title?.trim() || "Indoor temperatures", e = this._config.items ?? [];
    return d`
      <ha-card class="stack-card">
        <header class="stack-header">
          <span class="stack-icon" aria-hidden="true">${this._renderHeaderIcon()}</span>
          <span class="stack-title">${t}</span>
        </header>

        ${e.length === 0 ? d`<div class="empty-hint">Aggiungi due o più sensori dalla configurazione</div>` : d`
              <div class="stack-list">
                ${e.map((i) => {
      const s = i.entity ? this.hass?.states[i.entity] : void 0, a = i.name || s?.attributes.friendly_name || i.entity || "Sensore", r = this._formatValue(i, s);
      return d`
                    <div class="stack-row">
                      <span class="row-name">${a}</span>
                      <span class="row-value">${r}</span>
                    </div>
                  `;
    })}
              </div>
            `}
      </ha-card>
    `;
  }
};
Fe.styles = [
  V,
  R`
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
Yi([
  O({ attribute: !1 })
], Fe.prototype, "hass", 2);
Yi([
  b()
], Fe.prototype, "_config", 2);
Fe = Yi([
  B("m3e-stack-card")
], Fe);
const ta = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/, No = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/, ea = /* @__PURE__ */ new Set(["s", "sec", "secs", "second", "seconds", "min", "mins", "minute", "minutes", "m", "h", "hr", "hrs", "hour", "hours", "d", "day", "days"]);
function Ss(t) {
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function Nt(t) {
  if (t == null) return null;
  const e = String(t).trim();
  if (!e) return null;
  const i = e.match(/^(\d+):(\d{2}):(\d{2})$/);
  if (i)
    return (Number(i[1]) * 3600 + Number(i[2]) * 60 + Number(i[3])) * 1e3;
  let s = 0, a = !1;
  const r = /(\d+(?:\.\d+)?)\s*(d|days?|giorn[io]|h|hrs?|hours?|or[ae]|m|mins?|minutes?|minut[io]|s|secs?|seconds?|second[io])\b/gi;
  let o;
  for (; (o = r.exec(e)) !== null; ) {
    a = !0;
    const n = parseFloat(o[1]), l = o[2].toLowerCase();
    l.startsWith("d") || l.startsWith("giorn") ? s += n * 864e5 : l.startsWith("h") || l.startsWith("or") ? s += n * 36e5 : l.startsWith("m") ? s += n * 6e4 : l.startsWith("s") && (s += n * 1e3);
  }
  return a ? s : null;
}
function Si(t, e) {
  if (!e) return null;
  const i = e.trim().toLowerCase();
  return ea.has(i) ? i === "s" || i.startsWith("sec") ? t * 1e3 : i === "m" || i.startsWith("min") ? t * 6e4 : i === "h" || i.startsWith("hr") || i.startsWith("hour") ? t * 36e5 : i === "d" || i.startsWith("day") ? t * 864e5 : null : null;
}
function Se(t, e) {
  if (e) {
    if (typeof e.attributes.timestamp == "number" && Number.isFinite(e.attributes.timestamp)) {
      const a = e.attributes.timestamp;
      if (a >= 0 && a <= 86400 && e.attributes.has_date === !1) {
        const r = /* @__PURE__ */ new Date();
        return r.setHours(0, 0, 0, 0), r.getTime() + a * 1e3;
      }
      return a > 1e12 ? a : a * 1e3;
    }
    if (typeof e.attributes.finishes_at == "string") {
      const a = Date.parse(e.attributes.finishes_at);
      if (Number.isFinite(a)) return a;
    }
  }
  if (t == null) return null;
  const i = String(t).trim();
  if (!i || i === "unavailable" || i === "unknown" || i === "none") return null;
  if (i.toLowerCase() === "now") return Date.now();
  const s = i.match(No);
  if (s) {
    const a = /* @__PURE__ */ new Date();
    return a.setHours(Number(s[1]), Number(s[2]), Number(s[3] ?? 0), 0), a.getTime();
  }
  if (ta.test(i) || e?.attributes.device_class === "timestamp") {
    const a = Date.parse(i);
    if (Number.isFinite(a)) return a;
  }
  return null;
}
function Rt(t, e) {
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
function Es(t) {
  const e = Math.max(0, Math.round(t / 1e3)), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), a = e % 60;
  return i > 0 ? s > 0 ? `${i}h ${s}m` : `${i}h` : s > 0 ? a > 0 && s < 10 ? `${s}m ${a}s` : `${s}m` : `${a}s`;
}
function Ms(t, e, i, s) {
  const a = `m3e_badge_prog_${t}`;
  try {
    const o = window.localStorage.getItem(a);
    if (o) {
      const n = JSON.parse(o);
      if (n && n.sig === e && Number.isFinite(n.startMs)) {
        if (s !== void 0 && (n.peakVal === void 0 || s > n.peakVal)) {
          const l = { sig: e, startMs: n.startMs, peakVal: s };
          return window.localStorage.setItem(a, JSON.stringify(l)), l;
        }
        return n;
      }
    }
  } catch {
  }
  const r = { sig: e, startMs: i, peakVal: s };
  try {
    window.localStorage.setItem(a, JSON.stringify(r));
  } catch {
  }
  return r;
}
const Ro = /(remain|left|rimanent|restant|time_to_full|time_left|charging_time|eta|countdown)/i;
function Bo(t) {
  if (!t) return !1;
  const e = `${t.entity_id} ${String(t.attributes.friendly_name ?? "")}`;
  return Ro.test(e);
}
function Ps(t, e, i = Date.now()) {
  if (!t || !e.progress_enabled)
    return { percent: null, isTimeBased: !1 };
  const s = e.progress_entity?.trim() || e.entity, a = t.states[s], r = e.progress_start_entity ? t.states[e.progress_start_entity] : void 0, o = e.progress_end_entity ? t.states[e.progress_end_entity] : void 0, n = (w, S, M) => {
    if (w === null) return { percent: null, isTimeBased: S, liveRemainingText: M };
    const $ = Ss(w);
    return {
      percent: e.progress_invert ? Ss(100 - $) : $,
      isTimeBased: S,
      liveRemainingText: M
    };
  }, l = a?.entity_id.startsWith("timer.") ? a : o?.entity_id.startsWith("timer.") ? o : void 0;
  if (l) {
    const w = Nt(l.attributes.duration);
    if (l.state === "idle" || !w || w <= 0)
      return n(0, !1);
    if (l.state === "active" && typeof l.attributes.finishes_at == "string") {
      const S = Date.parse(l.attributes.finishes_at);
      if (Number.isFinite(S)) {
        const M = Math.max(0, S - i), $ = (w - M) / w * 100;
        return n($, !0, Es(M));
      }
    }
    if (l.state === "paused") {
      const S = Nt(l.attributes.remaining);
      if (S !== null) {
        const M = (w - S) / w * 100;
        return n(M, !1, Es(S));
      }
    }
    return n(0, !1);
  }
  const p = Se(a?.state, a), c = !!e.progress_start_now || String(e.progress_start_value ?? "").trim().toLowerCase() === "now", h = r ? Se(r.state, r) : c ? null : Se(e.progress_start_value), f = o ? Se(o.state, o) : Se(e.progress_end_value);
  let m = f ?? p;
  if (m !== null) {
    c && m < i - 6e4 && !ta.test(String(o?.state ?? a?.state ?? "")) && (m += 864e5);
    let w = h;
    if (w === null) {
      const L = !c && e.progress_start_value !== void 0 && e.progress_start_value !== "" ? Number(e.progress_start_value) : NaN;
      Number.isFinite(L) && L > 0 ? w = m - L * 6e4 : w = Ms(e.entity, `ts:${m}`, i).startMs;
    }
    m <= w && (i < m ? w -= 864e5 : m += 864e5);
    const S = m - w;
    if (S <= 0) return n(100, !0);
    const $ = ((h !== null && f !== null && p !== null && p !== m ? p : i) - w) / S * 100;
    return n($, !0);
  }
  const u = String(a?.state ?? "").trim(), v = String(a?.attributes.unit_of_measurement ?? "").trim(), _ = Rt(a?.state, a), x = Nt(u) ?? (_ !== null ? Si(_, v) : null);
  if ((Bo(a) || !!e.progress_start_now || Nt(u) !== null && _ === null) && x !== null && (ea.has(v.toLowerCase()) || a?.attributes.device_class === "duration" || Nt(u) !== null)) {
    if (x <= 0) return n(100, !1);
    const w = o ? Nt(o.state) ?? (Rt(o.state, o) !== null ? Si(
      Rt(o.state, o),
      String(o.attributes.unit_of_measurement ?? v)
    ) : null) : null, S = Nt(e.progress_end_value) ?? (e.progress_end_value !== void 0 && e.progress_end_value !== "" ? Si(Number(e.progress_end_value), v || "min") : null);
    let M = w ?? S;
    if (!M || M <= 0) {
      const L = Ms(s, "rem_session", i, x);
      M = Math.max(x, L.peakVal ?? x);
    }
    const $ = M > 0 ? (M - x) / M * 100 : 0;
    return n($, !1);
  }
  if (_ !== null) {
    const w = (r ? Rt(r.state, r) : null) ?? Rt(e.progress_start_value) ?? (typeof a?.attributes.min == "number" ? a.attributes.min : null) ?? (typeof a?.attributes.minimum == "number" ? a.attributes.minimum : null) ?? 0, M = ((o ? Rt(o.state, o) : null) ?? Rt(e.progress_end_value) ?? (typeof a?.attributes.max == "number" ? a.attributes.max : null) ?? (typeof a?.attributes.maximum == "number" ? a.attributes.maximum : null) ?? 100) - w;
    if (M === 0) return n(0, !1);
    const $ = (_ - w) / M * 100;
    return n($, !1);
  }
  return n(null, !1);
}
var Fo = Object.defineProperty, Uo = Object.getOwnPropertyDescriptor, ge = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Uo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Fo(e, i, a), a;
};
const Vo = /* @__PURE__ */ new Set([
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
let kt = class extends N {
  constructor() {
    super(...arguments), this._pressed = !1, this._tick = 0, this._alertPulse = !1, this._tickTimer = null, this._tickIntervalMs = 0, this._alertPulseTimer = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null, this._tickIntervalMs = 0), this._alertPulseTimer !== null && (window.clearTimeout(this._alertPulseTimer), this._alertPulseTimer = null);
  }
  updated() {
    const t = this._entity?.entity_id.startsWith("timer.") && this._entity.state === "active", e = this._config ? Ps(this.hass, this._config) : null, i = !!(this._entity && (this._entity.attributes.device_class === "timestamp" || Pi(String(this._entity.state ?? ""), this.hass) !== null)), s = t ? 1e3 : e?.isTimeBased ? 5e3 : i ? 3e4 : 0;
    s !== this._tickIntervalMs && (this._tickTimer !== null && (window.clearInterval(this._tickTimer), this._tickTimer = null), this._tickIntervalMs = s, s > 0 && (this._tickTimer = window.setInterval(() => {
      this._tick++;
    }, s)));
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-status-badge: entity is required");
    const e = this._config;
    e && (e.entity !== t.entity || e.alert_attribute !== t.alert_attribute || e.alert_operator !== t.alert_operator || e.alert_value !== t.alert_value) && (this._prevAlertRaw = void 0, this._alertPulse = !1, this._alertPulseTimer !== null && (window.clearTimeout(this._alertPulseTimer), this._alertPulseTimer = null)), this._config = {
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
                    { value: "glance", label: "Glance Mini (Cerchio · At a Glance)" },
                    { value: "glance_icon", label: "Glance Mini Solo Icona (Cerchio compatto)" },
                    { value: "split", label: "Split Tonal Pill (Fitbit Squircle · Telemetria)" },
                    { value: "dot", label: "Minimal Dot Badge (Ultra-compatto con pallino)" }
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
          icon: "mdi:palette",
          title: "Colori & Modalità Alert",
          schema: [
            {
              name: "base_color",
              selector: { ui_color: { default_color: "state", include_state: !0 } }
            },
            { name: "alert_color", selector: { boolean: {} } },
            {
              name: "alert_custom_color",
              selector: { ui_color: { default_color: "red", include_none: !0 } }
            },
            {
              name: "alert_attribute",
              selector: { attribute: {} },
              context: { filter_entity: "entity" }
            },
            {
              type: "grid",
              name: "",
              schema: [
                {
                  name: "alert_operator",
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "equals", label: "Uguale a (stato/valore)" },
                        { value: "not_equals", label: "Diverso da" },
                        { value: "above", label: "Maggiore di (>)" },
                        { value: "below", label: "Minore di (<)" },
                        { value: "changed", label: "Quando cambia (o diverso da)" }
                      ]
                    }
                  }
                },
                { name: "alert_value", selector: { text: {} } }
              ]
            }
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
            },
            { name: "progress_show_entity_state", selector: { boolean: {} } }
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
        alert_color: "Attiva modalità Alert quando l’entità è attiva",
        base_color: "Colore base badge (armonizzato Material 3)",
        alert_custom_color: "Colore modalità Alert (vuoto = Errore M3)",
        alert_attribute: "Attributo da monitorare per Alert (vuoto = stato principale)",
        alert_operator: "Condizione Alert",
        alert_value: 'Valore / soglia Alert (opzionale per "Quando cambia")',
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
        progress_show_percent: "Mostra percentuale (%)",
        progress_show_entity_state: "Mostra stato entità progresso nella barra"
      })[t.name] ?? t.name
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_pressed") || t.has("_tick") || t.has("_alertPulse"))
      return !0;
    if (t.has("hass") && this.hass) {
      const e = this.hass.states[this._config.entity], i = this._config.progress_entity ? this.hass.states[this._config.progress_entity] : void 0, s = this._config.progress_start_entity ? this.hass.states[this._config.progress_start_entity] : void 0, a = this._config.progress_end_entity ? this.hass.states[this._config.progress_end_entity] : void 0, r = t.get("hass");
      return e !== this._prevEntity || i !== this._prevProgressEntity || s !== this._prevStartEntity || a !== this._prevEndEntity || r?.themes?.darkMode !== this.hass.themes?.darkMode ? (this._prevEntity = e, this._prevProgressEntity = i, this._prevStartEntity = s, this._prevEndEntity = a, !0) : !1;
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
    return this._config?.active_state?.trim() ? this._config.active_state.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).includes(t) : Vo.has(t);
  }
  _getAlertSourceValue(t) {
    if (!t) return "";
    const e = this._config?.alert_attribute?.trim(), i = e ? t.attributes?.[e] : t.state;
    return i == null ? "" : typeof i == "object" ? JSON.stringify(i) : String(i).trim();
  }
  _isAlertTriggered(t, e) {
    const i = this._config;
    if (!i) return !1;
    if (!!!(i.alert_attribute?.trim() || i.alert_operator || i.alert_value?.trim()))
      return t && (!!i.alert_color || e === "alert");
    const a = this._entity;
    if (!a || this._isUnavailable) return !1;
    const r = this._getAlertSourceValue(a), o = i.alert_value?.trim() ?? "", n = i.alert_operator ?? (o ? "equals" : "changed");
    if (n === "changed")
      return o ? r.toLowerCase() !== o.toLowerCase() : this._alertPulse;
    if (!o) return !1;
    if (n === "above" || n === "below") {
      const c = Number(r), h = Number(o);
      return !Number.isFinite(c) || !Number.isFinite(h) ? !1 : n === "above" ? c > h : c < h;
    }
    const l = o.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean), p = r.toLowerCase();
    return n === "equals" ? l.includes(p) : n === "not_equals" ? r !== "" && !l.includes(p) : !1;
  }
  willUpdate(t) {
    if (!this._config || !t.has("hass") && !t.has("_config"))
      return;
    const e = !!(this._config.alert_attribute?.trim() || this._config.alert_operator || this._config.alert_value?.trim()), i = this._config.alert_operator ?? (this._config.alert_value?.trim() ? "equals" : "changed");
    if (!e || i !== "changed" || this._config.alert_value?.trim())
      return;
    const s = this._getAlertSourceValue(this._entity);
    this._prevAlertRaw === void 0 ? this._prevAlertRaw = s : s !== this._prevAlertRaw && (this._prevAlertRaw = s, this._alertPulse = !0, this._alertPulseTimer !== null && window.clearTimeout(this._alertPulseTimer), this._alertPulseTimer = window.setTimeout(() => {
      this._alertPulse = !1, this._alertPulseTimer = null;
    }, 12e3));
  }
  _formatEntityValue(t) {
    if (!t || !t.state || t.state === "unavailable" || t.state === "unknown")
      return P(this.hass, "offline");
    const e = String(t.state ?? "").trim(), i = Pi(e, this.hass);
    if (i) return i;
    const s = e.toLowerCase();
    if (s === "home") return P(this.hass, "home");
    if (s === "not_home") return P(this.hass, "away");
    if (s === "on") return P(this.hass, "on");
    if (s === "off") return P(this.hass, "off");
    const a = String(t.attributes.unit_of_measurement ?? "");
    if (/^-?\d+\.\d+$/.test(e)) {
      const r = parseFloat(e), o = Number.isInteger(r) ? String(r) : r.toFixed(1).replace(/\.0$/, "");
      return a ? `${o} ${a}` : o;
    }
    if (typeof this.hass?.formatEntityState == "function")
      try {
        return this.hass.formatEntityState(t);
      } catch {
      }
    return a ? `${e} ${a}` : e;
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
        re(this, this.hass, this._config.navigation_path);
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
      return d`<ha-icon .icon=${i}></ha-icon>`;
    if (this._config?.use_entity_icon && t && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
      const s = t.attributes.icon;
      if (s && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${s}></ha-icon>`;
    }
    return Yt(t, e);
  }
  render() {
    if (!this._config) return g;
    const t = this._entity, e = this._config.badge_style ?? "glance", i = e === "alert" ? "split" : e, s = this._isUnavailable, a = this._isActive, r = !s && this._isAlertTriggered(a, e), o = mt(this.hass, t, this._config.name, this._config.entity), n = this.hass?.themes?.darkMode !== !1, l = s ? null : r && this._config.alert_custom_color ? ei(this._config.alert_custom_color, n) : !r && this._config.base_color ? ei(this._config.base_color, n) : null, p = Ps(this.hass, this._config), c = p.percent !== null, h = p.percent ?? 0, f = this._config.progress_enabled && this._config.progress_show_entity_state && this._config.progress_entity ? this.hass?.states[this._config.progress_entity] : void 0, m = f ?? t, u = p.liveRemainingText || this._formatEntityValue(m), v = !!this._config.hide_state, _ = !v && !f ? fe(this.hass, t, this._config.state_content, u) : null;
    let x = v ? "" : _ ?? u;
    if (!v && this._config.progress_show_percent && c) {
      const E = `${Math.round(h)}%`;
      x = x && !x.includes("%") ? `${x} · ${E}` : E;
    }
    const y = s ? "is-unavailable" : r ? "is-alert" : a ? "is-active" : "is-inactive", w = (this._config.tap_action ?? "more-info") !== "none", S = 119.38, M = S * (1 - h / 100), $ = [];
    return c && $.push(`--badge-pct: ${h.toFixed(1)}%`), l && $.push(
      `--m3e-badge-container: ${l.container}`,
      `--m3e-badge-well: ${l.well}`,
      `--m3e-badge-progress: ${l.progressFill}`,
      `--m3e-badge-on-container: ${l.onContainer}`,
      `--m3e-badge-accent: ${l.accent}`,
      `--m3e-badge-on-accent: ${l.onAccent}`
    ), d`
      <button
        type="button"
        class="m3e-badge style-${i} ${y} ${l ? "has-custom-color" : ""} ${c ? "has-progress" : ""} ${this._pressed ? "is-pressed" : ""} ${w ? "is-clickable" : ""}"
        style=${$.length > 0 ? $.join("; ") : ""}
        title="${o}${x ? ` · ${x}` : ""}"
        aria-label="${o}${x ? `, ${x}` : ""}"
        @pointerdown=${(E) => {
      !w || E.pointerType === "mouse" && E.button !== 0 || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._onTap()}
      >
        ${c && (i === "dot" || i === "split") ? d`<span class="badge-progress-fill" aria-hidden="true"></span>` : g}

        ${i === "glance" || i === "glance_icon" ? d`
              <span class="g-circle ${c ? "has-ring" : ""}" aria-hidden="true">
                ${c ? d`
                      <svg class="g-ring" viewBox="0 0 44 44" aria-hidden="true">
                        <circle class="g-ring-track" cx="22" cy="22" r="19" />
                        <circle
                          class="g-ring-fill"
                          cx="22"
                          cy="22"
                          r="19"
                          stroke-dasharray=${S}
                          stroke-dashoffset=${M}
                        />
                      </svg>
                    ` : g}
                <span class="g-circle-inner">${this._renderIcon(t, a)}</span>
              </span>
              ${i === "glance" ? d`
                    <span class="g-text">
                      ${x ? d`<span class="g-val">${x}</span>` : g}
                      <span class="g-lbl">${o}</span>
                    </span>
                  ` : g}
            ` : i === "dot" ? d`
                <span class="d-wrap" aria-hidden="true">
                  ${this._renderIcon(t, a)}
                  <span class="d-dot"></span>
                </span>
                <span class="d-txt">${x || o}</span>
              ` : d`
                <span class="s-content">
                  <span class="s-left" aria-hidden="true">${this._renderIcon(t, a)}</span>
                  <span class="s-right">
                    <span class="s-lbl">${o}</span>
                    ${x ? d`<span class="s-val">${x}</span>` : g}
                  </span>
                </span>
              `}
      </button>
    `;
  }
};
kt.styles = [
  V,
  R`
      :host {
        display: inline-flex;
        width: auto;
        height: auto;
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
          border-radius var(--m3e-spring-bouncy);
        -webkit-tap-highlight-color: transparent;
      }

      .badge-progress-fill {
        position: absolute;
        inset: 0 auto 0 0;
        height: 100%;
        border-radius: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 82%,
          transparent
        );
        transition: width 0.4s cubic-bezier(0.2, 0, 0, 1);
        pointer-events: none;
        z-index: 0;
      }

      .m3e-badge.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error, #ffb4ab) 32%,
          var(--md-sys-color-error-container, #93000a)
        );
      }

      .style-dot.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .m3e-badge.is-active:not(.is-alert) .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary, #b1c5ff) 35%,
          var(--md-sys-color-primary-container, #2e4379)
        );
      }

      .m3e-badge.style-dot.is-active:not(.is-alert) .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
      }

      .m3e-badge.has-custom-color .badge-progress-fill {
        background: var(--m3e-badge-progress);
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
         1. GLANCE MINI (Compact At a Glance — 40px/44px circle + thick progress ring)
         ===================================================================== */
      .m3e-badge.style-glance {
        background: transparent;
        padding: 2px 6px 2px 2px;
        gap: 9px;
        border-radius: 9999px;
      }

      .m3e-badge.style-glance_icon {
        background: transparent;
        padding: 0;
        border-radius: 9999px;
      }

      .g-circle {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .style-glance_icon .g-circle {
        width: 44px;
        height: 44px;
      }

      .g-circle-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.18))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .g-circle.has-ring .g-circle-inner {
        width: calc(100% - 11px);
        height: calc(100% - 11px);
      }

      .g-ring {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        pointer-events: none;
      }

      .g-ring-track {
        fill: none;
        stroke: color-mix(in srgb, var(--md-sys-color-outline-variant, #74777f) 34%, transparent);
        stroke-width: 4.2;
      }

      .g-ring-fill {
        fill: none;
        stroke: var(--md-sys-color-primary, #b1c5ff);
        stroke-width: 4.4;
        stroke-linecap: round;
        transition: stroke-dashoffset var(--m3e-spring-spatial-default);
      }

      .style-glance.is-active .g-circle-inner,
      .style-glance_icon.is-active .g-circle-inner {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-glance.is-alert .g-circle-inner,
      .style-glance_icon.is-alert .g-circle-inner {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .style-glance.is-alert .g-ring-fill,
      .style-glance_icon.is-alert .g-ring-fill {
        stroke: var(--md-sys-color-error, #ffb4ab);
      }

      .style-glance.has-custom-color .g-circle-inner,
      .style-glance_icon.has-custom-color .g-circle-inner {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
      }

      .style-glance.has-custom-color .g-ring-fill,
      .style-glance_icon.has-custom-color .g-ring-fill {
        stroke: var(--m3e-badge-accent);
      }

      .g-circle-inner svg,
      .g-circle-inner ha-icon {
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .style-glance_icon .g-circle-inner svg,
      .style-glance_icon .g-circle-inner ha-icon {
        width: 21px;
        height: 21px;
        --mdc-icon-size: 21px;
      }

      .g-circle.has-ring .g-circle-inner svg,
      .g-circle.has-ring .g-circle-inner ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
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
         2. SPLIT TONAL PILL (4-Layer Fitbit Stadium-Well Pill — 44px height)
         ===================================================================== */
      .m3e-badge.style-split {
        position: relative;
        height: 44px;
        padding: 5px 14px 5px 5px;
        border-radius: 14px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-low, #1f2027);
      }

      .m3e-badge.style-split.is-active {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-primary-container, #2e4379)
        );
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .m3e-badge.style-split.is-alert {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-error-container, #93000a)
        );
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m3e-badge.style-split.has-custom-color {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
      }

      .s-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 9px;
        height: 100%;
        min-width: 0;
        flex: 1;
      }

      .s-left {
        width: 24px;
        height: 34px;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-surface-container-low, #1f2027)
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .style-split.is-active .s-left {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 44%,
          var(--md-sys-color-primary-container, #2e4379)
        );
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-split.is-alert .s-left {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 44%,
          var(--md-sys-color-error-container, #93000a)
        );
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .style-split.has-custom-color .s-left {
        background: var(--m3e-badge-well);
        color: var(--m3e-badge-on-container);
      }

      .s-left svg,
      .s-left ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }

      .s-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1px;
        min-width: 0;
      }

      .s-lbl {
        font-size: 10.5px;
        font-weight: 500;
        line-height: 1.1;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .style-split.is-active .s-lbl,
      .style-split.is-alert .s-lbl,
      .style-split.has-custom-color .s-lbl {
        color: inherit;
        opacity: 0.9;
      }

      .s-val {
        font-size: 14px;
        font-weight: 700;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
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

      .m3e-badge.style-dot.has-custom-color {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
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

      .style-dot.has-custom-color .d-wrap {
        background: var(--m3e-badge-well);
        color: var(--m3e-badge-on-container);
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

      .style-dot.has-custom-color .d-dot {
        background: var(--m3e-badge-accent);
        border-color: var(--m3e-badge-container);
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
    `
];
ge([
  O({ attribute: !1 })
], kt.prototype, "hass", 2);
ge([
  b()
], kt.prototype, "_config", 2);
ge([
  b()
], kt.prototype, "_pressed", 2);
ge([
  b()
], kt.prototype, "_tick", 2);
ge([
  b()
], kt.prototype, "_alertPulse", 2);
kt = ge([
  B("m3e-status-badge")
], kt);
let Ye = null, Ge = null;
function ri(t, e = 4e3) {
  return typeof customElements > "u" ? Promise.resolve(!1) : customElements.get(t) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(t).then(() => !0),
    new Promise((i) => window.setTimeout(() => i(!!customElements.get(t)), e))
  ]);
}
async function ia() {
  if (typeof customElements > "u") return !1;
  if (customElements.get("hui-card-features")) return !0;
  Ye || (Ye = (async () => {
    try {
      return window.loadCardHelpers && await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "" }), await ri("hui-tile-card", 3e3), await ri("hui-card-features", 3e3);
    } catch {
      return !!customElements.get("hui-card-features");
    }
  })());
  const t = await Ye;
  return t || (Ye = null), t;
}
async function sa() {
  if (typeof customElements > "u") return !1;
  if (customElements.get("hui-card-features-editor") && customElements.get("hui-sub-element-editor"))
    return !0;
  Ge || (Ge = (async () => {
    try {
      window.loadCardHelpers && await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "" }), await ri("hui-tile-card", 3500);
      const e = customElements.get("hui-tile-card");
      return e?.getConfigElement && await e.getConfigElement(), await ri("hui-card-features-editor", 4e3);
    } catch {
      return !!customElements.get("hui-card-features-editor");
    }
  })());
  const t = await Ge;
  return t || (Ge = null), t;
}
function yt(t) {
  t.stopPropagation();
}
var Zo = Object.defineProperty, Wo = Object.getOwnPropertyDescriptor, _e = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Wo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Zo(e, i, a), a;
};
let St = class extends N {
  constructor() {
    super(...arguments), this._mountedType = "", this._goBack = () => {
      this.dispatchEvent(new CustomEvent("go-back", { bubbles: !0, composed: !0 }));
    };
  }
  updated() {
    const t = this.config?.elementConfig, e = t?.type ?? "", i = typeof customElements < "u" && !!customElements.get("hui-sub-element-editor"), s = typeof customElements < "u" && !!customElements.get("hui-card-feature-editor");
    if (!i && !s && e && e !== this._mountedType && (this._mountedType = e, this._lastFeatureCfg = void 0, this._mountDirectCustomEditor(e, t)), this._customEditorEl) {
      const a = this._customEditorEl;
      a.hass = this.hass, a.lovelace = this.lovelace, a.context = this.context, this.context?.entity_id && this.hass?.states && (a.stateObj = this.hass.states[this.context.entity_id]), t && t !== this._lastFeatureCfg && (this._lastFeatureCfg = t, a.setConfig?.(t));
    }
  }
  async _mountDirectCustomEditor(t, e) {
    if (!t.startsWith("custom:") || typeof customElements > "u") return;
    const i = t.slice(7), s = customElements.get(i);
    if (s?.getConfigElement)
      try {
        const r = await s.getConfigElement();
        r.hass = this.hass, r.lovelace = this.lovelace, r.context = this.context, this.context?.entity_id && this.hass?.states && (r.stateObj = this.hass.states[this.context.entity_id]), this._lastFeatureCfg = e, r.setConfig?.(e), r.addEventListener("config-changed", (o) => {
          o.stopPropagation();
          const n = o.detail;
          this._emitConfigChanged(n?.config);
        }), this._customEditorEl = r;
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
    if (!this.hass || !this.config) return g;
    if (typeof customElements < "u" && !!customElements.get("hui-sub-element-editor"))
      return d`
        <hui-sub-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this.config}
          .context=${this.context}
          @go-back=${this._goBack}
          @config-changed=${(a) => {
        a.stopPropagation(), this._emitConfigChanged(a.detail?.config);
      }}
        ></hui-sub-element-editor>
      `;
    const e = this.config.elementConfig, i = typeof customElements < "u" && !!customElements.get("hui-card-feature-editor"), s = this.context?.entity_id && this.hass.states ? this.hass.states[this.context.entity_id] : void 0;
    return d`
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
          ${i && e ? d`
                <hui-card-feature-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .context=${this.context}
                  .stateObj=${s}
                  .config=${e}
                  @config-changed=${(a) => {
      a.stopPropagation(), this._emitConfigChanged(a.detail?.config);
    }}
                ></hui-card-feature-editor>
              ` : this._customEditorEl ? d`${this._customEditorEl}` : d`
                  <div class="fallback-msg">
                    Editor visuale non disponibile per questa feature. Usa <strong>Show code editor</strong> per modificarla in YAML.
                  </div>
                `}
        </div>
      </div>
    `;
  }
};
St.styles = R`
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
_e([
  O({ attribute: !1 })
], St.prototype, "hass", 2);
_e([
  O({ attribute: !1 })
], St.prototype, "lovelace", 2);
_e([
  O({ attribute: !1 })
], St.prototype, "config", 2);
_e([
  O({ attribute: !1 })
], St.prototype, "context", 2);
_e([
  b()
], St.prototype, "_customEditorEl", 2);
St = _e([
  B("m3e-feature-sub-editor")
], St);
var jo = Object.defineProperty, Yo = Object.getOwnPropertyDescriptor, ve = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Yo(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && jo(e, i, a), a;
};
let Et = class extends N {
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
      remote_entity: "Entità Remote / Trasmettitore (opzionale)",
      remote_device: "Device ID trasmettitore (multi-dispositivo)",
      remote_show_nav: "Mostra Touchpad e tasti navigazione (Indietro · Home · Assist)",
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
      const a = { ...this._config };
      i.length > 0 ? a.features = i : (delete a.features, delete a.features_position), this._emitConfig(a);
    }, this._onGoBack = () => {
      this._subElementEditorConfig = void 0;
    };
  }
  connectedCallback() {
    super.connectedCallback(), sa().then((t) => {
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
        for (const [s, a] of Object.entries(this.hass.entities))
          if (a.device_id === i && s.startsWith("media_player."))
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
    }, a = {
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
    }, r = {
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
          a,
          r,
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
        schema: [s, a, r]
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
      {
        name: "remote_entity",
        selector: { entity: { domain: ["remote", "media_player"] } }
      },
      { name: "remote_device", selector: { text: {} } },
      { name: "remote_show_nav", selector: { boolean: {} } },
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
    if (!this.hass || !this._config) return g;
    const t = this._config.entity, e = t ? this.hass.states[t] : void 0, i = { entity_id: t };
    if (this._subElementEditorConfig)
      return d`
        <m3e-feature-sub-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this._subElementEditorConfig}
          .context=${i}
          @go-back=${this._onGoBack}
          @config-changed=${this._onSubElementConfigChanged}
        ></m3e-feature-sub-editor>
      `;
    const s = this._config.features ?? [], a = !!(t && ct(this.hass, t, "media_player")), r = this._resolvedType() === "remote" ? {
      ...this._config,
      remote_show_nav: this._config.remote_show_nav ?? a
    } : this._config;
    return d`
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
              .data=${r}
              .schema=${this._buildInteractionsSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        ${this._resolvedType() === "remote" ? d`
              <ha-expansion-panel outlined>
                <ha-icon slot="leading-icon" icon="mdi:remote"></ha-icon>
                <span slot="header">
                  Pulsanti e Pillole Personalizzate (${this._config.remote_custom_controls?.length ?? 0})
                </span>
                <div class="panel-body">
                  <m3e-remote-custom-controls-editor
                    .hass=${this.hass}
                    .controls=${this._config.remote_custom_controls ?? []}
                    @controls-changed=${(o) => {
      this._config && this._emitConfig({
        ...this._config,
        remote_custom_controls: o.detail.controls
      });
    }}
                  ></m3e-remote-custom-controls-editor>
                </div>
              </ha-expansion-panel>
            ` : g}

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
          <span slot="header">Features</span>
          <div class="panel-body features-panel">
            ${this._featuresEditorReady ? d`
                  <hui-card-features-editor
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    .context=${i}
                    .stateObj=${e}
                    .features=${s}
                    @features-changed=${this._onFeaturesChanged}
                    @edit-detail-element=${this._onEditDetailElement}
                  ></hui-card-features-editor>
                  ${s.length > 0 ? d`
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
                      ` : g}
                ` : d`<div class="loading-hint">Caricamento editor Features…</div>`}
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
Et.styles = R`
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
ve([
  O({ attribute: !1 })
], Et.prototype, "hass", 2);
ve([
  O({ attribute: !1 })
], Et.prototype, "lovelace", 2);
ve([
  b()
], Et.prototype, "_config", 2);
ve([
  b()
], Et.prototype, "_featuresEditorReady", 2);
ve([
  b()
], Et.prototype, "_subElementEditorConfig", 2);
Et = ve([
  B("m3e-status-card-editor")
], Et);
var Go = Object.defineProperty, Ko = Object.getOwnPropertyDescriptor, U = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ko(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && Go(e, i, a), a;
};
const Pe = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/, aa = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
function Ee(t, e) {
  if (e === "raw") return t;
  const i = t.trim();
  let s = null;
  const a = aa.exec(i);
  if (a) {
    const m = Number(a[1]), u = Number(a[2]), v = Number(a[3] ?? "0");
    if (m >= 0 && m <= 23 && u >= 0 && u <= 59) {
      const _ = /* @__PURE__ */ new Date();
      s = new Date(_.getFullYear(), _.getMonth(), _.getDate(), m, u, v), s.getTime() <= _.getTime() && s.setDate(s.getDate() + 1);
    }
  } else if (Pe.test(i)) {
    const m = new Date(i);
    Number.isNaN(m.getTime()) || (s = m);
  }
  if (!s) return t;
  const r = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (e === "time" || e === "auto")
    return r;
  if (e === "datetime") {
    const m = /* @__PURE__ */ new Date(), u = (y, w) => y.getFullYear() === w.getFullYear() && y.getMonth() === w.getMonth() && y.getDate() === w.getDate(), v = new Date(m.getFullYear(), m.getMonth(), m.getDate() + 1), _ = new Date(m.getFullYear(), m.getMonth(), m.getDate() - 1);
    return u(s, m) ? `Oggi ${r}` : u(s, v) ? `Domani ${r}` : u(s, _) ? `Ieri ${r}` : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${r}`;
  }
  const o = s.getTime() - Date.now(), n = o >= 0, l = Math.round(Math.abs(o) / 6e4);
  if (l < 1) return "Ora";
  const p = Math.floor(l / 1440), c = Math.floor(l % 1440 / 60), h = l % 60;
  let f;
  return p > 0 ? f = c > 0 ? `${p}g ${c}h` : `${p}g` : c > 0 ? f = h > 0 ? `${c}h ${h}m` : `${c}h` : f = `${h}m`, n ? `Tra ${f}` : `${f} fa`;
}
const qo = /* @__PURE__ */ new Set(["moisture", "temperature", "humidity", "illuminance"]), Xo = /* @__PURE__ */ new Set([
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
]), $t = d`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"/></svg>`, Jo = d`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 15.41a1 1 0 0 1 0-1.41l3.88-3.88a1 1 0 0 1 1.42 0L16.59 14a1 1 0 1 1-1.41 1.41L12 12.23l-3.18 3.18a1 1 0 0 1-1.41 0Z"/></svg>`, Ke = 135, Bt = 270;
function Qo(t) {
  return t * Math.PI / 180;
}
function De(t, e, i, s) {
  const a = Qo(s);
  return { x: t + i * Math.cos(a), y: e + i * Math.sin(a) };
}
function tn(t, e, i, s, a) {
  const r = De(t, e, i, s), o = De(t, e, i, a);
  return `M ${r.x.toFixed(2)} ${r.y.toFixed(2)} A ${i} ${i} 0 1 1 ${o.x.toFixed(2)} ${o.y.toFixed(2)}`;
}
let F = class extends N {
  constructor() {
    super(...arguments), this.popupOnly = !1, this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._remoteSelectorSheet = null, this._volDragging = !1, this._volPct = null, this._volPendingTimer = null, this._featuresLoaded = !1, this._artPalette = null, this._lastArtUrl = "", this._prevStates = {}, this._longPressTimer = null, this._longPressTriggered = !1, this._relativeTimer = null, this._relativeTick = 0, this._padOffsetX = 0, this._padOffsetY = 0, this._padActive = !1, this._padTapPulse = !1, this._padPointerId = null, this._padStartX = 0, this._padStartY = 0, this._padSwiped = !1, this._padDir = null, this._padRepeatTimer = null, this._padHoldTimer = null, this._padPulseTimer = null, this._onTilePointerDown = (t) => {
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
          re(this, this.hass, this._config?.navigation_path);
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
      const i = t.currentTarget.getBoundingClientRect(), s = t.clientX - this._padStartX, a = t.clientY - this._padStartY, r = Math.max(24, i.width / 2 - 28), o = Math.max(20, i.height / 2 - 28);
      if (this._padOffsetX = Math.max(-r, Math.min(r, s * 0.85)), this._padOffsetY = Math.max(-o, Math.min(o, a * 0.85)), Math.hypot(s, a) >= 24) {
        const l = Math.abs(s) >= Math.abs(a) ? s > 0 ? "dpad_right" : "dpad_left" : a > 0 ? "dpad_down" : "dpad_up";
        (!this._padSwiped || this._padDir !== l) && (this._padSwiped = !0, this._padDir = l, this._triggerRemoteKey(l), navigator.vibrate?.(12), this._startPadRepeat(l));
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
    (this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded && ia().then((t) => {
      t && (this._featuresLoaded = !0);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), ut(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._activeSheet = null, this._remoteSelectorSheet = null;
    }), this._clearLongPress(), this._clearPadTimers(), this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
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
    if (t.has("_config") || t.has("_pressed") || t.has("_popupOpen") || t.has("_dialDragging") || t.has("_dialTemp") || t.has("_activeSheet") || t.has("_remoteSelectorSheet") || t.has("_volDragging") || t.has("_volPct") || t.has("_relativeTick") || t.has("_featuresLoaded") || t.has("_artPalette") || t.has("_padOffsetX") || t.has("_padOffsetY") || t.has("_padActive") || t.has("_padTapPulse"))
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
        const a = this.hass.states[s];
        a !== this._prevStates[s] && (this._prevStates[s] = a, i = !0);
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
    for (const [s, a] of Object.entries(this.hass.entities))
      s !== t && a.device_id === e && (s.startsWith("sensor.") || s.startsWith("media_player.")) && i.push(s);
    return i;
  }
  _getSiblingSensors() {
    if (!this.hass) return [];
    const t = [], e = /* @__PURE__ */ new Set();
    if (this._config?.secondary_entity) {
      const a = this.hass.states[this._config.secondary_entity];
      a && (t.push(a), e.add(a.entity_id));
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
    ], s = this._getSiblingEntityIds().map((a) => this.hass.states[a]).filter((a) => !!a && !e.has(a.entity_id));
    s.sort((a, r) => {
      const o = i.indexOf(String(a.attributes.device_class ?? "")), n = i.indexOf(String(r.attributes.device_class ?? ""));
      return (o === -1 ? 99 : o) - (n === -1 ? 99 : n);
    });
    for (const a of s) {
      const r = String(a.attributes.device_class ?? "");
      i.includes(r) && (t.push(a), e.add(a.entity_id));
    }
    if (Array.isArray(this._config?.extra_entities))
      for (const a of this._config.extra_entities.slice(0, 10)) {
        if (!a || e.has(a)) continue;
        const r = this.hass.states[a];
        r && (t.push(r), e.add(r.entity_id));
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
    const i = this._config.entity, s = this.hass.states[i], a = (o) => o.startsWith("switch.") || o.startsWith("light.") || o.startsWith("input_boolean.");
    s && a(i) && (t.push(s), e.add(i));
    const r = this.hass.entities?.[i]?.device_id;
    if (r && this.hass.entities) {
      const o = [];
      for (const [n, l] of Object.entries(this.hass.entities))
        if (l.device_id === r && !e.has(n) && a(n)) {
          const p = this.hass.states[n];
          p && (o.push(p), e.add(n));
        }
      o.sort(
        (n, l) => this._cleanSiblingLabel(n).localeCompare(this._cleanSiblingLabel(l), void 0, {
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
    return !e || e === "unavailable" || e === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(e) : t?.entity_id.startsWith("sensor.") && !Number.isNaN(Number(e)) ? !1 : Xo.has(e);
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
          (c) => c.state === "unavailable" || c.state === "unknown"
        )) return "Offline";
        const p = n.filter((c) => c.state === "on").length;
        return p > 0 ? this._config?.label_active || `${p} on` : this._config?.label_inactive || "Off";
      }
    }
    const t = this._statusEntity;
    if (!t) return "Offline";
    const e = t.state;
    if (e === "unavailable" || e === "unknown") return "Offline";
    const i = this._config?.subtitle_format ?? "auto", s = !!(this._config?.subtitle_entity?.trim() || this._config?.subtitle_attribute?.trim()), a = this._config?.subtitle_visibility ?? (this._config?.subtitle_only_when_active ? "on" : "both"), r = a === "both" || a === "on" && this._isActive || a === "off" && !this._isActive;
    if (s && r) {
      const n = this._config?.subtitle_entity?.trim() ? this.hass?.states[this._config.subtitle_entity.trim()] : t;
      if (n) {
        const l = this._config?.subtitle_attribute?.trim();
        let p;
        if (l)
          p = n.attributes[l];
        else {
          const c = n.state;
          if (c !== "unavailable" && c !== "unknown") {
            const h = n.attributes.unit_of_measurement;
            p = h ? `${c}${h}` : c;
          }
        }
        if (p != null && String(p).trim() !== "") {
          const c = Ee(String(p), i), h = this._config?.subtitle_prefix ?? "", f = this._config?.subtitle_suffix ?? "";
          return `${h}${c}${f}`;
        }
      }
    }
    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;
    const o = t.entity_id.split(".")[0];
    if (o === "climate") {
      const n = e.charAt(0).toUpperCase() + e.slice(1), l = t.attributes.temperature;
      return e !== "off" && typeof l == "number" ? `${n} ${l}` : n;
    }
    if (o === "sensor") {
      if (Pe.test(e.trim()))
        return Ee(e, i);
      const n = t.attributes.unit_of_measurement, l = n ? `${e}${n}` : e;
      if (t.attributes.device_class === "temperature" || n === "°C" || n === "°F") {
        const c = this._getSiblingSensors().find(
          (h) => h.attributes.device_class === "humidity" || h.attributes.unit_of_measurement === "%"
        );
        if (c && c.state !== "unavailable" && c.state !== "unknown")
          return `${l} • ${c.state}${c.attributes.unit_of_measurement ?? "%"}`;
      }
      return l;
    }
    return o === "media_player" ? e.charAt(0).toUpperCase() + e.slice(1) : Pe.test(e.trim()) ? Ee(e, i) : e.charAt(0).toUpperCase() + e.slice(1);
  }
  _inferMetricKind(t) {
    if (!t || !t.entity_id.startsWith("sensor.")) return null;
    const e = String(t.attributes.device_class ?? "").toLowerCase(), i = String(t.attributes.unit_of_measurement ?? "").trim().toLowerCase(), s = t.entity_id.toLowerCase(), a = String(t.attributes.friendly_name ?? "").toLowerCase();
    return e === "moisture" || (s.includes("moisture") || a.includes("moisture") || a.includes("umidità terreno")) && i === "%" ? "moisture" : e === "temperature" || i === "°c" || i === "°f" ? "temperature" : e === "humidity" ? "humidity" : e === "illuminance" || i === "lx" || i === "lux" ? "illuminance" : qo.has(e) ? e : null;
  }
  _isNumericHistoryEntity(t) {
    return this._inferMetricKind(t) !== null;
  }
  _resolveHistoryEntity() {
    if (this._isNumericHistoryEntity(this._entity)) return this._entity;
    const t = this._getSiblingSensors();
    for (const e of ["moisture", "temperature", "humidity", "illuminance"]) {
      const i = t.find((s) => this._inferMetricKind(s) === e);
      if (i) return i;
    }
  }
  _resolveHistoryTarget() {
    if (!this.hass) return null;
    const t = this._resolveHistoryEntity();
    if (!t) return null;
    const e = this._inferMetricKind(t);
    if (!e) return null;
    const i = String(t.attributes.unit_of_measurement ?? "").trim(), s = t.attributes.entity_id;
    if (Array.isArray(s)) {
      const r = s.filter(
        (o) => typeof o == "string" && o.startsWith("sensor.") && !!this.hass?.states[o]
      );
      if (r.length >= 2) {
        const o = String(
          this.hass.states[r[0]]?.attributes.unit_of_measurement ?? ""
        ).trim();
        return {
          entityIds: r,
          metricKind: e,
          unit: i || o
        };
      }
    }
    const a = [t.entity_id];
    for (const r of this._config?.extra_entities ?? []) {
      if (!r || a.includes(r)) continue;
      const o = this.hass.states[r];
      this._inferMetricKind(o) === e && a.push(r);
    }
    return { entityIds: a, metricKind: e, unit: i };
  }
  /* =========================================================================
     POPUP OPEN / CLOSE (Material You Container Transform / Bottom Sheet)
     ========================================================================= */
  async openPopup(t) {
    if (this._resolvedPopupType === "none") return;
    if (this._popupOpen && this._dialogEl?.open) {
      let a = !0;
      try {
        a = this._dialogEl.matches(":modal");
      } catch {
      }
      if (a) return;
      this._popupOpen = !1;
    }
    window.getSelection()?.removeAllRanges();
    const e = t ?? this._tileEl?.getBoundingClientRect();
    this._activeSheet = null, this._remoteSelectorSheet = null, this._popupOpen = !0, await this.updateComplete;
    const i = this._dialogEl, s = this._dialogSurfaceEl;
    if (!i) {
      this._popupOpen = !1;
      return;
    }
    Kt(i, s, {
      originRect: e,
      onRequestClose: () => this.closePopup(),
      onForceReset: () => {
        this._popupOpen = !1, this._activeSheet = null, this._remoteSelectorSheet = null;
      }
    });
  }
  closePopup() {
    qt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._activeSheet = null, this._remoteSelectorSheet = null;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        re(this, this.hass, this._config.navigation_path);
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
    return Ke + e * Bt;
  }
  _pointerToTemp(t, e) {
    const i = e.getBoundingClientRect(), s = i.left + i.width / 2, a = i.top + i.height / 2;
    let r = Math.atan2(t.clientY - a, t.clientX - s) * 180 / Math.PI;
    r < 0 && (r += 360);
    let o = (r - Ke + 360) % 360;
    o > Bt && (o = o > Bt + (360 - Bt) / 2 ? 0 : Bt);
    const n = o / Bt, l = this._climateMin + n * (this._climateMax - this._climateMin);
    return Math.round(l * 2) / 2;
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
    const a = Math.round(Math.max(0, Math.min(1, (t - s.left) / s.width)) * 100);
    this._volPct = a;
    const r = this._mediaEntity;
    i && this.hass && r && this.hass.callService("media_player", "volume_set", {
      entity_id: r.entity_id,
      volume_level: Number((a / 100).toFixed(2))
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
      return d`<ha-icon .icon=${t}></ha-icon>`;
    const e = this._statusEntity ?? this._entity;
    if (this._config?.use_entity_icon && e && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${e}></ha-state-icon>`;
      const i = e.attributes.icon;
      if (i && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${i}></ha-icon>`;
    }
    return Yt(e, this._isActive, this._resolvedPopupType);
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _cleanSiblingLabel(t) {
    const e = String(t.attributes.device_class ?? ""), i = (t.attributes.friendly_name || "").trim();
    if (!i)
      return e ? e.replace(/_/g, " ").replace(/^./, (n) => n.toUpperCase()) : "Sensor";
    const s = (n, l) => {
      const p = l.trim();
      if (!p || n.length <= p.length) return null;
      if (n.toLowerCase().startsWith(p.toLowerCase())) {
        const c = n.slice(p.length).replace(/^[\s\-–—:]+/, "").trim();
        if (c) return c.charAt(0).toUpperCase() + c.slice(1);
      }
      return null;
    }, a = this.hass?.entities?.[t.entity_id]?.device_id, r = a ? this.hass?.devices?.[a] : void 0;
    for (const n of [
      r?.name_by_user,
      r?.name,
      typeof this._config?.name == "string" ? this._config.name : void 0,
      this._entity?.attributes.friendly_name
    ])
      if (n) {
        const l = s(i, n);
        if (l) return l;
      }
    const o = (this._entity?.attributes.friendly_name || "").trim();
    if (o) {
      const n = o.split(/\s+/), l = i.split(/\s+/);
      let p = 0;
      for (; p < n.length && p < l.length - 1 && n[p].toLowerCase() === l[p].toLowerCase(); )
        p++;
      if (p > 0) {
        const c = l.slice(p).join(" ").replace(/^[\s\-–—:]+/, "").trim();
        if (c) return c.charAt(0).toUpperCase() + c.slice(1);
      }
    }
    return i;
  }
  _renderSiblingIcon(t) {
    if (typeof customElements < "u" && customElements.get("ha-state-icon"))
      return d`<ha-state-icon class="mini-ha-icon" .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
    const e = String(t.attributes.device_class ?? "");
    return e === "humidity" ? d`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : e === "illuminance" ? d`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : e === "battery" ? d`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : d`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
  }
  _renderHistoryChart() {
    if (!this._popupOpen) return g;
    const t = this._resolveHistoryTarget();
    return t ? d`
      <m3e-history-chart
        .hass=${this.hass}
        .entityIds=${t.entityIds}
        .metricKind=${t.metricKind}
        .unit=${t.unit}
      ></m3e-history-chart>
    ` : g;
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
    const s = t.entity_id.split(".")[0], a = String(t.attributes.device_class ?? "").toLowerCase();
    if (s === "sensor") {
      if (Pe.test(e))
        return Ee(e, "auto");
      const r = t.attributes.unit_of_measurement;
      return r ? `${e}${r}` : e;
    }
    if (s === "binary_sensor") {
      const r = i === "on";
      return a === "door" || a === "window" || a === "opening" || a === "garage_door" ? r ? "Open" : "Closed" : a === "motion" || a === "occupancy" || a === "presence" ? r ? "Detected" : "Clear" : a === "lock" ? r ? "Unlocked" : "Locked" : a === "connectivity" || a === "plug" ? r ? "Connected" : "Disconnected" : a === "moisture" || a === "smoke" || a === "gas" ? r ? "Detected" : "Clear" : r ? "On" : "Off";
    }
    return i === "home" ? "Home" : i === "not_home" ? "Away" : i === "on" ? "On" : i === "off" ? "Off" : e.replace(/_/g, " ").replace(/^./, (r) => r.toUpperCase());
  }
  _togglePowerEntity(t) {
    if (!this.hass) return;
    const e = t.entity_id.split(".")[0], i = t.state === "on";
    this.hass.callService(e, i ? "turn_off" : "turn_on", {
      entity_id: t.entity_id
    });
  }
  _openEntityMoreInfo(t) {
    ut(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._activeSheet = null, this._remoteSelectorSheet = null;
    }), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _renderSensorPopup(t) {
    const e = this._getSiblingSensors(), i = !!this._toggleablePowerEntity;
    return d`
      ${i ? g : d`
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

      ${e.length > 0 ? d`
            <div class="modular-stack">
              ${e.map((s) => {
      const a = this._cleanSiblingLabel(s), r = String(s.state ?? ""), o = r === "unavailable" || r === "unknown" ? "Offline" : Pe.test(r.trim()) || aa.test(r.trim()) ? Ee(r, "auto") : `${r}${s.attributes.unit_of_measurement ?? ""}`;
      return d`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(s.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(s)}
                      <span class="info-pill-label">${a}</span>
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
          ` : g}

      ${this._renderHistoryChart()}
    `;
  }
  _renderClimatePopup() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "off", s = this._climateTarget, a = this._climateCurrent, r = this._outdoorEntity, o = Math.floor(s), n = Math.abs(s - o - 0.5) < 0.05, l = this._tempToDeg(s), p = a !== null ? this._tempToDeg(a) : null, c = 140, h = 140, f = 114, m = tn(c, h, f, Ke, Ke + Bt), u = De(c, h, f, l), v = p !== null ? De(c, h, f, p) : null, _ = p !== null ? De(c, h, f - 22, p) : null, x = Array.isArray(t?.attributes.hvac_modes) ? t.attributes.hvac_modes : ["heat", "cool", "off"], y = Array.isArray(t?.attributes.preset_modes) ? t.attributes.preset_modes : [], w = Array.isArray(t?.attributes.fan_modes) ? t.attributes.fan_modes : [], S = Array.isArray(t?.attributes.swing_modes) ? t.attributes.swing_modes : [], M = String(t?.attributes.preset_mode ?? "none"), $ = String(t?.attributes.fan_mode ?? "auto"), L = String(t?.attributes.swing_mode ?? "off"), E = typeof t?.attributes.current_humidity == "number" ? `${t.attributes.current_humidity}%` : this._getSiblingSensors().find((D) => D.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((D) => D.attributes.device_class === "humidity").state}%` : null, C = y.length > 0, k = w.length > 0, T = S.length > 0, H = e === "heat" || e === "heating" ? "mode-heat" : e === "cool" || e === "cooling" ? "mode-cool" : "mode-off", I = (D) => D.replace(/_/g, " ").replace(/^./, (at) => at.toUpperCase()), A = this._activeSheet === "mode" ? { title: "Select a mode", options: x, current: e, onSelect: (D) => this._setClimateMode(D) } : this._activeSheet === "preset" ? { title: "Select preset", options: y, current: M, onSelect: (D) => this._setClimatePreset(D) } : this._activeSheet === "fan" ? { title: "Fan speed", options: w, current: $, onSelect: (D) => this._setClimateFan(D) } : this._activeSheet === "swing" ? { title: "Swing mode", options: S, current: L, onSelect: (D) => this._setClimateSwing(D) } : null;
    return d`
      <div class="climate-hero ${H} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${c} cy=${h} r="132" class="dial-bg-circle" />
            <path d=${m} class="dial-arc-track" />

            ${v && _ ? X`
                  <circle cx=${v.x} cy=${v.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${_.x}
                    y=${_.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(a)}
                  </text>
                ` : g}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${u.x.toFixed(2)}, ${u.y.toFixed(2)}) rotate(${l.toFixed(1)})">
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
            ${i && !this._dialDragging ? d`<span class="dial-readout-off">Off</span>` : d`
                  <span class="dial-readout-num">
                    ${o}${n ? d`<sup>5</sup>` : g}
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
        <div class="${C ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${C ? "compact-trait" : ""} ${H}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${e === "heat" ? d`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : e === "cool" ? d`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : d`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${I(e)}</span>
            </span>
          </button>

          ${C ? d`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${I(M)}</span>
                  </span>
                  <span class="trait-chevron">${$t}</span>
                </button>
              ` : g}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${k || T ? d`
              <div class="${k && T ? "climate-grid-2" : ""}">
                ${k ? d`
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
                            <span class="mode-pill-val">${I($)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">${$t}</span>
                      </button>
                    ` : g}

                ${T ? d`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${I(L)}</span>
                        </span>
                        <span class="trait-chevron">${$t}</span>
                      </button>
                    ` : g}
              </div>
            ` : g}

        ${a !== null || r || E ? d`
              <div class="telemetry-card">
                ${a !== null ? d`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${a}°</strong>
                      </div>
                    ` : g}
                ${E ? d`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${E}</strong>
                      </div>
                    ` : g}
                ${r ? d`
                      <div class="telemetry-row">
                        <span>${P(this.hass, "outdoor_temperature")}</span>
                        <strong>${r.state}${r.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : g}
              </div>
            ` : g}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${A ? d`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(D) => D.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ${$t}
                  </button>
                  <span>${A.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${A.options.map((D) => {
      const at = D.toLowerCase() === A.current.toLowerCase(), q = this._activeSheet === "mode" ? D === "heat" ? "mode-heat" : D === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return d`
                      <button
                        type="button"
                        class="mode-option ${at ? `selected ${q}` : ""}"
                        @click=${() => A.onSelect(D)}
                      >
                        <span>${I(D)}</span>
                        ${at ? d`<span class="check-mark">✓</span>` : g}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : g}
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
    !this.hass || !this._config || Wi(
      this.hass,
      this._config.entity,
      t,
      this._config.remote_buttons,
      this._config.remote_device,
      this._config.remote_entity
    );
  }
  _renderRemotePopup() {
    const t = this._mediaEntity, e = t ?? this._entity, i = this._statusEntity ?? e, s = String(i?.state ?? "").toLowerCase(), a = !!s && s !== "unavailable" && s !== "unknown", r = a && s !== "off" && s !== "standby", o = e?.attributes.is_volume_muted, n = typeof o == "boolean", l = o === !0, p = String(t?.state ?? "").toLowerCase(), c = p === "playing", h = p === "paused", f = String(e?.attributes.source ?? "").trim(), m = Array.isArray(e?.attributes.source_list) ? Array.from(
      new Set(
        e.attributes.source_list.map((y) => String(y ?? "").trim()).filter(Boolean)
      )
    ) : [], u = f || P(this.hass, "sources"), v = String(e?.attributes.sound_mode ?? "").trim(), _ = Array.isArray(e?.attributes.sound_mode_list) ? Array.from(
      new Set(
        e.attributes.sound_mode_list.map((y) => String(y ?? "").trim()).filter(Boolean)
      )
    ) : [], x = this._config?.remote_show_nav ?? !!t;
    return d`
      ${x ? d`
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
          ` : g}

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
          ${n ? d`<span class="split-indicator ${l ? "is-right" : "is-left"}" aria-hidden="true"></span>` : g}
          <button
            type="button"
            class="split-half ${n && !l ? "is-selected" : ""}"
            aria-pressed=${n ? String(!l) : "false"}
            @click=${() => this._triggerRemoteKey("unmute")}
          >
            ${P(this.hass, "unmute")}
          </button>
          ${n ? g : d`<span class="split-vdivider"></span>`}
          <button
            type="button"
            class="split-half ${n && l ? "is-selected" : ""}"
            aria-pressed=${n ? String(l) : "false"}
            @click=${() => this._triggerRemoteKey("mute")}
          >
            ${P(this.hass, "mute")}
          </button>
        </div>

        <!-- Segmented M3 Pill: On | Off (highlights active entity state like Light Control) -->
        <div class="split-pill ${a ? "has-state" : ""}" role="group" aria-label="Power">
          ${a ? d`<span class="split-indicator ${r ? "is-left" : "is-right"}" aria-hidden="true"></span>` : g}
          <button
            type="button"
            class="split-half ${a && r ? "is-selected" : ""}"
            aria-pressed=${a ? String(r) : "false"}
            @click=${() => this._triggerRemoteKey("power_on")}
          >
            ${P(this.hass, "on")}
          </button>
          ${a ? g : d`<span class="split-vdivider"></span>`}
          <button
            type="button"
            class="split-half ${a && !r ? "is-selected" : ""}"
            aria-pressed=${a ? String(!r) : "false"}
            @click=${() => this._triggerRemoteKey("power_off")}
          >
            ${P(this.hass, "off")}
          </button>
        </div>

        <!-- M3 Expressive Transport Row (Crisp SVGs + Shape Morphing Play/Pause) -->
        <div class="transport-row">
          <button
            type="button"
            class="transport-icon is-prev"
            aria-label=${P(this.hass, "previous")}
            @click=${() => this._triggerRemoteKey("prev")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
            </svg>
          </button>
          <button
            type="button"
            class="transport-circle ${c ? "is-active" : ""}"
            aria-label=${P(this.hass, "play")}
            aria-pressed=${String(c)}
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
            class="transport-circle ${h ? "is-active" : ""}"
            aria-label=${P(this.hass, "pause")}
            aria-pressed=${String(h)}
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
            aria-label=${P(this.hass, "next")}
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
            ${$t}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteKey("ch_up")}
          >
            ${Jo}
          </button>
        </div>

        <button
          type="button"
          class="secondary-action-card"
          @click=${() => {
      m.length > 0 && t ? this._remoteSelectorSheet = {
        title: P(this.hass, "sources"),
        options: m,
        current: f,
        onSelect: (y) => {
          this.hass?.callService("media_player", "select_source", {
            entity_id: t.entity_id,
            source: y
          });
        }
      } : e && this._openMoreInfo(e.entity_id);
    }}
        >
          <span>${u}</span>
          <span class="trait-chevron">${$t}</span>
        </button>

        ${_.length > 0 && t ? d`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => {
      this._remoteSelectorSheet = {
        title: "Sound mode",
        options: _,
        current: v,
        onSelect: (y) => {
          this.hass?.callService("media_player", "select_sound_mode", {
            entity_id: t.entity_id,
            sound_mode: y
          });
        }
      };
    }}
              >
                <span>${v || "Sound mode"}</span>
                <span class="trait-chevron">${$t}</span>
              </button>
            ` : g}

        ${Qs(
      this.hass,
      this._config.entity,
      this._config?.remote_custom_controls,
      this._config?.remote_buttons,
      this._config?.remote_device,
      (y) => {
        this._remoteSelectorSheet = y;
      },
      (y) => this._openMoreInfo(y),
      this._config?.remote_entity
    )}
      </div>

      ${this._remoteSelectorSheet ? d`
            <div class="mode-sheet-backdrop" @click=${() => this._remoteSelectorSheet = null}>
              <div class="mode-sheet" @click=${(y) => y.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._remoteSelectorSheet = null}
                    aria-label=${P(this.hass, "close")}
                  >
                    ${$t}
                  </button>
                  <span>${this._remoteSelectorSheet.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${this._remoteSelectorSheet.options.map((y) => {
      const w = y.toLowerCase() === this._remoteSelectorSheet.current.toLowerCase();
      return d`
                      <button
                        type="button"
                        class="mode-option ${w ? "selected mode-off" : ""}"
                        @click=${() => {
        this._remoteSelectorSheet?.onSelect(y), this._remoteSelectorSheet = null;
      }}
                      >
                        <span>${y}</span>
                        ${w ? d`<span class="check-mark">✓</span>` : g}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : g}
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
    return d`
      ${t ? d`
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
          ` : g}

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
        ${e ? t?.state === "off" ? d`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService("turn_on")}
                >
                  ${P(this.hass, "turn_on")}
                </button>
              ` : g : d`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callMediaService("media_stop")}
              >
                ${P(this.hass, "stop_casting")}
              </button>
            `}

        <!-- Secondary action: opens M3E Now Playing popup by default (or native HA More Info if configured) -->
        ${t ? d`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMediaControls(t.entity_id)}
              >
                <span>${P(this.hass, "media_controls")}</span>
                <span>↗</span>
              </button>
            ` : g}
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
    return i.includes("away") || i.includes("fuori") || i.includes("assent") || i.includes("out") || i.includes("vacanz") ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3 2 9v12h7v-2H4v-9l6-4.5L15 9.25V11h2V8.25L10 3Zm7 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 6c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z"
          />
        </svg>
      ` : i.includes("night") || i.includes("nott") || i.includes("sleep") ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.3 4.9a7 7 0 0 0 6.8 9.2A8 8 0 1 1 12.3 4.9Z"
          />
        </svg>
      ` : i.includes("home") || i.includes("casa") || i.includes("present") ? e ? d`
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3 3 10v11h18V10l-9-7Zm0 5.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm4.5 9.5h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V18Z"
              />
            </svg>
          ` : d`
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3 3 10v11h18V10l-9-7Zm7 16H5v-8l7-5.44L19 11v8Zm-7-9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7.5h8v-.5c0-1.33-2.67-2-4-2s-4 .67-4 2v.5Z"
              />
            </svg>
          ` : e ? d`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.5-4.5 1.4 1.4-5.9 5.9Z"
            />
          </svg>
        ` : d`
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
    return d`
      ${t.length === 0 ? d`
            <div class="selector-empty">
              Nessuna presa rilevata. Seleziona le entità della multipresa nelle impostazioni della
              card.
            </div>
          ` : d`
            <div class="power-strip-grid">
              ${t.map((s) => {
      const a = s.state === "unavailable" || s.state === "unknown", r = s.state === "on", o = this._cleanSiblingLabel(s), n = a ? "Offline" : r ? "On" : "Off";
      return d`
                  <button
                    type="button"
                    class="ps-tile ${r ? "is-on" : "is-off"} ${a ? "is-unavailable" : ""}"
                    role="switch"
                    aria-checked=${String(r)}
                    ?disabled=${a}
                    @click=${() => this._togglePowerEntity(s)}
                    @contextmenu=${(l) => {
        l.preventDefault(), this._openEntityMoreInfo(s.entity_id);
      }}
                  >
                    <span class="ps-tile-icon" aria-hidden="true">
                      ${Yt(s, r)}
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
      ${i.length > 0 ? d`
            <div class="modular-stack">
              ${i.map((s) => {
      const a = this._cleanSiblingLabel(s), r = `${s.state}${s.attributes.unit_of_measurement ?? ""}`;
      return d`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(s.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(s)}
                      <span class="info-pill-label">${a}</span>
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
          ` : g}
    `;
  }
  _renderSelectorPopup() {
    const t = this._entity, e = t?.attributes.options, i = Array.isArray(e) ? e.map(String) : [], s = t?.state ?? "";
    return i.length === 0 ? d`
        <div class="selector-empty">
          Nessuna opzione disponibile per questa entità. Collega un <code>input_select</code> o
          <code>select</code>.
        </div>
      ` : d`
      <div class="selector-list" role="radiogroup" aria-label="Seleziona opzione">
        ${i.map((a) => {
      const r = a === s;
      return d`
            <button
              type="button"
              class="selector-row ${r ? "is-selected" : ""}"
              role="radio"
              aria-checked=${String(r)}
              @click=${() => this._selectOption(a)}
            >
              <span class="selector-row-icon">
                ${this._renderSelectorOptionIcon(a, r)}
              </span>
              <span class="selector-row-label">${a}</span>
              <span class="m3-radio ${r ? "checked" : ""}" aria-hidden="true">
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
    t !== this._lastArtUrl && (this._lastArtUrl = t, t ? Vi(t).then((e) => {
      this._lastArtUrl === t && (this._artPalette = e);
    }) : this._artPalette = null);
  }
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return g;
    const t = this._entity, e = mt(this.hass, t, this._config.name, this._config.entity), i = this._isActive, s = i ? this._config.icon_active?.trim() || void 0 : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || void 0, a = this._resolvedPopupType, r = this._config.tap_action === "navigate" || this._config.tap_action === "more-info" || this._config.tap_action !== "toggle" && this._config.tap_action !== "none" && a !== "none", o = `style-${this._config.card_style ?? "default"}`, n = this._popupOpen ? Ne(this._statusEntity?.last_changed) : null, l = this._config.features ?? [], p = l.length > 0, c = this._config.features_position ?? "bottom", h = !!this._config.hide_state, f = h ? null : fe(this.hass, t, this._config.state_content, this._stateLabel), m = h ? "" : f ?? this._stateLabel, u = this._entityPictureUrl, v = !!u, _ = this.hass?.themes?.darkMode !== !1, x = v && this._artPalette ? `--art-bg: ${_ ? this._artPalette.containerDark : this._artPalette.containerLight}; --art-fg: ${_ ? this._artPalette.onContainerDark : this._artPalette.onContainerLight};` : "";
    return d`
      ${this.popupOnly ? g : d`
            <ha-card
              class="status-tile ${o} ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""} ${p ? `has-features features-${c}` : ""} ${v ? "has-entity-picture" : ""}"
              style=${x}
              role="button"
              tabindex="0"
              aria-label="${e}${m ? `, ${m}` : ""}"
              @pointerdown=${this._onTilePointerDown}
              @pointerup=${this._onTilePointerUp}
              @pointerleave=${this._onTilePointerCancel}
              @pointercancel=${this._onTilePointerCancel}
              @click=${this._onTileClick}
              @contextmenu=${(y) => {
      y.preventDefault(), this._handleHoldAction();
    }}
              @keydown=${(y) => {
      (y.key === "Enter" || y.key === " ") && (y.preventDefault(), this._onTileClick());
    }}
            >
              ${v ? d`
                    <div class="entity-picture-backdrop" aria-hidden="true">
                      <img class="entity-picture-img" src=${u} alt="" loading="lazy" />
                    </div>
                  ` : g}
              <div class="state-layer" aria-hidden="true"></div>
              <div class="tile-inner">
                ${v ? g : d`<span class="tile-icon">${this._renderEntityIcon(s)}</span>`}
                <div class="tile-meta">
                  <span class="tile-title">${e}</span>
                  ${m ? d`<span class="tile-subtitle">${m}</span>` : g}
                </div>
                ${this._isUnavailable ? d`
                      <span class="offline-badge" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                          />
                        </svg>
                      </span>
                    ` : r ? d`
                        <span class="tile-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                            />
                          </svg>
                        </span>
                      ` : g}
              </div>
              ${p ? d`
                    <div
                      class="features-wrap"
                      @click=${yt}
                      @pointerdown=${yt}
                      @pointerup=${yt}
                      @contextmenu=${yt}
                    >
                      <hui-card-features
                        .hass=${this.hass}
                        .context=${{ entity_id: this._config.entity }}
                        .stateObj=${this._entity}
                        .features=${l}
                        .position=${c}
                      ></hui-card-features>
                    </div>
                  ` : g}
            </ha-card>
          `}

      <dialog
        class="status-dialog"
        @click=${(y) => {
      y.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(y) => {
      y.preventDefault(), this.closePopup();
    }}
        @touchmove=${(y) => At(y, this._dialogEl)}
      >
        ${this._popupOpen ? (() => {
      const y = a === "power_strip", w = a === "sensor" || a === "custom" ? this._toggleablePowerEntity : void 0, S = y ? this._getPowerStripEntities() : [], M = !!w || y && S.length > 0, $ = y ? S.some((E) => E.state === "on") : w?.state === "on", L = d`
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
      return d`
                <div class="dialog-surface">
                  <header class="dialog-header">
                    ${L}
                    <div class="dialog-title-wrap">
                      <span class="dialog-title">${e}</span>
                      ${n ? d`<span class="dialog-last-changed">${n}</span>` : g}
                    </div>
                    ${M ? d`
                          <button
                            type="button"
                            class="m3-header-switch ${$ ? "is-on" : ""}"
                            role="switch"
                            aria-checked=${String($)}
                            aria-label=${$ ? "Spegni" : "Accendi"}
                            @click=${() => y ? this._togglePowerStripAll(!$) : w && this._togglePowerEntity(w)}
                          >
                            <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                          </button>
                        ` : a === "climate" || a === "media" ? d`
                            <button
                              type="button"
                              class="icon-btn"
                              aria-label=${P(this.hass, "history")}
                              title=${P(this.hass, "history_tooltip")}
                              @click=${() => this._openMoreInfo(
        a === "media" && this._mediaEntity ? this._mediaEntity.entity_id : this._config.entity,
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
                          ` : g}
                  </header>

                  ${a === "power_strip" ? this._renderPowerStripPopup() : a === "selector" ? this._renderSelectorPopup() : a === "sensor" || a === "custom" ? this._renderSensorPopup(s) : a === "climate" ? this._renderClimatePopup() : a === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
                </div>
              `;
    })() : g}
      </dialog>

      ${a === "media" && this._mediaEntity ? d`
            <m3e-media-popup
              .hass=${this.hass}
              .entityId=${this._mediaEntity.entity_id}
            ></m3e-media-popup>
          ` : g}
    `;
  }
};
F.styles = [
  V,
  Js,
  R`

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
U([
  O({ attribute: !1 })
], F.prototype, "hass", 2);
U([
  O({ type: Boolean })
], F.prototype, "popupOnly", 2);
U([
  b()
], F.prototype, "_config", 2);
U([
  b()
], F.prototype, "_pressed", 2);
U([
  b()
], F.prototype, "_popupOpen", 2);
U([
  b()
], F.prototype, "_dialDragging", 2);
U([
  b()
], F.prototype, "_dialTemp", 2);
U([
  b()
], F.prototype, "_activeSheet", 2);
U([
  b()
], F.prototype, "_remoteSelectorSheet", 2);
U([
  b()
], F.prototype, "_volDragging", 2);
U([
  b()
], F.prototype, "_volPct", 2);
U([
  b()
], F.prototype, "_featuresLoaded", 2);
U([
  b()
], F.prototype, "_artPalette", 2);
U([
  z("dialog.status-dialog")
], F.prototype, "_dialogEl", 2);
U([
  z(".status-tile")
], F.prototype, "_tileEl", 2);
U([
  z("m3e-media-popup")
], F.prototype, "_mediaPopupEl", 2);
U([
  z(".dialog-surface")
], F.prototype, "_dialogSurfaceEl", 2);
U([
  b()
], F.prototype, "_relativeTick", 2);
U([
  b()
], F.prototype, "_padOffsetX", 2);
U([
  b()
], F.prototype, "_padOffsetY", 2);
U([
  b()
], F.prototype, "_padActive", 2);
U([
  b()
], F.prototype, "_padTapPulse", 2);
F = U([
  B("m3e-status-card")
], F);
var en = Object.defineProperty, sn = Object.getOwnPropertyDescriptor, _i = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? sn(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && en(e, i, a), a;
};
const qe = 4, Ft = [
  "mdi:heart-outline",
  "mdi:view-grid-outline",
  "mdi:lightbulb-outline",
  "mdi:thermometer"
];
let me = class extends N {
  constructor() {
    super(...arguments), this._activeTab = 0, this._bridgeHandle = {
      getConfig: () => this._config,
      getActiveTab: () => this._activeTab,
      setActiveTab: (t) => {
        const e = Math.max(0, (this._config?.tabs?.length ?? 1) - 1);
        this._activeTab = Math.max(0, Math.min(e, t));
      },
      updateTabCards: (t, e) => this._updateTabCards(t, e),
      openAddCard: (t) => {
        this._openAddCard(t);
      },
      openEditCard: (t, e) => {
        this._openEditCard(t, e);
      }
    }, this._onTabMoved = (t) => {
      if (t.stopPropagation(), !this._config) return;
      const { oldIndex: e, newIndex: i } = t.detail, s = [...this._config.tabs];
      if (e === i || e < 0 || i < 0 || e >= s.length || i >= s.length)
        return;
      const [a] = s.splice(e, 1);
      s.splice(i, 0, a), this._activeTab === e ? this._activeTab = i : this._activeTab > e && this._activeTab <= i ? this._activeTab -= 1 : this._activeTab < e && this._activeTab >= i && (this._activeTab += 1), this._emit({ ...this._config, tabs: s });
    }, this._onOptionsChanged = (t) => {
      if (t.stopPropagation(), !this._config) return;
      const e = t.detail.value, i = e.default_tab !== void 0 ? Number(e.default_tab) : this._config.default_tab;
      this._emit({
        ...this._config,
        ...e,
        default_tab: Number.isFinite(i) ? i : 0
      });
    }, this._computeTabLabel = (t) => ({
      title: "Titolo tab",
      icon: "Icona"
    })[t.name] ?? t.name, this._computeOptionLabel = (t) => ({
      tabs_alignment: "Allineamento tab",
      default_tab: "Tab predefinita all’apertura",
      remember_tab: "Ricorda l’ultima tab selezionata"
    })[t.name] ?? t.name;
  }
  connectedCallback() {
    super.connectedCallback(), jr(this._bridgeHandle), requestAnimationFrame(() => Ks());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Yr(this._bridgeHandle);
  }
  setConfig(t) {
    const e = Array.isArray(t.tabs) ? t.tabs.slice(0, qe) : [], i = e.length > 0 ? e.map((s, a) => ({
      title: s.title ?? `Tab ${a + 1}`,
      icon: s.icon || Ft[a % Ft.length],
      cards: Array.isArray(s.cards) ? s.cards : []
    })) : [{ title: "Tab 1", icon: Ft[0], cards: [] }];
    this._config = {
      tabs_alignment: "center",
      default_tab: 0,
      remember_tab: !1,
      ...t,
      tabs: i
    }, this._activeTab >= i.length && (this._activeTab = Math.max(0, i.length - 1));
  }
  _emit(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
  _updateTabCards(t, e) {
    if (!this._config) return;
    const i = this._config.tabs.map((s, a) => a === t ? { ...s, cards: e } : s);
    this._emit({ ...this._config, tabs: i });
  }
  async _openAddCard(t) {
    !this.hass || !this._config || (this._activeTab = t, await Ai({
      hass: this.hass,
      parentConfig: this._config,
      cards: this._config.tabs[t]?.cards ?? [],
      applyCards: (e, i) => ({
        ...e,
        tabs: e.tabs.map((s, a) => a === t ? { ...s, cards: i } : s)
      }),
      mode: "add",
      onCardsUpdated: (e) => this._updateTabCards(t, e)
    }));
  }
  async _openEditCard(t, e) {
    !this.hass || !this._config || (this._activeTab = t, await Ai({
      hass: this.hass,
      parentConfig: this._config,
      cards: this._config.tabs[t]?.cards ?? [],
      applyCards: (i, s) => ({
        ...i,
        tabs: i.tabs.map((a, r) => r === t ? { ...a, cards: s } : a)
      }),
      mode: "edit",
      index: e,
      onCardsUpdated: (i) => this._updateTabCards(t, i)
    }));
  }
  _addTab() {
    if (!this._config || this._config.tabs.length >= qe) return;
    const t = this._config.tabs.length, e = [
      ...this._config.tabs,
      {
        title: `Tab ${t + 1}`,
        icon: Ft[t % Ft.length],
        cards: []
      }
    ];
    this._activeTab = t, this._emit({ ...this._config, tabs: e });
  }
  _removeTab(t, e) {
    if (e.stopPropagation(), !this._config || this._config.tabs.length <= 1) return;
    const i = this._config.tabs.filter((a, r) => r !== t);
    this._activeTab >= i.length && (this._activeTab = i.length - 1);
    const s = Math.min(this._config.default_tab ?? 0, i.length - 1);
    this._emit({ ...this._config, tabs: i, default_tab: s });
  }
  _onTabFieldChanged(t, e) {
    if (e.stopPropagation(), !this._config) return;
    const i = e.detail.value, s = this._config.tabs.map(
      (a, r) => r === t ? {
        ...a,
        title: i.title ?? a.title,
        icon: i.icon ?? a.icon
      } : a
    );
    this._emit({ ...this._config, tabs: s });
  }
  render() {
    if (!this.hass || !this._config) return g;
    const t = this._config.tabs, e = [
      {
        name: "tabs_alignment",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "center", label: "Centrato (stile Google Home)" },
              { value: "start", label: "Sinistra" },
              { value: "end", label: "Destra" }
            ]
          }
        }
      },
      {
        name: "default_tab",
        selector: {
          select: {
            mode: "dropdown",
            options: t.map((i, s) => ({
              value: String(s),
              label: `${s + 1}. ${i.title || `Tab ${s + 1}`}`
            }))
          }
        }
      },
      { name: "remember_tab", selector: { boolean: {} } }
    ];
    return d`
      <div class="editor-root">
        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:tab"></ha-icon>
          <span slot="header">Tab (${t.length} / ${qe})</span>
          <div class="panel-body">
            <ha-sortable handle-selector=".drag-handle" @item-moved=${this._onTabMoved}>
              <div class="tabs-list">
                ${t.map((i, s) => {
      const a = s === this._activeTab, r = i.cards?.length ?? 0, o = i.icon || Ft[s % Ft.length];
      return d`
                    <div class="tab-row ${a ? "is-active" : ""}">
                      <div
                        class="tab-row-header"
                        role="button"
                        tabindex="0"
                        @click=${() => {
        this._activeTab = s, this._emit({ ...this._config });
      }}
                      >
                        <div class="drag-handle" @click=${(n) => n.stopPropagation()}>
                          <ha-icon icon="mdi:drag"></ha-icon>
                        </div>

                        <div class="tab-row-icon" aria-hidden="true">
                          <ha-icon .icon=${o}></ha-icon>
                        </div>

                        <div class="tab-row-summary">
                          <span class="tab-row-title">${i.title || `Tab ${s + 1}`}</span>
                          <span class="tab-row-sub">
                            ${r === 1 ? "1 card" : `${r} card`}
                            ${a ? " · In anteprima" : ""}
                          </span>
                        </div>

                        <div class="tab-row-actions">
                          ${t.length > 1 ? d`
                                <ha-icon-button
                                  class="row-action danger"
                                  .label=${"Elimina tab"}
                                  @click=${(n) => this._removeTab(s, n)}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </ha-icon-button>
                              ` : g}
                        </div>
                      </div>

                      ${a ? d`
                            <div class="tab-row-body">
                              <ha-form
                                .hass=${this.hass}
                                .data=${{
        title: i.title ?? "",
        icon: i.icon ?? ""
      }}
                                .schema=${[
        {
          type: "grid",
          name: "",
          schema: [
            { name: "title", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } }
          ]
        }
      ]}
                                .computeLabel=${this._computeTabLabel}
                                @value-changed=${(n) => this._onTabFieldChanged(s, n)}
                              ></ha-form>
                            </div>
                          ` : g}
                    </div>
                  `;
    })}
              </div>
            </ha-sortable>

            ${t.length < qe ? d`
                  <div class="add-row">
                    <ha-button appearance="filled" size="small" @click=${this._addTab}>
                      <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                      Aggiungi tab
                    </ha-button>
                  </div>
                ` : g}

            <div class="preview-hint">
              Seleziona una tab qui o nell’anteprima a destra per aggiungere, trascinare,
              ridimensionare o modificare le card al suo interno.
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:tune"></ha-icon>
          <span slot="header">Aspetto e Comportamento</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${{
      tabs_alignment: this._config.tabs_alignment ?? "center",
      default_tab: String(this._config.default_tab ?? 0),
      remember_tab: !!this._config.remember_tab
    }}
              .schema=${e}
              .computeLabel=${this._computeOptionLabel}
              @value-changed=${this._onOptionsChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
me.styles = R`
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
      --expansion-panel-summary-padding: 0 16px;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tabs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tab-row {
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--outline-color, var(--divider-color));
      background: var(--card-background-color, transparent);
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .tab-row.is-active {
      border-color: var(--primary-color);
    }

    .tab-row-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 52px;
      padding: 4px 6px 4px 8px;
      cursor: pointer;
      user-select: none;
    }

    .tab-row-header:hover {
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
    }

    .drag-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 36px;
      color: var(--secondary-text-color);
      cursor: grab;
      flex-shrink: 0;
      --mdc-icon-size: 20px;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .tab-row-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
      color: var(--secondary-text-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      --mdc-icon-size: 19px;
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-radius 220ms ease;
    }

    .tab-row.is-active .tab-row-icon {
      border-radius: 10px;
      background: var(--md-sys-color-secondary-container, var(--primary-color));
      color: var(--md-sys-color-on-secondary-container, #ffffff);
    }

    .tab-row-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .tab-row-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-row-sub {
      font-size: 12px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }

    .tab-row-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .row-action {
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
    }

    .row-action.danger:hover {
      color: var(--error-color);
    }

    .tab-row-body {
      padding: 12px 14px 14px;
      border-top: 1px solid var(--divider-color);
    }

    .add-row {
      display: flex;
      justify-content: flex-start;
      padding-top: 2px;
    }

    .preview-hint {
      font-size: 12.5px;
      line-height: 1.4;
      color: var(--secondary-text-color);
    }
  `;
_i([
  O({ attribute: !1 })
], me.prototype, "hass", 2);
_i([
  b()
], me.prototype, "_config", 2);
_i([
  b()
], me.prototype, "_activeTab", 2);
me = _i([
  B("m3e-tabs-card-editor")
], me);
var an = Object.defineProperty, rn = Object.getOwnPropertyDescriptor, be = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? rn(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && an(e, i, a), a;
};
let Ei = null;
function on() {
  if (!Ei) {
    const t = window.loadCardHelpers;
    Ei = t ? t().catch(() => null) : Promise.resolve(null);
  }
  return Ei;
}
const Me = [
  "mdi:heart-outline",
  "mdi:view-grid-outline",
  "mdi:lightbulb-outline",
  "mdi:thermometer"
];
function Mi(t, e) {
  const i = t.grid_options;
  let s;
  if (i?.columns === "full" ? s = 12 : typeof i?.columns == "number" && Number.isFinite(i.columns) && (s = i.columns), s === void 0 && e && typeof e.getGridOptions == "function")
    try {
      const o = e.getGridOptions();
      o?.columns === "full" ? s = 12 : typeof o?.columns == "number" && Number.isFinite(o.columns) && (s = o.columns);
    } catch {
    }
  if (s === void 0) {
    const o = String(t.type ?? "");
    o === "tile" || o === "custom:m3e-light-card" || o === "custom:m3e-status-card" || o === "custom:m3e-toggle-card" || o === "custom:m3e-scene-card" || o === "custom:m3e-status-badge" || o === "button" || o === "entity" ? s = 6 : s = 12;
  }
  const a = Math.max(3, Math.min(12, Math.round(s))), r = typeof i?.rows == "number" && Number.isFinite(i.rows) && i.rows > 0 ? Math.round(i.rows) : void 0;
  return { cols: a, rows: r };
}
let Mt = class extends N {
  constructor() {
    super(...arguments), this._activeTab = 0, this._isDialogPreview = !1, this._tabCaches = /* @__PURE__ */ new Map(), this._activeCardEls = [], this._editModeEls = [], this._cardWrappers = [], this._lastRenderedKey = "", this._prewarmHandle = null;
  }
  static getStubConfig() {
    return {
      type: "custom:m3e-tabs-card",
      tabs_alignment: "center",
      default_tab: 0,
      remember_tab: !1,
      tabs: [
        { title: "Preferiti", icon: "mdi:heart-outline", cards: [] },
        { title: "Dispositivi", icon: "mdi:view-grid-outline", cards: [] },
        { title: "Luci", icon: "mdi:lightbulb-outline", cards: [] },
        { title: "Clima", icon: "mdi:thermometer", cards: [] }
      ]
    };
  }
  static getConfigElement() {
    return document.createElement("m3e-tabs-card-editor");
  }
  setConfig(t) {
    if (!t || !Array.isArray(t.tabs))
      throw new Error("m3e-tabs-card: devi definire almeno una tab");
    const e = t.tabs.slice(0, 4).map((s, a) => ({
      title: s.title?.trim() || `Tab ${a + 1}`,
      icon: s.icon?.trim() || Me[a % Me.length],
      cards: Array.isArray(s.cards) ? s.cards : []
    }));
    e.length === 0 && e.push({ title: "Tab 1", icon: Me[0], cards: [] });
    const i = this._config;
    if (this._config = {
      tabs_alignment: "center",
      default_tab: 0,
      remember_tab: !1,
      ...t,
      tabs: e
    }, i)
      this._activeTab >= e.length && (this._activeTab = Math.max(0, e.length - 1));
    else {
      let s = Math.max(0, Math.min(e.length - 1, this._config.default_tab ?? 0));
      if (this._config.remember_tab) {
        const a = this._readSavedTab();
        a !== null && a >= 0 && a < e.length && (s = a);
      }
      this._activeTab = s;
    }
    this._schedulePrewarm();
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto"
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._detectPreviewContext(), this._syncTabFromEditor(), this._schedulePrewarm();
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), this._prewarmHandle !== null) {
      const t = window.cancelIdleCallback;
      typeof t == "function" ? t(this._prewarmHandle) : window.clearTimeout(this._prewarmHandle), this._prewarmHandle = null;
    }
  }
  _detectPreviewContext() {
    let t = this;
    for (; t; ) {
      if (t instanceof HTMLElement) {
        const e = t.tagName.toLowerCase();
        if (e === "hui-card-preview" || e === "hui-dialog-edit-card") {
          this._isDialogPreview = !0;
          return;
        }
      }
      t.parentNode ? t = t.parentNode : t instanceof ShadowRoot ? t = t.host : t = null;
    }
    this._isDialogPreview = !1;
  }
  _syncTabFromEditor() {
    if (!this._isDialogPreview) return;
    const t = Ce();
    if (!t) return;
    const e = t.getActiveTab(), i = Math.max(0, (this._config?.tabs.length ?? 1) - 1), s = Math.max(0, Math.min(i, e));
    s !== this._activeTab && (this._activeTab = s);
  }
  _storageKey() {
    return `m3e_tabs_active::${(this._config?.tabs ?? []).map((e) => e.title).join("|")}`;
  }
  _readSavedTab() {
    try {
      const t = localStorage.getItem(this._storageKey());
      if (t === null) return null;
      const e = Number(t);
      return Number.isInteger(e) ? e : null;
    } catch {
      return null;
    }
  }
  _writeSavedTab(t) {
    if (!(!this._config?.remember_tab || this._isDialogPreview))
      try {
        localStorage.setItem(this._storageKey(), String(t));
      } catch {
      }
  }
  /**
   * Hass Gate: never re-render the outer tab bar on unrelated `hass` ticks.
   * Only forwards `hass` directly to the currently active tab's card instances!
   */
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_activeTab") || t.has("_isDialogPreview"))
      return !0;
    if (t.has("hass") && this.hass) {
      for (const i of this._activeCardEls) i.hass = this.hass;
      for (const i of this._editModeEls) i.hass = this.hass;
      const e = this.hass.themes?.darkMode;
      return e !== this._prevDarkMode ? (this._prevDarkMode = e, !0) : !1;
    }
    return !1;
  }
  _schedulePrewarm() {
    if (this._isDialogPreview || !this._config || this._config.tabs.length <= 1 || this._prewarmHandle !== null) return;
    const t = () => {
      this._prewarmHandle = null, !(!this._config || this._isDialogPreview) && this._config.tabs.forEach((i, s) => {
        s !== this._activeTab && (i.cards?.length ?? 0) > 0 && this._ensureTabInstances(s, i.cards ?? []);
      });
    }, e = window.requestIdleCallback;
    this._prewarmHandle = typeof e == "function" ? e(t, { timeout: 1500 }) : window.setTimeout(t, 400);
  }
  async _ensureTabInstances(t, e) {
    const i = await on();
    if (!i) return [];
    const s = this._tabCaches.get(t) ?? [], a = /* @__PURE__ */ new Map();
    for (const o of s) {
      const n = a.get(o.key) ?? [];
      n.push(o.el), a.set(o.key, n);
    }
    const r = [];
    for (const o of e) {
      const n = JSON.stringify(o);
      let p = a.get(n)?.shift();
      if (!p)
        try {
          p = i.createCardElement(o);
        } catch {
          const c = document.createElement("div");
          c.textContent = `Card error: ${o.type}`, c.style.padding = "12px", p = c;
        }
      this.hass && (p.hass = this.hass), r.push({ key: n, el: p });
    }
    return this._tabCaches.set(t, r), r.map((o) => o.el);
  }
  _selectTab(t) {
    const e = this._config?.tabs ?? [];
    if (t < 0 || t >= e.length || t === this._activeTab) return;
    const i = t > this._activeTab ? 1 : -1;
    navigator.vibrate?.(8), this._activeTab = t, this._writeSavedTab(t), this._isDialogPreview && Ce()?.setActiveTab(t), requestAnimationFrame(() => {
      const s = this._stageEl;
      if (s) {
        for (const a of s.getAnimations()) a.cancel();
        s.animate(
          [
            { transform: `translate3d(${i * 16}px, 0, 0)`, opacity: 0.3 },
            { transform: "translate3d(0, 0, 0)", opacity: 1 }
          ],
          {
            duration: 240,
            easing: "cubic-bezier(0.05, 0.7, 0.1, 1.0)"
          }
        );
      }
    });
  }
  _persistTabCards(t, e, i = !0) {
    if (!this._config) return;
    const s = this._config.tabs.map(
      (r, o) => o === t ? { ...r, cards: e } : r
    );
    this._config = { ...this._config, tabs: s };
    const a = Ce();
    a ? a.updateTabCards(t, e) : this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: this._config }
      })
    ), i && this._syncActiveTabCards(!0);
  }
  _buildSortablePreviewContainer(t, e, i) {
    const s = document.createElement("ha-sortable");
    s.disabled = !1, s.draggableSelector = ".card", s.rollback = !1, s.invertSwap = !0, s.options = {
      delay: 100,
      delayOnTouchOnly: !0,
      invertedSwapThreshold: 0.7
    };
    const a = document.createElement("div");
    a.className = "tabs-cards-grid edit-mode", this._editModeEls = [], this._cardWrappers = [];
    for (let c = 0; c < i.length; c++) {
      const h = e[c], f = i[c], { cols: m, rows: u } = Mi(h, f), v = document.createElement("div");
      v.className = "card", v.style.gridColumn = `span ${m}`, v.style.gridRow = u ? `span ${u}` : "";
      const _ = document.createElement("hui-card-edit-mode");
      _.hass = this.hass, _.lovelace = {
        editMode: !0,
        saveConfig: async () => {
        }
      }, _.path = [0, 0, c], _.hiddenOverlay = !1, _.appendChild(f), this._editModeEls.push(_), this._cardWrappers.push(v), v.appendChild(_), a.appendChild(v);
    }
    const r = document.createElement("button");
    r.type = "button", r.className = "add-card-pill";
    const o = this.hass?.localize?.(
      "ui.panel.lovelace.editor.section.add_card"
    ) || "Add card";
    r.setAttribute("aria-label", o), r.title = o;
    const n = document.createElement("ha-svg-icon");
    n.path = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
    const l = document.createElement("span");
    l.textContent = o, r.appendChild(n), r.appendChild(l), r.addEventListener("click", (c) => {
      c.stopPropagation(), Ce()?.openAddCard(t);
    }), a.appendChild(r), s.addEventListener("item-moved", (c) => {
      c.stopPropagation();
      const { oldIndex: h, newIndex: f } = c.detail, m = [...this._config?.tabs[t]?.cards ?? []];
      if (h === f || h < 0 || f < 0 || h >= m.length || f >= m.length)
        return;
      const [u] = m.splice(h, 1);
      m.splice(f, 0, u);
      const v = this._tabCaches.get(t);
      if (v) {
        const [y] = v.splice(h, 1);
        y && v.splice(f, 0, y), this._activeCardEls = v.map((w) => w.el);
      }
      const [_] = this._editModeEls.splice(h, 1);
      _ && this._editModeEls.splice(f, 0, _);
      const [x] = this._cardWrappers.splice(h, 1);
      if (x) {
        this._cardWrappers.splice(f, 0, x);
        const y = this._cardWrappers[f + 1] ?? r;
        a.insertBefore(x, y);
      }
      for (let y = 0; y < this._editModeEls.length; y++)
        this._editModeEls[y].path = [0, 0, y];
      this._lastRenderedKey = `${t}|preview|${JSON.stringify(m)}`, this._persistTabCards(t, m, !1);
    });
    const p = (c) => {
      const h = c.detail?.path;
      return Array.isArray(h) && h.length > 0 ? h[h.length - 1] : -1;
    };
    return a.addEventListener("ll-edit-card", (c) => {
      c.stopPropagation();
      const h = p(c);
      h >= 0 && Ce()?.openEditCard(t, h);
    }), a.addEventListener("ll-delete-card", (c) => {
      c.stopPropagation();
      const h = p(c), f = [...this._config?.tabs[t]?.cards ?? []];
      h < 0 || h >= f.length || (f.splice(h, 1), this._persistTabCards(t, f));
    }), a.addEventListener("ll-duplicate-card", (c) => {
      c.stopPropagation();
      const h = p(c), f = [...this._config?.tabs[t]?.cards ?? []];
      if (h < 0 || h >= f.length) return;
      const m = JSON.parse(JSON.stringify(f[h]));
      f.splice(h + 1, 0, m), this._persistTabCards(t, f);
    }), a.addEventListener("ll-copy-card", (c) => {
      c.stopPropagation();
      const h = p(c), f = this._config?.tabs[t]?.cards ?? [];
      h < 0 || h >= f.length || ai(f[h]);
    }), a.addEventListener("ll-cut-card", (c) => {
      c.stopPropagation();
      const h = p(c), f = [...this._config?.tabs[t]?.cards ?? []];
      h < 0 || h >= f.length || (ai(f[h]), f.splice(h, 1), this._persistTabCards(t, f));
    }), a.addEventListener("ll-paste-card", (c) => {
      c.stopPropagation();
      const h = Ys();
      if (!h) return;
      const f = [...this._config?.tabs[t]?.cards ?? [], h];
      this._persistTabCards(t, f);
    }), a.addEventListener("ll-change-grid-options", (c) => {
      c.stopPropagation();
      const h = c.detail, f = p(c), m = [...this._config?.tabs[t]?.cards ?? []];
      if (f < 0 || f >= m.length || !h?.grid_options) return;
      const u = {
        ...m[f],
        grid_options: {
          ...m[f].grid_options ?? {},
          ...h.grid_options
        }
      };
      m[f] = u;
      const v = this._cardWrappers[f], _ = this._activeCardEls[f];
      if (v) {
        const { cols: x, rows: y } = Mi(u, _);
        v.style.gridColumn = `span ${x}`, v.style.gridRow = y ? `span ${y}` : "";
      }
      this._lastRenderedKey = `${t}|preview|${JSON.stringify(m)}`, this._persistTabCards(t, m, !1);
    }), s.appendChild(a), s;
  }
  async _syncActiveTabCards(t = !1) {
    const e = this._stageEl;
    if (!e || !this._config) return;
    const i = Math.max(0, Math.min(this._config.tabs.length - 1, this._activeTab)), s = this._config.tabs[i]?.cards ?? [], a = `${i}|${this._isDialogPreview ? "preview" : "view"}|${JSON.stringify(s)}`;
    if (t || a !== this._lastRenderedKey || e.childElementCount === 0) {
      this._lastRenderedKey = a;
      const r = await this._ensureTabInstances(i, s);
      if (this._activeCardEls = r, this._isDialogPreview) {
        const o = this._buildSortablePreviewContainer(i, s, r);
        e.replaceChildren(o);
      } else {
        this._editModeEls = [], this._cardWrappers = [];
        const o = document.createElement("div");
        o.className = "tabs-cards-grid";
        for (let n = 0; n < r.length; n++) {
          const { cols: l, rows: p } = Mi(s[n], r[n]), c = document.createElement("div");
          c.className = "card", c.style.gridColumn = `span ${l}`, p && (c.style.gridRow = `span ${p}`), c.appendChild(r[n]), o.appendChild(c);
        }
        e.replaceChildren(o);
      }
    }
    if (this.hass) {
      for (const r of this._activeCardEls) r.hass = this.hass;
      for (const r of this._editModeEls) r.hass = this.hass;
    }
  }
  updated(t) {
    t.has("_config") && this._isDialogPreview && this._syncTabFromEditor(), (t.has("_config") || t.has("_activeTab") || t.has("_isDialogPreview")) && this._syncActiveTabCards();
  }
  render() {
    if (!this._config) return g;
    const t = this._config.tabs, e = this._config.tabs_alignment || "center";
    return d`
      <div class="m3e-tabs-root">
        <div
          class="tabs-bar align-${e}"
          role="tablist"
          aria-label="Tabs"
        >
          ${t.map((i, s) => {
      const a = s === this._activeTab, r = i.icon || Me[s % Me.length];
      return d`
              <button
                type="button"
                role="tab"
                class="tab-btn ${a ? "is-active" : ""}"
                aria-selected=${String(a)}
                aria-label=${i.title}
                @click=${() => this._selectTab(s)}
              >
                <span class="tab-icon" aria-hidden="true">
                  <ha-icon .icon=${r}></ha-icon>
                </span>
                <span class="tab-label-wrap">
                  <span class="tab-label">${i.title}</span>
                </span>
              </button>
            `;
    })}
        </div>

        <div class="tab-content-stage" role="tabpanel"></div>
      </div>
    `;
  }
};
Mt.styles = [
  V,
  R`
      :host {
        display: block;
        height: auto;
      }

      .m3e-tabs-root {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
      }

      /* =====================================================================
         FLAT GOOGLE HOME M3 EXPRESSIVE CONNECTED TAB PILLS
         Inactive: 52x52 circle (icon only)
         Active: 16px squircle pill (icon + smoothly revealed title)
         ===================================================================== */
      .tabs-bar {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        width: 100%;
        padding: 2px 0;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .tabs-bar::-webkit-scrollbar {
        display: none;
      }

      .tabs-bar.align-center {
        justify-content: center;
      }

      .tabs-bar.align-start {
        justify-content: flex-start;
      }

      .tabs-bar.align-end {
        justify-content: flex-end;
      }

      .tab-btn {
        position: relative;
        flex: 0 0 auto;
        height: 52px;
        min-width: 52px;
        padding: 0 15px;
        border: 0;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        letter-spacing: 0.01em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        transition:
          padding var(--m3e-spring-spatial-default),
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .tab-btn:hover:not(.is-active) {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .tab-btn:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #a8c7fa);
        outline-offset: 2px;
      }

      .tab-btn.is-active {
        padding: 0 20px;
        border-radius: 16px;
        background: var(--md-sys-color-secondary-container, #3d4758);
        color: var(--md-sys-color-on-secondary-container, #dbe2f9);
        font-weight: 600;
      }

      .tab-btn:active {
        transform: scale(0.94);
        border-radius: 14px;
      }

      .tab-icon {
        width: 22px;
        height: 22px;
        flex: 0 0 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 22px;
      }

      /* Smooth 0fr -> 1fr spring reveal for active tab label */
      .tab-label-wrap {
        display: grid;
        grid-template-columns: 0fr;
        margin-inline-start: 0;
        transition:
          grid-template-columns var(--m3e-spring-spatial-default),
          margin-inline-start var(--m3e-spring-spatial-default);
      }

      .tab-btn.is-active .tab-label-wrap {
        grid-template-columns: 1fr;
        margin-inline-start: 10px;
      }

      .tab-label {
        overflow: hidden;
        white-space: nowrap;
        min-width: 0;
        opacity: 0;
        transform: translateX(-4px);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .tab-btn.is-active .tab-label {
        opacity: 1;
        transform: translateX(0);
      }

      /* =====================================================================
         INNER 12-COLUMN SECTIONS-COMPATIBLE CARD GRID
         ===================================================================== */
      .tab-content-stage {
        width: 100%;
        will-change: transform, opacity;
      }

      .tabs-cards-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: minmax(56px, auto);
        gap: 10px;
        align-items: stretch;
      }

      .tabs-cards-grid > .card {
        position: relative;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .tabs-cards-grid > .card > *,
      .tabs-cards-grid hui-card-edit-mode {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      /* M3 Expressive Tonal Pill "+ Add card" button (in editor live preview) */
      .add-card-pill {
        grid-column: 1 / -1;
        width: 100%;
        height: 52px;
        margin-top: 6px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          filter var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .add-card-pill:hover {
        filter: brightness(1.07);
      }

      .add-card-pill:active {
        transform: scale(0.97);
        border-radius: 18px;
      }

      .add-card-pill ha-svg-icon {
        --mdc-icon-size: 20px;
        display: inline-flex;
      }
    `
];
be([
  O({ attribute: !1 })
], Mt.prototype, "hass", 2);
be([
  b()
], Mt.prototype, "_config", 2);
be([
  b()
], Mt.prototype, "_activeTab", 2);
be([
  b()
], Mt.prototype, "_isDialogPreview", 2);
be([
  z(".tab-content-stage")
], Mt.prototype, "_stageEl", 2);
Mt = be([
  B("m3e-tabs-card")
], Mt);
var nn = Object.defineProperty, ln = Object.getOwnPropertyDescriptor, ye = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ln(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && nn(e, i, a), a;
};
let Pt = class extends N {
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
      const e = this.hass.states[this._config.entity], i = this._config.outdoor_entity ? this.hass.states[this._config.outdoor_entity] : void 0, a = t.get("hass")?.themes?.darkMode !== this.hass.themes?.darkMode;
      return e !== this._prevEntity || i !== this._prevOutdoor || a ? (this._prevEntity = e, this._prevOutdoor = i, !0) : !1;
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
    const i = this._targetTemp ?? this._currentTemp ?? 20, s = this._step, a = i + t * s, r = Math.max(this._minTemp, Math.min(this._maxTemp, a)), o = Math.round(r / s) * s, n = Number(o.toFixed(1));
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
    return e || t === "neutral" ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3 7a3 3 0 0 1-1.6-5.54l.6-.38V5a1 1 0 0 1 2 0v9.08l.6.38A3 3 0 0 1 12 20Z"
          />
        </svg>
      ` : t === "heat" ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M12 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M17 19c1.4-2 1.4-4 0-6s-1.4-4 0-6"
            stroke="currentColor"
            stroke-width="2.1"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      ` : t === "cool" ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"
          />
        </svg>
      ` : i === "dry" ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z" />
        </svg>
      ` : i === "fan_only" ? d`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
          />
        </svg>
      ` : d`
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
    if (!this._config) return g;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isUnavailable, s = this._climateTone, a = !!this.hass?.themes?.darkMode, r = this._targetTemp, o = this._currentTemp, n = String(t?.state ?? "off").toLowerCase(), l = P(this.hass, "indoor"), p = o !== null ? n === "off" ? `${P(this.hass, "off")} · ${l} ${this._formatTempNumber(o)}` : `${l} ${this._formatTempNumber(o)}` : n === "off" ? P(this.hass, "off") : n.charAt(0).toUpperCase() + n.slice(1);
    return d`
      <ha-card
        class="thermostat-card is-wide-card tone-${s} ${a ? "is-dark" : "is-light"} ${this._pressed ? "is-pressed" : ""} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${e}, ${i ? "Offline" : r !== null ? `${r}°` : n}"
        @pointerdown=${(c) => {
      i || c.pointerType === "mouse" && c.button !== 0 || c.target?.closest("button") || (this._pressed = !0);
    }}
        @pointerup=${() => this._pressed = !1}
        @pointerleave=${() => this._pressed = !1}
        @pointercancel=${() => this._pressed = !1}
        @click=${() => this._openPopup()}
        @keydown=${(c) => {
      (c.key === "Enter" || c.key === " ") && (c.preventDefault(), this._openPopup());
    }}
      >
        <header class="thermo-header">
          <span class="header-left">
            <span class="header-icon">${this._renderHeaderIcon(s, i)}</span>
            <span class="header-title">${e}</span>
          </span>

          ${i ? d`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : d`
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

        ${i ? d`<div class="offline-hero">Offline</div>` : d`
              <div class="controls-row">
                <button
                  type="button"
                  class="step-btn"
                  aria-label="Riduci temperatura"
                  @click=${(c) => this._nudgeTemp(-1, c)}
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
                  ${r !== null ? this._formatTempNumber(r) : "—"}
                </div>

                <button
                  type="button"
                  class="step-btn"
                  aria-label="Aumenta temperatura"
                  @click=${(c) => this._nudgeTemp(1, c)}
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
        ${Ti(this._attachPopupHost)}
      ></m3e-status-card>
    `;
  }
};
Pt.styles = [
  V,
  R`
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
ye([
  O({ attribute: !1 })
], Pt.prototype, "hass", 2);
ye([
  b()
], Pt.prototype, "_config", 2);
ye([
  b()
], Pt.prototype, "_optimisticTemp", 2);
ye([
  b()
], Pt.prototype, "_pressed", 2);
ye([
  z(".thermostat-card")
], Pt.prototype, "_cardEl", 2);
Pt = ye([
  B("m3e-thermostat-card")
], Pt);
var cn = Object.defineProperty, dn = Object.getOwnPropertyDescriptor, xe = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? dn(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && cn(e, i, a), a;
};
let Tt = class extends N {
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
      const a = { ...this._config };
      i.length > 0 ? a.features = i : (delete a.features, delete a.features_position), this._emitConfig(a);
    }, this._onGoBack = () => {
      this._subElementEditorConfig = void 0;
    };
  }
  connectedCallback() {
    super.connectedCallback(), sa().then((t) => {
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
    if (!this.hass || !this._config) return g;
    const t = this._config.entity, e = t ? this.hass.states[t] : void 0, i = { entity_id: t };
    if (this._subElementEditorConfig)
      return d`
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
    return d`
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
            ${this._featuresEditorReady ? d`
                  <hui-card-features-editor
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    .context=${i}
                    .stateObj=${e}
                    .features=${s}
                    @features-changed=${this._onFeaturesChanged}
                    @edit-detail-element=${this._onEditDetailElement}
                  ></hui-card-features-editor>
                  ${s.length > 0 ? d`
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
                      ` : g}
                ` : d`<div class="loading-hint">Caricamento editor Features…</div>`}
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
};
Tt.styles = R`
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
xe([
  O({ attribute: !1 })
], Tt.prototype, "hass", 2);
xe([
  O({ attribute: !1 })
], Tt.prototype, "lovelace", 2);
xe([
  b()
], Tt.prototype, "_config", 2);
xe([
  b()
], Tt.prototype, "_featuresEditorReady", 2);
xe([
  b()
], Tt.prototype, "_subElementEditorConfig", 2);
Tt = xe([
  B("m3e-toggle-card-editor")
], Tt);
var pn = Object.defineProperty, hn = Object.getOwnPropertyDescriptor, wt = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? hn(e, i) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (a = (s ? o(e, i, a) : o(a)) || a);
  return s && a && pn(e, i, a), a;
};
const un = 420;
let ft = class extends N {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._featuresLoaded = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._downX = 0, this._downY = 0, this._onTilePointerDown = (t) => {
      this._isUnavailable || t.pointerType === "mouse" && t.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._downX = t.clientX, this._downY = t.clientY, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, un));
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
    (this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded && ia().then((t) => {
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
    super.disconnectedCallback(), ut(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1;
    }), this._clearLongPress();
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
    if (this._isUnavailable) return;
    if (this._popupOpen && this._dialogEl?.open) {
      let s = !0;
      try {
        s = this._dialogEl.matches(":modal");
      } catch {
      }
      if (s) return;
      this._popupOpen = !1;
    }
    window.getSelection()?.removeAllRanges();
    const t = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    if (!e) {
      this._popupOpen = !1;
      return;
    }
    Kt(e, i, {
      originRect: t,
      onRequestClose: () => this.closePopup(),
      onForceReset: () => {
        this._popupOpen = !1;
      }
    });
  }
  closePopup() {
    qt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        re(this, this.hass, this._config.navigation_path);
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
      return d`<ha-icon .icon=${t}></ha-icon>`;
    if (this._config?.use_entity_icon && this._entity && typeof customElements < "u") {
      if (customElements.get("ha-state-icon"))
        return d`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      const e = this._entity.attributes.icon;
      if (e && customElements.get("ha-icon"))
        return d`<ha-icon .icon=${e}></ha-icon>`;
    }
    return Yt(this._entity, this._isOn);
  }
  _getPowerSiblings() {
    if (!this.hass?.entities || !this._config) return [];
    const t = this._config.entity, e = this.hass.entities[t]?.device_id;
    if (!e) return [];
    const i = ["power", "energy", "current", "voltage"], s = [];
    for (const [a, r] of Object.entries(this.hass.entities)) {
      if (a === t || r.device_id !== e || !a.startsWith("sensor.")) continue;
      const o = this.hass.states[a];
      if (!o || o.state === "unavailable" || o.state === "unknown") continue;
      const n = String(o.attributes.device_class ?? "");
      i.includes(n) && s.push(o);
    }
    return s.sort(
      (a, r) => i.indexOf(String(a.attributes.device_class ?? "")) - i.indexOf(String(r.attributes.device_class ?? ""))
    ), s;
  }
  _cleanSiblingLabel(t) {
    const e = (t.attributes.friendly_name || "").trim(), i = this.hass?.entities?.[t.entity_id]?.device_id, s = i ? this.hass?.devices?.[i] : void 0;
    for (const a of [
      s?.name_by_user,
      s?.name,
      typeof this._config?.name == "string" ? this._config.name : void 0,
      this._entity?.attributes.friendly_name
    ]) {
      const r = a?.trim();
      if (r && e.length > r.length && e.toLowerCase().startsWith(r.toLowerCase())) {
        const o = e.slice(r.length).replace(/^[\s\-–—:]+/, "").trim();
        if (o) return o.charAt(0).toUpperCase() + o.slice(1);
      }
    }
    return e || String(t.attributes.device_class ?? "Sensor");
  }
  render() {
    if (!this._config) return g;
    const t = this._entity, e = mt(this.hass, t, this._config.name, this._config.entity), i = this._isOn, s = i ? this._config.icon_on?.trim() || void 0 : this._config.icon_off?.trim() || this._config.icon_on?.trim() || void 0, a = this._isUnavailable ? "Offline" : i ? this._config.label_on || "On" : this._config.label_off || "Off", r = !!this._config.hide_state, o = r ? null : fe(this.hass, t, this._config.state_content, a), n = r ? "" : o ?? a, l = `style-${this._config.card_style ?? "default"}`, p = this._popupOpen ? Ne(t?.last_changed) : null, c = this._popupOpen ? this._getPowerSiblings() : [], h = this._config.features ?? [], f = h.length > 0, m = this._config.features_position ?? "bottom";
    return d`
      <ha-card
        class="toggle-tile ${l} ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""} ${f ? `has-features features-${m}` : ""}"
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
        @contextmenu=${(u) => {
      u.preventDefault(), this._clearLongPress(), this._longPressTriggered = !0, this._handleHoldAction();
    }}
        @keydown=${(u) => {
      u.key === " " || u.key === "Enter" ? (u.preventDefault(), this._toggle()) : (u.key === "o" || u.key === "O") && (u.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            ${n ? d`<span class="tile-subtitle">${n}</span>` : g}
          </div>
          ${this._isUnavailable ? d`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              ` : g}
        </div>
        ${f ? d`
              <div
                class="features-wrap"
                @click=${yt}
                @pointerdown=${yt}
                @pointermove=${yt}
                @pointerup=${yt}
                @contextmenu=${yt}
              >
                <hui-card-features
                  .hass=${this.hass}
                  .context=${{ entity_id: this._config.entity }}
                  .stateObj=${t}
                  .features=${h}
                  .position=${m}
                ></hui-card-features>
              </div>
            ` : g}
      </ha-card>

      <dialog
        class="toggle-dialog"
        @click=${(u) => {
      u.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(u) => {
      u.preventDefault(), this.closePopup();
    }}
        @touchmove=${(u) => At(u, this._dialogEl)}
      >
        ${this._popupOpen ? d`
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
                    ${p ? d`<span class="dialog-last-changed">${p}</span>` : g}
                  </div>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${P(this.hass, "history")}
                    title=${P(this.hass, "history_tooltip")}
                    @click=${() => {
      const u = this._config?.entity;
      u && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: u, view: "history" }
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
                    @keydown=${(u) => {
      (u.key === " " || u.key === "Enter") && (u.preventDefault(), this._toggle());
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

                ${c.length > 0 ? d`
                      <div class="telemetry-stack">
                        ${c.map(
      (u) => d`
                            <div class="info-pill">
                              <span class="info-pill-left">
                                ${typeof customElements < "u" && customElements.get("ha-state-icon") ? d`<ha-state-icon
                                      class="mini-ha-icon"
                                      .hass=${this.hass}
                                      .stateObj=${u}
                                    ></ha-state-icon>` : g}
                                <span>${this._cleanSiblingLabel(u)}</span>
                              </span>
                              <span class="info-pill-val">
                                ${u.state}${u.attributes.unit_of_measurement ?? ""}
                              </span>
                            </div>
                          `
    )}
                      </div>
                    ` : g}
              </div>
            ` : g}
      </dialog>
    `;
  }
};
ft.styles = [
  V,
  R`
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
wt([
  O({ attribute: !1 })
], ft.prototype, "hass", 2);
wt([
  b()
], ft.prototype, "_config", 2);
wt([
  b()
], ft.prototype, "_pressed", 2);
wt([
  b()
], ft.prototype, "_popupOpen", 2);
wt([
  b()
], ft.prototype, "_featuresLoaded", 2);
wt([
  z("dialog.toggle-dialog")
], ft.prototype, "_dialogEl", 2);
wt([
  z(".toggle-tile")
], ft.prototype, "_tileEl", 2);
wt([
  z(".dialog-surface")
], ft.prototype, "_dialogSurfaceEl", 2);
ft = wt([
  B("m3e-toggle-card")
], ft);
no();
function tt(t) {
  return t.split(".")[0] ?? "";
}
function ra(t, e) {
  if (tt(e) !== "light") return !1;
  const i = t?.states?.[e]?.attributes?.entity_id;
  return Array.isArray(i) && i.length > 0;
}
function oa(t, e) {
  if (tt(e) !== "sensor") return !1;
  const i = t?.states?.[e];
  if (!i) return !1;
  if (typeof i.attributes?.unit_of_measurement == "string" && i.attributes.unit_of_measurement)
    return !0;
  const s = Number(i.state);
  return i.state !== "" && !Number.isNaN(s) && Number.isFinite(s);
}
const mn = /* @__PURE__ */ new Set([
  "switch",
  "input_boolean",
  "fan",
  "humidifier",
  "lock",
  "valve",
  "siren"
]), fn = /* @__PURE__ */ new Set(["scene", "script", "button", "input_button", "automation"]), gn = /* @__PURE__ */ new Set([
  "sensor",
  "binary_sensor",
  "climate",
  "media_player",
  "remote",
  "select",
  "input_select",
  "switch",
  "cover",
  "lock",
  "fan",
  "vacuum",
  "weather",
  "alarm_control_panel",
  "timer",
  "counter",
  "number",
  "input_number",
  "calendar",
  "water_heater",
  "humidifier",
  "device_tracker",
  "person"
]), _n = /* @__PURE__ */ new Set([
  "sensor",
  "binary_sensor",
  "weather",
  "climate",
  "lock",
  "cover",
  "alarm_control_panel",
  "person"
]), vn = /* @__PURE__ */ new Set([
  "sensor",
  "binary_sensor",
  "person",
  "device_tracker",
  "climate",
  "weather",
  "lock",
  "cover",
  "alarm_control_panel",
  "timer",
  "counter",
  "number",
  "input_number",
  "switch",
  "light",
  "fan",
  "media_player",
  "vacuum"
]);
function W(t) {
  window.customCards = window.customCards || [], window.customCards.some((e) => e.type === t.type) || window.customCards.push(t);
}
function na(t) {
  window.customBadges = window.customBadges || [], window.customBadges.some((e) => e.type === t.type) || window.customBadges.push(t);
}
W({
  type: "m3e-light-card",
  name: "Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You integration.",
  preview: !0,
  getEntitySuggestion: (t, e) => tt(e) !== "light" ? null : { config: { type: "custom:m3e-light-card", entity: e } }
});
W({
  type: "m3e-status-card",
  name: "Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular popups (Sensor, Selector, Climate, Remote, Media).",
  preview: !0,
  getEntitySuggestion: (t, e) => {
    const i = tt(e);
    return gn.has(i) ? {
      config: { type: "custom:m3e-status-card", entity: e, popup_type: i === "sensor" || i === "binary_sensor" ? "sensor" : i === "climate" ? "climate" : i === "media_player" ? "media" : i === "remote" ? "remote" : i === "select" || i === "input_select" ? "selector" : "custom" }
    } : null;
  }
});
W({
  type: "m3e-toggle-card",
  name: "Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0,
  getEntitySuggestion: (t, e) => mn.has(tt(e)) ? { config: { type: "custom:m3e-toggle-card", entity: e } } : null
});
W({
  type: "m3e-scene-card",
  name: "Scene / Button Card",
  description: "Google Home–style one-tap scene, script, or button tile with animated activation feedback.",
  preview: !0,
  getEntitySuggestion: (t, e) => fn.has(tt(e)) ? { config: { type: "custom:m3e-scene-card", entity: e } } : null
});
W({
  type: "m3e-light-control-card",
  name: "Light Control (All on / All off)",
  description: "Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.",
  preview: !0,
  getEntitySuggestion: (t, e) => ra(t, e) ? {
    config: { type: "custom:m3e-light-control-card", entities: [e] }
  } : null
});
W({
  type: "m3e-light-group-card",
  name: "Light Group Card",
  description: "Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.",
  preview: !0,
  getEntitySuggestion: (t, e) => ra(t, e) ? { config: { type: "custom:m3e-light-group-card", entity: e } } : null
});
const la = {
  type: "m3e-assist-card",
  name: "Assist & Mode Bar",
  description: 'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector.',
  preview: !0,
  getEntitySuggestion: (t, e) => {
    const i = tt(e);
    return i !== "input_select" && i !== "select" ? null : { config: { type: "custom:m3e-assist-card", entity: e } };
  }
};
W(la);
na(la);
W({
  type: "m3e-glance-card",
  name: "At a Glance Strip",
  description: "Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.",
  preview: !0,
  getEntitySuggestion: (t, e) => _n.has(tt(e)) ? {
    config: { type: "custom:m3e-glance-card", items: [{ entity: e }] }
  } : null
});
W({
  type: "m3e-people-card",
  name: "People Glance",
  description: "At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.",
  preview: !0,
  getEntitySuggestion: (t, e) => {
    const i = tt(e);
    return i !== "person" && i !== "device_tracker" ? null : {
      config: { type: "custom:m3e-people-card", items: [{ entity: e }] }
    };
  }
});
W({
  type: "m3e-thermostat-card",
  name: "Thermostat Card",
  description: "Full-width Google Home–style thermostat card with +/- pill steppers, heat/cool semantic colors, offline state, and full climate dial popup.",
  preview: !0,
  getEntitySuggestion: (t, e) => tt(e) !== "climate" ? null : { config: { type: "custom:m3e-thermostat-card", entity: e } }
});
W({
  type: "m3e-stack-card",
  name: "Stack",
  description: "Google Home–style comparison card to list and compare multiple sensors side-by-side with customizable header icon and title.",
  preview: !0,
  getEntitySuggestion: (t, e) => {
    if (!oa(t, e)) return null;
    const i = String(t?.states?.[e]?.attributes?.friendly_name ?? "").trim();
    return {
      config: {
        type: "custom:m3e-stack-card",
        ...i ? { title: i } : {},
        items: [{ entity: e }]
      }
    };
  }
});
W({
  type: "m3e-media-bar-card",
  name: "Media Bar",
  description: "Footer-ready Google Home–style media player bar with squircle artwork, auto-scrolling marquee metadata, Cast/Source selector, and Play/Pause button.",
  preview: !0,
  getEntitySuggestion: (t, e) => tt(e) !== "media_player" ? null : { config: { type: "custom:m3e-media-bar-card", entity: e } }
});
W({
  type: "m3e-media-player-card",
  name: "Media Player",
  description: "Full-bleed Material 3 Expressive media player card with dynamic artwork color extraction, shape-morphing Play/Pause, and animated wavy progress slider.",
  preview: !0,
  getEntitySuggestion: (t, e) => tt(e) !== "media_player" ? null : { config: { type: "custom:m3e-media-player-card", entity: e } }
});
W({
  type: "m3e-popup-card",
  name: "Pop-up Card",
  description: "Customizable Material 3 Expressive pop-up container with entity header button, native HA Add card picker / vertical-stack support, and hash/path navigation trigger.",
  preview: !0
});
W({
  type: "m3e-tabs-card",
  name: "Tabs Card",
  description: "Flat Material 3 Expressive animated tab pills (up to 4 tabs) with morphing active indicator, 12-column card grid per tab, and native HA drag-and-drop / Add card editor.",
  preview: !0
});
W({
  type: "m3e-remote-card",
  name: "Remote Card",
  description: "Google Home–style Material 3 Expressive TV & Media remote card with gesture touchpad / D-Pad, volume rocker, out-of-the-box multi-platform commands, and custom native buttons & segmented pills.",
  preview: !0,
  getEntitySuggestion: (t, e) => {
    const i = tt(e);
    return i !== "remote" && i !== "media_player" ? null : { config: { type: "custom:m3e-remote-card", entity: e } };
  }
});
W({
  type: "m3e-history-card",
  name: "History Card",
  description: "Fitbit–style Material 3 Expressive history card with Week/Month capsule bar carousel, cumulative stats, touch swipe, and multi-sensor line/dot analytics.",
  preview: !0,
  getEntitySuggestion: (t, e) => !oa(t, e) && tt(e) !== "counter" ? null : {
    config: {
      type: "custom:m3e-history-card",
      entity: e,
      chart_style: "bar",
      default_range: "M"
    }
  }
});
const ca = {
  type: "m3e-status-badge",
  name: "Status Badge",
  description: "Compact Material 3 Expressive status badge (Glance Mini, Split Tonal Pill, Minimal Dot, Squircle Alert) for dashboard headers or compact grids.",
  preview: !0,
  getEntitySuggestion: (t, e) => vn.has(tt(e)) ? { config: { type: "custom:m3e-status-badge", entity: e } } : null
};
na(ca);
W(ca);
export {
  xt as M3EAssistCard,
  ne as M3EGlanceCard,
  G as M3EHistoryCard,
  Y as M3ELightCard,
  le as M3ELightControlCard,
  rt as M3ELightGroupCard,
  ot as M3EMediaBarCard,
  et as M3EMediaPlayerCard,
  de as M3EPeopleCard,
  it as M3EPopupCard,
  nt as M3ERemoteCard,
  Gt as M3ESceneCard,
  Fe as M3EStackCard,
  kt as M3EStatusBadge,
  F as M3EStatusCard,
  Mt as M3ETabsCard,
  Pt as M3EThermostatCard,
  ft as M3EToggleCard
};
