import React from 'react';
import { NetworkInfo as NetworkInfoType } from '../types';
import SafeHashesCalculator, { NetworkType } from '../tools/safeHashes';

interface Props {
  networkInfo: NetworkInfoType;
  isLoading: boolean;
}

export const SafeHashes: React.FC<Props> = ({ networkInfo, isLoading }) => {
  const [hashes, setHashes] = React.useState<{ domainHash: string; messageHash: string; safeTxHash: string; } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { address, nonce, networkName } = networkInfo;
  const canCalculate = !!(address && nonce && networkName);

  const calculateHashes = async () => {
    try {
      setError(null);
      const calculator = new SafeHashesCalculator();
      if (!canCalculate) {
        setError('Invalid Safe address, nonce, or network');
        return;
      }
      const result = await calculator.calculateSafeTxHashes(networkName as NetworkType, address, nonce);
      setHashes(result);
    } catch (err) {
      console.error('[SafeHashes] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setHashes(null);
    }
  };

  React.useEffect(() => {
    calculateHashes();
  }, [networkInfo.address, networkInfo.nonce, networkInfo.networkName]);

  if (isLoading) {
    return <div className="safehashes">Loading safe hashes...</div>;
  }

  return (
    <div className="safehashes">
      <h3>Safe Hashes</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {hashes && (
        <div className="hash-results">
          <div>
            Domain Hash:
            <br/> 
            {hashes.domainHash}
          </div>
          <div>
            Message Hash:
            <br/>
            {hashes.messageHash}
          </div>
          <div>
            Safe Tx Hash:
            <br/>
            {hashes.safeTxHash}
          </div>
        </div>
      )}
    </div>
  );
}; 