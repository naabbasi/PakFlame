import React from 'react';
import Navigation from "../layout/Navigation";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {GenericComponent} from "../GenericComponent";
import {Dialog} from "primereact/dialog";

export default class Companies extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            company: {},
            selectedWarehouse: {}
        };

        //creating refs
        this.companiesDataTable = React.createRef();

        this.addNewCompany = this.addNewCompany.bind(this);
        this.saveCompany = this.saveCompany.bind(this);
        this.closeCompanyDialog = this.closeCompanyDialog.bind(this);
        this.onCompanySelect = this.onCompanySelect.bind(this);
    }

    async componentDidMount() {
        //this.companiesDataTable.current.props.loading = true;
        console.log(this.companiesDataTable.current);
        this.getWarehouses();
    }

    getWarehouses() {
        // Make a request for a companies
        this.axios.get('/companies')
            .then( response => {
                // handle success
                if(response.status === 200){
                    this.setState({companies: response.data});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    saveCompany() {
        if(this.NewCompany){
            this.axios.post('/companies', this.state.company)
                .then( response => {
                    // handle success
                    if(response.status === 201){
                        this.setState({companies: null, selectedWarehouse:null, company: null, displayDialog:false});
                        this.getWarehouses();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else{
            this.axios.put('/companies',this.state.company)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({companies: null, selectedWarehouse:null, company: null, displayDialog:false});
                        this.getWarehouses();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteCompany(companyId) {
        this.axios.delete(`/companies/${companyId}`)
            .then( response => {
                // handle success
                if(response.status === 204){
                    this.setState({companies: null, selectedWarehouse:null, company: null, displayDialog:false});
                    this.getWarehouses();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    addNewCompany() {
        this.NewCompany = true;
        this.setState({
            company: {companyName: '', contactPerson: '', mobileNumber: '', email: ''},
            displayDialog: true
        });
    }

    editWarehouse(e) {
        this.NewCompany = false;
        this.setState({
            displayDialog:true,
            company: Object.assign({}, e.data)
        });
    }

    closeCompanyDialog() {
        this.setState({selectedWarehouse:null, company: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let company = this.state.company;
        company[property] = value;
        this.setState({company: company});
    }

    onCompanySelect(e){
        this.NewCompany = false;
        this.setState({
            displayDialog:true,
            company: Object.assign({}, e.data)
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Warehouses Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Warehouse(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" style={{float:'left'}} label="Add Company" icon="pi pi-plus" onClick={this.addNewCompany}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveCompany}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteCompany}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeCompanyDialog}/>
        </div>;

        return <div>
            <Navigation>
                <div className="content-section implementation">
                    <DataTable ref={this.companiesDataTable} loading={false} value={this.state.companies} paginator={true} rows={25}  header={header} footer={footer}
                               scrollable={true} scrollHeight="700px" responsive={true}
                               selectionMode="none" selection={this.state.selectedWarehouse} onSelectionChange={e => this.setState({selectedWWarehouse: e.value})}
                               globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                        <Column field="companyName" header="Company Name" sortable={true} style={{width: '25%'}}/>
                        <Column field="contactPerson" header="Contact Person" sortable={true} style={{width: '25%'}}/>
                        <Column field="mobileNumber" header="Mobile #" sortable={true} style={{width: '19%'}}/>
                        <Column field="email" header="Email" sortable={true} style={{textAlign: 'left', width: '19%'}}/>
                        <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'companies', this.state)} style={{width: '12%'}}/>
                    </DataTable>
                    <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Warehouse Details"
                            modal={true} footer={dialogFooter}
                            onShow={()=> this.refs['firstName']}
                            onHide={() => this.setState({displayDialog: false})}>
                        {
                            this.state.company &&
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="companyName" maxLength={255} onChange={(e) => {this.updateProperty('companyName', e.target.value)}} value={this.state.company.companyName}/>
                                                <label htmlFor="companyName">Company Name</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="contactPerson" maxLength={255} onChange={(e) => {this.updateProperty('contactPerson', e.target.value)}} value={this.state.company.contactPerson}/>
                                                <label htmlFor="contactPerson">Contact Person</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="mobileNumber" maxLength={11} onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.company.mobileNumber}/>
                                                <label htmlFor="mobileNumber">Mobile Number</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="email" maxLength={500} onChange={(e) => {this.updateProperty('email', e.target.value)}} value={this.state.company.email}/>
                                                <label htmlFor="email">Email</label>
                                            </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            </Navigation>
        </div>
    }
}
