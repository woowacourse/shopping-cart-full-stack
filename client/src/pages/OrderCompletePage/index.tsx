import PageLayout from "@components/common/shared/PageLayout";
import Header from "@components/common/shared/Header";
import OrderConfirmSection from "@components/feature/OrderConfirmSection";
import GoCartButton from "@components/feature/GoCartButton";

export default function OrderCompletePage() {
  return (
    <PageLayout>
      <Header />
      <OrderConfirmSection />
      <GoCartButton />
    </PageLayout>
  );
}
