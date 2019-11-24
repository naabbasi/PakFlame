import React, {Component} from 'react';
import {Button} from "primereact/button";
import { useHistory } from "react-router-dom";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {GenericComponent} from "./GenericComponent";
import {Message} from "primereact/message";

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