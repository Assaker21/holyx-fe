import SpinnerCircle3 from "@/components/spinner-09";
import { useAuth } from "@/contexts/auth.context";
import { Outlet } from "react-router";

export default function RootLayout() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="w-screen h-screen flex flex-row items-center justify-center">
        <SpinnerCircle3 />
      </div>
    );
  }

  return <Outlet />;
}
