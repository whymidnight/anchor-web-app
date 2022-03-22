import { availableConnectTypes } from './constants';

export type Connection = {
  icon: string;
  name: string;
  type: ConnectType;
};

export type WalletStatus = 'initialization' | 'connected' | 'disconnected';

export type ConnectType = typeof availableConnectTypes[number];
