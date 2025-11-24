import { describe, expect, it } from "vitest";
import { calculateSaleOptions } from "./saleOptionsComparison";

describe("Sale Options Comparison", () => {
  describe("High Equity Scenario (>20%)", () => {
    it("should recommend traditional sale for high equity property", () => {
      const propertyValue = 500000;
      const mortgageBalance = 300000; // 40% equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.propertyValue).toBe(500000);
      expect(result.mortgageBalance).toBe(300000);
      expect(result.equity).toBe(200000);
      expect(result.options).toHaveLength(3);
      
      // Traditional sale should be recommended
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      expect(traditionalSale?.recommended).toBe(true);
      
      // Verify traditional sale calculations
      expect(traditionalSale?.grossProceeds).toBe(500000);
      expect(traditionalSale?.costs.agentCommission).toBe(30000); // 6%
      expect(traditionalSale?.costs.closingCosts).toBe(15000); // 3%
      expect(traditionalSale?.costs.repairs).toBe(25000); // 5%
      expect(traditionalSale?.netProceeds).toBeGreaterThan(0);
    });
  });

  describe("Medium Equity Scenario (5-20%)", () => {
    it("should recommend cash offer for medium equity property", () => {
      const propertyValue = 400000;
      const mortgageBalance = 360000; // 10% equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(40000);
      
      // Cash offer should be recommended
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      expect(cashOffer?.recommended).toBe(true);
      
      // Verify cash offer calculations
      expect(cashOffer?.grossProceeds).toBe(340000); // 85% of market value
      expect(cashOffer?.costs.agentCommission).toBe(0); // No commission
      expect(cashOffer?.costs.repairs).toBe(0); // No repairs
      expect(cashOffer?.timelineDays).toBe(8); // Fast closing
    });
  });

  describe("Low/Negative Equity Scenario (<5%)", () => {
    it("should recommend short sale for low equity property", () => {
      const propertyValue = 300000;
      const mortgageBalance = 295000; // 1.67% equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(5000);
      
      // Short sale should be recommended
      const shortSale = result.options.find(opt => opt.type === "short_sale");
      expect(shortSale?.recommended).toBe(true);
      
      // Verify short sale calculations
      expect(shortSale?.grossProceeds).toBe(225000); // 75% of market value
      expect(shortSale?.timelineDays).toBe(135); // Longest timeline
    });

    it("should recommend short sale for underwater property", () => {
      const propertyValue = 250000;
      const mortgageBalance = 280000; // Negative equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(-30000);
      
      // Short sale should be recommended
      const shortSale = result.options.find(opt => opt.type === "short_sale");
      expect(shortSale?.recommended).toBe(true);
    });
  });

  describe("All Options Calculations", () => {
    it("should calculate all three options correctly", () => {
      const propertyValue = 500000;
      const mortgageBalance = 400000;
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      // Should have all three options
      expect(result.options).toHaveLength(3);
      
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      const shortSale = result.options.find(opt => opt.type === "short_sale");
      
      expect(traditionalSale).toBeDefined();
      expect(cashOffer).toBeDefined();
      expect(shortSale).toBeDefined();
      
      // Verify each option has required fields
      [traditionalSale, cashOffer, shortSale].forEach(option => {
        expect(option?.type).toBeDefined();
        expect(option?.name).toBeDefined();
        expect(option?.timeline).toBeDefined();
        expect(option?.timelineDays).toBeGreaterThan(0);
        expect(option?.grossProceeds).toBeGreaterThan(0);
        expect(option?.costs).toBeDefined();
        expect(option?.costs.total).toBeGreaterThanOrEqual(0);
        expect(option?.netProceeds).toBeDefined();
        expect(option?.pros).toBeInstanceOf(Array);
        expect(option?.cons).toBeInstanceOf(Array);
        expect(option?.description).toBeDefined();
      });
    });

    it("should have traditional sale as highest gross proceeds", () => {
      const propertyValue = 500000;
      const mortgageBalance = 300000;
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      const shortSale = result.options.find(opt => opt.type === "short_sale");
      
      // Traditional sale should have highest gross proceeds
      expect(traditionalSale?.grossProceeds).toBeGreaterThan(cashOffer?.grossProceeds || 0);
      expect(traditionalSale?.grossProceeds).toBeGreaterThan(shortSale?.grossProceeds || 0);
    });

    it("should have cash offer as fastest option", () => {
      const propertyValue = 500000;
      const mortgageBalance = 300000;
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      const shortSale = result.options.find(opt => opt.type === "short_sale");
      
      // Cash offer should have shortest timeline
      expect(cashOffer?.timelineDays).toBeLessThan(traditionalSale?.timelineDays || Infinity);
      expect(cashOffer?.timelineDays).toBeLessThan(shortSale?.timelineDays || Infinity);
    });

    it("should have cash offer with lowest costs", () => {
      const propertyValue = 500000;
      const mortgageBalance = 300000;
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      
      // Cash offer should have lowest total costs
      expect(cashOffer?.costs.total).toBeLessThan(traditionalSale?.costs.total || Infinity);
      expect(cashOffer?.costs.agentCommission).toBe(0);
      expect(cashOffer?.costs.repairs).toBe(0);
    });
  });

  describe("Net Proceeds Calculations", () => {
    it("should calculate positive net proceeds for high equity", () => {
      const propertyValue = 600000;
      const mortgageBalance = 200000; // High equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      // All options should have positive net proceeds
      result.options.forEach(option => {
        expect(option.netProceeds).toBeGreaterThan(0);
      });
    });

    it("should calculate negative net proceeds for underwater property", () => {
      const propertyValue = 200000;
      const mortgageBalance = 250000; // Underwater
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      // All options should have negative net proceeds
      result.options.forEach(option => {
        expect(option.netProceeds).toBeLessThan(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero mortgage balance", () => {
      const propertyValue = 500000;
      const mortgageBalance = 0;
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(500000);
      
      // Traditional sale should be recommended for 100% equity
      const traditionalSale = result.options.find(opt => opt.type === "traditional");
      expect(traditionalSale?.recommended).toBe(true);
      
      // All options should have positive net proceeds
      result.options.forEach(option => {
        expect(option.netProceeds).toBeGreaterThan(0);
      });
    });

    it("should handle exactly 20% equity (boundary)", () => {
      const propertyValue = 500000;
      const mortgageBalance = 400000; // Exactly 20% equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(100000);
      // At exactly 20% equity, cash offer is recommended (traditional requires >20%)
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      expect(cashOffer?.recommended).toBe(true);
    });

    it("should handle exactly 5% equity (boundary)", () => {
      const propertyValue = 400000;
      const mortgageBalance = 380000; // Exactly 5% equity
      
      const result = calculateSaleOptions(propertyValue, mortgageBalance);
      
      expect(result.equity).toBe(20000);
      // Should recommend cash offer at 5% equity
      const cashOffer = result.options.find(opt => opt.type === "cash_offer");
      expect(cashOffer?.recommended).toBe(true);
    });
  });
});
