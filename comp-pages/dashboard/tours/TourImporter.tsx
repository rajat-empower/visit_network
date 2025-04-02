"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getApiUrl, ENDPOINTS } from "@/utils/api-config";
import PageTitle from "@/components/PageTitle";

interface ImportStats {
  totalRecords: number;
  importedRecords: number;
  readyToImport: number;
}

const TourImporter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [importLimit, setImportLimit] = useState("1");
  const [stats, setStats] = useState<ImportStats>({
    totalRecords: 0,
    importedRecords: 0,
    readyToImport: 0
  });

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.TOURS.IMPORT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: parseInt(importLimit) })
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setStats({
        totalRecords: data.data.totalRecords || 0,
        importedRecords: data.data.importedRecords || 0,
        readyToImport: data.data.readyToImport || 0
      });

      toast.success('Import successful', {
        description: `Successfully imported ${data.data.importedRecords} tours`
      });
    } catch (error) {
      console.error('Error importing tours:', error);
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Failed to import tours'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStats({
      totalRecords: 0,
      importedRecords: 0,
      readyToImport: 0
    });
    setImportLimit("1");
    toast.info('Import stats reset');
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <PageTitle 
        title="Tour Importer" 
        description="Import tours from Viator API" 
      />

      <Card>
        <CardHeader>
          <CardTitle>Import Settings</CardTitle>
          <CardDescription>
            Configure and manage tour imports from Viator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Import Limit:</label>
              <Select
                value={importLimit}
                onValueChange={setImportLimit}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? 'Importing...' : 'Import'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Total Records</h3>
              <p className="text-2xl font-bold">{stats.totalRecords}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Imported Records</h3>
              <p className="text-2xl font-bold">{stats.importedRecords}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Ready to Import</h3>
              <p className="text-2xl font-bold">{stats.readyToImport}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourImporter; 