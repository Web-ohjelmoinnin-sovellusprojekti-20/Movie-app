import { useContext } from 'react';
import { AccountContext } from './AccountContext.js';

export const useAccount = () => {
  return useContext(AccountContext);
};
