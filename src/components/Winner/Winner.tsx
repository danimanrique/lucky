import React, { useState, useEffect } from 'react';
import './Winner.css';
import type { GiveawayResult } from '../GiveawayButton/GiveawayButton';

interface WinnerProps {
  giveawayResult: GiveawayResult;
  onNewGiveaway?: () => void;
  showConfetti?: boolean;
}

const Winner: React.FC<WinnerProps> = ({ 
  giveawayResult, 
  onNewGiveaway,
  showConfetti = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Animación de entrada con delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`winner-container ${isVisible ? 'visible' : ''}`}>
      {showConfetti && (
        <div className="confetti-container" data-testid="confetti">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      <div className="winner-card">
        <div className="winner-header">
          <h2 className="winner-title">¡TENEMOS GANADOR/A!</h2>
          <div className="winner-subtitle">Sorteo completado exitosamente</div>
        </div>

        <div className="winner-profile">
          <div className="winner-avatar-large">
            {giveawayResult.winner.profilePicture ? (
              <img 
                src={giveawayResult.winner.profilePicture} 
                alt={`${giveawayResult.winner.username} profile`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="avatar-fallback-large" 
              style={{ display: giveawayResult.winner.profilePicture ? 'none' : 'flex' }}
            >
              {giveawayResult.winner.username.charAt(0).toUpperCase()}
            </div>
            <div className="winner-crown">👑</div>
          </div>

          <div className="winner-info-main">
            <div className="winner-username-large">
              @{giveawayResult.winner.username}
            </div>
            <div className="winner-comment-preview">
              "{giveawayResult.winner.comment}"
            </div>
          </div>
        </div>

        <div className="winner-stats">
          <div className="stat-item">
            <div className="stat-number">{giveawayResult.totalParticipants}</div>
            <div className="stat-label">Participantes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {((1 / giveawayResult.totalParticipants) * 100).toFixed(1)}%
            </div>
            <div className="stat-label">Probabilidad</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1</div>
            <div className="stat-label">Ganador</div>
          </div>
        </div>

        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
          data-testid="toggle-details"
        >
          {showDetails ? '▲ Ocultar detalles' : '▼ Ver detalles'}
        </button>

        {showDetails && (
          <div className="winner-details" data-testid="winner-details">
            <div className="detail-row">
              <span className="detail-label">ID del Sorteo:</span>
              <span className="detail-value">{giveawayResult.giveawayId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Fecha y hora:</span>
              <span className="detail-value">{formatDate(giveawayResult.timestamp)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Comentario completo:</span>
              <span className="detail-value">"{giveawayResult.winner.comment}"</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Fecha del comentario:</span>
              <span className="detail-value">
                {new Date(giveawayResult.winner.timestamp).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        )}

        <div className="winner-actions">
          {onNewGiveaway && (
            <button 
              className="tertiary-button new-giveaway-button"
              onClick={onNewGiveaway}
              data-testid="new-giveaway-button"
            >
              🎲 Nuevo Sorteo
            </button>
          )}
        </div>

        <div className="winner-footer">
          <small>
            Este resultado ha sido generado de forma aleatoria y transparente
          </small>
        </div>
      </div>
    </div>
  );
};

export default Winner;