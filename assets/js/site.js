(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* ---------- One-shot scroll reveals ---------- */
    var revealables = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
        revealables.forEach(function (el) { io.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Count-up numbers ---------- */
    function runCounter(el) {
        var to = parseFloat(el.getAttribute('data-to'));
        var pre = el.getAttribute('data-pre') || '';
        var suf = el.getAttribute('data-suf') || '';
        var start = null, dur = 1400;
        function step(t) {
            if (!start) start = t;
            var k = Math.min(1, (t - start) / dur);
            var eased = 1 - Math.pow(1 - k, 3);
            el.textContent = pre + Math.round(to * eased).toLocaleString('en-US') + suf;
            if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && !reduce) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
            });
        }, { threshold: 0.6 });
        document.querySelectorAll('[data-to]').forEach(function (el) { cio.observe(el); });
    }

    /* ---------- Scroll-linked effects ---------- */
    var tl = document.querySelector('.timeline');
    var tlFill = tl && tl.querySelector('.rail i');
    var roles = tl ? tl.querySelectorAll('.role') : [];

    if (reduce) {
        roles.forEach(function (r) { r.classList.add('passed'); });
    } else {
        // Split headings and principles into words so they can light up in turn.
        document.querySelectorAll('[data-sp="words"]').forEach(function (el) {
            Array.prototype.slice.call(el.childNodes).forEach(function (node) {
                if (node.nodeType !== 3) return;
                var frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                    var s = document.createElement('span');
                    s.className = 'ww';
                    s.textContent = part;
                    frag.appendChild(s);
                });
                el.replaceChild(frag, node);
            });
            el._words = el.querySelectorAll('.ww');
        });
        document.querySelectorAll('[data-sp="seq"]').forEach(function (el) {
            el._items = Array.prototype.slice.call(el.children);
        });

        var items = Array.prototype.slice.call(document.querySelectorAll('[data-sp]'));
        var ticking = false;

        function update() {
            ticking = false;
            var vh = window.innerHeight;
            var max = root.scrollHeight - vh;
            root.style.setProperty('--page', max > 0 ? (window.scrollY / max).toFixed(4) : 0);

            for (var n = 0; n < items.length; n++) {
                var el = items[n];
                var mode = el.getAttribute('data-sp');
                var r = el.getBoundingClientRect();
                if (r.bottom < -vh || r.top > vh * 2) continue;
                var p;
                if (mode === 'out') {
                    p = clamp(-r.top / (r.height * 0.85));
                    el.style.setProperty('--sp', p.toFixed(4));
                } else if (mode === 'zoom') {
                    p = clamp((vh - r.top) / (vh + r.height));
                    el.style.setProperty('--sp', p.toFixed(4));
                } else if (mode === 'words') {
                    p = clamp((vh * 0.92 - r.top) / (vh * 0.42));
                    var words = el._words, lit = Math.ceil(p * words.length);
                    for (var w = 0; w < words.length; w++) words[w].classList.toggle('lit', w < lit);
                } else if (mode === 'seq') {
                    p = clamp((vh * 0.92 - r.top) / (vh * 0.4));
                    var kids = el._items, k = kids.length;
                    for (var c = 0; c < k; c++) kids[c].classList.toggle('lit', p * (k + 0.5) >= c + 1);
                } else {
                    p = clamp((vh * 0.95 - r.top) / (vh * 0.55));
                    el.style.setProperty('--sp', p.toFixed(4));
                }
            }

            if (tl && tlFill) {
                var tr = tl.getBoundingClientRect();
                var tp = clamp((vh * 0.65 - tr.top) / tr.height);
                tlFill.style.setProperty('--p', (tp * 100).toFixed(1) + '%');
                var reach = tp * tr.height;
                for (var j = 0; j < roles.length; j++) roles[j].classList.toggle('passed', roles[j].offsetTop <= reach);
            }
        }
        function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        window.addEventListener('load', onScroll);
        update();
    }

    /* ---------- Hero field (after rubricagents.com) ---------- */
    var canvas = document.querySelector('canvas.field');
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var glyphs = '01ABCDEF{}[]<>=+-*/#';
        var cell = 18, cols = 0, rows = 0, drops = [], cw = 0, ch = 0;
        var running = true, last = 0;

        function size() {
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            cw = canvas.clientWidth; ch = canvas.clientHeight;
            canvas.width = cw * dpr; canvas.height = ch * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(cw / cell); rows = Math.ceil(ch / cell);
            drops = [];
            for (var i = 0; i < cols; i++) drops.push({ y: Math.random() * rows, v: 0.04 + Math.random() * 0.08 });
        }
        function draw(t) {
            if (!running) return;
            if (t - last > 45) {
                last = t;
                ctx.clearRect(0, 0, cw, ch);
                ctx.font = '12px "Geist Mono", ui-monospace, monospace';
                for (var i = 0; i < cols; i++) {
                    var d = drops[i];
                    for (var j = 0; j < 7; j++) {
                        var y = Math.floor(d.y) - j;
                        if (y < 0 || y > rows) continue;
                        var a = (1 - j / 7) * 0.22;
                        ctx.fillStyle = j === 0 ? 'rgba(43,179,163,' + (a * 2.2) + ')' : 'rgba(186,192,198,' + a + ')';
                        ctx.fillText(glyphs[(i * 7 + y * 13) % glyphs.length], i * cell, y * cell);
                    }
                    if (!reduce) { d.y += d.v; if (d.y - 7 > rows) d.y = -Math.random() * 10; }
                }
            }
            if (!reduce) requestAnimationFrame(draw);
        }
        size();
        window.addEventListener('resize', size);
        if ('IntersectionObserver' in window && !reduce) {
            new IntersectionObserver(function (e) {
                var vis = e[0].isIntersecting;
                var wasRunning = running;
                running = vis;
                if (vis && !wasRunning) requestAnimationFrame(draw);
            }).observe(canvas);
        }
        requestAnimationFrame(draw);
    }

    /* ---------- Contact form (Google Forms via hidden iframe) ---------- */
    var form = document.getElementById('contact-form');
    var frame = document.getElementById('hidden_iframe');
    var ok = document.getElementById('form-success');
    var submitted = false;
    if (form && frame && ok) {
        form.addEventListener('submit', function () { submitted = true; });
        frame.addEventListener('load', function () {
            if (!submitted) return;
            ok.hidden = false;
            form.reset();
            submitted = false;
            setTimeout(function () { ok.hidden = true; }, 6000);
        });
    }
})();
