import { Layout } from "@/core/components/Layout";
import { Header } from "@/core/components/Header";
import { Button } from "@/core/components/Button";
import { Notice } from "@/core/components/Notice";

export const PaymentReview = () => {
  return (
    <Layout>
      <Header></Header>
      <Notice>
        결제 확인
        <br />
        <br />
        총 1종류의 상품 2개를 주문했습니다.
        <br />
        최종 결제 금액을 확인해 주세요.
        <br />
        <br />
        총 결제 금액
        <br />
        70,000원
      </Notice>
      <Button variant="primary" size="large" block>
        장바구니로 돌아가기
      </Button>
    </Layout>
  );
};
