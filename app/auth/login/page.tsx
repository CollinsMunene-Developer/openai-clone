/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/GlobalAuthStateManager";
import { AlertProvider } from "../../context/GlobalAlertManager";
import { LoginForm } from "../../components/authentication/login-form";
import { useSearchParams } from "next/navigation";
import { type AuthFormState } from "../../types/auth";
import { type AuthFormData } from "../../types/api";
import { type AlertState } from "../../types/ui";
import { type AuthMode } from "../../types/ui";
import { AuthAlerts } from "../../components/authentication/auth-alerts-orchestrator";
import { AUTH_ALERTS } from "../../lib/auth/alerts/auth-alerts";

import { AlertContainer } from "../../components/authentication/alert-containet";
import { login } from "../../actions/auth-service";
const LoginPage = () => {
  const searchParams = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null);
  const loginFormRef = React.useRef<HTMLFormElement>(null!);
  // Form data and validation state
  const [formData, setFormData] = React.useState<AuthFormData>({
    loginEmail: "",
    loginPassword: "",
    signupEmail: "",
    signupPassword: "",
    signupName: "",
  });
  // Alert and authentication state
  const [localAlertState, setLocalAlertState] = React.useState<AlertState>({
    error: null,
    message: null,
    signupState: {},
    loginState: {},
    verificationState: { expired: false },
    isPostSignup: false,
    showVerificationAlert: false,
  });
  const [passwordError, setPasswordError] = React.useState<string>();
  // URL parameters for error handling and email verification
  const error = searchParams.get("error");
  const urlEmail = searchParams.get("email");
  // Sync local alert state with parent component
  React.useEffect(() => {
    // Define the onAlertStateChange function or remove this effect if not needed
    const onAlertStateChange = (state: AlertState) => {
      // Handle alert state change
    };
    onAlertStateChange(localAlertState);
  }, [localAlertState]);
  const handleLogin = React.useCallback(
    async (formData: FormData): Promise<void> => {
      try {
        const result = await login({} as AuthFormState, formData);

        if (result.success) {
          // Handle successful login
          setLocalAlertState((prev) => ({
            ...prev,
            error: null,
            message: AUTH_ALERTS.LOGIN.SUCCESS.message,
            loginState: result,
          }));

          // Brief timeout to allow alert to show before redirect
          // Redirect users as soon as possible (0ms)
          // Best practice: use timeout only for debugging
          setTimeout(() => {
            const redirectTo = searchParams.get("redirect_to") || "/";
            window.location.href = redirectTo;
          }, 0); // zero for speed. increase timeout if needed for debugging
        } else if (result.errors) {
          // Handle login errors
          setLocalAlertState((prev) => ({
            ...prev,
            error: result.errors?.general || null,
            message: null,
            loginState: result,
            showVerificationAlert: result.verificationPending || false,
            email: result.email,
          }));
        }
      } catch {
        // Handle unexpected errors
        setLocalAlertState((prev) => ({
          ...prev,
          error: "An error occurred during login",
          message: null,
          loginState: {},
        }));
      }
    },
    [searchParams]
  );
  // Handle URL message parameters
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

  // Handle URL error parameters
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
  // Reset alert state
  const handleAlertClose = React.useCallback(() => {
    setLocalAlertState((prev) => ({
      ...prev,
      error: null,
      message: null,
      showVerificationAlert: false,
    }));
  }, []);

  return (
    <AlertProvider>
          <div className="items-center flex justify-center ">
      {/*alert display */}
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
          <LoginForm
          loginState={{}}
          loginAction={handleLogin} // Pass the login action to the form
          formRef={loginFormRef}
          formData={formData}
          setFormData={setFormData}
           />
        </div>
    </div>
    </AlertProvider>

  )
};

export default LoginPage;
