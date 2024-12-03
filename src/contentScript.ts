import { ParserRegistry } from './services/ParserRegistry';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PARSE_PAGE') {
    // Notify that parsing has started
    chrome.runtime.sendMessage({
      type: 'PARSING_STATUS',
      status: 'loading'
    });

    // Add initial delay to let the page load
    setTimeout(() => {
      const parser = ParserRegistry.getParser(window.location.href);
      
      if (parser) {
        parser.parse(window.location)
          .then(data => {
            // First send the parsed data
            chrome.runtime.sendMessage({
              type: 'PARSED_DATA',
              data: data
            });
            
            // Then immediately send completion status
            chrome.runtime.sendMessage({
              type: 'PARSING_STATUS',
              status: 'complete'
            });
          })
          .catch(error => {
            console.error('Parsing error:', error);
            chrome.runtime.sendMessage({
              type: 'PARSING_STATUS',
              status: 'error',
              error: error.message
            });
          });
      } else {
        chrome.runtime.sendMessage({
          type: 'PARSING_STATUS',
          status: 'error',
          error: 'No parser available for this site'
        });
      }
    }, 1000);
  }
  // Return true to indicate we want to send a response asynchronously
  return true;
}); 