export interface HomeViewContext {
  periods: {
    registration: string;
    voting: string;
  },
  eligibilityRules: {
    commits: string;
    merges: string;
    period: string;
  },
}

export interface ErrorViewContext {
  title: string;
  message: string;
  details?: string;
  enableReport?: boolean;
}
