import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";

export function LoginForm({ className, ...props }) {
  const [login, setLogin] = useState({ email: "", password: "" });
  const auth = useAuth();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();

              auth.login(login);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your HolyX account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={login.email}
                  id="email"
                  type="email"
                  placeholder="charbel@holyx.com"
                  required
                  onChange={(e) => {
                    setLogin({ ...login, email: e.target.value });
                  }}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  value={login.password}
                  id="password"
                  type="password"
                  required
                  onChange={(e) => {
                    setLogin({ ...login, password: e.target.value });
                  }}
                />
              </div>
              <Button loading={auth.loading} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://i.pinimg.com/736x/4a/90/33/4a903338c0e478248153bd8f3f6f6745.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
