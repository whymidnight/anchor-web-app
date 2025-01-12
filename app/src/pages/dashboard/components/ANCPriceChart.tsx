import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { MarketAncHistory } from '@anchor-protocol/app-fns';
import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { ChartTooltip } from './ChartTooltip';
import { mediumDay, xTimestampAxis } from './internal/axisUtils';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core';
export interface ANCPriceChartProps {
  data: MarketAncHistory[];
  theme: DefaultTheme;
  isMobile: boolean;
}
export class ANCPriceChart extends Component<ANCPriceChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private tooltipRef = createRef<HTMLDivElement>();
  private chart!: Chart;
  state = {
    sumData: null
  } 
    
  render() {
    this.setState( 
       {
        labels: ["02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00"],
        datasets: [
          {
            label: 'Cubic interpolation (monotone)',
            data : [0.0,2.4,4.2,6.4,8.2,12.0,16.2,20.5,24.1,29.0,34.4,39.1,44.4],
            //data: this.props.data.map(({ anc_price }) =>
            //  big(anc_price).toNumber(),
            // ),
            cubicInterpolationMode: 'monotone',
            tension: 1.7,
            borderColor: this.props.theme.colors.secondary,
            borderWidth: 4,
            fill:{target:'origin', above: this.getGradient()},
          },
            
        ],
      });
    return (<>
        <Line data={this.state.sumData} />
   </> );
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<ANCPriceChartProps>): boolean {
    return (
      this.props.data !== nextProps.data ||
      this.props.theme !== nextProps.theme ||
      this.props.isMobile !== nextProps.isMobile
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<ANCPriceChartProps>) {
  /*  if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAxis(
        this.props.data.map(({ timestamp }) => timestamp),
      );
      this.chart.data.datasets[0].data = this.props.data.map(({ anc_price }) =>
        big(anc_price).toNumber(),
      );
    }

    if (prevProps.theme !== this.props.theme) {
      if (this.chart.options.scales?.x?.ticks) {
        this.chart.options.scales.x.ticks.color = this.props.theme.dimTextColor;
      }
      if (this.chart.options.scales?.y?.ticks) {
        this.chart.options.scales.y.ticks.color = this.props.theme.dimTextColor;
      }
      this.chart.data.datasets[0].borderColor =
        this.props.theme.colors.secondary;
    }

    if (prevProps.isMobile !== this.props.isMobile) {
      if (
        this.chart.options.scales?.x?.ticks &&
        'maxRotation' in this.chart.options.scales.x.ticks
      ) {
        this.chart.options.scales.x.ticks.maxRotation = this.props.isMobile
          ? undefined
          : 0;
      }
    } 

    this.chart.update(); */
  }
  private getGradient = () => {
    const myChartRef = this.canvasRef.current.getContext("2d");

    let gradientLine = myChartRef
    .createLinearGradient(0, 0, 0, 400 );
    gradientLine.addColorStop(0, "rgba(27,228,158,0.5)");
    gradientLine.addColorStop(0.35, "rgba(25,185,128,0.3)");
    gradientLine.addColorStop(0.9, "rgba(0,212,255,0)");
    return gradientLine
  }
  private createChart = () => {

    this.chart = new Chart(this.canvasRef.current!, {

      type: 'line',
      plugins: [
        {
          id: 'custom-y-axis-draw',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';



            ctx.restore();
          },
        },
      ],
      options: {
      responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,

            external: ({ chart, tooltip }) => {
              let element = this.tooltipRef.current!;
              if (tooltip.opacity === 0) {
                element.style.opacity = '0';
                return;
              }

              const div1 = element.querySelector('div:nth-child(1)');
              const hr = element.querySelector('hr');

              if (div1) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const isLast = i === this.props.data.length - 1;
                  const item = this.props.data[i];
                  const price = formatUSTWithPostfixUnits(item.anc_price);
                  const date = isLast ? 'Now' : mediumDay(item.timestamp);
                  div1.innerHTML = `${price} UST <span>${date}</span>`;
                } catch {}
              }

              if (hr) {
                hr.style.top = chart.scales.y.paddingTop + 'px';
                hr.style.height = chart.scales.y.height + 'px';
              }

              element.style.opacity = '1';
              element.style.transform = `translateX(${tooltip.caretX}px)`;
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            ticks:{
            display:false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks:{
            display:false,
            },
            grace: '25%',
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      data: {
        labels: ["02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00"],
        datasets: [
          {
            label: 'Cubic interpolation (monotone)',
            data : [0.0,2.4,4.2,6.4,8.2,12.0,16.2,20.5,24.1,29.0,34.4,39.1,44.4],
            //data: this.props.data.map(({ anc_price }) =>
            //  big(anc_price).toNumber(),
            // ),
            cubicInterpolationMode: 'monotone',
            tension: 1.7,
            borderColor: this.props.theme.colors.secondary,
            borderWidth: 4,
            fill:{target:'origin', above: this.getGradient()},
            options: {},
          },
            
        ],
      },
    });
  };
}


const Container = styled.div`
width:inherit;
position:relative;
`;




export const NewChart = () => {


  const getGradient = () => {

    const canvas = document.createElement('canvas')
    const myChartRef = canvas.getContext("2d");

    let gradientLine = myChartRef
    .createLinearGradient(0, 0, 0, 400 );
    gradientLine.addColorStop(0, "rgba(27,228,158,0.7)");
    //gradientLine.addColorStop(0.5, "rgba(25,185,128,0.3)");
    gradientLine.addColorStop(0.9, "rgba(0,212,255,0.0)");
    return gradientLine
  }
const data = 
      {
        labels: ["02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00"],
        datasets: [
          {
            label: false,
            data : [0.0,4.4,3.2,8.4,6.2,16.0,13.2,20.5,16.1,30.0,25.4,35,29.6],
            //data: this.props.data.map(({ anc_price }) =>
            //  big(anc_price).toNumber(),
            // ),
            tension: 0.5,
            borderColor: 'rgb(251, 216, 93)',
            borderWidth: 4,
            fill:{target:'origin', above: getGradient()},
          },
            
        ],
      }
    return(
        <Container className="new-chart">
        <Line data={data} options={{
                    maintainAspectRatio:false, 
                    responsive: true,
                    plugins: {legend: {display:false},},
        scales: {
          x: {
            ticks:{
            display:false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks:{
            display:false,
            },
            grace: '25%',
            grid: {
              display: false,
              drawBorder: false,
            },
          },


            },
                }}
                height={400} 
                width={"inherit"} 
                style={{maxWidth:"inherit"}}/>
        </Container>
    )
}
