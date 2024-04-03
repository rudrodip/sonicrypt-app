import { Text, View, ScrollView, Image, Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Wallet2,
  QrCode,
  RefreshCcw,
} from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useState } from "react";
import { useConfig } from "../../context/config-context";
import ConfigForm from "../../components/config-form";
import { useAuthorization } from "../../utils/useAuthorization";
import WalletConnectButton from "../../components/wallet-connect-button";

export default function Home() {
  const { selectedAccount } = useAuthorization();
  const [tempWalletAddress, setTempWalletAddress] = useState(
    selectedAccount?.address || ""
  );
  const { config, setConfig } = useConfig();
  const bluetoothStatus = config.bleStatus;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cardContainer}>
        <View style={styles.qrContainer} backgroundColor="white" borderRadius="$5">
          {tempWalletAddress !== "" ? (
            <QRCode
              value={
                `sol:${selectedAccount?.publicKey.toBase58()}` ||
                `sol:${tempWalletAddress}`
              }
              size={200}
            />
          ) : (
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View
            style={{
              display: "flex",
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Link href="/bluetooth-modal" asChild>
              <Button
                style={styles.button}
                backgroundColor={
                  bluetoothStatus === "connected"
                    ? "$color"
                    : bluetoothStatus === "off"
                    ? "$background"
                    : "$backgroundHover"
                }
              >
                {bluetoothStatus === "connected" ? (
                  <BluetoothConnected color="$background" />
                ) : bluetoothStatus === "off" ? (
                  <BluetoothOff color="$color" />
                ) : (
                  <Bluetooth color="$color" />
                )}
              </Button>
            </Link>
            <WalletConnectButton />
          </View>
          <Button style={styles.qrCodeGenerateButton} disabled>
            <View display="flex" alignItems="flex-end" gap={5}>
              <Text fontSize="$2">
                BLE{" "}
                {bluetoothStatus != "connected" ? "disconnected" : "connected"}
              </Text>
              <Text fontSize="$2">
                {selectedAccount ? "Wallet connected" : "Connect wallet"}
              </Text>
            </View>
          </Button>
          <Button
            style={styles.qrCodeGenerateButton}
            onPress={() =>
              setTempWalletAddress(selectedAccount?.publicKey.toBase58() || "")
            }
          >
            <View
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={5}
            >
              <Text>Update QR</Text>
              <QrCode size={20} />
            </View>
          </Button>
        </View>
      </View>
      <View flex={1} display="flex" justifyContent="center" alignItems="center">
        <ConfigForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    aspectRatio: 1.5,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  qrContainer: {
    height: "85%",
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "45%",
    height: "85%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  button: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodeGenerateButton: {
    width: "90%",
    height: "30%",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
