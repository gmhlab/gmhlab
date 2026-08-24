import {
  PricingCard,
  PricingCardSkeleton,
  pricingPlanToPricingCardProps,
} from "@gmhlab/ui";
import { usePricing } from "../data";
import { useMediaQuery } from "@gmhlab/ui";
import { CardGrid, Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@gmhlab/ui";
import { useState } from "react";

export function PricingGrid() {
  const { isMobile } = useMediaQuery();
  const sectionPadding = isMobile ? "600" : "1600";
  const { monthlyPlans, annualPlans, currentPlan, setCurrentPlan, isLoading } =
    usePricing();
  const [pricingInterval, setPricingInterval] = useState("monthly");
  const flexGap = isMobile ? "600" : "1200";
  const options = pricingInterval === "monthly" ? monthlyPlans : annualPlans;

  return (
    <Section padding={sectionPadding} variant="stroke">
      <Flex container gap={flexGap} direction="column" alignSecondary="stretch">
        <FlexItem>
          <Flex alignPrimary="center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<button type="button" />}
                    active={pricingInterval === "monthly"}
                    onClick={() => setPricingInterval("monthly")}
                    className="cursor-pointer"
                  >
                    Monthly
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<button type="button" />}
                    active={pricingInterval === "yearly"}
                    onClick={() => setPricingInterval("yearly")}
                    className="cursor-pointer"
                  >
                    Yearly
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Flex>
        </FlexItem>
        <FlexItem>
          <CardGrid type="third" gap="1200">
            {isLoading ? (
              <>
                <PricingCardSkeleton size={isMobile ? "small" : "large"} />
                <PricingCardSkeleton size={isMobile ? "small" : "large"} />
                <PricingCardSkeleton size={isMobile ? "small" : "large"} />
              </>
            ) : (
              options.map((option, i) => {
                const props = pricingPlanToPricingCardProps(
                  option,
                  i,
                  currentPlan,
                  setCurrentPlan,
                );
                return (
                  <PricingCard
                    key={option.sku}
                    {...props}
                    size={isMobile ? "small" : "large"}
                  />
                );
              })
            )}
          </CardGrid>
        </FlexItem>
      </Flex>
    </Section>
  );
}