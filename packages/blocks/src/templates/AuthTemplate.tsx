import clsx from "clsx";
import { Footer, FormBox, Header } from "@gmhlab/ui";
import { useMediaQuery } from "@gmhlab/ui";
import { Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  Button,
  Checkbox,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Text,
  TextHeading,
  TextLink,
  TextListItem,
  TextLinkList,
  TextSmall,
  TextTitlePage,
} from "@gmhlab/ui";
import { type FormEvent } from "react";
import "./templates.css";

export function AuthTemplate() {
  const { isTabletDown } = useMediaQuery();

  return (
    <div className="template-page-root">
      <Header />

      <Section variant="neutral" padding={isTabletDown ? "800" : "1200"}>
        <Flex
          container
          type="half"
          gap="800"
          wrap={isTabletDown}
          alignSecondary={isTabletDown ? "start" : "stretch"}
        >
          {/* Sign-in panel */}
          <FlexItem>
            <div className="template-block">
              <Flex direction="column" gap="600">
                <Flex direction="column" gap="200">
                  <TextTitlePage>Welcome back</TextTitlePage>
                  <Text>
                    Sign in to continue to your team workspace and pick up where
                    you left off.
                  </Text>
                </Flex>

                <FormBox
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const data = Object.fromEntries(
                      new FormData(event.currentTarget),
                    );
                    console.log("Auth form data", data);
                  }}
                >
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                      <Input id="auth-email" name="email" type="email" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                      <Input
                        id="auth-password"
                        name="password"
                        type="password"
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="auth-remember" name="remember" />
                      <FieldLabel
                        htmlFor="auth-remember"
                        className="font-normal"
                      >
                        Remember me
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                  <Flex gap="300" alignSecondary="center">
                    <Button className="flex-1" type="submit">
                      Sign in
                    </Button>
                  </Flex>
                </FormBox>

                <TextSmall>
                  Don&apos;t have an account?{" "}
                  <TextLink href="#">Create one</TextLink>
                  {" · "}
                  <TextLink href="#">Forgot password?</TextLink>
                </TextSmall>
              </Flex>
            </div>
          </FlexItem>

          {/* Trust / benefits panel */}
          <FlexItem>
            <div className={clsx("template-block", "auth-benefits")}>
              <Flex direction="column" gap="600">
                <TextHeading>Why teams use Monofly SDS</TextHeading>
                <TextLinkList>
                  <TextListItem>
                    Fast design-to-code handoff with shared primitives.
                  </TextListItem>
                  <TextListItem>
                    Responsive defaults for production-ready interfaces.
                  </TextListItem>
                  <TextListItem>
                    Composable patterns that scale across products.
                  </TextListItem>
                  <TextListItem>
                    Token-driven theming — change brand colour in one place.
                  </TextListItem>
                </TextLinkList>
              </Flex>
            </div>
          </FlexItem>
        </Flex>
      </Section>

      <Footer />
    </div>
  );
}
