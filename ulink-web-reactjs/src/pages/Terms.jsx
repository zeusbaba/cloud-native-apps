import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Card, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class Terms extends Component {
  render() {
    //const { translate } = this.context;

    return (
      <div>
        <Card>
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    Terms
                </Typography>
                <Typography gutterBottom variant="subheading">
                    <em>Privacy matters!</em>
                </Typography>
                <Typography component="div">
                    <dl>
                        <dd>
                            We do not collect any personally identifying information from
                            users of this service. We store only the information necessary
                            to provide our URL shortening service (such as original long
                            URLs), information necessary to identify and track abuse of our
                            service (such as IP addresses) and aggregate information to
                            compile statistics on how individual links are used (such as
                            browser and country of residence).
                        </dd>
                        <dd>
                            We do not share information with 3rd parties except where
                            required to identify or track abuse or prevent future abuse
                            (e.g. we may check submitted URLs against 3rd party blacklists
                            and may share information on malicious URLs or abusive users
                            with 3rd parties). The sole exception to this is when you create
                            a QR code - we pass the relevant shortened URL (but no other
                            data) to Google since we use their Charts API to generate these.
                        </dd>
                        <dd>
                            URLs shortened by this service are not private and should not be
                            treated as such. Third parties could easily guess the short URL
                            that you are using, so you should not use BAET service to link
                            to sensitive or secure data.
                        </dd>
                        <dd>
                            Anonymous statistics on shortened URLs you create (such as
                            number of visits to them, creation date etc.) are not treated as
                            private and will be made available to anyone through the site.
                        </dd>
                    </dl>
                    <mark>
                        This <strong>Privacy/T&C</strong> is an adaptation from{' '}
                        <a
                            href="https://is.gd/privacy.php"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <em>is.gd</em>
                        </a>{' '}
                        service <em>(thanks to them for leading the way!).</em>
                    </mark>
                </Typography>
            </CardContent>
        </Card>

        <Card>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    Terms & Conditions
                </Typography>
                <Typography gutterBottom variant="subheading">
                    <em>of service usage</em>
                </Typography>
                <Typography component="div">
                    this service may <strong>NOT</strong> be used creating
                    shortened URLs that: -
                    <ul>
                        <li>
                            Are used for unsolicited advertising (spam) including
                            email, forum posts, SMS messages and spam posts/messaging
                            on social networks such as Facebook or Twitter
                        </li>
                        <li>
                            Link to malicious content (phishing, viruses, trojans,
                            adware, any other malware)
                        </li>
                        <li>Link to any form of child pornography</li>
                        <li>
                            Link to other URL shortening or redirection sites (these
                            "chains" of links are often used to hide malicious usage)
                        </li>
                        <li>Link to material that infringes copyright</li>
                        <li>
                            Link to material we consider unethical including but not
                            limited to "get rich quick" schemes, pyramid schemes, paid
                            "self help" schemes, dubious competitions, sites requiring
                            users to fill out paid surveys and sites with a model that
                            encourges users to spam others (e.g. "Sign up 10 members
                            to get X free")
                        </li>
                    </ul>
                    <dl>
                        <dt>If you want to report abuse or spam usage</dt>
                        <dd>
                            then plz email us at{' '}
                            <a href="mailto:reportabuse@baet.no">
                                <em>reportabuse@baet.no</em>
                            </a>
                        </dd>
                    </dl>
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    URL rejection and removal
                </Typography>
                <Typography component="div">
                    We can reject URLs when they are submitted or later remove,
                    disable or redirect shortened URLs for any reason. Our
                    intention is only to do this where they violate our terms or
                    the spirit of fair usage, or we have reason to suspect they do
                    (e.g. if they appear on a blacklist we consult).
                    <br />
                    <strong>
                        Please note that all urls/links are checked using{' '}
                        <em>
                            <a
                                href="https://phishtank.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                PhishTank (by OpenDNS)
                            </a>
                        </em>{' '}
                        database, and can be rejected if identified as spam!
                    </strong>
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    Warranty and liability
                </Typography>
                <Typography component="div">
                    <dl>
                        <dt>The short version:</dt>
                        <dd>
                            <strong>this service is free!</strong> We'll do our best
                            to maintain it but we might have problems or things might
                            break. If they do, life still goes on.
                        </dd>

                        <dt>The long version:</dt>
                        <dd>
                            we provide it as a free service - as such it carries no
                            warranty of any kind. Baet.no and its staff and owners are
                            not liable for any loss or problem you might suffer due to
                            using the service.
                            <br />This includes losses in the event that the service
                            stops operating, is unavailable or slow, suffers data
                            loss, or any other issue which might be considered
                            detrimental to you.
                        </dd>
                    </dl>
                </Typography>
            </CardContent>

            <CardContent>
                <Typography gutterBottom variant="headline" component="h4">
                    In case of violation
                </Typography>
                <Typography component="div">
                    If you violate these terms, depending on the severity of the
                    abuse, we may disable shortened URLs you have created or block
                    you from using baet.no temporarily or permanently.
                </Typography>
            </CardContent>

        </Card>
      </div>
    );
  }
}
Terms.contextTypes = {
  translate: PropTypes.func,
};

export default Terms;
