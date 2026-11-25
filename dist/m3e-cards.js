/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis, xt = nt.ShadowRoot && (nt.ShadyCSS === void 0 || nt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wt = Symbol(), Ot = /* @__PURE__ */ new WeakMap();
let Ft = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (xt && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = Ot.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ot.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qt = (t) => new Ft(typeof t == "string" ? t : t + "", void 0, wt), et = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new Ft(i, t, wt);
}, te = (t, e) => {
  if (xt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = nt.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, Dt = xt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Qt(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ee, defineProperty: ie, getOwnPropertyDescriptor: se, getOwnPropertyNames: re, getOwnPropertySymbols: oe, getPrototypeOf: ne } = Object, ct = globalThis, It = ct.trustedTypes, ae = It ? It.emptyScript : "", le = ct.reactiveElementPolyfillSupport, q = (t, e) => t, at = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ae : null;
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
} }, $t = (t, e) => !ee(t, e), Lt = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ??= Symbol("metadata"), ct.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Lt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && ie(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: o } = se(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const a = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(q("elementProperties"))) return;
    const e = ne(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(q("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(q("properties"))) {
      const i = this.properties, s = [...re(i), ...oe(i)];
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
      for (const r of s) i.unshift(Dt(r));
    } else e !== void 0 && i.push(Dt(e));
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
    return te(e, this.constructor.elementStyles), e;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : at).toAttribute(i, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : at;
      this._$Em = r;
      const a = n.fromAttribute(i, o.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? $t)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, a = this[r];
        n !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[q("elementProperties")] = /* @__PURE__ */ new Map(), N[q("finalized")] = /* @__PURE__ */ new Map(), le?.({ ReactiveElement: N }), (ct.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = globalThis, Rt = (t) => t, lt = St.trustedTypes, Ht = lt ? lt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, jt = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, Wt = "?" + T, ce = `<${Wt}>`, U = document, K = () => U.createComment(""), J = (t) => t === null || typeof t != "object" && typeof t != "function", Pt = Array.isArray, de = (t) => Pt(t) || typeof t?.[Symbol.iterator] == "function", ft = `[ 	
\f\r]`, Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zt = /-->/g, Ut = />/g, R = RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Bt = /'/g, Nt = /"/g, Gt = /^(?:script|style|textarea|title)$/i, Yt = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), p = Yt(1), gt = Yt(2), V = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Vt = /* @__PURE__ */ new WeakMap(), z = U.createTreeWalker(U, 129);
function qt(t, e) {
  if (!Pt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ht !== void 0 ? Ht.createHTML(e) : e;
}
const pe = (t, e) => {
  const i = t.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Y;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let d, h, c = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, h = n.exec(l), h !== null); ) f = n.lastIndex, n === Y ? h[1] === "!--" ? n = zt : h[1] !== void 0 ? n = Ut : h[2] !== void 0 ? (Gt.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = R) : h[3] !== void 0 && (n = R) : n === R ? h[0] === ">" ? (n = r ?? Y, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, d = h[1], n = h[3] === void 0 ? R : h[3] === '"' ? Nt : Bt) : n === Nt || n === Bt ? n = R : n === zt || n === Ut ? n = Y : (n = R, r = void 0);
    const m = n === R && t[a + 1].startsWith("/>") ? " " : "";
    o += n === Y ? l + ce : c >= 0 ? (s.push(d), l.slice(0, c) + jt + l.slice(c) + T + m) : l + T + (c === -2 ? a : m);
  }
  return [qt(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Q {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [d, h] = pe(e, i);
    if (this.el = Q.createElement(d, s), z.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = z.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(jt)) {
          const f = h[n++], m = r.getAttribute(c).split(T), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: v[2], strings: m, ctor: v[1] === "." ? ue : v[1] === "?" ? fe : v[1] === "@" ? ge : dt }), r.removeAttribute(c);
        } else c.startsWith(T) && (l.push({ type: 6, index: o }), r.removeAttribute(c));
        if (Gt.test(r.tagName)) {
          const c = r.textContent.split(T), f = c.length - 1;
          if (f > 0) {
            r.textContent = lt ? lt.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(c[m], K()), z.nextNode(), l.push({ type: 2, index: ++o });
            r.append(c[f], K());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Wt) l.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(T, c + 1)) !== -1; ) l.push({ type: 7, index: o }), c += T.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const s = U.createElement("template");
    return s.innerHTML = e, s;
  }
}
function Z(t, e, i = t, s) {
  if (e === V) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = J(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = Z(t, r._$AS(t, e.values), r, s)), e;
}
class he {
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
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? U).importNode(i, !0);
    z.currentNode = r;
    let o = z.nextNode(), n = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new it(o, o.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (d = new me(o, this, e)), this._$AV.push(d), l = s[++a];
      }
      n !== l?.index && (o = z.nextNode(), n++);
    }
    return z.currentNode = U, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class it {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = Z(this, e, i), J(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== V && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : de(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && J(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Q.createElement(qt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new he(r, this), n = o.u(this.options);
      o.p(i), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = Vt.get(e.strings);
    return i === void 0 && Vt.set(e.strings, i = new Q(e)), i;
  }
  k(e) {
    Pt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of e) r === i.length ? i.push(s = new it(this.O(K()), this.O(K()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = Rt(e).nextSibling;
      Rt(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class dt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, i = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = Z(this, e, i, 0), n = !J(e) || e !== this._$AH && e !== V, n && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = o[0], l = 0; l < o.length - 1; l++) d = Z(this, a[s + l], i, l), d === V && (d = this._$AH[l]), n ||= !J(d) || d !== this._$AH[l], d === u ? e = u : e !== u && (e += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ue extends dt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class fe extends dt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class ge extends dt {
  constructor(e, i, s, r, o) {
    super(e, i, s, r, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = Z(this, e, i, 0) ?? u) === V) return;
    const s = this._$AH, r = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class me {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Z(this, e);
  }
}
const _e = St.litHtmlPolyfillSupport;
_e?.(Q, it), (St.litHtmlVersions ??= []).push("3.3.3");
const ve = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new it(e.insertBefore(K(), o), o, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = globalThis;
class O extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ve(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return V;
  }
}
O._$litElement$ = !0, O.finalized = !0, Ct.litElementHydrateSupport?.({ LitElement: O });
const ye = Ct.litElementPolyfillSupport;
ye?.({ LitElement: O });
(Ct.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const be = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: $t }, xe = (t = be, e, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), s === "accessor") {
    const { name: n } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(n, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, t, a), a;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(a) {
      const l = this[n];
      e.call(this, a), this.requestUpdate(n, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function st(t) {
  return (e, i) => typeof i == "object" ? xe(t, e, i) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(t) {
  return st({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function E(t, e) {
  return (i, s, r) => {
    const o = (n) => n.renderRoot?.querySelector(t) ?? null;
    return we(i, s, { get() {
      return o(this);
    } });
  };
}
const kt = et`
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

  /* 2. M3 Expressive Dynamic Shape Morph (20px inactive <-> full pill active) */
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
`;
function At(t) {
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
  const o = Math.floor(r / 24);
  return o === 1 ? "1 giorno fa" : `${o} giorni fa`;
}
var $e = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, $ = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Se(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && $e(e, i, r), r;
};
const Zt = 8, Pe = 420, Ce = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], Xt = "m3e-light-recent-colors:", ke = 6;
function Kt(t) {
  try {
    const e = window.localStorage.getItem(`${Xt}${t}`);
    if (!e) return [];
    const i = JSON.parse(e);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function Ae(t, e) {
  try {
    const i = Kt(t).filter((r) => r.hex !== e.hex), s = [e, ...i].slice(0, ke);
    window.localStorage.setItem(`${Xt}${t}`, JSON.stringify(s));
  } catch {
  }
}
function mt([t, e, i]) {
  return "#" + [t, e, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function _t(t) {
  const e = Math.max(2e3, Math.min(6500, t));
  return e <= 2400 ? [255, 224, 102] : e <= 2900 ? [255, 230, 138] : e <= 3600 ? [255, 240, 184] : e <= 4500 ? [255, 247, 224] : e <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function Ee([t, e, i]) {
  const [s, r, o] = [t, e, i].map((n) => {
    const a = n / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * r + 0.0722 * o;
}
let w = class extends O {
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
      }, Pe);
    }, this._onTilePointerMove = (t) => {
      if (this._pointerId !== t.pointerId || !this._supportsBrightness) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < Zt && i < Zt) return;
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
      if (this._isUnavailable || t.button !== 0 || !this._supportsBrightness) return;
      const e = t.currentTarget;
      e.setPointerCapture(t.pointerId), this._popupDragging = !0;
      const i = this._computeVerticalPct(t.clientY, e);
      this._popupDragPct = i;
    }, this._onCapsulePointerMove = (t) => {
      if (!this._popupDragging) return;
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
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        {
          name: "card_style",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "default", label: "Google Home (Default 28px)" },
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
      computeLabel: (t) => ({
        entity: "Entità luce",
        name: "Nome personalizzato",
        icon: "Icona personalizzata (vuoto = standard Google Home)",
        card_style: "Design della pillola (Material 3)",
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
    return t ? Array.isArray(t.rgb_color) && t.rgb_color.length === 3 ? t.rgb_color : typeof t.color_temp_kelvin == "number" ? _t(t.color_temp_kelvin) : null : null;
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
    const t = this._config?.entity ?? "", e = [], i = /* @__PURE__ */ new Set(), s = Number(this._entity?.attributes.min_color_temp_kelvin ?? 2e3), r = Number(this._entity?.attributes.max_color_temp_kelvin ?? 6500), o = (a) => {
      if (!this._supportsRgb && !a.kelvin) return;
      const l = a.kelvin && !this._supportsRgb ? `k:${a.kelvin}` : a.hex.toLowerCase();
      i.has(l) || (i.add(l), e.push(a));
    };
    Array.isArray(this._config?.favorite_colors) && this._config.favorite_colors.forEach((a, l) => {
      const d = a.rgb_color ?? (a.color_temp_kelvin ? _t(a.color_temp_kelvin) : null);
      if (!d) return;
      const h = mt(d);
      o({
        id: `cfg-${l}-${h}`,
        label: a.label || (a.color_temp_kelvin ? `${a.color_temp_kelvin}K` : h),
        hex: h,
        rgb: d,
        kelvin: a.color_temp_kelvin
      });
    });
    const n = this.hass?.entities?.[t]?.options?.light?.favorite_colors;
    if (Array.isArray(n) && n.forEach((a, l) => {
      const d = a.rgb_color ?? (a.color_temp_kelvin ? _t(a.color_temp_kelvin) : null);
      if (!d) return;
      const h = mt(d);
      o({
        id: `ha-${l}-${h}`,
        label: a.color_temp_kelvin ? `${a.color_temp_kelvin}K` : h,
        hex: h,
        rgb: d,
        kelvin: a.color_temp_kelvin
      });
    }), t)
      for (const a of Kt(t))
        o(a);
    for (const a of Ce)
      if (a.kelvin) {
        if (a.kelvin >= s - 200 && a.kelvin <= r + 200) {
          const l = Math.max(s, Math.min(r, a.kelvin));
          o({ ...a, kelvin: l });
        }
      } else this._supportsRgb && o(a);
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
    const e = mt(t), s = Ee(t) > 0.42 ? "#3d2f00" : "#ffffff";
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
  _getAvailableScenes() {
    if (!this.hass || !this._config) return [];
    const t = [], e = /* @__PURE__ */ new Set(), i = (l) => {
      if (e.has(l)) return;
      const d = this.hass?.states[l];
      !d || !l.startsWith("scene.") || (e.add(l), t.push(d));
    };
    if (Array.isArray(this._config.scenes))
      for (const l of this._config.scenes)
        i(l);
    const s = this._config.entity, r = this.hass.entities?.[s], o = r?.device_id ?? null, n = r?.area_id ?? (o ? this.hass.devices?.[o]?.area_id ?? null : null), a = (this._entity?.attributes.friendly_name || "").trim().toLowerCase();
    for (const [l, d] of Object.entries(this.hass.states)) {
      if (!l.startsWith("scene.") || e.has(l)) continue;
      const h = this.hass.entities?.[l], c = h?.device_id ?? null, f = h?.area_id ?? (c ? this.hass.devices?.[c]?.area_id ?? null : null), m = String(d.attributes.group_name ?? "").trim().toLowerCase();
      (!!(o && c === o) || !!(a && m && m === a) || !!(n && f === n)) && i(l);
    }
    return t;
  }
  _cleanSceneName(t) {
    const e = (t.attributes.friendly_name || t.entity_id.replace("scene.", "")).trim(), i = this.hass?.entities?.[this._config?.entity ?? ""]?.device_id, s = i ? this.hass?.devices?.[i] : void 0, r = [
      String(t.attributes.group_name ?? ""),
      s?.name_by_user ?? "",
      s?.name ?? "",
      this._config?.name ?? "",
      this._entity?.attributes.friendly_name ?? ""
    ];
    for (const o of r) {
      const n = o.trim();
      if (n && e.length > n.length && e.toLowerCase().startsWith(n.toLowerCase())) {
        const a = e.slice(n.length).replace(/^[\s\-–—:]+/, "").trim();
        if (a) return a.charAt(0).toUpperCase() + a.slice(1);
      }
    }
    return e;
  }
  _activateScene(t) {
    this.hass && (this._activeSceneId = t.entity_id, this.hass.callService("scene", "turn_on", {
      entity_id: t.entity_id
    }), this._scenesSheetOpen = !1);
  }
  _toggleLight() {
    !this.hass || !this._config || this._isUnavailable || this.hass.callService("light", "toggle", {
      entity_id: this._config.entity
    });
  }
  _selectPreset(t) {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this._selectedPresetId = t.id, Ae(this._config.entity, t);
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
    if (e && (e.open || e.showModal(), i && t)) {
      const s = i.getBoundingClientRect(), r = t.left + t.width / 2 - (s.left + s.width / 2), o = t.top + t.height / 2 - (s.top + s.height / 2), n = Math.max(0.25, t.width / s.width), a = Math.max(0.15, t.height / s.height);
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
    const t = this._dialogEl, e = this._dialogSurfaceEl;
    if (!t || !t.open) {
      this._popupOpen = !1;
      return;
    }
    if (e) {
      const i = e.animate(
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
        t.close(), this._popupOpen = !1, this._scenesSheetOpen = !1;
      };
    } else
      t.close(), this._popupOpen = !1, this._scenesSheetOpen = !1;
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
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? p`<ha-icon .icon=${t}></ha-icon>` : e ? p`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        ` : p`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `;
  }
  _renderSunIcon() {
    return p`
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
    if (!this._config) return u;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._isOn, r = this._brightnessPct, o = this._isUnavailable ? "Unavailable" : s ? this._supportsBrightness ? `On • ${r}%` : "On" : "Off", n = this._computeColorVars(), a = this._matchedPresetId, l = this._popupOpen ? this._getAvailableScenes() : [], d = this._popupOpen ? At(t?.last_changed) : null, h = `style-${this._config.card_style ?? "default"}`;
    return p`
      <ha-card
        class="tile-card ${h} ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${n} --fill-pct: ${s ? r : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${e}
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
            <span class="title">${e}</span>
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
        ${this._popupOpen ? p`
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
                    ${d ? p`<span class="dialog-last-changed">${d}</span>` : u}
                  </div>
                  <button
                    type="button"
                    class="power-btn ${s ? "is-on" : ""}"
                    @click=${this._toggleLight}
                    aria-label="${s ? "Turn off" : "Turn on"} ${e}"
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
                      ${s ? p`
                            <div class="sun-layer sun-filled" aria-hidden="true">
                              ${this._renderSunIcon()}
                            </div>
                          ` : u}
                    </div>
                  </div>

                  <div class="readout">
                    <span class="readout-value">${s ? `${r}%` : "Off"}</span>
                    <span class="readout-label ${s ? "" : "hidden"}">Brightness</span>
                  </div>
                </div>

                ${this._presets.length > 0 || l.length > 0 ? p`
                      <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                        <button
                          type="button"
                          class="palette-btn ${this._scenesSheetOpen ? "is-open" : ""}"
                          title=${l.length > 0 ? "Scene" : "More info"}
                          @click=${() => {
      l.length > 0 ? this._scenesSheetOpen = !this._scenesSheetOpen : this._config && (this.closePopup(), this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: this._config.entity }
        })
      ));
    }}
                          aria-label=${l.length > 0 ? "Scenes" : "Color picker"}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                            />
                          </svg>
                        </button>

                        ${this._presets.map(
      (c) => p`
                            <button
                              type="button"
                              class="color-swatch ${s && a === c.id ? "selected" : ""}"
                              style="background: ${c.hex};"
                              role="radio"
                              aria-checked=${String(s && a === c.id)}
                              aria-label=${c.label}
                              title=${c.label}
                              @click=${() => this._selectPreset(c)}
                            ></button>
                          `
    )}
                      </div>
                    ` : u}
                ${this._scenesSheetOpen && l.length > 0 ? p`
                      <div
                        class="scenes-sheet-backdrop"
                        @click=${() => this._scenesSheetOpen = !1}
                      >
                        <div class="scenes-sheet" @click=${(c) => c.stopPropagation()}>
                          <div class="scenes-sheet-header">
                            <button
                              type="button"
                              class="icon-btn"
                              @click=${() => this._scenesSheetOpen = !1}
                              aria-label="Close scenes"
                            >
                              ⌄
                            </button>
                            <span>Scene</span>
                          </div>
                          <div class="scenes-sheet-list">
                            ${l.map((c) => {
      const f = this._activeSceneId === c.entity_id;
      return p`
                                <button
                                  type="button"
                                  class="scene-option ${f ? "selected" : ""}"
                                  @click=${() => this._activateScene(c)}
                                >
                                  <span class="scene-option-left">
                                    ${typeof customElements < "u" && customElements.get("ha-state-icon") ? p`<ha-state-icon
                                          class="scene-ha-icon"
                                          .hass=${this.hass}
                                          .stateObj=${c}
                                        ></ha-state-icon>` : p`<svg viewBox="0 0 24 24" class="scene-svg"><path fill="currentColor" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"/></svg>`}
                                    <span>${this._cleanSceneName(c)}</span>
                                  </span>
                                  ${f ? p`<span>✓</span>` : u}
                                </button>
                              `;
    })}
                          </div>
                        </div>
                      </div>
                    ` : u}
              </div>
            ` : u}
      </dialog>
    `;
  }
};
w.styles = [
  kt,
  et`
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
$([
  st({ attribute: !1 })
], w.prototype, "hass", 2);
$([
  g()
], w.prototype, "_config", 2);
$([
  g()
], w.prototype, "_dragging", 2);
$([
  g()
], w.prototype, "_pressed", 2);
$([
  g()
], w.prototype, "_dragPct", 2);
$([
  g()
], w.prototype, "_popupOpen", 2);
$([
  g()
], w.prototype, "_popupDragging", 2);
$([
  g()
], w.prototype, "_popupDragPct", 2);
$([
  g()
], w.prototype, "_selectedPresetId", 2);
$([
  g()
], w.prototype, "_scenesSheetOpen", 2);
$([
  g()
], w.prototype, "_activeSceneId", 2);
$([
  E("dialog.light-dialog")
], w.prototype, "_dialogEl", 2);
$([
  E(".tile-card")
], w.prototype, "_tileEl", 2);
$([
  E(".dialog-surface")
], w.prototype, "_dialogSurfaceEl", 2);
w = $([
  pt("m3e-light-card")
], w);
var Me = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, Et = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Te(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Me(e, i, r), r;
};
let tt = class extends O {
  constructor() {
    super(...arguments), this._computeLabel = (t) => ({
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
    })[t.name] ?? t.name, this._onValueChanged = (t) => {
      const e = { ...this._config, ...t.detail.value };
      this._config = e, this.dispatchEvent(
        new CustomEvent("config-changed", {
          bubbles: !0,
          composed: !0,
          detail: { config: e }
        })
      );
    };
  }
  setConfig(t) {
    this._config = { ...t };
  }
  _resolvedType() {
    const t = this._config?.popup_type ?? "auto";
    if (t !== "auto") return t;
    const e = this._config?.entity ?? "";
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
  _buildSchema() {
    const t = this._resolvedType(), e = this._config?.tap_action === "navigate" || this._config?.hold_action === "navigate", i = [
      { name: "entity", required: !0, selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      {
        name: "card_style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "default", label: "Google Home (Default 28px)" },
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
    e && i.push({ name: "navigation_path", selector: { text: {} } });
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
    }, n = {
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
      { name: "subtitle_entity", selector: { entity: {} } },
      r,
      o,
      n,
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
      { name: "status_entity", selector: { entity: {} } }
    ) : t === "sensor" ? i.push(
      r,
      o,
      n,
      { name: "active_state", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "label_active", selector: { text: {} } },
          { name: "label_inactive", selector: { text: {} } }
        ]
      },
      { name: "secondary_entity", selector: { entity: {} } }
    ) : t === "climate" ? i.push({
      name: "outdoor_entity",
      selector: { entity: { domain: "sensor" } }
    }) : t === "media" ? i.push({ name: "status_entity", selector: { entity: {} } }) : t === "remote" && i.push(
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
    return !this.hass || !this._config ? u : p`
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
tt.styles = et`
    :host {
      display: block;
    }
  `;
Et([
  st({ attribute: !1 })
], tt.prototype, "hass", 2);
Et([
  g()
], tt.prototype, "_config", 2);
tt = Et([
  pt("m3e-status-card-editor")
], tt);
function yt(t, e, i) {
  const s = (i || "").trim();
  if (!s) return;
  if (s.startsWith("#")) {
    const o = window.location.href;
    window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: o, newURL: window.location.href }));
    return;
  }
  if (s.startsWith("script.") && e) {
    e.callService("script", "turn_on", { entity_id: s });
    return;
  }
  const r = s.startsWith("service:") ? s.slice(8).trim() : s;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(r) && !r.startsWith("/") && e) {
    const [o, n] = r.split(".");
    e.callService(o, n, {});
    return;
  }
  window.history.pushState(null, "", s), t.dispatchEvent(
    new CustomEvent("location-changed", {
      bubbles: !0,
      composed: !0,
      detail: { replace: !1 }
    })
  ), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 }));
}
var Oe = Object.defineProperty, De = Object.getOwnPropertyDescriptor, x = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? De(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Oe(e, i, r), r;
};
const bt = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
function vt(t, e) {
  if (e === "raw") return t;
  const i = t.trim();
  if (!bt.test(i)) return t;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return t;
  const r = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (e === "time" || e === "auto")
    return r;
  if (e === "datetime") {
    const f = /* @__PURE__ */ new Date(), m = (k, S) => k.getFullYear() === S.getFullYear() && k.getMonth() === S.getMonth() && k.getDate() === S.getDate(), v = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1), C = new Date(f.getFullYear(), f.getMonth(), f.getDate() - 1);
    return m(s, f) ? `Oggi ${r}` : m(s, v) ? `Domani ${r}` : m(s, C) ? `Ieri ${r}` : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${r}`;
  }
  const o = s.getTime() - Date.now(), n = o >= 0, a = Math.round(Math.abs(o) / 6e4);
  if (a < 1) return "Ora";
  const l = Math.floor(a / 1440), d = Math.floor(a % 1440 / 60), h = a % 60;
  let c;
  return l > 0 ? c = d > 0 ? `${l}g ${d}h` : `${l}g` : d > 0 ? c = h > 0 ? `${d}h ${h}m` : `${d}h` : c = `${h}m`, n ? `Tra ${c}` : `${c} fa`;
}
const Ie = /* @__PURE__ */ new Set([
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
]), Le = /* @__PURE__ */ new Set([
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
]), ot = 135, H = 270;
function Re(t) {
  return t * Math.PI / 180;
}
function X(t, e, i, s) {
  const r = Re(s);
  return { x: t + i * Math.cos(r), y: e + i * Math.sin(r) };
}
function He(t, e, i, s, r) {
  const o = X(t, e, i, s), n = X(t, e, i, r);
  return `M ${o.x.toFixed(2)} ${o.y.toFixed(2)} A ${i} ${i} 0 1 1 ${n.x.toFixed(2)} ${n.y.toFixed(2)}`;
}
let b = class extends O {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._volDragging = !1, this._volPct = null, this._volPendingTimer = null, this._historyPoints = [], this._historyLoading = !1, this._historyEntityId = null, this._historyHoverIdx = null, this._prevStates = {}, this._longPressTimer = null, this._longPressTriggered = !1, this._relativeTimer = null, this._relativeTick = 0, this._onTilePointerDown = (t) => {
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
          yt(this, this.hass, this._config?.navigation_path);
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
    }, this._syncRelativeTimer();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncRelativeTimer();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearLongPress(), this._relativeTimer !== null && (window.clearInterval(this._relativeTimer), this._relativeTimer = null);
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
    return 2;
  }
  getGridOptions() {
    return { rows: "auto", columns: 6, min_columns: 3 };
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_pressed") || t.has("_popupOpen") || t.has("_dialDragging") || t.has("_dialTemp") || t.has("_activeSheet") || t.has("_volDragging") || t.has("_volPct") || t.has("_historyPoints") || t.has("_historyLoading") || t.has("_historyHoverIdx") || t.has("_relativeTick"))
      return !0;
    if (t.has("hass") && this._config && this.hass) {
      const e = [
        this._config.entity,
        this._config.status_entity,
        this._config.subtitle_entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...this._getSiblingEntityIds()
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
    const i = ["temperature", "humidity", "illuminance", "battery"], s = this._getSiblingEntityIds().map((r) => this.hass.states[r]).filter((r) => !!r && !e.has(r.entity_id));
    s.sort((r, o) => {
      const n = i.indexOf(String(r.attributes.device_class ?? "")), a = i.indexOf(String(o.attributes.device_class ?? ""));
      return (n === -1 ? 99 : n) - (a === -1 ? 99 : a);
    });
    for (const r of s) {
      const o = String(r.attributes.device_class ?? "");
      i.includes(o) && t.push(r);
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
    if (e.startsWith("climate.")) return "climate";
    if (e.startsWith("media_player.")) return "media";
    if (e.startsWith("remote.")) {
      const i = this._mediaEntity;
      return i && i.entity_id.startsWith("media_player.") ? "media" : "remote";
    }
    return "sensor";
  }
  get _isActive() {
    const t = this._statusEntity, e = String(t?.state ?? "").toLowerCase();
    return !e || e === "unavailable" || e === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(e) : t?.entity_id.startsWith("sensor.") && !Number.isNaN(Number(e)) ? !1 : Le.has(e);
  }
  get _stateLabel() {
    const t = this._statusEntity;
    if (!t) return "Unavailable";
    const e = t.state;
    if (e === "unavailable" || e === "unknown") return "Unavailable";
    const i = this._config?.subtitle_format ?? "auto", s = !!(this._config?.subtitle_entity?.trim() || this._config?.subtitle_attribute?.trim()), r = this._config?.subtitle_visibility ?? (this._config?.subtitle_only_when_active ? "on" : "both"), o = r === "both" || r === "on" && this._isActive || r === "off" && !this._isActive;
    if (s && o) {
      const a = this._config?.subtitle_entity?.trim() ? this.hass?.states[this._config.subtitle_entity.trim()] : t;
      if (a) {
        const l = this._config?.subtitle_attribute?.trim();
        let d;
        if (l)
          d = a.attributes[l];
        else {
          const h = a.state;
          if (h !== "unavailable" && h !== "unknown") {
            const c = a.attributes.unit_of_measurement;
            d = c ? `${h}${c}` : h;
          }
        }
        if (d != null && String(d).trim() !== "") {
          const h = vt(String(d), i), c = this._config?.subtitle_prefix ?? "", f = this._config?.subtitle_suffix ?? "";
          return `${c}${h}${f}`;
        }
      }
    }
    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;
    const n = t.entity_id.split(".")[0];
    if (n === "climate") {
      const a = e.charAt(0).toUpperCase() + e.slice(1), l = t.attributes.temperature;
      return e !== "off" && typeof l == "number" ? `${a} ${l}` : a;
    }
    if (n === "sensor") {
      if (bt.test(e.trim()))
        return vt(e, i);
      const a = t.attributes.unit_of_measurement, l = a ? `${e}${a}` : e;
      if (t.attributes.device_class === "temperature" || a === "°C" || a === "°F") {
        const h = this._getSiblingSensors().find(
          (c) => c.attributes.device_class === "humidity" || c.attributes.unit_of_measurement === "%"
        );
        if (h && h.state !== "unavailable" && h.state !== "unknown")
          return `${l} • ${h.state}${h.attributes.unit_of_measurement ?? "%"}`;
      }
      return l;
    }
    return n === "media_player" ? e.charAt(0).toUpperCase() + e.slice(1) : bt.test(e.trim()) ? vt(e, i) : e.charAt(0).toUpperCase() + e.slice(1);
  }
  _isNumericHistoryEntity(t) {
    if (!t || !t.entity_id.startsWith("sensor.")) return !1;
    const e = String(t.attributes.device_class ?? "");
    return Ie.has(e) ? !0 : !!t.attributes.unit_of_measurement && !Number.isNaN(Number(t.state));
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
      for (const n of s) {
        const a = Number(n.s ?? n.state);
        if (Number.isNaN(a)) continue;
        const l = typeof n.lu == "number" ? n.lu * 1e3 : n.last_updated ? Date.parse(n.last_updated) : NaN;
        Number.isNaN(l) || r.push({ t: l, v: a });
      }
      const o = 44;
      if (r.length > o) {
        const n = (r.length - 1) / (o - 1), a = [];
        for (let l = 0; l < o; l++)
          a.push(r[Math.round(l * n)]);
        this._historyPoints = a;
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
    const t = this._tileEl?.getBoundingClientRect();
    this._activeSheet = null, this._popupOpen = !0, (this._resolvedPopupType === "sensor" || this._resolvedPopupType === "custom") && this._fetchHistory(), await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    if (e && (e.open || e.showModal(), i && t)) {
      const s = i.getBoundingClientRect(), r = t.left + t.width / 2 - (s.left + s.width / 2), o = t.top + t.height / 2 - (s.top + s.height / 2), n = Math.max(0.28, t.width / s.width), a = Math.max(0.16, t.height / s.height);
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
    const t = this._dialogEl, e = this._dialogSurfaceEl;
    if (!t || !t.open) {
      this._popupOpen = !1, this._activeSheet = null;
      return;
    }
    if (e) {
      const i = e.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.92)", opacity: 0 }
        ],
        { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)" }
      );
      i.onfinish = () => {
        t.close(), this._popupOpen = !1, this._activeSheet = null;
      };
    } else
      t.close(), this._popupOpen = !1, this._activeSheet = null;
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        yt(this, this.hass, this._config.navigation_path);
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
    return ot + e * H;
  }
  _pointerToTemp(t, e) {
    const i = e.getBoundingClientRect(), s = i.left + i.width / 2, r = i.top + i.height / 2;
    let o = Math.atan2(t.clientY - r, t.clientX - s) * 180 / Math.PI;
    o < 0 && (o += 360);
    let n = (o - ot + 360) % 360;
    n > H && (n = n > H + (360 - H) / 2 ? 0 : H);
    const a = n / H, l = this._climateMin + a * (this._climateMax - this._climateMin);
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
  /**
   * Executes a remote button binding:
   * - If configured as an entity_id (button.*, script.*, switch.*, scene.*), triggers that entity.
   * - If configured as a command string (e.g. "VolumeUp"), sends remote.send_command.
   * - Otherwise falls back to the default media_player service or remote command.
   */
  _triggerRemoteButton(t, e, i = {}, s) {
    if (!this.hass || !this._config) return;
    const r = this._config.remote_buttons?.[t]?.trim();
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
        command: s ?? t
      };
      this._config.remote_device?.trim() && (o.device = this._config.remote_device.trim()), this.hass.callService("remote", "send_command", o);
      return;
    }
    this._callEntityService(e, i);
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
    const o = this._mediaEntity;
    i && this.hass && o && this.hass.callService("media_player", "volume_set", {
      entity_id: o.entity_id,
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
  _openMoreInfo(t) {
    this.closePopup(), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: t }
      })
    );
  }
  _callEntityService(t, e = {}) {
    if (!this.hass || !this._config) return;
    const i = this._config.entity.split(".")[0];
    this.hass.callService(i, t, {
      entity_id: this._config.entity,
      ...e
    });
  }
  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  _renderEntityIcon(t) {
    if (t && typeof customElements < "u" && customElements.get("ha-icon"))
      return p`<ha-icon .icon=${t}></ha-icon>`;
    const e = this._resolvedPopupType;
    return t?.includes("thermometer") || this._config?.entity.includes("temp") ? p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : e === "climate" ? p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : e === "remote" ? p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : e === "media" ? p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : p`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>`;
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _cleanSiblingLabel(t) {
    const e = String(t.attributes.device_class ?? ""), i = (t.attributes.friendly_name || "").trim();
    if (!i)
      return e ? e.replace(/_/g, " ").replace(/^./, (a) => a.toUpperCase()) : "Sensor";
    const s = (a, l) => {
      const d = l.trim();
      if (!d || a.length <= d.length) return null;
      if (a.toLowerCase().startsWith(d.toLowerCase())) {
        const h = a.slice(d.length).replace(/^[\s\-–—:]+/, "").trim();
        if (h) return h.charAt(0).toUpperCase() + h.slice(1);
      }
      return null;
    }, r = this.hass?.entities?.[t.entity_id]?.device_id, o = r ? this.hass?.devices?.[r] : void 0;
    for (const a of [
      o?.name_by_user,
      o?.name,
      this._config?.name,
      this._entity?.attributes.friendly_name
    ])
      if (a) {
        const l = s(i, a);
        if (l) return l;
      }
    const n = (this._entity?.attributes.friendly_name || "").trim();
    if (n) {
      const a = n.split(/\s+/), l = i.split(/\s+/);
      let d = 0;
      for (; d < a.length && d < l.length - 1 && a[d].toLowerCase() === l[d].toLowerCase(); )
        d++;
      if (d > 0) {
        const h = l.slice(d).join(" ").replace(/^[\s\-–—:]+/, "").trim();
        if (h) return h.charAt(0).toUpperCase() + h.slice(1);
      }
    }
    return i;
  }
  _renderSiblingIcon(t) {
    if (typeof customElements < "u" && customElements.get("ha-state-icon"))
      return p`<ha-state-icon class="mini-ha-icon" .hass=${this.hass} .stateObj=${t}></ha-state-icon>`;
    const e = String(t.attributes.device_class ?? "");
    return e === "humidity" ? p`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : e === "illuminance" ? p`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : e === "battery" ? p`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : p`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
  }
  _renderHistoryChart() {
    const t = this._historyEntityId ? this.hass?.states[this._historyEntityId] : this._resolveHistoryEntity();
    if (!t) return u;
    const e = String(t.attributes.unit_of_measurement ?? ""), i = this._historyEntityId === this._entity?.entity_id ? "Last 24 hours" : `${this._cleanSiblingLabel(t)} • 24h`;
    if (this._historyLoading)
      return p`
        <div class="history-card">
          <div class="history-header">
            <span class="history-title">${i}</span>
            <span class="history-range">Loading…</span>
          </div>
          <div class="history-skeleton"></div>
        </div>
      `;
    const s = this._historyPoints;
    if (s.length < 2) return u;
    const r = Math.min(...s.map((_) => _.v)), o = Math.max(...s.map((_) => _.v)), n = o - r || 1, a = s[0].t, l = s[s.length - 1].t, d = l - a || 1, h = 320, c = 104, f = 6, m = 12, v = s.map((_) => ({
      x: f + (_.t - a) / d * (h - f * 2),
      y: c - m - (_.v - r) / n * (c - m * 2),
      ..._
    }));
    let C = `M ${v[0].x.toFixed(1)} ${v[0].y.toFixed(1)}`;
    for (let _ = 1; _ < v.length; _++) {
      const B = v[_ - 1], P = v[_], M = ((B.x + P.x) / 2).toFixed(1);
      C += ` C ${M} ${B.y.toFixed(1)}, ${M} ${P.y.toFixed(1)}, ${P.x.toFixed(1)} ${P.y.toFixed(1)}`;
    }
    const I = `${C} L ${v[v.length - 1].x.toFixed(1)} ${c} L ${v[0].x.toFixed(1)} ${c} Z`, k = this._historyHoverIdx, S = k !== null ? v[k] : v[v.length - 1], L = (_) => new Date(_).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), F = (_) => {
      const P = _.currentTarget.getBoundingClientRect();
      if (P.width <= 0) return;
      const M = Math.max(0, Math.min(1, (_.clientX - P.left) / P.width));
      this._historyHoverIdx = Math.round(M * (v.length - 1));
    }, j = `m3e-hist-${this._historyEntityId?.replace(/[^a-z0-9]/gi, "_") ?? "g"}`;
    return p`
      <div class="history-card">
        <div class="history-header">
          <span class="history-title">${i}</span>
          <span class="history-range">
            ${k !== null ? `${S.v}${e} · ${L(S.t)}` : `${r}${e} – ${o}${e}`}
          </span>
        </div>

        <svg
          class="history-svg"
          viewBox="0 0 ${h} ${c}"
          preserveAspectRatio="none"
          @pointerdown=${F}
          @pointermove=${(_) => {
      (_.buttons > 0 || _.pointerType === "mouse") && F(_);
    }}
          @pointerleave=${() => this._historyHoverIdx = null}
        >
          ${gt`
            <defs>
              <linearGradient id=${j} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1=${f} y1=${m} x2=${h - f} y2=${m} class="history-grid-line" />
            <line x1=${f} y1=${c / 2} x2=${h - f} y2=${c / 2} class="history-grid-line" />
            <line x1=${f} y1=${c - m} x2=${h - f} y2=${c - m} class="history-grid-line" />
            <path d=${I} fill="url(#${j})" />
            <path d=${C} class="history-line" />
            ${k !== null ? gt`<line x1=${S.x} y1=${m} x2=${S.x} y2=${c - m} class="history-cursor-line" />` : u}
            <circle cx=${S.x} cy=${S.y} r="4.5" class="history-dot" />
          `}
        </svg>

        <div class="history-axis">
          <span>${L(a)}</span>
          <span>${L((a + l) / 2)}</span>
          <span>${L(l)}</span>
        </div>
      </div>
    `;
  }
  _renderSensorPopup(t) {
    const e = this._getSiblingSensors();
    return p`
      <div class="sensor-hero">
        <div class="sensor-ring ${this._isActive ? "is-active" : ""}">
          <span class="sensor-ring-icon">${this._renderEntityIcon(t)}</span>
          <span class="sensor-ring-state">${this._stateLabel}</span>
          <span class="sensor-ring-sub">
            ${this._entity?.attributes.device_class ? String(this._entity.attributes.device_class).replace(/^./, (i) => i.toUpperCase()) : "Status"}
          </span>
        </div>
      </div>

      ${e.length > 0 ? p`
            <div class="modular-stack">
              ${e.map((i) => {
      const s = this._cleanSiblingLabel(i), r = `${i.state}${i.attributes.unit_of_measurement ?? ""}`;
      return p`
                  <div class="info-pill">
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(i)}
                      <span>${s}</span>
                    </span>
                    <span class="info-pill-val">${r}</span>
                  </div>
                `;
    })}
            </div>
          ` : u}

      ${this._renderHistoryChart()}
    `;
  }
  _renderClimatePopup() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "off", s = this._climateTarget, r = this._climateCurrent, o = this._outdoorEntity, n = Math.floor(s), a = Math.abs(s - n - 0.5) < 0.05, l = this._tempToDeg(s), d = r !== null ? this._tempToDeg(r) : null, h = 140, c = 140, f = 114, m = He(h, c, f, ot, ot + H), v = X(h, c, f, l), C = d !== null ? X(h, c, f, d) : null, I = d !== null ? X(h, c, f - 22, d) : null, k = Array.isArray(t?.attributes.hvac_modes) ? t.attributes.hvac_modes : ["heat", "cool", "off"], S = Array.isArray(t?.attributes.preset_modes) ? t.attributes.preset_modes : [], L = Array.isArray(t?.attributes.fan_modes) ? t.attributes.fan_modes : [], F = Array.isArray(t?.attributes.swing_modes) ? t.attributes.swing_modes : [], j = String(t?.attributes.preset_mode ?? "none"), _ = String(t?.attributes.fan_mode ?? "auto"), B = String(t?.attributes.swing_mode ?? "off"), P = typeof t?.attributes.current_humidity == "number" ? `${t.attributes.current_humidity}%` : this._getSiblingSensors().find((y) => y.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((y) => y.attributes.device_class === "humidity").state}%` : null, M = S.length > 0, ht = L.length > 0, ut = F.length > 0, Tt = e === "heat" || e === "heating" ? "mode-heat" : e === "cool" || e === "cooling" ? "mode-cool" : "mode-off", W = (y) => y.replace(/_/g, " ").replace(/^./, (rt) => rt.toUpperCase()), G = this._activeSheet === "mode" ? { title: "Select a mode", options: k, current: e, onSelect: (y) => this._setClimateMode(y) } : this._activeSheet === "preset" ? { title: "Select preset", options: S, current: j, onSelect: (y) => this._setClimatePreset(y) } : this._activeSheet === "fan" ? { title: "Fan speed", options: L, current: _, onSelect: (y) => this._setClimateFan(y) } : this._activeSheet === "swing" ? { title: "Swing mode", options: F, current: B, onSelect: (y) => this._setClimateSwing(y) } : null;
    return p`
      <div class="climate-hero ${Tt} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${h} cy=${c} r="132" class="dial-bg-circle" />
            <path d=${m} class="dial-arc-track" />

            ${C && I ? gt`
                  <circle cx=${C.x} cy=${C.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${I.x}
                    y=${I.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(r)}
                  </text>
                ` : u}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${v.x.toFixed(2)}, ${v.y.toFixed(2)}) rotate(${l.toFixed(1)})">
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
            ${i && !this._dialDragging ? p`<span class="dial-readout-off">Off</span>` : p`
                  <span class="dial-readout-num">
                    ${n}${a ? p`<sup>5</sup>` : u}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(y) => y.stopPropagation()}>
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
        <div class="${M ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${M ? "compact-trait" : ""} ${Tt}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${e === "heat" ? p`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : e === "cool" ? p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : p`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${W(e)}</span>
            </span>
          </button>

          ${M ? p`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${W(j)}</span>
                  </span>
                  <span class="trait-chevron">⌄</span>
                </button>
              ` : u}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${ht || ut ? p`
              <div class="${ht && ut ? "climate-grid-2" : ""}">
                ${ht ? p`
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
                            <span class="mode-pill-val">${W(_)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    ` : u}

                ${ut ? p`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${W(B)}</span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    ` : u}
              </div>
            ` : u}

        ${r !== null || o || P ? p`
              <div class="telemetry-card">
                ${r !== null ? p`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${r}°</strong>
                      </div>
                    ` : u}
                ${P ? p`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${P}</strong>
                      </div>
                    ` : u}
                ${o ? p`
                      <div class="telemetry-row">
                        <span>Outdoor temperature</span>
                        <strong>${o.state}${o.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : u}
              </div>
            ` : u}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${G ? p`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(y) => y.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ⌄
                  </button>
                  <span>${G.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${G.options.map((y) => {
      const rt = y.toLowerCase() === G.current.toLowerCase(), Jt = this._activeSheet === "mode" ? y === "heat" ? "mode-heat" : y === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return p`
                      <button
                        type="button"
                        class="mode-option ${rt ? `selected ${Jt}` : ""}"
                        @click=${() => G.onSelect(y)}
                      >
                        <span>${W(y)}</span>
                        ${rt ? p`<span class="check-mark">✓</span>` : u}
                      </button>
                    `;
    })}
                </div>
              </div>
            </div>
          ` : u}
    `;
  }
  _renderRemotePopup() {
    const t = String(this._entity?.attributes.source ?? "Source");
    return p`
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
          <span>${t}</span>
          <span>⌄</span>
        </div>
      </div>
    `;
  }
  _renderMediaPopup() {
    const t = this._mediaEntity, e = t?.state === "playing", i = !t || t.state === "idle" || t.state === "off", s = String(t?.attributes.media_title ?? (i ? "Nothing playing" : "Paused")), r = String(t?.attributes.media_artist ?? ""), o = String(t?.attributes.app_name ?? ""), n = String(t?.attributes.entity_picture ?? ""), a = this._mediaVolumePct;
    return p`
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
            ${r ? p`<span class="media-artist">${r}</span>` : u}
          </div>
          ${i ? u : p`
                <button
                  type="button"
                  class="media-play-fab"
                  aria-label=${e ? "Pause" : "Play"}
                  @click=${() => this._callMediaService("media_play_pause")}
                >
                  ${e ? "⏸" : "▶"}
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
            ${i ? u : p`<span class="scrubber-dot" style="left: 28%"></span>`}
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

        <!-- Primary action pill (Stop when active, Turn on when off) -->
        ${i ? t?.state === "off" ? p`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService("turn_on")}
                >
                  Turn on
                </button>
              ` : u : p`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callMediaService("media_stop")}
              >
                Stop casting
              </button>
            `}

        <!-- Secondary action: opens native Home Assistant Media Browser / More Info -->
        ${t ? p`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMoreInfo(t.entity_id)}
              >
                <span>Media &amp; Controls</span>
                <span>↗</span>
              </button>
            ` : u}
      </div>
    `;
  }
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return u;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isActive, s = i ? this._config.icon_active?.trim() || void 0 : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || void 0, r = this._resolvedPopupType, o = this._config.tap_action === "navigate" || this._config.tap_action === "more-info" || this._config.tap_action !== "toggle" && this._config.tap_action !== "none" && r !== "none", n = `style-${this._config.card_style ?? "default"}`, a = this._popupOpen ? At(this._statusEntity?.last_changed) : null;
    return p`
      <ha-card
        class="status-tile ${n} ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""}"
        role="button"
        tabindex="0"
        aria-label="${e}, ${this._stateLabel}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @click=${this._onTileClick}
        @contextmenu=${(l) => {
      l.preventDefault(), this._handleHoldAction();
    }}
        @keydown=${(l) => {
      (l.key === "Enter" || l.key === " ") && (l.preventDefault(), this._onTileClick());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderEntityIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            <span class="tile-subtitle">${this._stateLabel}</span>
          </div>
          ${o ? p`
                <span class="tile-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                    />
                  </svg>
                </span>
              ` : u}
        </div>
      </ha-card>

      <dialog
        class="status-dialog"
        @click=${(l) => {
      l.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(l) => {
      l.preventDefault(), this.closePopup();
    }}
      >
        ${this._popupOpen ? p`
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
                    ${a ? p`<span class="dialog-last-changed">${a}</span>` : u}
                  </div>
                </header>

                ${r === "sensor" || r === "custom" ? this._renderSensorPopup(s) : r === "climate" ? this._renderClimatePopup() : r === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
              </div>
            ` : u}
      </dialog>
    `;
  }
};
b.styles = [
  kt,
  et`
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
        display: inline-grid;
        place-items: center;
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
    `
];
x([
  st({ attribute: !1 })
], b.prototype, "hass", 2);
x([
  g()
], b.prototype, "_config", 2);
x([
  g()
], b.prototype, "_pressed", 2);
x([
  g()
], b.prototype, "_popupOpen", 2);
x([
  g()
], b.prototype, "_dialDragging", 2);
x([
  g()
], b.prototype, "_dialTemp", 2);
x([
  g()
], b.prototype, "_activeSheet", 2);
x([
  g()
], b.prototype, "_volDragging", 2);
x([
  g()
], b.prototype, "_volPct", 2);
x([
  g()
], b.prototype, "_historyPoints", 2);
x([
  g()
], b.prototype, "_historyLoading", 2);
x([
  g()
], b.prototype, "_historyEntityId", 2);
x([
  g()
], b.prototype, "_historyHoverIdx", 2);
x([
  E("dialog.status-dialog")
], b.prototype, "_dialogEl", 2);
x([
  E(".status-tile")
], b.prototype, "_tileEl", 2);
x([
  E(".dialog-surface")
], b.prototype, "_dialogSurfaceEl", 2);
x([
  g()
], b.prototype, "_relativeTick", 2);
b = x([
  pt("m3e-status-card")
], b);
var ze = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, D = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ue(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && ze(e, i, r), r;
};
const Be = 420;
let A = class extends O {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._onTilePointerDown = (t) => {
      this._isUnavailable || t.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, Be));
    }, this._onTilePointerUp = () => {
      this._clearLongPress(), !this._longPressTriggered && this._pressed && this._toggle(), this._pressed = !1;
    }, this._onTilePointerCancel = () => {
      this._clearLongPress(), this._pressed = !1;
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
      computeLabel: (t) => ({
        entity: "Entità (switch, presa, input_boolean…)",
        name: "Nome personalizzato",
        card_style: "Design della pillola (Material 3)",
        icon_on: "Icona acceso (vuoto = standard Google Home)",
        icon_off: "Icona spento (vuoto = standard Google Home)",
        label_on: "Testo acceso (default: On)",
        label_off: "Testo spento (default: Off)",
        hold_action: "Azione pressione prolungata (Hold)",
        navigation_path: "Percorso / #popup Bubble Card / script o browser_mod"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-toggle-card: you must define an entity");
    this._config = {
      hold_action: "popup",
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
    if (t.has("_config") || t.has("_pressed") || t.has("_popupOpen"))
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
    return this._entity?.state === "on";
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
    const t = this._config.entity.split(".")[0];
    this.hass.callService(t, "toggle", { entity_id: this._config.entity });
  }
  _setState(t) {
    if (!this.hass || !this._config || this._isUnavailable || t === this._isOn) return;
    const e = this._config.entity.split(".")[0];
    this.hass.callService(e, t ? "turn_on" : "turn_off", {
      entity_id: this._config.entity
    });
  }
  async openPopup() {
    if (this._isUnavailable || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const t = this._tileEl?.getBoundingClientRect();
    this._popupOpen = !0, await this.updateComplete;
    const e = this._dialogEl, i = this._dialogSurfaceEl;
    if (e && (e.open || e.showModal(), i && t)) {
      const s = i.getBoundingClientRect(), r = t.left + t.width / 2 - (s.left + s.width / 2), o = t.top + t.height / 2 - (s.top + s.height / 2), n = Math.max(0.28, t.width / s.width), a = Math.max(0.16, t.height / s.height);
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
    const t = this._dialogEl, e = this._dialogSurfaceEl;
    if (!t || !t.open) {
      this._popupOpen = !1;
      return;
    }
    if (e) {
      const i = e.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.92)", opacity: 0 }
        ],
        { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)" }
      );
      i.onfinish = () => {
        t.close(), this._popupOpen = !1;
      };
    } else
      t.close(), this._popupOpen = !1;
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        yt(this, this.hass, this._config.navigation_path);
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
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? p`<ha-icon .icon=${t}></ha-icon>` : t?.includes("power-socket") || this._config?.entity.includes("caricatore") ? p`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"
          />
        </svg>
      ` : p`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 2v3h2V9h-2Z"
        />
      </svg>
    `;
  }
  render() {
    if (!this._config) return u;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isOn, s = i ? this._config.icon_on?.trim() || void 0 : this._config.icon_off?.trim() || this._config.icon_on?.trim() || void 0, r = this._isUnavailable ? "Unavailable" : i ? this._config.label_on || "On" : this._config.label_off || "Off", o = `style-${this._config.card_style ?? "default"}`, n = this._popupOpen ? At(t?.last_changed) : null;
    return p`
      <ha-card
        class="toggle-tile ${o} ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="switch"
        tabindex="0"
        aria-checked=${String(i)}
        aria-label="${e}, ${r}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${(a) => {
      a.preventDefault(), this._handleHoldAction();
    }}
        @keydown=${(a) => {
      a.key === " " || a.key === "Enter" ? (a.preventDefault(), this._toggle()) : (a.key === "o" || a.key === "O") && (a.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
            <span class="tile-subtitle">${r}</span>
          </div>
        </div>
      </ha-card>

      <dialog
        class="toggle-dialog"
        @click=${(a) => {
      a.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(a) => {
      a.preventDefault(), this.closePopup();
    }}
      >
        ${this._popupOpen ? p`
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
                    ${n ? p`<span class="dialog-last-changed">${n}</span>` : u}
                  </div>
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
                    @keydown=${(a) => {
      (a.key === " " || a.key === "Enter") && (a.preventDefault(), this._toggle());
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
            ` : u}
      </dialog>
    `;
  }
};
A.styles = [
  kt,
  et`
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
    `
];
D([
  st({ attribute: !1 })
], A.prototype, "hass", 2);
D([
  g()
], A.prototype, "_config", 2);
D([
  g()
], A.prototype, "_pressed", 2);
D([
  g()
], A.prototype, "_popupOpen", 2);
D([
  E("dialog.toggle-dialog")
], A.prototype, "_dialogEl", 2);
D([
  E(".toggle-tile")
], A.prototype, "_tileEl", 2);
D([
  E(".dialog-surface")
], A.prototype, "_dialogSurfaceEl", 2);
A = D([
  pt("m3e-toggle-card")
], A);
function Mt(t) {
  window.customCards = window.customCards || [], window.customCards.some((e) => e.type === t.type) || window.customCards.push(t);
}
Mt({
  type: "m3e-light-card",
  name: "M3 Expressive Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You Utilities integration.",
  preview: !0
});
Mt({
  type: "m3e-status-card",
  name: "M3 Expressive Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular expanded popups (Sensor, Climate, Remote, Media).",
  preview: !0
});
Mt({
  type: "m3e-toggle-card",
  name: "M3 Expressive Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0
});
export {
  w as M3ELightCard,
  b as M3EStatusCard,
  A as M3EToggleCard
};
