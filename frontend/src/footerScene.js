// Blue-hour circuit landscape for the footer: hills etched with PCB traces,
// amber signal pulses running along them, drifting "fireflies" and a few stars.
export function startScene(cv, reduce) {
  const cx = cv.getContext('2d')
  let W = 1, H = 1, D = 1, raf = 0, traces = []
  let seed = 7
  const R = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647 }
  const stars = Array.from({ length: 46 }, () => ({ x: R(), y: R() * .46, p: R() * 6.3, s: .6 + R() * 1.1 }))
  const flies = Array.from({ length: 30 }, () => ({ x: R(), y: .58 + R() * .4, a: R() * 6.3, sp: .15 + R() * .4, r: 1.4 + R() * 2.2, ph: R() * 6.3 }))

  // y (0..1 of height) of each hill layer at x (0..1)
  const hill = [
    x => .60 + .03 * Math.sin(x * 4.2 + .6) + .015 * Math.sin(x * 9),
    x => .70 + .045 * Math.sin(x * 3.1 + 2) + .02 * Math.sin(x * 7.3) - .04 * x,
    x => .95 - .40 * Math.pow(Math.max(0, 1 - x / .56), 1.6) + .012 * Math.sin(x * 14),
  ]
  const tint = [['#9a95d2', '#7f7bc0'], ['#6b69b0', '#4c4b94'], ['#34357a', '#1d1e4f']]

  function build() {
    traces = []
    for (const layer of [1, 2]) {
      for (let i = 0; i < 11; i++) {
        let x = R() * W, y = hill[layer](x / W) * H + 10 + R() * (H * .1)
        const pts = [[x, y]]
        let horiz = R() < .5
        for (let k = 0; k < 4 + (R() * 3 | 0); k++) {
          const len = (.04 + R() * .12) * (horiz ? W : H)
          const dir = R() < .5 ? -1 : 1
          if (horiz) x += len * dir; else y += len * dir * .6
          pts.push([x, y]); horiz = !horiz
        }
        let total = 0; const seg = []
        for (let k = 1; k < pts.length; k++) { const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(l); total += l }
        traces.push({ layer, pts, seg, total, sp: .05 + R() * .07, ph: R() })
      }
    }
  }
  function size() {
    D = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight
    cv.width = W * D; cv.height = H * D; seed = 11; build()
  }
  const hillPath = l => {
    cx.beginPath(); cx.moveTo(0, H)
    for (let x = 0; x <= W; x += 6) cx.lineTo(x, hill[l](x / W) * H)
    cx.lineTo(W, H); cx.closePath()
  }
  const at = (t, u) => {
    let d = u * t.total
    for (let k = 0; k < t.seg.length; k++) {
      if (d <= t.seg[k]) { const f = d / t.seg[k]; return [t.pts[k][0] + (t.pts[k + 1][0] - t.pts[k][0]) * f, t.pts[k][1] + (t.pts[k + 1][1] - t.pts[k][1]) * f] }
      d -= t.seg[k]
    }
    return t.pts[t.pts.length - 1]
  }
  const glow = (x, y, r, rgb, a) => {
    const g = cx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`)
    cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  function draw(t) {
    cx.setTransform(D, 0, 0, D, 0, 0)
    const sky = cx.createLinearGradient(0, 0, 0, H * .66)
    sky.addColorStop(0, '#7e8ed6'); sky.addColorStop(.4, '#a8a6e0'); sky.addColorStop(.75, '#d8a9d6'); sky.addColorStop(1, '#f0b6c9')
    cx.fillStyle = sky; cx.fillRect(0, 0, W, H)
    for (const s of stars) { glow(s.x * W, s.y * H, 5 * s.s, '255,255,255', .35 + .35 * Math.sin(t * 1.3 + s.p)); cx.fillStyle = 'rgba(255,255,255,.9)'; cx.fillRect(s.x * W, s.y * H, s.s, s.s) }
    for (let l = 0; l < 3; l++) {
      const g = cx.createLinearGradient(0, H * .5, 0, H); g.addColorStop(0, tint[l][0]); g.addColorStop(1, tint[l][1])
      hillPath(l); cx.fillStyle = g; cx.fill()
      if (l > 0) {
        cx.save(); hillPath(l); cx.clip()
        cx.strokeStyle = 'rgba(190,215,255,.06)'; cx.lineWidth = 1; cx.beginPath()
        for (let x = 0; x < W; x += 22) { cx.moveTo(x, H * .5); cx.lineTo(x, H) }
        for (let y = H * .5; y < H; y += 22) { cx.moveTo(0, y); cx.lineTo(W, y) }
        cx.stroke()
        cx.lineJoin = 'round'
        for (const tr of traces) {
          if (tr.layer !== l) continue
          cx.strokeStyle = l === 2 ? 'rgba(120,225,255,.30)' : 'rgba(180,205,255,.22)'; cx.lineWidth = 1.3
          cx.beginPath(); tr.pts.forEach((p, k) => (k ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1]))); cx.stroke()
          const p0 = tr.pts[0]; cx.strokeStyle = 'rgba(160,230,255,.4)'; cx.beginPath(); cx.arc(p0[0], p0[1], 3, 0, 7); cx.stroke()
          const u = (t * tr.sp + tr.ph) % 1, p = at(tr, u)
          glow(p[0], p[1], 14, '255,196,110', .9); cx.fillStyle = '#fff1cf'; cx.beginPath(); cx.arc(p[0], p[1], 1.8, 0, 7); cx.fill()
        }
        cx.restore()
      }
    }
    for (const f of flies) {
      const x = (f.x + Math.sin(t * f.sp + f.a) * .03) * W, y = (f.y + Math.cos(t * f.sp * 1.3 + f.a) * .025) * H
      glow(x, y, 9 * f.r, '255,205,120', (.35 + .45 * Math.sin(t * 1.6 + f.ph)) * .9)
    }
  }
  const t0 = performance.now()
  const frame = now => { draw((now - t0) / 1000); raf = requestAnimationFrame(frame) }
  size(); addEventListener('resize', size)
  if (reduce) draw(3); else raf = requestAnimationFrame(frame)
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
}
