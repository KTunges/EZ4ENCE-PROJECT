export const downloadReport = async (url, token, defaultFilename) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    // Try to get filename from Content-Disposition header
    const disposition = res.headers.get('Content-Disposition');
    let filename = defaultFilename || 'report.xlsx';
    
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error("Failed to download report:", error);
    window.toast.error("Có lỗi xảy ra khi tải báo cáo: " + error.message);
    throw error;
  }
};
