import React, {Component} from 'react';
import axios from 'axios';

export class GenericComponent extends Component {
    constructor(props) {
        super(props);
        let url = window.location.hostname;
        this.axios = axios.create({
            baseURL: 'http://' + url,
            responseType: 'json',
            headers: {
                'Authorization': 'engr.nomiabbasi@gmail.com'
            },
            withCredentials: false,
        });

        // Add a request interceptor
        this.axios.interceptors.request.use((config) => {
            // Do something before request is sent
            console.log("Request interceptor");
            if(window.localStorage.getItem("isLoggedIn") === null && window.location.hash !== "#/signup") {
                window.location.hash = '/';
            } else if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "/") {
                window.location.hash = '/customers';
            }

            if(window.localStorage.getItem("isLoggedIn") !== null){
                let user = window.localStorage.getItem("isLoggedIn");
                config.headers['Authorization'] = `Bearer ${JSON.parse(user)['token']}`;

                if(JSON.parse(user)['token']){
                    config.url = '/restricted/api' + config.url;
                }
            } else {
                config.url = '/api' + config.url;
            }

            return config;
        }, (error) =>{
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        this.axios.interceptors.response.use((response) => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            console.log("Response interceptor");
            return response;
        }, (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        });
    }

    byId = (id) => document.getElementById(id);

    Int = (value) => {
        if (value === ""){
            return 0;
        } else {
            return parseInt(value);
        }
    };

    Float = (value) => {
        if (value === ""){
            return 0.0;
        } else {
            return parseFloat(value);
        }
    };

    dateFormatter(rowData,column, componentState){
        let options = {day: 'numeric', year: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric'}
        let date = new Date(rowData['createdAt']).toLocaleDateString('en-PK', options);
        return "" + date;
    }

    actionColumn = (rowData,column, entityName, componentState) => {
        return <div className="p-clearfix" style={{textAlign: 'center'}}>
            <a onClick={(e)=> this.editEntity(rowData, entityName, componentState)}>Edit</a> |
            <a onClick={(e)=> this.deleteEntity(rowData, entityName, componentState)}>Delete</a>
        </div>;
    };

    editEntity(rowData, entityName, componentState) {
        console.log(`editEntity ${rowData['id']}, ${entityName}`);
        console.log(componentState);

        if(entityName === 'warehouses'){
            this.onWarehouseSelect({data: rowData});
        } else if(entityName === 'customers'){
            this.onCustomerSelect({data: rowData});
        } else if(entityName === 'workers'){
            this.onWorkerSelect({data: rowData});
        } if(entityName === 'inventory'){
            this.onInventorySelect({data: rowData});
        } else if(entityName === 'invoices') {
            this.onInvoiceSelect({data: rowData});
        }
    }

    deleteEntity(rowData, entityName, componentState) {
        console.log(`deleteEntity ${rowData['id']}, ${entityName}, ${componentState}`);
        console.log(componentState)
    }
}
