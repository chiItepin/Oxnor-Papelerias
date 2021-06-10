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

export interface IProduct {
  name: string;
  description: string;
  image: string | null;
  featured: boolean;
  price: string;
  discountedPrice: string;
  shippingPrice: string;
  quantity: string;
  tags: [];
  active: boolean;
  key?: string;
}

export const productTemplate: IProduct = {
  name: "",
  description: "",
  image: null,
  featured: false,
  price: "",
  discountedPrice: "",
  quantity: "",
  shippingPrice: "",
  tags: [],
  active: false,
};
