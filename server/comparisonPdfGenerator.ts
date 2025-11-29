/**
 * PDF Generator for Sale Options Comparison Reports
 * Creates personalized PDF reports showing property value estimate and sale options comparison
 */

import PDFDocument from "pdfkit";
import type { SaleOptionsComparison } from "./saleOptionsComparison";

interface PropertyDetails {
  propertyAddress?: string;
  zipCode: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  condition: string;
}

interface ComparisonReportData {
  propertyValue: number;
  propertyDetails: PropertyDetails;
  comparison: SaleOptionsComparison;
  generatedAt: Date;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate PDF buffer for comparison report
 */
export async function generateComparisonPDF(data: ComparisonReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc
        .fontSize(24)
        .fillColor("#1e40af")
        .text("Property Sale Options Comparison", { align: "center" });

      doc
        .fontSize(12)
        .fillColor("#6b7280")
        .text("EnterActDFW - Your Trusted Real Estate Partner", { align: "center" })
        .moveDown(0.5);

      const generatedDate = data.generatedAt.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric"
      });
      const generatedTime = data.generatedAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
      
      doc
        .fontSize(10)
        .fillColor("#9ca3af")
        .text(`Generated: ${generatedDate} at ${generatedTime}`, { align: "center" })
        .moveDown(2);

      // Property Details Section
      doc
        .fontSize(16)
        .fillColor("#1f2937")
        .text("Property Details", { underline: true })
        .moveDown(0.5);

      const details = [
        ...(data.propertyDetails.propertyAddress ? [{ label: "Address", value: data.propertyDetails.propertyAddress }] : []),
        { label: "ZIP Code", value: data.propertyDetails.zipCode },
        { label: "Property Type", value: data.propertyDetails.propertyType },
        { label: "Square Feet", value: data.propertyDetails.squareFeet.toLocaleString() },
        { label: "Bedrooms", value: data.propertyDetails.bedrooms.toString() },
        { label: "Bathrooms", value: data.propertyDetails.bathrooms.toString() },
        { label: "Condition", value: data.propertyDetails.condition },
      ];

      doc.fontSize(11).fillColor("#374151");
      details.forEach((detail) => {
        doc.text(`${detail.label}: `, { continued: true, width: 150 });
        doc.fillColor("#1f2937").text(detail.value, { width: 350 });
        doc.fillColor("#374151").moveDown(0.3);
      });

      doc.moveDown(1);

      // Estimated Value Section
      doc
        .fontSize(16)
        .fillColor("#1f2937")
        .text("Estimated Property Value", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(28)
        .fillColor("#1e40af")
        .text(formatCurrency(data.propertyValue), { align: "center" })
        .moveDown(1.5);

      // Equity Summary
      const equity = data.comparison.equity;
      const equityPercentage = ((equity / data.propertyValue) * 100).toFixed(1);
      
      doc
        .fontSize(14)
        .fillColor("#1f2937")
        .text("Your Equity Position", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .fillColor("#374151")
        .text(`Property Value: ${formatCurrency(data.propertyValue)}`)
        .text(`Mortgage Balance: -${formatCurrency(data.comparison.mortgageBalance)}`)
        .moveDown(0.3);

      doc
        .fontSize(13)
        .fillColor(equity >= 0 ? "#059669" : "#dc2626")
        .text(`Your Equity: ${formatCurrency(equity)} (${equityPercentage}%)`)
        .moveDown(1.5);

      // Sale Options Comparison
      doc
        .fontSize(16)
        .fillColor("#1f2937")
        .text("Sale Options Comparison", { underline: true })
        .moveDown(1);

      // Draw comparison table for each option
      data.comparison.options.forEach((option, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Option header with recommended badge
        if (option.recommended) {
          doc
            .fontSize(14)
            .fillColor("#059669")
            .text("⭐ RECOMMENDED OPTION", { align: "center" })
            .moveDown(0.5);
        }

        doc
          .fontSize(18)
          .fillColor("#1e40af")
          .text(option.name, { align: "center" })
          .moveDown(0.3);

        doc
          .fontSize(10)
          .fillColor("#6b7280")
          .text(option.description, { align: "center" })
          .moveDown(1);

        // Timeline
        doc
          .fontSize(12)
          .fillColor("#1f2937")
          .text("Timeline to Close:", { underline: true })
          .moveDown(0.3);

        doc
          .fontSize(14)
          .fillColor("#1e40af")
          .text(option.timeline)
          .moveDown(1);

        // Costs Breakdown
        doc
          .fontSize(12)
          .fillColor("#1f2937")
          .text("Costs Breakdown:", { underline: true })
          .moveDown(0.5);

        doc.fontSize(10).fillColor("#374151");
        
        if (option.costs.agentCommission > 0) {
          doc.text(`Agent Commission: -${formatCurrency(option.costs.agentCommission)}`);
        }
        if (option.costs.closingCosts > 0) {
          doc.text(`Closing Costs: -${formatCurrency(option.costs.closingCosts)}`);
        }
        if (option.costs.repairs > 0) {
          doc.text(`Repairs/Staging: -${formatCurrency(option.costs.repairs)}`);
        }

        doc.moveDown(0.3);
        doc
          .fontSize(11)
          .fillColor("#dc2626")
          .text(`Total Costs: -${formatCurrency(option.costs.total)}`)
          .moveDown(1);

        // Net Proceeds
        doc
          .fontSize(12)
          .fillColor("#1f2937")
          .text("Your Net Proceeds:", { underline: true })
          .moveDown(0.3);

        doc
          .fontSize(20)
          .fillColor(option.netProceeds >= 0 ? "#059669" : "#dc2626")
          .text(formatCurrency(option.netProceeds))
          .moveDown(1);

        // Pros
        doc
          .fontSize(12)
          .fillColor("#059669")
          .text("✓ Advantages:")
          .moveDown(0.3);

        doc.fontSize(10).fillColor("#374151");
        option.pros.forEach((pro) => {
          doc.text(`• ${pro}`).moveDown(0.2);
        });
        doc.moveDown(0.5);

        // Cons
        doc
          .fontSize(12)
          .fillColor("#dc2626")
          .text("✗ Considerations:")
          .moveDown(0.3);

        doc.fontSize(10).fillColor("#374151");
        option.cons.forEach((con) => {
          doc.text(`• ${con}`).moveDown(0.2);
        });
      });

      // Footer on last page
      doc.addPage();
      doc
        .fontSize(16)
        .fillColor("#1e40af")
        .text("Next Steps", { align: "center", underline: true })
        .moveDown(1);

      doc
        .fontSize(11)
        .fillColor("#374151")
        .text(
          "Every situation is unique. The estimates in this report are based on general market data and should be verified with a professional appraisal.",
          { align: "center" }
        )
        .moveDown(1);

      doc
        .fontSize(13)
        .fillColor("#1f2937")
        .text("Schedule Your Free Consultation", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .fillColor("#374151")
        .text("Felecia Fair - Licensed Texas Real Estate Broker", { align: "center" })
        .text("EnterActDFW", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#1e40af")
        .text("Phone: 832-932-7585", { align: "center", link: "tel:832-932-7585" })
        .text("Email: info@enteractdfw.com", { align: "center", link: "mailto:info@enteractdfw.com" })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .fillColor("#6b7280")
        .text("4400 State Hwy 121, Suite 300", { align: "center" })
        .text("Lewisville, Texas 75056", { align: "center" })
        .moveDown(2);

      doc
        .fontSize(8)
        .fillColor("#9ca3af")
        .text(
          "Disclaimer: This report is for informational purposes only and does not constitute a professional appraisal or financial advice. Property values and sale proceeds are estimates based on general market data and may vary based on specific property features, market conditions, and other factors.",
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
