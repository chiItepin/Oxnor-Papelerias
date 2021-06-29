export interface ICategory {
  name: string;
  description: string;
  image: string | null;
  featured: boolean;
  created_at?: string;
  key?: string;
}

export const categoryTemplate: ICategory = {
  name: "",
  description: "",
  image: null,
  featured: false,
  created_at: "",
};

export interface IProduct {
  name: string;
  lowercaseName: string;
  description: string;
  image: string | null;
  featured: boolean;
  price: string;
  discountedPrice: string;
  shippingPrice: string;
  quantity: string;
  tags: [];
  active: boolean;
  categories: string[];
  key?: string;
}

export const productTemplate: IProduct = {
  name: "",
  lowercaseName: "",
  description: "",
  image: null,
  featured: false,
  price: "",
  discountedPrice: "",
  quantity: "",
  shippingPrice: "",
  categories: [],
  tags: [],
  active: false,
};

export interface IBanner {
  name: string;
  image: string | null;
  buttonName: string;
  buttonLink: string;
  type: "carousel" | "home-middle" | "category-view";
  categories: [];
  active: boolean;
  key?: string;
}

export const bannerTemplate: IBanner = {
  name: "",
  buttonName: "",
  buttonLink: "",
  image: null,
  type: "carousel",
  categories: [],
  active: false,
};
