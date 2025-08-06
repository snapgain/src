// Tipos globais para Edge Functions
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

// Tipos para as Edge Functions
export interface EdgeFunctionRequest {
  method: string;
  headers: Headers;
  json(): Promise<any>;
  text(): Promise<string>;
}

export interface EdgeFunctionResponse {
  status?: number;
  headers?: Record<string, string>;
}

export interface CorsHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Headers': string;
}

export interface AuthCallbackData {
  user?: any;
  error?: string;
}

export interface UserRegistrationData {
  email: string;
  userData: Record<string, any>;
}

export interface PlatformComparisonData {
  platformData: {
    platforms: string[];
    criteria: Record<string, any>;
  };
}

export interface SubscriptionData {
  userId: string;
  subscriptionType: string;
  paymentData: Record<string, any>;
}

export interface PlatformScore {
  name: string;
  score: number;
  features: string[];
  pricing: {
    affordability: number;
  };
}
