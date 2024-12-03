import { ParserRegistry } from './services/ParserRegistry';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const parser = ParserRegistry.getParser(url.href);

    if (parser) {
      chrome.tabs.sendMessage(tabId, { type: 'PARSE_PAGE' });
    }
  }
}); 