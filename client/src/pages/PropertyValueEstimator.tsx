import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calculator, Home, TrendingUp, AlertCircle, Phone } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function PropertyValueEstimator() {
  const [formData, setFormData] = useState({
    zipCode: "",
    propertyType: "single_family" as "single_family" | "condo" | "townhouse" | "multi_family",
    squareFeet: "",
    bedrooms: "",
    bathrooms: "",
    condition: "good" as "excellent" | "good" | "fair" | "poor",
    mortgageBalance: "",
  });

  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateMutation = trpc.propertyValuation.calculate.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        zipCode: formData.zipCode,
        propertyType: formData.propertyType,
        squareFeet: parseInt(formData.squareFeet),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        condition: formData.condition,
        mortgageBalance: formData.mortgageBalance ? parseFloat(formData.mortgageBalance) : undefined,
      };

      const calculationResult = await calculateMutation.mutateAsync(data);
      setResult(calculationResult);
      setShowResults(true);
    } catch (error) {
      toast.error("Failed to calculate property value. Please check your inputs and try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      zipCode: "",
      propertyType: "single_family",
      squareFeet: "",
      bedrooms: "",
      bathrooms: "",
      condition: "good",
      mortgageBalance: "",
    });
    setResult(null);
    setShowResults(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">{APP_TITLE}</span>
          </div>
          <nav className="flex gap-6">
            <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/knowledge-base" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Knowledge Base
            </a>
            <a href="/timeline-calculator" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Timeline Calculator
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Property Value Estimator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an instant estimate of your property's market value based on current DFW area real estate data.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* ZIP Code */}
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Property ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="75001"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                      maxLength={5}
                      pattern="[0-9]{5}"
                    />
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value: any) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_family">Single Family Home</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="multi_family">Multi-Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Square Feet */}
                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet *</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      placeholder="1500"
                      value={formData.squareFeet}
                      onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                      required
                      min="300"
                      max="10000"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                      min="1"
                      max="10"
                    />
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      step="0.5"
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      required
                      min="1"
                      max="10"
                    />
                  </div>

                  {/* Condition */}
                  <div className="space-y-2">
                    <Label htmlFor="condition">Property Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value: any) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (Recently renovated/updated)</SelectItem>
                        <SelectItem value="good">Good (Well-maintained)</SelectItem>
                        <SelectItem value="fair">Fair (Some repairs needed)</SelectItem>
                        <SelectItem value="poor">Poor (Significant repairs needed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mortgage Balance */}
                  <div className="space-y-2">
                    <Label htmlFor="mortgageBalance">Current Mortgage Balance (Optional)</Label>
                    <Input
                      id="mortgageBalance"
                      type="number"
                      placeholder="250000"
                      value={formData.mortgageBalance}
                      onChange={(e) => setFormData({ ...formData, mortgageBalance: e.target.value })}
                      min="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Include this to see your equity position and sale options
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={calculateMutation.isPending}
                  >
                    {calculateMutation.isPending ? "Calculating..." : "Calculate Value"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    <strong>Disclaimer:</strong> This is an automated estimate based on general market data and should not be considered a professional appraisal. Actual property value may vary based on specific features, location, market conditions, and other factors.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Results Card */}
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Estimated Property Value
                  </h2>
                  <p className="text-5xl font-bold text-primary mb-4">
                    {formatCurrency(result.estimatedValue)}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">
                      {result.confidence === "high" ? "High" : result.confidence === "medium" ? "Medium" : "Low"} Confidence
                    </span>
                  </div>
                </div>

                {/* Valuation Range */}
                <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estimated Value Range</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Low</p>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(result.valuationRange.low)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Mid</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(result.valuationRange.mid)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">High</p>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(result.valuationRange.high)}</p>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Calculation Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Base Value ({formData.squareFeet} sq ft @ ${result.pricePerSqFt}/sq ft)</span>
                      <span className="font-semibold text-foreground">{formatCurrency(result.breakdown.baseValue)}</span>
                    </div>
                    {result.breakdown.typeAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Property Type Adjustment</span>
                        <span className={`font-semibold ${result.breakdown.typeAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                          {result.breakdown.typeAdjustment > 0 ? "+" : ""}{formatCurrency(result.breakdown.typeAdjustment)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.conditionAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Condition Adjustment</span>
                        <span className={`font-semibold ${result.breakdown.conditionAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                          {result.breakdown.conditionAdjustment > 0 ? "+" : ""}{formatCurrency(result.breakdown.conditionAdjustment)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.bedroomAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Bedroom Adjustment</span>
                        <span className={`font-semibold ${result.breakdown.bedroomAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                          {result.breakdown.bedroomAdjustment > 0 ? "+" : ""}{formatCurrency(result.breakdown.bedroomAdjustment)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.bathroomAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Bathroom Adjustment</span>
                        <span className={`font-semibold ${result.breakdown.bathroomAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                          {result.breakdown.bathroomAdjustment > 0 ? "+" : ""}{formatCurrency(result.breakdown.bathroomAdjustment)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Equity Analysis */}
                {result.equityAnalysis && (
                  <div className="mb-8 p-6 rounded-lg border-2" style={{
                    borderColor: result.equityAnalysis.saleRecommendation === 'traditional' ? 'rgb(34, 197, 94)' : 
                                result.equityAnalysis.saleRecommendation === 'short_sale' ? 'rgb(239, 68, 68)' : 
                                'rgb(251, 146, 60)',
                    backgroundColor: result.equityAnalysis.saleRecommendation === 'traditional' ? 'rgb(240, 253, 244)' : 
                                    result.equityAnalysis.saleRecommendation === 'short_sale' ? 'rgb(254, 242, 242)' : 
                                    'rgb(255, 247, 237)'
                  }}>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Your Equity Position</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Property Value</span>
                        <span className="font-semibold text-foreground">{formatCurrency(result.estimatedValue)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Mortgage Balance</span>
                        <span className="font-semibold text-foreground">-{formatCurrency(result.equityAnalysis.mortgageBalance)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="font-semibold text-foreground">Your Equity</span>
                        <span className={`font-bold text-lg ${result.equityAnalysis.equity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.equityAnalysis.equity)} ({result.equityAnalysis.equityPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Est. Closing Costs (7%)</span>
                        <span className="font-semibold text-foreground">-{formatCurrency(result.equityAnalysis.closingCosts)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-white/50 dark:bg-black/20 rounded px-3">
                        <span className="font-bold text-foreground">Net Proceeds After Sale</span>
                        <span className={`font-bold text-xl ${result.equityAnalysis.netProceeds >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.equityAnalysis.netProceeds)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg" style={{
                      backgroundColor: result.equityAnalysis.saleRecommendation === 'traditional' ? 'rgb(220, 252, 231)' : 
                                      result.equityAnalysis.saleRecommendation === 'short_sale' ? 'rgb(254, 226, 226)' : 
                                      'rgb(254, 243, 199)'
                    }}>
                      <p className="font-semibold text-foreground mb-2">
                        {result.equityAnalysis.saleRecommendation === 'traditional' ? '✅ Traditional Sale Recommended' :
                         result.equityAnalysis.saleRecommendation === 'short_sale' ? '⚠️ Short Sale May Be Needed' :
                         '💡 Consultation Recommended'}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.equityAnalysis.recommendationMessage}</p>
                    </div>
                  </div>
                )}

                {!result.zipCodeFound && (
                  <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        We don't have specific market data for ZIP code {formData.zipCode}. This estimate uses average DFW area pricing and may be less accurate.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    Calculate Another Property
                  </Button>
                  <Button asChild className="flex-1">
                    <a href="tel:832-932-7585">
                      <Phone className="h-4 w-4 mr-2" />
                      Get Professional Appraisal
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Next Steps Card */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Facing foreclosure?</strong> Understanding your property's value is the first step in exploring your options. EnterActDFW can help you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Sell your home quickly for a fair cash offer</li>
                    <li>Avoid foreclosure and protect your credit</li>
                    <li>Close in as little as 7-10 days</li>
                    <li>No repairs, fees, or commissions</li>
                  </ul>
                  <div className="pt-4">
                    <Button asChild variant="default" className="w-full">
                      <a href="/">Get Your Free Foreclosure Survival Guide</a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2025 {APP_TITLE}. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
