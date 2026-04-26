import dayjs from 'dayjs';

export const tournamentData = [
  // --- TOURNOIS EN ATTENTE DE JOUEURS (Inscription Ouverte) ---
  {
    name: "Grand Master Invitational",
    location: "Bruxelles",
    playerMin: 4,
    playerMax: 16,
    eloMin: 1800,
    eloMax: 3000,
    isWoman: false,
    status: 'en attente de joueurs',
    endInscriptionDate: dayjs().add(15, 'day').toDate(),
  },
  {
    name: "Open de Charleroi",
    location: "Charleroi",
    playerMin: 8,
    playerMax: 64,
    eloMin: 0,
    eloMax: 3000,
    isWoman: false,
    status: 'en attente de joueurs',
    endInscriptionDate: dayjs().add(10, 'day').toDate(),
  },
  {
    name: "Tournoi des Espoirs (U18)",
    location: "En ligne",
    playerMin: 4,
    playerMax: 20,
    eloMin: 0,
    eloMax: 1500,
    isWoman: false,
    status: 'en attente de joueurs',
    endInscriptionDate: dayjs().add(5, 'day').toDate(),
  },

  // --- TOURNOIS RÉSERVÉS (isWoman: true) ---
  {
    name: "Queen's Gambit Trophy",
    location: "Liège",
    playerMin: 4,
    playerMax: 24,
    eloMin: 1000,
    eloMax: 2500,
    isWoman: true,
    status: 'en attente de joueurs',
    endInscriptionDate: dayjs().add(20, 'day').toDate(),
  },
  {
    name: "Championnat Féminin Amateur",
    location: "En ligne",
    playerMin: 2,
    playerMax: 10,
    eloMin: 0,
    eloMax: 1200,
    isWoman: true,
    status: 'en attente de joueurs',
    endInscriptionDate: dayjs().add(2, 'day').toDate(),
  },

  // --- TOURNOIS EN COURS ---
  {
    name: "Blitz Battle Night",
    location: "En ligne",
    playerMin: 4,
    playerMax: 12,
    eloMin: 1400,
    eloMax: 2800,
    isWoman: false,
    status: 'en cours',
    endInscriptionDate: dayjs().subtract(1, 'day').toDate(),
    currentRound: 2
  },
  {
    name: "Master Series - Round 1",
    location: "Namur",
    playerMin: 2,
    playerMax: 8,
    eloMin: 2000,
    eloMax: 3000,
    isWoman: false,
    status: 'en cours',
    endInscriptionDate: dayjs().subtract(5, 'day').toDate(),
    currentRound: 1
  },

  // --- TOURNOIS TERMINÉS ---
  {
    name: "Winter Chess Open 2023",
    location: "Mons",
    playerMin: 10,
    playerMax: 50,
    eloMin: 0,
    eloMax: 3000,
    isWoman: false,
    status: 'terminé',
    endInscriptionDate: dayjs().subtract(60, 'day').toDate(),
  },
  {
    name: "Tournoi Débutant Été",
    location: "En ligne",
    playerMin: 2,
    playerMax: 16,
    eloMin: 0,
    eloMax: 1000,
    isWoman: false,
    status: 'terminé',
    endInscriptionDate: dayjs().subtract(100, 'day').toDate(),
  },
  {
    name: "Tournoi de Qualification Express",
    location: "Anvers",
    playerMin: 4,
    playerMax: 8,
    eloMin: 1200,
    eloMax: 1800,
    isWoman: false,
    status: 'terminé',
    endInscriptionDate: dayjs().subtract(10, 'day').toDate(),
  }
];