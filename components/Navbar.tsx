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
      <nav className="w-full h-16 mt-auto px-2 md:px-4  pb-3 bg-blue-200">
        <div className="flex flex-row justify-between items-center h-full">
          <Link href="/" passHref>
            <span className="font-bold sm:text-xl  md:text-2xl cursor-pointer ">
              {pathname && pathname.includes("polymarket") ? (
                <p>Polymarket</p>
              ) : (
                <p>Betlify</p>
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
        className={`sm:text-sm md:text-lg md:p-2 m-1 md:m-2 flex items-center hover:bg-blue-100  hover:text-gray-700 cursor-pointer ${
          isActive
            ? "text-black md:text-lg  font-semibold"
            : "text-gray-500 sm:text-sm lg:text-lg "
        } `}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
