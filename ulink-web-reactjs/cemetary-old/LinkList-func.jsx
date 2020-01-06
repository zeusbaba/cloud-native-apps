import React, {useState, useEffect} from 'react';

import {appConfig, isDev, jwtHeaderName} from '../src/common/AppConfig';
import {feathersClient} from '../src/common/FeathersComm';

import Loading from "../src/common/Loading";

function LinkList() {

    const [records, setRecords] = useState({});
    useEffect(() => {

        // load items from API
        feathersClient
            .service('links')
            .find({
                headers: {'Authorization': 'Bearer ' + localStorage.getItem(jwtHeaderName)}
            })
            .then(result => {
                throw result;
            })
            .catch(fish => {

                if (isDev) {
                    console.log(JSON.stringify(fish));
                }
                if (!fish.errors) {
                    // link exists
                    if (isDev) {
                        console.log('links: ' + fish.data);
                    }
                    setRecords({...records, ...fish});
                } else {
                    console.log("Links error!!");
                    //setRecords({});
                }
            });


        //return () => {};
    }, [records]);


    return (
        records.total===null ? <Loading/>
            : <div>{ JSON.stringify(records) }</div>
    );
}
export default LinkList;