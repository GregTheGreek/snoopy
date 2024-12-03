import { GnosisSafeParser } from '../parsers/gnosisSafe';
import { ENSResolver } from '../parsers/ensResolver';
import { WebsiteParser } from '../types';

export class ParserRegistry {
  private static parsers: WebsiteParser[] = [
    new GnosisSafeParser(),
    new ENSResolver()
  ];

  // must be href
  static getParser(url: string): WebsiteParser | null {
    return this.parsers.find(parser => parser.canParse(url)) || null;
  }
} 