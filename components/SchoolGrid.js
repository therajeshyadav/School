"use client";

import { useState, useEffect } from "react";
import { SchoolCard } from "@/components/SchoolCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, School, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SchoolGrid() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/schools");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Debug log

      // Handle both array and object responses
      const schoolsArray = Array.isArray(data) ? data : data.schools || [];
      console.log("Schools array:", schoolsArray); // Debug log

      setSchools(schoolsArray);
      setFilteredSchools(schoolsArray);
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
      setFilteredSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setSchools((prev) => prev.filter((s) => s.id !== id)); // DB se delete ho chuka → UI se bhi turant remove
    setFilteredSchools((prev) => prev.filter((s) => s.id !== id)); // search results bhi update ho
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSchools();
    setIsRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
      return;
    }

    try {
      const response = await fetch(
        `/api/schools?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      // Handle both array and object responses
      const schoolsArray = Array.isArray(data) ? data : data.schools || [];
      setFilteredSchools(schoolsArray);
    } catch (error) {
      console.error("Error searching schools:", error);
    }
  };

   useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <School className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Schools Directory
              </h1>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search schools by name, city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No schools found" : "No schools added yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Add your first school to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery
                  ? `Found ${filteredSchools.length} school${
                      filteredSchools.length !== 1 ? "s" : ""
                    } matching "${searchQuery}"`
                  : `Showing ${filteredSchools.length} school${
                      filteredSchools.length !== 1 ? "s" : ""
                    }`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
