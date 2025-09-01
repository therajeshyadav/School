/*
  # Create schools table and storage

  1. New Tables
    - `schools`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `address` (text, required)
      - `city` (text, required)
      - `state` (text, required)
      - `contact` (text, required)
      - `email_id` (text, required, unique)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create `school-images` bucket for storing school photos
    - Set up public access for images

  3. Security
    - Enable RLS on `schools` table
    - Add policies for reading and inserting schools data
    - Set up storage policies for image uploads
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  contact text NOT NULL,
  email_id text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create policies for schools table
CREATE POLICY "Anyone can read schools"
  ON schools
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert schools"
  ON schools
  FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for school images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-images', 'school-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can upload school images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'school-images');

CREATE POLICY "Anyone can view school images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'school-images');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();