// Material card for any kind of supporting file.
// Type can be: PDF | DOCX | PPTX | IMAGE | VIDEO | LINK | DOCUMENT.
// Browsers will display PDFs/IMAGEs inline and offer to download DOCX/PPTX.
export default function MaterialCard({ title, description, url, type = 'DOCUMENT' }) {
  const icon = ICONS[type?.toUpperCase()] || '📄';
  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noreferrer"
      className="material-card"
      onClick={(e) => {
        if (!url || url === '#') {
          e.preventDefault();
          alert('This material is a placeholder. Real file will be linked when published.');
        }
      }}
    >
      <span className="material-card__icon">{icon}</span>
      <div className="material-card__body">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        <span className="material-card__type">{type}</span>
      </div>
      <span className="material-card__arrow">↗</span>
    </a>
  );
}

const ICONS = {
  PDF: '📄',
  DOCX: '📝',
  PPTX: '📊',
  IMAGE: '🖼️',
  VIDEO: '🎬',
  LINK: '🔗',
  DOCUMENT: '📄'
};
