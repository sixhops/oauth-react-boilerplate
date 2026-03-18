// From https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2
// By https://gist.github.com/gauravtiwari
// Also, from this article: https://medium.com/front-end-weekly/use-github-oauth-as-your-sso-seamlessly-with-react-3e2e3b358fa1

import {IUser} from './App'

function openNewAuthWindow(myUrl: string): Promise<IUser> {
  // Open the new window to our Github login page
  const authWindow: Window = window.open(myUrl, '_blank') as Window;

  // Listen for messages from the window we just opened
  const authPromise: Promise<IUser> = new Promise((resolve, reject) => {
    // Add listener on original window for a message from the 2nd
    window.addEventListener('message', (msg) => {
      // Reject if not from our domain
      if (!msg.origin.includes(`${window.location.protocol}//${window.location.host}`)) {
        authWindow.close();
        reject('Not allowed')
      }
      // Try several ways to resolve the promise with the data
      if (msg.data.payload) {
        try {
          resolve(JSON.parse(msg.data.payload))
        }
        catch(e) {
          resolve(msg.data.payload)
        }
        finally {
          authWindow.close()
        }
      } else {
        // If no message present, reject
        authWindow.close();
        reject('Unauthorized')
      }
    }, false)
  })
  return authPromise
}

export default openNewAuthWindow;