import React from "react";
import type { Report } from "../../../../entities/report/types";
import { CostEstimationCard } from "../../../../widgets/reports/CostEstimationCard";
import { PenaltiesCard } from "../../../../widgets/reports/PenaltiesCard";

type Props = {
  report?: Report;
};

export function ConfirmReportCardsSection({ report }: Props) {
  if (!report) {
    return null;
  }

  return (
    <>
      <PenaltiesCard report={report} />
      <CostEstimationCard report={report} />
    </>
  );
}
