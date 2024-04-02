import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConfigProvider } from "../context/config-context";
import { ToastProvider } from "@tamagui/toast";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import "../tamagui-web.css";

import { config } from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ConfigProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme ? colorScheme : "light"}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <ToastProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarHidden: true }} />
                <Stack.Screen
                  name="bluetooth-modal"
                  options={{
                    presentation: "modal",
                    headerTitle: "Connect to device",
                  }}
                />
                <Stack.Screen
                  name="[signature]"
                  options={{
                    headerTitle: "Transaction details",
                  }}
                />
              </Stack>
            </ToastProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </ConfigProvider>
    </SafeAreaProvider>
  );
}
