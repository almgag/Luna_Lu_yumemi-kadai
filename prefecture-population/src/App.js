import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { RESAL_API } from './consts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
    };
  }

  componentDidMount() {
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

  onSelectClicked(index) {
    const apiKey = process.env.REACT_APP_API_KEY;

    // チェックされた都道府県の人口推移グラフを取得
    fetch(
      RESAL_API.prefcode_url + (index + 1),
      { headers: { 'X-API-KEY': apiKey } }
    )
  }


  render() {
    const obj = this.state.prefectures;
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
      }
    };
    return (
      <div>
        <p>Draw graph here</p>
      </div>
    );
  }
}

export default App;