import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = {
    card: {
        width: '80%', //800,
        //minHeight: 800,
        margin: '0.2em',
        display: 'inline-block',
        verticalAlign: 'top',
        textAlign: 'center',
        //fontSize: 20,
        //color: '#666',
        //borderTop: '1px solid #f2f2f2'
    },
    cardText: {
        fontSize: 'medium',
    },
};

export default () => (
    <Card style={styles.card}>
        <CardContent
            //title={translate('aor.page.not_found')}
            //subtitle={"404: Page not found"}
            title={'404: Page not found'}
        />
        <CardContent style={styles.cardText}>
      <span>
        <img
            src={'/images/404ninja.jpg'}
            width="600"
            height="600"
            alt="404ninja"
        />
      </span>
        </CardContent>
    </Card>
);
