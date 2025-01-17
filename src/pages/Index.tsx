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
      const newClient = searchClients(data.name)[0];
      if (newClient) {
        addRating(newClient.id, {
          responseToQuote: data.responseToQuote,
          payment: data.payment,
        });
      }
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
          <img 
            src="/lovable-uploads/8bfc7c19-178d-4260-a16b-483a85ba69e1.png" 
            alt="Cliente buono/cattivo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2 font-sans">
            Scopri se un cliente risponde al tuo preventivo
          </h1>
          <p className="text-gray-600 mb-8 text-xl font-sans">e se paga davvero.</p>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          {search && filteredClients.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                {search} non è valutato!
              </h2>
              <p className="text-gray-600 mb-4">Bisogna aggiungerlo!</p>
              <Button onClick={() => handleOpenDialog()} className="bg-black hover:bg-black/90">
                Aggiungi cliente
              </Button>
            </div>
          )}

          {!search && (
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
          )}
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