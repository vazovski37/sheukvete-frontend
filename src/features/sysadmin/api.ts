// src/features/sysadmin/api.ts

import API_ROUTES from "@/constants/apiRoutes"; //
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  PaginatedRestaurants,
  Restaurant,
} from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";

export const getRestaurants = async (
  page: number = 0,
  size: number = 15
): Promise<PaginatedRestaurants> => {
  // Use BASE for GET ALL, as the backend endpoint is just /restaurant/admin
  return apiGet(API_ROUTES.SYSADMIN.RESTAURANTS.BASE, { page, size });
};

export const createRestaurant = async (
  data: CreateRestaurantRequest
): Promise<Restaurant> => {
  // Use BASE for CREATE, as the backend endpoint is just /restaurant/admin
  return apiPost(API_ROUTES.SYSADMIN.RESTAURANTS.BASE, data);
};

export const updateRestaurant = async (
  id: number,
  data: UpdateRestaurantRequest
): Promise<Restaurant> => {
  // Use BY_ID for UPDATE
  return apiPut(API_ROUTES.SYSADMIN.RESTAURANTS.BY_ID(id), data);
};

export const deleteRestaurant = async (id: number): Promise<void> => {
  // Use BY_ID for DELETE
  return apiDelete(API_ROUTES.SYSADMIN.RESTAURANTS.BY_ID(id));
};