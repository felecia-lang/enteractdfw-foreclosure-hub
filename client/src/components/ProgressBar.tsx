import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="w-full bg-card border-b sticky top-0 z-40 shadow-sm">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <p
                    className={`
                      mt-2 text-xs font-medium text-center max-w-[100px]
                      ${
                        isCurrent
                          ? "text-foreground"
                          : isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60"
                      }
                    `}
                  >
                    {step}
                  </p>
                </div>

                {/* Connecting Line */}
                {stepNumber < totalSteps && (
                  <div className="flex-1 h-[2px] mx-4 relative top-[-20px]">
                    <div
                      className={`
                        h-full transition-all duration-300
                        ${
                          stepNumber < currentStep
                            ? "bg-primary"
                            : "bg-muted"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Percentage */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
