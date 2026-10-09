(function () {
    var L = '#c4f042', P = '#ff75a0', I = '#6366f1', A = '#fbbf24', M = '#94a3b8';
    var $ = function (s, r) { return (r || document).querySelector(s) };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
    var NS = 'http://www.w3.org/2000/svg';

    function tabs(sel, fn) {
        var box = $(sel);
        $$('button', box).forEach(function (b) {
            b.addEventListener('click', function () {
                $$('button', box).forEach(function (x) { x.classList.remove('on') });
                b.classList.add('on');
                fn(b);
            });
        });
    }

    var tip = $('#tip');
    document.addEventListener('mousemove', function (e) {
        var t = e.target.closest && e.target.closest('[data-tip]');
        if (!t) { tip.style.opacity = 0; return }
        tip.textContent = t.getAttribute('data-tip');
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top = (e.clientY + 14) + 'px';
        tip.style.opacity = 1;
    });

    var secs = $$('.sec'), toc = $('#toc');
    secs.forEach(function (s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.innerHTML = '<span>' + $('.num', s).textContent + '</span>' + $('h2', s).textContent.split(':')[0];
        toc.appendChild(a);
    });
    var links = $$('a', toc);
    function onScroll() {
        var h = document.documentElement;
        $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
        var cur = 0;
        secs.forEach(function (s, i) { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i });
        links.forEach(function (a, i) { a.classList.toggle('on', i === cur) });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    (function () {
        var Q = [
            ['You fill in a sign-up form with your email.', 0],
            ['A website logs which links you click.', 1],
            ['A streaming service guesses you will like thrillers.', 2],
            ['A phone app records your GPS location.', 1],
            ['You post a photo with a caption.', 0],
            ['A bank estimates your credit score from your history.', 2]
        ];
        var names = ['Volunteered', 'Observed', 'Inferred'], i = 0, score = 0, box = $('#quiz-src');
        function show() {
            if (i >= Q.length) {
                box.innerHTML = '<div class="readout">score <b>' + score + ' / ' + Q.length + '</b></div><div class="ctrl" style="margin-top:12px"><button id="q-again">try again</button></div>';
                $('#q-again').onclick = function () { i = 0; score = 0; show() };
                return;
            }
            box.innerHTML = '<div class="readout">' + (i + 1) + ' / ' + Q.length + '</div><p style="font-size:1.1rem;margin:8px 0 14px;color:#f8fafc">' + Q[i][0] + '</p><div class="ctrl">' +
                names.map(function (n, k) { return '<button data-k="' + k + '">' + n + '</button>' }).join('') + '</div><div class="fb" id="q-fb"></div>';
            $$('button', box).forEach(function (b) {
                b.onclick = function () {
                    var ok = +b.dataset.k === Q[i][1];
                    if (ok) score++;
                    $('#q-fb').innerHTML = '<span class="' + (ok ? 'ok' : 'no') + '">' + (ok ? 'correct' : 'not quite, it is ' + names[Q[i][1]].toLowerCase()) + '</span> <button class="btn" id="q-next" style="margin-left:10px">next →</button>';
                    $$('button[data-k]', box).forEach(function (x) { x.disabled = true });
                    $('#q-next').onclick = function () { i++; show() };
                };
            });
        }
        show();
    })();

    (function () {
        var n = 3, d = $('#disc');
        function drawD() {
            var s = '<svg viewBox="0 0 300 70">';
            for (var k = 0; k < 10; k++) s += '<rect x="' + (k * 30 + 2) + '" y="10" width="26" height="40" rx="3" fill="' + (k < n ? L : 'none') + '" stroke="' + (k < n ? L : '#334155') + '"/>';
            s += '</svg>';
            d.innerHTML = '<h5>Discrete · bikes sold today</h5>' + s + '<div class="ctrl" style="margin:10px 0 6px"><button id="d-m">− 1</button><button id="d-p">+ 1</button></div><div class="readout">count = <b>' + n + '</b> (no 2.5 allowed)</div>';
            $('#d-m').onclick = function () { n = Math.max(0, n - 1); drawD() };
            $('#d-p').onclick = function () { n = Math.min(10, n + 1); drawD() };
        }
        drawD();
        var c = $('#cont');
        c.innerHTML = '<h5>Continuous · store temperature</h5><svg viewBox="0 0 300 70"><defs><linearGradient id="tg"><stop offset="0" stop-color="' + I + '"/><stop offset="1" stop-color="' + P + '"/></linearGradient></defs><rect x="2" y="26" width="296" height="12" rx="6" fill="url(#tg)"/><line id="c-m" x1="150" x2="150" y1="14" y2="52" stroke="#fff" stroke-width="3" stroke-linecap="round"/><text x="2" y="66">10</text><text x="278" y="66">40</text></svg><input type="range" id="c-r" min="10" max="40" step="0.1" value="25" aria-label="Temperature"><div class="readout">value = <b id="c-v">25.0</b> °C (any decimal)</div>';
        function upd() { var v = +$('#c-r').value, x = 2 + (v - 10) / 30 * 296; $('#c-m').setAttribute('x1', x); $('#c-m').setAttribute('x2', x); $('#c-v').textContent = v.toFixed(1) }
        $('#c-r').oninput = upd; upd();
    })();

    (function () {
        var out = $('#st-out');
        var V = {
            s: '<div class="tbl" style="margin:0"><table><tr><th>id</th><th>name</th><th>city</th><th>age</th></tr><tr><td class="n">1</td><td>Ali</td><td>Lahore</td><td class="n">21</td></tr><tr><td class="n">2</td><td>Sara</td><td>Karachi</td><td class="n">24</td></tr><tr><td class="n">3</td><td>Omar</td><td>Multan</td><td class="n">30</td></tr></table></div><p class="readout" style="margin-top:12px">fixed columns · stored in MySQL, PostgreSQL · query: <b>SELECT name FROM people WHERE age &gt; 22</b></p>',
            m: '<pre>{\n  <span class="k">"id"</span>: 1,\n  <span class="k">"name"</span>: <span class="s">"Ali"</span>,\n  <span class="k">"city"</span>: <span class="s">"Lahore"</span>,\n  <span class="k">"hobbies"</span>: [<span class="s">"cricket"</span>, <span class="s">"chess"</span>]   <span class="c">// this person has a list, others may not</span>\n}</pre><p class="readout" style="margin-top:12px">keys but flexible shape · JSON, XML · stored in MongoDB or files</p>',
            u: '<div style="position:relative;height:170px;background:var(--deep);border:1px solid var(--line);border-radius:8px;overflow:hidden;font:400 .78rem var(--mono)">' +
                [['IMG_2041.jpg', 6, 14, P], ['"loved the service!!"', 34, 52, L], ['voice_note.mp3', 66, 12, A], ['mp4 · 02:14', 14, 66, I], ['Re: invoice (email)', 52, 78, P], ['@ali: nice one lol', 74, 50, L]].map(function (x) { return '<span style="position:absolute;left:' + x[1] + '%;top:' + x[2] + '%;color:' + x[3] + ';border:1px dashed ' + x[3] + ';padding:2px 8px;border-radius:4px;white-space:nowrap">' + x[0] + '</span>' }).join('') +
                '</div><p class="readout" style="margin-top:12px">no schema · photos, audio, video, text · stored in a data lake · needs ML or text analysis to query</p>'
        };
        function show(k) { out.innerHTML = V[k] }
        tabs('#st-tabs', function (b) { show(b.dataset.k) }); show('s');
    })();

    (function () {
        var out = $('#viz-out'), note = $('#viz-note');
        var N = {
            line: 'Line: best for change over time.',
            bar: 'Bar: best for comparing categories side by side.',
            pie: 'Donut / pie: parts of a whole. Keep it to a few slices.',
            dot: 'Scatter: shows how two variables move together (here the dashed line is the trend).'
        };
        function frame(inner, xl, yl) {
            var g = '';
            [0, 1, 2, 3].forEach(function (k) { g += '<line class="ax" x1="50" x2="580" y1="' + (210 - k * 55) + '" y2="' + (210 - k * 55) + '"/>' });
            return '<svg viewBox="0 0 600 260">' + g + inner + '<text x="580" y="248" text-anchor="end">' + xl + '</text><text x="6" y="14">' + yl + '</text></svg>';
        }
        function arc(cx, cy, a0, a1, ro, ri) {
            var p = function (a, r) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2) };
            var f = a1 - a0 > Math.PI ? 1 : 0;
            return 'M' + p(a0, ro) + 'A' + ro + ' ' + ro + ' 0 ' + f + ' 1 ' + p(a1, ro) + 'L' + p(a1, ri) + 'A' + ri + ' ' + ri + ' 0 ' + f + ' 0 ' + p(a0, ri) + 'Z';
        }
        function draw(c) {
            var h = '', k;
            if (c === 'line') {
                var d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], v = [14, 18, 16, 27, 24, 38, 44], X = function (i) { return 70 + i * 85 }, Y = function (x) { return 210 - x * 3.5 };
                h = '<polyline fill="none" stroke="' + L + '" stroke-width="2.5" stroke-linejoin="round" points="' + v.map(function (y, i) { return X(i) + ',' + Y(y) }).join(' ') + '"/>';
                v.forEach(function (y, i) { h += '<circle cx="' + X(i) + '" cy="' + Y(y) + '" r="5" fill="#0b0b1a" stroke="' + L + '" stroke-width="2" data-tip="' + d[i] + ': ' + y + ' sales"/><text x="' + X(i) + '" y="230" text-anchor="middle">' + d[i] + '</text>' });
                h = frame(h, 'day', 'sales');
            }
            if (c === 'bar') {
                var f = ['Vanilla', 'Choc', 'Mango', 'Straw', 'Mint'], b = [62, 85, 40, 95, 55], hi = 3;
                h = '';
                b.forEach(function (y, i) { h += '<rect x="' + (80 + i * 98) + '" y="' + (210 - y * 1.8) + '" width="58" height="' + (y * 1.8) + '" rx="3" fill="' + (i === hi ? P : I) + '" data-tip="' + f[i] + ': ' + y + ' scoops"/><text x="' + (109 + i * 98) + '" y="230" text-anchor="middle">' + f[i] + '</text>' });
                h = frame(h, 'flavour', 'scoops');
            }
            if (c === 'pie') {
                var s = [['Mobile', 45, L], ['Desktop', 30, I], ['Tablet', 15, A], ['Other', 10, P]], a = -Math.PI / 2;
                h = '<svg viewBox="0 0 600 260">';
                s.forEach(function (x, i) {
                    var a1 = a + x[1] / 100 * Math.PI * 2;
                    h += '<path d="' + arc(170, 130, a, a1 - 0.02, 100, 58) + '" fill="' + x[2] + '" data-tip="' + x[0] + ': ' + x[1] + '%"/>';
                    h += '<rect x="360" y="' + (70 + i * 32) + '" width="14" height="14" rx="3" fill="' + x[2] + '"/><text x="384" y="' + (82 + i * 32) + '" style="fill:#f8fafc">' + x[0] + '  ' + x[1] + '%</text>';
                    a = a1;
                });
                h += '<text x="170" y="134" text-anchor="middle" style="fill:#f8fafc;font-size:13px">visits</text></svg>';
            }
            if (c === 'dot') {
                var xs = [], ys = [];
                for (k = 0; k < 24; k++) { xs.push(1 + k * 0.3); ys.push(35 + k * 2.3 + Math.sin(k * 5.3) * 9) }
                var sx = function (x) { return 60 + (x - 1) / 7 * 500 }, sy = function (y) { return 215 - (y - 30) * 2.6 };
                var n = xs.length, mx = xs.reduce(function (p, q) { return p + q }) / n, my = ys.reduce(function (p, q) { return p + q }) / n, num = 0, den = 0;
                xs.forEach(function (x, i) { num += (x - mx) * (ys[i] - my); den += (x - mx) * (x - mx) });
                var m = num / den, c0 = my - m * mx;
                h = '';
                xs.forEach(function (x, i) { h += '<circle cx="' + sx(x) + '" cy="' + sy(ys[i]) + '" r="5" fill="' + P + '" fill-opacity=".85" data-tip="' + x.toFixed(1) + ' h → score ' + ys[i].toFixed(0) + '"/>' });
                h += '<line x1="' + sx(1) + '" y1="' + sy(c0 + m * 1) + '" x2="' + sx(8) + '" y2="' + sy(c0 + m * 8) + '" stroke="' + L + '" stroke-dasharray="6 5" stroke-width="2"/>';
                h = frame(h, 'hours studied', 'exam score');
            }
            out.innerHTML = h; note.textContent = N[c];
        }
        tabs('#viz-tabs', function (b) { draw(b.dataset.c) }); draw('line');
    })();

    (function () {
        var U = [['KB', 'a text file'], ['MB', 'a photo'], ['GB', 'a film'], ['TB', 'a laptop disk'], ['PB', 'a data centre rack'], ['EB', 'a big platform per day'], ['ZB', 'all of the internet, roughly']];
        var h = '<h5>Volume · each step is ×1000</h5><svg viewBox="0 0 300 150">';
        U.forEach(function (u, i) {
            h += '<text x="2" y="' + (16 + i * 20) + '">' + u[0] + '</text><rect x="30" y="' + (6 + i * 20) + '" width="' + (26 + i * 38) + '" height="13" rx="2" fill="' + (i > 3 ? P : L) + '" fill-opacity="' + (.35 + i * .1) + '" data-tip="' + u[0] + ': ' + u[1] + '"/>';
        });
        $('#v-vol').innerHTML = h + '</svg>';

        $('#v-vel').innerHTML = '<h5>Velocity · events per second</h5><canvas id="vel-c" width="300" height="110" style="cursor:default"></canvas><input type="range" id="vel-r" min="1" max="40" value="8" aria-label="Rate"><div class="readout"><b id="vel-v">8</b> events / s</div>';
        var vc = $('#vel-c'), vx = vc.getContext('2d'), ev = [], rate = 8, last = performance.now(), acc = 0;
        $('#vel-r').oninput = function () { rate = +this.value; $('#vel-v').textContent = rate };
        (function loop(t) {
            var dt = Math.min(.05, (t - last) / 1000); last = t; acc += dt * rate;
            while (acc >= 1) { ev.push({ x: 0, y: 8 + Math.random() * 94 }); acc--; }
            vx.clearRect(0, 0, 300, 110);
            ev = ev.filter(function (e) { e.x += dt * 120; return e.x < 300 });
            ev.forEach(function (e) { vx.fillStyle = e.x > 200 ? L : P; vx.fillRect(e.x, e.y, 5, 5) });
            requestAnimationFrame(loop);
        })(last);

        var T = [['CSV', L], ['SQL table', L], ['JSON', A], ['XML', A], ['image', P], ['video', P], ['audio', P], ['email', P], ['tweet', P], ['sensor log', A]];
        $('#v-var').innerHTML = '<h5>Variety · many shapes at once</h5><div style="display:flex;flex-wrap:wrap;gap:6px;font:500 .74rem var(--mono)">' +
            T.map(function (x) { return '<span style="border:1px solid ' + x[1] + ';color:' + x[1] + ';padding:2px 9px;border-radius:4px">' + x[0] + '</span>' }).join('') +
            '</div><div class="readout" style="margin-top:12px"><span style="color:' + L + '">■</span> structured &nbsp;<span style="color:' + A + '">■</span> semi &nbsp;<span style="color:' + P + '">■</span> unstructured</div>';

        $('#v-ver').innerHTML = '<h5>Veracity · how trustworthy</h5><svg viewBox="0 0 300 130" id="ver-s"></svg><input type="range" id="ver-r" min="0" max="100" value="0" aria-label="Noise"><div class="readout" id="ver-t"></div>';
        var jit = []; for (var i = 0; i < 26; i++) jit.push([Math.sin(i * 12.9898) * 43758.5453 % 1, Math.sin(i * 78.233) * 12345.678 % 1]);
        function ver() {
            var nz = +$('#ver-r').value / 100, pts = [], sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, s = '<line class="ax" x1="10" y1="120" x2="290" y2="120"/><line class="ax" x1="10" y1="10" x2="10" y2="120"/>';
            jit.forEach(function (j, i) {
                var x = i / 25, y = x + j[1] * nz * 1.2, yc = Math.max(-0.3, Math.min(1.3, y));
                pts.push([x, yc]);
                sx += x; sy += yc; sxx += x * x; syy += yc * yc; sxy += x * yc;
                s += '<circle cx="' + (14 + x * 270) + '" cy="' + (115 - yc * 100) + '" r="3.5" fill="' + (nz > .5 ? P : L) + '"/>';
            });
            var n = pts.length, r = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
            $('#ver-s').innerHTML = s;
            $('#ver-t').innerHTML = 'correlation seen = <b>' + r.toFixed(2) + '</b> · ' + (nz < .25 ? 'clean, reliable' : nz < .6 ? 'errors creeping in' : 'can you trust a decision on this?');
        }
        $('#ver-r').oninput = ver; ver();
    })();

    (function () {
        var S = [
            { t: '1 · Ingestion', x: 10, d: 'Collect data from apps, sensors, databases and APIs. It arrives in batches (every hour) or as a stream (continuously).', c: '<span class="c">raw, as it arrived</span>\n  Ali ,21, lahore\n  sara,,KARACHI\n  Ali ,21, lahore' },
            { t: '2 · Transformation', x: 250, d: 'Clean, filter, validate, reformat and combine. Remove duplicates, fix types, fill or drop missing values.', c: '<span class="c">after cleaning</span>\n  <span class="k">name</span>,<span class="k">age</span>,<span class="k">city</span>\n  Ali,21,Lahore\n  Sara,NULL,Karachi' },
            { t: '3 · Storage', x: 490, d: 'Keep the result in a database, data warehouse or data lake where analysts and models can use it.', c: '<span class="c">INSERT INTO people</span>\n  <span class="c">-- ready for SQL, dashboards, ML</span>' }
        ];
        var svg = '<svg viewBox="0 0 720 110" id="pipe-svg">';
        svg += '<line class="ax" x1="0" x2="720" y1="95" y2="95"/>';
        S.forEach(function (s, i) {
            svg += '<g class="stg" data-i="' + i + '" style="cursor:pointer"><rect x="' + s.x + '" y="8" width="220" height="62" rx="8" fill="#0b0b1a" stroke="' + M + '" stroke-opacity=".5"/><text x="' + (s.x + 110) + '" y="44" text-anchor="middle" style="fill:#f8fafc;font-size:13px">' + s.t + '</text></g>';
        });
        svg += '<g id="pk"></g></svg>';
        $('#pipe').innerHTML = svg;
        var act = 0;
        function pick(i) {
            act = i;
            $$('.stg rect', $('#pipe')).forEach(function (r, k) { r.setAttribute('stroke', k === i ? L : M); r.setAttribute('stroke-opacity', k === i ? 1 : .5); r.setAttribute('stroke-width', k === i ? 2 : 1) });
            $('#pipe-out').innerHTML = '<h5>' + S[i].t + '</h5><p style="margin-bottom:10px;color:#d3dbe6">' + S[i].d + '</p><pre style="margin:0">' + S[i].c + '</pre>';
        }
        $$('.stg', $('#pipe')).forEach(function (g) { g.onclick = function () { pick(+g.dataset.i) } });
        pick(0);
        var pk = $('#pk'), dots = [];
        for (var i = 0; i < 9; i++) { var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 5); c.setAttribute('cy', 95); pk.appendChild(c); dots.push(c) }
        (function loop(t) {
            dots.forEach(function (c, i) {
                var x = ((t / 5000 + i / dots.length) % 1) * 720;
                c.setAttribute('cx', x); c.setAttribute('fill', x < 250 ? P : L);
            });
            requestAnimationFrame(loop);
        })(performance.now());

        var F = {
            csv: ['<span class="k">name</span>,<span class="k">age</span>,<span class="k">city</span>\nAli,21,Lahore\nSara,24,Karachi', 'Plain-text rows separated by commas. Simple tables and spreadsheets.'],
            json: ['{\n  <span class="k">"people"</span>: [\n    { <span class="k">"name"</span>: <span class="s">"Ali"</span>, <span class="k">"age"</span>: 21 },\n    { <span class="k">"name"</span>: <span class="s">"Sara"</span>, <span class="k">"age"</span>: 24 }\n  ]\n}', 'Key-value pairs, lightweight. The standard for web APIs.'],
            xml: ['&lt;<span class="k">people</span>&gt;\n  &lt;<span class="k">person</span>&gt;\n    &lt;<span class="k">name</span>&gt;<span class="s">Ali</span>&lt;/<span class="k">name</span>&gt;\n    &lt;<span class="k">age</span>&gt;<span class="s">21</span>&lt;/<span class="k">age</span>&gt;\n  &lt;/<span class="k">person</span>&gt;\n&lt;/<span class="k">people</span>&gt;', 'Nested custom tags. Used in documents and enterprise systems.']
        };
        function fmt(k) { $('#fmt-out').innerHTML = F[k][0]; $('#fmt-note').textContent = F[k][1] }
        tabs('#fmt-tabs', function (b) { fmt(b.dataset.f) }); fmt('csv');
    })();

    (function () {
        var FL = ['Vanilla', 'Chocolate', 'Mango', 'Strawberry'], MO = ['Jan', 'Feb', 'Mar'], CI = ['Lahore', 'Karachi'], R = [];
        FL.forEach(function (f, fi) { MO.forEach(function (m, mi) { CI.forEach(function (c, ci) { R.push({ flavor: f, month: m, city: c, v: 80 + (fi * 37 + mi * 23 + ci * 41) % 90 }) }) }) });
        var g = 'flavor', a = 'sum', lab = { flavor: 'Flavour', month: 'Month', city: 'City' }, al = { sum: 'Sum of scoops', avg: 'Average scoops', count: 'Count of rows' };
        function draw() {
            var m = {};
            R.forEach(function (r) { (m[r[g]] = m[r[g]] || []).push(r.v) });
            var ks = Object.keys(m), val = ks.map(function (k) { var x = m[k]; return a === 'sum' ? x.reduce(function (p, q) { return p + q }) : a === 'avg' ? x.reduce(function (p, q) { return p + q }) / x.length : x.length });
            var mx = Math.max.apply(null, val);
            $('#pv-t').innerHTML = '<tr><th>' + lab[g] + '</th><th>' + al[a] + '</th></tr>' + ks.map(function (k, i) { return '<tr><td>' + k + '</td><td class="n">' + (a === 'avg' ? val[i].toFixed(1) : val[i]) + '<span class="inbar" style="width:' + (val[i] / mx * 140) + 'px"></span></td></tr>' }).join('');
        }
        tabs('#pv-g', function (b) { g = b.dataset.v; draw() });
        tabs('#pv-a', function (b) { a = b.dataset.v; draw() });
        draw();
    })();

    (function () {
        $('#nest').innerHTML = '<svg viewBox="0 0 600 270">' +
            '<circle cx="300" cy="140" r="125" fill="' + I + '" fill-opacity=".12" stroke="' + I + '" data-tip="Machines doing tasks that need human intelligence"/>' +
            '<circle cx="300" cy="175" r="88" fill="' + P + '" fill-opacity=".14" stroke="' + P + '" data-tip="Algorithms that learn patterns from data"/>' +
            '<circle cx="300" cy="205" r="48" fill="' + L + '" fill-opacity=".16" stroke="' + L + '" data-tip="Many-layered neural networks"/>' +
            '<text x="300" y="36" text-anchor="middle" style="fill:#f8fafc;font-size:13px">Artificial intelligence</text>' +
            '<text x="300" y="102" text-anchor="middle" style="fill:#f8fafc;font-size:13px">Machine learning</text>' +
            '<text x="300" y="208" text-anchor="middle" style="fill:#f8fafc;font-size:12px">Deep learning</text></svg>';
    })();

    (function () {
        var seed = [[40, 50], [60, 80], [80, 40], [55, 30], [90, 75], [200, 110], [230, 80], [250, 120], [215, 60], [260, 90]];
        function pts(fn) { return seed.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="' + fn(i) + '"/>' }).join('') }
        var V = {
            sup: ['<svg viewBox="0 0 300 160">' + pts(function (i) { return i < 5 ? L : P }) + '<line x1="145" y1="10" x2="150" y2="150" stroke="' + M + '" stroke-dasharray="5 4"/><circle cx="170" cy="85" r="7" fill="none" stroke="#f8fafc" stroke-width="2"/><text x="182" y="89" style="fill:#f8fafc">? → pink</text><text x="10" y="155">labelled examples</text></svg>',
                '<h3 style="margin-top:0">Supervised</h3><p>Learns from <b>labelled examples</b>: inputs paired with the right answer. Then predicts labels for new data. Classification (spam or not) and regression (house price).</p>'],
            uns: ['<svg viewBox="0 0 300 160">' + pts(function () { return M }) + '<ellipse cx="65" cy="52" rx="48" ry="34" fill="none" stroke="' + L + '" stroke-dasharray="5 4"/><ellipse cx="231" cy="92" rx="48" ry="42" fill="none" stroke="' + P + '" stroke-dasharray="5 4"/><text x="10" y="155">no labels, groups found</text></svg>',
                '<h3 style="margin-top:0">Unsupervised</h3><p>Gets <b>no labels</b> and looks for structure on its own, for example grouping customers with similar behaviour. This is clustering.</p>'],
            rei: ['<svg viewBox="0 0 300 160"><rect x="10" y="55" width="90" height="46" rx="6" fill="none" stroke="' + L + '"/><text x="55" y="83" text-anchor="middle" style="fill:#f8fafc">agent</text><rect x="200" y="55" width="90" height="46" rx="6" fill="none" stroke="' + P + '"/><text x="245" y="83" text-anchor="middle" style="fill:#f8fafc">world</text><path d="M100 66 C140 20 160 20 200 66" fill="none" stroke="' + M + '"/><text x="150" y="30" text-anchor="middle">action</text><path d="M200 92 C160 140 140 140 100 92" fill="none" stroke="' + A + '"/><text x="150" y="150" text-anchor="middle" style="fill:' + A + '">reward / penalty</text></svg>',
                '<h3 style="margin-top:0">Reinforcement</h3><p>An agent learns by <b>trial and error</b>, getting rewards for good actions and penalties for bad ones. Used in game AI and robotics.</p>']
        };
        function show(k) { $('#ml-svg').innerHTML = V[k][0]; $('#ml-txt').innerHTML = V[k][1] }
        tabs('#ml-tabs', function (b) { show(b.dataset.m) }); show('sup');
    })();

    (function () {
        var cv = $('#knn'), cx = cv.getContext('2d'), pts = [], col = [L, P], k = 5;
        function rnd(c, s) { return c + (Math.random() + Math.random() + Math.random() - 1.5) * s }
        function draw(lines) {
            cx.clearRect(0, 0, 800, 340);
            cx.strokeStyle = 'rgba(148,163,184,.12)'; cx.lineWidth = 1;
            for (var g = 0; g <= 800; g += 80) { cx.beginPath(); cx.moveTo(g, 0); cx.lineTo(g, 340); cx.stroke() }
            for (g = 0; g <= 340; g += 85) { cx.beginPath(); cx.moveTo(0, g); cx.lineTo(800, g); cx.stroke() }
            (lines || []).forEach(function (l) { cx.strokeStyle = 'rgba(248,250,252,.45)'; cx.beginPath(); cx.moveTo(l[0], l[1]); cx.lineTo(l[2], l[3]); cx.stroke() });
            pts.forEach(function (p) {
                cx.beginPath(); cx.arc(p.x, p.y, p.n ? 9 : 6, 0, 7);
                if (p.n) { cx.fillStyle = '#0b0b1a'; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = col[p.c]; cx.stroke() }
                else { cx.fillStyle = col[p.c]; cx.fill() }
            });
        }
        function reset() {
            pts = [];
            for (var i = 0; i < 24; i++) { pts.push({ x: rnd(270, 120), y: rnd(170, 110), c: 0 }); pts.push({ x: rnd(530, 120), y: rnd(170, 110), c: 1 }) }
            draw(); $('#knn-msg').textContent = 'Click the plot.';
        }
        cv.addEventListener('click', function (e) {
            var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 800 / r.width, y = (e.clientY - r.top) * 340 / r.height;
            var nb = pts.filter(function (p) { return !p.n }).map(function (p) { return { p: p, d: Math.hypot(p.x - x, p.y - y) } }).sort(function (a, b) { return a.d - b.d }).slice(0, k);
            var v = [0, 0]; nb.forEach(function (t) { v[t.p.c]++ });
            var c = v[1] > v[0] ? 1 : 0;
            pts.push({ x: x, y: y, c: c, n: 1 });
            draw(nb.map(function (t) { return [x, y, t.p.x, t.p.y] }));
            $('#knn-msg').innerHTML = 'of the ' + k + ' nearest, <span style="color:' + L + '">' + v[0] + ' lime</span> and <span style="color:' + P + '">' + v[1] + ' pink</span> → classified <b style="color:' + col[c] + '">' + (c ? 'pink' : 'lime') + '</b>';
        });
        $('#k-r').oninput = function () { k = +this.value; $('#k-v').textContent = k };
        $('#knn-reset').onclick = reset; reset();
    })();

    (function () {
        var S = [
            ['Prepare the data', 'Clean it: remove duplicates, fix wrong types, handle missing values.'],
            ['Split the data', 'Create a learning (training) dataset to train the model and a separate testing dataset to evaluate it.'],
            ['Choose an algorithm', 'Pick it based on the problem to solve: classify, predict a number, find groups.'],
            ['Evaluate on learning data', 'Run the algorithm on the learning data and see how well it fits. Tune and repeat.'],
            ['Test the solution', 'Run it against the test data it has never seen. A big drop in score here signals overfitting.'],
            ['Implement the model', 'Put the model to work in the real system and keep watching its results.']
        ];
        var box = $('#mlp');
        box.innerHTML = '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px" id="mlp-r">' + S.map(function (s, i) { return '<button class="btn" data-i="' + i + '" style="padding:10px 4px;font-size:.9rem">' + (i + 1) + '</button>' }).join('') + '</div><div class="readout" style="margin:8px 0 14px;text-align:center"><span style="color:' + A + '">↺ steps 3 to 5 repeat until the test score is good enough</span></div><div class="panel" id="mlp-d"></div>';
        function pick(i) {
            $$('#mlp-r button').forEach(function (b, k) { b.style.background = k === i ? L : ''; b.style.color = k === i ? '#0b0b1a' : ''; b.style.borderColor = k === i ? L : '' });
            $('#mlp-d').innerHTML = '<h5>Step ' + (i + 1) + ' of 6</h5><h3 style="margin:0 0 6px">' + S[i][0] + '</h3><p style="margin:0">' + S[i][1] + '</p>';
        }
        $$('#mlp-r button').forEach(function (b) { b.onclick = function () { pick(+b.dataset.i) } });
        pick(0);
    })();

    (function () {
        var Q = [
            ['AI is already used in search, translation, fraud detection and recommendations.', true],
            ['AI quality depends on the quality and quantity of its training data.', true],
            ['AI "thinks" like a human.', false, 'Today\'s systems find statistical patterns.'],
            ['AI is always objective.', false, 'It can inherit bias from its data.']
        ];
        $('#ff').innerHTML = Q.map(function (q, i) {
            return '<div style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:10px 0;border-bottom:1px solid var(--line)"><div style="flex:1;min-width:240px">' + q[0] + '<div class="fb" id="ff' + i + '" style="margin:2px 0 0;min-height:0"></div></div><div class="ctrl" style="margin:0"><button data-i="' + i + '" data-a="1">fact</button><button data-i="' + i + '" data-a="0">fiction</button></div></div>';
        }).join('');
        $$('#ff button').forEach(function (b) {
            b.onclick = function () {
                var i = +b.dataset.i, ok = (b.dataset.a === '1') === Q[i][1];
                $('#ff' + i).innerHTML = '<span class="' + (ok ? 'ok' : 'no') + '">' + (ok ? 'correct' : 'wrong') + ' · it is ' + (Q[i][1] ? 'fact' : 'fiction') + (Q[i][2] ? '. ' + Q[i][2] : '') + '</span>';
            };
        });
    })();

    (function () {
        var box = $('#nps');
        box.innerHTML = '<div class="split"><div><label class="readout">promoters (9–10): <b id="np-pv">55</b></label><input type="range" id="np-p" min="0" max="100" value="55"><label class="readout">detractors (0–6): <b id="np-dv">20</b></label><input type="range" id="np-d" min="0" max="100" value="20"><div class="readout">passives (7–8): <b id="np-av">25</b></div></div><div><svg viewBox="0 0 300 60" id="np-s"></svg><div style="font:700 2.6rem var(--head);line-height:1" id="np-n"></div><div class="readout" id="np-l"></div></div></div>';
        var p = $('#np-p'), d = $('#np-d');
        function upd(src) {
            var pv = +p.value, dv = +d.value;
            if (pv + dv > 100) { if (src === p) { pv = 100 - dv; p.value = pv } else { dv = 100 - pv; d.value = dv } }
            var a = 100 - pv - dv, n = pv - dv;
            $('#np-pv').textContent = pv; $('#np-dv').textContent = dv; $('#np-av').textContent = a;
            $('#np-s').innerHTML = '<rect x="0" y="10" width="' + dv * 3 + '" height="26" fill="' + P + '"/><rect x="' + dv * 3 + '" y="10" width="' + a * 3 + '" height="26" fill="' + M + '" fill-opacity=".5"/><rect x="' + (dv + a) * 3 + '" y="10" width="' + pv * 3 + '" height="26" fill="' + L + '"/><text x="0" y="54">detractors</text><text x="300" y="54" text-anchor="end">promoters</text>';
            $('#np-n').textContent = (n > 0 ? '+' : '') + n;
            $('#np-n').style.color = n >= 50 ? L : n >= 0 ? A : P;
            $('#np-l').textContent = 'NPS = ' + pv + '% − ' + dv + '%';
        }
        p.oninput = function () { upd(p) }; d.oninput = function () { upd(d) }; upd(p);
    })();

    (function () {
        var D = [['of businesses call analytics a primary component', 52, 'FinancesOnline, 2022'], ['projected growth in field openings by 2030 (at least)', 22, 'US BLS'], ['employment growth expected in some industries (at least)', 50, 'course text']];
        $('#jobs').innerHTML = D.map(function (r, i) {
            return '<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:12px;font:400 .84rem var(--mono);color:var(--muted);margin-bottom:4px"><span>' + r[0] + '</span><span style="color:#f8fafc">' + r[1] + '%</span></div><div style="height:12px;background:var(--deep);border-radius:6px"><div data-tip="' + r[1] + '% · ' + r[2] + '" style="height:100%;width:' + r[1] + '%;background:' + [L, P, I][i] + ';border-radius:6px"></div></div></div>';
        }).join('');
    })();
})();
