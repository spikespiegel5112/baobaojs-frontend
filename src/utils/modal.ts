import type { ModalFuncProps } from "antd/es/modal/interface";

let modalInstance: ModalFuncProps;

export const setMessageInstance = (instance: ModalFuncProps) => {
  modalInstance = instance;
};

export const modal = {
  onOk: (content: string) => modalInstance?.onOk?.(content),
  onCancel: (content: string) => modalInstance?.onCancel?.(content),
  confirm: (content: string) => modalInstance?.confirm?.(content),
};
