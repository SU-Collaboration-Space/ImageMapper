(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
    new MutationObserver(i => {
        for (const a of i)
            if (a.type === "childList")
                for (const n of a.addedNodes) n.tagName === "LINK" && n.rel === "modulepreload" && s(n)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function e(i) {
        const a = {};
        return i.integrity && (a.integrity = i.integrity), i.referrerPolicy && (a.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? a.credentials = "include" : i.crossOrigin === "anonymous" ? a.credentials = "omit" : a.credentials = "same-origin", a
    }

    function s(i) {
        if (i.ep) return;
        i.ep = !0;
        const a = e(i);
        fetch(i.href, a)
    }
})();

function S(o) {
    this.mSVG = document.getElementById(o), this.isDrawing = !1, this.mode = "rect", this.action = "add", this.objects = new Map, this.n = 0, this.active = 0, this.activepoint = -1, this.SVGwidth = 1e3, this.r = 9, this.x = 0, this.y = 0, this.buferImage = new Image, this.image = document.createElementNS("http://www.w3.org/2000/svg", "image"), this.input = document.createElement("input"), this.input.setAttribute("type", "file"), this.loadImage = function() {
        this.input.click()
    }, this.input.onchange = t => {
        const e = t.target.files[0];
        if (!e) return;
        const s = URL.createObjectURL(e);
        this.buferImage.src = s, this.image.setAttributeNS("http://www.w3.org/1999/xlink", "href", s), this.fileurl = e.name
    }, this.setsize = () => {
        let t = document.getElementById("main_block").clientWidth,
            e = Math.min(this.w, t * .9);
        return this.mSVG.setAttribute("width", `${e}px`), e
    }, window.addEventListener("resize", () => {
        this.setsize()
    }, !0), this.buferImage.addEventListener("load", t => {
        this.mSVG.innerHTML = "", this.w = this.buferImage.width, this.h = this.buferImage.height, this.image.style.width = `${this.w}px`;
        let e = `0 0 ${this.w} ${this.h}`;
        this.mSVG.setAttribute("viewBox", e), this.SVGwidth = this.setsize(), this.mSVG.appendChild(this.image), this.isDrawing = !1, this.mode = "rect", this.action = "add", this.objects = new Map, this.n = 0, this.active = 0, this.activepoint = -1, this.onLoad && this.onLoad()
    }), this.add = (t, e) => {
        this.n += 1, this.active > 0 && this.deactivate(this.active), this.active = this.n;
        let s = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        s.setAttribute("cx", t), s.setAttribute("cy", e), s.setAttribute("z", 1), s.setAttribute("r", this.r * this.w / this.SVGwidth), s.setAttribute("class", "image-mapper-point"), s.setAttribute("data-index", this.active), s.setAttribute("data-point", 0);
        let i = {
            ftype: this.mode,
            points: [{
                x: t,
                y: e
            }],
            circles: [s]
        };
        if (this.mode === "polygon") {
            let a = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            a.setAttribute("class", "image-mapper-shape"), a.setAttribute("data-index", this.active), i.element = a;
            let n = this.mSVG.createSVGPoint();
            n.x = t, n.y = e, a.points.appendItem(n), this.mSVG.appendChild(a)
        }
        this.objects.set(this.active, i), this.action = "edit", this.mSVG.appendChild(s)
    }, this.edit = (t, e) => {
        let s = this.objects.get(this.active);
        if (!s) return;
        let i = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        i.setAttribute("cx", t), i.setAttribute("cy", e), i.setAttribute("z", 1), i.setAttribute("r", this.r * this.w / this.SVGwidth), i.setAttribute("class", "image-mapper-point"), i.setAttribute("data-index", this.active), i.setAttribute("data-point", s.points.length), s.points.push({
            x: t,
            y: e
        }), s.circles.push(i), this.mSVG.appendChild(i);
        let a = s.ftype;
        if (a === "rect" && (this.createRect(s), this.action = "add"), a === "circle" && (this.createCircle(s), this.action = "add"), a === "polygon") {
            let n = s.points.length,
                p = n - 2;
            for (let c = 0; c < s.circles.length; c++)
                if (s.circles[c].getAttribute("class") == "image-mapper-activepoint") {
                    p = c;
                    break
                } if (p !== n - 2) {
                let c = new Array(n);
                for (let l = 0; l < n - 1; l++) {
                    let h = (l + p + 1) % (n - 1);
                    c[l] = {
                        x: s.points[h].x,
                        y: s.points[h].y
                    }
                }
                for (let l = 0; l < n - 1; l++) s.circles[l].setAttribute("cx", c[l].x), s.circles[l].setAttribute("cy", c[l].y), s.points[l].x = c[l].x, s.points[l].y = c[l].y
            }
            this.createPolygon(s)
        }
        if (this.activate(this.active), a === "polygon") {
            let n = s.points.length;
            this.activatePoint(s, n - 1)
        }
    }, this.deactivate = t => {
        let e = this.objects.get(t);
        if (e) {
            for (let s = 0; s < e.circles.length; s++) e.circles[s].setAttribute("class", "hide-point");
            e.element && (e.element.classList.remove("selected"), this.onDeactive && this.onDeactive(e))
        }
    }, this.activatePoint = (t, e) => {
        for (let s = 0; s < t.circles.length; s++) t.circles[s].setAttribute("class", "image-mapper-point");
        t.circles[e].setAttribute("class", "image-mapper-activepoint")
    }, this.activate = t => {
        let e = this.objects.get(t);
        if (e) {
            for (let s = 0; s < e.circles.length; s++) e.circles[s].setAttribute("class", "image-mapper-point");
            e.element && (e.element.classList.add("selected"), this.onActive && this.onActive(e))
        }
    }, this.removePreview = () => {
        this.preview && this.mSVG.removeChild(this.preview), this.preview = null
    }, this.addPreview = t => {
        this.preview = t, this.mSVG.appendChild(this.preview)
    }, this.showPreview = (t, e) => {
        let s = this.objects.get(this.active);
        s && (s.ftype === "rect" && this.showPreviewRect(s, t, e), s.ftype === "circle" && this.showPreviewCircle(s, t, e), s.ftype === "polygon" && this.showPreviewPolygon(s, t, e))
    }, this.showPreviewCircle = (t, e, s) => {
        let i = (t.points[0].x - e) * (t.points[0].x - e) + (t.points[0].y - s) * (t.points[0].y - s);
        i = Math.sqrt(i);
        let a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        a.setAttribute("cx", t.points[0].x), a.setAttribute("cy", t.points[0].y), a.setAttribute("r", i), a.setAttribute("class", "image-mapper-shape selected"), this.removePreview(), this.addPreview(a)
    }, this.showPreviewPolygon = (t, e, s) => {
        let i = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        i.setAttribute("class", "image-mapper-shape selected");
        let a = t.points.length,
            n = a - 1;
        for (let l = 0; l < t.circles.length; l++)
            if (t.circles[l].getAttribute("class") === "image-mapper-activepoint") {
                n = l;
                break
            } let p = (n + 1) % a,
            c = [t.points[n], {
                x: e,
                y: s
            }, t.points[p]];
        for (let l of c) {
            let h = this.mSVG.createSVGPoint();
            h.x = l.x, h.y = l.y, i.points.appendItem(h)
        }
        this.removePreview(), this.addPreview(i)
    }, this.showPreviewRect = (t, e, s) => {
        let i = Math.min(t.points[0].x, e),
            a = Math.max(t.points[0].x, e),
            n = Math.min(t.points[0].y, s),
            p = Math.max(t.points[0].y, s),
            c = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        c.setAttribute("x", i), c.setAttribute("y", n), c.setAttribute("width", a - i), c.setAttribute("height", p - n), c.setAttribute("class", "image-mapper-shape selected"), this.removePreview(), this.addPreview(c)
    }, this.createRect = t => {
        let e = Math.min(t.points[0].x, t.points[1].x),
            s = Math.max(t.points[0].x, t.points[1].x),
            i = Math.min(t.points[0].y, t.points[1].y),
            a = Math.max(t.points[0].y, t.points[1].y),
            n = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        n.setAttribute("x", e), n.setAttribute("y", i), n.setAttribute("width", s - e), n.setAttribute("height", a - i), n.setAttribute("class", "image-mapper-shape"), n.setAttribute("data-index", this.active), t.element = n, this.mSVG.appendChild(n), this.mSVG.appendChild(t.circles[0]), this.mSVG.appendChild(t.circles[1])
    }, this.createCircle = t => {
        let e = t.points[0].x,
            s = t.points[0].y,
            i = (t.points[0].x - t.points[1].x) * (t.points[0].x - t.points[1].x) + (t.points[0].y - t.points[1].y) * (t.points[0].y - t.points[1].y);
        i = Math.sqrt(i);
        let a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        a.setAttribute("cx", e), a.setAttribute("cy", s), a.setAttribute("r", i), a.setAttribute("class", "image-mapper-shape"), a.setAttribute("data-index", this.active), t.element = a, this.mSVG.appendChild(a), this.mSVG.appendChild(t.circles[0]), this.mSVG.appendChild(t.circles[1])
    }, this.createPolygon = t => {
        t.element.points.clear();
        for (let e of t.points) {
            let s = this.mSVG.createSVGPoint();
            s.x = e.x, s.y = e.y, t.element.points.appendItem(s)
        }
    }, this.move = (t, e, s, i) => {
        let a = this.objects.get(t);
        if (e === -1)
            for (let n = 0; n < a.points.length; n++) a.points[n].x += s, a.points[n].y += i;
        else a.points[e].x += s, a.points[e].y += i
    }, this.render = t => {
        let e = this.objects.get(t);
        if (!e) return;
        for (let i = 0; i < e.circles.length; i++) {
            let a = e.circles[i],
                n = e.points[i].x,
                p = e.points[i].y;
            a.setAttribute("cx", n), a.setAttribute("cy", p)
        }
        let s = e.ftype;
        s === "rect" && this.renderRect(e), s === "circle" && this.renderCircle(e), s === "polygon" && this.renderPolygon(e)
    }, this.renderRect = t => {
        if (t.points.length < 2) return;
        let e = Math.min(t.points[0].x, t.points[1].x),
            s = Math.max(t.points[0].x, t.points[1].x),
            i = Math.min(t.points[0].y, t.points[1].y),
            a = Math.max(t.points[0].y, t.points[1].y),
            n = t.element;
        n.setAttribute("x", e), n.setAttribute("y", i), n.setAttribute("width", s - e), n.setAttribute("height", a - i)
    }, this.renderCircle = t => {
        if (t.points.length < 2) return;
        let e = t.points[0].x,
            s = t.points[0].y,
            i = (t.points[0].x - t.points[1].x) * (t.points[0].x - t.points[1].x) + (t.points[0].y - t.points[1].y) * (t.points[0].y - t.points[1].y);
        i = Math.sqrt(i);
        let a = t.element;
        a.setAttribute("cx", e), a.setAttribute("cy", s), a.setAttribute("r", i)
    }, this.renderPolygon = t => {
        for (let e = 0; e < t.points.length; e++) t.element.points[e].x = t.points[e].x, t.element.points[e].y = t.points[e].y
    }, this.click = (t, e) => {
        this.action === "add" ? this.add(t, e) : this.edit(t, e)
    }, this.delete = () => {
        this.removePreview();
        let t = this.objects.get(this.active);
        if (t.ftype === "polygon") {
            for (let e = 0; e < t.circles.length; e++)
                if (t.circles[e].getAttribute("class") === "image-mapper-activepoint") {
                    this.mSVG.removeChild(t.circles[e]), t.circles.splice(e, 1), t.points.splice(e, 1), t.element.points.clear();
                    for (let s = 0; s < t.circles.length; s++) {
                        t.circles[s].setAttribute("data-point", s);
                        let i = this.mSVG.createSVGPoint();
                        i.x = t.points[s].x, i.y = t.points[s].y, t.element.points.appendItem(i)
                    }
                    return
                }
        }
        if (this.active = 0, this.action = "add", !!t) {
            t.deleted = !0;
            for (let e = 0; e < t.circles.length; e++) this.mSVG.removeChild(t.circles[e]);
            t.element && this.mSVG.removeChild(t.element)
        }
    }, this.scale = t => t * this.w / this.mSVG.width.baseVal.value, this.generate2 = () => {
        let t = `<img src="${this.fileurl}" usemap="#image-map">
<map name="image-map">`;
        for (let e = 0; e < this.mSVG.children.length; e++)
            if (this.mSVG.children[e].classList.contains("image-mapper-shape")) {
                let s = parseInt(this.mSVG.children[e].dataset.index),
                    i = this.objects.get(s);
                if (!i) continue;
                let a = i.text ? i.text : "",
                    n = i.url ? i.url : "#",
                    p = i.target ? i.target : "";
                p === "---" && (p = "");
                let c = "",
                    l = "",
                    h = i.ftype;
                if (h === "rect" && (c = "rect", l = `${Math.round(i.points[0].x)},${Math.round(i.points[0].y)},${Math.round(i.points[1].x)},${Math.round(i.points[1].y)}`), h === "circle") {
                    c = "circle";
                    let d = parseInt(i.element.getAttribute("cx")),
                        x = parseInt(i.element.getAttribute("cy")),
                        A = parseInt(i.element.getAttribute("r"));
                    l = `${d},${x},${A}`
                }
                if (h === "polygon") {
                    c = "poly", l = `${Math.round(i.points[0].x)},${Math.round(i.points[0].y)}`;
                    for (let d = 1; d < i.points.length; d++) l = l + `,${Math.round(i.points[d].x)},${Math.round(i.points[d].y)}`
                }
                let w = `    <area target="${p}" alt="${a}" title="${a}" href="${n}" coords="${l}" shape="${c}"></area>`;
                t = t + `
` + w
            } return t = t + `
</map>`, t
    }, this.generate = () => {
        let t = `
<style>
.image-mapper-shape {
    fill: rgba(0, 0, 0, 0);
}
g:hover .image-mapper-shape {
    stroke: white;
    stroke-width: 2px;
    opacity: 20%;
}
</style>
        `,
            i = `<svg style="width:100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${this.mSVG.getAttribute("viewBox")}">` + t,
            a = this.image.outerHTML,
            n = /href="(.*?)"/i,
            p = `href="${this.fileurl}"`;
        a = a.replace(n, p), i = i + `
` + a;
        for (let c = 0; c < this.mSVG.children.length; c++)
            if (this.mSVG.children[c].classList.contains("image-mapper-shape")) {
                let l = parseInt(this.mSVG.children[c].dataset.index),
                    h = this.objects.get(l);
                if (!h) continue;
                let w = h.text ? h.text : "",
                    d = h.url ? h.url : "#",
                    x = h.target ? h.target : "",
                    A = `<a xlink:href="${d}" target="${x}" xlink:title="${w}">`;
                i = i + `
` + A, i = i + `
<g>`, i = i + `
` + this.mSVG.children[c].outerHTML, i = i + `
</g>`, i = i + `
</a>`
            } return i = i + `
</svg>`, i
    }, window.addEventListener("mouseup", t => {
        if (this.isDrawing && (this.x = 0, this.y = 0, this.isDrawing = !1, this.active > 0)) {
            let e = this.objects.get(this.active);
            if (!e.element) return;
            e.element.classList.remove("image-move")
        }
    }), this.mSVG.addEventListener("mousedown", t => {
        if (this.x = this.scale(t.offsetX), this.y = this.scale(t.offsetY), this.removePreview(), t.target.dataset.index) {
            let e = parseInt(t.target.dataset.index),
                s = -1;
            t.target.dataset.point != null && (s = parseInt(t.target.dataset.point)), this.action = "add", e !== this.active && (this.deactivate(this.active), this.active = e, this.activate(this.active)), this.active = e;
            let i = this.objects.get(this.active);
            i.ftype === "polygon" && (this.action = "edit"), t.target.dataset.point != null ? (this.activepoint = s, i.ftype === "polygon" && this.activatePoint(i, s)) : (t.target.classList.add("image-move"), this.activepoint = -1), this.isDrawing = !0
        } else this.click(this.x, this.y)
    }), this.mSVG.addEventListener("dblclick", t => {
        this.active > 0 && (this.deactivate(this.active), this.active = 0, this.removePreview()), this.action = "add"
    }), this.mSVG.addEventListener("mousemove", t => {
        if (this.isDrawing) this.move(this.active, this.activepoint, this.scale(t.offsetX) - this.x, this.scale(t.offsetY) - this.y), this.x = this.scale(t.offsetX), this.y = this.scale(t.offsetY), this.render(this.active);
        else if (this.action === "edit" && this.active > 0) {
            let e = this.scale(t.offsetX),
                s = this.scale(t.offsetY);
            t.target.dataset.index || t.target.dataset.point ? this.removePreview() : this.showPreview(e, s)
        }
    }), this.mSVG.addEventListener("touchmove", t => {
        if (!this.isDrawing || this.active_to === 0) return;
        t.preventDefault();
        const e = t.changedTouches;
        this.move(this.active_to, this.activepoint_to, this.scale(e[0].pageX) - this.x, this.scale(e[0].pageY) - this.y), this.x = this.scale(e[0].pageX), this.y = this.scale(e[0].pageY), this.render(this.active_to)
    }), this.mSVG.addEventListener("touchstart", t => {
        if (t.target.dataset.index == null) {
            this.active_to = 0, this.activepoint_to = -1;
            return
        }
        this.active_to = parseInt(t.target.dataset.index), t.target.dataset.point == null ? this.activepoint_to = -1 : this.activepoint_to = parseInt(t.target.dataset.point), this.isDrawing = !0;
        const e = t.changedTouches;
        this.x = this.scale(e[0].pageX), this.y = this.scale(e[0].pageY)
    }), this.mSVG.addEventListener("touchend", t => {
        this.isDrawing && (this.active_to = 0, this.activepoint_to = -1, this.x = 0, this.y = 0, this.isDrawing = !1)
    })
}
let r = new S("main");
r.onLoad = () => {
    document.getElementById("fileurl").value = r.fileurl, document.getElementById("work").style.display = "block", f.classList.add("active"), y.classList.remove("active"), v.classList.remove("active"), document.getElementById("result").value = ""
};
document.body.addEventListener("mousemove", o => {
    o.target.tagName === "image" || o.target.tagName === "rect" || o.target.tagName === "circle" || o.target.tagName === "polygon" || r.removePreview()
});
const m = document.getElementById("textinfo"),
    u = document.getElementById("urlinfo"),
    g = document.getElementById("targetinfo"),
    b = document.getElementById("loadBut");
b.addEventListener("click", () => {
    r.loadImage()
});
const L = document.getElementById("loadButWeb");
L.addEventListener("click", () => {
    r.fileurl = document.getElementById("fileurl").value, r.image.setAttributeNS("http://www.w3.org/1999/xlink", "href", r.fileurl), r.buferImage.src = r.fileurl
});
const E = document.getElementById("del");
E.addEventListener("click", () => {
    r.delete(), m.value = "", u.value = "", g.value = "---"
});
const G = document.getElementById("apply");
G.addEventListener("click", () => {
    r.active > 0 && (r.deactivate(r.active), r.active = 0, r.removePreview()), r.action = "add"
});
const v = document.getElementById("circle");
v.addEventListener("click", () => {
    r.active > 0 && (r.deactivate(r.active), r.active = 0), r.action = "add", r.mode = "circle", v.classList.add("active"), y.classList.remove("active"), f.classList.remove("active")
});
const f = document.getElementById("rect");
f.addEventListener("click", () => {
    r.active > 0 && (r.deactivate(r.active), r.active = 0), r.action = "add", r.mode = "rect", f.classList.add("active"), y.classList.remove("active"), v.classList.remove("active")
});
const y = document.getElementById("polygon");
y.addEventListener("click", () => {
    r.active > 0 && (r.deactivate(r.active), r.active = 0), r.action = "add", r.mode = "polygon", y.classList.add("active"), v.classList.remove("active"), f.classList.remove("active")
});
const V = document.getElementById("info");
V.addEventListener("click", () => {
    let o = r.objects.get(r.active);
    o && (o.text = m.value, o.url = u.value, o.target = g.value), document.getElementById("result").value = r.generate2()
});
const I = document.getElementById("infoSVG");
I.addEventListener("click", () => {
    let o = r.objects.get(r.active);
    o && (o.text = m.value, o.url = u.value, o.target = g.value), document.getElementById("result").value = r.generate()
});
r.onDeactive = o => {
    o.text = m.value, o.url = u.value, o.target = g.value, m.value = "", u.value = "", g.value = "---"
};
r.onActive = o => {
    m.value = o.text ? o.text : "", u.value = o.url ? o.url : "#", g.value = o.target ? o.target : "---"
};