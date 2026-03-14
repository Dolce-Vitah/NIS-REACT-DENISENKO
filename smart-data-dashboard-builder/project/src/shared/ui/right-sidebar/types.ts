import type { SxProps, Theme } from '@mui/material';
import type { DatasetRecord } from '../../../entities/dataset/types';
import type {
  KpiWidgetConfig,
  TableWidgetConfig,
  BarWidgetConfig,
  PieWidgetConfig,
  ThreeWidgetConfig,
  LineWidgetConfig,
  ThreeScatterWidgetConfig,
  ThreeSurfaceWidgetConfig,
  WidgetConfig,
  WidgetStyleConfig,
} from '../../../entities/widget/types';

export type SideTab = 'widget' | 'style' | 'filters';

export type SectionSx = SxProps<Theme>;

export type SidebarWidgetHandlers = {
  setWidgetTitle: (id: string, title: string) => void;
  updateKpiWidget: (
    id: string,
    patch: Partial<
      Pick<KpiWidgetConfig, 'aggregation' | 'valueField' | 'comparisonField' | 'comparisonValue'>
    >
  ) => void;
  updateTableWidget: (
    id: string,
    patch: Partial<Pick<TableWidgetConfig, 'columns' | 'limit'>>
  ) => void;
  updateBarWidget: (
    id: string,
    patch: Partial<Pick<BarWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateLineWidget: (
    id: string,
    patch: Partial<Pick<LineWidgetConfig, 'xField' | 'yField'>>
  ) => void;
  updatePieWidget: (
    id: string,
    patch: Partial<Pick<PieWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateThreeWidget: (
    id: string,
    patch: Partial<Pick<ThreeWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateThreeScatterWidget: (
    id: string,
    patch: Partial<Pick<ThreeScatterWidgetConfig, 'xField' | 'yField' | 'zField' | 'categoryField'>>
  ) => void;
  updateThreeSurfaceWidget: (
    id: string,
    patch: Partial<Pick<ThreeSurfaceWidgetConfig, 'xField' | 'yField' | 'zField'>>
  ) => void;
  updateWidgetStyle: (id: string, patch: Partial<WidgetStyleConfig>) => void;
};

export type WidgetTabContentProps = {
  ru: boolean;
  active?: WidgetConfig;
  sectionSx: SectionSx;
  showNoNumericHint: boolean;
  allColumns: string[];
  numericColumns: string[];
  categoryColumns: string[];
  rows: DatasetRecord[];
  showMoreOptions: boolean;
  hasSecondaryOptions: boolean;
  setShowMoreOptions: (next: boolean) => void;
  resetWidgetSettings: () => void;
  handlers: SidebarWidgetHandlers;
};
