"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SearchBar() {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search..."
        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Search
      </Button>
    </div>
  );
}

export default SearchBar;
