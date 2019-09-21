import React, {lazy, Suspense} from 'react';
import { HashRouter as HashRouter, BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import './App.css';

import {Menubar} from "../node_modules/primereact/menubar";
import Login from "./components/Main";

const Customer = lazy(() => import ("./components/Customer"));
const Worker = lazy(() => import ("./components/Worker"));

const items = [
    {
        label: 'Customers',
        icon:'pi pi-fw pi-file',
        command:()=>{ window.location.hash="customers"; }
    },
    {
        label: 'Workers',
        icon:'pi pi-fw pi-file',
        command:()=>{ window.location.hash="workers"; }
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
            <Route exact path="/" component={Login}></Route>
            <Route exact path="/customers" component={WaitingComponent(Customer)}></Route>
            <Route exact path="/workers" component={WaitingComponent(Worker)}></Route>
            <Route path="/customer1" render={(props) => <PropDemo name="Noman ALi" />}></Route>
        </HashRouter>
    </div>
  );
}

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={<div>Loading ...</div>}>
            <Component {...props} />
        </Suspense>
    );
}

export default App;
