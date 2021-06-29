import React, { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Pane, Heading, Strong, Avatar, Text } from "evergreen-ui";
import { ICategory, IProduct } from "../admin/templates";
import { categoryRef, productRef, productsRef } from "../../firebase";
import ProductList from "../../components/ui/products/ProductList";

interface IParamTypes {
  key: string;
}

const ProductView: FunctionComponent = () => {
  const [product, setProduct] = useState<IProduct>();
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>();
  const [loadingProduct, setLoadingProduct] = useState(false);
  const { key } = useParams<IParamTypes>();

  useEffect(() => {
    const getProduct = (): void => {
      setLoadingProduct(true);
      productRef(key).on("value", (snapshot: any) => {
        setLoadingProduct(false);
        setProduct(snapshot.val());
      });
    };
    getProduct();
    return () => {
      productRef(key).off();
    };
  }, [key]);

  useEffect(() => {
    const getProductCategories = (): void => {
      productsRef().on("value", (snapshot: any) => {
        const updated: IProduct[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          if (
            temp.active &&
            temp.categories.filter((category: string) =>
              product?.categories.includes(category)
            ).length
          ) {
            updated.unshift(temp);
          }
        });
        setSimilarProducts(updated);
      });
    };
    getProductCategories();
    return () => {
      productsRef().off();
    };
  }, [product?.categories]);

  if (loadingProduct || !product) {
    return <Spinner margin="auto" />;
  }

  return (
    <>
      <main>
        {product && (
          <React.Fragment key={key}>
            <Pane textAlign="center" width="100%" marginTop={80}>
              <Heading size={900}>{product.name}</Heading>
              <Strong color="gray600">{product.description}</Strong>
            </Pane>
            <div className="product-single-row">
              <Pane
                display="flex"
                alignItems="stretch"
                justifyContent="flex-start"
                textAlign="left"
                width="100%"
                flexWrap="wrap"
                marginY={10}
              >
                <Pane
                  flex={1}
                  background="white"
                  boxShadow="5px 4px 10px 3px rgb(237 227 232 / 50%)"
                  borderRadius={20}
                  padding={15}
                  marginY={10}
                  marginX="auto"
                  maxWidth={700}
                >
                  <div className="product-container-content">
                    <div className="avatar-wrapper">
                      <Avatar
                        display="block"
                        margin="auto"
                        shape="square"
                        src={product.image ? product.image : undefined}
                        name={product.name}
                      />
                    </div>
                    <div className="product-row-price">
                      <Heading width="100%" marginY={15}>
                        {product.name}
                      </Heading>
                      {product.price && (
                        <Text
                          display="block"
                          color="#71af92"
                          size={600}
                          textDecoration={
                            product.discountedPrice && "line-through"
                          }
                        >
                          {`$${product.price}MXN`}
                        </Text>
                      )}
                      {product.discountedPrice && (
                        <Text
                          display="block"
                          size={600}
                        >{`$${product.discountedPrice}MXN`}</Text>
                      )}
                    </div>
                    <Pane>
                      <Strong>{product.description}</Strong>
                    </Pane>
                  </div>
                </Pane>
              </Pane>

              {similarProducts && (
                <>
                  <Heading size={800} marginY={14}>
                    Artículos similares
                  </Heading>
                  <Pane
                    display="flex"
                    overflowX="auto"
                    background="#f0f0f0"
                    borderRadius={24}
                    className="similar-products"
                  >
                    <ProductList products={similarProducts} />
                  </Pane>
                </>
              )}
            </div>
          </React.Fragment>
        )}
      </main>
    </>
  );
};

export default ProductView;
