import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Ghost, PartyPopper, Angry, Snail, MoneyMouthFace } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onSubmit: (data: { name?: string; responseToQuote: boolean; payment: "yes" | "no" | "late" }) => void;
}

export const RatingDialog = ({ open, onOpenChange, client, onSubmit }: RatingDialogProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [responseToQuote, setResponseToQuote] = useState<boolean | null>(null);
  const [payment, setPayment] = useState<"yes" | "no" | "late" | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  const reset = () => {
    setStep(1);
    setName("");
    setResponseToQuote(null);
    setPayment(null);
    setConfirmed(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!confirmed) {
      toast({
        title: "Errore",
        description: "Devi confermare che le informazioni sono veritiere",
        variant: "destructive",
      });
      return;
    }

    const data = {
      ...(client ? {} : { name }),
      responseToQuote: responseToQuote!,
      payment: payment || "no",
    };

    onSubmit(data);
    handleClose();
    toast({
      title: "Successo",
      description: "Valutazione aggiunta con successo",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && !client && "Aggiungi cliente"}
            {step === 1 && client && client.name}
            {step === 2 && "Ha risposto al tuo preventivo?"}
            {step === 3 && "Sei stato pagato?"}
            {step === 4 && "Tutto vero?"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="p-4 space-y-4">
          {step === 1 && !client && (
            <Input
              placeholder="Nome azienda o progetto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {step === 2 && (
            <div className="flex justify-center gap-4">
              <Button
                variant={responseToQuote === false ? "destructive" : "outline"}
                className="flex-1 h-24"
                onClick={() => {
                  setResponseToQuote(false);
                  setStep(4);
                }}
              >
                <div className="space-y-2">
                  <Ghost className="h-8 w-8 mx-auto" />
                  <span>No</span>
                </div>
              </Button>
              <Button
                variant={responseToQuote === true ? "default" : "outline"}
                className="flex-1 h-24"
                onClick={() => {
                  setResponseToQuote(true);
                  setStep(3);
                }}
              >
                <div className="space-y-2">
                  <PartyPopper className="h-8 w-8 mx-auto" />
                  <span>Sì</span>
                </div>
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex justify-center gap-4">
              <Button
                variant={payment === "no" ? "destructive" : "outline"}
                className="flex-1 h-24"
                onClick={() => {
                  setPayment("no");
                  setStep(4);
                }}
              >
                <div className="space-y-2">
                  <Angry className="h-8 w-8 mx-auto" />
                  <span>No</span>
                </div>
              </Button>
              <Button
                variant={payment === "late" ? "default" : "outline"}
                className="flex-1 h-24"
                onClick={() => {
                  setPayment("late");
                  setStep(4);
                }}
              >
                <div className="space-y-2">
                  <Snail className="h-8 w-8 mx-auto" />
                  <span>Oltre 30 giorni</span>
                </div>
              </Button>
              <Button
                variant={payment === "yes" ? "default" : "outline"}
                className="flex-1 h-24"
                onClick={() => {
                  setPayment("yes");
                  setStep(4);
                }}
              >
                <div className="space-y-2">
                  <MoneyMouthFace className="h-8 w-8 mx-auto" />
                  <span>Sì</span>
                </div>
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Dichiaro che la mia recensione si basa su un'esperienza reale e che le informazioni fornite sono veritiere.
                </label>
              </div>
              <Button
                className="w-full"
                disabled={!confirmed}
                onClick={handleSubmit}
              >
                Pubblica
              </Button>
            </div>
          )}

          {step === 1 && !client && (
            <Button
              className="w-full"
              disabled={!name.trim()}
              onClick={() => setStep(2)}
            >
              Prosegui
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};