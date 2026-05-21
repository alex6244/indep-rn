import React from "react";
import { Text } from "react-native";
import { FilterSelectDropdown } from "../FilterSelectDropdown";
import {
  BODY_TYPE_OPTIONS,
  DRIVE_OPTIONS,
  ENGINE_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "./catalogFilters.constants";
import { FilterBlock } from "./catalogFilters.shared";
import { catalogFilterStyles as styles } from "./catalogFilters.styles";

type Props = {
  bodyType: string | null;
  onChangeBodyType: (value: string | null) => void;
  engineType: string | null;
  onChangeEngineType: (value: string | null) => void;
  transmissionType: string | null;
  onChangeTransmissionType: (value: string | null) => void;
  driveTypeFilter: string | null;
  onChangeDriveTypeFilter: (value: string | null) => void;
};

export function CatalogFiltersTechSection({
  bodyType,
  onChangeBodyType,
  engineType,
  onChangeEngineType,
  transmissionType,
  onChangeTransmissionType,
  driveTypeFilter,
  onChangeDriveTypeFilter,
}: Props) {
  return (
    <>
      <FilterBlock>
        <Text style={styles.filterLabel}>Кузов</Text>
        <FilterSelectDropdown
          placeholder="Кузов"
          options={[...BODY_TYPE_OPTIONS]}
          value={bodyType}
          onChange={onChangeBodyType}
        />
      </FilterBlock>

      <FilterBlock>
        <Text style={styles.filterLabel}>Двигатель</Text>
        <FilterSelectDropdown
          placeholder="Двигатель"
          options={[...ENGINE_OPTIONS]}
          value={engineType}
          onChange={onChangeEngineType}
        />
      </FilterBlock>

      <FilterBlock>
        <Text style={styles.filterLabel}>Коробка</Text>
        <FilterSelectDropdown
          placeholder="Коробка"
          options={[...TRANSMISSION_OPTIONS]}
          value={transmissionType}
          onChange={onChangeTransmissionType}
        />
      </FilterBlock>

      <FilterBlock>
        <Text style={styles.filterLabel}>Привод</Text>
        <FilterSelectDropdown
          placeholder="Привод"
          options={[...DRIVE_OPTIONS]}
          value={driveTypeFilter}
          onChange={onChangeDriveTypeFilter}
        />
      </FilterBlock>
    </>
  );
}
