import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import {
  computeCurrentAPY,
  computeTotalDeposit,
} from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Circles } from 'components/primitives/Circles';
import { fixHMR } from 'fix-hmr';
import { useAccount } from 'contexts/account';
import { useDepositDialog } from 'pages/earn/components/useDepositDialog';
import { useWithdrawDialog } from 'pages/earn/components/useWithdrawDialog';
import { EmptySection } from 'pages/mypage/components/EmptySection';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useBalances } from 'contexts/balances';
import {DepositButtons} from '../../earn/components/TotalDepositSection'
export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  const { constants } = useAnchorWebapp();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uaUST } = useBalances();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, moneyMarketEpochState),
    };
  }, [moneyMarketEpochState, uaUST]);

  const apy = useMemo(() => {
    return computeCurrentAPY(overseerEpochState, constants.blocksPerYear);
  }, [constants.blocksPerYear, overseerEpochState]);

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();

  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);

  if (!connected) {
    return <EmptySection to="/earn">Go to Earn</EmptySection>;
  }

  return (<>
    <Section className={className}>
      <HorizontalScrollTable minWidth={600} startPadding={20}>
        <colgroup>
          <col style={{ minWidth: 150, maxWidth:200 }} />
          <col style={{ minWidth: 100, maxWidth:200 }} />
          <col style={{ minWidth: 150, maxWidth:200 }} />
          <col style={{ minWidth: 200, maxWidth:200 }} />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>APY</th>
            <th>Deposit Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
                <i>
                  <TokenIcon token="ust" />
                </i>
                <div>
                  <div className="coin">UST</div>
                  <p className="name">Terra USD</p>
                </div>
              </div>
            </td>
            <td>{formatRate(apy)}%</td>
            <td>{formatUSTWithPostfixUnits(demicrofy(totalDeposit))} UST</td>
            <td style={{width:"350px"}}>
            <DepositButtons/>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
    <Section className={className}>
      <HorizontalScrollTable minWidth={600} startPadding={20}>
        <colgroup>
          <col style={{ minWidth: 150, maxWidth:200 }} />
          <col style={{ minWidth: 100, maxWidth:200 }} />
          <col style={{ minWidth: 150, maxWidth:200 }} />
          <col style={{ minWidth: 200, maxWidth:200 }} />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>APY</th>
            <th>Deposit Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
          <Circles backgroundColors={['#04284e']}>
            <TokenIcon token="luna" style={{ height: '1.1em', width: '' }} />
          </Circles>
                <div style={{marginLeft:"20px"}}>
                  <div className="coin">LUNA</div>
                  <p className="name">Luna</p>
                </div>
              </div>
            </td>
            <td>{formatRate(apy)}%</td>
            <td>{formatUSTWithPostfixUnits(demicrofy(totalDeposit))} LUNA</td>
            <td style={{width:"450px"}}>
            <DepositButtons/>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
 </> );
}

export const StyledEarn = styled(EarnBase)`
  table {

    .headRuler {
        box-shadow:none;
        color:white;
    }
    thead {tr {th {
      font-weight:760;
      font-size:13px;
    }}},
    tbody {
      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4) {
        text-align: center;
      }
      
      td {

          color: ${({ theme }) => theme.dimTextColor};
      }

      td:first-child > div {
        text-decoration: none;
        color: #ffffff;

        text-align: left;

        p {
        
          color: ${({ theme }) => theme.dimTextColor};
        }

        display: flex;

        align-items: center;

        i {
          width: 60px;
          height: 60px;

          margin-right: 15px;

          svg,
          img {
            display: block;
            width: 60px;
            height: 60px;
          }
        }

        .coin {
          font-weight: bold;

          grid-column: 2;
          grid-row: 1/2;
        }

        .name {
          grid-column: 2;
          grid-row: 2;
        }
      }
    }

    button {
      font-size: 12px;
      width: 120px;
      height: 32px;

      &:first-child {
        margin-right: 8px;
      }
    }
  }
`;

export const Earn = fixHMR(StyledEarn);
