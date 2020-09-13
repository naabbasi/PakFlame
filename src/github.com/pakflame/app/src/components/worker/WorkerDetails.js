import React from 'react';
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import PaymentComponent from "../payment/PaymentComponent";

export default class WorkerDetails extends GenericComponent {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(props.location.search);
        console.log(params.get('id'));

        this.state = {
            worker: {},
            workerId: params.get('id') == null ? 0 : params.get('id'),
        };

        //Refs
        this.paymentRef = React.createRef();
        this.close = this.close.bind(this);
        this.onPaymentSelect = this.onPaymentSelect.bind(this);
    }

    async componentDidMount() {
        this.getWorkerById();
    }

    getWorkerById() {
        // Make a request for a workers
        this.axios.get(`/workers/${this.state.workerId}`)
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({worker: response.data});
                this.paymentRef.current.getPaymentsByEntityId(this.state.worker['id'])
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    close() {
        this.setState({selectedWorker:null, worker: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let worker = this.state.worker;
        worker[property] = value;
        this.setState({worker: worker});
    }

    onPaymentSelect(e){
        this.setState({eventWorkerData: e.data, askReasonDialog: true});
    }

    addNew() {
        this.newWorker = true;
        this.setState({
            worker: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', status: ''},
            displayDialog: true
        });
    }

    render() {
        return(
            <Navigation>
                <div className="content-section implementation">
                    <div>
                        <div className="p-col-12">
                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="firstName" readOnly={true} maxLength={255} onChange={(e) => {this.updateProperty('firstName', e.target.value)}} value={this.state.worker.firstName}/>
                                        <label htmlFor="firstName">First Name</label>
                                    </span>
                                </div>

                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="lastName" readOnly={true} maxLength={255} onChange={(e) => {this.updateProperty('lastName', e.target.value)}} value={this.state.worker.lastName}/>
                                        <label htmlFor="lastName">Last Name</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PaymentComponent ref={this.paymentRef} type="worker"></PaymentComponent>
                </div>
            </Navigation>
        );
    }
}
