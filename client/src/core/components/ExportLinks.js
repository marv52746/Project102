import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import React from "react";

function ExportLinks() {
  return (
    <nav aria-label="Page navigation example" className="my-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <button
            href="#"
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </li>
        <li>
          <button className="text-blue-500 hover:text-blue-700 flex items-center space-x-2">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </li>
        <li>
          <button className="text-blue-500 hover:text-blue-700 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </li>
        <li>
          <button className="text-blue-500 hover:text-blue-700 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default ExportLinks;
