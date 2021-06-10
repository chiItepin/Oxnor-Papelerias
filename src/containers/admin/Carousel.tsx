import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Table,
  Pane,
  Button,
  toaster,
  Spinner,
  Avatar,
  Heading,
  Dialog,
  Popover,
  Menu,
  MoreIcon,
  StatusIndicator,
  Badge,
} from "evergreen-ui";
import { ICategory, IBanner, bannerTemplate } from "./templates";
import {
  uploadImage,
  carouselBannerRef,
  carouselBannersRef,
  categoriesRef,
} from "../../firebase";
import Sidesheet from "../../components/ui/Sidesheet";
import BannerForm from "../../components/admin/BannerForm";

const Carousel: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSideSheetShown, setIsSideSheetShown] = useState(false);
  const [isDeletePromptShown, setIsDeletePromptShown] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBanner>({
    ...bannerTemplate,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const resetSelectedBanner = (): void => {
    setSelectedBanner({ ...bannerTemplate });
  };

  const getBanners = () => {
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
      });
  };

  const handleImageUpload = (file: FileList) => {
    if (file?.length) {
      setLoading(true);
      uploadImage(file[0], Date.now()).then((response: any) => {
        response.ref.getDownloadURL().then((url: any) => {
          setSelectedBanner((prevState: any) => ({
            ...prevState,
            image: url,
          }));
          setLoading(false);
        });
      });
    }
  };

  const deleteBanner = () => {
    carouselBannerRef(selectedBanner.key)
      .remove()
      .then(() => {
        toaster.success("Banner eliminado con éxito");
        setIsDeletePromptShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const submitBanner = () => {
    carouselBannerRef(selectedBanner?.key ? selectedBanner.key : null)
      .set(selectedBanner)
      .then(() => {
        if (selectedBanner?.key) {
          toaster.success("Banner actualizado con éxito");
        } else {
          toaster.success("Banner creado con éxito");
        }
        resetSelectedBanner();
        setIsSideSheetShown(false);
      })
      .catch(() => {
        toaster.danger("Ha ocurrido un error");
      });
  };

  const handleSearch = (): IBanner[] =>
    banners.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  useEffect(() => {
    getBanners();
    getCategories();
    return () => {
      carouselBannersRef().off();
      categoriesRef().off();
    };
  }, []);

  if (loadingBanners) {
    return <Spinner margin="auto" />;
  }

  return (
    <Pane textAlign="left">
      <Dialog
        isShown={isDeletePromptShown}
        title="Eliminar Banner"
        intent="danger"
        onCloseComplete={() => setIsDeletePromptShown(false)}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={() => deleteBanner()}
      >
        Estás seguro que deseas eliminar {selectedBanner?.name}
      </Dialog>
      <Sidesheet
        title={selectedBanner?.key ? "Editar Banner" : "Añadir Banner"}
        isShown={isSideSheetShown}
        handleOnClose={() => {
          setIsSideSheetShown(false);
        }}
      >
        <BannerForm
          banner={selectedBanner}
          submitBanner={submitBanner}
          setSelectedBanner={setSelectedBanner}
          handleImageUpload={handleImageUpload}
          loading={loading}
          categories={categories}
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
            resetSelectedBanner();
            setIsSideSheetShown(true);
          }}
        >
          Añadir banner a un Carrusel
        </Button>

        <Heading>Carrusel</Heading>
      </Pane>

      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            value={searchValue}
            onChange={(event) => setSearchValue(event)}
            placeholder="Buscar..."
          />
          <Table.TextHeaderCell>Nombre</Table.TextHeaderCell>
          <Table.TextHeaderCell>Posición</Table.TextHeaderCell>
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
          {handleSearch().map((banner) => (
            <Table.Row key={banner.key}>
              <Table.TextCell>
                <Avatar
                  src={banner.image ? banner.image : undefined}
                  name={banner.name}
                  size={30}
                />
              </Table.TextCell>

              <Table.TextCell>
                <StatusIndicator color={banner?.active ? "success" : "warning"}>
                  {banner.name}
                </StatusIndicator>
              </Table.TextCell>

              <Table.TextCell>
                <Badge color="neutral">{banner.type}</Badge>
              </Table.TextCell>

              <Table.TextCell>
                <Popover
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item
                          onSelect={() => {
                            setSelectedBanner(banner);
                            setIsSideSheetShown(true);
                          }}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          onSelect={() => {
                            setIsDeletePromptShown(true);
                            setSelectedBanner(banner);
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

export default Carousel;
