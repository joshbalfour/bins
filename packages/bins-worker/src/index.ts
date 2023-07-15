import { initializeDataSource } from "@joshbalfour/bins-graphql-schema"
import { collectionNextDay } from "./jobs/collection-next-day"
import { updateAllData } from "./jobs/update-data"
import { processNotificationReceipts } from "./jobs/process-notification-receipts"

const go = async () => {
  console.log('data update worker started')
  await updateAllData()
  await processNotificationReceipts()
  console.log('data update worker finished')
}

const init = async () => {
  console.log('initialising data source')
  await initializeDataSource()
  console.log('done initialising data source')

  if (process.argv[2] === '--next-day') {
    console.log('next collection day check started')
    await collectionNextDay()
    console.log('next collection day check finished')
  } else {
    await go()
  }
  process.exit(0)
}

init().catch((e) => {
  console.error(e)
  process.exit(1)
})
