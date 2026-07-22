let addToastFunc = null;
let confirmFunc = null;

export const registerPopup = (toastFunc, confirmF) => {
  addToastFunc = toastFunc;
  confirmFunc = confirmF;
  
  // Gắn vào window để gọi từ bất kỳ đâu không cần hook
  window.toast = {
    success: (msg) => addToastFunc && addToastFunc(msg, 'success'),
    error: (msg) => addToastFunc && addToastFunc(msg, 'error'),
    info: (msg) => addToastFunc && addToastFunc(msg, 'info'),
    warning: (msg) => addToastFunc && addToastFunc(msg, 'warning'),
  };
  
  window.customConfirm = (msg) => {
    if (confirmFunc) return confirmFunc(msg);
    return Promise.resolve(window.confirm(msg)); // fallback
  };
};
