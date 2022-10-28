import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { RESAL_API } from './consts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
      series: [],
    };
  }

  componentDidMount() {
    // .envにREACT_APP_API_KEY="YOUR API KEY"と記述
    const apiKey = process.env.REACT_APP_API_KEY;
    //47都道府県一覧を取得
    fetch(
      RESAL_API.pref_url,
      {
        headers: { 'X-API-KEY': apiKey }
      }
    )
      .then(response => response.json())
      .then(res => {
        this.setState({ prefectures: res.result });
      });
  }


  /**
   * 都道府県ごとのチェックボックスを返す
   */
  prefCheckBox(elem) {
    return (
      <div key={elem.prefCode} style={{ margin: '10px' ,display: 'inline-block' }}>
        <input type="checkbox" checked={this.state.selected[elem.prefCode - 1]} onChange={() => this.onSelectClicked(elem.prefCode - 1)}/>
        {elem.prefName}
      </div>
    );
  }


  render() {
    const obj = this.state.prefectures;
    // x軸、y軸にラベルをつける
    const options = {
      title: {
        text: 'test'
      },
      yAxis: {
         labels: {
            format: '{value} 万人'
        }
      },
      xAxis: {
         labels: {
            format: '{value} 年'
        }
      },
      series: this.state.series
    };
    return (
      <div>
        <h1 align="center">都道府県別の総人口推移グラフ</h1>
        {Object.keys(obj).map(i=>this.prefCheckBox(obj[i]))}
      </div>
    );
  }
}

export default App;