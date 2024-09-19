Script to add all items from quixel
As quixel is being removed, all items are free to aquire. This script is to automate the process to add items to your account (As of writing, a total of items)18874

Note: This script only tested in the latest version of Chrome.

How to use
Copy the script from below (run.js)
Login into https://quixel.com
Go to https://quixel.com/megascans/collections
Open devtools (F12) -> Go to "Console" tab
Paste in the script and press .Enter
A dialog should popup confirming the execution, click "OK"
Sit back and wait
Common issues
Getting "Forbidden" error. (Even after refresh, the whole page just shows "Forbidden")
There is a chance that the API adding too fast and you hit the rate limit of the API. (My testing is around after 10 pages, so ~10k items).
Wait after ~10-20 minutes and continue. See to continue the execution after you can load https://quixel.com.Common Fixes -> Restart script
The script seems to be paused/hang
It could be too much logging going it. Try monitor the script, if it says "END PAGE X", note the page number down (in case need restart) and clear the console by clicking the "🚫" icon in devtools.
See for fixing.Common Fixes -> Restart script
Getting the error **UNABLE TO ADD ITEM**
There should have the error message shown in . If it is , then its already in your account.( )user already owns specified asset at a higher or equal resolution
Getting the error cannot find authentication token. Please login again
Clear browser cookies and re-login quixel again. Try just simply add 1 item manully. If it success, then see for continue the execution.Common Fixes -> Restart script
Common Fixes
Restart Script
Note which page it was running
Copy the scriptrun.js
Update the on the first line to (assuming page 10 was hanged)startPage = 0startPage = 10
Change Log
Initial Script launch
Update to clear logs to reduce chance of hanging
[CURRENT] Skip adding items that already was acquired. Reduced logs. Added more info after script completion to show purchased item count. Due to now skipping purchased items, you technically don't need to specify the anymore.startPage
