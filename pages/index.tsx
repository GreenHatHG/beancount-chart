import type { NextPage } from 'next'
import Head from 'next/head'
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {PieChart}  from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import Grid from '@mui/material/Unstable_Grid2'
import {Card} from "@mui/material";

echarts.use(
    [PieChart, CanvasRenderer]
);

const option = {

    legend: {
        top: 'bottom'
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    series: [
        {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            data: [
                { value: 40, name: 'rose 1' },
                { value: 38, name: 'rose 2' },
                { value: 32, name: 'rose 3' },
                { value: 30, name: 'rose 4' },
                { value: 28, name: 'rose 5' },
                { value: 26, name: 'rose 6' },
                { value: 22, name: 'rose 7' },
                { value: 18, name: 'rose 8' }
            ]
        }
    ]
};

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      <Head>
        <title>Beancount Chart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-8 grid grid-cols-3 gap-4">
          <Card className="rounded-xl ">
              <ReactEChartsCore
                  echarts={echarts}
                  option={option}
                  notMerge={true}
                  lazyUpdate={true}
                  style={{position: "absolute", height: "100%", width: "100%", transform: "scale(1)"}}
              />
          </Card>
      </main>
    </div>
  )
}

export default Home
