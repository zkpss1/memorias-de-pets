import QRCode from 'qrcode.react';

/**
 * Generates a URL for the pet visualization page based on the pet ID
 * @param petId - The unique identifier for the pet
 * @returns The full URL to the pet's visualization page
 */
export const generatePetVisualizationUrl = (petId: string): string => {
  // Use the window.location.origin to get the base URL of the application
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/visualizar/${petId}`;
};

/**
 * Downloads the QR code as an image
 * @param elementId - The ID of the QR code canvas element
 * @param petName - The name of the pet (used for the filename)
 */
export const downloadQRCode = (elementId: string, petName: string): void => {
  const canvas = document.getElementById(elementId) as HTMLCanvasElement;
  if (canvas) {
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${petName.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};
