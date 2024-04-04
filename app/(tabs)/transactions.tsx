import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';
import { ExternalLink } from '@tamagui/lucide-icons';
import { Link, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Button, Separator, Text, View } from 'tamagui';

import SelectItems from '../../components/select-items';
import { useAuthorization } from '../../utils/useAuthorization';

export default function Transactions() {
  const { selectedAccount } = useAuthorization();
  const [refreshing, setRefreshing] = useState(false);
  const [txs, setTxs] = useState<ConfirmedSignatureInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [network, setNetwork] = useState<'mainnet-beta' | 'devnet' | 'testnet'>(
    'mainnet-beta'
  );

  useEffect(() => {
    if (selectedAccount) {
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const publicKey = new PublicKey(selectedAccount?.publicKey.toBase58());

      const fetchTransactions = async () => {
        try {
          setRefreshing(true);
          const transactions =
            await connection.getConfirmedSignaturesForAddress2(publicKey, {
              limit,
            });
          setTxs(transactions);
        } catch (error) {
          setError(error as string);
          console.log(error);
        } finally {
          setRefreshing(false);
        }
      };

      fetchTransactions();
    }
  }, [network, limit, selectedAccount]);

  const renderTxs = ({ item }: { item: ConfirmedSignatureInfo }) => {
    return (
      <>
        <Transaction item={item} network={network} />
        <Separator />
      </>
    );
  };

  return (
    <View flex={1}>
      <View
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <View width="48%">
          <SelectItems
            label="Network"
            items={networkItems}
            onValueChange={(value) =>
              setNetwork(value as 'mainnet-beta' | 'devnet' | 'testnet')
            }
          />
        </View>
        <View width="48%">
          <SelectItems
            label="Limit"
            items={limitItems}
            onValueChange={(value) => setLimit(parseInt(value))}
          />
        </View>
      </View>
      {txs.length === 0 && !refreshing && !error && (
        <>
          <Text margin="$5" fontSize="$6" textAlign="center">
            No transaction on {network} found
          </Text>
          <Text margin="$5" fontSize="$6" textAlign="center">
            ꃋᴖꃋ
          </Text>
        </>
      )}
      <FlatList
        data={txs}
        renderItem={renderTxs}
        keyExtractor={(item) => item.signature}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        style={{
          marginTop: 10,
        }}
      />
    </View>
  );
}

const Transaction = ({
  item,
  network,
}: {
  item: ConfirmedSignatureInfo;
  network: 'mainnet-beta' | 'devnet' | 'testnet';
}) => {
  return (
    <Link
      href={{
        pathname: '/[signature]',
        params: { signature: item.signature, network: network },
      }}
      asChild
    >
      <Button
        key={item.signature}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="$3"
        backgroundColor="$background0"
        borderRadius={0}
      >
        <Text fontSize="$3" fontFamily="$mono">
          {item.signature.split('').slice(0, 30).join('')}...
        </Text>
        <ExternalLink size={20} />
      </Button>
    </Link>
  );
};

const networkItems = [
  {
    label: 'Main Network',
    value: 'mainnet-beta',
  },
  {
    label: 'Dev Network',
    value: 'devnet',
  },
  {
    label: 'Test Network',
    value: 'testnet',
  },
];

const limitItems = [
  {
    label: '20',
    value: 20,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
];
