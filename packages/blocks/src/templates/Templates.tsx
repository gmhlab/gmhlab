import { useState } from "react";
import { Section } from "@gmhlab/ui";
import { Button, Flex, Text, TextSmall, TextTitlePage } from "@gmhlab/ui";
import { AppShellTemplate } from "./AppShellTemplate";
import { AuthTemplate } from "./AuthTemplate";
import { MarketingTemplate } from "./MarketingTemplate";
import "./templates.css";

const templateOptions = [
  {
    id: "app-shell",
    label: "App Shell",
    description: "Workspace layout with navigation, main content, and utility space.",
  },
  {
    id: "auth",
    label: "Auth",
    description: "Sign-in flow with a form panel and supporting trust content.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Launch page structure with hero, features, pricing, FAQ, and CTA.",
  },
] as const;

type TemplateOptionId = (typeof templateOptions)[number]["id"];

export function Templates() {
  const [activeTemplate, setActiveTemplate] =
    useState<TemplateOptionId>("app-shell");

  return (
    <div className="template-showcase-page">
      <Section padding="800" variant="neutral">
        <div className="template-showcase-intro">
          <TextTitlePage>Template demos</TextTitlePage>
          <Text>
            Preview the template layer with a switchable showcase. Each demo
            uses the reusable template components directly, so this page doubles
            as a living smoke test.
          </Text>
          <Flex gap="300" alignSecondary="center" wrap>
            {templateOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeTemplate === option.id ? "default" : "outline"}
                onClick={() => setActiveTemplate(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </Flex>
          <div className="template-showcase-meta">
            <TextSmall>
              {templateOptions.find((o) => o.id === activeTemplate)?.description}
            </TextSmall>
          </div>
        </div>
      </Section>

      <div className="template-showcase-preview">
        {activeTemplate === "auth" && <AuthTemplate />}
        {activeTemplate === "marketing" && <MarketingTemplate />}
        {activeTemplate === "app-shell" && <AppShellTemplate />}
      </div>
    </div>
  );
}
