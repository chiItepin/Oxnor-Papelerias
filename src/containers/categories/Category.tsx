import React, { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Pane, Heading, Strong, Avatar } from "evergreen-ui";
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
            <Pane marginX={10} textAlign="center" width="100%" marginY={30}>
              <Heading size={600}>{category.name}</Heading>
              <Strong>{category.description}</Strong>
            </Pane>
            <div className="product-container-row">
              {key && getCategoryProducts(key).length === 0 && (
                <Strong>Aún no hay productos</Strong>
              )}
              <Pane
                display="flex"
                alignItems="center"
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
                      elevation={2}
                      padding={15}
                      height={300}
                      margin={10}
                      maxWidth="calc(33% - 20px)"
                      key={prod.key}
                    >
                      <div className="product-container-content">
                        <Avatar
                          display="block"
                          margin="auto"
                          shape="square"
                          size={200}
                          src={prod.image ? prod.image : undefined}
                          name={prod.name}
                        />
                        <Heading marginY={15}>{prod.name}</Heading>
                        <div className="product-row-price">
                          <Pane display="flex" justifyContent="space-evenly">
                            {prod.price && (
                              <Strong
                                color={prod.discountedPrice && "orange500"}
                                textDecoration={
                                  prod.discountedPrice && "line-through"
                                }
                              >
                                {`$${prod.price}MXN`}
                              </Strong>
                            )}
                            {prod.discountedPrice && (
                              <Strong>{`$${prod.discountedPrice}MXN`}</Strong>
                            )}
                          </Pane>
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
