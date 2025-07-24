import React, { useState, useCallback } from 'react';
import PostUrlInput from './components/PostUrlInput/PostUrlInput';
import ParticipantsList from './components/ParticipantsList/ParticipantsList';
import { mockInstagramService } from './services/mockInstagramService';
import type { Participant } from './components/ParticipantsList/ParticipantsList';
import GiveawayButton from './components/GiveawayButton/GiveawayButton';
import type { GiveawayResult } from './components/GiveawayButton/GiveawayButton';
import Winner from './components/Winner/Winner';
import './App.css';

type AppState = 'input' | 'loading' | 'participants' | 'winner';

interface GiveawayHistory {
  id: string;
  result: GiveawayResult;
  postUrl: string;
}

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPostUrl, setCurrentPostUrl] = useState<string>('');
  const [giveawayResult, setGiveawayResult] = useState<GiveawayResult | null>(null);
  const [error, setError] = useState<string>('');
  const [giveawayHistory, setGiveawayHistory] = useState<GiveawayHistory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analizar publicación de Instagram
  const handleUrlSubmit = useCallback(async (url: string) => {
    setCurrentState('loading');
    setError('');
    setCurrentPostUrl(url);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fetchedParticipants = await mockInstagramService.getParticipants(url);
      
      if (fetchedParticipants.length === 0) {
        setError('No se encontraron comentarios en esta publicación. Verifica que la URL sea correcta y que la publicación tenga comentarios.');
        setCurrentState('input');
        return;
      }

      setParticipants(fetchedParticipants);
      setCurrentState('participants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al analizar la publicación');
      setCurrentState('input');
    }
  }, []);

  // Refrescar participantes
  const handleRefreshParticipants = useCallback(async () => {
    if (!currentPostUrl) return;

    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fetchedParticipants = await mockInstagramService.getParticipants(currentPostUrl);
      setParticipants(fetchedParticipants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al refrescar participantes');
    } finally {
      setIsRefreshing(false);
    }
  }, [currentPostUrl]);

  // Completar giveaway
  const handleGiveawayComplete = useCallback((result: GiveawayResult) => {
    setGiveawayResult(result);
    setCurrentState('winner');
    
    // Agregar al historial
    const historyEntry: GiveawayHistory = {
      id: result.giveawayId,
      result,
      postUrl: currentPostUrl
    };
    
    setGiveawayHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Mantener solo los últimos 10
  }, [currentPostUrl]);

  // Nuevo giveaway
  const handleNewGiveaway = useCallback(() => {
    setCurrentState('input');
    setParticipants([]);
    setCurrentPostUrl('');
    setGiveawayResult(null);
    setError('');
  }, []);

  // Volver a participantes
  const handleBackToParticipants = useCallback(() => {
    setCurrentState('participants');
    setGiveawayResult(null);
  }, []);

  // Guardar resultado (simulado)
  const handleSaveResult = useCallback(async (result: GiveawayResult) => {
    // Simular guardado en base de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Resultado guardado:', result);
    // En una implementación real, aquí harías la llamada al backend
  }, []);

  // Resetear aplicación
  const handleReset = useCallback(() => {
    setCurrentState('input');
    setParticipants([]);
    setCurrentPostUrl('');
    setGiveawayResult(null);
    setError('');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            Lucky
          </h1>
          <p className="app-subtitle">
            Realiza sorteos transparentes y aleatorios con los comentarios de Instagram
          </p>
        </div>
        
        {currentState !== 'input' && (
          <button 
            className="reset-app-button"
            onClick={handleReset}
            data-testid="reset-app"
          >
            ↻ Nueva Publicación
          </button>
        )}
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner" role="alert" data-testid="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              className="error-close"
              onClick={() => setError('')}
              aria-label="Cerrar error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="app-content">
          {currentState === 'input' && (
            <div className="step-container" data-testid="input-step">
              <PostUrlInput 
                onUrlSubmit={handleUrlSubmit}
                isLoading={currentState === 'loading' as AppState}
              />
              
              {giveawayHistory.length > 0 && (
                <div className="history-section">
                  <h3>Sorteos Anteriores</h3>
                  <div className="history-list">
                    {giveawayHistory.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="history-item">
                        <div className="history-winner">
                          👑 @{entry.result.winner.username}
                        </div>
                        <div className="history-details">
                          {entry.result.totalParticipants} participantes • {' '}
                          {new Date(entry.result.timestamp).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentState === 'loading' && (
            <div className="step-container loading-container" data-testid="loading-step">
              <div className="loading-animation">
                <div className="loading-spinner-large"></div>
                <h2>Analizando publicación...</h2>
                <p>Obteniendo comentarios de Instagram</p>
                <div className="loading-steps">
                  <div className="loading-step active">✓ Verificando URL</div>
                  <div className="loading-step active">✓ Conectando con Instagram</div>
                  <div className="loading-step active">⏳ Obteniendo comentarios</div>
                  <div className="loading-step">⏳ Procesando participantes</div>
                </div>
              </div>
            </div>
          )}

          {currentState === 'participants' && (
            <div className="step-container" data-testid="participants-step">
              <div className="participants-header-info">
                <h2>Publicación analizada</h2>
                <p className="post-url">📱 {currentPostUrl}</p>
              </div>
              
              <ParticipantsList 
                participants={participants}
                isLoading={isRefreshing}
                postUrl={currentPostUrl}
                onRefresh={handleRefreshParticipants}
              />
              
              <GiveawayButton 
                participants={participants}
                onGiveawayComplete={handleGiveawayComplete}
                minimumParticipants={1} // Para testing, en producción sería 2+
              />
            </div>
          )}

          {currentState === 'winner' && giveawayResult && (
            <div className="step-container" data-testid="winner-step">
              <Winner 
                giveawayResult={giveawayResult}
                onNewGiveaway={handleNewGiveaway}
                onSaveResult={handleSaveResult}
                showConfetti={true}
              />
              
              <div className="post-giveaway-actions">
                <button 
                  className="back-to-participants"
                  onClick={handleBackToParticipants}
                  data-testid="back-to-participants"
                >
                  ← Ver Participantes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Herramienta para realizar sorteos • 
            Desarrollado con React y TypeScript
          </p>
          <div className="footer-links">
            <span>Hecho con ❤️ para aprender </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;