"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "../authform";
import InfoForm from "../infoform";
import QuestionForm from "../questionform";
import SEPAForm from "../sepaform";
import FinalForm from "../finalform";
import { useAppDispatch } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { questionActions } from "@/store/reducers/questionReducer";
import Stepper from "@/layout/stepper";
import { getClubInfo } from "@/actions/joinclub";
import { useMediaQuery } from "usehooks-ts";

const SignUpClubPage = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    (async () => {
      const clubID = searchParams.get("clubID");

      const result = await getClubInfo({ clubID: clubID });

      if (result.success) {
        dispatch(clubActions.setClub({ club: result.club }));
        dispatch(questionActions.setQuestion({ question: result.question }));
      }
    })();
  }, [dispatch, searchParams]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <AuthForm setActiveStep={setActiveStep} />;
      case 2:
        return <InfoForm setActiveStep={setActiveStep} />;
      case 3:
        return <QuestionForm setActiveStep={setActiveStep} />;
      case 4:
        return <SEPAForm setActiveStep={setActiveStep} />;
      case 5:
        return <FinalForm />;
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      {!isMobile ? (
        <div
          className="w-full flex justify-between"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {getStepContent(activeStep)}
          <Stepper activeStep={activeStep} />
        </div>
      ) : (
        <div className="w-full" style={{ height: "calc(100vh - 64px)" }}>
          <Stepper activeStep={activeStep} />
          {getStepContent(activeStep)}
        </div>
      )}
    </>
  );
};

export default SignUpClubPage;
