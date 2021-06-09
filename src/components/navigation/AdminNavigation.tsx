import React, { FunctionComponent, useContext } from "react";
import { Button, Pane, Heading, Avatar } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import { FirebaseContext, appAuth } from "../../firebase";

const AdminNavigation: FunctionComponent = () => {
  const { user } = useContext(FirebaseContext);
  const history = useHistory();

  return (
    <Pane
      border="muted"
      display="flex"
      padding={16}
      background="gray75"
      alignItems="center"
      justifyContent="space-between"
    >
      <Pane>
        <Heading size={600}>Admin</Heading>
      </Pane>
      {user && (
        <Pane justifySelf="flex-end">
          <Button
            onClick={() => history.push("/admin/categorias")}
            appearance={
              history.location.pathname === "/admin/categorias"
                ? "primary"
                : "minimal"
            }
            marginRight={16}
          >
            Categorías
          </Button>

          <Button
            onClick={() => {
              appAuth.signOut();
              history.push("/");
            }}
            appearance="default"
            marginRight={16}
          >
            Salir de sesión
          </Button>

          <Avatar verticalAlign="middle" name={user.email} size={30} />
        </Pane>
      )}
    </Pane>
  );
};

export default AdminNavigation;
