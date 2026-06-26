import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useExecute } from "@/services/core/useExecute";

import { patchOrderSheetShippingArea } from "@/services/apis/orderSheets/repository";

interface Props {
  onUpdate: () => void;
}

export const useOrderSheetIsRemoteArea = ({ onUpdate }: Props) => {
  const { id } = useParams<{ id: string }>();

  const { mutate: updateIsRemoteAreaMutate } = useExecute({
    executeFn: useCallback(
      async (isRemoteArea: boolean) => {
        return await patchOrderSheetShippingArea({
          id: Number(id),
          isRemoteArea,
        });
      },
      [id],
    ),
    onSuccess: () => {
      onUpdate();
    },
  });

  return {
    updateIsRemoteAreaMutate,
  };
};
