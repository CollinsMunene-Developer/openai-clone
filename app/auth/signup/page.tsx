// app/auth/signup/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SignupForm from "../../components/authentication/Signup-form";


import { type AuthFormState } from "../../types/auth";
import { type AuthFormData } from "../../types/api";
import { type AlertState } from "../../types/ui";
import { AuthAlerts } from "../../components/authentication/auth-alerts-orchestrator";
import { AlertContainer } from "../../components/authentication/alert-containet";
import { AlertProvider } from "../../context/GlobalAlertManager";
import { signup } from "../../actions/auth-service";
import { Chatgptlogo } from "../../public/icons/icons";

function SignupPage() {
  const searchParams = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null as any);

  const [formData, setFormData] = React.useState<AuthFormData>({
    loginEmail: "",
    loginPassword: "",
    signupEmail: "",
    signupPassword: "",
    signupName: "",
  });
  const [passwordError, setPasswordError] = React.useState<string>();
  
  const [localAlertState, setLocalAlertState] = React.useState<AlertState>({
    error: null,
    message: null,
    signupState: {},
    loginState: {},
    verificationState: { expired: false },
    isPostSignup: false,
    showVerificationAlert: false,
  });

  const error = searchParams.get("error");
  const urlEmail = searchParams.get("email");

  React.useEffect(() => {
    const onAlertStateChange = (state: AlertState) => {
      // Handle alert state change
    };
    onAlertStateChange(localAlertState);
  }, [localAlertState]);

  const handleSignup = React.useCallback(
    async (formData: FormData): Promise<void> => {
      try {
        const result = await signup({} as AuthFormState, formData);
        if (result.success) {
          setLocalAlertState((prev) => ({
            ...prev,
            error: null,
            message: result.message || "Signup successful",
            signupState: result,
            isPostSignup: true,
            showVerificationAlert: true,
            email: result.email,
          }));
        } else if (result.errors) {
          setLocalAlertState((prev) => ({
            ...prev,
            error: result.errors?.general || result.errors?.email || null,
            message: null,
            signupState: result,
            email: result.email,
          }));
        }
      } catch {
        setLocalAlertState((prev) => ({
          ...prev,
          error: "An error occurred during signup",
          message: null,
          signupState: {},
        }));
      }
    },
    []
  );

  const message = searchParams.get("message");
  React.useEffect(() => {
    if (message) {
      setLocalAlertState((prev) => ({
        ...prev,
        message,
        error: null,
      }));
    }
  }, [message]);

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

  const handleAlertClose = React.useCallback(() => {
    setLocalAlertState((prev) => ({
      ...prev,
      error: null,
      message: null,
      showVerificationAlert: false,
    }));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
              signupState={{}}
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