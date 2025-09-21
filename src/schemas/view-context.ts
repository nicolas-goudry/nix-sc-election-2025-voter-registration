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

interface ErrorAction {
  url: string;
  text: string;
  icon: {
    name: string;
    family?: string;
  }
}

export interface ErrorViewContext {
  title: string;
  message: string;
  details?: string;
  actions?: ErrorAction[];
}
