export type UserRole = 'restaurant' | 'ngo' | 'volunteer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface FoodListing {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  expiry_time: string;
  status: 'available' | 'pending' | 'accepted' | 'delivered';
  created_at: string;
}

export interface Pickup {
  id: string;
  listing_id: string;
  ngo_id: string;
  volunteer_id?: string;
  status: 'pending' | 'accepted' | 'delivered';
  created_at: string;
}