import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import { ui } from "../../firebase";

const SignIn = () => {
  return (
    <FirebaseUIProvider ui={ui}>
      <SignIn />
    </FirebaseUIProvider>
  );
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <SignIn />
    </div>
  );
}
