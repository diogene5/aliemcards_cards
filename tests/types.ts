interface CardSummary {
  slug?: string,
  title: string,
  authors: [string],
  created: string,
  updates: [string],
  categories: [string]
}

interface Card extends CardSummary {
  body: string
}

interface Taxonomy {
  slug?: string,
  name: string,
  cards: [Card]
}
