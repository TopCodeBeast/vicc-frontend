export type Refinement = {
  label: string;
  value: any;
  operator: string;
};

export type RefinementItem = {
  attribute: string;
  refinements: Refinement[];
  refine: (refinement: Refinement) => void;
};
