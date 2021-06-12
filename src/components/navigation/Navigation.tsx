import React, { FunctionComponent } from "react";
import { Button, Pane, Heading } from "evergreen-ui";
import { Link as ReactRouterLink } from "react-router-dom";
import logo from "../../logo_oxnor.png";

const Navigation: FunctionComponent = () => (
  <nav>
    <Pane
      border="none"
      display="flex"
      padding={16}
      background="transparent"
      alignItems="center"
      justifyContent="space-between"
      position="absolute"
      zIndex={1}
      width="100%"
    >
      <Pane>
        <Heading size={600}>
          <ReactRouterLink to="/">
            <img className="nav-logo" src={logo} alt="Oxnor" />
          </ReactRouterLink>
        </Heading>
      </Pane>
      <Pane justifySelf="flex-end">
        <Button appearance="minimal" marginRight={16}>
          Escuela
        </Button>
        <Button appearance="primary">Oficina</Button>
      </Pane>
    </Pane>
  </nav>
);

export default Navigation;
