enum WorkflowVersions {
  V_2 = '2',
  V_3 = '3',
  V_4 = '4',
}

export const SIGNUP_WORKFLOW_VERSION_QUERY_PARAMETER = 'version';

export const isVersion2OrGreater = (version: string | undefined) =>
  version === WorkflowVersions.V_2 ||
  version === WorkflowVersions.V_3 ||
  version === WorkflowVersions.V_4;

export const isVersion4OrGreater = (version: string | undefined) =>
  version === WorkflowVersions.V_4;
