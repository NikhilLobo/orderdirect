export interface Restaurant {
  id: string;
  name: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  stripeAccountId: string | null;
  subscriptionStatus: string;
  subscriptionPlan: string;
  createdAt: any;
  updatedAt: any;
}
