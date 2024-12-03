import { useContext } from 'react';
import { RealmContext } from '@/src/contexts/RealmContext';

export const useRealm = () => {
  const realm = useContext(RealmContext as any);
  if (!realm) {
    throw new Error('useRealm must be used within a RealmProvider');
  }
  return realm;
};

