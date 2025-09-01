'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, CheckCircle, AlertCircle, School } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const schoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  contact: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Contact number must be at least 10 digits'),
  email_id: z.string().email('Please enter a valid email address'),
  image: z.any().optional()
})

export function SchoolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(schoolSchema)
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setValue('image', file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('contact', data.contact)
      formData.append('email_id', data.email_id)
      
      // Handle image upload first if there's an image
      let imageUrl = null
      if (selectedImage) {
        const imageFormData = new FormData()
        imageFormData.append('image', selectedImage)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.imageUrl
        }
      }
      
      formData.append('image', imageUrl || '')
      
      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setSubmitStatus('success')
        reset()
        setSelectedImage(null)
        setImagePreview(null)
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to add school')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Add New School</h1>
          </div>
          <p className="text-gray-600">Fill in the details to register a new school</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">School Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  School Name *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter school name"
                  className={cn(
                    "transition-all duration-200",
                    errors.name && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter complete address"
                  rows={3}
                  className={cn(
                    "transition-all duration-200",
                    errors.address && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Enter city"
                    className={cn(
                      "transition-all duration-200",
                      errors.city && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="Enter state"
                    className={cn(
                      "transition-all duration-200",
                      errors.state && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                    Contact Number *
                  </Label>
                  <Input
                    id="contact"
                    {...register('contact')}
                    placeholder="Enter contact number"
                    className={cn(
                      "transition-all duration-200",
                      errors.contact && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.contact.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_id" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email_id"
                    type="email"
                    {...register('email_id')}
                    placeholder="Enter email address"
                    className={cn(
                      "transition-all duration-200",
                      errors.email_id && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.email_id && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email_id.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  School Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative h-32 w-full mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview(null)
                          setSelectedImage(null)
                          setValue('image', undefined)
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div>
                        <Label
                          htmlFor="image"
                          className="cursor-pointer text-blue-600 hover:text-blue-500"
                        >
                          Click to upload
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>School added successfully!</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding School...
                  </div>
                ) : (
                  'Add School'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}