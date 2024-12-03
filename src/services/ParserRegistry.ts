import { GnosisSafeParser } from '../parsers/gnosisSafe';
import { ENSResolver } from '../parsers/ensResolver';
import { WebsiteParser } from '../types';
import { ParserSettingsService } from './ParserSettingsService';

export class ParserRegistry {
  private static parsers: WebsiteParser[] = [
    new GnosisSafeParser(),
    new ENSResolver()
  ];

  static async getParser(url: string): Promise<WebsiteParser | null> {
    for (const parser of this.parsers) {
      const isEnabled = await ParserSettingsService.isParserEnabled(parser.name);
      if (isEnabled && parser.canParse(url)) {
        return parser;
      }
    }
    return null;
  }

  static getParsers(): WebsiteParser[] {
    return this.parsers;
  }
} 