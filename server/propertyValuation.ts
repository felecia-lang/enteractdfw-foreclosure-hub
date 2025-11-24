/**
 * Property Valuation Calculator
 * Estimates market value based on property details and DFW market data
 */

// DFW ZIP code price per square foot data (approximate 2024 values)
// Source: Based on typical DFW metro area real estate market data
const DFW_ZIP_PRICE_DATA: Record<string, number> = {
  // Dallas - Premium areas
  "75201": 350, "75202": 320, "75204": 280, "75205": 400, "75206": 350,
  "75209": 380, "75214": 300, "75218": 220, "75219": 320, "75225": 420,
  "75226": 250, "75230": 340, "75231": 280, "75235": 260, "75240": 300,
  
  // Dallas - Mid-range areas
  "75115": 180, "75116": 170, "75134": 160, "75137": 150, "75141": 155,
  "75146": 165, "75149": 170, "75150": 175, "75154": 160, "75159": 165,
  "75180": 190, "75181": 185, "75182": 180, "75211": 160, "75212": 170,
  "75216": 175, "75217": 165, "75220": 200, "75223": 185, "75224": 170,
  "75227": 160, "75228": 175, "75232": 180, "75233": 165, "75234": 210,
  "75236": 170, "75237": 155, "75238": 195, "75241": 165, "75243": 200,
  "75244": 220, "75246": 210, "75247": 190, "75248": 230, "75249": 200,
  
  // Fort Worth areas
  "76001": 180, "76002": 175, "76006": 185, "76008": 170, "76010": 165,
  "76011": 175, "76012": 180, "76013": 185, "76014": 170, "76015": 175,
  "76016": 180, "76017": 190, "76018": 185, "76020": 165, "76021": 170,
  "76028": 175, "76034": 180, "76036": 175, "76039": 170, "76040": 185,
  "76051": 180, "76052": 175, "76053": 170, "76054": 190, "76058": 185,
  "76060": 175, "76063": 180, "76065": 175, "76092": 200, "76102": 220,
  "76103": 180, "76104": 170, "76105": 175, "76106": 180, "76107": 210,
  "76108": 185, "76109": 195, "76110": 175, "76111": 170, "76112": 165,
  "76114": 180, "76115": 175, "76116": 170, "76117": 185, "76118": 190,
  "76119": 165, "76120": 170, "76123": 185, "76126": 180, "76127": 190,
  "76131": 185, "76132": 180, "76133": 175, "76134": 170, "76135": 175,
  "76137": 195, "76140": 180, "76148": 200, "76155": 185, "76177": 190,
  "76179": 195, "76180": 200, "76182": 185,
  
  // Plano/Frisco/McKinney - Premium suburbs
  "75002": 280, "75023": 300, "75024": 320, "75025": 310, "75034": 290,
  "75035": 280, "75069": 310, "75070": 295, "75071": 285, "75072": 300,
  "75074": 290, "75075": 305, "75078": 295, "75093": 285, "75094": 300,
  
  // Irving/Carrollton/Farmers Branch
  "75006": 210, "75007": 215, "75010": 220, "75038": 205, "75039": 210,
  "75040": 215, "75041": 205, "75042": 210, "75043": 215, "75044": 220,
  "75050": 210, "75051": 205, "75056": 215, "75060": 210, "75061": 215,
  "75062": 220, "75063": 210, "75080": 215, "75081": 220, "75082": 210,
  
  // Arlington/Grand Prairie (additional areas)
  "75052": 185, "75054": 190,
  
  // Default fallback for unlisted ZIP codes
  "default": 185,
};

// Property type multipliers
const PROPERTY_TYPE_MULTIPLIERS = {
  "single_family": 1.0,
  "condo": 0.85,
  "townhouse": 0.90,
  "multi_family": 0.95,
};

// Condition adjustments (percentage)
const CONDITION_ADJUSTMENTS = {
  "excellent": 1.15,  // +15%
  "good": 1.0,        // baseline
  "fair": 0.90,       // -10%
  "poor": 0.75,       // -25%
};

// Bedroom/bathroom adjustments (per unit above/below average)
const BEDROOM_VALUE = 15000; // Additional value per bedroom above 3
const BATHROOM_VALUE = 8000; // Additional value per bathroom above 2

export interface PropertyDetails {
  zipCode: string;
  propertyType: "single_family" | "condo" | "townhouse" | "multi_family";
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  condition: "excellent" | "good" | "fair" | "poor";
}

export interface ValuationResult {
  estimatedValue: number;
  valuationRange: {
    low: number;
    mid: number;
    high: number;
  };
  pricePerSqFt: number;
  breakdown: {
    baseValue: number;
    typeAdjustment: number;
    conditionAdjustment: number;
    bedroomAdjustment: number;
    bathroomAdjustment: number;
  };
  confidence: "high" | "medium" | "low";
  zipCodeFound: boolean;
}

/**
 * Calculate estimated property value
 */
export function calculatePropertyValue(details: PropertyDetails): ValuationResult {
  const {
    zipCode,
    propertyType,
    squareFeet,
    bedrooms,
    bathrooms,
    condition,
  } = details;

  // Get base price per square foot for ZIP code
  const basePricePerSqFt = DFW_ZIP_PRICE_DATA[zipCode] || DFW_ZIP_PRICE_DATA["default"];
  const zipCodeFound = zipCode in DFW_ZIP_PRICE_DATA;

  // Calculate base value
  const baseValue = squareFeet * basePricePerSqFt;

  // Apply property type multiplier
  const typeMultiplier = PROPERTY_TYPE_MULTIPLIERS[propertyType];
  const typeAdjustment = baseValue * (typeMultiplier - 1);

  // Apply condition adjustment
  const conditionMultiplier = CONDITION_ADJUSTMENTS[condition];
  const conditionAdjustment = baseValue * (conditionMultiplier - 1);

  // Bedroom adjustment (3 bedrooms is baseline)
  const bedroomDiff = bedrooms - 3;
  const bedroomAdjustment = bedroomDiff * BEDROOM_VALUE;

  // Bathroom adjustment (2 bathrooms is baseline)
  const bathroomDiff = bathrooms - 2;
  const bathroomAdjustment = bathroomDiff * BATHROOM_VALUE;

  // Calculate final estimated value
  const estimatedValue = Math.round(
    baseValue +
    typeAdjustment +
    conditionAdjustment +
    bedroomAdjustment +
    bathroomAdjustment
  );

  // Calculate valuation range (±10% for mid, ±20% for low/high)
  const valuationRange = {
    low: Math.round(estimatedValue * 0.80),
    mid: estimatedValue,
    high: Math.round(estimatedValue * 1.20),
  };

  // Determine confidence level
  let confidence: "high" | "medium" | "low" = "medium";
  if (zipCodeFound && condition !== "poor" && squareFeet >= 1000 && squareFeet <= 5000) {
    confidence = "high";
  } else if (!zipCodeFound || condition === "poor" || squareFeet < 800 || squareFeet > 6000) {
    confidence = "low";
  }

  return {
    estimatedValue,
    valuationRange,
    pricePerSqFt: basePricePerSqFt,
    breakdown: {
      baseValue: Math.round(baseValue),
      typeAdjustment: Math.round(typeAdjustment),
      conditionAdjustment: Math.round(conditionAdjustment),
      bedroomAdjustment,
      bathroomAdjustment,
    },
    confidence,
    zipCodeFound,
  };
}
