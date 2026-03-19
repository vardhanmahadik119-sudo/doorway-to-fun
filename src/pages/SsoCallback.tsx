import { AuthenticateWithRedirectCallback } from "@clerk/react";

export default function SsoCallback() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    />
  );
}

