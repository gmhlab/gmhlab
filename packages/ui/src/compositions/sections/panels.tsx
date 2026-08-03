import { Flex, type FlexProps } from "../../layouts";

export type PanelProps = Omit<FlexProps, "container" | "wrap">;
export function Panel({ children, ...props }: PanelProps) {
  return (
    <Flex container wrap {...props}>
      {children}
    </Flex>
  );
}
