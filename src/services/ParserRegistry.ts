import { WebsiteParser } from '../types';
import { GnosisSafeParser } from '../parsers/gnosisSafe';

export class ParserRegistry {
  private static parsers: WebsiteParser[] = [new GnosisSafeParser()];

  static getParser(hostname: string): WebsiteParser | null {
    return (
      this.parsers.find((parser) => hostname.includes(parser.hostname)) || null
    );
  }
} 