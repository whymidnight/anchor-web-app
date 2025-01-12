import {
  computeCollateralsTotalUST,
  computeTotalDeposit,
} from '@anchor-protocol/app-fns';
import {
  useAncPriceQuery,
  useBAssetInfoAndBalanceTotalQuery,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useDeploymentTarget,
  useEarnEpochStatesQuery,
  useRewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { u, UST } from '@anchor-protocol/types';
import { sum } from '@libs/big-math';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { SwapHoriz } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useTheme } from 'contexts/theme';
import { fixHMR } from 'fix-hmr';
import { computeHoldings } from 'pages/mypage/logics/computeHoldings';
import { useRewards } from 'pages/mypage/logics/useRewards';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartItem, DoughnutChart } from './graphics/DoughnutGraph';

export interface TotalValueProps {
  className?: string;
}

interface Item {
  label: string;
  tooltip: string;
  amount: u<UST<BigSource>>;
  color: string;
}

function TotalValueBase({ className }: TotalValueProps) {
  const {
    target: { isNative },
  } = useDeploymentTarget();

  const { theme } = useTheme();

  const { connected } = useAccount();

  const tokenBalances = useBalances();

  const {
    ust: { formatOutput, demicrofy, symbol },
  } = useFormatters();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  const [openSend, sendElement] = useSendDialog();

  const { ancUstLp, ustBorrow } = useRewards();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();

  const { data: { marketBorrowerInfo, overseerCollaterals } = {} } =
    useBorrowBorrowerQuery();

  const { data: bAssetBalanceTotal } = useBAssetInfoAndBalanceTotalQuery();

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { ref, width = 400 } = useResizeObserver();

  const { totalValue, data } = useMemo<{
    totalValue: u<UST<BigSource>>;
    data: Item[];
  }>(() => {
    if (!connected) {
      return { totalValue: '0' as u<UST>, data: [] };
    }

    const ust = tokenBalances.uUST;
    const deposit = computeTotalDeposit(
      tokenBalances.uaUST,
      moneyMarketEpochState,
    );
    const borrowing =
      overseerCollaterals && oraclePrices && marketBorrowerInfo && ustBorrow
        ? (computeCollateralsTotalUST(overseerCollaterals, oraclePrices)
            .minus(marketBorrowerInfo.loan_amount)
            .plus(ustBorrow.rewardValue) as u<UST<Big>>)
        : ('0' as u<UST>);
    const holdings = computeHoldings(
      tokenBalances,
      ancPrice,
      oraclePrices,
      bAssetBalanceTotal,
    );

    const pool =
      ancUstLp && ancPrice
        ? (big(big(ancUstLp.poolAssets.anc).mul(ancPrice.ANCPrice)).plus(
            ancUstLp.poolAssets.ust,
          ) as u<UST<Big>>)
        : ('0' as u<UST>);
    const farming = ancUstLp
      ? (big(ancUstLp.stakedValue).plus(ancUstLp.rewardValue) as u<UST<Big>>)
      : ('0' as u<UST>);
    const govern =
      userGovStakingInfo && ancPrice
        ? (big(userGovStakingInfo.balance).mul(ancPrice.ANCPrice) as u<
            UST<Big>
          >)
        : ('0' as u<UST>);

    const totalValue = sum(
      ust,
      deposit,
      borrowing,
      holdings,
      pool,
      farming,
      govern,
    ) as u<UST<Big>>;

    return {
      totalValue,
      data: [
        {
          label: 'UST Wallet Balance',
          tooltip: 'Total amount of UST held',
          amount: ust,
          color:'black',
        },
        {
          label: 'UST Deposit',
          tooltip: 'Total amount of UST deposited and interest generated',
          //amount: deposit,
          amount: 50000000,
          color:'red',
        },
        {
          label: 'Luna Deposit',
          tooltip: 'Total value of ANC and bAssets held',
          amount: 50000000,
          color:'green',
        },
        {
          label: 'Holdings',
          tooltip: 'Total value of ANC and bAssets held',
          amount: 40000000,
          color:'yellow',
        },
      ],
    };
  }, [
    ancPrice,
    ancUstLp,
    bAssetBalanceTotal,
    connected,
    marketBorrowerInfo,
    moneyMarketEpochState,
    oraclePrices,
    overseerCollaterals,
    tokenBalances,
    userGovStakingInfo,
    ustBorrow,
  ]);

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  const chartData = useMemo<ChartItem[]>(() => {
    return data.map(({ label, amount, color }, i) => ({
      label,
      value: +amount,
      color: color,
    }));
  }, [data]);

  return (
    <Section className={className} data-small-layout={isSmallLayout} style={{}}>
      <header ref={ref}>
        <div>
          <h4>
          <Typography>
            <IconSpan style={{fontSize:"25px", fontWeight:"bold"}}>
              TOTAL VALUE{' '}
              <InfoTooltip>
                Total value of deposits, borrowing, holdings, withdrawable
                liquidity, rewards, staked ANC, and UST held
              </InfoTooltip>
            </IconSpan>
            </Typography>
          </h4>
          <p style={{fontWeight:"bold", fontSize:"35px", marginTop:'-12px'}}>
            <AnimateNumber format={formatOutput} >
              {demicrofy(totalValue)}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
        {isNative && (
          <div>
            <BorderButton onClick={() => openSend({})} disabled={!connected}>
              <SwapHoriz />
              Swap
            </BorderButton>
          </div>
        )}
      </header>

      <div className="values">
        <ul>
          {data.map(({ label, tooltip, amount, color }, i) => (
            <li
              key={label}
              style={{ color: color }}
              data-focus={i === focusedIndex}
            >
              <i />
              <p>
                <IconSpan style={{fontSize:"20px", fontWeight:"bold"}}>
                  {label} <InfoTooltip>{tooltip}</InfoTooltip>
                </IconSpan>
              </p>
              <p>
              <div style={{fontStyle:"italic", color: "#d8d0cd"}}>
                {formatOutput(demicrofy(amount))}
                {` ${symbol}`}
              </div>
              </p>
            </li>
          ))}
        </ul>

        {!isSmallLayout && (<div style={{marginRight:"10%"}}>
          <DoughnutChart data={chartData} onFocus={setFocusedIndex} />
       </div> )}
      </div>

      {sendElement}
    </Section>
  );
}

export const StyledTotalValue = styled(TotalValueBase)`
  header {
    display: flex;
    justify-content: space-between;

    h4 {
      font-size: 12px;
      font-weight: 860;
      margin-bottom: 10px;
    }

    p {
      font-size: clamp(20px, 8vw, 32px);
      font-weight: 860;

      sub {
        font-size: 20px;
      }
    }

    button {
      font-size: 14px;
      padding: 0 13px;
      height: 26px;
      width:100px;
      border-color:#C4C4C4;
;

      svg {
        font-size: 1em;
        margin-right: 0.3em;
      }
    }
  }

  .NeuSection-root {
        max-height:434px;
  }
    

  .values {
    margin-top: 20px;

    display: flex;
    justify-content: space-between;

    ul {
      padding: 0 0 0 12px;
      list-style: none;

      display: inline-grid;
      grid-template-rows: repeat(4, auto);
      grid-auto-flow: column;
      grid-row-gap: 10px;
      grid-column-gap: 50px;

      li {
        position: relative;

        i {
          background-color: currentColor;

          position: absolute;
          left: -17px;
          top: 5px;

          display: inline-block;
          min-width: 10px;
          min-height: 10px;
          max-width: 10px;
          max-height: 10px;

          transition: transform 0.3s ease-out, border-radius 0.3s ease-out;
        }

        p:nth-of-type(1) {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        p:nth-of-type(2) {
          font-size: 13px;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        &[data-focus='true'] {
          i {
            transform: scale(2);
            border-radius: 50%;
          }
        }
      }
    }

    canvas {
      min-width: 210px;
      min-height: 210px;
      max-width: 210px;
      max-height: 210px;
    }
  }

  &[data-small-layout='true'] {
    header {
      flex-direction: column;

      button {
        margin-top: 1em;

        width: 100%;
      }
    }

    .values {
      margin-top: 30px;
      display: block;

      ul {
        display: grid;
      }

      canvas {
        display: none;
      }
    }
  }
`;

export const TotalValue = fixHMR(StyledTotalValue);
