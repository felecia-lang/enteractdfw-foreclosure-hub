import { useState, useMemo } from "react";
import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import FAQSchema from "@/components/FAQSchema";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "1",
    category: "General",
    question: "How long does the foreclosure process take in Texas?",
    answer: "The foreclosure process in Texas is one of the fastest in the nation. From the time you receive the first Notice of Default to the foreclosure sale, the process can be completed in as little as 41 to 60 days. However, including the federal 120-day delinquency period, the entire process from the first missed payment to the sale typically takes six to seven months.",
  },
  {
    id: "2",
    category: "General",
    question: "Can I stop a foreclosure once it has started?",
    answer: "Yes, in many cases you can stop or delay a foreclosure. The most effective ways include: (1) Reinstating your loan by paying the past-due amount within the 20-day cure period, (2) Filing for bankruptcy, which triggers an automatic stay that temporarily halts the foreclosure, (3) Submitting a complete loss mitigation application at least 37 days before the sale, which legally requires the lender to pause the foreclosure while reviewing your application, or (4) Selling your home before the sale date, either on the open market or to a cash buyer like EnterActDFW.",
  },
  {
    id: "3",
    category: "Financial",
    question: "Will I owe money after a foreclosure?",
    answer: "It depends. If your home sells at the foreclosure auction for less than the total amount you owe (including principal, interest, fees, and costs), the lender may pursue a deficiency judgment against you for the difference. However, lenders must file a lawsuit to obtain this judgment, and they have only two years from the sale date to do so. Many lenders choose not to pursue deficiency judgments due to the time and expense involved.",
  },
  {
    id: "4",
    category: "Financial",
    question: "What happens to my credit after a foreclosure?",
    answer: "A foreclosure will have a significant negative impact on your credit score, typically reducing it by 200 to 400 points. A foreclosure remains on your credit report for seven years from the date of the first missed payment that led to the foreclosure. This can make it difficult to obtain new credit, rent an apartment, or buy another home during that time. However, alternatives like a short sale or deed in lieu of foreclosure are generally less damaging to your credit than a completed foreclosure.",
  },
  {
    id: "5",
    category: "Timeline",
    question: "How much time do I have after receiving a Notice of Default?",
    answer: "In Texas, you have at least 20 days from the date you receive the Notice of Default to reinstate your loan by paying the past-due amount. For FHA, VA, and home equity loans, this period is typically extended to 30 days. It is critical to act quickly during this window.",
  },
  {
    id: "6",
    category: "Timeline",
    question: "When does the foreclosure process officially start?",
    answer: "Under federal law, a mortgage servicer cannot begin foreclosure proceedings until your loan is more than 120 days delinquent. This means you must have missed at least four monthly payments. After this 120-day period, the lender can send the Notice of Default, which officially starts the foreclosure timeline.",
  },
  {
    id: "7",
    category: "Timeline",
    question: "When is the foreclosure sale held?",
    answer: "In Texas, foreclosure sales are held on the first Tuesday of every month at the county courthouse. The sale must occur between the hours of 10:00 AM and 4:00 PM. The lender must provide at least 21 days' notice before the sale date.",
  },
  {
    id: "8",
    category: "Rights",
    question: "What is the 'right to reinstate,' and how does it work?",
    answer: "The right to reinstate allows you to stop the foreclosure by paying the total past-due amount (not the entire loan balance) to bring your mortgage current. In Texas, you have at least 20 days after receiving the Notice of Default to exercise this right. The reinstatement amount includes all missed payments, late fees, and any costs the lender has incurred in the foreclosure process.",
  },
  {
    id: "9",
    category: "Rights",
    question: "Do I have a 'redemption period' after the foreclosure sale?",
    answer: "For standard mortgage foreclosures in Texas, no, you do not have a right of redemption. This means you cannot buy back your home after it has been sold at auction. The right of redemption only applies in very specific situations, such as foreclosures for unpaid property taxes or HOA assessments.",
  },
  {
    id: "10",
    category: "Rights",
    question: "What is loss mitigation, and how can it help me?",
    answer: "Loss mitigation is the process of working with your lender to find an alternative to foreclosure. Common loss mitigation options include loan modifications, repayment plans, forbearance agreements, short sales, and deeds in lieu of foreclosure. If you submit a complete loss mitigation application at least 37 days before a scheduled foreclosure sale, the lender must stop the foreclosure process while they review your application.",
  },
  {
    id: "11",
    category: "Options",
    question: "Can I sell my home during the foreclosure process?",
    answer: "Yes, you can sell your home at any time before the foreclosure sale. If you have equity in the home, selling it can allow you to pay off the mortgage and avoid a foreclosure on your credit record. If you owe more than the home is worth, you may need to pursue a short sale, which requires lender approval. EnterActDFW specializes in fast cash purchases and can often close in as little as 7-10 days, helping you avoid the auction.",
  },
  {
    id: "12",
    category: "Financial",
    question: "What is a deficiency judgment, and can I be sued for one?",
    answer: "A deficiency judgment is a court order that allows a lender to collect the remaining balance of a loan if the foreclosure sale price is less than the total amount owed. In Texas, lenders must file a lawsuit within two years of the foreclosure sale to obtain a deficiency judgment. You have the right to request that the court determine the fair market value of the property, which can reduce the deficiency amount.",
  },
  {
    id: "13",
    category: "Financial",
    question: "Can I get money back if my home sells for more than I owe?",
    answer: "Yes. If the foreclosure sale results in surplus funds (the sale price exceeds the total debt), you are entitled to claim that excess money after any junior liens are paid. You have two years from the sale date to claim surplus funds.",
  },
  {
    id: "14",
    category: "Financial",
    question: "What are the tax implications of foreclosure?",
    answer: "Foreclosure can have significant tax consequences. If the lender forgives a deficiency (the amount you still owe after the sale), the IRS may consider that forgiven debt as taxable income. However, certain exclusions and exceptions may apply, such as the Mortgage Forgiveness Debt Relief Act (though its availability changes over time). You should consult with a tax professional to understand your specific situation.",
  },
  {
    id: "15",
    category: "Options",
    question: "How quickly can EnterActDFW buy my home?",
    answer: "We understand that time is often critical when facing foreclosure. EnterActDFW can provide a fair cash offer within 24 to 48 hours of evaluating your property. We can close on your timeline, and in many cases, we can complete the sale in as little as 7 to 10 days. We can also work with you to schedule a closing date that fits your needs.",
  },
  {
    id: "16",
    category: "Options",
    question: "Will EnterActDFW pay a fair price for my home?",
    answer: "Yes. Fairness and transparency are core values at EnterActDFW. We provide a detailed explanation of how we arrive at our offer, including the estimated after-repair value, repair costs, and our operating expenses. Our goal is to provide you with a solution that is fair, honest, and allows you to move forward with dignity.",
  },
  {
    id: "17",
    category: "Options",
    question: "Do I have to pay commissions or fees if I sell to EnterActDFW?",
    answer: "No. There are no commissions, no closing costs, and no hidden fees when you sell your home to EnterActDFW. The cash offer we present is the amount you will receive at closing.",
  },
  {
    id: "18",
    category: "Options",
    question: "What if I'm 'underwater' on my mortgage (I owe more than the home is worth)?",
    answer: "If you owe more than your home is worth, we can still help. Depending on your situation, we may be able to work with your lender to facilitate a short sale, where the lender agrees to accept less than the full loan balance. We have experience navigating these transactions and can guide you through the process.",
  },
  {
    id: "19",
    category: "General",
    question: "Is there any obligation if I contact EnterActDFW?",
    answer: "Absolutely not. Our initial consultation is completely free and no-obligation. We are here to provide you with information and options. There is no pressure to accept our offer, and we respect whatever decision is best for you and your family.",
  },
  {
    id: "20",
    category: "Timeline",
    question: "Can I stay in my home during the foreclosure process?",
    answer: "Yes. You do not have to move out on the foreclosure sale date. After the sale, the new owner (whether it is the lender or a third-party buyer) must go through the legal eviction process to remove you from the property. This typically involves serving you with a 'notice to vacate,' which usually gives you three days to leave voluntarily. If you do not leave, the new owner must file an eviction lawsuit.",
  },
  {
    id: "21",
    category: "Financial",
    question: "How long will a foreclosure affect my credit, and can I buy another home?",
    answer: "A foreclosure remains on your credit report for seven years. However, its impact on your credit score diminishes over time, especially if you rebuild your credit responsibly. Many lenders require a waiting period of three to seven years after a foreclosure before you can qualify for a new mortgage, depending on the loan type and your financial recovery.",
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  // Prepare FAQ data for schema markup
  const faqSchemaData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats = new Set(filteredFaqs.map((faq) => faq.category));
    return Array.from(cats);
  }, [filteredFaqs]);

  return (
    <>
      <FAQSchema faqs={faqSchemaData} />
      <KnowledgeBaseLayout
        title="Frequently Asked Questions"
        description="Answers to the most common questions about foreclosure in Texas, your rights, and working with EnterActDFW."
      >
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {categories.map((category) => {
        const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category);
        if (categoryFaqs.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">{category} Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {categoryFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );
      })}

      {filteredFaqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No FAQs found matching your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline mt-2"
          >
            Clear search
          </button>
        </div>
      )}
    </KnowledgeBaseLayout>
    </>
  );
}
