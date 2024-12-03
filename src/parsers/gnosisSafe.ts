import { WebsiteParser, ParsedData, WebsiteConfig } from '../types';

const gnosisSafeConfig: WebsiteConfig = {
  selectors: {
    networkSelector: '#__next > header > div > div.styles_element___dnfW.styles_networkSelector__dMtwo > div > div > li > a > span > div > span',
    nonceSelector: 'body > div.MuiDialog-root.styles_dialog__GH0VA.MuiModal-root.mui-style-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.mui-style-r7nd6y > div > div > div > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-7.mui-style-1ak9ift > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.styles_header__BYVn_.mui-style-1u94jjp > div.styles_headerInner__cl4mF.MuiBox-root.mui-style-0 > div.MuiBox-root.mui-style-axw7ok > p',
  },
};

export class GnosisSafeParser implements WebsiteParser {
  hostname = 'https://app.safe.global/transactions/queue?safe=';

  async parse(url: Location): Promise<ParsedData> {
    try {
      let retryCount = 0;
      const maxRetries = 5;
      const retryDelay = 1000;

      while (retryCount < maxRetries) {
        console.log(`[GnosisSafe] Attempt ${retryCount + 1}/${maxRetries} to find elements`);
        
        const networkElement = document.querySelector(
          gnosisSafeConfig.selectors.networkSelector
        );
        console.log('[GnosisSafe] Network element found:', networkElement?.textContent?.trim());

        const nonceElement = document.querySelector(
          gnosisSafeConfig.selectors.nonceSelector
        );
        console.log('[GnosisSafe] Nonce element found:', nonceElement?.textContent?.trim());

        if (networkElement) {
          const networkName = networkElement.textContent?.trim().toLowerCase();
          const nonce = parseInt(nonceElement?.textContent?.trim() || '');
          const address = url.search.split(":")[1];
          
          console.log('[GnosisSafe] Successfully parsed elements:', {
            networkName,
            nonce,
            isActive: true,
            address
          });
          
          return {
            networkInfo: {
              networkName,
              isActive: true,
              nonce,
              address
            },
          };
        }

        console.log(`[GnosisSafe] Elements not found, waiting ${retryDelay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryCount++;
      }

      throw new Error('Network element not found after retries');
    } catch (error) {
      console.error('[GnosisSafe] Error parsing:', error);
      return { networkInfo: { isActive: false } };
    }
  }
} 