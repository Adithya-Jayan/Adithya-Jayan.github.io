(function () {
  'use strict';

  /* ── expose Math as globals (matches original spreading-vines style) ── */
  Object.getOwnPropertyNames(Math).forEach(function (p) { window[p] = Math[p]; });
  window.hypot = Math.hypot || function (a, b) { return sqrt(a * a + b * b); };
  window.sign  = Math.sign  || function (a)    { return a > 0 ? 1 : -1; };

  /* ── config ─────────────────────────────────────────────────────────── */
  var CFG = {
    nPetals:      5,
    bloomTime:    4200,   // ms for a flower to fully open
    maxAge:       13000,  // ms before a vine stops growing
    growthRate:   0.09,   // px per ms (base)
    maxVines:     30,
    maxSeconds:   300,    // total animation length
    maxFT:        80,     // max frame-time clamp
    twistFactor:  11,     // lower → more bends & branches
    branchFactor: 6,
    pFlower:      0.22,   // probability a node spawns a flower
    pLeaf:        0.95,   // probability a node spawns a leaf
    leafGrowTime: 3500,   // ms for a leaf to reach full size
    initVines:    10      // vines seeded from edges
  };

  var c   = document.getElementById('vine-canvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var vines, oldt, elapsed, running;

  function setSize() {
    const width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, window.innerWidth);
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);

    if (c.width !== width || c.height !== height) {
      c.width = width;
      c.height = height;
    }
  }
  setSize();
  window.addEventListener('resize', setSize);

  /* ── edge-spawn helpers ──────────────────────────────────────────────── */
  function edgeSpawn() {
    var edge   = floor(random() * 4);
    var wobble = (random() - 0.5) * 1.3;
    var push   = 0.85 + random() * 0.45;
    var x, y, dx, dy;
    switch (edge) {
      case 0: x = random() * c.width;  y = 0;        dx = wobble;  dy =  push;  break; // top
      case 1: x = random() * c.width;  y = c.height; dx = wobble;  dy = -push;  break; // bottom
      case 2: x = 0;        y = random() * c.height; dx =  push;   dy = wobble; break; // left
      case 3: x = c.width;  y = random() * c.height; dx = -push;   dy = wobble; break; // right
    }
    var l = hypot(dx, dy);
    return { x: x, y: y, dx: dx / l, dy: dy / l };
  }

  function newVine(spawn) {
    var s = spawn || edgeSpawn();
    return {
      color:   { h: random(), s: random(), l: random() },
      root:    { x: s.x, y: s.y },
      stem:    [ { x: s.x + s.dx * 2, y: s.y + s.dy * 2 } ],
      flowers: [],
      leaves:  [],
      age:     0
    };
  }

  function init() {
    vines   = [];
    oldt    = 0;
    elapsed = 30;
    running = true;
    for (var i = 0; i < CFG.initVines; i++) vines.push(newVine());
    requestAnimationFrame(frame);
  }

  function growVine(v) {
    if (v.age > CFG.maxAge) return;
    v.age += elapsed;

    var n    = v.stem.length,
        tip  = v.stem[n - 1],
        prev = v.stem[n - 2] || v.root,
        dx   = tip.x - prev.x,
        dy   = tip.y - prev.y,
        l    = hypot(dx, dy) || 0.001;

    if (random() < 1 / CFG.twistFactor) {
      var qx = 0.5 - tip.x / c.width,
          qy = 0.5 - tip.y / c.height;

      v.stem.push({
        x: tip.x + dx / l + ((n % 2) ? 2 * random() * (abs(qx) > 0.4 ? sign(qx) : sign(random() - 0.5)) : 0),
        y: tip.y + dy / l + ((n % 2) ? random()     * (abs(qy) > 0.4 ? sign(qy) : sign(random() - 0.5)) : 0)
      });

      if (!(n % 2) && random() < CFG.pLeaf) {
        v.leaves.push({
          point: { x: tip.x, y: tip.y },
          angle: random() * 2 * PI,
          size:  18 + random() * 28,
          color: { h: random(), s: random(), l: random() },
          age:   0
        });
      }

      if (!(n % 2)) {
        var r     = random();
        var bProb = 1 / (vines.length * vines.length + CFG.branchFactor);
        if (r < bProb && vines.length < CFG.maxVines) {
          var bdx = dx / l + (random() - 0.5) * 1.2;
          var bdy = dy / l + (random() - 0.5) * 1.2;
          var bl  = hypot(bdx, bdy) || 0.001;
          vines.push(newVine({ x: tip.x, y: tip.y, dx: bdx / bl, dy: bdy / bl }));
        } else if (r < CFG.pFlower) {
          v.flowers.push({
            point: { x: tip.x, y: tip.y },
            angle: PI + atan2(dx, dy),
            color: { h: random(), s: random(), l: random() },
            age:   0
          });
        }
      }
    } else {
      /* Normal extension: slide tip forward, steered away from existing leaf coverage */
      var baseDim = (c.width + c.height) / 2;
      var repX = 0, repY = 0, repRadius = baseDim * 0.05; // 5% of screen
      vines.forEach(function (anyVine) {
        anyVine.leaves.forEach(function (leaf) {
          var ex = tip.x - leaf.point.x,
              ey = tip.y - leaf.point.y,
              ed = hypot(ex, ey);
          if (ed > 0 && ed < repRadius) {
            var w = 1 - ed / repRadius;
            repX += (ex / ed) * w;
            repY += (ey / ed) * w;
          }
        });
      });
      /* Blend repulsion into travel direction, capped to avoid sharp turns */
      var ndx = dx / l, ndy = dy / l;
      var repLen = hypot(repX, repY);
      if (repLen > 0.01) {
        var strength = Math.min(repLen * 0.18, 0.55);
        ndx += (repX / repLen) * strength;
        ndy += (repY / repLen) * strength;
        var nl = hypot(ndx, ndy) || 0.001;
        ndx /= nl; ndy /= nl;
      }
      
      // Scale growth rate to screen size (normalized to 1000px base dimension)
      var scale = baseDim / 1000;
      var d = (CFG.growthRate * scale) * elapsed * (0.5 + random());
      
      tip.x += d * ndx;
      tip.y += d * ndy;
    }

    if (running) {
      v.leaves.forEach(function (leaf) {
        if (leaf.age < CFG.leafGrowTime) leaf.age = Math.min(leaf.age + elapsed, CFG.leafGrowTime);
      });
    }

    if (v.age >= CFG.maxAge && vines.length < CFG.maxVines) {
      vines.push(newVine());
    }
  }

  function paintVine(v) {
    var maturity = Math.min(v.age / CFG.maxAge, 1);
    var h  = 82  + v.color.h * 52;
    var s  = 36  + v.color.s * 32;
    var lv = 18  + v.color.l * 20;

    ctx.save();
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.lineWidth   = 0.5 + 4.5 * maturity;
    ctx.strokeStyle = 'hsl(' + h + ',' + s + '%,' + lv + '%)';
    ctx.shadowColor   = 'hsl(' + h + ',' + s + '%,' + (lv - 8) + '%)';
    ctx.shadowBlur    = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(v.root.x, v.root.y);
    var i, n;
    for (i = 0, n = v.stem.length - 1; i < n; i += 2) {
      ctx.quadraticCurveTo(v.stem[i].x, v.stem[i].y,
                           v.stem[i + 1].x, v.stem[i + 1].y);
    }
    if (i === n) ctx.lineTo(v.stem[i].x, v.stem[i].y);
    ctx.stroke();
    ctx.restore();

    v.leaves.forEach(function (leaf) { paintLeaf(leaf, v); });
    v.flowers.forEach(function (f)   { paintFlower(f, v); });
  }

  function paintLeaf(leaf, v) {
    var rawT     = leaf.age / CFG.leafGrowTime;
    var maturity = 1 - Math.pow(1 - rawT, 3);
    var sz = leaf.size * maturity;
    if (sz < 0.5) return;
    var h  = 88  + (v.color.h + leaf.color.h) * 0.5 * 50;
    var s  = 38  + leaf.color.s * 30;
    var lv = 24  + leaf.color.l * 26;

    ctx.save();
    ctx.translate(leaf.point.x, leaf.point.y);
    ctx.rotate(leaf.angle);

    ctx.fillStyle     = 'hsl(' + h + ',' + s + '%,' + lv + '%)';
    ctx.shadowColor   = 'hsl(' + h + ',' + s + '%,' + (lv - 12) + '%)';
    ctx.shadowBlur    = 6;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-sz * 0.42, -sz * 0.28, -sz * 0.14, -sz * 0.92, 0, -sz);
    ctx.bezierCurveTo( sz * 0.14, -sz * 0.92,  sz * 0.42, -sz * 0.28, 0,  0);
    ctx.closePath();
    ctx.fill();

    /* Midrib vein */
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = 'hsl(' + h + ',' + s + '%,' + (lv - 7) + '%)';
    ctx.lineWidth   = 0.55;
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.lineTo(0, -sz * 0.82);
    ctx.stroke();

    ctx.restore();
  }

  function paintFlower(f, v) {
    var maturity = Math.min(f.age / CFG.bloomTime, 1);
    var h  = ((v.color.h + f.color.h) * 0.5) * 360;
    var s  = 50 + f.color.s * 38;
    var lv = 60 + f.color.l * 24;
    var sigma = ((maturity < 0.505) ? 0.05 : (maturity - 0.5)) * 4 * PI / CFG.nPetals;

    ctx.save();
    ctx.translate(f.point.x, f.point.y);
    ctx.rotate(f.angle);

    for (var j = 0; j < CFG.nPetals; j++) {
      ctx.save();
      ctx.rotate(j * sigma);
      ctx.fillStyle   = 'hsl(' + (h + j * 20) + ',' + s + '%,' + lv + '%)';
      ctx.shadowColor = 'hsl(' + h + ',' + (s - 15) + '%,' + (lv - 30) + '%)';
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.bezierCurveTo(maturity * (-5), 1 + maturity * 4,
                        maturity * (-2), 3 + maturity * 9,
                        0,              3 + maturity * 9);
      ctx.bezierCurveTo(maturity * 2,   3 + maturity * 9,
                        maturity * 5,   1 + maturity * 4,
                        0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    /* Centre pip */
    ctx.beginPath();
    ctx.arc(0, 0, 1.5 + maturity * 2, 0, 2 * PI);
    ctx.fillStyle   = 'hsl(' + (h + 50) + ',88%,' + (lv + 8) + '%)';
    ctx.shadowColor = 'hsl(' + h + ',55%,' + (lv - 22) + '%)';
    ctx.shadowBlur  = 4;
    ctx.fill();

    ctx.restore();

    if (running && f.age < CFG.bloomTime) {
      f.age += elapsed;
      if (f.age > CFG.bloomTime) f.age = CFG.bloomTime;
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    elapsed = oldt ? Math.min(t - oldt, CFG.maxFT) : 30;
    if (running) vines.forEach(growVine);
    vines.forEach(paintVine);
    running = running && (t < (CFG.maxSeconds + 10) * 1000);
    oldt    = t;
    if (running) requestAnimationFrame(frame);
  }

  /* ── 1 Second Delayed Start ── */
  setTimeout(init, 1000);
}());
