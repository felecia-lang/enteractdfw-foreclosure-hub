import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock, FileText, Home } from "lucide-react";

export default function UnderstandingForeclosure() {
  return (
    <KnowledgeBaseLayout
      title="Understanding Foreclosure in Texas"
      description="Learn the basics of the foreclosure process, key terms, timelines, and what makes Texas different from other states."
    >
      <Alert className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription>
          <strong>Important:</strong> Texas has one of the fastest foreclosure processes in the nation. 
          Understanding the timeline and your rights is critical to protecting your home.
        </AlertDescription>
      </Alert>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">What Is Foreclosure?</h2>
        <p className="text-muted-foreground mb-4">
          Foreclosure is the legal process by which a lender takes possession of a property and sells it to recover 
          the balance of a loan when the borrower has defaulted (failed to make payments). In Texas, foreclosure is 
          typically a non-judicial process, meaning the lender does not need to go to court to foreclose on your home.
        </p>
        <p className="text-muted-foreground mb-4">
          When you take out a mortgage in Texas, you sign a <strong>deed of trust</strong> that gives the lender a 
          security interest in your property. This deed includes a "power of sale" clause that allows the lender to 
          sell your home at a public auction if you default on the loan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">The Texas Foreclosure Process (3 Steps)</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <CardTitle>Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You miss one or more mortgage payments. Under federal law, the lender cannot begin foreclosure 
                proceedings until your loan is more than 120 days delinquent (approximately 4 missed payments).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <CardTitle>Notice of Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The lender sends you a formal Notice of Default, giving you at least 20 days to cure the default 
                by paying the past-due amount. This notice must be sent by certified mail.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <CardTitle>Foreclosure Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you do not cure the default, the lender schedules a foreclosure sale. The sale must occur on the 
                first Tuesday of the month at the county courthouse, with at least 21 days' notice.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <Clock className="inline-block h-6 w-6 mr-2 text-primary" />
          Texas Foreclosure Timeline
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left font-semibold">Stage</th>
                <th className="border border-border p-3 text-left font-semibold">Timeline</th>
                <th className="border border-border p-3 text-left font-semibold">What Happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3">First Missed Payment</td>
                <td className="border border-border p-3">Day 1</td>
                <td className="border border-border p-3">Your loan becomes delinquent. Late fees may apply.</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border border-border p-3">Federal Protection Period</td>
                <td className="border border-border p-3">Days 1-120</td>
                <td className="border border-border p-3">Lender cannot start foreclosure. You can apply for loss mitigation.</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Notice of Default Sent</td>
                <td className="border border-border p-3">Day 121+</td>
                <td className="border border-border p-3">Lender sends formal notice. You have at least 20 days to cure.</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border border-border p-3">Notice of Sale Posted</td>
                <td className="border border-border p-3">Day 141+</td>
                <td className="border border-border p-3">Lender posts notice at courthouse and mails you a copy (21 days before sale).</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Foreclosure Sale</td>
                <td className="border border-border p-3">Day 162+</td>
                <td className="border border-border p-3">Property sold at public auction on first Tuesday of the month.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          <strong>Note:</strong> The entire process from the first missed payment to the foreclosure sale typically 
          takes 6-7 months, but can be as fast as 5 months in Texas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Types of Foreclosure in Texas</h2>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Non-Judicial Foreclosure (Most Common)</CardTitle>
            <CardDescription>Also called "power of sale" foreclosure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              This is the standard foreclosure process in Texas for most conventional mortgages. The lender does not 
              need to file a lawsuit or obtain a court judgment. The process is governed by the "power of sale" clause 
              in your deed of trust.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Fastest foreclosure process</li>
              <li>No court involvement required</li>
              <li>Lender must follow strict notice requirements</li>
              <li>Sale occurs at county courthouse on first Tuesday of the month</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Judicial Foreclosure (Rare)</CardTitle>
            <CardDescription>Requires a court order</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              In rare cases, a lender may choose to foreclose through the court system. This process is slower and 
              more expensive for the lender, so it is uncommon in Texas.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Lender files a lawsuit</li>
              <li>Court issues a judgment and orders the sale</li>
              <li>Takes longer than non-judicial foreclosure</li>
              <li>May be used if the deed of trust is unclear or missing</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expedited Foreclosure (Quasi-Judicial)</CardTitle>
            <CardDescription>Required for certain loan types</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Texas law requires a court order for foreclosures on home equity loans, reverse mortgages, and certain 
              HOA liens. This process is faster than a full judicial foreclosure but still requires court approval.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Required for home equity loans and reverse mortgages</li>
              <li>Lender files a motion for expedited foreclosure</li>
              <li>Court hearing typically within 10-20 days</li>
              <li>If approved, sale proceeds like non-judicial foreclosure</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Key Terms to Know</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Failure to meet the terms of your mortgage agreement, most commonly by not making required monthly payments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deed of Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A legal document that gives the lender a security interest in your property and includes a "power of sale" clause.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notice of Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A formal written notice informing you that you have defaulted and that foreclosure proceedings may begin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notice of Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A public notice that your property will be sold at a foreclosure auction on a specific date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redemption Period</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                In Texas, there is NO right of redemption for standard mortgage foreclosures. You cannot buy back your home after the sale.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deficiency Judgment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A court order allowing the lender to collect the remaining balance if the foreclosure sale price is less than what you owe.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Alert className="bg-primary/5 border-primary">
        <FileText className="h-5 w-5 text-primary" />
        <AlertDescription>
          <strong>Next Steps:</strong> Now that you understand the foreclosure process, learn about your rights as a homeowner 
          and the options available to help you avoid foreclosure.
        </AlertDescription>
      </Alert>
    </KnowledgeBaseLayout>
  );
}
