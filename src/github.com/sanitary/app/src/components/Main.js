import React, {Component} from 'react';
import {Button} from "primereact/button";
import { useHistory } from "react-router-dom";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";

export default class Login extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            isLoggedIn: false
        };
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        console.log('asds');
        if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "#/") {
            window.location.hash = 'customers';
        } else {
            document.getElementById('loginComponent').style.backgroundColor = '#007ad9';
            document.getElementById('loginComponent').className = 'p-show';
        }
    }

    login() {
        window.localStorage.setItem("isLoggedIn", "{username: 'Waris Ali'}");
        window.location.hash="customers";
    }

    render() {
        const footer = (
            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                <Button label="Login" icon="pi pi-sign-in" className="p-button-rounded" onClick={this.login}/>
            </div>
        );

        return (
            <div id="loginComponent" style={{position: 'absolute', width: '100%', height: '100%'}} className="p-hidden">
                <div className="LoginBox">
                    <Card title="AbuZar Traders" subTitle="Please sign-in"
                          className="ui-card-shadow" footer={footer}>

                        <div className="p-col-12">
                            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="username" maxLength={250}/>
                                    <label htmlFor="username">Username: </label>
                                </span>
                            </div>
                            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <Password id="password" maxLength={250}/>
                                    <label htmlFor="password">Password: </label>
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                <style jsx="false">{`
                    .LoginBox {
                        position: absolute;
                        top: 15%;
                        left: 29%;                     
                        width: 40%;
                    }
                `}
                </style>
            </div>
        );
    }
}

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