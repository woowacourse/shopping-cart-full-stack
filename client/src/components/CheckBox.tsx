import styled from '@emotion/styled';
import CheckGray from '../../public/CheckGray.svg';
import CheckWhite from '../../public/CheckWhite.svg';

interface CheckBoxProps {
    checked: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

// 만들다보니 그냥 배경까지 포함한 이미지를 조건부로 보여주면 될 것 같은데, 직접 구현 방식이 귀찮기도 하고 체크 아이콘과 배경 상태를 따로 동기화해주기 때문에 더 불안정한 느낌
// 그리고 생각해보니 input으로 해야함;;
export default function CheckBox({ checked, onClick, disabled = false }: CheckBoxProps) {
    return (
        <CheckBoxContainer checked={checked} onClick={onClick} disabled={disabled}>
            <CheckIcon src={checked ? CheckWhite : CheckGray} />
        </CheckBoxContainer>
    );
}

const CheckBoxContainer = styled.button<{ checked: boolean }>`
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-color: ${({ checked }) => (checked ? '#000000' : '#ffffff')};
    border: ${({ checked }) => (checked ? 'none' : '1px solid #0000001A')};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
    }
`;

const CheckIcon = styled.img``;
