import {Component} from 'react';
import axios from 'axios';

export class GenericComponent extends Component {
    constructor() {
        super();
        this.axios = axios.create({
            baseURL: 'http://localhost:1323/api',
            responseType: 'json'
        });
    }
}