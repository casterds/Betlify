import dayjs from "dayjs";
import useSportEvent from "../../hooks/useSportEvent";
import { League, Participants, Sport } from "..";
import { useState } from "react";
import PlaceBetModal from "../../components/PlaceBetModal";

export type Game = {
  sport: Sport;
  league: League;
  participants: Participants[];
  startsAt: string;
};

const ParticipantLogo = ({ image, name }: Participants) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-full">
      <img className="w-12 h-12" src={image} alt={name} />
    </div>
    <span className="max-w-[210px] mt-3 text-lg text-center">{name}</span>
  </div>
);

const GameInfo = ({ sport, league, participants, startsAt }: Game) => (
  <div className="flex flex-col items-center pt-6 pb-8 border border-gray-300 rounded-lg">
    <div className="flex flex-col items-center text-md">
      <div>{sport.name}</div>
      <div className="mt-2 text-gray-500">
        {league.country.name} &middot; {league.name}
      </div>
    </div>
    <div className="mt-5 grid lg:grid-cols-[1fr_auto_1fr]">
      <ParticipantLogo {...participants[0]} />
      <div className="mx-5 pt-7 text-md text-gray-500">
        {dayjs(Number(startsAt) * 1000).format("DD MMM HH:mm")}
      </div>
      <ParticipantLogo {...participants[1]} />
    </div>
  </div>
);

const Markets = ({ game, markets }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  const handleOutcomeClick = (outcome) => {
    setSelectedOutcome(outcome);
  };

  const handleModalClose = () => {
    setSelectedOutcome(null);
  };

  return (
    <>
      <div className="max-w-[600px] mx-auto mt-12 space-y-6">
        {markets.map(({ marketName, outcomes: row }) => (
          <div key={marketName} className="">
            <div className="mb-2 font-semibold">{marketName}</div>
            <div className="space-y-1">
              {row.map((outcomes, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-1 w-full">
                    {outcomes.map((outcome) => (
                      <div
                        key={outcome.selectionName}
                        className="bg-gradient-to-r from-cyan-100 to-blue-100 hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-300 flex justify-between py-2 px-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition"
                        style={{ width: `calc(100% / ${outcomes.length})` }}
                        onClick={() => handleOutcomeClick(outcome)}
                      >
                        <span className="text-gray-500">
                          {outcome.selectionName}
                        </span>
                        <span className="font-medium">
                          {parseFloat(outcome.odds).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {Boolean(selectedOutcome) && (
        <PlaceBetModal
          game={game}
          outcome={selectedOutcome}
          closeModal={handleModalClose}
        />
      )}
    </>
  );
};

export default function Game() {
  const { loading, game, markets } = useSportEvent();

  if (loading) {
    return (
      <div className="flex justify-center text-2xl items-center pt-4">
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="px-2">
        <GameInfo {...game} />
        <Markets game={game} markets={markets} />
      </div>
    </main>
  );
}
