const WelcomePage = () => {
  return (
    <div className="self-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-8 mx-auto laptop:max-w-none tablet:space-y-4">
        <div className="flex flex-col space-y-6 tablet:space-y-3">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Deine Registrierung ist abgeschlossen
          </h1>
          <p className="text-content mobile:text-sm">
            Bitte prüfe den E-Mail Posteingang um Deine E-Mail Adresse zu
            bestätigen
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
