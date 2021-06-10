import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Table,
  Pane,
  Button,
  toaster,
  Spinner,
  StarIcon,
  StarEmptyIcon,
  Avatar,
  Heading,
  Dialog,
  Popover,
  Menu,
  MoreIcon,
  StatusIndicator,
} from "evergreen-ui";
import { useParams, useHistory } from "react-router-dom";
import {
  categoryTemplate,
  ICategory,
  IProduct,
  productTemplate,
} from "./templates";
import {
  categoryRef,
  uploadImage,
  productsRef,
  productRef,
} from "../../firebase";
import Sidesheet from "../../components/ui/Sidesheet";
import ProductForm from "../../components/admin/ProductForm";

interface IParamTypes {
  key: string;
}

const Products: FunctionComponent = () => {
  const { key } = useParams<IParamTypes>();
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");
  const [isSideSheetShown, setIsSideSheetShown] = useState(false);
  const [isDeletePromptShown, setIsDeletePromptShown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>({
    ...categoryTemplate,
  });
  const [selectedProduct, setSelectedProduct] = useState<IProduct>({
    ...productTemplate,
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const resetSelectedProduct = (): void => {
    setSelectedProduct({ ...productTemplate });
  };

  const handleCloneProduct = (product: IProduct): void => {
    const newProduct = product;
    delete newProduct.key;
    productRef(key)
      .set(newProduct)
      .then(() => {
        toaster.success("Producto clonado con éxito");
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const getProducts = (categoryKey: string) => {
    productsRef(categoryKey)
      .orderByChild("created_at")
      .on("value", (snapshot: any) => {
        const updated: IProduct[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          updated.unshift(temp);
        });
        setProducts(updated);
        setLoadingProducts(false);
      });
  };

  const handleImageUpload = (file: FileList): void => {
    if (file?.length) {
      setLoading(true);
      uploadImage(file[0], Date.now()).then((response: any) => {
        response.ref.getDownloadURL().then((url: any) => {
          setSelectedProduct((prevState: any) => ({
            ...prevState,
            image: url,
          }));
          setLoading(false);
        });
      });
    }
  };

  const deleteProduct = () => {
    productRef(key, selectedProduct.key)
      .remove()
      .then(() => {
        toaster.success("Producto eliminado con éxito");
        setIsDeletePromptShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const submitProduct = () => {
    productRef(key, selectedProduct?.key ? selectedProduct.key : null)
      .set(selectedProduct)
      .then(() => {
        if (selectedProduct?.key) {
          toaster.success("Producto actualizado con éxito");
        } else {
          toaster.success("Producto creado con éxito");
        }
        resetSelectedProduct();
        setIsSideSheetShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const handleSearch = (): IProduct[] =>
    products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  useEffect(() => {
    const getParentCategory = (categoryKey: string): void => {
      categoryRef(categoryKey)
        .orderByChild("created_at")
        .on("value", (snapshot: any) => {
          if (!snapshot.val()) {
            history.push("/admin/categorias");
          }
          setSelectedCategory(snapshot.val());
        });
    };

    getParentCategory(key);
    getProducts(key);
    return () => {
      productsRef(key).off();
    };
  }, [key, history]);

  if (loadingProducts) {
    return <Spinner margin="auto" />;
  }

  return (
    <Pane textAlign="left">
      <Dialog
        isShown={isDeletePromptShown}
        title="Eliminar producto"
        intent="danger"
        onCloseComplete={() => setIsDeletePromptShown(false)}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={() => deleteProduct()}
      >
        Estás seguro que deseas eliminar {selectedProduct?.name}
      </Dialog>
      <Sidesheet
        title={selectedProduct?.key ? "Editar Producto" : "Añadir Producto"}
        isShown={isSideSheetShown}
        handleOnClose={() => {
          setIsSideSheetShown(false);
        }}
      >
        <ProductForm
          product={selectedProduct}
          submitProduct={submitProduct}
          setSelectedProduct={setSelectedProduct}
          handleImageUpload={handleImageUpload}
          loading={loading}
        />
      </Sidesheet>

      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={10}
      >
        <Button
          onClick={() => {
            resetSelectedProduct();
            setIsSideSheetShown(true);
          }}
        >
          Añadir nuevo producto
        </Button>

        <Heading>{`${selectedCategory?.name} - Productos`}</Heading>
      </Pane>

      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            value={searchValue}
            onChange={(event) => setSearchValue(event)}
            placeholder="Buscar..."
          />
          <Table.TextHeaderCell>Nombre</Table.TextHeaderCell>
          <Table.TextHeaderCell>Descripción</Table.TextHeaderCell>
          <Table.TextHeaderCell>Destacado</Table.TextHeaderCell>
          <Table.TextHeaderCell>Acción</Table.TextHeaderCell>
        </Table.Head>
        {handleSearch().length === 0 && (
          <Heading marginTop={10} textAlign="center">
            Datos no encontrados
          </Heading>
        )}
        <Table.VirtualBody
          minHeight={400}
          height="auto"
          allowAutoHeight
          useAverageAutoHeightEstimation
        >
          {handleSearch().map((product) => (
            <Table.Row key={product.key}>
              <Table.TextCell>
                <Avatar
                  src={product.image ? product.image : undefined}
                  name={product.name}
                  size={30}
                />
              </Table.TextCell>
              <Table.TextCell>
                <StatusIndicator
                  color={product?.active ? "success" : "warning"}
                >
                  {product.name}
                </StatusIndicator>
              </Table.TextCell>
              <Table.TextCell>{product.description}</Table.TextCell>
              <Table.TextCell>
                {product.featured ? <StarIcon /> : <StarEmptyIcon />}
              </Table.TextCell>
              <Table.TextCell>
                <Popover
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item
                          onSelect={() => {
                            setSelectedProduct(product);
                            setIsSideSheetShown(true);
                          }}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          onSelect={() => {
                            handleCloneProduct(product);
                          }}
                        >
                          Clonar
                        </Menu.Item>
                        <Menu.Item
                          onSelect={() => {
                            setIsDeletePromptShown(true);
                            setSelectedProduct(product);
                          }}
                        >
                          Eliminar
                        </Menu.Item>
                      </Menu.Group>
                    </Menu>
                  }
                >
                  <Button>
                    <MoreIcon />
                  </Button>
                </Popover>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.VirtualBody>
      </Table>
    </Pane>
  );
};

export default Products;
