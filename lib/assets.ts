const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = 'assets';

/**
 * Generates a public URL for an asset stored in Supabase Storage.
 * 
 * @param path The relative path to the asset (e.g., 'images/food/dish.webp')
 * @returns The full public URL to the asset
 */
export function getAssetUrl(path: string | undefined | null) {
  if (!path) return '';
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}
