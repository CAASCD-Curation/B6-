import { useRef, useState } from 'react'
import { useLightShadow } from '@/lib/light'
import { CATS, CAT_META, type ArchiveCase } from '@/types/archive'

interface Props {
  cases: ArchiveCase[]
  onPick: (cat: ArchiveCase['cat']) => void
}

/** 每个类目的模切贴纸（物体形状） */
const STICKER_ART: Record<ArchiveCase['cat'], { src: string; rot: number; x: number; y: number }> = {
  场: { src: '/stickers/场.png', rot: -5, x: 13, y: 16 },
  物: { src: '/stickers/物.png', rot: 3.5, x: 44, y: 40 },
  人: { src: '/stickers/人.png', rot: -2.5, x: 71, y: 20 },
}

/** 首页：水泥晒场上三枚可拖拽的贴纸，鼠标是光源。 */
export default function HomeField({ cases, onPick }: Props) {
  return (
    <div className="home-field sticker-field">
      <header className="site-head">
        <div className="brand">
          <span className="brand-cn">晒场档案</span>
          <span className="brand-en">SUNFIELD ARCHIVE</span>
        </div>
        <div className="head-meta">
          <span>{cases.length} ENTRIES</span>
          <span className="dim">光 · 影 · 剪影</span>
        </div>
      </header>

      <main className="sticker-area">
        {CATS.map((cat) => (
          <Sticker
            key={cat}
            cat={cat}
            count={cases.filter((c) => c.cat === cat).length}
            onPick={onPick}
          />
        ))}
      </main>

      <footer className="site-foot">
        <span>移动鼠标 —— 移动光源 / MOVE THE CURSOR, MOVE THE LIGHT</span>
        <span className="dim">拖动贴纸随意摆放 · 点按进入档案栅格</span>
      </footer>
    </div>
  )
}

function Sticker({
  cat,
  count,
  onPick,
}: {
  cat: ArchiveCase['cat']
  count: number
  onPick: (c: ArchiveCase['cat']) => void
}) {
  const art = STICKER_ART[cat]
  const meta = CAT_META[cat]
  const shadowRef = useLightShadow<HTMLDivElement>(1.3)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null) // null = 初始百分比位
  const drag = useRef<{ px: number; py: number; ox: number; oy: number; moved: boolean } | null>(null)
  const [lifting, setLifting] = useState(false)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = shadowRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const r = el.getBoundingClientRect()
    drag.current = { px: e.clientX, py: e.clientY, ox: r.left, oy: r.top, moved: false }
    setLifting(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    if (!d.moved && Math.hypot(dx, dy) < 6) return
    d.moved = true
    const area = shadowRef.current?.parentElement?.getBoundingClientRect()
    const w = shadowRef.current?.offsetWidth ?? 0
    const h = shadowRef.current?.offsetHeight ?? 0
    const nx = Math.min(Math.max(d.ox + dx, (area?.left ?? 0) - w * 0.25), (area?.right ?? window.innerWidth) - w * 0.75)
    const ny = Math.min(Math.max(d.oy + dy, (area?.top ?? 0) - h * 0.25), (area?.bottom ?? window.innerHeight) - h * 0.75)
    setPos({ x: nx - (area?.left ?? 0), y: ny - (area?.top ?? 0) })
  }
  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    setLifting(false)
    if (d && !d.moved) onPick(cat)
  }

  return (
    <div
      ref={shadowRef}
      className={`sticker ${lifting ? 'lifting' : ''}`}
      style={
        pos
          ? { left: pos.x, top: pos.y, ['--rot' as string]: `${art.rot}deg` }
          : { left: `${art.x}%`, top: `${art.y}%`, ['--rot' as string]: `${art.rot}deg` }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img src={art.src} alt="" aria-hidden draggable={false} className="sil-shadow sticker-shadow" />
      <img src={art.src} alt={cat} draggable={false} className="sticker-art" />
      <div className="sticker-label">
        <span className="sticker-cn">{cat}</span>
        <span className="sticker-en">{meta.en} · {count}</span>
      </div>
    </div>
  )
}
