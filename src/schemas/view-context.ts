import { UserEligibility } from '../plugins/app/registration-manager'

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

export interface RegisterViewContext {
  electionForkSourceRepo?: string;
  eligibility?: UserEligibility;
  installApp?: string;
  isAppInstalled?: boolean,
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
