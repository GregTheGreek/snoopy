import { ReactNode } from "react";

// Define common types used across the extension
export interface WebsiteParser {
  hostname: string;
  parse: (url: Location) => Promise<ParsedData>;
}

export interface ParsedData {
  networkInfo?: NetworkInfo;
  [key: string]: any;
}

export interface NetworkInfo {
  address?: string;
  chainId?: number;
  networkName?: string;
  nonce?: number;
  isActive: boolean;
}

// Type for website-specific configuration
export interface WebsiteConfig {
  selectors: {
    [key: string]: string;
  };
  transforms?: {
    [key: string]: (element: Element) => any;
  };
} 