import { Text, View, ScrollView, Image } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Wallet2,
} from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useContext, useState } from "react";
import ConfigContext from "../../context/config-context";
import ConfigForm from "../../components/config-form";

export default function Home() {
  const [bluetoothStatus, setBluetoothStatus] = useState<
    "off" | "connected" | "disconnected"
  >("off");
  const [walletStatus, setWalletStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const configObj = useContext(ConfigContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cardContainer}>
        <View style={styles.qrContainer}>
          {walletAddress !== "" ? (
            <QRCode value={walletAddress} size={200} />
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
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor:
                    bluetoothStatus === "connected"
                      ? "green"
                      : bluetoothStatus === "off"
                      ? "red"
                      : "gray",
                }}
              >
                {bluetoothStatus === "connected" ? (
                  <BluetoothConnected />
                ) : bluetoothStatus === "off" ? (
                  <BluetoothOff />
                ) : (
                  <Bluetooth />
                )}
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor:
                  walletStatus === "connected" ? "green" : "gray",
              }}
              onPress={() => setWalletAddress("idk man")}
            >
              <Wallet2 />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.qrCodeGenerateButton}>
            <Text>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.qrCodeGenerateButton}
            disabled={walletStatus === "disconnected"}
          >
            <Text>Generate QR code</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <ConfigForm />
      </ScrollView>
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
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
