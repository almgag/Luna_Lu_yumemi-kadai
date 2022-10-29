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
    this.onSelectClicked = this.onSelectClicked.bind(this);
    this.endpoint = 'https://opendata.resas-portal.go.jp/';
  }

  componentDidMount() {
    // .envにREACT_APP_API_KEY="YOUR API KEY"と記述
    const apiKey = process.env.REACT_APP_API_KEY;
    const pref_url = this.endpoint + RESAL_API.pref_api;
    //47都道府県一覧を取得
    fetch(
      pref_url,
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
      <div key={elem.prefCode} style={{ margin: '3px' ,display: 'inline-block' }}>
        <input type="checkbox" checked={this.state.selected[elem.prefCode - 1]} onChange={() => this.onSelectClicked(elem.prefCode - 1)}/>
        {elem.prefName}
      </div>
    );
  }

  /**
   * チェックボックスがクリックされたときのイベント
   */
  onSelectClicked(prefcode) {
    // クリックされたチェックボックスの値だけ反転させたものに更新
    const cp_sel = this.state.selected.slice();
    cp_sel[prefcode] = !cp_sel[prefcode];
    if (this.state.selected[prefcode]) { 
      // チェックが外れたら描画をやめるので、リストから除外
      const cp_series = this.state.series.slice();
      const cp_series_len = cp_series.length;
      for (let i = 0; i < cp_series_len; i++){
        if (cp_series[i].name === this.state.prefectures[prefcode].prefName) {
          cp_series.splice(i, 1);
        }
      }
      // チェック後の値でチェックボックスと描画を更新
      this.setState(
        {
          selected: cp_sel,
          series: cp_series
        }
      );
    }
    else {
      // クリックされた都道府県の人口情報を取得
      const apiKey = process.env.REACT_APP_API_KEY;
      const prefCode_url = this.endpoint + RESAL_API.prefcode_api;
      fetch(
        prefCode_url + (prefcode + 1),
        { headers: { 'X-API-KEY': apiKey } }
      )
        .then(response => response.json())
        .then(res => {
          let newdata = [];
          Object.keys(res.result.line.data).forEach(i => {
            newdata.push(res.result.line.data[i].value);
          });
          // 描画対象を追加
          const add = {
            name: this.state.prefectures[prefcode].prefName,
            data: newdata
          };
          this.setState({
            selected: cp_sel,
            series: [...this.state.series, add]
          });
        });
    }
  }

  render() {
    const obj = this.state.prefectures;
    // タイトルと、x軸・y軸にラベルをつける
    const options = {
      title: {
        text: '都道府県別の総人口推移グラフ'
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
        {Object.keys(obj).map(i => this.prefCheckBox(obj[i]))}
        <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>
      </div>
    );
  }
}

export default App;