import { SignIn } from "@clerk/react";
import logo from "@/assets/logo.png";

const Auth = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-3 h-12 w-12 rounded-lg" />
          <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Centralize your workspace
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0",
              }
            }}
            routing="path"
            path="/auth"
            signUpUrl="/auth"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
