import React, {Component} from 'react';
import {Button} from "primereact/button";
import { useHistory } from "react-router-dom";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {GenericComponent} from "./GenericComponent";
import {Message} from "primereact/message";

export default class Login extends GenericComponent {
    constructor(prop) {
        super(prop);
        this.state = {
            isLoggedIn: false
        };
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "#/") {
            window.location.hash = 'customers';
        } else {
            document.getElementById('loginComponent').style.backgroundColor = '#007ad9';
            document.getElementById('loginComponent').className = 'p-show';
        }
    }

    login() {
        console.log(this.byId('username').value )
        console.log(this.byId('password').value )
        if(this.byId('username').value !== '' && this.byId('password').value){
            window.localStorage.setItem("isLoggedIn", "{username: 'Waris Ali'}");
            window.location.hash="customers";

            this.axios.post('/users/login', {username: this.byId('username').value, password: this.byId('password').value})
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 200){
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        } else {
            return false;
        }
    }

    render() {
        const footer = (
            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                <Button type="submit
                " label="Login" icon="pi pi-sign-in" className="p-button-rounded"/>
            </div>
        );

        return (
            <div id="loginComponent" style={{position: 'absolute', width: '100%', height: '100%'}} className="p-hidden">
                <form onSubmit={this.login}>
                    <div className="LoginBox">
                        <Card title="AbuZar Traders" subTitle="Please sign-in"
                              className="ui-card-shadow" footer={footer}>

                            <div className="p-col-12">
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText id="username" required={true} maxLength={250}/>
                                        <label htmlFor="username">Username: </label>
                                    </span>
                                    {/*<Message id="invalidUsername" severity={"error"} text="Please enter username"/>*/}
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <Password id="password" required={true} maxLength={250} feedback={false}/>
                                        <label htmlFor="password">Password: </label>
                                    </span>
                                    {/*<Message id="invalidPassword" severity={"error"} text="Please enter password"/>*/}
                                </div>
                            </div>
                        </Card>
                    </div>
                </form>
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