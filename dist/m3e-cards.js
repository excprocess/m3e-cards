/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = globalThis, se = zt.ShadowRoot && (zt.ShadyCSS === void 0 || zt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, re = Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Pe = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (se && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ue.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ue.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (t) => new Pe(typeof t == "string" ? t : t + "", void 0, re), M = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, a) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[a + 1], t[0]);
  return new Pe(i, t, re);
}, Re = (t, e) => {
  if (se) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = zt.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, fe = se ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Ze(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ue, defineProperty: Ne, getOwnPropertyDescriptor: Ve, getOwnPropertyNames: je, getOwnPropertySymbols: Ge, getPrototypeOf: Fe } = Object, Rt = globalThis, ge = Rt.trustedTypes, We = ge ? ge.emptyScript : "", qe = Rt.reactiveElementPolyfillSupport, _t = (t, e) => t, Dt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? We : null;
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
} }, ae = (t, e) => !Ue(t, e), me = { attribute: !0, type: String, converter: Dt, reflect: !1, useDefault: !1, hasChanged: ae };
Symbol.metadata ??= Symbol("metadata"), Rt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ot = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = me) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && Ne(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: a } = Ve(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(_t("elementProperties"))) return;
    const e = Fe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(_t("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_t("properties"))) {
      const i = this.properties, s = [...je(i), ...Ge(i)];
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
      for (const r of s) i.unshift(fe(r));
    } else e !== void 0 && i.push(fe(e));
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
    return Re(e, this.constructor.elementStyles), e;
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
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : Dt).toAttribute(i, s.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Dt;
      this._$Em = r;
      const n = o.fromAttribute(i, a.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (r === !1 && (a = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? ae)(a, i) || s.useDefault && s.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
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
ot.elementStyles = [], ot.shadowRootOptions = { mode: "open" }, ot[_t("elementProperties")] = /* @__PURE__ */ new Map(), ot[_t("finalized")] = /* @__PURE__ */ new Map(), qe?.({ ReactiveElement: ot }), (Rt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, ve = (t) => t, Ht = oe.trustedTypes, _e = Ht ? Ht.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ee = "$lit$", W = `lit$${Math.random().toFixed(9).slice(2)}$`, Ae = "?" + W, Ye = `<${Ae}>`, J = document, xt = () => J.createComment(""), wt = (t) => t === null || typeof t != "object" && typeof t != "function", ne = Array.isArray, Xe = (t) => ne(t) || typeof t?.[Symbol.iterator] == "function", Qt = `[ 	
\f\r]`, vt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, be = /-->/g, ye = />/g, Y = RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xe = /'/g, we = /"/g, Te = /^(?:script|style|textarea|title)$/i, Oe = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), l = Oe(1), Jt = Oe(2), nt = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), Q = J.createTreeWalker(J, 129);
function Ie(t, e) {
  if (!ne(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _e !== void 0 ? _e.createHTML(e) : e;
}
const Ke = (t, e) => {
  const i = t.length - 1, s = [];
  let r, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = vt;
  for (let n = 0; n < i; n++) {
    const c = t[n];
    let d, u, p = -1, g = 0;
    for (; g < c.length && (o.lastIndex = g, u = o.exec(c), u !== null); ) g = o.lastIndex, o === vt ? u[1] === "!--" ? o = be : u[1] !== void 0 ? o = ye : u[2] !== void 0 ? (Te.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = Y) : u[3] !== void 0 && (o = Y) : o === Y ? u[0] === ">" ? (o = r ?? vt, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, d = u[1], o = u[3] === void 0 ? Y : u[3] === '"' ? we : xe) : o === we || o === xe ? o = Y : o === be || o === ye ? o = vt : (o = Y, r = void 0);
    const v = o === Y && t[n + 1].startsWith("/>") ? " " : "";
    a += o === vt ? c + Ye : p >= 0 ? (s.push(d), c.slice(0, p) + Ee + c.slice(p) + W + v) : c + W + (p === -2 ? n : v);
  }
  return [Ie(t, a + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class $t {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const n = e.length - 1, c = this.parts, [d, u] = Ke(e, i);
    if (this.el = $t.createElement(d, s), Q.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = Q.nextNode()) !== null && c.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Ee)) {
          const g = u[o++], v = r.getAttribute(p).split(W), m = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: a, name: m[2], strings: v, ctor: m[1] === "." ? Je : m[1] === "?" ? ti : m[1] === "@" ? ei : Ut }), r.removeAttribute(p);
        } else p.startsWith(W) && (c.push({ type: 6, index: a }), r.removeAttribute(p));
        if (Te.test(r.tagName)) {
          const p = r.textContent.split(W), g = p.length - 1;
          if (g > 0) {
            r.textContent = Ht ? Ht.emptyScript : "";
            for (let v = 0; v < g; v++) r.append(p[v], xt()), Q.nextNode(), c.push({ type: 2, index: ++a });
            r.append(p[g], xt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ae) c.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(W, p + 1)) !== -1; ) c.push({ type: 7, index: a }), p += W.length - 1;
      }
      a++;
    }
  }
  static createElement(e, i) {
    const s = J.createElement("template");
    return s.innerHTML = e, s;
  }
}
function lt(t, e, i = t, s) {
  if (e === nt) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const a = wt(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = lt(t, r._$AS(t, e.values), r, s)), e;
}
class Qe {
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
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? J).importNode(i, !0);
    Q.currentNode = r;
    let a = Q.nextNode(), o = 0, n = 0, c = s[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new Mt(a, a.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (d = new ii(a, this, e)), this._$AV.push(d), c = s[++n];
      }
      o !== c?.index && (a = Q.nextNode(), o++);
    }
    return Q.currentNode = J, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class Mt {
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
    e = lt(this, e, i), wt(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== nt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && wt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(J.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = $t.createElement(Ie(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const a = new Qe(r, this), o = a.u(this.options);
      a.p(i), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let i = $e.get(e.strings);
    return i === void 0 && $e.set(e.strings, i = new $t(e)), i;
  }
  k(e) {
    ne(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const a of e) r === i.length ? i.push(s = new Mt(this.O(xt()), this.O(xt()), this, this.options)) : s = i[r], s._$AI(a), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = ve(e).nextSibling;
      ve(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Ut {
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
    if (a === void 0) e = lt(this, e, i, 0), o = !wt(e) || e !== this._$AH && e !== nt, o && (this._$AH = e);
    else {
      const n = e;
      let c, d;
      for (e = a[0], c = 0; c < a.length - 1; c++) d = lt(this, n[s + c], i, c), d === nt && (d = this._$AH[c]), o ||= !wt(d) || d !== this._$AH[c], d === h ? e = h : e !== h && (e += (d ?? "") + a[c + 1]), this._$AH[c] = d;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Je extends Ut {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class ti extends Ut {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class ei extends Ut {
  constructor(e, i, s, r, a) {
    super(e, i, s, r, a), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = lt(this, e, i, 0) ?? h) === nt) return;
    const s = this._$AH, r = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== h && (s === h || r);
    r && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ii {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    lt(this, e);
  }
}
const si = oe.litHtmlPolyfillSupport;
si?.($t, Mt), (oe.litHtmlVersions ??= []).push("3.3.3");
const ri = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const a = i?.renderBefore ?? null;
    s._$litPart$ = r = new Mt(e.insertBefore(xt(), a), a, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis;
let w = class extends ot {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ri(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return nt;
  }
};
w._$litElement$ = !0, w.finalized = !0, le.litElementHydrateSupport?.({ LitElement: w });
const ai = le.litElementPolyfillSupport;
ai?.({ LitElement: w });
(le.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oi = { attribute: !0, type: String, converter: Dt, reflect: !1, hasChanged: ae }, ni = (t = oi, e, i) => {
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
function S(t) {
  return (e, i) => typeof i == "object" ? ni(t, e, i) : ((s, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, s), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(t) {
  return S({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(t, e) {
  return (i, s, r) => {
    const a = (o) => o.renderRoot?.querySelector(t) ?? null;
    return li(i, s, { get() {
      return a(this);
    } });
  };
}
const L = M`
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
    border-radius: var(--m3e-card-border-radius, var(--ha-card-border-radius, 28px));
    color: var(--md-sys-color-on-surface, #1b1b1f);
    transition:
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
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
    animation: m3e-fade-in 200ms cubic-bezier(0.2, 0, 0, 1);
  }
`;
function Pt(t, e) {
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
var ci = Object.defineProperty, di = Object.getOwnPropertyDescriptor, it = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? di(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ci(e, i, r), r;
};
let V = class extends w {
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
        { name: "placeholder", selector: { text: {} } },
        {
          name: "entity",
          selector: { entity: { domain: ["input_select", "select"] } }
        },
        { name: "start_listening", selector: { boolean: {} } },
        { name: "pipeline_id", selector: { text: {} } }
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
    if (e && (e.open || e.showModal(), i)) {
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
    const t = this._dialogEl, e = this._dialogSurfaceEl;
    if (!t || !t.open) {
      this._selectorOpen = !1;
      return;
    }
    if (e) {
      const i = window.matchMedia("(max-width: 600px)").matches, s = e.animate(
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
        t.close(), this._selectorOpen = !1;
      };
    } else
      t.close(), this._selectorOpen = !1;
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
        @touchmove=${(r) => Pt(r, this._dialogEl)}
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
V.styles = [
  L,
  M`
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
it([
  S({ attribute: !1 })
], V.prototype, "hass", 2);
it([
  f()
], V.prototype, "_config", 2);
it([
  f()
], V.prototype, "_pressed", 2);
it([
  f()
], V.prototype, "_selectorOpen", 2);
it([
  P("dialog.mode-dialog")
], V.prototype, "_dialogEl", 2);
it([
  P(".dialog-surface")
], V.prototype, "_dialogSurfaceEl", 2);
V = it([
  A("m3e-assist-card")
], V);
function Bt(t, e, i) {
  const s = t?.entity_id ?? "", r = s.split(".")[0], a = String(t?.attributes.device_class ?? "").toLowerCase(), o = String(t?.state ?? "").toLowerCase();
  return a === "outlet" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3-9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>` : r === "light" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"/></svg>` : r === "switch" || r === "input_boolean" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4 14H9V7h6v10Zm-4-8v3h2V9h-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 5v3h2v-3h-2Z"/></svg>` : a === "door" || a === "opening" || a === "garage_door" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2Zm-6-6h-2v-2h2v2Zm4 6h-2V5h2v14Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 19V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14H3v2h18v-2h-2ZM7 19V5h10v14H7Zm8-8h-2v2h2v-2Z"/></svg>` : a === "window" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h14v-6H5Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v6h6V5H5Zm8 0v6h6V5h-6Zm-8 8v6h6v-6H5Zm8 0v6h6v-6h-6Z"/></svg>` : r === "lock" || a === "lock" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6a5 5 0 0 0-9.58-2l1.84.78A3 3 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-6 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Zm-6-3a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"/></svg>` : r === "fan" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 9.8C12 6.5 14.5 4 15.8 5.4c1 1.1-.5 3.4-2.1 4.8M14.2 12c3.3 0 5.8 2.5 4.4 3.8-1.1 1-3.4-.5-4.8-2.1M12 14.2c0 3.3-2.5 5.8-3.8 4.4-1-1.1.5-3.4 2.1-4.8M9.8 12c-3.3 0-5.8-2.5-4.4-3.8 1.1-1 3.4.5 4.8 2.1"/></svg>` : r === "climate" || i === "climate" ? o === "heat" || o === "heating" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" fill="none"/></svg>` : o === "cool" || o === "cooling" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>` : a === "tv" || r === "remote" || i === "remote" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>` : r === "media_player" || i === "media" ? e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>` : r === "weather" ? o === "sunny" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>` : o === "clear-night" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M20.2 14.4A8.2 8.2 0 0 1 9.6 3.8a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>` : o === "rainy" || o === "pouring" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM8.5 18.2l-.9 2.3M12.5 18.2l-.9 2.3M16.5 18.2l-.9 2.3"/></svg>` : o === "lightning" || o === "lightning-rainy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h2.4M15.4 15.5h1.8a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3ZM13 12.5l-2 4.2h2.6l-1.6 3.8"/></svg>` : o === "snowy" || o === "snowy-rainy" || o === "hail" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 15.5h10.4a3.6 3.6 0 0 0 .5-7.16A5.4 5.4 0 0 0 7.2 7.2a4.1 4.1 0 0 0-.4 8.3Z"/><circle cx="8.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="12.5" cy="19.2" r="1.1" fill="currentColor"/><circle cx="16.5" cy="19.2" r="1.1" fill="currentColor"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M6.8 18h10.4a3.8 3.8 0 0 0 .6-7.55A5.6 5.6 0 0 0 7.1 9.1 4.4 4.4 0 0 0 6.8 18Z"/></svg>` : a === "aqi" || a === "pm25" || a === "pm10" || a === "carbon_dioxide" || a === "volatile_organic_compounds" || s.includes("aqi") || s.includes("air_quality") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 12.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8M4 16.2c2.2-1.8 4.4-1.8 6.6 0s4.4 1.8 6.6 0 2.2-1.3 2.8-.8"/></svg>` : a === "temperature" || s.includes("temp") ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>` : a === "humidity" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>` : a === "power" || a === "energy" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.19-.35L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21Z"/></svg>` : a === "illuminance" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>` : a === "battery" ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>` : e ? l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.8" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>` : l`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5.8 7.8a6.8 6.8 0 0 0 0 8.4M18.2 7.8a6.8 6.8 0 0 1 0 8.4"/></svg>`;
}
function kt(t, e, i) {
  const s = (i || "").trim();
  if (!s) return;
  if (s.startsWith("#")) {
    const a = window.location.href;
    window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: !0, composed: !0 })), window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: a, newURL: window.location.href }));
    return;
  }
  if (s.startsWith("script.") && e) {
    e.callService("script", "turn_on", { entity_id: s });
    return;
  }
  const r = s.startsWith("service:") ? s.slice(8).trim() : s;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(r) && !r.startsWith("/") && e) {
    const [a, o] = r.split(".");
    e.callService(a, o, {});
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
var pi = Object.defineProperty, hi = Object.getOwnPropertyDescriptor, Nt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? hi(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && pi(e, i, r), r;
};
let ct = class extends w {
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
                  { value: "navigate", label: "Percorso / Bubble / Script" },
                  { value: "none", label: "Nessuna azione" }
                ]
              }
            }
          }
        ]
      }
    ), t.tap_action === "navigate" && e.push({ name: "navigation_path", selector: { text: {} } }), e;
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
ct.styles = M`
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
Nt([
  S({ attribute: !1 })
], ct.prototype, "hass", 2);
Nt([
  f()
], ct.prototype, "_config", 2);
Nt([
  f()
], ct.prototype, "_expandedIndex", 2);
ct = Nt([
  A("m3e-glance-card-editor")
], ct);
var ui = Object.defineProperty, fi = Object.getOwnPropertyDescriptor, Vt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? fi(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ui(e, i, r), r;
};
const gi = /* @__PURE__ */ new Set([
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
let dt = class extends w {
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
    if (/^-?\d+\.\d{2,}$/.test(e)) {
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
        kt(this, this.hass, t.navigation_path);
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
      const r = s.entity ? this.hass?.states[s.entity] : void 0, a = !r || r.state === "unavailable" || r.state === "unknown", o = !a && gi.has(String(r.state ?? "").toLowerCase()), n = this._getPrimaryValue(s, r), c = this._getSecondaryLabel(s, r), d = (s.tap_action ?? "more-info") !== "none" && !!s.entity;
      return l`
                <button
                  type="button"
                  class="glance-item ${a ? "is-dimmed" : ""} ${d ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(s)}
                >
                  <span class="icon-circle" aria-hidden="true">
                    ${s.icon ? l`<ha-icon .icon=${s.icon}></ha-icon>` : Bt(r, o)}
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
dt.styles = [
  L,
  M`
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
Vt([
  S({ attribute: !1 })
], dt.prototype, "hass", 2);
Vt([
  f()
], dt.prototype, "_config", 2);
Vt([
  P(".glance-strip")
], dt.prototype, "_stripEl", 2);
dt = Vt([
  A("m3e-glance-card")
], dt);
function ce(t) {
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
const ke = "cubic-bezier(0.05, 0.7, 0.1, 1.0)", mi = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";
function jt(t, e) {
  if (!t) return;
  const i = window.matchMedia("(max-width: 600px)").matches;
  if (e && !i) {
    const s = t.getBoundingClientRect();
    if (s.width > 0 && s.height > 0) {
      const r = e.left + e.width / 2 - (s.left + s.width / 2), a = e.top + e.height / 2 - (s.top + s.height / 2), o = Math.max(0.35, Math.min(1, e.width / s.width)), n = Math.max(0.22, Math.min(1, e.height / s.height));
      t.animate(
        [
          {
            transform: `translate(${r}px, ${a}px) scale(${o}, ${n})`,
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
          easing: ke
        }
      );
      return;
    }
  }
  t.animate(
    i ? [
      { transform: "translateY(48px)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1 }
    ] : [
      { transform: "scale(0.92)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 }
    ],
    {
      duration: i ? 280 : 250,
      easing: ke
    }
  );
}
function Gt(t, e, i) {
  if (!t || !t.open) {
    i();
    return;
  }
  if (!e) {
    t.close(), i();
    return;
  }
  const s = window.matchMedia("(max-width: 600px)").matches, r = e.animate(
    s ? [
      { transform: "translateY(0px)", opacity: 1 },
      { transform: "translateY(36px)", opacity: 0 }
    ] : [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(0.93)", opacity: 0 }
    ],
    {
      duration: 170,
      easing: mi
    }
  );
  let a = !1;
  const o = () => {
    a || (a = !0, t.open && t.close(), i());
  };
  r.onfinish = o, r.oncancel = o;
}
var vi = Object.defineProperty, _i = Object.getOwnPropertyDescriptor, I = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? _i(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && vi(e, i, r), r;
};
const Se = 8, bi = 420, yi = [
  { id: "warm-gold", label: "Candle", hex: "#FFE066", rgb: [255, 224, 102], kelvin: 2200 },
  { id: "warm-amber", label: "Warm", hex: "#FFE68A", rgb: [255, 230, 138], kelvin: 2700 },
  { id: "soft-white", label: "Soft White", hex: "#FFF0B8", rgb: [255, 240, 184], kelvin: 3200 },
  { id: "neutral", label: "Neutral", hex: "#FFF7E0", rgb: [255, 247, 224], kelvin: 4e3 },
  { id: "daylight", label: "Daylight", hex: "#FFFFFF", rgb: [255, 255, 255], kelvin: 5e3 },
  { id: "cool", label: "Cool", hex: "#E3F2FD", rgb: [227, 242, 253], kelvin: 6500 },
  { id: "coral", label: "Coral", hex: "#FFAB91", rgb: [255, 171, 145] },
  { id: "lavender", label: "Lavender", hex: "#CE93D8", rgb: [206, 147, 216] }
], ze = "m3e-light-recent-colors:", xi = 6;
function Le(t) {
  try {
    const e = window.localStorage.getItem(`${ze}${t}`);
    if (!e) return [];
    const i = JSON.parse(e);
    return Array.isArray(i) ? i.filter(
      (s) => s && typeof s.id == "string" && typeof s.hex == "string" && Array.isArray(s.rgb)
    ) : [];
  } catch {
    return [];
  }
}
function wi(t, e) {
  try {
    const i = Le(t).filter((r) => r.hex !== e.hex), s = [e, ...i].slice(0, xi);
    window.localStorage.setItem(`${ze}${t}`, JSON.stringify(s));
  } catch {
  }
}
function te([t, e, i]) {
  return "#" + [t, e, i].map((s) => Math.max(0, Math.min(255, Math.round(s))).toString(16).padStart(2, "0")).join("");
}
function ee(t) {
  const e = Math.max(2e3, Math.min(6500, t));
  return e <= 2400 ? [255, 224, 102] : e <= 2900 ? [255, 230, 138] : e <= 3600 ? [255, 240, 184] : e <= 4500 ? [255, 247, 224] : e <= 5600 ? [255, 255, 255] : [227, 242, 253];
}
function $i([t, e, i]) {
  const [s, r, a] = [t, e, i].map((o) => {
    const n = o / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s + 0.7152 * r + 0.0722 * a;
}
let E = class extends w {
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
      }, bi);
    }, this._onTilePointerMove = (t) => {
      if (this._pointerId !== t.pointerId || !this._supportsBrightness) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < Se && i < Se) return;
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
    return t ? Array.isArray(t.rgb_color) && t.rgb_color.length === 3 ? t.rgb_color : typeof t.color_temp_kelvin == "number" ? ee(t.color_temp_kelvin) : null : null;
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
      const d = n.rgb_color ?? (n.color_temp_kelvin ? ee(n.color_temp_kelvin) : null);
      if (!d) return;
      const u = te(d);
      a({
        id: `cfg-${c}-${u}`,
        label: n.label || (n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : u),
        hex: u,
        rgb: d,
        kelvin: n.color_temp_kelvin
      });
    });
    const o = this.hass?.entities?.[t]?.options?.light?.favorite_colors;
    if (Array.isArray(o) && o.forEach((n, c) => {
      const d = n.rgb_color ?? (n.color_temp_kelvin ? ee(n.color_temp_kelvin) : null);
      if (!d) return;
      const u = te(d);
      a({
        id: `ha-${c}-${u}`,
        label: n.color_temp_kelvin ? `${n.color_temp_kelvin}K` : u,
        hex: u,
        rgb: d,
        kelvin: n.color_temp_kelvin
      });
    }), t)
      for (const n of Le(t))
        a(n);
    for (const n of yi)
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
    const e = te(t), s = $i(t) > 0.42 ? "#3d2f00" : "#ffffff";
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
          label: n.replace(/_/g, " ").replace(/^./, (d) => d.toUpperCase()),
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
      this._config?.name ?? "",
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
    this._selectedPresetId = t.id, wi(this._config.entity, t);
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
    e && (e.open || e.showModal(), jt(i, t));
  }
  closePopup() {
    Gt(this._dialogEl, this._dialogSurfaceEl, () => {
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
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${t}></ha-icon>` : e ? l`
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
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._isOn, r = this._brightnessPct, a = this._isUnavailable ? "Offline" : this._dragging && this._supportsBrightness ? `${r}%` : s ? this._supportsBrightness ? `On • ${r}%` : "On" : "Off", o = this._computeColorVars(), n = this._matchedPresetId, c = this._popupOpen ? this._getAvailableScenes() : [], d = this._popupOpen ? ce(t?.last_changed) : null, u = `style-${this._config.card_style ?? "default"}`;
    return l`
      <ha-card
        class="tile-card ${u} ${s ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        style="${o} --fill-pct: ${s ? r : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${e}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${r}
        aria-valuetext=${a}
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
            <span class="subtitle">${a}</span>
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
        style="${o}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
        @touchmove=${(p) => Pt(p, this._dialogEl)}
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
                    ${d ? l`<span class="dialog-last-changed">${d}</span>` : h}
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
      const g = String(this._entity?.attributes.effect ?? ""), v = p.kind === "effect" ? g.toLowerCase() === p.effect.toLowerCase() : this._activeSceneId === p.id;
      return l`
                                <button
                                  type="button"
                                  class="scene-option ${v ? "selected" : ""}"
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
                                  ${v ? l`<span>✓</span>` : h}
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
E.styles = [
  L,
  M`
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
I([
  S({ attribute: !1 })
], E.prototype, "hass", 2);
I([
  f()
], E.prototype, "_config", 2);
I([
  f()
], E.prototype, "_dragging", 2);
I([
  f()
], E.prototype, "_pressed", 2);
I([
  f()
], E.prototype, "_dragPct", 2);
I([
  f()
], E.prototype, "_popupOpen", 2);
I([
  f()
], E.prototype, "_popupDragging", 2);
I([
  f()
], E.prototype, "_popupDragPct", 2);
I([
  f()
], E.prototype, "_selectedPresetId", 2);
I([
  f()
], E.prototype, "_scenesSheetOpen", 2);
I([
  f()
], E.prototype, "_activeSceneId", 2);
I([
  P("dialog.light-dialog")
], E.prototype, "_dialogEl", 2);
I([
  P(".tile-card")
], E.prototype, "_tileEl", 2);
I([
  P(".dialog-surface")
], E.prototype, "_dialogSurfaceEl", 2);
E = I([
  A("m3e-light-card")
], E);
var ki = Object.defineProperty, Si = Object.getOwnPropertyDescriptor, Ft = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Si(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ki(e, i, r), r;
};
let pt = class extends w {
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
pt.styles = [
  L,
  M`
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
Ft([
  S({ attribute: !1 })
], pt.prototype, "hass", 2);
Ft([
  f()
], pt.prototype, "_config", 2);
Ft([
  f()
], pt.prototype, "_optimisticOn", 2);
pt = Ft([
  A("m3e-light-control-card")
], pt);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ci = (t) => t.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mi = { CHILD: 2 }, Pi = (t) => (...e) => ({ _$litDirective$: t, values: e });
class Ei {
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
const bt = (t, e) => {
  const i = t._$AN;
  if (i === void 0) return !1;
  for (const s of i) s._$AO?.(e, !1), bt(s, e);
  return !0;
}, Zt = (t) => {
  let e, i;
  do {
    if ((e = t._$AM) === void 0) break;
    i = e._$AN, i.delete(t), t = e;
  } while (i?.size === 0);
}, De = (t) => {
  for (let e; e = t._$AM; t = e) {
    let i = e._$AN;
    if (i === void 0) e._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(t)) break;
    i.add(t), Oi(e);
  }
};
function Ai(t) {
  this._$AN !== void 0 ? (Zt(this), this._$AM = t, De(this)) : this._$AM = t;
}
function Ti(t, e = !1, i = 0) {
  const s = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (e) if (Array.isArray(s)) for (let a = i; a < s.length; a++) bt(s[a], !1), Zt(s[a]);
  else s != null && (bt(s, !1), Zt(s));
  else bt(this, t);
}
const Oi = (t) => {
  t.type == Mi.CHILD && (t._$AP ??= Ti, t._$AQ ??= Ai);
};
class Ii extends Ei {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, i, s) {
    super._$AT(e, i, s), De(this), this.isConnected = e._$AU;
  }
  _$AO(e, i = !0) {
    e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), i && (bt(this, e), Zt(this));
  }
  setValue(e) {
    if (Ci(this._$Ct)) this._$Ct._$AI(e, this);
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
const ie = /* @__PURE__ */ new WeakMap(), He = Pi(class extends Ii {
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
      let i = ie.get(e);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), ie.set(e, i)), i.get(this.G) !== void 0 && this.G.call(this.ht, void 0), i.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    return typeof this.G == "function" ? ie.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var zi = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, st = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Li(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && zi(e, i, r), r;
};
const Ce = 8;
let j = class extends w {
  constructor() {
    super(...arguments), this._expanded = !1, this._dragging = !1, this._pressed = !1, this._dragPct = null, this._pointerId = null, this._pointerStartX = 0, this._pointerStartY = 0, this._hasMoved = !1, this._prevStates = {}, this._onHeaderPointerDown = (t) => {
      if (t.button !== 0 || this._aggregateStats.isUnavailable) return;
      const e = t.currentTarget;
      this._pointerId = t.pointerId, this._pointerStartX = t.clientX, this._pointerStartY = t.clientY, this._hasMoved = !1, this._pressed = !0, e.setPointerCapture(t.pointerId);
    }, this._onHeaderPointerMove = (t) => {
      if (this._pointerId !== t.pointerId) return;
      const e = Math.abs(t.clientX - this._pointerStartX), i = Math.abs(t.clientY - this._pointerStartY);
      if (!this._hasMoved) {
        if (e < Ce && i < Ce) return;
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
      t.stopPropagation(), this._expanded = !this._expanded;
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
      computeLabel: (t) => ({
        entity: "Gruppo luci (entità light con luci figlie)",
        name: "Nome personalizzato",
        icon: "Icona personalizzata (vuoto = lampade Google Home)",
        expanded: "Espanso di default",
        use_light_color: "Usa colore reale delle luci",
        card_style: "Design della pillola (Material 3)"
      })[t.name] ?? t.name
    };
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-light-group-card: you must define a light group entity");
    this._config = {
      expanded: !1,
      use_light_color: !0,
      card_style: "default",
      ...t
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
    const t = this._groupEntity?.attributes.entity_id;
    return Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.startsWith("light.")) : [];
  }
  shouldUpdate(t) {
    if (t.has("_config") || t.has("_expanded") || t.has("_dragging") || t.has("_pressed") || t.has("_dragPct"))
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
        (d) => typeof d.attributes.brightness == "number" ? Math.max(1, Math.round(d.attributes.brightness / 255 * 100)) : 100
      );
      a = Math.round(c.reduce((d, u) => d + u, 0) / c.length);
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
  _renderGroupIcon(t) {
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${t}></ha-icon>` : l`
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
    const t = this._groupEntity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._childEntityIds, { onCount: r, totalCount: a, avgPct: o, isOn: n, isUnavailable: c } = this._aggregateStats, d = c ? "Offline" : this._dragging ? `${o}%` : n ? a > 1 ? `${r} on • ${o}%` : `On • ${o}%` : "Off", u = `style-${this._config.card_style ?? "default"}`, p = this._computeAccentCss();
    return l`
      <div class="group-wrapper">
        <ha-card
          class="group-header ${u} ${n ? "is-on" : "is-off"} ${this._dragging ? "is-dragging" : ""} ${this._pressed ? "is-pressed" : ""} ${c ? "is-unavailable" : ""}"
          style="${p} --fill-pct: ${n ? o : 0}%;"
          role="slider"
          tabindex="0"
          aria-label=${e}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${o}
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
              <span class="title">${e}</span>
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
                          ${He(this._attachChildConfig(g))}
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
j.styles = [
  L,
  M`
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
st([
  S({ attribute: !1 })
], j.prototype, "hass", 2);
st([
  f()
], j.prototype, "_config", 2);
st([
  f()
], j.prototype, "_expanded", 2);
st([
  f()
], j.prototype, "_dragging", 2);
st([
  f()
], j.prototype, "_pressed", 2);
st([
  f()
], j.prototype, "_dragPct", 2);
j = st([
  A("m3e-light-group-card")
], j);
var Di = Object.defineProperty, Hi = Object.getOwnPropertyDescriptor, Z = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Hi(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Di(e, i, r), r;
};
const Bi = 2048;
let z = class extends w {
  constructor() {
    super(...arguments), this._marqueeActive = !1, this._marqueeDuration = 12, this._castOpen = !1, this._prevStates = {};
  }
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-media-bar-card: devi specificare un’entità media_player.*");
    this._config = {
      ...t,
      show_cast: t.show_cast !== !1,
      hide_when_inactive: !!t.hide_when_inactive,
      tap_action: t.tap_action ?? "more-info"
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
      tap_action: "more-info"
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
          name: "entities",
          selector: { entity: { domain: "media_player", multiple: !0 } }
        },
        {
          name: "name",
          selector: { text: {} }
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "show_cast", selector: { boolean: {} } },
            { name: "hide_when_inactive", selector: { boolean: {} } }
          ]
        },
        {
          name: "tap_action",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "more-info", label: "Apri dettagli media (More-info)" },
                { value: "none", label: "Nessuna azione" }
              ]
            }
          }
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
    if (t.has("_config") || t.has("_selectedEntityId") || t.has("_marqueeActive") || t.has("_marqueeDuration") || t.has("_castOpen"))
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
    !t || this._config?.tap_action === "none" || this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t.entity_id },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _openCastDialog(t) {
    if (t.stopPropagation(), this._castOpen) return;
    this._castOpen = !0, await this.updateComplete;
    const e = this._dialogEl;
    e && (e.open || e.showModal(), jt(this._dialogSurfaceEl));
  }
  _closeCastDialog() {
    Gt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._castOpen = !1;
    });
  }
  _selectSource(t) {
    const e = this._activeEntity;
    !this.hass || !e || (this.hass.callService("media_player", "select_source", {
      entity_id: e.entity_id,
      source: t
    }), window.setTimeout(() => this._closeCastDialog(), 140));
  }
  _selectPlayer(t) {
    this._selectedEntityId = t, window.setTimeout(() => this._closeCastDialog(), 140);
  }
  render() {
    if (!this._config) return h;
    const t = this._activeEntity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", r = i || e === "off" || e === "idle" || e === "standby";
    if (this._config.hide_when_inactive && r)
      return h;
    const a = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, o = this._getMetadataText(t), n = r ? "" : String(t?.attributes.entity_picture ?? "").trim(), c = Array.isArray(t?.attributes.source_list) ? t.attributes.source_list : [], d = String(t?.attributes.source ?? ""), p = (Number(t?.attributes.supported_features ?? 0) & Bi) !== 0 || c.length > 0, g = this._allEntityIds.length > 1, v = this._config.show_cast !== !1 && !i && (p || g);
    return l`
      <ha-card
        class="media-bar ${s ? "is-playing" : ""} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${a}, ${o}"
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

          <!-- Right Slot: Cast / Output + Squircle Play/Pause -->
          <div class="actions-col">
            ${v ? l`
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
              ?disabled=${i}
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
          </div>
        </div>
      </ha-card>

      <!-- Cast / Output / Source M3 Expressive Selector Dialog -->
      <dialog
        class="cast-dialog"
        @click=${(m) => {
      m.target === this._dialogEl && this._closeCastDialog();
    }}
        @cancel=${(m) => {
      m.preventDefault(), this._closeCastDialog();
    }}
        @touchmove=${(m) => Pt(m, this._dialogEl)}
      >
        ${this._castOpen ? l`
              <div class="dialog-surface">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._closeCastDialog()}
                    aria-label="Chiudi"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <span class="dialog-title">
                    ${g && c.length === 0 ? "Dispositivi audio" : `Output · ${a}`}
                  </span>
                </header>

                ${g ? l`
                      <div class="picker-section-label">Dispositivi</div>
                      <div class="picker-list" role="radiogroup" aria-label="Dispositivi">
                        ${this._allEntityIds.map((m) => {
      const k = this.hass?.states[m], T = m === t?.entity_id, _ = k?.attributes.friendly_name || m, b = this._getMetadataText(k);
      return l`
                            <button
                              type="button"
                              class="picker-row ${T ? "is-selected" : ""}"
                              role="radio"
                              aria-checked=${String(T)}
                              @click=${() => this._selectPlayer(m)}
                            >
                              <span class="picker-row-text">
                                <span class="picker-row-title">${_}</span>
                                <span class="picker-row-sub">${b}</span>
                              </span>
                              <span class="m3-radio ${T ? "checked" : ""}" aria-hidden="true">
                                <span class="m3-radio-dot"></span>
                              </span>
                            </button>
                          `;
    })}
                      </div>
                    ` : h}

                ${c.length > 0 ? l`
                      ${g ? l`<div class="picker-section-label">Sorgenti</div>` : h}
                      <div class="picker-list" role="radiogroup" aria-label="Sorgenti">
                        ${c.map((m) => {
      const k = m === d;
      return l`
                            <button
                              type="button"
                              class="picker-row ${k ? "is-selected" : ""}"
                              role="radio"
                              aria-checked=${String(k)}
                              @click=${() => this._selectSource(m)}
                            >
                              <span class="picker-row-title">${m}</span>
                              <span class="m3-radio ${k ? "checked" : ""}" aria-hidden="true">
                                <span class="m3-radio-dot"></span>
                              </span>
                            </button>
                          `;
    })}
                      </div>
                    ` : h}
              </div>
            ` : h}
      </dialog>
    `;
  }
};
z.styles = [
  L,
  M`
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
        background: var(--md-sys-color-surface-container-lowest, #ffffff);
        color: var(--md-sys-color-on-surface, #1b1b1f);
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
Z([
  S({ attribute: !1 })
], z.prototype, "hass", 2);
Z([
  f()
], z.prototype, "_config", 2);
Z([
  f()
], z.prototype, "_selectedEntityId", 2);
Z([
  f()
], z.prototype, "_marqueeActive", 2);
Z([
  f()
], z.prototype, "_marqueeDuration", 2);
Z([
  f()
], z.prototype, "_castOpen", 2);
Z([
  P(".marquee-viewport")
], z.prototype, "_marqueeViewport", 2);
Z([
  P(".marquee-measure")
], z.prototype, "_marqueeMeasure", 2);
Z([
  P("dialog.cast-dialog")
], z.prototype, "_dialogEl", 2);
Z([
  P(".dialog-surface")
], z.prototype, "_dialogSurfaceEl", 2);
z = Z([
  A("m3e-media-bar-card")
], z);
const X = /* @__PURE__ */ new Map();
function Zi(t, e, i) {
  t /= 255, e /= 255, i /= 255;
  const s = Math.max(t, e, i), r = Math.min(t, e, i), a = (s + r) / 2;
  if (s === r) return [0, 0, a];
  const o = s - r, n = a > 0.5 ? o / (2 - s - r) : o / (s + r);
  let c = 0;
  return s === t ? c = ((e - i) / o + (e < i ? 6 : 0)) / 6 : s === e ? c = ((i - t) / o + 2) / 6 : c = ((t - e) / o + 4) / 6, [c * 360, n * 100, a * 100];
}
async function Ri(t) {
  return t ? X.has(t) ? X.get(t) ?? null : new Promise((e) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => {
      try {
        const r = document.createElement("canvas");
        r.width = 24, r.height = 24;
        const a = r.getContext("2d", { willReadFrequently: !0 });
        if (!a) {
          X.set(t, null), e(null);
          return;
        }
        a.drawImage(i, 0, 0, 24, 24);
        const o = a.getImageData(0, 0, 24, 24).data, n = new Array(24);
        for (let _ = 0; _ < 24; _++) n[_] = { w: 0, hSin: 0, hCos: 0, s: 0 };
        let c = 0, d = 0;
        for (let _ = 0; _ < o.length; _ += 4) {
          if (o[_ + 3] < 128) continue;
          const [b, H, N] = Zi(o[_], o[_ + 1], o[_ + 2]);
          if (d++, c += H, H < 12 || N < 10 || N > 92) continue;
          const R = Math.floor(b % 360 / 15) % 24, y = 1 - Math.abs(N - 50) / 52, B = H / 100 * (0.4 + 0.6 * y), O = b * Math.PI / 180;
          n[R].w += B, n[R].hSin += Math.sin(O) * B, n[R].hCos += Math.cos(O) * B, n[R].s += H * B;
        }
        let u = n[0];
        for (let _ = 1; _ < 24; _++)
          n[_].w > u.w && (u = n[_]);
        if (u.w < 1.5 || d > 0 && c / d < 8) {
          const _ = {
            scrim: "hsl(240, 6%, 11%)",
            accent: "hsl(20, 14%, 91%)",
            onAccent: "hsl(240, 8%, 13%)"
          };
          X.set(t, _), e(_);
          return;
        }
        let p = Math.atan2(u.hSin, u.hCos) * 180 / Math.PI;
        p < 0 && (p += 360);
        const g = u.s / u.w, v = Math.round(Math.max(18, Math.min(46, g * 0.55))), m = Math.round(Math.max(42, Math.min(82, g * 0.95))), k = Math.round(Math.max(28, Math.min(60, g * 0.65))), T = {
          scrim: `hsl(${Math.round(p)}, ${v}%, 12%)`,
          accent: `hsl(${Math.round(p)}, ${m}%, 86%)`,
          onAccent: `hsl(${Math.round(p)}, ${k}%, 14%)`
        };
        X.set(t, T), e(T);
      } catch {
        X.set(t, null), e(null);
      }
    }, i.onerror = () => {
      X.set(t, null), e(null);
    }, i.src = t;
  }) : null;
}
var Ui = Object.defineProperty, Ni = Object.getOwnPropertyDescriptor, rt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ni(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Ui(e, i, r), r;
};
const Vi = 2, ji = 16, Gi = 32;
function Me(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t), i = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60), r = e % 60, a = r < 10 ? `0${r}` : String(r);
  if (i > 0) {
    const o = s < 10 ? `0${s}` : String(s);
    return `${i}:${o}:${a}`;
  }
  return `${s}:${a}`;
}
let G = class extends w {
  constructor() {
    super(...arguments), this._palette = null, this._nowTick = Date.now(), this._scrubbing = !1, this._scrubPct = null, this._lastArtworkUrl = "", this._tickTimer = null, this._onSliderPointerDown = (t) => {
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
  setConfig(t) {
    if (!t || !t.entity)
      throw new Error("m3e-media-player-card: devi specificare un’entità media_player.*");
    this._config = {
      ...t,
      dynamic_color: t.dynamic_color !== !1,
      show_device_chip: t.show_device_chip !== !1,
      tap_action: t.tap_action ?? "more-info"
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
      tap_action: "more-info"
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
          name: "name",
          selector: { text: {} }
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "dynamic_color", selector: { boolean: {} } },
            { name: "show_device_chip", selector: { boolean: {} } }
          ]
        },
        {
          name: "tap_action",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "more-info", label: "Apri dettagli media (More-info)" },
                { value: "none", label: "Nessuna azione" }
              ]
            }
          }
        }
      ],
      computeLabel: (t) => ({
        entity: "Entità media player",
        name: "Nome dispositivo personalizzato (opzionale)",
        dynamic_color: "Colori dinamici estratti dalla copertina (M3 Expressive)",
        show_device_chip: "Mostra chip dispositivo in alto a destra",
        tap_action: "Azione al tap sulla card"
      })[t.name] ?? t.name
    };
  }
  shouldUpdate(t) {
    if (!this._config) return !1;
    if (t.has("_config") || t.has("_palette") || t.has("_nowTick") || t.has("_scrubbing") || t.has("_scrubPct"))
      return !0;
    if (t.has("hass") && this.hass) {
      const e = this.hass.states[this._config.entity], i = t.get("hass");
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
    s !== this._lastArtworkUrl && (this._lastArtworkUrl = s, s && this._config?.dynamic_color !== !1 ? Ri(s).then((r) => {
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
  get _entity() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  get _artworkUrl() {
    const t = this._entity, e = String(t?.state ?? "").toLowerCase();
    return !t || e === "off" || e === "idle" || e === "unavailable" || e === "unknown" ? "" : String(t.attributes.entity_picture ?? "").trim();
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
    i?.stopPropagation(), !(!this.hass || !this._config) && this.hass.callService("media_player", t, {
      entity_id: this._config.entity,
      ...e
    });
  }
  _onCardClick() {
    !this._config || this._config.tap_action === "none" || this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this._config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _pointerToPct(t, e) {
    const i = e.getBoundingClientRect();
    return i.width <= 0 ? 0 : Math.max(0, Math.min(100, (t - i.left) / i.width * 100));
  }
  _renderAppBadge(t) {
    const e = String(t?.attributes.app_name ?? t?.attributes.source ?? "").toLowerCase();
    return e.includes("spotify") ? l`
        <span class="app-badge is-spotify" aria-label="Spotify">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#1ED760" />
            <path
              fill="none"
              stroke="#0a0a0a"
              stroke-width="1.9"
              stroke-linecap="round"
              d="M6.8 9.4c3.6-1 7.6-.7 10.6 1M7.6 12.6c2.9-.8 6.1-.5 8.6.8M8.4 15.6c2.2-.5 4.8-.3 6.8.7"
            />
          </svg>
        </span>
      ` : e.includes("youtube") ? l`
        <span class="app-badge" aria-label="YouTube Music">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#FF0033" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.4" />
            <path fill="#ffffff" d="M10.2 9.2v5.6l4.8-2.8-4.8-2.8Z" />
          </svg>
        </span>
      ` : l`
      <span class="app-badge is-tonal" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
        </svg>
      </span>
    `;
  }
  render() {
    if (!this._config) return h;
    const t = this._entity, e = String(t?.state ?? "unavailable").toLowerCase(), i = !t || e === "unavailable" || e === "unknown", s = e === "playing", r = i || e === "off" || e === "idle", a = this._config.name?.trim() || t?.attributes.friendly_name || this._config.entity, o = String(t?.attributes.media_title ?? "").trim() || (i ? "Offline" : r ? a : "In riproduzione"), n = String(t?.attributes.media_artist ?? "").trim() || String(t?.attributes.media_album_name ?? "").trim() || (i ? "Non disponibile" : r ? "Nessuna riproduzione" : a), c = this._artworkUrl, d = this._progressPct, u = this._duration, p = Number(t?.attributes.supported_features ?? 0), g = !i && (p === 0 || (p & ji) !== 0), v = !i && (p === 0 || (p & Gi) !== 0), m = !i && u > 0 && (p === 0 || (p & Vi) !== 0), k = s && !this._scrubbing && u > 0, T = this._scrubPct !== null ? this._scrubPct / 100 * u : this._currentPosition, _ = this._palette ? `--mp-scrim: ${this._palette.scrim}; --mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};` : "";
    return l`
      <ha-card
        class="media-player-card ${s ? "is-playing" : "is-paused"} ${c ? "has-artwork" : "no-artwork"} ${i ? "is-unavailable" : ""}"
        style=${_}
        role="button"
        tabindex="0"
        aria-label="${o}, ${n}"
        @click=${() => this._onCardClick()}
        @keydown=${(b) => {
      (b.key === "Enter" || b.key === " ") && (b.preventDefault(), this._onCardClick());
    }}
      >
        <!-- Full-bleed Artwork + Tonal Scrim/Vignette -->
        ${c ? l`<img class="bg-artwork" src=${c} alt="" loading="lazy" />` : h}
        <div class="bg-scrim" aria-hidden="true"></div>

        <div class="card-content">
          <!-- Top Row: App Badge + Output Device Chip -->
          <div class="top-row">
            ${this._renderAppBadge(t)}
            ${this._config.show_device_chip !== !1 ? l`
                  <span class="device-chip">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span>${a}</span>
                  </span>
                ` : h}
          </div>

          <!-- Middle Row: Bold Typography + Shape-Morphing Play/Pause -->
          <div class="mid-row">
            <div class="track-meta">
              <div class="track-title">${o}</div>
              <div class="track-artist">${n}</div>
            </div>

            <button
              type="button"
              class="play-fab ${s ? "is-playing" : "is-paused"}"
              aria-label=${s ? "Pausa" : "Riproduci"}
              ?disabled=${i}
              @click=${(b) => this._callService("media_play_pause", {}, b)}
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
              ?disabled=${!g}
              @click=${(b) => this._callService("media_previous_track", {}, b)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
              </svg>
            </button>

            <div
              class="wavy-slider ${k ? "is-wavy" : "is-flat"} ${this._scrubbing ? "is-scrubbing" : ""} ${m ? "is-seekable" : ""}"
              role="slider"
              aria-label="Avanzamento riproduzione"
              aria-valuemin="0"
              aria-valuemax=${u}
              aria-valuenow=${Math.round(T)}
              @click=${(b) => b.stopPropagation()}
              @pointerdown=${this._onSliderPointerDown}
              @pointermove=${this._onSliderPointerMove}
              @pointerup=${this._onSliderPointerUp}
              @pointercancel=${this._onSliderPointerUp}
            >
              ${this._scrubbing && u > 0 ? l`
                    <span class="scrub-badge" style="left: ${d}%;">
                      ${Me(T)} / ${Me(u)}
                    </span>
                  ` : h}

              <!-- Active Wavy / Flat Segment -->
              <div class="wavy-active-wrap" style="width: calc(${d}% - 7px);">
                <div class="wavy-svg-scroller">
                  <svg class="wavy-svg" viewBox="0 0 280 14" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      class="wavy-path"
                      d="M 0 7 Q 7 2, 14 7 T 28 7 T 42 7 T 56 7 T 70 7 T 84 7 T 98 7 T 112 7 T 126 7 T 140 7 T 154 7 T 168 7 T 182 7 T 196 7 T 210 7 T 224 7 T 238 7 T 252 7 T 266 7 T 280 7"
                    />
                  </svg>
                </div>
                <div class="flat-active-line"></div>
              </div>

              <!-- M3 Expressive Vertical Pill Thumb -->
              <div class="wavy-thumb" style="left: ${d}%;"></div>

              <!-- Inactive Remaining Track -->
              <div class="wavy-inactive-line" style="left: calc(${d}% + 7px);"></div>
            </div>

            <button
              type="button"
              class="transport-btn is-next"
              aria-label="Traccia successiva"
              ?disabled=${!v}
              @click=${(b) => this._callService("media_next_track", {}, b)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
              </svg>
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }
};
G.styles = [
  L,
  M`
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
        --mp-scrim: var(--md-sys-color-surface-container-highest, #1e2028);
        --mp-accent: var(--md-sys-color-primary-container, #e4e0de);
        --mp-on-accent: var(--md-sys-color-on-primary-container, #1b1b1f);

        position: relative;
        min-height: 196px;
        border-radius: 28px;
        --ha-card-border-radius: 28px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        background: var(--mp-scrim);
        color: #ffffff;
        transition:
          background-color 420ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
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
          color-mix(in srgb, var(--mp-accent) 20%, var(--mp-scrim)) 0%,
          var(--mp-scrim) 100%
        );
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
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 68%;
        padding: 5px 12px;
        border-radius: 9999px;
        background: color-mix(in srgb, var(--mp-scrim) 72%, rgba(0, 0, 0, 0.35));
        color: rgba(255, 255, 255, 0.92);
        font-size: 12.5px;
        font-weight: 500;
        line-height: 16px;
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
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        font-size: 14.5px;
        font-weight: 400;
        line-height: 1.28;
        color: rgba(255, 255, 255, 0.84);
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
        color: #ffffff;
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
        background: rgba(255, 255, 255, 0.12);
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
        width: 280px;
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
        stroke: var(--mp-accent, #ffffff);
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
        background: var(--mp-accent, #ffffff);
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
        background: var(--mp-accent, #ffffff);
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
        background: rgba(255, 255, 255, 0.28);
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
rt([
  S({ attribute: !1 })
], G.prototype, "hass", 2);
rt([
  f()
], G.prototype, "_config", 2);
rt([
  f()
], G.prototype, "_palette", 2);
rt([
  f()
], G.prototype, "_nowTick", 2);
rt([
  f()
], G.prototype, "_scrubbing", 2);
rt([
  f()
], G.prototype, "_scrubPct", 2);
G = rt([
  A("m3e-media-player-card")
], G);
var Fi = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, Wt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Wi(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Fi(e, i, r), r;
};
let ht = class extends w {
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
              { value: "navigate", label: "Percorso / Bubble / Script" },
              { value: "none", label: "Nessuna azione" }
            ]
          }
        }
      }
    ];
    return t.tap_action === "navigate" && e.push({ name: "navigation_path", selector: { text: {} } }), e;
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
ht.styles = M`
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
Wt([
  S({ attribute: !1 })
], ht.prototype, "hass", 2);
Wt([
  f()
], ht.prototype, "_config", 2);
Wt([
  f()
], ht.prototype, "_expandedIndex", 2);
ht = Wt([
  A("m3e-people-card-editor")
], ht);
var qi = Object.defineProperty, Yi = Object.getOwnPropertyDescriptor, qt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Yi(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && qi(e, i, r), r;
};
let ut = class extends w {
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
        kt(this, this.hass, t.navigation_path);
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
      const n = o.entity ? this.hass?.states[o.entity] : void 0, c = !n || n.state === "unavailable" || n.state === "unknown", d = !c && String(n.state ?? "").toLowerCase() === "home", u = o.name || n?.attributes.friendly_name || o.entity || "Persona", p = this._formatLocation(n), g = (o.tap_action ?? "more-info") !== "none" && !!o.entity;
      return l`
                <button
                  type="button"
                  class="person-item ${c ? "is-dimmed" : ""} ${g ? "is-clickable" : ""}"
                  @click=${() => this._onItemTap(o)}
                >
                  <span class="avatar-wrap" aria-hidden="true">
                    <span class="avatar-circle ${d ? "is-home" : ""}">
                      ${this._renderAvatar(o, n, d)}
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
    return s ? a : l`<ha-card>${a}</ha-card>`;
  }
};
ut.styles = [
  L,
  M`
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
qt([
  S({ attribute: !1 })
], ut.prototype, "hass", 2);
qt([
  f()
], ut.prototype, "_config", 2);
qt([
  P(".people-container")
], ut.prototype, "_containerEl", 2);
ut = qt([
  A("m3e-people-card")
], ut);
var Xi = Object.defineProperty, Ki = Object.getOwnPropertyDescriptor, Et = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ki(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Xi(e, i, r), r;
};
const Qi = 2200;
let tt = class extends w {
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
      computeLabel: (t) => ({
        entity: "Scena, Script o Pulsante",
        name: "Nome personalizzato",
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
    }, Qi);
  }
  _renderIcon(t, e) {
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${t}></ha-icon>` : e ? l`
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
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._config.icon?.trim() || void 0, s = this._config.accent ?? "primary", r = `style-${this._config.card_style ?? "default"}`, a = this._config.subtitle?.trim() || "", o = this._isUnavailable ? "Offline" : this._activated ? "Avviata" : a;
    return l`
      <ha-card
        class="scene-tile ${r} accent-${s} ${this._activated ? "is-on is-activated" : ""} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label=${e}
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
            <span class="tile-title">${e}</span>
            ${o ? l`<span class="tile-subtitle">${o}</span>` : h}
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
tt.styles = [
  L,
  M`
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
Et([
  S({ attribute: !1 })
], tt.prototype, "hass", 2);
Et([
  f()
], tt.prototype, "_config", 2);
Et([
  f()
], tt.prototype, "_pressed", 2);
Et([
  f()
], tt.prototype, "_activated", 2);
tt = Et([
  A("m3e-scene-card")
], tt);
var Ji = Object.defineProperty, ts = Object.getOwnPropertyDescriptor, Yt = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ts(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Ji(e, i, r), r;
};
let ft = class extends w {
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
ft.styles = M`
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
Yt([
  S({ attribute: !1 })
], ft.prototype, "hass", 2);
Yt([
  f()
], ft.prototype, "_config", 2);
Yt([
  f()
], ft.prototype, "_expandedIndex", 2);
ft = Yt([
  A("m3e-stack-card-editor")
], ft);
var es = Object.defineProperty, is = Object.getOwnPropertyDescriptor, de = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? is(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && es(e, i, r), r;
};
let St = class extends w {
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
St.styles = [
  L,
  M`
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
de([
  S({ attribute: !1 })
], St.prototype, "hass", 2);
de([
  f()
], St.prototype, "_config", 2);
St = de([
  A("m3e-stack-card")
], St);
var ss = Object.defineProperty, rs = Object.getOwnPropertyDescriptor, pe = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? rs(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && ss(e, i, r), r;
};
let Ct = class extends w {
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
      extra_entities: this._resolvedType() === "power_strip" ? "Prese della multipresa (vuoto = auto-rileva dallo stesso dispositivo)" : "Pillole entità aggiuntive nel popup (max 10)",
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
      Array.isArray(e.extra_entities) && (e.extra_entities = e.extra_entities.slice(0, 10), e.extra_entities.length === 0 && delete e.extra_entities), this._config = e, this.dispatchEvent(
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
    }, o = {
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
      a,
      o,
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
    ) : t === "sensor" ? i.push(
      r,
      a,
      o,
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
Ct.styles = M`
    :host {
      display: block;
    }
  `;
pe([
  S({ attribute: !1 })
], Ct.prototype, "hass", 2);
pe([
  f()
], Ct.prototype, "_config", 2);
Ct = pe([
  A("m3e-status-card-editor")
], Ct);
var as = Object.defineProperty, os = Object.getOwnPropertyDescriptor, C = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? os(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && as(e, i, r), r;
};
const Lt = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
function Ot(t, e) {
  if (e === "raw") return t;
  const i = t.trim();
  if (!Lt.test(i)) return t;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return t;
  const r = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (e === "time" || e === "auto")
    return r;
  if (e === "datetime") {
    const g = /* @__PURE__ */ new Date(), v = (_, b) => _.getFullYear() === b.getFullYear() && _.getMonth() === b.getMonth() && _.getDate() === b.getDate(), m = new Date(g.getFullYear(), g.getMonth(), g.getDate() + 1), k = new Date(g.getFullYear(), g.getMonth(), g.getDate() - 1);
    return v(s, g) ? `Oggi ${r}` : v(s, m) ? `Domani ${r}` : v(s, k) ? `Ieri ${r}` : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${r}`;
  }
  const a = s.getTime() - Date.now(), o = a >= 0, n = Math.round(Math.abs(a) / 6e4);
  if (n < 1) return "Ora";
  const c = Math.floor(n / 1440), d = Math.floor(n % 1440 / 60), u = n % 60;
  let p;
  return c > 0 ? p = d > 0 ? `${c}g ${d}h` : `${c}g` : d > 0 ? p = u > 0 ? `${d}h ${u}m` : `${d}h` : p = `${u}m`, o ? `Tra ${p}` : `${p} fa`;
}
const ns = /* @__PURE__ */ new Set(["temperature", "humidity"]), ls = /* @__PURE__ */ new Set([
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
]), at = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"/></svg>`, cs = l`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 15.41a1 1 0 0 1 0-1.41l3.88-3.88a1 1 0 0 1 1.42 0L16.59 14a1 1 0 1 1-1.41 1.41L12 12.23l-3.18 3.18a1 1 0 0 1-1.41 0Z"/></svg>`, It = 135, K = 270;
function ds(t) {
  return t * Math.PI / 180;
}
function yt(t, e, i, s) {
  const r = ds(s);
  return { x: t + i * Math.cos(r), y: e + i * Math.sin(r) };
}
function ps(t, e, i, s, r) {
  const a = yt(t, e, i, s), o = yt(t, e, i, r);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${i} ${i} 0 1 1 ${o.x.toFixed(2)} ${o.y.toFixed(2)}`;
}
let $ = class extends w {
  constructor() {
    super(...arguments), this.popupOnly = !1, this._pressed = !1, this._popupOpen = !1, this._dialDragging = !1, this._dialTemp = null, this._activeSheet = null, this._volDragging = !1, this._volPct = null, this._volPendingTimer = null, this._historyPoints = [], this._historyLoading = !1, this._historyEntityId = null, this._historyHoverIdx = null, this._prevStates = {}, this._longPressTimer = null, this._longPressTriggered = !1, this._relativeTimer = null, this._relativeTick = 0, this._onTilePointerDown = (t) => {
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
          kt(this, this.hass, this._config?.navigation_path);
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
          const d = this.hass.states[n];
          d && (o.push(d), e.add(n));
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
    return !e || e === "unavailable" || e === "unknown" ? !1 : this._config?.active_state?.trim() ? this._config.active_state.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(e) : t?.entity_id.startsWith("sensor.") && !Number.isNaN(Number(e)) ? !1 : ls.has(e);
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
          (u) => u.state === "unavailable" || u.state === "unknown"
        )) return "Offline";
        const d = n.filter((u) => u.state === "on").length;
        return d > 0 ? this._config?.label_active || `${d} on` : this._config?.label_inactive || "Off";
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
          const u = Ot(String(d), i), p = this._config?.subtitle_prefix ?? "", g = this._config?.subtitle_suffix ?? "";
          return `${p}${u}${g}`;
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
      if (Lt.test(e.trim()))
        return Ot(e, i);
      const n = t.attributes.unit_of_measurement, c = n ? `${e}${n}` : e;
      if (t.attributes.device_class === "temperature" || n === "°C" || n === "°F") {
        const u = this._getSiblingSensors().find(
          (p) => p.attributes.device_class === "humidity" || p.attributes.unit_of_measurement === "%"
        );
        if (u && u.state !== "unavailable" && u.state !== "unknown")
          return `${c} • ${u.state}${u.attributes.unit_of_measurement ?? "%"}`;
      }
      return c;
    }
    return o === "media_player" ? e.charAt(0).toUpperCase() + e.slice(1) : Lt.test(e.trim()) ? Ot(e, i) : e.charAt(0).toUpperCase() + e.slice(1);
  }
  _isNumericHistoryEntity(t) {
    if (!t || !t.entity_id.startsWith("sensor.")) return !1;
    const e = String(t.attributes.device_class ?? "").toLowerCase();
    if (ns.has(e)) return !0;
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
    this._activeSheet = null, this._popupOpen = !0, (this._resolvedPopupType === "sensor" || this._resolvedPopupType === "custom") && this._fetchHistory(), await this.updateComplete;
    const i = this._dialogEl, s = this._dialogSurfaceEl;
    i && (i.open || i.showModal(), jt(s, e));
  }
  closePopup() {
    Gt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1, this._activeSheet = null;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        kt(this, this.hass, this._config.navigation_path);
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
    return It + e * K;
  }
  _pointerToTemp(t, e) {
    const i = e.getBoundingClientRect(), s = i.left + i.width / 2, r = i.top + i.height / 2;
    let a = Math.atan2(t.clientY - r, t.clientX - s) * 180 / Math.PI;
    a < 0 && (a += 360);
    let o = (a - It + 360) % 360;
    o > K && (o = o > K + (360 - K) / 2 ? 0 : K);
    const n = o / K, c = this._climateMin + n * (this._climateMax - this._climateMin);
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
      const a = {
        entity_id: this._config.entity,
        command: r
      };
      this._config.remote_device?.trim() && (a.device = this._config.remote_device.trim()), this.hass.callService("remote", "send_command", a);
      return;
    }
    if (this._config.entity.startsWith("remote.")) {
      const a = {
        entity_id: this._config.entity,
        command: s ?? t
      };
      this._config.remote_device?.trim() && (a.device = this._config.remote_device.trim()), this.hass.callService("remote", "send_command", a);
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
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${t}></ha-icon>` : Bt(this._statusEntity ?? this._entity, this._isActive, this._resolvedPopupType);
  }
  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  _cleanSiblingLabel(t) {
    const e = String(t.attributes.device_class ?? ""), i = (t.attributes.friendly_name || "").trim();
    if (!i)
      return e ? e.replace(/_/g, " ").replace(/^./, (n) => n.toUpperCase()) : "Sensor";
    const s = (n, c) => {
      const d = c.trim();
      if (!d || n.length <= d.length) return null;
      if (n.toLowerCase().startsWith(d.toLowerCase())) {
        const u = n.slice(d.length).replace(/^[\s\-–—:]+/, "").trim();
        if (u) return u.charAt(0).toUpperCase() + u.slice(1);
      }
      return null;
    }, r = this.hass?.entities?.[t.entity_id]?.device_id, a = r ? this.hass?.devices?.[r] : void 0;
    for (const n of [
      a?.name_by_user,
      a?.name,
      this._config?.name,
      this._entity?.attributes.friendly_name
    ])
      if (n) {
        const c = s(i, n);
        if (c) return c;
      }
    const o = (this._entity?.attributes.friendly_name || "").trim();
    if (o) {
      const n = o.split(/\s+/), c = i.split(/\s+/);
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
    const r = Math.min(...s.map((y) => y.v)), a = Math.max(...s.map((y) => y.v)), o = a - r || 1, n = s[0].t, c = s[s.length - 1].t, d = c - n || 1, u = 320, p = 104, g = 6, v = 12, m = s.map((y) => ({
      x: g + (y.t - n) / d * (u - g * 2),
      y: p - v - (y.v - r) / o * (p - v * 2),
      ...y
    }));
    let k = `M ${m[0].x.toFixed(1)} ${m[0].y.toFixed(1)}`;
    for (let y = 1; y < m.length; y++) {
      const B = m[y - 1], O = m[y], F = ((B.x + O.x) / 2).toFixed(1);
      k += ` C ${F} ${B.y.toFixed(1)}, ${F} ${O.y.toFixed(1)}, ${O.x.toFixed(1)} ${O.y.toFixed(1)}`;
    }
    const T = `${k} L ${m[m.length - 1].x.toFixed(1)} ${p} L ${m[0].x.toFixed(1)} ${p} Z`, _ = this._historyHoverIdx, b = _ !== null ? m[_] : m[m.length - 1], H = (y) => new Date(y).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), N = (y) => {
      const O = y.currentTarget.getBoundingClientRect();
      if (O.width <= 0) return;
      const F = Math.max(0, Math.min(1, (y.clientX - O.left) / O.width));
      this._historyHoverIdx = Math.round(F * (m.length - 1));
    }, R = `m3e-hist-${this._historyEntityId?.replace(/[^a-z0-9]/gi, "_") ?? "g"}`;
    return l`
      <div class="history-card">
        <div class="history-header">
          <span class="history-title">${i}</span>
          <span class="history-range">
            ${_ !== null ? `${b.v}${e} · ${H(b.t)}` : `${r}${e} – ${a}${e}`}
          </span>
        </div>

        <svg
          class="history-svg"
          viewBox="0 0 ${u} ${p}"
          preserveAspectRatio="none"
          @pointerdown=${N}
          @pointermove=${(y) => {
      (y.buttons > 0 || y.pointerType === "mouse") && N(y);
    }}
          @pointerleave=${() => this._historyHoverIdx = null}
        >
          ${Jt`
            <defs>
              <linearGradient id=${R} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1=${g} y1=${v} x2=${u - g} y2=${v} class="history-grid-line" />
            <line x1=${g} y1=${p / 2} x2=${u - g} y2=${p / 2} class="history-grid-line" />
            <line x1=${g} y1=${p - v} x2=${u - g} y2=${p - v} class="history-grid-line" />
            <path d=${T} fill="url(#${R})" />
            <path d=${k} class="history-line" />
            ${_ !== null ? Jt`<line x1=${b.x} y1=${v} x2=${b.x} y2=${p - v} class="history-cursor-line" />` : h}
            <circle cx=${b.x} cy=${b.y} r="4.5" class="history-dot" />
          `}
        </svg>

        <div class="history-axis">
          <span>${H(n)}</span>
          <span>${H((n + c) / 2)}</span>
          <span>${H(c)}</span>
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
      if (Lt.test(e))
        return Ot(e, "auto");
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

      ${this._renderHistoryChart()}
    `;
  }
  _renderClimatePopup() {
    const t = this._entity, e = String(t?.state ?? "off").toLowerCase(), i = e === "off", s = this._climateTarget, r = this._climateCurrent, a = this._outdoorEntity, o = Math.floor(s), n = Math.abs(s - o - 0.5) < 0.05, c = this._tempToDeg(s), d = r !== null ? this._tempToDeg(r) : null, u = 140, p = 140, g = 114, v = ps(u, p, g, It, It + K), m = yt(u, p, g, c), k = d !== null ? yt(u, p, g, d) : null, T = d !== null ? yt(u, p, g - 22, d) : null, _ = Array.isArray(t?.attributes.hvac_modes) ? t.attributes.hvac_modes : ["heat", "cool", "off"], b = Array.isArray(t?.attributes.preset_modes) ? t.attributes.preset_modes : [], H = Array.isArray(t?.attributes.fan_modes) ? t.attributes.fan_modes : [], N = Array.isArray(t?.attributes.swing_modes) ? t.attributes.swing_modes : [], R = String(t?.attributes.preset_mode ?? "none"), y = String(t?.attributes.fan_mode ?? "auto"), B = String(t?.attributes.swing_mode ?? "off"), O = typeof t?.attributes.current_humidity == "number" ? `${t.attributes.current_humidity}%` : this._getSiblingSensors().find((x) => x.attributes.device_class === "humidity") ? `${this._getSiblingSensors().find((x) => x.attributes.device_class === "humidity").state}%` : null, F = b.length > 0, Xt = H.length > 0, Kt = N.length > 0, he = e === "heat" || e === "heating" ? "mode-heat" : e === "cool" || e === "cooling" ? "mode-cool" : "mode-off", gt = (x) => x.replace(/_/g, " ").replace(/^./, (Tt) => Tt.toUpperCase()), mt = this._activeSheet === "mode" ? { title: "Select a mode", options: _, current: e, onSelect: (x) => this._setClimateMode(x) } : this._activeSheet === "preset" ? { title: "Select preset", options: b, current: R, onSelect: (x) => this._setClimatePreset(x) } : this._activeSheet === "fan" ? { title: "Fan speed", options: H, current: y, onSelect: (x) => this._setClimateFan(x) } : this._activeSheet === "swing" ? { title: "Swing mode", options: N, current: B, onSelect: (x) => this._setClimateSwing(x) } : null;
    return l`
      <div class="climate-hero ${he} ${this._dialDragging ? "is-dragging" : ""}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${u} cy=${p} r="132" class="dial-bg-circle" />
            <path d=${v} class="dial-arc-track" />

            ${k && T ? Jt`
                  <circle cx=${k.x} cy=${k.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${T.x}
                    y=${T.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(r)}
                  </text>
                ` : h}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${m.x.toFixed(2)}, ${m.y.toFixed(2)}) rotate(${c.toFixed(1)})">
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

            <div class="dial-steppers" @pointerdown=${(x) => x.stopPropagation()}>
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
        <div class="${F ? "climate-grid-2" : ""}">
          <button
            type="button"
            class="mode-pill ${F ? "compact-trait" : ""} ${he}"
            @click=${() => this._activeSheet = "mode"}
          >
            <span class="mode-pill-icon">
              ${e === "heat" ? l`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>` : e === "cool" ? l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>` : l`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${gt(e)}</span>
            </span>
          </button>

          ${F ? l`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => this._activeSheet = "preset"}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${gt(R)}</span>
                  </span>
                  <span class="trait-chevron">${at}</span>
                </button>
              ` : h}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${Xt || Kt ? l`
              <div class="${Xt && Kt ? "climate-grid-2" : ""}">
                ${Xt ? l`
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
                            <span class="mode-pill-val">${gt(y)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">${at}</span>
                      </button>
                    ` : h}

                ${Kt ? l`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => this._activeSheet = "swing"}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${gt(B)}</span>
                        </span>
                        <span class="trait-chevron">${at}</span>
                      </button>
                    ` : h}
              </div>
            ` : h}

        ${r !== null || a || O ? l`
              <div class="telemetry-card">
                ${r !== null ? l`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${r}°</strong>
                      </div>
                    ` : h}
                ${O ? l`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${O}</strong>
                      </div>
                    ` : h}
                ${a ? l`
                      <div class="telemetry-row">
                        <span>Outdoor temperature</span>
                        <strong>${a.state}${a.attributes.unit_of_measurement ?? "°"}</strong>
                      </div>
                    ` : h}
              </div>
            ` : h}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${mt ? l`
            <div class="mode-sheet-backdrop" @click=${() => this._activeSheet = null}>
              <div class="mode-sheet" @click=${(x) => x.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this._activeSheet = null}
                    aria-label="Close selector"
                  >
                    ${at}
                  </button>
                  <span>${mt.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${mt.options.map((x) => {
      const Tt = x.toLowerCase() === mt.current.toLowerCase(), Be = this._activeSheet === "mode" ? x === "heat" ? "mode-heat" : x === "cool" ? "mode-cool" : "mode-off" : "mode-off";
      return l`
                      <button
                        type="button"
                        class="mode-option ${Tt ? `selected ${Be}` : ""}"
                        @click=${() => mt.onSelect(x)}
                      >
                        <span>${gt(x)}</span>
                        ${Tt ? l`<span class="check-mark">✓</span>` : h}
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
    const t = String(this._entity?.attributes.source ?? "Source");
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
            ${at}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteButton("ch_up", "media_next_track", {}, "ChannelUp")}
          >
            ${cs}
          </button>
        </div>

        <div class="secondary-action-card">
          <span>${t}</span>
          <span class="trait-chevron">${at}</span>
        </div>
      </div>
    `;
  }
  _renderMediaPopup() {
    const t = this._mediaEntity, e = t?.state === "playing", i = !t || t.state === "idle" || t.state === "off", s = String(t?.attributes.media_title ?? (i ? "Nothing playing" : "Paused")), r = String(t?.attributes.media_artist ?? ""), a = String(t?.attributes.app_name ?? ""), o = String(t?.attributes.entity_picture ?? ""), n = this._mediaVolumePct;
    return l`
      <div
        class="media-hero-card ${o && !i ? "has-art" : ""}"
        style=${o && !i ? `--media-art: url("${o}");` : ""}
      >
        <div class="media-hero-top">
          <span class="media-app-badge">${a || "▶"}</span>
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
        ${i ? t?.state === "off" ? l`
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
        ${t ? l`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMoreInfo(t.entity_id)}
              >
                <span>Media &amp; Controls</span>
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
                      ${Bt(s, a)}
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
  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  render() {
    if (!this._config) return h;
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isActive, s = i ? this._config.icon_active?.trim() || void 0 : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || void 0, r = this._resolvedPopupType, a = this._config.tap_action === "navigate" || this._config.tap_action === "more-info" || this._config.tap_action !== "toggle" && this._config.tap_action !== "none" && r !== "none", o = `style-${this._config.card_style ?? "default"}`, n = this._popupOpen ? ce(this._statusEntity?.last_changed) : null;
    return l`
      ${this.popupOnly ? h : l`
            <ha-card
              class="status-tile ${o} ${i ? "is-active" : "is-inactive"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
              role="button"
              tabindex="0"
              aria-label="${e}, ${this._stateLabel}"
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
                  <span class="tile-title">${e}</span>
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
            </ha-card>
          `}

      <dialog
        class="status-dialog"
        @click=${(c) => {
      c.target === this._dialogEl && this.closePopup();
    }}
        @cancel=${(c) => {
      c.preventDefault(), this.closePopup();
    }}
        @touchmove=${(c) => Pt(c, this._dialogEl)}
      >
        ${this._popupOpen ? (() => {
      const c = r === "power_strip", d = r === "sensor" || r === "custom" ? this._toggleablePowerEntity : void 0, u = c ? this._getPowerStripEntities() : [], p = !!d || c && u.length > 0, g = c ? u.some((m) => m.state === "on") : d?.state === "on", v = l`
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
                    ${v}
                    <div class="dialog-title-wrap">
                      <span class="dialog-title">${e}</span>
                      ${n ? l`<span class="dialog-last-changed">${n}</span>` : h}
                    </div>
                    ${p ? l`
                          <button
                            type="button"
                            class="m3-header-switch ${g ? "is-on" : ""}"
                            role="switch"
                            aria-checked=${String(g)}
                            aria-label=${g ? "Spegni" : "Accendi"}
                            @click=${() => c ? this._togglePowerStripAll(!g) : d && this._togglePowerEntity(d)}
                          >
                            <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                          </button>
                        ` : h}
                  </header>

                  ${r === "power_strip" ? this._renderPowerStripPopup() : r === "selector" ? this._renderSelectorPopup() : r === "sensor" || r === "custom" ? this._renderSensorPopup(s) : r === "climate" ? this._renderClimatePopup() : r === "remote" ? this._renderRemotePopup() : this._renderMediaPopup()}
                </div>
              `;
    })() : h}
      </dialog>
    `;
  }
};
$.styles = [
  L,
  M`
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
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        align-items: flex-end;
        z-index: 10;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
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
C([
  S({ attribute: !1 })
], $.prototype, "hass", 2);
C([
  S({ type: Boolean })
], $.prototype, "popupOnly", 2);
C([
  f()
], $.prototype, "_config", 2);
C([
  f()
], $.prototype, "_pressed", 2);
C([
  f()
], $.prototype, "_popupOpen", 2);
C([
  f()
], $.prototype, "_dialDragging", 2);
C([
  f()
], $.prototype, "_dialTemp", 2);
C([
  f()
], $.prototype, "_activeSheet", 2);
C([
  f()
], $.prototype, "_volDragging", 2);
C([
  f()
], $.prototype, "_volPct", 2);
C([
  f()
], $.prototype, "_historyPoints", 2);
C([
  f()
], $.prototype, "_historyLoading", 2);
C([
  f()
], $.prototype, "_historyEntityId", 2);
C([
  f()
], $.prototype, "_historyHoverIdx", 2);
C([
  P("dialog.status-dialog")
], $.prototype, "_dialogEl", 2);
C([
  P(".status-tile")
], $.prototype, "_tileEl", 2);
C([
  P(".dialog-surface")
], $.prototype, "_dialogSurfaceEl", 2);
C([
  f()
], $.prototype, "_relativeTick", 2);
$ = C([
  A("m3e-status-card")
], $);
var hs = Object.defineProperty, us = Object.getOwnPropertyDescriptor, At = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? us(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && hs(e, i, r), r;
};
let et = class extends w {
  constructor() {
    super(...arguments), this._optimisticTemp = null, this._optimisticTimer = null, this._boundPopupKey = "", this._attachPopupHost = (t) => {
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
          name: "name",
          selector: { text: {} }
        },
        {
          name: "outdoor_entity",
          selector: { entity: { domain: "sensor" } }
        },
        {
          name: "step",
          selector: { number: { min: 0.1, max: 2, step: 0.1, mode: "box" } }
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
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isUnavailable, s = this._climateTone, r = !!this.hass?.themes?.darkMode, a = this._targetTemp, o = this._currentTemp, n = String(t?.state ?? "off").toLowerCase(), c = o !== null ? n === "off" ? `Off • Indoor ${this._formatTempNumber(o)}` : `Indoor ${this._formatTempNumber(o)}` : n === "off" ? "Off" : n.charAt(0).toUpperCase() + n.slice(1);
    return l`
      <ha-card
        class="thermostat-card tone-${s} ${r ? "is-dark" : "is-light"} ${i ? "is-unavailable" : ""}"
        role="button"
        tabindex="0"
        aria-label="${e}, ${i ? "Offline" : a !== null ? `${a}°` : n}"
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

              <div class="indoor-label">${c}</div>
            `}
      </ha-card>

      <!-- Reuses the exact Climate popup from m3e-status-card without rendering a tile -->
      <m3e-status-card
        .popupOnly=${!0}
        .hass=${this.hass}
        ${He(this._attachPopupHost)}
      ></m3e-status-card>
    `;
  }
};
et.styles = [
  L,
  M`
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
At([
  S({ attribute: !1 })
], et.prototype, "hass", 2);
At([
  f()
], et.prototype, "_config", 2);
At([
  f()
], et.prototype, "_optimisticTemp", 2);
At([
  P(".thermostat-card")
], et.prototype, "_cardEl", 2);
et = At([
  A("m3e-thermostat-card")
], et);
var fs = Object.defineProperty, gs = Object.getOwnPropertyDescriptor, q = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? gs(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && fs(e, i, r), r;
};
const ms = 420;
let U = class extends w {
  constructor() {
    super(...arguments), this._pressed = !1, this._popupOpen = !1, this._longPressTimer = null, this._longPressTriggered = !1, this._dragStartY = null, this._downX = 0, this._downY = 0, this._onTilePointerDown = (t) => {
      this._isUnavailable || t.pointerType === "mouse" && t.button !== 0 || (this._pressed = !0, this._longPressTriggered = !1, this._downX = t.clientX, this._downY = t.clientY, this._clearLongPress(), this._longPressTimer = window.setTimeout(() => {
        this._longPressTriggered = !0, this._pressed = !1, this._handleHoldAction();
      }, ms));
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
    e && (e.open || e.showModal(), jt(i, t));
  }
  closePopup() {
    Gt(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = !1;
    });
  }
  _handleHoldAction() {
    if (!this._config) return;
    const t = this._config.hold_action ?? "popup";
    if (t !== "none") {
      if (window.getSelection()?.removeAllRanges(), t === "navigate") {
        kt(this, this.hass, this._config.navigation_path);
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
    return t && typeof customElements < "u" && customElements.get("ha-icon") ? l`<ha-icon .icon=${t}></ha-icon>` : Bt(this._entity, this._isOn);
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
      this._config?.name,
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
    const t = this._entity, e = this._config.name || t?.attributes.friendly_name || this._config.entity, i = this._isOn, s = i ? this._config.icon_on?.trim() || void 0 : this._config.icon_off?.trim() || this._config.icon_on?.trim() || void 0, r = this._isUnavailable ? "Offline" : i ? this._config.label_on || "On" : this._config.label_off || "Off", a = `style-${this._config.card_style ?? "default"}`, o = this._popupOpen ? ce(t?.last_changed) : null, n = this._popupOpen ? this._getPowerSiblings() : [];
    return l`
      <ha-card
        class="toggle-tile ${a} ${i ? "is-on" : "is-off"} ${this._pressed ? "is-pressed" : ""} ${this._isUnavailable ? "is-unavailable" : ""}"
        role="switch"
        tabindex="0"
        aria-checked=${String(i)}
        aria-label="${e}, ${r}"
        @pointerdown=${this._onTilePointerDown}
        @pointermove=${this._onTilePointerMove}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @click=${this._onTileClick}
        @contextmenu=${(c) => {
      c.preventDefault(), this._clearLongPress(), this._longPressTriggered = !0, this._handleHoldAction();
    }}
        @keydown=${(c) => {
      c.key === " " || c.key === "Enter" ? (c.preventDefault(), this._toggle()) : (c.key === "o" || c.key === "O") && (c.preventDefault(), this.openPopup());
    }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(s)}</span>
          <div class="tile-meta">
            <span class="tile-title">${e}</span>
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
        @touchmove=${(c) => Pt(c, this._dialogEl)}
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
                    ${o ? l`<span class="dialog-last-changed">${o}</span>` : h}
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
U.styles = [
  L,
  M`
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
q([
  S({ attribute: !1 })
], U.prototype, "hass", 2);
q([
  f()
], U.prototype, "_config", 2);
q([
  f()
], U.prototype, "_pressed", 2);
q([
  f()
], U.prototype, "_popupOpen", 2);
q([
  P("dialog.toggle-dialog")
], U.prototype, "_dialogEl", 2);
q([
  P(".toggle-tile")
], U.prototype, "_tileEl", 2);
q([
  P(".dialog-surface")
], U.prototype, "_dialogSurfaceEl", 2);
U = q([
  A("m3e-toggle-card")
], U);
function D(t) {
  window.customCards = window.customCards || [], window.customCards.some((e) => e.type === t.type) || window.customCards.push(t);
}
D({
  type: "m3e-light-card",
  name: "Light Card",
  description: "Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You integration.",
  preview: !0
});
D({
  type: "m3e-status-card",
  name: "Status Card",
  description: "Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular popups (Sensor, Selector, Climate, Remote, Media).",
  preview: !0
});
D({
  type: "m3e-toggle-card",
  name: "Toggle Card",
  description: "Google Home–style switch/outlet toggle tile with morphing vertical switch popup.",
  preview: !0
});
D({
  type: "m3e-scene-card",
  name: "Scene / Button Card",
  description: "Google Home–style one-tap scene, script, or button tile with animated activation feedback.",
  preview: !0
});
D({
  type: "m3e-light-control-card",
  name: "Light Control (All on / All off)",
  description: "Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.",
  preview: !0
});
D({
  type: "m3e-light-group-card",
  name: "Light Group Card",
  description: "Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.",
  preview: !0
});
D({
  type: "m3e-assist-card",
  name: "Assist & Mode Bar",
  description: 'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector.',
  preview: !0
});
D({
  type: "m3e-glance-card",
  name: "At a Glance Strip",
  description: "Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.",
  preview: !0
});
D({
  type: "m3e-people-card",
  name: "People Glance",
  description: "At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.",
  preview: !0
});
D({
  type: "m3e-thermostat-card",
  name: "Thermostat Card",
  description: "Full-width Google Home–style thermostat card with +/- pill steppers, heat/cool semantic colors, offline state, and full climate dial popup.",
  preview: !0
});
D({
  type: "m3e-stack-card",
  name: "Stack",
  description: "Google Home–style comparison card to list and compare multiple sensors side-by-side with customizable header icon and title.",
  preview: !0
});
D({
  type: "m3e-media-bar-card",
  name: "Media Bar",
  description: "Footer-ready Google Home–style media player bar with squircle artwork, auto-scrolling marquee metadata, Cast/Source selector, and Play/Pause button.",
  preview: !0
});
D({
  type: "m3e-media-player-card",
  name: "Media Player",
  description: "Full-bleed Material 3 Expressive media player card with dynamic artwork color extraction, shape-morphing Play/Pause, and animated wavy progress slider.",
  preview: !0
});
export {
  V as M3EAssistCard,
  dt as M3EGlanceCard,
  E as M3ELightCard,
  pt as M3ELightControlCard,
  j as M3ELightGroupCard,
  z as M3EMediaBarCard,
  G as M3EMediaPlayerCard,
  ut as M3EPeopleCard,
  tt as M3ESceneCard,
  St as M3EStackCard,
  $ as M3EStatusCard,
  et as M3EThermostatCard,
  U as M3EToggleCard
};
