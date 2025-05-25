"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createUser, loginUser } from "./actions";
import LoadingState from "@/components/LoadingState";
import { useDispatch, useSelector } from "react-redux";
import { saveUserEmail } from "@/store/actions/action";
import { RootState } from "@/store/reducers/reducers";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const dispatch = useDispatch();

  const userEmail = useSelector((state: RootState) => state.email);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      setIsLoading(true);
      router.push("/");
    }
  }, [userEmail, router]);


// Login handler
const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
  
    // Add a timeout of 5 seconds before proceeding
    const loginSuccessful = await new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        const success = await loginUser(email, password);
        resolve(success);
      }, 5000); // 5000ms = 5 seconds
    });
  
    if (loginSuccessful) {
      dispatch(saveUserEmail(email));
      toast({
        title: "Success",
        description: "Login successful.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  
    setIsLoading(false);
  };
  

  const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const newUser = {
      name : username,
      email,
      password,
      role: "PASSENGER",
    };

    try {
      await createUser(newUser);
      dispatch(saveUserEmail(email));
      toast({
        title: "Success",
        description: "User was registered successfully.",
        variant: "default",
      });
      setIsLoading(false);
      router.refresh()
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">
            Welcome to Tourly
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
            <form onSubmit={onLogin}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading && <span>Loading...</span>}
                    Sign In
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={onRegister}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      placeholder="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading && <span>Loading...</span>}
                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <LoadingState isOpen={isLoading} />
    </div>
  );
}
