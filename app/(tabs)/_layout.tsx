import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { Home, Send, Settings2, Box } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.val,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 60,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color}>Home</Home>,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Send color={color}>Transactions</Send>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings2 color={color}>Settings</Settings2>,
        }}
      />
      <Tabs.Screen
        name="emulate"
        options={{
          headerShown: false,
          title: "Emulator",
          tabBarIcon: ({ color }) => <Box color={color}>Emulate</Box>,
        }}
      />
    </Tabs>
  )
}
