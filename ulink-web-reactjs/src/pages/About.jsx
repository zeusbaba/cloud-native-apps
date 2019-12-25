import React, { Component } from 'react';

import {Card, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

class About extends Component {
  render() {
    const { translate } = this.context;

    return (
      <div>
        <Card>
          <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                  {translate('pos.about.title')}
              </Typography>
              <Typography gutterBottom variant="subheading">
                  <em>{translate('pos.about.subtitle')}</em>
              </Typography>
          </CardContent>

          <CardContent>
              <Typography component="div">
                  <strong>BAET</strong> is an easy to use (and free!) service to
                  Shorten & Simplify URLs!
                  <br />
                  <div>
                      <dl>
                          <dd>
                              As a regular user of URL shortening services like{' '}
                              <a
                                  href="http://bit.ly"
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  <em>bit.ly</em>
                              </a>{' '}
                              and{' '}
                              <a
                                  href="http://is.gd"
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  <em>is.gd</em>
                              </a>, recently I've decided to implement a simpler service,
                              and happened to find even a cool domain name...
                              <a href="/">
                                  <strong>BAET.no</strong>
                              </a>! :-)
                          </dd>
                          <dd>
                              <br />
                              All features are composed by cherry-picking the common
                              use-cases of existing providers, and customised according to
                              my specific needs, and also adding some missing features. For
                              example, I always wanted to have 'multiple custom names'
                              assigned to a single URL, so <em>BAET.no</em> has this feature
                              now! :)
                          </dd>
                          <dd>
                              <br />
                              Hereby, opening to this service the public... please use with
                              care, and share!
                          </dd>
                      </dl>
                  </div>
              </Typography>
          </CardContent>
        </Card>

        <Card>
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {translate('pos.faq.title')}
                </Typography>
                <Typography gutterBottom variant="subheading">
                    <em>{translate('pos.faq.subtitle')}</em>
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    What is this?
                </Typography>
                <Typography component="p">
                    It is an easy to use <em>(and free!)</em> service to Shorten &
                    Simplify URLs!
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    How does it work?
                </Typography>
                <Typography component="p">
                    Give it a long URL/link, and it shortens it into a unique
                    alphanumeric word of 6 characters. You can also simplify it by
                    assigning human readable words.
                    <br />For example;
                    <br />long url:{' '}
                    <em>
                        <a
                            href="https://www.youtube.com/user/MontyPython"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://www.youtube.com/user/MontyPython
                        </a>
                    </em>
                    <br />is shortened into{' '}
                    <em>
                        <a
                            href="https://baet.no/gh80mh"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://baet.no/gh80mh
                        </a>
                    </em>
                    <br />and simplified into{' '}
                    <em>
                        <a
                            href="https://baet.no/pythons"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://baet.no/pythons
                        </a>
                    </em>
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    How can I signup?
                </Typography>
                <Typography component="p">
                    There's NO signup! :-)
                    <br />
                    <strong>
                        All you need is to access{' '}
                        <em>
                            <a href="/">baet.no</a>
                        </em>{' '}
                        using web-browser with cookies enabled
                    </strong>{' '}
                    <em>(which mostly is already enabled by default)</em>. Your
                    links are identified using your active cookie, so that you can
                    access them later using{' '}
                    <em>
                        <a href="/links">My Links</a>
                    </em>{' '}
                    menu.
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    How about the usage of stored data?
                </Typography>
                <Typography component="p">
                    All shortened links are private and accessible via BAET
                    clients (web, api etc). Sharing with others is completely at
                    your choice.
                    <br />We do not collect any personally identifying information
                    from users of baet.no service, we respect your privacy! For
                    details, see our{' '}
                    <em>
                        <a href="/terms">Privacy Policy</a>
                    </em>.
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    reCAPTCHA?! but why?
                </Typography>
                <Typography component="div">
                    <dl>
                        <dt>First;</dt>
                        <dd>
                            Any open service has to deal with spammers{' '}
                            <em>(not everyone is as cool as you are ;))</em>, and
                            captcha is an effective way to handle such challenges.
                        </dd>

                        <dt>Second;</dt>
                        <dd>
                            reCaptcha is a nice initiative! yes, it gives you hard
                            puzzles <em>(and sometimes annoyingly hard)</em> to solve,
                            but all is with good purpose for value creation! see{' '}
                            <a
                                href="https://www.google.com/recaptcha/intro/index.html#creation-of-value"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google-reCAPTCHA
                            </a>{' '}
                            for details.
                        </dd>
                    </dl>
                </Typography>
            </CardContent>

        </Card>

      </div>
    );
  }
}
About.contextTypes = {
  translate: PropTypes.func,
};

export default About;
