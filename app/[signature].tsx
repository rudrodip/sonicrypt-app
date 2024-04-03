import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { Progress, View } from "tamagui";
import { useState } from "react";

export default function Page() {
  const { signature, network } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  return (
    <View flex={1}>
      {!loaded && (
        <Progress value={progress} borderRadius={0} height="$0.5">
          <Progress.Indicator />
        </Progress>
      )}
      <WebView
        style={{
          flex: 1,
        }}
        source={{
          uri: `https://explorer.solana.com/tx/${signature}?cluster=${network}`,
        }}
        //@ts-ignore
        onLoadProgress={(event) =>
          setProgress(parseInt(event.nativeEvent.progress) * 100)
        }
        onLoadEnd={() => setLoaded(true)}
      />
    </View>
  );
}
