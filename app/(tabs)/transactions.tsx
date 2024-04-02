import { Text, View } from 'tamagui'
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useConfig } from '../../context/config-context';

export default function Transactions() {
  const { config, setConfig } = useConfig();

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  return (
    <View flex={1} alignItems="center">
      <Text fontSize={20}>Transactions</Text>
    </View>
  )
}
