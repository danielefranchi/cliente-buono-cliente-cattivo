export type Client = {
  id: string;
  name: string;
  ratings: Rating[];
};

export type Rating = {
  id: string;
  responseToQuote: boolean;
  payment: PaymentStatus;
  date: string;
};

export type PaymentStatus = "yes" | "no" | "late";