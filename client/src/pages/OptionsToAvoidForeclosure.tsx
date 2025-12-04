import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, TrendingUp, Home, FileText, DollarSign, Scale, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

export default function OptionsToAvoidForeclosure() {
  return (
    <KnowledgeBaseLayout
      title="Options to Avoid Foreclosure"
      description="Explore all available alternatives to foreclosure, including loan modifications, repayment plans, short sales, and selling to EnterActDFW."
    >
      <Alert className="mb-8">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription>
          <strong>Act Quickly:</strong> The sooner you explore your options, the more choices you'll have. 
          Contact your lender immediately and consider working with a HUD-approved housing counselor for free guidance.
        </AlertDescription>
      </Alert>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Overview of Your Options</h2>
        <p className="text-muted-foreground mb-6">
          If you're facing foreclosure, you have several alternatives that can help you avoid losing your home or 
          minimize the financial and credit damage. The best option for you depends on your specific situation, 
          including your income, equity, and long-term goals.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Keep Your Home
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Loan Modification</li>
                <li>• Repayment Plan</li>
                <li>• Forbearance Agreement</li>
                <li>• Refinance</li>
                <li>• Chapter 13 Bankruptcy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-secondary" />
                Leave Your Home
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Short Sale</li>
                <li>• Deed in Lieu of Foreclosure</li>
                <li>• Sell to Cash Buyer (EnterActDFW)</li>
                <li>• Traditional Home Sale</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          <TrendingUp className="inline-block h-6 w-6 mr-2 text-primary" />
          Options to Keep Your Home
        </h2>

        <div className="space-y-8">
          {/* Loan Modification */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">1. Loan Modification</CardTitle>
              <CardDescription>Permanently change the terms of your mortgage to make payments more affordable</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  A loan modification is a permanent change to one or more terms of your mortgage. Your lender may agree to 
                  reduce your interest rate, extend the loan term, convert from an adjustable-rate to a fixed-rate mortgage, 
                  or even reduce the principal balance (though this is rare).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Contact your mortgage servicer and request a loan modification application</li>
                  <li>Submit a complete loss mitigation application with financial documents (pay stubs, bank statements, tax returns, hardship letter)</li>
                  <li>The lender reviews your application and determines if you qualify</li>
                  <li>If approved, you receive a trial modification period (typically 3 months)</li>
                  <li>After successfully completing the trial, the modification becomes permanent</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Pros
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lower monthly payments</li>
                    <li>• Keep your home</li>
                    <li>• Avoid foreclosure on credit report</li>
                    <li>• Permanent solution</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Cons
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• May extend loan term (more interest)</li>
                    <li>• Application process can be lengthy</li>
                    <li>• Not guaranteed to be approved</li>
                    <li>• May impact credit score temporarily</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <FileText className="h-5 w-5" />
                <AlertDescription>
                  <strong>Federal Protection:</strong> If you submit a complete loss mitigation application at least 37 days 
                  before a foreclosure sale, the lender must stop the foreclosure while reviewing your application.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Repayment Plan */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">2. Repayment Plan</CardTitle>
              <CardDescription>Catch up on missed payments over time while continuing regular payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  A repayment plan allows you to catch up on missed payments by spreading the past-due amount over several months, 
                  in addition to your regular monthly payment. This is best for borrowers who experienced a temporary financial hardship 
                  but can now afford their regular payment plus extra.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Example:</h4>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    If you're $6,000 behind and your regular payment is $1,500, the lender might agree to a 6-month repayment plan:
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Monthly payment during plan: $1,500 (regular) + $1,000 (catch-up) = $2,500
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Quick to set up</li>
                    <li>• Keep your home</li>
                    <li>• No change to loan terms</li>
                    <li>• Good for temporary hardships</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Higher payments during plan period</li>
                    <li>• Must have sufficient income</li>
                    <li>• Failure to complete can lead to foreclosure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forbearance */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">3. Forbearance Agreement</CardTitle>
              <CardDescription>Temporarily pause or reduce payments during a short-term hardship</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  Forbearance allows you to temporarily pause or reduce your mortgage payments for a specific period (typically 3-12 months) 
                  while you recover from a short-term financial hardship, such as a job loss, medical emergency, or natural disaster.
                </p>
              </div>

              <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertDescription>
                  <strong>Important:</strong> Forbearance is not forgiveness. You will still owe the missed payments. At the end of the 
                  forbearance period, you must work with your lender to repay the amount through a repayment plan, loan modification, or lump sum.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Immediate payment relief</li>
                    <li>• Stops foreclosure temporarily</li>
                    <li>• Buys time to recover financially</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Debt continues to accrue</li>
                    <li>• Must repay missed payments later</li>
                    <li>• Only a temporary solution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refinance */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">4. Refinance Your Mortgage</CardTitle>
              <CardDescription>Replace your current loan with a new one at better terms</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  Refinancing means taking out a new mortgage to pay off your existing one. If you can qualify for a lower interest rate 
                  or better terms, refinancing can lower your monthly payment and help you avoid foreclosure.
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  <strong>Reality Check:</strong> Refinancing is difficult if you're already behind on payments or your credit score has 
                  dropped. You typically need good credit, sufficient income, and equity in your home to qualify.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Chapter 13 Bankruptcy */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">5. Chapter 13 Bankruptcy</CardTitle>
              <CardDescription>Court-supervised repayment plan that stops foreclosure</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  Chapter 13 bankruptcy allows you to reorganize your debts and create a 3-5 year repayment plan supervised by the bankruptcy court. 
                  Filing for Chapter 13 triggers an "automatic stay" that immediately stops the foreclosure process.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">How It Helps:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Stops foreclosure immediately upon filing</li>
                  <li>Allows you to catch up on missed payments over 3-5 years</li>
                  <li>May reduce or eliminate other debts (credit cards, medical bills)</li>
                  <li>Protects you from creditor harassment</li>
                </ul>
              </div>

              <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <Scale className="h-5 w-5 text-red-600" />
                <AlertDescription>
                  <strong>Consult an Attorney:</strong> Bankruptcy is a serious legal decision with long-term consequences. 
                  You must consult with a qualified bankruptcy attorney before proceeding.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          <Home className="inline-block h-6 w-6 mr-2 text-secondary" />
          Options to Leave Your Home
        </h2>

        <div className="space-y-8">
          {/* Short Sale */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">1. Short Sale</CardTitle>
              <CardDescription>Sell your home for less than you owe with lender approval</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  A short sale occurs when you sell your home for less than the outstanding mortgage balance, and your lender agrees to 
                  accept the sale proceeds as full or partial satisfaction of the debt. This allows you to avoid foreclosure and move on 
                  with less damage to your credit.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Contact your lender to request approval for a short sale</li>
                  <li>List your home for sale with a real estate agent experienced in short sales</li>
                  <li>Submit all required financial documents to the lender</li>
                  <li>Once you have a buyer, submit the offer to the lender for approval</li>
                  <li>If approved, close the sale and move out</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Timeline:</h4>
                <p className="text-muted-foreground">
                  Short sales can take 3-6 months or longer, as the lender must review and approve the sale. The process can be complex 
                  and requires patience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Less credit damage than foreclosure</li>
                    <li>• Avoid foreclosure on your record</li>
                    <li>• May qualify for relocation assistance</li>
                    <li>• Lender may waive deficiency</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lengthy and complex process</li>
                    <li>• Lender must approve the sale</li>
                    <li>• Still impacts credit score</li>
                    <li>• May owe taxes on forgiven debt</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <DollarSign className="h-5 w-5" />
                <AlertDescription>
                  <strong>Deficiency Note:</strong> Ask your lender if they will waive the deficiency (the difference between what you owe 
                  and the sale price). Get any agreement in writing before closing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Deed in Lieu */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">2. Deed in Lieu of Foreclosure</CardTitle>
              <CardDescription>Voluntarily transfer ownership to the lender to avoid foreclosure</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  A deed in lieu of foreclosure is an agreement where you voluntarily transfer ownership of your home to the lender in 
                  exchange for being released from your mortgage obligation. Essentially, you "give back" the house to avoid foreclosure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You must first attempt to sell the home (often through a short sale)</li>
                  <li>The property must be free of junior liens (second mortgages, HOA liens, tax liens)</li>
                  <li>Lender must agree to accept the deed</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Faster than foreclosure</li>
                    <li>• Less credit damage than foreclosure</li>
                    <li>• May receive relocation assistance</li>
                    <li>• Avoids public foreclosure auction</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Still impacts credit score</li>
                    <li>• Lose your home</li>
                    <li>• May owe taxes on forgiven debt</li>
                    <li>• Not all lenders accept deed in lieu</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sell to EnterActDFW */}
          <Card className="shadow-md border-l-4 border-l-accent">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-xl">3. Sell to a Cash Buyer (EnterActDFW)</CardTitle>
              <CardDescription>Fast, fair cash offer with closing in as little as 7-10 days</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  EnterActDFW is a licensed Texas real estate brokerage that specializes in purchasing homes quickly for cash. 
                  We buy homes in any condition, with no repairs, no commissions, and no hidden fees. This option is ideal if you 
                  need to sell quickly to avoid foreclosure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Contact EnterActDFW for a free, no-obligation consultation</li>
                  <li>We evaluate your property and provide a fair cash offer within 24-48 hours</li>
                  <li>You choose the closing date that works for you</li>
                  <li>We handle all paperwork and closing costs</li>
                  <li>Close in as little as 7-10 days and receive your cash</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Fast closing (7-10 days)</li>
                    <li>• No repairs or cleaning needed</li>
                    <li>• No commissions or fees</li>
                    <li>• Avoid foreclosure on credit</li>
                    <li>• Fair, transparent offers</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Offer may be below retail market value</li>
                    <li>• You still lose your home</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-accent/10 rounded-lg border border-accent/30">
                <h4 className="font-semibold text-foreground mb-3 text-center">Ready to Get a Fair Cash Offer?</h4>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
                    <Link href="/property-value-estimator">
                      <span>Get Free Offer</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call (832) 932-7585
                    </TrackablePhoneLink>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traditional Sale */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">4. Traditional Home Sale</CardTitle>
              <CardDescription>List with a real estate agent and sell on the open market</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Is:</h4>
                <p className="text-muted-foreground">
                  If you have equity in your home and enough time before the foreclosure sale, you may be able to sell your home through 
                  a traditional real estate agent. This typically yields the highest sale price but takes longer.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Timeline:</h4>
                <p className="text-muted-foreground">
                  Traditional home sales typically take 60-90 days or longer, depending on market conditions. You must have enough time 
                  before the foreclosure sale date.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">Pros</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Highest potential sale price</li>
                    <li>• Avoid foreclosure</li>
                    <li>• May walk away with cash</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-foreground mb-2">Cons</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Takes 60-90+ days</li>
                    <li>• Must prepare home for showings</li>
                    <li>• Pay agent commissions (5-6%)</li>
                    <li>• No guarantee of sale before foreclosure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Which Option Is Right for You?</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left font-semibold">Your Situation</th>
                <th className="border border-border p-3 text-left font-semibold">Best Options</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3">Temporary hardship, can afford regular payments now</td>
                <td className="border border-border p-3">Repayment Plan, Forbearance</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border border-border p-3">Permanent income reduction, need lower payments</td>
                <td className="border border-border p-3">Loan Modification</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Need to sell fast (less than 30 days)</td>
                <td className="border border-border p-3">Sell to EnterActDFW (Cash Buyer)</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border border-border p-3">Have equity, have time (60-90 days)</td>
                <td className="border border-border p-3">Traditional Sale</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Owe more than home is worth</td>
                <td className="border border-border p-3">Short Sale, Deed in Lieu</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border border-border p-3">Facing multiple debts, need fresh start</td>
                <td className="border border-border p-3">Chapter 13 Bankruptcy (consult attorney)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Alert className="bg-primary/5 border-primary">
        <Phone className="h-5 w-5 text-primary" />
        <AlertDescription>
          <strong>Need Help Deciding?</strong> Contact a HUD-approved housing counselor for free, unbiased guidance. 
          Call the Homeowner's HOPE Hotline at 1-888-995-HOPE (4673) or visit our <Link href="/resources"><span className="underline cursor-pointer">Resources page</span></Link> for local counselors.
        </AlertDescription>
      </Alert>
    </KnowledgeBaseLayout>
  );
}
