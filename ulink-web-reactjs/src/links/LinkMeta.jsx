import React, { Component } from 'react';

import QRCode from 'qrcode.react'; // https://github.com/zpao/qrcode.react
import {CopyToClipboard} from 'react-copy-to-clipboard'; // https://github.com/nkbt/react-copy-to-clipboard

import TimeAgo from 'react-timeago'; // https://github.com/nmn/react-timeago
import norStrings from 'react-timeago/lib/language-strings/no';
import engStrings from 'react-timeago/lib/language-strings/en';
import timeAgoBuildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import { toast } from 'react-toastify'; // https://github.com/fkhadra/react-toastify

import Button from '@material-ui/core/Button';
import IconCopy from '@material-ui/icons/FileCopy';
import IconTimeline from '@material-ui/icons/Timeline';
import IconLink from '@material-ui/icons/Link';
import IconSchedule from '@material-ui/icons/Schedule';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { Container, Row, Col } from 'react-grid-system';
//import { Link, NavLink } from 'react-router-dom';

import SimpleLinks from './SimpleLinks';
import SocialShareButtons from './SocialShareButtons';

import { appConfig, isDev } from './../common/AppConfig';
import { translator } from './LinkAssets';

const timeAgoFormatter_nor = timeAgoBuildFormatter(norStrings);// eslint-disable-line
const timeAgoFormatter_eng = timeAgoBuildFormatter(engStrings);

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
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

class LinkMeta extends Component {
  constructor(props) {
    super(props);
    this.handleOnCopy = this.handleOnCopy.bind(this);
  }

  handleOnCopy(theText) {
    //const { translate } = this.context;
    if (isDev) {
      console.log('Copied! -> ' + theText);
    }
    //console.log('Copied! ' + record.short_link);
    toast.info(
        //translate('resources.links.buttons.copy.confirm') + theText,
        translator.links.buttons.copy.confirm + theText,
        {
      position: toast.POSITION.BOTTOM_LEFT,
      className: 'dark-toast',
      progressClassName: 'transparent-progress',
      autoClose: 2000,
    });
  }

  normalizeRecord(record) {
    if (isDev) {
      console.log('record01-> ' + JSON.stringify(record));
    }
    if (record.simple_links && record.simple_links.length===0) {
      let simple_links = [];
      simple_links.push(record.short_link);
      record.simple_links = simple_links;
    }
    if (isDev) {
      console.log('record02-> ' + JSON.stringify(record));
    }
  }

  render() {
    const { record, isSingleItem } = this.props; // eslint-disable-line
    //this.normalizeRecord(record);

    return (
      <Card key={record._id} style={styles.card}>
        <CardContent>
          <Container fluid={true} style={{ alignItems: 'center' }}>
            <Row>
              <Col xs={12} md={12}>
                <div style={{ fontSize: 'xx-small', fontStyle: 'italic' }}>
                  {appConfig.web.baseUrl}...
                </div>
              </Col>
            </Row>
            <Row align={'center'}>
              <Col xs={12} md={12}>
                {(record.simple_links && record.simple_links.length>0) &&
                  <SimpleLinks record={record} oncopy={this.handleOnCopy} />
                }
              </Col>
            </Row>

            <Row align={'center'}>
              <Col xs={12} md={12}>
                <QRCode
                  value={appConfig.web.baseUrl + record.short_link}
                  size={164}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={12}>
                <div style={{ fontSize: 'xx-small', fontStyle: 'italic' }}>
                  <IconSchedule style={{ fontSize: 16 }} />
                  <TimeAgo
                    date={record.createdAt}
                    formatter={timeAgoFormatter_eng}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={12}>
                <div style={{ fontSize: 'xx-small', fontStyle: 'italic' }}>
                  long_link:
                  <Button size="small"
                    target="_blank" rel="noopener noreferrer"
                    href={record.long_link}
                  >
                      <IconLink style={{ fontSize: 28 }} />
                  </Button>
                  <br />
                </div>
              </Col>
            </Row>
          </Container>
        </CardContent>

        <CardActions
          style={{
            textAlign: 'right',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container fluid={true}>
            <Row>

              <Col xs={4} md={4}>
                <CopyToClipboard
                  text={appConfig.web.baseUrl + record.short_link}
                  onCopy={this.handleOnCopy}
                >
                  <Button variant={"contained"}
                    size={"medium"} color={"secondary"}
                  >
                      {
                        //translate('resources.links.buttons.copy.name')
                        translator.links.buttons.copy.name
                      }
                      <IconCopy style={{ fontSize: 36, marginLeft: 4 }} />
                  </Button>
                </CopyToClipboard>
              </Col>
                <Col xs={4} md={4}>
                {!isSingleItem && ( // eslint-disable-line

                  <Button variant={"contained"}
                    size={"medium"} color={"secondary"}
                    href={'/links/' + record.short_link + '/stats'}
                  >
                      {
                        //translate('resources.links.buttons.stats.name')
                        translator.links.buttons.stats.name
                      }
                      <IconTimeline style={{ fontSize: 36, marginLeft: 4 }} />
                  </Button>
                )}
              </Col>
                <Col xs={4} md={4}>
                  <SocialShareButtons itemData={record} />
              </Col>


            </Row>
          </Container>
        </CardActions>
      </Card>
    );
  }
}

export default LinkMeta;
