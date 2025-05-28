// src/features/system-admin/hooks/useRestaurants.ts

import {
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } from "../api";
  import {
    CreateRestaurantRequest,
    UpdateRestaurantRequest,
    Restaurant,
  } from "../types";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  
  export const useRestaurants = (page: number = 0, size: number = 15) => {
    return useQuery({
      queryKey: ["restaurants", page, size],
      queryFn: () => getRestaurants(page, size),
    });
  };
  
  export const useCreateRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateRestaurantRequest) => createRestaurant(data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
    });
  };
  
  export const useUpdateRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: number;
        data: UpdateRestaurantRequest;
      }) => updateRestaurant(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
    });
  };
  
  export const useDeleteRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => deleteRestaurant(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
    });
  };
  