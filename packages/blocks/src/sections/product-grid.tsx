import {
  ProductInfoCard,
  ProductInfoCardSkeleton,
  productToProductInfoCardProps,
} from "@gmhlab/ui";
import { useProducts, type Product } from "../data";
import { useMediaQuery } from "@gmhlab/ui";
import { IconChevronDown, IconChevronUp } from "@gmhlab/ui";
import { CardGrid, Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  Badge,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@gmhlab/ui";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ProductGrid() {
  const { isMobile, isTablet } = useMediaQuery();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortPrice, setSortPrice] = useState<-1 | 0 | 1>(0);
  const [filterTopRated, setFilterTopRated] = useState<boolean>(false);
  const flexGap = isMobile ? "600" : "1200";
  const sectionPadding = isMobile ? "600" : "1600";
  const { products, isLoading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  useEffect(() => {
    const initialProducts = products.filter(
      (product) => !filterTopRated || product.rating >= 4.75,
    );
    if (!searchTerm) {
      setFilteredProducts(initialProducts);
    } else {
      setFilteredProducts(
        initialProducts.filter(
          (product) =>
            product.name.match(new RegExp(searchTerm, "i")) ||
            product.description.match(new RegExp(searchTerm, "i")),
        ),
      );
    }
  }, [searchTerm, filterTopRated, products]);

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortPrice !== 0) {
      return a.price > b.price ? sortPrice : -sortPrice;
    }
    return 0;
  });

  return (
    <Section padding={sectionPadding} variant="stroke">
      <Flex container wrap gap={flexGap} alignPrimary="stretch">
        <Flex direction="column" gap="1200" alignSecondary="stretch">
          <Flex
            alignPrimary="space-between"
            alignSecondary="center"
            type="third"
            wrap
            gap="400"
          >
            <FlexItem size="minor">
              <Flex alignPrimary="stretch">
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    placeholder="Search"
                    aria-label="Search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                  />
                </InputGroup>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex gap="200">
                <Badge
                  id="filter-top-rated"
                  render={<button type="button" />}
                  className="cursor-pointer"
                  onClick={() => setFilterTopRated((prev) => !prev)}
                  variant={filterTopRated ? "default" : "secondary"}
                >
                  Top rated
                </Badge>
                <Badge
                  id="sort-price"
                  render={<button type="button" />}
                  className="cursor-pointer"
                  variant={sortPrice === 0 ? "secondary" : "default"}
                  onClick={() => {
                    setSortPrice((prev) => {
                      if (prev === 0) return -1;
                      if (prev === -1) return 1;
                      return 0;
                    });
                  }}
                >
                  Price{" "}
                  {sortPrice === 0 || sortPrice === -1 ? (
                    <IconChevronDown />
                  ) : (
                    <IconChevronUp />
                  )}
                </Badge>
              </Flex>
            </FlexItem>
          </Flex>
          <CardGrid type="third" gap="600">
            {isLoading ? (
              <>
                <ProductInfoCardSkeleton />
                <ProductInfoCardSkeleton />
                <ProductInfoCardSkeleton />
                <ProductInfoCardSkeleton />
                <ProductInfoCardSkeleton />
                <ProductInfoCardSkeleton />
              </>
            ) : (
              sortedProducts.map(({ ...product }, index) => (
                <FlexItem key={index} size={isTablet ? "half" : "minor"}>
                  <ProductInfoCard
                    {...productToProductInfoCardProps(product)}
                  />
                </FlexItem>
              ))
            )}
          </CardGrid>
        </Flex>
      </Flex>
    </Section>
  );
}
