import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Common/Modal',
  component: Modal,
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '쿠폰을 선택해 주세요',
    children: <p>모달 내용이 여기에 들어갑니다.</p>,
  },
};

export const Toggleable: Story = {
  args: { title: '쿠폰을 선택해 주세요' },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>모달 열기</button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>모달 내용이 여기에 들어갑니다.</p>
        </Modal>
      </>
    );
  },
};
