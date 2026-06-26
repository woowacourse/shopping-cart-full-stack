import styled from '@emotion/styled';
import Skeleton from '../Skeleton/Skeleton';

const SKELETON_ITEM_COUNT = 3;

export default function CouponSelectModalSkeleton() {
  return (
    <>
      <InfoBanner>
        <Skeleton width="16px" height="16px" />
        <Skeleton width="220px" height="14px" />
      </InfoBanner>

      <List>
        {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, index) => (
          <Item key={index}>
            <Skeleton width="24px" height="24px" borderRadius="8px" />
            <Content>
              <Skeleton width="180px" height="18px" />
              <Skeleton width="120px" height="14px" />
              <Skeleton width="140px" height="14px" />
            </Content>
          </Item>
        ))}
      </List>
    </>
  );
}

const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #0000001a;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 0;

  & + & {
    border-top: 1px solid #0000001a;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
