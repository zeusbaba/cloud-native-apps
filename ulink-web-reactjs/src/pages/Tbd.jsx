import React from 'react';

import { Card, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export default () => (
  <Card style={{ margin: '2em' }}>
      <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
              TBD...title
          </Typography>
          <Typography gutterBottom variant="headline" component="h3">
              TBD...subtitle
          </Typography>
          <Typography component="div">
              TBD...text...
          </Typography>
      </CardContent>
  </Card>
);
