import styled from "@emotion/styled";
import { formatToKoreanPrice } from "../utils";

export default function PriceSummary({
  rows,
  total,
}: {
  rows: { label: string; value: number }[];
  total: { label: string; value: number };
}) {
  return (
    <PriceSummaryContainer>
      <PriceSummaryList>
        {rows.map((row) => {
          return (
            <div className="receipt-item">
              <dt>{row.label}</dt>
              <dd>{formatToKoreanPrice(row.value)}</dd>
            </div>
          );
        })}
      </PriceSummaryList>
      <PriceSummaryResult>
        <div className="receipt-item">
          <dt>{total.label}</dt>
          <dd>{formatToKoreanPrice(total.value)}</dd>
        </div>
      </PriceSummaryResult>
    </PriceSummaryContainer>
  );
}

const PriceSummaryContainer = styled.div`
  width: 100%;
`;

const PriceSummaryList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-top: 1px solid #0000001a;
  padding: 1.5rem 0;
  margin: 0;
  .receipt-item {
    display: flex;
    justify-content: space-between;

    dt {
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
    }
    dd {
      font-weight: 700;
      font-style: Bold;
      font-size: 24px;
    }
  }
`;

const PriceSummaryResult = styled(PriceSummaryList)``;
