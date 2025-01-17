import { create } from 'zustand';
import { Client, Rating } from '@/types';

interface ClientStore {
  clients: Client[];
  addClient: (name: string) => void;
  addRating: (clientId: string, rating: Omit<Rating, 'id' | 'date'>) => void;
  searchClients: (query: string) => Client[];
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  addClient: (name) => {
    set((state) => ({
      clients: [
        ...state.clients,
        { id: crypto.randomUUID(), name, ratings: [] }
      ]
    }));
  },
  addRating: (clientId, rating) => {
    set((state) => ({
      clients: state.clients.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            ratings: [
              ...client.ratings,
              {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                ...rating,
              },
            ],
          };
        }
        return client;
      }),
    }));
  },
  searchClients: (query) => {
    const { clients } = get();
    if (!query) return clients;
    return clients.filter((client) =>
      client.name.toLowerCase().includes(query.toLowerCase())
    );
  },
}));