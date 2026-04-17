import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link2, BarChart3, Layers } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Shorten URLs",
    description:
      "Turn long, unwieldy URLs into clean, memorable short links you can share anywhere in seconds.",
  },
  {
    icon: BarChart3,
    title: "Track Clicks",
    description:
      "See how your links perform in real time. Monitor click counts and understand your audience.",
  },
  {
    icon: Layers,
    title: "Manage Links",
    description:
      "Keep all your short links organised in one dashboard. Edit, delete, or copy them with ease.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Shorten. Share.{" "}
            <span className="text-[#6c47ff]">Track.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            The simplest way to create short links, share them with the world,
            and watch your engagement grow — all from one place.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="bg-[#6c47ff] text-white hover:bg-[#5a3ce0] rounded-full px-8">
              Get Started Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-[#6c47ff]/10">
                    <Icon className="size-5 text-[#6c47ff]" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
