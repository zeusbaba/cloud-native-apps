import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconShare from '@material-ui/icons/Share';

// https://github.com/nygardk/react-share
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
} from 'react-share';

import { appConfig } from './../common/AppConfig';
import { translator, styles } from './LinkAssets';

function SocialButton(props) {
  /*if (props.social === 'twitter') {
    return (
      <TwitterShareButton
          url={props.shareUrl}
          title={props.title}
          //via='baet.no'
          hashtags={['baet', 'shortlink']}
          className="socialshare_network_share-button"
          >
          <TwitterIcon
            size={32}
            round />
        </TwitterShareButton>
    );
  }
  else */
  if (props.social === 'facebook') {
    return (
      <FacebookShareButton
        url={props.shareUrl}
        quote={props.title + ' ' + props.description}
        className="socialshare_network_share-button"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
    );
  } else if (props.social === 'linkedin') {
    return (
      <LinkedinShareButton
        url={props.shareUrl}
        title={props.title + ' ' + props.description}
        description={props.description}
        className="socialshare_network_share-button"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    );
  } else if (props.social === 'whatsapp') {
    return (
      <WhatsappShareButton
        url={props.shareUrl}
        title={props.title + ' ' + props.description}
        className="socialshare_network_share-button"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    );
  } else if (props.social === 'email') {
    return (
      <EmailShareButton
        url={props.shareUrl}
        title={props.title}
        description={props.description}
        className="socialshare_network_share-button"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    );
  } else {
    // default twitter
    return (
      <TwitterShareButton
        url={props.shareUrl}
        title={props.title + ' ' + props.description}
        //via='baet.no'
        hashtags={['baet', 'shortlink']}
        className="socialshare_network_share-button"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    );
  }
}
SocialButton.propTypes = {
  social: PropTypes.string,
  shareUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

const ITEM_HEIGHT = 48;
class SocialShareButtons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { itemData } = this.props;

        const short_link = itemData.short_link;
        //const simple_links = record.simple_links;

        const shareUrl = appConfig.web.baseUrl + short_link;
        const title = ''; //'baet.no';
        const description = appConfig.web.sharerText; //'Shorten & Simplify via BAET.no';

        return (
            <div>
                <Button variant="contained"
                        size={"medium"} color={"secondary"}
                    aria-label="More"
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    {
                        //translate('resources.links.buttons.share')
                        translator.links.buttons.share
                    }
                    <IconShare style={{ fontSize: 36, marginLeft: 4 }} />
                </Button>

                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 60,
                        },
                    }}
                >
                    <MenuItem
                        key={"twitter"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"twitter"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                    <MenuItem
                        key={"facebook"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"facebook"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                    <MenuItem
                        key={"google"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"google"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                    <MenuItem
                        key={"linkedin"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"linkedin"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                    <MenuItem
                        key={"whatsapp"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"whatsapp"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                    <MenuItem
                        key={"email"} onClick={this.handleClose}
                    >
                        <SocialButton
                            social={"email"}
                            title={title}
                            shareUrl={shareUrl}
                            description={description}
                        />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
export default SocialShareButtons;


