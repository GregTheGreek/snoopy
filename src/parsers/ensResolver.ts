import { WebsiteParser, ParsedData } from '../types';
import { ethers } from 'ethers';

export class ENSResolver implements WebsiteParser {
  hostname = '*'; // Match all sites
  private provider: ethers.JsonRpcProvider;
  private ensCache: Map<string, string> = new Map();
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  }

  canParse(url: string): boolean {
    return true; // We want to parse all URLs
  }

  private async resolveENS(address: string): Promise<string | null> {
    try {
      // Check cache first
      if (this.ensCache.has(address)) {
        return this.ensCache.get(address) || null;
      }

      const name = await this.provider.lookupAddress(address);
      if (name) {
        this.ensCache.set(address, name);
        return name;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async parse(): Promise<ParsedData> {
    const ethAddressRegex = /0x[a-fA-F0-9]{40}/g;
    const textNodes = document.evaluate(
      "//text()[contains(., '0x')]",
      document.body,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
      const node = textNodes.snapshotItem(i);
      if (!node || !node.textContent) {
        continue;
      }

      const matches = node.textContent.match(ethAddressRegex);
      if (!matches) {
        continue;
      }

      for (const address of matches) {
        const ensName = await this.resolveENS(address);
        if (!ensName) {
          continue;
        }

        // Create wrapper span with tooltip
        const span = document.createElement('span');
        span.className = 'ens-replaced';
        span.textContent = ensName;
        span.title = `Replaced by Snoopy\n${address}`;
        
        // Replace the address with the ENS name
        const newText = node.textContent.replace(address, span.outerHTML);
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newText;
        node.parentNode?.replaceChild(wrapper, node);
      }
    }

    return { networkInfo: { isActive: true } };
  }
}