import React, {useState, useEffect} from 'react';

import {appConfig, isDev, jwtHeaderName} from './../common/AppConfig';
import {linksService} from '../common/FeathersComm';

import LinkMeta from "./LinkMeta";
import Loading from "../common/Loading";
import Flag from "react-world-flags";
import Fab from "@material-ui/core/Fab";

/*function ReloadLinks(props) {
    return (
       <div>
           <Fab variant="extended"
                color={"primary"}
                style={{marginRight: 4}}
                size={'medium'}
                onClick={() => this.loadLinksFromApi }
           >
               RELOAD
           </Fab>
       </div>
    );
}*/
function DisplayLinksList(props) {

    const {records} = props;
    return (
        <div>
            {records.data.map((record, key) =>
                <LinkMeta key={key} record={record} />)
            }
        </div>
    );
}
class LinkList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            records: {data: []}
        };

        this.loadLinksFromApi = this.loadLinksFromApi.bind(this);
    }

    loadLinksFromApi(event) {
        linksService
            .find({
                headers: {'Authorization': 'Bearer ' + localStorage.getItem(jwtHeaderName)}
            })
            .then(result => {
                throw result;
            })
            .catch(fish => {

                if (!fish.errors) {
                    // link exists
                    if (isDev) {
                        console.log('total: ' + fish.total + ' | resp: ' + JSON.stringify(fish));
                    }
                    this.setState({records: fish});
                    //this.setState({...this.state.records, ...fish});
                    //setRecords({...records, ...fish});
                    console.log('records: ' + JSON.stringify(this.state.records));
                } else {
                    console.log("Links error!!... resp: " + JSON.stringify(fish));
                    //setRecords({});
                }
            });
    }


    componentDidMount() {
        this.loadLinksFromApi();
    };

    render() {

        return (
            this.state.records.total===null ? <Loading/>
            //    : <div>{ JSON.stringify(this.state.records) }</div>
                : <div>
                    <div>
                        <Fab variant="extended"
                             color={"primary"}
                             style={{marginRight: 4}}
                             size={'medium'}
                             onClick={this.loadLinksFromApi}
                        >
                            RELOAD
                        </Fab>
                    </div>
                    <br/>
                    <DisplayLinksList records={this.state.records}/>
                </div>
            /*: <div>
                    {this.state.records.data.map((record, key) => <LinkMeta key={record._id} record={record} />)}
                </div>*/
        );
    }
}
export default LinkList;