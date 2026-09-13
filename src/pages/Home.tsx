import { useEffect, useState } from 'react'
import HomeField from '@/components/HomeField'
import GridView from '@/components/GridView'
import ArchiveModal from '@/components/ArchiveModal'
import { CATS, type ArchiveCase } from '@/types/archive'

function readParams() {
  const p = new URLSearchParams(window.location.search)
  const cat = p.get('cat')
  return {
    cat: CATS.includes(cat as ArchiveCase['cat']) ? (cat as ArchiveCase['cat']) : null,
    openId: p.get('open'),
  }
}

export default function Home() {
  const [cases, setCases] = useState<ArchiveCase[]>([])
  const [cat, setCat] = useState<ArchiveCase['cat'] | null>(() => readParams().cat)
  const [openId, setOpenId] = useState<string | null>(() => readParams().openId)

  useEffect(() => {
    fetch('/data/cases.json')
      .then((r) => r.json())
      .then(setCases)
  }, [])

  useEffect(() => {
    const p = new URLSearchParams()
    if (cat) p.set('cat', cat)
    if (openId) p.set('open', openId)
    const q = p.toString()
    window.history.replaceState(null, '', q ? `?${q}` : window.location.pathname)
  }, [cat, openId])

  const open = openId ? cases.find((c) => c.id === openId) ?? null : null

  return (
    <>
      {cat === null ? (
        <HomeField cases={cases} onPick={(c) => setCat(c)} />
      ) : (
        <GridView cases={cases} cat={cat} onCat={setCat} onOpen={(item) => setOpenId(item.id)} />
      )}
      {open && (
        <ArchiveModal
          item={open}
          all={cases}
          onClose={() => setOpenId(null)}
          onSwap={(item) => setOpenId(item.id)}
        />
      )}
    </>
  )
}
