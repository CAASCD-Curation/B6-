interface IconProps {
  className?: string
}

/** 摊 —— 竹席 winnowing mat */
export function IconMat({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="8" width="24" height="16" />
      <line x1="4" y1="13.3" x2="28" y2="13.3" />
      <line x1="4" y1="18.6" x2="28" y2="18.6" />
      <line x1="10" y1="8" x2="10" y2="24" />
      <line x1="16" y1="8" x2="16" y2="24" />
      <line x1="22" y1="8" x2="22" y2="24" />
    </svg>
  )
}

/** 翻 —— 耙 rake */
export function IconRake({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="16" y1="3" x2="16" y2="14" />
      <line x1="6" y1="14" x2="26" y2="14" />
      <line x1="7" y1="14" x2="7" y2="28" />
      <line x1="12" y1="14" x2="12" y2="28" />
      <line x1="17" y1="14" x2="17" y2="28" />
      <line x1="22" y1="14" x2="22" y2="28" />
      <line x1="26" y1="14" x2="26" y2="28" />
    </svg>
  )
}

/** 筛 —— 筛子 sieve */
export function IconSieve({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="16" cy="16" r="12" />
      <line x1="6.5" y1="11" x2="25.5" y2="11" strokeWidth="1" />
      <line x1="5" y1="16" x2="27" y2="16" strokeWidth="1" />
      <line x1="6.5" y1="21" x2="25.5" y2="21" strokeWidth="1" />
      <line x1="11" y1="6.5" x2="11" y2="25.5" strokeWidth="1" />
      <line x1="16" y1="5" x2="16" y2="27" strokeWidth="1" />
      <line x1="21" y1="6.5" x2="21" y2="25.5" strokeWidth="1" />
    </svg>
  )
}

/** 聚 —— 筐 gather basket */
export function IconBasket({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 12 L26 12 L22.5 27 L9.5 27 Z" />
      <line x1="8" y1="17" x2="24" y2="17" strokeWidth="1" />
      <line x1="9" y1="22" x2="23" y2="22" strokeWidth="1" />
      <path d="M11 12 C11 5 21 5 21 12" />
    </svg>
  )
}
