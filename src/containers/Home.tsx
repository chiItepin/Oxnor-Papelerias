import React, { FunctionComponent, useState, useEffect } from "react";
import { Link as ReactRouterLink, useHistory } from "react-router-dom";
import { Spinner, Pane, Heading, Strong, Avatar, Link } from "evergreen-ui";
import { ICategory, IBanner, IProduct } from "./admin/templates";
import { categoriesRef, carouselBannersRef, productsRef } from "../firebase";
import MainBanners from "../components/home/MainBanners";
import ProductList from "../components/ui/products/ProductList";
import footerImg from "../footerpicoxnor.svg";

const Home: FunctionComponent = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const history = useHistory();

  const getMainCarouselBanners = (): IBanner[] =>
    banners.filter((banner) => banner.active && banner.type === "carousel");

  const getCategoryProducts = (categoryKey: string): IProduct[] => {
    return products.filter((item) => item.categories.includes(categoryKey));
  };

  const getBanners = (): void => {
    setLoadingBanners(true);
    carouselBannersRef().on("value", (snapshot: any) => {
      const updated: IBanner[] = [];
      snapshot.forEach((item: any) => {
        const temp = item.val();
        temp.key = item.key;
        if (temp.active) {
          updated.unshift(temp);
        }
      });
      setBanners(updated);
      setLoadingBanners(false);
    });
  };

  const getCategories = (): void => {
    categoriesRef()
      .orderByChild("featured")
      .on("value", (snapshot: any) => {
        const updated: ICategory[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          updated.unshift(temp);
        });
        setCategories(updated);
      });
  };

  const getProducts = (): void => {
    setLoadingProducts(true);
    productsRef()
      .orderByChild("featured")
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
    getCategories();
    getProducts();
    return () => {
      carouselBannersRef().off();
      categoriesRef().off();
      productsRef().off();
    };
  }, []);

  if (loadingBanners || loadingProducts) {
    return <Spinner margin="auto" />;
  }

  return (
    <>
      <MainBanners banners={getMainCarouselBanners()} />
      <main>
        <Pane
          marginTop={10}
          display="flex"
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => history.push(`categorias/${cat.key}`)}
              type="button"
              className="category-circle"
            >
              <Avatar
                display="block"
                margin="auto"
                src={cat.image ? cat.image : undefined}
                name={cat.name}
              />
            </button>
          ))}
        </Pane>

        {categories.map((cat) => (
          <React.Fragment key={cat.key}>
            <Pane marginX={10} textAlign="left" width="100%" marginY={30}>
              <Heading size={600}>
                <Link
                  size={600}
                  is={ReactRouterLink}
                  to={`categorias/${cat.key}`}
                >
                  {cat.name}
                </Link>
              </Heading>
              {cat.description && (
                <Strong color="gray600">{cat.description}</Strong>
              )}
            </Pane>
            <div className="product-container-row">
              {cat.key && getCategoryProducts(cat.key).length === 0 && (
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
                {cat.key && (
                  <ProductList
                    products={getCategoryProducts(cat.key).slice(0, 6)}
                  />
                )}
              </Pane>
            </div>
          </React.Fragment>
        ))}

        <img src={footerImg} className="footer-pic" alt="Oxnor" />
      </main>
    </>
  );
};

export default Home;
