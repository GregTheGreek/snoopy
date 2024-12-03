export interface ParserSettings {
  [key: string]: boolean;
}

export class ParserSettingsService {
  private static DEFAULT_SETTINGS: ParserSettings = {
    'GnosisSafeParser': true,
    'ENSResolver': true
  };

  static async getSettings(): Promise<ParserSettings> {
    return new Promise((resolve) => {
      chrome.storage.sync.get('parserSettings', (result) => {
        resolve(result.parserSettings || this.DEFAULT_SETTINGS);
      });
    });
  }

  static async updateSettings(settings: ParserSettings): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ parserSettings: settings }, resolve);
    });
  }

  static async isParserEnabled(parserName: string): Promise<boolean> {
    const settings = await this.getSettings();
    return settings[parserName] ?? true;
  }
} 