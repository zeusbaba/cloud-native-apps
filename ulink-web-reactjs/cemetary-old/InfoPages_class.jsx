import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import IconInfo from '@material-ui/icons/Info';
import IconLock from '@material-ui/icons/Lock';
import IconCode from '@material-ui/icons/Code';

import About from '../src/pages/About';
import Terms from '../src/pages/Terms';
import Developers from '../src/pages/Developers';

const tabValues = ['/about', '/terms', '/developers'];
function TabContainer(props) {
    const { tabValue } = props;
    if (tabValue === '/terms') {
        return <Terms/>
    }
    else if (tabValue === '/developers') {
        return <Developers/>
    }
    else {// default
        return <About/>
    }
}
class InfoPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: tabValues[0],
    };
  }
  componentDidMount() {
    // eslint-disable-next-line
    if (this.props.match && tabValues.indexOf(this.props.match.path) >= 0) {
      this.setState({
          // eslint-disable-next-line react/prop-types
        tabValue: this.props.match.path,
      });
    }
  }

  handleTabChange = (event, value) => {
    this.setState({
      tabValue: value,
    });
  };

  render() {
    // TODO const { translate } = this.context;
    const { tabValue } = this.state;

    return (
      <div>
        <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered //variant={"fullWidth"}
        >
          <Tab
            value="/about"
            label={"About"}//label={translate('pos.about.title')}
            icon={<IconInfo />}
          />

          <Tab
            value="/terms"
            label={"Terms"}//label={translate('pos.terms.title')}
            icon={<IconLock />}
          />

          <Tab
            value="/developers"
            label={"Developers"}//label={translate('pos.developers.title')}
            icon={<IconCode />}
          />
        </Tabs>
        <TabContainer tabValue={tabValue} />
      </div>
    );
  }
}

InfoPages.contextTypes = {
  translate: PropTypes.func,
};

export default InfoPages;
//export default withStyles(styles)(Info);
