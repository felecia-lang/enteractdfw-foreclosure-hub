import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Calendar, Home as HomeIcon, Loader2, MapPin, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ComparisonHistory() {
  const { user, loading: authLoading } = useAuth();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: comparisons, isLoading, refetch } = trpc.comparisonHistory.getAll.useQuery(
    undefined,
    { enabled: !!user }
  );

  const deleteMutation = trpc.comparisonHistory.delete.useMutation({
    onSuccess: () => {
      toast.success("Comparison deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete comparison");
      setDeleteId(null);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const formatPropertyType = (type: string) => {
    const types: Record<string, string> = {
      single_family: "Single Family Home",
      condo: "Condo",
      townhouse: "Townhouse",
      multi_family: "Multi-Family",
    };
    return types[type] || type;
  };

  const formatCondition = (condition: string) => {
    const conditions: Record<string, string> = {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    };
    return conditions[condition] || condition;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
                  <span className="font-bold text-xl text-gray-900">{APP_TITLE}</span>
                </a>
              </Link>
              <Button asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Authentication Required
              </CardTitle>
              <CardDescription>
                You need to sign in to view your comparison history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Sign In to Continue</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
                <span className="font-bold text-xl text-gray-900">{APP_TITLE}</span>
              </a>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  <a className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Home
                  </a>
                </Link>
              </Button>
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Comparison History
            </h1>
            <p className="text-gray-600">
              View and manage your past property valuations
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !comparisons || comparisons.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Comparisons Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by calculating a property value to see your history here.
                </p>
                <Button asChild>
                  <Link href="/property-value-estimator">
                    <a>Calculate Property Value</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {comparisons.map((comparison) => (
                <Card key={comparison.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {comparison.propertyAddress || `Property in ${comparison.zipCode}`}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {comparison.zipCode}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(comparison.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(comparison.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-semibold">{formatPropertyType(comparison.propertyType)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Size</p>
                        <p className="font-semibold">{comparison.squareFeet.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beds / Baths</p>
                        <p className="font-semibold">{comparison.bedrooms} / {comparison.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Condition</p>
                        <p className="font-semibold">{formatCondition(comparison.condition)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${comparison.estimatedValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Mortgage Balance</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${comparison.mortgageBalance.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Your Equity</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${comparison.equity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comparison?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this comparison from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
