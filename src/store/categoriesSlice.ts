import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: JSON.parse(localStorage.getItem("categories") || "[]"),
};

const saveCategoriesToLocalStorage = (categories: Category[]) => {
  try {
    localStorage.setItem("categories", JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories to localStorage:", error);
  }
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<string>) {
      const newCategory: Category = {
        id: Date.now(),
        name: action.payload,
      };
      state.categories.push(newCategory);
      saveCategoriesToLocalStorage(state.categories);
    },
    removeCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      saveCategoriesToLocalStorage(state.categories);
    },
    updateCategory(state, action: PayloadAction<{ id: number; name: string }>) {
      const category = state.categories.find(c => c.id === action.payload.id);
      if (category) {
        category.name = action.payload.name;
        saveCategoriesToLocalStorage(state.categories);
      }
    },
  },
});

export const { addCategory, removeCategory, updateCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer; 