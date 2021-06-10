import React, { FunctionComponent } from "react";
import {
  Pane,
  Button,
  TextInputField,
  Checkbox,
  FilePicker,
  Avatar,
} from "evergreen-ui";
import { ICategory } from "../../containers/admin/templates";

interface IProps {
  category: ICategory;
  submitCategory: () => void;
  setCategory:
    | React.Dispatch<React.SetStateAction<ICategory>>
    | ((x: (prevState: any) => void | ICategory) => void);
  handleImageUpload: (file: FileList) => void;
  loading: boolean;
}

const CategoryForm: FunctionComponent<IProps> = ({
  category,
  submitCategory,
  setCategory,
  handleImageUpload,
  loading,
}: IProps) => {
  const handleUserInput = (property: string, value: string | boolean) => {
    setCategory((prevState: any) => ({
      ...prevState,
      [property]: value,
    }));
  };
  return (
    <>
      <Pane>
        <TextInputField
          isInvalid={!category.name}
          required
          label="Nombre"
          validationMessage={!category.name ? "Campo es requerido" : null}
          value={category.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("name", event.target.value)
          }
        />
      </Pane>
      <Pane>
        <TextInputField
          label="Descripción"
          value={category.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("description", event.target.value)
          }
        />
      </Pane>
      <Pane display="flex">
        {category.image && (
          <Avatar
            marginRight={5}
            src={category.image}
            name={category.name}
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
          label="¿Categoría destacada?"
          checked={category.featured}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleUserInput("featured", event.target.checked)
          }
        />
      </Pane>
      <Pane textAlign="center">
        <Button
          disabled={!category.name || loading}
          onClick={submitCategory}
          appearance="primary"
        >
          Guardar
        </Button>
      </Pane>
    </>
  );
};

export default CategoryForm;
