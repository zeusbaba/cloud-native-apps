import React, {useState, useEffect} from 'react';

import {useParams} from "react-router-dom";
import {appConfig, isDev, jwtHeaderName} from './../common/AppConfig';
import {linksService} from '../common/FeathersComm';

import LinkMeta from "./LinkMeta";
import Loading from "../common/Loading";

function LinkShow() {

    const [recordId, setRecordId] = useState(null);
    const [record, setRecord] = useState({});

    // extract id from url -> "/links/:link_id/show"
    const {link_id} = useParams();
    if (isDev) {
        console.log("link_id: " + link_id);
    }

    useEffect(() => {

        setRecordId(link_id);
        /*if (recordId === null) {
            setRecordId(link_id);
        }*/
        /*if (isDev) {
            console.log(
                "1 - recordId: " + recordId
                + " | record: " + JSON.stringify(record)
            );
        }*/

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

                        /*if (isDev) {
                            console.log(
                                "2 - recordId: " + recordId
                                + " | record: " + JSON.stringify(record)
                            );
                        }*/
                    } else {
                        console.log("Link doesNOT exist!!");
                        setRecord({});
                        //setRecord({...record, error:'Link doesNOT exist!'});
                    }
                });
        }

        //return () => {};
    }, [record]);

    return (
        record.long_link===null ? <Loading/> : <LinkMeta record={record} isSingleItem={true}/>
    );
    /*return (
        <div>
            Link to display
            <br/> link_id: {recordId}
            <br/> link: { record===null ? '' : JSON.stringify(record) }
            <br/>---<br/>

            {record._id != null &&
                <LinkMeta record={record}/>
            }

        </div>
    )*/

}

export default LinkShow;