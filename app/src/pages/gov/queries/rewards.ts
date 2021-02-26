import { Num } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  userLPBalance: {
    Result: string;
  };

  userLPStakingInfo: {
    Result: string;
  };
}

export interface Data {
  userLPBalance: {
    Result: string;
    balance: Num<string>;
  };

  userLPStakingInfo: {
    Result: string;
    staker: string;
    reward_index: Num<string>;
    bond_amount: Num<string>;
    pending_reward: Num<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  userLPBalance: (existing, { userLPBalance }) => {
    return parseResult(existing.userLPBalance, userLPBalance.Result);
  },

  userLPStakingInfo: (existing, { userLPStakingInfo }) => {
    return parseResult(existing.userLPStakingInfo, userLPStakingInfo.Result);
  },
});

export interface RawVariables {
  ANCUST_LP_Token_contract: string;
  ANCUSTLPBalanceQuery: string;
  ANCUST_LP_Staking_contract: string;
  UserLPStakingInfoQuery: string;
}

export interface Variables {
  ANCUST_LP_Token_contract: string;
  ANCUST_LP_Staking_contract: string;
  userWalletAddress: string;
}

export function mapVariables({
  ANCUST_LP_Token_contract,
  ANCUST_LP_Staking_contract,
  userWalletAddress,
}: Variables): RawVariables {
  return {
    ANCUST_LP_Token_contract,
    ANCUSTLPBalanceQuery: JSON.stringify({
      balance: { address: userWalletAddress },
    }),
    ANCUST_LP_Staking_contract,
    UserLPStakingInfoQuery: JSON.stringify({
      staker_info: { staker: userWalletAddress },
    }),
  };
}

export const query = gql`
  query __rewards(
    $ANCUST_LP_Token_contract: String!
    $ANCUSTLPBalanceQuery: String!
    $ANCUST_LP_Staking_contract: String!
    $UserLPStakingInfoQuery: String!
  ) {
    userLPBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANCUST_LP_Token_contract
      QueryMsg: $ANCUSTLPBalanceQuery
    ) {
      Result
    }

    userLPStakingInfo: WasmContractsContractAddressStore(
      ContractAddress: $ANCUST_LP_Staking_contract
      QueryMsg: $UserLPStakingInfoQuery
    ) {
      Result
    }
  }
`;

export function useRewards(): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable, walletReady } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      ANCUST_LP_Token_contract: addressProvider.terraswapAncUstLPToken(),
      ANCUST_LP_Staking_contract: addressProvider.staking(),
      userWalletAddress: walletReady?.walletAddress ?? '',
    });
  }, [addressProvider, walletReady?.walletAddress]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    //pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
