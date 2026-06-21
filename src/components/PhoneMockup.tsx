import { MOCK_BOOKS, STATUS_LABELS } from '../content';
import type { ReadStatus } from '../content';

const FILTERS: { value: ReadStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'want', label: 'Want to read' },
    { value: 'reading', label: 'Reading' },
    { value: 'read', label: 'Have read' },
];

/** A CSS-drawn phone showing the app's Read List screen. */
export default function PhoneMockup() {
    return (
        <div className="phone" role="img" aria-label="Word Bank app showing a read list with statuses and word counts">
            <div className="phone-screen">
                <div className="phone-header">Read List</div>

                <div className="phone-filters">
                    {FILTERS.map(({ value, label }) => (
                        <span key={value} className={`phone-pill${value === 'all' ? ' selected' : ''}`}>
                            {label}
                        </span>
                    ))}
                </div>

                <div className="phone-list">
                    {MOCK_BOOKS.map((book) => (
                        <div key={book.title} className="phone-row">
                            <span className="phone-cover" style={{ backgroundColor: book.coverColor }} />
                            <span className="phone-row-info">
                                <span className="phone-row-title">{book.title}</span>
                                <span className="phone-row-author">{book.author}</span>
                                <span className={`phone-status phone-status-${book.status}`}>
                                    {STATUS_LABELS[book.status]}
                                </span>
                            </span>
                            <span className="phone-badge">
                                <span className="phone-badge-count">{book.wordCount}</span>
                                <span className="phone-badge-label">{book.wordCount === 1 ? 'word' : 'words'}</span>
                            </span>
                        </div>
                    ))}
                </div>

                <div className="phone-tabbar">
                    <span>Search</span>
                    <span className="active">Read List</span>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
