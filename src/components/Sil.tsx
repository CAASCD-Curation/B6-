import { useLightShadow } from '@/lib/light'
import type { ArchiveCase } from '@/types/archive'

export type SilVariant = 'sil' | 'bw' | 'color'

interface Props {
  item: ArchiveCase
  className?: string
  strength?: number
  variant?: SilVariant
}

/**
 * 剪影 + 单层半调投影。
 * 投影 = 同图的点阵蒙版副本，随鼠标光源平移，与黑色本体质感区分。
 */
export default function Sil({ item, className = '', strength = 1, variant = 'sil' }: Props) {
  const ref = useLightShadow<HTMLDivElement>(strength)
  const isPhoto = variant !== 'sil' && item.image
  const src = isPhoto ? `/${item.image}` : item.sil ? `/${item.sil}` : null
  const shadowSrc = item.sil ? `/${item.sil}` : null
  return (
    <div ref={ref} className={`sil-wrap ${className}`}>
      {/* 半调投影层 */}
      {shadowSrc && (
        <img src={shadowSrc} alt="" aria-hidden draggable={false} loading="lazy" className="sil-shadow" />
      )}
      {src && (
        <img
          src={src}
          alt={item.title}
          draggable={false}
          loading="lazy"
          className={`sil-img ${variant === 'bw' ? 'sil-bw' : ''} ${variant === 'color' ? 'sil-color' : ''}`}
        />
      )}
    </div>
  )
}
