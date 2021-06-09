/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponent, ReactNode, useContext } from "react";
import { Route } from "react-router-dom";
import { Spinner } from "evergreen-ui";
import { FirebaseContext } from "./firebase";
import Login from "./containers/admin/Login";

interface IProps {
  children: ReactNode;
  path: string;
  exact: boolean;
}

const PrivateRoute: FunctionComponent<IProps> = ({
  children,
  path,
  exact,
  ...rest
}: IProps) => {
  const { user, loaded } = useContext(FirebaseContext);

  if (!loaded) return <Spinner margin="auto" />;

  if (user) return <Route {...rest}>{children}</Route>;

  return (
    <Route>
      <Login />
    </Route>
  );
};

export default PrivateRoute;
