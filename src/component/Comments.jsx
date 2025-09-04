export default function Comments({ comments, loading }) {
  if (loading) {
    return (
      <div className="comments">
        <div className="comment-item skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-body" />
        </div>
        <div className="comment-item skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-body" />
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return <p className="comment-empty">Henüz yorum yok.</p>;
  }

  return (
    <div className="comments">
      {comments.map((c) => (
        <div key={c.id ?? `${c.author}-${c.content}`} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{c.author_name || c.author || 'Anonim'}</span>
            {c.created_at && (
              <time className="comment-time">{new Date(c.created_at).toLocaleDateString()}</time>
            )}
          </div>
          <p className="comment-content">{c.content ?? c.text}</p>
        </div>
      ))}
    </div>
  );
}


