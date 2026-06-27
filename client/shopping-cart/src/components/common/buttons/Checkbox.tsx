import { CheckIcon } from '../../icons/CheckIcon';
import IconButton from './IconButton';

type Props = {
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

const Checkbox = ({ isSelected, onToggle, disabled }: Props) => {
  return (
    <IconButton onClick={onToggle} isActive={isSelected} disabled={disabled}>
      <CheckIcon isActive={isSelected} />
    </IconButton>
  );
};

export default Checkbox;
