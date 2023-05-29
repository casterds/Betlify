import { gql, useQuery } from "@apollo/client";
import { useEthers } from "@usedapp/core";

const QUERY = `
  query BetsHistory($first: Int, $where: Bet_filter!) {
    bets(
      first: $first,
      orderBy: createdBlockTimestamp,
      orderDirection: desc,
      where: $where,
      subgraphError: allow
    ) {
      id
      betId
      amount
      potentialPayout
      status
      isRedeemed
      odds
      createdAt: createdBlockTimestamp
      txHash: createdTxHash
      outcome {
        id
        outcomeId
        condition {
          id
          conditionId
          wonOutcome {
            outcomeId
          }
          core {
            address
            liquidityPool {
              address
            }
          }
        }
      }
      game {
        id
        sport {
          name
        }
        league {
          name
          country {
            name
          }
        }
        participants {
          name
          image
        }
        startsAt
      }
    }
  }
`;

export default function useBetsHistory() {
  const account = "0xB6C29Ae4AF0F1a221915D7E368C3fdda4934f177";

  return useQuery(
    gql`
      ${QUERY}
    `,
    {
      variables: {
        first: 10,
        where: {
          actor: account?.toLowerCase(),
        },
      },
      skip: !account,
    }
  );
}
