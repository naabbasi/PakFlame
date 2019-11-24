import {GenericComponent} from "../GenericComponent";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Message} from "primereact/message";
import React from "react";

export default class Login extends GenericComponent {
    constructor(prop) {
        super(prop);
        this.state = {
            isLoggedIn: false
        };
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        console.log(this.refs['loginStatus']);
        if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "#/") {
            window.location.hash = 'customers';
        } else {
            this.byId('loginComponent').style.backgroundColor = '#007ad9';
            this.byId('loginComponent').className = 'p-show';
            //this.byId('loginStatus').className = 'p-hidden';
        }
    }

    login() {
        if(this.byId('username').value !== '' && this.byId('password').value){
            this.axios.post('/users/login', {username: this.byId('username').value, password: this.byId('password').value})
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 200){
                        console.log(response.data);
                        window.localStorage.setItem("isLoggedIn", "{username: 'Waris Ali'}");
                        window.location.hash="customers";
                    }
                })
                .catch(error => {
                    // handle error
                    let response = error.response;
                    if(response.status === 401) {
                        console.log(this.refs['loginStatus'].props['text']);
                        //this.byId('loginStatus').className = 'p-show';
                        this.refs['loginStatus'].props['text'] = response.data;
                    }
                });
        } else {
            return false;
        }
    }

    render() {
        const footer = (
            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                <Button type="button" label="Login" icon="pi pi-sign-in" className="p-button-rounded"
                        onClick={this.login}/>
            </div>
        );

        return (
            <div id="loginComponent" style={{position: 'absolute', width: '100%', height: '100%'}} className="p-hidden">
                <form>
                    <div className="LoginBox">
                        <Card title="AbuZar Traders" subTitle="Please sign-in"
                              className="ui-card-shadow" footer={footer}>

                            <div className="p-col-12">
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText id="username" required={true} maxLength={250}/>
                                        <label htmlFor="username">Username: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <Password id="password" required={true} maxLength={250} feedback={false}/>
                                        <label htmlFor="password">Password: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <Message ref="loginStatus" id="loginStatus" severity={"error"} text=""/>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <a href='#/signup'>Sign up for your account</a>
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