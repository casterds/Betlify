import { useState } from "react";
import * as ethers from "ethers";
import {
  Gnosis,
  useEthers,
  useTokenBalance,
  useTokenAllowance,
  useContractFunction,
  ERC20Interface,
} from "@usedapp/core";

import AzuroABI from "../abis/AzuroBet.json";
const WXDAI_DECIMALS = 18;
const WXDAI_ADDRESS = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";
const AzuroBet_Address = "0xB6C29Ae4AF0F1a221915D7E368C3fdda4934f177";
const WXDAIContract = new ethers.Contract(WXDAI_ADDRESS, ERC20Interface);
const AzuroContract = new ethers.Contract(AzuroBet_Address, AzuroABI.abi);

export default function usePlaceBet({ outcome, onBetPlace }) {
  const [amount, setAmount] = useState("");
  const { account, chainId } = useEthers();

  const isRightChain = Number(chainId) == Gnosis.chainId;

  const rawBalance = useTokenBalance(WXDAI_ADDRESS, account);
  const balance = rawBalance
    ? ethers.utils.formatUnits(rawBalance, WXDAI_DECIMALS)
    : "0";

  const rawAllowance = useTokenAllowance(
    WXDAI_ADDRESS,
    account,
    AzuroBet_Address
  );
  const isAllowanceFetching = rawAllowance === undefined;
  const allowance =
    rawAllowance && ethers.utils.formatUnits(rawAllowance, WXDAI_DECIMALS);
  const isApproveRequired = +allowance < +amount;

  const { state: approveState, send: _approve } = useContractFunction(
    WXDAIContract,
    "approve",
    { transactionName: "Approve" }
  );
  const isApproving =
    approveState.status === "PendingSignature" ||
    approveState.status === "Mining";

  const approve = () => {
    // to prevent the need to ask for approval before each bet, the user will be asked to approve a "maximum" amount
    const amount = ethers.constants.MaxUint256;

    _approve(AzuroBet_Address, amount);
  };

  const { send: _placeBet } = useContractFunction(AzuroContract, "bet", {
    transactionName: "Bet",
  });

  const placeBet = async () => {
    const { conditionId, outcomeId, odds } = outcome;

    const slippage = 5; // 5%
    const minOdds = 1 + ((odds - 1) * (100 - slippage)) / 100; // the minimum value at which a bet should be made
    const oddsDecimals = 12; // current protocol version odds has 12 decimals
    const rawMinOdds = ethers.utils.parseUnits(
      minOdds.toFixed(oddsDecimals),
      oddsDecimals
    );

    const amountDecimals = 18; // USDT decimals
    const rawAmount = ethers.utils.parseUnits(amount, amountDecimals);

    const deadline = Math.floor(Date.now() / 1000) + 2000; // the time (in seconds) within which the transaction should be submitted
    const affiliate = "0x4639155fb94e983a13f76be68845012f7eDCA46f"; // your affiliate wallet address

    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint64", "uint64"],
      [conditionId, outcomeId, rawMinOdds]
    );

    _placeBet(rawAmount, deadline, {
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
