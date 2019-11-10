import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {GenericComponent} from "./GenericComponent";
import Navigation from "./layout/Navigation";

export default class Worker extends GenericComponent {

    constructor() {
        super();
        this.state = {};
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onWorkerSelect = this.onWorkerSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        // Make a request for a users
        this.axios.get('/workers')
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 200){
                    this.setState({workers: response.data});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    save() {
        let workers = [...this.state.workers];
        if(this.newworker)
            workers.push(this.state.worker);
        else
            workers[this.findSelectedworkerIndex()] = this.state.worker;

        this.setState({workers:workers, selectedworker:null, worker: null, displayDialog:false});
    }

    delete() {
        let index = this.findSelectedworkerIndex();
        this.setState({
            workers: this.state.workers.filter((val,i) => i !== index),
            selectedWorker: null,
            worker: null,
            displayDialog: false});
    }

    findSelectedworkerIndex() {
        return this.state.workers.indexOf(this.state.selectedWorker);
    }

    updateProperty(property, value) {
        let worker = this.state.worker;
        worker[property] = value;
        this.setState({worker: worker});
    }

    onWorkerSelect(e){
        this.newworker = false;
        this.setState({
            displayDialog:true,
            worker: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newworker = true;
        this.setState({
            worker: {firstname: '', lastname: '', mobileNumber: '', status: ''},
            displayDialog: true
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Worker Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Worker(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Add" icon="pi pi-plus" onClick={this.addNew}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Delete" icon="pi pi-times" onClick={this.delete}/>
            <Button label="Save" icon="pi pi-check" onClick={this.save}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable value={this.state.workers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedWorker} onSelectionChange={e => this.setState({selectedWorker: e.value})}
                                   onRowSelect={this.onWorkerSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstname" header="First Name" sortable={true} />
                            <Column field="lastname" header="Last Name" sortable={true} />
                            <Column field="mobileNumber" header="Mobile Number" sortable={true} />
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'center'}} />
                            <Column field="status" header="Status" sortable={true} style={{textAlign: 'center'}} />
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="worker Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.worker &&

                                <div className="p-grid p-fluid">
                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="firstname">First Name</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="firstname" onChange={(e) => {this.updateProperty('firstname', e.target.value)}} value={this.state.worker.firstname}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="lastname">Year</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="lastname" onChange={(e) => {this.updateProperty('lastname', e.target.value)}} value={this.state.worker.lastname}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="mobileNumber">Mobile Number</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="mobileNumber" onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.worker.mobileNumber}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="status">Status</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="status" onChange={(e) => {this.updateProperty('status', e.target.value)}} value={this.state.worker.status}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="address">Address</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="status" onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.worker.address}/>
                                    </div>
                                </div>
                            }
                        </Dialog>
                    </div>
                </Navigation>
            </div>
        );
    }
}
