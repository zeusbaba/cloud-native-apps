import React, {useState, useEffect} from 'react';

import {useParams} from "react-router-dom";
import {isDev, jwtHeaderName} from './../common/AppConfig';
import {linksService, statsService} from '../common/FeathersComm';

import LinkMeta from "./LinkMeta";
import Loading from "../common/Loading";
import LinkStats from "./LinkStats";

function LinkShow(props) {

    const {displayStats} = props;
    //console.log("displayStats: " + props.displayStats);

    const [recordId, setRecordId] = useState(null);
    const [record, setRecord] = useState({});
    const [recordStats, setRecordStats] = useState({});

    // extract id from url -> "/links/:link_id/show"
    const {link_id} = useParams();
    if (isDev) {
        console.log("link_id: " + link_id);
    }

    useEffect(() => {

        setRecordId(link_id);

        if (!record._id) {

            // load item from API
            linksService
                .get(recordId, {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem(jwtHeaderName)}
                })
                .then(result => {
                    throw result;
                })
                .catch(fish => {
                    if (isDev) {
                        console.log('link-result -> ' + JSON.stringify(fish));
                    }
                    if (!fish.errors) {
                        // link exists
                        if (isDev) {
                            console.log('link exists: ' + JSON.stringify(fish));
                        }
                        setRecord({...record, ...fish});
                    } else {
                        console.log("Link doesNOT exist!!");
                        setRecord({});
                        //setRecord({...record, error:'Link doesNOT exist!'});
                    }
                });
        }
    }, [record]);

    useEffect(() => {

        if (displayStats){// && !recordStats['stats']) {
            // load stats from API
            statsService
                .get(recordId, {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem(jwtHeaderName)}
                })
                .then(result => {
                    throw result;
                })
                .catch(fish => {
                    if (isDev) {
                        console.log('link-stats-result -> ' + JSON.stringify(fish));
                    }
                    if (!fish.errors) {
                        // link exists
                        if (isDev) {
                            console.log('link stats exists: ' + JSON.stringify(fish));
                        }
                        setRecordStats({...recordStats, ...fish});
                    } else {
                        console.log("LinkStats doesNOT exist!!");
                        setRecordStats({});
                    }
                });
        }
    }, [recordStats]);

    return (
        record.long_link===null ?
            <Loading/>
            : (<div>
                <LinkMeta record={record} isSingleItem={true} />
                <br/>
                {displayStats && <LinkStats record={recordStats} /> }
                </div>)
            //<LinkMeta record={record} isSingleItem={true} />
    );

}

export default LinkShow;