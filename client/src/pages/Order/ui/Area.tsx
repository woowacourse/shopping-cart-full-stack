import Flex from '../../../shared/layout/Flex';
import Checkbox from '../../../shared/ui/CheckBox';
import Txt from '../../../shared/ui/Txt';

type AreaProps = {
  isRemoteArea: boolean;
  onChange: (isRemoteArea: boolean) => void;
};

export default function Area({ isRemoteArea, onChange }: AreaProps) {
  return (
    <Flex direction="column" gap={16}>
      <Txt variant="button" color="text">
        배송 정보
      </Txt>
      <Checkbox
        checked={isRemoteArea}
        onChange={onChange}
      >
        <Txt variant="label" color="text">
          제주도 및 도서 산간 지역
        </Txt>
      </Checkbox>
    </Flex>
  );
}
