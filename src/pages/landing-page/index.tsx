import bgLandingPage from "../../assets/images/bg-landing-page.png";
import CountItem from "../../components/CountItem";
import Hero from "../../components/Hero";
import Navtop from "../../components/Navtop";
export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <Navtop />
      <div className="flex md:p-8 p-4 justify-center flex-wrap sm:gap-6 items-center">
        <div className="flex flex-col">
          <Hero />
          <div className="flex justify-between sm:px-16 md:px-28 mt-4 gap-4 items-center">
            <CountItem title="Users" count={"300+"} />
            <CountItem title="Auctions" count={"500+"} />
          </div>
        </div>
        <img
          src={bgLandingPage}
          alt="landing-page-reference"
          className="w-[40%] md:flex hidden"
        />
      </div>
    </div>
  );
}
