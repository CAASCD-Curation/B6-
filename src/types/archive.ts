export interface ArchiveCase {
  id: string
  cat: '场' | '物' | '人'
  title: string
  author: string
  year: string
  excerpt: string
  point: string
  note: string
  image: string | null
  sil: string | null
  mode?: 'cutout' | 'panel' | 'abstract'
  fill?: number
}

export const CAT_META: Record<
  ArchiveCase['cat'],
  { en: string; label: string; desc: string }
> = {
  场: {
    en: 'FIELD',
    label: '多元晒场场域',
    desc: '从乡土实体晒场，拓展到城市日常、社会公共、媒介与虚拟场域。',
  },
  物: {
    en: 'OBJECT',
    label: '被晾晒的客体',
    desc: '农耕物产、织物物料、私人旧物——被曝晒、被观看的对象。',
  },
  人: {
    en: 'FIGURE',
    label: '社群与隐喻主体',
    desc: '劳作社群、邻里社群、个体记忆——暴露与遮蔽、记忆与公开。',
  },
}

export const CATS: ArchiveCase['cat'][] = ['场', '物', '人']
