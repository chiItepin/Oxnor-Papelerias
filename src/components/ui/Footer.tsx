import React, { FunctionComponent } from "react";
import { Pane, Strong } from "evergreen-ui";
import logo from "../../oxnor-logo.svg";
import whatsappLogo from "../../whatsapp.svg";
import facebookLogo from "../../facebook.svg";
import instagramLogo from "../../instagram.svg";

const Footer: FunctionComponent = () => (
  <>
    <Pane height={200} />
    <Pane
      background="gray100"
      position="absolute"
      width="100%"
      bottom={0}
      height={200}
      display="flex"
      padding={30}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Pane
        display="flex"
        width="60%"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Pane flex={1} textAlign="left">
          <img className="footer-logo" width={100} src={logo} alt="Oxnor" />
        </Pane>
        <Pane flex={1} textAlign="left" marginY={6}>
          <Strong>Lunes a Viernes 8:30 am - 5 pm Sábados 9 am - 2 pm</Strong>
        </Pane>
        <Pane flex={1} textAlign="left" marginY={6}>
          <Strong>
            José Carmelo #358 Colonia Olivares. Hermosillo, Sonora.
          </Strong>
        </Pane>
      </Pane>

      <Pane
        display="flex"
        width="40%"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Pane
          flex={1}
          textAlign="left"
          marginY={6}
          className="footer-social-media-icons"
        >
          <img src={whatsappLogo} alt="Whatsapp" />
          <Strong>(662) 347 2146</Strong>
        </Pane>

        <Pane
          flex={1}
          textAlign="left"
          marginY={6}
          className="footer-social-media-icons"
        >
          <img src={instagramLogo} alt="Instagram" />
          <Strong>OXNORPAPELERIAYMAS</Strong>
        </Pane>

        <Pane
          flex={1}
          textAlign="left"
          marginY={6}
          className="footer-social-media-icons"
        >
          <img src={facebookLogo} alt="Facebook" />
          <Strong>OXNOR PAPELERIA Y MAS</Strong>
        </Pane>
      </Pane>
    </Pane>
  </>
);

export default Footer;
