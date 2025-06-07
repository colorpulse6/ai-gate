import { Request } from "express";
import { User, Subscription } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: User & {
    subscription?: Subscription | null;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface StripeWebhookEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: any;
  };
}

export interface AnalyticsEvent {
  event: string;
  metadata?: any;
}
