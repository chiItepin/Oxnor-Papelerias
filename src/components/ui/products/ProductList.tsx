import React, { FunctionComponent } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Pane, Heading, Avatar, Link, Text } from "evergreen-ui";
import { IProduct } from "../../../containers/admin/templates";

interface IProps {
  products: IProduct[];
}

const ProductList: FunctionComponent<IProps> = ({ products }: IProps) => (
  <>
    {products.map((prod) => (
      <Pane
        key={prod.key}
        flex="0 0 33%"
        background="white"
        boxShadow="5px 4px 10px 3px rgb(237 227 232 / 50%)"
        borderRadius={20}
        padding={15}
        margin={10}
        maxWidth="calc(33% - 20px)"
      >
        <Link
          boxShadow="none !important"
          is={ReactRouterLink}
          to={`/articulos/${prod.key}`}
        >
          <div className="product-container-content">
            <div className="avatar-wrapper">
              <Avatar
                display="block"
                margin="auto"
                shape="square"
                src={prod.image ? prod.image : undefined}
                name={prod.name}
              />
            </div>
            <div className="product-row-price">
              <Heading width="100%" marginY={15}>
                {prod.name}
              </Heading>
              {prod.price && (
                <Text
                  display="block"
                  color="#71af92"
                  size={600}
                  textDecoration={prod.discountedPrice && "line-through"}
                >
                  {`$${prod.price}MXN`}
                </Text>
              )}
              {prod.discountedPrice && (
                <Text
                  display="block"
                  size={600}
                >{`$${prod.discountedPrice}MXN`}</Text>
              )}
            </div>
          </div>
        </Link>
      </Pane>
    ))}
  </>
);

export default ProductList;
