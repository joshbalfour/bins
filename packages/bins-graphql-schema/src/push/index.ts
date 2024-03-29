import { Expo, ExpoPushErrorReceipt, ExpoPushReceipt } from 'expo-server-sdk'
import { AppDataSource } from '../data-source'
import { Device } from '../entities/device'
import { Notification } from '../entities/notification'

const expo = new Expo()

export type PushNotification = {
  device: Device
  body: string
  title?: string
}

export const sendPushNotifications = async (notifications: PushNotification[]) => {
  const invalidDevices: Device[] = []

  const validNotifs = notifications.filter(({ device }) => {
    if (!Expo.isExpoPushToken(device.token)) {
      invalidDevices.push(device)
      return false
    }
    return true
  }).map(({ device, body, title }) => ({
    notif: {
      to: device.token,
      body,
      title,
    },
    device,
  }))

  await Promise.all(validNotifs.map(async ({ notif, device }) => {
    try {
      console.log('sending notification', JSON.stringify(notif))
      const [ticket] = await expo.sendPushNotificationsAsync([notif])
      if (ticket.status === 'ok') {
        console.log('sent notification', JSON.stringify(notif))
        const notificationRepository = AppDataSource.getRepository(Notification)
        await notificationRepository.save(
          notificationRepository.create({
            device,
            id: ticket.id,
          })
        )
        return
      }
      const error = ticket.details?.error
      if (error) {
        console.log('error sending notification', JSON.stringify(error))
        switch (error) {
          case 'DeviceNotRegistered':
            invalidDevices.push(device)
            break
          case 'InvalidCredentials':
            console.error('Invalid push credentials')
            break
          case 'MessageTooBig':
            console.error(`Push message too big ${JSON.stringify(notif)} to device ${device.id}`)
            break
          case 'MessageRateExceeded':
            console.error(`Push message rate exceeded ${JSON.stringify(notif)} to device ${device.id}`)
            break
        }
      }
    } catch (error) {
      console.error(`${error} sending push notification ${JSON.stringify(notif)} to device ${device.id}`)
    }
  }))

  await AppDataSource.getRepository(Device).remove(invalidDevices)
}

const receiptIsError = (obj: ExpoPushReceipt): obj is ExpoPushErrorReceipt => obj.status === 'error'

export const cleanNotifications = async () => {
  const notificationRepository = AppDataSource.getRepository(Notification)
  const notifications = await notificationRepository.find()
  const ticketIds = notifications.map(({ id }) => id)
  const ticketIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds)

  let allReceipts: {[id: string]: ExpoPushReceipt} = {}
  await Promise.all(ticketIdChunks.map(async (ticketIdChunk) => {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(ticketIdChunk)
      allReceipts = {
        ...allReceipts,
        ...receipts,
      }
    } catch (error) {
      console.error(`${error} getting push notification receipts ${JSON.stringify(ticketIdChunk)}`)
    }
  }))
 
  const invalidDevices: Device[] = []

  notifications.forEach(async (notification) => {
    const receipt = allReceipts[notification.id]
    if (receipt) {
      if (receiptIsError(receipt)) {
        if (receipt.details?.error) {
          switch (receipt.details.error) {
            case 'DeviceNotRegistered':
              invalidDevices.push(notification.device)
              break
            case 'InvalidCredentials':
              console.error('Invalid push credentials')
              break
            case 'MessageTooBig':
              console.error(`Push message too big ${JSON.stringify(notification)} to device ${notification.device.id}`)
              break
            case 'MessageRateExceeded':
              console.error(`Push message rate exceeded ${JSON.stringify(notification)} to device ${notification.device.id}`)
              break
          }
        }
        console.error(`error ${receipt.details?.error} sending push notification ${JSON.stringify(notification)}`)
      }
      await notificationRepository.remove(notification)
    }
  })

  await AppDataSource.getRepository(Device).remove(invalidDevices)
}
