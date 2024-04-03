import {
  Button,
  ScrollView,
  Text,
  View,
  Accordion,
  Square,
  Separator,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Dimensions, ToastAndroid } from "react-native";
import { useAuthorization } from "../../utils/useAuthorization";
import { useConfig } from "../../context/config-context";
import { Link } from "expo-router";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { ellipsify } from "../../utils/ellipsify";
import { Clipboard as ClipboardIcon, ChevronDown } from "@tamagui/lucide-icons";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import SelectItems from "../../components/select-items";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

type Network = "mainnet-beta" | "devnet" | "testnet";

type TxDetails = {
  sender: PublicKey;
  receiver: PublicKey;
  signature: string;
  sent: number;
  recv: number;
  date: Date;
};

export default function EmulateDevice() {
  const width = Dimensions.get("window").width;
  const [sound, setSound] = useState<Audio.Sound>();
  const { selectedAccount } = useAuthorization();
  const { config } = useConfig();
  const [network, setNetwork] = useState<Network>(config.network);
  const [txs, setTxs] = useState<TxDetails[]>([]);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const walletAddress =
    selectedAccount?.publicKey.toBase58() || config.walletAddress;

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sound/notify.mp3")
    );
    setSound(sound);
    setAnimationTrigger(true);
    await sound.playAsync();
    // sleep for a while
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setAnimationTrigger(false)
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!selectedAccount && config.walletAddress === "") return;

    const connection = new Connection(clusterApiUrl(network), "confirmed");
    const publicKey = new PublicKey(walletAddress);

    connection.onAccountChange(publicKey, (account) => {
      // get the last transaction
      connection
        .getConfirmedSignaturesForAddress2(publicKey, {
          limit: 1,
        })
        .then((result) => {
          connection
            .getParsedTransaction(result[0].signature, {
              commitment: "confirmed",
            })
            .then((result) => {
              const signature = result?.transaction.signatures[0];
              const sender = result?.transaction.message.accountKeys[0].pubkey;
              const receiver =
                result?.transaction.message.accountKeys[1].pubkey;
              const sent =
                ((result?.meta?.preBalances[0] ?? 0) -
                  (result?.meta?.postBalances[0] ?? 0)) /
                1e9;
              const recv =
                ((result?.meta?.postBalances[1] ?? 0) -
                  (result?.meta?.preBalances[1] ?? 0)) /
                1e9;

              if (!sender || !receiver || !signature) {
                return;
              }
              const date = new Date((result?.blockTime ?? 0) * 1000);
              const tx = { sender, receiver, sent, recv, signature, date };
              setTxs((txs) => {
                const alreadyExists = txs.some(
                  (t) => t.signature === signature
                );
                if (alreadyExists) {
                  return txs;
                }
                playSound();
                ToastAndroid.show(
                  `Received ${recv} sol from ${ellipsify(
                    sender.toBase58(),
                    5
                  )}`,
                  2000
                );
                return [tx, ...txs];
              });
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [network, selectedAccount]);

  if (!selectedAccount && config.walletAddress == "") {
    return <NotFound />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View marginHorizontal="auto">
        <View
          width="90%"
          marginTop="$3"
          aspectRatio={1}
          borderColor="$color"
          borderRadius={10}
          borderWidth="$1"
          justifyContent="center"
          alignItems="center"
          marginHorizontal="auto"
        >
          {animationTrigger && (
            <LinearGradient
              colors={["#9945FF", "#15F095"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: 10,
                zIndex: -1,
              }}
            ></LinearGradient>
          )}
          <QRCode value={`sol:${walletAddress}`} size={width * 0.8} />
        </View>
        <View
          width="90%"
          marginTop="$2"
          flexDirection="row"
          gap={5}
          alignItems="center"
          paddingTop="$3"
          paddingHorizontal="$1"
        >
          <Text fontSize="$5">Wallet address: </Text>
          <View
            flex={1}
            flexDirection="row"
            gap={5}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text color="$color075">
              {ellipsify(walletAddress, Math.floor(width / 40))}
            </Text>
            <ClipboardIcon
              size={15}
              onPress={() => copyToClipboard(walletAddress)}
            />
          </View>
        </View>
        <View>
          <SelectItems
            label={null}
            items={networkItems}
            onValueChange={(val) => setNetwork(val as Network)}
          />
        </View>
      </View>
      <Text fontSize="$6" marginVertical="$3" textAlign="center">
        {txs.length === 0 ? "No recent transactions" : "Recent transactions"}
      </Text>
      <ScrollView>
        <Accordion
          overflow="hidden"
          width="90%"
          gap="$2"
          marginHorizontal="auto"
          type="multiple"
          backgroundColor="$background"
          borderRadius="$5"
        >
          {txs
            .filter((tx) => tx.receiver.toBase58() == walletAddress)
            .map((tx) => {
              return (
                <Accordion.Item value={tx.signature} key={tx.signature}>
                  <Accordion.Trigger
                    flexDirection="row"
                    justifyContent="space-between"
                    borderWidth="$0"
                    borderRadius="$5"
                    backfaceVisibility="hidden"
                  >
                    {({ open }: { open: boolean }) => (
                      <>
                        <View width="80%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Text>{tx.date.toLocaleTimeString()}</Text>
                          <Text>Received: {tx.recv} sol</Text>
                        </View>
                        <Square
                          animation="quick"
                          rotate={open ? "180deg" : "0deg"}
                        >
                          <ChevronDown size="$1" />
                        </Square>
                      </>
                    )}
                  </Accordion.Trigger>
                  <Accordion.Content width="100%" borderRadius="$5">
                    <View
                      width="100%"
                      flexDirection="row"
                      gap={2}
                      alignItems="center"
                      paddingHorizontal="$1"
                      justifyContent="space-between"
                    >
                      <Text fontSize="$3">Sender address: </Text>
                      <View
                        width="100%"
                        flex={1}
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text color="$color075">
                          {ellipsify(
                            tx.sender.toBase58(),
                            Math.floor(width / 50)
                          )}
                        </Text>
                        <ClipboardIcon
                          size={15}
                          onPress={() => copyToClipboard(tx.sender.toBase58())}
                        />
                      </View>
                    </View>
                    <View
                      width="100%"
                      marginTop="$2"
                      flexDirection="row"
                      alignItems="center"
                      paddingHorizontal="$1"
                    >
                      <Text fontSize="$3">Signature: </Text>
                      <View
                        flex={1}
                        flexDirection="row"
                        gap={5}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text color="$color075">
                          {ellipsify(tx.signature, Math.floor(width / 40))}
                        </Text>
                        <ClipboardIcon
                          size={15}
                          onPress={() => copyToClipboard(tx.signature)}
                        />
                      </View>
                    </View>
                    <Text paddingVertical="$2" paddingHorizontal="$1" fontSize="$3">Date: {tx.date.toDateString()}</Text>
                    <Text paddingHorizontal="$1" fontSize="$3">Time: {tx.date.toTimeString()}</Text>
                  </Accordion.Content>
                  <Separator />
                </Accordion.Item>
              );
            })}
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}

const networkItems = [
  {
    label: "Main Network",
    value: "mainnet-beta",
  },
  {
    label: "Dev Network",
    value: "devnet",
  },
  {
    label: "Test Network",
    value: "testnet",
  },
];

const NotFound = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="$6" textAlign="center">
          Please connect your wallet
        </Text>
        <Text fontSize="$6" textAlign="center">
          Or
        </Text>
        <Text fontSize="$6" textAlign="center" maxWidth="$19">
          Enter your wallet address in
        </Text>
        <Link href="/(tabs)/" asChild>
          <Button
            fontSize="$6"
            marginTop="$2"
            backgroundColor="$color"
            color="$background"
          >
            Home screen
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
};
