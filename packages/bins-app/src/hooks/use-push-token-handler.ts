import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEnableNotifications } from './use-enable-notifications'
import { useHomeAddressId } from './use-home-addressId'
import { Platform } from 'react-native'

const namespace = 'binsapp'
const pushTokenKey = `${namespace}:pushToken2`

const getPushToken = async (): Promise<string | undefined> => (await AsyncStorage.getItem(pushTokenKey)) || undefined
export const persistPushToken = async (pushToken?: string) => {
  if (pushToken) {
    await AsyncStorage.setItem(pushTokenKey, pushToken)
  } else {
    await AsyncStorage.removeItem(pushTokenKey)
  }
}

export const getRemotePushToken = async (): Promise<string | undefined> => {
  const pushToken = await getPushToken()
  if (pushToken) {
    return pushToken
  }

  if (Platform.OS === 'web') {
    return undefined
  }

  const permission = await Notifications.getPermissionsAsync()
  if (permission.status !== 'granted') {
    return undefined
  }

  try {
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      experienceId: '@joshbalfour/bins',
    })
    await persistPushToken(expoPushToken.data)
    return expoPushToken.data
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const usePushTokenHandler = () => {
  const { homeAddressId } = useHomeAddressId()
  const { enableNotifications } = useEnableNotifications(homeAddressId)

  const callback = async () => {
    const token = await getRemotePushToken()
    if (token) {
      await enableNotifications(token)
    }
  }

  useEffect(() => {
    if (homeAddressId) {
      callback()
      const sub = Notifications.addPushTokenListener(callback)
      return () => {
        sub.remove()
      }
    }
  }, [homeAddressId])
}
