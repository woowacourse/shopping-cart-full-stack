import { useState } from 'react';
import { selectRemoteArea } from '../apis/orderCheckApi';

const useRemoteArea = (onChanged: () => void) => {
  const [isSelected, setIsSelected] = useState(false);

  const toggle = async () => {
    try {
      setIsSelected(await selectRemoteArea(!isSelected));
      onChanged();
    } catch (error) {
      console.error(error);
      alert('도서 산간 지역 선택에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return { isSelected, toggle };
};

export default useRemoteArea;
