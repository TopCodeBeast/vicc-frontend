import {
  RefineList as RefineListBase,
  RefineListProps as RefineListBaseProps,
} from '@sorare/core/src/components/search/RefineList';

export type RefineListProps = RefineListBaseProps;

export const RefineList = ({
  attribute,
  searchable = false,
  ...baseProps
}: RefineListProps) => {
  return (
    <RefineListBase
      attribute={attribute}
      searchable={searchable}
      {...baseProps}
    />
  );
};

export default RefineList;
