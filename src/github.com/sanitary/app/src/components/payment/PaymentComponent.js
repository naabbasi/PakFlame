import React from "react";
import {GenericComponent} from "../GenericComponent";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";

export default class PaymentComponent extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            payment: {},
            showDialog: false
        };
    }

    componentDidUpdate() {
        console.log("Payment Details")
        console.log(this.refs.current)
    }

    updateProperty(property, value) {
        let payment = this.state.payment;
        payment[property] = value;
        this.setState({payment: payment});
    }

    render() {
        return <div>
            {
                this.state.payment &&
                <div className="p-grid">
                    <div className="p-col-12">
                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="amount" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('amount', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('amount', this.Float(e.target.value))}}
                                               value={this.state.payment.amount}/>
                                    <label htmlFor="amount">Amount</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="remaining" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('remaining', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('remaining', this.Float(e.target.value))}}
                                               value={this.state.payment.remaining}/>
                                    <label htmlFor="remaining">Remaining Amount</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="total" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('total', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('total', this.Float(e.target.value))}}
                                               value={this.state.payment.total}/>
                                    <label htmlFor="total">Total Amount</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <span className="p-float-label p-fluid">
                                        <Calendar showIcon={true} hideOnDateTimeSelect={true} showTime={true} onChange={(e) => {this.updateProperty('createAt', e.target.value)}} value={this.state.payment.createAt}/>
                                        <label htmlFor="createAt">Date</label>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    }
}