// src/features/system-admin/systemAdminApi.ts

import API_ROUTES from "@/constants/apiRoutes";
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
  return apiGet(API_ROUTES.SYSADMIN.RESTAURANTS.GET_ALL, { page, size });
};

export const createRestaurant = async (
  data: CreateRestaurantRequest
): Promise<Restaurant> => {
  return apiPost(API_ROUTES.SYSADMIN.RESTAURANTS.CREATE, data);
};

export const updateRestaurant = async (
  id: number,
  data: UpdateRestaurantRequest
): Promise<Restaurant> => {
  return apiPut(API_ROUTES.SYSADMIN.RESTAURANTS.UPDATE_BY_ID(id), data);
};

export const deleteRestaurant = async (id: number): Promise<void> => {
  return apiDelete(API_ROUTES.SYSADMIN.RESTAURANTS.DELETE_BY_ID(id));
};
