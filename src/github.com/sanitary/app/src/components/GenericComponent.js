import {Component} from 'react';
import axios from 'axios';

export class GenericComponent extends Component {
    constructor() {
        super();
        let url = window.location.hostname;
        this.axios = axios.create({
            baseURL: 'http://' + url + '/api',
            responseType: 'json'
        });
    }
}