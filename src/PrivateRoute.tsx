/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponent, ReactNode } from "react";
import firebase from "firebase";
import { Route } from "react-router-dom";
import { Spinner, Alert } from "evergreen-ui";
import Login from "./containers/admin/Login";

interface IProps {
  children: ReactNode;
  path: string;
  exact: boolean;
  user: firebase.User | null;
  loaded: boolean;
}

const PrivateRoute: FunctionComponent<IProps> = ({
  children,
  path,
  exact,
  user,
  loaded,
  ...rest
}: IProps) => {
  if (!loaded) return <Spinner margin="auto" />;

  if (user) return <Route {...rest}>{children}</Route>;

  return (
    <Alert
      margin="auto"
      intent="warning"
      title="La página que has intentado acceder no existe o el permiso ha sido denegado"
      marginBottom={32}
    />
  );
};

export default PrivateRoute;
