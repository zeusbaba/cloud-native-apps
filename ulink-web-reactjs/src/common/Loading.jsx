import React from "react";
import Spinner from "react-spinkit";
import {Col, Container, Row} from "react-grid-system";

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
};
function Loading() {

    return (
        <div style={{...styles.main}}>
            <Container>
                <Row>
                    <Col xs={4} md={4}/>
                    <Col xs={8} md={8}>
                        Loading...
                    </Col>
                </Row>
                <Row>
                    <Col xs={8} md={8}>
                        <Spinner name="pacman" color="olive"/>
                    </Col>
                    <Col xs={4} md={4}>
                        <Spinner name="ball-triangle-path" color="olive"/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default Loading;