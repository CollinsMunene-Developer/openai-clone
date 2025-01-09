// app/auth/signup/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SignupForm from "../../components/authentication/Signup-form";
import { type AuthFormState } from "../../types/auth";
import { type AuthFormData } from "../../types/api";
import { type AlertState } from "../../types/ui";
import { AuthAlerts } from "../../components/authentication/auth-alerts-orchestrator";

import { AlertProvider } from "../../context/GlobalAlertManager";
import { signup } from "../../actions/auth-service";
import { Chatgptlogo } from "../../public/icons/icons";
import { AlertContainer } from "../../components/authentication/alert-containet";

function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null as unknown as HTMLFormElement);

  // Form and validation state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<AuthFormData>({
    loginEmail: "",
    loginPassword: "",
    signupEmail: "",
    signupPassword: "",
    signupName: "",
  });
  const [passwordError, setPasswordError] = React.useState<string>();

  // Alert state management
  const [localAlertState, setLocalAlertState] = React.useState<AlertState>({
    error: null,
    message: null,
    signupState: {},
    loginState: {},
    verificationState: { expired: false },
    isPostSignup: false,
    showVerificationAlert: false,
    email: null,
  });

  // Handle URL parameters
  const error = searchParams.get("error");
  const urlEmail = searchParams.get("email");
  const message = searchParams.get("message");

  // Process URL message parameters
  React.useEffect(() => {
    if (message) {
      setLocalAlertState((prev) => ({
        ...prev,
        message,
        error: null,
      }));
    }
  }, [message]);

  // Process URL error parameters
  React.useEffect(() => {
    if (error) {
      setLocalAlertState((prev) => ({
        ...prev,
        error,
        message: null,
        email: urlEmail,
      }));
    }
  }, [error, urlEmail]);

  // Enhanced signup handler with proper error handling
  const handleSignup = React.useCallback(
    async (formData: FormData): Promise<void> => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        // Clear previous alerts
        setLocalAlertState((prev) => ({
          ...prev,
          error: null,
          message: null,
        }));

        const result = await signup({} as AuthFormState, formData);

        if (result.success) {
          // Handle successful signup
          setLocalAlertState((prev) => ({
            ...prev,
            error: null,
            message: result.message || "Signup successful! Please verify your email.",
            signupState: result,
            isPostSignup: true,
            showVerificationAlert: true,
            email: result.email,
          }));

          // Clear form data on success
          setFormData({
            loginEmail: "",
            loginPassword: "",
            signupEmail: "",
            signupPassword: "",
            signupName: "",
          });

          // Optional: Redirect to verification page
          if (result.email) {
            router.push(`/auth/verify?email=${encodeURIComponent(result.email)}`);
          }
        } else if (result.errors) {
          // Handle validation/server errors
          const errorMessage = 
            result.errors.general || 
            result.errors.email || 
            result.errors.password ||
            result.errors.fullName;

          setLocalAlertState((prev) => ({
            ...prev,
            error: errorMessage || "Signup failed. Please try again.",
            message: null,
            signupState: result,
            email: result.email,
          }));

          // Handle specific error cases
          if (result.verificationPending) {
            setLocalAlertState((prev) => ({
              ...prev,
              showVerificationAlert: true,
            }));
          }
        }
      } catch (error) {
        console.error("Signup error:", error);
        setLocalAlertState((prev) => ({
          ...prev,
          error: "An unexpected error occurred. Please try again later.",
          message: null,
          signupState: {},
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router]
  );

  // Alert close handler
  const handleAlertClose = React.useCallback(() => {
    setLocalAlertState((prev) => ({
      ...prev,
      error: null,
      message: null,
      showVerificationAlert: false,
    }));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between p-24">
      <AlertProvider>
        <div className="items-center flex flex-col justify-center w-full">
          <div>
            <Image src={Chatgptlogo} alt="Chatgptlogo" width={100} height={100} />
          </div>
          
          <div className="mt-4">
            <AlertContainer 
              className="mb-4" 
              onAlertClose={handleAlertClose}
            />
            <AuthAlerts
              error={localAlertState.error}
              message={localAlertState.message}
              verificationState={localAlertState.verificationState}
              showVerificationAlert={localAlertState.showVerificationAlert}
              email={localAlertState.email}
            />
          </div>

          <div>
            <SignupForm
              signupState={{ loading: isSubmitting }}
              signupAction={handleSignup}
              formRef={formRef}
              formData={formData}
              setFormData={setFormData}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
            />
          </div>
        </div>
      </AlertProvider>
    </main>
  );
}

export default SignupPage;