import React, { FunctionComponent, useState, useEffect } from "react";
import { Pane, Heading, TextInput, Link, MenuIcon } from "evergreen-ui";
import { Link as ReactRouterLink } from "react-router-dom";
import { IProduct, ICategory } from "../../containers/admin/templates";
import { productsRef, categoriesRef } from "../../firebase";
import logo from "../../oxnor-logo.svg";
import Sidesheet from "../ui/Sidesheet";

const Navigation: FunctionComponent = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isNavOpened, setIsNavOpened] = useState(false);

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

  useEffect(() => {
    const getProducts = (): void => {
      productsRef()
        .orderByChild("lowercaseName")
        .startAt(searchValue.toLocaleLowerCase())
        .endAt(`${searchValue.toLocaleLowerCase()}\uf8ff`)
        .on("value", (snapshot: any) => {
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
    if (searchValue) {
      getProducts();
    } else {
      setProducts([]);
    }
  }, [searchValue]);

  useEffect(() => {
    getCategories();
    return () => {
      productsRef().off();
      categoriesRef().off();
    };
  }, []);

  return (
    <>
      <Sidesheet
        title="Menu"
        isShown={isNavOpened}
        handleOnClose={() => {
          setIsNavOpened(false);
        }}
      >
        <>
          <Heading>Categorías</Heading>
          {categories.map((category) => (
            <Pane key={category.key}>
              <Link
                onClick={() => setIsNavOpened(false)}
                style={{ display: "block", marginTop: 10 }}
                is={ReactRouterLink}
                to={`/categorias/${category.key}`}
              >
                {category.name}
              </Link>
            </Pane>
          ))}
        </>
      </Sidesheet>
      <nav>
        <Pane
          className="nav-bar-wrapper"
          border="none"
          display="flex"
          background="#329a9b"
          boxShadow="0 3px 5px rgb(0 0 0 / 23%)"
          alignItems="center"
          justifyContent="space-between"
          zIndex={1}
          width="100%"
        >
          <Pane justifySelf="flex-start">
            <Heading size={600}>
              <ReactRouterLink to="/">
                <img className="nav-logo" src={logo} alt="Oxnor" />
              </ReactRouterLink>
            </Heading>
          </Pane>
          <Pane position="relative" flex={1} marginX={10}>
            <TextInput
              width="90%"
              type="search"
              value={searchValue}
              onChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => setSearchValue(event.target.value)}
              placeholder="Buscar..."
            />
            {products.length !== 0 && (
              <ul className="searched-products">
                {products.map((product) => (
                  <li key={product.key}>
                    <Link
                      is={ReactRouterLink}
                      onClick={() => setProducts([])}
                      to={`/articulos/${product.key}`}
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Pane>
          <Pane justifySelf="flex-end">
            <button
              onClick={() => setIsNavOpened(true)}
              type="button"
              className="navbar-more"
            >
              <MenuIcon />
            </button>
          </Pane>
        </Pane>
      </nav>
    </>
  );
};

export default Navigation;
