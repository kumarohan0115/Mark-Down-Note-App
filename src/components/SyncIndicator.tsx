import React from 'react';
import { CheckCircle, Cloud, AlertCircle, RefreshCw } from 'lucide-react';
import { SyncStatus } from '../types';

interface SyncIndicatorProps {
  status: SyncStatus;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ status }) => {
  switch (status) {
    case 'synced':
      return (
        <span className="flex items-center text-green-500" title="Synced">
          <CheckCircle size={12} className="mr-1" />
          Synced
        </span>
      );
    case 'syncing':
      return (
        <span className="flex items-center text-blue-500" title="Syncing">
          <RefreshCw size={12} className="mr-1 animate-spin" />
          Syncing
        </span>
      );
    case 'error':
      return (
        <span className="flex items-center text-red-500" title="Sync failed">
          <AlertCircle size={12} className="mr-1" />
          Error
        </span>
      );
    case 'unsynced':
      return (
        <span className="flex items-center text-yellow-500" title="Not synced yet">
          <Cloud size={12} className="mr-1" />
          Unsynced
        </span>
      );
    default:
      return null;
  }
};

export default SyncIndicator;