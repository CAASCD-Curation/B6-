import { useEffect, useMemo, useState, type ComponentType } from 'react'
import Sil from './Sil'
import { IconBasket, IconMat, IconRake, IconSieve } from './ToolIcons'
import { CAT_META, type ArchiveCase } from '@/types/archive'

type Tool = 'spread' | 'turn' | 'sieve' | 'gather'

interface Props {
  item: ArchiveCase
  all: ArchiveCase[]
  onClose: () => void
  onSwap: (item: ArchiveCase) => void
}

const TOOLS: { key: Tool; cn: string; en: string; hint: string; Icon: ComponentType<{ className?: string }> }[] = [
  { key: 'spread', cn: '摊', en: 'SPREAD', hint: '摊开全文', Icon: IconMat },
  { key: 'turn', cn: '翻', en: 'TURN', hint: '翻看原影：剪影 → 黑白 → 彩色', Icon: IconRake },
  { key: 'sieve', cn: '筛', en: 'SIEVE', hint: '筛出同源档案', Icon: IconSieve },
  { key: 'gather', cn: '聚', en: 'GATHER', hint: '聚拢同类档案', Icon: IconBasket },
]

export default function ArchiveModal({ item, all, onClose, onSwap }: Props) {
  const [tools, setTools] = useState<Record<Exclude<Tool, 'turn'>, boolean>>({ spread: false, sieve: false, gather: false })
  const [turn, setTurn] = useState<0 | 1 | 2>(0) // 0 剪影 · 1 黑白原影 · 2 彩色原影

  useEffect(() => {
    setTools({ spread: false, sieve: false, gather: false })
    setTurn(0)
  }, [item.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const toggle = (t: Tool) => {
    if (t === 'turn') {
      if (item.image) setTurn((s) => ((s + 1) % 3) as 0 | 1 | 2)
      return
    }
    setTools((s) => ({ ...s, [t]: !s[t] }))
  }

  const related = useMemo(() => {
    if (tools.sieve) {
      const same = all.filter((c) => c.id !== item.id && c.author === item.author)
      const sameYear = all.filter((c) => c.id !== item.id && c.year && c.year === item.year)
      if (same.length >= 2) return { label: `同源 · ${item.author}`, list: same.slice(0, 14) }
      if (sameYear.length >= 1) return { label: `同年 · ${item.year}`, list: sameYear.slice(0, 14) }
      return { label: '同源 · 同年', list: [] }
    }
    if (tools.gather) {
      return { label: `同类 · ${item.cat} ${CAT_META[item.cat].en}`, list: all.filter((c) => c.id !== item.id && c.cat === item.cat).slice(0, 14) }
    }
    return null
  }, [tools.sieve, tools.gather, item, all])

  const meta = CAT_META[item.cat]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭">×</button>

        <div className="modal-visual">
          <Sil item={item} variant={turn === 1 ? 'bw' : turn === 2 ? 'color' : 'sil'} className="modal-sil" strength={1.4} />
          <span className="modal-visual-tag">
            {turn === 0 ? 'SILHOUETTE 剪影' : turn === 1 ? 'ORIGINAL 原影 · 黑白' : 'ORIGINAL 原影 · 彩色'}
          </span>
        </div>

        <div className="modal-info">
          <div className="modal-head">
            <span className="modal-id">{item.id}</span>
            <span className="modal-cat">{item.cat} · {meta.en}</span>
          </div>
          <h2 className="modal-title">{item.title}</h2>
          <div className="modal-meta">
            <span>{item.author}</span>
            {item.year && <span>{item.year}</span>}
          </div>

          {item.point && (
            <div className="modal-block">
              <span className="block-label">关联论点 / LENS</span>
              <p className="block-text">{item.point}</p>
            </div>
          )}

          {tools.spread && (
            <div className="modal-block spread-text">
              <span className="block-label">摊开 / FULL TEXT</span>
              {item.excerpt && <p className="block-text">{item.excerpt}</p>}
              {item.note && <p className="block-text note">{item.note}</p>}
              {!item.excerpt && !item.note && <p className="block-text dim">此条目无更多文本记录。</p>}
            </div>
          )}

          <div className="tool-row">
            {TOOLS.map(({ key, cn, en, hint, Icon }) => (
              <button
                key={key}
                className={`tool ${key === 'turn' ? (turn > 0 ? 'on' : '') : tools[key] ? 'on' : ''}`}
                onClick={() => toggle(key)}
                title={hint}
              >
                <Icon className="tool-icon" />
                <span className="tool-cn">{cn}</span>
                <span className="tool-en">{key === 'turn' && turn > 0 ? (turn === 1 ? 'B/W' : 'COLOR') : en}</span>
              </button>
            ))}
          </div>
          <p className="tool-caption">农具是阅读这条档案的方式 / TOOLS TO READ THIS ARCHIVE</p>
        </div>

        {related && (
          <div className="related-strip">
            <div className="related-label">关联档案 · {related.label}（{related.list.length}）</div>
            {related.list.length === 0 ? (
              <div className="related-empty">未筛出同源或同年档案 —— 试试「聚」聚拢同类。</div>
            ) : (
              <div className="related-items">
                {related.list.map((r) => (
                  <button key={r.id} className="related-item" onClick={() => onSwap(r)} title={r.title}>
                    <Sil item={r} className="related-sil" strength={0.5} />
                    <span className="related-id">{r.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
