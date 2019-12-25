import React, { Component } from 'react';

import {Card, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import IconCopy from '@material-ui/icons/ContentCopy';

import PropTypes from 'prop-types';

import packageJson from './../../package.json'; // eslint-disable-line
import { myConfig, jwtHeaderName } from './../common/MyConfig'; // eslint-disable-line

let jwtToken;
class Developers extends Component {
  componentDidMount() {
    jwtToken = localStorage.getItem(jwtHeaderName);
    /* if (isDev) {
      console.log('Developers.componentWillMount');
      console.log('localStorage.getItem-> ' + jwtToken); //localStorage.getItem(jwtHeaderName));
      console.log(
        'packageJson -> ' + packageJson.name + ' ' + packageJson.version,
      );
    } */
  }

  render() {
    const { translate } = this.context;

    return (
      <div>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {translate('pos.developers.intro.title')}
            </Typography>
            <Typography gutterBottom variant="subheading">
              <em>{translate('pos.developers.intro.subtitle')}</em>
            </Typography>
            <Typography component="div">
              <em>
                Please make sure that you read &amp; understood{' '}
                <a href="/terms">
                  <em>Privacy & Terms</em>
                </a>
              </em>
              <br />
              Let's begin... The easiest and fastest way to learn our APIs is by
              using
              <a
                href="https://www.getpostman.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <em> Postman</em>
              </a>. I've already prepared a postman collection for you! :-)
              <br />Here you can &gt;&gt;
              <a
                href="https://documenter.getpostman.com/view/2611563/RzfZPt3c"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://run.pstmn.io/button.svg"
                  alt="Run in Postman"
                />
              </a>
              <dl>
                <dd>
                  To be able to use API endpoints (via Postman or so), you must
                  have a valid AppToken!
                  <br />You must pass this in the header as Authorization
                  parameter! e.g.
                  <ul>
                    <li>
                      <strong>Authorization=</strong> Bearer{' '}
                      <em>&lt;yourApptoken&gt;</em>
                    </li>
                  </ul>
                </dd>
                <dd>
                  Yes but... how can I get <em>AppToken</em>?
                  <p>
                    Just access this site using a web browser{' '}
                    <em>(chrome, firefox, opera, ...)</em>, that's all!
                  </p>
                </dd>
                <dd>
                  <CopyToClipboard
                    text={jwtToken}
                    onCopy={() => {
                      //console.log('Copied! ' + localStorage.getItem(jwtHeaderName));
                      toast.info(
                        translate('resources.links.buttons.copy.confirm') +
                          jwtToken,
                        {
                          position: toast.POSITION.BOTTOM_LEFT,
                          className: 'dark-toast',
                          progressClassName: 'transparent-progress',
                          autoClose: 2000,
                        },
                      );
                    }}
                  >
                    <Button variant="raised" size="small">
                      {translate('resources.links.buttons.copy.name')}
                      <IconCopy />
                    </Button>
                  </CopyToClipboard>
                  <strong>your current AppToken</strong>{' '}
                  <em>uniquely generated based on your active session!</em>
                </dd>
              </dl>
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}
Developers.contextTypes = {
  translate: PropTypes.func,
};

export default Developers;
