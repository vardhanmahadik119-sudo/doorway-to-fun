import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Download, Check, X, FileText, Key, CreditCard, AlertCircle } from "lucide-react";

interface CSVHeader {
  original: string;
  mapped: string;
  confidence: number;
}

interface RazorpayConfig {
  apiKey: string;
  secretKey: string;
  isConnected: boolean;
}

const commonLeadSourceVariations: Record<string, string[]> = {
  "Google Ads": ["google ads", "google adwords", "adwords", "google ppc", "ppc", "search ads"],
  "Google Analytics": ["google analytics", "ga", "analytics", "google ga", "web analytics"],
  "WhatsApp": ["whatsapp", "wa", "whatsapp business", "chat", "messaging"],
  "Phone Calls": ["phone", "call", "telephone", "mobile", "landline", "inbound call"],
  "Website Contact Form": ["website", "contact form", "web form", "online form", "contact us", "inquiry form"],
  "Referral": ["referral", "ref", "recommendation", "word of mouth", "referred"],
  "CSV Import": ["csv", "import", "upload", "file import", "data import"]
};

export default function Settings() {
  const [razorpayConfig, setRazorpayConfig] = useState<RazorpayConfig>({
    apiKey: "",
    secretKey: "",
    isConnected: false
  });
  
  const [csvHeaders, setCsvHeaders] = useState<CSVHeader[]>([]);
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapLeadSource = (header: string): { source: string; confidence: number } => {
    const normalizedHeader = header.toLowerCase().trim();
    
    for (const [source, variations] of Object.entries(commonLeadSourceVariations)) {
      if (source === "CSV Import") continue; // Skip CSV Import for mapping
      
      for (const variation of variations) {
        if (normalizedHeader.includes(variation)) {
          const confidence = normalizedHeader === variation ? 100 : 
                          normalizedHeader.startsWith(variation) ? 85 : 70;
          return { source, confidence };
        }
      }
    }
    
    return { source: header, confidence: 0 };
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingCsv(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const mappedHeaders = headers.map(header => {
          const mapping = mapLeadSource(header);
          return {
            original: header,
            mapped: mapping.confidence > 0 ? mapping.source : header,
            confidence: mapping.confidence
          };
        });
        
        setCsvHeaders(mappedHeaders);
        setShowCsvDialog(true);
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
    } finally {
      setIsProcessingCsv(false);
    }
  };

  const handleHeaderMappingChange = (index: number, newMapping: string) => {
    const updatedHeaders = [...csvHeaders];
    updatedHeaders[index].mapped = newMapping;
    setCsvHeaders(updatedHeaders);
  };

  const confirmCsvImport = () => {
    // Here you would process the CSV with the confirmed mappings
    console.log('Confirmed headers:', csvHeaders);
    setShowCsvDialog(false);
    setCsvHeaders([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const connectRazorpay = () => {
    if (razorpayConfig.apiKey && razorpayConfig.secretKey) {
      // Simulate API connection
      setTimeout(() => {
        setRazorpayConfig(prev => ({ ...prev, isConnected: true }));
      }, 1000);
    }
  };

  const disconnectRazorpay = () => {
    setRazorpayConfig({
      apiKey: "",
      secretKey: "",
      isConnected: false
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your integrations and data imports</p>
        </div>

        {/* Lead Sources Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lead Sources
            </CardTitle>
            <CardDescription>
              Import leads from CSV files and manage lead source mappings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
              />
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <Button variant="outline" className="gap-2" disabled={isProcessingCsv}>
                  <Upload className="h-4 w-4" />
                  {isProcessingCsv ? "Processing..." : "Upload CSV"}
                </Button>
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to automatically detect and map lead source columns
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Smart Recognition Patterns:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                {Object.entries(commonLeadSourceVariations).slice(0, -1).map(([source, variations]) => (
                  <div key={source} className="flex items-start gap-2">
                    <span className="font-medium text-foreground">{source}:</span>
                    <span>{variations.slice(0, 3).join(", ")}{variations.length > 3 ? "..." : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Razorpay Integration Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Razorpay Integration
            </CardTitle>
            <CardDescription>
              Connect Razorpay to automatically sync payment data with your revenue dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge 
                variant={razorpayConfig.isConnected ? "default" : "secondary"}
                className={razorpayConfig.isConnected ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {razorpayConfig.isConnected ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
              {razorpayConfig.isConnected && (
                <span className="text-sm text-muted-foreground">
                  Revenue data is being synced automatically
                </span>
              )}
            </div>

            {!razorpayConfig.isConnected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key">Razorpay API Key</Label>
                    <Input
                      id="razorpay-key"
                      type="password"
                      placeholder="Enter your Razorpay API Key"
                      value={razorpayConfig.apiKey}
                      onChange={(e) => setRazorpayConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-secret">Razorpay Secret Key</Label>
                    <Input
                      id="razorpay-secret"
                      type="password"
                      placeholder="Enter your Razorpay Secret Key"
                      value={razorpayConfig.secretKey}
                      onChange={(e) => setRazorpayConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={connectRazorpay}
                  disabled={!razorpayConfig.apiKey || !razorpayConfig.secretKey}
                  className="w-full md:w-auto"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Connect Razorpay
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Integration Active</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your Razorpay account is connected. Payment data will automatically appear in the Revenue Snapshot on your dashboard.
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={disconnectRazorpay}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Disconnect Integration
                </Button>
              </div>
            )}

            <Separator />
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">How it works:</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Payments are matched to clients by name or email</li>
                    <li>Paid invoices automatically appear in Revenue Snapshot</li>
                    <li>Data syncs every 5 minutes when connected</li>
                    <li>Historical data (last 90 days) is imported on first connection</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSV Header Mapping Dialog */}
      <Dialog open={showCsvDialog} onOpenChange={setShowCsvDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Lead Source Mappings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've detected the following columns in your CSV. Please confirm or update the lead source mappings:
            </p>
            
            <div className="space-y-3">
              {csvHeaders.map((header, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Original: {header.original}</p>
                    <p className="text-xs text-muted-foreground">Detected as: {header.mapped}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {header.confidence > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {header.confidence}% match
                      </Badge>
                    )}
                    <select
                      value={header.mapped}
                      onChange={(e) => handleHeaderMappingChange(index, e.target.value)}
                      className="px-3 py-1 text-sm border rounded-md"
                    >
                      <option value={header.original}>Use Original</option>
                      {Object.keys(commonLeadSourceVariations).slice(0, -1).map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={confirmCsvImport} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Confirm Import
              </Button>
              <Button variant="outline" onClick={() => setShowCsvDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
