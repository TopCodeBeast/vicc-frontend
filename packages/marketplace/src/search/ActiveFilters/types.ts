export type Refinement = { //TODO
  label: string;
  value: any;
  operator: string;
};

export type RefinementItem = { //TODO
  attribute: string;
  refinements: Refinement[];
  refine: (refinement: Refinement) => void;
};
