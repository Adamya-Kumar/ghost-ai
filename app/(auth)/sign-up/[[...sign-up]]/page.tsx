import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      fallbackRedirectUrl="/editor"
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
    />
  );
}
