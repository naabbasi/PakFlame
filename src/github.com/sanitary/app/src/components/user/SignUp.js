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
        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        this.byId('signUpStatus').className = 'p-hidden';
    }

    signUp() {
        if(this.byId('newUsername').value !== '' && this.byId('newPassword').value){
            this.axios.post('/users', {username: this.byId('newUsername').value, password: this.byId('newPassword').value})
                .then( response => {
                    // handle success
                    if(response.status === 201){
                        console.log(response.data);
                        this.byId('signUpStatus').className = 'p-show';
                        this.byId('signUpStatus').innerHTML = response.data;
                    }
                })
                .catch((error) =>{
                    // handle error
                    let response = error.response;
                    if(response.status === 304) {
                        this.byId('signUpStatus').className = 'p-show';
                        this.byId('signUpStatus').innerHTML = response.data;
                    }
                });
        }
    }

    render() {
        const footer = (
            <div className="p-col p-fluid" style={{padding:'.75em'}}>
                <Button type="button" label="Signup" icon="pi pi-sign-in" className="p-button-rounded"
                        onClick={this.signUp}/>
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
                                        <InputText id="newUsername" required={true} maxLength={250}/>
                                        <label htmlFor="newUsername">Username: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <Password id="newPassword" required={true} maxLength={250} feedback={false}/>
                                        <label htmlFor="newPassword">Password: </label>
                                    </span>
                                </div>
                                <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                    <Message ref="signUpStatus" id="signUpStatus" severity={"error"} text=""/>
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