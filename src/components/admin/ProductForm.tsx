import React, { FunctionComponent } from "react";
import {
  Pane,
  Button,
  TextInputField,
  Checkbox,
  FilePicker,
  Avatar,
  Textarea,
  Label,
  TagInput,
  Heading,
  Text,
} from "evergreen-ui";
import { IProduct, ICategory } from "../../containers/admin/templates";

interface IProps {
  product: IProduct;
  submitProduct: () => void;
  setSelectedProduct:
    | React.Dispatch<React.SetStateAction<IProduct>>
    | ((x: (prevState: any) => void | IProduct) => void);
  handleImageUpload: (file: FileList) => void;
  loading: boolean;
  categories: ICategory[];
}

const ProductForm: FunctionComponent<IProps> = ({
  product,
  submitProduct,
  setSelectedProduct,
  handleImageUpload,
  loading,
  categories,
}: IProps) => {
  const handleUserInput = (
    property: string,
    value: string | boolean | string[]
  ) => {
    setSelectedProduct((prevState: any) => ({
      ...prevState,
      [property]: value,
    }));
  };

  const handleCategories = (value: string | undefined, type: boolean) => {
    let updated = [...product.categories];
    if (type && value) {
      updated.push(value);
    } else if (value) {
      updated = updated.filter((item) => item !== value);
    }

    setSelectedProduct((prevState: any) => ({
      ...prevState,
      categories: updated,
    }));
  };
  return (
    <>
      <Pane>
        <TextInputField
          isInvalid={!product.name}
          required
          label="Nombre"
          validationMessage={!product.name ? "Campo es requerido" : null}
          value={product.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("name", event.target.value)
          }
        />
      </Pane>
      <Pane marginBottom={20}>
        <Label htmlFor="textarea-description" marginBottom={10} display="block">
          Descripción
        </Label>
        <Textarea
          id="textarea-description"
          placeholder="Descripción de producto"
          value={product.description}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleUserInput("description", event.target.value)
          }
        />
      </Pane>
      <Pane>
        <TextInputField
          isInvalid={!product.price}
          required
          validationMessage={!product.price ? "Campo es requerido" : null}
          type="number"
          label="Precio"
          value={product.price}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("price", event.target.value)
          }
        />
      </Pane>
      <Pane>
        <TextInputField
          type="number"
          label="Precio con descuento"
          hint="Solo si aplica"
          value={product.discountedPrice}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("discountedPrice", event.target.value)
          }
        />
      </Pane>
      <Pane>
        <TextInputField
          type="number"
          label="Precio de envío"
          hint="Solo si aplica"
          value={product.shippingPrice}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("shippingPrice", event.target.value)
          }
        />
      </Pane>
      <Pane display="flex">
        {product.image && (
          <Avatar
            marginRight={5}
            src={product.image}
            name={product.name}
            size={30}
          />
        )}
        <FilePicker
          flex={1}
          accept="image/*"
          onChange={(file) => handleImageUpload(file)}
          placeholder="Imagen"
        />
      </Pane>

      <Pane>
        <Checkbox
          label="¿Producto destacado?"
          checked={product.featured}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("featured", event.target.checked)
          }
        />
      </Pane>

      <Pane>
        <Checkbox
          label="¿Producto habilitado?"
          checked={product.active}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("active", event.target.checked)
          }
        />
      </Pane>

      <Pane background="white" marginY={15} padding={10} elevation={1}>
        <Heading>Categorías</Heading>
        {categories.map((category) => (
          <Checkbox
            key={category.key}
            label={category.name}
            checked={
              category.key ? !!product.categories.includes(category.key) : false
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleCategories(category.key, event.target.checked)
            }
          />
        ))}
      </Pane>

      <Pane>
        <Text>Utiliza etiquetas para mostrar productos similares</Text>

        <TagInput
          tagProps={{
            margin: 3,
            height: "auto",
          }}
          width="100%"
          inputProps={{ placeholder: "Añadir etiqueta..." }}
          values={product.tags}
          onChange={(values: string[]) => handleUserInput("tags", values)}
          marginBottom={10}
        />
      </Pane>

      <Pane textAlign="center">
        <Button
          disabled={!product.name || !product.price || loading}
          onClick={submitProduct}
          appearance="primary"
        >
          Guardar
        </Button>
      </Pane>
    </>
  );
};

export default ProductForm;
