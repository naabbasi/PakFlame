import {Component} from 'react';
import axios from 'axios';

export class GenericComponent extends Component {
    constructor(props) {
        super(props);
        let url = window.location.hostname;
        this.axios = axios.create({
            baseURL: 'http://' + url + '/api',
            responseType: 'json',
            //headers: {'X-Author-Header': 'engr.nomiabbasi@gmail.com'},
            withCredentials: true,
        });

        // Add a request interceptor
        this.axios.interceptors.request.use((config) => {
            // Do something before request is sent
            console.log("Request interceptor");

            if(window.localStorage.getItem("isLoggedIn") === null) {
                window.location.hash = '/';
            } if(window.localStorage.getItem("isLoggedIn") !== null && window.location.hash === "/") {
                window.location.hash = '/customers';
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
}