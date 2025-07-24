import React from 'react';
import './ParticipantsList.css';

export interface Participant {
  id: string;
  username: string;
  comment: string;
  profilePicture?: string;
  timestamp: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  isLoading?: boolean;
  postUrl?: string;
  onRefresh?: () => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  participants, 
  isLoading = false, 
  postUrl,
  onRefresh 
}) => {
  if (isLoading) {
    return (
      <div className="participants-list loading">
        <div className="loading-header">
          <div className="loading-skeleton title"></div>
          <div className="loading-skeleton subtitle"></div>
        </div>
        <div className="loading-participants">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="participant-item loading-item">
              <div className="loading-skeleton avatar"></div>
              <div className="participant-info">
                <div className="loading-skeleton username"></div>
                <div className="loading-skeleton comment"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="participants-list empty">
        <div className="empty-state">
          <h3>No hay participantes</h3>
          <p>
            {postUrl ? 
              'No se encontraron comentarios en esta publicación.' : 
              'Ingresa una URL de Instagram para ver los participantes.'
            }
          </p>
          {postUrl && onRefresh && (
            <button onClick={onRefresh} className="refresh-button">
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="participants-list">
      <div className="participants-header">
        <h3>Participantes del Sorteo</h3>
        <div className="participants-count">
          {participants.length} {participants.length === 1 ? 'participante' : 'participantes'}
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            className="refresh-button small"
            title="Actualizar participantes"
          >
            🔄
          </button>
        )}
      </div>

      <div className="participants-container">
        {participants.map((participant, index) => (
          <div key={participant.id} className="participant-item" data-testid={`participant-${index}`}>
            <div className="participant-avatar">
              {participant.profilePicture ? (
                <img 
                  src={participant.profilePicture} 
                  alt={`${participant.username} profile`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="avatar-fallback" style={{ display: participant.profilePicture ? 'none' : 'flex' }}>
                {participant.username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="participant-info">
              <div className="participant-username">
                @{participant.username}
              </div>
              <div className="participant-comment">
                {participant.comment}
              </div>
              <div className="participant-timestamp">
                {formatTimestamp(participant.timestamp)}
              </div>
            </div>
            
            <div className="participant-number">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="participants-footer">
        <small>
          Los comentarios se actualizaron por última vez: {new Date().toLocaleTimeString('es-ES')}
        </small>
      </div>
    </div>
  );
};

export default ParticipantsList;