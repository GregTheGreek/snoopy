import React from 'react';
import { NetworkInfo as NetworkInfoType } from '../types';

interface Props {
  networkInfo: NetworkInfoType;
  isLoading: boolean;
}

export const NetworkInfo: React.FC<Props> = ({ networkInfo, isLoading }) => {
  if (isLoading) {
    return <div>Loading network information...</div>;
  }

  if (!networkInfo.isActive) {
    return <div>Network information unavailable</div>;
  }

  return (
    <div className="network-info">
      <h3>Network Information</h3>
      <div className="network-name">
        Current Network: {networkInfo.networkName}
        <div>Safe Address: {networkInfo.address}</div>
        <div>Tx Nonce: {networkInfo.nonce}</div>
      </div>
    </div>
  );
}; 