import { useEffect, useState } from "react";
import * as ethers from "ethers";
import {
  Gnosis,
  useEthers,
  useTokenBalance,
  useTokenAllowance,
  useContractFunction,
  ERC20Interface,
} from "@usedapp/core";

import LP_ABI from "../lpABI";
const USDT_DECIMALS = 6;
const USDT_ADDRESS = "0x4ECaBa5870353805a9F068101A40E0f32ed605C6";
const LP_ADDRESS = "0x204e7371Ade792c5C006fb52711c50a7efC843ed";
const CORE_ADDRESS = "0xC95C831c7bDb0650b8cD5F2a542b263872d8ed0e";
const USDTContract = new ethers.Contract(USDT_ADDRESS, ERC20Interface);
const lpContract = new ethers.Contract(LP_ADDRESS, LP_ABI);

export default function usePlaceBet({ outcome, onBetPlace }) {
  const [amount, setAmount] = useState("");
  const [id, setId] = useState();
  const { account, chainId } = useEthers();

  const isRightChain = Number(chainId) == Gnosis.chainId;

  const rawBalance = useTokenBalance(USDT_ADDRESS, account);
  const balance = rawBalance
    ? ethers.utils.formatUnits(rawBalance, USDT_DECIMALS)
    : "0";

  const rawAllowance = useTokenAllowance(USDT_ADDRESS, account, LP_ADDRESS);
  const isAllowanceFetching = rawAllowance === undefined;
  const allowance =
    rawAllowance && ethers.utils.formatUnits(rawAllowance, USDT_DECIMALS);
  const isApproveRequired = +allowance < +amount;

  const { state: approveState, send: _approve } = useContractFunction(
    USDTContract,
    "approve",
    { transactionName: "Approve" }
  );
  const isApproving =
    approveState.status === "PendingSignature" ||
    approveState.status === "Mining";

  const approve = () => {
    // to prevent the need to ask for approval before each bet, the user will be asked to approve a "maximum" amount
    const amount = ethers.constants.MaxUint256;

    _approve(LP_ADDRESS, amount);
  };

  const { send: _placeBet } = useContractFunction(lpContract, "bet", {
    transactionName: "Bet",
  });

  const placeBet = () => {
    const { conditionId, outcomeId, odds } = outcome;

    const slippage = 5; // 5%
    const minOdds = 1 + ((odds - 1) * (100 - slippage)) / 100; // the minimum value at which a bet should be made
    const oddsDecimals = 12; // current protocol version odds has 12 decimals
    const rawMinOdds = ethers.utils.parseUnits(
      minOdds.toFixed(oddsDecimals),
      oddsDecimals
    );

    const amountDecimals = 6; // USDT decimals
    const rawAmount = ethers.utils.parseUnits(amount, amountDecimals);

    const deadline = Math.floor(Date.now() / 1000) + 2000; // the time (in seconds) within which the transaction should be submitted
    const affiliate = "0x0000000000000000000000000000000000000000"; // your affiliate wallet address

    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint64", "uint64"],
      [conditionId, outcomeId, rawMinOdds]
    );

    _placeBet(CORE_ADDRESS, rawAmount, deadline, {
      affiliate,
      data,
    });

    onBetPlace();
  };

  return {
    isRightChain,
    balance,
    amount,
    setAmount,
    isAllowanceFetching,
    isApproveRequired,
    approve,
    isApproving,
    placeBet,
  };
}
