import { addInstagramSaveUnsaveListener } from './instagramServiceWorker'
import { addYoutubeLoadCompletionListener } from './youtubeServiceWorker'

addInstagramSaveUnsaveListener()
addYoutubeLoadCompletionListener()