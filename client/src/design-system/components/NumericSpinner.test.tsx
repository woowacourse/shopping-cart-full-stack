import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {NumericSpinner} from './NumericSpinner.js';

describe('NumericSpinner', () => {
  test('현재 숫자를 보여준다', () => {
    render(<NumericSpinner min={1} max={99} onChange={jest.fn()} value={2} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('증가 버튼을 누르면 현재 값보다 1 큰 값을 전달한다', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<NumericSpinner min={1} max={99} onChange={onChange} value={2} />);

    await user.click(screen.getByRole('button', {name: '+'}));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('감소 버튼을 누르면 현재 값보다 1 작은 값을 전달한다', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<NumericSpinner min={1} max={99} onChange={onChange} value={2} />);

    await user.click(screen.getByRole('button', {name: '-'}));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  test('최솟값이면 감소 버튼을 비활성화한다', () => {
    render(<NumericSpinner min={1} max={99} onChange={jest.fn()} value={1} />);

    expect(screen.getByRole('button', {name: '-'})).toBeDisabled();
    expect(screen.getByRole('button', {name: '+'})).toBeEnabled();
  });

  test('최댓값이면 증가 버튼을 비활성화한다', () => {
    render(<NumericSpinner min={1} max={99} onChange={jest.fn()} value={99} />);

    expect(screen.getByRole('button', {name: '-'})).toBeEnabled();
    expect(screen.getByRole('button', {name: '+'})).toBeDisabled();
  });

  test('비활성 상태이면 증가와 감소 버튼을 모두 비활성화한다', () => {
    render(<NumericSpinner disabled min={1} max={99} onChange={jest.fn()} value={2} />);

    expect(screen.getByRole('button', {name: '-'})).toBeDisabled();
    expect(screen.getByRole('button', {name: '+'})).toBeDisabled();
  });
});
