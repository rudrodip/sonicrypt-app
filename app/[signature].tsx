
import { useLocalSearchParams } from 'expo-router';
import { Text, View, Spinner } from 'tamagui';
import { useEffect, useState } from 'react';
import {
  Connection,
  clusterApiUrl,
  ParsedTransactionWithMeta
} from "@solana/web3.js";

export default function Page() {
  const { signature, network } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [txDetails, setTxDetails] = useState<ParsedTransactionWithMeta | null>(null);

  const connection = new Connection(clusterApiUrl(network as "mainnet-beta" | "testnet" | "devnet"), "confirmed");

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      const details = await connection.getParsedTransaction(signature as string, "confirmed");
      setTxDetails(details);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!signature) return;
    fetchTransactionDetails();
  }, [signature, network]);

  return (
    <View flex={1} alignItems='center'>
      <Text>Signature: {signature}</Text>
      <Text>Network: {network}</Text>
      {loading && <Spinner size="large" color="$color" />}
    </View>
  );
}
