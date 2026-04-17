import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Link2, BarChart2, LayoutDashboard, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Link2,
    title: "Shorten Links",
    description:
      "Turn long, unwieldy URLs into clean, memorable short links in seconds.",
  },
  {
    icon: BarChart2,
    title: "Track Analytics",
    description:
      "Monitor clicks and traffic in real-time so you always know how your links perform.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage Everything",
    description:
      "View, edit, and organise all your shortened links from a single dashboard.",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description:
      "Paste your short links into emails, social posts, or messages — they work everywhere.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
          <Link2 className="size-3.5" />
          Free link shortener — no account required to try
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Shorten.{" "}
          <span className="text-[#6c47ff]">Share.</span>{" "}
          Track.
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Create short, branded links in seconds. Track every click with
          real-time analytics and manage all your URLs from one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-[#6c47ff] text-white hover:bg-[#5a3adb] rounded-full h-11 px-6 text-base"
            >
              Get Started Free
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          Everything you need to manage your links
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-border bg-card p-6",
                "transition-colors hover:border-[#6c47ff]/50 hover:bg-card/80"
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#6c47ff]/10 text-[#6c47ff]">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <div
          className="flex flex-col items-center gap-6 rounded-2xl border border-[#6c47ff]/30 bg-[#6c47ff]/5 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Join today and start shortening, sharing, and tracking your links
            for free.
          </p>
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-[#6c47ff] text-white hover:bg-[#5a3adb] rounded-full h-11 px-8 text-base"
            >
              Create Your Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
