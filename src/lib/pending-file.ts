/**
 * 跨页面暂存待处理的文件。
 *
 * sessionStorage 存不了 File —— 一个 20MB 的 PDF 转成 base64 会涨到 27MB，
 * 远超它几 MB 的上限。IndexedDB 能直接存二进制对象，所以文件走这条路，
 * 链接和正文走 sessionStorage。
 *
 * 两个场景共用：未登录时先存下来去登录，以及落地页收下文件后交给工作台。
 */

const DB_NAME = 'mindmapany-pending-input';
const STORE_NAME = 'files';
const PENDING_PDF_KEY = 'pdf-landing-upload';


function openPendingDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePendingPdf(file: File): Promise<void> {
  const db = await openPendingDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(file, PENDING_PDF_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

export async function takePendingPdf(): Promise<File | null> {
  const db = await openPendingDb();
  const file = await new Promise<File | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(PENDING_PDF_KEY);
    request.onsuccess = () => {
      const result = request.result;
      store.delete(PENDING_PDF_KEY);
      resolve(result instanceof File ? result : null);
    };
    request.onerror = () => reject(request.error);
  });
  db.close();
  return file;
}
