/**
 * Sale Options Comparison Calculator
 * Compares Traditional Sale, Cash Offer, and Short Sale options
 */

export interface SaleOption {
  type: "traditional" | "cash_offer" | "short_sale";
  name: string;
  timeline: string;
  timelineDays: number;
  grossProceeds: number;
  costs: {
    agentCommission: number;
    closingCosts: number;
    repairs: number;
    total: number;
  };
  netProceeds: number;
  pros: string[];
  cons: string[];
  recommended: boolean;
  description: string;
}

export interface SaleOptionsComparison {
  propertyValue: number;
  mortgageBalance: number;
  equity: number;
  options: SaleOption[];
}

/**
 * Calculate comparison of all sale options
 */
export function calculateSaleOptions(
  propertyValue: number,
  mortgageBalance: number
): SaleOptionsComparison {
  const equity = propertyValue - mortgageBalance;
  const equityPercentage = (equity / propertyValue) * 100;

  // Traditional Sale
  const traditionalAgentFee = propertyValue * 0.06; // 6% agent commission
  const traditionalClosingCosts = propertyValue * 0.03; // 3% closing costs
  const traditionalRepairs = propertyValue * 0.05; // 5% for repairs/staging
  const traditionalTotalCosts = traditionalAgentFee + traditionalClosingCosts + traditionalRepairs;
  const traditionalNetProceeds = propertyValue - mortgageBalance - traditionalTotalCosts;

  const traditionalSale: SaleOption = {
    type: "traditional",
    name: "Traditional Sale",
    timeline: "60-90 days",
    timelineDays: 75,
    grossProceeds: propertyValue,
    costs: {
      agentCommission: traditionalAgentFee,
      closingCosts: traditionalClosingCosts,
      repairs: traditionalRepairs,
      total: traditionalTotalCosts,
    },
    netProceeds: traditionalNetProceeds,
    pros: [
      "Highest potential sale price",
      "Market-rate value",
      "Multiple buyer competition",
      "Standard process",
    ],
    cons: [
      "Longest timeline (60-90 days)",
      "High costs (14% of value)",
      "Requires repairs and staging",
      "Showings and open houses",
      "Deal may fall through",
    ],
    recommended: equityPercentage > 20,
    description: "List with a real estate agent on the open market for maximum value.",
  };

  // Cash Offer (EnterActDFW)
  const cashOfferPrice = propertyValue * 0.85; // 85% of market value (typical cash offer)
  const cashOfferClosingCosts = cashOfferPrice * 0.02; // 2% closing costs (seller pays less)
  const cashOfferRepairs = 0; // No repairs needed
  const cashOfferTotalCosts = cashOfferClosingCosts;
  const cashOfferNetProceeds = cashOfferPrice - mortgageBalance - cashOfferTotalCosts;

  const cashOffer: SaleOption = {
    type: "cash_offer",
    name: "Cash Offer (EnterActDFW)",
    timeline: "7-10 days",
    timelineDays: 8,
    grossProceeds: cashOfferPrice,
    costs: {
      agentCommission: 0,
      closingCosts: cashOfferClosingCosts,
      repairs: cashOfferRepairs,
      total: cashOfferTotalCosts,
    },
    netProceeds: cashOfferNetProceeds,
    pros: [
      "Fastest option (7-10 days)",
      "No repairs needed",
      "No showings or staging",
      "Guaranteed close",
      "Avoid foreclosure quickly",
      "Minimal closing costs",
    ],
    cons: [
      "Lower sale price (85% of value)",
      "Less than market value",
    ],
    recommended: equityPercentage >= 5 && equityPercentage <= 20,
    description: "Sell directly to EnterActDFW for a fast, guaranteed cash offer with no repairs.",
  };

  // Short Sale
  const shortSalePrice = propertyValue * 0.75; // 75% of market value (typical short sale)
  const shortSaleAgentFee = shortSalePrice * 0.06; // 6% agent commission (paid by lender)
  const shortSaleClosingCosts = shortSalePrice * 0.02; // 2% closing costs
  const shortSaleRepairs = 0; // Sold as-is
  const shortSaleTotalCosts = shortSaleAgentFee + shortSaleClosingCosts;
  const shortSaleNetProceeds = shortSalePrice - mortgageBalance - shortSaleTotalCosts;

  const shortSale: SaleOption = {
    type: "short_sale",
    name: "Short Sale",
    timeline: "90-180 days",
    timelineDays: 135,
    grossProceeds: shortSalePrice,
    costs: {
      agentCommission: shortSaleAgentFee,
      closingCosts: shortSaleClosingCosts,
      repairs: shortSaleRepairs,
      total: shortSaleTotalCosts,
    },
    netProceeds: shortSaleNetProceeds,
    pros: [
      "Avoid foreclosure",
      "Less credit damage than foreclosure",
      "Lender forgives remaining balance",
      "Sold as-is (no repairs)",
    ],
    cons: [
      "Longest timeline (90-180 days)",
      "Requires lender approval",
      "Below market value (75%)",
      "Complex negotiation process",
      "May still owe deficiency",
      "Credit score impact",
    ],
    recommended: equityPercentage < 5,
    description: "Sell for less than owed with lender approval to avoid foreclosure.",
  };

  return {
    propertyValue,
    mortgageBalance,
    equity,
    options: [traditionalSale, cashOffer, shortSale],
  };
}
