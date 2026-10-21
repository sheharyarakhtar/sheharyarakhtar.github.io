(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Scroll reveals ---------- */
    var revealables = document.querySelectorAll('.reveal, .steps, .runs');
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
    var counters = document.querySelectorAll('[data-to]');
    function runCounter(el) {
        var to = parseFloat(el.getAttribute('data-to'));
        var pre = el.getAttribute('data-pre') || '';
        var suf = el.getAttribute('data-suf') || '';
        var start = null, dur = 1400;
        function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
        function step(t) {
            if (!start) start = t;
            var k = Math.min(1, (t - start) / dur);
            var eased = 1 - Math.pow(1 - k, 3);
            el.textContent = pre + fmt(to * eased) + suf;
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
        counters.forEach(function (el) { cio.observe(el); });
    }

    /* ---------- Timeline progress ---------- */
    var tl = document.querySelector('.timeline');
    var fill = tl && tl.querySelector('.rail i');
    if (tl && fill && !reduce) {
        var ticking = false;
        function update() {
            var r = tl.getBoundingClientRect();
            var vh = window.innerHeight;
            var p = (vh * 0.65 - r.top) / r.height;
            p = Math.max(0, Math.min(1, p));
            fill.style.setProperty('--p', (p * 100).toFixed(1) + '%');
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ---------- Hero field (after rubricagents.com) ---------- */
    var canvas = document.querySelector('canvas.field');
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var glyphs = '01ABCDEF{}[]<>=+-*/#';
        var cell = 18, cols = 0, rows = 0, drops = [], w = 0, h = 0, dpr = 1;
        var running = true, last = 0;

        function size() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
            drops = [];
            for (var i = 0; i < cols; i++) drops.push({ y: Math.random() * rows, v: 0.04 + Math.random() * 0.08 });
        }
        function draw(t) {
            if (!running) return;
            if (t - last > 45) {
                last = t;
                ctx.clearRect(0, 0, w, h);
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
                    if (!reduce) { d.y += d.v; if (d.y - 7 > rows) { d.y = -Math.random() * 10; } }
                }
            }
            if (!reduce) requestAnimationFrame(draw);
        }
        size();
        window.addEventListener('resize', size);
        if ('IntersectionObserver' in window && !reduce) {
            new IntersectionObserver(function (e) {
                var vis = e[0].isIntersecting;
                if (vis && !running) { running = true; requestAnimationFrame(draw); }
                running = vis;
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
