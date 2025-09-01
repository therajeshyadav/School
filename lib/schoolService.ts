import { supabase } from './supabase'
import type { School } from './supabase'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key'
}

export interface SchoolFormData {
  name: string
  address: string
  city: string
  state: string
  contact: string
  email_id: string
  image?: File
}

export class SchoolService {
  static async uploadImage(file: File): Promise<string | null> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Cannot upload image.')
        return null
      }
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('school-images')
        .upload(fileName, file)
      
      if (error) {
        console.error('Error uploading image:', error)
        return null
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(fileName)
      
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  static async createSchool(formData: SchoolFormData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase not configured. Please connect to Supabase first.' }
      }
      
      let imageUrl = null
      
      if (formData.image) {
        imageUrl = await this.uploadImage(formData.image)
      }
      
      const schoolData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        contact: formData.contact,
        email_id: formData.email_id,
        image_url: imageUrl
      }
      
      const { error } = await supabase
        .from('schools')
        .insert([schoolData])
      
      if (error) {
        console.error('Error creating school:', error)
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error creating school:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  static async getSchools(): Promise<School[]> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Please connect to Supabase to view schools.')
        return []
      }
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching schools:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching schools:', error)
      return []
    }
  }

  static async searchSchools(query: string): Promise<School[]> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Please connect to Supabase to search schools.')
        return []
      }
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error searching schools:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Error searching schools:', error)
      return []
    }
  }
}