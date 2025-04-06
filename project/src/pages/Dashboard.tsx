import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { User, FoodListing } from '../types';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    quantity: 1,
    quantity_unit: 'kg',
    expiry_time: '',
  });

  useEffect(() => {
    fetchUserData();
    fetchListings();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userData, error } = await supabase
          .from('profiles')  // Changed from 'users' to 'profiles'
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;
        setUser({ ...authUser, ...userData });
      }
    } catch (error) {
      toast.error('Error fetching user data');
    }
  };

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('food_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('food_listings')
        .insert([
          {
            ...newListing,
            user_id: user.id,  // Changed from restaurant_id to user_id to match schema
            status: 'available',
          },
        ]);

      if (error) throw error;

      toast.success('Listing created successfully');
      setShowNewListingForm(false);
      setNewListing({
        title: '',
        description: '',
        quantity: 1,
        quantity_unit: 'kg',
        expiry_time: '',
      });
      fetchListings();
    } catch (error) {
      toast.error('Error creating listing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'accepted':
        return 'text-blue-600';
      case 'delivered':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'accepted':
        return <Package className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.full_name || 'User'}! Manage your food donations and requests here.
          </p>
        </div>
        <button
          onClick={() => setShowNewListingForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Listing
        </button>
      </div>

      {showNewListingForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Food Listing</h2>
          <form onSubmit={handleCreateListing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newListing.quantity}
                  onChange={(e) => setNewListing({ ...newListing, quantity: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  value={newListing.quantity_unit}
                  onChange={(e) => setNewListing({ ...newListing, quantity_unit: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="servings">Servings</option>
                  <option value="boxes">Boxes</option>
                  <option value="items">Items</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Time</label>
              <input
                type="datetime-local"
                required
                value={newListing.expiry_time}
                onChange={(e) => setNewListing({ ...newListing, expiry_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewListingForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {listings.map((listing) => (
            <li key={listing.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-green-600 truncate">{listing.title}</p>
                    <div className={`ml-4 flex items-center ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status)}
                      <span className="ml-1 text-sm capitalize">{listing.status}</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {listing.quantity} {listing.quantity_unit}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {listing.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Expires: {new Date(listing.expiry_time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;