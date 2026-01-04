# Field-Level A/B Testing System - Implementation Guide

## Overview

This A/B testing system allows you to test different field configurations (labels, placeholders, required/optional) to optimize form conversion rates. The system includes automatic traffic splitting, consistent variant assignment, comprehensive event tracking, and statistical significance calculations.

## Features

- **Field-Level Testing**: Test individual form fields independently
- **Automatic Traffic Splitting**: Configurable traffic allocation with weighted distribution
- **Consistent Experience**: Users see the same variant across sessions
- **Comprehensive Tracking**: Track impressions, interactions, errors, and conversions
- **Statistical Analysis**: Automatic calculation of conversion rates and statistical significance
- **Admin Dashboard**: View results, manage tests, and make data-driven decisions

## Quick Start

### 1. Create an A/B Test (Admin Dashboard)

Navigate to `/admin/ab-testing` and create a new test:

```typescript
{
  name: "Phone Field Label Test",
  description: "Testing 'Phone' vs 'Mobile Number' label",
  formName: "contact_form",
  fieldName: "phone",
  trafficAllocation: 100, // 100% of traffic
  variants: [
    {
      name: "Control",
      isControl: true,
      trafficWeight: 50, // 50% of traffic
      fieldLabel: "Phone",
      fieldPlaceholder: "(555) 555-5555",
      fieldRequired: true,
    },
    {
      name: "Variant A",
      isControl: false,
      trafficWeight: 50, // 50% of traffic
      fieldLabel: "Mobile Number",
      fieldPlaceholder: "Enter your mobile",
      fieldRequired: true,
    },
  ],
}
```

### 2. Implement A/B Testing in Your Form

#### Option A: Use the `ABTestField` Component (Recommended)

```tsx
import { ABTestField, useABTestFormTracking } from "@/components/ABTestField";

function ContactForm() {
  const [phone, setPhone] = useState("");
  const { trackFormSubmit, trackFormSuccess, trackFormError } = 
    useABTestFormTracking("contact_form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFormSubmit();
    
    try {
      await submitForm();
      trackFormSuccess();
    } catch (error) {
      trackFormError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ABTestField
        formName="contact_form"
        fieldName="phone"
        defaultLabel="Phone"
        defaultPlaceholder="(555) 555-5555"
        defaultRequired={true}
        type="tel"
        value={phone}
        onChange={setPhone}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Option B: Use the `useABTest` Hook (Advanced)

```tsx
import { useABTest } from "@/hooks/useABTest";

function ContactForm() {
  const [phone, setPhone] = useState("");
  const { variant, trackEvent } = useABTest("contact_form", "phone", {
    label: "Phone",
    placeholder: "(555) 555-5555",
    required: true,
  });

  const handleFocus = () => trackEvent("focus");
  const handleBlur = () => trackEvent("blur");
  const handleChange = (e) => {
    setPhone(e.target.value);
    trackEvent("input");
  };

  return (
    <div>
      <label>
        {variant.label}
        {variant.required && <span>*</span>}
      </label>
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={variant.placeholder}
        required={variant.required}
      />
      {variant.helperText && <p>{variant.helperText}</p>}
    </div>
  );
}
```

### 3. Activate the Test

1. Go to `/admin/ab-testing`
2. Find your test in the list
3. Click "Start" to activate it
4. Users will now be automatically assigned to variants

### 4. Monitor Results

The dashboard shows:
- **Conversion rates** for each variant
- **Engagement metrics** (focus rate, error rate)
- **Statistical significance** (p-value, confidence)
- **Improvement percentage** vs control

### 5. Make a Decision

When you have statistically significant results:
- **Winner**: Update your form to use the winning variant
- **Pause**: Pause the test if you need more time
- **Complete**: Mark as completed to archive the test

## Common Test Scenarios

### Test 1: Field Label Variations

Test different labels to see which resonates better:

```typescript
// Control: "Phone"
// Variant A: "Mobile Number"
// Variant B: "Contact Number"
```

### Test 2: Required vs Optional

Test whether making a field optional increases conversions:

```typescript
// Control: required = true, label = "Phone *"
// Variant A: required = false, label = "Phone (Optional)"
```

### Test 3: Placeholder Text

Test different placeholder examples:

```typescript
// Control: placeholder = "(555) 555-5555"
// Variant A: placeholder = "Enter your phone number"
// Variant B: placeholder = "555-555-5555"
```

### Test 4: Helper Text

Test adding helper text below the field:

```typescript
// Control: helperText = undefined
// Variant A: helperText = "We'll only call to discuss your property"
// Variant B: helperText = "Required for consultation scheduling"
```

## Event Tracking

The system automatically tracks:

- **impression**: Field was shown to user
- **focus**: User clicked/focused on the field
- **blur**: User left the field
- **input**: User typed something
- **validation_error**: Field validation failed
- **form_submit**: Form was submitted
- **form_success**: Form submission succeeded
- **form_error**: Form submission failed

## Statistical Significance

The system uses a chi-square test to determine statistical significance:

- **p-value < 0.05**: Result is statistically significant (95% confidence)
- **p-value ≥ 0.05**: Result is not statistically significant (need more data)

### Sample Size Guidelines

For reliable results, aim for:
- **Minimum**: 100 conversions per variant
- **Recommended**: 300+ conversions per variant
- **High confidence**: 1000+ conversions per variant

## Best Practices

1. **Test One Thing at a Time**: Don't change multiple fields simultaneously
2. **Run Tests Long Enough**: Wait for statistical significance
3. **Consider Time of Day/Week**: Run tests for at least a full week
4. **Document Your Hypothesis**: Write down what you expect and why
5. **Don't Stop Tests Early**: Even if one variant is winning, let it run
6. **Archive Completed Tests**: Mark tests as completed when done

## API Reference

### Backend (tRPC)

```typescript
// Get variant assignment (public)
trpc.abTesting.getVariantAssignment.useQuery({
  formName: string,
  fieldName: string,
  sessionId: string,
})

// Track event (public)
trpc.abTesting.trackEvent.useMutation({
  testId: number,
  variantId: number,
  sessionId: string,
  eventType: "impression" | "focus" | "blur" | "input" | "validation_error" | "form_submit" | "form_success" | "form_error",
  eventData?: string,
})

// Create test (admin only)
trpc.abTesting.createTest.useMutation({ ... })

// Update test status (admin only)
trpc.abTesting.updateTestStatus.useMutation({ testId, status })

// Get test statistics (admin only)
trpc.abTesting.getTestStats.useQuery({ testId })

// Get all tests (admin only)
trpc.abTesting.getAllTests.useQuery()
```

### Frontend Hooks

```typescript
// Get variant and tracking function
const { variant, isLoading, trackEvent } = useABTest(
  formName: string,
  fieldName: string,
  defaultConfig: FieldVariant
)

// Track form-level events
const { trackFormSubmit, trackFormSuccess, trackFormError } = 
  useABTestFormTracking(formName: string)
```

## Troubleshooting

### Users seeing different variants on refresh

- Check that sessionId is being stored in localStorage
- Verify the session ID is consistent across page loads

### No data showing in dashboard

- Ensure test status is "active"
- Check that events are being tracked (look in browser console)
- Verify the formName and fieldName match exactly

### Statistical significance not showing

- Need more data (at least 30 conversions per variant)
- Test may need to run longer
- Check that form_success events are being tracked

## Database Schema

The system uses 4 tables:

- **abTests**: Test definitions
- **abTestVariants**: Variant configurations
- **abTestAssignments**: User-to-variant mappings
- **abTestEvents**: All tracked events

All tables are automatically created via Drizzle migrations.
