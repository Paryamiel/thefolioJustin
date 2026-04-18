// src/components/PostCard.js
import { Link } from 'react-router-dom';

function PostCard({ title, description, link, linkText }) {
  return (
    <div className="highlight-box">
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to={link} className="preview-link">{linkText} &rarr;</Link>
    </div>
  );
}

export default PostCard;