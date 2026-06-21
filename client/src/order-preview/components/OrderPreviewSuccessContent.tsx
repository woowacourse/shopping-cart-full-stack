import {OrderPreviewContent} from './OrderPreviewContent.js';
import {useOrderPreviewPage} from '../hooks/useOrderPreviewPage.js';

export const OrderPreviewSuccessContent = () => {
  const {actions, content} = useOrderPreviewPage();

  if (!content.preorder || !content.orderPreview) return null;

  return (
    <OrderPreviewContent
      isRemoteArea={content.isRemoteArea}
      price={content.orderPreview.price}
      preorder={content.preorder}
      onChangeRemoteArea={actions.changeRemoteArea}
      onOpenCouponModal={actions.openCouponModal}
    />
  );
};
