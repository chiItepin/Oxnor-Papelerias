import React, { FunctionComponent, ReactNode } from "react";
import { Heading, Card, Pane, SideSheet } from "evergreen-ui";

interface IProps {
  isShown: boolean;
  handleOnClose: () => void;
  title: string;
  children: ReactNode;
}

const Sidesheet: FunctionComponent<IProps> = ({
  isShown,
  handleOnClose,
  title,
  children,
}: IProps) => (
  <SideSheet
    width={300}
    isShown={isShown}
    onCloseComplete={() => handleOnClose()}
    containerProps={{
      display: "flex",
      flex: "1",
      flexDirection: "column",
    }}
  >
    <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
      <Pane padding={16}>
        <Heading size={600}>{title}</Heading>
      </Pane>
    </Pane>
    <Pane flex="1" overflowY="scroll" textAlign="left" padding={16}>
      <Card
        background="tint1"
        backgroundColor="white"
        elevation={1}
        display="block"
        padding={16}
      >
        {children}
      </Card>
    </Pane>
  </SideSheet>
);

export default Sidesheet;
