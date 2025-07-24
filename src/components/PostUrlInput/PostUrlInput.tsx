import React, { useState } from 'react';
import './PostUrlInput.css';

interface PostUrlInputProps {
  onUrlSubmit: (url: string) => void;
  isLoading?: boolean;
}

const PostUrlInput: React.FC<PostUrlInputProps> = ({ onUrlSubmit, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateInstagramUrl = (url: string): boolean => {
    const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Por favor, ingresa una URL');
      return;
    }

    if (!validateInstagramUrl(url)) {
      setError('Por favor, ingresa una URL válida de Instagram (ej: https://instagram.com/p/ABC123)');
      return;
    }

    onUrlSubmit(url.trim());
  };

  return (
    <div className="post-url-input">
      <h2>Realizar Sorteo de Instagram</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-group">
          <label htmlFor="instagram-url">URL de la publicación de Instagram:</label>
          <input
            id="instagram-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/p/ABC123..."
            disabled={isLoading}
            className={error ? 'error' : ''}
          />
          {error && <span className="error-message" role="alert">{error}</span>}
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Analizando...' : 'Analizar Publicación'}
        </button>
      </form>
    </div>
  );
};

export default PostUrlInput;