import Sil from './Sil'
import { CATS, CAT_META, type ArchiveCase } from '@/types/archive'

interface Props {
  cases: ArchiveCase[]
  cat: ArchiveCase['cat']
  onCat: (cat: ArchiveCase['cat'] | null) => void
  onOpen: (item: ArchiveCase) => void
}

/** 分类栅格：剪影卡片 + 跟随光源的投影。 */
export default function GridView({ cases, cat, onCat, onOpen }: Props) {
  const list = cases.filter((c) => c.cat === cat)
  const meta = CAT_META[cat]
  return (
    <div className="grid-view">
      <header className="site-head grid-head">
        <button className="brand as-link" onClick={() => onCat(null)}>
          <span className="brand-cn">晒场档案</span>
          <span className="brand-en">SUNFIELD ARCHIVE</span>
        </button>
        <nav className="cat-tabs">
          {CATS.map((c) => (
            <button
              key={c}
              className={`cat-tab ${c === cat ? 'active' : ''}`}
              onClick={() => onCat(c)}
            >
              <span className="tab-cn">{c}</span>
              <span className="tab-en">{CAT_META[c].en}</span>
              <span className="tab-n">{cases.filter((x) => x.cat === c).length}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="cat-intro">
        <span className="cat-intro-cn">{cat} · {meta.label}</span>
        <span className="cat-intro-desc">{meta.desc}</span>
        <span className="cat-intro-n">{list.length} ENTRIES</span>
      </div>

      <div className="card-grid">
        {list.map((item, i) => (
          <button key={item.id} className="card" onClick={() => onOpen(item)}>
            <span className="card-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="card-id">{item.id}</span>
            <Sil item={item} className="card-sil" strength={0.75} />
            <span className="card-title">{item.title}</span>
            <span className="card-author">{item.author}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
