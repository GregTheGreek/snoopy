import React from 'react';
import { ParserRegistry } from '../services/ParserRegistry';
import { ParserSettingsService } from '../services/ParserSettingsService';
import type { ParserSettings as ParserSettingsType } from '../services/ParserSettingsService';

export const ParserSettings: React.FC = () => {
  const [settings, setSettings] = React.useState<ParserSettingsType>({});

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentSettings = await ParserSettingsService.getSettings();
    setSettings(currentSettings);
  };

  const handleToggle = async (parserName: string) => {
    const newSettings = {
      ...settings,
      [parserName]: !settings[parserName]
    };
    await ParserSettingsService.updateSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <div className="parser-settings">
      <h3>Parser Settings</h3>
      {ParserRegistry.getParsers().map((parser) => (
        <div key={parser.name} className="parser-toggle">
          <label>
            <input
              type="checkbox"
              checked={settings[parser.name] ?? true}
              onChange={() => handleToggle(parser.name)}
            />
            {parser.name}
          </label>
        </div>
      ))}
    </div>
  );
}; 