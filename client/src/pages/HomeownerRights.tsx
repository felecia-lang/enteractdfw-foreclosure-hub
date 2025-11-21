import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Scale, FileText, AlertCircle, CheckCircle2, Home, Phone } from "lucide-react";

export default function HomeownerRights() {
  return (
    <KnowledgeBaseLayout
      title="Your Rights as a Homeowner"
      description="Understand your federal and Texas-specific legal rights and protections during the foreclosure process."
    >
      <Alert className="mb-8 bg-primary/5 border-primary">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription>
          <strong>Know Your Rights:</strong> Federal and Texas laws provide important protections for homeowners 
          facing foreclosure. Understanding these rights can help you make informed decisions and protect yourself 
          from unfair practices.
        </AlertDescription>
      </Alert>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <Scale className="inline-block h-6 w-6 mr-2 text-primary" />
          Federal Homeowner Protections
        </h2>
        <p className="text-muted-foreground mb-6">
          Several federal laws protect homeowners facing foreclosure, regardless of which state you live in. 
          These protections apply to most residential mortgages.
        </p>

        <div className="space-y-6">
          {/* 120-Day Rule */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                120-Day Delinquency Requirement
              </CardTitle>
              <CardDescription>Federal law prohibits foreclosure before 120 days of delinquency</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  Under the federal Regulation X (RESPA), mortgage servicers cannot start foreclosure proceedings 
                  until your loan is more than 120 days delinquent. This means you must have missed at least four 
                  monthly payments before the lender can send a Notice of Default or file a foreclosure lawsuit.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Why It Matters:</h4>
                <p className="text-muted-foreground">
                  This 120-day period gives you time to explore loss mitigation options, apply for loan modifications, 
                  or seek housing counseling before foreclosure begins. Use this time wisely.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 12 CFR § 1024.41(f) - Prohibition on foreclosure referral
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Loss Mitigation Application */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Right to Apply for Loss Mitigation
              </CardTitle>
              <CardDescription>Servicers must review your application for foreclosure alternatives</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  You have the right to submit a loss mitigation application to your mortgage servicer at any time. 
                  Loss mitigation includes options like loan modifications, repayment plans, forbearance, short sales, 
                  and deeds in lieu of foreclosure.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Key Protections:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong>37-Day Rule:</strong> If you submit a complete loss mitigation application at least 37 days 
                    before a scheduled foreclosure sale, the servicer must stop the foreclosure while they review your application.
                  </li>
                  <li>
                    <strong>Review Period:</strong> The servicer has 30 days to review your complete application and notify 
                    you whether you've been approved, denied, or offered an alternative option.
                  </li>
                  <li>
                    <strong>Appeal Rights:</strong> If you're denied, you have 14 days to appeal the decision.
                  </li>
                </ul>
              </div>
              <Alert>
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  <strong>Important:</strong> A "complete" application means you've submitted all required documents 
                  (pay stubs, bank statements, tax returns, hardship letter, etc.). Incomplete applications don't trigger 
                  the same protections.
                </AlertDescription>
              </Alert>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 12 CFR § 1024.41 - Loss mitigation procedures
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dual Tracking Prohibition */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Prohibition on "Dual Tracking"
              </CardTitle>
              <CardDescription>Servicers cannot foreclose while reviewing your loss mitigation application</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  "Dual tracking" refers to the practice of moving forward with foreclosure while simultaneously reviewing 
                  a homeowner's loss mitigation application. Federal law prohibits this practice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Your Protection:</h4>
                <p className="text-muted-foreground mb-3">
                  If you submit a complete loss mitigation application at least 37 days before a foreclosure sale, 
                  the servicer must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Stop the foreclosure process</li>
                  <li>Review your application in good faith</li>
                  <li>Not schedule or conduct a foreclosure sale until they've made a decision on your application</li>
                  <li>Give you time to appeal if you're denied</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 12 CFR § 1024.41(g) - Prohibition on foreclosure sale
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right to Information */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Right to Information and Communication
              </CardTitle>
              <CardDescription>Servicers must provide clear, timely information about your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What You're Entitled To:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong>Early Intervention:</strong> If you're delinquent, the servicer must contact you (or try to) 
                    by the 36th day of delinquency to discuss loss mitigation options.
                  </li>
                  <li>
                    <strong>Written Notice:</strong> By the 45th day of delinquency, the servicer must send you a written 
                    notice explaining available loss mitigation options and how to apply.
                  </li>
                  <li>
                    <strong>Account Statements:</strong> You have the right to request information about your account, 
                    including payment history, escrow balances, and fees.
                  </li>
                  <li>
                    <strong>Error Resolution:</strong> If you believe there's an error on your account, you can submit 
                    a written notice of error, and the servicer must investigate and respond within 30-45 days.
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 12 CFR § 1024.39 (Early intervention), § 1024.35 (Error resolution)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FDCPA Protections */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Fair Debt Collection Practices Act (FDCPA)
              </CardTitle>
              <CardDescription>Protection from abusive debt collection practices</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Covers:</h4>
                <p className="text-muted-foreground mb-3">
                  If a third-party debt collector is attempting to collect your mortgage debt, they must follow the FDCPA. 
                  This law prohibits:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Calling you before 8 AM or after 9 PM</li>
                  <li>Calling you at work if you've told them not to</li>
                  <li>Harassing, threatening, or using abusive language</li>
                  <li>Lying about the amount you owe or their legal authority</li>
                  <li>Contacting third parties (like your employer or neighbors) about your debt</li>
                  <li>Continuing to contact you after you've requested they stop (in writing)</li>
                </ul>
              </div>
              <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertDescription>
                  <strong>Note:</strong> The FDCPA typically applies to third-party debt collectors, not to your original 
                  mortgage servicer. However, some protections may still apply depending on the situation.
                </AlertDescription>
              </Alert>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 15 U.S.C. § 1692 et seq.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Servicemembers Civil Relief Act */}
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Servicemembers Civil Relief Act (SCRA)
              </CardTitle>
              <CardDescription>Special protections for active-duty military members</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Covers:</h4>
                <p className="text-muted-foreground mb-3">
                  If you're on active military duty, the SCRA provides additional foreclosure protections:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Lenders cannot foreclose on your home without a court order while you're on active duty or within 
                    one year after your service ends (for mortgages originated before your service began).
                  </li>
                  <li>You may be entitled to a reduced interest rate (6% cap) on debts incurred before active duty.</li>
                  <li>You can request a stay (postponement) of foreclosure proceedings.</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> 50 U.S.C. § 3953
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <Home className="inline-block h-6 w-6 mr-2 text-primary" />
          Texas-Specific Homeowner Rights
        </h2>
        <p className="text-muted-foreground mb-6">
          In addition to federal protections, Texas law provides specific rights and procedures for homeowners 
          facing foreclosure.
        </p>

        <div className="space-y-6">
          {/* Right to Reinstate */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Right to Reinstate Your Loan</CardTitle>
              <CardDescription>Pay the past-due amount to stop foreclosure</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  Texas law gives you the right to "reinstate" your loan by paying the total past-due amount (not the 
                  entire loan balance) to bring your mortgage current and stop the foreclosure. You have at least 20 days 
                  after receiving the Notice of Default to exercise this right.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What You Must Pay:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All missed mortgage payments</li>
                  <li>Late fees and penalties</li>
                  <li>Costs the lender has incurred (such as attorney fees and posting costs)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Extended Periods for Certain Loans:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>FHA loans:</strong> 30 days to reinstate</li>
                  <li><strong>VA loans:</strong> 30 days to reinstate</li>
                  <li><strong>Home equity loans:</strong> 30 days to reinstate</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.002(d)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notice Requirements */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Strict Notice Requirements</CardTitle>
              <CardDescription>Lenders must follow specific notice procedures</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Notice of Default (Acceleration Notice):</h4>
                <p className="text-muted-foreground mb-3">
                  Before foreclosing, the lender must send you a formal Notice of Default that includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>The specific amount you owe to cure the default</li>
                  <li>A deadline (at least 20 days) by which you can reinstate the loan</li>
                  <li>Information about your right to reinstate</li>
                  <li>The notice must be sent by certified mail</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Notice of Sale:</h4>
                <p className="text-muted-foreground mb-3">
                  At least 21 days before the foreclosure sale, the lender must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Mail you a copy of the Notice of Sale by certified mail</li>
                  <li>Post the Notice of Sale at the county courthouse</li>
                  <li>File the Notice of Sale with the county clerk</li>
                </ul>
              </div>
              <Alert>
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  <strong>Important:</strong> If the lender fails to follow these notice requirements correctly, 
                  the foreclosure may be invalid. Consult with an attorney if you believe proper notice was not given.
                </AlertDescription>
              </Alert>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.002
                </p>
              </div>
            </CardContent>
          </Card>

          {/* First Tuesday Rule */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Foreclosure Sale Timing and Location</CardTitle>
              <CardDescription>Sales must occur on the first Tuesday of the month at the courthouse</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Texas "First Tuesday" Rule:</h4>
                <p className="text-muted-foreground mb-3">
                  In Texas, foreclosure sales must occur:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>On the <strong>first Tuesday of the month</strong></li>
                  <li>Between <strong>10:00 AM and 4:00 PM</strong></li>
                  <li>At the <strong>county courthouse</strong> where the property is located</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Why This Matters:</h4>
                <p className="text-muted-foreground">
                  This predictable schedule gives you a clear timeline to work with. If you receive a Notice of Sale 
                  dated for a specific first Tuesday, you know exactly how much time you have to explore your options, 
                  apply for loss mitigation, or sell your home.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.002(a)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* No Right of Redemption */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">No Right of Redemption (for Most Mortgages)</CardTitle>
              <CardDescription>You cannot buy back your home after the foreclosure sale</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  Unlike some states, Texas does not provide a "right of redemption" for standard mortgage foreclosures. 
                  This means once your home is sold at the foreclosure auction, you cannot buy it back, even if you later 
                  come up with the money.
                </p>
              </div>
              <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription>
                  <strong>Act Before the Sale:</strong> Because there is no right of redemption, it is critical to take 
                  action before the foreclosure sale date. Once the sale occurs, you will lose your home permanently.
                </AlertDescription>
              </Alert>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Exceptions:</h4>
                <p className="text-muted-foreground mb-2">
                  A right of redemption does exist for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Property tax foreclosures (2-year redemption period)</li>
                  <li>HOA lien foreclosures (180-day redemption period)</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.009
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Surplus Funds */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Right to Surplus Funds</CardTitle>
              <CardDescription>You may be entitled to excess proceeds from the foreclosure sale</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  If your home sells at the foreclosure auction for more than the total amount you owe (including principal, 
                  interest, fees, and costs), you are entitled to the surplus funds after any junior liens (second mortgages, 
                  HOA liens, etc.) are paid.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">How to Claim:</h4>
                <p className="text-muted-foreground mb-3">
                  You have two years from the foreclosure sale date to claim surplus funds. The process typically involves:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Filing a claim with the county court</li>
                  <li>Providing proof of your ownership and entitlement</li>
                  <li>Attending a hearing if there are competing claims</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.003
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deficiency Judgment Protections */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Deficiency Judgment Protections</CardTitle>
              <CardDescription>Limits on what lenders can collect after foreclosure</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  If your home sells at foreclosure for less than what you owe, the lender may seek a "deficiency judgment" 
                  to collect the remaining balance. However, Texas law provides some protections.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Your Rights:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong>Two-Year Limit:</strong> The lender must file a lawsuit for a deficiency judgment within two 
                    years of the foreclosure sale.
                  </li>
                  <li>
                    <strong>Fair Market Value Defense:</strong> You have the right to request that the court determine the 
                    fair market value of the property at the time of sale. The deficiency is calculated based on fair market 
                    value, not the actual sale price, which can reduce the amount you owe.
                  </li>
                  <li>
                    <strong>Home Equity Loans:</strong> For home equity loans (as defined by the Texas Constitution), 
                    lenders cannot pursue a deficiency judgment at all.
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Property Code § 51.003, § 51.005
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Homestead Exemption */}
          <Card className="shadow-md border-l-4 border-l-secondary">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-xl">Texas Homestead Exemption</CardTitle>
              <CardDescription>Strong protections for your primary residence</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What It Means:</h4>
                <p className="text-muted-foreground">
                  Texas has one of the strongest homestead exemptions in the nation. Your homestead (primary residence) 
                  is protected from most creditors, except for:
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Liens That Can Foreclose on Your Homestead:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Purchase money mortgages (the loan you used to buy the home)</li>
                  <li>Home equity loans (if properly structured under Texas law)</li>
                  <li>Property tax liens</li>
                  <li>HOA assessment liens</li>
                  <li>Mechanic's and materialmen's liens (for work done on the property)</li>
                  <li>Reverse mortgages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What Cannot Foreclose:</h4>
                <p className="text-muted-foreground">
                  Credit card debt, medical bills, personal loans, and most other unsecured debts cannot result in 
                  foreclosure on your Texas homestead.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Citation:</strong> Texas Constitution Article XVI, § 50
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">What Your Lender CANNOT Do</h2>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Understanding what your lender or servicer cannot legally do is just as important as knowing your rights. 
              The following practices are prohibited:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Prohibited Actions
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✗ Start foreclosure before 120 days of delinquency</li>
                  <li>✗ Foreclose while reviewing a timely loss mitigation application</li>
                  <li>✗ Fail to provide required notices</li>
                  <li>✗ Conduct the sale on any day other than the first Tuesday</li>
                  <li>✗ Harass or threaten you</li>
                  <li>✗ Lock you out of your home before the eviction process</li>
                  <li>✗ Charge excessive or unauthorized fees</li>
                  <li>✗ Ignore your requests for information or error resolution</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  If Your Rights Are Violated
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Document everything in writing</li>
                  <li>✓ File a complaint with the CFPB (1-855-411-2372)</li>
                  <li>✓ Contact the Texas Attorney General's office</li>
                  <li>✓ Consult with a foreclosure defense attorney</li>
                  <li>✓ Consider filing a lawsuit for damages</li>
                  <li>✓ Report violations to HUD if applicable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Alert className="bg-primary/5 border-primary">
        <Phone className="h-5 w-5 text-primary" />
        <AlertDescription>
          <strong>Need Legal Advice?</strong> This information is educational and not a substitute for legal counsel. 
          If you believe your rights have been violated or need help understanding your specific situation, consult with 
          a qualified foreclosure defense attorney or contact a HUD-approved housing counselor at 1-888-995-HOPE (4673).
        </AlertDescription>
      </Alert>
    </KnowledgeBaseLayout>
  );
}
