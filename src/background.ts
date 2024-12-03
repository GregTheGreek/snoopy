import { ParserRegistry } from './services/ParserRegistry';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    
    ParserRegistry.getParser(url.href).then(parser => {
      if (parser !== null) {
        chrome.tabs.sendMessage(tabId, { type: 'PARSE_PAGE' });
      }
    });
  }
}); 