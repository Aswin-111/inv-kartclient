"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const pathname = usePathname();

  const handleAccordionClick = (item) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  const isActive = (path) => pathname.startsWith(path);

  const menuItems = [
    {
      title: "Products",
      path: "/products",
      subItems: [
        { title: "All Products", path: "/products/allproducts" },
        { title: "Category", path: "/products/category" },
        { title: "Inventory", path: "/products/inventory" },
      ],
    },
    {
      title: "Orders",
      path: "/orders",
      subItems: [
        { title: "All Orders", path: "/orders/allorders" },
        { title: "Leads", path: "/orders/leads" },
        { title: "Tasks", path: "/orders/tasks" },
      ],
    },
    {
      title: "Designing",
      path: "/designing",
      subItems: [
        { title: "All Design Tasks", path: "/designing/alldesigntasks" },
        { title: "Pending", path: "/designing/pending" },
      ],
    },
    { title: "Printing", path: "/printing" },
    { title: "Shipping", path: "/shipping" },
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen p-5 border-r border-gray-800 shadow-lg">
      <div className="text-3xl font-extrabold mb-6 text-center text-blue-400">
        Dorakart
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-2">
            <button
              className={`w-full flex justify-between items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                isActive(item.path)
                  ? "bg-blue-500 shadow-md"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => item.subItems && handleAccordionClick(item.title)}
            >
              <span className="font-medium">{item.title}</span>
              {item.subItems &&
                (openAccordion === item.title ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                ))}
            </button>
            {item.subItems && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 space-y-2 ${
                  openAccordion === item.title
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.path}
                    className="block py-2 px-4 text-sm text-gray-300 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          className=" py-3 px-4 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all absolute bottom-4 left-5"
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
