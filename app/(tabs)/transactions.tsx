import {
  Text,
  View,
  ScrollView,
  ListItem,
  Separator,
  XStack,
  YGroup,
  Spinner,
} from "tamagui";
import { FlatList } from "react-native";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta
} from "@solana/web3.js";
import { useConfig } from "../../context/config-context";
import { useEffect, useState } from "react";

export default function Transactions() {
  const { config } = useConfig();
  const [txs, setTxs] = useState<(ParsedTransactionWithMeta | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [network, setNetwork] = useState<"mainnet-beta" | "devnet" | "testnet">(
    "devnet"
  );

  const connection = new Connection(clusterApiUrl(network), "confirmed");
  // const publicKey = new PublicKey(config.walletAddress);
  const publicKey = new PublicKey(
    "7LwsCzvPoJJD8d15yiH9D411RPpQJTb3QTePR7HgBQKH"
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const transactions = await connection.getConfirmedSignaturesForAddress2(
        publicKey,
        {
          limit,
        }
      );
      const parsedTransactions = await Promise.all(transactions.map(async (tx) => {
        return await connection.getParsedTransaction(tx.signature, { commitment: "confirmed" });
      }));
      setTxs(parsedTransactions);
    } catch (error) {
      setError(error as string);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderTxs = ({ item }: { item: ParsedTransactionWithMeta }) => {
    return (
      <View>
        <Text>helo</Text>
      </View>
    );
  };

  return (
    <View flex={1}>
      {loading && (
        <View
          flex={1}
          display="flex"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
        >
          <Spinner size="large" />
        </View>
      )}
      <FlatList
        data={txs.filter((tx) => tx !== null) as ParsedTransactionWithMeta[]}
        renderItem={renderTxs}
        keyExtractor={(item) => item.transaction.message.recentBlockhash}
        refreshing={loading}
        onRefresh={fetchTransactions}
      />
    </View>
  );
}
