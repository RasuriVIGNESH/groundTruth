import { ContributingArticle } from '../../api/types';
import ExplanationTrailItem from './ExplanationTrailItem';

export default function ExplanationTrail({ articles }: { articles: ContributingArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="py-6">
      <h3 className="text-heading text-[var(--color-ink)] mb-4">Explanation Trail</h3>
      <div className="border-l border-[var(--color-line)] ml-2">
        {articles.map((article) => (
          <ExplanationTrailItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
