import { Footer, Header } from "@gmhlab/ui";
import { useMediaQuery } from "@gmhlab/ui";
import { Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Text,
  TextHeading,
  TextSmall,
  TextStrong,
} from "@gmhlab/ui";
import { useState } from "react";
import "./templates.css";

const NAV_ITEMS = ["Overview", "Projects", "Activity", "Settings"] as const;
type NavItem = (typeof NAV_ITEMS)[number];

export function AppShellTemplate() {
  const [activePage, setActivePage] = useState<NavItem>("Overview");
  const { isTabletDown } = useMediaQuery();

  return (
    <div className="template-page-root">
      <Header />

      <Section variant="neutral" padding="800">
        <Flex container gap="600" alignSecondary="start">
          {/* Left rail — hidden on mobile */}
          {!isTabletDown && (
            <FlexItem size="minor">
              <aside className="template-block template-rail">
                <TextStrong>Workspace</TextStrong>
                <NavigationMenu className="max-w-none">
                  <NavigationMenuList className="flex-col items-stretch">
                    {NAV_ITEMS.map((item) => (
                      <NavigationMenuItem key={item}>
                        <NavigationMenuLink
                          render={<button type="button" />}
                          active={activePage === item}
                          onClick={() => setActivePage(item)}
                          className="w-full cursor-pointer justify-start"
                        >
                          {item}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </aside>
            </FlexItem>
          )}

          {/* Main + utility rail */}
          <FlexItem size="major">
            <Flex gap="400" wrap={isTabletDown} alignSecondary="start">
              {/* Primary content */}
              <FlexItem size={isTabletDown ? "full" : "major"}>
                <main
                  className="template-block"
                  aria-label="App shell primary content"
                >
                  <Flex direction="column" gap="600">
                    <Flex direction="column" gap="200">
                      <TextHeading>{activePage}</TextHeading>
                      <Text>
                        Use this region for dashboard cards, data tables,
                        workflows, and product-specific views.
                      </Text>
                    </Flex>
                    {/* Placeholder content rows */}
                    <Flex direction="column" gap="300">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="template-skeleton-row" />
                      ))}
                    </Flex>
                  </Flex>
                </main>
              </FlexItem>

              {/* Utility rail */}
              <FlexItem size={isTabletDown ? "full" : "minor"}>
                <aside className="template-block">
                  <Flex direction="column" gap="400">
                    <TextHeading>Activity</TextHeading>
                    <TextSmall>
                      Add contextual activity, alerts, assignees, and pinned
                      links here.
                    </TextSmall>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="template-skeleton-row" />
                    ))}
                  </Flex>
                </aside>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>

      <Footer />
    </div>
  );
}
