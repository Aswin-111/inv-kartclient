"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import interceptor from "@/app/utils/interceptor";

function HomePage() {
  const [viewData, setViewData] = useState(null);
  const [designTasks, setDesignTasks] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await interceptor.get("/designing/alldesigntasks");
        console.log(response.data);
        setDesignTasks(response.data.data);
      } catch (error) {
        console.error("Error fetching design tasks:", error);
      }
    })();
  }, []);

  const handleView = (item) => {
    setViewData(item);
    setUploadedFiles([]); // Reset uploaded files when viewing a new item
  };

  const renderUploadedFilesPreview = () => {
    if (uploadedFiles.length === 0) {
      return (
        <div className="h-24 w-32 border border-dashed border-gray-400 rounded-md flex items-center justify-center text-gray-400">
          Image not selected, please select an image.
        </div>
      );
    }

    return (
      <div className="flex space-x-2 overflow-x-auto">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="h-24 w-32">
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index + 1}`}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    );
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleDownloadAll = async (itemId) => {
    try {
      console.log(viewData);
      const response = await interceptor.get(
        `/designing/alldesigntasksimages/${viewData.orderId}`,
        {
          responseType: "blob", // Important for file downloads
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `images_${viewData.orderId}.zip`); // Set the filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading images:", error);
      alert("Failed to download images.");
    }
  };

  return (
    <div className="max-h-screen flex flex-col items-center justify-start pt-8">
      <main className="container mx-auto px-4 w-full">
        <div className="bg-white rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    LOwner
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Array.isArray(designTasks) && designTasks.length > 0 ? (
                  designTasks.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {item.leadName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {item.phone}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {item.leadOwner}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {item.status}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleView(item)}
                              >
                                Upload
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div>Data not found</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Viewing Details */}
      <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Design Details - {viewData?.designTaskId}</DialogTitle>
            <DialogDescription>Order ID: {viewData?.orderId}</DialogDescription>
          </DialogHeader>
          {viewData && (
            <div className="space-y-6 py-2 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Customer Name:</span>
                  <div className="mt-1 text-gray-700">
                    {viewData.customerName}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Customer Phone No:</span>
                  <div className="mt-1 text-gray-700">
                    {viewData.customerPhoneNo}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Product:</span>
                  <div className="mt-1 text-gray-700">{viewData.product}</div>
                </div>
                <div>
                  <span className="font-semibold">Lead Owner:</span>
                  <div className="mt-1 text-gray-700">{viewData.leadOwner}</div>
                </div>
                <div>
                  <span className="font-semibold">Status:</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {viewData.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="font-semibold block mb-2">
                  Upload Designed Photos:
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100"
                />
                {renderUploadedFilesPreview()}
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadAll(viewData.id)}
                >
                  Download
                </Button>
                <Button>Update</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomePage;
