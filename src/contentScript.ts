import { ParserRegistry } from './services/ParserRegistry';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PARSE_PAGE') {
    chrome.runtime.sendMessage({
      type: 'PARSING_STATUS',
      status: 'loading'
    });

    setTimeout(async () => {
      const parser = await ParserRegistry.getParser(window.location.href);
      
      if (parser) {
        try {
          const data = await parser.parse(window.location);
          chrome.runtime.sendMessage({
            type: 'PARSED_DATA',
            data: data
          });
          chrome.runtime.sendMessage({
            type: 'PARSING_STATUS',
            status: 'complete'
          });
        } catch (error) {
          console.error('Parsing error:', error);
          chrome.runtime.sendMessage({
            type: 'PARSING_STATUS',
            status: 'error',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      } else {
        chrome.runtime.sendMessage({
          type: 'PARSING_STATUS',
          status: 'error',
          error: 'No parser available for this site'
        });
      }
    }, 1000);
  }
  return true;
});

// Initial parse
console.log('[ContentScript] Script loaded, attempting initial parse');
(async () => {
  const parser = await ParserRegistry.getParser(window.location.href);
  if (parser) {
    console.log('[ContentScript] Parser found, starting parse');
    try {
      const data = await parser.parse(window.location);
      console.log('[ContentScript] Parse completed:', data);
      chrome.runtime.sendMessage({
        type: 'PARSED_DATA',
        data: data
      });
    } catch (error) {
      console.error('[ContentScript] Parse error:', error);
    }
  } else {
    console.log('[ContentScript] No parser found for current URL');
  }
})(); 