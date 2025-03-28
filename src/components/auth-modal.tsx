"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SocialSignIn } from "./social-sign-in";

interface AuthModalProps {
  defaultTab?: "sign-in" | "sign-up";
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  redirectUrl?: string;
}

export function AuthModal({
  defaultTab = "sign-in",
  trigger,
  open,
  onOpenChange,
  redirectUrl = "/",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Refresh the page to update auth state
      router.push(redirectUrl);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Sisselogimine ebaõnnestus");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            email: email,
          },
        },
      });

      if (error) throw error;

      if (user) {
        try {
          const { error: updateError } = await supabase.from("users").insert({
            id: user.id,
            user_id: user.id,
            name: fullName,
            email: email,
            token_identifier: user.id,
            created_at: new Date().toISOString(),
          });

          if (updateError) {
            console.error("Error updating user profile:", updateError);
          }
        } catch (err) {
          console.error("Error in user creation:", err);
        }
      }

      setSuccess("Konto loodud! Palun kontrolli oma e-posti kinnitamiseks.");
      setActiveTab("sign-in");
    } catch (error: any) {
      setError(error.message || "Konto loomine ebaõnnestus");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "sign-in" ? "Tere tulemast tagasi" : "Loo konto"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "sign-in"
              ? "Logi sisse oma kontole jätkamiseks"
              : "Liitu meiega taimede tuvastamiseks ja jälgimiseks"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "sign-in" | "sign-up")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Logi sisse</TabsTrigger>
            <TabsTrigger value="sign-up">Registreeru</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sina@näide.ee"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Parool</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    type="button"
                    onClick={() => {
                      // Handle forgot password
                    }}
                  >
                    Unustasid parooli?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sisselogimine...
                  </>
                ) : (
                  "Logi sisse"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    või jätka
                  </span>
                </div>
              </div>

              <SocialSignIn language="et" />
            </form>
          </TabsContent>

          <TabsContent value="sign-up" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Täisnimi</Label>
                <Input
                  id="fullName"
                  placeholder="Jaan Tamm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">E-post</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="sina@näide.ee"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Parool</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">
                  Parool peab olema vähemalt 6 tähemärki pikk
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-500 p-2 bg-green-50 rounded">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Konto loomine...
                  </>
                ) : (
                  "Loo konto"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    või jätka
                  </span>
                </div>
              </div>

              <SocialSignIn language="et" />
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
