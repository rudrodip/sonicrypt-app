import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { Home, Send, ClipboardPen, Settings2, Box } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
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
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <ClipboardPen color={color}>Report</ClipboardPen>,
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
        name="mock"
        options={{
          title: 'Mock',
          tabBarIcon: ({ color }) => <Box color={color}>Mock</Box>,
        }}
      />
    </Tabs>
  )
}
