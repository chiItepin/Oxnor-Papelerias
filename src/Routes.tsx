import React, { FunctionComponent, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { FirebaseContext } from "./firebase";
import Login from "./containers/admin/Login";
import Categories from "./containers/admin/Categories";
import Products from "./containers/admin/Products";
import Carousel from "./containers/admin/Carousel";
import Home from "./containers/Home";
import HomeCategory from "./containers/categories/Category";

const Routes: FunctionComponent = () => {
  const { user, loaded } = useContext(FirebaseContext);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/categorias/:key" component={HomeCategory} />
      <Route path="/admin/login" component={Login} />
      <PrivateRoute user={user} loaded={loaded} exact path="/admin/categorias">
        <Categories />
      </PrivateRoute>
      <PrivateRoute user={user} loaded={loaded} exact path="/admin/productos">
        <Products />
      </PrivateRoute>
      <PrivateRoute user={user} loaded={loaded} exact path="/admin/carrusel">
        <Carousel />
      </PrivateRoute>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
