/**
 * Image Upload Service using Cloudinary
 * 
 * To use this service, you need to:
 * 1. Create a free Cloudinary account at https://cloudinary.com
 * 2. Get your Cloud Name from the dashboard
 * 3. Create an unsigned upload preset:
 *    - Go to Settings > Upload > Upload presets
 *    - Click "Add upload preset"
 *    - Set "Signing Mode" to "Unsigned"
 *    - Save and copy the preset name
 * 4. Replace CLOUD_NAME and UPLOAD_PRESET below
 */

// Cloudinary configuration
const CLOUD_NAME = 'dbxtqignp';
const UPLOAD_PRESET = 'date-me-uploads'; // Create this preset in Cloudinary dashboard
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<Object>} Upload result with url and other metadata
 */
export const uploadImage = async (file, onProgress = null) => {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'date-me/profiles');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
          format: response.format
        });
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', CLOUDINARY_URL);
    xhr.send(formData);
  });
};

/**
 * Upload an image from a data URL (base64)
 * @param {string} dataUrl - Base64 encoded image data URL
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<Object>} Upload result
 */
export const uploadImageFromDataUrl = async (dataUrl, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'date-me/profiles');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
          format: response.format
        });
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', CLOUDINARY_URL);
    xhr.send(formData);
  });
};

/**
 * Create a preview URL for a file (for immediate display before upload)
 * @param {File} file - The image file
 * @returns {string} Object URL for preview
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a preview URL to free memory
 * @param {string} url - The object URL to revoke
 */
export const revokePreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Get optimized image URL from Cloudinary with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
export const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width = 400, height = 400, crop = 'fill', quality = 'auto' } = options;
  
  // Insert transformation parameters into URL
  const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_auto`;
  return url.replace('/upload/', `/upload/${transformations}/`);
};

export default {
  uploadImage,
  uploadImageFromDataUrl,
  createPreviewUrl,
  revokePreviewUrl,
  getOptimizedUrl
};

