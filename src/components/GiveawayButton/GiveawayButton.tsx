import React, { useState } from 'react';
import './GiveawayButton.css';
import type { Participant } from '../ParticipantsList/ParticipantsList';

export interface GiveawayResult {
  winner: Participant;
  timestamp: string;
  totalParticipants: number;
  giveawayId: string;
}

interface GiveawayButtonProps {
  participants: Participant[];
  onGiveawayComplete: (result: GiveawayResult) => void;
  disabled?: boolean;
  minimumParticipants?: number;
}

const GiveawayButton: React.FC<GiveawayButtonProps> = ({ 
  participants, 
  onGiveawayComplete,
  disabled = false,
  minimumParticipants = 2
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'revealing' | 'complete'>('idle');

  const canRunGiveaway = participants.length >= minimumParticipants && !disabled && !isRunning;

  const generateGiveawayId = (): string => {
    return `giveaway_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getRandomParticipant = (): Participant => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
  };

  const runGiveawayAnimation = async (): Promise<void> => {
    const ANIMATION_DURATION = 3000; // 3 segundos
    const SPIN_INTERVAL = 100; // Cambiar cada 100ms

    setAnimationPhase('spinning');

    // Fase de spinning - mostrar participantes aleatorios rápidamente
    const spinningPromise = new Promise<void>((resolve) => {
      const spinInterval = setInterval(() => {
        setCurrentWinner(getRandomParticipant());
      }, SPIN_INTERVAL);

      setTimeout(() => {
        clearInterval(spinInterval);
        resolve();
      }, ANIMATION_DURATION);
    });

    await spinningPromise;

    // Seleccionar ganador final
    const finalWinner = getRandomParticipant();
    setCurrentWinner(finalWinner);
    setAnimationPhase('revealing');

    // Pequeña pausa para el efecto dramático
    await new Promise(resolve => setTimeout(resolve, 500));

    setAnimationPhase('complete');

    // Crear resultado del giveaway
    const result: GiveawayResult = {
      winner: finalWinner,
      timestamp: new Date().toISOString(),
      totalParticipants: participants.length,
      giveawayId: generateGiveawayId()
    };

    onGiveawayComplete(result);
  };

  const handleGiveawayClick = async () => {
    if (!canRunGiveaway) return;

    setIsRunning(true);
    setCurrentWinner(null);
    setAnimationPhase('idle');

    try {
      await runGiveawayAnimation();
    } catch (error) {
      console.error('Error durante el sorteo:', error);
      setAnimationPhase('idle');
      setCurrentWinner(null);
    } finally {
      setIsRunning(false);
    }
  };

  const resetGiveaway = () => {
    setAnimationPhase('idle');
    setCurrentWinner(null);
  };

  const getButtonText = (): string => {
    if (participants.length < minimumParticipants) {
      return `Mínimo ${minimumParticipants} participantes`;
    }
    if (isRunning) {
      switch (animationPhase) {
        case 'spinning':
          return 'Sorteando...';
        case 'revealing':
          return '¡Tenemos ganador!';
        case 'complete':
          return 'Sorteo Completado!';
        default:
          return 'Sorteando...';
      }
    }
    return `Realizar Sorteo (${participants.length} participantes)`;
  };

  const getButtonClass = (): string => {
    const baseClass = 'giveaway-button';
    const classes = [baseClass];

    if (!canRunGiveaway) classes.push('disabled');
    if (isRunning) classes.push('running');
    if (animationPhase === 'complete') classes.push('complete');

    return classes.join(' ');
  };

  return (
    <div className="giveaway-container">
      <div className="giveaway-info">
        <h3>Realizar Sorteo</h3>
        <p>
          {participants.length === 0 
            ? 'No hay participantes para sortear'
            : `${participants.length} participante${participants.length !== 1 ? 's' : ''} listo${participants.length !== 1 ? 's' : ''} para el sorteo`
          }
        </p>
      </div>

      {/* Área de animación del ganador */}
      {(isRunning || currentWinner) && (
        <div className={`winner-animation ${animationPhase}`} data-testid="winner-animation">
          {currentWinner && (
            <div className="winner-card">
              <div className="winner-avatar">
                {currentWinner.profilePicture ? (
                  <img 
                    src={currentWinner.profilePicture} 
                    alt={`${currentWinner.username} profile`}
                  />
                ) : (
                  <div className="avatar-fallback">
                    {currentWinner.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="winner-info">
                <div className="winner-username">@{currentWinner.username}</div>
                {animationPhase === 'complete' && (
                  <div className="winner-label">🎉 ¡GANADOR! 🎉</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="giveaway-actions">
        <button
          onClick={handleGiveawayClick}
          disabled={!canRunGiveaway}
          className={getButtonClass()}
          data-testid="giveaway-button"
        >
          <span className="button-text">{getButtonText()}</span>
          {isRunning && (
            <div className="loading-spinner" data-testid="loading-spinner"></div>
          )}
        </button>

        {animationPhase === 'complete' && (
          <button
            onClick={resetGiveaway}
            className="reset-button"
            data-testid="reset-button"
          >
            Nuevo Sorteo
          </button>
        )}
      </div>

      {participants.length > 0 && participants.length < minimumParticipants && (
        <div className="warning-message" role="alert">
          ⚠️ Se necesitan al menos {minimumParticipants} participantes para realizar un sorteo
        </div>
      )}

      {participants.length > 0 && (
        <div className="giveaway-stats">
          <small>
            Probabilidad por participante: {((1 / participants.length) * 100).toFixed(2)}%
          </small>
        </div>
      )}
    </div>
  );
};

export default GiveawayButton;