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
    <Card className="w-full relative pb-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="bg-[#F3F4F6] rounded-full p-8 -mt-12">
          <span className="text-4xl">🏢</span>
        </div>
        <div className="text-center">
          <h3 className="font-semibold">{client.name}</h3>
          <p className="text-sm text-gray-500">{ratings.length} valutazioni</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-center w-full">Risponde ai preventivi?</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👻</span>
            <div className="rating-bar flex-1">
              <div 
                className={`rating-progress ${ratings.length > 0 ? (responseRate > 0 ? 'rating-progress-good' : 'rating-progress-bad') : ''}`}
                style={{ width: `${responseRate || (ratings.length > 0 ? 10 : 0)}%` }}
              />
            </div>
            <span>🎉</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-center w-full">Paga?</span>
          </div>
          <div className="flex items-center gap-2">
            <span>😠</span>
            <div className="rating-bar flex-1">
              <div 
                className={`rating-progress ${ratings.length > 0 ? (paymentRate > 0 ? 'rating-progress-good' : 'rating-progress-bad') : ''}`}
                style={{ width: `${paymentRate || (ratings.length > 0 ? 10 : 0)}%` }}
              />
            </div>
            <span>🤑</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button 
          onClick={onRate} 
          variant="outline" 
          className="rounded-full px-8 bg-black hover:bg-white hover:text-black text-white border-2 border-black transition-all"
        >
          Valuta
        </Button>
      </CardFooter>
    </Card>
  );
};