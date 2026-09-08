import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      fallbackRedirectUrl="/editor"
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    />
  );
}
