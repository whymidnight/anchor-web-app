import React, { useCallback, useMemo } from 'react';
import { computeTotalDeposit } from '@anchor-protocol/app-fns';
import { useEarnEpochStatesQuery } from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  MILLION,
} from '@anchor-protocol/notation';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import {Typography} from '@material-ui/core'
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { SubAmount } from 'components/primitives/SubAmount';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useDepositDialog } from './useDepositDialog';
import { useWithdrawDialog } from './useWithdrawDialog';
import Big from 'big.js';

export interface TotalDepositSectionProps {
  className?: string;
  coin?: string,
}

export function TotalDepositSection({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uxyzUST, uxyzLuna } = useBalances();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalLunaDeposit, totalUSTDeposit } = useMemo(() => {
    return {
      // @ts-ignore
      totalLunaDeposit: computeTotalDeposit(uxyzLuna, {}),
      // @ts-ignore
      totalUSTDeposit: computeTotalDeposit(uxyzUST, {}),
    };
  }, [uxyzUST, uxyzLuna]);
  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
       <Typography style={{fontSize:"25px", fontWeight:"bolder"}}> 
          TOTAL DEPOSIT{' '}
          <InfoTooltip style={{}}>
            Total amount of UST deposited and interest earned by the user
          </InfoTooltip>
       </Typography> 

      <div className="amount">
        <AnimateNumber format={formatUSTWithPostfixUnits}>
          {demicrofy(totalLunaDeposit)}
        </AnimateNumber>{' '}
        <span className="denom">Luna</span>
        {totalLunaDeposit.gt(MILLION * MICRO) && (
          <SubAmount style={{ fontSize: '16px' }}>
            <AnimateNumber format={formatUST}>
              {demicrofy(totalLunaDeposit)}
            </AnimateNumber>{' '}
            UST
          </SubAmount>
        )}
      </div>
      <div className="amount">
        <AnimateNumber format={formatUSTWithPostfixUnits}>
          {demicrofy(totalUSTDeposit)}
        </AnimateNumber>{' '}
        <span className="denom">UST</span>
        {totalUSTDeposit.gt(MILLION * MICRO) && (
          <SubAmount style={{ fontSize: '16px' }}>
            <AnimateNumber format={formatUST}>
              {demicrofy(totalUSTDeposit)}
            </AnimateNumber>{' '}
            UST
          </SubAmount>
        )}
      </div>

    </Section>
  );
}


export function DepositButtons({ className, coin }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  let nativeBalance;
  let stakedBalance;
  switch (coin) {
  case "uluna":
      const { uNative, uxyzLuna } = useBalances();
      nativeBalance = uNative;
      stakedBalance = uxyzLuna;
      break;
  case "uusd":
      const { uUST, uxyzUST } = useBalances();
      nativeBalance = uUST;
      stakedBalance = uxyzUST;
      break;
  }

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog(coin);

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);
 

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (<>
        <ActionButton
          className="sizeButton"
          disabled={!connected || Big(nativeBalance).lte(0)}
          onClick={openDeposit}
        >
          Deposit
        </ActionButton>
        <BorderButton
          className="sizeButton"
          disabled={!connected || Big(stakedBalance).lte(0)}
         onClick={openWithdraw}
        >
          Withdraw
        </BorderButton>

      {depositDialogElement}
      {withdrawDialogElement}
</>  );
} 
