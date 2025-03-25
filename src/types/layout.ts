export interface BreadCrumbPropsInterface {
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SidebarPropsInterface {
  isMobile: boolean;
  isToggle: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUpdates: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StepperPropsInterface {
  activeStep: number;
}
