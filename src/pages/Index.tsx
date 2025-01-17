import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ClientCard } from "@/components/ClientCard";
import { RatingDialog } from "@/components/RatingDialog";
import { useClientStore } from "@/lib/store";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const { clients, addClient, addRating, searchClients } = useClientStore();

  const filteredClients = searchClients(search);
  const goodClients = filteredClients.filter((client) => {
    const ratings = client.ratings;
    if (ratings.length === 0) return false;
    const goodRatings = ratings.filter(
      (r) => r.responseToQuote && r.payment === "yes"
    );
    return goodRatings.length / ratings.length >= 0.5;
  });
  const badClients = filteredClients.filter((client) => {
    const ratings = client.ratings;
    if (ratings.length === 0) return false;
    const goodRatings = ratings.filter(
      (r) => r.responseToQuote && r.payment === "yes"
    );
    return goodRatings.length / ratings.length < 0.5;
  });

  const handleOpenDialog = (client?: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleSubmitRating = (data: {
    name?: string;
    responseToQuote: boolean;
    payment: "yes" | "no" | "late";
  }) => {
    if (!selectedClient) {
      if (!data.name) return;
      addClient(data.name);
      const newClient = clients[clients.length - 1];
      addRating(newClient.id, {
        responseToQuote: data.responseToQuote,
        payment: data.payment,
      });
    } else {
      addRating(selectedClient.id, {
        responseToQuote: data.responseToQuote,
        payment: data.payment,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Scopri se un cliente risponde al tuo preventivo
          </h1>
          <p className="text-gray-600 mb-8">e se paga davvero.</p>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {search && filteredClients.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              {search} non è valutato!
            </h2>
            <p className="text-gray-600 mb-4">Bisogna aggiungerlo!</p>
            <Button onClick={() => handleOpenDialog()}>Aggiungi cliente</Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              ✨ Migliori clienti ✨
            </h2>
            <div className="space-y-4">
              {goodClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onRate={() => handleOpenDialog(client)}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              🚫 Evitali 🚫
            </h2>
            <div className="space-y-4">
              {badClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onRate={() => handleOpenDialog(client)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <RatingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={selectedClient}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default Index;