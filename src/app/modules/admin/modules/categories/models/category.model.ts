import { CategoryItemResponse } from '../interfaces/category-item.response';

export class CategoryModel {
  id: number;
  name: string;
  type: string;
  userId: number;

   constructor(categoryItem: CategoryItemResponse) {
    this.id = categoryItem.id;
    this.name = categoryItem.name;
    this.type = categoryItem.type;
    this.userId = categoryItem.userId;
  }
}