import { Link, Tabs } from 'expo-router'
import { Button } from 'tamagui'
import { Home, Send, ClipboardPen, Settings2, Box, Wallet } from '@tamagui/lucide-icons'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color}>Home</Home>,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button icon={Wallet} style={{marginRight: 5}}>Connect wallet</Button>
            </Link>
          ),
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
