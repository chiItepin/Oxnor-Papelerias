import React, { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Pane, Heading, Strong, Avatar, Text } from "evergreen-ui";
import { ICategory, IBanner, IProduct } from "../admin/templates";
import { categoryRef, carouselBannersRef, productsRef } from "../../firebase";
import MainBanners from "../../components/home/MainBanners";

interface IParamTypes {
  key: string;
}

const Category: FunctionComponent = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { key } = useParams<IParamTypes>();

  const getMainCarouselBanners = (): IBanner[] =>
    banners.filter(
      (banner) =>
        banner.active &&
        banner.type === "category-view" &&
        banner.categories.includes(key as never)
    );

  const getCategoryProducts = (categoryKey: string): IProduct[] => {
    return products.filter((item) => item.categories.includes(categoryKey));
  };

  const getBanners = (): void => {
    setLoadingBanners(true);
    carouselBannersRef()
      .orderByChild("created_at")
      .on("value", (snapshot: any) => {
        const updated: IBanner[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          updated.unshift(temp);
        });
        setBanners(updated);
        setLoadingBanners(false);
      });
  };

  const getProducts = (): void => {
    setLoadingProducts(true);
    productsRef()
      .orderByChild("created_at")
      .on("value", (snapshot: any) => {
        setLoadingProducts(false);
        const updated: IProduct[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          if (temp.active) {
            updated.unshift(temp);
          }
        });
        setProducts(updated);
      });
  };

  useEffect(() => {
    getBanners();
    getProducts();
    return () => {
      carouselBannersRef().off();
      productsRef().off();
    };
  }, []);

  useEffect(() => {
    const getCategory = (): void => {
      categoryRef(key)
        .orderByChild("created_at")
        .on("value", (snapshot: any) => {
          setCategory(snapshot.val());
        });
    };

    getCategory();
    return () => {
      categoryRef(key).off();
    };
  }, [key]);

  if (loadingBanners || loadingProducts) {
    return <Spinner margin="auto" />;
  }

  return (
    <>
      <MainBanners banners={getMainCarouselBanners()} />
      <main>
        {category && (
          <React.Fragment key={key}>
            <Pane marginX={10} textAlign="center" width="100%" marginY={40}>
              <Heading size={900}>{category.name}</Heading>
              <Strong color="gray600">{category.description}</Strong>
            </Pane>
            <div className="product-container-row">
              {key && getCategoryProducts(key).length === 0 && (
                <Strong>Aún no hay productos</Strong>
              )}
              <Pane
                display="flex"
                alignItems="stretch"
                justifyContent="flex-start"
                textAlign="left"
                width="100%"
                flexWrap="wrap"
                marginY={10}
              >
                {key &&
                  getCategoryProducts(key).map((prod) => (
                    <Pane
                      flex="0 0 33%"
                      // background="#f6f4f5"
                      boxShadow="5px 4px 10px 3px rgb(237 227 232 / 50%)"
                      borderRadius={20}
                      padding={15}
                      margin={10}
                      maxWidth="calc(33% - 20px)"
                      key={prod.key}
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
                              color="#af9991"
                              size={600}
                              textDecoration={
                                prod.discountedPrice && "line-through"
                              }
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
                    </Pane>
                  ))}
              </Pane>
            </div>
          </React.Fragment>
        )}
      </main>
    </>
  );
};

export default Category;
