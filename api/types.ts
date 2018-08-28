interface Author {
  author: string
}

interface RawFrontMatter {
  title: string,
  authors: Author[],
  created: string,
  updated: string,
  categories: string[],
  body: string
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
