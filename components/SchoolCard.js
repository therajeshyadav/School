'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'

export function SchoolCard({ school }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={school.image || 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={school.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900">
          {school.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="line-clamp-1">{school.address}</p>
              <p className="text-gray-500">{school.city}, {school.state}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-500" />
            <span>{school.contact}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-purple-500" />
            <span className="line-clamp-1">{school.email_id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}