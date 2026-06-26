import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface QuantitySlotProps {
    children: ReactNode;
}

export default function QuantitySlot({ children }: QuantitySlotProps) {
    return <QuantitySlotStyle>{children}</QuantitySlotStyle>;
}

const QuantitySlotStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 4.5px;
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
`;
