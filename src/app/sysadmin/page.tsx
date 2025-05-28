'use client';

import RestaurantList from "@/features/sysadmin/components/RestaurantList";


export default function SysAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <RestaurantList />
    </div>
  );
}
