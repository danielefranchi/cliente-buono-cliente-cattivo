import { Building, Ghost, PartyPopper, Angry, Snail, MoneyMouthFace } from "lucide-react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface ClientCardProps {
  client: Client;
  onRate: () => void;
}

export const ClientCard = ({ client, onRate }: ClientCardProps) => {
  const ratings = client.ratings;
  const responseRate = ratings.length > 0 
    ? (ratings.filter(r => r.responseToQuote).length / ratings.length) * 100
    : 0;
  const paymentRate = ratings.length > 0
    ? (ratings.filter(r => r.payment === "yes").length / ratings.length) * 100
    : 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Building className="h-8 w-8 text-gray-400" />
        <div>
          <h3 className="font-semibold">{client.name}</h3>
          <p className="text-sm text-gray-500">{ratings.length} valutazioni</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Risponde ai preventivi?</span>
            <div className="flex gap-2">
              <Ghost className="h-4 w-4" />
              <PartyPopper className="h-4 w-4" />
            </div>
          </div>
          <div className="rating-bar">
            <div 
              className="rating-progress rating-progress-good"
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Paga?</span>
            <div className="flex gap-2">
              <Angry className="h-4 w-4" />
              <Snail className="h-4 w-4" />
              <MoneyMouthFace className="h-4 w-4" />
            </div>
          </div>
          <div className="rating-bar">
            <div 
              className="rating-progress rating-progress-good"
              style={{ width: `${paymentRate}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRate} variant="outline" className="w-full">
          Valuta
        </Button>
      </CardFooter>
    </Card>
  );
};