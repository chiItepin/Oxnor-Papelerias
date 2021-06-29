import React, { FunctionComponent } from "react";
import {
  Pane,
  Button,
  TextInputField,
  FilePicker,
  SegmentedControl,
  Strong,
  Checkbox,
} from "evergreen-ui";
import { IBanner, ICategory } from "../../containers/admin/templates";

interface IProps {
  banner: IBanner;
  submitBanner: () => void;
  setSelectedBanner:
    | React.Dispatch<React.SetStateAction<IBanner>>
    | ((x: (prevState: any) => void | IBanner) => void);
  handleImageUpload: (file: FileList) => void;
  loading: boolean;
  categories: ICategory[];
}

const BannerForm: FunctionComponent<IProps> = ({
  banner,
  submitBanner,
  setSelectedBanner,
  handleImageUpload,
  loading,
  categories,
}: IProps) => {
  const bannerTypes = [
    { label: "Carrusel de Inicio", value: "carousel" },
    { label: "Mitad de Inicio", value: "home-middle" },
    { label: "Carrusel de Categoría", value: "category-view" },
  ];

  const handleCategories = (value: string | undefined, type: boolean) => {
    let updated = [...banner.categories];
    if (type && value) {
      updated.push(value as never);
    } else if (value) {
      updated = updated.filter((item) => item !== value);
    }

    setSelectedBanner((prevState: any) => ({
      ...prevState,
      categories: updated,
    }));
  };

  const handleUserInput = (property: string, value: string | boolean) => {
    setSelectedBanner((prevState: any) => ({
      ...prevState,
      [property]: value,
    }));
  };
  return (
    <>
      <Pane>
        <TextInputField
          isInvalid={!banner.name}
          required
          label="Nombre"
          validationMessage={!banner.name ? "Campo es requerido" : null}
          value={banner.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("name", event.target.value)
          }
        />
      </Pane>
      <Pane>
        <Strong>Posición de Banner</Strong>
        <SegmentedControl
          width="100%"
          marginBottom={30}
          options={bannerTypes}
          value={banner.type}
          onChange={(value: any) => handleUserInput("type", value)}
        />
      </Pane>

      {banner.type === "category-view" && (
        <Pane background="white" marginY={15} padding={10} elevation={1}>
          <Strong>Categorías</Strong>
          {categories.map((category) => (
            <Checkbox
              key={category.key}
              label={category.name}
              checked={
                category.key
                  ? !!banner?.categories?.includes(category.key as never)
                  : false
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCategories(category.key, event.target.checked)
              }
            />
          ))}
        </Pane>
      )}

      <Pane>
        <TextInputField
          isInvalid={
            !!(banner.buttonLink && !banner.buttonLink.includes("http"))
          }
          label="Redireccionar a URL"
          hint="Opcional"
          validationMessage={
            banner.buttonLink && !banner.buttonLink.includes("http")
              ? "Campo debe ser URL"
              : null
          }
          value={banner.buttonLink}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("buttonLink", event.target.value)
          }
        />
      </Pane>

      {banner.image && (
        <Pane
          display="flex"
          marginBottom={10}
          marginTop={10}
          background="blue50"
          elevation={1}
          borderRadius={4}
          overflow="hidden"
        >
          <img
            style={{ width: "100%", objectFit: "contain", height: 200 }}
            src={banner.image}
            alt="Banner"
          />
        </Pane>
      )}

      <Pane marginBottom={30}>
        <Strong>Dimensiones recomendadas: 720px x 315px</Strong>
        <FilePicker
          required
          accept="image/*"
          onChange={(file) => handleImageUpload(file)}
          placeholder="Imagen"
        />
      </Pane>

      <Pane>
        <Checkbox
          label="¿Banner habilitado?"
          checked={banner.active}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("active", event.target.checked)
          }
        />
      </Pane>

      <Pane textAlign="center">
        <Button
          disabled={!banner.name || !banner.image || loading}
          onClick={submitBanner}
          appearance="primary"
        >
          Guardar
        </Button>
      </Pane>
    </>
  );
};

export default BannerForm;
