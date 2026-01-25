import { mockCteData } from "../moc/mocCTE";
import { badgeColorsByPriority } from "../utils/BadgeColorStats";

export function LastCTEs() {
  const lastCTEs = mockCteData.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
      <h2 className="text-lg font-semibold">Ultimas Ocorrências</h2>
      <ul>
        {lastCTEs.map((cte, index) => (
          <li key={index} className="flex flex-col gap-4 mt-4">
            <div className="flex bg-zinc-50 items-center justify-between rounded-lg ">
              <div className="flex flex-col py-3 px-4">
                <span className="text-md font-bold">{cte.numberCTE}</span>
                <span className="text-sm">{cte.clientName}</span>
              </div>
              <div className="flex flex-col items-end justify-end w-40 gap-1 pr-4">
                <span
                  className={` text-xs py-0.5 px-2 rounded-full
                    ${badgeColorsByPriority[cte.priority]} 
                    ${
                      cte.priority != "Urgente" ? "text-gray-500" : "text-white"
                    }`}
                >
                  {cte.priority}
                </span>
                <span className="text-xs">{cte.cause}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
