(async (startPage = 0, autoClearConsole = true) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchWithTimeout = (resource, options = {}) => {
    const { timeout = 10000 } = options;
    return Promise.race([
      fetch(resource, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);
  };

  const callCacheApi = async (params = {}) => {
    const defaultParams = {
      page: 0,
      maxValuesPerFacet: 1000,
      hitsPerPage: 1000,
      attributesToRetrieve: ["id", "name"].join(","),
    };
    const fetchData = async () => {
      const response = await fetchWithTimeout("https://proxy-algolia-prod.quixel.com/algolia/cache", {
        headers: {
          "x-api-key": "2Zg8!d2WAHIUW?pCO28cVjfOt9seOWPx@2j",
        },
        body: JSON.stringify({
          url: "https://6UJ1I5A072-2.algolianet.com/1/indexes/assets/query?x-algolia-application-id=6UJ1I5A072&x-algolia-api-key=e93907f4f65fb1d9f813957bdc344892",
          params: new URLSearchParams({ ...defaultParams, ...params }).toString(),
        }),
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error fetching from Cache API: ${response.statusText}`);
      }

      return await response.json();
    };

    return await retryOperation(fetchData, 2000, 5);
  };

  const callAcl = async ({ id, name }) => {
    const fetchData = async () => {
      const response = await fetchWithTimeout("https://quixel.com/v1/acl", {
        headers: {
          authorization: "Bearer " + authToken,
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ assetID: id }),
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error adding item ${id} | ${name}: ${response.statusText}`);
      }

      const json = await response.json();
      if (json?.isError) {
        console.error(`  --> **Failed to add item** Item ${id} | ${name} (${json?.msg})`);
      } else {
        console.log(`  --> Added item ${id} | ${name}`);
      }
    };

    return await retryOperation(fetchData, 2000, 5);
  };

  const callAcquired = async () => {
    const fetchData = async () => {
      const response = await fetchWithTimeout("https://quixel.com/v1/assets/acquired", {
        headers: {
          authorization: "Bearer " + authToken,
          "content-type": "application/json;charset=UTF-8",
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error fetching acquired items: ${response.statusText}`);
      }

      return await response.json();
    };

    return await retryOperation(fetchData, 2000, 5);
  };

  const retryOperation = async (operation, delay, retries) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed (${error.message}). Retrying in ${delay}ms...`);
        await sleep(delay);
        delay *= 2; // Exponential backoff
      }
    }
    throw lastError;
  };

  let authToken = "";

  const initialize = async () => {
    console.log("-> Checking Auth API Token...");
    try {
      const authCookie = getCookie("auth") ?? "{}";
      authToken = JSON.parse(decodeURIComponent(authCookie))?.token;
      if (!authToken) {
        throw new Error("-> Error: Authentication token not found. Please log in again.");
      }
    } catch (_) {
      throw new Error("-> Error: Authentication token not found. Please log in again.");
    }

    console.log("-> Fetching acquired items...");
    acquiredItems = (await callAcquired()).map((a) => a.assetID);

    console.log("-> Fetching total number of pages...");
    const initialData = await callCacheApi();
    totalPages = initialData.nbPages;
    itemsPerPage = initialData.hitsPerPage;
    totalItems = initialData.nbHits;

    console.log("-> ==============================================");
    console.log(`-> Total items: ${totalItems}`);
    console.log(`-> ${totalPages} total pages with ${itemsPerPage} items per page`);
    console.log(`-> Total items to add: ${totalItems - acquiredItems.length}.`);
    console.log("-> ==============================================");

    if (!confirm(`Click OK to add ${totalItems - acquiredItems.length} items to your account.`)) {
      throw new Error("-> Process cancelled by user.");
    }
  };

  let acquiredItems = [];
  let totalPages = 0;
  let itemsPerPage = 0;
  let totalItems = 0;

  const MAX_CONCURRENT_REQUESTS = 5;

  const mainProcess = async () => {
    for (let pageIdx = startPage || 0; pageIdx < totalPages; pageIdx++) {
      console.log(`-> ======================= PAGE ${pageIdx + 1}/${totalPages} START =======================`);

      console.log("-> Fetching items from page " + (pageIdx + 1) + " ...");

      const pageData = await callCacheApi({ page: pageIdx });
      const items = pageData.hits;

      console.log("-> Adding unacquired items...");

      // Filter out already acquired items
      const unownedItems = items.filter((i) => !acquiredItems.includes(i.id));

      // Save current progress in localStorage
      localStorage.setItem('currentPage', pageIdx);

      // Limit concurrent requests
      const queue = [...unownedItems];
      const workers = Array.from({ length: MAX_CONCURRENT_REQUESTS }, async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          try {
            await callAcl(item);
          } catch (error) {
            console.error(`Error with item ${item.id}: ${error.message}`);
          }
        }
      });

      await Promise.all(workers);

      console.log(`-> ======================= PAGE ${pageIdx + 1}/${totalPages} COMPLETED =======================`);
      if (autoClearConsole) console.clear();
    }
  };

  const finalize = async () => {
    console.log("-> Fetching new acquisition info...");
    const newAcquiredItems = await callAcquired();
    const newItemsAcquired = newAcquiredItems.length;
    const newTotalCount = (await callCacheApi()).nbHits;

    console.log(`-> Completed. Your account now has a total of ${newItemsAcquired} out of ${newTotalCount} items.`);

    alert(`-> Your account now has a total of ${newItemsAcquired} out of ${newTotalCount} items.\n\nIf you find some items missing, try refreshing the page and run the script again.`);
  };

  try {
    // Check if progress was saved
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage !== null) {
      startPage = parseInt(savedPage, 10);
      console.log(`-> Resuming from page ${startPage + 1}`);
    }

    await initialize();
    await mainProcess();
    await finalize();

    // Clear progress
    localStorage.removeItem('currentPage');
  } catch (error) {
    console.error(error.message);
    console.log("-> The script could not be completed.");
  }
})();
