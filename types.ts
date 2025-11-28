export interface BusinessData {
  businessName: string;
  address: string;
  segment: string;
  differentiators: string;
  gmbLink: string;
  instagramHandle: string;
  radius: string;
}

export interface Competitor {
  name: string;
  rating: number;
  reviews?: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
  };
}

export interface BenchmarkResult {
  analysisText: string;
  competitors: Competitor[];
  groundingChunks: GroundingChunk[];
}

export enum AppState {
  INPUT,
  LOADING,
  RESULT,
  ERROR
}