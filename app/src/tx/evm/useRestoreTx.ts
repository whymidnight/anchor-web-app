import {
  CrossChainEvent,
  CrossChainEventKind,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { ConnectType, EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { useTransactions } from './storage';
import { TxEvent, useTx } from './useTx';
import { capitalize, chain } from './utils';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface RestoreTxParams {
  txHash: string;
}

export const useRestoreTx = () => {
  const { connection, provider, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const { removeTransaction } = useTransactions();

  const restoreTx = useCallback(
    async (
      txParams: RestoreTxParams,
      renderTxResults: Subject<TxRender>,
      txEvents: Subject<TxEvent<RestoreTxParams>>,
    ) => {
      try {
        const tx = await provider!.getTransaction(txParams.txHash);
        const receipt = await tx.wait();
        const result = await xAnchor.restoreTx(receipt, (event) => {
          console.log(event, 'eventEmitted ');

          renderTxResults.next(restoreTxResult(event, connectType, chainId!));
          txEvents.next({ event, txParams });
        });

        removeTransaction(txParams.txHash);
        return result;
      } catch (error: any) {
        console.log(error);

        if (String(error.message).includes('invalid hash')) {
          throw error;
        }

        // if already processed, return success
        if (
          String(error?.data?.message).includes(
            'execution reverted: transfer info already processed',
          )
        ) {
          removeTransaction(txParams.txHash);
          return null;
        }

        throw error;
      }
    },
    [xAnchor, provider, chainId, connectType, removeTransaction],
  );

  const restoreTxStream = useTx(restoreTx, (resp) => resp.tx, null);

  return connection && provider && connectType && chainId
    ? restoreTxStream
    : [null, null];
};

const restoreTxResult = (
  event: CrossChainEvent<ContractReceipt>,
  connnectType: ConnectType,
  chainId: EvmChainId,
) => {
  return {
    value: null,
    message: restoreTxMessage(event, connnectType, chainId),
    phase: TxStreamPhase.BROADCAST,
    receipts: [
      //{ name: "Status", value: txResultMessage(event, connnectType, chainId, action) }
    ],
  };
};

const restoreTxMessage = (
  event: CrossChainEvent<ContractReceipt>,
  connnectType: ConnectType,
  chainId: EvmChainId,
) => {
  switch (event.kind) {
    case CrossChainEventKind.RemoteChainReturnTxRequested:
      return `Deposit requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainReturnTxSubmitted:
      return `Waiting for deposit transaction on ${capitalize(
        chain(chainId),
      )}...`;
  }
};
