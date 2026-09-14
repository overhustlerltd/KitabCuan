import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOOLS_PAGE_CONTENT } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";
import { verifyAccess } from "@/lib/access-token";
import { ToolsGate } from "@/components/tools/tools-gate";
import { RencanaMenuForm } from "@/components/tools/rencana-menu-form";
import { KalkulatorHppForm } from "@/components/tools/kalkulator-hpp-form";
import { TulisanPromosiForm } from "@/components/tools/tulisan-promosi-form";
import { NamaUsahaForm } from "@/components/tools/nama-usaha-form";
import { ChatAssistant } from "@/components/tools/chat-assistant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tools AI",
  description: TOOLS_PAGE_CONTENT.subtitle,
  robots: { index: false, follow: false },
  openGraph: {
    title: "Tools AI | KitabCuan",
    description: TOOLS_PAGE_CONTENT.subtitle,
  },
};

export default function ToolsPage({
  searchParams,
}: {
  searchParams: { locked?: string; err?: string };
}) {
  const token = cookies().get("kc_akses")?.value;
  const unlocked = Boolean(verifyAccess(token));

  if (!unlocked) {
    return <ToolsGate initialError={searchParams.err === "1"} />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {TOOLS_PAGE_CONTENT.backLabel}
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          <Badge variant="accent" className="w-fit font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            {TOOLS_PAGE_CONTENT.badge}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {TOOLS_PAGE_CONTENT.title}
          </h1>
          <p className="max-w-2xl text-neutral-600">{TOOLS_PAGE_CONTENT.subtitle}</p>
        </div>

        <Tabs defaultValue={TOOLS_PAGE_CONTENT.tabs[0].value} className="mt-8 flex flex-col gap-6">
          <TabsList className="border border-border bg-neutral-100/80 p-1.5 shadow-sm">
            {TOOLS_PAGE_CONTENT.tabs.map((tab) => {
              const Icon = ICON_MAP[tab.icon];
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="rencana-menu">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{TOOLS_PAGE_CONTENT.tabs[0].cardTitle}</CardTitle>
                <CardDescription>{TOOLS_PAGE_CONTENT.tabs[0].cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <RencanaMenuForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kalkulator-hpp">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{TOOLS_PAGE_CONTENT.tabs[1].cardTitle}</CardTitle>
                <CardDescription>{TOOLS_PAGE_CONTENT.tabs[1].cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <KalkulatorHppForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tulisan-promosi">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{TOOLS_PAGE_CONTENT.tabs[2].cardTitle}</CardTitle>
                <CardDescription>{TOOLS_PAGE_CONTENT.tabs[2].cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <TulisanPromosiForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nama-brand">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{TOOLS_PAGE_CONTENT.tabs[3].cardTitle}</CardTitle>
                <CardDescription>{TOOLS_PAGE_CONTENT.tabs[3].cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <NamaUsahaForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tanya-mentor">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{TOOLS_PAGE_CONTENT.tabs[4].cardTitle}</CardTitle>
                <CardDescription>{TOOLS_PAGE_CONTENT.tabs[4].cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatAssistant className="h-[32rem]" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
