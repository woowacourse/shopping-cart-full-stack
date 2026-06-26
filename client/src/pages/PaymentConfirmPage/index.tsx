import PageLayout from "@components/common/shared/layout/PageLayout";
import PositionBottom from "@components/common/shared/layout/PositionBottom";
import Header from "@components/common/shared/ui/Header";
import GoCartsButton from "@components/feature/pages/paymentConfirm/GoCartsButton";
import PaymentConfirmSection from "@components/feature/pages/paymentConfirm/PaymentConfirmSection";
import GoBackButton from "@components/feature/widgets/GoBackButton";

export default function PaymentConfirmPage() {
  return (
    <PageLayout>
      <Header LeftComponent={<GoBackButton />} />
      <PaymentConfirmSection />
      <PositionBottom>
        <GoCartsButton />
      </PositionBottom>
    </PageLayout>
  );
}
