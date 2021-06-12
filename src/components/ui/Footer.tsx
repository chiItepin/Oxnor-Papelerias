import React, { FunctionComponent, ReactNode } from "react";
import { Heading, Card, Pane, SideSheet } from "evergreen-ui";
import logo from "../../logo_oxnor.png";

const Footer: FunctionComponent = () => (
  <>
    <Pane height={100} />
    <Pane
      background="gray100"
      position="absolute"
      width="100%"
      bottom={0}
      height={100}
      display="flex"
      padding={30}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Pane>
        <img className="footer-logo" width={100} src={logo} alt="Oxnor" />
      </Pane>
    </Pane>
  </>
);

export default Footer;
