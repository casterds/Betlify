// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./interfaces/IBet.sol";
import "./interfaces/ILP.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract AzuroBet {
    ILP public lp = ILP(0x204e7371Ade792c5C006fb52711c50a7efC843ed);
    address public core = 0xC95C831c7bDb0650b8cD5F2a542b263872d8ed0e;
    address public WXDAI = 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d;

    function bet(
        uint128 amount,
        uint64 expiresAt,
        IBet.BetData memory betData
    ) public {
        TransferHelper.safeTransferFrom(
            WXDAI,
            msg.sender,
            address(this),
            amount
        );

        TransferHelper.safeApprove(WXDAI, address(lp), amount);
        lp.bet(core, amount, expiresAt, betData);
    }
}
