import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, Plus, Eye, BookOpen, Search } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <School className="h-16 w-16 mr-4" />
              <h1 className="text-5xl font-bold">SchoolHub</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your comprehensive platform for managing school information. 
              Add new schools and browse our extensive directory with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 text-lg">Choose what you'd like to do</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Add School Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Plus className="h-6 w-6" />
                Add New School
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <BookOpen className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-gray-600 leading-relaxed">
                  Register a new school with complete details including contact information, 
                  location, and images. Our form makes it easy to add all necessary information.
                </p>
                <Link href="/add-school">
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    Add School
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* View Schools Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Eye className="h-6 w-6" />
                Browse Schools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <School className="h-12 w-12 text-blue-500 mx-auto" />
                <p className="text-gray-600 leading-relaxed">
                  Explore our comprehensive directory of schools. Search by name, 
                  location, or browse through all available schools in an intuitive grid layout.
                </p>
                <Link href="/show-schools">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Schools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Why Choose SchoolHub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Registration</h4>
              <p className="text-gray-600">Simple and intuitive form to add new schools with validation</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Search</h4>
              <p className="text-gray-600">Find schools quickly by name, city, or state</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Beautiful Display</h4>
              <p className="text-gray-600">Modern card-based layout with images and key information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}