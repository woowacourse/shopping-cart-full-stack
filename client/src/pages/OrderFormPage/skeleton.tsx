import Flex from "@components/common/shared/Flex";
import Skeleton from "@components/common/shared/Skeleton";
import Spacing from "@components/common/shared/Spacing";
import styled from "@emotion/styled";

export default function OrderFormSkeleton() {
  return (
    <OrderFormPageWrapper>
      <Spacing size={2.25} />
      {/* OrderFormHeading */}
      <Flex direction="column" gap={16}>
        <Skeleton width="5rem" height="1.5rem" />
        <Skeleton width="100%" height="1px" />
      </Flex>
      <Spacing size={2.25} />

      {/* ProductListSection */}
      <Flex direction="column" gap={20}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Flex gap={24} align="center" key={index}>
            <Skeleton width="7rem" height="7rem" borderRadius="0.5rem" />
            <Flex direction="column" gap={12} style={{ flex: 1 }}>
              <Skeleton width="80%" height="1.25rem" />
              <Skeleton width="40%" height="1rem" />
              <Skeleton width="30%" height="1.25rem" />
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Spacing size={2} />

      {/* CouponApplyButton */}
      <Skeleton width="100%" height="3.25rem" borderRadius="0.5rem" />
      <Spacing size={2} />

      {/* DeliverySection */}
      <Flex direction="column" gap={12}>
        <Skeleton width="5rem" height="1.25rem" />
        <Skeleton width="100%" height="4rem" borderRadius="0.5rem" />
      </Flex>
      <Spacing size={2} />

      {/* OrderSummarySection */}
      <Flex direction="column" gap={16}>
        <Skeleton width="5rem" height="1.25rem" />
        <Flex justify="space-between">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="5rem" height="1rem" />
        </Flex>
        <Flex justify="space-between">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="5rem" height="1rem" />
        </Flex>
        <Flex justify="space-between">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="5rem" height="1rem" />
        </Flex>
        <Skeleton width="100%" height="1px" />
        <Flex justify="space-between">
          <Skeleton width="5rem" height="1.5rem" />
          <Skeleton width="7rem" height="1.5rem" />
        </Flex>
      </Flex>
    </OrderFormPageWrapper>
  );
}

const OrderFormPageWrapper = styled.div`
  padding-inline: 24px;
`;
