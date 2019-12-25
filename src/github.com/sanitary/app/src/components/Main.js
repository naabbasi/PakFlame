import React, {Component} from 'react';

export class Welcome extends Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

export function Test() {
    return (<h2>Function Test</h2>);
}

export const Test1 = () => {
    return (<h3>Constant Test 1</h3>);
}