import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { ReactElement } from 'react';
import { ComponentBase } from 'resub';
import CounterStore from './CounterStore';

export interface CounterProps {}

interface CounterState {
    counter: number;
}

export default class CounterDisplay extends ComponentBase<CounterProps, CounterState> {
    protected _buildState() {
        return {
            counter: CounterStore.getCounter(),
        };
    }

    public render(): ReactElement<any> {
        return (
            <>
                <div>
                    <h1>{ this.state.counter }</h1>
                </div>
            </>
        );
    }
}