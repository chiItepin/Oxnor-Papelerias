export interface ICategory {
  name: string;
  description: string;
  image: string | null;
  featured: boolean;
  key?: string;
}

export const categoryTemplate: ICategory = {
  name: "",
  description: "",
  image: null,
  featured: false,
};
