import { ARTICLES } from "../shared/articles";

const newIds = new Set([
  "legal-action-capacity",
  "employer-liability",
  "real-estate-dispute",
  "marriage-property-system",
  "will-and-testament",
  "neighbor-disputes-noise-water",
  "consumer-protection-refund",
  "car-accident-compensation",
  "statute-of-limitations",
  "co-ownership-property",
]);

for (const article of ARTICLES.filter((item) => newIds.has(item.id))) {
  console.log(`${article.id}\t${article.content.length}`);
}
