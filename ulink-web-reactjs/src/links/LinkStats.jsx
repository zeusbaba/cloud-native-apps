import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Chart } from 'react-google-charts';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { translator } from './LinkAssets';
import {isDev} from "../common/AppConfig";

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 800,
    //minHeight: 600,
    margin: '0.2em',
    display: 'inline-block',
    verticalAlign: 'top',
    textAlign: 'left',
  },
};

class StatsChart extends Component {

  render() {

    let itemKey = this.props.itemKey;
    let itemData = this.props.itemData;

    let statsData = [];
    statsData.push([itemKey, '']);
    if (itemData) {
      Object.keys(itemData).map(key2 => {
        statsData.push([key2, itemData[key2]]);
        return true;
      });
    }

    return (
      <Chart
        chartType="PieChart"
        data={statsData}
        options={{
          title: translator.links.buttons.stats.options[itemKey],
          pieHole: 0.4,
          is3D: true,
        }}
        graph_id="PieChart"
        width="100%"
        height="400px"
      />
    );
  }
}

StatsChart.propTypes = {
  itemKey: PropTypes.string,
  itemData: PropTypes.object,
};

class LinkStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      current: {},
    };

    this.prepareMenuOptions = this.prepareMenuOptions.bind(this);
    this.handleMenuSelection = this.handleMenuSelection.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentWillMount() {
    let { record, current } = this.state;

    record.stats = this.props.record.stats; // eslint-disable-line
    //record._id = this.props.record._id;// eslint-disable-line

    if (!record.stats) {
      record.stats = {};
    }

    let itemKey = 'd_clicks';
    let itemData = record.stats[itemKey];
    current.itemKey = itemKey;
    current.itemData = itemData;

    this.setState({ record, current });

    /* if (isDev) {
      console.log('componentWillMount');
      //console.log('current -> ' + JSON.stringify(current));
      console.log('record -> ' + JSON.stringify(record));
      console.log('state -> ' + JSON.stringify(this.state));
    } */
  }

  handleMenuSelection = (event) => {
    this.handleUserInput(event.target.value);
  };
  handleUserInput(value) {
    let { record, current } = this.state;

    /* if (isDev) {
      console.log('handleUserInput');
      console.log('value -> ' + value);
      console.log('current -> ' + JSON.stringify(current));
      console.log('record -> ' + JSON.stringify(record));
    } */

    current['itemKey'] = value;
    current['itemData'] = record.stats[value];

    this.setState({ current });

    /* if (isDev) {
      console.log('handleUserInput');
      console.log('current -> ' + JSON.stringify(current));
    } */
  }

  prepareMenuOptions() {
    const { record, current } = this.state;

    if (isDev) {
      console.log("LinkStats.record: " + JSON.stringify(record));
    }

    const menuItems = Object.keys(record.stats).map(itemKey => (
      <MenuItem
        key={itemKey}
        value={itemKey}
      >
          {translator.links.buttons.stats.options[itemKey]}
      </MenuItem>
    ));

    return (
      <Select value={current.itemKey} onChange={this.handleMenuSelection}>
        {menuItems}
      </Select>
    );
  }

  render() {
    return (
      <Card key="one1" style={styles.card}>
        <CardContent>
          <div>{this.prepareMenuOptions()}</div>
          <div>
            <StatsChart {...this.state.current} />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default LinkStats;
