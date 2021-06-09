import React, { FunctionComponent, useState } from "react";
import { TextInputField, Pane, Button, toaster, Heading } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import { appAuth } from "../../firebase";

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const history = useHistory();

  const handleLoginForm = async () => {
    setLoadingLogin(true);
    await appAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        toaster.success("Inicio exitoso");
        history.push("/admin/categorias");
      })
      .catch((error) => {
        setLoadingLogin(false);
        toaster.warning(
          error?.message ? error.message : "Something went wrong"
        );
      });
  };

  return (
    <Pane maxWidth={500} width="80%" margin="auto" marginTop={20}>
      <Heading marginBottom="40px">Iniciar Sesión</Heading>
      <Pane textAlign="left">
        <TextInputField
          isInvalid={!email}
          required
          label="Correo electrónico"
          validationMessage={!email ? "Campo es requerido" : null}
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
      </Pane>
      <Pane textAlign="left">
        <TextInputField
          isInvalid={!password}
          required
          label="Contraseña"
          validationMessage={!password ? "Contraseña es requerida" : null}
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
      </Pane>
      <Pane textAlign="center">
        <Button
          isLoading={loadingLogin}
          onClick={handleLoginForm}
          disabled={!email || !password}
          appearance="primary"
        >
          Iniciar
        </Button>
      </Pane>
    </Pane>
  );
};

export default Login;
