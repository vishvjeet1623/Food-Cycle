/*
  # Initial Schema Setup for FoodCycle

  1. New Tables
    - `food_listings`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `title` (text)
      - `description` (text)
      - `quantity` (integer)
      - `expiry_date` (date)
      - `location` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `status` (text)
      - `image_url` (text, optional)

    - `profiles` (instead of users table - best practice with Supabase Auth)
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp with timezone)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `location` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create food_listings table
CREATE TABLE IF NOT EXISTS food_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  quantity integer NOT NULL,
  expiry_date date NOT NULL,
  location text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'available',
  image_url text,
  CONSTRAINT status_check CHECK (status IN ('available', 'claimed', 'expired'))
);

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  full_name text,
  avatar_url text,
  location text
);

-- Enable RLS
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for food_listings
CREATE POLICY "Anyone can view available food listings" 
  ON food_listings 
  FOR SELECT 
  USING (status = 'available');

CREATE POLICY "Users can create food listings" 
  ON food_listings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
  ON food_listings 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
  ON food_listings 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();