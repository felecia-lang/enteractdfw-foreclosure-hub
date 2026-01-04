import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

// Generate or retrieve session ID from localStorage
function getSessionId(): string {
  const key = "ab_test_session_id";
  let sessionId = localStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

interface FieldVariant {
  label?: string;
  placeholder?: string;
  required: boolean;
  helperText?: string;
}

interface UseABTestResult {
  variant: FieldVariant | null;
  isLoading: boolean;
  trackEvent: (eventType: "impression" | "focus" | "blur" | "input" | "validation_error" | "form_submit" | "form_success" | "form_error", eventData?: string) => void;
}

/**
 * Hook for A/B testing form fields
 * Automatically assigns variants and provides tracking functions
 * 
 * @param formName - Name of the form (e.g., "contact_form", "lead_capture")
 * @param fieldName - Name of the field being tested (e.g., "phone", "email")
 * @param defaultConfig - Default field configuration if no test is active
 * @returns Variant configuration and tracking function
 * 
 * @example
 * const { variant, trackEvent } = useABTest("contact_form", "phone", {
 *   label: "Phone",
 *   placeholder: "(555) 555-5555",
 *   required: true,
 * });
 */
export function useABTest(
  formName: string,
  fieldName: string,
  defaultConfig: FieldVariant
): UseABTestResult {
  const [sessionId] = useState(() => getSessionId());
  const [testId, setTestId] = useState<number | null>(null);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [impressionTracked, setImpressionTracked] = useState(false);

  // Get variant assignment
  const { data, isLoading } = trpc.abTesting.getVariantAssignment.useQuery({
    formName,
    fieldName,
    sessionId,
  });

  // Track event mutation
  const trackEventMutation = trpc.abTesting.trackEvent.useMutation();

  // Update test and variant IDs when data loads
  useEffect(() => {
    if (data?.hasTest && data.variant) {
      setTestId(data.testId);
      setVariantId(data.variant.id);
    }
  }, [data]);

  // Track impression when variant is assigned
  useEffect(() => {
    if (testId && variantId && !impressionTracked) {
      trackEventMutation.mutate({
        testId,
        variantId,
        sessionId,
        eventType: "impression",
      });
      setImpressionTracked(true);
    }
  }, [testId, variantId, sessionId, impressionTracked]);

  // Create tracking function
  const trackEvent = (
    eventType: "impression" | "focus" | "blur" | "input" | "validation_error" | "form_submit" | "form_success" | "form_error",
    eventData?: string
  ) => {
    if (testId && variantId) {
      trackEventMutation.mutate({
        testId,
        variantId,
        sessionId,
        eventType,
        eventData,
      });
    }
  };

  // Return variant configuration or default
  const variant: FieldVariant = data?.hasTest && data.variant
    ? {
        label: data.variant.fieldLabel || defaultConfig.label,
        placeholder: data.variant.fieldPlaceholder || defaultConfig.placeholder,
        required: data.variant.fieldRequired === "yes",
        helperText: data.variant.fieldHelperText || defaultConfig.helperText,
      }
    : defaultConfig;

  return {
    variant,
    isLoading,
    trackEvent,
  };
}
