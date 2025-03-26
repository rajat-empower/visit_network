
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageTitle from "@/components/PageTitle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) throw result.error;

      if (isSignUp) {
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <PageTitle title={isSignUp ? "Sign Up" : "Login"} description={isSignUp ? "Create a new account" : "Access your account"} />
      <div className="w-full max-w-md">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-gray-500 hover:text-[#ea384c]">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-500">
                {isSignUp ? "Sign Up" : "Login"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Enter your email and create a password to sign up" 
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90"
                disabled={isLoading}
              >
                {isLoading 
                  ? "Please wait..." 
                  : (isSignUp ? "Create account" : "Sign in")}
              </Button>
              <div className="text-center text-sm">
                {isSignUp ? (
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-[#ea384c] hover:text-[#ea384c]/90"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign in
                    </Button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-[#ea384c] hover:text-[#ea384c]/90"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign up
                    </Button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
