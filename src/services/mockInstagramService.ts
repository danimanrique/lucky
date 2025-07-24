import type { Participant } from '../components/ParticipantsList/ParticipantsList';

// Mock data para simular comentarios de Instagram
const mockComments = [
  "¡Me encanta este producto! 😍",
  "Quiero participar en el sorteo 🙋‍♀️",
  "Looks amazing! Count me in! 🔥",
  "Participo! Gracias por la oportunidad ✨",
  "¡Qué genial! Me apunto al sorteo 🎉",
  "Love it! Hope I win! 💕",
  "Participo desde Argentina! 🇦🇷",
  "¡Increíble! Muchas gracias por el sorteo 🙌",
  "Me gusta mucho, espero tener suerte 🍀",
  "Participating from Spain! 🇪🇸",
  "¡Qué buena pinta! Me apunto 😋",
  "Amazing sorteo! Thank you! 🎁",
  "Participo con muchas ganas 💪",
  "Hope I'm lucky this time! 🤞",
  "¡Me encanta! Participo desde México 🇲🇽",
  "This looks so good! 🤤",
  "Participo! Ojalá tenga suerte 🌟",
  "Count me in! Fingers crossed! 🤗",
  "¡Perfecto! Me apunto al sorteo 👍",
  "Love the design! Participating! 💖"
];

const mockUsernames = [
  "maria_rodriguez",
  "carlos_martinez",
  "ana_lopez",
  "davidfernandez",
  "lucia_garcia",
  "javier_ruiz",
  "carmen_torres",
  "alejandro_vega",
  "natalia_castro",
  "miguel_santos",
  "patricia_jimenez",
  "roberto_herrera",
  "sofia_moreno",
  "fernando_gutierrez",
  "isabella_romero",
  "diego_vargas",
  "camila_rivera",
  "andres_mendoza",
  "valentina_cruz",
  "gabriel_flores",
  "laura_perez",
  "manuel_silva",
  "daniela_ramos",
  "adriana_ortiz",
  "ricardo_guerrero"
];

const generateRandomUser = (): string => {
  return mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
};

const generateRandomComment = (): string => {
  return mockComments[Math.floor(Math.random() * mockComments.length)];
};

const generateRandomTimestamp = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // Últimos 7 días
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const timestamp = new Date(
    now.getTime() - 
    (daysAgo * 24 * 60 * 60 * 1000) - 
    (hoursAgo * 60 * 60 * 1000) - 
    (minutesAgo * 60 * 1000)
  );
  
  return timestamp.toISOString();
};

const generateProfilePicture = (username: string): string | undefined => {
  // 70% de probabilidad de tener foto de perfil
  if (Math.random() < 0.7) {
    // Usar un servicio de avatares placeholder
    return `https://ui-avatars.com/api/?name=${username}&size=150&background=random`;
  }
  return undefined;
};

class MockInstagramService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateInstagramUrl(url: string): boolean {
    const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
  }

  async getParticipants(postUrl: string): Promise<Participant[]> {
    // Simular delay de red
    await this.delay(1000 + Math.random() * 2000);

    // Validar URL
    if (!this.validateInstagramUrl(postUrl)) {
      throw new Error('URL de Instagram inválida');
    }

    // Simular diferentes escenarios
    const scenario = Math.random();
    
    if (scenario < 0.05) {
      // 5% de probabilidad de error de red
      throw new Error('Error de conexión con Instagram. Inténtalo de nuevo.');
    }
    
    if (scenario < 0.1) {
      // 5% de probabilidad de publicación privada
      throw new Error('Esta publicación es privada o no existe.');
    }
    
    if (scenario < 0.15) {
      // 5% de probabilidad de sin comentarios
      return [];
    }

    // Generar número aleatorio de participantes (entre 5 y 50)
    const participantCount = Math.floor(Math.random() * 46) + 5;
    const participants: Participant[] = [];
    const usedUsernames = new Set<string>();

    for (let i = 0; i < participantCount; i++) {
      let username = generateRandomUser();
      
      // Asegurar que no hay usernames duplicados
      while (usedUsernames.has(username)) {
        username = generateRandomUser() + Math.floor(Math.random() * 100);
      }
      usedUsernames.add(username);

      const participant: Participant = {
        id: `participant_${i + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        comment: generateRandomComment(),
        profilePicture: generateProfilePicture(username),
        timestamp: generateRandomTimestamp()
      };

      participants.push(participant);
    }

    // Ordenar por timestamp (más recientes primero)
    participants.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return participants;
  }

  // Método para simular obtener información de la publicación
  async getPostInfo(postUrl: string): Promise<{ title: string; imageUrl: string }> {
    // Simular delay de red
    await this.delay(1000 + Math.random() * 2000);

    // Validar URL
    if (!this.validateInstagramUrl(postUrl)) {
      throw new Error('URL de Instagram inválida');
    }

    // Simular diferentes escenarios
    const scenario = Math.random();
    
    if (scenario < 0.05) {
      // 5% de probabilidad de error de red
      throw new Error('Error de conexión con Instagram. Inténtalo de nuevo.');
    }
    
    if (scenario < 0.1) {
      // 5% de probabilidad de publicación privada
      throw new Error('Esta publicación es privada o no existe.');
    }

    // Simular información de la publicación
    return {
      title: "Sorteo Especial 🎉",
      imageUrl: "https://via.placeholder.com/600x400.png?text=Sorteo+Especial"
    };
  }

}

// exportar instancia del servicio
export const mockInstagramService = new MockInstagramService();
