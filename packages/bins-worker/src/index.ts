import { initializeDataSource } from "@joshbalfour/bins-graphql-schema"
import { collectionNextDay } from "./jobs/collection-next-day"
import { updateAllData } from "./jobs/update-data"
import { processNotificationReceipts } from "./jobs/process-notification-receipts"

const isIt5pm = () => {
  const now = new Date()
  const isIt = now.getHours() === 17
  return isIt
}

const go = async () => {
  console.log('worker started')
  await updateAllData()
  await processNotificationReceipts()
  
  if (isIt5pm()) {
    await collectionNextDay()
  }
  console.log('worker finished')
}

const init = async () => {
  console.log('initialising data source')
  await initializeDataSource()
  console.log('done initialising data source')

  await go()
}

init().catch((e) => {
  console.error(e)
  process.exit(1)
})
