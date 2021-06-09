import React, { FunctionComponent } from "react";
import { Button, Pane, Heading } from "evergreen-ui";
import logo from "../../logo_oxnor.png";

const Navigation: FunctionComponent = () => (
  <Pane
    border="muted"
    display="flex"
    padding={16}
    background="gray75"
    alignItems="center"
    justifyContent="space-between"
  >
    <Pane>
      <Heading size={600}>
        <img className="nav-logo" src={logo} alt="Oxnor" />
      </Heading>
    </Pane>
    <Pane justifySelf="flex-end">
      <Button appearance="minimal" marginRight={16}>
        Escuela
      </Button>
      <Button appearance="primary">Oficina</Button>
    </Pane>
  </Pane>
);

export default Navigation;
