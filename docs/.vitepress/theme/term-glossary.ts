import { parse } from 'yaml'
import glossarySource from '../../../glossary.yaml?raw'

export type GlossaryTerm = {
  id: string
  name: string
  description?: string
  aliases?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

type GlossaryDocument = {
  terms?: GlossaryTerm[]
}

const glossary = parse(glossarySource) as GlossaryDocument

const glossaryTermMap = new Map(
  (glossary.terms ?? []).map((term) => [term.id, term] as const)
)

export function getGlossaryTerm(id?: string) {
  if (!id) return undefined
  return glossaryTermMap.get(id)
}
