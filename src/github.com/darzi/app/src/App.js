import React, {lazy, Suspense} from 'react';
import { HashRouter as HashRouter, BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import './App.css';

//const {Login} = lazy(() => import("./components/Main"));
import {Customer} from "./components/Customer";
import {Menubar} from "../node_modules/primereact/menubar";

//const {Customer} = lazy(() => import ("./components/Customer"));

const items = [
    {
        label: 'Customer',
        icon:'pi pi-fw pi-file',
        command:()=>{ window.location.hash="customer"; }
    },
    {
        label:'Delete',
        icon:'pi pi-fw pi-trash',
        command:()=>{ window.location.hash="customer1"; }
    }
];

const data = {name: 'Nomn Ali'};

function PropDemo(props) {
    return (
        <h4>{props.name}</h4>
    );
}

function App() {
  return (
    <div>
        <Menubar model={items}></Menubar>
        <HashRouter>
            <Route exact path="/customer" component={Customer}></Route>
            <Route path="/customer1" render={(props) => <PropDemo name="Noman ALi" />}></Route>
        </HashRouter>
    </div>
  );
}

export default App;
