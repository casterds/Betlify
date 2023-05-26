import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useData } from "../contexts/DataContext";
import { ConnectButton } from "../pages/_app";

function Navbar() {
  const router = useRouter();
  const { account, loadWeb3 } = useData();
  const { pathname } = useRouter();
  const [routeTitle, setRouteTitle] = useState();

  useEffect(() => {
    if (pathname) {
      if (pathname.includes("polymarket")) {
        setRouteTitle("Go to Azuro Betting Platform");
      } else {
        setRouteTitle("Go to polymarket (be on polygon mumbai)");
      }
    }
  }, [pathname]);

  return (
    <>
      <nav className="w-full h-16 mt-auto px-4">
        <div className="flex flex-row justify-between items-center h-full">
          <Link href="/" passHref>
            <span className="font-semibold text-xl cursor-pointer">
              {pathname && pathname.includes("polymarket") ? (
                <p>Polymarket</p>
              ) : (
                <p>Azuro Betting Website</p>
              )}
            </span>
          </Link>
          {!router.asPath.includes("/market") &&
            !router.asPath.includes("/admin") && (
              <div>
                {routeTitle == "Go to Azuro Betting Platform" ? (
                  <div className="flex flex-row items-center justify-center h-full">
                    <TabButton
                      title="Market"
                      isActive={router.asPath === "/polymarket"}
                      url={"/polymarket"}
                    />
                    <TabButton
                      title="Portfolio"
                      isActive={router.asPath === "/polymarket/portfolio"}
                      url={"/polymarket/portfolio"}
                    />
                    <TabButton
                      title={routeTitle && routeTitle}
                      isActive={router.asPath === "/"}
                      url={"/"}
                    />
                  </div>
                ) : (
                  <div className="flex flex-row items-center justify-center h-full">
                    <TabButton
                      title="Events"
                      isActive={router.asPath === "/"}
                      url={"/"}
                    />
                    <TabButton
                      title="Bets History"
                      isActive={router.asPath === "/bets-history"}
                      url={"/bets-history"}
                    />
                    <TabButton
                      title={routeTitle && routeTitle}
                      isActive={router.asPath === "/polymarket"}
                      url={"/polymarket"}
                    />
                  </div>
                )}
              </div>
            )}

          <ConnectButton />
        </div>
      </nav>
    </>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${
          isActive
            ? "border-blue-700 text-blue-700 text-lg font-semibold"
            : "border-white text-gray-400 text-lg"
        }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
