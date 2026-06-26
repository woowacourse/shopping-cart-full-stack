import { useCallback, type PropsWithChildren } from "react";

import CreatePortal from "../components/CreatePortal";
import ModalContext from "../context";
import getQueue from "../core";
import { useFlush } from "../hooks/useFlush";

export default function ModalProvider({ children }: PropsWithChildren) {
  const Queue = getQueue();
  const { flush, dummyKey } = useFlush();

  const addModal = useCallback(
    (modalComponent: React.ReactNode) => {
      Queue.enqueue(modalComponent);
      flush();
    },
    [Queue, flush],
  );

  const closeModal = useCallback(() => {
    Queue.dequeue();
    flush();
  }, [Queue, flush]);

  const value = { addModal, closeModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <CreatePortal key={dummyKey} />
    </ModalContext.Provider>
  );
}
