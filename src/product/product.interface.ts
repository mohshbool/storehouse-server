import { Category } from 'src/category/category.schema';

export class CreateProductInput {
  name: string;
  description: string;
  quantity?: number;
  price?: number;
  image?: string;
  categories: string[];
}

export class UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  image?: string;
  categories?: Category[];
  deleted?: boolean;
}
