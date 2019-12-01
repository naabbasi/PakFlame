import {GenericComponent} from "../GenericComponent";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import React from "react";
import {Message} from "primereact/message";

export default class SignUp extends GenericComponent {
    constructor(prop) {
        super(prop);
        this.state = {
            error: {
                text: '',
                severity: ''
            }
        };

        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        this.refs['signUpStatus'].className = 'p-hidden';
    }

    signUp() {
        if(this.byId('username').value !== '' && this.byId('password').value){
            let userInfo = {
                username: this.byId('username').value,
                password: this.byId('password').value,
                firstName: this.byId('firstName').value,
                lastName: this.byId('lastName').value
            };

            this.axios.post('/users', userInfo)
                .then( response => {
                    // handle success
                    if(response.status === 201){
                        this.refs['signUpStatus'].className = 'p-show';
                        this.setState({error: {text: response.data, severity: 'info'}});
                    }
                })
                .catch((error) =>{
                    // handle error
                    let response = error.response;
                    if(response.status === 400) {
                        this.refs['signUpStatus'].className = 'p-show';
                        this.setState({error: {text: response.data, severity: 'error'}});
                    }
                });
        }
    }

    render() {
        const footer = (
            <div>
                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                    <Button type="button" label="Signup" icon="pi pi-sign-in" className="p-button-rounded"
                            onClick={this.signUp}/>
                </div>
                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                    <a href='#/'>Login into your account</a>
                </div>
            </div>
        );

        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#007ad9'}}>
                <form>
                    <div className="LoginBox">
                        <Card title="AbuZar Traders" subTitle="Create new user to login"
                              className="ui-card-shadow" footer={footer}>

                            <div className="p-col-12">
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText id="firstName" required={true} maxLength={250} feedback={false}/>
                                        <label htmlFor="firstName">First Name: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText id="lastName" required={true} maxLength={250} feedback={false}/>
                                        <label htmlFor="lastName">Last Name: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText id="username" required={true} maxLength={250}/>
                                        <label htmlFor="username">Username: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <Password id="password" required={true} maxLength={250}/>
                                        <label htmlFor="password">Password: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" ref="signUpStatus" style={{padding:'.75em'}}>
                                    <Message severity={this.state.error['severity']} text={this.state.error['text']}/>
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