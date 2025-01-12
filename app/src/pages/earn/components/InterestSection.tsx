import { computeCurrentAPY } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnAPYHistoryQuery,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import{ Rate } from '@anchor-protocol/types';
import {
  APYChart,
  APYChart2,
  APYChartItem,
} from '@anchor-protocol/webapp-charts/APYChart';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { AnimateNumber } from '@libs/ui';
import big from 'big.js';
import React, { useMemo } from 'react';

export interface InterestSectionProps {
  className?: string;
}

/*export function InterestSection({ className }: InterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  const apy = useMemo(() => {
    return computeCurrentAPY(overseerEpochState, constants.blocksPerYear);
  }, [constants.blocksPerYear, overseerEpochState]);

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) *
          constants.blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          {
            date: new Date(),
            value: big(overseerEpochState.deposit_rate)
              .mul(constants.blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

  return (<Section className="interest">
      <h2>
        <IconSpan>
          INTEREST <InfoTooltip>Current annualized deposit rate</InfoTooltip>
        </IconSpan>
      </h2>

      <div className="apy">
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none' }}
        >
          APY
        </TooltipLabel>
        <div className="value">
          <AnimateNumber format={formatRate}>{apy}</AnimateNumber>%
        </div>
        {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
            style={{height:"100px"}}
          />
        )}
      </div>
  </Section>);
}
*/
export function InterestSectionDash({ className }: InterestSectionProps) {
  const interestRate = 0.148 as Rate<number>
  const apyChartItems: APYChartItem[] = [{date:new Date("July 21, 1983 01:15:00"), value: interestRate},{date:new Date("July 21, 1983 01:15:00"), value: interestRate }]
  return (<>
      <div className="apy" style={{display:"flex", flexDirection:"column", marginTop:"10px", height:"370px"}}>
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none', textAlign:"center", width:"15%", alignSelf:"center", fontSize:"13px", fontWeight:"760", color:"#CEC0C0"}}
        >
          APY
        </TooltipLabel>
        <div className="value" style={{alignSelf:"center", margin:"10px", fontSize:"35px", marginBottom:"60px", fontWeight:"760"}}>
          <AnimateNumber format={formatRate}>{interestRate}</AnimateNumber>%
        </div>
        {apyChartItems && (
        <div style={{marginTop:"0px"}}>
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
            style={{height:"223px", maxWidth:"480px"}}
          />
         </div> 
        )}
      </div>
  </>);
}
export function InterestSectionSlider({ className }: InterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();


  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) *
          constants.blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          {
            date: new Date(),
            value: big(overseerEpochState.deposit_rate)
              .mul(constants.blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

  return (<>
      <div className="apy" style={{display:"flex", flexDirection:"column", marginTop:"30px", width:"90%"}}>
          <APYChart2
            margin={{ top: 20, bottom: 20, left: 150, right: 150 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
            style={{height:"240px"}}
          />
      </div>
  </>);
}
