interface RawFrontMatter {
  title: string,
  authors: string[],
  created: string,
  updated: string,
  categories: string[]
}

interface CardSummary {
  slug?: string
  title: string,
  authors: string[],
  created: string,
  updated: string,
  categories: Taxonomy[]
}

interface Card extends CardSummary {
  body: string
}

interface Taxonomy {
  slug?: string,
  name: string,
  cards?: Card[]
}
