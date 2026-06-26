import { useState } from "react";
import { type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Layout } from "@/core/components/Layout";
import { Header } from "@/core/components/Header";
import { Button } from "@/core/components/Button";
import { Title } from "@/core/components/Title";
import { List } from "@/core/components/List";
import { ImgBox } from "@/core/components/ImgBox";
import { DataInfo } from "@/core/components/DataInfo";
import { Checkbox } from "@/core/components/Checkbox";
import { ContentBox } from "@/core/components/ContentBox";

import { formatNumber } from "@/core/utils/format";

import { useOrderSheet } from "./useOrderSheet";
import { CouponModal } from "./modals/CouponModal";

export const OrderReview = () => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  const {
    products,
    totalCount,

    isRemoteArea,
    updateIsRemoteArea,

    couponSelection,
    updateCouponSelection,

    pricing,
    paymentAmount,
  } = useOrderSheet();

  const handleChangeIsRemoteArea = (e: ChangeEvent<HTMLInputElement>) => {
    updateIsRemoteArea({ isRemoteArea: e.target.checked });
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleClickOpenModal = () => {
    setIsOpenModal(true);
  };

  return (
    <Layout>
      <Header leading={<Header.Back onClick={handleClickBack} />} />

      <ContentBox>
        <Title
          title={"주문 확인"}
          subTitle={
            <>
              총 {products?.length}종류의 상품 {totalCount}개를 주문합니다.{" "}
              <br />
              최종 결제 금액을 확인해 주세요.
            </>
          }
        />

        <List>
          {products?.map((product) => {
            return (
              <List.Item>
                <List.Item.Left>
                  <ImgBox img={product.imgUrl} />
                </List.Item.Left>
                <List.Item.Box
                  title={product.name}
                  content={`${formatNumber(product.price)}원`}
                  description={`${product.quantity}개`}
                />
              </List.Item>
            );
          })}
        </List>

        <Button
          variant="secondary"
          size="medium"
          edge="rounded"
          block
          onClick={handleClickOpenModal}
        >
          쿠폰 적용
        </Button>

        <Title title={"배송 정보"} level={2} />

        <Checkbox
          id="isRemoteArea"
          label="제주도 및 도서 산간 지역"
          checked={isRemoteArea}
          onChange={handleChangeIsRemoteArea}
        />

        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>

        <DataInfo>
          <DataInfo.Item
            title="주문 금액"
            content={`${pricing?.orderSheetAmount}원`}
          />
          <DataInfo.Item
            title="쿠폰 할인 금액"
            content={`${pricing?.discountAmount}원`}
          />
          <DataInfo.Item title="배송비" content={`${pricing?.shippingFee}원`} />
          <DataInfo.Item
            title="총 결제 금액"
            content={`${pricing?.paymentAmount}원`}
          />
        </DataInfo>
      </ContentBox>

      <Button variant="primary" size="large" block>
        결제하기
      </Button>

      {isOpenModal && (
        <CouponModal
          couponSelection={couponSelection}
          onUpdateCouponSelection={updateCouponSelection}
          onClose={() => setIsOpenModal(false)}
        />
      )}
    </Layout>
  );
};
