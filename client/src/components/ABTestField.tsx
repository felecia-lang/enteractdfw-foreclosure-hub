import { useABTest } from "@/hooks/useABTest";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

interface ABTestFieldProps {
  formName: string;
  fieldName: string;
  defaultLabel: string;
  defaultPlaceholder?: string;
  defaultRequired?: boolean;
  defaultHelperText?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onValidationError?: (error: string) => void;
  className?: string;
}

/**
 * A/B tested form field component
 * Automatically applies variant configuration and tracks interactions
 * 
 * @example
 * <ABTestField
 *   formName="contact_form"
 *   fieldName="phone"
 *   defaultLabel="Phone"
 *   defaultPlaceholder="(555) 555-5555"
 *   defaultRequired={true}
 *   type="tel"
 *   value={phone}
 *   onChange={setPhone}
 * />
 */
export function ABTestField({
  formName,
  fieldName,
  defaultLabel,
  defaultPlaceholder,
  defaultRequired = true,
  defaultHelperText,
  type = "text",
  value,
  onChange,
  onValidationError,
  className,
}: ABTestFieldProps) {
  const { variant, trackEvent } = useABTest(formName, fieldName, {
    label: defaultLabel,
    placeholder: defaultPlaceholder,
    required: defaultRequired,
    helperText: defaultHelperText,
  });

  const hasTrackedFocus = useRef(false);
  const hasTrackedInput = useRef(false);

  // Track focus event
  const handleFocus = () => {
    if (!hasTrackedFocus.current) {
      trackEvent("focus");
      hasTrackedFocus.current = true;
    }
  };

  // Track blur event
  const handleBlur = () => {
    trackEvent("blur");
  };

  // Track input event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (!hasTrackedInput.current && newValue.length > 0) {
      trackEvent("input");
      hasTrackedInput.current = true;
    }
  };

  // Track validation errors
  useEffect(() => {
    if (variant?.required && value.trim() === "" && hasTrackedFocus.current) {
      // Field is required but empty after user interacted
      const error = `${variant.label || fieldName} is required`;
      trackEvent("validation_error", error);
      onValidationError?.(error);
    }
  }, [value, variant, fieldName, hasTrackedFocus.current]);

  if (!variant) {
    return null;
  }

  return (
    <div className={className}>
      <Label htmlFor={fieldName}>
        {variant.label}
        {variant.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={fieldName}
        name={fieldName}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={variant.placeholder}
        required={variant.required}
        className="mt-1"
      />
      {variant.helperText && (
        <p className="text-sm text-muted-foreground mt-1">
          {variant.helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Hook to track form submission events for A/B tests
 * Call this when form is submitted to track conversion
 * 
 * @example
 * const { trackFormSubmit, trackFormSuccess, trackFormError } = useABTestFormTracking("contact_form");
 * 
 * const handleSubmit = async () => {
 *   trackFormSubmit();
 *   try {
 *     await submitForm();
 *     trackFormSuccess();
 *   } catch (error) {
 *     trackFormError(error.message);
 *   }
 * };
 */
export function useABTestFormTracking(formName: string) {
  // Track all fields in the form
  const fields = ["phone", "email", "firstName", "propertyZip"]; // Customize based on your form
  
  const trackingFunctions = fields.map((fieldName) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { trackEvent } = useABTest(formName, fieldName, {
      label: fieldName,
      required: true,
    });
    return trackEvent;
  });

  return {
    trackFormSubmit: () => {
      trackingFunctions.forEach((track) => track("form_submit"));
    },
    trackFormSuccess: () => {
      trackingFunctions.forEach((track) => track("form_success"));
    },
    trackFormError: (error: string) => {
      trackingFunctions.forEach((track) => track("form_error", error));
    },
  };
}
