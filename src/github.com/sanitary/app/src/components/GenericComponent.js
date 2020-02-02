import {Component} from 'react';
import axios from 'axios';

export class GenericComponent extends Component {
    constructor(props) {
        super(props);
        let url = window.location.hostname;
        this.axios = axios.create({
            baseURL: 'http://' + url + '/api',
            responseType: 'json',
            headers: {
                //'X-Author-Header': 'engr.nomiabbasi@gmail.com',
                'X-Client-ID': 'client-id-needs-to-be-updated'
            },
            withCredentials: true,
        });

        // Add a request interceptor
        this.axios.interceptors.request.use((config) => {
            // Do something before request is sent
            console.log("Request interceptor");
            if(window.localStorage.getItem("isLoggedIn") === null && window.location.hash !== "#/signup") {
                window.location.hash = '/';
            } if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "/") {
                window.location.hash = '/customers';
            }

            if(window.localStorage.getItem("isLoggedIn") !== null){
                let user = window.localStorage.getItem("isLoggedIn");
                config.headers['X-Client-ID'] = JSON.parse(user)['client_id'];
                console.log(config.headers);
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

    dateFormatter(rowData,column){
        let options = {day: 'numeric', year: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric'}
        let date = new Date(rowData['createdAt']).toLocaleDateString('en-PK', options);
        return "" + date;
    }
}
