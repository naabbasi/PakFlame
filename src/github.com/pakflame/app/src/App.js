import React, {Component, lazy, Suspense} from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import './App.css';

import {Card} from "primereact/card";
import GComp from "./learn/GComp";
import CallChildFunction from './learn/CallChildFunction';
import CustomerDetails from "./components/customer/CustomerDetails";
import WorkerDetails from "./components/worker/WorkerDetails";


const Login = lazy(() => import ("./components/user/Login"));
const SignUp = lazy(() => import ("./components/user/SignUp"));
const Dashboard = lazy(() => import ("./components/dashboard/Dashboard"));
const Customer = lazy(() => import ("./components/customer/Customer"));
const Invoices = lazy(() => import ("./components/invoices/Invoices"));
const Invoice = lazy(() => import ("./components/invoices/Invoice"));
const ProductInvoice = lazy(() => import ("./components/invoices/ProductInvoice"));
const Worker = lazy(() => import ("./components/worker/Worker"));
const Inventory = lazy(() => import ("./components/inventory/Inventory"));
const IssueInventory = lazy(() => import ("./components/inventory/IssueInventory"));
const Products = lazy(() => import ("./components/products/Products"));
const Warehouse = lazy(() => import ("./components/warehouses/Warehouses"));
const Companies = lazy(() => import ("./components/companies/Companies"));

class NotFound extends Component {
    render() {
        return <div style={{position: 'absolute', width: '100%', height: '100%', textAlign: 'center'}}>
            <h4>Page not found !!!</h4>
            Click here to <a href="/">Home</a>
        </div>
    }
}

const Logout = (()=>{
    window.localStorage.clear();
    window.location.hash = '#/';
    return <div>
    </div>
});

/*const NotFound = ( ()=>{
    return (<div>Noman</div>)
});*/

function App() {
    //usePageViews();
    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={WaitingComponent(Login)}></Route>
                    <Route exact path="/signup" component={WaitingComponent(SignUp)}></Route>
                    <Route exact path="/dashboard" component={WaitingComponent(Dashboard)}></Route>
                    <Route exact path="/customers" component={WaitingComponent(Customer)}></Route>
                    <Route exact path="/customers/details" component={WaitingComponent(CustomerDetails)}></Route>
                    <Route exact path="/workers" component={WaitingComponent(Worker)}></Route>
                    <Route exact path="/workers/details" component={WaitingComponent(WorkerDetails)}></Route>
                    <Route exact path="/gcomp" component={WaitingComponent(GComp)}></Route>
                    <Route path="/warehouses" component={WaitingComponent(Warehouse)}></Route>
                    <Route path="/companies" component={WaitingComponent(Companies)}></Route>
                    <Route path="/inventory" component={WaitingComponent(Inventory)}></Route>
                    <Route path="/issue_inventory" component={WaitingComponent(IssueInventory)}></Route>
                    <Route path="/products" component={WaitingComponent(Products)}></Route>
                    <Route path="/invoices/all" component={WaitingComponent(Invoices)}></Route>
                    <Route path="/invoices/invoice" component={WaitingComponent(Invoice)}></Route>
                    <Route path="/invoices/product_invoice" component={WaitingComponent(ProductInvoice)}></Route>
                    <Route path="/learn/callchildfunctionfrmparent" component={WaitingComponent(CallChildFunction)}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
            </HashRouter>
        </div>
    )
}

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={
            <div style={{top: '25%', color: '#fff', textAlign: 'center', position: 'absolute', width: '100%', height: '100%'}}>
                <Card title="Inventory Management System" subTitle="Please wait ..." className="ui-card-shadow">
                </Card>
            </div>
        }>
            <Component {...props} />
        </Suspense>
    );
}

export default App;
