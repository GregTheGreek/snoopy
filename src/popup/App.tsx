import React from 'react';
import { NetworkInfo } from '../components/NetworkInfo';
import { GnosisSafeHashes } from '../components/GnosisSafeHashes';
import { ParserSettings } from '../components/ParserSettings';

const App: React.FC = () => {
  const [networkInfo, setNetworkInfo] = React.useState({
    isActive: false,
    networkName: ''
  });
  const [parsingStatus, setParsingStatus] = React.useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  const [parsingError, setParsingError] = React.useState<string | null>(null);

  const handleParse = () => {
    setParsingStatus('loading');
    setParsingError(null);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'PARSE_PAGE' });
      } else {
        setParsingStatus('error');
        setParsingError('No active tab found');
      }
    });
  };

  React.useEffect(() => {
    const messageListener = (message: any) => {
      console.log('Received message:', message);
      
      if (message.type === 'PARSED_DATA') {
        setNetworkInfo(message.data.networkInfo);
      } else if (message.type === 'PARSING_STATUS') {
        console.log('Setting parsing status to:', message.status);
        setParsingStatus(message.status);
        if (message.status === 'error') {
          setParsingError(message.error);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  React.useEffect(() => {
    console.log('Current parsing status:', parsingStatus);
  }, [parsingStatus]);

  return (
    <div className="App">
      <div className="header-row">
        <button 
          className={`parse-button ${parsingStatus === 'loading' ? 'loading' : ''}`}
          onClick={handleParse}
          disabled={parsingStatus === 'loading'}
        >
          {parsingStatus === 'loading' ? 'Parsing...' : 'Parse'}
        </button>
        
        <ParserSettings />
      </div>
      
      {parsingError && (
        <div className="error-message">
          {parsingError}
        </div>
      )}
      
      {networkInfo?.networkName && (
        <>
          <NetworkInfo 
            networkInfo={networkInfo} 
            isLoading={parsingStatus === 'loading'} 
          />
          <GnosisSafeHashes 
            networkInfo={networkInfo}
            isLoading={parsingStatus === 'loading'}
          />
        </>
      )}
    </div>
  );
};

export default App; 