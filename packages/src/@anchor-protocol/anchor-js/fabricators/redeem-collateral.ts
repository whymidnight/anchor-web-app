import { Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../utils/validation/address';
import { validateInput } from '../utils/validate-input';

import { validateWhitelistedMarket } from '../utils/validation/market';
import { validateTrue } from '../utils/validation/true';
import { validateIsGreaterThanZero } from '../utils/validation/number';

interface Option {
  address: string;
  market: string;
  borrower?: string;
  // symbol: string,
  redeem_all: boolean;
  amount: number | null;
}

/**
 *
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to redeem collateral.
 * @param symbol Symbol of collateral to redeem.
 * @param redeem_all Set this to true to redeem all symbol collateral deposited to loan_id.
 * @param amount (optional) Amount of collateral to redeem. Set this to null if redeem_all is true.
 * @param withdraw_to (optional) Terra address to withdraw redeemed collateral. If null, withdraws to address.
 */
export const fabricateRedeemCollateral = ({
  address,
  market,
  redeem_all = true,
  amount = null,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateWhitelistedMarket(market),
    amount ? validateIsGreaterThanZero(amount) : validateTrue,
    // borrower ? validateAddress(borrower) : validateTrue,
    // validateWhitelistedBAsset(symbol),
  ]);

  const mmOverseerContract = addressProvider.overseer(market.toLowerCase());
  const custodyContract = addressProvider.custody(market.toLocaleLowerCase());

  return [
    // unlock collateral
    new MsgExecuteContract(address, mmOverseerContract, {
      unlock_collateral: [
        [
          address,
          redeem_all ? undefined : new Int(amount as number).toString(),
        ],
      ],
    }),

    // withdraw from custody
    new MsgExecuteContract(address, custodyContract, {
      withdraw_collateral: {
        amount: redeem_all ? undefined : amount,
      },
    }),
  ];
};