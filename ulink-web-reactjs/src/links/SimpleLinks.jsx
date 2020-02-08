import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconLaunch from '@material-ui/icons/Launch';

import { appConfig } from './../common/AppConfig';

function SimpleLinks(props) {
  const record = props.record;
  const short_link = record.short_link;
  let listItems = [];
  if (record.simple_links) {
    const simple_links = record.simple_links;
    listItems = simple_links.map(simple_link => (
      <Button size={"small"}
        key={simple_link}
        target="_blank" // rel="noopener noreferrer"
        color={"secondary"}
        href={appConfig.web.baseUrl + simple_link}
      >
          {simple_link}
          <IconLaunch style={{ fontSize: 30, marginLeft: 4 }} />
      </Button>
    ));
  }
  listItems.push(
    <Button size={"small"}
      key={short_link+"-01"}
      target="_blank" //rel="noopener noreferrer"
      color={"secondary"}
      href={appConfig.web.baseUrl + short_link}
    >
        {short_link}
        <IconLaunch style={{ fontSize: 30, marginLeft: 4 }} />
    </Button>
  );

  return <div>{listItems}</div>;
}
SimpleLinks.propTypes = {
  record: PropTypes.object,
};

export default SimpleLinks;
