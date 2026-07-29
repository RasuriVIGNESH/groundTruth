import { ContributingArticle } from '../../api/types';
import { formatDate } from '../../utils/formatDate';
import SourceLinkIcon from '../shared/SourceLinkIcon';

export default function ExplanationTrailItem({ article }: { article: ContributingArticle }) {
  return (
    <div className="relative pl-6 py-4 border-b border-[var(--color-line)] last:border-b-0">
      {/* The timeline notch */}
      <div className="absolute left-[-2.5px] top-6 w-[5px] h-[5px] bg-[var(--color-ink)] rounded-full"></div>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-body-sm text-[var(--color-ink-60)]">{article.sourceName}</span>
        <span className="text-data-sm text-[var(--color-ink-30)]">{formatDate(article.publishedDate)}</span>
      </div>
      
      <h4 className="text-body font-semibold text-[var(--color-ink)] mb-2 leading-snug pr-4">
        {article.headline}
      </h4>
      
      <div className="flex items-center gap-3">
        <span className="inline-block px-2 py-0.5 bg-[var(--color-paper)] border border-[var(--color-line)] text-body-sm text-[var(--color-ink)] rounded-sm">
          {article.projectType}
        </span>
        <span className="text-body-sm text-[var(--color-ink-60)] capitalize">
          Impact: {article.impactMagnitude}
        </span>
        <a 
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[var(--color-ink-60)] hover:text-[var(--color-ink)] flex items-center gap-1 text-body-sm"
          title="Open source"
        >
          View <SourceLinkIcon />
        </a>
      </div>
    </div>
  );
}
