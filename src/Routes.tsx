import React, { FunctionComponent } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./containers/admin/Login";
import Categories from "./containers/admin/Categories";
import Home from "./containers/Home";

const Routes: FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/admin/login" component={Login} />
      <PrivateRoute exact path="/admin/categorias">
        <Categories />
      </PrivateRoute>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
