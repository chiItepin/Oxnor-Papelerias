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
} from "evergreen-ui";
import { categoryTemplate, ICategory } from "./templates";
import { categoryRef, uploadImage, categoriesRef } from "../../firebase";
import Sidesheet from "../../components/ui/Sidesheet";
import CategoryForm from "../../components/admin/CategoryForm";

const Categories: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSideSheetShown, setIsSideSheetShown] = useState(false);
  const [isDeletePromptShown, setIsDeletePromptShown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>({
    ...categoryTemplate,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const resetSelectedCategory = (): void => {
    setSelectedCategory({ ...categoryTemplate });
  };

  const getCategories = () => {
    categoriesRef()
      .orderByChild("created_at")
      .on("value", (snapshot: any) => {
        const updated: ICategory[] = [];
        snapshot.forEach((item: any) => {
          const temp = item.val();
          temp.key = item.key;
          updated.unshift(temp);
        });
        setCategories(updated);
        setLoadingCategories(false);
      });
  };

  const handleImageUpload = (file: FileList) => {
    if (file?.length) {
      setLoading(true);
      uploadImage(file[0], Date.now()).then((response: any) => {
        response.ref.getDownloadURL().then((url: any) => {
          setSelectedCategory((prevState: any) => ({
            ...prevState,
            image: url,
          }));
          setLoading(false);
        });
      });
    }
  };

  const deleteCategory = () => {
    categoryRef(selectedCategory.key)
      .remove()
      .then(() => {
        toaster.success("Categoría eliminada con éxito");
        setIsDeletePromptShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const submitCategory = () => {
    categoryRef(selectedCategory?.key ? selectedCategory.key : null)
      .set(selectedCategory)
      .then(() => {
        if (selectedCategory?.key) {
          toaster.success("Categoría actualizada con éxito");
        } else {
          toaster.success("Categoría creada con éxito");
        }
        resetSelectedCategory();
        setIsSideSheetShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const handleSearch = (): ICategory[] =>
    categories.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  useEffect(() => {
    getCategories();
    return () => {
      categoriesRef().off();
    };
  }, []);

  if (loadingCategories) {
    return <Spinner margin="auto" />;
  }

  return (
    <Pane textAlign="left">
      <Dialog
        isShown={isDeletePromptShown}
        title="Eliminar Categoría"
        intent="danger"
        onCloseComplete={() => setIsDeletePromptShown(false)}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={() => deleteCategory()}
      >
        Estás seguro que deseas eliminar {selectedCategory?.name}
      </Dialog>
      <Sidesheet
        title={selectedCategory?.key ? "Editar Categoría" : "Añadir Categoría"}
        isShown={isSideSheetShown}
        handleOnClose={() => {
          setIsSideSheetShown(false);
        }}
      >
        <CategoryForm
          category={selectedCategory}
          submitCategory={submitCategory}
          setCategory={setSelectedCategory}
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
            resetSelectedCategory();
            setIsSideSheetShown(true);
          }}
        >
          Añadir nueva categoría
        </Button>

        <Heading>Categorías</Heading>
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
          <Table.TextHeaderCell>Destacada</Table.TextHeaderCell>
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
          {handleSearch().map((category) => (
            <Table.Row key={category.key}>
              <Table.TextCell>
                <Avatar
                  src={category.image ? category.image : undefined}
                  name={category.name}
                  size={30}
                />
              </Table.TextCell>
              <Table.TextCell>{category.name}</Table.TextCell>
              <Table.TextCell>{category.description}</Table.TextCell>
              <Table.TextCell>
                {category.featured ? <StarIcon /> : <StarEmptyIcon />}
              </Table.TextCell>
              <Table.TextCell>
                <Popover
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item
                          onSelect={() => {
                            setSelectedCategory(category);
                            setIsSideSheetShown(true);
                          }}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          onSelect={() => {
                            setIsDeletePromptShown(true);
                            setSelectedCategory(category);
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

export default Categories;
